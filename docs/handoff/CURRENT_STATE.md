# Aktualny stan projektu „Tomasz Talik CV”

## Status

Etap jest zamknięty jako działający produkcyjny system CV gotowy do używania i utrzymania.

## Produkcja

Aplikacja jest opublikowana pod adresem `https://j42xj297x5-stack.github.io/tomasz_talik_cv/`. Prywatny kontakt obsługuje zewnętrzny Cloudflare Worker.

## Architektura

Frontend to statyczna aplikacja Vite + Vanilla JavaScript + CSS bez Reacta, Vue, Svelte i Angulara. Dane są ładowane z JSON-ów, przekształcane przez view model i renderowane w komponentach.

## Dane

Publiczna treść jest w `content/public/*.json`, profil domyślny w `content/profiles/default.json`, a publiczne profile firmowe w `public/profiles/<p>.json`. Walidacja używa JSON Schema draft-07, Ajv i `scripts/validate-content.mjs`.

## Personalizacja

`?p=<profileId>` wybiera profil repozytoryjny. `#p=<token>` dodaje publiczną nazwę firmy. `#k=<token>` pobiera prywatny kontakt. Mechanizmy są niezależne.

## Prywatny kontakt

Frontend wysyła do Workera tylko `k` i przetwarza `json.profile`. Token `k` jest bearer i może zostać przekazany dalej.

## Lokalny edytor

Edytor Streamlit w `editor/app.py` generuje `p`, `k`, JSON profilu firmy oraz treść maila/listu. Aktywuje `k` przez `/admin/create`, ale nie publikuje JSON-u i nie wysyła maili.

## UI

Strona ma Hero, przełącznik PL/EN, avatar ekranowy i drukowany, pełnoszerokościową informację o firmie, accordion, projekty z demonstracjami, prywatny blok kontaktowy oraz umiejętności w widokach Chmura/Kategorie.

## Projekty

Publiczne CV opisuje Haiku Cosmos, DIG Engine i Interactive AI Portfolio. DIG Engine ma publiczny GIF demonstracyjny; repozytorium pozostaje prywatne.

## Umiejętności

Umiejętności są utrzymywane w sześciu kategoriach. `cloudWeight` steruje wyróżnieniem wizualnym w chmurze, a nie poziomem wiedzy.

## PDF

PDF powstaje przez `window.print()`, bez osobnego szablonu. Druk używa wspólnego HTML, ukrywa elementy interaktywne, wymusza kategorie umiejętności i tymczasowo usuwa `k` z URL.

## Deployment

GitHub Actions publikuje `dist` na GitHub Pages z gałęzi `tomasz_talik_cv`. Workflow używa Node.js 24, `npm ci`, `npm run validate:content` i `npm run build`.

## Walidacja

Podstawowe kontrole utrzymaniowe to walidacja treści, build i kontrola workflow Pages. Brak potwierdzonych testów end-to-end Playwright.

## Bezpieczeństwo

Repozytorium, publiczne JSON-y i `public/` są publiczne. Sekrety Workera i `editorAdminKey` nie mogą trafić do repozytorium ani dokumentacji. Nazwy firm nie są przechowywane w D1.

## Znane ograniczenia

`k` nie jest pełnym logowaniem. Publiczne profile firmowe wymagają ręcznego dodania JSON-u i deploymentu. PDF zależy od przeglądarki. Nie ma serwerowego PDF, CMS-a ani automatycznej wysyłki maili.

## Utrzymanie

Opcjonalne dalsze prace: testy end-to-end, automatyczna kontrola wydruku, dalsza redakcja treści, utrzymanie i rotacja tokenów oraz ewentualne przyszłe rozszerzenia.

## Zamknięcie etapu

Frontend, publiczne dane, personalizacja, prywatny kontakt, edytor, PDF i deployment działają jako spójny produkcyjny system CV.
