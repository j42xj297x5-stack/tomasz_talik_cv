# Tomasz Talik — CV

**Polski** · [English](README.en.md)

Moje CV w formie niewielkiej aplikacji internetowej. Zebrałem w niej doświadczenie z IT, elektroniki, pracy z klientem, dźwięku i produkcji multimedialnej oraz projekty, nad którymi obecnie pracuję.

To także jeden z tych projektów: aplikacja z własnym modelem treści, profilami dla odbiorców, lokalnym edytorem i dostępem do prywatnych danych kontaktowych przez Cloudflare.

[Otwórz CV](https://j42xj297x5-stack.github.io/tomasz_talik_cv/) · [Zobacz portfolio](https://j42xj297x5-stack.github.io/tomasz-talik-portfolio/)

## Dwie perspektywy na to samo doświadczenie

Przygotowałem dwa warianty CV:

- **Game Dev** — skupiony na projektowaniu gier, interakcjach przestrzennych, Three.js, WebXR oraz pracy z obrazem i dźwiękiem.
- **IT / AI** — skupiony na analizie potrzeb, tworzeniu aplikacji i narzędzi, integracjach API, pracy z danymi oraz wykorzystaniu AI przy realizacji projektów.

Oba korzystają ze wspólnej bazy informacji. Różnią się wstępem, opisami wybranych prac, kolejnością projektów i wyróżnionymi umiejętnościami. CV jest dostępne po polsku i angielsku.

## Profil przygotowany dla konkretnej firmy

Dla każdej firmy mogę przygotować osobny profil i link do CV. W lokalnym edytorze wpisuję nazwę odbiorcy, wybieram wariant i generuję konfigurację. Dzięki temu osoba otwierająca link otrzymuje wersję przygotowaną z myślą o danej rekrutacji.

Z tym wiążą się oznaczenia widoczne w adresie:

- `#p` wskazuje publiczny profil firmy — jej nazwę i wybrany wariant CV.
- `#k` służy do pobrania prywatnych danych kontaktowych.

Te dwa identyfikatory mają różne zadania. Profil firmy jest publiczny, natomiast dostęp do prywatnego kontaktu wymaga aktywnego tokenu. Link z takim tokenem można przekazać dalej, dlatego traktuję go jako sposób udostępniania kontaktu, a nie potwierdzenie tożsamości odbiorcy.

## Prywatne dane kontaktowe i Cloudflare

Publiczna część CV jest hostowana na GitHub Pages. Prywatne dane kontaktowe są przechowywane poza repozytorium i pobierane przez Cloudflare Workera po sprawdzeniu tokenu dostępu.

Pozwala to oddzielić publiczną prezentację projektów od informacji udostępnianych osobom, do których wysyłam CV. W repozytorium znajduje się kod strony i klient komunikujący się z Workerem; kod samej usługi Cloudflare jest utrzymywany oddzielnie.

## Co jest zrobione

Aplikacja obsługuje:

- dwa warianty treści: Game Dev i IT / AI;
- język polski i angielski;
- publiczne profile przygotowane dla poszczególnych firm;
- pobieranie prywatnego kontaktu przez Cloudflare Workera;
- projekty z linkami do demonstracji, filmów i repozytoriów;
- umiejętności w widoku kategorii oraz interaktywnej chmury;
- zapis bieżącej wersji CV do PDF przez mechanizm drukowania przeglądarki;
- walidację treści i automatyczny build przed publikacją na GitHub Pages.

Lokalny edytor w Streamlit pomaga przygotować profil firmy, aktywować token kontaktowy oraz opracować treść maila i listu motywacyjnego. Publikacja profilu pozostaje osobnym krokiem — plik musi zostać dodany do repozytorium i wdrożony na stronie.

## Projekty przedstawione w CV

**Orange Monkey VR** — narracyjna gra przeglądarkowa VR, łącząca eksplorację, zagadki przestrzenne i konstruowanie narzędzi. Projekt obejmuje własne systemy rozgrywki oparte na Three.js i WebXR, grafikę, animację i dźwięk przestrzenny.

**Haiku Cosmos** — kontemplacyjna gra łącząca generowany kosmos, system kart i poezję. Działania gracza wpływają na stan i rozwój świata.

**DIG Engine** — lokalna aplikacja do odkrywania muzyki i pracy z danymi ze Spotify, Last.fm i Discogs, rozwijana w Pythonie i PySide6.

**Interactive AI Portfolio** — prezentacja moich prac w klasycznym interfejsie 2D i przestrzeni 3D, obejmująca również osobną grę VR.

**Creative AI — Bajka o R.** — autorska krótka forma filmowa przygotowana z wykorzystaniem narzędzi generatywnych, narracji, głosu, dźwięku i montażu.

## Sposób pracy

Przy tworzeniu CV korzystam z ChatGPT i Codexa. Przygotowuję wymagania, porządkuję zadania, podejmuję decyzje projektowe i sprawdzam rezultaty. AI wspiera mnie w analizie, implementacji i dokumentacji.

W samym projekcie najważniejsze były dla mnie czytelny podział odpowiedzialności, możliwość zmiany treści bez przebudowy interfejsu i oddzielenie danych publicznych od prywatnych. Warianty CV korzystają ze wspólnych danych, a walidacja pomaga wychwytywać błędy przed publikacją.

## Technologie

Frontend: JavaScript, HTML, CSS i Vite.  
Treść i walidacja: JSON, JSON Schema i Ajv.  
Lokalny edytor: Python i Streamlit.  
Prywatny kontakt: Cloudflare Worker.  
Publikacja: GitHub Actions i GitHub Pages.

## Uruchomienie lokalne

Wymagany Node.js 24.

```bash
npm ci
npm run dev
```

Walidacja treści i build:

```bash
npm run validate:content
npm run build
```

Instrukcje uruchomienia edytora znajdują się w [dokumentacji lokalnego edytora](docs/current/technical/LOCAL_EDITOR.md).

## Dokumentacja

Opis architektury, danych, profilowania i publikacji znajduje się w [dokumentacji projektu](docs/current/README.md). Punktem wejścia do pracy nad kodem jest [ENTRY_POINT.md](ENTRY_POINT.md).
