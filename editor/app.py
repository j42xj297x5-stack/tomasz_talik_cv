import json
import secrets
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parents[1]
CONFIG_LOCAL = Path(__file__).with_name("config.local.json")
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


def normalize_base_url(value):
    return value.strip()


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


def full_letter(language, recruiter_name, company_name, role, job_url, motivation, link_lines):
    greeting = f"Dear {recruiter_name}," if language == "en" and recruiter_name else ("Dear Hiring Team," if language == "en" else (f"Szanowna Pani / Szanowny Panie {recruiter_name}," if recruiter_name else "Szanowni Państwo,"))
    if language == "en":
        parts = [greeting, "", f"I would like to apply for the {role or 'selected'} role at {company_name}."]
        if job_url:
            parts.append(f"I am referring to the posting available here: {job_url}.")
        parts.append(motivation or "I see this role as a strong match for my practical project experience and careful, product-oriented way of working.")
        if link_lines:
            parts.extend(["", "For context, I am including selected public links:", *link_lines])
        parts.extend(["", "I would be happy to discuss how my experience can support your team.", "", "Best regards,", "Tomasz Talik"])
        return "\n".join(parts)
    parts = [greeting, "", f"Chciałbym zgłosić swoją kandydaturę na stanowisko {role or 'wskazane w ogłoszeniu'} w firmie {company_name}."]
    if job_url:
        parts.append(f"Odnoszę się do ogłoszenia dostępnego pod adresem: {job_url}.")
    parts.append(motivation or "Widzę w tej roli dobre dopasowanie do mojego praktycznego doświadczenia projektowego oraz uważnego, produktowego sposobu pracy.")
    if link_lines:
        parts.extend(["", "Dla kontekstu załączam wybrane publiczne linki:", *link_lines])
    parts.extend(["", "Chętnie opowiem więcej o tym, jak moje doświadczenie może wesprzeć Państwa zespół.", "", "Z poważaniem,", "Tomasz Talik"])
    return "\n".join(parts)


st.set_page_config(page_title="Lokalny edytor profili firmowych", layout="wide")
st.title("Lokalny edytor profili firmowych")
st.caption("Edytor działa lokalnie. Eksportowany JSON zawiera wyłącznie token i nazwę firmy.")

config = load_json(CONFIG_LOCAL, {})
if st.button("Wygeneruj nowy token"):
    st.session_state.company_profile_token = secrets.token_urlsafe(32)

token = ensure_token()

language = st.radio("Język treści", ["PL", "EN"], horizontal=True).lower()
projects = public_options(PROJECTS_PATH, language)
links = public_options(LINKS_PATH, language)

with st.form("profile_form"):
    deployment_base_url = st.text_input("Adres wdrożonego CV", value=config.get("deploymentBaseUrl", ""))
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
base_url = normalize_base_url(deployment_base_url)
cv_link = f"{base_url}#p={token}" if base_url else f"#p={token}"
profile_json = {"id": token, "companyName": company_name.strip()}
json_text = json.dumps(profile_json, ensure_ascii=False, indent=2)
subject = mail_subject(language, company_name.strip() or "<firma>", role.strip())
mail_text = short_mail(language, recruiter_name.strip(), company_name.strip() or "<firma>", role.strip(), cv_link, motivation.strip(), link_lines)
letter_text = full_letter(language, recruiter_name.strip(), company_name.strip() or "<firma>", role.strip(), job_url.strip(), motivation.strip(), link_lines)

if submitted or company_name:
    st.subheader("Profil firmowy")
    st.write(f"Nazwa pliku: `{token}.json`")
    st.write(f"Ścieżka docelowa: `public/profiles/{token}.json`")
    st.text_input("Link do CV", value=cv_link)
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
