# Mapa dokumentacji projektu

## Cel

Ten dokument jest mapą aktualnej dokumentacji i zależności. Źródłem nadrzędnym jest `docs/current/README.md`, a szczegóły znajdują się w dokumentach tematycznych.

## Dokumenty aktualne

| Dokument | Rola | Główne zależności |
| --- | --- | --- |
| `docs/README.md` | Wejście do dokumentacji | `docs/current/README.md` |
| `docs/current/README.md` | Kanoniczny opis architektury | wszystkie dokumenty szczegółowe |
| `docs/current/technical/FRONTEND_ARCHITECTURE.md` | Stos Vite, Vanilla JS, CSS, JSON i stan aplikacji | model treści, personalizacja, UI, bezpieczeństwo |
| `docs/current/content/CONTENT_MODEL.md` | Jedna baza treści, stabilne identyfikatory, gotowość na języki | personalizacja, edytor, PDF |
| `docs/current/product/PERSONALIZATION_SYSTEM.md` | Profile firm, `?p=<profileId>`, `#t=<token>`, kod 6–8 znaków | model treści, bezpieczeństwo, UI |
| `docs/current/ui/SINGLE_PAGE_FLOW.md` | Karta główna i panele rozwijane | frontend, model treści, personalizacja |
| `docs/current/security/ACCESS_AND_PRIVACY.md` | Rozdział danych publicznych i prywatnych | model treści, personalizacja, deployment |
| `docs/current/technical/PDF_PIPELINE.md` | PDF z tego samego HTML przez `print.css` i Playwright | frontend, model treści, personalizacja |
| `docs/current/technical/LOCAL_EDITOR.md` | Lokalny edytor Streamlit | model treści, personalizacja, bezpieczeństwo |
| `docs/current/technical/DEPLOYMENT.md` | Vite i GitHub Pages bez potoku publikacji | frontend, bezpieczeństwo, PDF |
| `content/public/*.json` | Kanoniczne publiczne dane CV rozdzielone według obszarów | model treści, personalizacja |
| `content/profiles/default.json` | Bezpieczny profil awaryjny wskazujący istniejące identyfikatory | model treści, personalizacja |
| `content/schemas/*.schema.json` | JSON Schema dla danych publicznych, profili i typów wspólnych | model treści |
| `scripts/validate-content.mjs` | Walidator schematów, relacji i reguł bezpieczeństwa danych | model treści |
| `index.html` | Punkt wejścia aplikacji Vite | frontend |
| `vite.config.js` | Konfiguracja Vite z relatywną bazą dla GitHub Pages | deployment, frontend |
| `src/main.js` | Import stylów i uruchomienie bootstrapu aplikacji | frontend |
| `src/app/content-loader.js` | Import publicznych JSON i eager glob profili | model treści, personalizacja |
| `src/app/profile-resolver.js` | Wybór profilu przez `?p=` i fallback do profilu `default` | personalizacja |
| `src/app/view-model.js` | Niemutujące łączenie danych bazowych z dozwolonym wpływem profilu | model treści, UI |
| `src/app/bootstrap.js` | Składanie widoku, obsługa błędu startu i komunikatu fallbacku | frontend, UI |
| `src/components/hero-card.js` | Stała karta główna z istniejących danych | UI |
| `src/components/accordion.js` | Dostępne panele z jednym otwartym panelem naraz | UI |
| `src/sections/*.js` | Renderowanie treści paneli „O mnie” i „Projekty” | UI, model treści |
| `src/styles/*.css` | Tokeny, układ mobile first, motywy systemowe i animacje paneli | frontend, UI |
| `src/utils/*.js` | Pomocnicze tworzenie DOM i adresów zasobów z `BASE_URL` | frontend |

## Decyzje przekrojowe

* Jedna aplikacja, jeden katalog treści, wiele profili firm.
* Profile firm wskazują treść przez stabilne identyfikatory i nie duplikują danych CV.
* Dane publiczne i prywatne są rozdzielone; publiczny frontend nie przechowuje prywatnych danych.
* Publiczne profile są wybierane przez `?p=<profileId>`.
* UI pozostaje jedną stroną z kartą główną i jednym otwartym panelem naraz.
* Startowy język to polski, a model danych jest gotowy na kolejne języki.
* Streamlit, backend, frontend i PDF nie są implementowane w tej fazie.

## Minimalna struktura projektu

```text
src/        # aplikacja Vite bez frameworka: app, components, sections, styles, utils
content/    # publiczne dane JSON, profile i schematy kontraktu danych
public/     # przyszłe statyczne zasoby publiczne
editor/     # przyszły lokalny edytor
scripts/    # skrypty walidacji danych; PDF pozostaje przyszłym etapem
docs/       # dokumentacja
tests/      # przyszłe testy i kontrole spójności
```

