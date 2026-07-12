# Mapa dokumentacji projektu

## Cel

Mapa wskazuje aktualne źródła prawdy po zamknięciu pierwszego pełnego roboczego przekroju aplikacji „Tomasz Talik CV”.

## Dokumenty aktualne

| Dokument | Rola |
| --- | --- |
| `docs/current/README.md` | Kanoniczny opis aktualnego stanu przekroju |
| `docs/current/content/CONTENT_MODEL.md` | Publiczne JSON-y, statusy, profil default, schematy i walidator |
| `docs/current/content/FIRST_PUBLIC_CV_CONTENT.md` | Kanoniczny dokument treści CV, bez kopiowania pełnej treści do architektury |
| `docs/current/product/PERSONALIZATION_SYSTEM.md` | `?p=`, fallback i `?preview=draft` |
| `docs/current/ui/SINGLE_PAGE_FLOW.md` | Jedna karta CV, Hero, accordion, PL/EN, avatar i druk |
| `docs/current/security/ACCESS_AND_PRIVACY.md` | Publiczny charakter JSON-ów, zasobów statycznych i ograniczenia prywatności |
| `docs/current/technical/FRONTEND_ARCHITECTURE.md` | Vite, Vanilla JS, CSS, dane i renderery |
| `docs/current/technical/PDF_PIPELINE.md` | PDF przez `window.print()` |
| `docs/current/technical/DEPLOYMENT.md` | Brak deploymentu produkcyjnego, planowany GitHub Pages |
| `docs/handoff/CURRENT_STATE.md` | Aktualny handoff etapu |

## Pliki danych

| Plik | Rola |
| --- | --- |
| `content/public/identity.json` | Imię i nazwisko oraz opcjonalny avatar |
| `content/public/about.json` | Krótki opis Hero i sekcja O mnie |
| `content/public/projects.json` | Sekcja Projekty |
| `content/public/experience.json` | Sekcja Doświadczenie |
| `content/public/education.json` | Sekcja Wykształcenie |
| `content/public/skills.json` | Płaska lista umiejętności |
| `content/public/links.json` | Publiczne linki używane w Hero |
| `content/profiles/default.json` | Domyślny profil i kolejności prezentacji |
| `content/schemas/education.schema.json` | Schemat danych wykształcenia |
| `content/schemas/*.schema.json` | Pozostałe kontrakty danych JSON |

## Pliki aplikacji i renderery

| Plik | Rola |
| --- | --- |
| `package.json` | Skrypty Vite, build i walidacja treści |
| `src/app/content-loader.js` | Ładowanie publicznych JSON-ów i profili |
| `src/app/profile-resolver.js` | Wybór profilu przez `?p=` i fallback do `default` |
| `src/app/view-model.js` | Lokalizacja, filtrowanie statusów, sekcje i Hero |
| `src/app/bootstrap.js` | Składanie strony, `lang`, Hero i accordion |
| `src/components/hero-card.js` | Hero, PL/EN, avatar, PDF i publiczny link |
| `src/components/accordion.js` | Dostępny accordion z jednym otwartym panelem lub wszystkimi zamkniętymi |
| `src/sections/about-section.js` | Renderer O mnie |
| `src/sections/projects-section.js` | Renderer Projektów |
| `src/sections/experience-section.js` | Renderer Doświadczenia |
| `src/sections/education-section.js` | Renderer Wykształcenia |
| `src/sections/skills-section.js` | Renderer Umiejętności |
| `src/styles/components.css` | Hero, avatar, znaczniki szkiców i sekcje |
| `src/styles/accordion.css` | Style accordionu |
| `src/styles/print.css` | Wydruk i PDF |

## Decyzje przekrojowe

* Aktualny stos to Vite, Vanilla JavaScript, CSS i publiczne JSON-y bez frameworka frontendowego.
* UI składa się z jednej responsywnej karty CV.
* Zaimplementowane sekcje to O mnie, Projekty, Doświadczenie, Wykształcenie i Umiejętności.
* Nie ma osobnej gotowej sekcji kontaktowej; publiczny link pojawia się jako akcja Hero.
* `?preview=draft` jest redakcyjnym trybem podglądu, który pokazuje `published` i `draft` oraz można go łączyć z profilem, np. `?p=default&preview=draft`.
* `archived` jest zawsze ukryte, a puste sekcje nie są renderowane.
* Tryb podglądu nie jest zabezpieczeniem i nie zapewnia prywatności.
* Przełącznik PL/EN zmienia lokalizowane treści, oznaczenia `Szkic` / `Draft` i atrybut `lang` dokumentu.
* Hero obsługuje avatar `public/assets/identity/tomasz-talik-avatar.webp` wskazany jako `assets/identity/tomasz-talik-avatar.webp`.
* PDF powstaje przez `window.print()` z tego samego HTML i view modelu, bez osobnego szablonu.
* Brak produkcyjnego deploymentu; GitHub Pages pozostaje planowanym kierunkiem.

## Przyszłe obszary

Streamlit, Playwright, backend, automatyczny pipeline PDF i deployment produkcyjny pozostają przyszłe. Nie są częścią aktualnie zamkniętego przekroju.

## Lokalny edytor i profile firmowe

| Plik | Rola |
| --- | --- |
| `editor/app.py` | Lokalny edytor Streamlit generujący token, JSON profilu, link oraz szablony maila/listu |
| `editor/config.example.json` | Przykład lokalnej konfiguracji `deploymentBaseUrl` bez danych prywatnych |
| `content/schemas/company-profile.schema.json` | Schemat minimalnego publicznego profilu firmowego |
| `public/profiles/.gitkeep` | Katalog na ręcznie publikowane profile firmowe |

Profile firmowe są publicznymi minimalnymi nakładkami z `id` i `companyName`, wybieranymi przez `#p=<długi-token>`. Token nie jest autoryzacją ani ochroną danych.
