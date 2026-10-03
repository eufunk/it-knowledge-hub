---
title: "Entwurf von Automatisierungsstrategien"
description: "Die passende Skriptsprache wählen und Fehler in Automatisierungsskripten vermeiden."
duration: "20 Minuten"
---

Kapitel 6 hat gezeigt, wie man herausfindet, **was** automatisiert werden soll. Eine **Automatisierungsstrategie** legt fest, **wie** das im ganzen Team einheitlich und dauerhaft geschieht: mit welchen Sprachen und Werkzeugen, nach welchen Qualitätsregeln und wie die Skripte betrieben werden. Ohne Strategie entstehen viele Einzelskripte in verschiedenen Sprachen, die nur ihre Autoren verstehen.

| Baustein | Leitfrage | Beispiel für eine Festlegung |
| --- | --- | --- |
| Ziele und Prioritäten | Was wird in welcher Reihenfolge automatisiert? | Bewertung und Priorisierung nach Kapitel 6, Überprüfung jedes Quartal |
| Technologie | Welche Sprachen und Werkzeuge sind Standard? | PowerShell für Windows, Bash für Linux, Python für Datenverarbeitung |
| Ablage und Versionierung | Wo liegt der Code? | Alle Skripte in einem Git-Repository, Änderungen nur per Pull Request |
| Qualitätsregeln | Woran muss sich jedes Skript halten? | Vorlage mit Hilfe, Parametern, Logging; Prüfung mit Linter; Vier-Augen-Prinzip |
| Betrieb | Wie, wo und mit welchen Rechten laufen Skripte? | Aufgabenplanung bzw. cron auf einem Automatisierungsserver, eigene Dienstkonten, Passwörter in einem Tresor |
| Überwachung | Wie fallen Fehler auf? | Zentrales Log, Alarm bei Exit-Code ungleich 0 |
| Verantwortung | Wer pflegt welches Skript? | Jedes Skript hat einen Verantwortlichen, eingetragen im Kopfkommentar |

Die folgenden Abschnitte vertiefen drei Kernfragen jeder Strategie: Was genau ist ein Automatisierungsskript, welche Sprache passt zu welcher Aufgabe, und wie hält man Fehler gering?

## Definition Automatisierungsskript

> **Definition:** Ein **Automatisierungsskript** ist ein Programm in einer Skriptsprache, das eine wiederkehrende Aufgabe vollständig oder teilweise ohne manuelles Eingreifen erledigt. Anders als ein einmal getippter Befehl oder ein schnelles Hilfsskript ist es für den **wiederholten, oft unbeaufsichtigten Einsatz** gebaut. Daraus ergeben sich besondere Anforderungen:

| Eigenschaft | Bedeutung |
| --- | --- |
| Wiederholbar | Liefert bei gleichen Eingaben immer das gleiche Ergebnis |
| Unbeaufsichtigt lauffähig | Braucht keine Eingaben am Bildschirm, alle Werte kommen aus Parametern oder Konfiguration |
| Parametrisiert | Pfade, Namen und Grenzwerte stehen nicht fest im Code, sondern werden übergeben |
| Idempotent | Mehrfaches Ausführen schadet nicht: Ist der Zielzustand schon erreicht, ändert das Skript nichts |
| Fehlertolerant | Prüft Voraussetzungen, erkennt Fehler und endet kontrolliert mit einem passenden Exit-Code |
| Nachvollziehbar | Protokolliert, was es wann getan hat |
| Dokumentiert und versioniert | Hat eine Hilfe, liegt in Git und hat einen Verantwortlichen |

Unabhängig von der Sprache haben gute Automatisierungsskripte denselben Aufbau. Die Kapitel 3 bis 5 zeigen die Umsetzung im Detail:

| Baustein | Bash | PowerShell |
| --- | --- | --- |
| Interpreter und Voraussetzungen | `#!/bin/bash` | `#Requires -Version 5.1` |
| Hilfe | Kopfkommentar, Funktion `usage()` | Kommentarbasierte Hilfe `<# .SYNOPSIS #>` |
| Parameter | `$1`, `${2:-standard}`, `getopts` | `param()` mit Prüfattributen |
| Strenge Regeln | `set -Eeuo pipefail` | `Set-StrictMode -Version Latest` |
| Konfiguration | Variablen am Anfang, `source config.conf` | Variablen am Anfang, `Import-PowerShellDataFile` |
| Funktionen | `name() { ... }` | `function Verb-Nomen { ... }` |
| Prüfungen | `[[ -d "$ziel" ]] \|\| exit 1` | `if (-not (Test-Path $ziel)) { throw ... }` |
| Fehlerbehandlung | `trap ... ERR EXIT` | `try/catch/finally` |
| Protokollierung | `log()` auf stdout/stderr, `logger` | `Write-Verbose`, `Add-Content` in eine Logdatei |
| Ergebnis melden | `exit 0` bzw. Fehlercode | `exit 0` bzw. Fehlercode |

Ein Automatisierungsskript durchläuft einen eigenen Lebenszyklus: Anforderung, Entwurf, Entwicklung, Test, Betrieb, Pflege und schließlich die Stilllegung, wenn die Aufgabe entfällt oder ein Werkzeug sie übernimmt. Auch das Abschalten gehört zur Strategie, damit keine vergessenen Skripte weiterlaufen.

## Auswahl der geeigneten Skriptsprachen

Es gibt nicht die beste Skriptsprache, sondern nur die passende für eine Aufgabe und Umgebung. In der Systemadministration haben sich drei Sprachen durchgesetzt:

| Merkmal | Bash | PowerShell | Python |
| --- | --- | --- | --- |
| Plattform | Linux, macOS, Windows über WSL oder Git Bash | Windows; PowerShell 7 auch Linux und macOS | Alle Plattformen |
| Vorinstalliert | Auf fast jedem Linux-System | Auf jedem Windows-System (5.1) | Auf vielen Linux-Systemen, unter Windows meist nicht |
| Datenmodell | Text | Objekte | Objekte und Datenstrukturen |
| Stärken | Programme verketten, Dateien und Prozesse, kurze Abläufe | Active Directory, Microsoft 365, Azure, Windows-Verwaltung | Datenverarbeitung, APIs, JSON, komplexe Logik, große Bibliothekenauswahl |
| Schwächen | Unübersichtlich bei komplexer Logik, nur ganze Zahlen, Fallstricke beim Quoting | Unter Linux weniger verbreitet, Unterschiede zwischen 5.1 und 7 | Muss oft erst installiert werden, Abhängigkeiten verwalten |
| Typischer Umfang | Bis etwa 100–200 Zeilen | Klein bis groß, auch Module | Klein bis sehr groß |

Daneben gibt es **deklarative Werkzeuge** wie Ansible, PowerShell DSC oder Intune-Richtlinien. Bei ihnen beschreibt man den gewünschten Zielzustand statt der einzelnen Schritte (Abschnitt 1.7). Sie sind oft die bessere Wahl, wenn viele Systeme dauerhaft gleich konfiguriert sein sollen. Die alte Windows-Stapelverarbeitung mit `.bat`-Dateien sollte für neue Automatisierungen nicht mehr verwendet werden.

### Entscheidungshilfen

Die folgenden Fragen führen in dieser Reihenfolge meist schnell zur passenden Lösung:

1. Gibt es bereits eine fertige Funktion? Self-Service-Portale, Gruppenrichtlinien, Intune oder eingebaute Funktionen eines Programms sind wartungsärmer als ein eigenes Skript.
2. Soll ein Zielzustand auf vielen Systemen dauerhaft gelten? Dann ein deklaratives Werkzeug wie Ansible oder DSC wählen.
3. Auf welchem System läuft die Aufgabe? Windows, Active Directory und Microsoft 365 sprechen für PowerShell, Linux-Server und Container für Bash.
4. Wie komplex ist die Logik? Viele Datenstrukturen, JSON, REST-APIs oder umfangreiche Berechnungen sprechen für Python oder PowerShell statt Bash.
5. Muss es auf mehreren Plattformen laufen? Dann Python oder PowerShell 7.
6. Was kann das Team? Eine Sprache, die alle beherrschen, ist wartbarer als die technisch elegantere Lösung, die nur eine Person versteht.
7. Ist es knapp? Bei zwei gleichwertigen Kandidaten hilft die Nutzwertanalyse aus Abschnitt 1.9.

| Situation | Empfehlung | Begründung |
| --- | --- | --- |
| Dateien auf einem Linux-Server aufräumen | Bash | Vorhanden, kurze Befehlsfolge mit Standardwerkzeugen |
| Benutzerkonten im Active Directory verwalten | PowerShell | Fertiges Modul `ActiveDirectory`, Objekte statt Text |
| Daten aus einer REST-API auswerten und als Bericht speichern | Python oder PowerShell | JSON und Datenstrukturen sind eingebaut |
| 50 Linux-Server identisch konfigurieren | Ansible | Deklarativ und idempotent, kein eigenes Skript pro Server |
| Prüfskript für Windows- und Linux-Server | Python oder PowerShell 7 | Läuft auf beiden Plattformen |
| Start- oder Einstiegsskript eines Containers | Bash oder `sh` | In jedem Linux-Image vorhanden |
| Ein Bash-Skript wächst über 200 Zeilen mit vielen Arrays | Umstieg auf Python prüfen | Bash wird bei komplexer Logik schwer wartbar |

**Faustregel:** So einfach wie möglich, so mächtig wie nötig. Die Sprache des Zielsystems ist meist die beste Wahl. Erst wenn sie an ihre Grenzen stößt, lohnt sich ein Wechsel.

### Beispiele

**Beispiel 1: Logdateien auf einem Linux-Webserver – Bash**

Logdateien einer Anwendung sollen nach 7 Tagen komprimiert und nach 30 Tagen gelöscht werden. Die Aufgabe besteht aus zwei Standardbefehlen auf einem Linux-System. Bash ist vorhanden und völlig ausreichend:

```bash
#!/bin/bash
# Komprimiert Logs älter als 7 Tage, löscht Archive älter als 30 Tage.
set -Eeuo pipefail

LOGDIR="${1:-/var/log/meineapp}"

[[ -d "$LOGDIR" ]] || { echo "Fehler: $LOGDIR fehlt." >&2; exit 1; }

find "$LOGDIR" -name "*.log" -mtime +7 -exec gzip {} \;
find "$LOGDIR" -name "*.log.gz" -mtime +30 -delete

echo "$(date '+%F %T') Bereinigung von $LOGDIR abgeschlossen."
```

Das Skript ist idempotent: Ein zweiter Lauf am selben Tag findet nichts mehr und ändert nichts. Eingeplant wird es per cron, z. B. täglich um 3 Uhr.

**Beispiel 2: Inaktive Benutzerkonten deaktivieren – PowerShell**

Konten, die seit 90 Tagen nicht angemeldet waren, sollen deaktiviert werden. Das Active Directory ist eine Windows-Umgebung, und PowerShell bringt dafür fertige Cmdlets mit. Erst wird ein Bericht erzeugt, dann mit `-WhatIf` geprüft und erst danach wirklich geändert:

```powershell
Import-Module ActiveDirectory

$inaktiv = Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly |
    Where-Object Enabled

$inaktiv | Select-Object Name, SamAccountName, LastLogonDate |
    Export-Csv -Path .\inaktive_konten.csv -NoTypeInformation -Delimiter ';'

$inaktiv | Disable-ADAccount -WhatIf  # erst prüfen, dann -WhatIf entfernen
```

**Beispiel 3: Ticket-Export auswerten – Python**

Ein Ticketsystem liefert seine Daten als JSON-Datei. Daraus soll eine CSV-Datei mit der Anzahl je Kategorie entstehen, und das Skript soll auf Windows- und Linux-Rechnern laufen. Python verarbeitet JSON direkt und läuft überall:

```powershell
#!/usr/bin/env python3
"""Fasst einen Ticket-Export (JSON) nach Kategorie zusammen."""
import csv
import json
import sys
from collections import Counter
from pathlib import Path

quelle = Path(sys.argv[1] if len(sys.argv) > 1 else "tickets.json")
ziel = quelle.with_suffix(".csv")

try:
    tickets = json.loads(quelle.read_text(encoding="utf-8"))
except (OSError, json.JSONDecodeError) as fehler:
    sys.exit(f"Fehler beim Lesen von {quelle}: {fehler}")

anzahl = Counter(t.get("kategorie", "unbekannt") for t in tickets)

with ziel.open("w", newline="", encoding="utf-8") as datei:
    schreiber = csv.writer(datei, delimiter=";")
    schreiber.writerow(["Kategorie", "Anzahl"])
    schreiber.writerows(anzahl.most_common())

print(f"{len(tickets)} Tickets ausgewertet, Ergebnis: {ziel}")
```

`sys.exit()` mit einer Meldung gibt diese auf stderr aus und beendet das Skript mit dem Exit-Code 1. Tickets ohne Kategorie werden als „unbekannt“ gezählt, statt einen Fehler auszulösen.

**Beispiel 4: Viele Linux-Server einheitlich konfigurieren – Ansible**

Auf 50 Webservern soll ein Zeitdienst installiert und aktiv sein. Ein Skript müsste für jeden Server prüfen, was schon vorhanden ist. Ansible beschreibt nur den Zielzustand und ändert nur, was abweicht:

```powershell
- name: Zeitsynchronisation auf allen Webservern
  hosts: webserver
  become: true
  tasks:
    - name: chrony ist installiert
      ansible.builtin.package:
        name: chrony
        state: present

    - name: chrony läuft und startet beim Booten
      ansible.builtin.service:
        name: chronyd
        state: started
        enabled: true
```

| Beispiel | Gewählt | Ausschlaggebend |
| --- | --- | --- |
| Logdateien bereinigen | Bash | Linux-System, zwei Standardbefehle, nichts zu installieren |
| Inaktive Konten deaktivieren | PowerShell | Active Directory, fertige Cmdlets, `-WhatIf` |
| Ticket-Export auswerten | Python | JSON, plattformübergreifend, gute Fehlerbehandlung |
| Server einheitlich konfigurieren | Ansible | Zielzustand auf vielen Systemen, idempotent |

## So minimierst Du Fehler in Automatisierungsskripten

Fehler in Automatisierungsskripten wiegen schwerer als Fehler bei Handarbeit: Ein Skript wiederholt denselben Fehler auf allen Systemen, läuft oft unbeaufsichtigt, und niemand bemerkt das Problem sofort. Die Grundhaltung lautet deshalb **defensives Programmieren**:

- **Keiner Eingabe vertrauen:** Parameter, Dateien und Antworten anderer Systeme können leer, falsch oder unvollständig sein.
- **Jede Annahme prüfen:** Existiert der Ordner, ist der Server erreichbar, reicht der Speicherplatz?
- **Fehler sichtbar machen:** Lieber kontrolliert abbrechen und melden, als still weiterzuarbeiten.
- **Schaden begrenzen:** Erst testen, dann im Kleinen anwenden, dann ausrollen.

### Typische Fehler in Automatisierungsskripten und wie Du diese Fehler vermeidest

| Typischer Fehler | Folge | So vermeidest Du ihn |
| --- | --- | --- |
| Variablen ohne Anführungszeichen | Dateinamen mit Leerzeichen zerfallen in mehrere Wörter, falsche Dateien werden bearbeitet | In Bash immer `"$variable"` schreiben, `shellcheck` verwenden |
| Fehler werden ignoriert | Das Skript läuft nach einem Fehler weiter und richtet Folgeschäden an | `set -Eeuo pipefail` bzw. `$ErrorActionPreference = 'Stop'` und `try/catch` |
| Feste Werte im Code | Für jeden Server oder jede Abteilung entsteht eine Kopie des Skripts | Parameter und Konfigurationsdateien verwenden |
| Fehlende Eingabeprüfung | Leere Variable führt z. B. zu `rm -rf /*` | Pflichtparameter, Prüfattribute, `${var:?Meldung}` |
| Relative Pfade | Unter cron oder der Aufgabenplanung ist das Arbeitsverzeichnis ein anderes, Dateien werden nicht gefunden | Absolute Pfade oder Pfade relativ zum Skriptordner |
| Annahmen über die Umgebung | Skript läuft von Hand, aber nicht unter cron oder auf einem anderen Server | `PATH` setzen, Voraussetzungen mit `command -v` bzw. `#Requires` prüfen |
| Passwörter im Skript | Zugangsdaten landen in Git, Backups und Logdateien | Passwort-Tresor, geschützte Dateien, Dienstkonten mit minimalen Rechten |
| Nicht idempotent | Ein zweiter Lauf legt Duplikate an oder bricht mit Fehler ab | Vorher prüfen, ob der Zielzustand schon besteht |
| Parallele Läufe | Zwei Instanzen bearbeiten dieselben Dateien gleichzeitig | Sperrdatei, z. B. mit `flock` |
| Keine Protokollierung | Fehler bleiben unbemerkt, Ursachen sind nicht nachvollziehbar | Log mit Zeitstempel, Exit-Codes, Alarm (Abschnitt 2.8) |
| Sonderfälle nicht getestet | Leere Listen, Umlaute, Leerzeichen oder sehr große Datenmengen lassen das Skript scheitern | Testfälle gezielt für Grenzfälle anlegen |
| Zeichenkodierung und Zeilenenden | Umlaute werden falsch dargestellt, Bash meldet `$'\r': command not found` | PowerShell 5.1: UTF-8 mit BOM; Bash: LF-Zeilenenden |
| Code ungeprüft übernommen | Kopierter Code aus dem Internet oder von einer KI passt nicht oder enthält Fehler | Jede Zeile verstehen und in einer Testumgebung prüfen |
| Massenänderung ohne Probelauf | Ein Fehler trifft sofort alle Systeme oder Konten | `-WhatIf` bzw. Probelauf, Sicherung, schrittweise Einführung |

**Arbeitsverzeichnis unabhängig machen:**

```powershell
# Bash: Ordner des Skripts ermitteln, egal von wo es gestartet wird
skriptdir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
source "$skriptdir/config.conf"
# PowerShell: $PSScriptRoot enthält den Ordner des Skripts
$pfad   = Join-Path -Path $PSScriptRoot -ChildPath 'config.psd1'
$config = Import-PowerShellDataFile -Path $pfad
```

**Idempotent arbeiten:**

```powershell
mkdir -p /backup/2026  # kein Fehler, wenn der Ordner schon existiert
# Zeile nur anfügen, wenn sie noch nicht vorhanden ist
grep -qxF "$eintrag" datei.txt || echo "$eintrag" >> datei.txt
# -Force: Existiert der Ordner schon, passiert nichts
New-Item -ItemType Directory -Path 'D:\Backup\2026' -Force | Out-Null
if (-not (Get-LocalUser -Name 'svc_backup' -ErrorAction SilentlyContinue)) {
    New-LocalUser -Name 'svc_backup' -NoPassword
}
```

**Parallele Läufe verhindern (Linux):**

```bash
exec 9> /var/lock/backup.lock  # Sperrdatei auf Deskriptor 9 öffnen
flock -n 9 || { echo "Backup läuft bereits." >&2; exit 1; }
```

`flock -n` versucht die Sperre zu bekommen und bricht sofort ab, wenn eine andere Instanz sie hält. Endet das Skript, wird die Sperre automatisch freigegeben, auch nach einem Absturz.

### Tipps und Tricks zur Fehlerminimierung in Deinen Skripten

**Vor dem Schreiben:**

- Den Ablauf einmal von Hand durchführen und jeden Schritt notieren (Prozesssteckbrief aus Abschnitt 6.1.1).
- Den Ablauf zuerst als Pseudocode oder Kommentarliste skizzieren und dann Schritt für Schritt mit Code füllen.
- **Klein anfangen:** eine funktionierende Grundversion, die später erweitert wird.

**Beim Schreiben:**

- **Strenge Regeln einschalten:** `set -Eeuo pipefail` bzw. `Set-StrictMode -Version Latest` und `$ErrorActionPreference = 'Stop'`.
- **Sprechende Namen:** `$tageBisLoeschung` statt `$t`, Funktionen nach dem Verb-Nomen-Schema.
- Kleine Funktionen mit genau einer Aufgabe. Sie lassen sich einzeln testen und wiederverwenden.
- Konstanten und Einstellungen an den Anfang oder in eine Konfigurationsdatei.
- **Kommentare erklären das Warum, nicht das Was:** „90 Tage laut Richtlinie IT-07“ statt „Zahl 90“.
- Einheitliche Vorlage für alle Skripte im Team verwenden (Abschnitte 4.7 und 5.2).

**Probelauf einbauen:**

Ein Probelauf-Modus (Dry Run) zeigt, was das Skript tun würde, ohne etwas zu ändern. PowerShell bietet das mit `-WhatIf` (Abschnitt 4.9), in Bash baut man es selbst:

```bash
DRY_RUN="${DRY_RUN:-1}"                      # Standard: nur anzeigen

run() {
    if [[ "$DRY_RUN" == 1 ]]; then
        echo "[DRY-RUN] $*"
    else
        "$@"
    fi
}

run rm -f "$alte_datei"                      # Aufruf: DRY_RUN=0 ./skript.sh
```

Steht der Probelauf als Standard eingestellt, kann ein versehentlicher Aufruf keinen Schaden anrichten. Erst `DRY_RUN=0` führt die Änderungen wirklich aus.

**Vorübergehende Fehler abfangen:**

Netzwerk- und Serverfehler sind oft nur kurz. Statt sofort abzubrechen, versucht das Skript es mehrmals mit wachsender Pause:

```bash
retry() {
    local versuche=$1; shift
    local i
    for ((i = 1; i <= versuche; i++)); do
        "$@" && return 0
        echo "Versuch $i von $versuche fehlgeschlagen: $*" >&2
        sleep $((i * 5))                     # 5, 10, 15 Sekunden warten
    done
    return 1
}

retry 3 curl -fsS https://intranet.example.com/health
```

**Automatisch testen:**

Funktionen lassen sich mit Testframeworks prüfen, in PowerShell mit **Pester**, in Bash z. B. mit bats. Tests decken gerade die Sonderfälle ab, die beim Ausprobieren vergessen werden. Beispiel: eine Funktion, die aus Vor- und Nachname einen Benutzernamen bildet:

```powershell
function ConvertTo-Benutzername {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Vorname,
        [Parameter(Mandatory)][string]$Nachname
    )
    $name = ('{0}.{1}' -f $Vorname.Trim(), $Nachname.Trim()).ToLower()
    $name = $name -replace '\s+', '-'  # Leerzeichen -> Bindestrich
    $ersatz = @{ 'ä' = 'ae'; 'ö' = 'oe'; 'ü' = 'ue'; 'ß' = 'ss' }
    foreach ($zeichen in $ersatz.Keys) {
        $name = $name.Replace($zeichen, $ersatz[$zeichen])
    }
    $name = $name.Normalize([Text.NormalizationForm]::FormD)
    $name = $name -replace '\p{Mn}', ''                          # é -> e
    $name -replace '[^a-z0-9.-]', ''  # Rest entfernen
}
# ConvertTo-Benutzername.Tests.ps1 (Pester 5)
BeforeAll { . $PSScriptRoot/ConvertTo-Benutzername.ps1 }

Describe 'ConvertTo-Benutzername' {
    It 'bildet vorname.nachname in Kleinbuchstaben' {
        ConvertTo-Benutzername 'Lena' 'Hoffmann' | Should -Be 'lena.hoffmann'
    }
    It 'ersetzt Umlaute und ß' {
        ConvertTo-Benutzername 'Jürgen' 'Groß' | Should -Be 'juergen.gross'
    }
    It 'entfernt Akzente' {
        ConvertTo-Benutzername 'René' 'Lefèvre' | Should -Be 'rene.lefevre'
    }
    It 'verbindet Doppelnamen mit Bindestrich' {
        ConvertTo-Benutzername 'Anna Lena' 'Müller' |
            Should -Be 'anna-lena.mueller'
    }
    It 'ignoriert Leerzeichen am Rand' {
        ConvertTo-Benutzername ' Tom ' 'Kraus ' | Should -Be 'tom.kraus'
    }
}
```

Gestartet werden die Tests mit `Invoke-Pester`. Windows bringt nur die alte Version 3.4 mit, die eine andere Schreibweise erwartet. Die aktuelle Version installiert man mit `Install-Module Pester -Scope CurrentUser -Force -SkipPublisherCheck`.

**Prüfen lassen und sicher einführen:**

- **Linter verwenden:** `shellcheck` für Bash, `PSScriptAnalyzer` für PowerShell, `pylint` oder `ruff` für Python.
- **Vier-Augen-Prinzip:** Eine zweite Person liest jede Änderung, bevor sie in den Betrieb geht.
- **Versionierung mit Git:** Jede Änderung ist nachvollziehbar und lässt sich zurücknehmen.
- **Testumgebung:** Neue Skripte zuerst in einer Test-OU, einer virtuellen Maschine oder einem Container ausprobieren (Abschnitt 5.6.3).
- **Schrittweise einführen:** erst ein Bericht, dann eine Änderung an wenigen Systemen, dann an allen.
- **Vor Massenänderungen sichern:** Export der betroffenen Objekte oder ein Backup, damit es einen Rückweg gibt.

**Checkliste vor dem Produktivbetrieb:**

| Prüfpunkt | Erledigt, wenn … |
| --- | --- |
| Hilfe und Kopfkommentar | Zweck, Parameter, Beispiel und Verantwortlicher sind beschrieben |
| Parameter und Konfiguration | Keine festen Pfade, Namen oder Passwörter im Code |
| Eingaben geprüft | Leere oder ungültige Werte führen zu einer klaren Fehlermeldung |
| Strenge Regeln | `set -Eeuo pipefail` bzw. Strict Mode und `Stop` sind aktiv |
| Idempotenz | Ein zweiter Lauf direkt nach dem ersten ändert nichts und meldet keinen Fehler |
| Probelauf | `-WhatIf` bzw. Dry Run wurde ausgeführt und geprüft |
| Linter und Tests | Keine Warnungen, Tests für Normal- und Sonderfälle laufen erfolgreich |
| Protokoll und Alarm | Jeder Lauf wird mit Zeitstempel protokolliert, Fehler lösen eine Benachrichtigung aus |
| Rechte | Das Skript läuft mit einem Dienstkonto mit minimalen Rechten |
| Review und Git | Eine zweite Person hat den Code gelesen, er liegt im Repository |
| Rückweg | Sicherung oder manueller Ablauf ist dokumentiert |

**Bezug zu den Übungen:** Die Aufgabenstellung in `Uebungen_01.10` verlangt ein eigenes Automatisierungsskript mit Begründung der Sprachwahl, Planung und Tests. Die Entscheidungshilfen aus 7.2.1 und die Checkliste oben eignen sich direkt als Gliederung für diese Übung.
