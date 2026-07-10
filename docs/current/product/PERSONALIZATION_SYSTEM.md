# System personalizacji

## Cel

Dokument definiuje sposób wyboru profili firm i zależy od `docs/current/content/CONTENT_MODEL.md` oraz `docs/current/security/ACCESS_AND_PRIVACY.md`.

## Model jednej aplikacji

Personalizacja działa w jednej aplikacji i na jednym katalogu treści. Nie powstają oddzielne kopie CV dla każdej firmy. Każdy profil firmy jest konfiguracją sposobu prezentacji publicznych danych.

## Publiczny profil przez URL

Publiczny profil jest wybierany przez parametr:

```text
?p=<profileId>
```

`profileId` wskazuje profil zapisany w publicznych danych. Brak parametru oznacza profil domyślny.

## Token i kod

Długi token może być przekazany we fragmencie adresu:

```text
#t=<token>
```

Fragment URL nie jest wysyłany standardowo do serwera statycznego hostingu, ale jest dostępny dla JavaScriptu w przeglądarce. Zapasowy kod 6–8 znaków może być wpisywany ręcznie przez użytkownika i mapowany na profil lub przyszłą autoryzację backendową.

## Ograniczenie bezpieczeństwa

Token i krótki kod nie chronią danych zapisanych w publicznym frontendzie. Jeśli dane znajdują się w publicznym HTML, JS, CSS lub JSON, należy traktować je jako publiczne. Prywatne dane będą później pobierane z zewnętrznego backendu po właściwej autoryzacji.

## Co może zmieniać profil

Profil może zmieniać:

* kolejność sekcji;
* eksponowane projekty;
* kolejność umiejętności;
* krótką wiadomość do firmy na głównej karcie;
* wariant nagłówków lub akcentów;
* publiczną wersję danych do PDF.

Profil nie może duplikować głównych danych ani przechowywać danych prywatnych.

## Wiadomość do firmy

Na głównej karcie może pojawić się krótka wiadomość do firmy. Jej długość kanoniczna to 300–500 znaków. Treść jest publiczna, jeśli profil jest publiczny.

## Zależności

* Identyfikatory i brak duplikacji opisuje `docs/current/content/CONTENT_MODEL.md`.
* Zasady prywatności opisuje `docs/current/security/ACCESS_AND_PRIVACY.md`.
* Prezentację na stronie opisuje `docs/current/ui/SINGLE_PAGE_FLOW.md`.

