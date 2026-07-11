# Aktualna dokumentacja projektu „Tomasz Talik CV”

## Status

Projekt ma ukończony pierwszy działający pionowy przekrój aplikacji: statyczną stronę Vite z Vanilla JavaScript, CSS i publicznymi danymi JSON. Dokumentacja opisuje stan potwierdzony kodem oraz lokalnymi testami Projektanta; nie opisuje Streamlit, Playwright ani backendu jako funkcji zaimplementowanych.

## Zakres zaimplementowanego przekroju

* Aplikacja jest jedną stroną Vite bez frameworka frontendowego.
* Widok jest składany w Vanilla JavaScript i stylowany CSS.
* Dane publiczne są ładowane z `content/public/*.json`, a profile z `content/profiles/*.json`.
* Profil wybiera parametr `?p=<profileId>`; brak parametru używa profilu `default`.
* Nieistniejący lub niepoprawny profil bezpiecznie wraca do profilu `default` i pokazuje zwarty pasek fallbacku.
* UI ma jedną wspólną kartę CV o maksymalnej szerokości około 940 px.
* Układ jest mobile first i korzysta z motywu systemowego przez `prefers-color-scheme`.
* Accordion ma dostępne przyciski z `aria-expanded`, `aria-controls`, panelami `role="region"` i `aria-labelledby`; jednocześnie może być otwarty najwyżej jeden panel, a kliknięcie otwartego panelu zamyka wszystkie.
* Elementy `draft` i `archived` są ukrywane, a puste sekcje nie są renderowane.
* Portret jest opcjonalny i nie tworzy pustego miejsca, jeśli nie ma go w danych.

## Aktualny stan danych

Większość rzeczywistej treści CV nadal ma status `draft`. Publiczny widok może obecnie zawierać wyłącznie imię i nazwisko „Tomasz Talik”. To oczekiwany efekt filtrowania po statusie `published`, a nie błąd aplikacji.

## PDF

Pierwsza wersja PDF jest wydrukiem aktualnie wyrenderowanego widoku. Przycisk „Zapisz jako PDF” uruchamia `window.print()`, a wygląd wydruku kontroluje `src/styles/print.css`. Wydruk korzysta z tego samego HTML, view modelu i profilu co aplikacja, pokazuje wszystkie opublikowane sekcje wybrane przez profil i nie zależy od bieżącego stanu accordionu. Nie istnieje statyczny plik PDF ani osobny szablon danych PDF.

Ostateczny zakres, kolejność i wygląd treści PDF nie są jeszcze kanonem. Zostaną ustalone po dodaniu pierwszej kanonicznej paczki rzeczywistych danych CV.

## Źródła prawdy i zależności

* Architektura frontendu: `docs/current/technical/FRONTEND_ARCHITECTURE.md`.
* Model treści: `docs/current/content/CONTENT_MODEL.md`.
* Personalizacja: `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Przepływ jednej strony: `docs/current/ui/SINGLE_PAGE_FLOW.md`.
* Dostęp i prywatność: `docs/current/security/ACCESS_AND_PRIVACY.md`.
* PDF: `docs/current/technical/PDF_PIPELINE.md`.
* Deployment: `docs/current/technical/DEPLOYMENT.md`.
* Mapa dokumentacji: `docs/current/maps/PROJECT_INDEX.md`.
* Handoff bieżącego stanu: `docs/handoff/CURRENT_STATE.md`.

## Przyszłe kierunki

Streamlit i Playwright pozostają funkcjami przyszłymi. Gdy zostaną dodane, mają używać tego samego HTML, view modelu i stylów wydruku, a nie osobnych szablonów danych lub układów PDF.
