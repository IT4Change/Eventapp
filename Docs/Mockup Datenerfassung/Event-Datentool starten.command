#!/bin/zsh
# Doppelklicken startet das Event-Datentool und öffnet den Browser.
cd "$(dirname "$0")"
if lsof -i :8765 -sTCP:LISTEN > /dev/null 2>&1; then
  echo "Server läuft bereits – Browser wird geöffnet."
  open "http://localhost:8765"
else
  (sleep 1 && open "http://localhost:8765") &
  python3 Tool/server.py
fi
