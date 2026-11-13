/* LOGOS 360 · Configuración del módulo de la Intranet
   Usa el MISMO proyecto Supabase que la Intranet: así la sesión ya iniciada
   en la Intranet sirve aquí y no hay que volver a entrar. */
window.LOGOS360_ADMIN = {
  supabaseUrl: "https://TU-PROYECTO.supabase.co",
  supabaseAnonKey: "TU-CLAVE-ANON",
  blogUrl: "https://hafaja.github.io/logos360/",   // dirección del blog en GitHub Pages
  funcionIA: "logos360-ia"                           // nombre de la Edge Function
};
