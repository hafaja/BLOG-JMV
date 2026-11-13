/* Associació Logos – interaccions del web */
/* ===== CONFIGURACIÓ =====
   Enganxa aquí l'adreça del feed JSON de Behold (https://feeds.behold.so/XXXX)
   quan Logos hagi connectat el seu Instagram. Si queda buit, es mostra "Segueix-nos". */
var LOGOS_INSTAGRAM_FEED = "";

var LOGOS_LANG = (document.documentElement.lang || "ca").slice(0, 2);
var LOGOS_BASE = "";
var LOGOS_PFX = LOGOS_LANG === "ca" ? "" : LOGOS_LANG + "-";
/* Anti-clickjacking: si otra web mete logostgn.cat dentro de un marco, la página se abre sola fuera */
try { if (window.top !== window.self) window.top.location = window.location.href; } catch (e) { document.documentElement.style.display = "none"; }

/* Ajudes «Aa» (veure i llegir millor): s'apliquen abans de pintar res; el botó i l'assistent són a ajuda.js */
window.logosQuiet = function () { return document.documentElement.classList.contains("lg-quiet") || !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); };
(function () {
  try {
    var o = JSON.parse(localStorage.getItem("logos_web_ajudes") || "{}") || {}, h = document.documentElement;
    if (o.tam === 1) h.classList.add("lg-t1"); if (o.tam === 2) h.classList.add("lg-t2");
    if (o.contrast) h.classList.add("lg-contrast"); if (o.espai) h.classList.add("lg-espai"); if (o.quiet) h.classList.add("lg-quiet");
  } catch (e) {}
  var sc = document.createElement("script"); sc.src = "assets/js/ajuda.js?v=20261101"; sc.defer = true; document.head.appendChild(sc);
})();

(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Menú: desplegables i mòbil ---------- */
  var navBtns = $$(".nav__btn");
  function closeMenus(except) {
    navBtns.forEach(function (b) {
      if (b === except) return;
      b.setAttribute("aria-expanded", "false");
      var dd = document.getElementById(b.getAttribute("aria-controls"));
      if (dd) dd.classList.remove("is-open");
    });
  }
  navBtns.forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = b.getAttribute("aria-expanded") === "true";
      closeMenus(b);
      b.setAttribute("aria-expanded", String(!open));
      document.getElementById(b.getAttribute("aria-controls")).classList.toggle("is-open", !open);
    });
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".nav__item")) closeMenus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenus(); closeSearch(); } });

  var menuToggle = $(".menu-toggle"), menu = $("#menu");
  if (menuToggle) menuToggle.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Tancar el menú" : "Obrir el menú");
  });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { menu.classList.remove("is-open"); closeMenus(); }); });

  /* ---------- Cercador ---------- */
  var INDEX_ALL = {
    ca: [
      ["Tràmits", "Fer un tràmit amb Logos Acompanya", "https://acompanya.logostgn.cat", "tramit ajuda cita acompanya prestacio"],
      ["Formació", "Cursos i formació", "projectes.html", "curs cursos formacio taller digital actic catala"],
      ["Bretxa digital", "Logos Social Up Digital", "projectes.html#social-up", "bretxa digital idcat tramits internet ordinador"],
      ["Treball", "Orientació i inserció laboral", "que-fem.html", "feina treball ocupacio insercio orientacio cv"],
      ["Qualitat", "Certificat ISO 9001:2015", "index.html#qualitat-inici", "iso 9001 qualitat certificat bmc"],
      ["Administracions", "Sol·licitar una reunió", "contacte.html?motiu=reunio#formulari", "reunio administracio entitat projecte tecnic"],
      ["Qui som", "Història, missió i acreditacions", "index.html#qui-som", "historia missio aptos qui som registre"],
      ["Projectes", "Tots els projectes", "projectes.html", "projectes xaldiga dones igualtat"],
      ["Contacte", "Telèfon, WhatsApp, correu i horari", "contacte.html", "contacte telefon whatsapp mobil correu email horari adreca mapa"],
      ["Treballa amb nosaltres", "Enviar la teva candidatura", "contacte.html?motiu=feina#formulari", "treballar feina oferta cv curriculum candidatura"],
      ["Col·laboracions", "Entitats amb qui treballem", "index.html#col-laboracions", "col·laboracions entitats xarxa unesco diputacio port"],
      ["Actualitat", "Últimes publicacions", "index.html#actualitat", "actualitat noticies novetats instagram facebook xarxes"],
      ["Galetes", "Política de galetes", "politica-galetes.html", "galetes cookies privacitat"]
    ],
    es: [
      ["Trámites", "Hacer un trámite con Logos Acompanya", "https://acompanya.logostgn.cat", "tramite ayuda cita acompanya prestacion"],
      ["Formación", "Cursos y formación", "projectes.html", "curso cursos formacion taller digital actic catalan"],
      ["Brecha digital", "Logos Social Up Digital", "projectes.html#social-up", "brecha digital idcat tramites internet ordenador"],
      ["Empleo", "Orientación e inserción laboral", "que-fem.html", "empleo trabajo insercion orientacion cv"],
      ["Calidad", "Certificado ISO 9001:2015", "index.html#qualitat-inici", "iso 9001 calidad certificado bmc"],
      ["Administraciones", "Solicitar una reunión", "contacte.html?motiu=reunio#formulari", "reunion administracion entidad proyecto tecnico"],
      ["Quiénes somos", "Historia, misión y acreditaciones", "index.html#qui-som", "historia mision aptos quienes somos registro"],
      ["Proyectos", "Todos los proyectos", "projectes.html", "proyectos xaldiga mujeres igualdad"],
      ["Contacto", "Teléfono, WhatsApp, correo y horario", "contacte.html", "contacto telefono whatsapp movil correo email horario direccion mapa"],
      ["Trabaja con nosotros", "Enviar tu candidatura", "contacte.html?motiu=feina#formulari", "trabajar empleo oferta cv curriculum candidatura"],
      ["Colaboraciones", "Entidades con las que trabajamos", "index.html#col-laboracions", "colaboraciones entidades red unesco diputacion puerto"],
      ["Actualidad", "Últimas publicaciones", "index.html#actualitat", "actualidad noticias novedades instagram facebook redes"],
      ["Cookies", "Política de cookies", "politica-galetes.html", "cookies privacidad"]
    ],
    en: [
      ["Paperwork", "Do your paperwork with Logos Acompanya", "https://acompanya.logostgn.cat", "paperwork procedure help appointment acompanya benefit"],
      ["Training", "Courses and training", "projectes.html", "course courses training workshop digital actic catalan"],
      ["Digital divide", "Logos Social Up Digital", "projectes.html#social-up", "digital divide idcat online internet computer"],
      ["Employment", "Career guidance and job placement", "que-fem.html", "job work employment guidance cv"],
      ["Quality", "ISO 9001:2015 certificate", "index.html#qualitat-inici", "iso 9001 quality certificate bmc"],
      ["Public bodies", "Request a meeting", "contacte.html?motiu=reunio#formulari", "meeting administration organisation project technical"],
      ["About us", "History, mission and accreditations", "index.html#qui-som", "history mission aptos about register"],
      ["Projects", "All projects", "projectes.html", "projects xaldiga women equality"],
      ["Contact", "Phone, WhatsApp, email and opening hours", "contacte.html", "contact phone whatsapp mobile email hours address map"],
      ["Work with us", "Send your application", "contacte.html?motiu=feina#formulari", "work job vacancy cv resume application"],
      ["Partnerships", "Organisations we work with", "index.html#col-laboracions", "partnerships organisations network unesco"],
      ["News", "Latest posts", "index.html#actualitat", "news updates instagram facebook social media"],
      ["Cookies", "Cookie policy", "politica-galetes.html", "cookies privacy"]
    ],
    fr: [
      ["Démarches", "Faire une démarche avec Logos Acompanya", "https://acompanya.logostgn.cat", "demarche aide rendez-vous acompanya prestation"],
      ["Formation", "Cours et formations", "projectes.html", "cours formation atelier numerique actic catalan"],
      ["Fracture numérique", "Logos Social Up Digital", "projectes.html#social-up", "fracture numerique idcat internet ordinateur"],
      ["Emploi", "Orientation et insertion professionnelle", "que-fem.html", "emploi travail insertion orientation cv"],
      ["Qualité", "Certificat ISO 9001:2015", "index.html#qualitat-inici", "iso 9001 qualite certificat bmc"],
      ["Administrations", "Demander un rendez-vous", "contacte.html?motiu=reunio#formulari", "reunion rendez-vous administration organisme projet"],
      ["Qui sommes-nous", "Histoire, mission et accréditations", "index.html#qui-som", "histoire mission aptos qui sommes nous registre"],
      ["Projets", "Tous les projets", "projectes.html", "projets xaldiga femmes egalite"],
      ["Contact", "Téléphone, WhatsApp, e-mail et horaires", "contacte.html", "contact telephone whatsapp portable email horaires adresse carte"],
      ["Travailler avec nous", "Envoyer votre candidature", "contacte.html?motiu=feina#formulari", "travailler emploi offre cv candidature"],
      ["Collaborations", "Organismes partenaires", "index.html#col-laboracions", "collaborations organismes reseau unesco"],
      ["Actualités", "Dernières publications", "index.html#actualitat", "actualites nouvelles instagram facebook reseaux"],
      ["Cookies", "Politique de cookies", "politica-galetes.html", "cookies confidentialite"]
    ],
    ar: [
      ["الإجراءات", "أنجز إجراءاتك مع Logos Acompanya", "https://acompanya.logostgn.cat", "اجراء اجراءات مساعدة موعد منحة acompanya"],
      ["التدريب", "الدورات والتدريب", "projectes.html", "دورة دورات تدريب ورشة رقمي actic كتالونية"],
      ["الفجوة الرقمية", "Logos Social Up Digital", "projectes.html#social-up", "الفجوة الرقمية idcat انترنت حاسوب"],
      ["التشغيل", "التوجيه والإدماج المهني", "que-fem.html", "عمل شغل وظيفة توجيه سيرة"],
      ["الجودة", "شهادة ISO 9001:2015", "index.html#qualitat-inici", "iso 9001 جودة شهادة"],
      ["الإدارات", "اطلب موعدًا", "contacte.html?motiu=reunio#formulari", "موعد اجتماع ادارة جهة مشروع"],
      ["من نحن", "التاريخ والمهمة والاعتمادات", "index.html#qui-som", "تاريخ مهمة من نحن سجل"],
      ["المشاريع", "جميع المشاريع", "projectes.html", "مشاريع نساء مساواة xaldiga"],
      ["اتصل بنا", "الهاتف وواتساب والبريد وأوقات الدوام", "contacte.html", "اتصال هاتف واتساب جوال بريد دوام عنوان خريطة"],
      ["اعمل معنا", "أرسل طلبك", "contacte.html?motiu=feina#formulari", "عمل وظيفة توظيف سيرة طلب"],
      ["الشراكات", "الجهات التي نعمل معها", "index.html#col-laboracions", "شراكات جهات شبكة"],
      ["المستجدات", "آخر المنشورات", "index.html#actualitat", "مستجدات اخبار انستغرام فيسبوك شبكات"],
      ["ملفات تعريف الارتباط", "سياسة ملفات تعريف الارتباط", "politica-galetes.html", "كوكيز خصوصية"]
    ]
  };
  var INDEX = INDEX_ALL[LOGOS_LANG] || INDEX_ALL.ca;
  var UI = {
    ca: { noRes: "No hem trobat res.", write: "Escriu-nos i t'ajudem", less: "Mostrar menys",
      form: { "Consulta general": ["La teva consulta", "Enviar la consulta"], "Sol·licitar una reunió": ["Expliqueu-nos el projecte o la necessitat", "Sol·licitar la reunió"], "Treballar amb nosaltres": ["Explica'ns el teu perfil i què t'interessa", "Enviar la candidatura"] } },
    es: { noRes: "No hemos encontrado nada.", write: "Escríbenos y te ayudamos", less: "Mostrar menos",
      form: { "Consulta general": ["Tu consulta", "Enviar la consulta"], "Sol·licitar una reunió": ["Explicadnos el proyecto o la necesidad", "Solicitar la reunión"], "Treballar amb nosaltres": ["Explícanos tu perfil y qué te interesa", "Enviar la candidatura"] } }
    ,en: { noRes: "Nothing found.", write: "Write to us and we'll help", less: "Show less",
      form: { "Consulta general": ["Your enquiry", "Send enquiry"], "Sol·licitar una reunió": ["Tell us about the project or need", "Request the meeting"], "Treballar amb nosaltres": ["Tell us about your profile and interests", "Send application"] } }
    ,fr: { noRes: "Aucun résultat.", write: "Écrivez-nous, nous vous aiderons", less: "Afficher moins",
      form: { "Consulta general": ["Votre demande", "Envoyer la demande"], "Sol·licitar una reunió": ["Présentez-nous le projet ou le besoin", "Demander le rendez-vous"], "Treballar amb nosaltres": ["Parlez-nous de votre profil et de vos intérêts", "Envoyer la candidature"] } }
    ,ar: { noRes: "لم نجد أي نتيجة.", write: "اكتب لنا وسنساعدك", less: "عرض أقل",
      form: { "Consulta general": ["استفسارك", "إرسال الاستفسار"], "Sol·licitar una reunió": ["اشرحوا لنا المشروع أو الحاجة", "طلب الموعد"], "Treballar amb nosaltres": ["حدّثنا عن ملفك المهني واهتماماتك", "إرسال الطلب"] } }
  };
  var U = UI[LOGOS_LANG] || UI.ca;

  var searchBtn = $("[data-search-open]"), search = $("#cercador"), sInput = $("#cerca-input"), sList = $(".search__results");
  var norm = function (x) { return (x || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/·/g, ""); };
  function renderSearch() {
    var q = norm(sInput.value).trim();
    var res = INDEX.filter(function (r) { return !q || norm(r.join(" ")).indexOf(q) !== -1; }).slice(0, 6);
    sList.innerHTML = res.length ? res.map(function (r) {
      return '<li><a href="' + (/^https?:/.test(r[2]) ? r[2] : LOGOS_PFX + r[2]) + '"><small>' + r[0] + "</small>" + r[1] + "</a></li>";
    }).join("") : '<li style="grid-column:1/-1">' + U.noRes + ' <a href="' + LOGOS_PFX + 'contacte.html">' + U.write + "</a>.</li>";
  }
  function closeSearch() { if (search && !search.hidden) { search.hidden = true; searchBtn.setAttribute("aria-expanded", "false"); } }
  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      var open = search.hidden;
      search.hidden = !open;
      searchBtn.setAttribute("aria-expanded", String(open));
      if (open) { renderSearch(); sInput.focus(); }
    });
    sInput.addEventListener("input", renderSearch);
    $$(".search__chips .chip").forEach(function (c) { c.addEventListener("click", function () { sInput.value = c.textContent; renderSearch(); sInput.focus(); }); });
  }

  /* ---------- Galetes ---------- */
  var KEY = "logos_consent", banner = $("#cookie"), modal = $("#cookie-modal");
  function readConsent() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function saveConsent(an, ext) {
    try { localStorage.setItem(KEY, JSON.stringify({ analitica: an, externs: ext, data: new Date().toISOString() })); } catch (e) {}
    banner.hidden = true; modal.hidden = true;
    /* Aquí s'activaria l'eina d'analítica només si an === true */
  }
  var consent = readConsent();
  if (!consent && banner) banner.hidden = false;
  $$("[data-cookie]").forEach(function (b) {
    b.addEventListener("click", function () {
      var a = b.getAttribute("data-cookie");
      if (a === "accept") saveConsent(true, true);
      else if (a === "reject") saveConsent(false, false);
      else saveConsent($("#ck-an").checked, $("#ck-ext").checked);
    });
  });
  $$("[data-cookie-config]").forEach(function (b) {
    b.addEventListener("click", function () {
      var c = readConsent() || {};
      $("#ck-an").checked = !!c.analitica; $("#ck-ext").checked = !!c.externs;
      modal.hidden = false; $("#ck-an").focus();
    });
  });
  $$("[data-cookie-close]").forEach(function (b) { b.addEventListener("click", function () { modal.hidden = true; }); });

  /* ---------- Àmbits (inici) ---------- */
  var ambData = $("#amb-data");
  if (ambData) {
    var A = JSON.parse(ambData.textContent), panel = $("#amb-panel");
    $$(".amb").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = +btn.getAttribute("data-amb"), d = A[i];
        $$(".amb").forEach(function (b) { var on = b === btn; b.setAttribute("aria-selected", String(on)); });
        ["t", "txt", "who", "how", "proj"].forEach(function (k) { $('[data-f="' + k + '"]', panel).textContent = d[k]; });
        var im = $('[data-f="img"]', panel);
        var F = LOGOS_BASE + "assets/img/fotos/" + d.img;
        im.src = F + "-1600.webp";
        im.srcset = F + "-800.webp 800w, " + F + "-1600.webp 1600w";
        im.alt = d.alt;
        if (window.innerWidth < 1000) panel.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ---------- Col·laboracions: mostrar totes ---------- */
  var more = $("#collab-more");
  if (more) {
    var total = more.textContent;
    more.addEventListener("click", function () {
      var open = more.getAttribute("aria-expanded") !== "true";
      $$("#collab-grid [data-extra]").forEach(function (t) { t.hidden = !open; });
      more.setAttribute("aria-expanded", String(open));
      more.textContent = open ? U.less : total;
    });
  }


  /* ---------- Actualitat: publicacions d'Instagram (Behold) ---------- */
  var feedBox = $("#insta-feed");
  if (feedBox && LOGOS_INSTAGRAM_FEED) {
    var esc = function (t) { return String(t || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var fmt = function (iso) { try { return new Date(iso).toLocaleDateString("ca-ES", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return ""; } };
    fetch(LOGOS_INSTAGRAM_FEED).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (data) {
      var posts = (data.posts || []).slice(0, 3);
      if (!posts.length) return;
      var html = posts.map(function (p) {
        var src = (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) || p.thumbnailUrl || p.mediaUrl;
        var text = (p.prunedCaption || p.caption || "").replace(/\s+/g, " ").trim();
        if (text.length > 150) text = text.slice(0, 147).replace(/\s+\S*$/, "") + "…";
        return '<a class="card" href="' + esc(p.permalink) + '" target="_blank" rel="noopener">' +
          '<img src="' + esc(src) + '" alt="' + esc(text ? "Publicació: " + text.slice(0, 90) : "Publicació de Logos a Instagram") + '" loading="lazy" style="aspect-ratio:1/1;object-fit:cover;width:100%">' +
          '<div class="card__body"><div class="tags"><span class="tag">Instagram</span><span class="tag tag--grey">' + fmt(p.timestamp) + "</span></div>" +
          "<p>" + esc(text) + '</p><span class="card__more">Veure a Instagram</span></div></a>';
      }).join("");
      feedBox.insertAdjacentHTML("afterbegin", html);
    }).catch(function () { /* si falla, queda el bloc "Segueix-nos" */ });
  }

  /* ---------- Formulari de contacte ---------- */
  var form = $("#formulari");
  if (form) {
    var params = new URLSearchParams(location.search), m = params.get("motiu");
    if (m === "reunio") $("#m-reunio").checked = true;
    if (m === "feina") $("#m-feina").checked = true;
    var label = $("#c-msg-label"), send = $("#c-send");
    var TXT = U.form;

    function sync() {
      var v = $("input[name=motiu]:checked").value;
      $$(".org").forEach(function (o) { o.hidden = v !== "Sol·licitar una reunió"; });
      var cvBox = $(".cv"), cvIn = $("#c-cv");
      if (cvBox && cvIn) { var isJob = v === "Treballar amb nosaltres"; cvBox.hidden = !isJob; cvIn.disabled = !isJob; cvIn.required = isJob; }
      label.textContent = TXT[v][0]; send.textContent = TXT[v][1];
    }
    $$("input[name=motiu]").forEach(function (r) { r.addEventListener("change", sync); });
    var cvInput = $("#c-cv");
    if (cvInput) cvInput.addEventListener("change", function () {
      var f = cvInput.files && cvInput.files[0];
      cvInput.setCustomValidity(f && f.size > 5 * 1024 * 1024 ? cvInput.getAttribute("data-toobig") : "");
      cvInput.reportValidity();
    });
    form.addEventListener("submit", function () {
      var v = $("input[name=motiu]:checked").value;
      form.querySelector("[name=_next]").value = new URL(LOGOS_PFX + "gracies.html", location.href).href;
      form.querySelector("[name=_subject]").value = "Web Logos – " + v;
      form.querySelector("[name=idioma]").value = LOGOS_LANG.toUpperCase();
      form.querySelectorAll(".org[hidden] input, .org[hidden] select").forEach(function (f) { f.disabled = true; });
    });
    sync();
  }
})();

/* ===== Carrusel automàtic: Xarxes i plataformes (amb pausa) ===== */
(function () {
  var track = document.querySelector("#membres .members");
  if (!track) return;
  var L = {
    ca: ["Anterior", "Següent", "Pausa", "Reprendre", "Xarxes i plataformes"],
    es: ["Anterior", "Siguiente", "Pausa", "Reanudar", "Redes y plataformas"],
    en: ["Previous", "Next", "Pause", "Play", "Networks and platforms"],
    fr: ["Précédent", "Suivant", "Pause", "Reprendre", "Réseaux et plateformes"],
    ar: ["السابق", "التالي", "إيقاف مؤقت", "استئناف", "الشبكات والمنصات"]
  }[LOGOS_LANG] || null;
  L = L || ["Anterior", "Següent", "Pausa", "Reprendre", "Xarxes"];
  var rtl = document.documentElement.dir === "rtl";
  var reduce = logosQuiet();
  track.classList.add("members--carousel");
  track.setAttribute("tabindex", "0");
  track.setAttribute("aria-label", L[4]);
  var ico = function (d) { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; };
  var PAUSE = "M9 5v14M15 5v14", PLAY = "M8 5l11 7-11 7z";
  var bar = document.createElement("div");
  bar.className = "carousel-ctrl";
  bar.innerHTML =
    '<button type="button" class="carousel-btn" data-dir="-1" aria-label="' + L[0] + '">' + ico("M15 6l-6 6 6 6") + '</button>' +
    '<button type="button" class="carousel-btn carousel-btn--play" aria-label="' + L[2] + '">' + ico(PAUSE) + '</button>' +
    '<button type="button" class="carousel-btn" data-dir="1" aria-label="' + L[1] + '">' + ico("M9 6l6 6-6 6") + '</button>';
  track.parentNode.insertBefore(bar, track.nextSibling);
  var playBtn = bar.querySelector(".carousel-btn--play");
  var userPaused = reduce, hover = false, timer = null;

  function step() {
    var card = track.querySelector(".member");
    if (!card) return 0;
    return card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16);
  }
  function go(dir) {
    var max = track.scrollWidth - track.clientWidth;
    var pos = Math.abs(track.scrollLeft);
    var s = rtl ? -1 : 1;
    if (dir > 0 && pos >= max - 4) { track.scrollTo({ left: 0, behavior: "smooth" }); return; }
    if (dir < 0 && pos <= 4) { track.scrollTo({ left: s * max, behavior: "smooth" }); return; }
    track.scrollBy({ left: s * dir * step(), behavior: "smooth" });
  }
  function setIcon() {
    playBtn.innerHTML = ico(userPaused ? PLAY : PAUSE);
    playBtn.setAttribute("aria-label", userPaused ? L[3] : L[2]);
    playBtn.setAttribute("aria-pressed", String(userPaused));
  }
  function tick() { if (!userPaused && !hover && !document.hidden && !logosQuiet()) go(1); }
  function start() { clearInterval(timer); timer = setInterval(tick, 3500); }
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b === playBtn) { userPaused = !userPaused; setIcon(); }
    else { go(+b.getAttribute("data-dir")); start(); }
  });
  ["mouseenter", "focusin", "touchstart"].forEach(function (ev) { track.addEventListener(ev, function () { hover = true; }, { passive: true }); });
  ["mouseleave", "focusout", "touchend"].forEach(function (ev) { track.addEventListener(ev, function () { setTimeout(function () { hover = false; }, ev === "touchend" ? 4000 : 0); }, { passive: true }); });
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { go(rtl ? -1 : 1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { go(rtl ? 1 : -1); e.preventDefault(); }
  });
  setIcon(); start();
})();

/* Hero slideshow */
(function () {
  var box = document.querySelector(".hero__slides"); if (!box) return;
  var s = box.querySelectorAll(".hero__slide"), d = box.querySelectorAll(".hero__dots span"), i = 0;
  if (s.length < 2 || logosQuiet()) return;
  setInterval(function () {
    if (document.hidden || logosQuiet()) return;
    s[i].classList.remove("is-on"); d[i] && d[i].classList.remove("is-on");
    i = (i + 1) % s.length;
    s[i].loading = "eager"; s[i].classList.add("is-on"); d[i] && d[i].classList.add("is-on");
  }, 5000);
})();

/* Galeria coverflow */
(function () {
  var g = document.getElementById("galeria"); if (!g) return;
  var sl = g.querySelectorAll(".gal__slide"), dots = g.querySelectorAll(".gal__dots button"), n = sl.length, cur = 1, timer;
  var rtl = document.documentElement.dir === "rtl";
  var reduce = logosQuiet();
  function render() {
    for (var k = 0; k < n; k++) {
      var off = (k - cur + n) % n; if (off > n / 2) off -= n;
      if (rtl) off = -off;
      sl[k].className = "gal__slide" + (off === 0 ? " is-0" : off === 1 ? " is-1" : off === -1 ? " is-m1" : off === 2 ? " is-2" : off === -2 ? " is-m2" : "");
      sl[k].setAttribute("aria-hidden", off === 0 ? "false" : "true");
      sl[k].tabIndex = off === 0 ? 0 : -1;
      dots[k] && dots[k].classList.toggle("is-on", k === cur);
    }
  }
  function go(i) { cur = (i + n) % n; render(); }
  function start() { if (reduce) return; stop(); timer = setInterval(function () { if (!document.hidden && !logosQuiet()) go(cur + 1); }, 4500); }
  function stop() { clearInterval(timer); }
  g.querySelector(".gal__nav--prev").addEventListener("click", function () { go(cur - 1); start(); });
  g.querySelector(".gal__nav--next").addEventListener("click", function () { go(cur + 1); start(); });
  dots.forEach(function (d, k) { d.addEventListener("click", function () { go(k); start(); }); });
  sl.forEach(function (s, k) { s.addEventListener("click", function (e) { if (k !== cur) { e.preventDefault(); go(k); start(); } }); });
  var st = g.querySelector(".gal__stage"), x0 = null;
  st.addEventListener("mouseenter", stop); st.addEventListener("mouseleave", start);
  st.addEventListener("focusin", stop); st.addEventListener("focusout", start);
  st.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  st.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + ((dx < 0) !== rtl ? 1 : -1)); x0 = null; start(); });
  render(); start();
})();

/* Xifres que pugen: «El nostre impacte» com una diapositiva. Cada número puja de 0 (o de l'anterior) fins al seu valor. */
(function () {
  var quiet = logosQuiet();
  var lang = (document.documentElement.lang || "ca").slice(0, 2);
  var loc = { ca: "ca-ES", es: "es-ES", en: "en-GB", fr: "fr-FR" }[lang] || "ca-ES";
  window.LogosCompta = function (el) {
    if (!el) return;
    var txt = el.textContent.trim(), m = txt.match(/^([^0-9]*)([0-9][0-9.,\s]*)(.*)$/); if (!m) return;
    var fi = parseInt(m[2].replace(/[^0-9]/g, ""), 10); if (!fi) return;
    var ini = Number(el.getAttribute("data-shown") || 0); el.setAttribute("data-shown", fi);
    var put = function (v) { el.textContent = m[1] + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === "en" ? "," : (lang === "fr" ? "\u202f" : ".")) + m[3]; };
    if (quiet) { put(fi); return; }
    var dur = 1200 + Math.min(1000, Math.log(fi + 1) * 120), t0 = null;
    var pas = function (t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur); put(ini + (fi - ini) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(pas); };
    requestAnimationFrame(pas);
  };
  var sec = document.querySelector(".stats"); if (!sec) return;
  var go = function () {
    sec.classList.add("is-in"); window.__logosStatsIn = true;
    Array.prototype.forEach.call(sec.querySelectorAll(".stat > b"), function (b) { if (!b.hasAttribute("data-live")) window.LogosCompta(b); });
  };
  if ("IntersectionObserver" in window && !quiet) { sec.classList.add("anim"); var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); go(); } }, { threshold: 0.25 }); io.observe(sec); } else go();
})();

/* Anys d'experiència: es calcula sol cada any */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll("[data-since]"), function (el) {
    var y = new Date().getFullYear() - parseInt(el.getAttribute("data-since"), 10);
    if (y > 0) el.textContent = "+" + y;
  });
})();


/* Persones ateses: xifra en directe des de la Intranet (Història pública) */
(function () {
  var box = document.querySelector("[data-historia]"); if (!box || !window.fetch) return;
  var U = "https://foxtlpyfedwsvttzorql.supabase.co", K = "sb_publishable_Ght82ml0pvg0_nQvunlXVA_u0WjRscq";
  var lang = (document.documentElement.lang || "ca").slice(0, 2);
  var loc = { ca: "ca-ES", es: "es-ES", en: "en-GB", fr: "fr-FR", ar: "ar" }[lang] || "ca-ES";
  var S = { ca: "Persones acompanyades per Logos des del %s.", es: "Personas acompañadas por Logos desde %s.", en: "People supported by Logos since %s.", fr: "Personnes accompagnées par Logos depuis %s.", ar: "أشخاص رافقتهم لوغوس منذ %s." };
  fetch(U + "/rest/v1/rpc/historia_publica", { method: "POST", headers: { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" }, body: "{}" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) {
      if (!d || !d.total) return;
      box.querySelector("b").textContent = Number(d.total).toLocaleString(loc === "ar" ? "ca-ES" : loc);
      if (window.__logosStatsIn && window.LogosCompta) window.LogosCompta(box.querySelector("b"));
      var anys = (d.por_anio || []).filter(function (x) { return x && x.personas && Number(x.anio) >= 2000; });   // < 2000 = data mal escrita
      var desde = Number(d.desde) >= 2000 ? d.desde : (anys.length ? Math.min.apply(null, anys.map(function (x) { return Number(x.anio); })) : null);
      if (desde) box.querySelector("span").textContent = (S[lang] || S.ca).replace("%s", desde);
      if (anys.length) {
        var L = { ca: "Veure per anys", es: "Ver por años", en: "See by year", fr: "Voir par année", ar: "عرض حسب السنة" }[lang] || "Veure per anys";
        var m = Math.max.apply(null, anys.map(function (x) { return x.personas; }));
        var fmt = function (n) { return Number(n).toLocaleString(loc === "ar" ? "ca-ES" : loc); };
        var det = document.createElement("details"); det.className = "stat__years";
        det.innerHTML = "<summary>" + L + "</summary>" + anys.map(function (x) {
          return '<div class="yr"><span>' + x.anio + '</span><i><b style="width:' + Math.max(3, Math.round(x.personas / m * 100)) + '%"></b></i><strong>' + fmt(x.personas) + "</strong></div>";
        }).join("");
        box.appendChild(det);
      }
    })
    .catch(function () {});
})();

/* Transparència: pestanyes */
(function () {
  var tabs = document.querySelectorAll(".fx-tab"); if (!tabs.length) return;
  function show(t) {
    Array.prototype.forEach.call(tabs, function (b) {
      var on = b === t; b.setAttribute("aria-selected", on ? "true" : "false"); b.tabIndex = on ? 0 : -1;
      var p = document.getElementById(b.getAttribute("aria-controls")); if (p) p.hidden = !on;
    });
  }
  Array.prototype.forEach.call(tabs, function (b, i) {
    b.addEventListener("click", function () { show(b); });
    b.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
      if (document.documentElement.dir === "rtl") d = -d;
      var n = tabs[(i + d + tabs.length) % tabs.length]; show(n); n.focus(); e.preventDefault();
    });
  });
  show(tabs[0]);
})();


/* Vegades que hem atès: cada atenció i actuació compta (també l'històric). Xifra en directe des de la Intranet (cifras_publicas).
   Només totals, mai dades personals. Si no es pot carregar, no es mostra res. */
(function () {
  var ref = document.querySelector("[data-historia]"); if (!ref || !window.fetch) return;
  var U = "https://foxtlpyfedwsvttzorql.supabase.co", K = "sb_publishable_Ght82ml0pvg0_nQvunlXVA_u0WjRscq";
  var lang = (document.documentElement.lang || "ca").slice(0, 2);
  var loc = { ca: "ca-ES", es: "es-ES", en: "en-GB", fr: "fr-FR", ar: "ca-ES" }[lang] || "ca-ES";
  var T = {
    ca: ["vegades que hem atès", "Cada atenció i cada actuació compta, també quan la persona torna. Des del %s.", "Veure per anys"],
    es: ["veces que hemos atendido", "Cada atención y cada actuación cuenta, también cuando la persona vuelve. Desde %s.", "Ver por años"],
    en: ["times we have supported people", "Every consultation and every action counts, including return visits. Since %s.", "See by year"],
    fr: ["fois où nous avons accompagné", "Chaque accueil et chaque démarche compte, y compris quand la personne revient. Depuis %s.", "Voir par année"],
    ar: ["مرة قدّمنا فيها المرافقة", "كل استقبال وكل إجراء يُحتسب، حتى عند عودة الشخص. منذ %s.", "عرض حسب السنة"]
  }[lang] || null;
  if (!T) return;
  var fmt = function (n) { return Number(n).toLocaleString(loc); };
  fetch(U + "/rest/v1/rpc/cifras_publicas", { method: "POST", headers: { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" }, body: "{}" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) {
      if (!d || !d.intervenciones) return;
      var anys = (d.por_anio || []).filter(function (x) { return x && x.veces && Number(x.anio) >= 2000; });
      var desde = Number(d.desde) >= 2000 ? d.desde : (anys.length ? anys[0].anio : "");
      var box = document.createElement("div"); box.className = "stat"; box.setAttribute("data-vegades", "");
      box.innerHTML = "<b data-live>0</b><strong>" + T[0] + "</strong><span>" + T[1].replace("%s", desde) + "</span>";
      ref.parentNode.insertBefore(box, ref.nextSibling);
      if (anys.length) {
        var m = Math.max.apply(null, anys.map(function (x) { return x.veces; }));
        var det = document.createElement("details"); det.className = "stat__years";
        det.innerHTML = "<summary>" + T[2] + "</summary>" + anys.map(function (x) {
          return '<div class="yr"><span>' + x.anio + '</span><i><b style="width:' + Math.max(3, Math.round(x.veces / m * 100)) + '%"></b></i><strong>' + fmt(x.veces) + "</strong></div>";
        }).join("");
        box.appendChild(det);
      }
      // la xifra puja de 0 fins al total quan es veu
      var el = box.querySelector("b"); el.textContent = fmt(Number(d.intervenciones));
      var go = function () { if (window.LogosCompta) window.LogosCompta(el); };
      if (window.__logosStatsIn || !("IntersectionObserver" in window)) go();
      else { var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); go(); } }, { threshold: 0.3 }); io.observe(box); }
    })
    .catch(function () {});
})();


/* Vídeos del canal (YouTube, Vimeo o MP4): es carreguen només quan es prem ▶ (sense galetes de YouTube abans) */
function canalVid(u){
  u = String(u || '').trim(); let m;
  if((m = u.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/i))) return { t: 'yt', src: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0', thumb: 'https://i.ytimg.com/vi/' + m[1] + '/hqdefault.jpg' };
  if((m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i))) return { t: 'vimeo', src: 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1&dnt=1' };
  if(/^https:\/\/[^\s"'<>]+\.(mp4|webm|mov|m4v)(\?[^\s"'<>]*)?$/i.test(u)) return { t: 'mp4', src: u };
  return null;
}
function canalVidHtml(url, poster, nombre, etiqueta, esc){
  const v = canalVid(url); if(!v) return '';
  const p = poster || v.thumb || '';
  return '<div class="vid" data-src="' + esc(v.src) + '" data-t="' + v.t + '"><button type="button" class="vid-play" aria-label="' + esc(etiqueta + ': ' + nombre) + '"' + (p ? ' style="background-image:url(\'' + esc(p) + '\')"' : '') + '><span aria-hidden="true">▶</span></button></div>';
}
if(!window.__vidClick){ window.__vidClick = true;
  document.addEventListener('click', function(e){
    const b = e.target.closest && e.target.closest('.vid-play'); if(!b) return;
    e.preventDefault(); e.stopPropagation();
    const w = b.parentNode, src = w.getAttribute('data-src'), t = w.getAttribute('data-t'); let el;
    if(t === 'mp4'){ el = document.createElement('video'); el.controls = true; el.autoplay = true; el.setAttribute('playsinline', ''); el.src = src; }
    else { el = document.createElement('iframe'); el.src = src; el.title = 'Vídeo'; el.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen'); el.setAttribute('allowfullscreen', ''); }
    w.innerHTML = ''; w.appendChild(w.ownerDocument.createTextNode('')); w.appendChild(el); w.classList.add('on');
    try { window.dispatchEvent(new Event('logos-video')); } catch(_){}
    setTimeout(function(){ try { el.focus(); } catch(_){} }, 50);
  }, true);
}

/* Canal de Logos: notícies, agenda i calendari en directe des de la Intranet (canal_publico). Només el que l'equip ha publicat. */
(function () {
  var sec = document.getElementById("actualitat"); if (!sec || !window.fetch) return;
  var wrap = sec.querySelector(".wrap") || sec;
  var U = "https://foxtlpyfedwsvttzorql.supabase.co", K = "sb_publishable_Ght82ml0pvg0_nQvunlXVA_u0WjRscq";
  var lang = (document.documentElement.lang || "ca").slice(0, 2);
  var loc = { ca: "ca-ES", es: "es-ES", en: "en-GB", fr: "fr-FR", ar: "ar" }[lang] || "ca-ES";
  var T = {
    ca: { eb: "Actualitat i agenda", h: "Què passa a Logos", nov: "Notícies i anuncis", ag: "Agenda", cal: "Afegir al calendari", mes: "Llegir més", menys: "Llegir menys", buit: "Aviat publicarem les properes activitats.", tipus: { noticia: "Notícia", evento: "Activitat", anuncio: "Anunci", convocatoria: "Convocatòria" }, ant: "Mes anterior", seg: "Mes següent", dies: ["dl", "dt", "dc", "dj", "dv", "ds", "dg"], tots: "Veure totes les activitats" },
    es: { eb: "Actualidad y agenda", h: "Qué pasa en Logos", nov: "Noticias y anuncios", ag: "Agenda", cal: "Añadir al calendario", mes: "Leer más", menys: "Leer menos", buit: "Pronto publicaremos las próximas actividades.", tipus: { noticia: "Noticia", evento: "Actividad", anuncio: "Anuncio", convocatoria: "Convocatoria" }, ant: "Mes anterior", seg: "Mes siguiente", dies: ["lu", "ma", "mi", "ju", "vi", "sá", "do"], tots: "Ver todas las actividades" },
    en: { eb: "News and events", h: "What's on at Logos", nov: "News and notices", ag: "Events", cal: "Add to calendar", mes: "Read more", menys: "Read less", buit: "Upcoming activities will be published soon.", tipus: { noticia: "News", evento: "Event", anuncio: "Notice", convocatoria: "Call" }, ant: "Previous month", seg: "Next month", dies: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], tots: "See all events" },
    fr: { eb: "Actualités et agenda", h: "Ce qui se passe à Logos", nov: "Actualités et annonces", ag: "Agenda", cal: "Ajouter au calendrier", mes: "Lire la suite", menys: "Réduire", buit: "Les prochaines activités seront bientôt publiées.", tipus: { noticia: "Actualité", evento: "Activité", anuncio: "Annonce", convocatoria: "Appel" }, ant: "Mois précédent", seg: "Mois suivant", dies: ["lu", "ma", "me", "je", "ve", "sa", "di"], tots: "Voir toutes les activités" },
    ar: { eb: "المستجدات والأجندة", h: "ماذا يحدث في لوغوس", nov: "أخبار وإعلانات", ag: "الأجندة", cal: "أضف إلى التقويم", mes: "اقرأ المزيد", menys: "أقل", buit: "سننشر الأنشطة القادمة قريبًا.", tipus: { noticia: "خبر", evento: "نشاط", anuncio: "إعلان", convocatoria: "دعوة" }, ant: "الشهر السابق", seg: "الشهر التالي", dies: ["ن", "ث", "ر", "خ", "ج", "س", "ح"], tots: "عرض كل الأنشطة" }
  }[lang] || null; if (!T) return;
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var tit = function (x) { return lang === "ca" && x.titulo_ca ? x.titulo_ca : x.titulo; };
  var txt = function (x) { return lang === "ca" && x.texto_ca ? x.texto_ca : (x.texto || ""); };
  var dia = function (d, o) { return new Date(d + "T00:00:00").toLocaleDateString(loc, o); };
  var hora = function (x) { return x.hora_inicio ? String(x.hora_inicio).slice(0, 5) + (x.hora_fin ? "–" + String(x.hora_fin).slice(0, 5) : "") : ""; };
  var iso = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  window.LogosICS = function (x, titol, text) {
    var f = String(x.fecha_evento).replace(/-/g, ""), ff = String(x.fecha_fin || x.fecha_evento).replace(/-/g, "");
    var lin = function (v) { return String(v || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1"); };
    var fiDia = new Date(String(x.fecha_fin || x.fecha_evento) + "T00:00:00"); fiDia.setDate(fiDia.getDate() + 1);
    var ini = x.hora_inicio ? "DTSTART:" + f + "T" + String(x.hora_inicio).slice(0, 5).replace(":", "") + "00" : "DTSTART;VALUE=DATE:" + f;
    var fi = x.hora_inicio ? "DTEND:" + ff + "T" + String(x.hora_fin || x.hora_inicio).slice(0, 5).replace(":", "") + "00" : "DTEND;VALUE=DATE:" + iso(fiDia).replace(/-/g, "");
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Associacio Logos//Canal//CA", "BEGIN:VEVENT", "UID:" + x.id + "@logostgn.cat", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z", ini, fi, "SUMMARY:" + lin(titol), x.lugar ? "LOCATION:" + lin(x.lugar) : "", "DESCRIPTION:" + lin(text + (x.enlace ? "\n" + x.enlace : "")), "END:VEVENT", "END:VCALENDAR"].filter(Boolean).join("\r\n");
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "logos-" + f + ".ics"; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  fetch(U + "/rest/v1/rpc/canal_publico", { method: "POST", headers: { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" }, body: JSON.stringify({ p_donde: "web" }) })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (L) {
      if (!Array.isArray(L)) return; L = L.filter(function (x) { return x.tipo !== "publicidad"; }); if (!L.length) return;
      var hoy = iso(new Date());
      var ev = L.filter(function (x) { return x.tipo !== "publicidad" && x.fecha_evento && (x.fecha_fin || x.fecha_evento) >= hoy; }).sort(function (a, b) { return a.fecha_evento < b.fecha_evento ? -1 : 1; });
      var nov = L.filter(function (x) { return x.tipo !== "publicidad" && x.tipo !== "articulo" && (!x.fecha_evento || x.tipo !== "evento"); }).slice(0, 6);   // los artículos del blog van en su franja (blog.js)
      window.__logosCanal = { L: L, ev: ev };
      var card = function (x) {
        var t = txt(x), llarg = t.length > 220;
        var vh = x.video_url ? canalVidHtml(x.video_url, x.imagen_url, tit(x), ({ ca: "Veure el vídeo", es: "Ver el vídeo", en: "Watch the video", fr: "Voir la vidéo", ar: "شاهد الفيديو" })[lang] || "Vídeo", esc) : "";
        return '<article class="canal-card' + (x.destacado ? " is-dest" : "") + '">' + (vh || (x.imagen_url ? '<img src="' + esc(x.imagen_url) + '" alt="" loading="lazy">' : "")) +
          '<div class="canal-card__b"><span class="canal-tag t-' + esc(x.tipo) + '">' + esc(T.tipus[x.tipo] || "") + "</span>" +
          '<time datetime="' + esc((x.fecha_evento || x.publicar_desde || "").slice(0, 10)) + '">' + esc(dia((x.fecha_evento || x.publicar_desde).slice(0, 10), { day: "numeric", month: "long", year: "numeric" })) + "</time>" +
          "<h3>" + esc(tit(x)) + "</h3>" +
          (t ? (llarg ? '<details class="canal-mes"><summary><p>' + esc(t.slice(0, 220)) + '…</p><span>' + T.mes + "</span></summary><p>" + esc(t).replace(/\n/g, "<br>") + "</p></details>" : "<p>" + esc(t).replace(/\n/g, "<br>") + "</p>") : "") +
          (x.enlace ? '<a class="btn btn--gold btn--sm" href="' + esc(x.enlace) + '" target="_blank" rel="noopener">' + esc(x.enlace_texto || T.mes) + " →</a>" : "") + "</div></article>";
      };
      var agenda = function (llista) {
        return llista.length ? llista.slice(0, 8).map(function (x) {
          return '<li class="ag-it"><div class="ag-d"><b>' + esc(dia(x.fecha_evento, { day: "numeric" })) + "</b><span>" + esc(dia(x.fecha_evento, { month: "short" })) + "</span></div>" +
            '<div class="ag-x"><strong>' + esc(tit(x)) + "</strong><small>" + esc([dia(x.fecha_evento, { weekday: "long" }), hora(x), x.lugar].filter(Boolean).join(" · ")) + "</small>" +
            '<button type="button" class="ag-ics" data-id="' + esc(x.id) + '">📅 ' + T.cal + "</button></div></li>";
        }).join("") : '<li class="ag-buit">' + T.buit + "</li>";
      };
      var box = document.createElement("div"); box.className = "canal"; box.id = "canal-logos";
      box.innerHTML = '<div class="head head--single" style="margin-bottom:22px"><div><span class="eyebrow">' + T.eb + "</span><h2>" + T.h + "</h2></div></div>" +
        '<div class="canal__grid"><div class="canal__nov">' + (nov.length ? "<h3 class=\"canal__h\">" + T.nov + '</h3><div class="canal__cards">' + nov.map(card).join("") + "</div>" : "") + "</div>" +
        '<aside class="canal__ag"><h3 class="canal__h">' + T.ag + '</h3><div class="canal-cal" id="canal-cal"></div><ul class="ag-llista" id="ag-llista">' + agenda(ev) + "</ul></aside></div>";
      wrap.insertBefore(box, wrap.firstChild);
      var mes = new Date(); mes.setDate(1); if (ev.length) { var p = new Date(ev[0].fecha_evento + "T00:00:00"); mes = new Date(p.getFullYear(), p.getMonth(), 1); }
      var sel = null;
      var pinta = function () {
        var y = mes.getFullYear(), m = mes.getMonth(), n = new Date(y, m + 1, 0).getDate(), ini = (new Date(y, m, 1).getDay() + 6) % 7, h = "";
        for (var i = 0; i < ini; i++) h += "<span></span>";
        for (var d = 1; d <= n; d++) {
          var f = iso(new Date(y, m, d)), hi = ev.filter(function (x) { return x.fecha_evento <= f && (x.fecha_fin || x.fecha_evento) >= f; });
          h += hi.length ? '<button type="button" data-f="' + f + '" class="' + (f === hoy ? "hoy " : "") + (sel === f ? "sel" : "") + '" aria-label="' + esc(d + ": " + hi.map(tit).join(", ")) + '">' + d + "<i></i></button>" : '<span class="' + (f === hoy ? "hoy" : "") + '">' + d + "</span>";
        }
        var nom = mes.toLocaleDateString(loc, { month: "long", year: "numeric" });
        document.getElementById("canal-cal").innerHTML = '<div class="cc-h"><button type="button" data-m="-1" aria-label="' + T.ant + '">‹</button><strong>' + esc(nom.charAt(0).toUpperCase() + nom.slice(1)) + '</strong><button type="button" data-m="1" aria-label="' + T.seg + '">›</button></div><div class="cc-g">' + T.dies.map(function (x) { return "<b>" + x + "</b>"; }).join("") + h + "</div>";
      };
      pinta();
      box.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.m) { mes = new Date(mes.getFullYear(), mes.getMonth() + Number(b.dataset.m), 1); pinta(); }
        else if (b.dataset.f) { sel = sel === b.dataset.f ? null : b.dataset.f; pinta(); document.getElementById("ag-llista").innerHTML = agenda(sel ? ev.filter(function (x) { return x.fecha_evento <= sel && (x.fecha_fin || x.fecha_evento) >= sel; }) : ev); }
        else if (b.classList.contains("ag-ics")) { var x = L.filter(function (q) { return q.id === b.dataset.id; })[0]; if (x) window.LogosICS(x, tit(x), txt(x)); }
      });
    })
    .catch(function () {});
})();


/* Publicitat d'entitats amb contracte: carrusel amb etiqueta «Publicitat», pausa i comptador de vistes i clics (canal_publico + canal_contar) */
(function () {
  var after = document.getElementById("actualitat"); if (!after || !window.fetch) return;
  var U = "https://foxtlpyfedwsvttzorql.supabase.co", K = "sb_publishable_Ght82ml0pvg0_nQvunlXVA_u0WjRscq";
  var H = { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" };
  var lang = (document.documentElement.lang || "ca").slice(0, 2), ca = lang === "ca";
  var T = { ca: ["Entitats que ens acompanyen", "Espai patrocinat", "Publicitat", "Més informació", "Pausa", "Reprendre", "Anunci anterior", "Anunci següent", "Anunci"],
    es: ["Entidades que nos acompañan", "Espacio patrocinado", "Publicidad", "Más información", "Pausa", "Reanudar", "Anuncio anterior", "Anuncio siguiente", "Anuncio"],
    en: ["Organisations that support us", "Sponsored space", "Advertising", "More information", "Pause", "Resume", "Previous ad", "Next ad", "Ad"],
    fr: ["Les entités qui nous accompagnent", "Espace sponsorisé", "Publicité", "En savoir plus", "Pause", "Reprendre", "Annonce précédente", "Annonce suivante", "Annonce"],
    ar: ["الجهات التي ترافقنا", "مساحة مموّلة", "إعلان", "مزيد من المعلومات", "إيقاف", "استئناف", "الإعلان السابق", "الإعلان التالي", "إعلان"] }[lang]; if (!T) return;
  var E = { azul: ["#16325A", "#1F66C1", "#FFFFFF", "#F2BC2C"], oro: ["#F2BC2C", "#FFE08A", "#16325A", "#16325A"], verde: ["#14532D", "#2E8B57", "#FFFFFF", "#FDE68A"], coral: ["#9A3412", "#EA580C", "#FFFFFF", "#FFF4D6"], violeta: ["#3B0764", "#7C3AED", "#FFFFFF", "#FDE68A"], noche: ["#0F172A", "#334155", "#FFFFFF", "#F2BC2C"] };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var cont = function (ids, que) { try { fetch(U + "/rest/v1/rpc/canal_contar", { method: "POST", headers: H, body: JSON.stringify({ p_ids: ids, p_que: que }), keepalive: true }); } catch (e) {} };
  fetch(U + "/rest/v1/rpc/canal_publico", { method: "POST", headers: H, body: JSON.stringify({ p_donde: "web" }) })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (L) {
      var A = (L || []).filter(function (x) { return x.tipo === "publicidad"; }); if (!A.length) return;
      var slide = function (x, i) {
        var e = E[x.estilo] || E.azul, tit = ca && x.titulo_ca ? x.titulo_ca : x.titulo, tx = ca && x.texto_ca ? x.texto_ca : (x.texto || "");
        var et = '<span class="anu-et">' + T[2] + " · " + esc(x.entidad) + "</span>";
        if (x.video_url && canalVid(x.video_url)) {
          return '<div class="anu-sl" role="group" aria-roledescription="' + T[8] + '" aria-label="' + (i + 1) + " / " + A.length + '"' + (i ? " hidden" : "") + '><div class="anu anu-vid" style="background:linear-gradient(135deg,' + e[0] + "," + e[1] + ");color:" + e[2] + '">' + et +
            canalVidHtml(x.video_url, x.imagen_url, tit, ({ ca: "Veure el vídeo", es: "Ver el vídeo", en: "Watch the video", fr: "Voir la vidéo", ar: "شاهد الفيديو" })[lang] || "Vídeo", esc) +
            '<div class="anu-t"><strong>' + esc(tit) + "</strong>" + (tx ? "<p>" + esc(tx.slice(0, 200)) + "</p>" : "") + (x.enlace ? '<a class="anu-cta" href="' + esc(x.enlace) + '" target="_blank" rel="noopener sponsored" data-id="' + esc(x.id) + '" style="background:' + e[3] + ";color:" + e[0] + '">' + esc(x.enlace_texto || T[3]) + " →</a>" : "") + "</div></div></div>";
        }
        var inner = x.imagen_url && x.formato !== "cuadrado" ? et + '<img src="' + esc(x.imagen_url) + '" alt="' + esc(tit) + '" loading="lazy">'
          : et + (x.imagen_url ? '<img class="anu-foto" src="' + esc(x.imagen_url) + '" alt="" loading="lazy">' : '<i class="anu-deco" aria-hidden="true"></i>') +
            '<div class="anu-t"><strong>' + esc(tit) + "</strong>" + (tx ? "<p>" + esc(tx.slice(0, 200)) + "</p>" : "") + (x.enlace ? '<span class="anu-cta" style="background:' + e[3] + ";color:" + e[0] + '">' + esc(x.enlace_texto || T[3]) + " →</span>" : "") + "</div>";
        var cls = "anu " + (x.imagen_url && x.formato !== "cuadrado" ? "anu-img" : "anu-" + (x.formato === "cuadrado" ? "cua" : "hor"));
        var st = x.imagen_url && x.formato !== "cuadrado" ? "" : ' style="background:linear-gradient(135deg,' + e[0] + "," + e[1] + ");color:" + e[2] + '"';
        var tag = x.enlace ? 'a href="' + esc(x.enlace) + '" target="_blank" rel="noopener sponsored" data-id="' + esc(x.id) + '"' : "div";
        return '<div class="anu-sl" role="group" aria-roledescription="' + T[8] + '" aria-label="' + (i + 1) + " / " + A.length + '"' + (i ? " hidden" : "") + "><" + tag + ' class="' + cls + '"' + st + ">" + inner + "</" + tag.split(" ")[0] + "></div>";
      };
      var sec = document.createElement("section"); sec.className = "section--tight anuncis"; sec.setAttribute("aria-label", T[1]);
      sec.innerHTML = '<div class="wrap"><div class="anuncis__h"><div><span class="eyebrow">' + T[1] + "</span><h2>" + T[0] + "</h2></div>" +
        (A.length > 1 ? '<div class="anuncis__ctl"><button type="button" data-a="-1" aria-label="' + T[6] + '">‹</button><button type="button" data-a="p" aria-label="' + T[4] + '">❚❚</button><button type="button" data-a="1" aria-label="' + T[7] + '">›</button></div>' : "") +
        '</div><div class="anuncis__vp">' + A.map(slide).join("") + "</div>" +
        (A.length > 1 ? '<div class="anuncis__dots">' + A.map(function (x, i) { return '<button type="button" data-i="' + i + '" aria-label="' + (i + 1) + '"' + (i ? "" : ' aria-current="true"') + "></button>"; }).join("") + "</div>" : "") + "</div>";
      after.parentNode.insertBefore(sec, after.nextSibling);
      var sl = sec.querySelectorAll(".anu-sl"), dots = sec.querySelectorAll(".anuncis__dots button"), cur = 0, vistos = {}, timer = null;
      var quiet = logosQuiet(), pausat = quiet;
      var vist = function (i) { var id = A[i].id; if (!vistos[id]) { vistos[id] = 1; cont([id], "vista"); } };
      var mostra = function (i) {
        cur = (i + A.length) % A.length;
        Array.prototype.forEach.call(sl, function (s, k) { s.hidden = k !== cur; if (k === cur) { s.classList.remove("in"); void s.offsetWidth; s.classList.add("in"); } });
        Array.prototype.forEach.call(dots, function (d, k) { if (k === cur) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
        if (window.__anuVisible) vist(cur);
      };
      var play = function () { clearInterval(timer); if (!pausat && A.length > 1) timer = setInterval(function () { if (!logosQuiet()) mostra(cur + 1); }, 6500); var b = sec.querySelector('[data-a="p"]'); if (b) { b.textContent = pausat ? "▶" : "❚❚"; b.setAttribute("aria-label", pausat ? T[5] : T[4]); } };
      sec.addEventListener("click", function (e) {
        var b = e.target.closest("button"), a = e.target.closest("a[data-id]");
        if (a) cont([a.getAttribute("data-id")], "clic");
        if (!b) return;
        if (b.dataset.a === "p") { pausat = !pausat; play(); return; }
        if (b.dataset.a) { mostra(cur + Number(b.dataset.a)); play(); }
        if (b.dataset.i) { mostra(Number(b.dataset.i)); play(); }
      });
      window.addEventListener("logos-video", function () { if (sec.querySelector(".vid.on")) { pausat = true; play(); } });
      sec.addEventListener("mouseenter", function () { clearInterval(timer); }); sec.addEventListener("mouseleave", play);
      sec.addEventListener("focusin", function () { clearInterval(timer); }); sec.addEventListener("focusout", play);
      if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { window.__anuVisible = true; io.disconnect(); vist(cur); } }, { threshold: 0.5 }); io.observe(sec); } else { window.__anuVisible = true; vist(0); }
      mostra(0); play();
    })
    .catch(function () {});
})();
