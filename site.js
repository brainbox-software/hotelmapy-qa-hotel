// The dummy hotel site's one moving part. Every page reads ?app=, ?map=,
// ?lang=, ?cbid= (remembered per browser), sets <html lang> before any
// snippet runs, and pastes its snippet with document.write so it lands in
// the page exactly as a hotelier's paste would.
(function () {
  // The Cookiebot domain group ID of the account that has this site's domain
  // registered. It is public: Cookiebot's loader carries it in every page.
  var COOKIEBOT_ID = "cdbc5bbf-1c6e-42fd-b6da-1ba744a20541";
  var DEFAULTS = { app: "https://hotelmapy.osc-fr1.scalingo.io", map: "", lang: "de", cbid: COOKIEBOT_ID };
  var query = new URLSearchParams(location.search);
  var settings = {};

  function remembered(key) {
    try {
      return localStorage.getItem("qa-" + key);
    } catch (e) {
      return null;
    }
  }

  ["app", "map", "lang", "cbid"].forEach(function (key) {
    var value = query.get(key) || remembered(key) || DEFAULTS[key];
    settings[key] = value;
    try {
      localStorage.setItem("qa-" + key, value);
    } catch (e) {}
  });
  settings.app = settings.app.replace(/\/+$/, "");
  document.documentElement.lang = settings.lang;

  var PAGES = [
    ["index.html", "Home"],
    ["script-tag.html", "One-tag snippet"],
    ["container.html", "Container div"],
    ["consent-tool.html", "Behind Klaro"],
    ["cookiebot.html", "Behind Cookiebot"],
    ["click-to-load.html", "Click to load"],
    ["iframe.html", "Raw iframe"],
    ["legacy.html", "Legacy snippet"],
  ];

  function fill(template) {
    return template
      .split("{APP}").join(settings.app)
      .split("{MAP}").join(settings.map)
      .split("{LANG}").join(settings.lang)
      .split("{CBID}").join(settings.cbid);
  }

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  window.QA = {
    settings: settings,
    // For <head>: pastes without showing anything.
    pasteHead: function (template) {
      if (settings.map) document.write(fill(template));
    },
    // For <head>: Cookiebot's loader, once a domain group ID is known.
    cookiebot: function () {
      if (settings.cbid) {
        document.write(fill('<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="{CBID}" data-blockingmode="auto" type="text/javascript"><\/script>'));
      }
    },
    // Pastes the snippet here, and shows the agent what was pasted.
    paste: function (template) {
      var html = fill(template);
      if (!settings.map) {
        document.write('<p class="qa-warn">No map id: open this page with ?map=&lt;id&gt;.</p>');
        return;
      }
      document.write(html);
      document.write('<details class="qa-code"><summary>Pasted snippet</summary><pre>' + escapeHtml(html) + "</pre></details>");
    },
    header: function () {
      var here = location.pathname.split("/").pop() || "index.html";
      var links = PAGES.map(function (page) {
        var current = page[0] === here ? ' aria-current="page"' : "";
        return '<a href="' + page[0] + '"' + current + ">" + page[1] + "</a>";
      }).join("");
      document.write(
        '<header class="site"><a class="brand" href="index.html">Hotel Seeblick <small>Teststadt</small></a><nav>' + links + "</nav></header>" +
        '<div class="qa-bar">QA · app <b>' + settings.app + "</b> · map <b>" + (settings.map || "—") + "</b> · lang <b>" + settings.lang + "</b></div>"
      );
    },
  };
})();
