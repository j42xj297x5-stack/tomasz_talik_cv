# Generowanie PDF

## Cel

Dokument definiuje planowany sposób generowania PDF bez wykonywania implementacji. Zależy od `docs/current/technical/FRONTEND_ARCHITECTURE.md`, `docs/current/content/CONTENT_MODEL.md` i `docs/current/product/PERSONALIZATION_SYSTEM.md`.

## Zasada główna

PDF ma powstawać z tego samego HTML i tych samych danych, które renderuje aplikacja webowa. Nie utrzymuje się osobnej kopii treści CV dla PDF.

## Widok drukowany

Aplikacja powinna mieć tryb lub widok drukowany kontrolowany przez CSS, w tym `print.css`. Widok drukowany ukrywa elementy interaktywne, porządkuje sekcje i zachowuje czytelność na stronach PDF.

## Playwright

Docelowe generowanie PDF może być realizowane skryptem Playwright, który uruchamia aplikację, wybiera profil przez `?p=<profileId>`, ewentualnie przekazuje token testowy we fragmencie, czeka na render i zapisuje PDF z widoku drukowanego.

## Personalizacja PDF

Profil firmy może zmieniać kolejność i ekspozycję publicznych treści w PDF tak samo jak w aplikacji. Nie może kopiować głównych danych. Prywatne dane w PDF wymagają późniejszego bezpiecznego pobrania z backendu albo osobnego kontrolowanego procesu poza publicznym frontendem.

## Status

W tej fazie nie generuje się PDF i nie implementuje skryptów. Dokument ustala wyłącznie architekturę.

