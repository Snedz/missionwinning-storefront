(function () {
  var cfg = window.RESUME_KIT || {};
  var price = cfg.priceLabel || "$29 one-time";
  ["priceLabel", "priceLabel2", "stickyPrice"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = price;
  });
  var heroBuy = document.getElementById("heroBuy") || document.querySelector(".hero-cta .buy-link");
  if (heroBuy && !heroBuy.getAttribute("data-priced")) {
    heroBuy.textContent = "Buy the kit — " + price;
  }
  var url = (cfg.paymentUrl || "").trim();
  var hint = document.getElementById("buyHint");
  var micro = document.getElementById("checkoutMicro");
  var emptyBanner = document.getElementById("ctaEmptyBanner");
  var heroAlt = document.getElementById("heroAlt");
  var sticky = document.getElementById("stickyBuy");
  var links = document.querySelectorAll("[data-buy]");

  links.forEach(function (a) {
    if (url) {
      a.href = url;
      a.removeAttribute("aria-disabled");
      a.removeAttribute("tabindex");
      a.removeAttribute("role");
      a.classList.remove("disabled");
      if (a.id === "buyBtn") a.textContent = "Continue to secure checkout";
      if (a.id === "heroBuy" || (a.classList.contains("buy-link") && a.closest(".hero-cta"))) {
        a.textContent = "Buy the kit — " + price;
      }
    } else {
      a.href = "#buy";
      a.setAttribute("aria-disabled", "true");
      a.setAttribute("tabindex", "-1");
      a.setAttribute("role", "button");
      a.classList.add("disabled");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (hint) hint.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      if (a.id === "buyBtn") a.textContent = "Checkout not live yet";
      if (a.id === "heroBuy") a.textContent = "Checkout not live — " + price;
    }
  });

  if (hint) {
    hint.textContent = url
      ? "Secure checkout opens on your payment provider. You will receive the zip after payment."
      : "Checkout URL not set yet — founder pastes paymentUrl in config.js. Buy stays disabled on purpose. Free tools + email checklist still work.";
  }
  if (micro) {
    micro.textContent = url
      ? "One-time checkout via your payment provider. No subscription. Zip delivers after payment."
      : "Checkout opens only when a real payment link is pasted into config.js. No fake scarcity. No invented reviews.";
  }
  if (emptyBanner) emptyBanner.hidden = !!url;
  if (heroAlt) {
    heroAlt.textContent = url ? "Email me the free checklist" : "Get the free checklist (email stub)";
    if (!url) heroAlt.classList.add("btn"); // keep ghost but visually primary-adjacent when buy disabled
  }
  if (sticky) sticky.style.display = url ? "" : "flex";

  // Email capture stub → mailto (no invented backend)
  var form = document.getElementById("captureForm");
  var captureHint = document.getElementById("captureHint");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var emailEl = document.getElementById("email");
      var email = (emailEl && emailEl.value || "").trim();
      if (!email) return;
      var to = (cfg.mailtoWarm || "mailto:founder@example.com").replace(/^mailto:/, "").split("?")[0];
      var subject = encodeURIComponent("Resume kit — free checklist request");
      var body = encodeURIComponent(
        "Please send the free ATS checklist.\n\nEmail: " + email + "\n\n(Stub form from resume-kit lander — wire a real endpoint later.)"
      );
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
      if (captureHint) {
        captureHint.textContent = "Mail client opening — if nothing opens, email " + to + " with subject “free checklist”.";
      }
    });
  }
})();
