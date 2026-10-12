// Opens every page of the dummy site and screenshots it.
// node checks/shoot.mjs <site> <app> <map> <outDir>
import { chromium } from "@playwright/test";

const [site, app, map, outDir] = process.argv.slice(2);
const PAGES = ["index", "script-tag", "container", "consent-tool", "cookiebot", "click-to-load", "iframe", "legacy"];

const browser = await chromium.launch({ chromiumSandbox: false, executablePath: process.env.CHROME_PATH });

async function shoot(name, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  await page.goto(site + "/" + name + ".html?app=" + app + "&map=" + map + "&lang=de");
  await page.waitForTimeout(6000);
  const frames = await page.locator("iframe.hotelmapy, iframe[src*='" + map + "']").count();
  await page.screenshot({ path: outDir + "/" + name + "-" + width + ".png", fullPage: true });
  console.log(name, width, "frames=" + frames, errors.length ? "errors=" + JSON.stringify(errors) : "");
  await page.close();
}

for (const name of PAGES) {
  await shoot(name, 1280);
  await shoot(name, 390);
}

await browser.close();
