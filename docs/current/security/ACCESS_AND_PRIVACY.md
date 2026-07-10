# Dostęp i prywatność

## Cel

Dokument jest źródłem prawdy dla rozdzielenia danych publicznych i prywatnych. Zależy od `docs/current/content/CONTENT_MODEL.md` i ogranicza system personalizacji opisany w `docs/current/product/PERSONALIZATION_SYSTEM.md`.

## Dane publiczne

Wszystko, co znajduje się w publicznym frontendzie, należy traktować jako publiczne. Dotyczy to plików HTML, JavaScript, CSS, JSON, zasobów w `public/` oraz wygenerowanych statycznych artefaktów.

## Dane prywatne

Dane prywatne nie mogą być zapisane w repozytorium jako część publicznego frontendu ani w statycznych plikach hostowanych przez GitHub Pages. Prywatne dane będą później pobierane z zewnętrznego backendu, np. funkcji serverless lub innej usługi API.

## Token i kod

`#t=<token>` oraz zapasowy kod 6–8 znaków nie chronią danych, które już są zapisane w publicznym frontendzie. Mogą służyć do wyboru profilu, wygody użytkownika albo przyszłej wymiany z backendem, ale nie są samodzielnym zabezpieczeniem statycznych danych.

## Publiczne profile

Profil dostępny przez `?p=<profileId>` jest publiczną konfiguracją prezentacji. Nie może zawierać prywatnych danych kontaktowych ani sekretów. Jeśli profil ma odblokować dane prywatne, musi jedynie inicjować późniejszy przepływ pobrania ich z backendu.

## Zależności

* Model publicznych danych opisuje `docs/current/content/CONTENT_MODEL.md`.
* Mechanikę profili opisuje `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Deployment statyczny opisuje `docs/current/technical/DEPLOYMENT.md`.

