# Dokumentacja projektu „Tomasz Talik CV”

## Status

Ten katalog opisuje kanoniczną architekturę projektu przed implementacją aplikacji. Dokumentacja jest źródłem decyzji projektowych, a nie gotowym kodem frontendu, edytora, backendu ani potoku publikacji.

## Źródła prawdy

1. `docs/current/README.md` — główny indeks aktualnej dokumentacji i zakres wersji startowej.
2. Dokumenty w `docs/current/**` — szczegółowe decyzje architektoniczne.
3. `PROJECT_INDEX.md` — wcześniejsza koncepcja projektu, używana wyłącznie jako kontekst wejściowy.

Jeśli dokumenty szczegółowe i ten plik różnią się poziomem szczegółowości, obowiązują dokumenty z `docs/current/**`.

## Zasady ogólne

* Projekt jest jedną aplikacją Vite opartą o Vanilla JavaScript, CSS i dane JSON.
* Nie jest wymagany framework frontendowy.
* Aplikacja ma jeden katalog treści i wiele profili firm.
* Profile firm wybierają treści przez stabilne identyfikatory i nie kopiują głównych danych CV.
* Dane publiczne mogą trafić do statycznego frontendu; dane prywatne nie mogą być w nim zapisane.
* Token w URL i krótki kod dostępu są mechanizmami wyboru lub wygody, a nie zabezpieczeniem danych znajdujących się w publicznych plikach.

## Mapa dokumentacji

Pełna mapa znajduje się w `docs/current/maps/PROJECT_INDEX.md`.

