# Architektura frontendu

## Cel

Dokument opisuje aktualnie zaimplementowany pierwszy pionowy przekrój aplikacji webowej. Źródłami prawdy są `docs/current/README.md`, `docs/current/content/CONTENT_MODEL.md`, `docs/current/product/PERSONALIZATION_SYSTEM.md`, `docs/current/ui/SINGLE_PAGE_FLOW.md` i kod w `src/`.

## Stos technologiczny

Aplikacja jest pojedynczą stroną Vite z:

* Vanilla JavaScript;
* HTML składanym w modułach JS bez frameworka frontendowego;
* CSS, w tym osobnym stylem druku `src/styles/print.css`;
* publicznymi danymi JSON z katalogu `content/`.

Nie ma Reacta, Vue, Svelte, Angulara ani innego frameworka frontendowego.

## Rzeczywista struktura przekroju

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
    print.css
  utils/
    assets.js
    dom.js
content/
  public/
  profiles/
  schemas/
scripts/
docs/
```

`content-loader.js` ładuje publiczne dane z `content/public/*.json` przez importy modułów JSON i profile z `content/profiles/*.json` przez `import.meta.glob` z trybem eager. Dane nie są kopiowane do `src/`.

## Routing, profil i fallback

`profile-resolver.js` wybiera profil z parametru `?p=<profileId>`. Brak parametru oznacza `profile default`. Nieistniejący lub nieużywalny profil bezpiecznie wraca do `default`; `bootstrap.js` pokazuje wtedy zwarty komunikat fallbacku z `role="status"` nad kartą CV.

## View model i filtrowanie

`view-model.js` niemutująco łączy publiczne dane z profilem. Renderowane są tylko elementy `published`. Elementy `draft` i `archived` są ukrywane, a sekcje bez opublikowanej treści nie są przekazywane do renderowania. W obecnych danych większość rzeczywistej treści jest nadal `draft`, więc publiczny widok może zawierać tylko imię i nazwisko; to oczekiwany efekt filtrowania.

## UI i stan interakcji

Aplikacja renderuje jedną wspólną kartę CV o maksymalnej szerokości około 940 px. Układ jest mobile first, portret jest opcjonalny, a motyw wynika z `prefers-color-scheme`. Accordion przechowuje stan otwartego panelu lokalnie w komponencie: jednocześnie otwarty może być najwyżej jeden panel, a ponowne kliknięcie otwartego panelu zamyka wszystkie. Przyciski accordionu mają `aria-expanded` i `aria-controls`, a panele `role="region"` oraz `aria-labelledby`.

## PDF i druk

Przycisk „Zapisz jako PDF” w `hero-card.js` wywołuje `window.print()`. Wydruk używa aktualnie wyrenderowanego HTML, tego samego view modelu i `src/styles/print.css`. CSS druku pokazuje wszystkie opublikowane sekcje wybrane przez profil niezależnie od bieżącego stanu accordionu. Aplikacja nie pobiera statycznego pliku PDF i nie ma osobnego szablonu danych PDF.

## Funkcje przyszłe

Streamlit, Playwright i backend nie są zaimplementowane. Gdy zostaną dodane, Streamlit i Playwright mają używać tego samego HTML, view modelu i stylów wydruku, bez osobnego szablonu PDF.

## Podgląd szkiców

Parametr `?preview=draft` uruchamia jawny tryb roboczego przeglądania treści. View model otrzymuje ten tryb jako ustawienie i przekazuje do renderowania elementy `published` oraz `draft`; elementy `archived` pozostają ukryte w każdym trybie. Parametr działa równolegle z profilem, np. `?p=default&preview=draft`, nie zapisuje się w `localStorage` i nie wymaga przeładowania po zmianie języka.

Tryb podglądu nie jest mechanizmem prywatności. Publiczne pliki JSON są częścią paczki aplikacji, dlatego dane zapisane w nich jako `draft` należy traktować jako publiczne.

## Sekcja doświadczenia

Wdrożono pierwszą sekcję doświadczenia renderowaną w istniejącym accordionie. Renderer używa wspólnych narzędzi DOM i `textContent`, bez `innerHTML` dla danych JSON. W trybie podglądu widoczne szkice dostają lokalizowany znacznik `Szkic` / `Draft`; znaczniki są ukrywane w stylach druku, ale same treści draft pozostają w wydruku, jeśli zostały wyrenderowane przez `?preview=draft`.

## Sekcja umiejętności

Wdrożono pierwszą sekcję umiejętności renderowaną w istniejącym accordionie. `skills-section.js` korzysta ze wspólnych narzędzi DOM oraz `textContent`, bez `innerHTML` dla danych JSON. View model filtruje wpisy tak jak pozostałe sekcje: `published` w trybie publicznym, `published` i `draft` w `?preview=draft`, a `archived` pozostają ukryte w obu trybach. Widoczne szkice używają istniejącego lokalizowanego znacznika `Szkic` / `Draft`, ukrywanego w stylach druku.

Dane pierwszej sekcji umiejętności pozostają w statusie `draft`. Obecny `skills.schema.json` nie obsługuje kategorii, grupowania ani opisów, dlatego kolejność profilu zachowuje płaską listę umiejętności zamiast dopisywania nowych pól poza schematem. To ogranicza prezentację zakresu kompetencji AI do nazwy umiejętności do czasu rozszerzenia modelu danych. `?preview=draft` nadal nie jest mechanizmem prywatności, ponieważ publiczne pliki JSON są częścią paczki aplikacji.
