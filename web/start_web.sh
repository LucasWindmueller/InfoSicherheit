#!/usr/bin/env zsh
set -euo pipefail
SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR"
PORT=${1:-8080}
print "Starte lokalen Server auf http://localhost:$PORT (Strg+C zum Beenden)"
python3 -m http.server "$PORT"

