/* LOGOS 360 · Módulo de redacción de la Intranet */
(function () {
  "use strict";
  var BASE = window.LOGOS360_CONFIG || {};
  var CFG = { supabaseUrl: BASE.supabaseUrl, supabaseAnonKey: BASE.supabaseAnonKey, blogUrl: "../", funcionIA: BASE.funcionIA || "logos360-ia" };
  var P = window.Logos360Portadas;
  var $ = function (id) { return document.getElementById(id); };
  var sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);

  var CAT_DIV = ["Bienestar", "Personas mayores y cuidados", "Trámites y derechos", "Jubilación", "Familias", "Educación",
    "Empleo y emprendimiento", "Salud y nutrición", "Deporte", "Servicios sociales", "Personas sin hogar", "Vivienda"];
  var CAT_CIE = ["Investigación"];
  var ESTADOS = { borrador: "Borrador", revision: "En revisión", publicado: "Publicado", archivado: "Archivado" };
  var IDIOMAS = { es: "Español", ca: "Català", fr: "Français", en: "English" };
  var PLANTILLA_CIE = "## Introducción\n\n\n\n## Método\n\n### Participantes\n\n\n\n### Instrumentos\n\n\n\n### Procedimiento\n\n\n\n## Resultados\n\n\n\n## Discusión\n\n\n\n## Conclusiones\n\n";

  var S = { user: null, aprobar: false, items: [], actual: null, filtroEstado: "", semilla: 1, imagenFile: null, pdfFile: null, quitarPdf: false, sucio: false };

  ["ver-blog"].forEach(function () { $("ver-blog").href = CFG.blogUrl || "#"; });

  /* ---------- utilidades ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function slugify(t) {
    return (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
  }
  function lista(txt) { return (txt || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean); }
  function fechaCorta(iso) { return iso ? new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : ""; }
  function aLocal(iso) { if (!iso) return ""; var d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); }
  function error(msg) { $("error").textContent = msg || ""; }
  function aviso(msg) { $("guardado").textContent = msg; }
  function ocupado(b, si, texto) { b.disabled = si; if (texto) { if (si) { b.dataset.t = b.textContent; b.textContent = texto; } else if (b.dataset.t) b.textContent = b.dataset.t; } }

  /* ---------- acceso ---------- */
  function sinAcceso(msg, conLogin) { $("acceso").hidden = false; $("app").hidden = true; $("acceso-msg").textContent = msg; $("login").hidden = !conLogin; }

  $("login").addEventListener("submit", function (e) {
    e.preventDefault(); $("l-err").textContent = ""; $("l-btn").disabled = true;
    sb.auth.signInWithPassword({ email: $("l-email").value.trim(), password: $("l-pass").value }).then(function (r) {
      $("l-btn").disabled = false;
      if (r.error) { $("l-err").textContent = "Correo o contraseña incorrectos."; return; }
      location.reload();
    });
  });
  $("btn-salir").addEventListener("click", function () { sb.auth.signOut().then(function () { location.reload(); }); });

  sb.auth.getSession().then(function (r) {
    var ses = r.data && r.data.session;
    if (!ses) return sinAcceso("Redacción de LOGOS 360. Entra con tu cuenta.", true);
    $("btn-salir").hidden = false;
    S.user = ses.user;
    $("quien").textContent = ses.user.email || "";
    return Promise.all([sb.rpc("logos360_es_editor"), sb.rpc("logos360_puede_aprobar")]).then(function (rs) {
      if (!rs[0].data) return sinAcceso("Tu cuenta no tiene permiso de edición en LOGOS 360. Pide a la administración que te dé de alta como editora o editor.", false);
      S.aprobar = !!rs[1].data;
      $("app").hidden = false;
      $("info-aprob").textContent = S.aprobar ? "Tienes permiso para aprobar y publicar." : "Puedes escribir y enviar a revisión. Publicar lo hace una persona con permiso de aprobación.";
      cargar();
    });
  }).catch(function () { sinAcceso("No se ha podido comprobar tu sesión. Recarga la página.", true); });

  /* ---------- lista ---------- */
  function cargar() {
    return sb.from("logos360_articulos")
      .select("id,slug,tipo,idioma,grupo_traduccion,categoria,titulo,estado,generado_ia,destacado,fecha_publicacion,actualizado_en,lecturas,imagen_modo,imagen_url,imagen_semilla")
      .order("actualizado_en", { ascending: false }).limit(500)
      .then(function (r) { if (r.error) { $("items").textContent = "No se ha podido cargar la lista: " + r.error.message; return; } S.items = r.data || []; pintarLista(); });
  }

  function pintarLista() {
    var cont = $("contadores"); cont.innerHTML = "";
    [""].concat(Object.keys(ESTADOS)).forEach(function (e) {
      var n = S.items.filter(function (a) { return !e || a.estado === e; }).length;
      var b = el("button", "cont" + (S.filtroEstado === e ? " on" : "") + (e ? " e-" + e : ""));
      b.type = "button";
      b.appendChild(el("b", null, String(n))); b.appendChild(el("span", null, e ? ESTADOS[e] : "Todos"));
      b.addEventListener("click", function () { S.filtroEstado = e; pintarLista(); });
      cont.appendChild(b);
    });

    var tipo = $("f-tipo").value, idi = $("f-idioma").value, q = $("f-buscar").value.trim().toLowerCase();
    var v = S.items.filter(function (a) {
      return (!S.filtroEstado || a.estado === S.filtroEstado) && (!tipo || a.tipo === tipo) && (!idi || a.idioma === idi) && (!q || a.titulo.toLowerCase().indexOf(q) >= 0);
    });
    var box = $("items"); box.innerHTML = "";
    if (!v.length) { box.appendChild(el("p", "nota", S.items.length ? "No hay artículos con estos filtros." : "Aún no hay artículos. Crea el primero.")); return; }
    v.forEach(function (a) {
      var it = el("button", "item" + (S.actual && S.actual.id === a.id ? " on" : "")); it.type = "button";
      var im = el("img"); im.src = P.imagenDe(a, { ancho: 240, alto: 240, conTexto: false }); im.alt = ""; it.appendChild(im);
      var tx = el("div");
      tx.appendChild(el("strong", null, a.titulo || "(sin título)"));
      var m = el("div", "item-meta");
      m.appendChild(el("span", "pt e-" + a.estado, ESTADOS[a.estado]));
      m.appendChild(el("span", null, a.idioma.toUpperCase()));
      if (a.tipo === "cientifico") m.appendChild(el("span", "pt cie", "Científico"));
      if (a.generado_ia) m.appendChild(el("span", "pt ia", "IA"));
      if (a.estado === "publicado") m.appendChild(el("span", null, a.lecturas + " lecturas"));
      tx.appendChild(m); it.appendChild(tx);
      it.addEventListener("click", function () { abrir(a.id); });
      box.appendChild(it);
    });
  }
  ["f-tipo", "f-idioma"].forEach(function (id) { $(id).addEventListener("change", pintarLista); });
  $("f-buscar").addEventListener("input", pintarLista);

  /* ---------- editor ---------- */
  function categorias(tipo, sel) {
    var s = $("a-cat"); s.innerHTML = "";
    (tipo === "cientifico" ? CAT_CIE.concat(["Psicología", "Gerontología", "Neuropsicología", "Intervención social", "Educación"]) : CAT_DIV)
      .forEach(function (c) { var o = el("option", null, c); o.value = c; s.appendChild(o); });
    if (sel) { if (![].some.call(s.options, function (o) { return o.value === sel; })) { var o = el("option", null, sel); o.value = sel; s.appendChild(o); } s.value = sel; }
  }

  function modoTipo() {
    var cie = $("a-tipo").value === "cientifico";
    $("campos-cie").hidden = !cie; $("plantilla-cie").hidden = !cie;
    $("pill-tipo").textContent = cie ? "Artículo científico" : "Divulgación";
    $("lbl-resumen").textContent = cie ? "Resumen (abstract en el idioma del artículo)" : "Resumen";
    $("nota-resumen").textContent = cie ? "Entre 150 y 250 palabras." : "Una o dos frases para la tarjeta.";
  }
  $("a-tipo").addEventListener("change", function () { categorias($("a-tipo").value); modoTipo(); portada(); marcar(); });

  function nuevo(tipo) {
    if (S.sucio && !window.__descartar) { pedirConfirmacion("Hay cambios sin guardar. ¿Descartarlos?", function () { window.__descartar = true; nuevo(tipo); window.__descartar = false; }); return; }
    S.actual = { tipo: tipo, idioma: "es", categoria: tipo === "cientifico" ? "Investigación" : "Bienestar", estado: "borrador", imagen_modo: "auto", imagen_semilla: Math.floor(Math.random() * 100000), etiquetas: [], palabras_clave: [] };
    rellenar(S.actual); pintarLista();
    $("panel-ia").open = true; $("ia-tema").focus();
  }
  $("nuevo-div").addEventListener("click", function () { nuevo("divulgacion"); });
  $("nuevo-cie").addEventListener("click", function () { nuevo("cientifico"); });

  function abrir(id) {
    if (S.sucio && !window.__descartar) { pedirConfirmacion("Hay cambios sin guardar. ¿Descartarlos?", function () { window.__descartar = true; abrir(id); window.__descartar = false; }); return; }
    sb.from("logos360_articulos").select("*").eq("id", id).single().then(function (r) {
      if (r.error) { error("No se ha podido abrir: " + r.error.message); return; }
      S.actual = r.data; rellenar(r.data); pintarLista();
    });
  }

  function rellenar(a) {
    $("vacio").hidden = true; $("form").hidden = false; error(""); aviso("");
    $("a-tipo").value = a.tipo; categorias(a.tipo, a.categoria); modoTipo();
    $("a-idioma").value = a.idioma || "es";
    $("a-titulo").value = a.titulo || ""; $("a-slug").value = a.slug || ""; $("a-slug").dataset.manual = a.slug ? "1" : "";
    $("a-resumen").value = a.resumen || ""; $("a-contenido").value = a.contenido || "";
    $("a-etiquetas").value = (a.etiquetas || []).join(", "); $("a-alt").value = a.imagen_alt || "";
    $("a-fecha").value = aLocal(a.fecha_publicacion); $("a-destacado").checked = !!a.destacado;
    $("c-autores").value = a.autores || ""; $("c-afil").value = a.afiliacion || "";
    $("c-abstract").value = a.abstract_en || ""; $("c-claves").value = (a.palabras_clave || []).join(", ");
    $("c-rec").value = a.fecha_recepcion || ""; $("c-acep").value = a.fecha_aceptacion || "";
    $("c-doi").value = a.doi || ""; $("c-refs").value = a.referencias || "";
    $("c-pdf").value = ""; S.pdfFile = null; S.quitarPdf = false;
    $("c-pdf-ver").hidden = !a.pdf_url; if (a.pdf_url) $("c-pdf-ver").href = a.pdf_url; $("c-pdf-quitar").hidden = !a.pdf_url;
    S.semilla = a.imagen_semilla || 1; S.imagenFile = null; $("img-file").value = "";
    document.querySelector('input[name="img-modo"][value="' + (a.imagen_modo || "auto") + '"]').checked = true;
    $("pill-estado").textContent = ESTADOS[a.estado || "borrador"]; $("pill-estado").className = "estado-pill e-" + (a.estado || "borrador");
    $("pill-ia").hidden = !a.generado_ia;
    vistaEscribir();
    portada(); botones(); versiones();
    S.sucio = false;
  }

  function botones() {
    var a = S.actual, existe = !!a.id;
    $("btn-publicar").hidden = !S.aprobar;
    $("btn-publicar").textContent = a.estado === "publicado" ? "Guardar cambios publicados" : "Publicar";
    $("btn-revision").hidden = a.estado === "publicado";
    $("btn-guardar").textContent = a.estado === "publicado" ? "Pasar a borrador" : "Guardar borrador";
    $("btn-archivar").hidden = !existe || a.estado === "archivado";
    $("btn-borrar").hidden = !existe || !S.aprobar;
    $("btn-ver").hidden = a.estado !== "publicado";
    if (a.estado === "publicado") $("btn-ver").href = (CFG.blogUrl || "") + "articulo.html?a=" + encodeURIComponent(a.slug) + "&lang=" + a.idioma;
  }

  function versiones() {
    var a = S.actual; $("versiones").textContent = "";
    if (!a.grupo_traduccion) return;
    var otras = S.items.filter(function (x) { return x.grupo_traduccion === a.grupo_traduccion && x.id !== a.id; });
    if (otras.length) $("versiones").textContent = "Versiones existentes: " + otras.map(function (x) { return IDIOMAS[x.idioma] + " (" + ESTADOS[x.estado].toLowerCase() + ")"; }).join(", ");
  }

  function marcar() { S.sucio = true; aviso("Cambios sin guardar"); }
  $("form").addEventListener("input", function (e) {
    if (e.target.id === "a-titulo" && !$("a-slug").dataset.manual) $("a-slug").value = slugify($("a-titulo").value);
    if (e.target.id === "a-slug") $("a-slug").dataset.manual = "1";
    if (e.target.id === "a-titulo" || e.target.id === "a-cat" || e.target.id === "a-alt") portada();
    marcar();
  });
  $("a-cat").addEventListener("change", portada);
  window.addEventListener("beforeunload", function (e) { if (S.sucio) { e.preventDefault(); e.returnValue = ""; } });

  /* ---------- vista previa ---------- */
  function vistaEscribir() { $("a-contenido").hidden = false; $("vista").hidden = true; $("tab-escribir").classList.add("on"); $("tab-vista").classList.remove("on"); $("tab-escribir").setAttribute("aria-selected", "true"); $("tab-vista").setAttribute("aria-selected", "false"); }
  $("tab-escribir").addEventListener("click", vistaEscribir);
  $("tab-vista").addEventListener("click", function () {
    $("vista").innerHTML = window.DOMPurify.sanitize(window.marked.parse($("a-contenido").value || "*Sin contenido todavía.*"));
    $("a-contenido").hidden = true; $("vista").hidden = false;
    $("tab-vista").classList.add("on"); $("tab-escribir").classList.remove("on");
    $("tab-vista").setAttribute("aria-selected", "true"); $("tab-escribir").setAttribute("aria-selected", "false");
  });
  $("btn-plantilla").addEventListener("click", function () {
    var c = $("a-contenido"); c.value = (c.value.trim() ? c.value.trim() + "\n\n" : "") + PLANTILLA_CIE; marcar(); c.focus();
  });

  /* ---------- imagen ---------- */
  function modoImg() { return document.querySelector('input[name="img-modo"]:checked').value; }
  function opPortada() { return { categoria: $("a-cat").value, titulo: $("a-titulo").value, semilla: S.semilla, tipo: $("a-tipo").value, alt: $("a-alt").value }; }
  function portada() {
    var img = $("img-prev");
    if (modoImg() === "subida") {
      if (S.imagenFile) { img.src = URL.createObjectURL(S.imagenFile); return; }
      if (S.actual && S.actual.imagen_url) { img.src = S.actual.imagen_url; return; }
    }
    img.src = P.dataUri(opPortada());
  }
  $("btn-otra").addEventListener("click", function () {
    S.semilla = Math.floor(Math.random() * 100000);
    document.querySelector('input[name="img-modo"][value="auto"]').checked = true; portada(); marcar();
  });
  document.querySelectorAll('input[name="img-modo"]').forEach(function (r) { r.addEventListener("change", function () { portada(); marcar(); }); });
  $("img-file").addEventListener("change", function () {
    var f = $("img-file").files[0]; if (!f) return;
    if (f.size > 4 * 1024 * 1024) { error("La imagen pesa más de 4 MB. Usa una más ligera."); $("img-file").value = ""; return; }
    S.imagenFile = f; document.querySelector('input[name="img-modo"][value="subida"]').checked = true; portada(); marcar();
  });
  $("btn-png").addEventListener("click", function () {
    P.aPNG(opPortada(), function (blob) {
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (slugify($("a-titulo").value) || "portada") + ".png"; a.click();
    });
  });

  /* ---------- PDF ---------- */
  $("c-pdf").addEventListener("change", function () {
    var f = $("c-pdf").files[0]; if (!f) return;
    if (f.size > 20 * 1024 * 1024) { error("El PDF pesa más de 20 MB."); $("c-pdf").value = ""; return; }
    S.pdfFile = f; S.quitarPdf = false; marcar();
  });
  $("c-pdf-quitar").addEventListener("click", function () { S.quitarPdf = true; S.pdfFile = null; $("c-pdf-ver").hidden = true; $("c-pdf-quitar").hidden = true; marcar(); });

  function subir(ruta, file) {
    return sb.storage.from("logos360").upload(ruta, file, { upsert: true, contentType: file.type }).then(function (r) {
      if (r.error) throw new Error("No se pudo subir el archivo: " + r.error.message);
      return sb.storage.from("logos360").getPublicUrl(ruta).data.publicUrl + "?v=" + Date.now();
    });
  }

  /* ---------- guardar ---------- */
  function datos() {
    var a = S.actual;
    var d = {
      tipo: $("a-tipo").value, idioma: $("a-idioma").value, categoria: $("a-cat").value,
      titulo: $("a-titulo").value.trim(), slug: slugify($("a-slug").value || $("a-titulo").value),
      resumen: $("a-resumen").value.trim() || null, contenido: $("a-contenido").value,
      etiquetas: lista($("a-etiquetas").value), destacado: $("a-destacado").checked,
      imagen_modo: modoImg(), imagen_semilla: S.semilla, imagen_alt: $("a-alt").value.trim() || null,
      fecha_publicacion: $("a-fecha").value ? new Date($("a-fecha").value).toISOString() : (a.fecha_publicacion || null),
      generado_ia: !!a.generado_ia
    };
    if (a.grupo_traduccion) d.grupo_traduccion = a.grupo_traduccion;
    if (d.tipo === "cientifico") {
      d.autores = $("c-autores").value.trim() || null; d.afiliacion = $("c-afil").value.trim() || null;
      d.abstract_en = $("c-abstract").value.trim() || null; d.palabras_clave = lista($("c-claves").value);
      d.fecha_recepcion = $("c-rec").value || null; d.fecha_aceptacion = $("c-acep").value || null;
      d.doi = $("c-doi").value.trim() || null; d.referencias = $("c-refs").value.trim() || null;
    }
    return d;
  }

  function validar(d, publicar) {
    if (!d.titulo) return "Escribe un título.";
    if (!d.slug) return "La dirección del artículo no puede quedar vacía.";
    if (publicar) {
      if (!d.contenido.trim()) return "El artículo no tiene contenido.";
      if (/\[DATO PENDIENTE\]/.test(d.contenido)) return "Quedan marcas [DATO PENDIENTE] en el contenido. Complétalas antes de publicar.";
      if (d.tipo === "cientifico" && !d.autores) return "Indica la autoría del artículo científico.";
      if (d.tipo === "cientifico" && !d.resumen) return "El artículo científico necesita un resumen.";
      if (d.imagen_modo === "subida" && !S.imagenFile && !(S.actual && S.actual.imagen_url)) return "Has elegido imagen propia pero no has subido ninguna.";
    }
    var otro = S.items.filter(function (x) { return x.slug === d.slug && x.id !== S.actual.id; })[0];
    if (otro) return "Ya existe un artículo con esa dirección. Cambia el título o la dirección.";
    return "";
  }

  function guardar(estado, boton) {
    error("");
    var d = datos(); d.estado = estado;
    var msg = validar(d, estado === "publicado"); if (msg) { error(msg); return; }
    ocupado(boton, true, "Guardando…");
    var a = S.actual;
    var paso = a.id ? sb.from("logos360_articulos").update(d).eq("id", a.id).select().single()
                    : sb.from("logos360_articulos").insert(d).select().single();
    paso.then(function (r) {
      if (r.error) throw new Error(r.error.message.indexOf("aprobación") >= 0 ? r.error.message : "No se pudo guardar: " + r.error.message);
      var guardado = r.data, cambios = {};
      var tareas = [];
      if (S.imagenFile) {
        var ext = (S.imagenFile.name.split(".").pop() || "jpg").toLowerCase();
        tareas.push(subir("imagenes/" + guardado.id + "." + ext, S.imagenFile).then(function (u) { cambios.imagen_url = u; }));
      }
      if (S.pdfFile) tareas.push(subir("pdf/" + guardado.id + ".pdf", S.pdfFile).then(function (u) { cambios.pdf_url = u; }));
      if (S.quitarPdf) cambios.pdf_url = null;
      return Promise.all(tareas).then(function () {
        if (!Object.keys(cambios).length) return guardado;
        return sb.from("logos360_articulos").update(cambios).eq("id", guardado.id).select().single().then(function (r2) { if (r2.error) throw r2.error; return r2.data; });
      });
    }).then(function (g) {
      ocupado(boton, false);
      S.actual = g; rellenar(g);
      aviso(estado === "publicado" ? "Publicado. Ya se ve en el blog." : estado === "revision" ? "Enviado a revisión." : "Guardado.");
      cargar();
    }).catch(function (e) { ocupado(boton, false); error(e.message || String(e)); });
  }
  $("btn-guardar").addEventListener("click", function () { guardar("borrador", $("btn-guardar")); });
  $("btn-revision").addEventListener("click", function () { guardar("revision", $("btn-revision")); });
  $("btn-publicar").addEventListener("click", function () {
    if (S.actual.estado === "publicado") return guardar("publicado", $("btn-publicar"));
    var extra = S.actual.generado_ia ? " Este texto lo preparó la IA: confirma que lo has revisado." : "";
    pedirConfirmacion("¿Publicar en el blog?" + extra, function () { guardar("publicado", $("btn-publicar")); });
  });
  $("btn-archivar").addEventListener("click", function () {
    pedirConfirmacion("¿Archivar? Deja de verse en el blog, pero se conserva aquí.", function () { guardar("archivado", $("btn-archivar")); });
  });
  $("btn-borrar").addEventListener("click", function () {
    pedirConfirmacion("¿Eliminar definitivamente este artículo? No se puede deshacer. Si solo quieres ocultarlo, usa Archivar.", function () {
      sb.from("logos360_articulos").delete().eq("id", S.actual.id).then(function (r) {
        if (r.error) { error("No se pudo eliminar: " + r.error.message); return; }
        S.actual = null; S.sucio = false; $("form").hidden = true; $("vacio").hidden = false; cargar();
      });
    });
  });

  function pedirConfirmacion(texto, si) {
    if ($("form").hidden) { si(); return; }
    $("confirmar-txt").textContent = texto; $("confirmar").hidden = false;
    $("confirmar-si").onclick = function () { $("confirmar").hidden = true; si(); };
    $("confirmar-no").onclick = function () { $("confirmar").hidden = true; };
    $("confirmar").scrollIntoView({ block: "nearest" });
  }

  /* ---------- IA ---------- */
  function ia(cuerpo) {
    return sb.functions.invoke(CFG.funcionIA || "logos360-ia", { body: cuerpo }).then(function (r) {
      if (r.error) throw new Error("La IA no está disponible ahora: " + r.error.message);
      if (r.data && r.data.error) throw new Error(r.data.error);
      return r.data;
    });
  }

  $("btn-ia").addEventListener("click", function () {
    var tema = $("ia-tema").value.trim();
    if (!tema) { error("Escribe el tema que quieres que prepare la IA."); $("ia-tema").focus(); return; }
    error(""); ocupado($("btn-ia"), true, "Preparando borrador…");
    ia({ accion: "borrador", tipo: $("a-tipo").value, idioma: $("a-idioma").value, categoria: $("a-cat").value, tema: tema, notas: $("ia-notas").value.trim() })
      .then(function (r) {
        ocupado($("btn-ia"), false);
        aplicarIA(r);
        $("panel-ia").open = false;
        aviso("Borrador preparado con IA. Revísalo y guárdalo.");
      }).catch(function (e) { ocupado($("btn-ia"), false); error(e.message); });
  });

  function aplicarIA(r) {
    if (r.titulo) { $("a-titulo").value = r.titulo; if (!$("a-slug").dataset.manual || !S.actual.id) { $("a-slug").value = slugify(r.titulo); $("a-slug").dataset.manual = ""; } }
    if (r.resumen) $("a-resumen").value = r.resumen;
    if (r.contenido) $("a-contenido").value = r.contenido;
    if (r.etiquetas) $("a-etiquetas").value = r.etiquetas.join(", ");
    if (r.imagen_alt) $("a-alt").value = r.imagen_alt;
    if (r.abstract_en) $("c-abstract").value = r.abstract_en;
    if (r.palabras_clave) $("c-claves").value = r.palabras_clave.join(", ");
    S.actual.generado_ia = true; $("pill-ia").hidden = false;
    vistaEscribir(); portada(); marcar();
  }

  document.querySelectorAll("[data-trad]").forEach(function (b) {
    b.addEventListener("click", function () {
      var destino = b.dataset.trad, a = S.actual;
      if (!a || !a.id) { error("Guarda el artículo antes de traducirlo."); return; }
      if (S.sucio) { error("Guarda los cambios antes de traducir."); return; }
      if (destino === a.idioma) { error("El artículo ya está en ese idioma."); return; }
      if (S.items.some(function (x) { return x.grupo_traduccion === a.grupo_traduccion && x.idioma === destino; })) { error("Ya existe una versión en " + IDIOMAS[destino] + ". Ábrela desde la lista."); return; }
      error(""); ocupado(b, true, "Traduciendo…");
      ia({ accion: "traducir", idioma_destino: destino, articulo: a }).then(function (r) {
        var copia = {};
        ["tipo", "categoria", "grupo_traduccion", "imagen_modo", "imagen_url", "imagen_semilla", "autores", "afiliacion", "abstract_en", "palabras_clave", "doi", "referencias", "pdf_url", "fecha_recepcion", "fecha_aceptacion"]
          .forEach(function (k) { copia[k] = a[k]; });
        copia.idioma = destino; copia.titulo = r.titulo || a.titulo; copia.resumen = r.resumen || a.resumen;
        copia.contenido = r.contenido || ""; copia.etiquetas = r.etiquetas || []; copia.imagen_alt = r.imagen_alt || a.imagen_alt;
        copia.slug = slugify(copia.titulo) + "-" + destino; copia.estado = "borrador"; copia.generado_ia = true;
        return sb.from("logos360_articulos").insert(copia).select().single();
      }).then(function (r) {
        ocupado(b, false);
        if (r.error) throw new Error("No se pudo crear la traducción: " + r.error.message);
        return cargar().then(function () { S.sucio = false; abrir(r.data.id); aviso("Traducción creada como borrador."); });
      }).catch(function (e) { ocupado(b, false); error(e.message); });
    });
  });

  /* ---------- temas de la semana ---------- */
  var propuestas = [];
  $("btn-semana").addEventListener("click", function () {
    $("modal-semana").hidden = false; $("ms-error").textContent = ""; $("ms-lista").innerHTML = "";
    $("ms-lista").appendChild(el("p", "nota", "La IA está proponiendo temas…"));
    ia({ accion: "semana", cantidad: 5 }).then(function (r) {
      propuestas = (r && r.temas) || []; var box = $("ms-lista"); box.innerHTML = "";
      propuestas.forEach(function (p, i) {
        var l = el("label", "ms-item"); l.setAttribute("for", "ms-" + i);
        var c = el("input"); c.type = "checkbox"; c.id = "ms-" + i; c.checked = true; l.appendChild(c);
        var tx = el("div"); tx.appendChild(el("strong", null, p.tema)); tx.appendChild(el("div", "nota", p.categoria + " · " + p.por_que)); l.appendChild(tx);
        box.appendChild(l);
      });
    }).catch(function (e) { $("ms-lista").innerHTML = ""; $("ms-error").textContent = e.message; });
  });
  $("ms-cerrar").addEventListener("click", function () { $("modal-semana").hidden = true; });
  $("ms-crear").addEventListener("click", function () {
    var elegidas = propuestas.filter(function (p, i) { return $("ms-" + i) && $("ms-" + i).checked; });
    if (!elegidas.length) { $("ms-error").textContent = "Marca al menos un tema."; return; }
    var b = $("ms-crear"); ocupado(b, true, "Creando 0 de " + elegidas.length + "…");
    var hechos = 0;
    elegidas.reduce(function (cadena, p) {
      return cadena.then(function () {
        var cat = CAT_DIV.indexOf(p.categoria) >= 0 ? p.categoria : "Servicios sociales";
        return ia({ accion: "borrador", tipo: "divulgacion", idioma: "es", categoria: cat, tema: p.tema }).then(function (r) {
          return sb.from("logos360_articulos").insert({
            tipo: "divulgacion", idioma: "es", categoria: cat, titulo: r.titulo || p.tema,
            slug: slugify(r.titulo || p.tema) + "-" + Math.random().toString(36).slice(2, 6),
            resumen: r.resumen || null, contenido: r.contenido || "", etiquetas: r.etiquetas || [], imagen_alt: r.imagen_alt || null,
            estado: "borrador", generado_ia: true
          });
        }).then(function () { hechos++; b.textContent = "Creando " + hechos + " de " + elegidas.length + "…"; });
      });
    }, Promise.resolve()).then(function () {
      ocupado(b, false); $("modal-semana").hidden = true; S.filtroEstado = "borrador"; cargar();
    }).catch(function (e) { ocupado(b, false); $("ms-error").textContent = "Se crearon " + hechos + ". Error: " + e.message; cargar(); });
  });
})();
