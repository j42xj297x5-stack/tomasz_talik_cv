# Model treści

## Cel

Dokument opisuje aktualny model publicznych danych JSON pierwszego roboczego przekroju aplikacji. Źródłem prawdy pozostają aktualne pliki `content/`, schematy oraz walidator.

## Publiczne obszary danych

Aktualnie ładowane publiczne dane to:

```text
content/public/identity.json     # tożsamość, imię i nazwisko, opcjonalny portret
content/public/about.json        # krótki opis Hero i treść sekcji O mnie
content/public/projects.json     # projekty
content/public/experience.json   # doświadczenie
content/public/education.json    # wykształcenie
content/public/skills.json       # płaska lista umiejętności
content/public/links.json        # publiczne linki używane w akcjach Hero
content/profiles/default.json    # profil default
content/schemas/*.schema.json    # kontrakt danych JSON
scripts/validate-content.mjs     # walidator schematów i relacji
```

`docs/current/content/FIRST_PUBLIC_CV_CONTENT.md` pozostaje kanonicznym dokumentem treści CV. Dokumenty architektoniczne nie kopiują pełnej treści CV.

## Stos danych i walidacja

Frontend importuje publiczne JSON-y przez moduły Vite, a profile przez `import.meta.glob`. Schematy obejmują między innymi `identity.schema.json`, `about.schema.json`, `projects.schema.json`, `experience.schema.json`, `education.schema.json`, `skills.schema.json`, `links.schema.json` i `profile.schema.json`.

Walidację uruchamia polecenie:

```bash
npm run validate:content
```

Walidator używa Ajv i `ajv-formats`, sprawdza zgodność plików ze schematami, identyfikatory, relacje profili do danych, duplikaty, niedozwolone pola profilu, ścieżki zasobów i podejrzane prywatne klucze.

## Model językowy

Teksty lokalizowane są przechowywane jako obiekty językowe z polskim wariantem podstawowym i opcjonalnym angielskim:

```json
{
  "pl": "tekst wymagany",
  "en": "opcjonalny tekst"
}
```

Przełącznik PL/EN zmienia widoczne lokalizowane treści oraz oznaczenia szkiców.

## Status elementów

Kontrakt renderowania statusów:

* bez parametru `preview` renderowane są wyłącznie elementy `published`;
* `?preview=draft` renderuje `published` oraz `draft`;
* `archived` pozostaje niewidoczne w obu trybach;
* sekcje puste po filtrowaniu nie są renderowane.

Statusy oznaczają:

* `draft` — treść robocza, widoczna tylko w redakcyjnym `?preview=draft`;
* `published` — treść widoczna w zwykłym publicznym renderze;
* `archived` — treść historyczna niewidoczna w aktualnym renderze.

`?preview=draft` nie jest zabezpieczeniem dostępu i nie zapewnia prywatności. Dane zapisane w publicznych JSON-ach należy traktować jako publiczne niezależnie od statusu.

## Profil default i personalizacja

`content/profiles/default.json` jest profilem używanym przy braku `?p=`. Profil kontroluje kolejność i widoczność sekcji, kolejność projektów, kolejność umiejętności i wyróżnione umiejętności. Tryb redakcyjny można łączyć z profilem, np.:

```text
?p=default&preview=draft
```

Aktualnie zaimplementowane sekcje profilu to O mnie, Projekty, Doświadczenie, Wykształcenie i Umiejętności. `contact` może występować w konfiguracji profilu, ale aktualny kod nie renderuje osobnej sekcji kontaktowej.

## Hero, linki i avatar

`identity.json` przechowuje imię i nazwisko oraz opcjonalny `portrait`. Obecny avatar jest wskazywany jako `assets/identity/tomasz-talik-avatar.webp`, co odpowiada plikowi `public/assets/identity/tomasz-talik-avatar.webp`. `links.json` dostarcza publiczny link renderowany jako akcja Hero po przejściu filtrowania statusów. Brak portretu nie tworzy pustej kolumny ani placeholdera.

## Umiejętności

Aktualna lista umiejętności pozostaje płaska. Wynika to z obecnego `skills.schema.json` oraz danych `skills.json`, które opisują elementy jako pojedyncze pozycje bez kategorii, grup i opisów. Kolejność prezentacji pochodzi z profilu.

## PDF

Konfiguracja `pdf` w profilu jest opcjonalna i nie wskazuje osobnego pliku. PDF powstaje przez `window.print()` z tego samego HTML, danych i view modelu co strona. Przy `?preview=draft` wydruk zawiera również szkice, ale znaczniki `Szkic` / `Draft` są ukrywane.

## Prywatność

Prywatne dane i sekrety nie mogą trafiać do publicznych JSON-ów, profili, kodu frontendu ani zasobów statycznych. Status `draft` nie chroni danych.
