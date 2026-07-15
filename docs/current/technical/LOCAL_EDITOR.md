# Lokalny edytor profili

## Cel

Lokalny edytor Streamlit w `editor/app.py` pomaga przygotować publiczny profil firmy, aktywować prywatny token `k` w Workerze oraz wygenerować lokalne treści maila i listu. Edytor działa lokalnie; nie zmienia kodu Workera ani treści CV.

## Konfiguracja

Edytor ładuje konfigurację względem `editor/app.py`: najpierw publiczny `editor/config.defaults.json`, a następnie opcjonalny, ignorowany przez Git `editor/config.local.json`. Wartości z `config.local.json` mają pierwszeństwo. Brak `config.local.json` nie blokuje edytora, ale bez `editorAdminKey` aktywacja tokenu jest niemożliwa i kończy się czytelnym komunikatem.

`editor/config.defaults.json` jest śledzonym publicznym plikiem ze stałymi infrastrukturalnymi:

```json
{
  "deploymentBaseUrl": "https://j42xj297x5-stack.github.io/tomasz_talik_cv/",
  "workerApiBaseUrl": "https://withered-leaf-cf6b.tapchanbuddha.workers.dev"
}
```

`editor/config.local.json` powinien zawierać lokalny sekret i nie trafiać do Git. Przykład w `editor/config.example.json`:

```json
{
  "editorAdminKey": "LOCAL_SECRET_NOT_FOR_GIT"
}
```

Opcjonalnie można lokalnie nadpisać `deploymentBaseUrl` albo `workerApiBaseUrl`, ale nie jest to wymagane w normalnej pracy.

## Widok

Główny formularz pokazuje tylko pola aplikacyjne: język, nazwę firmy, stanowisko, imię rekrutera, adres ogłoszenia, tekst uzasadnienia, wybór linków i rodzaj generowanej wiadomości. Adres CV, adres Workera i ręczne nadpisanie klucza są ukryte w domyślnie zamkniętym panelu `Konfiguracja techniczna`.

Panel techniczny pokazuje docelowy adres CV, bazowy adres Workera, pole hasła do ręcznego nadpisania klucza oraz bezpieczną diagnostykę. Publiczne adresy są domyślnie wypełnione z `config.defaults.json`, a niepuste ręczne wartości nadpisują je tylko w bieżącej sesji. Edytor nigdy nie pokazuje wartości klucza z `config.local.json`; przycisk „Wyczyść ręczne nadpisanie klucza” czyści wyłącznie ręczne nadpisanie sesji.

## Generowanie i aktywacja

Edytor generuje publiczny token `p` dla `public/profiles/<p>.json` oraz prywatny token `k` dla Workera. Domyślny link ma postać `https://j42xj297x5-stack.github.io/tomasz_talik_cv/#p=<p>&k=<k>`. Publiczny JSON profilu zawiera wyłącznie `id` i `companyName`; `k`, klucz administracyjny i dane prywatne nie trafiają do publicznego JSON-u.

`workerApiBaseUrl` musi być bazowym adresem HTTPS bez `/profile` i bez `/admin/create`; edytor sam buduje endpoint `<workerApiBaseUrl>/admin/create`. Body aktywacji zawiera tylko prywatny token oraz `expiresAt: null`.

## Diagnostyka bez sekretów

Diagnostyka pokazuje wyłącznie statusy: `config.defaults.json` znaleziony/brak/niepoprawny, `config.local.json` znaleziony/brak/niepoprawny, adres produkcyjny skonfigurowany/brak, Worker skonfigurowany/brak/niepoprawny oraz klucz administracyjny wczytany/brak. Nie pokazuje sekretów, tokenów ani zawartości plików konfiguracyjnych.

## Aktualizacja: demonstracje i publiczne odnośniki

- Edytor grupuje publiczne odnośniki z `content/public/links.json` według pola `kind`: „Demo projektów” (`demo`) oraz „GitHub i repozytoria” (`profile`, `repository`). `content/public/projects.json` nie jest już źródłem list odnośników w edytorze.
- Grupa „Demo projektów” zawiera wdrożenia Haiku Cosmos i Interactive AI Portfolio oraz publiczny GIF DIG Engine w CV; grupa „GitHub i repozytoria” zawiera profil GitHub i publiczne repozytoria bez demonstracji. Repozytorium DIG Engine pozostaje prywatne.
- Karta DIG Engine zawiera osadzoną animowaną miniaturę GIF pod opisem. Miniatura otwiera pełnoekranowy dialog obsługujący Escape, kliknięcie tła i przycisk zamknięcia.
- Demonstracja DIG Engine jest całkowicie ukrywana w PDF; pozostała treść projektu drukuje się jak dotychczas.
