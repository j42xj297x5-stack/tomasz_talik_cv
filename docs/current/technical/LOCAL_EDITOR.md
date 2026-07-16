# Lokalny edytor

## Zakres

Lokalny edytor działa w Streamlit i znajduje się w `editor/app.py`. Służy do przygotowania publicznego profilu firmy, prywatnego tokenu kontaktowego oraz materiałów mailowych/listowych. Nie wysyła wiadomości automatycznie.

## Uruchomienie

Zależności są w `editor/requirements.txt`.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r editor/requirements.txt
streamlit run editor/app.py
```

## Konfiguracja

Edytor czyta `editor/config.defaults.json` i opcjonalny `editor/config.local.json`. Konfiguracja lokalna ma pierwszeństwo przed domyślną. `editor/config.example.json` dokumentuje kształt lokalnych ustawień.

`editorAdminKey` pozostaje lokalny. Edytor nie pokazuje wartości wczytanej z `config.local.json`; można podać ręczne nadpisanie typu password tylko dla bieżącej sesji.

## Generowanie publicznego `p`

Edytor generuje token publicznego profilu firmy `p` i JSON:

```json
{
  "id": "<p>",
  "companyName": "<nazwa firmy>"
}
```

Plik trzeba ręcznie zapisać i opublikować jako `public/profiles/<p>.json`, a następnie wykonać deployment.

## Generowanie prywatnego `k`

Edytor generuje prywatny token `k`. Link do CV powstaje dopiero po poprawnej aktywacji `k` w Workerze przez `POST /admin/create`. Przycisk ponowienia aktywacji wysyła ten sam token bez generowania nowego `p` ani `k`.

## Komunikacja sieciowa

Adres Workera musi być pełnym adresem HTTPS bez `/profile` ani `/admin/create`. Edytor blokuje przekierowania HTTP, wymaga HTTPS, wysyła jawny `User-Agent` i prezentuje bezpieczną diagnostykę bez ujawniania sekretów. Dla aktywacji używa nagłówka `Authorization: Bearer <editorAdminKey>`.

## Linki projektów

Źródłem linków jest `content/public/links.json`, nie `projects.json`. Edytor pokazuje dwie grupy:

- Demo projektów.
- GitHub i repozytoria.

Wybrane linki mogą zostać wstawione do maila lub listu.

## Materiały komunikacyjne

Edytor generuje temat maila, krótki mail i pełny list motywacyjny na podstawie danych formularza, wybranych linków i aktywnego linku do CV. Nie wysyła maili i nie publikuje plików automatycznie.
