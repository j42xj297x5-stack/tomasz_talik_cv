# Dokumentacja projektu „Tomasz Talik CV”

## Status

Ten katalog opisuje kanoniczny stan projektu po ukończeniu pierwszego działającego pionowego przekroju aplikacji. Aktualna aplikacja to statyczny frontend Vite z Vanilla JavaScript, CSS i publicznymi danymi JSON. Dokumentacja nie traktuje Streamlit, Playwright ani backendu jako zaimplementowanych.

## Źródła prawdy

1. `docs/current/README.md` — główny opis aktualnego stanu i zakresu przekroju.
2. `docs/current/**` — dokumenty tematyczne dla frontendu, treści, UI, PDF, personalizacji, prywatności i deploymentu.
3. `docs/handoff/CURRENT_STATE.md` — skrót pozwalający rozpocząć kolejny wątek bez czytania historii rozmowy.
4. `docs/current/maps/PROJECT_INDEX.md` — mapa dokumentów, kodu i danych istotnych dla aktualnego stanu.

Jeśli dokumenty różnią się poziomem szczegółowości, obowiązuje najbliższy tematycznie dokument z `docs/current/**`, a dla przejęcia pracy — `docs/handoff/CURRENT_STATE.md`.

## Zasady ogólne

* Projekt jest jedną aplikacją Vite opartą o Vanilla JavaScript, CSS i dane JSON.
* Profile firm są wybierane przez `?p=<profileId>` i nie kopiują głównych danych CV.
* Brak lub błąd profilu bezpiecznie wraca do profilu `default`.
* Dane publiczne mogą trafić do statycznego frontendu; dane prywatne nie mogą być w nim zapisane.
* Frontend renderuje wyłącznie treści `published`; `draft` i `archived` są ukrywane razem z pustymi sekcjami.
* PDF w pierwszej wersji jest wydrukiem aktualnego widoku przez `window.print()` i `src/styles/print.css`, bez statycznego pliku PDF.

## Mapa dokumentacji

Pełna mapa znajduje się w `docs/current/maps/PROJECT_INDEX.md`.
