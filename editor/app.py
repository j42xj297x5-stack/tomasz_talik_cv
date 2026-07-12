import json
import secrets
import socket
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parents[1]
CONFIG_LOCAL = Path(__file__).resolve().parent / "config.local.json"
PROJECTS_PATH = ROOT / "content" / "public" / "projects.json"
LINKS_PATH = ROOT / "content" / "public" / "links.json"
TOKEN_MIN = 32
TOKEN_MAX = 128


def load_json(path, default):
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        return default
    except json.JSONDecodeError:
        st.warning(f"Nie udało się odczytać pliku JSON: {path}")
        return default


def load_local_config(path):
    try:
        with path.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
    except FileNotFoundError:
        return {}, "missing", None
    except json.JSONDecodeError:
        return {}, "invalid", "Niepoprawny JSON w config.local.json. Popraw plik albo uzupełnij pola ręcznie."

    if not isinstance(data, dict):
        return {}, "invalid", "config.local.json musi zawierać obiekt JSON z nazwanymi polami."
    return data, "found", None


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
        label = localized(item.get("title") or item.get("label") or item.get("id"), language)
        url = item.get("url", "")
        summary = localized(item.get("summary"), language)
        if label:
            options.append({"id": item.get("id", label), "label": label, "url": url, "summary": summary})
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


def normalize_base_url(value):
    return value.strip()


def validate_worker_api_base_url(value):
    api_base = normalize_base_url(value).rstrip("/")
    if not api_base:
        return "", "missing", "Brakuje adresu API Workera."

    parsed = urllib.parse.urlparse(api_base)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return api_base, "invalid", "Adres API Workera musi być pełnym adresem zaczynającym się od http:// albo https://."

    if parsed.path.rstrip("/") in {"/profile", "/admin/create"}:
        return api_base, "invalid", "Podaj bazowy adres API Workera bez endpointu /profile ani /admin/create."

    return api_base, "configured", None


def build_cv_link(base_url, profile_token, private_token):
    fragment = urllib.parse.urlencode({"p": profile_token, "k": private_token})
    return f"{base_url}#{fragment}" if base_url else f"#{fragment}"


def activate_private_token(worker_api_base_url, editor_admin_key, private_token):
    api_base, worker_status, worker_error = validate_worker_api_base_url(worker_api_base_url)
    if worker_status != "configured":
        return False, worker_error or "Niepoprawny adres API Workera."
    if not editor_admin_key:
        return False, "Brakuje klucza administracyjnego edytora."

    payload = json.dumps({"token": private_token, "expiresAt": None}).encode("utf-8")
    request = urllib.request.Request(
        f"{api_base}/admin/create",
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {editor_admin_key}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        return False, f"Worker odrzucił aktywację tokenu (HTTP {error.code})."
    except urllib.error.URLError:
        return False, "Nie udało się połączyć z API Workera."
    except ValueError:
        return False, "Niepoprawny adres API Workera."
    except (TimeoutError, socket.timeout, json.JSONDecodeError, UnicodeDecodeError):
        return False, "Worker nie potwierdził aktywacji poprawną odpowiedzią JSON."

    if isinstance(data, dict) and data.get("ok") is True:
        return True, "Prywatny token został aktywowany w zewnętrznym API."
    return False, "Worker nie potwierdził aktywacji tokenu."


def selected_link_lines(selected_projects, selected_links):
    lines = []
    for item in selected_projects:
        lines.append(f"- {item['label']}")
    for item in selected_links:
        suffix = f" — {item['url']}" if item.get("url") else ""
        lines.append(f"- {item['label']}{suffix}")
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

config, config_status, config_error = load_local_config(CONFIG_LOCAL)
if config_error:
    st.error(config_error)
elif config_status == "missing":
    st.info("config.local.json: brak — używana jest konfiguracja ręczna.")

if st.button("Wygeneruj nowy token"):
    st.session_state.company_profile_token = secrets.token_urlsafe(32)
    st.session_state.private_access_token = secrets.token_urlsafe(32)
    st.session_state.private_token_activated = False

token = ensure_token()
private_token = ensure_private_token()

language = st.radio("Język treści", ["PL", "EN"], horizontal=True).lower()
projects = public_options(PROJECTS_PATH, language)
links = public_options(LINKS_PATH, language)

with st.form("profile_form"):
    deployment_base_url_input = st.text_input(
        "Adres wdrożonego CV",
        value="",
        help="Pozostaw puste, aby użyć deploymentBaseUrl z config.local.json.",
    )
    worker_api_base_url_input = st.text_input(
        "Bazowy adres API Workera",
        value="",
        help="Pozostaw puste, aby użyć workerApiBaseUrl z config.local.json. Podaj pełny adres http:// albo https:// bez /profile i /admin/create.",
    )
    editor_admin_key_input = st.text_input(
        "Klucz administracyjny edytora (pozostaw puste, aby użyć config.local.json)",
        value="",
        type="password",
    )
    company_name = st.text_input("Nazwa firmy", max_chars=120)
    role = st.text_input("Stanowisko")
    recruiter_name = st.text_input("Imię rekrutera")
    job_url = st.text_input("Adres ogłoszenia")
    motivation = st.text_area("Własny tekst uzasadnienia aplikacji")
    selected_project_labels = st.multiselect("Linki do projektów", [item["label"] for item in projects])
    selected_link_labels = st.multiselect("Linki do profilu GitHub i publicznych stron", [item["label"] for item in links])
    output_kind = st.radio("Generuj", ["Krótki mail", "Pełny list motywacyjny", "Oba"], index=2, horizontal=True)
    submitted = st.form_submit_button("Generuj materiały")

selected_projects = [item for item in projects if item["label"] in selected_project_labels]
selected_links = [item for item in links if item["label"] in selected_link_labels]
link_lines = selected_link_lines(selected_projects, selected_links)
deployment_base_url = deployment_base_url_input.strip() or str(config.get("deploymentBaseUrl") or "")
worker_api_base_url = worker_api_base_url_input.strip() or str(config.get("workerApiBaseUrl") or "")
worker_api_base_url, worker_status, worker_error = validate_worker_api_base_url(worker_api_base_url)
base_url = normalize_base_url(deployment_base_url)
editor_admin_key = editor_admin_key_input or str(config.get("editorAdminKey") or "")

with st.expander("Diagnostyka konfiguracji", expanded=True):
    st.write(f"config.local.json: {'znaleziony' if config_status == 'found' else 'brak' if config_status == 'missing' else 'niepoprawny'}")
    st.write(f"Adres Workera: {'skonfigurowany' if worker_status == 'configured' else 'brak' if worker_status == 'missing' else 'niepoprawny'}")
    st.write(f"Klucz administracyjny: {'wczytany' if bool(editor_admin_key) else 'brak'}")

if submitted:
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
