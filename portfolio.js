/*
  SoftTech portfolio: checks each entry of projects.json before it is shown.
  A broken entry is skipped (and reported in the browser console) so the rest of
  the list still shows. Works in the browser (window.SoftTechPortfolio) and in Node.
*/
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SoftTechPortfolio = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function text(v) { return typeof v === "string" ? v.trim() : ""; }

  // Site links must be full http(s) addresses.
  function siteUrl(u) {
    var s = text(u);
    if (!/^https?:\/\//i.test(s)) return null;
    try { var url = new URL(s); return url.host ? url.href : null; } catch (e) { return null; }
  }

  // Images may be a path in this repo (images/x.png) or an http(s) address.
  function imagePath(u) {
    var s = text(u);
    if (!s) return null;
    if (/^https?:\/\//i.test(s)) return siteUrl(s);
    if (/^[a-z][a-z0-9+.-]*:/i.test(s) || s.indexOf("//") === 0) return null; // javascript:, data:, //host
    return s.replace(/^\.?\//, "");
  }

  function host(u) {
    try { return new URL(u).host.replace(/^www\./, ""); } catch (e) { return u; }
  }

  function initial(name) {
    var chars = Array.from(name);
    for (var i = 0; i < chars.length; i++) if (/[\p{L}\p{N}]/u.test(chars[i])) return chars[i].toUpperCase();
    return chars[0] || "?";
  }

  // A-Z by name, ignoring capitals and accents ("GlobalSip" next to "Global Sip"; "2" before "10").
  var collator = typeof Intl !== "undefined" && Intl.Collator ? new Intl.Collator("en", { sensitivity: "base", numeric: true }) : null;
  function byName(a, b) {
    if (collator) return collator.compare(a.name, b.name);
    var x = a.name.toLowerCase(), y = b.name.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  }

  /*
    prepare(data) -> { items: [...good entries, sorted A-Z by name], skipped: [{ number, reason }] }
    number is the entry's position in projects.json, counting from 1.
    The order in projects.json doesn't matter: the list is always shown A-Z (ignoring capitals).
  */
  function prepare(data) {
    var items = [], skipped = [];
    var list = Array.isArray(data) ? data : (data && Array.isArray(data.projects) ? data.projects : null);
    if (!list) return { items: items, skipped: [{ number: 0, reason: "projects.json must be a list: [ { ... }, { ... } ]" }] };
    list.forEach(function (p, i) {
      var n = i + 1;
      if (!p || typeof p !== "object" || Array.isArray(p)) { skipped.push({ number: n, reason: "not a { ... } block" }); return; }
      var name = text(p.name);
      if (!name) { skipped.push({ number: n, reason: "missing \"name\"" }); return; }
      var url = siteUrl(p.url);
      if (!url) { skipped.push({ number: n, reason: "\"url\" must start with https://" }); return; }
      var item = { name: name, url: url, host: host(url), initial: initial(name) };
      var d = text(p.description);
      if (d) item.description = d;
      var img = imagePath(p.image);
      if (img) item.image = img;
      if (p.imageStyle === "cover") item.imageStyle = "cover";
      items.push(item);
    });
    items.sort(byName);
    return { items: items, skipped: skipped };
  }

  return { prepare: prepare, siteUrl: siteUrl, imagePath: imagePath, initial: initial, host: host };
});
