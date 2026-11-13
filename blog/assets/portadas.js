/* LOGOS 360 · Portadas automáticas
   Genera una imagen de portada (SVG) para cada artículo a partir de su
   categoría, título y una "semilla". Misma semilla = misma imagen.
   Se usa igual en la web pública y en la Intranet. */
(function (global) {
  "use strict";

  var PALETAS = {
    "Bienestar":                   ["#1B2A4A", "#C9A227", "#F3E9D2", "#6E8FB5"],
    "Personas mayores y cuidados": ["#24395E", "#D9A441", "#F6EEDC", "#8AA6A3"],
    "Trámites y derechos":         ["#152238", "#B8912A", "#EFE6D0", "#4E6E9A"],
    "Vivienda":                    ["#20324F", "#C27C3A", "#F4EAD8", "#7C93AE"],
    "Jubilación":                  ["#2A3B57", "#CFAE5A", "#F5EDDB", "#9AA9BE"],
    "Familias":                    ["#1D3150", "#E0A93B", "#F7EFDD", "#6FA0A0"],
    "Educación":                   ["#1A2B47", "#C9A227", "#EEF0E6", "#5D86B0"],
    "Empleo y emprendimiento":     ["#18273F", "#D49B2E", "#F2EBDA", "#5A7FA6"],
    "Salud y nutrición":           ["#1F3A4A", "#C9A227", "#EEF3E6", "#6FA38B"],
    "Deporte":                     ["#1B2E4A", "#E3B23C", "#F1EEE2", "#4F8EB0"],
    "Servicios sociales":          ["#22304D", "#C9A227", "#F3EBDA", "#8B9CC0"],
    "Personas sin hogar":          ["#1E2C45", "#BF8F3A", "#EFE8DA", "#7F8FA8"],
    "Investigación":               ["#0F1C33", "#C9A227", "#E9ECF2", "#3E5F8A"]
  };
  var DEFECTO = ["#1B2A4A", "#C9A227", "#F3E9D2", "#6E8FB5"];

  // Iconos sencillos (trazos sobre un lienzo de 100×100)
  var ICONOS = {
    "Bienestar": "M50 78 C20 58 18 34 34 28 C43 25 49 31 50 36 C51 31 57 25 66 28 C82 34 80 58 50 78 Z",
    "Personas mayores y cuidados": "M30 70 Q50 40 70 70 M38 44 a8 8 0 1 0 0.1 0 M62 44 a8 8 0 1 0 0.1 0 M26 80 H74",
    "Trámites y derechos": "M32 22 H62 L72 32 V78 H32 Z M62 22 V32 H72 M40 46 H64 M40 56 H64 M40 66 H56",
    "Vivienda": "M24 50 L50 26 L76 50 M32 44 V76 H68 V44 M45 76 V60 H55 V76",
    "Jubilación": "M50 24 a26 26 0 1 0 0.1 0 M50 34 V50 L62 58",
    "Familias": "M36 36 a7 7 0 1 0 0.1 0 M64 36 a7 7 0 1 0 0.1 0 M50 52 a5 5 0 1 0 0.1 0 M26 76 Q36 50 46 76 M54 76 Q64 50 74 76 M44 78 Q50 62 56 78",
    "Educación": "M22 40 L50 28 L78 40 L50 52 Z M34 46 V62 Q50 72 66 62 V46 M78 40 V58",
    "Empleo y emprendimiento": "M30 38 H70 V74 H30 Z M42 38 V30 H58 V38 M30 54 H70",
    "Salud y nutrición": "M50 30 Q70 30 70 52 Q70 76 50 76 Q30 76 30 52 Q30 30 50 30 Z M50 30 Q52 20 60 18",
    "Deporte": "M50 24 a26 26 0 1 0 0.1 0 M26 50 H74 M50 24 Q36 50 50 76 M50 24 Q64 50 50 76",
    "Servicios sociales": "M24 56 Q38 44 50 54 Q62 44 76 56 M30 62 Q50 80 70 62 M50 26 a8 8 0 1 0 0.1 0",
    "Personas sin hogar": "M24 54 L50 32 L76 54 M50 58 a6 6 0 1 0 0.1 0 M40 80 Q50 64 60 80",
    "Investigación": "M44 24 V44 L28 72 Q26 78 32 78 H68 Q74 78 72 72 L56 44 V24 M40 24 H60 M36 62 H64"
  };

  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < (str || "").length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function esc(t) {
    return String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* opciones: { categoria, titulo, semilla, tipo: 'divulgacion'|'cientifico', ancho, alto, conTexto } */
  function svg(op) {
    op = op || {};
    var W = op.ancho || 1200, H = op.alto || 630;
    var pal = PALETAS[op.categoria] || DEFECTO;
    var fondo = pal[0], acento = pal[1], claro = pal[2], frio = pal[3];
    var r = rng((op.semilla || 1) ^ hash(op.titulo) ^ hash(op.categoria));
    var cientifico = op.tipo === "cientifico";
    var p = [];

    p.push('<rect width="' + W + '" height="' + H + '" fill="' + fondo + '"/>');

    if (cientifico) {
      // Retícula tipo papel milimetrado + curva de datos
      var paso = 40;
      for (var x = 0; x <= W; x += paso) p.push('<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="' + frio + '" stroke-opacity="' + (x % 200 === 0 ? 0.35 : 0.12) + '"/>');
      for (var y = 0; y <= H; y += paso) p.push('<line x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '" stroke="' + frio + '" stroke-opacity="' + (y % 200 === 0 ? 0.35 : 0.12) + '"/>');
      var d = "M0 " + (H * 0.75), puntos = [];
      for (var i = 1; i <= 12; i++) {
        var px = (W / 12) * i, py = H * (0.75 - 0.45 * (i / 12)) + (r() - 0.5) * 90;
        d += " L" + px.toFixed(0) + " " + py.toFixed(0); puntos.push([px, py]);
      }
      p.push('<path d="' + d + '" fill="none" stroke="' + acento + '" stroke-width="5" stroke-linejoin="round"/>');
      puntos.forEach(function (pt) { p.push('<circle cx="' + pt[0].toFixed(0) + '" cy="' + pt[1].toFixed(0) + '" r="8" fill="' + fondo + '" stroke="' + acento + '" stroke-width="4"/>'); });
    } else {
      // Composición orgánica: círculos grandes, arcos y puntos
      for (var c = 0; c < 4; c++) {
        var cx = r() * W, cy = r() * H, rad = 120 + r() * 260;
        var col = [acento, frio, claro][c % 3];
        p.push('<circle cx="' + cx.toFixed(0) + '" cy="' + cy.toFixed(0) + '" r="' + rad.toFixed(0) + '" fill="' + col + '" fill-opacity="' + (0.10 + r() * 0.18).toFixed(2) + '"/>');
      }
      var ax = W * (0.65 + r() * 0.2), ay = H * (0.5 + r() * 0.2);
      for (var k = 0; k < 5; k++) {
        p.push('<circle cx="' + ax.toFixed(0) + '" cy="' + ay.toFixed(0) + '" r="' + (90 + k * 55) + '" fill="none" stroke="' + claro + '" stroke-opacity="' + (0.28 - k * 0.04).toFixed(2) + '" stroke-width="3"/>');
      }
      var filas = 6, cols = 10, ox = W * 0.06, oy = H * (0.12 + r() * 0.1);
      for (var fy = 0; fy < filas; fy++) for (var fx = 0; fx < cols; fx++) {
        if (r() > 0.55) p.push('<circle cx="' + (ox + fx * 22) + '" cy="' + (oy + fy * 22) + '" r="3.5" fill="' + acento + '" fill-opacity="0.75"/>');
      }
    }

    // Icono de la categoría
    var icono = ICONOS[op.categoria] || ICONOS["Bienestar"];
    var s = Math.min(W, H) * 0.42, ix = W - s - W * 0.07, iy = (H - s) / 2;
    p.push('<g transform="translate(' + ix.toFixed(0) + ' ' + iy.toFixed(0) + ') scale(' + (s / 100).toFixed(3) + ')">' +
      '<circle cx="50" cy="50" r="46" fill="' + claro + '" fill-opacity="0.95"/>' +
      '<path d="' + icono + '" fill="none" stroke="' + fondo + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>');

    if (op.conTexto !== false) {
      var etiqueta = cientifico ? (op.categoria && op.categoria !== "Investigación" ? "INVESTIGACIÓN · " + op.categoria : "INVESTIGACIÓN") : (op.categoria || "");
      p.push('<text x="' + (W * 0.06).toFixed(0) + '" y="' + (H * 0.84).toFixed(0) + '" fill="' + acento + '" font-family="Georgia, serif" font-size="' + Math.round(H * 0.045) + '" letter-spacing="3">' + esc(etiqueta.toUpperCase()) + '</text>');
      p.push('<text x="' + (W * 0.06).toFixed(0) + '" y="' + (H * 0.93).toFixed(0) + '" fill="' + claro + '" font-family="Georgia, serif" font-size="' + Math.round(H * 0.05) + '" font-weight="bold">LOGOS 360</text>');
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img"' +
      (op.alt ? ' aria-label="' + esc(op.alt) + '"' : ' aria-hidden="true"') + '>' + p.join("") + "</svg>";
  }

  function dataUri(op) { return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg(op)); }

  /* Devuelve la URL de imagen a usar para un artículo */
  function imagenDe(a, extra) {
    if (a && a.imagen_modo === "subida" && a.imagen_url) return a.imagen_url;
    var op = { categoria: a.categoria, titulo: a.titulo, semilla: a.imagen_semilla, tipo: a.tipo, alt: a.imagen_alt };
    if (extra) for (var k in extra) op[k] = extra[k];
    return dataUri(op);
  }

  /* Convierte la portada en PNG (para descargarla o subirla) */
  function aPNG(op, cb) {
    var img = new Image();
    img.onload = function () {
      var c = document.createElement("canvas"); c.width = op.ancho || 1200; c.height = op.alto || 630;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(cb, "image/png");
    };
    img.src = dataUri(op);
  }

  global.Logos360Portadas = { svg: svg, dataUri: dataUri, imagenDe: imagenDe, aPNG: aPNG, categorias: Object.keys(PALETAS) };
})(window);
