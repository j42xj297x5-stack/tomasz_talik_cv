# Lokalny edytor profili

## Cel

Dokument opisuje plan lokalnego edytora bez implementacji. Zależy od `docs/current/content/CONTENT_MODEL.md` i `docs/current/product/PERSONALIZATION_SYSTEM.md`.

## Technologia

Lokalny edytor profili jest planowany jako aplikacja Streamlit w katalogu `editor/`. Edytor ma działać lokalnie i pomagać w tworzeniu oraz walidacji profili firm.

## Odpowiedzialność edytora

Edytor ma docelowo:

* wybierać istniejące elementy treści przez stabilne identyfikatory;
* ustawiać kolejność sekcji, projektów i umiejętności;
* redagować krótką wiadomość do firmy w limicie 300–500 znaków;
* sprawdzać, czy profil nie kopiuje głównych danych;
* sprawdzać, czy profil nie zawiera danych prywatnych;
* przygotowywać dane zgodne z modelem wielojęzycznym.

## Ograniczenia

W tej fazie Streamlit nie jest implementowany. Nie powstaje backend, formularz produkcyjny ani kod aplikacji.

## Zależności

* Model danych: `docs/current/content/CONTENT_MODEL.md`.
* Personalizacja: `docs/current/product/PERSONALIZATION_SYSTEM.md`.
* Prywatność: `docs/current/security/ACCESS_AND_PRIVACY.md`.

