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


## Stan implementacji

Lokalny edytor Streamlit jest zaimplementowany w `editor/app.py`. Działa bez API, backendu, bazy danych, połączeń sieciowych i automatycznego wysyłania maili. Opcjonalnie odczytuje `editor/config.local.json` z polem `deploymentBaseUrl`; brak tego pliku nie blokuje pracy, jeśli adres CV zostanie wpisany w formularzu.

Formularz przyjmuje adres wdrożonego CV, nazwę firmy, stanowisko, imię rekrutera, język PL/EN, adres ogłoszenia, własne uzasadnienie, wybrane linki z aktualnych `content/public/projects.json` i `content/public/links.json` oraz wybór krótkiego maila, listu albo obu. Token jest generowany przez `secrets.token_urlsafe(32)` i przechowywany w `session_state` do kliknięcia „Wygeneruj nowy token”. Eksportowany JSON zawiera dokładnie `id` i `companyName`; pozostałe dane formularza służą tylko lokalnym szablonom maila i listu.

## Aktywacja prywatnego tokenu

Edytor generuje dwa niezależne tokeny w `session_state`: publiczny `p` dla pliku `public/profiles/<p>.json` oraz prywatny `k` przez `secrets.token_urlsafe(32)`. Publiczny JSON zawiera dokładnie `id` i `companyName`; `k` nie trafia do nazwy pliku, ścieżki ani JSON-u. `editor/config.local.json` może zawierać `deploymentBaseUrl`, `workerApiBaseUrl` i `editorAdminKey`; klucz administracyjny pozostaje lokalny i nie jest wyświetlany w interfejsie. Przy generowaniu materiałów edytor wykonuje `POST <workerApiBaseUrl>/admin/create` z `Authorization: Bearer <editorAdminKey>` i body zawierającym tylko `token` oraz `expiresAt: null`. Finalny link `#p=<p>&k=<k>` jest pokazywany w mailu i liście dopiero po odpowiedzi `{"ok":true}`.
