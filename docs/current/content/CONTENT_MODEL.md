# Model danych

## Zakres

Źródłem prawdy dla publicznej treści CV są JSON-y w `content/public/`, profile repozytoryjne w `content/profiles/`, publiczne profile firmowe w `public/profiles/` oraz schematy w `content/schemas/`.

## Publiczne pliki treści

- `identity.json` — tożsamość, imię i portret.
- `about.json` — tekst Hero oraz sekcja „O mnie”.
- `projects.json` — projekty i media demonstracyjne.
- `experience.json` — doświadczenie.
- `education.json` — wykształcenie.
- `skills.json` — kategorie i elementy umiejętności.
- `links.json` — pojedyncze źródło publicznych adresów.

Wszystkie te pliki są publiczne po zbudowaniu aplikacji. Nie wolno umieszczać w nich prywatnych danych kontaktowych.

## Profile

`content/profiles/default.json` jest profilem domyślnym używanym bez parametru `?p`. Profile repozytoryjne wybierane przez `?p=<profileId>` muszą spełniać `profile.schema.json`.

Publiczne profile firmowe znajdują się w `public/profiles/<p>.json` i są wybierane przez `#p=<token>`. Kontrakt firmowy wymaga dokładnie pól `id` i `companyName`; nie zawiera danych prywatnych.

## Schematy i walidacja

Schematy używają JSON Schema draft-07. Walidacja działa przez Ajv, `ajv-formats` i skrypt `scripts/validate-content.mjs`, uruchamiany komendą:

```bash
npm run validate:content
```

## `identity`

`identity.portrait.src` wskazuje avatar ekranowy. `identity.portrait.printSrc` wskazuje wariant drukowany używany w PDF, jeżeli jest dostępny.

## `projects`

Każdy projekt ma stabilne `id`, status, tytuł i treść lokalizowaną. `demoMedia` pozwala przypisać medium demonstracyjne do projektu. DIG Engine korzysta z GIF-u `assets/projects/DIG_engine.gif` jako publicznego zasobu demonstracyjnego.

## `skills`

Model umiejętności składa się z:

- `categories` — lista kategorii.
- `items` — lista umiejętności.
- `categoryId` — powiązanie umiejętności z kategorią.
- `inCloud` — decyzja, czy umiejętność trafia do chmury SVG.
- `cloudWeight` — wyróżnienie wizualne w chmurze w zakresie 1–3; nie jest poziomem wiedzy.

Aktualnie używane jest sześć kategorii:

1. Projektowanie i architektura.
2. Orkiestracja AI.
3. Technologie.
4. Grafika, wideo i CAD.
5. Dźwięk i produkcja muzyczna.
6. Kompetencje uzupełniające.

## `links`

`links.json` jest pojedynczym źródłem adresów publicznych, w tym linków używanych przez frontend i edytor. Pole `kind` przyjmuje wartości `profile`, `repository` albo `demo`.

Dla linków demonstracyjnych można podać `projectId` i `projectLabel`. Taka para wiąże demonstrację z projektem i pozwala renderować przy projekcie etykiety typu „Uruchom demo” albo „Otwórz portfolio”. Linki repozytoriów nie używają `projectId` w bieżącym kontrakcie.

## `profile`

Profil repozytoryjny steruje selekcją i kolejnością publicznej treści:

- `sectionOrder` — kolejność sekcji.
- `visibleSections` — sekcje widoczne.
- `projectOrder` — kolejność projektów.
- `skillOrder` — kolejność umiejętności.
- `featuredSkillIds` — umiejętności wyróżnione w Hero.
- `pdf` — opcjonalne ustawienia druku.

## Statusy

`published` jest widoczny normalnie. `draft` jest widoczny tylko w `?preview=draft`. `archived` nie jest renderowany. Status `draft` nie chroni danych, bo zawartość repozytorium i zbudowany pakiet są publiczne.

## Cross-walidacja

`scripts/validate-content.mjs` sprawdza między innymi:

- zgodność plików ze schematami;
- stabilne identyfikatory i duplikaty;
- relacje kategorii i umiejętności;
- relacje linków demonstracyjnych i projektów;
- odwołania profilu do sekcji, projektów i umiejętności;
- zakres `cloudWeight`;
- podejrzane klucze prywatne, takie jak `phone`, `address`, `secret`, `token` i `privateData`.
