import puppeteer from 'puppeteer-core';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, '')), '..', 'public');

const SHOTS = [
  { file: 'p1.png', url: 'https://traxus-steel.vercel.app/' },
  { file: 'p2.png', url: 'https://trend-crm-erp.vercel.app/' },
  { file: 'p3.png', url: 'https://taskflow-eight-blond.vercel.app/' },
  { file: 'p4.png', url: 'https://teamflow-navy.vercel.app/' },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
  defaultViewport: { width: 1600, height: 1000, deviceScaleFactor: 1 },
});

for (const { file, url } of SHOTS) {
  const page = await browser.newPage();
  console.log(`>> ${file} <- ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  } catch (e) {
    console.log(`  warn: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 2500));
  const out = path.join(OUT, file);
  await page.screenshot({ path: out, type: 'png', fullPage: false });
  console.log(`  saved ${out}`);
  await page.close();
}

await browser.close();
console.log('done');
