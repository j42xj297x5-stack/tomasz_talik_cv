# Przepływ jednej strony

## Cel

Dokument jest źródłem prawdy dla układu i podstawowej interakcji UI. Zależy od `docs/current/technical/FRONTEND_ARCHITECTURE.md`, `docs/current/content/CONTENT_MODEL.md` i `docs/current/product/PERSONALIZATION_SYSTEM.md`.

## Układ

Aplikacja jest pojedynczą stroną. Użytkownik widzi jedną wspólną kartę CV o docelowej maksymalnej szerokości około 940 px, w której górna część i rozwijane panele tworzą jeden kontener. Nie ma osobnych kart sekcji, podstron ani routingu wymagającego frameworka frontendowego.

## Karta główna

Karta główna prezentuje najważniejsze publiczne informacje: imię i nazwisko, niepowtórzony względem imienia headline albo targetRole, opublikowany krótki opis, opublikowane wyróżnione umiejętności oraz akcje dostępne tylko przy istniejących danych. Opcjonalny portret może być pokazany po prawej stronie na desktopie i nie zostawia pustego miejsca, gdy go nie ma. Wiadomość profilu jest widoczna tylko dla faktycznie spersonalizowanego profilu firmy.

## Panele rozwijane

Sekcje szczegółowe są zwartymi wierszami accordionu rozdzielonymi subtelnymi liniami, z dekoracyjnym chevronem reagującym na stan panelu. Domyślnie wszystkie panele są zamknięte; jednocześnie otwarty może być tylko jeden panel i użytkownik może zamknąć wszystkie. Sekcje bez opublikowanej treści nie są renderowane.

## Motyw

UI korzysta z motywu systemowego przez `prefers-color-scheme`. Nie ma ręcznego przełącznika motywu.

## Responsywność

Interfejs ma być projektowany mobile first i działać jako jedna responsywna strona bez poziomego przewijania od 320 px. Na telefonach karta zajmuje prawie całą szerokość z marginesem 12–16 px, a pasek fallbacku jest zwięzłym statusem nad kartą, nie pełną sekcją CV.

## Zależności

* Dane paneli opisuje `docs/current/content/CONTENT_MODEL.md`.
* Wybór profilu opisuje `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Ograniczenia prywatności opisuje `docs/current/security/ACCESS_AND_PRIVACY.md`.

