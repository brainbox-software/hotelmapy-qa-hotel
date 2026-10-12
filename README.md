# Hotel Seeblick (QA dummy hotel site)

A made-up hotel on a third-party origin for Hotelmapy's go-live test campaigns ([brainbox-software/hotelmapy-next#638](https://github.com/brainbox-software/hotelmapy-next/issues/638)). Each page embeds a map one way, the way a hotelier or their agency would paste it. **Delete this repo after go-live.**

Live: https://brainbox-software.github.io/hotelmapy-qa-hotel/

Every page reads `?app=<app url>&map=<map id>&lang=<de|en|…>&cbid=<Cookiebot id>`, remembered per browser. `app` defaults to the Scalingo app. There is no fixed map: a run passes its own.

| Page | Mode |
|---|---|
| `script-tag.html` | one-tag snippet mid-page, plus a second one 1600 px below the fold |
| `container.html` | tag in `<head>`, empty `data-hotelmapy-embed` div in the body |
| `consent-tool.html` | two-part snippet held back by Klaro (no account) |
| `cookiebot.html` | two-part snippet held back by Cookiebot (needs `COOKIEBOT_ID` in `site.js` or `?cbid=`) |
| `click-to-load.html` | one-tag snippet for a map set to Click to load |
| `iframe.html` | hand-written iframe of `<app>/<lang>/<map>` |
| `legacy.html` | Atlantik's live markup: `hotelmapy-min.js` in `<head>`, four divs with legacy type strings |

Run locally: `python3 -m http.server 3005`, then open `http://127.0.0.1:3005/?map=<id>`.

Checks (system Chrome, no sandbox): `npm install`, then `CHROME_PATH=/opt/google/chrome/chrome node checks/shoot.mjs <site> <app> <map> <outDir>` (every page at 1280 and 390) and `node checks/klaro-check.mjs <site> <app> <map>`.
