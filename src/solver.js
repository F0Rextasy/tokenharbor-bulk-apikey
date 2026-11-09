'use strict';
/*
 * solver.js — the browser half of the mint (only used when the panel asks for a
 * human check on the signup form).
 *
 * The widget is a Cloudflare Turnstile checkbox. A real browser, a real mouse and
 * the page's own state are what make it pass — nothing is pasted and no captcha
 * service is called.
 *
 * Chrome comes from `puppeteer-core` + the Chrome already installed on the machine
 * (`channel: 'chrome'`); `--enable-automation`, which puppeteer adds by default and
 * which Turnstile reads first, is suppressed on purpose.
 */
const BASE = 'https://tokenharbor.ai';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function launchBrowser({ px = null, headless = false } = {}) {
  const puppeteer = require('puppeteer-core');
  const args = ['--no-first-run', '--no-default-browser-check', '--window-size=1280,900', '--lang=en-US', '--mute-audio'];
  if (px) {
    const scheme = px.protocol && px.protocol.startsWith('socks') ? 'socks5' : 'http';
    args.push(`--proxy-server=${scheme}://${px.host}:${px.port}`);
  }
  const options = { headless, args, ignoreDefaultArgs: ['--enable-automation'], defaultViewport: null };
  return puppeteer
    .launch({ ...options, channel: 'chrome' })
    .catch(() => puppeteer.launch(options))
    .catch((e) => {
      throw new Error(
        `could not start Chrome (${e.message}). Install Chrome, or run: npx puppeteer browsers install chrome`
      );
    });
}

async function proxyAuth(page, px) {
  if (!px || !px.username) return;
  const cdp = await page.target().createCDPSession();
  await cdp.send('Fetch.enable', { handleAuthRequests: true });
  cdp.on('Fetch.authRequired', async (e) => {
    await cdp
      .send('Fetch.continueWithAuth', {
        requestId: e.requestId,
        authChallengeResponse: { response: 'ProvideCredentials', username: px.username, password: px.password || '' },
      })
      .catch(() => {});
  });
}

/** Click inside the Turnstile iframe with a real mouse until the token appears. */
async function solveTurnstile(page, log, { tries = 5, waitMs = 12000 } = {}) {
  const tokenOf = async () => {
    const v = await page
      .evaluate(() => {
        const el = document.querySelector('input[name="cf-turnstile-response"]');
        return el ? el.value : '';
      })
      .catch(() => '');
    return String(v || '');
  };
  for (let attempt = 1; attempt <= tries; attempt++) {
    let token = await tokenOf();
    if (token && token.length > 20) return token;
    // The widget can be inline (no OOPIF) — click the container's checkbox spot.
    const hostBox = await page
      .evaluate(() => {
        const el = document.querySelector('.cf-turnstile, [data-sitekey]');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return r.width > 0 ? { x: r.x, y: r.y, w: r.width, h: r.height } : null;
      })
      .catch(() => null);
    if (hostBox) {
      const x = hostBox.x + Math.min(30, hostBox.w / 2);
      const y = hostBox.y + hostBox.h / 2;
      await page.mouse.move(x - 4, y - 3);
      await sleep(40 + Math.random() * 90);
      await page.mouse.click(x, y);
      log && log(`   turnstile container click #${attempt} @ ${Math.round(x)},${Math.round(y)}`);
    }
    const frames = page.frames().filter((f) => /challenges\.cloudflare\.com/.test(f.url()));
    for (const f of frames) {
      try {
        const box = await f.evaluate(() => {
          const el = document.querySelector('input[type=checkbox]') || document.body;
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        });
        if (box && box.w > 0) {
          // The iframe's own coordinate space is offset from the page; ask the page
          // where the widget sits and click the same relative point.
          const host = await page.evaluate(() => {
            const ifr = [...document.querySelectorAll('iframe')].find((i) => /challenges\.cloudflare\.com/.test(i.src || ''));
            if (!ifr) return null;
            const r = ifr.getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height };
          });
          if (host) {
            const x = host.x + Math.min(box.x + box.w / 2, host.w - 4);
            const y = host.y + Math.min(box.y + box.h / 2, host.h - 4);
            await page.mouse.move(x - 3, y - 2);
            await sleep(40 + Math.random() * 90);
            await page.mouse.click(x, y);
            log && log(`   turnstile click #${attempt} @ ${Math.round(x)},${Math.round(y)}`);
          }
        }
      } catch (e) {
        /* frame not ready */
      }
    }
    const t0 = Date.now();
    while (Date.now() - t0 < waitMs) {
      token = await tokenOf();
      if (token && token.length > 20) return token;
      await sleep(700);
    }
  }
  return '';
}

/**
 * Fill the signup form in a real browser, press the button, and let the page mint
 * both the captcha token and the session. Returns the session cookies.
 */
async function signupInBrowser({ px = null, email, password, log = () => {}, headless = false }) {
  const browser = await launchBrowser({ px, headless });
  try {
    const page = await browser.newPage();
    await proxyAuth(page, px);
    try {
      await page.goto(`${BASE}/signup`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    } catch (e) {
      return { ok: false, why: `browser could not load the page (${String(e.message).slice(0, 60)})` };
    }
    await page
      .waitForSelector('input[name="email"]', { timeout: 60000 })
      .catch(() => {});
    // Cookie banner sits over the form.
    await page
      .evaluate(() => {
        const b = [...document.querySelectorAll('button')].find((x) => /essential only|accept analytics/i.test(x.innerText || ''));
        if (b) b.click();
      })
      .catch(() => {});
    await sleep(400);
    await page.click('input[name="email"]').catch(() => {});
    await page.type('input[name="email"]', email, { delay: 40 + Math.random() * 60 }).catch(() => {});
    await page.click('input[name="password"]').catch(() => {});
    await page.type('input[name="password"]', password, { delay: 40 + Math.random() * 60 }).catch(() => {});
    await sleep(500);
    const press = async () => {
      const el = await page.$('button[type="submit"]').catch(() => null);
      if (el) return el.click().catch(() => {});
      await page
        .evaluate(() => {
          const b = [...document.querySelectorAll('button')].find((x) => /create account/i.test(x.innerText || ''));
          if (b) b.click();
        })
        .catch(() => {});
    };
    await press();
    let left = false;
    for (let i = 0; i < 20 && !left; i++) {
      await sleep(1500);
      left = await page.evaluate(() => !/mode=signup/.test(location.href)).catch(() => false);
    }
    if (!left) {
      const token = await solveTurnstile(page, log);
      if (!token) {
        const diag = await page.evaluate(() => ({ widget: !!document.querySelector('.cf-turnstile, [data-sitekey]'), frames: [...document.querySelectorAll('iframe')].map((i) => i.src).filter((s) => /cloudflare/.test(s)).length })).catch(() => ({}));
        return { ok: false, why: `turnstile token never appeared (widget=${diag.widget} cfFrames=${diag.frames})` };
      }
      log && log(`   turnstile token ${token.length} chars`);
      await press();
      for (let i = 0; i < 20 && !left; i++) {
        await sleep(1500);
        left = await page.evaluate(() => !/mode=signup/.test(location.href)).catch(() => false);
      }
    }
    const cookies = await page.cookies();
    const text = await page.evaluate(() => document.body.innerText.slice(0, 300)).catch(() => '');
    return { ok: left, why: left ? '' : String(text).replace(/\s+/g, ' ').slice(0, 120), cookies };
  } finally {
    await browser.close().catch(() => {});
  }
}

module.exports = { launchBrowser, solveTurnstile, signupInBrowser };
