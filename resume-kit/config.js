/* resume-kit storefront config — Founder pastes paymentUrl when ready.
   Keep empty until a real Stripe/Lemon/Gumroad link exists. No secrets here.
   Rail choice and fees: RESEARCH/FUEL_v0/RAIL_DECISION_2026-09-18.md */
window.RESUME_KIT = {
  productName: "ATS Resume Kit",
  priceLabel: "$29 one-time",
  paymentUrl: "https://missionwinning.gumroad.com/l/resume-kit", // Founder: paste a real CHECKOUT link (a product page, not a homepage)
  rail: "", // set by the guard below
  tagline: "One-time zip. Not another resume SaaS.",
  mailtoWarm: "mailto:snowdenzeng@gmail.com?subject=Resume%20kit%20question" // real inbox — the same address lead.html already publishes in this product. Never a placeholder: the checklist capture form sends here.
};

/* Rail guard — self-contained, so there is no second file to load and no wiring step
   to remember. This file already loads before app.js on every page, so the guard is
   active on merge with nothing else to run.

   Law (ENGINE/loop/FUEL_STOP.md): paymentUrl stays "" until the Founder pastes a real
   checkout link, and nobody invents one.

   FAIL CLOSED. A value that is not a CHECKOUT URL for a known rail is demoted to "",
   which is what keeps Buy disabled: an unknown host, a known host on a non-checkout
   path (a homepage, a pricing page, a typo), a placeholder, or a non-https scheme.
   Knowing the host is not enough — the path must look like a checkout too.

   app.js only asks whether paymentUrl is empty, so it needs no change. */
(function (cfg) {
  /* [rail, host pattern, checkout-path pattern] */
  var RAILS = [
    ["gumroad", /^(?:[a-z0-9-]+\.)?gumroad\.com$/, /^\/l\/[A-Za-z0-9_-]+/],
    ["lemonsqueezy", /^(?:[a-z0-9-]+\.)?lemonsqueezy\.com$/, /^\/(?:checkout\/)?buy\/[A-Za-z0-9-]+/],
    /* stripe: payment ids are either prefixed (test_/pr_/cs_/live_…) or opaque
       machine-shaped (≥12 chars, mixed case, contains a digit). Site-page slugs
       (pricing, checkout, help123) are lowercase words and never match. Errs
       toward DISABLE: a false-off is visible to the founder; a false-on silently
       sends buyers to a non-checkout page. */
    ["stripe", /^buy\.stripe\.com$/, /^\/(?:(?:test|live|pr|cs)_[A-Za-z0-9_-]+|(?=.{12,}$)(?=.*[A-Z])(?=.*\d)[A-Za-z0-9]+)$/],
    ["payhip", /^payhip\.com$/, /^\/b\/[A-Za-z0-9]+/]
  ];
  var raw = String(cfg.paymentUrl || "").replace(/^\s+|\s+$/g, "");
  var state = "unset", reason = "empty", rail = "", href = "";
  if (raw) {
    state = "invalid";
    reason = "not_https";
    var m = /^https:\/\/([^\/?#]+)(\/[^?#]*)?/i.exec(raw);
    if (m) {
      var host = m[1].toLowerCase().replace(/:\d+$/, "");
      var path = m[2] || "/";
      reason = "unknown_host";
      for (var i = 0; i < RAILS.length; i++) {
        if (RAILS[i][1].test(host)) {
          rail = RAILS[i][0];
          if (RAILS[i][2].test(path)) { state = "live"; reason = "ok"; href = raw; }
          else { reason = "not_a_checkout_path"; }
          break;
        }
      }
    }
  }
  cfg.paymentUrl = href;
  cfg.rail = rail;
  cfg.checkoutState = state;
  cfg.checkoutReason = reason;
})(window.RESUME_KIT);
