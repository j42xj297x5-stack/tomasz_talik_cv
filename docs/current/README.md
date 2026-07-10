# Aktualna architektura projektu „Tomasz Talik CV”

## Cel dokumentu

Ten dokument ustala wspólną, kanoniczną architekturę przed rozpoczęciem implementacji. Opisuje aplikację jako statyczną, pojedynczą stronę Vite z Vanilla JavaScript, CSS i danymi JSON oraz wskazuje zależności między dokumentami.

## Zakres wersji startowej

Wersja startowa ma być:

* pojedynczą aplikacją typu single page, bez frameworka frontendowego;
* zbudowana w Vite, Vanilla JavaScript, CSS i danych JSON;
* hostowana docelowo jako statyczna strona, np. przez GitHub Pages;
* oparta o jedną główną bazę treści i wiele profili firm;
* przygotowana po polsku, ale z modelem danych gotowym na kolejne języki;
* możliwa do późniejszego rozszerzenia o lokalny edytor Streamlit, backend danych prywatnych i generowanie PDF z tego samego HTML.

## Źródła prawdy i zależności

* Architektura frontendu: `docs/current/technical/FRONTEND_ARCHITECTURE.md`.
* Model treści: `docs/current/content/CONTENT_MODEL.md`.
* Personalizacja: `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Przepływ jednej strony: `docs/current/ui/SINGLE_PAGE_FLOW.md`.
* Dostęp i prywatność: `docs/current/security/ACCESS_AND_PRIVACY.md`.
* PDF: `docs/current/technical/PDF_PIPELINE.md`.
* Lokalny edytor: `docs/current/technical/LOCAL_EDITOR.md`.
* Deployment: `docs/current/technical/DEPLOYMENT.md`.
* Mapa dokumentacji: `docs/current/maps/PROJECT_INDEX.md`.

## Decyzje kanoniczne

1. Istnieje jedna aplikacja, jeden katalog treści i wiele profili firm.
2. Profil firmy nie duplikuje treści CV; przechowuje identyfikatory, kolejność, warianty ekspozycji i krótką wiadomość.
3. Publiczne profile są wybierane parametrem `?p=<profileId>`.
4. Długi token może być przekazywany we fragmencie `#t=<token>`, a zapasowy kod ma mieć 6–8 znaków.
5. Token i kod nie chronią danych zapisanych w publicznym frontendzie.
6. Prywatne dane będą później pobierane z zewnętrznego backendu.
7. Interfejs składa się z jednej karty głównej i paneli rozwijanych; jednocześnie otwarty może być tylko jeden panel.
8. Motyw startowo podąża za `prefers-color-scheme`, a później dostanie ręczny wybór użytkownika.
9. PDF powstaje z tego samego HTML przez widok drukowany, `print.css` i Playwright.
10. Lokalny edytor profili jest planowany jako aplikacja Streamlit.

## Minimalna struktura repozytorium

```text
src/        # kod aplikacji Vite: Vanilla JS, CSS, moduły renderowania i obsługi stanu
content/    # publiczne dane JSON: treści bazowe, profile firm, słowniki i lokalizacje
public/     # statyczne zasoby publiczne, np. ikony i pliki dostępne bez bundlera
editor/     # przyszły lokalny edytor Streamlit; bez implementacji w tej fazie
scripts/    # przyszłe skrypty pomocnicze, np. walidacja danych i generowanie PDF
docs/       # dokumentacja projektu
tests/      # przyszłe testy i kontrole spójności danych
```

Ta struktura jest propozycją organizacji, nie implementacją aplikacji.

