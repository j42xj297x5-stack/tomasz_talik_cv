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

## Prywatny blok kontaktowy

`profile-resolver.js` obsługuje publiczny token firmy `p` we fragmencie URL, a `private-profile-client.js` obsługuje niezależny token `k`. Klient prywatnego profilu pobiera publiczny adres API z `VITE_PRIVATE_PROFILE_API_URL`, wykonuje `POST /profile` z `credentials: "omit"` i nie blokuje renderowania publicznego CV. `bootstrap.js` renderuje Hero i accordion od razu, a po poprawnej odpowiedzi Workera wstawia blok `private-contact` bezpośrednio pod Hero. Blok aktualizuje etykiety i lokalizowane wartości przy przełączaniu PL/EN; przy błędzie pokazuje wyłącznie neutralny komunikat statusowy. Dane prywatne nie są dodawane do publicznych profili ani view modelu treści publicznych.

## Produkcyjna konfiguracja Pages i Workera

Vite używa `/` dla lokalnego `npm run dev` i `/tomasz_talik_cv/` dla produkcyjnego builda GitHub Pages. Produkcyjny frontend jest publikowany pod `https://j42xj297x5-stack.github.io/tomasz_talik_cv/` z gałęzi `tomasz_talik_cv`, a workflow Pages można uruchomić także ręcznie. GitHub Actions wykonuje `npm run validate:content` oraz `npm run build` przed publikacją katalogu `dist`.

Publiczny adres Workera pochodzi z `.env.production` (`VITE_PRIVATE_PROFILE_API_URL=https://withered-leaf-cf6b.tapchanbuddha.workers.dev`). Worker musi dopuścić origin `https://j42xj297x5-stack.github.io`; sama publikacja statycznego frontendu nie konfiguruje CORS. Dane prywatne nadal pochodzą tylko z Workera i nie trafiają do publicznych JSON-ów ani Pages.

## Aktualizacja: demonstracje i publiczne odnośniki

- Edytor grupuje publiczne odnośniki z `content/public/links.json` według pola `kind`: „Demo projektów” (`demo`) oraz „GitHub i repozytoria” (`profile`, `repository`). `content/public/projects.json` nie jest już źródłem list odnośników w edytorze.
- Grupa „Demo projektów” zawiera wdrożenia Haiku Cosmos i Interactive AI Portfolio oraz publiczny GIF DIG Engine w CV; grupa „GitHub i repozytoria” zawiera profil GitHub i publiczne repozytoria bez demonstracji. Repozytorium DIG Engine pozostaje prywatne.
- Karta DIG Engine zawiera osadzoną animowaną miniaturę GIF pod opisem. Miniatura otwiera pełnoekranowy dialog obsługujący Escape, kliknięcie tła i przycisk zamknięcia.
- Demonstracja DIG Engine jest całkowicie ukrywana w PDF; pozostała treść projektu drukuje się jak dotychczas.
