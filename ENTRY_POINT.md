# ENTRY POINT — Tomasz Talik CV

## 1. Cel pliku

To jest pierwszy dokument do przeczytania przed każdym zadaniem w tym repozytorium. Opisuje wyłącznie stan potwierdzony przez aktualne pliki; po nim czytaj tylko pliki wskazane dla danego typu zadania.

## 2. Aktualny stan projektu

- **Wdrożone w repozytorium:** jednostronicowy frontend Vite 7 + Vanilla JavaScript + CSS, publiczne dane JSON, profile repozytoryjne, publiczna nakładka firmy, PL/EN, podgląd szkiców, accordion, wydruk przez przeglądarkę, walidator Ajv oraz lokalny edytor Streamlit.
- **Uruchomienie frontendu:** `npm run dev`; dostępne są też `npm run validate:content`, `npm run build` i `npm run preview` (`package.json`). Vite używa `/` w trybie serwera i `/tomasz_talik_cv/` w buildzie (`vite.config.js`).
- **Publikacja skonfigurowana w repozytorium:** GitHub Actions buduje `dist` i wdraża GitHub Pages po pushu do `tomasz_talik_cv` lub ręcznie (`.github/workflows/deploy-pages.yml`). Dokumentacja aktualna podaje adres produkcyjny, ale jego bieżącej dostępności nie można potwierdzić samym repozytorium.
- **Prywatny kontakt:** frontend ma klienta zewnętrznego API Workera i lokalny edytor aktywujący token. Kod Workera, konfiguracja Cloudflare i baza D1 **nie znajdują się w repozytorium**, więc ich implementacja i stan operacyjny są niepotwierdzone tutaj.

## 3. Hierarchia źródeł prawdy

Przy konflikcie rozstrzygaj w tej kolejności:

1. Działający kod, konfiguracja i aktualne dane: `src/`, `content/`, `public/`, `package.json`, `vite.config.js`, `scripts/validate-content.mjs`, `.github/workflows/deploy-pages.yml`, `editor/`.
2. Aktualne dokumenty kanoniczne: `docs/current/README.md` oraz najbliższy tematycznie plik w `docs/current/`.
3. Aktualna mapa: `docs/current/maps/PROJECT_INDEX.md`.
4. Handoff: `docs/handoff/CURRENT_STATE.md`.
5. Dokumenty planistyczne lub historyczne: `PROJECT_INDEX.md` i `TOMASZ TALIK CV — HANDOFF DO NOWEGO WĄTK.md`; nie opisują one obecnego stanu, gdy przeczą kodowi.

Nie traktuj katalogów legacy ani audits jako domyślnych źródeł.

## 4. Mapa repozytorium

| Obszar | Odpowiedzialność |
| --- | --- |
| `index.html`, `src/main.js` | HTML i punkt uruchomienia modułu aplikacji. |
| `src/app/` | Bootstrap, ładowanie danych, resolver profili, view model i klient prywatnego API. |
| `src/components/`, `src/sections/`, `src/background/` | Renderery UI, sekcje CV i dekoracyjne tło. |
| `src/styles/` | Tokeny, layout, komponenty, accordion oraz reguły wydruku. |
| `content/public/*.json` | Kanoniczna publiczna treść CV i publiczne adresy. |
| `content/profiles/*.json` | Profile repozytoryjne wybierane przez query `?p=`. |
| `content/schemas/*.schema.json`, `scripts/validate-content.mjs` | Kontrakt JSON Schema i walidacja schematów oraz relacji. |
| `public/profiles/*.json`, `public/assets/` | Publiczne nakładki firmowe i zasoby statyczne kopiowane do buildu. |
| `editor/` | Lokalny edytor Streamlit; konfiguracja domyślna i przykład konfiguracji lokalnej. |
| `.github/workflows/deploy-pages.yml`, `vite.config.js` | Deployment Pages i ścieżka bazowa buildu. |
| `docs/current/`, `docs/handoff/` | Aktualna dokumentacja tematyczna, mapa i handoff. |

## 5. Mapa zależności

```text
index.html → src/main.js → bootstrap → renderery komponentów i sekcji → DOM
content/public/*.json + content/profiles/*.json → content-loader → resolveProfile(?p) → createViewModel → Hero / accordion / sekcje
#p=<token> → profile-resolver → public/profiles/<token>.json → companyName → Hero
PL/EN → hero-card → bootstrap (ponowny render) → createViewModel.localizedText → wszystkie renderery
?preview=draft → bootstrap → createViewModel (filtr statusów) → renderery
Hero: „Zapisz jako PDF” → hero-card → usunięcie #k z URL → window.print() → src/styles/print.css
#k=<token> → profile-resolver → private-profile-client → zewnętrzne POST /profile → private-contact
content + schemas + profile references → scripts/validate-content.mjs (Ajv) → wynik walidacji
editor/app.py + config.* + content/public/links.json → JSON publicznego profilu / POST /admin/create / materiały mailowe
push do tomasz_talik_cv → deploy-pages.yml → validate:content → vite build → dist → GitHub Pages
```

Zewnętrzny Worker, D1 i endpoint `/admin/create` są zależnościami opisanymi oraz wywoływanymi przez klienty, lecz nie mają kodu w tym repozytorium.

## 6. Główne przepływy

| Przepływ | Potwierdzony przebieg | Wynik / status |
| --- | --- | --- |
| Uruchomienie strony | `index.html` → `src/main.js` → `bootstrap()` → ładowanie, resolver, view model, renderery | Wdrożone. |
| Wybór profilu | `?p=<profileId>` → `content/profiles/*.json` → fallback `default` → view model | Wdrożone; profil steruje widocznością i kolejnością. |
| Ładowanie danych | importy `content/public/*.json` + `import.meta.glob(content/profiles)` → `content-loader` | Wdrożone; dane są bundlowane jako publiczne. |
| Firma | `#p=<token>` → fetch `public/profiles/<token>.json` → `companyName` → Hero | Wdrożone; plik jest publiczny, błąd daje fallback. |
| Język | kontrolka Hero → callback bootstrap → nowy view model PL/EN → ponowne renderowanie | Wdrożone. |
| Zapis jako PDF | przycisk Hero → tymczasowe usunięcie `#k` → `window.print()` → `print.css` | Wdrożone; brak serwerowego generatora PDF. |
| Publikacja profilu firmy | edytor generuje JSON → ręczne zapisanie w `public/profiles/` → deployment | Częściowo wdrożone; edytor nie publikuje pliku automatycznie. |
| Dostęp prywatny | `#k=<token>` → POST z frontendu `/profile` → sanityzacja odpowiedzi → `private-contact` | Klient wdrożony; Worker i przechowywanie danych niepotwierdzone w repozytorium. |
| Aktywacja tokenu | edytor → POST `/admin/create` z lokalnym kluczem administracyjnym | Klient edytora wdrożony; backend niepotwierdzony w repozytorium. |
| Walidacja | `npm run validate:content` → Ajv + walidacje krzyżowe | Wdrożone. |
| Deployment | workflow → `npm ci` → walidacja → build → Pages | Workflow wdrożony; faktyczna publikacja wymaga potwierdzenia poza repozytorium. |

## 7. Nawigacja według typu zadania

| Typ zadania | Zacznij od | Następnie sprawdź | Nie czytaj domyślnie |
| --- | --- | --- | --- |
| Zmiana treści CV | `content/public/*.json` | odpowiedni schemat, `CONTENT_MODEL.md`, walidator | komponentów i edytora |
| Zmiana profilu firmy | `content/profiles/default.json` lub `public/profiles/*.json` | `profile-resolver.js`, `PERSONALIZATION_SYSTEM.md` | prywatnego API |
| Prywatność i tokeny | `ACCESS_AND_PRIVACY.md` | `profile-resolver.js`, `private-profile-client.js`, `editor/app.py` | danych CV i stylów |
| Edytor profili | `editor/app.py` | `config.defaults.json`, `config.example.json`, `LOCAL_EDITOR.md` | renderowania strony |
| Wygląd strony | właściwy komponent/sekcja w `src/` | właściwy plik `src/styles/`, `SINGLE_PAGE_FLOW.md` | danych i backendu |
| PDF | `hero-card.js`, `src/styles/print.css` | `PDF_PIPELINE.md`, dane `identity.json` | edytora i Workera |
| Walidacja | `scripts/validate-content.mjs` | `content/schemas/*.schema.json`, zmienione JSON-y | UI |
| Deployment | `.github/workflows/deploy-pages.yml` | `vite.config.js`, `package.json`, `DEPLOYMENT.md` | edytora |
| Dodanie nowej sekcji | `view-model.js` | profil, dane, schemat, walidator, renderer sekcji i style | Worker i deployment |
| Błąd ładowania danych | `content-loader.js`, `bootstrap.js` | wskazane JSON-y, resolver, walidator | edytora i dokumentów planistycznych |

## 8. Aktualne ograniczenia i konflikty

- `PROJECT_INDEX.md` w katalogu głównym oraz datowany handoff `TOMASZ TALIK CV — HANDOFF DO NOWEGO WĄTK.md` opisują brak backendu i deploymentu, co przeczy aktualnemu workflow, klientowi prywatnego API, edytorowi i `docs/current/`.
- `docs/current/` i handoff opisują działający Cloudflare Worker oraz D1, ale w repozytorium nie ma kodu Workera, konfiguracji Cloudflare, `wrangler.toml` ani migracji bazy; ich szczegóły są zewnętrzne i niepotwierdzone lokalnie.
- `editor/config.local.json` jest przewidzianym lokalnym nadpisaniem, ale nie istnieje w repozytorium; nie jest źródłem prawdy ani plikiem do publikacji.
- Publiczny profil firmy jest celowo publiczny; edytor jedynie generuje plik i wymaga ręcznego dodania go do `public/profiles/` oraz deploymentu.

## 9. Zasady aktualizacji ENTRY_POINT.md

Aktualizuj ten plik po zmianie struktury repozytorium, źródeł danych, głównych przepływów, mechanizmu profili, backendu, deploymentu albo hierarchii dokumentacji. Opisuj stan obecny, nie historię zmian; każdą ścieżkę porównuj z repozytorium przed wskazaniem jej jako aktualnej.
