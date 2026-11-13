/* Blog de Logos · página blog.html / es-blog.html (lista y artículo). Lee solo lo publicado (canal_publico y canal_articulo). */
/* ===== Blog de Logos · motor común (Intranet, web logostgn.cat y Logos Acompanya) =====
   El cuerpo del artículo se escribe con marcas sencillas (los botones del editor las ponen solas):
     ## Subtítulo          ### Subtítulo pequeño        > Cita            - Lista         1. Lista numerada
     ![Pie de foto](https://…imagen)     [video](https://youtube… / vimeo… / …mp4)     [[Texto del botón|https://…]]
     !!! Caja destacada en color          ---  (línea separadora)
     **negrita**   *cursiva*   [texto del enlace](https://…)
   Todo el texto se escapa: no se puede meter HTML ni scripts. */
var BLOG_COLORES = {
  azul:    { a: '#1E4FA8', s: '#E8EEFB', t: '#14306B' },
  verde:   { a: '#1F8A4C', s: '#E3F5EA', t: '#145C33' },
  dorado:  { a: '#C98A00', s: '#FFF3DD', t: '#6B4A00' },
  morado:  { a: '#6D3FC0', s: '#EFE8FB', t: '#43237D' },
  rojo:    { a: '#C0392B', s: '#FDECEA', t: '#7A2218' },
  turquesa:{ a: '#0E8C8C', s: '#E0F4F4', t: '#0A5858' },
  negro:   { a: '#1B2333', s: '#EEF0F4', t: '#1B2333' }
};
function blogEsc(t){ return String(t == null ? '' : t).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function blogUrlOk(u){ return /^https:\/\/[^\s"'<>]+$/i.test(String(u || '')); }
function blogInline(t){
  var s = blogEsc(t);
  s = s.replace(/\[([^\]\n]{1,200})\]\((https:\/\/[^\s)"'<>]{1,500})\)/g, function(_, x, u){ return '<a href="' + u + '" target="_blank" rel="noopener">' + x + '</a>'; });
  s = s.replace(/\*\*([^*\n]{1,400})\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])\*([^*\n]{1,300})\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  return s;
}
function blogLeerMin(md){ var n = String(md || '').replace(/[#>*\[\]()!|-]/g, ' ').split(/\s+/).filter(Boolean).length; return Math.max(1, Math.round(n / 200)); }
// Convierte el cuerpo en HTML. op: { color, video: función(url, poster, título, etiqueta, esc) → html, etiquetaVideo }
function blogRender(md, op){
  op = op || {};
  var lineas = String(md || '').replace(/\r\n?/g, '\n').split('\n'), out = [], par = [], lista = null;
  var cierraPar = function(){ if(par.length){ out.push('<p>' + par.map(blogInline).join('<br>') + '</p>'); par = []; } };
  var cierraLista = function(){ if(lista){ out.push('<' + lista.t + '>' + lista.items.map(function(i){ return '<li>' + blogInline(i) + '</li>'; }).join('') + '</' + lista.t + '>'); lista = null; } };
  var cierra = function(){ cierraPar(); cierraLista(); };
  for(var i = 0; i < lineas.length; i++){
    var l = lineas[i], tl = l.trim(), m;
    if(!tl){ cierra(); continue; }
    if((m = tl.match(/^(#{2,3})\s+(.+)$/))){ cierra(); out.push(m[1].length === 2 ? '<h2>' + blogInline(m[2]) + '</h2>' : '<h3>' + blogInline(m[2]) + '</h3>'); continue; }
    if(/^-{3,}$/.test(tl)){ cierra(); out.push('<hr>'); continue; }
    if((m = tl.match(/^!\[([^\]]*)\]\((https:\/\/[^\s)]+)\)$/))){ cierra(); out.push('<figure class="blog-fig"><img src="' + blogEsc(m[2]) + '" alt="' + blogEsc(m[1]) + '" loading="lazy">' + (m[1] ? '<figcaption>' + blogInline(m[1]) + '</figcaption>' : '') + '</figure>'); continue; }
    if((m = tl.match(/^\[(?:video|vídeo|vídeo)\]\((https:\/\/[^\s)]+)\)$/i))){ cierra(); var vh = op.video ? op.video(m[1], '', op.titulo || 'Vídeo', op.etiquetaVideo || 'Vídeo', blogEsc) : ''; if(vh) out.push('<div class="blog-video">' + vh + '</div>'); continue; }
    if((m = tl.match(/^\[\[([^|\]]{1,80})\|(https:\/\/[^\]\s]{1,500})\]\]$/))){ cierra(); out.push('<p class="blog-boton"><a href="' + blogEsc(m[2]) + '" target="_blank" rel="noopener">' + blogEsc(m[1]) + ' →</a></p>'); continue; }
    if((m = tl.match(/^!!!\s*(.+)$/))){ cierra(); out.push('<div class="blog-caja">' + blogInline(m[1]) + '</div>'); continue; }
    if((m = tl.match(/^>\s?(.*)$/))){ cierra(); var q = [m[1]]; while(i + 1 < lineas.length && /^\s*>/.test(lineas[i + 1])){ i++; q.push(lineas[i].replace(/^\s*>\s?/, '')); } out.push('<blockquote>' + q.map(blogInline).join('<br>') + '</blockquote>'); continue; }
    if((m = tl.match(/^[-•*]\s+(.+)$/))){ cierraPar(); if(!lista || lista.t !== 'ul'){ cierraLista(); lista = { t: 'ul', items: [] }; } lista.items.push(m[1]); continue; }
    if((m = tl.match(/^\d+[.)]\s+(.+)$/))){ cierraPar(); if(!lista || lista.t !== 'ol'){ cierraLista(); lista = { t: 'ol', items: [] }; } lista.items.push(m[1]); continue; }
    cierraLista(); par.push(tl);
  }
  cierra();
  return out.join('\n');
}
// Página completa del artículo (portada, títulos, autor, fecha y cuerpo). x = fila del canal; ca = catalán
function blogArticuloHtml(x, ca, op){
  op = op || {};
  var c = BLOG_COLORES[x.color] || BLOG_COLORES.azul;
  var tit = (ca && x.titulo_ca) || x.titulo || '', sub = (ca && x.subtitulo_ca) || x.subtitulo || '', ent = (ca && x.texto_ca) || x.texto || '';
  var cuerpo = (ca && x.cuerpo_ca) || x.cuerpo || '';
  var f = x.publicar_desde ? new Date(x.publicar_desde) : null;
  var fecha = f ? f.toLocaleDateString(op.locale || (ca ? 'ca-ES' : 'es-ES'), { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  var min = blogLeerMin(cuerpo + ' ' + ent);
  var portada = x.video_url && op.video && !x.imagen_url ? '<div class="blog-portada blog-portada--video">' + op.video(x.video_url, '', tit, op.etiquetaVideo || 'Vídeo', blogEsc) + '</div>'
    : (x.imagen_url ? '<div class="blog-portada"><img src="' + blogEsc(x.imagen_url) + '" alt=""></div>' : '');
  return '<article class="blog-art" style="--b-a:' + c.a + ';--b-s:' + c.s + ';--b-t:' + c.t + '">' +
    '<header class="blog-cab">' + (x.categoria ? '<span class="blog-cat">' + blogEsc(x.categoria) + '</span>' : '') +
    '<h1>' + blogEsc(tit) + '</h1>' + (sub ? '<p class="blog-sub">' + blogInline(sub) + '</p>' : '') +
    '<p class="blog-meta">' + [x.autor_nombre ? blogEsc(x.autor_nombre) : 'Logos', fecha, min + ' min ' + (op.lectura || (ca ? 'de lectura' : 'de lectura'))].filter(Boolean).join(' · ') + '</p></header>' +
    portada +
    (ent ? '<p class="blog-entradilla">' + blogInline(ent).replace(/\n/g, '<br>') + '</p>' : '') +
    '<div class="blog-cuerpo">' + blogRender(cuerpo, { video: op.video, titulo: tit, etiquetaVideo: op.etiquetaVideo }) + '</div>' +
    (x.video_url && x.imagen_url && op.video ? '<div class="blog-video">' + op.video(x.video_url, x.imagen_url, tit, op.etiquetaVideo || 'Vídeo', blogEsc) + '</div>' : '') +
    (x.enlace ? '<p class="blog-boton"><a href="' + blogEsc(x.enlace) + '" target="_blank" rel="noopener">' + blogEsc(x.enlace_texto || (ca ? 'Més informació' : 'Más información')) + ' →</a></p>' : '') +
    '</article>';
}
// Tarjeta para listas (web, Acompanya, Intranet)
function blogTarjetaHtml(x, ca, href, op){
  op = op || {};
  var c = BLOG_COLORES[x.color] || BLOG_COLORES.azul;
  var tit = (ca && x.titulo_ca) || x.titulo || '', sub = (ca && x.subtitulo_ca) || x.subtitulo || (ca && x.texto_ca) || x.texto || '';
  var f = x.publicar_desde ? new Date(x.publicar_desde).toLocaleDateString(op.locale || (ca ? 'ca-ES' : 'es-ES'), { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  var img = x.imagen_url || ((typeof canalVid === 'function' && x.video_url && (canalVid(x.video_url) || {}).thumb) || '');
  return '<a class="blog-tarjeta" href="' + blogEsc(href) + '" style="--b-a:' + c.a + ';--b-s:' + c.s + '"' + (op.onclick ? ' onclick="' + op.onclick + '"' : '') + '>' +
    (img ? '<span class="blog-tarjeta__img" style="background-image:url(\'' + blogEsc(img) + '\')"></span>' : '<span class="blog-tarjeta__img blog-tarjeta__img--color"><span>📝</span></span>') +
    '<span class="blog-tarjeta__b">' + (x.categoria ? '<span class="blog-cat">' + blogEsc(x.categoria) + '</span>' : '<span class="blog-cat">Blog</span>') +
    '<strong>' + blogEsc(tit) + '</strong>' + (sub ? '<span class="blog-tarjeta__s">' + blogEsc(String(sub).slice(0, 160)) + (String(sub).length > 160 ? '…' : '') + '</span>' : '') +
    '<small>' + blogEsc(f) + (op.leer ? ' · ' + blogEsc(op.leer) + ' →' : '') + '</small></span></a>';
}
(function () {
  var app = document.getElementById("blog-app"); if (!app || !window.fetch) return;
  var U = "https://foxtlpyfedwsvttzorql.supabase.co", K = "sb_publishable_Ght82ml0pvg0_nQvunlXVA_u0WjRscq";
  var H = { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" };
  var ca = (document.documentElement.lang || "ca").slice(0, 2) === "ca";
  var pag = ca ? "blog.html" : "es-blog.html";
  var T = ca ? { eb: "Blog de Logos", h: "Històries, projectes i novetats", p: "El que fem, explicat per l'equip i per les persones que acompanyem.", buit: "Aviat hi publicarem els primers articles.", llegir: "Llegir", tornar: "← Tornar al blog", comp: "Comparteix", copiar: "Copiar l'enllaç", copiat: "Enllaç copiat", noTrobat: "Aquest article ja no està publicat.", vid: "Veure el vídeo", lect: "de lectura" }
               : { eb: "Blog de Logos", h: "Historias, proyectos y novedades", p: "Lo que hacemos, contado por el equipo y por las personas que acompañamos.", buit: "Pronto publicaremos los primeros artículos.", llegir: "Leer", tornar: "← Volver al blog", comp: "Comparte", copiar: "Copiar el enlace", copiat: "Enlace copiado", noTrobat: "Este artículo ya no está publicado.", vid: "Ver el vídeo", lect: "de lectura" };
  var vid = typeof canalVidHtml === "function" ? canalVidHtml : null;
  var rpc = function (f, b) { return fetch(U + "/rest/v1/rpc/" + f, { method: "POST", headers: H, body: JSON.stringify(b) }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); };
  var id = new URLSearchParams(location.search).get("a");
  if (id && /^[0-9a-f-]{36}$/i.test(id)) {
    app.innerHTML = '<p class="blog-carga">…</p>';
    rpc("canal_articulo", { p_id: id, p_donde: "web" }).then(function (x) {
      if (!x || !x.id) { app.innerHTML = '<div class="blog-buit"><p>' + T.noTrobat + '</p><a class="btn btn--dark" href="' + pag + '">' + T.tornar + "</a></div>"; return; }
      var tit = (ca && x.titulo_ca) || x.titulo;
      document.title = tit + " · Blog de Logos";
      var url = location.href.split("#")[0];
      app.innerHTML = '<p class="blog-volver"><a href="' + pag + '">' + T.tornar + "</a></p>" + blogArticuloHtml(x, ca, { video: vid, etiquetaVideo: T.vid, lectura: T.lect }) +
        '<div class="blog-comparte"><span>' + T.comp + ':</span><a class="btn btn--sm btn--line" href="https://wa.me/?text=' + encodeURIComponent(tit + " " + url) + '" target="_blank" rel="noopener">WhatsApp</a><button type="button" class="btn btn--sm btn--line" id="blog-copiar">' + T.copiar + "</button></div>" +
        '<p class="blog-volver blog-volver--fi"><a href="' + pag + '">' + T.tornar + "</a></p>";
      var bc = document.getElementById("blog-copiar");
      if (bc) bc.addEventListener("click", function () { try { navigator.clipboard.writeText(url).then(function () { bc.textContent = T.copiat; }); } catch (e) {} });
      window.scrollTo(0, 0);
    }).catch(function () { app.innerHTML = '<div class="blog-buit"><p>' + T.noTrobat + "</p></div>"; });
    return;
  }
  app.innerHTML = '<div class="head head--single" style="margin-bottom:22px"><div><span class="eyebrow">' + T.eb + "</span><h1 class=\"blog-h\">" + T.h + "</h1><p>" + T.p + '</p></div></div><div class="blog-lista" id="blog-lista"><p class="blog-carga">…</p></div>';
  rpc("canal_publico", { p_donde: "web" }).then(function (L) {
    L = (Array.isArray(L) ? L : []).filter(function (x) { return x.tipo === "articulo"; }).sort(function (a, b) { return String(b.publicar_desde).localeCompare(String(a.publicar_desde)); });
    var box = document.getElementById("blog-lista");
    box.innerHTML = L.length ? L.map(function (x) { return blogTarjetaHtml(x, ca, pag + "?a=" + encodeURIComponent(x.id), { leer: T.llegir }); }).join("") : '<div class="blog-buit"><p>' + T.buit + "</p></div>";
  }).catch(function () { document.getElementById("blog-lista").innerHTML = '<div class="blog-buit"><p>' + T.buit + "</p></div>"; });
})();

/* Portada: franja «Blog» con los 3 últimos artículos (debajo de «Què passa a Logos») */
(function () {
  var sec = document.getElementById("actualitat"); if (!sec || !window.fetch) return;
  var wrap = sec.querySelector(".wrap") || sec;
  var U = "https://foxtlpyfedwsvttzorql.supabase.co", K = "sb_publishable_Ght82ml0pvg0_nQvunlXVA_u0WjRscq";
  var lang = (document.documentElement.lang || "ca").slice(0, 2), ca = lang === "ca";
  var T = { ca: ["Blog", "Històries i novetats de Logos", "Veure tot el blog", "Llegir"], es: ["Blog", "Historias y novedades de Logos", "Ver todo el blog", "Leer"],
            en: ["Blog", "Stories and news from Logos", "See the whole blog", "Read"], fr: ["Blog", "Histoires et nouvelles de Logos", "Voir tout le blog", "Lire"],
            ar: ["المدونة", "قصص وأخبار لوغوس", "عرض المدونة كاملة", "اقرأ"] }[lang] || null; if (!T) return;
  var pag = ca ? "blog.html" : "es-blog.html";
  fetch(U + "/rest/v1/rpc/canal_publico", { method: "POST", headers: { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" }, body: JSON.stringify({ p_donde: "web" }) })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (L) {
      L = (Array.isArray(L) ? L : []).filter(function (x) { return x.tipo === "articulo"; }).sort(function (a, b) { return String(b.publicar_desde).localeCompare(String(a.publicar_desde)); });
      if (!L.length) return;
      var box = document.createElement("div"); box.className = "blog-home"; box.id = "blog-logos";
      box.innerHTML = '<div class="head head--single" style="margin-bottom:18px"><div><span class="eyebrow">' + T[0] + "</span><h2>" + T[1] + '</h2></div></div><div class="blog-lista">' +
        L.slice(0, 3).map(function (x) { return blogTarjetaHtml(x, ca, pag + "?a=" + encodeURIComponent(x.id), { leer: T[3] }); }).join("") +
        '</div><p class="blog-home__mes"><a class="btn btn--dark" href="' + pag + '">' + T[2] + " →</a></p>";
      var canal = document.getElementById("canal-logos");
      if (canal && canal.nextSibling) wrap.insertBefore(box, canal.nextSibling); else wrap.appendChild(box);
    }).catch(function () {});
})();
