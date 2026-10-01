/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Enables the /admin route. Local development only — see .env.example. */
  readonly VITE_ENABLE_ADMIN?: string;
  /** Public origin, e.g. https://chisinau-guide.md — used for canonical URLs. */
  readonly VITE_SITE_URL?: string;
  /**
   * Formspree endpoint for the "add your favourite place" form, e.g.
   * https://formspree.io/f/xabcdwxy. Safe to expose — it's a public submit
   * URL, not a secret. See .env.example.
   */
  readonly VITE_FORMSPREE_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
