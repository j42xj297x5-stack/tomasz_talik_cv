# Deployment

## Produkcja

Produkcyjny adres CV to `https://j42xj297x5-stack.github.io/tomasz_talik_cv/`. GitHub Pages publikuje statyczny katalog `dist` z gałęzi `tomasz_talik_cv`; nie jest używana gałąź `main` ani osobna gałąź `gh-pages`. Produkcyjny `base` Vite wynosi `/tomasz_talik_cv/`, a lokalny `npm run dev` działa pod `/`.

## GitHub Actions

Workflow `.github/workflows/deploy-pages.yml` uruchamia się automatycznie po pushu do gałęzi `tomasz_talik_cv` oraz ręcznie przez `workflow_dispatch`. Używa środowiska `github-pages`, minimalnych uprawnień `contents: read`, `pages: write`, `id-token: write`, współbieżności Pages z anulowaniem starszych niezakończonych wdrożeń, Node.js 24 oraz oficjalnych akcji `actions/checkout@v4`, `actions/setup-node@v4`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` i `actions/deploy-pages@v4`.

Pipeline wykonuje `npm ci`, `npm run validate:content` i `npm run build`, a następnie publikuje `dist`.

## Publiczna konfiguracja API

Frontend produkcyjny zna publiczny adres Workera z `.env.production`: `https://withered-leaf-cf6b.tapchanbuddha.workers.dev`. To publiczna konfiguracja, nie sekret. Sekrety takie jak `EDITOR_ADMIN_KEY`, `TOKEN_PEPPER` i `PRIVATE_PROFILE_JSON` nie trafiają do `.env.production`, repozytorium ani GitHub Pages.

Cloudflare Worker musi dopuścić origin `https://j42xj297x5-stack.github.io`. Sam deployment na GitHub Pages nie zastępuje poprawnej konfiguracji CORS po stronie Workera.

## Prywatność

GitHub Pages nie jest miejscem na prywatne dane ani sekrety. Status `draft`, `?preview=draft`, publiczne profile i statyczne zasoby nie chronią danych. Publiczny JSON profilu pozostaje w formacie `public/profiles/<p>.json` i zawiera tylko `id` oraz `companyName`; prywatny token `k` oraz dane prywatne nie trafiają do repozytorium ani Pages.

## Profile firmowe

Lokalny edytor generuje link w formacie `https://j42xj297x5-stack.github.io/tomasz_talik_cv/#p=<p>&k=<k>`. Użytkownik w normalnej pracy nie wpisuje adresu CV ani Workera, bo publiczne stałe pochodzą z `editor/config.defaults.json`; lokalny sekret `editorAdminKey` pozostaje w ignorowanym `editor/config.local.json`.
