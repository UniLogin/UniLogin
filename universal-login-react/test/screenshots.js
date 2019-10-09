const puppeteer = require('puppeteer');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // it's best to avoid sleep, and use waitFor instead
const headless = true; // use false for debugging/developing

const main = async () => {
  const browser = await puppeteer.launch({headless});
  const page = await browser.newPage();
  page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 1
  });
  await page.goto('http://0.0.0.0:8080/', {waitUntil: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/1-home.png'});

  await page.click('[href="/onboarding"]', {waitUntil: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/2-onboarding.png'});

  await page.click('[href="/logobutton"]', {waitUntil: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/3.1-u.png'});

  await page.click('#random-instance-button', {waitForFunction: 'domcontentloaded'});
  await page.waitForFunction('document.querySelector("button.udashboard-logo-btn") !== null');
  await page.screenshot({path: 'screenshots/3.2-u.png'});

  await page.click('button.udashboard-logo-btn', {waitForFunction: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/3.3.1-u-funds.png'});

  await page.click('button.funds-topup', {waitForFunction: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/3.3.2-u-funds-topup.png'});

  await page.click('label#topup-btn-crypto', {waitForFunction: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/3.3.2.1-u-funds-crypto.png'});

  await page.click('label#topup-btn-fiat', {waitForFunction: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/3.3.2.2-u-funds-fiat.png'});

  await page.goto('http://0.0.0.0:8080/', {waitUntil: 'domcontentloaded'});
  await page.click('[href="/logobutton"]', {waitUntil: 'domcontentloaded'});
  await page.click('#random-instance-button', {waitForFunction: 'domcontentloaded'});
  await page.waitForFunction('document.querySelector("button.udashboard-logo-btn") !== null');
  await page.click('button.udashboard-logo-btn', {waitForFunction: 'domcontentloaded'});
  await page.click('button.funds-send', {waitForFunction: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/3.3.3-u-funds-send.png'});

  await page.goto('http://0.0.0.0:8080/', {waitUntil: 'domcontentloaded'});
  await page.click('[href="/logobutton"]', {waitUntil: 'domcontentloaded'});
  await page.click('#random-instance-button', {waitForFunction: 'domcontentloaded'});
  await page.waitForFunction('document.querySelector("button.udashboard-logo-btn") !== null');
  await page.click('button.udashboard-logo-btn', {waitForFunction: 'domcontentloaded'});
  await page.click('button.udashboard-tab-devices', {waitForFunction: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/3.4-u-devices.png'});

  await page.click('button.udashboard-tab-backup', {waitForFunction: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/3.5.1-u-backup.png.png'});
  await page.click('button.backup-btn', {waitForFunction: 'domcontentloaded'})
  await page.waitForFunction('document.querySelector("button.backup-print-btn") !== null');
  await page.screenshot({path: 'screenshots/3.5.2-u-backup-codes.png'});

  await page.goto('http://0.0.0.0:8080/', {waitUntil: 'domcontentloaded'});
  await page.click('[href="/walletselector"]', {waitUntil: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/4-walletselector.png'});

  await page.click('[href="/keyboard"]', {waitUntil: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/5-keyboard.png'});

  await page.click('[href="/topup"]', {waitUntil: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/6-topup.png'});

  await page.click('[href="/recover"]', {waitUntil: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/7-recover.png'});

  await page.click('[href="/settings"]', {waitUntil: 'domcontentloaded'});
  await page.screenshot({path: 'screenshots/8-settings.png'});

  await browser.close();
};

main()
  .then(() => console.log('Screenshots finished'))
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
