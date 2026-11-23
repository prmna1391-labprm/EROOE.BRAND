/* EROOE — progressive enhancement. The site is fully readable without JS. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Mobile menu ------------------------------------------------------- */
  const toggle = $(".menu-toggle");
  const panel = $("#mobile-panel");
  if (toggle && panel) {
    const set = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "بستن منو" : "باز کردن منو");
      panel.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
    };
    toggle.addEventListener("click", () => set(toggle.getAttribute("aria-expanded") !== "true"));
    panel.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
    window.matchMedia("(min-width: 960px)").addEventListener("change", (m) => m.matches && set(false));
  }

  /* Scroll reveal ----------------------------------------------------- */
  const items = $$(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  /* Project filters --------------------------------------------------- */
  const chips = $$(".chip[data-filter]");
  if (chips.length) {
    chips.forEach((chip) => chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      const f = chip.dataset.filter;
      $$("[data-status]").forEach((card) => { card.hidden = !(f === "all" || card.dataset.status === f); });
    }));
  }

  /* Project detail dialogs ------------------------------------------- */
  let lastOpener = null;
  $$("[data-open-modal]").forEach((btn) => btn.addEventListener("click", () => {
    const dlg = document.getElementById(btn.dataset.openModal);
    if (dlg && typeof dlg.showModal === "function") {
      lastOpener = btn;
      dlg.showModal();
    }
  }));
  $$("dialog.modal").forEach((dlg) => {
    dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close-modal]")) dlg.close(); });
    dlg.addEventListener("close", () => lastOpener && lastOpener.focus());
  });
  if (location.hash.startsWith("#project-")) {
    const dlg = document.getElementById("modal-" + location.hash.slice(9));
    if (dlg && typeof dlg.showModal === "function") dlg.showModal();
  }

  /* Contact form ------------------------------------------------------ */
  const form = $("#contact-form");
  if (form) {
    // Set this to your form backend (Formspree, Netlify, own API…). Empty = not connected yet.
    const ENDPOINT = form.dataset.endpoint || "";
    const status = $("#form-status");
    const msgs = {
      name: "لطفاً نام خود را وارد کنید (حداقل ۲ نویسه).",
      contact: "ایمیل یا شماره تماس معتبر وارد کنید.",
      subject: "موضوع پیام را انتخاب کنید.",
      message: "پیام شما باید حداقل ۱۰ نویسه باشد.",
      consent: "برای ارسال، تأیید این مورد لازم است.",
    };
    const toLatinDigits = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
    const validators = {
      name: (v) => v.trim().length >= 2,
      contact: (v) => {
        const t = toLatinDigits(v.trim());
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t) || /^\+?[0-9\s\-()]{7,16}$/.test(t);
      },
      subject: (v) => v !== "",
      message: (v) => v.trim().length >= 10,
      consent: (_v, el) => el.checked,
    };
    const check = (el) => {
      const ok = validators[el.name](el.value, el);
      const wrap = el.closest(".field");
      const err = wrap.querySelector(".err");
      wrap.classList.toggle("invalid", !ok);
      el.setAttribute("aria-invalid", String(!ok));
      err.textContent = ok ? "" : msgs[el.name];
      return ok;
    };
    const fields = $$("[name]", form).filter((el) => validators[el.name]);
    fields.forEach((el) => {
      el.addEventListener("blur", () => check(el));
      el.addEventListener("input", () => el.closest(".field").classList.contains("invalid") && check(el));
      el.addEventListener("change", () => check(el));
    });

    // Pre-select subject from ?subject=
    const q = new URLSearchParams(location.search).get("subject");
    const sel = $("select[name=subject]", form);
    if (q && sel && [...sel.options].some((o) => o.value === q)) sel.value = q;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "form-status"; status.hidden = true;
      const results = fields.map(check);
      if (!results.every(Boolean)) {
        const firstBad = fields[results.indexOf(false)];
        firstBad.focus();
        return;
      }
      if ($("[name=website]", form).value) return; // honeypot
      if (!ENDPOINT) {
        status.className = "form-status warn";
        status.textContent = "ارسال آنلاین هنوز به سرور متصل نشده است و پیام شما ارسال نشد. لطفاً از راه‌های ارتباطی دیگر استفاده کنید.";
        status.hidden = false;
        return;
      }
      const btn = $("button[type=submit]", form);
      btn.disabled = true;
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        status.className = "form-status ok";
        status.textContent = "پیام شما با موفقیت ارسال شد. در اولین فرصت پاسخ خواهیم داد.";
      } catch {
        status.className = "form-status warn";
        status.textContent = "ارسال با خطا مواجه شد. لطفاً دوباره تلاش کنید.";
      } finally {
        btn.disabled = false;
        status.hidden = false;
      }
    });
  }
})();
