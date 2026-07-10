# Interaktywne CV / Portfolio – koncepcja projektu

## Cel projektu

Stworzenie nowoczesnego, interaktywnego CV działającego jako strona internetowa (GitHub Pages), które jednocześnie:

* prezentuje mnie jako kandydata,
* jest demonstracją moich umiejętności programistycznych,
* pozwala personalizować prezentację pod konkretną firmę,
* pozostaje czytelne na każdym urządzeniu,
* nadal umożliwia pobranie klasycznego CV w formacie PDF.

Projekt ma być jednocześnie stroną portfolio oraz niewielką aplikacją webową pokazującą sposób mojego myślenia, projektowania systemów oraz dbałość o UX.

---

# Założenia projektowe

## 1. Jedna responsywna strona

Całość działa jako pojedyncza strona (Single Page Application).

Każda sekcja może zostać rozwinięta lub zwinięta.

Dzięki temu:

* strona pozostaje przejrzysta,
* dobrze działa na telefonach,
* nie wymaga przechodzenia pomiędzy podstronami.

---

## 2. Pierwszy ekran

Po wejściu użytkownik widzi jedynie najważniejsze informacje.

Przykładowy układ:

Imię i nazwisko

Stanowisko

Krótki opis (2–3 zdania)

Najważniejsze technologie

Przyciski:

* Poznaj mnie
* Projekty
* Pobierz PDF

Na dole niewielkie pole:

"Otrzymałeś kod rekrutacyjny?"

---

# Personalizacja

Jednym z głównych elementów projektu jest możliwość personalizacji strony pod konkretną firmę.

Po wpisaniu kodu lub wejściu z dedykowanego linku strona może automatycznie:

* zmienić nagłówek,
* zmienić opis stanowiska,
* wyeksponować odpowiednie projekty,
* zmienić kolejność sekcji,
* pokazać dedykowaną wiadomość,
* udostępnić dodatkowe dane kontaktowe,
* podmienić wersję PDF.

Przykład:

Firma GameDev

↓

na pierwszym miejscu:

* Haiku Cosmos
* Three.js
* JavaScript
* projektowanie systemów

Firma Web

↓

na pierwszym miejscu:

* aplikacje webowe
* Node.js
* architektura projektu
* frontend

---

# Ważne założenie bezpieczeństwa

GitHub Pages jest hostingiem statycznym.

Nie wolno umieszczać prywatnych danych:

* numeru telefonu,
* adresu,
* innych poufnych informacji

bezpośrednio w plikach HTML/JS/JSON.

Kod wpisywany przez użytkownika nie jest zabezpieczeniem.

Dlatego projekt powinien zostać podzielony na dwie części.

## Dane publiczne

Przechowywane na GitHub Pages.

Zawierają:

* opis,
* projekty,
* doświadczenie,
* technologie,
* publiczne linki.

## Dane prywatne

Pobierane dopiero po autoryzacji z niewielkiego backendu.

Backend może zostać wykonany jako:

* Cloudflare Workers
* Netlify Functions
* Vercel Functions
* Supabase Edge Functions

Dzięki temu prywatne informacje nigdy nie znajdują się w repozytorium.

---

# Struktura strony

## Sekcja 1

Karta główna

* zdjęcie lub grafika
* imię
* stanowisko
* krótki opis
* podstawowe technologie

---

## Sekcja 2

O mnie

Krótka historia:

* kim jestem,
* jak trafiłem do programowania,
* dlaczego tworzę gry,
* czym się kieruję.

Nie więcej niż około 600–700 znaków.

---

## Sekcja 3

Najważniejsze projekty

Na pierwszym miejscu:

Haiku Cosmos

Dla każdego projektu:

* opis
* problem
* rozwiązanie
* technologie
* zdjęcia
* GitHub
* demo

Każdy projekt rozwijany osobno.

---

## Sekcja 4

Doświadczenie zawodowe

Oś czasu.

Każdy wpis rozwija się po kliknięciu.

Po rozwinięciu:

* obowiązki
* osiągnięcia
* wykorzystane umiejętności
* kompetencje możliwe do przeniesienia do IT

---

## Sekcja 5

Umiejętności

Podzielone na grupy.

Przykład:

Development

* JavaScript
* Three.js
* Node.js
* Vite

Projektowanie

* Game Design
* UX
* Architektura systemów

Narzędzia

* Git
* GitHub
* VS Code
* Blender
* Meshy AI

---

## Sekcja 6

Kontakt

Publicznie:

* e-mail
* GitHub
* LinkedIn
* portfolio

Po autoryzacji:

* telefon
* dodatkowe informacje kontaktowe

---

## Sekcja 7

PDF

Możliwość pobrania:

* klasycznego CV
* wersji dedykowanej konkretnej firmie

---

# System personalizacji

Docelowo projekt powinien posiadać prosty system profili.

Przykładowy profil definiuje:

* nazwę firmy
* preferowane stanowisko
* kolejność projektów
* kolejność umiejętności
* wiadomość powitalną
* wersję PDF
* zakres udostępnianych danych

Cały frontend korzysta z jednego zestawu danych.

Zmienia się jedynie sposób prezentacji.

---

# Styl wizualny

Projekt powinien być elegancki i spokojny.

Inspiracje:

* minimalizm
* nowoczesne portfolio
* lekka stylistyka science-fiction
* subtelne animacje

Nie powinien przypominać gry.

Elementy Haiku Cosmos mogą pojawiać się jedynie jako delikatny motyw przewodni.

Przykładowo:

* subtelne światło,
* delikatne cząsteczki,
* łagodne animacje rozwijania,
* kolorystyka nawiązująca do projektu.

Najważniejsza pozostaje czytelność.

---

# Responsywność

Projekt od początku tworzony w podejściu Mobile First.

Powinien dobrze wyglądać na:

* telefonach
* tabletach
* laptopach
* monitorach 4K

Bez tworzenia osobnych wersji strony.

---

# Technologie

Planowana pierwsza wersja:

Frontend

* Vite
* Vanilla JavaScript
* HTML
* CSS

Hosting

* GitHub Pages

Dane

* JSON

Backend (opcjonalnie)

* Cloudflare Workers
  lub
* Netlify Functions
  lub
* Vercel Functions

---

# Rozwój projektu

Etap 1

* stworzenie podstawowego portfolio
* responsywny układ
* projekty
* doświadczenie
* kontakt

Etap 2

* system personalizacji
* profile firm
* dedykowane PDF

Etap 3

* backend
* bezpieczne dane prywatne
* logowanie wejść (opcjonalnie)

Etap 4

* drobne animacje
* dopracowanie UX
* optymalizacja wydajności

---

# Główna idea projektu

To nie ma być wyłącznie interaktywne CV.

Ma to być niewielka aplikacja pokazująca sposób mojego projektowania systemów.

Każdy element powinien mieć uzasadnienie, być prosty w obsłudze i czytelny.

Rekruter powinien w ciągu kilkunastu sekund zrozumieć:

* kim jestem,
* co potrafię,
* jakie projekty stworzyłem,
* dlaczego warto poświęcić czas na dalszą rozmowę.

Interaktywność ma wspierać prezentację treści, a nie odwracać od niej uwagę.
