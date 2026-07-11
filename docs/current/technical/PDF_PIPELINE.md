# Generowanie PDF

## Cel

Dokument definiuje sposób generowania PDF z aktualnie wyrenderowanej wersji CV. Zależy od `docs/current/technical/FRONTEND_ARCHITECTURE.md`, `docs/current/content/CONTENT_MODEL.md` i `docs/current/product/PERSONALIZATION_SYSTEM.md`.

## Zasada główna

PDF powstaje z tego samego HTML, tego samego view modelu i tych samych danych profilu, które renderuje aplikacja webowa. Nie utrzymuje się osobnej kopii treści CV, osobnego szablonu PDF ani list projektów, umiejętności lub sekcji zapisanych specjalnie dla PDF.

## Pierwsza wersja

Pierwsza wersja używa `window.print()` wywoływanego z przycisku „Zapisz jako PDF”. Przeglądarka otwiera natywny podgląd drukowania, a użytkownik zapisuje wynik jako PDF. Nie pobiera się statycznego pliku PDF i aplikacja nie przechowuje ścieżki do statycznego pliku PDF profilu default.

## Widok drukowany

Widok drukowany jest kontrolowany przez CSS, w tym `src/styles/print.css`. Arkusz drukowania ukrywa przyciski akcji, chevrony, elementy interaktywne i pasek fallbacku, usuwa tło strony oraz zbędne cienie, dopasowuje kartę CV do strony wydruku i pokazuje treść wszystkich opublikowanych sekcji wybranych w profilu niezależnie od aktualnego stanu accordionu.

Zmiany widoku drukowanego są deklaratywne w CSS. Normalny stan accordionu w aplikacji nie jest modyfikowany przed drukiem ani po zamknięciu okna drukowania.

## Konfiguracja profilu

Pole `pdf` w profilu jest opcjonalną konfiguracją. Obsługiwane pola to:

* `enabled` — gdy ma wartość `false`, przycisk zapisu PDF nie jest renderowany;
* `includeCompanyMessage` — opcjonalna flaga dla późniejszych decyzji o widoczności komunikatu firmowego w wydruku.

Brak pola `pdf` oznacza domyślnie włączony przycisk zapisu PDF. Pole `pdf` nie przechowuje ścieżki do pliku ani osobnej treści PDF.

## Późniejsza automatyzacja

W kolejnych etapach Streamlit może uruchamiać Playwright na tej samej stronie aplikacji, wybierać profil przez `?p=<profileId>`, czekać na render i zapisywać PDF z widoku drukowanego. Playwright ma korzystać z tego samego HTML i view modelu, bez osobnego szablonu PDF.

## Personalizacja PDF

Profil firmy może zmieniać kolejność i ekspozycję publicznych treści w PDF tak samo jak w aplikacji. Nie może kopiować głównych danych. Prywatne dane w PDF wymagają późniejszego bezpiecznego pobrania z backendu albo osobnego kontrolowanego procesu poza publicznym frontendem.
