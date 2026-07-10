# TOMASZ TALIK CV — PROTOKÓŁ PRACY PROJEKTOWEJ

wersja robocza v0.1

## 1. CEL PROTOKOŁU

Ten protokół opisuje sposób pracy między Projektantem, ChatGPT jako architektem projektu oraz Codexem jako wykonawcą przy projekcie „Tomasz Talik CV”.

Projekt obejmuje interaktywne CV i portfolio tworzone jako responsywna aplikacja internetowa z użyciem HTML, CSS, JavaScript, Vite, danych JSON oraz — w późniejszych etapach — opcjonalnego backendu do obsługi prywatnych danych i profili rekrutacyjnych.

Celem protokołu jest ograniczenie chaosu między:
- wizją Projektanta,
- treścią CV,
- dokumentacją projektu,
- kodem w repozytorium,
- publikowaną wersją strony,
- tym, co Codex rozumie jako aktualną prawdę projektu.

Zasada nadrzędna:

Najpierw porządkujemy cel i odbiorcę, potem podejmujemy decyzje, następnie przygotowujemy precyzyjny prompt, Codex wykonuje zadanie, wraca z krótkim raportem, a na końcu aktualizujemy dokumentację i źródła treści.

Nie robimy dużych zmian „na czuja”.
Nie mieszamy wersji historycznych z aktualnymi.
Nie pozwalamy Codexowi samodzielnie zmieniać przekazu zawodowego, danych osobowych ani kanonu treści CV.
Nie każemy Codexowi czytać całego repozytorium bez potrzeby.

## 2. CHARAKTER PROJEKTU

„Tomasz Talik CV” nie jest wyłącznie stroną z życiorysem.

Projekt ma jednocześnie:
- prezentować kandydata,
- działać jako portfolio,
- demonstrować umiejętności programistyczne i projektowe,
- wspierać personalizację pod konkretną firmę lub stanowisko,
- umożliwiać pobranie klasycznego CV w PDF,
- pozostać szybki, czytelny, dostępny i bezpieczny.

Interaktywność ma wspierać przekaz, a nie konkurować z treścią.

Najważniejszym odbiorcą jest rekruter, kierownik zespołu lub osoba techniczna, która powinna w kilkanaście sekund zrozumieć:
- kim jest Tomasz,
- w jakim kierunku zawodowym zmierza,
- co potrafi,
- jakie projekty stworzył,
- dlaczego warto przejść do dalszej rozmowy.

## 3. ROLE

### 3.1. Projektant

Projektant:
- definiuje intencję,
- określa docelowego odbiorcę,
- zatwierdza treść i kierunek komunikacji,
- wybiera priorytety zawodowe,
- decyduje, które projekty i kompetencje są eksponowane,
- zatwierdza wygląd, zachowanie i zakres personalizacji,
- decyduje, które informacje są publiczne, a które prywatne,
- wykonuje test odbioru strony jako jej właściciel.

Projektant nie musi opisywać problemów technicznie.
Może mówić językiem celu, wrażenia, przykładu, odbiorcy lub problemu użytkownika.

### 3.2. ChatGPT jako architekt projektu

ChatGPT:
- porządkuje wymagania,
- wykrywa sprzeczności,
- rozdziela kwestie treści, wyglądu, logiki i bezpieczeństwa,
- zadaje pytania decyzyjne przed większą zmianą,
- dzieli duże zadania na bezpieczne etapy,
- projektuje strukturę danych i dokumentacji,
- przygotowuje zwięzłe prompty dla Codexa,
- analizuje raporty Codexa,
- pilnuje zgodności strony z celem rekrutacyjnym,
- pilnuje jednej aktualnej prawdy projektu,
- pilnuje, aby dane prywatne nie trafiły do publicznego repozytorium.

ChatGPT nie wypuszcza finalnego promptu wykonawczego, jeśli temat wymaga nierozstrzygniętych decyzji projektowych.

Kolejność:
1. analiza,
2. pytania decyzyjne,
3. wybór Projektanta,
4. prompt dla Codexa,
5. analiza wyniku,
6. aktualizacja dokumentacji.

### 3.3. Codex jako wykonawca

Codex:
- wykonuje konkretne zadanie w repozytorium,
- czyta wyłącznie wskazane pliki oraz ich bezpośrednie zależności,
- robi minimalne i bezpieczne zmiany,
- nie zmienia samodzielnie przekazu CV,
- nie wymyśla danych osobowych, doświadczenia ani kompetencji,
- nie przenosi prywatnych danych do frontendu,
- nie przebudowuje architektury poza zakresem promptu,
- uruchamia wskazane testy,
- raportuje zmienione pliki, wynik testów i ryzyka.

Codex nie jest właścicielem produktu ani głównym projektantem.
Nie ustala samodzielnie kanonu treści, stylu ani modelu bezpieczeństwa.

## 4. JĘZYK PROJEKTU

Domyślnym językiem pracy i dokumentacji jest język polski.

Po polsku zapisujemy:
- dokumentację,
- decyzje projektowe,
- opisy funkcji strony,
- prompty dla Codexa,
- raporty i audyty,
- treść polskiej wersji CV.

Angielski jest dopuszczalny w:
- nazwach technicznych,
- nazwach bibliotek i standardów,
- nazwach plików, funkcji, klas i zmiennych,
- treści angielskiej wersji CV,
- nazwach technologii i stanowisk, gdy jest to uzasadnione rynkowo.

Nie używamy niepotrzebnych makaronizmów w dokumentacji.

Treść widoczna na stronie może mieć osobne wersje językowe, ale każda wersja musi być traktowana jako osobny, zatwierdzony wariant treści.

## 5. ŹRÓDŁA PRAWDY

Projekt musi mieć jasno określone źródła prawdy.

### 5.1. Kanon projektu

Kanonem są:
- aktualna dokumentacja w `docs/current/`,
- zatwierdzone pliki danych treści,
- aktualny kod produkcyjny,
- zatwierdzone pliki PDF,
- decyzje zapisane w dokumentacji po zakończeniu wątku.

### 5.2. Hierarchia prawdy

W przypadku konfliktu obowiązuje kolejność:
1. jawna, najnowsza decyzja Projektanta,
2. dokumentacja kanoniczna w `docs/current/`,
3. zatwierdzone dane treści,
4. kod produkcyjny,
5. starsze raporty, handoffy i materiały historyczne.

Konflikt należy nazwać i rozstrzygnąć.
Codex nie może zgadywać.

### 5.3. Treść CV jako dane

Docelowo treść CV powinna być oddzielona od warstwy prezentacji.

Preferowany model:
- dane publiczne w plikach JSON lub modułach danych,
- komponenty i funkcje renderujące w JavaScript,
- wygląd w CSS,
- pliki PDF jako osobne artefakty,
- profile personalizacji jako osobna warstwa konfiguracji,
- dane prywatne poza publicznym repozytorium.

Zmiana wyglądu nie powinna wymagać przepisywania treści.
Zmiana profilu firmy nie powinna tworzyć osobnej kopii całej strony.

## 6. TRYB DECYZYJNY PRZED PROMPTEM

Przed przygotowaniem promptu ChatGPT ocenia, czy temat wymaga decyzji projektowych.

Prompt można przygotować od razu, gdy zadanie jest:
- małe,
- jednoznaczne,
- lokalne,
- techniczne,
- bez wpływu na treść, architekturę, bezpieczeństwo lub główny wygląd.

Pytania decyzyjne są obowiązkowe, gdy temat dotyczy:
- architektury aplikacji,
- struktury treści,
- personalizacji pod firmy,
- danych prywatnych,
- stylu wizualnego,
- dużej przebudowy interfejsu,
- dostępności,
- systemu profili,
- wersji językowych,
- analityki i logowania,
- publikacji lub hostingu.

Format pytań:

1. Pytanie
   a) opcja
   b) opcja
   c) opcja
   d) opcja

Projektant może odpowiedzieć skrótowo:
`1b, 2a, 3d`.

Nowego dużego pomysłu nie dopisujemy na końcu gotowego promptu.
Wraca on do etapu decyzji albo staje się osobnym krokiem.

## 7. FORMAT PROMPTÓW DLA CODEXA

Prompty dla Codexa przygotowywane są jako jeden blok plain text.

Prompt ma być krótki, techniczny i operacyjny.

Preferowana struktura:

PLIKI DO ODCZYTU:
- konkretne ścieżki

PLIKI DO MODYFIKACJI:
- konkretne ścieżki lub jasno ograniczony obszar

CEL:
- jeden mierzalny rezultat

AKCJA:
- suche kroki wykonawcze

KRYTERIA AKCEPTACJI:
- warunki uznania zadania za zakończone

TESTY:
- konkretne polecenia lub checklista ręczna

ZAKAZY:
- czego nie zmieniać

FORMAT WYJŚCIOWY:
- Compact Summary, maksymalnie 50 słów
- zmienione pliki
- testy
- ryzyka

Prompt nie powinien zawierać:
- długiego wstępu,
- historii projektu,
- powtórzonej dokumentacji,
- luźnych pomysłów,
- kilku niezależnych zadań naraz,
- polecenia czytania całego repozytorium.

## 8. OGRANICZANIE KONTEKSTU DLA CODEXA

Codex dostaje tylko wycinek rzeczywistości potrzebny do wykonania jednego zadania.

Prompt wskazuje:
- pliki obowiązkowe,
- pliki pomocnicze,
- zakres zmian,
- katalogi zakazane,
- rodzaj zadania: audyt, poprawka, funkcja, refaktor, dokumentacja lub test.

Codex nie powinien domyślnie czytać:
- całego repozytorium,
- `docs/legacy/`,
- `docs/audits/`,
- starych wersji CV,
- prywatnych materiałów,
- niepowiązanych projektów.

Katalogi historyczne analizuje ChatGPT, a Codex otrzymuje wyłącznie skompresowane wnioski.

## 9. DZIELENIE DUŻYCH ZADAŃ

Duże zadanie dzielimy na etapy, których wynik można niezależnie ocenić.

Przykład:
1. audyt obecnego repozytorium,
2. ustalenie struktury danych,
3. utworzenie szkieletu strony,
4. implementacja sekcji,
5. system rozwijania i zwijania,
6. responsywność,
7. personalizacja,
8. bezpieczeństwo danych,
9. dostępność i wydajność,
10. publikacja,
11. aktualizacja dokumentacji.

Po każdym kroku:
1. Codex zwraca Compact Summary.
2. Projektant przekazuje wynik ChatGPT.
3. ChatGPT ocenia zgodność z decyzjami.
4. W razie potrzeby powstaje poprawka.
5. Dopiero potem rusza następny krok.

Nie przygotowujemy serii dużych promptów z góry, jeśli wynik pierwszego etapu może zmienić następne.

## 10. DOKUMENTACJA PROJEKTU

Dokumentacja jest pamięcią projektu i mapą dla kolejnych sesji.

Nie może być śmietnikiem pomysłów ani kopią kodu.

Proponowana struktura:

```text
docs/
  README.md
  current/
    README.md
    maps/
    product/
    content/
    ui/
    visual/
    technical/
    security/
    workflow/
  legacy/
    README.md
    archive_YYYY_MM_DD/
  audits/
    README.md
    chronological/
    thematic/
  handoff/
    README.md
```

### 10.1. `docs/README.md`

Główna mapa dokumentacji.

Powinna wyjaśniać:
- strukturę katalogów,
- źródła prawdy,
- co jest aktualne,
- co jest historyczne,
- od czego zacząć,
- który dokument czytać przy danym rodzaju zadania.

### 10.2. `docs/current/product/`

Dokumenty dotyczące produktu:
- cel projektu,
- odbiorcy,
- propozycja wartości,
- zakres pierwszej wersji,
- plan rozwoju,
- profile rekrutacyjne.

### 10.3. `docs/current/content/`

Dokumenty dotyczące treści:
- biogram,
- doświadczenie,
- projekty,
- umiejętności,
- dane kontaktowe,
- wersje językowe,
- zasady personalizacji,
- mapowanie treści do PDF.

### 10.4. `docs/current/ui/`

Dokumenty dotyczące interfejsu:
- mapa sekcji,
- zachowanie akordeonów,
- nawigacja,
- pierwszy ekran,
- formularz kodu rekrutacyjnego,
- stany błędów i puste stany,
- zachowanie na urządzeniach mobilnych.

### 10.5. `docs/current/visual/`

Dokumenty dotyczące wyglądu:
- kierunek wizualny,
- typografia,
- kolory,
- odstępy,
- animacje,
- zasady użycia motywów Haiku Cosmos,
- zasada: subtelność ponad dekoracyjność.

### 10.6. `docs/current/technical/`

Dokumenty techniczne:
- architektura frontendu,
- struktura katalogów,
- model danych,
- publikacja na GitHub Pages,
- obsługa ścieżek bazowych,
- testy,
- wydajność,
- obsługa błędów,
- generowanie lub dołączanie PDF.

### 10.7. `docs/current/security/`

Dokumenty bezpieczeństwa:
- podział danych publicznych i prywatnych,
- model autoryzacji,
- zasady przechowywania sekretów,
- zagrożenia GitHub Pages,
- reguły logowania wejść,
- zakres zbieranych danych,
- zasady prywatności.

### 10.8. `docs/current/workflow/`

Dokumenty procesu:
- niniejszy protokół,
- instrukcja dla Codexa,
- zasady raportowania,
- procedura publikacji,
- procedura aktualizacji CV.

### 10.9. `docs/legacy/`

Tu trafiają dokumenty nieaktualne, zastąpione lub historyczne.

Legacy nie jest źródłem prawdy.
Codex nie czyta go bez wyraźnego polecenia.

### 10.10. `docs/audits/`

Tu trafiają audyty:
- dostępności,
- wydajności,
- bezpieczeństwa,
- responsywności,
- zgodności treści,
- publikacji,
- jakości kodu.

### 10.11. `docs/handoff/`

Handoff jest krótkim przekazaniem bieżącego stanu.

Zawiera:
- aktualny etap,
- ostatnie decyzje,
- zmienione obszary,
- znane problemy,
- następny krok.

Nie zastępuje pełnej dokumentacji.

## 11. STRUKTURA REPOZYTORIUM

Struktura kodu może ewoluować, ale powinna rozdzielać odpowiedzialności.

Preferowany kierunek:

```text
src/
  main.js
  app/
  components/
  sections/
  data/
  personalization/
  services/
  styles/
  utils/
public/
  assets/
  cv/
  images/
  icons/
docs/
tests/
```

Zasady:
- treść oddzielona od renderowania,
- profile personalizacji oddzielone od głównych danych,
- CSS podzielony według odpowiedzialności, a nie przypadkowo,
- brak danych prywatnych w `src/` i `public/`,
- brak sekretów w repozytorium,
- pliki PDF mają jednoznaczne nazwy i status aktualności.

Nie tworzymy nadmiernie rozbudowanej architektury dla prostego problemu.
Vanilla JavaScript pozostaje domyślnym wyborem, dopóki skala projektu nie uzasadni frameworka.

## 12. ZASADY TREŚCI CV

Treść CV jest częścią produktu i wymaga zatwierdzenia przez Projektanta.

Codex może:
- renderować dane,
- walidować strukturę,
- zmieniać kolejność według konfiguracji,
- obsługiwać warianty językowe,
- wdrażać profile firmowe.

Codex nie może samodzielnie:
- dopisywać doświadczenia,
- podwyższać poziomu kompetencji,
- tworzyć fikcyjnych osiągnięć,
- zmieniać dat,
- przedstawiać narzędzia jako technologii opanowanej bez potwierdzenia,
- publikować prywatnych danych.

Każda istotna zmiana treści powinna zostać sprawdzona pod kątem:
- prawdziwości,
- konkretności,
- przydatności dla odbiorcy,
- spójności z PDF,
- spójności między wersjami językowymi,
- braku niepotrzebnych powtórzeń.

## 13. PERSONALIZACJA POD FIRMĘ

Personalizacja nie może tworzyć osobnej, trudnej do utrzymania kopii strony.

Preferowany model:
- jeden zbiór danych bazowych,
- jeden system renderowania,
- profile konfigurujące kolejność i widoczność,
- opcjonalne wiadomości dedykowane,
- osobne pliki PDF przypisane do profilu,
- jawny zakres udostępnianych danych.

Profil może określać:
- identyfikator,
- nazwę firmy,
- docelowe stanowisko,
- wariant nagłówka,
- kolejność projektów,
- kolejność umiejętności,
- widoczne sekcje,
- wyróżnione technologie,
- dedykowaną wiadomość,
- plik PDF,
- zakres danych kontaktowych.

Kod rekrutacyjny wpisywany w interfejsie nie jest sam w sobie zabezpieczeniem.
Nie wolno traktować go jako ochrony danych zapisanych w publicznym JavaScript lub JSON.

## 14. BEZPIECZEŃSTWO I PRYWATNOŚĆ

GitHub Pages jest hostingiem statycznym.
Wszystko, co trafia do zbudowanego frontendu, należy traktować jako publiczne.

W publicznym repozytorium i paczce strony nie mogą znajdować się:
- prywatny numer telefonu, jeśli nie ma być publiczny,
- adres zamieszkania,
- prywatne dokumenty,
- klucze API,
- tokeny,
- sekrety,
- ukryte profile zawierające poufne dane,
- dane zaszyte jedynie przez prostą transformację lub obfuskację.

Podział:

Dane publiczne:
- opis,
- projekty,
- umiejętności,
- doświadczenie,
- publiczny e-mail,
- GitHub,
- LinkedIn,
- publiczne pliki PDF.

Dane prywatne:
- pobierane z backendu dopiero po poprawnej autoryzacji,
- niewysyłane do przeglądarki przed autoryzacją,
- niewbudowane w kod strony,
- przechowywane poza repozytorium.

Każdy etap dotyczący danych prywatnych wymaga osobnej decyzji architektonicznej i audytu bezpieczeństwa.

## 15. INTERFEJS I RESPONSYWNOŚĆ

Projekt jest tworzony w podejściu Mobile First.

Każda sekcja musi być sprawdzona co najmniej dla:
- małego telefonu,
- dużego telefonu,
- tabletu,
- laptopa,
- szerokiego monitora.

Nie tworzymy osobnych wersji strony dla każdego urządzenia.

Wymagania podstawowe:
- brak poziomego przewijania,
- czytelna typografia,
- odpowiednio duże pola interakcji,
- sensowna kolejność treści,
- poprawne działanie rozwijania i zwijania,
- obsługa klawiatury,
- widoczny fokus,
- odpowiednie kontrasty,
- poszanowanie `prefers-reduced-motion`,
- brak animacji blokujących szybkie dotarcie do informacji.

Pierwszy ekran ma przekazywać najważniejsze informacje bez konieczności interakcji.

## 16. DOSTĘPNOŚĆ

Dostępność nie jest etapem końcowym, tylko kryterium każdej funkcji.

Minimalne wymagania:
- semantyczny HTML,
- poprawna hierarchia nagłówków,
- przyciski jako przyciski, linki jako linki,
- teksty alternatywne dla znaczących obrazów,
- elementy dekoracyjne ukryte przed czytnikami,
- poprawna obsługa klawiatury,
- widoczne stany fokusu,
- komunikaty błędów powiązane z polami,
- rozwijane sekcje z poprawnym stanem `aria-expanded`,
- brak informacji przekazywanej wyłącznie kolorem,
- ograniczenie ruchu dla osób, które tego wymagają.

Każda większa zmiana interfejsu powinna mieć krótką checklistę dostępności.

## 17. WYDAJNOŚĆ

Strona CV musi ładować się szybko i działać płynnie na słabszych urządzeniach.

Zasady:
- brak ciężkich bibliotek bez uzasadnienia,
- optymalizacja obrazów,
- ładowanie tylko potrzebnych zasobów,
- ograniczenie efektów cząsteczkowych i animacji,
- brak ciężkiego renderowania na pierwszym ekranie,
- utrzymanie czytelności bez JavaScriptu wszędzie tam, gdzie jest to rozsądne,
- ostrożne używanie zewnętrznych skryptów,
- kontrola rozmiaru paczki produkcyjnej.

Efekty wizualne inspirowane Haiku Cosmos są dodatkiem.
Nie mogą pogarszać czasu ładowania, dostępności ani czytelności.

## 18. TESTY I KRYTERIA AKCEPTACJI

Każdy prompt dla Codexa powinien zawierać mierzalne kryteria akceptacji.

Minimalny zestaw kontroli po zmianach:
- uruchomienie projektu lokalnie,
- produkcyjny build,
- brak błędów w konsoli,
- kontrola ścieżek pod GitHub Pages,
- test mobilny i desktopowy,
- test klawiatury,
- test rozwijanych sekcji,
- test linków i pobierania PDF,
- test profilu domyślnego,
- test błędnego kodu personalizacji,
- test braku danych prywatnych w zbudowanych plikach.

Dla zmian w danych:
- walidacja składni,
- sprawdzenie brakujących pól,
- sprawdzenie duplikatów identyfikatorów,
- sprawdzenie odwołań do nieistniejących projektów, plików PDF i obrazów.

Dla zmian wizualnych:
- zrzuty lub ręczna checklista rozdzielczości,
- kontrola przepełnień,
- kontrola długości tekstu,
- kontrola stanów hover, focus, active i disabled.

## 19. PUBLIKACJA

Publikacja jest osobnym krokiem, nie efektem ubocznym przypadkowej zmiany.

Przed publikacją należy sprawdzić:
- poprawny build,
- poprawny `base` dla GitHub Pages,
- działanie bezpośrednich odnośników,
- dostępność plików PDF,
- brak prywatnych danych i sekretów,
- aktualność treści,
- poprawność metadanych strony,
- tytuł, opis i obraz podglądu,
- działanie strony po odświeżeniu,
- działanie na urządzeniu mobilnym.

Publikacja większej wersji powinna mieć:
- numer lub nazwę wydania,
- krótkie podsumowanie zmian,
- zapis znanych ograniczeń,
- możliwość powrotu do poprzedniej stabilnej wersji przez Git.

## 20. RAPORT PO PRACY CODEXA

Domyślny raport Codexa ma być krótki.

Format:

1. COMPACT SUMMARY
   Maksymalnie 50 słów.

2. ZMIENIONE PLIKI
   Lista ścieżek z krótkim opisem.

3. TESTY
   Polecenia i wynik.

4. RYZYKA
   Tylko realne, nierozwiązane kwestie.

Jeśli zadanie było audytem:
- Codex ma jasno napisać, że nie zmienił plików,
- wskazać źródła prawdy,
- wypisać problemy według ważności,
- zaproponować najmniejszy bezpieczny następny krok.

Rozbudowany raport jest wymagany tylko wtedy, gdy prompt wyraźnie o niego prosi.

## 21. AKTUALIZACJA DOKUMENTACJI

Po większej zmianie należy sprawdzić, czy zmieniła się prawda projektu.

Jeśli tak:
- aktualizujemy odpowiedni dokument w `docs/current/`,
- aktualizujemy mapy i README,
- przenosimy zastąpione dokumenty do `docs/legacy/`,
- dodajemy audyt, jeśli zmiana była przekrojowa,
- przygotowujemy handoff, jeśli kończy się większy wątek.

Nie aktualizujemy dokumentacji mechanicznie po każdej drobnej korekcie CSS.
Aktualizujemy ją wtedy, gdy zmienia się zachowanie, struktura, zakres, bezpieczeństwo lub kanon treści.

## 22. KOLEJNOŚĆ PRACY PRZY NOWYM TEMACIE

Każdy większy temat prowadzimy według schematu:

1. Projektant opisuje problem, cel lub wizję.
2. ChatGPT rozdziela treść, interfejs, logikę i ryzyka.
3. ChatGPT zadaje pytania decyzyjne.
4. Projektant wybiera odpowiedzi.
5. ChatGPT przygotowuje krótki prompt dla Codexa.
6. Codex wykonuje jeden krok.
7. Projektant przekazuje raport Codexa.
8. ChatGPT ocenia wynik.
9. Powstaje poprawka lub następny krok.
10. Po domknięciu aktualizujemy dokumentację.
11. Kończymy wątek krótkim handoffem.

## 23. ZASADA KOŃCA WĄTKU

Jeden większy problem lub obszar = jeden wątek pracy.

Na końcu:
- podsumowujemy decyzje,
- zapisujemy aktualny stan,
- aktualizujemy dokumentację,
- wskazujemy znane problemy,
- wyznaczamy jeden następny sensowny krok.

Do kolejnego wątku przenosimy aktualną prawdę, a nie pełny historyczny kontekst.

## 24. OGRANICZANIE TOKENÓW

Prompty dla Codexa mają być maksymalnie oszczędne.

Zasady:
- tylko pliki niezbędne do zadania,
- tylko jeden główny rezultat,
- brak powtórzeń dokumentacji,
- brak długiego tła,
- brak opisów oczywistych dla kodu,
- brak całych plików wklejanych bez potrzeby,
- preferowanie nazw funkcji, selektorów, modułów i konkretnych ścieżek,
- kontekst ograniczony co najmniej o 70% względem pełnego opisu projektu.

ChatGPT przechowuje szerszy kontekst.
Codex dostaje chirurgiczny wycinek potrzebny do wykonania zadania.

## 25. ZASADA NAJWAŻNIEJSZA

Projekt „Tomasz Talik CV” ma mieć jedną aktualną prawdę dotyczącą:
- tożsamości i przekazu zawodowego,
- treści CV,
- struktury aplikacji,
- profili personalizacji,
- danych publicznych i prywatnych,
- wyglądu,
- sposobu publikacji.

Jeżeli występuje konflikt między pamięcią Projektanta, dokumentacją, danymi, kodem, PDF lub opublikowaną stroną, konflikt należy nazwać, rozstrzygnąć i zapisać.

Dopóki nie zostanie rozstrzygnięty, Codex nie powinien zgadywać ani tworzyć własnej wersji prawdy.
