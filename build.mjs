// EROOE site generator — `node build.mjs` writes the 5 HTML pages + sitemap/robots.
// Shared components (head, header, footer, icons, app mock-ups) live here so every page stays consistent.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.SITE_URL || "https://www.erooe.example").replace(/\/$/, ""); // ← set your real domain
const YEAR = new Date().getFullYear();

/* ---------- Icons (inline SVG, 24px stroke) ---------- */
const P = {
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>',
  exam: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 9 2 2 3.5-4"/><path d="M8 16h8"/>',
  repeat: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  bolt: '<path d="M13 2 3 14h8l-1 8 10-12h-8z"/>',
  medal: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
  book: '<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M4 16a4 4 0 0 1 4-4h12"/>',
  film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  arrow: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  send: '<path d="m22 2-11 11"/><path d="m22 2-7 20-4-9-9-4z"/>',
  flask: '<path d="M9 3h6M10 3v6L4 20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1l-6-11V3"/><path d="M7 15h10"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  heart: '<path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5A6.5 6.5 0 0 1 21.5 20"/>',
};
const ic = (n, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[n]}</svg>`;

/* ---------- Shared data ---------- */
const NAV = [
  ["index.html", "خانه", "Home"],
  ["about.html", "درباره ما", "About Us"],
  ["services.html", "خدمات", "Services"],
  ["projects.html", "پروژه‌ها", "Projects"],
  ["contact.html", "تماس با ما", "Contact"],
];

const logo = `<a class="logo" href="index.html" aria-label="EROOE — صفحه اصلی">E<span>R</span><span class="oo">OO</span>E</a>`;

/* ---------- Layout components ---------- */
function head({ title, desc, file }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EROOE",
    description: "توسعه‌ی اپلیکیشن‌های آموزشی تعاملی و هوشمند برای دوره‌ی متوسطه‌ی اول.",
  };
  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#070b14">
<meta name="color-scheme" content="dark">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https:; form-action 'self'; base-uri 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta property="og:type" content="website">
<meta property="og:locale" content="fa_IR">
<meta property="og:site_name" content="EROOE">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<link rel="canonical" href="${SITE_URL}/${file === "index.html" ? "" : file}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;600&family=Vazirmatn:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="assets/css/styles.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script src="assets/js/init.js"></script>
</head>`;
}

function header(current) {
  const links = NAV.map(([h, fa]) => `<a href="${h}"${h === current ? ' aria-current="page"' : ""}>${fa}</a>`).join("");
  const mlinks = NAV.map(([h, fa, en]) => `<a class="m-link" href="${h}"${h === current ? ' aria-current="page"' : ""}><span>${fa}</span><span class="mono muted small">${en}</span></a>`).join("");
  return `<body>
<a class="skip-link" href="#main">پرش به محتوای اصلی</a>
<header class="site-header">
  <div class="container">
    ${logo}
    <nav class="nav" aria-label="منوی اصلی">${links}</nav>
    <a class="btn btn--primary btn--sm header-cta" href="contact.html?subject=beta">پیش‌ثبت‌نام نسخه آزمایشی</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-panel" aria-label="باز کردن منو">
      ${ic("menu", "icon icon-open")}${ic("close", "icon icon-close")}
    </button>
  </div>
</header>
<div class="mobile-panel" id="mobile-panel">
  <nav aria-label="منوی موبایل">${mlinks}</nav>
  <a class="btn btn--primary" href="contact.html?subject=beta">پیش‌ثبت‌نام نسخه آزمایشی</a>
</div>
<main id="main">`;
}

function footer() {
  const links = NAV.map(([h, fa]) => `<li><a href="${h}">${fa}</a></li>`).join("");
  return `</main>
<footer class="site-footer">
  <div class="container">
    <div class="foot-grid">
      <div class="stack">
        ${logo}
        <p class="muted foot-about">EROOE اپلیکیشن‌های آموزشی تعاملی و هوشمند برای دوره‌ی متوسطه‌ی اول می‌سازد؛ با تمرکز بر یادگیری عمیق، سنجش مستمر و تجربه‌ای که دانش‌آموز دوست دارد.</p>
      </div>
      <div>
        <h2>صفحات</h2>
        <ul>${links}</ul>
      </div>
      <div>
        <h2>ارتباط</h2>
        <ul>
          <li><span class="ph">ایمیل — پس از ارائه</span></li>
          <li><span class="ph">تلفن — پس از ارائه</span></li>
          <li><a href="contact.html?subject=beta">پیش‌ثبت‌نام نسخه آزمایشی</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© ${YEAR} EROOE — تمامی حقوق محفوظ است.</span>
      <span class="mono">EROOE // OBSIDIAN KINETIC</span>
    </div>
  </div>
</footer>
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

const page = (o, body) => head(o) + "\n" + header(o.file) + "\n" + body + "\n" + footer();

/* ---------- App mock-ups (pure HTML/CSS illustrations; sizes via classes because CSP forbids inline styles) ---------- */
const mockQuiz = (cls = "") => `
<div class="device ${cls}" role="img" aria-label="نمونه رابط کاربری: آزمون مفهومی پیام‌های آسمان">
  <div class="screen">
    <div class="s-top"><span>EROOE · PAYAM</span><span class="s-xp">480 XP</span></div>
    <div><div class="s-sub">GRADE 9 · LESSON 4</div><div class="s-title">پیمان اخوت و حقوق برادری</div></div>
    <div class="s-verse"><div class="ar" lang="ar" dir="rtl">«إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ»</div><div class="tr">«به‌حقیقت، مؤمنان با یکدیگر برادرند؛ پس میان دو برادر خود سازش دهید.»</div></div>
    <div class="s-sub">QUIZ 3 / 10</div>
    <div class="s-q">اساسی‌ترین وظیفه اجتماعی اهل ایمان در منازعات چیست؟</div>
    <div class="s-opt">کناره‌گیری و سکوت مصلحتی</div>
    <div class="s-opt on">اصلاح ذات‌البین و برقراری آشتی</div>
    <div class="s-opt">انتقال فوری موضوع به مراجع قضایی</div>
    <div class="s-bar"><i class="w30"></i></div>
  </div>
</div>`;
const mockLeitner = (cls = "") => `
<div class="device ${cls}" role="img" aria-label="نمونه رابط کاربری: فلش‌کارت‌های فاصله‌دار لایتنر">
  <div class="screen">
    <div class="s-top"><span>LEITNER BOX</span><span class="s-xp">DAY 12</span></div>
    <div class="s-title">مرور هوشمند</div>
    <div class="boxes"><div>1</div><div class="on">2</div><div>3</div><div>4</div><div>5</div></div>
    <div class="s-card"><div class="s-sub">KEYWORD</div><div class="big">ذات‌البین</div><div class="muted small">برای دیدن معنا ضربه بزنید</div></div>
    <div class="s-bar"><i class="w60"></i></div>
    <div class="s-top"><span>REVIEW DUE: 8</span><span>NEXT: 14:00</span></div>
  </div>
</div>`;
const mockProgress = (cls = "") => `
<div class="device ${cls}" role="img" aria-label="نمونه رابط کاربری: تحلیل نقاط ضعف و پیشرفت">
  <div class="screen">
    <div class="s-top"><span>ANALYTICS</span><span class="s-xp">LEVEL 7</span></div>
    <div class="s-title">تحلیل نقاط ضعف</div>
    <div class="chart" aria-hidden="true"><i class="h80"></i><i class="h50"></i><i class="weak h30"></i><i class="h70"></i><i class="h90"></i><i class="weak h40"></i></div>
    <div class="s-opt on">فصل اول — تسلط خوب</div>
    <div class="s-opt">فصل دوم — نیازمند مرور</div>
    <div class="s-bar"><i class="w75"></i></div>
    <div class="s-top"><span>ACCURACY</span><span>SAMPLE DATA</span></div>
  </div>
</div>`;
const mockQuizSafe = mockQuiz;

/* ---------- Pages ---------- */
const pages = {};

/* HOME */
pages["index.html"] = page(
  { file: "index.html", title: "EROOE | اپلیکیشن‌های آموزشی تعاملی و هوشمند", desc: "EROOE اپلیکیشن‌های آموزشی تعاملی، آزمون‌ساز و تحلیل یادگیری برای دوره‌ی متوسطه‌ی اول (پایه‌های هفتم تا نهم) توسعه می‌دهد." },
  `
<section class="hero">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-copy">
        <span class="badge badge--live reveal">EROOE · EDUCATIONAL APPS</span>
        <h1 class="display reveal d1">یادگیری تعاملی،<br><span class="accent">ساخته‌شده با دقت مهندسی</span></h1>
        <p class="lead reveal d2">EROOE مجموعه‌ای از اپلیکیشن‌های آموزشی هوشمند برای دوره‌ی متوسطه‌ی اول است؛ جایی که مفاهیم درسی به تجربه‌ای داستانی، قابل‌سنجش و ماندگار تبدیل می‌شوند.</p>
        <div class="hero-actions reveal d3">
          <a class="btn btn--primary" href="projects.html">مشاهده پروژه‌ها ${ic("arrow", "icon arrow")}</a>
          <a class="btn btn--ghost" href="contact.html">تماس با ما</a>
        </div>
      </div>
      <div class="reveal d2">
        <div class="floaty rel">
          ${mockQuizSafe()}
          <div class="float-note">${ic("bolt")}<span>حالت آفلاین<br><span class="muted">بدون نیاز به اینترنت</span></span></div>
        </div>
        <p class="caption">نمونه‌ی رابط کاربری اپلیکیشن «پیام‌های آسمان» (نسخه آزمایشی)</p>
      </div>
    </div>

    <div class="facts reveal" role="list">
      <div class="fact" role="listitem"><b>۳</b><span>پایه تحصیلی تحت پوشش<br>هفتم، هشتم، نهم</span></div>
      <div class="fact" role="listitem"><b>۱</b><span>اپلیکیشن شاخص<br>پیام‌های آسمان — نسخه آزمایشی</span></div>
      <div class="fact" role="listitem"><b>Offline</b><span>طراحی‌شده برای کار بدون اینترنت پایدار</span></div>
      <div class="fact fact--ph" role="listitem"><b>—</b><span><span class="ph">آمار کاربران — پس از انتشار</span></span></div>
    </div>
  </div>
</section>

<section class="section section--alt" aria-labelledby="svc-h">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="stack"><span class="eyebrow">Services</span><h2 class="h2" id="svc-h">خدماتی که یادگیری را متحول می‌کند</h2></div>
      <p class="lead">از طراحی تجربه‌ی آموزشی تا آزمون‌ساز هوشمند و تحلیل نقاط ضعف؛ هر خدمت برای یک نیاز واقعی در مسیر یادگیری ساخته شده است.</p>
    </div>
    <div class="grid grid--4">
      ${[
        ["film", "اپلیکیشن‌های یادگیری تعاملی", "درس‌ها در قالب سناریو و داستان روایت می‌شوند، نه پاراگراف‌های متراکم."],
        ["exam", "آزمون‌ساز و شبیه‌ساز امتحان", "نمونه‌آزمون‌های زمان‌دار با نمره‌دهی و پاسخ تشریحی."],
        ["repeat", "مرور فاصله‌دار (لایتنر)", "مرور مطالب درست در زمان نزدیک به فراموشی."],
        ["chart", "تحلیل یادگیری", "شناسایی نقاط ضعف و پیشنهاد مسیر مرور برای هر دانش‌آموز."],
      ].map(([i, t, d], n) => `
      <article class="card reveal d${(n % 3) + 1}"><span class="idx">0${n + 1}</span><div class="ico">${ic(i)}</div><h3 class="h3">${t}</h3><p>${d}</p><a class="more stretch" href="services.html">جزئیات خدمت ${ic("arrow")}</a></article>`).join("")}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="prj-h">
  <div class="container">
    <div class="section-head section-head--split">
      <div class="stack"><span class="eyebrow">Selected work</span><h2 class="h2" id="prj-h">پروژه‌ها و دستاوردهای شاخص</h2></div>
      <p class="lead">اپلیکیشن‌هایی که با تمرکز بر تجربه‌ی دانش‌آموز ساخته می‌شوند.</p>
    </div>
    <div class="grid grid--2">
      <article class="card project reveal">
        <div class="thumb"><span class="badge badge--live">نسخه آزمایشی</span>${mockLeitner("mini")}</div>
        <div class="body">
          <span class="card-label">Flagship app · پایه‌های ۷ تا ۹</span>
          <h3 class="h3">پیام‌های آسمان — متوسطه اول</h3>
          <p>اپلیکیشن تعاملی درس «معارف اسلامی» با آموزش سناریومحور، آزمون‌ساز و جعبه‌ی لایتنر هوشمند.</p>
          <a class="more stretch" href="projects.html#project-payam">مشاهده جزئیات پروژه ${ic("arrow")}</a>
        </div>
      </article>
      <article class="card project project--ph reveal d1">
        <div class="thumb"><span class="badge badge--ghost">به‌زودی</span><span class="glyph">[ NEXT PROJECT ]</span></div>
        <div class="body">
          <span class="card-label">In planning</span>
          <h3 class="h3">مجموعه ابزارهای علوم و ریاضیات</h3>
          <p>در مسیر توسعه‌ی EROOE برنامه‌ریزی شده است. <span class="ph">جزئیات پس از نهایی شدن</span></p>
          <a class="more stretch" href="projects.html">همه پروژه‌ها ${ic("arrow")}</a>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section section--alt" aria-labelledby="why-h">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Why EROOE</span><h2 class="h2" id="why-h">مزیت‌های رقابتی EROOE</h2>
      <p class="lead">تلفیق نگاه مهندسی نرم‌افزار با نیازهای روان‌شناختی دانش‌آموز.</p></div>
    <div class="grid grid--3">
      ${[
        ["film", "آموزش سناریومحور", "هر درس به یک چالش یا داستان تصمیم‌گیری تبدیل می‌شود تا مفهوم، درک شود و فقط حفظ نشود."],
        ["repeat", "حافظه‌ی بلندمدت", "الگوریتم مرور فاصله‌دار، مطالب را در زمان درست دوباره به دانش‌آموز نشان می‌دهد."],
        ["bolt", "سریع و آفلاین", "پس از دریافت محتوا، مرور درس‌ها و آزمون‌ها در هر مکان و بدون اینترنت ممکن است."],
        ["medal", "انگیزه‌ی روزانه", "امتیاز تجربه (XP)، نشان‌های پیشرفت و رقابت دوستانه برای ادامه‌ی مسیر."],
        ["chart", "سنجش هوشمند", "تحلیل پاسخ‌ها و پیدا کردن دقیق نقاط ضعف پیش از امتحان."],
        ["shield", "بدون مزاحمت", "طراحی ساده و متمرکز، بدون تبلیغات مزاحم در تجربه‌ی یادگیری."],
      ].map(([i, t, d], n) => `
      <div class="card reveal d${(n % 3) + 1}"><div class="ico">${ic(i)}</div><h3 class="h3">${t}</h3><p>${d}</p></div>`).join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="cta-band reveal">
      <span class="eyebrow">Collaborate</span>
      <h2 class="h2">آماده‌اید یادگیری را متفاوت تجربه کنید؟</h2>
      <p class="lead">دانش‌آموز، دبیر یا همکار آینده هستید؟ برای پیش‌ثبت‌نام نسخه‌ی آزمایشی یا همکاری با ما پیام بدهید.</p>
      <div class="hero-actions">
        <a class="btn btn--primary" href="contact.html?subject=beta">پیش‌ثبت‌نام ${ic("arrow", "icon arrow")}</a>
        <a class="btn btn--ghost" href="contact.html?subject=partnership">پیشنهاد همکاری</a>
      </div>
    </div>
  </div>
</section>`
);

/* ABOUT */
pages["about.html"] = page(
  { file: "about.html", title: "درباره ما | EROOE", desc: "داستان، مأموریت، چشم‌انداز و ارزش‌های EROOE؛ پلتفرمی برای اپلیکیشن‌های آموزشی تعاملی دوره‌ی متوسطه‌ی اول." },
  `
<section class="hero page-hero">
  <div class="container"><div class="hero-copy">
    <span class="eyebrow reveal">About Us</span>
    <h1 class="display reveal d1">از دل کلاس درس تا ساخت <span class="accent">آینده‌ی آموزش</span></h1>
    <p class="lead reveal d2">EROOE از یک پرسش ساده شروع شد: اگر کتاب درسی، تجربه‌ای تعاملی و هوشمند بود، یادگیری چه شکلی پیدا می‌کرد؟</p>
  </div></div>
</section>

<section class="section section--alt" aria-labelledby="story-h">
  <div class="container split">
    <div class="stack"><span class="eyebrow">Our story</span><h2 class="h2" id="story-h">داستان EROOE</h2></div>
    <div class="stack">
      <p>EROOE را پرهام ناظمی، دانش‌آموز و برنامه‌نویس، بنیان نهاد. او که هر روز با دوستان و هم‌کلاسی‌هایش در کلاس درس بود، می‌دید که مفاهیم ارزشمند درسی به‌خاطر شیوه‌ی ارائه‌ی خشک، برای بسیاری جذاب نیست.</p>
      <p>پاسخ او ساخت اپلیکیشنی بود که درس را به داستان، آزمون و بازی تبدیل کند و یادگیری را از دید یک هم‌کلاسی طراحی کند.</p>
      <p><span class="ph">تاریخ تأسیس و جزئیات تکمیلی — پس از ارائه</span></p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="mv-h">
  <div class="container">
    <h2 class="sr-only" id="mv-h">مأموریت و چشم‌انداز</h2>
    <div class="grid grid--2">
      <div class="card reveal"><div class="ico">${ic("target")}</div><span class="card-label">Mission</span><h3 class="h3">مأموریت</h3>
        <p>ساختن ابزارهای یادگیری تعاملی که مفاهیم درسی را قابل‌فهم، جذاب و ماندگار می‌کنند و به هر دانش‌آموز کمک می‌کنند با اعتمادبه‌نفس‌تر امتحان بدهد.</p></div>
      <div class="card reveal d1"><div class="ico">${ic("eye")}</div><span class="card-label">Vision</span><h3 class="h3">چشم‌انداز</h3>
        <p>تبدیل شدن به مرجعی معتبر برای اپلیکیشن‌های آموزشی هوشمند دوره‌ی متوسطه در سطح کشور.</p></div>
    </div>
  </div>
</section>

<section class="section section--alt" aria-labelledby="road-h">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Roadmap</span><h2 class="h2" id="road-h">مسیر توسعه</h2>
      <p class="lead">گام‌های اصلی رشد EROOE. <span class="ph">زمان‌بندی دقیق پس از ارائه</span></p></div>
    <ol class="timeline">
      ${[
        ["Phase 01", "نمونه‌ی اولیه", "طراحی هسته‌ی تجربه‌ی یادگیری: درس‌های سناریومحور و آزمون مفهومی."],
        ["Phase 02 · در جریان", "نسخه آزمایشی و بازخورد", "آزمایش اپلیکیشن با دانش‌آموزان و اصلاح مداوم بر پایه‌ی بازخورد."],
        ["Phase 03 · هدف", "پوشش کامل پایه‌های هفتم تا نهم", "تکمیل محتوا، بانک آزمون و شبیه‌ساز امتحان برای هر سه پایه."],
        ["Phase 04 · هدف", "گسترش به اپلیکیشن‌های بیشتر", "ابزارهای تعاملی برای درس‌های دیگر مانند علوم و ریاضی."],
      ].map(([k, t, d]) => `<li class="tl-item reveal"><div class="card"><span class="card-label">${k}</span><h3 class="h3">${t}</h3><p>${d}</p></div></li>`).join("")}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="val-h">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Values</span><h2 class="h2" id="val-h">ارزش‌های سازمانی</h2></div>
    <div class="grid grid--4">
      ${[
        ["spark", "نوآوری", "هر روز راه بهتری برای یاد دادن و یاد گرفتن جست‌وجو می‌کنیم."],
        ["book", "یادگیری عمیق", "درک مفهوم را بر حفظ کردن مقدم می‌دانیم."],
        ["users", "ساده و دانش‌آموزمحور", "طراحی را از نگاه کاربر اصلی، یعنی دانش‌آموز، آغاز می‌کنیم."],
        ["heart", "خدمت به آموزش", "فناوری برای ما ابزاری است تا آموزش بهتر دیده شود."],
      ].map(([i, t, d], n) => `<div class="card reveal d${(n % 3) + 1}"><div class="ico">${ic(i)}</div><h3 class="h3">${t}</h3><p>${d}</p></div>`).join("")}
    </div>
  </div>
</section>

<section class="section section--alt" aria-labelledby="team-h">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Leadership</span><h2 class="h2" id="team-h">تیم مدیریتی</h2></div>
    <div class="grid grid--3">
      <article class="card member reveal"><div class="avatar" aria-hidden="true">PN</div><h3 class="h3">پرهام ناظمی</h3><span class="card-label">Founder · Developer</span><p>بنیان‌گذار، طراح و توسعه‌دهنده‌ی پلتفرم EROOE.</p></article>
      <article class="card member member--ph reveal d1"><div class="avatar" aria-hidden="true">?</div><h3 class="h3"><span class="ph">نام عضو تیم</span></h3><span class="card-label">Role</span><p><span class="ph">سمت و توضیح — پس از ارائه</span></p></article>
      <article class="card member member--ph reveal d2"><div class="avatar" aria-hidden="true">?</div><h3 class="h3"><span class="ph">نام عضو تیم</span></h3><span class="card-label">Role</span><p><span class="ph">سمت و توضیح — پس از ارائه</span></p></article>
    </div>
  </div>
</section>

<section class="section"><div class="container"><div class="cta-band reveal">
  <span class="eyebrow">Join us</span><h2 class="h2">دبیر هستید یا می‌خواهید همراه ما باشید؟</h2>
  <p class="lead">نظرات و پیشنهادهای شما بهترین سرمایه‌ی EROOE است.</p>
  <div class="hero-actions"><a class="btn btn--primary" href="contact.html?subject=partnership">ارسال پیام ${ic("arrow", "icon arrow")}</a><a class="btn btn--ghost" href="projects.html">مشاهده پروژه‌ها</a></div>
</div></div></section>`
);

/* SERVICES */
const services = [
  ["film", "اپلیکیشن‌های یادگیری تعاملی", "Interactive learning apps", "طراحی و توسعه‌ی اپلیکیشن‌هایی که هر درس را در قالب سناریو، چالش و داستان ارائه می‌کنند.",
    ["درک مفهومی به‌جای حفظ طوطی‌وار", "مناسب موبایل و تبلت", "هم‌راستا با سرفصل رسمی کتاب"], "دروس مفهومی، علوم انسانی و معارف"],
  ["exam", "آزمون‌ساز و شبیه‌ساز امتحان", "Exam simulators", "آزمون‌های زمان‌دار با بارم‌بندی، پاسخ تشریحی و تحلیل نتیجه.",
    ["شبیه‌سازی شرایط امتحان واقعی", "نمره‌دهی و بازخورد فوری", "سطح‌بندی سؤال‌ها"], "آمادگی امتحانات پایانی و هماهنگ"],
  ["repeat", "موتور مرور فاصله‌دار", "Spaced repetition", "پیاده‌سازی جعبه‌ی لایتنر برای واژگان، احادیث و مفاهیم کلیدی.",
    ["مرور در زمان نزدیک به فراموشی", "کاهش زمان مطالعه‌ی تکراری", "تثبیت در حافظه‌ی بلندمدت"], "حفظ آیات، واژگان و کلیدواژه‌ها"],
  ["chart", "تحلیل و گزارش یادگیری", "Learning analytics", "پایش دقت پاسخ‌ها و مشخص کردن نقاط ضعف هر دانش‌آموز.",
    ["نمودار پیشرفت", "پیشنهاد مباحث نیازمند مرور", "کمک به برنامه‌ریزی مطالعه"], "دانش‌آموزان و دبیران"],
  ["medal", "طراحی گیمیفیکیشن", "Gamification", "سیستم امتیاز، نشان و رتبه‌بندی برای ایجاد انگیزه‌ی روزانه.",
    ["نشان‌های پیشرفت و XP", "رقابت دوستانه", "ایجاد عادت مطالعه"], "افزایش مشارکت و پایداری"],
  ["bolt", "اجرای آفلاین و سبک", "Offline-first delivery", "معماری اپلیکیشن‌ها به‌گونه‌ای است که پس از دریافت محتوا بدون اینترنت کار کنند.",
    ["حجم بهینه", "اجرای سریع", "مناسب مناطق با اینترنت ضعیف"], "مطالعه در هر زمان و مکان"],
];
pages["services.html"] = page(
  { file: "services.html", title: "خدمات | EROOE", desc: "خدمات EROOE: اپلیکیشن‌های یادگیری تعاملی، آزمون‌ساز، مرور فاصله‌دار، تحلیل یادگیری، گیمیفیکیشن و اجرای آفلاین." },
  `
<section class="hero page-hero">
  <div class="container"><div class="hero-copy">
    <span class="eyebrow reveal">Services</span>
    <h1 class="display reveal d1">خدماتی برای <span class="accent">یادگیری هوشمندتر</span></h1>
    <p class="lead reveal d2">از تجربه‌ی تعاملی درس تا سنجش و تحلیل؛ مجموعه‌ای یکپارچه از قابلیت‌هایی که در اپلیکیشن‌های EROOE به کار می‌روند.</p>
  </div></div>
</section>
<section class="section" aria-label="فهرست خدمات">
  <div class="container"><div class="grid grid--3">
    ${services.map(([i, t, en, d, b, u], n) => `
    <article class="card reveal d${(n % 3) + 1}"><span class="idx">0${n + 1}</span><div class="ico">${ic(i)}</div>
      <span class="card-label">${en}</span><h2 class="h3">${t}</h2><p>${d}</p>
      <ul class="ticks">${b.map((x) => `<li>${x}</li>`).join("")}</ul>
      <p class="card-label">کاربرد: <span class="muted plain">${u}</span></p></article>`).join("")}
  </div></div>
</section>
<section class="section"><div class="container"><div class="cta-band reveal">
  <span class="eyebrow">Let's talk</span><h2 class="h2">نیاز آموزشی خاصی دارید؟</h2>
  <p class="lead">درباره‌ی ایده یا نیاز خود با ما صحبت کنید.</p>
  <div class="hero-actions"><a class="btn btn--primary" href="contact.html?subject=partnership">درخواست مشاوره ${ic("arrow", "icon arrow")}</a><a class="btn btn--ghost" href="projects.html">نمونه کارها</a></div>
</div></div></section>`
);

/* PROJECTS */
pages["projects.html"] = page(
  { file: "projects.html", title: "پروژه‌ها | EROOE", desc: "پروژه‌ها و اپلیکیشن‌های EROOE از جمله «پیام‌های آسمان» برای پایه‌های هفتم تا نهم." },
  `
<section class="hero page-hero">
  <div class="container"><div class="hero-copy">
    <span class="eyebrow reveal">Projects</span>
    <h1 class="display reveal d1">پروژه‌ها و <span class="accent">اپلیکیشن‌ها</span></h1>
    <p class="lead reveal d2">نگاهی به آنچه ساخته‌ایم و آنچه در راه است.</p>
  </div></div>
</section>
<section class="section" aria-label="فهرست پروژه‌ها">
  <div class="container">
    <div class="filters" role="group" aria-label="فیلتر پروژه‌ها">
      <button class="chip" type="button" data-filter="all" aria-pressed="true">همه</button>
      <button class="chip" type="button" data-filter="beta" aria-pressed="false">نسخه آزمایشی</button>
      <button class="chip" type="button" data-filter="planned" aria-pressed="false">در برنامه</button>
    </div>
    <div class="grid grid--3">
      <article class="card project" data-status="beta" id="project-payam">
        <div class="thumb"><span class="badge badge--live">نسخه آزمایشی</span>${mockQuiz("mini")}</div>
        <div class="body">
          <div class="tags"><span>Grades 7–9</span><span>Offline</span><span>Gamified</span></div>
          <h2 class="h3">پیام‌های آسمان — متوسطه اول</h2>
          <p>اپلیکیشن تعاملی معارف اسلامی با درس‌های سناریومحور، آزمون‌ساز و مرور فاصله‌دار.</p>
          <button class="more stretch" type="button" data-open-modal="modal-payam">مشاهده جزئیات ${ic("arrow")}</button>
        </div>
      </article>
      <article class="card project project--ph" data-status="planned">
        <div class="thumb"><span class="badge badge--ghost">در برنامه</span><span class="glyph">[ SCIENCE &amp; MATH ]</span></div>
        <div class="body"><div class="tags"><span>Planned</span></div>
          <h2 class="h3">مجموعه ابزارهای علوم و ریاضیات</h2>
          <p>ابزارهای تعاملی برای درک مفاهیم علوم و ریاضی. <span class="ph">جزئیات — پس از نهایی شدن</span></p></div>
      </article>
      <article class="card project project--ph" data-status="planned">
        <div class="thumb"><span class="badge badge--ghost">در برنامه</span><span class="glyph">[ NEW PROJECT ]</span></div>
        <div class="body"><div class="tags"><span>Planned</span></div>
          <h2 class="h3"><span class="ph">عنوان پروژه</span></h2>
          <p><span class="ph">شرح پروژه — پس از ارائه</span></p></div>
      </article>
    </div>
  </div>
</section>

<dialog class="modal" id="modal-payam" aria-labelledby="payam-t">
  <div class="modal-head"><span class="card-label">Project · Payam</span><button class="btn btn--ghost btn--sm" type="button" data-close-modal>بستن ${ic("close")}</button></div>
  <div class="modal-body">
    <div class="stack"><span class="badge badge--live">نسخه آزمایشی</span>
      <h2 class="h2" id="payam-t">پیام‌های آسمان — متوسطه اول</h2>
      <p class="lead">بازتعریف یادگیری معارف اسلامی از نگاه یک هم‌کلاسی: تبدیل حفظیات سنگین شب امتحان به سیر داستانی گیرا، درک مفهومی و سنجش مستمر هوشمند.</p></div>
    <dl class="meta-grid">
      <div><dt>Grades</dt><dd>هفتم، هشتم، نهم</dd></div>
      <div><dt>Status</dt><dd>نسخه آزمایشی</dd></div>
      <div><dt>Platform</dt><dd><span class="ph">پلتفرم — پس از ارائه</span></dd></div>
    </dl>
    <div class="gallery">${mockQuizSafe()}${mockLeitner()}${mockProgress()}</div>
    <p class="caption">تصاویر بالا نمونه‌ی رابط کاربری با داده‌های آزمایشی است.</p>
    <div class="grid grid--2">
      <div class="stack"><h3 class="h3">قابلیت‌ها</h3><ul class="ticks">
        <li>آموزش سناریومحور و داستانی</li><li>آزمون‌ساز زمان‌دار با نمره‌دهی</li><li>فلش‌کارت‌های فاصله‌دار (لایتنر)</li>
        <li>پخش صوتی آیات با هایلایت واژگان</li><li>امتیاز تجربه، نشان‌ها و رتبه‌بندی</li><li>کارکرد آفلاین</li></ul></div>
      <div class="stack"><h3 class="h3">می‌خواهید زودتر تجربه کنید؟</h3><p>برای دریافت لینک نسخه‌ی آزمایشی پیش‌ثبت‌نام کنید.</p>
        <a class="btn btn--primary" href="contact.html?subject=beta">پیش‌ثبت‌نام ${ic("arrow", "icon arrow")}</a></div>
    </div>
  </div>
</dialog>`
);

/* CONTACT */
pages["contact.html"] = page(
  { file: "contact.html", title: "تماس با ما | EROOE", desc: "با EROOE در ارتباط باشید؛ پیش‌ثبت‌نام نسخه آزمایشی، پیشنهاد همکاری یا ارسال بازخورد." },
  `
<section class="hero page-hero">
  <div class="container"><div class="hero-copy">
    <span class="eyebrow reveal">Contact</span>
    <h1 class="display reveal d1">با ما <span class="accent">در تماس باشید</span></h1>
    <p class="lead reveal d2">پرسش، پیشنهاد یا درخواست پیش‌ثبت‌نام دارید؟ پیام خود را بنویسید.</p>
  </div></div>
</section>
<section class="section section--tight">
  <div class="container contact-grid">
    <div class="card reveal">
      <h2 class="h3">فرم ارتباط</h2>
      <form class="form" id="contact-form" data-endpoint="" novalidate>
        <div class="row row--2">
          <div class="field"><label for="f-name">نام و نام خانوادگی<span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="e-name">
            <div class="err" id="e-name" aria-live="polite"></div></div>
          <div class="field"><label for="f-contact">ایمیل یا شماره تماس<span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="f-contact" name="contact" type="text" inputmode="email" autocomplete="email" dir="ltr" placeholder="name@example.com" required aria-describedby="e-contact">
            <div class="err" id="e-contact" aria-live="polite"></div></div>
        </div>
        <div class="field"><label for="f-subject">موضوع<span class="req" aria-hidden="true">*</span></label>
          <select class="select" id="f-subject" name="subject" required aria-describedby="e-subject">
            <option value="">انتخاب کنید…</option>
            <option value="beta">پیش‌ثبت‌نام نسخه آزمایشی</option>
            <option value="partnership">همکاری و پروژه</option>
            <option value="feedback">ارسال بازخورد</option>
            <option value="other">سایر موارد</option>
          </select><div class="err" id="e-subject" aria-live="polite"></div></div>
        <div class="field"><label for="f-message">پیام<span class="req" aria-hidden="true">*</span></label>
          <textarea class="textarea" id="f-message" name="message" required aria-describedby="e-message"></textarea>
          <div class="err" id="e-message" aria-live="polite"></div></div>
        <div class="hp" aria-hidden="true"><label>وب‌سایت<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
        <div class="field"><label class="check" for="f-consent"><input id="f-consent" name="consent" type="checkbox" required aria-describedby="e-consent"><span>با ذخیره و استفاده از اطلاعات وارد‌شده برای پاسخ به پیامم موافقم.</span></label>
          <div class="err" id="e-consent" aria-live="polite"></div></div>
        <div id="form-status" class="form-status" role="status" hidden></div>
        <button class="btn btn--primary" type="submit">ارسال پیام ${ic("send")}</button>
      </form>
    </div>
    <aside class="stack stack--stretch reveal d1" aria-label="اطلاعات تماس">
      <div class="card"><h2 class="h3">اطلاعات تماس</h2>
        <dl class="info-list">
          <div class="info-item"><span class="ico">${ic("mail")}</span><div><dt>Email</dt><dd><span class="ph">آدرس ایمیل</span></dd></div></div>
          <div class="info-item"><span class="ico">${ic("phone")}</span><div><dt>Phone</dt><dd><span class="ph">شماره تماس</span></dd></div></div>
          <div class="info-item"><span class="ico">${ic("pin")}</span><div><dt>Address</dt><dd><span class="ph">آدرس شرکت</span></dd></div></div>
        </dl>
        <div class="map-ph">نقشه — پس از ارائه‌ی آدرس</div>
        <div><p class="card-label mb-s">Social</p>
          <div class="socials"><span aria-disabled="true">Instagram</span><span aria-disabled="true">Telegram</span><span aria-disabled="true">LinkedIn</span></div></div>
      </div>
    </aside>
  </div>
</section>`
);

/* ---------- Extra CSS needed by mocks (CSP forbids inline style attrs in new code) ---------- */
// (kept in styles.css; see width/height helper classes)

/* ---------- Write files ---------- */
for (const [file, html] of Object.entries(pages)) writeFileSync(join(OUT, file), html);
writeFileSync(join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(pages).map((f) => `  <url><loc>${SITE_URL}/${f === "index.html" ? "" : f}</loc></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log("Built:", Object.keys(pages).join(", "));
