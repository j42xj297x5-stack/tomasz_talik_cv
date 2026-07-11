# Przepływ jednej strony

## Cel

Dokument jest źródłem prawdy dla aktualnego układu i podstawowej interakcji UI. Zależy od `docs/current/technical/FRONTEND_ARCHITECTURE.md`, `docs/current/content/CONTENT_MODEL.md` i `docs/current/product/PERSONALIZATION_SYSTEM.md`.

## Układ

Aplikacja jest pojedynczą stroną. Użytkownik widzi jedną wspólną kartę CV o maksymalnej szerokości około 940 px, w której górna część i accordion tworzą jeden kontener. Nie ma osobnych kart sekcji, podstron ani routingu wymagającego frameworka frontendowego.

## Karta główna

Karta główna prezentuje dostępne publiczne informacje z view modelu: imię i nazwisko, niepowtórzony headline albo targetRole, opublikowany krótki opis, opublikowane wyróżnione umiejętności, opcjonalny komunikat profilu firmowego oraz akcje dostępne tylko przy istniejących danych. Opcjonalny portret jest renderowany tylko wtedy, gdy istnieje w danych; brak portretu nie zostawia pustej kolumny ani placeholdera.

## Panele rozwijane

Sekcje szczegółowe są zwartymi wierszami accordionu rozdzielonymi subtelnymi liniami. Domyślnie wszystkie panele są zamknięte. Jednocześnie otwarty może być najwyżej jeden panel, a kliknięcie otwartego panelu zamyka wszystkie. Przyciski używają `aria-expanded` i `aria-controls`; panele używają `role="region"`, `aria-labelledby` i atrybutu `hidden`.

Sekcje bez opublikowanej treści nie są renderowane. Elementy `draft` i `archived` pozostają ukryte.

## Motyw

UI korzysta z motywu systemowego przez `prefers-color-scheme`. Nie ma ręcznego przełącznika motywu.

## Responsywność

Interfejs jest projektowany mobile first i działa jako jedna responsywna strona. Na mniejszych ekranach karta zajmuje prawie całą szerokość z niewielkim marginesem, a pasek fallbacku jest zwięzłym statusem nad kartą, nie pełną sekcją CV.

## Aktualny efekt danych

Ponieważ większość rzeczywistej treści CV pozostaje `draft`, publiczny widok może obecnie zawierać tylko imię i nazwisko. Jest to poprawny skutek filtrowania `published`, nie błąd układu.
