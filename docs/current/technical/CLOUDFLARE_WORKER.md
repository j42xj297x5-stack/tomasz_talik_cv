# Cloudflare Worker — kontrakt zewnętrzny

## Zakres

Źródło Workera nie znajduje się w tym repozytorium. Ten dokument opisuje zewnętrzny kontrakt na podstawie klienta frontendu, edytora Streamlit i potwierdzonej konfiguracji.

## Adres i zasoby

- Publiczny adres: `https://withered-leaf-cf6b.tapchanbuddha.workers.dev`
- Binding D1: `DB`
- Tabela D1: `access_tokens`

## Sekrety i zmienne

Worker używa nazw:

- `PRIVATE_PROFILE_JSON`
- `TOKEN_PEPPER`
- `EDITOR_ADMIN_KEY`
- `ALLOWED_ORIGINS`

Wartości sekretów nie są częścią dokumentacji ani repozytorium.

## Tokeny

Token prywatny `k` jest tokenem bearer. Worker haszuje tokeny z użyciem HMAC-SHA-256 i `TOKEN_PEPPER`, więc jawne `k` nie jest przechowywane w D1. Aktywny token daje dostęp do jednego stałego profilu prywatnego z `PRIVATE_PROFILE_JSON`. Rekordy mogą mieć `expiresAt`; token może zostać aktywowany i unieważniony.

## CORS

Dozwolony origin produkcyjny to `https://j42xj297x5-stack.github.io`. Lokalne originy mogą być dopuszczone wyłącznie wtedy, gdy są wpisane w potwierdzonej konfiguracji `ALLOWED_ORIGINS`. Frontend Pages i Worker są osobnymi originami, dlatego CORS jest wymagany dla `POST /profile`.

## `GET /health`

- Przeznaczenie: diagnostyka dostępności Workera.
- Metoda: `GET`.
- Nagłówki: standardowe nagłówki przeglądarki lub narzędzia diagnostycznego; bez autoryzacji.
- Request: bez ciała.
- Odpowiedź: ogólny JSON statusowy, zwykle z informacją `ok`.
- Typowe błędy: `404` dla złej ścieżki, `5xx` dla błędu Workera.
- Dostęp: publiczny.

## `POST /profile`

- Przeznaczenie: pobranie prywatnego profilu kontaktowego dla aktywnego tokenu.
- Metoda: `POST`.
- Nagłówki: `Content-Type: application/json`; przeglądarka wymaga poprawnego CORS.
- Request: JSON z polem `token` zawierającym `k`.
- Odpowiedź sukcesu:

```json
{
  "ok": true,
  "profile": { }
}
```

Frontend przetwarza wyłącznie `json.profile` i dopuszcza pola kontaktowe obsługiwane przez klienta.

- Typowe błędy: brak tokenu, nieaktywny token, wygasły token, niepoprawny JSON, błąd CORS, `5xx`.
- Dostęp: tokenowy.

## `POST /admin/create`

- Przeznaczenie: aktywacja tokenu prywatnego, także ponowna aktywacja tego samego tokenu.
- Metoda: `POST`.
- Nagłówki: `Authorization: Bearer <editorAdminKey>`, `Content-Type: application/json`, `Accept: application/json`, jawny `User-Agent` edytora.
- Request: JSON z `token` oraz `expiresAt`, gdzie `expiresAt` może być `null`.
- Odpowiedź: JSON potwierdzający powodzenie operacji.
- Typowe błędy: `401` brak lub błędny klucz, `403` odmowa, `404` zły endpoint, `500` błąd Workera, odpowiedź HTML z warstwy Cloudflare.
- Dostęp: administracyjny.

## `POST /admin/revoke`

- Przeznaczenie: unieważnienie aktywnego tokenu.
- Metoda: `POST`.
- Nagłówki: `Authorization: Bearer <editorAdminKey>`, `Content-Type: application/json`, `Accept: application/json`.
- Request: JSON identyfikujący token do unieważnienia.
- Odpowiedź: JSON potwierdzający unieważnienie albo informację o braku aktywnego tokenu.
- Typowe błędy: `401`, `403`, zły JSON, nieistniejący token, `5xx`.
- Dostęp: administracyjny.
