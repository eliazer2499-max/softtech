/* SoftTech site: renders the portfolio from projects.json and fills the contact email from site-config.js */
(function () {
  "use strict";
  var config = window.SOFTTECH_CONFIG || {};

  // Year in footer
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Contact email from config (one place to change it: site-config.js)
  if (config.contactEmail) {
    document.querySelectorAll("[data-contact-email]").forEach(function (a) {
      a.setAttribute("href", "mailto:" + config.contactEmail);
      if (a.hasAttribute("data-show-address")) a.textContent = config.contactEmail;
    });
  }

  // Mobile menu
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".site-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Portfolio (the list lives in projects.json)
  var list = document.getElementById("projects");
  if (!list) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // Neat letter tile, used when a site has no image or its image can't load
  function tile(item) {
    var t = el("div", "monogram", item.initial);
    t.setAttribute("aria-hidden", "true");
    return t;
  }

  function card(item) {
    var a = el("a", "project");
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener";
    var media = el("div", "project-media");
    if (item.image) {
      var img = el("img");
      img.alt = item.name + " logo";
      img.loading = "lazy";
      if (item.imageStyle === "cover") img.className = "cover";
      // Wide logos (like a word mark) get a little white margin so they don't touch the edges
      img.onload = function () {
        if (img.naturalWidth > img.naturalHeight * 1.3) img.classList.add("wide");
      };
      img.onerror = function () {
        console.warn("SoftTech: image not found for \"" + item.name + "\": " + item.image + " (showing a letter tile instead)");
        media.replaceChildren(tile(item));
      };
      img.src = item.image;
      media.appendChild(img);
    } else {
      media.appendChild(tile(item));
    }
    var body = el("div", "project-body");
    body.appendChild(el("h3", null, item.name));
    if (item.description) body.appendChild(el("p", null, item.description));
    body.appendChild(el("span", "project-host", item.host + " \u2197"));
    a.appendChild(media);
    a.appendChild(body);
    return a;
  }

  function render(data) {
    var result = window.SoftTechPortfolio.prepare(data);
    result.skipped.forEach(function (s) {
      console.warn("SoftTech: skipped site #" + s.number + " in projects.json: " + s.reason);
    });
    list.textContent = "";
    result.items.forEach(function (item) {
      try { list.appendChild(card(item)); }
      catch (e) { console.warn("SoftTech: couldn't show \"" + item.name + "\"", e); }
    });
    // Closing card: invites the next project
    var cta = el("a", "project project-cta");
    cta.href = "#contact";
    cta.appendChild(el("span", "plus", "+"));
    cta.appendChild(el("h3", null, result.items.length ? "Your project could be next" : "Our next project could be yours"));
    cta.appendChild(el("p", null, "Tell us what you want to build and we'll make it real."));
    cta.appendChild(el("span", "project-host", "Start a project \u2192"));
    list.appendChild(cta);
  }

  fetch("projects.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error("projects.json answered " + r.status); return r.text(); })
    .then(function (txt) {
      var data;
      try { data = JSON.parse(txt); }
      catch (e) {
        console.error("SoftTech: projects.json has a typo (often a missing comma or quote). Paste it into jsonlint.com to find it. " + e.message);
        throw e;
      }
      render(data);
    })
    .catch(function () {
      list.textContent = "";
      list.appendChild(el("p", "projects-note", "Our project list couldn't load right now. Please refresh the page."));
    });
})();
