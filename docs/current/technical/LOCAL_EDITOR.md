# Lokalny edytor profili

## Cel

Lokalny edytor Streamlit w `editor/app.py` pomaga przygotować publiczny profil firmy oraz lokalne treści maila i listu. Edytor działa lokalnie; nie zmienia Workera ani frontendu CV.

## Konfiguracja lokalna

Opcjonalny plik konfiguracyjny ma dokładną lokalizację `editor/config.local.json`, czyli obok `editor/app.py`. Aplikacja wyznacza ścieżkę względem pliku aplikacji, więc uruchomienie z katalogu głównego repozytorium albo z katalogu `editor/` odczytuje ten sam plik.

`editor/config.local.json` jest ignorowany przez Git i nie powinien być commitowany. Przykładowy format znajduje się w `editor/config.example.json`:

```json
{
  "deploymentBaseUrl": "http://localhost:5173/",
  "workerApiBaseUrl": "https://example-worker.example.workers.dev",
  "editorAdminKey": "LOCAL_SECRET_NOT_FOR_GIT"
}
```

Wymagane nazwy pól są dokładnie takie:

* `deploymentBaseUrl` — domyślny adres wdrożonego CV używany do budowy linku po aktywacji tokenu;
* `workerApiBaseUrl` — bazowy adres API Workera;
* `editorAdminKey` — lokalny klucz administracyjny do wywołania endpointu `/admin/create`.

Brak `config.local.json` nie blokuje edytora. Pola formularza pozostają dostępne do ręcznego uzupełnienia, a interfejs pokazuje neutralny status konfiguracji ręcznej. Niepoprawny JSON w pliku konfiguracji jest pokazywany jako czytelny błąd bez ujawniania wartości z pliku.

## Adres Workera

`workerApiBaseUrl` musi być pełnym adresem bazowym zaczynającym się od `https://`; dla środowiska Cloudflare zwykle będzie to `https://...workers.dev`. Edytor nie dopisuje protokołu automatycznie, bo użytkownik musi podać jednoznaczny adres, i nie dopuszcza przekierowania HTTP → HTTPS.

Adres Workera ma być bazowy, bez endpointu `/profile` i bez endpointu `/admin/create`. Edytor usuwa końcowe ukośniki i sam buduje endpoint dokładnie jako `<workerApiBaseUrl>/admin/create` podczas aktywacji prywatnego tokenu. Żądanie blokuje przekierowania, żeby nie wysłać nagłówka `Authorization` do innego hosta.

## Klucz administracyjny

`editorAdminKey` z `config.local.json` jest używany, gdy pole ręczne w formularzu pozostaje puste po `strip()`. Ręcznie wpisana niepusta wartość nadpisuje konfigurację tylko dla bieżącej sesji Streamlit. Puste pole `password` ani starszy stan widgetu z poprzedniej wersji aplikacji nie nadpisują konfiguracji bez wiedzy użytkownika.

Pole ręczne pozostaje polem typu `password`. Edytor nie ustawia klucza z konfiguracji jako jawnej wartości widgetu, nie pokazuje go w interfejsie, komunikatach błędów, logach ani generowanych plikach. Przycisk „Wyczyść ręczne nadpisanie klucza” czyści wyłącznie ręczną wartość bieżącej sesji i nie modyfikuje `config.local.json`.

## Generowanie i aktywacja tokenów

Edytor generuje dwa niezależne tokeny w `st.session_state`: publiczny `p` dla pliku `public/profiles/<p>.json` oraz prywatny `k` używany w linku CV. Tokeny nie są regenerowane przy zwykłym odświeżeniu formularza; nowa para powstaje po kliknięciu „Wygeneruj nowy token”.

Eksportowany JSON profilu zawiera wyłącznie `id` i `companyName`. Prywatny token `k` oraz klucz administracyjny nie trafiają do publicznych danych ani pobieranych plików.

Podczas generowania materiałów edytor sprawdza poprawność `workerApiBaseUrl` i obecność `editorAdminKey` przed wysłaniem żądania. Następnie wykonuje `POST <workerApiBaseUrl>/admin/create` z nagłówkami `Authorization: Bearer <editorAdminKey>`, `Content-Type: application/json`, `Accept: application/json` oraz jawnym `User-Agent: TomaszTalikCVEditor/1.0`. Jawny User-Agent jest elementem zgodności połączenia z Cloudflare i zastępuje domyślny identyfikator klienta `Python-urllib`. Body zawiera tylko prywatny token oraz `expiresAt: null`. Link `#p=<p>&k=<k>` jest pokazywany w mailu i liście dopiero po odpowiedzi `{"ok": true}`.

Przycisk „Ponów aktywację tego samego tokenu” wysyła ponownie bieżący prywatny token `k` bez generowania nowego publicznego tokenu `p` ani nowego `k`.

## Diagnostyka bez sekretów

Interfejs pokazuje tylko niewrażliwe statusy:

* `config.local.json`: znaleziony, brak albo niepoprawny;
* źródło adresu Workera: konfiguracja albo pole ręczne;
* `Adres Workera`: skonfigurowany, brak albo niepoprawny;
* źródło klucza: konfiguracja, pole ręczne albo brak;
* host i ścieżkę endpointu aktywacji bez parametrów;
* długość klucza po `strip()` oraz informację, czy wykryto białe znaki na początku lub końcu;
* ostatni rzeczywisty status HTTP i pole `error` z JSON-a Workera, jeśli istnieje.

Diagnostyka nie pokazuje wartości klucza, nagłówka `Authorization`, prywatnego tokenu `k`, body żądania, zawartości `config.local.json`, ścieżek zawierających dane użytkownika ani pełnych tokenów. Błędy HTTP 401, 403, 404 i 500 mają odrębne komunikaty. Edytor zapisuje niewrażliwy status, `Content-Type`, typ odpowiedzi oraz pole `error` z JSON-a Workera, jeśli istnieje. Odpowiedź `application/json` pokazuje rzeczywiste pole `error`, a `403` z `text/html` jest opisywany jako odrzucenie przez warstwę Cloudflare przed odpowiedzią API, bez pokazywania treści HTML.
