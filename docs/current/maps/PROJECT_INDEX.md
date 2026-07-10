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

## Decyzje przekrojowe

* Jedna aplikacja, jeden katalog treści, wiele profili firm.
* Profile firm wskazują treść przez stabilne identyfikatory i nie duplikują danych CV.
* Dane publiczne i prywatne są rozdzielone; publiczny frontend nie przechowuje prywatnych danych.
* Publiczne profile są wybierane przez `?p=<profileId>`.
* Token `#t=<token>` i kod 6–8 znaków nie chronią publicznie zapisanych danych.
* Prywatne dane będą później pobierane z zewnętrznego backendu.
* UI pozostaje jedną stroną z kartą główną i jednym otwartym panelem naraz.
* Startowy język to polski, a model danych jest gotowy na kolejne języki.
* Streamlit, backend, frontend i PDF nie są implementowane w tej fazie.

## Minimalna struktura projektu

```text
src/        # przyszła aplikacja Vite bez frameworka frontendowego
content/    # przyszłe publiczne dane JSON i profile
public/     # przyszłe statyczne zasoby publiczne
editor/     # przyszły lokalny edytor Streamlit
scripts/    # przyszłe skrypty walidacji i PDF
docs/       # dokumentacja
tests/      # przyszłe testy i kontrole spójności
```

