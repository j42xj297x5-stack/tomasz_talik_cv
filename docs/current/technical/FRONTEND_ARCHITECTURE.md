# Architektura frontendu

## Cel

Dokument opisuje aktualny pierwszy pełny roboczy przekrój aplikacji „Tomasz Talik CV” potwierdzony kodem, danymi i lokalnym podglądem Projektanta.

## Stos technologiczny

Aplikacja używa:

* Vite;
* Vanilla JavaScript;
* CSS;
* publicznych danych JSON;
* jednej responsywnej karty CV;
* braku frameworka frontendowego.

Nie ma Reacta, Vue, Svelte, Angulara ani backendu.

## Rzeczywista struktura przekroju

```text
index.html
vite.config.js
package.json
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
    experience-section.js
    education-section.js
    skills-section.js
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
    identity.json
    about.json
    projects.json
    experience.json
    education.json
    skills.json
    links.json
  profiles/
    default.json
  schemas/
    common.schema.json
    identity.schema.json
    about.schema.json
    projects.schema.json
    experience.schema.json
    education.schema.json
    skills.schema.json
    links.schema.json
    profile.schema.json
scripts/
  validate-content.mjs
```

## Ładowanie danych

`content-loader.js` importuje `identity`, `about`, `projects`, `experience`, `education`, `skills` i `links` z `content/public/`. Profile są ładowane z `content/profiles/*.json` przez `import.meta.glob` w trybie eager.

## Profil i fallback

`profile-resolver.js` wybiera profil przez `?p=<profileId>`. Brak parametru oznacza profil `default`. Nieistniejący albo nieużywalny profil wraca do `default`, a `bootstrap.js` renderuje komunikat fallbacku z `role="status"`.

## View model i statusy

`view-model.js` łączy publiczne dane z profilem bez mutowania źródeł. Kontrakt statusów:

* bez `preview` renderowane są tylko `published`;
* `?preview=draft` renderuje `published` oraz `draft`;
* `archived` jest ukryte zawsze;
* puste sekcje nie są przekazywane do renderowania.

Tryb można łączyć z profilem: `?p=default&preview=draft`. Jest to narzędzie redakcyjne, nie zabezpieczenie ani mechanizm prywatności.

## Renderowane obszary UI

`bootstrap.js` składa jedną kartę CV z Hero i accordionem. Zaimplementowane sekcje to O mnie, Projekty, Doświadczenie, Wykształcenie i Umiejętności. Nie ma osobnego renderera sekcji kontaktowej.

Hero pokazuje imię i nazwisko, krótki opis z wydzielonego wpisu `about-public-summary`, wyróżnione umiejętności, przycisk `window.print()`, publiczny link GitHub z `links.json` oraz opcjonalny avatar z `identity.portrait`.

Globalny przełącznik PL/EN zmienia lokalizowane treści, etykiety `Szkic` / `Draft` i ustawia `document.documentElement.lang`.

## Avatar

Avatar jest plikiem `public/assets/identity/tomasz-talik-avatar.webp`, wskazanym w danych jako `assets/identity/tomasz-talik-avatar.webp`. `getAssetUrl` buduje adres względem `BASE_URL`. CSS zachowuje naturalny format obrazu bez okrągłej maski, ustawia go po prawej stronie Hero na desktopie i nad tekstem na mobile, z rozmiarem `clamp` około 110–170 px, subtelną ramką akcentową i niewielkim obniżeniem na desktopie. Brak avatara nie tworzy pustej kolumny.

## Accordion

`accordion.js` dopuszcza najwyżej jeden otwarty panel i pozwala zamknąć wszystkie. Przyciski mają `aria-expanded` oraz `aria-controls`, panele mają `role="region"` i `aria-labelledby`. Przycisk jest jedynym widocznym tytułem sekcji na stronie; wewnętrzny nagłówek sekcji pozostaje w DOM i wraca w wydruku dokładnie raz.

## Umiejętności

Aktualna sekcja umiejętności renderuje płaską listę. Wynika to z obecnego schematu i danych `skills.json`, bez kategorii, grupowania i opisów.

## PDF

Przycisk Hero wywołuje `window.print()`. Wydruk używa tego samego HTML i view modelu co strona oraz `src/styles/print.css`. Nie ma osobnego szablonu PDF. Wydruk rozwija panele niezależnie od stanu accordionu, pokazuje sekcje widoczne w aktualnym trybie filtrowania, zawiera szkice przy `?preview=draft`, ukrywa znaczniki `Szkic` / `Draft`, pokazuje tytuły sekcji dokładnie raz i zachowuje avatar w kompaktowej formie.

## Przyszłe elementy

Streamlit, Playwright, backend i produkcyjny deployment nie są zaimplementowane. Jeśli zostaną dodane, powinny korzystać z tego samego modelu danych, HTML, view modelu i stylów wydruku.
