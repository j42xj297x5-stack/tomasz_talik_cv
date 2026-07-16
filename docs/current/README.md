# Tomasz Talik CV — dokumentacja techniczna

## Status produkcyjny

„Tomasz Talik CV” jest działającym produkcyjnym systemem CV. Zakończony etap obejmuje statyczny frontend, publiczne dane JSON, personalizację, prywatny kontakt z Cloudflare Workera, lokalny edytor Streamlit, wydruk PDF i deployment GitHub Pages. Projekt jest gotowy do używania i dalszego utrzymania.

Frontend jest aplikacją Vite + Vanilla JavaScript + CSS. Nie używa Reacta, Vue, Svelte ani Angulara.

## Adresy publiczne

- Produkcyjne CV: <https://j42xj297x5-stack.github.io/tomasz_talik_cv/>
- Publiczny Worker kontaktu prywatnego: <https://withered-leaf-cf6b.tapchanbuddha.workers.dev>
- Publiczny profil GitHub: <https://github.com/j42xj297x5-stack>

## Najważniejsze możliwości

- CV w języku polskim i angielskim.
- Publiczna treść utrzymywana w plikach JSON.
- Publiczne profile repozytoryjne przez `?p=<profileId>`.
- Publiczna nakładka firmowa przez `#p=<token>` i plik `public/profiles/<p>.json`.
- Prywatne dane kontaktowe pobierane przez `#k=<token>` z Workera.
- Sekcje w układzie accordion.
- Projekty z linkami demonstracyjnymi i dialogiem dla GIF-u DIG Engine.
- Umiejętności w widoku `Chmura` i `Kategorie`.
- PDF przez `window.print()`.
- Lokalny edytor do przygotowania profilu firmowego, tokenu prywatnego oraz treści maila/listu.

## Architektura w skrócie

Aplikacja startuje z `src/main.js`, uruchamia `bootstrap`, ładuje dane przez `content-loader`, rozwiązuje profil w `profile-resolver`, buduje `view-model`, a następnie renderuje komponenty Hero, kontakt prywatny i sekcje accordion. Szczegóły opisuje [architektura frontendu](technical/FRONTEND_ARCHITECTURE.md).

## Przepływ danych

Publiczne dane pochodzą z `content/public/*.json` i profilu `content/profiles/default.json`. Walidacja używa schematów JSON Schema draft-07, Ajv, `ajv-formats` i skryptu `scripts/validate-content.mjs`. Kontrakt danych opisuje [model danych](content/CONTENT_MODEL.md).

## Personalizacja i prywatny kontakt

Mechanizmy są rozdzielone:

- `?p=<profileId>` wybiera profil repozytoryjny.
- `#p=<token>` dokłada nazwę firmy z publicznego JSON-u.
- `#k=<token>` pobiera prywatny kontakt z Workera.

`#k` jest tokenem bearer i nie jest zapisywany w repozytorium, `localStorage`, cookies ani publicznym JSON-ie. Szczegóły opisują [personalizacja](product/PERSONALIZATION_SYSTEM.md), [bezpieczeństwo](security/ACCESS_AND_PRIVACY.md) i [kontrakt Workera](technical/CLOUDFLARE_WORKER.md).

## Projekty i demonstracje

Kanoniczna treść projektów znajduje się w `content/public/projects.json`, a adresy w `content/public/links.json`. Publicznie opisane są Haiku Cosmos, DIG Engine i Interactive AI Portfolio. DIG Engine ma publiczny GIF demonstracyjny, natomiast pełne repozytorium pozostaje prywatne.

## Umiejętności

Umiejętności są podzielone na sześć kategorii i mogą pojawiać się w chmurze SVG. Pole `cloudWeight` steruje wyróżnieniem wizualnym, a nie poziomem wiedzy. Szczegóły modelu są w [modelu danych](content/CONTENT_MODEL.md), a kanoniczny opis treści w [treści CV](content/FIRST_PUBLIC_CV_CONTENT.md).

## PDF

PDF powstaje przez przycisk wywołujący `window.print()`. Nie ma osobnego szablonu PDF; druk używa wspólnego HTML i view modelu oraz reguł `src/styles/print.css`. Kontrakt druku opisuje [PDF pipeline](technical/PDF_PIPELINE.md).

## Lokalny edytor

Edytor działa w Streamlit i jest uruchamiany z `editor/app.py`. Zależności są w `editor/requirements.txt`.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r editor/requirements.txt
streamlit run editor/app.py
```

Na Windows aktywacja środowiska zależy od powłoki; przy blokadzie PowerShell dla komend npm można używać `npm.cmd`.

## Deployment

Deployment wykonuje GitHub Actions z `.github/workflows/deploy-pages.yml`. Workflow działa na push do gałęzi `tomasz_talik_cv` oraz przez `workflow_dispatch`, używa Node.js 24, uruchamia `npm ci`, `npm run validate:content`, `npm run build` i publikuje `dist` na GitHub Pages. Szczegóły są w [deployment](technical/DEPLOYMENT.md).

## Uruchomienie lokalne

```bash
npm ci
npm run dev
```

Na Windows, jeżeli PowerShell blokuje skrypty, można użyć:

```bash
npm.cmd ci
npm.cmd run dev
```

## Walidacja i build

```bash
npm run validate:content
npm run build
```

## Znane ograniczenia

- `k` jest przekazywalnym tokenem bearer, nie pełnym logowaniem użytkownika.
- Publiczne profile firmowe wymagają ręcznego dodania JSON-u i deploymentu.
- PDF zależy od mechanizmu drukowania przeglądarki.
- Brak automatycznego generowania gotowego pliku PDF na serwerze.
- Brak potwierdzonych testów end-to-end Playwright.
- Brak CMS-a; treści są utrzymywane w JSON-ach.
- Edytor nie wysyła maili.
- Wszystkie zasoby `public/` są publiczne.
- Repozytorium DIG Engine pozostaje prywatne; publiczny GIF jest zasobem demonstracyjnym.

## Mapa dokumentacji

Pełna mapa znajduje się w [PROJECT_INDEX.md](maps/PROJECT_INDEX.md). Handoff końcowy znajduje się w [CURRENT_STATE.md](../handoff/CURRENT_STATE.md).
