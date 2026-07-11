# Mapa dokumentacji projektu

## Cel

Ten dokument mapuje aktualne źródła prawdy po ukończeniu pierwszego działającego pionowego przekroju aplikacji „Tomasz Talik CV”. Źródłem nadrzędnym jest `docs/current/README.md`, a szczegóły znajdują się w dokumentach tematycznych.

## Dokumenty aktualne

| Dokument | Rola | Główne zależności |
| --- | --- | --- |
| `docs/README.md` | Wejście do dokumentacji | `docs/current/README.md`, `docs/handoff/CURRENT_STATE.md` |
| `docs/current/README.md` | Kanoniczny opis aktualnego stanu | wszystkie dokumenty szczegółowe |
| `docs/current/maps/PROJECT_INDEX.md` | Mapa dokumentów, kodu i danych | `docs/current/README.md` |
| `docs/current/content/CONTENT_MODEL.md` | Publiczne JSON, statusy, profile i konfiguracja PDF | personalizacja, UI, PDF |
| `docs/current/content/FIRST_PUBLIC_CV_CONTENT.md` | Robocze źródło pierwszej paczki treści CV; nie opisuje funkcji ani treści już opublikowanych | model treści, dane publiczne |
| `docs/current/product/PERSONALIZATION_SYSTEM.md` | Profile przez `?p=<profileId>` i fallback do `default` | model treści, bezpieczeństwo, UI |
| `docs/current/ui/SINGLE_PAGE_FLOW.md` | Jedna karta CV, mobile first, accordion i aria | frontend, model treści, personalizacja |
| `docs/current/security/ACCESS_AND_PRIVACY.md` | Rozdział danych publicznych i prywatnych | model treści, personalizacja, deployment |
| `docs/current/technical/FRONTEND_ARCHITECTURE.md` | Zaimplementowany przekrój Vite, Vanilla JS, CSS i JSON | model treści, personalizacja, UI, PDF |
| `docs/current/technical/PDF_PIPELINE.md` | PDF jako `window.print()` aktualnego widoku i `print.css` | frontend, model treści, personalizacja |
| `docs/current/technical/LOCAL_EDITOR.md` | Przyszły lokalny edytor Streamlit | model treści, personalizacja, bezpieczeństwo |
| `docs/current/technical/DEPLOYMENT.md` | Docelowy GitHub Pages i niepotwierdzony deployment produkcyjny | frontend, bezpieczeństwo, PDF |
| `docs/handoff/README.md` | Wejście do dokumentów przekazania pracy | `docs/handoff/CURRENT_STATE.md` |
| `docs/handoff/CURRENT_STATE.md` | Aktualny stan, testy, decyzje i następny krok | dokumentacja bieżąca, kod, dane |

## Pliki kodu i danych istotne dla przekroju

| Plik | Rola |
| --- | --- |
| `package.json` | Skrypty `dev`, `build`, `validate:content` i zależności Vite/Ajv |
| `vite.config.js` | Konfiguracja Vite z relatywną bazą |
| `content/public/*.json` | Publiczne dane CV; obecnie większość rzeczywistej treści ma status `draft` |
| `docs/current/content/FIRST_PUBLIC_CV_CONTENT.md` | Robocza paczka źródłowa dla pierwszych treści, przeniesiona z katalogu głównego dokumentacji roboczej |
| `content/profiles/default.json` | Bezpieczny profil awaryjny `default` |
| `content/schemas/*.schema.json` | Kontrakt danych JSON |
| `src/app/content-loader.js` | Import publicznych JSON i profili przez eager glob |
| `src/app/profile-resolver.js` | Wybór profilu przez `?p=` i fallback do `default` |
| `src/app/view-model.js` | Łączenie danych, filtrowanie `published`, ukrywanie pustych sekcji |
| `src/app/bootstrap.js` | Składanie strony, komunikat fallbacku i jedna karta CV |
| `src/components/hero-card.js` | Górna część karty, opcjonalny portret, akcje i `window.print()` |
| `src/components/accordion.js` | Dostępny accordion z maksymalnie jednym otwartym panelem |
| `src/styles/print.css` | Widok drukowany pokazujący opublikowane sekcje niezależnie od accordionu |

## Decyzje przekrojowe

* Jedna aplikacja, jeden katalog treści, wiele profili firm.
* Publiczne profile wybiera `?p=<profileId>`; nieistniejący profil wraca do `profile default` i pokazuje zwarty pasek fallbacku.
* UI jest jedną wspólną kartą CV o maksymalnej szerokości około 940 px, z podejściem mobile first i motywem przez `prefers-color-scheme`.
* Accordion używa dostępnych przycisków i aria; jednocześnie otwarty może być najwyżej jeden panel, a wszystkie panele można zamknąć.
* Elementy `draft` i `archived` oraz puste sekcje są ukrywane.
* Publiczny widok może obecnie pokazać tylko imię i nazwisko, ponieważ większość treści pozostaje `draft`.
* PDF jest wydrukiem aktualnego HTML i view modelu przez `window.print()` oraz `print.css`; nie jest statycznym plikiem.
* Streamlit i Playwright pozostają przyszłe i mają używać tego samego HTML, view modelu i stylów wydruku.
