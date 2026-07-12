# Generowanie PDF

## Cel

Dokument opisuje aktualny stan PDF jako wydruk tej samej strony CV.

## Zasada główna

PDF powstaje z tego samego HTML, tego samego view modelu i tych samych danych profilu, które renderuje aplikacja webowa. Nie ma osobnego szablonu PDF, osobnej kopii treści ani statycznego pliku PDF.

## Uruchomienie

Przycisk „Zapisz jako PDF” w Hero wywołuje `window.print()`. Na desktopie akcje Hero są wizualnie pod avatarem, a na mobile pod tekstem Hero; w druku pozostają ukryte niezależnie od położenia ekranowego. Przeglądarka otwiera systemowy podgląd drukowania, a użytkownik zapisuje wynik jako PDF.

## Widok drukowany

Widok drukowany kontroluje `src/styles/print.css`. Arkusz druku:

* ukrywa przyciski akcji Hero, przełącznik języka, chevrony, komunikat fallbacku i znaczniki `Szkic` / `Draft`;
* pokazuje panele accordionu niezależnie od ich stanu otwarcia na stronie;
* przywraca wewnętrzne nagłówki sekcji, tak aby tytuł każdej sekcji był widoczny dokładnie raz;
* zachowuje avatar w kompaktowej formie, używając `portrait.printSrc`, jeśli istnieje, albo `portrait.src` jako fallbacku;
* zachowuje osobny, pełnoszerokościowy pas „Profil przygotowany dla…” tylko dla poprawnie załadowanego profilu `#p=<token>`, wraz z subtelną linią oddzielającą;
* usuwa zbędne tła, cienie i elementy interaktywne.

## Statusy w PDF

Wydruk korzysta z aktualnego filtrowania view modelu. Bez `preview` zawiera tylko elementy `published`. Przy `?preview=draft` zawiera także elementy `draft`, ale ukrywa ich oznaczenia wizualne. Elementy `archived` pozostają niewidoczne w obu trybach.

## Profil i konfiguracja

Opcjonalne pole `pdf.enabled` w profilu może ukryć przycisk PDF, jeśli ma wartość `false`. Profil nie przechowuje ścieżki do pliku PDF ani osobnych list sekcji, projektów czy umiejętności dla wydruku. Osobny avatar drukowany należy do modelu `identity`: opcjonalne `portrait.printSrc` wskazuje `assets/identity/tomasz-talik-avatar_bw.webp`, czyli publiczny zasób `public/assets/identity/tomasz-talik-avatar_bw.webp`. Wydruk renderuje ten wariant na białym tle, bez ramki i ozdobników; jeśli pole nie istnieje, używa `portrait.src`.

## Stan automatyzacji

Playwright i Streamlit nie są obecnie zaimplementowane. Przyszła automatyzacja, jeśli powstanie, powinna drukować tę samą stronę z tym samym HTML, view modelem i `print.css`.
