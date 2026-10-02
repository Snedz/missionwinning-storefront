(function () {
  var cfg = window.INVOICE_LITE || window.INVOICE_LITE_CONFIG || {};
  var url = (cfg.paymentUrl || "").trim();
  var priceLabel = cfg.priceLabel || "From $9 · one-time";
  var price = document.getElementById("price");
  if (price) price.textContent = priceLabel;

  var links = document.querySelectorAll("[data-buy], #buy, a.buy-link");
  if (!links.length) {
    var one = document.getElementById("buy");
    if (one) links = [one];
  }

  function disable(a) {
    a.href = "#buy";
    a.setAttribute("aria-disabled", "true");
    a.setAttribute("tabindex", "-1");
    a.classList.add("disabled");
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var hint = document.getElementById("buyHint") || document.getElementById("checkoutMicro");
      if (hint) hint.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    if (a.id === "buy" || a.hasAttribute("data-buy")) {
      a.textContent = "Checkout not live yet";
    }
  }

  function enable(a) {
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.removeAttribute("aria-disabled");
    a.removeAttribute("tabindex");
    a.classList.remove("disabled");
    if (a.id === "buy" || a.hasAttribute("data-buy")) {
      a.textContent = "Buy the pack — " + priceLabel;
    }
  }

  Array.prototype.forEach.call(links, function (a) {
    if (url) enable(a); else disable(a);
  });

  var hint = document.getElementById("buyHint") || document.getElementById("checkoutMicro");
  if (hint) {
    hint.textContent = url
      ? "Secure checkout opens on your payment provider. Zip after payment."
      : "Checkout URL not set — founder pastes paymentUrl in config.js. Buy stays disabled on purpose. Preview + templates still work.";
  }
  var banner = document.getElementById("ctaEmptyBanner");
  if (banner) banner.hidden = !!url;
})();
