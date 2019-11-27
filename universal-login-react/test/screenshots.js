const puppeteer = require('puppeteer');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // it's best to avoid sleep, and use waitFor instead
const headless = true; // use false for debugging/developing
let page;

const react = async () => {
  await page.goto('http://0.0.0.0:8080/', {waitUntil: 'domcontentloaded'});
  return {
    onboarding: async () => page.click('[href="/onboarding"]', {waitUntil: 'domcontentloaded'}),
    u: async () => {
      await page.click('[href="/logobutton"]', {waitUntil: 'domcontentloaded'});
      await page.click('#random-instance-button', {waitForFunction: 'domcontentloaded'});
      await page.waitForFunction('document.querySelector("button.udashboard-logo-btn") !== null');
      return {
        funds: async () => {
          await page.click('button.udashboard-logo-btn', {waitForFunction: 'domcontentloaded'});
          return {
            send: async () => page.click('button.funds-send', {waitForFunction: 'domcontentloaded'}),
          };
        },
        devices: async () => {
          await page.click('button.udashboard-logo-btn', {waitForFunction: 'domcontentloaded'});
          await page.click('a.udashboard-tab-devices', {waitForFunction: 'domcontentloaded'});
          await sleep(1000);
        },
        backup: async () => {
          await page.click('button.udashboard-logo-btn', {waitForFunction: 'domcontentloaded'});
          await page.click('a.udashboard-tab-backup', {waitForFunction: 'domcontentloaded'});
          await sleep(1000);
          return {
            generate: async () => {
              await page.click('button.backup-btn', {waitForFunction: 'domcontentloaded'});
              await page.waitForFunction('document.querySelector("button.backup-print-btn") !== null');
            },
          };
        },
      };
    },
    wallet: async () => page.click('[href="/walletselector"]', {waitUntil: 'domcontentloaded'}),
    keyboard: async () => page.click('[href="/keyboard"]', {waitUntil: 'domcontentloaded'}),
    topup: async () => {
      await page.click('[href="/topUp"]', {waitUntil: 'domcontentloaded'});
      await page.click('button#show-topup-button-0', {waitUntil: 'domcontentloaded'});
      return {
        crypto: async () => page.click('label#topup-btn-crypto', {waitForFunction: 'domcontentloaded'}),
        fiat: async () => page.click('label#topup-btn-fiat', {waitForFunction: 'domcontentloaded'}),
      };
    },
    recover: async () => page.click('[href="/recover"]', {waitUntil: 'domcontentloaded'}),
    settings: async () => page.click('[href="/settings"]', {waitUntil: 'domcontentloaded'}),
  };
};

const ss = async (name) => page.screenshot({path: `screenshots/${name}`}); ;

const main = async () => {
  const browser = await puppeteer.launch({headless});
  page = await browser.newPage();
  page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
  });

  await react(page);
  await ss('1-home.png');

  await (await react()).onboarding();
  await ss('2-onboarding.png');

  await (await react()).u();
  await ss('3.1-u.png');

  await (await (await react()).u()).funds();
  await ss('3.2-u-funds.png');

  await (await (await (await react()).u()).funds()).send();
  await ss('3.3-u-funds-send.png');

  await (await (await react()).u()).devices();
  await ss('3.4-u-devices.png');

  await (await (await react()).u()).backup();
  await ss('3.5-u-backup.png');

  await (await (await (await react()).u()).backup()).generate();
  await ss('3.6-u-backup-generate.png');

  await (await react()).wallet();
  await ss('4-walletselector.png');

  await (await react()).keyboard();
  await ss('5-keyboard.png');

  await (await react()).topup();
  await ss('6.1-topup.png');

  await (await (await react()).topup()).crypto();
  await ss('6.2-topup-crypto.png');

  await (await (await react()).topup()).fiat();
  await ss('6.2-topup-fiat.png');

  await (await react()).recover();
  await ss('7-recover.png');

  await (await react()).settings();
  await ss('8-settings.png');

  await browser.close();
};

() => console.log('Starting screenshots');
main()
  .then(() => console.log('Screenshots finished'))
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
