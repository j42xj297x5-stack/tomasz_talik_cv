# Architektura frontendu

## Zakres

Frontend jest statyczną aplikacją Vite + Vanilla JavaScript + CSS. Nie używa Reacta, Vue, Svelte ani Angulara. Zewnętrzny Cloudflare Worker jest częścią systemu prywatnego kontaktu, ale nie jest częścią kodu frontendu.

## Istotne pliki

```text
src/
  main.js
  app/
    bootstrap.js
    content-loader.js
    profile-resolver.js
    private-profile-client.js
    view-model.js
  components/
    accordion.js
    hero-card.js
    private-contact.js
    media-lightbox.js
    svg-tag-cloud.js
  sections/
    about-section.js
    projects-section.js
    experience-section.js
    education-section.js
    skills-section.js
  styles/
    components.css
    accordion.css
    print.css
  utils/
    assets.js
content/
  public/*.json
  profiles/default.json
public/
  profiles/<p>.json
```

## Ładowanie treści

`content-loader` importuje publiczne pliki JSON: `identity`, `about`, `projects`, `experience`, `education`, `skills` i `links`. Profile repozytoryjne są ładowane przez `import.meta.glob('../../content/profiles/*.json')` i indeksowane po `profileId`.

## Rozwiązywanie profilu

`profile-resolver` obsługuje trzy źródła kontekstu:

- `?p=<profileId>` wybiera profil z `content/profiles/*.json`; brak parametru oznacza `default`, a błędna wartość uruchamia fallback do profilu domyślnego.
- `#p=<token>` pobiera publiczną nakładkę firmową z `public/profiles/<token>.json`. Plik musi zawierać dokładnie `id` i `companyName`.
- `#k=<token>` jest odczytywany osobno jako prywatny token kontaktowy.

Dla zasobów z `public/` używane jest `import.meta.env.BASE_URL`, dzięki czemu ścieżki działają pod produkcyjnym base `/tomasz_talik_cv/`.

## Prywatny kontakt

`private-profile-client` wysyła `POST /profile` do adresu z `import.meta.env.VITE_PRIVATE_PROFILE_API_URL`. Frontend wysyła tylko token `k`, używa `credentials: 'omit'`, `cache: 'no-store'` i przetwarza wyłącznie `json.profile`. Akceptowane pola profilu prywatnego to `email`, `phone`, `location` i `workModel`.

`private-contact` renderuje blok asynchronicznie po odpowiedzi Workera. Dla błędu pokazuje komunikat statusowy, a dla braku tokenu albo pustych danych nie renderuje sekcji.

## View model

`view-model` tłumaczy JSON-y na strukturę gotową do renderowania. Obsługuje język `pl` i `en`, fallback tekstów, filtrowanie statusów, kolejność sekcji, kolejność projektów, kolejność umiejętności, linki projektów z `links.json`, kategorie umiejętności i chmurę SVG.

Statusy treści:

- `published` — renderowany normalnie.
- `draft` — renderowany tylko przy `?preview=draft` i oznaczany etykietą szkicu.
- `archived` — nie jest renderowany.

## Bootstrap i cykl renderowania

`bootstrap` ładuje dane, rozwiązuje profil, ustawia tryb podglądu, odczytuje `#k`, renderuje widok publiczny natychmiast, a prywatny kontakt pobiera asynchronicznie. Zmiana języka powoduje ponowne utworzenie view modelu i pełne ponowne renderowanie. Otwarta sekcja accordion jest zapamiętywana przez identyfikator i odtwarzana po renderze.

## Komponenty

- `hero-card` renderuje imię, nagłówek, opis, wyróżnione umiejętności, przełącznik PL/EN, przycisk PDF, avatar ekranowy i wariant drukowany `printSrc`.
- `accordion` zarządza sekcjami przez `button`, `aria-expanded`, `aria-controls`, `region` i `hidden`.
- Sekcje `about`, `projects`, `experience`, `education` i `skills` renderują treść z view modelu.
- `media-lightbox` pokazuje miniaturę GIF-u i dialog z pełnym obrazem.
- `svg-tag-cloud` renderuje interaktywną chmurę umiejętności oraz ukrytą listę dostępną dla technologii wspomagających.

## Animacja chmury

Chmura uwzględnia `prefers-reduced-motion`. Animacja startuje tylko dla aktywnego widoku chmury i zostaje zatrzymana po przełączeniu na kategorie albo gdy komponent nie jest już w dokumencie. API komponentu udostępnia `setActive` i `destroy`.

## Style

`components.css` zawiera style kart, Hero, projektów, kontaktu, chmury i układów ekranowych. `accordion.css` odpowiada za zachowanie sekcji accordion. `print.css` definiuje kontrakt druku opisany w [PDF pipeline](PDF_PIPELINE.md).

## Obsługa języka

Domyślnym językiem jest `pl`. Przełącznik PL/EN w Hero aktualizuje `document.documentElement.lang`, buduje view model od nowa i renderuje wszystkie sekcje w wybranym języku.
