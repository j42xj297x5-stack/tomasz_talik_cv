# Deployment

## Cel

Dokument opisuje docelowy kierunek publikacji bez implementowania potoku. Zależy od `docs/current/technical/FRONTEND_ARCHITECTURE.md` i `docs/current/security/ACCESS_AND_PRIVACY.md`.

## Vite

Aplikacja ma być budowana jako statyczny frontend Vite. Vite odpowiada za lokalne uruchamianie, bundling i przygotowanie artefaktów statycznych.

## GitHub Pages

Docelowym hostingiem publicznej aplikacji może być GitHub Pages. Publikowane artefakty są statyczne, więc wszystkie dane w nich zawarte są publiczne.

## Brak potoku w tej fazie

Ten dokument nie implementuje GitHub Actions, konfiguracji Vite ani procesu publikacji. Ustala tylko, że przyszły deployment powinien wspierać statyczną aplikację Vite i nie może wymagać frameworka frontendowego.

## Dane prywatne

GitHub Pages nie jest miejscem na prywatne dane. Jeśli aplikacja ma pokazać dane prywatne, musi pobrać je później z zewnętrznego backendu. Token i kod nie zabezpieczają danych zapisanych w statycznych plikach.

## Zależności

* Architektura frontendu: `docs/current/technical/FRONTEND_ARCHITECTURE.md`.
* Prywatność: `docs/current/security/ACCESS_AND_PRIVACY.md`.
* PDF: `docs/current/technical/PDF_PIPELINE.md`.

