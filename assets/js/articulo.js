/* LOGOS 360 · Página de artículo (divulgación y científico) */
(function () {
  "use strict";
  var L = window.L360, P = window.Logos360Portadas, t = L.t, el = L.el;
  var slug = new URLSearchParams(location.search).get("a") || "";
  var main = document.getElementById("principal");

  L.cabecera("articulo"); L.pie();

  function md(texto) {
    var html = window.marked ? window.marked.parse(texto || "") : (texto || "").replace(/</g, "&lt;");
    var limpio = window.DOMPurify ? window.DOMPurify.sanitize(html) : "";
    var d = el("div", "cuerpo"); d.innerHTML = limpio;
    d.querySelectorAll("table").forEach(function (tb) { var w = el("div", "tabla-scroll"); tb.parentNode.insertBefore(w, tb); w.appendChild(tb); });
    d.querySelectorAll("a[href^='http']").forEach(function (a) { a.target = "_blank"; a.rel = "noopener"; });
    return d;
  }
  function copiar(texto, boton) {
    var orig = boton.textContent;
    try {
      navigator.clipboard.writeText(texto).then(function () { boton.textContent = t("copiado"); setTimeout(function () { boton.textContent = orig; }, 1800); });
    } catch (e) {}
  }
  function meta(a) {
    var m = el("div", "meta");
    m.appendChild(el("span", "cat", a.categoria));
    m.appendChild(el("span", null, L.fecha(a.fecha_publicacion)));
    m.appendChild(el("span", null, "· " + L.minutos(a.contenido) + " " + t("min")));
    return m;
  }
  function seo(a, imagen) {
    document.title = a.titulo + " · LOGOS 360";
    var d = document.querySelector('meta[name="description"]'); if (d) d.content = a.resumen || a.titulo;
    [["og:title", a.titulo], ["og:description", a.resumen || ""], ["og:type", "article"]].forEach(function (p) {
      var m = document.createElement("meta"); m.setAttribute("property", p[0]); m.content = p[1]; document.head.appendChild(m);
    });
    if (a.tipo === "cientifico") {
      // Etiquetas que usa Google Académico
      var tags = [["citation_title", a.titulo], ["citation_publication_date", (a.fecha_publicacion || "").slice(0, 10).replace(/-/g, "/")], ["citation_journal_title", "LOGOS 360"], ["citation_language", a.idioma]];
      (a.autores || "").split(";").forEach(function (au) { if (au.trim()) tags.push(["citation_author", au.trim()]); });
      if (a.doi) tags.push(["citation_doi", a.doi]);
      if (a.pdf_url) tags.push(["citation_pdf_url", a.pdf_url]);
      tags.forEach(function (p) { var m = document.createElement("meta"); m.name = p[0]; m.content = p[1]; document.head.appendChild(m); });
    }
  }

  function pintar(a) {
    document.body.dataset.volver = a.tipo === "cientifico" ? "investigacion.html" : "index.html";
    main.innerHTML = "";
    var imgSrc = P.imagenDe(a, { ancho: 1600, alto: 460, conTexto: false });
    var portada = el("img", "portada-art"); portada.src = imgSrc; portada.alt = a.imagen_alt || "";
    main.appendChild(portada);
    seo(a, imgSrc);

    var w = el("article", "articulo");
    var v = el("a", "volver", "← " + t("volver")); v.href = document.body.dataset.volver + "?lang=" + a.idioma; w.appendChild(v);

    var tr = el("div", "traduc"); tr.hidden = true; w.appendChild(tr);
    L.traducciones(a.grupo_traduccion).then(function (lst) {
      var otros = lst.filter(function (x) { return x.idioma !== a.idioma; });
      if (!otros.length) return;
      tr.hidden = false; tr.appendChild(el("span", null, t("otrosIdiomas") + ":"));
      otros.forEach(function (x) { var l = el("a", null, L.NOMBRES[x.idioma]); l.href = "articulo.html?a=" + encodeURIComponent(x.slug) + "&lang=" + x.idioma; tr.appendChild(l); });
    });

    if (a.tipo === "cientifico") w.appendChild(el("span", "pildora", t("investigacion")));
    w.appendChild(el("h1", null, a.titulo));

    if (a.tipo === "cientifico") {
      var f = el("dl", "ficha");
      if (a.autores) { var d1 = el("div"); d1.appendChild(el("dt", null, t("autores"))); d1.appendChild(el("dd", null, a.autores)); f.appendChild(d1); }
      if (a.afiliacion) { var d2 = el("div"); d2.appendChild(el("dt", null, t("afiliacion"))); d2.appendChild(el("dd", null, a.afiliacion)); f.appendChild(d2); }
      var fe = el("div", "fechas");
      [["recibido", a.fecha_recepcion], ["aceptado", a.fecha_aceptacion], ["publicado", a.fecha_publicacion]].forEach(function (x) {
        if (!x[1]) return; var d = el("div"); d.appendChild(el("dt", null, t(x[0]))); d.appendChild(el("dd", null, L.fecha(x[1]))); fe.appendChild(d);
      });
      f.appendChild(fe);
      if (a.doi) { var d3 = el("div"); d3.appendChild(el("dt", null, "DOI")); var dd = el("dd"); var dl = el("a", null, a.doi); dl.href = "https://doi.org/" + a.doi.replace(/^https?:\/\/doi\.org\//, ""); dd.appendChild(dl); d3.appendChild(dd); f.appendChild(d3); }
      w.appendChild(f);
      if (a.resumen) { var r1 = el("section", "bloque-res"); r1.appendChild(el("h2", null, t("resumen"))); r1.appendChild(el("p", null, a.resumen)); w.appendChild(r1); }
      if (a.abstract_en) { var r2 = el("section", "bloque-res"); r2.lang = "en"; r2.appendChild(el("h2", null, t("abstract"))); r2.appendChild(el("p", null, a.abstract_en)); w.appendChild(r2); }
      if ((a.palabras_clave || []).length) {
        var pk = el("p", "meta"); pk.appendChild(el("strong", null, t("palabras") + ": ")); pk.appendChild(document.createTextNode(a.palabras_clave.join(" · "))); w.appendChild(pk);
      }
      var bt = el("div", "botones");
      if (a.pdf_url) { var bp = el("a", "boton", t("pdf")); bp.href = a.pdf_url; bp.target = "_blank"; bp.rel = "noopener"; bt.appendChild(bp); }
      var bc = el("button", "boton sec", t("compartir")); bc.type = "button"; bc.addEventListener("click", function () { copiar(location.href, bc); }); bt.appendChild(bc);
      w.appendChild(bt);
      w.appendChild(el("hr"));
    } else {
      if (a.resumen) w.appendChild(el("p", "entradilla", a.resumen));
      w.appendChild(meta(a));
    }

    w.appendChild(md(a.contenido));

    if (a.tipo === "cientifico") {
      var refs = (a.referencias || "").split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (refs.length) {
        var hr = el("h2", null, t("referencias")); hr.style.margin = "36px 0 12px"; w.appendChild(hr);
        var ol = el("ul", "referencias"); refs.forEach(function (r) { ol.appendChild(el("li", null, r)); }); w.appendChild(ol);
      }
      var ci = el("div", "cita");
      ci.appendChild(el("strong", null, t("citar") + " (APA 7)"));
      var txt = L.citaAPA(a); ci.appendChild(el("p", null, txt));
      var bcc = el("button", "boton sec", t("copiarCita")); bcc.type = "button"; bcc.addEventListener("click", function () { copiar(txt, bcc); }); ci.appendChild(bcc);
      w.appendChild(ci);
    } else {
      if ((a.etiquetas || []).length) { var et = el("div", "etiquetas"); a.etiquetas.forEach(function (x) { et.appendChild(el("span", "clave", "#" + x)); }); w.appendChild(et); }
      var b2 = el("div", "botones"); var bb = el("button", "boton sec", t("compartir")); bb.type = "button";
      bb.addEventListener("click", function () { copiar(location.href, bb); }); b2.appendChild(bb); w.appendChild(b2);
    }
    main.appendChild(w);

    L.relacionados(a).then(function (rel) {
      if (!rel.length) return;
      var s = el("section", "relacionados envoltorio"); s.appendChild(el("h2", null, t("relacionados")));
      var g = el("div", "rejilla"); g.style.paddingBottom = "0";
      rel.forEach(function (x) {
        var c = el("a", "tarjeta"); c.href = "articulo.html?a=" + encodeURIComponent(x.slug) + "&lang=" + x.idioma;
        var im = el("img"); im.src = P.imagenDe(x); im.alt = ""; im.loading = "lazy"; c.appendChild(im);
        var tx = el("div", "txt"); tx.appendChild(el("h3", null, x.titulo)); tx.appendChild(el("div", "meta", L.fecha(x.fecha_publicacion)));
        c.appendChild(tx); g.appendChild(c);
      });
      s.appendChild(g); main.appendChild(s);
    });

    L.sumarLectura(a.slug);
  }

  L.porSlug(slug).then(function (a) {
    if (!a) { main.innerHTML = ""; var w = el("div", "articulo"); w.appendChild(el("p", "estado", t("noEncontrado"))); var v = el("a", "boton", t("volver")); v.href = "index.html"; w.appendChild(v); main.appendChild(w); return; }
    pintar(a);
  }).catch(function () { main.innerHTML = ""; var w = el("div", "articulo"); w.appendChild(el("p", "estado", t("error"))); main.appendChild(w); });
})();
