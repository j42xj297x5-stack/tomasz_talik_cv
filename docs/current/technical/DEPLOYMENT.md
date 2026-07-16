# Deployment

## Środowisko produkcyjne

- Repozytorium: `j42xj297x5-stack/tomasz_talik_cv`.
- Gałąź produkcyjna: `tomasz_talik_cv`.
- Hosting: GitHub Pages.
- Adres produkcyjny: `https://j42xj297x5-stack.github.io/tomasz_talik_cv/`.
- Produkcyjny base Vite: `/tomasz_talik_cv/`.

## Workflow

Deployment obsługuje `.github/workflows/deploy-pages.yml`. Workflow uruchamia się na push do gałęzi `tomasz_talik_cv` oraz ręcznie przez `workflow_dispatch`.

Kroki produkcyjne:

1. Checkout.
2. Setup Node.js 24 z cache npm.
3. Configure Pages.
4. `npm ci`.
5. `npm run validate:content`.
6. `npm run build`.
7. Upload artefaktu `dist`.
8. Deploy to GitHub Pages.

Workflow używa minimalnych uprawnień `contents: read`, `pages: write`, `id-token: write` oraz `concurrency` dla grupy `pages`.

## Konfiguracja frontendu

Publiczna zmienna `VITE_PRIVATE_PROFILE_API_URL` wskazuje Worker `https://withered-leaf-cf6b.tapchanbuddha.workers.dev`. Nie jest sekretem. Sekrety Workera i `editorAdminKey` nie trafiają do GitHub Pages.

## Relacja Pages–Worker

Pages dostarcza statyczny frontend. Worker dostarcza prywatny kontakt przez API. Ponieważ są to osobne originy, Worker musi mieć poprawny CORS dla `https://j42xj297x5-stack.github.io` i ewentualnych potwierdzonych originów lokalnych.

## Diagnostyka

Przebieg diagnostyczny:

1. Uruchomić walidację treści.
2. Uruchomić build.
3. Sprawdzić wynik workflow GitHub Actions.
4. Otworzyć stronę produkcyjną.
5. Sprawdzić `/health` Workera.
6. Sprawdzić CORS dla `POST /profile`.
7. Sprawdzić publiczny profil `#p=<p>` po publikacji JSON-u.
8. Sprawdzić prywatny kontakt `#k=<k>` dla aktywnego tokenu.
