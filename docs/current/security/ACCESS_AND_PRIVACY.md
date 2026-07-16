# Dostęp i prywatność

## Dane publiczne

Wszystko, co znajduje się w repozytorium, publicznych JSON-ach i katalogu `public/`, należy traktować jako publiczne. Dotyczy to również publicznych profili firmowych i zasobów demonstracyjnych. Status `draft` nie chroni danych, ponieważ jest tylko filtrem renderowania.

## Dane prywatne

Prywatne wartości kontaktowe nie są przechowywane w dokumentacji, publicznych JSON-ach ani konfiguracji Pages. Frontend może wyświetlić wyłącznie dane zwrócone przez Workera po użyciu poprawnego tokenu `k`.

## Publiczny profil firmy

Publiczny token `p` wskazuje plik `public/profiles/<p>.json` z polami `id` i `companyName`. Nie jest zabezpieczeniem ani autoryzacją. Każdy opublikowany plik w `public/profiles/` może zostać pobrany publicznie.

## Prywatny token k

`k` jest tokenem typu bearer. Osoba posiadająca link z `#k=<token>` może przekazać go dalej. System nie potwierdza tożsamości odbiorcy i nie wiąże tokenu z konkretną osobą ani urządzeniem.

## Cloudflare Worker

Worker obsługuje prywatny kontakt przez endpoint `POST /profile`. Frontend wysyła do Workera tylko token `k`. Worker zwraca `json.profile`, który frontend sanitizuje do dopuszczonych pól kontaktowych.

## Sekrety

Sekrety Workera nie trafiają do repozytorium. Nazwy sekretów mogą być dokumentowane, ale ich wartości nie mogą być zapisywane. `editorAdminKey` pozostaje lokalny w `editor/config.local.json` albo jako ręczne nadpisanie w bieżącej sesji edytora.

## D1

D1 przechowuje dane operacyjne tokenów w tabeli `access_tokens`. Jawny token `k` nie jest przechowywany; używany jest skrót HMAC-SHA-256. Nazwy firm nie są przechowywane w D1, bo publiczna nazwa firmy pochodzi z `public/profiles/<p>.json`.

## CORS

Worker musi dopuszczać produkcyjny origin GitHub Pages oraz potwierdzone originy lokalne używane do rozwoju. Niepoprawny CORS uniemożliwi pobieranie prywatnego kontaktu z przeglądarki.

## Drukowanie

Przed `window.print()` frontend usuwa `k` z fragmentu URL i przywraca fragment po `afterprint`. Ogranicza to ryzyko wydrukowania tokenu przez przeglądarkę, ale nie zmienia faktu, że token bearer może zostać przekazany w linku.

## Model zagrożeń

Model zakłada publiczny frontend, publiczne zasoby statyczne i tokenowy dostęp do jednego prywatnego profilu kontaktowego. Chronione są wartości prywatnego kontaktu oraz sekrety administracyjne Workera. Nie jest realizowane pełne logowanie użytkownika, potwierdzanie tożsamości odbiorcy ani ochrona treści zapisanych w repozytorium.

## Ograniczenia

- `k` jest przekazywalnym tokenem bearer.
- Publiczne profile firmowe wymagają ręcznego dodania JSON-u i deploymentu.
- Wszystkie zasoby `public/` są publiczne.
- Brak CMS-a; treści są utrzymywane w JSON-ach.
- Edytor nie wysyła maili.
- Prywatne wartości kontaktowe nie mogą zostać zapisane w dokumentacji.
