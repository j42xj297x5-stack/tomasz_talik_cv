# System personalizacji

## Zakres

System personalizacji rozdziela profil publiczny, publiczną nakładkę firmową i prywatny kontakt. Mechanizmy mogą współdziałać, ale mają osobne źródła danych i osobne znaczenie bezpieczeństwa.

## A. `?p=<profileId>` — profil repozytoryjny

Parametr query `?p=<profileId>` wybiera profil z `content/profiles/*.json`. Brak parametru oznacza `default`. Jeżeli wskazany profil nie istnieje albo nie spełnia minimalnego kontraktu renderowania, aplikacja używa profilu domyślnego i pokazuje komunikat fallback.

Profil repozytoryjny steruje kolejnością sekcji, widocznością sekcji, kolejnością projektów, kolejnością umiejętności i wyróżnionymi umiejętnościami. Nie zawiera prywatnych danych kontaktowych.

## B. `#p=<publiczny-token>` — publiczny profil firmy

Fragment `#p=<token>` wybiera plik `public/profiles/<token>.json`. Plik jest publiczny i wymaga `id` oraz `companyName`; jedynym dodatkowym dozwolonym polem jest opcjonalny string `cvVariant`. Nakładka dodaje nazwę firmy w Hero i może wybierać wariant treści. Nieznany wariant wraca do `gamedev`, zachowując poprawną nazwę firmy.

`#p` nie jest autoryzacją, nie chroni treści i nie zawiera danych prywatnych. Błędny albo brakujący plik powoduje fallback bez nakładki firmowej.

## Wariant treści CV

`cvVariant` przyjmuje `gamedev` lub `it-ai`. Brak pola, brak firmy i nieznana wartość oznaczają Game Dev. Token firmy jest niezależny od identyfikatora wariantu. Stare JSON-y z dwoma polami pozostają poprawne.

Dane nakładek są w `content/variants/`. Moduł `src/app/cv-variant.js` stosuje je po stabilnych ID, bez mutacji bazy, przed lokalizacją i filtrowaniem statusów. Wariant wybiera nagłówek, wstęp, „O mnie”, opisy projektów/doświadczenia oraz nazwy i wagi umiejętności. Wspólne kontakty, wykształcenie, linki i media nie są kopiowane.

Domyślny profil używa kolejności i wyróżnień wariantu. Własny profil repozytoryjny zachowuje ustawienia prezentacji; jawne `cvVariant` firmy ma pierwszeństwo dla nagłówka, kolejności projektów i umiejętności oraz wyróżnień. Widoczność i kolejność sekcji nadal określa profil repozytoryjny.

Zmiana PL/EN ponownie tworzy view model z tym samym wariantem. Druk używa tego samego wyrenderowanego CV przez istniejące `window.print()`; odbiorca nie otrzymuje przełącznika wariantu.

## C. `#k=<prywatny-token>` — prywatny kontakt

Fragment `#k=<token>` służy do pobrania danych kontaktowych z Cloudflare Workera. Token `k` jest niezależny od publicznego `p`. Nie trafia do repozytorium, `localStorage`, cookies ani publicznego JSON-u. Frontend wysyła do Workera tylko wartość `k`.

## `?preview=draft`

`?preview=draft` rozszerza renderowanie o elementy ze statusem `draft`. Bez tego parametru renderowane są tylko elementy `published`; `archived` nie jest renderowany. Podgląd szkicu nie jest mechanizmem ochrony danych.

## Filtrowanie statusów

- `published` — widoczny w normalnym CV.
- `draft` — widoczny wyłącznie w podglądzie szkicu.
- `archived` — pomijany.

## Współdziałanie parametrów

Parametry mogą wystąpić razem, na przykład `?p=default#p=<p>&k=<k>`. Query `p` wybiera profil repozytoryjny. Fragment `p` ładuje nazwę firmy i opcjonalny wariant CV. Fragment `k` pobiera prywatny kontakt. Błąd jednego mechanizmu nie powinien blokować renderowania publicznej treści.

## Zachowanie PDF

PDF używa tego samego view modelu co ekran. Jeżeli prywatny kontakt został pobrany, może być wydrukowany jako część bieżącego widoku. Przed wywołaniem `window.print()` frontend tymczasowo usuwa `k` z fragmentu URL, aby token nie pojawił się w nagłówkach lub stopkach drukowania. Po zdarzeniu `afterprint` oryginalny fragment jest przywracany.
