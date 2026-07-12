# Aktualna dokumentacja projektu „Tomasz Talik CV”

## Status

Zamknięto dokumentacyjnie pierwszy pełny roboczy przekrój aplikacji. Projekt jest statyczną aplikacją Vite z Vanilla JavaScript, CSS, publicznymi danymi JSON i jedną responsywną kartą CV. Nie używa frameworka frontendowego. Ten dokument opisuje wyłącznie stan potwierdzony aktualnym kodem, danymi i lokalnym podglądem Projektanta.

## Zakres zaimplementowanego przekroju

* Aplikacja działa jako jedna strona Vite bez Reacta, Vue, Svelte, Angulara ani innego frameworka frontendowego.
* Widok jest składany w Vanilla JavaScript, a style są utrzymywane w CSS.
* Dane publiczne są ładowane z `content/public/identity.json`, `about.json`, `projects.json`, `experience.json`, `education.json`, `skills.json` i `links.json`.
* Profil wybiera parametr `?p=<profileId>`; brak parametru używa profilu `default`.
* Tryb roboczy można łączyć z profilem, np. `?p=default&preview=draft`.
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

`?preview=draft` jest narzędziem redakcyjnym. Nie jest zabezpieczeniem dostępu i nie zapewnia prywatności, ponieważ publiczne JSON-y oraz zasoby statyczne są częścią frontendu. Robocze elementy widoczne na stronie dostają oznaczenie `Szkic` w PL i `Draft` w EN; znaczniki są ukrywane w wydruku.

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
