# Dostęp i prywatność

## Cel

Dokument rozdziela aktualne dane publiczne od prywatnych oraz wyjaśnia ograniczenia statycznego frontendu.

## Dane publiczne

Wszystkie dane umieszczone w publicznych JSON-ach należy traktować jako publiczne. Dotyczy to `content/public/identity.json`, `about.json`, `projects.json`, `experience.json`, `education.json`, `skills.json`, `links.json` oraz publicznych profili. Zasoby statyczne w `public/`, w tym avatar, również są publiczne.

Status `draft` nie chroni danych. `?preview=draft` jest narzędziem redakcyjnym, nie zabezpieczeniem dostępu i nie mechanizmem prywatności.

## Dane prywatne i sekrety

Prywatne dane, sekrety, tokeny usług, prywatne adresy, telefony lub inne informacje wymagające ograniczenia dostępu nie mogą trafiać do frontendu, publicznych JSON-ów, profili, CSS, JavaScriptu ani zasobów statycznych.

Jeśli w przyszłości aplikacja ma obsługiwać prywatne dane, musi pobierać je z zewnętrznego backendu po właściwej autoryzacji. Backend nie jest obecnie zaimplementowany.

## Parametry URL

`?p=<profileId>` wybiera publiczny profil prezentacji. `?preview=draft` pokazuje robocze wpisy zapisane już w publicznych JSON-ach. `#t=<token>` lub krótki kod mogą w przyszłości służyć do wygody użytkownika albo przepływu backendowego, ale nie chronią danych statycznie umieszczonych we frontendzie.

## Linki publiczne

Aktualny frontend może renderować publiczny link GitHub w Hero. Prywatne repozytorium DIG Engine nie jest linkowane w CV i nie powinno być dodawane jako publiczny link bez świadomej decyzji.

## Deployment

Brak produkcyjnego deploymentu nie zmienia modelu prywatności: wszystko, co znajduje się w publicznym frontendzie i zasobach statycznych, należy traktować jako publiczne już na etapie przygotowania.

## Tokeny firmowe

Fragment `#p=<długi-token>` jest wyłącznie publicznym identyfikatorem pliku profilu firmowego w `public/profiles/`. Długi, nieodgadywalny token ogranicza przypadkowe zgadywanie linku, ale nie jest autoryzacją, zabezpieczeniem ani gwarancją prywatności. Profil firmowy jest statycznym publicznym JSON-em i zawiera tylko token oraz nazwę firmy. Dane rekrutera, stanowisko, adres ogłoszenia, mail i list motywacyjny pozostają lokalne w edytorze i nie trafiają do publicznego JSON-u.
