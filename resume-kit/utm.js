/* utm.js — carry the channel to the checkout. First-party, and almost nothing.
 *
 * WHY THIS EXISTS. MEASURED 2026-10-20: the storefront's Buy link is a single
 * Gumroad URL, so a sale that arrives through one of the 113 storefront pages is
 * attributed by Gumroad to OUR OWN DOMAIN, not to the channel that produced the
 * visit. The founder would see "$29" on the dashboard and no idea whether the
 * LinkedIn ping, the free checklist, or the SEO hub produced it. Gumroad's own UTM
 * links fix that -- a sale is attributed to the UTM link that was clicked, within
 * 7 days -- but only if the UTM parameters SURVIVE the hop from the page to the
 * checkout.
 *
 * So this does three things, and nothing else:
 *   1. reads the utm_* parameters the visitor already arrived with (they are in
 *      the URL; nothing is stored, nothing is asked);
 *   2. carries them across the site's own internal links, so a visitor who lands
 *      deep (seo/vs-rezi.html?utm_source=linkedin) still has them when they reach
 *      the page with the Buy button;
 *   3. adds them to the checkout link itself, which is where Gumroad reads them.
 *
 * WHAT IT DOES NOT DO. No cookie. No localStorage, no sessionStorage, no
 * identifier. No fingerprinting: it reads no canvas, no fonts, no screen, no
 * hardware, no user agent. No third-party request: it only rewrites hrefs; the
 * browser makes no call this script causes. It is the same shape as the Site-to-
 * Sale visit beacon, minus the counter.
 *
 * The parameters it forwards are ones the visitor's own URL already carried, and
 * they are forwarded to the checkout the site already links to. Nothing is
 * invented and nothing is added.
 */
(function () {
  'use strict';

  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var CHECKOUT_HOSTS = /(^|\.)(gumroad\.com|lemonsqueezy\.com|buy\.stripe\.com|paddle\.com)$/i;

  function carried() {
    var out = [];
    try {
      var params = new URLSearchParams(window.location.search || '');
      for (var i = 0; i < KEYS.length; i++) {
        var v = params.get(KEYS[i]);
        if (v) out.push(KEYS[i] + '=' + encodeURIComponent(v));
      }
    } catch (e) {
      /* no URLSearchParams, or no location: carry nothing */
    }
    return out;
  }

  function addParams(href, query) {
    if (!href || !query) return href;
    if (href.charAt(0) === '#' || href.slice(0, 7) === 'mailto:' || href.slice(0, 5) === 'tel:') {
      return href;
    }
    /* already carrying them? then leave it alone (idempotent) */
    if (href.indexOf('utm_source=') !== -1) return href;
    return href + (href.indexOf('?') === -1 ? '?' : '&') + query;
  }

  function isInternal(href) {
    if (!href) return false;
    if (href.slice(0, 2) === '//') return false;
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return false;   /* absolute, with a scheme */
    if (href.charAt(0) === '#') return false;
    return true;
  }

  function isCheckout(href) {
    var m = /^[a-z][a-z0-9+.-]*:\/\/([^/?#]+)/i.exec(href || '');
    return !!(m && CHECKOUT_HOSTS.test(m[1].toLowerCase()));
  }

  function run() {
    var query = carried().join('&');
    if (!query) return;
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';
      if (isInternal(href) || isCheckout(href)) {
        a.setAttribute('href', addParams(href, query));
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
