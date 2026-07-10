# Architektura frontendu

## Cel

Dokument definiuje architekturę aplikacji webowej przed implementacją. Źródłami prawdy są `docs/current/README.md`, `docs/current/content/CONTENT_MODEL.md`, `docs/current/product/PERSONALIZATION_SYSTEM.md` i `docs/current/ui/SINGLE_PAGE_FLOW.md`.

## Stos technologiczny

Aplikacja jest pojedynczą stroną Vite z:

* Vanilla JavaScript;
* HTML generowanym lub składanym bez frameworka frontendowego;
* CSS, w tym osobnym stylem druku `print.css`;
* publicznymi danymi JSON.

Nie wolno uzależniać dokumentacji ani architektury od Reacta, Vue, Svelte, Angulara lub innego frameworka frontendowego.

## Model aplikacji

Projekt ma jedną aplikację, jeden katalog treści i wiele profili firm. Aplikacja ładuje publiczne dane bazowe oraz profil wskazany przez adres URL. Profil wpływa na wybór, kolejność i ekspozycję treści, ale nie zastępuje głównej bazy treści.

## Rzeczywista struktura pierwszego pionowego przekroju

```text
index.html
vite.config.js
src/
  main.js
  app/
    bootstrap.js
    content-loader.js
    profile-resolver.js
    view-model.js
  components/
    accordion.js
    hero-card.js
  sections/
    about-section.js
    projects-section.js
  styles/
    tokens.css
    base.css
    layout.css
    components.css
    accordion.css
    themes.css
  utils/
    assets.js
    dom.js
content/
  public/
  profiles/
scripts/
docs/
```

Pierwszy przekrój ładuje kanoniczne dane z `content/public/*.json` przez importy modułów JSON i profile z `content/profiles/*.json` przez `import.meta.glob`. Dane nie są kopiowane do `src/`.

## Routing i stan

* `?p=<profileId>` wybiera publiczny profil firmy.
* Otwarty panel UI jest częścią stanu aplikacji; jednocześnie otwarty może być tylko jeden panel.

## Motyw

Wersja startowa używa wyłącznie `prefers-color-scheme` i zmiennych CSS. Nie ma ręcznego przełącznika motywu.

## Zależności

* Dane i identyfikatory opisuje `docs/current/content/CONTENT_MODEL.md`.
* Profile i tokeny opisuje `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Ograniczenia bezpieczeństwa opisuje `docs/current/security/ACCESS_AND_PRIVACY.md`.
* Widok drukowany opisuje `docs/current/technical/PDF_PIPELINE.md`.

