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
* dziedziczy z arkusza komponentów justowanie głównych akapitów sekcji O mnie, Projekty, Doświadczenie i Wykształcenie, pozostawiając nagłówki oraz metadane wyrównane do lewej;
* usuwa zbędne tła, cienie i elementy interaktywne.

Automatyczne dzielenie wyrazów w PDF korzysta z aktywnego atrybutu `lang` dokumentu, dlatego działa zgodnie z aktualnym językiem PL albo EN bez osobnych reguł w `print.css`.

## Statusy w PDF

Wydruk korzysta z aktualnego filtrowania view modelu. Bez `preview` zawiera tylko elementy `published`. Przy `?preview=draft` zawiera także elementy `draft`, ale ukrywa ich oznaczenia wizualne. Elementy `archived` pozostają niewidoczne w obu trybach.

## Profil i konfiguracja

Opcjonalne pole `pdf.enabled` w profilu może ukryć przycisk PDF, jeśli ma wartość `false`. Profil nie przechowuje ścieżki do pliku PDF ani osobnych list sekcji, projektów czy umiejętności dla wydruku. Osobny avatar drukowany należy do modelu `identity`: opcjonalne `portrait.printSrc` wskazuje `assets/identity/tomasz-talik-avatar_bw.webp`, czyli publiczny zasób `public/assets/identity/tomasz-talik-avatar_bw.webp`. Wydruk renderuje ten wariant na białym tle, bez ramki i ozdobników; jeśli pole nie istnieje, używa `portrait.src`.

## Stan automatyzacji

Playwright i Streamlit nie są obecnie zaimplementowane. Przyszła automatyzacja, jeśli powstanie, powinna drukować tę samą stronę z tym samym HTML, view modelem i `print.css`.

## Ochrona tokenu w wydruku

Jeśli adres zawiera `#p=<p>&k=<k>`, kliknięcie przycisku PDF przed `window.print()` tymczasowo usuwa wyłącznie `k` z widocznego fragmentu przez `history.replaceState`, zachowując `p`. Po zdarzeniu `afterprint` pierwotny fragment jest przywracany bez przeładowania strony. Dane kontaktowe pobrane wcześniej pozostają w DOM i są widoczne w PDF, ale komunikat o niedostępności kontaktu jest ukryty w wydruku.

## Aktualizacja: demonstracje i publiczne odnośniki

- Edytor grupuje publiczne odnośniki z `content/public/links.json` według pola `kind`: „Demo projektów” (`demo`) oraz „GitHub i repozytoria” (`profile`, `repository`). `content/public/projects.json` nie jest już źródłem list odnośników w edytorze.
- Grupa „Demo projektów” zawiera wdrożenia Haiku Cosmos i Interactive AI Portfolio oraz publiczny GIF DIG Engine w CV; grupa „GitHub i repozytoria” zawiera profil GitHub i publiczne repozytoria bez demonstracji. Repozytorium DIG Engine pozostaje prywatne.
- Karta DIG Engine zawiera osadzoną animowaną miniaturę GIF pod opisem. Miniatura otwiera pełnoekranowy dialog obsługujący Escape, kliknięcie tła i przycisk zamknięcia.
- Demonstracja DIG Engine jest całkowicie ukrywana w PDF; pozostała treść projektu drukuje się jak dotychczas.

## Aktualizacja: widok Umiejętności

Sekcja Umiejętności korzysta z jednego źródła `content/public/skills.json`, które zawiera teraz `categories` oraz `items`. Każdy skill ma `categoryId` i `inCloud`, a opcjonalne `cloudWeight` jest wyłącznie wizualnym wyróżnieniem w chmurze, nie poziomem kompetencji. Statusy `published`, `draft` i `archived` pozostają bez zmian.

Widok domyślny to Chmura, przełączana z widokiem Kategorie przez dostępne zakładki Chmura / Kategorie. Chmura jest własnym komponentem Vanilla JS + SVG, bez jQuery i zewnętrznego dodatku; animacja reaguje na wskaźnik, na mobile obraca się wolniej, a `prefers-reduced-motion` renderuje nieruchomą chmurę. Widok statyczny pokazuje pięć kategorii.

Hero nadal korzysta z `featuredSkillIds`, a `profile.skillOrder` nadal ustala kolejność umiejętności w chmurze i kategoriach. PDF pokazuje tylko widok kategorii i nie drukuje SVG.
