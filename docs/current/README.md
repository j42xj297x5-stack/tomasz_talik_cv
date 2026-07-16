# Aktualna dokumentacja projektu „Tomasz Talik CV”

## Status

Opublikowano pierwszą pełną zaakceptowaną treść CV w publicznych danych JSON. Projekt jest statyczną aplikacją Vite z Vanilla JavaScript, CSS, publicznymi danymi JSON i jedną responsywną kartą CV. Nie używa frameworka frontendowego. Ten dokument opisuje wyłącznie stan potwierdzony aktualnym kodem, danymi i lokalnym podglądem Projektanta.

## Zakres zaimplementowanego przekroju

* Aplikacja działa jako jedna strona Vite bez Reacta, Vue, Svelte, Angulara ani innego frameworka frontendowego.
* Widok jest składany w Vanilla JavaScript, a style są utrzymywane w CSS.
* Dane publiczne są ładowane z `content/public/identity.json`, `about.json`, `projects.json`, `experience.json`, `education.json`, `skills.json` i `links.json`.
* Profil wybiera parametr `?p=<profileId>`; brak parametru używa profilu `default`.
* Pierwsza pełna zaakceptowana treść CV jest widoczna bez `?preview=draft`; tryb roboczy można nadal łączyć z profilem dla przyszłych szkiców, np. `?p=default&preview=draft`.
* UI ma jedną wspólną responsywną kartę CV.
* Zaimplementowane sekcje to: O mnie, Projekty, Doświadczenie, Wykształcenie i Umiejętności.
* Sekcja kontaktowa nie jest osobną gotową sekcją; aktualny kod używa publicznego linku w akcjach Hero, jeśli link przejdzie filtrowanie statusu.
* Puste sekcje nie są renderowane.

## Hero i język

Hero pokazuje imię i nazwisko, krótki opis oddzielony od sekcji O mnie, wyróżnione umiejętności, akcję „Zapisz jako PDF”, publiczny link GitHub oraz opcjonalny avatar. Globalny przełącznik PL/EN przełącza lokalizowane treści, aktualizuje oznaczenia `Szkic` / `Draft` i ustawia atrybut `lang` dokumentu na aktywny język.

Avatar jest zasobem `public/assets/identity/tomasz-talik-avatar.webp`, wskazywanym w danych jako `assets/identity/tomasz-talik-avatar.webp`. Zachowuje naturalny format obrazu bez okrągłej maski, jest po prawej stronie Hero na desktopie i nad tekstem na mobile, ma elastyczny rozmiar około 110–170 px (`clamp`), subtelną ramkę akcentową i niewielkie obniżenie w układzie desktopowym. Jest widoczny w PDF. Brak avatara nie zostawia pustej kolumny.

## Statusy i podgląd redakcyjny

Kontrakt statusów jest następujący:

* bez parametru `preview` renderowane są wyłącznie elementy `published`;
* `?preview=draft` renderuje elementy `published` oraz `draft`;
* `archived` pozostaje niewidoczne w obu trybach;
* puste sekcje nie są renderowane.

Pierwsza pełna zaakceptowana treść CV jest opublikowana, więc aktualne sekcje Hero, O mnie, Projekty, Doświadczenie, Wykształcenie, Umiejętności i zaakceptowane publiczne linki są widoczne bez `?preview=draft`. `?preview=draft` pozostaje narzędziem redakcyjnym dla przyszłych treści roboczych. Nie jest zabezpieczeniem dostępu i nie zapewnia prywatności, ponieważ publiczne JSON-y oraz zasoby statyczne są częścią frontendu. Robocze elementy widoczne na stronie dostają oznaczenie `Szkic` w PL i `Draft` w EN; opublikowane elementy nie dostają takich oznaczeń, a znaczniki są ukrywane w wydruku.

## Accordion

Accordion pozwala mieć najwyżej jeden otwarty panel i umożliwia zamknięcie wszystkich paneli. Obsługuje `aria-expanded`, `aria-controls`, `role="region"` i `aria-labelledby`. Przycisk accordionu jest jedynym widocznym tytułem sekcji na stronie. Semantyczny wewnętrzny nagłówek pozostaje w DOM, wraca w wydruku i występuje tam dokładnie raz.

## PDF

PDF powstaje przez `window.print()` z tego samego HTML i view modelu co strona. Nie ma osobnego szablonu PDF. Wydruk nie zależy od stanu otwarcia accordionu: pokazuje wyrenderowane sekcje niezależnie od tego, które panele były otwarte. Przy `?preview=draft` zawiera również szkice, ale ukrywa znaczniki `Szkic` / `Draft`. Tytuły sekcji są widoczne dokładnie raz, a avatar pozostaje widoczny w kompaktowej formie.

## Źródła prawdy i zależności

* Model treści: `docs/current/content/CONTENT_MODEL.md`.
* Robocza pierwsza paczka treści CV: `docs/current/content/FIRST_PUBLIC_CV_CONTENT.md`.
* Personalizacja: `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Przepływ jednej strony: `docs/current/ui/SINGLE_PAGE_FLOW.md`.
* Dostęp i prywatność: `docs/current/security/ACCESS_AND_PRIVACY.md`.
* Architektura frontendu: `docs/current/technical/FRONTEND_ARCHITECTURE.md`.
* PDF: `docs/current/technical/PDF_PIPELINE.md`.
* Deployment: `docs/current/technical/DEPLOYMENT.md`.
* Mapa dokumentacji: `docs/current/maps/PROJECT_INDEX.md`.
* Handoff bieżącego stanu: `docs/handoff/CURRENT_STATE.md`.

## Znane ograniczenia i przyszłe kierunki

Nie ma potwierdzonego deploymentu produkcyjnego. Streamlit, Playwright, backend, bezpieczne pobieranie danych prywatnych i produkcyjny pipeline publikacji pozostają funkcjami przyszłymi.

## Lokalny edytor i profile firmowe

Zaimplementowano lokalny edytor Streamlit w `editor/app.py`. Działa bez backendu, API, połączeń sieciowych i bez automatycznego wysyłania maili. Generuje deterministyczne teksty PL/EN, plik JSON profilu firmowego oraz link z fragmentem `#p=<długi-token>`. JSON zawiera wyłącznie `id` tokenu i `companyName`; profile firmowe korzystają z tej samej opublikowanej treści CV i dodają wyłącznie etykietę firmy. Dane rekrutera, stanowisko, ogłoszenie, mail i list pozostają lokalne w formularzu. Profil firmowy jest ręcznie dodawany do `public/profiles/` i wymaga ponownego opublikowania strony. Token jest nieodgadywalnym identyfikatorem wygody, ale nie jest autoryzacją ani ochroną danych.

## Publiczny profil i prywatny kontakt

Frontend rozdziela dwa parametry fragmentu URL: `p` jest publicznym identyfikatorem profilu firmy w `public/profiles/<p>.json`, a `k` jest prywatnym tokenem dostępu sprawdzanym przez zewnętrzny Cloudflare Worker. Publiczny JSON profilu nadal zawiera dokładnie `id` i `companyName`; token `k` nie trafia do repozytorium, publicznych JSON-ów ani danych profilu. Domyślny profil oraz adres bez `k` nie pobierają i nie pokazują danych osobowych. Dane kontaktowe pochodzą wyłącznie z zewnętrznego API Workera, który zwraca jeden stały zestaw danych dla aktywnych tokenów; nazwy firm nie trafiają do D1. Lokalny edytor aktywuje `k` przez chroniony endpoint administracyjny, a `editorAdminKey` pozostaje wyłącznie w `editor/config.local.json`. Frontend zna tylko publiczny adres Workera. Token może zostać przekazany dalej przez odbiorcę i nie stanowi pełnej autoryzacji użytkownika. Podczas drukowania PDF parametr `k` jest tymczasowo usuwany z widocznego adresu.

## Produkcyjny deployment GitHub Pages

Produkcja działa pod adresem `https://j42xj297x5-stack.github.io/tomasz_talik_cv/`. Deployment GitHub Pages uruchamia się po pushu do gałęzi `tomasz_talik_cv` oraz ręcznie przez `workflow_dispatch`; GitHub Actions wykonuje `npm ci`, `npm run validate:content` i `npm run build`, a następnie publikuje katalog `dist`. Produkcyjny `base` Vite to `/tomasz_talik_cv/`, a lokalny dev server pozostaje pod `/`.

Publiczny adres Workera `https://withered-leaf-cf6b.tapchanbuddha.workers.dev` jest zapisany w `.env.production` jako konfiguracja publiczna, nie sekret. Cloudflare Worker musi dopuścić origin `https://j42xj297x5-stack.github.io`; deployment Pages nie zastępuje konfiguracji CORS. `editor/config.defaults.json` zawiera publiczny adres CV i Workera, a ignorowany `editor/config.local.json` zawiera lokalny `editorAdminKey`. W normalnej pracy edytor nie wymaga wpisywania adresu CV ani Workera, a ustawienia infrastrukturalne są schowane w panelu „Konfiguracja techniczna”. Dane prywatne i sekrety nadal nie trafiają do repozytorium ani GitHub Pages.

## Aktualizacja: widok Umiejętności

Zatrudnienie w Usługach Informatycznych Szansa zakończyło się w 07/2026; faktyczna data rozwiązania umowy to 14.07.2026, ale publiczne CV pokazuje miesięczny format 07/2024–07/2026.

Sekcja Umiejętności korzysta z jednego źródła `content/public/skills.json`, które zawiera teraz `categories` oraz `items`. Każdy skill ma `categoryId` i `inCloud`, a opcjonalne `cloudWeight` jest wyłącznie wizualnym wyróżnieniem w chmurze, nie poziomem kompetencji. Statusy `published`, `draft` i `archived` pozostają bez zmian.

Widok domyślny to Chmura, przełączana z widokiem Kategorie przez dostępne zakładki Chmura / Kategorie. Chmura jest własnym komponentem Vanilla JS + SVG, bez jQuery i zewnętrznego dodatku; animacja reaguje na wskaźnik, na mobile obraca się wolniej, a `prefers-reduced-motion` renderuje nieruchomą chmurę. Widok statyczny pokazuje sześć kategorii, a pojedyncze umiejętności w kategoriach są prezentowane jako lekkie etykiety tekstowe bez ramek zarówno na stronie, jak i w PDF.

Dawna kategoria Narzędzia twórcze i techniczne została rozdzielona na Grafika, wideo i CAD oraz Dźwięk i produkcja muzyczna. ChatGPT i Codex są wykorzystywane w kontrolowanym procesie implementacji obejmującym specyfikowanie zadań, kontrolę zakresu i weryfikację rezultatów; Codex jest używany w chmurze i lokalnie. Figma oznacza przepływy Codex i przygotowanie zasobów, nie deklarację pełnego UI/UX. GIMP jest głównym narzędziem grafiki rastrowej, DaVinci Resolve głównym narzędziem montażowym, a ZW3D obejmuje parametryczne części, bryły, szkice, więzy i drzewo historii. Kompetencje dźwiękowe obejmują produkcję, sound design, nagrania, obróbkę głosu, miks, mastering, DAW, VST i syntezę modularną; Ableton Live, Reason, Cubase i Pro Tools są widoczne w kategoriach, ale nie w chmurze. Chmura pokazuje wyłącznie wybrane reprezentatywne nowe kompetencje, a `cloudWeight` nadal oznacza jedynie wyróżnienie wizualne, nie poziom kompetencji. Doświadczenie niezależne obejmuje regularne publikowanie muzyki od 2000 roku, a praktyka instrumentalna znajduje się w opisie doświadczenia, nie w chmurze.

Hero nadal korzysta z `featuredSkillIds`, a `profile.skillOrder` nadal ustala kolejność umiejętności w chmurze i kategoriach. PDF pokazuje tylko widok kategorii i nie drukuje SVG.

## Aktualizacja: odnośniki demonstracji w kartach projektów

`content/public/links.json` pozostaje jednym źródłem prawdy dla publicznych adresów. Opcjonalne pola `projectId` i `projectLabel` wiążą link demonstracyjny `kind: demo` z konkretną kartą projektu bez kopiowania URL-i do `projects.json`. Haiku Cosmos pokazuje pod opisem odnośnik „Uruchom demo”, a Interactive AI Portfolio pokazuje pod opisem „Otwórz portfolio”; oba otwierają się w nowej karcie. DIG Engine pozostaje przy osadzonym GIF-ie i pełnoekranowym podglądzie bez osobnego linku pod opisem. Profil GitHub pozostaje w Hero. Repozytoria pozostają w `links.json`, mogą być używane przez lokalny edytor i nie są wyświetlane w kartach projektów. W PDF oba odnośniki projektowe pozostają widoczne i klikalne jako etykiety tekstowe, bez drukowania pełnych adresów URL.
