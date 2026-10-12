// Denies in Cookiebot, then allows via "Cookie settings", and checks the map
// fills its div only once marketing cookies are allowed.
// node checks/cookiebot-check.mjs <site> <app> <map> [outDir]
import { chromium } from "@playwright/test";

const [site, app, map, outDir] = process.argv.slice(2);
const browser = await chromium.launch({ chromiumSandbox: false, executablePath: process.env.CHROME_PATH });

function frames(page) {
  return page.locator("[data-hotelmapy-embed] iframe").count();
}

async function check(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(site + "/cookiebot.html?app=" + app + "&map=" + map + "&lang=de");
  const deny = page.locator("#CybotCookiebotDialogBodyButtonDecline");
  await deny.waitFor({ timeout: 15000 });
  if (outDir) await page.screenshot({ path: outDir + "/cookiebot-banner-" + width + ".png" });
  console.log(width, "before consent:", await frames(page));
  await deny.click();
  await page.waitForTimeout(3000);
  console.log(width, "after deny:", await frames(page));
  await page.getByRole("button", { name: "Cookie settings", exact: true }).click();
  await page.locator("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll").click();
  await page.waitForTimeout(5000);
  console.log(width, "after allow:", await frames(page));
  await page.reload();
  await page.waitForTimeout(5000);
  console.log(width, "after reload:", await frames(page));
  if (outDir) await page.screenshot({ path: outDir + "/cookiebot-allowed-" + width + ".png", fullPage: true });
  await page.close();
}

await check(1280);
await check(390);
await browser.close();
