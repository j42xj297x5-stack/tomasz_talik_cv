# PDF i kontrakt druku

## Zakres

PDF powstaje przez `window.print()` uruchamiane przyciskiem w Hero. Nie istnieje osobny szablon PDF ani serwerowe generowanie gotowego pliku. Druk używa wspólnego HTML i tego samego view modelu co widok ekranowy.

## Renderowanie

Wydruk nie zależy od aktualnego stanu accordionu. Reguły druku pokazują treść sekcji w układzie przeznaczonym do papieru niezależnie od tego, które sekcje były otwarte na ekranie.

## Avatar

Hero ma avatar ekranowy oraz wariant drukowany. Jeżeli `identity.portrait.printSrc` istnieje, druk używa wariantu `printSrc`.

## Elementy ukrywane

W druku ukrywane są przyciski i elementy interaktywne, w tym przełącznik języka, przycisk PDF, chmura SVG, dialogi i GIF demonstracyjny DIG Engine. Etykiety `Szkic` / `Draft` nie są drukowane.

## Umiejętności

Druk wymusza widok kategorii umiejętności. Umiejętności są drukowane bez ramek, aby ograniczyć szum wizualny i zużycie miejsca.

## Linki

Linki projektów pozostają widoczne i klikalne w cyfrowym PDF. Pełne URL-e nie są drukowane jako dodatkowy tekst.

## Kontakt

Jeżeli prywatny kontakt został pobrany przed drukiem, dane kontaktowe są drukowane na czarno i zwykłą grubością, a etykiety kontaktu są pogrubione. Linki `mailto:` i `tel:` pozostają aktywne w PDF zależnie od przeglądarki.

## Typografia

Tekst używa justowania i hyphenation dla PL/EN zgodnie z językiem dokumentu.

## Token `k`

Przed wywołaniem `window.print()` frontend tymczasowo usuwa `k` z fragmentu URL. Po zdarzeniu `afterprint` przywraca oryginalny fragment. Mechanizm ogranicza ryzyko wydrukowania tokenu przez nagłówek lub stopkę przeglądarki.

## Ograniczenia

Końcowy wygląd PDF zależy od silnika drukowania przeglądarki i ustawień użytkownika. Projekt nie generuje gotowego pliku PDF na serwerze.
