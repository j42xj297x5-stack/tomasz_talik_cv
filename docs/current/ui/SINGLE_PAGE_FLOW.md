# Przepływ pojedynczej strony

## Wejście na CV

Użytkownik wchodzi na produkcyjne CV pod adresem `https://j42xj297x5-stack.github.io/tomasz_talik_cv/`. Aplikacja ładuje statyczny bundle, publiczne JSON-y i profil domyślny albo profil wskazany przez `?p=<profileId>`.

## Rozwiązanie profilu

Najpierw rozwiązywany jest profil repozytoryjny. Następnie, jeżeli fragment zawiera `#p=<token>`, aplikacja próbuje pobrać publiczny profil firmy z `public/profiles/<token>.json`. Jeżeli fragment zawiera `#k=<token>`, token jest zachowywany do asynchronicznego pobrania prywatnego kontaktu.

## Renderowanie publicznej treści

Publiczna treść renderuje się natychmiast. Błąd profilu firmowego albo prywatnego kontaktu nie blokuje podstawowego CV.

## Prywatny kontakt

Prywatny kontakt jest pobierany asynchronicznie z Workera. Po sukcesie pojawia się blok „Dane kontaktowe” z aktywnymi linkami `mailto:` i `tel:`. Przy błędzie pojawia się krótki komunikat statusowy.

## Hero

Hero zawiera imię, opis, wyróżnione umiejętności, przycisk PDF, przełącznik PL/EN, avatar ekranowy i link do publicznego profilu GitHub, jeżeli jest dostępny w view modelu. Informacja o firmie z `#p` jest renderowana jako pełnoszerokościowa linia w obrębie Hero.

## Accordion

Sekcje publiczne są prezentowane w accordionie. Przyciski obsługują atrybuty dostępności i pozwalają otwierać jedną sekcję naraz. Po zmianie języka aplikacja renderuje widok ponownie i odtwarza wcześniej otwartą sekcję.

## Tekst

Akapity sekcji są justowane i korzystają z hyphenation zależnego od języka dokumentu. Język strony jest aktualizowany na `pl` albo `en`.

## Projekty

Sekcja projektów pokazuje karty Haiku Cosmos, DIG Engine i Interactive AI Portfolio. Linki z `links.json` renderują akcje „Uruchom demo” albo „Otwórz portfolio”, zależnie od `projectLabel`. DIG Engine ma miniaturę GIF-u i dialog powiększenia obsługiwany przez `media-lightbox`.

## Umiejętności

Sekcja umiejętności ma przełącznik `Chmura` / `Kategorie`. Chmura SVG reaguje na wskaźnik, a widok kategorii pokazuje uporządkowane grupy umiejętności. Przełącznik obsługuje klawiaturę: strzałki, `Home` i `End`.

## Ruch i dostępność

`prefers-reduced-motion` zatrzymuje animację chmury. Animacja jest zatrzymywana także po zmianie widoku albo usunięciu komponentu z dokumentu. Dialog demonstracji używa natywnego elementu `dialog` i przycisku zamknięcia.

## Mobile

Układ jest responsywny: Hero, projekty, kontakt i chmura dopasowują się do szerokości ekranu. Chmura używa wolniejszej prędkości bazowej na wąskich ekranach.
