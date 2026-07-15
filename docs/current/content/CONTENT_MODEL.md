# Model treści

## Cel

Dokument opisuje aktualny model publicznych danych JSON po publikacji pierwszej pełnej zaakceptowanej treści CV. Źródłem prawdy pozostają aktualne pliki `content/`, schematy oraz walidator.

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

`docs/current/content/FIRST_PUBLIC_CV_CONTENT.md` pozostaje kanonicznym dokumentem treści CV. Pierwsza pełna zaakceptowana treść CV jest opublikowana w publicznych JSON-ach jako `published`; dokumenty architektoniczne nie kopiują pełnej treści CV.

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

`?preview=draft` nie jest zabezpieczeniem dostępu i nie zapewnia prywatności. Dane zapisane w publicznych JSON-ach należy traktować jako publiczne niezależnie od statusu. Aktualnie zaakceptowane sekcje są widoczne bez `?preview=draft`, a tryb redakcyjny pozostaje dostępny dla przyszłych treści roboczych.

## Profil default i personalizacja

`content/profiles/default.json` jest profilem używanym przy braku `?p=`. Profil kontroluje kolejność i widoczność sekcji, kolejność projektów, kolejność umiejętności i wyróżnione umiejętności. Tryb redakcyjny można łączyć z profilem, np.:

```text
?p=default&preview=draft
```

Aktualnie zaimplementowane sekcje profilu to O mnie, Projekty, Doświadczenie, Wykształcenie i Umiejętności. `contact` może występować w konfiguracji profilu, ale aktualny kod nie renderuje osobnej sekcji kontaktowej.

## Hero, linki i avatar

`identity.json` przechowuje imię i nazwisko oraz opcjonalny `portrait`. Obecny avatar ekranowy jest wskazywany w `portrait.src` jako `assets/identity/tomasz-talik-avatar.webp`, co odpowiada plikowi `public/assets/identity/tomasz-talik-avatar.webp`. Opcjonalne `portrait.printSrc` wskazuje osobny avatar do wydruku/PDF: `assets/identity/tomasz-talik-avatar_bw.webp`, odpowiadający `public/assets/identity/tomasz-talik-avatar_bw.webp`. Jeśli `printSrc` nie istnieje, druk bezpiecznie używa `portrait.src`. `links.json` dostarcza publiczny link renderowany jako akcja Hero po przejściu filtrowania statusów. Brak portretu nie tworzy pustej kolumny ani placeholdera.

## Umiejętności

Aktualna lista umiejętności pozostaje płaska. Wynika to z obecnego `skills.schema.json` oraz danych `skills.json`, które opisują elementy jako pojedyncze pozycje bez kategorii, grup i opisów. Kolejność prezentacji pochodzi z profilu.

## PDF

Konfiguracja `pdf` w profilu jest opcjonalna i nie wskazuje osobnego pliku. PDF powstaje przez `window.print()` z tego samego HTML, danych i view modelu co strona. Przy `?preview=draft` wydruk zawiera również szkice, ale znaczniki `Szkic` / `Draft` są ukrywane. Jeśli w danych istnieje `portrait.printSrc`, wydruk używa osobnego avatara drukowanego zamiast kolorowego avatara ekranowego; w przeciwnym razie używa `portrait.src` jako fallbacku.

## Prywatność

Prywatne dane i sekrety nie mogą trafiać do publicznych JSON-ów, profili, kodu frontendu ani zasobów statycznych. Status `draft` nie chroni danych.

## Minimalne profile firmowe

Profile firmowe są publicznymi minimalnymi nakładkami ładowanymi z `public/profiles/<token>.json` przez fragment URL `#p=<długi-token>`. Schemat `content/schemas/company-profile.schema.json` dopuszcza wyłącznie pola `id` i `companyName`. Taki profil korzysta z tej samej opublikowanej treści CV, nie kopiuje konfiguracji `default`, nie przechowuje maila, listu, danych rekrutera, stanowiska ani adresu ogłoszenia i dodaje jedynie nazwę firmy do wcześniej rozwiązanego profilu `default` albo profilu wybranego przez `?p=`.

## Aktualizacja: demonstracje i publiczne odnośniki

- Edytor grupuje publiczne odnośniki z `content/public/links.json` według pola `kind`: „Demo projektów” (`demo`) oraz „GitHub i repozytoria” (`profile`, `repository`). `content/public/projects.json` nie jest już źródłem list odnośników w edytorze.
- Grupa „Demo projektów” zawiera wdrożenia Haiku Cosmos i Interactive AI Portfolio oraz publiczny GIF DIG Engine w CV; grupa „GitHub i repozytoria” zawiera profil GitHub i publiczne repozytoria bez demonstracji. Repozytorium DIG Engine pozostaje prywatne.
- Karta DIG Engine zawiera osadzoną animowaną miniaturę GIF pod opisem. Miniatura otwiera pełnoekranowy dialog obsługujący Escape, kliknięcie tła i przycisk zamknięcia.
- Demonstracja DIG Engine jest całkowicie ukrywana w PDF; pozostała treść projektu drukuje się jak dotychczas.

## Aktualizacja: widok Umiejętności

Sekcja Umiejętności korzysta z jednego źródła `content/public/skills.json`, które zawiera teraz `categories` oraz `items`. Każdy skill ma `categoryId` i `inCloud`, a opcjonalne `cloudWeight` jest wyłącznie wizualnym wyróżnieniem w chmurze, nie poziomem kompetencji. Statusy `published`, `draft` i `archived` pozostają bez zmian.

Widok domyślny to Chmura, przełączana z widokiem Kategorie przez dostępne zakładki Chmura / Kategorie. Chmura jest własnym komponentem Vanilla JS + SVG, bez jQuery i zewnętrznego dodatku; animacja reaguje na wskaźnik, na mobile obraca się wolniej, a `prefers-reduced-motion` renderuje nieruchomą chmurę. Widok statyczny pokazuje pięć kategorii.

Hero nadal korzysta z `featuredSkillIds`, a `profile.skillOrder` nadal ustala kolejność umiejętności w chmurze i kategoriach. PDF pokazuje tylko widok kategorii i nie drukuje SVG.

## Aktualizacja: odnośniki demonstracji w kartach projektów

`content/public/links.json` pozostaje jednym źródłem prawdy dla publicznych adresów. Opcjonalne pola `projectId` i `projectLabel` wiążą link demonstracyjny `kind: demo` z konkretną kartą projektu bez kopiowania URL-i do `projects.json`. Haiku Cosmos pokazuje pod opisem odnośnik „Uruchom demo”, a Interactive AI Portfolio pokazuje pod opisem „Otwórz portfolio”; oba otwierają się w nowej karcie. DIG Engine pozostaje przy osadzonym GIF-ie i pełnoekranowym podglądzie bez osobnego linku pod opisem. Profil GitHub pozostaje w Hero. Repozytoria pozostają w `links.json`, mogą być używane przez lokalny edytor i nie są wyświetlane w kartach projektów. W PDF oba odnośniki projektowe pozostają widoczne i klikalne jako etykiety tekstowe, bez drukowania pełnych adresów URL.
