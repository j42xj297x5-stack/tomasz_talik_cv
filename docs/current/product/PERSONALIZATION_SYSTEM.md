# System personalizacji

## Cel

Dokument opisuje aktualnie zaimplementowany wybór profilu i redakcyjny podgląd szkiców w jednej statycznej aplikacji.

## Model jednej aplikacji

Personalizacja działa w jednej aplikacji Vite i na jednym katalogu publicznych treści JSON. Nie powstają osobne kopie CV dla firm. Profil jest publiczną konfiguracją prezentacji danych.

## Publiczny profil przez URL

Profil wybiera parametr:

```text
?p=<profileId>
```

Brak parametru oznacza profil `default`. Nieistniejący lub nieużywalny profil wraca do `default` i pokazuje komunikat fallbacku nad kartą CV.

## Tryb roboczy

Redakcyjny podgląd szkiców uruchamia parametr:

```text
?preview=draft
```

Można go łączyć z profilem:

```text
?p=default&preview=draft
```

Bez `preview` renderowane są wyłącznie elementy `published`. W `?preview=draft` renderowane są `published` oraz `draft`. Elementy `archived` pozostają niewidoczne w obu trybach, a puste sekcje nie są renderowane.

`?preview=draft` jest narzędziem redakcyjnym. Nie jest zabezpieczeniem dostępu i nie zapewnia prywatności, ponieważ publiczne JSON-y są częścią frontendu.

## Co może zmieniać profil

Aktualny profil może wpływać na:

* kolejność sekcji;
* widoczność sekcji;
* kolejność projektów;
* kolejność umiejętności;
* wyróżnione umiejętności w Hero;
* opcjonalną konfigurację przycisku PDF.

Profil nie kopiuje treści CV, nie przechowuje prywatnych danych i nie renderuje obecnie osobnej sekcji kontaktowej.

## Język

Globalny przełącznik PL/EN działa w obrębie wyrenderowanego profilu. Zmienia lokalizowane treści, oznaczenia `Szkic` / `Draft` i aktualizuje `document.documentElement.lang`.

## PDF

PDF korzysta z tego samego profilu, HTML i view modelu co strona. Przy `?preview=draft` wydruk zawiera również szkice, lecz znaczniki szkiców są ukryte w stylach druku.

## Bezpieczeństwo

Tokeny, kody i parametry URL nie chronią danych zapisanych w publicznym frontendzie. Dane prywatne mogą być obsłużone dopiero przez przyszły backend i właściwą autoryzację; backend nie jest obecnie zaimplementowany.

## Minimalna nakładka firmowa przez fragment URL

Niezależnie od `?p=<profileId>` aplikacja może odczytać fragment `#p=<długi-token>`. Poprawny token wskazuje publiczny plik `public/profiles/<token>.json`, który zawiera wyłącznie `id` i `companyName`. Nazwa firmy jest łączona z wcześniej rozwiązanym profilem, więc token firmowy nie zastępuje profilu `default` ani profilu wybranego przez `?p=`. Brak pliku, błędny token lub niepoprawny JSON uruchamia zwykły fallback i nie blokuje CV. Token nie jest autoryzacją ani ochroną danych.

## Prywatny token kontaktowy

Fragment może mieć postać `#p=<publiczny-token-profilu>&k=<prywatny-token-dostępu>`. `p` pozostaje publicznym identyfikatorem pliku `public/profiles/<p>.json` i służy wyłącznie do pokazania nazwy firmy. `k` jest niezależnym tokenem sprawdzanym przez Worker i nie jest zapisywany w publicznym JSON-ie ani repozytorium. Bez poprawnego `k` CV działa publicznie bez danych kontaktowych. Worker zwraca jeden stały zestaw danych kontaktowych dla wszystkich aktywnych tokenów, bez zapisywania nazw firm w D1.
