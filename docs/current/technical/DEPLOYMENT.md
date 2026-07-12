# Deployment

## Cel

Dokument opisuje aktualny stan publikacji i planowany kierunek hostingu.

## Aktualny stan

Nie ma wdrożenia produkcyjnego. Praca odbywa się lokalnie przez Vite. Dokument nie opisuje wykonanego deploymentu ani gotowego pipeline'u publikacji.

## Lokalny tryb pracy

Aplikacja jest statycznym frontendem Vite. Lokalny podgląd odbywa się przez środowisko deweloperskie Vite po dostępnej instalacji zależności. W bieżącym handoffie nie należy przedstawiać `npm run validate:content` ani `npm run build` jako potwierdzonych przez Codex, jeżeli zależności nie są dostępne.

## Planowany kierunek

GitHub Pages pozostaje planowanym kierunkiem publikacji statycznej aplikacji. Publikowane artefakty będą publiczne, dlatego wszystkie dane w publicznych JSON-ach i zasobach statycznych muszą być traktowane jako publiczne.

## Prywatność

GitHub Pages nie jest miejscem na prywatne dane ani sekrety. Status `draft` oraz parametr `?preview=draft` nie chronią danych. Prywatne informacje wymagają przyszłego backendu i właściwej autoryzacji; backend nie jest obecnie zaimplementowany.

## PDF

Aktualny PDF działa jako `window.print()` bieżącej strony i `src/styles/print.css`. Playwright nie jest częścią obecnego deploymentu i pozostaje przyszłą automatyzacją.

## Następny krok przed deploymentem

Przed przygotowaniem publikacji należy lokalnie wykonać pełne `npm run validate:content`, `npm run build`, test mobile, kontrolę wydruku PL i EN oraz redakcyjny przegląd treści.
