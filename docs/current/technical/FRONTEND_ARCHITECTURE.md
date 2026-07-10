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

## Minimalna struktura

```text
src/
  main.js
  state/
  rendering/
  routing/
  styles/
content/
  pl/
  profiles/
public/
editor/
scripts/
docs/
tests/
```

Nazwy katalogów mogą zostać doprecyzowane podczas implementacji, ale podział odpowiedzialności pozostaje obowiązujący.

## Routing i stan

* `?p=<profileId>` wybiera publiczny profil firmy.
* `#t=<token>` może przenosić długi token dostępu do danych pobieranych później z backendu.
* Zapasowy kod 6–8 znaków służy jako wygodna alternatywa wpisywana ręcznie.
* Otwarty panel UI jest częścią stanu aplikacji; jednocześnie otwarty może być tylko jeden panel.

## Motyw

Wersja startowa używa `prefers-color-scheme`. Później aplikacja może zapisać ręczny wybór motywu użytkownika. Ręczny wybór, jeśli istnieje, ma mieć pierwszeństwo przed ustawieniem systemowym.

## Zależności

* Dane i identyfikatory opisuje `docs/current/content/CONTENT_MODEL.md`.
* Profile i tokeny opisuje `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Ograniczenia bezpieczeństwa opisuje `docs/current/security/ACCESS_AND_PRIVACY.md`.
* Widok drukowany opisuje `docs/current/technical/PDF_PIPELINE.md`.

