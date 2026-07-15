import json
import secrets
import socket
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parents[1]
EDITOR_DIR = Path(__file__).resolve().parent
CONFIG_DEFAULTS = EDITOR_DIR / "config.defaults.json"
CONFIG_LOCAL = EDITOR_DIR / "config.local.json"
LINKS_PATH = ROOT / "content" / "public" / "links.json"
TOKEN_MIN = 32
TOKEN_MAX = 128
EDITOR_USER_AGENT = "TomaszTalikCVEditor/1.0"


def load_json(path, default):
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        return default
    except json.JSONDecodeError:
        st.warning(f"Nie udało się odczytać pliku JSON: {path}")
        return default


def load_config_file(path, display_name):
    try:
        with path.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
    except FileNotFoundError:
        return {}, "missing", None
    except json.JSONDecodeError:
        return {}, "invalid", f"Niepoprawny JSON w {display_name}. Popraw plik albo uzupełnij pola ręcznie."

    if not isinstance(data, dict):
        return {}, "invalid", f"{display_name} musi zawierać obiekt JSON z nazwanymi polami."
    return data, "found", None


def load_editor_config():
    defaults, defaults_status, defaults_error = load_config_file(CONFIG_DEFAULTS, "config.defaults.json")
    local, local_status, local_error = load_config_file(CONFIG_LOCAL, "config.local.json")
    config = {**defaults, **local}
    return config, defaults_status, local_status, defaults_error, local_error


def localized(value, language):
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        return value.get(language.lower()) or value.get("pl") or next((item for item in value.values() if isinstance(item, str)), "")
    return ""


def public_options(path, language):
    data = load_json(path, {"items": []})
    options = []
    for item in data.get("items", []):
        if item.get("status") != "published":
            continue
        label = localized(item.get("label") or item.get("id"), language)
        url = str(item.get("url") or "").strip()
        kind = item.get("kind", "")
        if label and url:
            options.append({"id": item.get("id", label), "label": label, "url": url, "kind": kind})
    return options


def ensure_token():
    token = st.session_state.get("company_profile_token")
    if not isinstance(token, str) or not (TOKEN_MIN <= len(token) <= TOKEN_MAX):
        st.session_state.company_profile_token = secrets.token_urlsafe(32)
    return st.session_state.company_profile_token


def ensure_private_token():
    token = st.session_state.get("private_access_token")
    if not isinstance(token, str) or not (TOKEN_MIN <= len(token) <= TOKEN_MAX):
        st.session_state.private_access_token = secrets.token_urlsafe(32)
    return st.session_state.private_access_token


def clear_manual_admin_key():
    st.session_state.editor_admin_key_manual_v2 = ""


def normalize_base_url(value):
    return str(value or "").strip()


def validate_worker_api_base_url(value):
    api_base = normalize_base_url(value).rstrip("/")
    if not api_base:
        return "", "missing", "Brakuje adresu API Workera."

    parsed = urllib.parse.urlparse(api_base)
    if parsed.scheme != "https" or not parsed.netloc:
        return api_base, "invalid", "Adres API Workera musi być pełnym adresem HTTPS zaczynającym się od https://."

    path_segments = {segment for segment in parsed.path.split("/") if segment}
    if "profile" in path_segments or ("admin" in path_segments and "create" in path_segments):
        return api_base, "invalid", "Podaj bazowy adres API Workera bez endpointu /profile ani /admin/create."

    return api_base, "configured", None


def build_admin_create_endpoint(api_base):
    return f"{api_base.rstrip('/')}/admin/create"


def parse_endpoint_public_parts(endpoint):
    parsed = urllib.parse.urlparse(endpoint)
    return parsed.netloc, parsed.path


def response_body_kind(content_type):
    media_type = str(content_type or "").split(";", 1)[0].strip().lower()
    if media_type == "application/json" or media_type.endswith("+json"):
        return "json"
    if media_type == "text/html":
        return "html"
    return "other"


def parse_worker_error_body(body, content_type):
    body_kind = response_body_kind(content_type)
    if body_kind != "json":
        return None, body_kind
    try:
        data = json.loads(body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None, "other"
    if isinstance(data, dict):
        return data.get("error"), "json"
    return None, "json"


def http_status_message(status, worker_error=None, body_kind="json"):
    suffix = f" Kod Workera: {worker_error}." if worker_error else ""
    if status == 403 and body_kind == "html":
        return "HTTP 403: Żądanie zostało odrzucone przez warstwę Cloudflare przed odpowiedzią API."
    if body_kind != "json":
        return f"HTTP {status}: odpowiedź nie pochodziła z oczekiwanego API."
    messages = {
        401: "HTTP 401: brak autoryzacji. Sprawdź klucz administracyjny edytora.",
        403: "HTTP 403: odmowa dostępu. Klucz dotarł do API, ale Worker odrzucił operację.",
        404: "HTTP 404: nie znaleziono endpointu /admin/create. Sprawdź bazowy adres API Workera.",
        500: "HTTP 500: błąd po stronie Workera.",
    }
    return f"{messages.get(status, f'HTTP {status}: API Workera zwróciło błąd.')}{suffix}"


class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise urllib.error.HTTPError(req.full_url, code, "Przekierowanie zablokowane", headers, fp)


NO_REDIRECT_OPENER = urllib.request.build_opener(NoRedirectHandler)


def build_cv_link(base_url, profile_token, private_token):
    fragment = urllib.parse.urlencode({"p": profile_token, "k": private_token})
    return f"{base_url}#{fragment}" if base_url else f"#{fragment}"


def activate_private_token(worker_api_base_url, editor_admin_key, private_token):
    api_base, worker_status, worker_error = validate_worker_api_base_url(worker_api_base_url)
    if worker_status != "configured":
        return False, worker_error or "Niepoprawny adres API Workera."
    editor_admin_key = str(editor_admin_key or "").strip()
    if not editor_admin_key:
        return False, "Brakuje klucza administracyjnego edytora. Dodaj editorAdminKey w editor/config.local.json albo wpisz ręczne nadpisanie w Konfiguracji technicznej."

    endpoint = build_admin_create_endpoint(api_base)
    payload = json.dumps({"token": private_token, "expiresAt": None}).encode("utf-8")
    request = urllib.request.Request(
        endpoint,
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {editor_admin_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": EDITOR_USER_AGENT,
        },
    )

    try:
        with NO_REDIRECT_OPENER.open(request, timeout=10) as response:
            st.session_state.private_token_activation_http_status = response.status
            st.session_state.private_token_activation_worker_error = None
            st.session_state.private_token_activation_content_type = response.headers.get_content_type()
            st.session_state.private_token_activation_body_kind = response_body_kind(response.headers.get_content_type())
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read() if error.fp else b""
        content_type = error.headers.get_content_type() if error.headers else ""
        worker_error, body_kind = parse_worker_error_body(body, content_type)
        st.session_state.private_token_activation_http_status = error.code
        st.session_state.private_token_activation_content_type = content_type
        st.session_state.private_token_activation_body_kind = body_kind
        st.session_state.private_token_activation_worker_error = worker_error
        return False, http_status_message(error.code, worker_error, body_kind)
    except urllib.error.URLError:
        st.session_state.private_token_activation_http_status = None
        st.session_state.private_token_activation_content_type = None
        st.session_state.private_token_activation_body_kind = None
        return False, "Nie udało się połączyć z API Workera."
    except ValueError:
        st.session_state.private_token_activation_http_status = None
        st.session_state.private_token_activation_content_type = None
        st.session_state.private_token_activation_body_kind = None
        return False, "Niepoprawny adres API Workera."
    except (TimeoutError, socket.timeout, json.JSONDecodeError, UnicodeDecodeError):
        st.session_state.private_token_activation_http_status = None
        st.session_state.private_token_activation_content_type = None
        st.session_state.private_token_activation_body_kind = None
        return False, "Worker nie potwierdził aktywacji poprawną odpowiedzią JSON."

    if isinstance(data, dict) and data.get("ok") is True:
        return True, "Prywatny token został aktywowany w zewnętrznym API."
    return False, "Worker nie potwierdził aktywacji tokenu."


def selected_link_lines(selected_demos, selected_repositories):
    lines = []
    for item in [*selected_demos, *selected_repositories]:
        if item.get("url"):
            lines.append(f"- {item['label']} — {item['url']}")
    return lines


def mail_subject(language, company_name, role):
    if language == "en":
        return f"Application for {role} at {company_name}" if role else f"Application for {company_name}"
    return f"Aplikacja na stanowisko {role} — {company_name}" if role else f"Aplikacja — {company_name}"


def short_mail(language, recruiter_name, company_name, role, cv_link, motivation, link_lines):
    greeting = f"Dear {recruiter_name}," if language == "en" and recruiter_name else ("Hello," if language == "en" else (f"Dzień dobry, Pani/Panie {recruiter_name}," if recruiter_name else "Dzień dobry,"))
    if language == "en":
        body = [greeting, "", f"I am sending my application for the {role or 'selected'} role at {company_name}.", f"CV: {cv_link}"]
        if motivation:
            body.extend(["", motivation])
        if link_lines:
            body.extend(["", "Selected links:", *link_lines])
        body.extend(["", "Best regards,", "Tomasz Talik"])
        return "\n".join(body)
    body = [greeting, "", f"Przesyłam aplikację na stanowisko {role or 'wskazane w ogłoszeniu'} w firmie {company_name}.", f"CV: {cv_link}"]
    if motivation:
        body.extend(["", motivation])
    if link_lines:
        body.extend(["", "Wybrane linki:", *link_lines])
    body.extend(["", "Pozdrawiam,", "Tomasz Talik"])
    return "\n".join(body)


def full_letter(language, recruiter_name, company_name, role, job_url, cv_link, motivation, link_lines):
    greeting = f"Dear {recruiter_name}," if language == "en" and recruiter_name else ("Dear Hiring Team," if language == "en" else (f"Szanowna Pani / Szanowny Panie {recruiter_name}," if recruiter_name else "Szanowni Państwo,"))
    if language == "en":
        parts = [greeting, "", f"I would like to apply for the {role or 'selected'} role at {company_name}."]
        if job_url:
            parts.append(f"I am referring to the posting available here: {job_url}.")
        parts.append(f"CV: {cv_link}")
        parts.append(motivation or "I see this role as a strong match for my practical project experience and careful, product-oriented way of working.")
        if link_lines:
            parts.extend(["", "For context, I am including selected public links:", *link_lines])
        parts.extend(["", "I would be happy to discuss how my experience can support your team.", "", "Best regards,", "Tomasz Talik"])
        return "\n".join(parts)
    parts = [greeting, "", f"Chciałbym zgłosić swoją kandydaturę na stanowisko {role or 'wskazane w ogłoszeniu'} w firmie {company_name}."]
    if job_url:
        parts.append(f"Odnoszę się do ogłoszenia dostępnego pod adresem: {job_url}.")
    parts.append(f"CV: {cv_link}")
    parts.append(motivation or "Widzę w tej roli dobre dopasowanie do mojego praktycznego doświadczenia projektowego oraz uważnego, produktowego sposobu pracy.")
    if link_lines:
        parts.extend(["", "Dla kontekstu załączam wybrane publiczne linki:", *link_lines])
    parts.extend(["", "Chętnie opowiem więcej o tym, jak moje doświadczenie może wesprzeć Państwa zespół.", "", "Z poważaniem,", "Tomasz Talik"])
    return "\n".join(parts)


st.set_page_config(page_title="Lokalny edytor profili firmowych", layout="wide")
st.title("Lokalny edytor profili firmowych")
st.caption("Edytor działa lokalnie. Eksportowany JSON zawiera wyłącznie token i nazwę firmy.")

config, defaults_status, local_status, defaults_error, local_error = load_editor_config()
for error in (defaults_error, local_error):
    if error:
        st.error(error)

if st.button("Wygeneruj nowy token"):
    st.session_state.company_profile_token = secrets.token_urlsafe(32)
    st.session_state.private_access_token = secrets.token_urlsafe(32)
    st.session_state.private_token_activated = False

token = ensure_token()
private_token = ensure_private_token()

default_deployment_base_url = str(config.get("deploymentBaseUrl") or "")
default_worker_api_base_url = str(config.get("workerApiBaseUrl") or "")

language = st.radio("Język treści", ["PL", "EN"], horizontal=True).lower()
links = public_options(LINKS_PATH, language)
demo_links = [item for item in links if item.get("kind") == "demo"]
repository_links = [item for item in links if item.get("kind") in ("profile", "repository")]

with st.form("profile_form"):
    company_name = st.text_input("Nazwa firmy", max_chars=120)
    role = st.text_input("Stanowisko")
    recruiter_name = st.text_input("Imię rekrutera")
    job_url = st.text_input("Adres ogłoszenia")
    motivation = st.text_area("Własny tekst uzasadnienia aplikacji")
    selected_demo_labels = st.multiselect("Demo projektów", [item["label"] for item in demo_links])
    selected_repository_labels = st.multiselect("GitHub i repozytoria", [item["label"] for item in repository_links])
    output_kind = st.radio("Generuj", ["Krótki mail", "Pełny list motywacyjny", "Oba"], index=2, horizontal=True)
    submitted = st.form_submit_button("Generuj materiały")

with st.expander("Konfiguracja techniczna", expanded=False):
    deployment_base_url_input = st.text_input(
        "Docelowy adres CV",
        value=default_deployment_base_url,
        help="Wartość startowa pochodzi z config.defaults.json albo lokalnego nadpisania z config.local.json; zmiana działa w bieżącej sesji.",
    )
    worker_api_base_url_input = st.text_input(
        "Bazowy adres Workera",
        value=default_worker_api_base_url,
        help="Wartość startowa pochodzi z config.defaults.json albo lokalnego nadpisania z config.local.json. Podaj pełny adres https:// bez /profile i /admin/create.",
    )
    editor_admin_key_input = st.text_input(
        "Ręczne nadpisanie klucza administracyjnego",
        value="",
        type="password",
        key="editor_admin_key_manual_v2",
        help="Nie pokazuje wartości wczytanej z config.local.json; niepusta wartość działa tylko w bieżącej sesji.",
    )
    st.button("Wyczyść ręczne nadpisanie klucza", on_click=clear_manual_admin_key)

    deployment_base_url = deployment_base_url_input.strip()
    worker_api_base_url = worker_api_base_url_input.strip()
    worker_api_base_url, worker_status, worker_error = validate_worker_api_base_url(worker_api_base_url)
    base_url = normalize_base_url(deployment_base_url)
    base_url_status = "configured" if base_url else "missing"
    config_editor_admin_key_stripped = str(config.get("editorAdminKey") or "").strip()
    manual_editor_admin_key_stripped = str(editor_admin_key_input or "").strip()
    editor_admin_key = manual_editor_admin_key_stripped or config_editor_admin_key_stripped
    admin_create_endpoint = build_admin_create_endpoint(worker_api_base_url) if worker_status == "configured" else ""
    endpoint_host, endpoint_path = parse_endpoint_public_parts(admin_create_endpoint) if admin_create_endpoint else ("", "")

    st.write(f"config.defaults.json: {'znaleziony' if defaults_status == 'found' else 'brak' if defaults_status == 'missing' else 'niepoprawny'}")
    st.write(f"config.local.json: {'znaleziony' if local_status == 'found' else 'brak' if local_status == 'missing' else 'niepoprawny'}")
    st.write(f"Adres produkcyjny: {'skonfigurowany' if base_url_status == 'configured' else 'brak'}")
    st.write(f"Worker: {'skonfigurowany' if worker_status == 'configured' else 'brak' if worker_status == 'missing' else 'niepoprawny'}")
    st.write(f"Klucz administracyjny: {'wczytany' if editor_admin_key else 'brak'}")
    if endpoint_host and endpoint_path:
        st.write(f"Endpoint aktywacji: host `{endpoint_host}`, ścieżka `{endpoint_path}`")

selected_demos = [item for item in demo_links if item["label"] in selected_demo_labels]
selected_repositories = [item for item in repository_links if item["label"] in selected_repository_labels]
link_lines = selected_link_lines(selected_demos, selected_repositories)

retry_activation = st.button("Ponów aktywację tego samego tokenu", help="Wysyła ponownie bieżący prywatny token bez generowania nowego p ani k.")

if submitted or retry_activation:
    if worker_error:
        ok, message = False, worker_error
    else:
        ok, message = activate_private_token(worker_api_base_url, editor_admin_key, private_token)
    st.session_state.private_token_activated = ok
    st.session_state.private_token_activation_message = message

private_token_activated = st.session_state.get("private_token_activated") is True
cv_link = build_cv_link(base_url, token, private_token) if private_token_activated else ""
profile_json = {"id": token, "companyName": company_name.strip()}
json_text = json.dumps(profile_json, ensure_ascii=False, indent=2)
subject = mail_subject(language, company_name.strip() or "<firma>", role.strip())
mail_text = short_mail(language, recruiter_name.strip(), company_name.strip() or "<firma>", role.strip(), cv_link or "<link aktywny po aktywacji tokenu>", motivation.strip(), link_lines)
letter_text = full_letter(language, recruiter_name.strip(), company_name.strip() or "<firma>", role.strip(), job_url.strip(), cv_link or "<link aktywny po aktywacji tokenu>", motivation.strip(), link_lines)

if submitted or company_name:
    st.subheader("Profil firmowy")
    st.write(f"Nazwa pliku: `{token}.json`")
    st.write(f"Ścieżka docelowa: `public/profiles/{token}.json`")
    activation_message = st.session_state.get("private_token_activation_message")
    if private_token_activated:
        st.success(activation_message or "Prywatny token został aktywowany.")
        st.info("Publiczny profil firmy zapisujesz w public/profiles/. Prywatny token został aktywowany w zewnętrznym API i nie trafia do pliku JSON.")
        st.text_input("Link do CV", value=cv_link)
    else:
        if activation_message:
            st.error(activation_message)
        st.warning("Link z prywatnym tokenem pojawi się dopiero po poprawnej aktywacji w API Workera.")
    st.text_area("JSON profilu", value=json_text, height=130)
    st.download_button("Pobierz JSON", data=json_text, file_name=f"{token}.json", mime="application/json")

    st.subheader("Mail i list")
    st.text_input("Temat maila", value=subject)
    st.text_area("Wybrane linki", value="\n".join(link_lines), height=120)
    if output_kind in ("Krótki mail", "Oba"):
        st.text_area("Treść krótkiego maila", value=mail_text, height=260)
        st.download_button("Pobierz krótki mail TXT", data=mail_text, file_name="mail.txt", mime="text/plain")
    if output_kind in ("Pełny list motywacyjny", "Oba"):
        st.text_area("Pełny list motywacyjny", value=letter_text, height=360)
        st.download_button("Pobierz list TXT", data=letter_text, file_name="list-motywacyjny.txt", mime="text/plain")
