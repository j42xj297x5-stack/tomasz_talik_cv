# Przepływ jednej strony

## Cel

Dokument opisuje aktualny układ jednej responsywnej karty CV potwierdzony kodem i lokalnym podglądem Projektanta.

## Układ

Aplikacja jest pojedynczą stroną Vite bez frameworka frontendowego. Użytkownik widzi jedną kartę CV zawierającą Hero i accordion z sekcjami. Nie ma podstron, routingu aplikacyjnego ani osobnych kart dla sekcji.

## Hero

Hero prezentuje:

* imię i nazwisko;
* krótki opis odrębny od sekcji O mnie;
* wyróżnione umiejętności w uproszczonym, tekstowym zapisie;
* przycisk zapisu jako PDF;
* publiczny link GitHub, jeśli przejdzie filtrowanie statusu;
* opcjonalny avatar;
* opcjonalny pas profilu firmowego widoczny tylko po poprawnym załadowaniu `#p=<token>`.

Avatar ekranowy jest plikiem `public/assets/identity/tomasz-talik-avatar.webp`, wskazywanym w danych jako `assets/identity/tomasz-talik-avatar.webp`. Obraz zachowuje naturalny format bez okrągłej maski, ma subtelną ramkę akcentową, rozmiar `clamp` około 110–170 px i lekkie obniżenie w układzie desktopowym. Na desktopie znajduje się po prawej stronie Hero, a akcje „Zapisz jako PDF” i „Profil GitHub” są ustawione pionowo pod avatarem z jednakową szerokością. Na mobile avatar pozostaje nad tekstem, a akcje wracają pod opis i wyróżnione umiejętności. Opcjonalny avatar drukowany jest wskazywany przez `portrait.printSrc` i używa pliku `public/assets/identity/tomasz-talik-avatar_bw.webp`; nie zmienia układu ekranowego. Brak avatara nie zostawia pustej kolumny, a akcje pozostają w części tekstowej Hero.

Wyróżnione umiejętności w Hero nie używają kapsułek, ramek ani teł. Są renderowane jako jeden zawijający się ciąg tekstowy z wizualnym uppercase / kapitalikami, kursywą, umiarkowanym trackingiem i separatorem `·`; główna sekcja Umiejętności zachowuje dotychczasowy wygląd.

Profil firmowy renderuje się wyłącznie po poprawnym załadowaniu profilu przez `#p=<token>`. Jest osobnym pasem na pełną szerokość Hero, oddzielonym cienką poziomą linią, z wycentrowanym tekstem o wadze zbliżonej do małego nagłówka. Bez aktywnego profilu pas, linia i tekst zastępczy nie istnieją.

## Język

Globalny przełącznik PL/EN zmienia lokalizowane treści w Hero i sekcjach oraz oznaczenia szkiców: `Szkic` w języku polskim i `Draft` w angielskim. Kod aktualizuje także atrybut `lang` dokumentu, od którego zależy automatyczne dzielenie wyrazów PL/EN w justowanych akapitach.

## Sekcje

Zaimplementowane sekcje to:

* O mnie;
* Projekty;
* Doświadczenie;
* Wykształcenie;
* Umiejętności.

Główne akapity treści w sekcjach O mnie, Projekty, Doświadczenie i Wykształcenie są justowane na desktopie, mobile oraz w PDF. Nagłówki sekcji, tytuły wpisów i metadane pozostają wyrównane do lewej. Sekcja kontaktowa nie jest obecnie osobną gotową sekcją. Publiczny link jest renderowany jako akcja Hero, nie jako panel kontaktowy.

## Accordion

Accordion jest jedynym widocznym tytułowaniem sekcji na stronie: przycisk accordionu pokazuje tytuł panelu, a wewnętrzny semantyczny nagłówek pozostaje w DOM. Jednocześnie otwarty może być najwyżej jeden panel. Ponowne kliknięcie otwartego panelu zamyka wszystkie. Obsługiwane są `aria-expanded`, `aria-controls`, `role="region"` i `aria-labelledby`.

W wydruku przyciski accordionu są ukryte, panele są rozwinięte niezależnie od stanu interakcji, a wewnętrzny nagłówek sekcji wraca jako widoczny tytuł występujący dokładnie raz.

## Statusy i szkice

Bez `preview` widoczne są tylko elementy `published`. `?preview=draft` pokazuje `published` oraz `draft`. `archived` jest ukryte zawsze, a puste sekcje nie są renderowane. Widoczne robocze elementy mają znaczniki `Szkic` albo `Draft`; znaczniki są ukrywane w wydruku.

## PDF

Przycisk PDF uruchamia `window.print()`. Wydruk korzysta z tego samego HTML i view modelu co strona, nie zależy od stanu otwarcia accordionu, zawiera szkice w `?preview=draft`, ukrywa znaczniki szkiców, pokazuje tytuły sekcji dokładnie raz i zachowuje avatar w kompaktowej formie. Jeśli istnieje `portrait.printSrc`, druk/PDF pokazuje ten osobny wariant na białym tle, bez ramki i ozdobników; bez tego pola używa avatara ekranowego jako fallbacku.

## Przyszłe elementy

Ręczny przełącznik motywu, osobna sekcja kontaktowa, Playwright i Streamlit pozostają przyszłe, jeśli zostaną świadomie dodane.

## Aktualizacja: demonstracje i publiczne odnośniki

- Edytor grupuje publiczne odnośniki z `content/public/links.json` według pola `kind`: „Demo projektów” (`demo`) oraz „GitHub i repozytoria” (`profile`, `repository`). `content/public/projects.json` nie jest już źródłem list odnośników w edytorze.
- Grupa „Demo projektów” zawiera wdrożenia Haiku Cosmos i Interactive AI Portfolio oraz publiczny GIF DIG Engine w CV; grupa „GitHub i repozytoria” zawiera profil GitHub i publiczne repozytoria bez demonstracji. Repozytorium DIG Engine pozostaje prywatne.
- Karta DIG Engine zawiera osadzoną animowaną miniaturę GIF pod opisem. Miniatura otwiera pełnoekranowy dialog obsługujący Escape, kliknięcie tła i przycisk zamknięcia.
- Demonstracja DIG Engine jest całkowicie ukrywana w PDF; pozostała treść projektu drukuje się jak dotychczas.

## Aktualizacja: widok Umiejętności

Sekcja Umiejętności korzysta z jednego źródła `content/public/skills.json`, które zawiera teraz `categories` oraz `items`. Każdy skill ma `categoryId` i `inCloud`, a opcjonalne `cloudWeight` jest wyłącznie wizualnym wyróżnieniem w chmurze, nie poziomem kompetencji. Statusy `published`, `draft` i `archived` pozostają bez zmian.

Widok domyślny to Chmura, przełączana z widokiem Kategorie przez dostępne zakładki Chmura / Kategorie. Chmura jest własnym komponentem Vanilla JS + SVG, bez jQuery i zewnętrznego dodatku; animacja reaguje na wskaźnik, na mobile obraca się wolniej, a `prefers-reduced-motion` renderuje nieruchomą chmurę. Widok statyczny pokazuje pięć kategorii.

Hero nadal korzysta z `featuredSkillIds`, a `profile.skillOrder` nadal ustala kolejność umiejętności w chmurze i kategoriach. PDF pokazuje tylko widok kategorii i nie drukuje SVG.
