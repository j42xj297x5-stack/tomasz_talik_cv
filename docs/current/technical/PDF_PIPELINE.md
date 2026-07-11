# Generowanie PDF

## Cel

Dokument definiuje aktualną pierwszą wersję PDF jako wydruk aktualnie wyrenderowanej wersji CV. Zależy od `docs/current/technical/FRONTEND_ARCHITECTURE.md`, `docs/current/content/CONTENT_MODEL.md` i `docs/current/product/PERSONALIZATION_SYSTEM.md`.

## Zasada główna

PDF powstaje z tego samego HTML, tego samego view modelu i tych samych danych profilu, które renderuje aplikacja webowa. Nie utrzymuje się osobnej kopii treści CV, osobnego szablonu PDF ani list projektów, umiejętności lub sekcji zapisanych specjalnie dla PDF.

## Pierwsza wersja

Pierwsza wersja używa `window.print()` wywoływanego z przycisku „Zapisz jako PDF”. Przeglądarka otwiera systemowy podgląd drukowania, a użytkownik zapisuje wynik jako PDF. Aplikacja nie pobiera statycznego pliku PDF, nie pobiera `default.htm` i nie przechowuje ścieżki do statycznego pliku PDF profilu `default`.

## Widok drukowany

Widok drukowany jest kontrolowany przez `src/styles/print.css`. Arkusz drukowania ukrywa przyciski akcji, chevrony, elementy interaktywne i pasek fallbacku, usuwa tło strony oraz zbędne cienie, dopasowuje kartę CV do strony wydruku i pokazuje treść wszystkich opublikowanych sekcji wybranych w profilu niezależnie od aktualnego stanu accordionu.

Normalny stan accordionu w aplikacji nie jest modyfikowany przed drukiem ani po zamknięciu okna drukowania.

## Konfiguracja profilu

Pole `pdf` w profilu jest opcjonalną konfiguracją. Obsługiwane pola to:

* `enabled` — gdy ma wartość `false`, przycisk zapisu PDF nie jest renderowany;
* `includeCompanyMessage` — opcjonalna flaga dla późniejszych decyzji o widoczności komunikatu firmowego w wydruku.

Brak pola `pdf` oznacza domyślnie włączony przycisk zapisu PDF. Pole `pdf` nie przechowuje ścieżki do pliku ani osobnej treści PDF.

## Zakres jeszcze niekanoniczny

Ostateczny zakres, kolejność i wygląd treści PDF nie są jeszcze kanonem. Zostaną ustalone po dodaniu rzeczywistych danych CV i sprawdzeniu, które opublikowane sekcje powinny wejść do pierwszej kanonicznej wersji wydruku.

## Późniejsza automatyzacja

Streamlit i Playwright nie są obecnie zaimplementowane. W kolejnych etapach Streamlit może uruchamiać Playwright na tej samej stronie aplikacji, wybierać profil przez `?p=<profileId>`, czekać na render i zapisywać PDF z widoku drukowanego. Oba narzędzia mają korzystać z tego samego HTML, view modelu i `print.css`, bez osobnego szablonu danych PDF.
