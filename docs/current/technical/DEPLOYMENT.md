# Deployment

## Cel

Dokument opisuje docelowy kierunek publikacji dla statycznej aplikacji Vite. Zależy od `docs/current/technical/FRONTEND_ARCHITECTURE.md` i `docs/current/security/ACCESS_AND_PRIVACY.md`.

## Vite

Aplikacja jest budowana jako statyczny frontend Vite. Vite odpowiada za lokalne uruchamianie, bundling i przygotowanie artefaktów statycznych. Lokalnie potwierdzono działanie instalacji zależności npm, `npm run validate:content`, `npm run build` oraz uruchomienie strony przez `npm run dev`.

## GitHub Pages

Docelowym hostingiem publicznej aplikacji pozostaje GitHub Pages. Publikowane artefakty są statyczne, więc wszystkie dane w nich zawarte należy traktować jako publiczne. Produkcyjny deployment na GitHub Pages nie został jeszcze potwierdzony.

## Status potoku

Nie ma jeszcze potwierdzonego produkcyjnego procesu publikacji. Dokument nie opisuje gotowych GitHub Actions ani wdrożonego środowiska produkcyjnego; ustala wyłącznie kierunek dla statycznej aplikacji Vite.

## Dane prywatne

GitHub Pages nie jest miejscem na prywatne dane. Jeśli aplikacja ma pokazać dane prywatne, musi pobrać je później z zewnętrznego backendu. Token i kod nie zabezpieczają danych zapisanych w statycznych plikach.

## PDF

Pierwsza wersja PDF działa jako wydruk aktualnego widoku przez `window.print()` i `src/styles/print.css`. Przyszła automatyzacja przez Playwright ma używać tego samego HTML, view modelu i stylów wydruku; Playwright nie jest jeszcze zaimplementowany jako część deploymentu.

## Zależności

* Architektura frontendu: `docs/current/technical/FRONTEND_ARCHITECTURE.md`.
* Prywatność: `docs/current/security/ACCESS_AND_PRIVACY.md`.
* PDF: `docs/current/technical/PDF_PIPELINE.md`.
