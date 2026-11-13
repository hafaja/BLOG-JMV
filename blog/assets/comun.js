/* LOGOS 360 · Funciones comunes de la web pública */
(function (global) {
  "use strict";
  var CFG = global.LOGOS360_CONFIG || {};
  var DEMO = !CFG.supabaseUrl || /TU-PROYECTO/.test(CFG.supabaseUrl);

  var T = {
    es: { divulgacion: "Divulgación", investigacion: "Investigación", todas: "Todas", buscar: "Buscar artículos", leer: "Leer", min: "min de lectura",
          vacio: "Todavía no hay artículos publicados en este idioma.", sinRes: "No hay artículos que coincidan con la búsqueda.",
          error: "No se han podido cargar los artículos. Revisa tu conexión y vuelve a intentarlo.", cargando: "Cargando…",
          destacado: "Destacado", volver: "Volver", relacionados: "También te puede interesar", compartir: "Copiar enlace", copiado: "Enlace copiado",
          autores: "Autoría", afiliacion: "Afiliación", recibido: "Recibido", aceptado: "Aceptado", publicado: "Publicado", palabras: "Palabras clave",
          resumen: "Resumen", abstract: "Abstract", referencias: "Referencias", citar: "Cómo citar", pdf: "Descargar PDF", copiarCita: "Copiar cita",
          noEncontrado: "Este artículo no existe o ya no está publicado.", otrosIdiomas: "Leer en", demo: "Vista de ejemplo: conecta Supabase en config.js para ver los artículos reales.",
          introDiv: "Guías claras sobre derechos, trámites, bienestar y cuidados en Tarragona.",
          introInv: "Artículos científicos del equipo de Logos y colaboradores: psicología, gerontología, intervención social y educación.",
          pie: "Associació Logos - Projectes Socials · Tarragona", lecturas: "lecturas", todo: "Todo" },
    ca: { divulgacion: "Divulgació", investigacion: "Recerca", todas: "Totes", buscar: "Cerca articles", leer: "Llegir", min: "min de lectura",
          vacio: "Encara no hi ha articles publicats en aquest idioma.", sinRes: "No hi ha articles que coincideixin amb la cerca.",
          error: "No s'han pogut carregar els articles. Revisa la connexió i torna-ho a provar.", cargando: "Carregant…",
          destacado: "Destacat", volver: "Tornar", relacionados: "També et pot interessar", compartir: "Copia l'enllaç", copiado: "Enllaç copiat",
          autores: "Autoria", afiliacion: "Afiliació", recibido: "Rebut", aceptado: "Acceptat", publicado: "Publicat", palabras: "Paraules clau",
          resumen: "Resum", abstract: "Abstract", referencias: "Referències", citar: "Com citar", pdf: "Descarrega el PDF", copiarCita: "Copia la cita",
          noEncontrado: "Aquest article no existeix o ja no està publicat.", otrosIdiomas: "Llegeix en", demo: "Vista d'exemple: connecta Supabase a config.js per veure els articles reals.",
          introDiv: "Guies clares sobre drets, tràmits, benestar i cures a Tarragona.",
          introInv: "Articles científics de l'equip de Logos i col·laboradors: psicologia, gerontologia, intervenció social i educació.",
          pie: "Associació Logos - Projectes Socials · Tarragona", lecturas: "lectures", todo: "Tot" },
    fr: { divulgacion: "Vulgarisation", investigacion: "Recherche", todas: "Toutes", buscar: "Rechercher des articles", leer: "Lire", min: "min de lecture",
          vacio: "Aucun article publié dans cette langue pour le moment.", sinRes: "Aucun article ne correspond à la recherche.",
          error: "Impossible de charger les articles. Vérifiez votre connexion et réessayez.", cargando: "Chargement…",
          destacado: "À la une", volver: "Retour", relacionados: "À lire aussi", compartir: "Copier le lien", copiado: "Lien copié",
          autores: "Auteurs", afiliacion: "Affiliation", recibido: "Reçu", aceptado: "Accepté", publicado: "Publié", palabras: "Mots-clés",
          resumen: "Résumé", abstract: "Abstract", referencias: "Références", citar: "Comment citer", pdf: "Télécharger le PDF", copiarCita: "Copier la citation",
          noEncontrado: "Cet article n'existe pas ou n'est plus publié.", otrosIdiomas: "Lire en", demo: "Aperçu d'exemple : connectez Supabase dans config.js pour voir les vrais articles.",
          introDiv: "Des guides clairs sur les droits, les démarches, le bien-être et les soins à Tarragone.",
          introInv: "Articles scientifiques de l'équipe de Logos et de ses collaborateurs : psychologie, gérontologie, intervention sociale et éducation.",
          pie: "Associació Logos - Projectes Socials · Tarragone", lecturas: "lectures", todo: "Tout" },
    en: { divulgacion: "Guides", investigacion: "Research", todas: "All", buscar: "Search articles", leer: "Read", min: "min read",
          vacio: "No articles published in this language yet.", sinRes: "No articles match your search.",
          error: "Articles could not be loaded. Check your connection and try again.", cargando: "Loading…",
          destacado: "Featured", volver: "Back", relacionados: "You may also like", compartir: "Copy link", copiado: "Link copied",
          autores: "Authors", afiliacion: "Affiliation", recibido: "Received", aceptado: "Accepted", publicado: "Published", palabras: "Keywords",
          resumen: "Summary", abstract: "Abstract", referencias: "References", citar: "How to cite", pdf: "Download PDF", copiarCita: "Copy citation",
          noEncontrado: "This article does not exist or is no longer published.", otrosIdiomas: "Read in", demo: "Sample view: connect Supabase in config.js to see the real articles.",
          introDiv: "Clear guides on rights, procedures, wellbeing and care in Tarragona.",
          introInv: "Scientific articles by the Logos team and collaborators: psychology, gerontology, social intervention and education.",
          pie: "Associació Logos - Projectes Socials · Tarragona", lecturas: "reads", todo: "All" }
  };
  var LOCALES = { es: "es-ES", ca: "ca-ES", fr: "fr-FR", en: "en-GB" };
  var NOMBRES = { es: "Español", ca: "Català", fr: "Français", en: "English" };

  function idioma() {
    var q = new URLSearchParams(location.search).get("lang");
    var guardado = null; try { guardado = localStorage.getItem("logos360_lang"); } catch (e) {}
    var l = q || guardado || CFG.idiomaPorDefecto || "es";
    return T[l] ? l : "es";
  }
  function setIdioma(l) { try { localStorage.setItem("logos360_lang", l); } catch (e) {} }
  function t(k) { return (T[idioma()] || T.es)[k] || T.es[k] || k; }

  function fecha(iso) {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString(LOCALES[idioma()], { day: "numeric", month: "long", year: "numeric" }); }
    catch (e) { return iso.slice(0, 10); }
  }
  function minutos(txt) { return Math.max(1, Math.round(((txt || "").trim().split(/\s+/).length) / 200)); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  var cliente = null;
  function sb() {
    if (DEMO) return null;
    if (!cliente) cliente = global.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    return cliente;
  }

  var CAMPOS_LISTA = "id,slug,tipo,idioma,grupo_traduccion,categoria,titulo,resumen,contenido,etiquetas,imagen_modo,imagen_url,imagen_semilla,imagen_alt,autores,afiliacion,palabras_clave,doi,pdf_url,destacado,fecha_publicacion,lecturas";

  function listar(tipo, lang) {
    if (DEMO) return Promise.resolve(demo().filter(function (a) { return a.tipo === tipo && a.idioma === lang; }));
    return sb().from("logos360_articulos").select(CAMPOS_LISTA)
      .eq("estado", "publicado").eq("tipo", tipo).eq("idioma", lang)
      .order("destacado", { ascending: false }).order("fecha_publicacion", { ascending: false }).limit(200)
      .then(function (r) { if (r.error) throw r.error; return r.data || []; });
  }
  function porSlug(slug) {
    if (DEMO) return Promise.resolve(demo().filter(function (a) { return a.slug === slug; })[0] || null);
    return sb().from("logos360_articulos").select("*").eq("slug", slug).eq("estado", "publicado").maybeSingle()
      .then(function (r) { if (r.error) throw r.error; return r.data; });
  }
  function traducciones(grupo) {
    if (DEMO) return Promise.resolve(demo().filter(function (a) { return a.grupo_traduccion === grupo; }));
    return sb().from("logos360_articulos").select("slug,idioma").eq("grupo_traduccion", grupo).eq("estado", "publicado")
      .then(function (r) { return r.data || []; });
  }
  function relacionados(a) {
    return listar(a.tipo, a.idioma).then(function (l) {
      return l.filter(function (x) { return x.slug !== a.slug; })
        .sort(function (x, y) { return (y.categoria === a.categoria) - (x.categoria === a.categoria); }).slice(0, 3);
    });
  }
  function sumarLectura(slug) {
    if (DEMO) return;
    try { sb().rpc("logos360_sumar_lectura", { p_slug: slug }).then(function () {}); } catch (e) {}
  }

  /* Cita en formato APA 7 */
  function citaAPA(a) {
    var anio = a.fecha_publicacion ? new Date(a.fecha_publicacion).getFullYear() : "s. f.";
    var url = a.doi ? "https://doi.org/" + a.doi.replace(/^https?:\/\/doi\.org\//, "") : location.origin + location.pathname + "?a=" + a.slug;
    return (a.autores || "Associació Logos") + " (" + anio + "). " + a.titulo + ". LOGOS 360. " + url;
  }

  /* Cabecera común con navegación e idioma */
  function cabecera(activa) {
    var lang = idioma();
    var h = document.getElementById("cabecera");
    h.innerHTML = "";
    var w = el("div", "envoltorio barra");
    var marca = el("a", "marca"); marca.href = "index.html";
    marca.innerHTML = '<span class="marca-logo" aria-hidden="true">L</span><span>LOGOS <b>360</b></span>';
    w.appendChild(marca);
    var nav = el("nav", "nav"); nav.setAttribute("aria-label", "LOGOS 360");
    [["index.html", "divulgacion"], ["investigacion.html", "investigacion"]].forEach(function (n) {
      var a = el("a", activa === n[1] ? "activo" : "", t(n[1])); a.href = n[0]; nav.appendChild(a);
    });
    w.appendChild(nav);
    var sel = el("div", "idiomas"); sel.setAttribute("role", "group"); sel.setAttribute("aria-label", "Idioma");
    Object.keys(T).forEach(function (l) {
      var b = el("button", l === lang ? "on" : "", l.toUpperCase()); b.type = "button"; b.title = NOMBRES[l];
      b.setAttribute("aria-pressed", l === lang ? "true" : "false");
      b.addEventListener("click", function () {
        setIdioma(l);
        var u = new URL(location.href); u.searchParams.set("lang", l); u.searchParams.delete("a");
        location.href = activa === "articulo" ? (document.body.dataset.volver || "index.html") + "?lang=" + l : u.toString();
      });
      sel.appendChild(b);
    });
    w.appendChild(sel);
    h.appendChild(w);
    document.documentElement.lang = lang;
    if (DEMO) {
      var aviso = el("div", "aviso-demo", t("demo"));
      h.appendChild(aviso);
    }
  }

  function pie() {
    var f = document.getElementById("pie");
    if (!f) return;
    f.innerHTML = "";
    var w = el("div", "envoltorio pie-in");
    w.appendChild(el("span", null, "© " + new Date().getFullYear() + " " + t("pie")));
    var links = el("span", "pie-links");
    var e = CFG.enlaces || {};
    [["logostgn.cat", e.web], ["Logos Acompanya", e.acompanya]].forEach(function (l) {
      if (!l[1]) return; var a = el("a", null, l[0]); a.href = l[1]; links.appendChild(a);
    });
    var red = el("a", null, "Redacción"); red.href = "redaccion/"; links.appendChild(red);
    w.appendChild(links);
    f.appendChild(w);
  }

  /* Datos de ejemplo (solo si Supabase no está configurado) */
  function demo() {
    var hoy = Date.now(), dia = 86400000;
    function iso(n) { return new Date(hoy - n * dia).toISOString(); }
    var g1 = "g-jub", g2 = "g-emp";
    return [
      { id: "1", slug: "como-pedir-la-jubilacion", tipo: "divulgacion", idioma: "es", grupo_traduccion: g1, categoria: "Jubilación", titulo: "Cómo pedir la jubilación paso a paso", resumen: "Qué documentos necesitas, dónde se solicita y en qué te puede acompañar Logos.", contenido: "## Antes de empezar\n\nConsulta tu vida laboral y comprueba que tus datos son correctos.\n\n## Dónde se solicita\n\nLa solicitud se presenta ante la Seguridad Social, por internet o con cita previa. Confirma siempre los requisitos en la web oficial.\n\n## Cómo te ayuda Logos\n\nSi necesitas ayuda con la cita o con los documentos, pide cita en Logos.", etiquetas: ["jubilación", "trámites"], imagen_modo: "auto", imagen_semilla: 11, destacado: true, fecha_publicacion: iso(1), lecturas: 132 },
      { id: "1b", slug: "com-demanar-la-jubilacio", tipo: "divulgacion", idioma: "ca", grupo_traduccion: g1, categoria: "Jubilación", titulo: "Com demanar la jubilació pas a pas", resumen: "Quins documents necessites, on es demana i en què et pot acompanyar Logos.", contenido: "## Abans de començar\n\nConsulta la teva vida laboral.", etiquetas: ["jubilació"], imagen_modo: "auto", imagen_semilla: 11, destacado: true, fecha_publicacion: iso(1), lecturas: 40 },
      { id: "2", slug: "empadronamiento-en-tarragona", tipo: "divulgacion", idioma: "es", grupo_traduccion: "g-pad", categoria: "Trámites y derechos", titulo: "Empadronamiento en Tarragona: lo que tienes que saber", resumen: "El padrón abre la puerta a muchos servicios. Te explicamos por qué es importante y cómo hacerlo.", contenido: "## Por qué es importante\n\nEstar empadronado permite acceder a servicios municipales.\n\n## Cómo hacerlo\n\nPide cita en la oficina municipal y lleva tu documentación.", etiquetas: ["padrón"], imagen_modo: "auto", imagen_semilla: 22, fecha_publicacion: iso(3), lecturas: 210 },
      { id: "3", slug: "pequenos-habitos-de-bienestar", tipo: "divulgacion", idioma: "es", grupo_traduccion: "g-bien", categoria: "Bienestar", titulo: "Cinco pequeños hábitos que cuidan tu bienestar", resumen: "Gestos sencillos de psicología positiva para el día a día.", contenido: "## Agradecer\n\nAnotar tres cosas buenas al día ayuda a fijarse en lo positivo.\n\n## Moverse\n\nCaminar 20 minutos mejora el ánimo.", etiquetas: ["bienestar"], imagen_modo: "auto", imagen_semilla: 33, fecha_publicacion: iso(5), lecturas: 98 },
      { id: "4", slug: "cuidar-a-quien-cuida", tipo: "divulgacion", idioma: "es", grupo_traduccion: "g-cui", categoria: "Personas mayores y cuidados", titulo: "Cuidar a quien cuida: señales de sobrecarga", resumen: "Cómo reconocer el cansancio de las personas cuidadoras y dónde pedir apoyo.", contenido: "## Señales de alerta\n\nCansancio constante, aislamiento e irritabilidad.", etiquetas: ["cuidados"], imagen_modo: "auto", imagen_semilla: 44, fecha_publicacion: iso(8), lecturas: 77 },
      { id: "5", slug: "estimulacion-cognitiva-y-calidad-de-vida", tipo: "cientifico", idioma: "es", grupo_traduccion: g2, categoria: "Investigación", titulo: "Estimulación cognitiva y calidad de vida en personas mayores usuarias de servicios sociales comunitarios", resumen: "Estudio piloto sobre el efecto de un programa de estimulación cognitiva de 12 semanas en la calidad de vida percibida de personas mayores atendidas por una entidad social de Tarragona.", abstract_en: "Pilot study on the effect of a 12-week cognitive stimulation programme on perceived quality of life among older adults served by a social organisation in Tarragona.", contenido: "## Introducción\n\nEl envejecimiento de la población plantea nuevos retos para los servicios comunitarios.\n\n## Método\n\nEstudio cuasiexperimental pre-post. [DATO PENDIENTE]\n\n## Resultados\n\n[DATO PENDIENTE]\n\n## Discusión\n\n[DATO PENDIENTE]\n\n## Conclusiones\n\n[DATO PENDIENTE]", referencias: "Spector, A., Thorgrimsen, L., Woods, B., et al. (2003). Efficacy of an evidence-based cognitive stimulation therapy programme for people with dementia. British Journal of Psychiatry, 183(3), 248-254.", autores: "Hafashimana, J. M. V.; Equipo técnico de Logos", afiliacion: "Associació Logos - Projectes Socials, Tarragona", palabras_clave: ["estimulación cognitiva", "envejecimiento", "calidad de vida"], doi: "", etiquetas: [], imagen_modo: "auto", imagen_semilla: 55, fecha_publicacion: iso(2), fecha_recepcion: iso(60).slice(0, 10), fecha_aceptacion: iso(10).slice(0, 10), lecturas: 54, destacado: true },
      { id: "6", slug: "impacto-social-acompanamiento-digital", tipo: "cientifico", idioma: "es", grupo_traduccion: "g-imp", categoria: "Investigación", titulo: "Medir el impacto social del acompañamiento digital en trámites administrativos", resumen: "Propuesta de indicadores de resultado e impacto para servicios de acompañamiento ciudadano.", contenido: "## Introducción\n\n[DATO PENDIENTE]", autores: "Equipo técnico de Logos", afiliacion: "Associació Logos - Projectes Socials, Tarragona", palabras_clave: ["impacto social", "brecha digital"], etiquetas: [], imagen_modo: "auto", imagen_semilla: 66, fecha_publicacion: iso(20), lecturas: 31 }
    ];
  }

  global.L360 = { cfg: CFG, demo: DEMO, t: t, idioma: idioma, fecha: fecha, minutos: minutos, el: el, sb: sb,
    listar: listar, porSlug: porSlug, traducciones: traducciones, relacionados: relacionados, sumarLectura: sumarLectura,
    citaAPA: citaAPA, cabecera: cabecera, pie: pie, NOMBRES: NOMBRES };
})(window);
