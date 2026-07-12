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

`workerApiBaseUrl` musi być pełnym adresem bazowym zaczynającym się od `http://` albo `https://`; dla środowiska Cloudflare zwykle będzie to `https://...workers.dev`. Edytor nie dopisuje protokołu automatycznie, bo użytkownik musi podać jednoznaczny adres.

Adres Workera ma być bazowy, bez endpointu `/profile` i bez endpointu `/admin/create`. Edytor sam dopisuje `/admin/create` podczas aktywacji prywatnego tokenu.

## Klucz administracyjny

`editorAdminKey` z `config.local.json` jest używany, gdy pole ręczne w formularzu pozostaje puste. Ręcznie wpisana niepusta wartość nadpisuje konfigurację tylko dla bieżącej sesji Streamlit.

Pole ręczne pozostaje polem typu `password`. Edytor nie ustawia klucza jako widocznej wartości widgetu, nie pokazuje go w interfejsie, komunikatach błędów, logach ani generowanych plikach. Widoczny jest wyłącznie status: `Klucz administracyjny: wczytany` albo `Klucz administracyjny: brak`.

## Generowanie i aktywacja tokenów

Edytor generuje dwa niezależne tokeny w `st.session_state`: publiczny `p` dla pliku `public/profiles/<p>.json` oraz prywatny `k` używany w linku CV. Tokeny nie są regenerowane przy zwykłym odświeżeniu formularza; nowa para powstaje po kliknięciu „Wygeneruj nowy token”.

Eksportowany JSON profilu zawiera wyłącznie `id` i `companyName`. Prywatny token `k` oraz klucz administracyjny nie trafiają do publicznych danych ani pobieranych plików.

Podczas generowania materiałów edytor sprawdza poprawność `workerApiBaseUrl` i obecność `editorAdminKey` przed wysłaniem żądania. Następnie wykonuje `POST <workerApiBaseUrl>/admin/create` z nagłówkiem `Authorization: Bearer <editorAdminKey>` i body zawierającym tylko prywatny token oraz `expiresAt: null`. Link `#p=<p>&k=<k>` jest pokazywany w mailu i liście dopiero po odpowiedzi `{"ok": true}`.

## Diagnostyka bez sekretów

Interfejs pokazuje tylko niewrażliwe statusy:

* `config.local.json`: znaleziony, brak albo niepoprawny;
* `Adres Workera`: skonfigurowany, brak albo niepoprawny;
* `Klucz administracyjny`: wczytany albo brak.

Diagnostyka nie pokazuje ścieżek zawierających dane użytkownika, wartości sekretów ani pełnych tokenów.
