/* invoice-lite storefront config — Founder pastes paymentUrl when ready.
   Keep empty until a real Stripe/Lemon/Gumroad link exists. No secrets here.
   Optional: set thanksRedirect if the provider allows a custom thank-you URL → thanks.html
   Rail choice and fees: RESEARCH/FUEL_v0/RAIL_DECISION_2026-09-18.md */
window.INVOICE_LITE = {
  productName: "Invoice Lite PDF Pack",
  priceLabel: "From $9 · one-time",
  paymentUrl: "https://missionwinning.gumroad.com/l/invoice-lite",
  rail: "", // set by the guard below
  thanksPath: "thanks.html",
  tagline: "From $9 · one-time PDF pack — not agency hours",
  mailtoWarm: "mailto:snowdenzeng@gmail.com?subject=Invoice%20Lite%20question"
};

/* Rail guard — identical contract to the resume-kit lander, duplicated only because
   each lander deploys from its own directory. Self-contained: no second file to load
   and no wiring step, and this file already loads before the lander's inline checkout
   script, so the guard is active on merge.

   Law (ENGINE/loop/FUEL_STOP.md): paymentUrl stays "" until the Founder pastes a real
   checkout link, and nobody invents one.

   FAIL CLOSED. A value that is not a CHECKOUT URL for a known rail is demoted to "", so
   Buy stays disabled: an unknown host, a known host on a non-checkout path (a homepage,
   a pricing page, a typo), a placeholder, or a non-https scheme. */
(function (cfg) {
  /* [rail, host pattern, checkout-path pattern] */
  var RAILS = [
    ["gumroad", /^(?:[a-z0-9-]+\.)?gumroad\.com$/, /^\/l\/[A-Za-z0-9_-]+/],
    ["lemonsqueezy", /^(?:[a-z0-9-]+\.)?lemonsqueezy\.com$/, /^\/(?:checkout\/)?buy\/[A-Za-z0-9-]+/],
    /* stripe: payment ids are either prefixed (test_/pr_/cs_/live_…) or opaque
       machine-shaped (≥12 chars, mixed case, contains a digit). Site-page slugs
       (pricing, checkout, help123) are lowercase words and never match. Errs
       toward DISABLE: a false-off is visible; a false-on misroutes buyers. */
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
})(window.INVOICE_LITE);
