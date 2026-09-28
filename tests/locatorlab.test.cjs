const {test, after} = require('node:test');
const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const path = require('node:path');
const {chromium} = require('playwright');

let browser;
async function openApp() {
  browser ??= await chromium.launch({headless: true, ...(process.env.CHROME_EXECUTABLE ? {executablePath: process.env.CHROME_EXECUTABLE} : {})});
  const page = await browser.newPage();
  await page.addInitScript(() => {
    window.CodeMirror = {fromTextArea: () => ({setValue() {}, refresh() {}, getDoc: () => ({lineCount: () => 0}), removeLineClass() {}, setOption() {}})};
  });
  await page.route('https://cdnjs.cloudflare.com/**', route => route.abort());
  await page.goto(pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href);
  return page;
}
after(async () => { await browser?.close(); });

test('a second upload replaces the document used by CSS and XPath searches', async () => {
  const page = await openApp();
  await page.locator('#file-upload').setInputFiles({name: 'first.html', mimeType: 'text/html', buffer: Buffer.from('<div class="first">first</div>')});
  await page.locator('#css-input').fill('.first');
  await page.waitForFunction(() => document.querySelector('.hit-count').textContent === '1');
  await page.locator('#file-upload').setInputFiles({name: 'second.html', mimeType: 'text/html', buffer: Buffer.from('<div class="second">second</div>')});
  await page.locator('#css-input').fill('.second');
  await page.waitForTimeout(400);
  assert.equal(await page.locator('.hit-count').textContent(), '1');
  assert.match(await page.locator('#result-list').innerText(), /second/);
  await page.locator('#xpath-input').fill('//div[@class="first"]');
  await page.waitForTimeout(400);
  assert.equal(await page.locator('.hit-count').textContent(), '0');
  await page.close();
});

test('visual preview does not request remote resources embedded in pasted HTML', async () => {
  const page = await openApp();
  const networkAttempts = [];
  await page.route('https://example.com/tracker**', route => {
    networkAttempts.push(route.request().url());
    return route.abort();
  });
  await page.locator('#raw-input').fill('<link rel="stylesheet" href="https://example.com/tracker.css"><style>body{background:url(https://example.com/tracker-bg.png)}</style><img src="https://example.com/tracker.png">');
  await page.locator('#btn-preview').click();
  await page.locator('#preview-frame').contentFrame().locator('img').waitFor();
  await page.waitForTimeout(250);
  assert.deepEqual(networkAttempts, []);
  await page.close();
});

test('role suggestions use an input label instead of its current value', async () => {
  const page = await openApp();
  await page.locator('#raw-input').fill('<label for="email">Email address</label><input id="email" value="private@example.com">');
  const snippet = await page.evaluate(() => {
    ensureCurrentDocument();
    const node = currentDoc.querySelector('#email');
    return buildPlaywrightRecommendation(node, 0, 1, '#email', '').role;
  });
  assert.equal(snippet, 'page.get_by_role("textbox", name="Email address")');
  await page.close();
});
