@echo off
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo Brak srodowiska .venv.
    echo Uruchom najpierw instalacja_edytora.cmd
    pause
    exit /b 1
)

.venv\Scripts\python.exe -m streamlit run editor\app.py
pause