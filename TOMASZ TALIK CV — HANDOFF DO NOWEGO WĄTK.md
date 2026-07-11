TOMASZ TALIK CV — HANDOFF DO NOWEGO WĄTKU

1. CEL PROJEKTU

Projekt „Tomasz Talik CV” jest interaktywnym, jednostronicowym CV i portfolio działającym jako aplikacja Vite na GitHub Pages.

Główne założenia:
- jedna responsywna strona;
- jedna wspólna karta CV;
- rozwijane sekcje;
- tylko jeden panel może być otwarty jednocześnie;
- wszystkie panele można zamknąć, pozostawiając samą kartę główną;
- personalizacja pod konkretne firmy bez tworzenia osobnych kopii aplikacji;
- wspólny katalog treści i wiele profili prezentacji;
- dane publiczne w repozytorium;
- dane prywatne docelowo pobierane z zewnętrznego backendu;
- lokalny edytor profili w Streamlit;
- PDF generowany z tego samego HTML i view modelu co strona;
- docelowy hosting: GitHub Pages;
- frontend: Vite, Vanilla JavaScript, CSS, JSON;
- bez Reacta i innych frameworków frontendowych na obecnym etapie.

2. PRZYJĘTY PROTOKÓŁ PRACY

Role:
- Projektant ustala treść, kierunek i decyzje.
- ChatGPT działa jako architekt.
- Codex wykonuje konkretne zmiany w repozytorium.

Dla większych tematów:
1. analiza;
2. pytania decyzyjne;
3. odpowiedzi Projektanta;
4. krótki prompt dla Codexa;
5. analiza wyniku;
6. aktualizacja dokumentacji.

Prompty dla Codexa:
- po polsku;
- jeden blok plain text;
- mały zakres;
- konkretne pliki;
- jeden główny rezultat;
- bez czytania całego repo;
- bez docs/legacy/ i docs/audits/, chyba że wyraźnie wymagane;
- wynik: Compact Summary, pliki, testy, ryzyka.

3. WDROŻONA DOKUMENTACJA ARCHITEKTURY

Utworzono dokumentację w docs/current/:

- docs/current/technical/FRONTEND_ARCHITECTURE.md
- docs/current/content/CONTENT_MODEL.md
- docs/current/product/PERSONALIZATION_SYSTEM.md
- docs/current/ui/SINGLE_PAGE_FLOW.md
- docs/current/security/ACCESS_AND_PRIVACY.md
- docs/current/technical/PDF_PIPELINE.md
- docs/current/technical/LOCAL_EDITOR.md
- docs/current/technical/DEPLOYMENT.md
- docs/current/maps/PROJECT_INDEX.md

Utworzono również:
- docs/README.md
- docs/current/README.md

Dokumentacja ustala:
- jedną aplikację;
- jeden katalog treści;
- wiele profili firm;
- rozdział danych publicznych i prywatnych;
- Streamlit jako przyszły lokalny edytor;
- Playwright jako przyszłą automatyzację PDF;
- GitHub Pages jako docelowy hosting.

Checkpoint dokumentacyjny po pierwszym działającym przekroju został przygotowany jako prompt, ale w tym wątku nie ma jeszcze potwierdzenia, że Codex go wykonał.

4. WDROŻONY MODEL DANYCH

Utworzono:

content/public/
- identity.json
- about.json
- projects.json
- experience.json
- skills.json
- links.json

content/profiles/
- default.json

content/schemas/
- common.schema.json
- identity.schema.json
- about.schema.json
- projects.schema.json
- experience.schema.json
- skills.schema.json
- links.schema.json
- profile.schema.json

Założenia modelu:
- teksty są lokalizowane;
- wymagany jest język pl;
- en jest opcjonalny;
- identyfikatory są trwałe i czytelne;
- przykłady:
  project-haiku-cosmos
  skill-javascript
  skill-three-js
- elementy mają status:
  draft
  published
  archived
- frontend pokazuje wyłącznie published;
- draft i archived są całkowicie ukryte;
- puste sekcje nie są renderowane;
- profile firm wskazują identyfikatory danych bazowych;
- profile nie kopiują opisów projektów, doświadczenia ani umiejętności;
- ścieżki zasobów są logiczne, bez domeny i bez początkowego ukośnika;
- dane prywatne nie mogą trafiać do content/, src/ ani public/.

5. WDROŻONY WALIDATOR DANYCH

Utworzono:
- scripts/validate-content.mjs

Polecenie:
npm run validate:content

Walidator używa:
- Ajv
- ajv-formats

Sprawdza:
- zgodność z JSON Schema;
- duplikaty identyfikatorów;
- odwołania profili do nieistniejących danych;
- duplikaty w kolejności;
- nieistniejące sekcje;
- niedozwolone pola profilu;
- niepoprawne ścieżki zasobów;
- podejrzane prywatne klucze;
- długość companyMessage;
- błędne dane powodują kod wyjścia 1.

Usunięto przestarzałą opcję Ajv jsonPointers.
Walidator korzysta z instancePath.

Lokalnie potwierdzono:
- npm install działa;
- npm ci działa po poprawieniu lockfile;
- npm run validate:content przechodzi;
- błędne dane zwracają kod 1.

6. PROBLEM LOCKFILE — ROZWIĄZANY

Poprzedni package-lock.json miał błędną sumę integrity dla fast-uri@3.0.1.

Błędna suma należała faktycznie do argparse@2.0.1.

Lockfile został lokalnie wygenerowany ponownie przez:
- usunięcie package-lock.json;
- npm install;
- ponowne npm ci.

Obecny lockfile powinien być przenośny i używać standardowych zależności npm.

Nie wolno wracać do:
- file:
- link:
- globalnego node_modules;
- lokalnych ścieżek.

7. GITIGNORE I NODE_MODULES

node_modules zostało przypadkowo dodane do repozytorium, ale zostało usunięte z indeksu Git.

.gitignore powinien zawierać przynajmniej:

node_modules/
dist/
.vite/

.env
.env.*
!.env.example

editor/local/
__pycache__/
*.pyc

.DS_Store
Thumbs.db

Kontrola:
git ls-files node_modules
git ls-files dist

Oba polecenia powinny zwracać pusty wynik.

8. WDROŻONY FRONTEND VITE

Utworzono pierwszy działający pionowy przekrój.

Główne pliki:

src/main.js

src/app/
- bootstrap.js
- content-loader.js
- profile-resolver.js
- view-model.js

src/components/
- hero-card.js
- accordion.js

src/sections/
- about-section.js
- projects-section.js

src/styles/
- tokens.css
- base.css
- layout.css
- components.css
- accordion.css
- themes.css
- print.css

src/utils/
- dom.js
- assets.js

Działa:
- npm run dev;
- npm run build;
- npm run preview;
- ładowanie danych JSON;
- ładowanie profili przez import.meta.glob;
- profil default;
- wybór profilu przez ?p=<profileId>;
- fallback do default przy nieistniejącym profilu;
- dyskretny pasek fallbacku;
- jedna wspólna karta CV;
- responsywność Mobile First;
- maksymalna szerokość karty około 940 px;
- motyw jasny/ciemny przez prefers-color-scheme;
- prefers-reduced-motion;
- accordion;
- maksymalnie jeden otwarty panel;
- możliwość zamknięcia wszystkich paneli;
- obsługa Tab, Enter i Space;
- aria-expanded;
- aria-controls;
- aria-labelledby;
- dekoracyjne chevrony;
- brak innerHTML dla danych JSON;
- dane są wstawiane przez textContent;
- opcjonalny portret;
- brak pustej kolumny, gdy portret nie istnieje;
- imię i nazwisko nie jest powtarzane jako headline;
- profil default nie jest podpisywany użytkownikowi;
- sekcje bez published znikają.

9. AKTUALNY WYGLĄD

Pierwszy widok jest celowo bardzo pusty, ponieważ większość danych nadal ma status draft.

Aktualnie może być widoczne jedynie:
- Tomasz Talik;
- przycisk „Zapisz jako PDF”.

To nie jest błąd.
To efekt poprawnego filtrowania published.

Haiku Cosmos nadal ma status draft, więc panel Projekty może się nie wyświetlać.

10. WDROŻONY PDF / WYDRUK

Pierwotnie profil wskazywał nieistniejący plik:
cv/default.pdf

Powodowało to pobieranie default.htm.

To zostało poprawione.

Aktualny model:
- brak statycznego pliku PDF;
- brak linku do public/cv/;
- przycisk „Zapisz jako PDF” jest buttonem;
- kliknięcie wywołuje window.print();
- PDF powstaje z aktualnie wyrenderowanego CV;
- używany jest ten sam view model;
- używany jest ten sam HTML;
- używany jest src/styles/print.css;
- w druku pokazują się wszystkie opublikowane sekcje wybrane przez profil;
- wydruk nie zależy od tego, który accordion był otwarty;
- przyciski, chevrony i fallback są ukrywane;
- tła i zbędne cienie są usuwane;
- po zamknięciu podglądu stan accordionu pozostaje bez zmian.

Lokalnie potwierdzono:
- window.print() działa;
- podgląd wydruku wygląda poprawnie;
- default.htm nie jest już pobierany.

Ostateczny skład PDF nie jest jeszcze ustalony.
Decyzje o:
- kolejności;
- zakresie treści;
- datach;
- firmie;
- stanowisku;
- stopce;
- danych kontaktowych;
- liczbie stron;
zostaną podjęte po dodaniu właściwych danych.

11. PRZYJĘTE DECYZJE PERSONALIZACJI

Profile firm:
- publiczne;
- nieindeksowane;
- dostępne przez losowy identyfikator;
- adres:
  ?p=p_xxxxx

Dane prywatne:
- nie znajdują się na GitHub Pages;
- docelowo pobierane z backendu;
- długi token w linku;
- zapasowy kod 6–8 znaków;
- token nie może być zabezpieczeniem danych zapisanych w publicznym frontendzie.

Docelowy link:
?p=p_xxxxx#t=DŁUGI_TOKEN

Parametr p:
- wybiera publiczny profil.

Token:
- ma później autoryzować prywatne dane w backendzie.

12. PRZYJĘTE DECYZJE EDYTORA

Lokalny edytor:
- Streamlit;
- uruchamiany lokalnie;
- niepublikowany;
- ma pozwalać dodawać firmy bez używania Codexa.

Docelowe funkcje:
- nazwa firmy;
- strona firmy;
- logo;
- stanowisko;
- język;
- krótka wiadomość 300–500 znaków;
- wybór sekcji;
- wybór projektów;
- wybór umiejętności;
- kolejność;
- wyróżnienia;
- wybór danych kontaktowych;
- tworzenie profileId;
- generowanie linku;
- walidacja;
- podgląd;
- uruchomienie generowania PDF;
- przygotowanie plików do GitHub Desktop.

Edytor nie może zapisywać prywatnych danych do publicznych profili.
Może zapisywać wyłącznie protectedScopes.

13. PRZYJĘTE DECYZJE TREŚCI

Na pierwszym ekranie docelowo mają znaleźć się:
- imię i nazwisko;
- docelowa rola;
- krótki opis;
- najważniejsze technologie;
- przycisk PDF;
- kontakt;
- przy profilu firmowym:
  nazwa firmy;
  logo;
  krótka wiadomość 300–500 znaków.

Sekcje:
- O mnie;
- Projekty;
- Doświadczenie;
- Umiejętności;
- Kontakt;
- opcjonalnie sposób pracy lub dodatkowe informacje.

Jedna karta.
Panele jako zwarte wiersze z chevronem.
Nie osobne duże kafle.

Opcjonalny portret:
- mały;
- po prawej na desktopie;
- około 140–180 px;
- object-fit: cover;
- łagodne zaokrąglenie;
- na telefonie przechodzi nad treść albo zmniejsza się.

14. POTWIERDZONE LOKALNIE

Na komputerze Projektanta:
- Vite działa;
- strona się wyświetla;
- build przechodzi;
- walidacja przechodzi;
- profile działają;
- fallback działa;
- accordion działa;
- responsywność podstawowa działa;
- ciemny motyw działa;
- wydruk działa;
- Git jest czysty;
- node_modules nie jest śledzone.

Ścieżka /Haiku-Cosmos/ widoczna lokalnie wynikała z historii lub równoległego uruchamiania innych projektów na tym samym porcie.
Nie jest to uznane za błąd projektu Tomasz Talik CV.

15. POZOSTAŁE KROKI — REKOMENDOWANA KOLEJNOŚĆ

ETAP A — CHECKPOINT DOKUMENTACYJNY

1. Wykonać przygotowany wcześniej prompt aktualizacji dokumentacji.
2. Utworzyć albo zaktualizować:
   - docs/handoff/README.md
   - docs/handoff/CURRENT_STATE.md
3. Zapisać aktualny stan:
   - działający Vite;
   - model danych;
   - walidator;
   - profil default;
   - jedna karta;
   - accordion;
   - wydruk;
   - elementy draft ukryte;
   - brak wdrożonego Streamlit, backendu i Playwright.
4. Upewnić się, że dokumentacja nie opisuje przyszłych funkcji jako gotowych.

ETAP B — PIERWSZA KANONICZNA PACZKA TREŚCI CV

Najpierw przygotować rzeczywistą treść, zanim dalej rozwijany będzie wygląd.

Do opracowania:
1. docelowa rola zawodowa;
2. headline;
3. krótki opis na kartę główną;
4. sekcja „O mnie”;
5. projekt Haiku Cosmos;
6. umiejętności;
7. technologie;
8. doświadczenie zawodowe;
9. kompetencje przenoszalne z dotychczasowej pracy;
10. publiczne dane kontaktowe;
11. publiczne linki;
12. decyzja o portrecie;
13. decyzja o języku angielskim.

Treści muszą być:
- prawdziwe;
- konkretne;
- bez zawyżania poziomu;
- bez fikcyjnych osiągnięć;
- dopasowane do kierunku:
  JavaScript;
  frontend;
  game development;
  system design;
  Three.js.

Po zatwierdzeniu elementy zmienić z draft na published.

ETAP C — PEŁNY ZAKRES SEKCJI FRONTENDU

Dodać sekcje:
- Doświadczenie;
- Umiejętności;
- Kontakt;
- ewentualnie Sposób pracy.

Rozbudować:
- pełny rendering projektów;
- technologie jako znaczniki;
- linki do GitHub i demo;
- osiągnięcia;
- odpowiedzialności;
- kompetencje przenoszalne;
- puste stany;
- kolejność z profilu;
- ukrywanie sekcji przez visibleSections.

ETAP D — DOPRACOWANIE PIERWSZEGO EKRANU

Po dodaniu prawdziwych danych:
1. ocenić wysokość karty;
2. ustalić ostateczne proporcje hero;
3. ustalić typografię;
4. ustalić wygląd technologii;
5. dodać portret, jeśli zatwierdzony;
6. dodać publiczny kontakt;
7. dopracować przyciski;
8. sprawdzić telefon, tablet, laptop i szeroki ekran;
9. sprawdzić długie teksty;
10. sprawdzić bardzo długą nazwę firmy i stanowiska.

ETAP E — PROFIL FIRMY

Utworzyć pierwszy testowy profil firmy.

Profil ma zawierać:
- profileId;
- company.name;
- company.website;
- company.logo;
- targetRole;
- headline;
- companyMessage 300–500 znaków;
- accent;
- sectionOrder;
- visibleSections;
- projectOrder;
- featuredProjectIds;
- skillOrder;
- featuredSkillIds;
- pdf.enabled;
- pdf.includeCompanyMessage;
- protectedScopes.

Profil nie może kopiować opisów projektów ani umiejętności.

Sprawdzić:
- ?p=<profileId>;
- poprawne logo;
- wiadomość;
- kolejność;
- wyróżnienia;
- fallback do default;
- nieindeksowanie profilu.

ETAP F — LOGO I DANE FIRMY

Ustalić zasady:
- logo lokalnie w public/assets/companies/;
- zoptymalizowane WebP albo SVG, jeśli dozwolone;
- brak hotlinkowania;
- zapis źródła logo;
- alt;
- maksymalny rozmiar;
- brak stylizowania całego CV na identyfikację firmy;
- firma ma być adresatem, nie właścicielem strony.

ETAP G — STREAMLIT MVP

Utworzyć lokalny edytor:

editor/
- app.py
- requirements.txt
- services/
- local/

Pierwsza wersja:
1. lista istniejących profili;
2. nowy profil;
3. edycja profilu;
4. wybór firmy;
5. stanowisko;
6. wiadomość;
7. wybór projektów;
8. wybór umiejętności;
9. kolejność;
10. widoczne sekcje;
11. accent;
12. protectedScopes;
13. zapis JSON;
14. walidacja;
15. generowanie linku;
16. kopiowanie linku;
17. brak automatycznego commita;
18. brak prywatnych danych w pliku profilu.

editor/local/ musi pozostać w .gitignore.

ETAP H — PODGLĄD PROFILU Z EDYTORA

Edytor powinien:
- uruchamiać albo wykrywać lokalny Vite;
- tworzyć link podglądu;
- otwierać:
  http://localhost:5173/?p=<profileId>
- pokazywać błędy walidacji;
- blokować zapis niepoprawnego profilu;
- nie wymagać Codexa przy dodawaniu kolejnej firmy.

ETAP I — PLAYWRIGHT I AUTOMATYCZNY PDF

Dopiero po ustaleniu treści i print.css:
1. dodać Playwright;
2. otwierać profil;
3. czekać na gotowość danych;
4. uruchamiać tryb wydruku;
5. zapisywać PDF;
6. używać tego samego HTML i view modelu;
7. nie tworzyć osobnego szablonu;
8. sterować nazwą pliku;
9. sprawdzić format A4;
10. sprawdzić podziały stron;
11. sprawdzić marginesy;
12. sprawdzić zdjęcia;
13. sprawdzić linki;
14. sprawdzić wielostronicowe CV.

Streamlit ma później uruchamiać ten proces lokalnie.

ETAP J — DECYZJE PDF

Po dodaniu prawdziwej treści ustalić:
- czy PDF ma być jedno- czy dwustronicowy;
- co jest na pierwszej stronie;
- czy wiadomość dla firmy trafia do PDF;
- czy logo firmy trafia do PDF;
- czy pokazywać datę;
- czy pokazywać miesiąc i rok;
- czy pokazywać miasto;
- czy pokazywać stanowisko;
- czy pokazywać nazwę firmy;
- czy dodawać stopkę;
- czy dodawać link do wersji internetowej;
- czy sekcje mają być skrócone względem strony;
- czy wszystkie projekty mają trafić do PDF.

Na razie nie tworzyć osobnego modelu treści PDF.
PDF korzysta z bieżącego profilu i tego samego view modelu.

ETAP K — BACKEND DANYCH PRYWATNYCH

Dopiero po działającym frontendzie i edytorze.

Rekomendowany kierunek:
- Cloudflare Worker;
- KV albo D1;
- opcjonalnie R2.

Funkcje:
- rejestr tokenów;
- hash tokenu;
- profileId;
- scopes;
- data utworzenia;
- data wygaśnięcia;
- active/revoked;
- rate limiting;
- kod 6–8 znaków;
- długi token w linku;
- możliwość unieważnienia;
- brak prywatnych wartości w repozytorium.

Frontend:
- odczytuje #t=<token>;
- nie wysyła tokenu do GitHub Pages;
- wysyła go do backendu;
- pobiera wyłącznie dozwolone pola;
- nie zapisuje danych prywatnych w localStorage;
- nie loguje tokenu do konsoli.

ETAP L — DANE PRYWATNE

Ustalić:
- jakie pola są prywatne;
- telefon;
- ewentualny dodatkowy e-mail;
- inne dane kontaktowe;
- czy istnieje data wygaśnięcia;
- czy PDF prywatny ma być generowany lokalnie czy pobierany z backendu;
- jak unieważniać dostęp.

Pełnego adresu zamieszkania raczej nie publikować.
Miasto może być publiczne, jeśli potrzebne.

ETAP M — GITHUB PAGES

Po ustabilizowaniu aplikacji:
1. potwierdzić nazwę repozytorium;
2. ustawić poprawny base;
3. skonfigurować deployment;
4. sprawdzić:
   - stronę główną;
   - ?p=;
   - assets;
   - logo;
   - odświeżenie;
   - wydruk;
   - build;
   - brak prywatnych danych;
   - brak source map, jeśli niepotrzebne;
   - poprawne ścieżki;
   - mobilny Chrome;
   - mobilny Safari, jeśli dostępny.

ETAP N — SEO I METADANE

Dodać:
- title;
- description;
- favicon;
- Open Graph;
- obraz podglądu;
- canonical;
- robots;
- sitemap dla publicznej wersji;
- brak indeksowania profili firm;
- meta noindex dla spersonalizowanych profili, jeśli potrzebne.

ETAP O — DOSTĘPNOŚĆ

Wykonać audyt:
- semantyczny HTML;
- hierarchia nagłówków;
- klawiatura;
- fokus;
- kontrast;
- aria;
- alt;
- reduced motion;
- powiększenie 200%;
- druk;
- komunikaty błędów;
- brak informacji wyłącznie kolorem;
- test czytnika ekranu w podstawowym zakresie.

ETAP P — WYDAJNOŚĆ

Sprawdzić:
- rozmiar paczki;
- obrazy;
- fonty;
- lazy loading;
- brak ciężkich bibliotek;
- brak efektów blokujących pierwszy ekran;
- brak niepotrzebnych żądań;
- brak pobierania wszystkich prywatnych danych;
- Lighthouse;
- działanie na słabszym telefonie.

ETAP Q — TESTY AUTOMATYCZNE

Dodać stopniowo:
- test walidatora;
- test fallback profilu;
- test resolve localizedText;
- test filtrowania statusów;
- test kolejności sekcji;
- test niedozwolonych odwołań;
- test widoczności PDF;
- test accordionu;
- test build;
- test braku prywatnych kluczy w dist;
- ewentualnie Playwright E2E.

ETAP R — BEZPIECZEŃSTWO

Przed backendem i publikacją:
- audyt dist;
- brak tokenów;
- brak telefonu;
- brak adresu;
- brak sekretów;
- brak prywatnych profili;
- CSP, jeśli możliwe;
- ograniczenie zewnętrznych skryptów;
- walidacja odpowiedzi backendu;
- rate limiting;
- CORS;
- logowanie bez danych wrażliwych.

ETAP S — FINALNY EDYTOR PROFILI

Po MVP:
- duplikowanie profilu;
- archiwizacja;
- status profilu;
- data utworzenia;
- data wysłania;
- data wygaśnięcia;
- notatki lokalne;
- podgląd desktop/mobile;
- generowanie PDF;
- generowanie linku;
- kod QR;
- lista zmian;
- eksport;
- walidacja logo;
- optymalizacja grafik;
- ewentualna integracja z backendem tokenów.

ETAP T — ANALITYKA OPCJONALNA

Tylko po decyzji Projektanta.

Możliwe dane:
- wejście na profil;
- data;
- przybliżony kraj;
- urządzenie;
- kliknięcie projektu;
- pobranie/druk PDF;
- użycie tokenu.

Bez:
- śledzenia nadmiarowego;
- fingerprintingu;
- danych osobowych;
- przekazywania rozmów lub prywatnych danych reklamodawcom;
- przechowywania tokenów w logach.

16. NAJBLIŻSZY REKOMENDOWANY KROK

Najpierw wykonać checkpoint dokumentacyjny, jeśli nie został jeszcze wykonany.

Następnie rozpocząć nowy wątek od przygotowania pierwszej kanonicznej paczki rzeczywistych treści CV.

Nie przechodzić jeszcze do:
- Streamlit;
- backendu;
- Playwright;
- analityki;
- efektów wizualnych.

Najbliższy temat:
„Treść pierwszej publicznej wersji CV”.

W tym etapie należy najpierw zadać pytania decyzyjne dotyczące:
1. docelowej roli;
2. odbiorcy;
3. tonu;
4. długości opisu;
5. sposobu przedstawienia Haiku Cosmos;
6. sposobu przedstawienia doświadczenia spoza IT;
7. listy realnych umiejętności;
8. publicznego kontaktu;
9. portretu;
10. języka angielskiego.

17. ZASADA NA KOLEJNY WĄTEK

Nie generuj od razu promptu dla Codexa.

Najpierw:
- przeanalizuj obecny stan;
- zadaj pytania decyzyjne dotyczące treści CV;
- poczekaj na odpowiedzi Projektanta;
- dopiero potem przygotuj prompt do zmiany danych JSON i statusów draft/published.