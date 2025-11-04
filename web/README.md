# Werft-Portal (Statische Demo)

Eine rein statische Demo-Seite mit Login-Maske und einer fiktiven Kunden-/Auftragsübersicht. Es findet keine echte Authentifizierung statt; die Daten sind frei erfunden und dienen ausschließlich zu Demonstrationszwecken.

Demo-Zugang:
- Benutzername: `Admin`
- Passwort: `Admin123`

## Starten

Variante A – direkt aus dem Dateisystem öffnen:
1. Ordner `web/` öffnen
2. `index.html` doppelklicken (Standardbrowser öffnet die Seite)

Variante B – einfacher lokaler Webserver (empfohlen):

macOS/Linux (Python 3):
```bash
cd "$(dirname "$0")"/web
python3 -m http.server 8080
```
Dann im Browser: http://localhost:8080

## Funktionen
- Login-Formular (clientseitige Prüfung der Demo-Daten)
- Tabelle mit fiktiven „sensiblen“ Kundendaten (Name, E‑Mail, Telefon, Schiff, IMO, Auftrag, Betrag, IBAN maskiert)
- Live-Suche/Filter
- CSV-Export (der aktuell gefilterten Zeilen)
- Abmelden setzt die Ansicht zurück

## Sicherheitshinweis
Dies ist eine rein statische Demo ohne Backend. Zugangsdaten und „Datenbank“ liegen im Frontend vor und sind nicht geschützt. Nicht für Produktionszwecke geeignet.

