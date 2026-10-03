---
title: "Systemautomatisierung"
description: "Mit PowerShell und Bash wiederkehrende Admin-Aufgaben erledigen."
duration: "45 Minuten"
---

> **Platzhalter:** Der ausführliche Inhalt dieser Einheit folgt.

## PowerShell und Bash

```powershell
# Alle Dateien älter als 30 Tage im Temp-Ordner auflisten
Get-ChildItem $env:TEMP -File |
  Where-Object LastWriteTime -lt (Get-Date).AddDays(-30)
```

```bash
# Dasselbe unter Linux
find /tmp -type f -mtime +30
```

## Geplante Aufgaben und Cron

## Benutzer- und Dateiverwaltung automatisieren
