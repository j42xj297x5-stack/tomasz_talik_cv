# Model treści

## Cel

Dokument jest źródłem prawdy dla organizacji danych JSON. Zależy od decyzji ogólnych z `docs/current/README.md` i jest używany przez dokumenty o personalizacji, PDF, edytorze lokalnym i frontendzie.

## Struktura plików

Kanoniczne dane publiczne są rozdzielone według obszarów:

```text
content/public/identity.json     # podstawowa tożsamość publiczna
content/public/about.json        # publiczne teksty opisowe
content/public/projects.json     # projekty i ich relacje do umiejętności
content/public/experience.json   # publiczne doświadczenie, bez danych niepotwierdzonych
content/public/skills.json       # umiejętności
content/public/links.json        # publiczne linki
content/profiles/default.json    # bezpieczny profil awaryjny
content/schemas/*.schema.json    # kontrakt JSON Schema
scripts/validate-content.mjs     # walidacja schematów i relacji
```

Dane publiczne mogą być zbundlowane lub pobrane przez statyczny frontend. Obejmują wyłącznie informacje, które mogą być publicznie widoczne. Dane prywatne nie mogą być zapisane w publicznym JSON, HTML ani JavaScript.

## Model językowy

Teksty przechowuje się jako obiekty językowe:

```json
{
  "pl": "tekst wymagany",
  "en": "opcjonalny tekst"
}
```

Pole `pl` jest wymagane, a `en` jest opcjonalne. Dodanie języka nie może wymagać zmiany identyfikatorów.

## Stabilne identyfikatory

Każdy element wybierany przez profil musi mieć trwały identyfikator niezależny od późniejszej zmiany tytułu. `stableId` używa wyłącznie małych liter, cyfr i myślników, np. `project-haiku-cosmos` albo `skill-javascript`.

`profileId` akceptuje `default` albo identyfikator firmy w formacie `p_<losowy_ciag>`. Kolejność sekcji, projektów i umiejętności jest zapisywana jako tablica identyfikatorów.

## Status elementów

Elementy treści mają status:

* `draft` — informacja robocza lub niepełna;
* `published` — informacja gotowa do publicznego użycia;
* `archived` — informacja historyczna niewyświetlana domyślnie.

Niepotwierdzone elementy należy pominąć albo oznaczyć jako `draft`.

## Profile firm

Profil może definiować wyłącznie pola:

* `profileId`;
* `company`;
* `targetRole`;
* `headline`;
* `companyMessage`;
* `accent`;
* `sectionOrder`;
* `visibleSections`;
* `projectOrder`;
* `featuredProjectIds`;
* `skillOrder`;
* `featuredSkillIds`;
* `pdf`;
* `protectedScopes`.

Profil nie może kopiować ani nadpisywać opisów projektów, doświadczenia lub umiejętności. Wiadomość `companyMessage` jest lokalizowana; dla profili innych niż `default` polski wariant musi mieć 300–500 znaków. `protectedScopes` zawiera wyłącznie nazwy zakresów, np. `phone`, i nie przechowuje prywatnych wartości.

## Profil default

`content/profiles/default.json` jest bezpiecznym profilem awaryjnym używanym przy braku parametru `?p=<profileId>`. Może nie mieć `companyMessage` i musi wskazywać wyłącznie istniejące identyfikatory projektów, umiejętności oraz sekcji.

## Ścieżki zasobów

Ścieżki zasobów są zapisywane względem katalogu `public/`, bez początkowego ukośnika, domeny i ścieżki GitHub Pages, np.:

* `assets/projects/haiku-cosmos/cover.webp`;
* `assets/companies/p_7m4k2x/logo.webp`;
* `cv/default.pdf`.

Dzięki temu dane pozostają niezależne od domeny i `BASE_URL`.

## Walidacja

Walidację uruchamia się poleceniem:

```bash
npm run validate:content
```

Walidator używa Ajv i `ajv-formats`, sprawdza zgodność plików z JSON Schema, duplikaty identyfikatorów, relacje profili do projektów i umiejętności, duplikaty w tablicach kolejności, nieistniejące sekcje, niedozwolone pola profilu, ścieżki zasobów, podejrzane klucze (`phone`, `address`, `secret`, `token`, `privateData`) oraz długość `companyMessage` dla profili firmowych. Przy błędzie kończy działanie kodem `1`, a przy sukcesie kodem `0`.

## Zależności

* Personalizacja korzysta z tego modelu w `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Edytor Streamlit ma walidować ten model zgodnie z `docs/current/technical/LOCAL_EDITOR.md`.
* PDF renderuje te same dane zgodnie z `docs/current/technical/PDF_PIPELINE.md`.
