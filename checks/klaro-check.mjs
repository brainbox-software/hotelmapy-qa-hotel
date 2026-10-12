// Accepts in Klaro and checks the map fills its div.
// node checks/klaro-check.mjs <site> <app> <map>
import { chromium } from "@playwright/test";

const [site, app, map] = process.argv.slice(2);
const browser = await chromium.launch({ chromiumSandbox: false, executablePath: process.env.CHROME_PATH });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(site + "/consent-tool.html?app=" + app + "&map=" + map + "&lang=de");
console.log("frames before:", await page.locator("iframe.hotelmapy").count());
await page.getByRole("button", { name: "Das ist ok" }).click();
await page.waitForTimeout(5000);
console.log("frames in the div after accept:", await page.locator("[data-hotelmapy-embed] iframe").count());
await page.reload();
await page.waitForTimeout(5000);
console.log("frames in the div after reload:", await page.locator("[data-hotelmapy-embed] iframe").count());
await browser.close();
