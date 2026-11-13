/* LOGOS 360 · Portada de divulgación */
(function () {
  "use strict";
  var L = window.L360, P = window.Logos360Portadas, t = L.t, el = L.el;
  var lang = L.idioma();
  var todos = [], filtroCat = null, texto = "";

  L.cabecera("divulgacion"); L.pie();
  document.getElementById("titulo-sec").textContent = t("divulgacion");
  document.getElementById("intro-sec").textContent = t("introDiv");
  document.title = "LOGOS 360 · " + t("divulgacion");
  var buscador = document.getElementById("buscador");
  buscador.placeholder = t("buscar"); buscador.setAttribute("aria-label", t("buscar"));
  document.getElementById("estado").textContent = t("cargando");

  function enlace(a) { return "articulo.html?a=" + encodeURIComponent(a.slug) + "&lang=" + a.idioma; }
  function img(a, alt) { var i = el("img"); i.src = P.imagenDe(a); i.alt = alt ? (a.imagen_alt || "") : ""; i.loading = "lazy"; return i; }
  function meta(a) {
    var m = el("div", "meta");
    m.appendChild(el("span", null, L.fecha(a.fecha_publicacion)));
    m.appendChild(el("span", null, "· " + L.minutos(a.contenido) + " " + t("min")));
    return m;
  }

  function pintarDestacado(a) {
    var z = document.getElementById("zona-destacado"); z.innerHTML = "";
    if (!a) return;
    var d = el("a", "destacado"); d.href = enlace(a);
    d.appendChild(img(a, true));
    var tx = el("div", "txt");
    tx.appendChild(el("span", "pildora", t("destacado") + " · " + a.categoria));
    tx.appendChild(el("h2", null, a.titulo));
    if (a.resumen) tx.appendChild(el("p", null, a.resumen));
    tx.appendChild(meta(a));
    d.appendChild(tx); z.appendChild(d);
  }

  function pintarChips() {
    var box = document.getElementById("chips"); box.innerHTML = "";
    var cats = [];
    todos.forEach(function (a) { if (cats.indexOf(a.categoria) < 0) cats.push(a.categoria); });
    if (cats.length < 2) return;
    [null].concat(cats).forEach(function (c) {
      var b = el("button", "chip" + (filtroCat === c ? " on" : ""), c || t("todas")); b.type = "button";
      b.setAttribute("aria-pressed", filtroCat === c ? "true" : "false");
      b.addEventListener("click", function () { filtroCat = c; pintar(); });
      box.appendChild(b);
    });
  }

  function pintar() {
    pintarChips();
    var hayFiltro = !!(filtroCat || texto);
    var dest = hayFiltro ? null : (todos.filter(function (a) { return a.destacado; })[0] || todos[0]);
    pintarDestacado(dest);
    var q = texto.toLowerCase();
    var lista = todos.filter(function (a) {
      if (dest && a.id === dest.id) return false;
      if (filtroCat && a.categoria !== filtroCat) return false;
      if (q && (a.titulo + " " + (a.resumen || "") + " " + (a.etiquetas || []).join(" ")).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var r = document.getElementById("rejilla"); r.innerHTML = "";
    var est = document.getElementById("estado");
    if (!todos.length) { est.hidden = false; est.textContent = t("vacio"); return; }
    if (!lista.length && hayFiltro) { est.hidden = false; est.textContent = t("sinRes"); return; }
    est.hidden = true;
    lista.forEach(function (a) {
      var c = el("a", "tarjeta"); c.href = enlace(a);
      c.appendChild(img(a, false));
      var tx = el("div", "txt");
      tx.appendChild(el("span", "meta", "")).appendChild(el("span", "cat", a.categoria));
      tx.appendChild(el("h3", null, a.titulo));
      if (a.resumen) tx.appendChild(el("p", null, a.resumen));
      tx.appendChild(meta(a));
      c.appendChild(tx); r.appendChild(c);
    });
  }

  buscador.addEventListener("input", function () { texto = buscador.value.trim(); pintar(); });

  L.listar("divulgacion", lang).then(function (d) { todos = d; pintar(); })
    .catch(function () { document.getElementById("estado").textContent = t("error"); });
})();
