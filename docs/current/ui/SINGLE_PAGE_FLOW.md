# Przepływ jednej strony

## Cel

Dokument jest źródłem prawdy dla układu i podstawowej interakcji UI. Zależy od `docs/current/technical/FRONTEND_ARCHITECTURE.md`, `docs/current/content/CONTENT_MODEL.md` i `docs/current/product/PERSONALIZATION_SYSTEM.md`.

## Układ

Aplikacja jest pojedynczą stroną. Użytkownik widzi jedną kartę główną oraz zestaw rozwijanych paneli. Nie ma osobnych podstron ani routingu wymagającego frameworka frontendowego.

## Karta główna

Karta główna prezentuje najważniejsze publiczne informacje i może zawierać krótką wiadomość do firmy o długości 300–500 znaków, jeśli aktywny profil ją definiuje. Wiadomość nie może zawierać danych prywatnych, jeśli pochodzi z publicznego profilu.

## Panele rozwijane

Sekcje szczegółowe są rozwijanymi panelami. Jednocześnie otwarty może być tylko jeden panel. Otwarcie nowego panelu zamyka poprzedni, aby strona pozostała czytelna na telefonach i desktopach.

## Motyw

Startowo UI korzysta z motywu systemowego przez `prefers-color-scheme`. Później zostanie dodany ręczny wybór motywu, który ma nadpisywać ustawienie systemowe.

## Responsywność

Interfejs ma być projektowany mobile first i działać jako jedna responsywna strona. Interaktywność ma wspierać czytelność CV, a nie zastępować treści.

## Zależności

* Dane paneli opisuje `docs/current/content/CONTENT_MODEL.md`.
* Wybór profilu opisuje `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Ograniczenia prywatności opisuje `docs/current/security/ACCESS_AND_PRIVACY.md`.

