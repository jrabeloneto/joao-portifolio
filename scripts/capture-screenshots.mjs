// Run once: node scripts/capture-screenshots.mjs
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = 'public/assets/projects';

const projects = [
  { slug: 'traxus', url: 'https://traxus-steel.vercel.app/' },
  { slug: 'taskflow', url: 'https://taskflow-eight-blond.vercel.app/' },
  { slug: 'eventhub', url: 'https://eventhub-2t38ukdu0-jrabelonetos-projects.vercel.app/dashboard' },
  { slug: 'teamflow', url: 'https://teamflow-navy.vercel.app/' },
  { slug: 'trend-crm-erp', url: 'https://trend-crm-erp.vercel.app/' },
  { slug: 'bradesco-redesign', url: 'https://bradesco-app-redesign.vercel.app/' },
  { slug: 'techstore-v2', url: 'https://techstore-v2-85tz.vercel.app/' },
  { slug: 'redesign-craigslist', url: 'https://redesing-craiglist.vercel.app/' },
];

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const p of projects) {
  console.log(`Capturing ${p.slug}...`);
  const page = await context.newPage();
  try {
    await page.goto(p.url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(3500);
    const buf = await page.screenshot({ type: 'jpeg', quality: 85, fullPage: false });
    await fs.writeFile(path.join(OUT, `${p.slug}.jpg`), buf);
    console.log(`  OK ${p.slug}.jpg (${(buf.length / 1024).toFixed(0)}kb)`);
  } catch (e) {
    console.warn(`  FAIL ${p.slug}: ${e.message}`);
  }
  await page.close();
}

await browser.close();
console.log('Done.');
