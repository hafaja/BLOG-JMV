/* LOGOS 360 · Sección de investigación (artículos científicos) */
(function () {
  "use strict";
  var L = window.L360, P = window.Logos360Portadas, t = L.t, el = L.el;
  var lang = L.idioma();
  var todos = [], texto = "", claveSel = null;

  L.cabecera("investigacion"); L.pie();
  document.getElementById("titulo-sec").textContent = t("investigacion");
  document.getElementById("intro-sec").textContent = t("introInv");
  document.title = "LOGOS 360 · " + t("investigacion");
  var buscador = document.getElementById("buscador");
  buscador.placeholder = t("buscar"); buscador.setAttribute("aria-label", t("buscar"));
  var lista = document.getElementById("lista");
  lista.appendChild(el("p", "estado", t("cargando")));

  function enlace(a) { return "articulo.html?a=" + encodeURIComponent(a.slug) + "&lang=" + a.idioma; }

  function pintarLateral() {
    var lat = document.getElementById("lateral"); lat.innerHTML = "";
    var c1 = el("div", "caja");
    c1.appendChild(el("div", "cifra", String(todos.length)));
    c1.appendChild(el("div", "meta", t("investigacion")));
    lat.appendChild(c1);
    var cuenta = {};
    todos.forEach(function (a) { (a.palabras_clave || []).forEach(function (k) { k = k.trim().toLowerCase(); if (k) cuenta[k] = (cuenta[k] || 0) + 1; }); });
    var claves = Object.keys(cuenta).sort(function (a, b) { return cuenta[b] - cuenta[a]; }).slice(0, 14);
    if (claves.length) {
      var c2 = el("div", "caja"); c2.appendChild(el("h3", null, t("palabras")));
      var box = el("div", "chips");
      [null].concat(claves).forEach(function (k) {
        var b = el("button", "chip" + (claveSel === k ? " on" : ""), k || t("todo")); b.type = "button";
        b.setAttribute("aria-pressed", claveSel === k ? "true" : "false");
        b.addEventListener("click", function () { claveSel = k; pintar(); });
        box.appendChild(b);
      });
      c2.appendChild(box); lat.appendChild(c2);
    }
  }

  function pintar() {
    pintarLateral();
    lista.innerHTML = "";
    var q = texto.toLowerCase();
    var v = todos.filter(function (a) {
      if (claveSel && (a.palabras_clave || []).map(function (k) { return k.trim().toLowerCase(); }).indexOf(claveSel) < 0) return false;
      if (q && [a.titulo, a.resumen, a.autores, (a.palabras_clave || []).join(" ")].join(" ").toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    if (!todos.length) { lista.appendChild(el("p", "estado", t("vacio"))); return; }
    if (!v.length) { lista.appendChild(el("p", "estado", t("sinRes"))); return; }
    v.forEach(function (a) {
      var art = el("article", "paper");
      var im = el("img"); im.src = P.imagenDe(a, { ancho: 600, alto: 600, conTexto: false }); im.alt = ""; im.loading = "lazy";
      art.appendChild(im);
      var tx = el("div");
      var m = el("div", "meta");
      m.appendChild(el("span", "cat", a.categoria));
      m.appendChild(el("span", null, L.fecha(a.fecha_publicacion)));
      tx.appendChild(m);
      var h = el("h2"); var ln = el("a", null, a.titulo); ln.href = enlace(a); h.appendChild(ln); tx.appendChild(h);
      if (a.autores) tx.appendChild(el("div", "autores", a.autores));
      if (a.afiliacion) tx.appendChild(el("div", "afil", a.afiliacion));
      if (a.resumen) tx.appendChild(el("p", "abs", a.resumen));
      if ((a.palabras_clave || []).length) {
        var cl = el("div", "claves");
        a.palabras_clave.forEach(function (k) { cl.appendChild(el("span", "clave", k)); });
        tx.appendChild(cl);
      }
      var ac = el("div", "acciones");
      var l1 = el("a", null, t("leer") + " →"); l1.href = enlace(a); ac.appendChild(l1);
      if (a.pdf_url) { var l2 = el("a", null, t("pdf")); l2.href = a.pdf_url; l2.target = "_blank"; l2.rel = "noopener"; ac.appendChild(l2); }
      if (a.doi) { var l3 = el("a", null, "DOI " + a.doi); l3.href = "https://doi.org/" + a.doi.replace(/^https?:\/\/doi\.org\//, ""); ac.appendChild(l3); }
      tx.appendChild(ac);
      art.appendChild(tx); lista.appendChild(art);
    });
  }

  buscador.addEventListener("input", function () { texto = buscador.value.trim(); pintar(); });

  L.listar("cientifico", lang).then(function (d) { todos = d; pintar(); })
    .catch(function () { lista.innerHTML = ""; lista.appendChild(el("p", "estado", t("error"))); });
})();
