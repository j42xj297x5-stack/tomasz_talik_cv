# Aktualny stan projektu „Tomasz Talik CV”

## Executive Summary

Opublikowano pierwszą pełną zaakceptowaną treść CV w pierwszym pełnym przekroju aplikacji: Vite, Vanilla JavaScript, CSS, publiczne JSON-y, profil `default`, redakcyjny `?preview=draft`, PL/EN, Hero z opcjonalnym avatarem, accordion, sekcje CV i PDF przez `window.print()`. Dokumentacja opisuje stan potwierdzony kodem, danymi i lokalnym podglądem Projektanta.

## Stan architektury

Aplikacja jest statyczną stroną Vite bez frameworka frontendowego. `content-loader.js` ładuje `identity`, `about`, `projects`, `experience`, `education`, `skills` i `links` z `content/public/` oraz profile z `content/profiles/`. `view-model.js` odpowiada za lokalizację, filtrowanie statusów, Hero i listę sekcji. `bootstrap.js` składa jedną responsywną kartę CV z Hero i accordionem.

## Zaimplementowane sekcje

Zaimplementowane są:

* O mnie;
* Projekty;
* Doświadczenie;
* Wykształcenie;
* Umiejętności.

Sekcja kontaktowa nie jest obecnie osobną gotową sekcją. Publiczny link GitHub może pojawić się jako akcja Hero po przejściu filtrowania statusu.

## PL/EN

Globalny przełącznik PL/EN zmienia lokalizowane treści i etykiety szkiców. W języku polskim robocze elementy mają znacznik `Szkic`, a w angielskim `Draft`. Kod aktualizuje atrybut `lang` dokumentu.

## `?p=` i `?preview=draft`

`?p=<profileId>` wybiera publiczny profil. Brak parametru używa `default`, a niepoprawny profil wraca do `default` z komunikatem fallbacku.

Bez parametru `preview` renderowane są wyłącznie elementy `published`; obecnie obejmuje to pełną zaakceptowaną treść CV. `?preview=draft` renderuje `published` oraz przyszłe `draft`. `archived` pozostaje niewidoczne w obu trybach, a puste sekcje nie są renderowane. Tryb roboczy można łączyć z profilem:

```text
?p=default&preview=draft
```

`?preview=draft` jest narzędziem redakcyjnym, nie zabezpieczeniem dostępu i nie mechanizmem prywatności.

## PDF

PDF działa przez `window.print()` uruchamiane z Hero. Używa tego samego HTML i view modelu co strona oraz `src/styles/print.css`. Nie ma osobnego szablonu PDF. Wydruk nie zależy od stanu otwarcia accordionu, zawiera szkice przy `?preview=draft`, ukrywa znaczniki `Szkic` / `Draft`, pokazuje tytuły sekcji dokładnie raz i zachowuje avatar w kompaktowej formie.

## Avatar

Avatar jest plikiem `public/assets/identity/tomasz-talik-avatar.webp`, wskazanym w danych jako `assets/identity/tomasz-talik-avatar.webp`. Zachowuje naturalny format bez okrągłej maski, ma subtelną ramkę akcentową, rozmiar `clamp` około 110–170 px, pozycję po prawej stronie Hero na desktopie i nad tekstem na mobile oraz niewielkie obniżenie w układzie desktopowym. Brak avatara nie zostawia pustej kolumny.

## Status danych

Publiczne dane obejmują opublikowaną pierwszą pełną treść CV w `identity.json`, `about.json`, `projects.json`, `experience.json`, `education.json`, `skills.json`, `links.json` i profil `default`. Schematy oraz `scripts/validate-content.mjs` definiują kontrakt i walidację. Lista umiejętności pozostaje płaska z powodu obecnego schematu i danych. `FIRST_PUBLIC_CV_CONTENT.md` pozostaje kanonicznym dokumentem treści CV; dokumenty architektoniczne nie przepisują pełnej treści CV.

## Potwierdzone testy

* Interfejs i avatar zostały sprawdzone lokalnie przez Projektanta w Vite.
* Kontrole statyczne i `git diff --check` przechodziły w kolejnych zadaniach.
* Codex nie mógł potwierdzić `npm run validate:content` ani `npm run build` z powodu braku zależności i błędu registry 403.
* Pełna walidacja i build pozostają do wykonania w lokalnym środowisku z dostępnymi zależnościami.

## Profile firmowe

Profile firmowe korzystają z tej samej opublikowanej treści CV i dodają wyłącznie etykietę firmy. Nie zmieniają treści sekcji ani nie publikują danych prywatnych.

## Znane ograniczenia

* Brak produkcyjnego deploymentu.
* Brak potwierdzonego builda i walidacji treści w środowisku Codex.
* `?preview=draft` pozostaje dostępny dla przyszłych treści roboczych i nie zapewnia prywatności.
* Dane i zasoby w publicznym frontendzie są publiczne niezależnie od statusu.
* Brak osobnej sekcji kontaktowej.
* Brak backendu i Playwright; lokalny edytor Streamlit pozostaje narzędziem lokalnym.
* Aktualny model umiejętności jest płaski.

## Rekomendowany następny etap

Następny etap powinien obejmować pełne lokalne `npm run validate:content` i `npm run build`, test mobile, kontrolę wydruku PL i EN, redakcyjny przegląd treści, utrzymanie `?preview=draft` dla przyszłych szkiców i przygotowanie deploymentu.

## Aktualizacja: publiczny `p` i prywatny `k`

Frontend obsługuje `#p=<publiczny-token>&k=<prywatny-token>`. `p` wybiera publiczny JSON firmy zawierający tylko `id` i `companyName`; `k` odblokowuje stałe dane kontaktowe z zewnętrznego Workera. Domyślny profil i adres bez `k` nie pokazują danych osobowych. Edytor Streamlit automatycznie aktywuje `k` przez chroniony endpoint administracyjny z `editorAdminKey` trzymanym lokalnie w `editor/config.local.json`. Frontend zna tylko publiczny adres Workera, nie wysyła nazwy firmy, a PDF usuwa `k` z widocznego adresu na czas drukowania.

## Aktualizacja: deployment GitHub Pages i edytor

Produkcja jest przygotowana pod `https://j42xj297x5-stack.github.io/tomasz_talik_cv/` z bazą Vite `/tomasz_talik_cv/`. Workflow GitHub Pages publikuje `dist` po pushu do gałęzi `tomasz_talik_cv` oraz przez ręczne `workflow_dispatch`, wykonując `npm ci`, `npm run validate:content` i `npm run build`.

Frontend produkcyjny zna publiczny adres Workera z `.env.production`. `editor/config.defaults.json` zawiera publiczne stałe adresu CV i Workera, a `editor/config.local.json` pozostaje lokalnym, ignorowanym miejscem na `editorAdminKey`. Główny formularz edytora nie pokazuje pól infrastrukturalnych; są w zamkniętym panelu „Konfiguracja techniczna”. Worker nadal musi dopuścić origin `https://j42xj297x5-stack.github.io`, a prywatne dane i sekrety nie trafiają do repozytorium ani GitHub Pages.

## Aktualizacja: demonstracje i publiczne odnośniki

- Edytor grupuje publiczne odnośniki z `content/public/links.json` według pola `kind`: „Demo projektów” (`demo`) oraz „GitHub i repozytoria” (`profile`, `repository`). `content/public/projects.json` nie jest już źródłem list odnośników w edytorze.
- Grupa „Demo projektów” zawiera wdrożenia Haiku Cosmos i Interactive AI Portfolio oraz publiczny GIF DIG Engine w CV; grupa „GitHub i repozytoria” zawiera profil GitHub i publiczne repozytoria bez demonstracji. Repozytorium DIG Engine pozostaje prywatne.
- Karta DIG Engine zawiera osadzoną animowaną miniaturę GIF pod opisem. Miniatura otwiera pełnoekranowy dialog obsługujący Escape, kliknięcie tła i przycisk zamknięcia.
- Demonstracja DIG Engine jest całkowicie ukrywana w PDF; pozostała treść projektu drukuje się jak dotychczas.
