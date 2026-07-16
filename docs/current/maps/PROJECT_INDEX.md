# Mapa projektu i dokumentacji

## Dokumenty główne

- `docs/current/README.md` — punkt wejścia do aktualnej dokumentacji.
- `docs/handoff/CURRENT_STATE.md` — zwięzły końcowy handoff działającego systemu.

## Treść i model danych

- `docs/current/content/CONTENT_MODEL.md` — kontrakt JSON, profile, schematy i walidacja.
- `docs/current/content/FIRST_PUBLIC_CV_CONTENT.md` — kanoniczna publiczna treść CV.
- `content/public/identity.json` — tożsamość i avatar.
- `content/public/about.json` — Hero i „O mnie”.
- `content/public/projects.json` — projekty i `demoMedia`.
- `content/public/experience.json` — doświadczenie.
- `content/public/education.json` — wykształcenie.
- `content/public/skills.json` — sześć kategorii i umiejętności.
- `content/public/links.json` — profil GitHub, demo i repozytoria.
- `content/profiles/default.json` — profil domyślny.
- `public/profiles/` — publiczne profile firmowe publikowane ręcznie.
- `content/schemas/*.schema.json` — JSON Schema draft-07.
- `scripts/validate-content.mjs` — walidacja Ajv i cross-walidacja.

## Produkt, UI i bezpieczeństwo

- `docs/current/product/PERSONALIZATION_SYSTEM.md` — `?p`, `#p`, `#k`, preview i fallback.
- `docs/current/ui/SINGLE_PAGE_FLOW.md` — przepływ użytkownika jednej strony.
- `docs/current/security/ACCESS_AND_PRIVACY.md` — model dostępu, prywatności i ograniczeń.

## Technika

- `docs/current/technical/FRONTEND_ARCHITECTURE.md` — architektura Vite + Vanilla JavaScript + CSS.
- `docs/current/technical/PDF_PIPELINE.md` — kontrakt `window.print()`.
- `docs/current/technical/DEPLOYMENT.md` — GitHub Pages i workflow.
- `docs/current/technical/LOCAL_EDITOR.md` — lokalny edytor Streamlit.
- `docs/current/technical/CLOUDFLARE_WORKER.md` — kontrakt zewnętrznego Workera.

## Frontend

- `src/main.js` — wejście aplikacji.
- `src/app/bootstrap.js` — inicjalizacja, render i pobieranie prywatnego kontaktu.
- `src/app/content-loader.js` — import publicznych JSON-ów i profili.
- `src/app/profile-resolver.js` — `?p`, `#p`, `#k` i fallback.
- `src/app/private-profile-client.js` — klient `POST /profile` Workera.
- `src/app/view-model.js` — lokalizacja, filtrowanie statusów i model renderowania.
- `src/components/hero-card.js` — Hero, PDF i przełącznik języka.
- `src/components/accordion.js` — sekcje accordion.
- `src/components/private-contact.js` — prywatny blok kontaktowy.
- `src/components/media-lightbox.js` — dialog dla mediów demonstracyjnych.
- `src/components/svg-tag-cloud.js` — chmura umiejętności.
- `src/sections/*.js` — sekcje CV.
- `src/styles/components.css`, `accordion.css`, `print.css` — style ekranu i druku.
- `src/utils/assets.js` — ścieżki zasobów oparte o base Vite.

## Edytor i konfiguracja

- `editor/app.py` — aplikacja Streamlit.
- `editor/requirements.txt` — zależności edytora.
- `editor/config.defaults.json` — domyślne adresy.
- `editor/config.example.json` — przykład konfiguracji lokalnej.
- `editor/config.local.json` — lokalne nadpisanie, nieprzeznaczone do publikacji.

## Deployment

- `.github/workflows/deploy-pages.yml` — workflow Pages.
- `vite.config.js` — base `/tomasz_talik_cv/` dla buildu.
- `.env.production` i `.env.example` — publiczny adres API Workera.
- `package.json` — komendy `dev`, `build`, `preview`, `validate:content`.
