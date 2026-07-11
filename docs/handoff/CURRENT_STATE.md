# Aktualny stan projektu „Tomasz Talik CV”

## Ukończony etap

Ukończono pierwszy działający pionowy przekrój aplikacji: Vite, Vanilla JavaScript, CSS, publiczne dane JSON, profile wybierane przez `?p=<profileId>`, bezpieczny fallback do profilu `default`, jedna wspólna karta CV, accordion, filtrowanie statusów oraz pierwsza wersja wydruku PDF przez `window.print()`.

## Aktualne źródła prawdy

* `docs/current/README.md` — kanoniczny opis aktualnego zakresu.
* `docs/current/technical/FRONTEND_ARCHITECTURE.md` — architektura zaimplementowanego frontendu.
* `docs/current/content/CONTENT_MODEL.md` — model publicznych danych JSON, statusów `draft`/`published`/`archived`, profili i konfiguracji PDF.
* `docs/current/ui/SINGLE_PAGE_FLOW.md` — układ jednej karty CV, mobile first, motyw systemowy i accordion.
* `docs/current/technical/PDF_PIPELINE.md` — PDF jako wydruk aktualnego widoku przez `window.print()` i `src/styles/print.css`.
* `docs/current/technical/DEPLOYMENT.md` — docelowy GitHub Pages; produkcyjny deployment nie został jeszcze potwierdzony.
* Kod aplikacji w `src/`, dane w `content/` i skrypty npm w `package.json` pozostają źródłami prawdy dla zachowania runtime.

## Ostatnie potwierdzone zachowania

* Instalacja zależności npm działa lokalnie.
* `npm run validate:content` przechodzi.
* `npm run build` przechodzi.
* `npm run dev` uruchamia stronę.
* Brak parametru profilu używa `profile default`.
* Nieistniejący profil w `?p=<profileId>` wraca do `default` i pokazuje zwarty pasek fallbacku.
* `window.print()` otwiera poprawny podgląd wydruku.
* Wydruk korzysta z `src/styles/print.css`, pokazuje opublikowane sekcje wybrane przez profil i nie zależy od bieżącego stanu accordionu.
* Wydruk nie pobiera już `default.htm` ani żadnego statycznego pliku PDF.
* Większość rzeczywistej treści pozostaje `draft`; publiczny widok może obecnie zawierać tylko imię i nazwisko. To oczekiwany efekt filtrowania, nie błąd.

## Funkcje jeszcze niezaimplementowane

* Lokalny edytor Streamlit.
* Automatyczne generowanie PDF przez Playwright.
* Backend lub bezpieczne pobieranie danych prywatnych.
* Ręczny przełącznik motywu.
* Produkcyjny deployment na GitHub Pages.
* Finalna kanoniczna treść CV.
* Finalny zakres, kolejność i wygląd PDF.

## Znane otwarte decyzje

* Ostateczny zakres publicznych danych kontaktowych.
* Finalna rola zawodowa i krótki opis na karcie głównej.
* Treść sekcji „O mnie”.
* Kanoniczny opis projektu Haiku Cosmos.
* Lista i kolejność umiejętności.
* Ostateczna kolejność i wygląd treści PDF po dodaniu rzeczywistych danych CV.

## Następny rekomendowany krok

Przygotować pierwszą kanoniczną paczkę rzeczywistych treści CV: rola zawodowa, krótki opis, „O mnie”, projekt Haiku Cosmos, umiejętności oraz publiczne dane kontaktowe. Dopiero po tej paczce należy ustalać finalny zakres i układ PDF.
