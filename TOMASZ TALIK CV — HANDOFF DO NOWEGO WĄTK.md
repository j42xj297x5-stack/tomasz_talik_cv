HANDOFF — TOMASZ TALIK CV
Stan na: 2026-07-12
Cel: kontynuacja pracy w nowym wątku bez ponownego odtwarzania decyzji i wdrożeń.

1. TRYB WSPÓŁPRACY

Projektant: Tomasz Talik.
ChatGPT pełni rolę architekta i redaktora.
Codex wykonuje zmiany w repozytorium.

Dla nowego, złożonego tematu:
- najpierw analiza i krótkie pytania decyzyjne;
- format odpowiedzi Projektanta: np. 1b, 2a;
- dopiero potem prompt wykonawczy dla Codexa.

Prompt dla Codexa:
- jeden blok plain text;
- wyłącznie konkretne pliki;
- sekcje:
  PLIKI DO ODCZYTU:
  PLIKI DO MODYFIKACJI:
  AKCJA:
  ZAKAZY:
  FORMAT WYJŚCIOWY:
- nie pozwalać czytać całego repozytorium;
- nie pozwalać czytać docs/legacy/ ani docs/audits/;
- wymagać wyłącznie Compact Summary do 50 słów;
- nie wykonywać ogólnych refaktorów bez osobnej decyzji.

2. CEL PRODUKTU

Interaktywne, jednostronicowe CV Tomasza Talika, kierowane przede wszystkim do studiów gier i zespołów tworzących interaktywne produkty.

Główne pozycjonowanie:
Creative Technologist & Game Systems Designer

CV ma:
- przedstawiać projektowanie systemów, gier i narzędzi;
- pokazywać autorskie projekty jako główną wartość;
- uczciwie opisywać sposób pracy wspomagany przez AI;
- działać jako responsywna strona;
- generować klasyczny PDF przez window.print();
- docelowo obsługiwać profile dopasowane do firm przez ?p=<profileId>.

3. AKTUALNA ARCHITEKTURA

Stos:
- Vite;
- Vanilla JavaScript;
- CSS;
- publiczne dane JSON;
- JSON Schema;
- Ajv w walidatorze;
- brak frameworka frontendowego;
- brak backendu;
- brak wdrożenia produkcyjnego.

Aplikacja działa obecnie lokalnie przez Vite.

GitHub Pages pozostaje planowanym kierunkiem, ale deployment nie został jeszcze wykonany.

Główne obszary:
- content/public/*.json — publiczne treści CV;
- content/profiles/*.json — profile;
- content/schemas/*.schema.json — schematy;
- scripts/validate-content.mjs — walidator;
- src/app/ — ładowanie danych, profil, view model i bootstrap;
- src/components/ — Hero i accordion;
- src/sections/ — renderery sekcji;
- src/styles/print.css — wydruk.

4. ZAIMPLEMENTOWANE FUNKCJE GLOBALNE

4.1. Języki

Wdrożono globalny przełącznik PL/EN.

Potwierdzone zachowanie:
- zmienia treści Hero i sekcji;
- zmienia znaczniki Szkic/Draft;
- aktualizuje język dokumentu;
- kontrolka języka jest ukrywana w wydruku.

4.2. Profile

Obsługiwany jest parametr:
?p=<profileId>

Profil default jest fallbackiem.

Parametr profilu można łączyć z podglądem szkiców:
?p=default&preview=draft

4.3. Podgląd szkiców

Wdrożono:
?preview=draft

Bez parametru:
- renderowane są tylko elementy published;
- draft jest ukryty;
- archived jest ukryty;
- puste sekcje są ukrywane.

Z parametrem:
- renderowane są published i draft;
- archived nadal jest ukryty;
- elementy draft otrzymują znacznik Szkic albo Draft.

Znaczniki:
- są małe i przypisane do konkretnych elementów;
- nie używają globalnego paska;
- są ukrywane w PDF.

Ważne:
?preview=draft jest wyłącznie trybem redakcyjnym.
Nie jest zabezpieczeniem i nie zapewnia prywatności.
Każdy JSON oraz asset umieszczony publicznie należy traktować jako publiczny.

Znany commit:
2d8693b — ?preview=draft, znaczniki PL/EN, doświadczenie i dokumentacja.

5. HERO

Aktualny Hero został wizualnie potwierdzony na desktopie.

Zawiera:
- przełącznik PL/EN;
- imię i nazwisko Tomasz Talik;
- dwuzdaniowy opis;
- pięć wyróżnionych umiejętności;
- przycisk Zapisz jako PDF;
- link Profil GitHub;
- avatar po prawej stronie.

Aktualny tekst Hero PL:

Buduję interaktywne światy, gry i narzędzia cyfrowe, łącząc technologię, mechanikę, obraz i dźwięk. Złożone pomysły przekładam na modularne systemy, które można rozwijać, testować i prowadzić od koncepcji do działającego produktu.

Aktualny tekst Hero EN:

I build interactive worlds, games and digital tools by combining technology, mechanics, visuals and sound. I turn complex ideas into modular systems that can be developed, tested and guided from concept to a working product.

Hero został świadomie oddzielony od sekcji O mnie:
- Hero mówi przede wszystkim, co Tomasz tworzy;
- O mnie opisuje kierunek zawodowy, doświadczenia i sposób pracy;
- ten sam tekst nie jest już powtarzany w obu miejscach.

6. AVATAR

Plik:
public/assets/identity/tomasz-talik-avatar.webp

Ścieżka w danych:
assets/identity/tomasz-talik-avatar.webp

Aktualne zachowanie:
- naturalny pionowy format obrazu;
- brak okrągłej maski;
- subtelna ramka akcentowa;
- elastyczny rozmiar przez clamp(), około 110–170 px;
- desktop: prawa strona Hero;
- mobile: założenie nad tekstem;
- PDF: avatar ma być widoczny w bardziej kompaktowej formie;
- brak danych avatara nie powinien pozostawiać pustej kolumny.

Po pierwszym wdrożeniu avatar był nieco za wysoko.
Wprowadzono małe obniżenie wyłącznie na desktopie.
Projektant potwierdził: „lepiej siedzi”.

Desktopowy wygląd avatara i Hero został potwierdzony screenem lokalnego Vite.

Mobile i PDF wymagają jeszcze osobnego testu wizualnego.

7. ACCORDION

Potwierdzony układ:
- jedna wspólna karta CV;
- najwyżej jeden panel otwarty jednocześnie;
- panel można ponownie zamknąć;
- wszystkie panele mogą być zamknięte;
- zastosowane aria-expanded, aria-controls, role region i aria-labelledby.

Naprawiono wizualne powtarzanie tytułów sekcji:
- na stronie przycisk accordionu jest jedynym widocznym tytułem;
- wewnętrzny semantyczny nagłówek pozostaje w DOM;
- wewnętrzny nagłówek jest ukryty bez pozostawiania pustego miejsca;
- w PDF przyciski znikają, a semantyczny tytuł jest ponownie pokazywany;
- tytuł sekcji powinien występować w wydruku dokładnie raz.

Zmiana objęła:
- O mnie;
- Projekty;
- Doświadczenie;
- Wykształcenie;
- Umiejętności.

8. ZAIMPLEMENTOWANE SEKCJE

Aktualna kolejność widoczna na screenie:

1. O mnie
2. Projekty
3. Doświadczenie
4. Wykształcenie
5. Umiejętności

Sekcja kontaktowa nie została jeszcze wdrożona jako pełny panel.

8.1. O mnie

Aktualny tekst PL:

Akapit 1:
Obecnie koncentruję się na projektowaniu gier i interaktywnych systemów. W autorskich projektach łączę wykształcenie inżynierskie, wieloletnią praktykę twórczą oraz doświadczenie zdobyte w elektronice, dźwięku, świetle, sprzedaży technicznej i pracy z użytkownikami. Interesuje mnie nie tylko efekt końcowy, ale również logika, mechanika, przepływ danych i relacje pomiędzy elementami systemu.

Akapit 2:
Pracę zaczynam od zrozumienia problemu i ustalenia zasad. Dzielę złożone projekty na małe moduły, przygotowuję dokumentację, kieruję implementacją wspomaganą przez AI i sprawdzam rezultat w kodzie, testach, diagnostyce oraz działającym produkcie. Dzięki temu potrafię patrzeć na projekt jednocześnie jak twórca, technik i użytkownik.

Wersja EN również została dodana.

8.2. Projekty

Dodano trzy wpisy jako draft:

Haiku Cosmos
- główny projekt;
- rola: Creator, Game Systems Designer & Technical Lead;
- publiczne demo:
  https://j42xj297x5-stack.github.io/Haiku-Cosmos/
- publiczne repo:
  https://github.com/j42xj297x5-stack/Haiku-Cosmos
- Vite, Vanilla JS, Three.js;
- tryby Three.js 3D i Canvas2D;
- systemy gry, dane, diagnostyka, dokumentacja i assety.

DIG Engine
- lokalny system odkrywania i analizowania muzyki;
- Python, PySide6, API, baza lokalna;
- aktualny opis projektu wskazuje SQLite i FTS5;
- prywatne repozytorium nie jest linkowane;
- pokazywany przez case study i demonstrację;
- pełny pokaz działania na życzenie;
- demo GIF:
  https://j42xj297x5-stack.github.io/tomasz-talik-portfolio/gif/DIG_engine.gif

Interactive AI Portfolio
- publiczne demo:
  https://j42xj297x5-stack.github.io/tomasz-talik-portfolio/
- publiczne repo:
  https://github.com/j42xj297x5-stack/tomasz-talik-portfolio
- Vite, Vanilla JS i Three.js;
- krótszy trzeci projekt.

8.3. Doświadczenie

Wdrożono cztery wpisy draft:

Usługi Informatyczne Szansa
- 07/2024–obecnie;
- Inżynier sprzedaży systemów CAD / Opiekun klienta;
- ZW3D;
- dokumentacja i baza wiedzy obejmująca setki funkcji;
- AI-assisted analiza, tłumaczenia i dokumentacja;
- komunikacja z klientami przemysłowymi;
- wsparcie kampanii i narzędzia wyszukiwania odbiorców.

Teatr Lalek Banialuka
- 09/2022–12/2023;
- realizator światła i dźwięku / elektroakustyk;
- scena, sprzęt, dźwięk, światło;
- reakcja w czasie rzeczywistym;
- współpraca techniczna i artystyczna.

Niezależna praktyka twórcza i produkcyjna
- 1998–obecnie;
- muzyka, DJ, dźwięk, wydarzenia, radio internetowe, grafika i wydawnictwo;
- obecnie również autorskie systemy cyfrowe;
- wpis został rozszerzony o praktyczne działania związane z adaptacją akustyczną sal prób.

T&T s.c.
- 2002–2015;
- technik IT / sprzedaż techniczna / prowadzenie małej firmy;
- strona, sklep i marketplace;
- dokumentacja produktów, fotografia i SEO;
- identyfikacja części;
- sprzedaż, magazyn i codzienna obsługa działalności.

8.4. Umiejętności

Wdrożono sekcję Umiejętności jako draft.

Znany commit:
0641205

Zakres:
- projektowanie systemów gry;
- projektowanie modularnych systemów;
- architektura techniczna;
- prototypowanie interakcji;
- diagnostyka i walidacja;
- dokumentacja techniczna;
- orkiestracja AI w pracy technicznej i kreatywnej;
- JavaScript;
- Three.js;
- HTML;
- CSS;
- JSON;
- Vite;
- Node.js;
- Python;
- PySide6;
- MySQL;
- SQL;
- REST API;
- Git/GitHub;
- Blender;
- Inkscape;
- Figma;
- Ableton Live;
- samodzielne uczenie się;
- czytanie kodu;
- komunikacja techniczna;
- komunikacja z klientem;
- dekompozycja problemów.

Nie przypisano poziomów znajomości.

Nie przedstawiono Tomasza jako tradycyjnego eksperta samodzielnie piszącego każdy fragment kodu.

Aktualny schemat wymusił płaską listę umiejętności zamiast grup kategorii.

Wyróżnione w Hero:
- Projektowanie systemów gry;
- Orkiestracja AI w pracy technicznej i kreatywnej;
- JavaScript;
- Three.js;
- Python.

8.5. Wykształcenie

Sekcja Wykształcenie jest widoczna na aktualnym screenie, więc renderer, profil i podstawowe dane zostały wdrożone.

Dodane wpisy:

education-ath-environmental-engineering
- 10/2000–06/2005;
- Akademia Techniczno-Humanistyczna w Bielsku-Białej;
- University of Technology and Humanities in Bielsko-Biala;
- Magister inżynier — Ochrona środowiska;
- Master of Engineering — Environmental Protection;
- specjalizacja:
  Inżynieria środowiska / Environmental Engineering;
- praca inżynierska:
  aktywne i pasywne tłumienie drgań;
- praca magisterska:
  „Dobór efektywnych rozwiązań w kształtowaniu parametrów akustycznych pomieszczeń przy różnych zastosowaniach funkcjonalnych”.

education-electronics-technician
- 09/1995–06/2000;
- technik elektronik;
- praktyka w serwisie elektronicznym;
- projekt końcowy dotyczący przełączania tranzystorów.

9. WAŻNA NIEPEWNOŚĆ — OSTATNIA KOREKTA EDUKACJI

Po przygotowaniu ostatniego promptu rozszerzającego opis studiów nie otrzymano w tym wątku Compact Summary Codexa.

Nie należy więc zakładać bez sprawdzenia, że ostatnia wersja została zapisana w repozytorium.

Nowy wątek powinien najpierw sprawdzić:

content/public/education.json
content/public/experience.json
docs/current/content/FIRST_PUBLIC_CV_CONTENT.md

Docelowy pierwszy akapit studiów powinien opisywać szeroki zakres programu, między innymi:
- matematykę;
- fizykę;
- chemię;
- biologię środowiska;
- geologię;
- mechanikę płynów;
- wodę i ścieki;
- odpady;
- ochronę powietrza;
- HVAC;
- monitoring;
- instalacje przemysłowe;
- zagrożenia wibroakustyczne;
- ocenę oddziaływania na środowisko;
- zarządzanie środowiskowe;
- prawo;
- ekonomię środowiska.

Docelowy opis pracy magisterskiej powinien:
- porównywać salę wykładową i niską betonową halę;
- wskazywać, że hala była wcześniej używana jako sala prób, przestrzeń koncertowa i eventowa;
- opisywać wcześniejsze wydzielenie niskobudżetowej strefy prób z zawieszanych dywanów i podłogi z palet;
- przedstawiać demontowalność jako ograniczenie tamtej praktycznej strefy, a nie główny cel pracy magisterskiej;
- wskazywać analizę czasu pogłosu w pasmach częstotliwości;
- wskazywać symulacje komputerowe;
- mówić o propozycjach poprawy akustyki dopasowanych do funkcji pomieszczeń;
- nie sugerować, że rozwiązania zaproponowane w pracy zostały później fizycznie wykonane;
- rozróżniać kształtowanie akustyki wnętrza od izolacji akustycznej.

Docelowy wpis niezależnej praktyki powinien zawierać osobny akapit:

PL:
Projektowałem i współtworzyłem niskobudżetowe adaptacje akustyczne sal prób. Jednym z takich działań było wydzielenie strefy prób w wielofunkcyjnej betonowej hali przy użyciu zawieszanych dywanów i podłogi z palet. Rozwiązanie musiało poprawiać warunki grania, a jednocześnie umożliwiać szybkie przywrócenie przestrzeni do funkcji koncertowej i eventowej.

EN:
I designed and helped build low-budget acoustic treatments for rehearsal rooms. One such project involved creating a rehearsal zone inside a multi-purpose concrete hall using hanging carpets and a pallet floor. The solution had to improve rehearsal conditions while allowing the space to be quickly restored for concerts and events.

10. PDF

PDF działa przez:
window.print()

Założenia i wdrożone zachowanie:
- ten sam HTML i view model co strona;
- brak osobnego szablonu PDF;
- wydruk nie powinien zależeć od otwartego panelu accordionu;
- przy ?preview=draft szkice są uwzględniane;
- znaczniki Szkic/Draft są ukryte;
- nagłówki sekcji występują raz;
- avatar jest uwzględniony;
- przełącznik języka jest ukryty.

Pełny test wydruku po ostatnich zmianach avatara, edukacji i layoutu pozostaje do wykonania dla PL i EN.

11. PRYWATNOŚĆ

Do publicznych danych nie dodawać:
- adresu;
- telefonu;
- prywatnego e-maila;
- sekretów;
- tokenów;
- prywatnych danych profilu;
- materiałów pracodawców;
- linku do prywatnego repozytorium DIG Engine.

Wszystko umieszczone w:
- content/public/;
- public/;
- kodzie frontendu;
należy traktować jako publiczne.

Status draft nie zapewnia ochrony danych.

12. TESTY I OGRANICZENIA

Potwierdzone:
- interfejs działa lokalnie przez Vite;
- PL/EN działa;
- ?preview=draft działa;
- accordion działa;
- sekcje są widoczne;
- avatar i jego położenie zostały sprawdzone wizualnie;
- kolejne zadania przechodziły git diff --check;
- wykonywano statyczne kontrole Node i rg.

Niepotwierdzone w środowisku Codexa:
- npm run validate:content;
- npm run build.

Powód:
- brak lokalnych zależności;
- brak ajv albo vite;
- registry zwracał 403;
- npm install --no-audit --no-fund zawiesił się.

Nie zapisywać tych testów jako zaliczonych.

Pełna walidacja i build muszą zostać wykonane w lokalnym środowisku Projektanta z zainstalowanymi zależnościami.

13. DOKUMENTACJA

Przygotowano prompt zamykający etap dokumentacją, obejmujący między innymi:

docs/current/README.md
docs/current/content/CONTENT_MODEL.md
docs/current/product/PERSONALIZATION_SYSTEM.md
docs/current/ui/SINGLE_PAGE_FLOW.md
docs/current/security/ACCESS_AND_PRIVACY.md
docs/current/technical/FRONTEND_ARCHITECTURE.md
docs/current/technical/PDF_PIPELINE.md
docs/current/technical/DEPLOYMENT.md
docs/current/maps/PROJECT_INDEX.md
docs/handoff/CURRENT_STATE.md

W tym wątku nie otrzymano jednak Compact Summary potwierdzającego wykonanie tego promptu.

Nie uznawać dokumentacyjnego zamknięcia etapu za wykonane bez sprawdzenia repozytorium.

Stare kopie dokumentów mogą nadal zawierać nieaktualne informacje, np.:
- że publiczny widok pokazuje tylko imię i nazwisko;
- że draft jest zawsze ukryty bez wyjątku;
- że istnieją tylko sekcje About i Projects;
- że education.json i education-section.js nie istnieją;
- że avatar nie został wdrożony.

14. PIERWSZE CZYNNOŚCI W NOWYM WĄTKU

Najpierw wykonać audyt bez zmian kodu:

1. Sprawdzić, czy ostatnia korekta edukacji i akustyki znajduje się w:
   - content/public/education.json;
   - content/public/experience.json;
   - docs/current/content/FIRST_PUBLIC_CV_CONTENT.md.

2. Sprawdzić, czy dokumentacyjny pass zamykający etap został faktycznie wykonany.

3. Lokalnie uruchomić:
   npm install
   npm run validate:content
   npm run build
   npm run dev

4. Sprawdzić:
   - desktop PL;
   - desktop EN;
   - mobile PL;
   - mobile EN;
   - PDF PL;
   - PDF EN;
   - widok bez ?preview=draft;
   - widok z ?preview=draft;
   - ?p=default&preview=draft;
   - brak pustej kolumny po czasowym usunięciu portrait z identity;
   - avatar na mobile i w PDF;
   - nagłówki sekcji dokładnie raz w PDF.

15. REKOMENDOWANY NASTĘPNY ETAP

Po audycie i testach:

1. Zakończyć aktualizację dokumentacji.
2. Przeprowadzić redakcyjny przegląd całej treści CV.
3. Sprawdzić długość wpisów doświadczenia i edukacji na mobile oraz w PDF.
4. Zdecydować, które elementy mogą przejść z draft na published.
5. Dopiero po świadomej publikacji treści przygotować deployment GitHub Pages.
6. Sekcję kontaktową i prywatne dane projektować osobno, zgodnie z systemem profili i zasadami prywatności.

Nie zaczynać deploymentu ani zmiany statusów przed pełnym validate:content, build i kontrolą PDF.