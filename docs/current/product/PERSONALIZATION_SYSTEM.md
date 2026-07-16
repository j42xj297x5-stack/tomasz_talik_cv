# System personalizacji

## Zakres

System personalizacji rozdziela profil publiczny, publiczną nakładkę firmową i prywatny kontakt. Mechanizmy mogą współdziałać, ale mają osobne źródła danych i osobne znaczenie bezpieczeństwa.

## A. `?p=<profileId>` — profil repozytoryjny

Parametr query `?p=<profileId>` wybiera profil z `content/profiles/*.json`. Brak parametru oznacza `default`. Jeżeli wskazany profil nie istnieje albo nie spełnia minimalnego kontraktu renderowania, aplikacja używa profilu domyślnego i pokazuje komunikat fallback.

Profil repozytoryjny steruje kolejnością sekcji, widocznością sekcji, kolejnością projektów, kolejnością umiejętności i wyróżnionymi umiejętnościami. Nie zawiera prywatnych danych kontaktowych.

## B. `#p=<publiczny-token>` — publiczny profil firmy

Fragment `#p=<token>` wybiera plik `public/profiles/<token>.json`. Plik jest publiczny i zawiera dokładnie `id` oraz `companyName`. Nakładka dodaje nazwę firmy w Hero jako informację kontekstową.

`#p` nie jest autoryzacją, nie chroni treści i nie zawiera danych prywatnych. Błędny albo brakujący plik powoduje fallback bez nakładki firmowej.

## C. `#k=<prywatny-token>` — prywatny kontakt

Fragment `#k=<token>` służy do pobrania danych kontaktowych z Cloudflare Workera. Token `k` jest niezależny od publicznego `p`. Nie trafia do repozytorium, `localStorage`, cookies ani publicznego JSON-u. Frontend wysyła do Workera tylko wartość `k`.

## `?preview=draft`

`?preview=draft` rozszerza renderowanie o elementy ze statusem `draft`. Bez tego parametru renderowane są tylko elementy `published`; `archived` nie jest renderowany. Podgląd szkicu nie jest mechanizmem ochrony danych.

## Filtrowanie statusów

- `published` — widoczny w normalnym CV.
- `draft` — widoczny wyłącznie w podglądzie szkicu.
- `archived` — pomijany.

## Współdziałanie parametrów

Parametry mogą wystąpić razem, na przykład `?p=default#p=<p>&k=<k>`. Query `p` wybiera profil repozytoryjny. Fragment `p` dodaje nazwę firmy. Fragment `k` pobiera prywatny kontakt. Błąd jednego mechanizmu nie powinien blokować renderowania publicznej treści.

## Zachowanie PDF

PDF używa tego samego view modelu co ekran. Jeżeli prywatny kontakt został pobrany, może być wydrukowany jako część bieżącego widoku. Przed wywołaniem `window.print()` frontend tymczasowo usuwa `k` z fragmentu URL, aby token nie pojawił się w nagłówkach lub stopkach drukowania. Po zdarzeniu `afterprint` oryginalny fragment jest przywracany.
