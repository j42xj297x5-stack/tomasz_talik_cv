"""Run from repository root with the editor's Python environment; no remote API calls."""
import json
from pathlib import Path
from streamlit.testing.v1 import AppTest

# Do not load any local credential into a test session.
assert not Path("editor/config.local.json").exists(), "Use a clean checkout without local editor secrets."
app = AppTest.from_file(str(Path("editor/app.py").resolve())).run()
assert not app.exception
assert next(w for w in app.selectbox if w.label == "Profil CV").value == "Game Dev"
public_token = app.session_state.company_profile_token
private_token = app.session_state.private_access_token
for label, expected in [("Game Dev", "gamedev"), ("IT / AI", "it-ai"), ("Game Dev", "gamedev")]:
    next(w for w in app.selectbox if w.label == "Profil CV").set_value(label)
    next(w for w in app.text_input if w.label == "Nazwa firmy").set_value("Firma testowa")
    next(w for w in app.button if w.label == "Generuj materiały").click().run()
    assert not app.exception
    exported = json.loads(next(w for w in app.text_area if w.label == "JSON profilu").value)
    assert set(exported) == {"id", "companyName", "cvVariant"}
    assert exported == {"id": public_token, "companyName": "Firma testowa", "cvVariant": expected}
    assert app.session_state.private_access_token == private_token
    assert any("Brakuje klucza" in w.value for w in app.error)
    assert any(w.label == "Temat maila" for w in app.text_input)
    assert any(w.label == "Treść krótkiego maila" for w in app.text_area)
    assert any(w.label == "Pełny list motywacyjny" for w in app.text_area)
print("PASS: both editor variants, default choice, JSON export, stable tokens and recruitment materials; no API calls.")
