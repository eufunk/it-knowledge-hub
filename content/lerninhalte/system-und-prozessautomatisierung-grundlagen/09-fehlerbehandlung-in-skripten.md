---
title: "Erkennung und Handling von Fehlern in Skripten"
description: "Fehlermeldungen und Logdateien verstehen, Fehler in Bash und PowerShell finden und beheben."
duration: "40 Minuten"
---

Jedes Skript enthält irgendwann einen Fehler. Entscheidend ist, wie schnell man ihn findet und wie gut das Skript damit umgeht. Dieses Kapitel führt durch den gesamten Weg: Fehlermeldungen verstehen, systematisch suchen, Logdateien auswerten, die Werkzeuge von Bash und PowerShell gezielt einsetzen und Fehler durch gutes Skript-Design von vornherein vermeiden. Einige Techniken wurden in den Kapiteln 4 und 5 bereits eingeführt. Hier werden sie zusammengeführt und an neuen Beispielen vertieft.

## Einführung in die Fehlerdiagnose

**Fehlerdiagnose** bedeutet, von einem beobachteten Symptom („Der Bericht kam nicht an“) zur eigentlichen Ursache („Das Passwort des Dienstkontos ist abgelaufen“) zu gelangen. Wer nur das Symptom behandelt, sieht den Fehler bald wieder. Fehler in Skripten lassen sich grob in fünf Arten einteilen:

| Fehlerart | Merkmal | Beispiel | Wie fällt er auf? |
| --- | --- | --- | --- |
| Syntaxfehler | Der Code verstößt gegen die Regeln der Sprache | Fehlendes `fi`, fehlende schließende Klammer | Sofort beim Start, `bash -n` oder Editor zeigt ihn an |
| Laufzeitfehler | Der Code ist korrekt, aber eine Aktion scheitert | Datei fehlt, Server nicht erreichbar, keine Rechte | Fehlermeldung und Exit-Code |
| Logikfehler | Das Skript läuft fehlerfrei, liefert aber ein falsches Ergebnis | Falscher Vergleich, Tippfehler im Variablennamen | Keine Meldung, nur ein falsches Ergebnis |
| Umgebungsfehler | Das Skript läuft hier, aber nicht dort | Anderer `PATH` unter cron, andere PowerShell-Version | Nur in bestimmten Umgebungen |
| Sporadische Fehler | Der Fehler tritt nur manchmal auf | Zeitüberschreitung im Netz, Monatsende, gleichzeitige Läufe | Unregelmäßig, schwer nachzustellen |

Logikfehler und sporadische Fehler sind am schwierigsten, weil keine Fehlermeldung direkt auf sie hinweist. Hier helfen vor allem Protokolle und Debugging-Werkzeuge.

## Fehlermeldungen

Eine **Fehlermeldung** ist die Rückmeldung eines Programms, dass eine Aktion nicht wie erwartet ausgeführt werden konnte. Gute Fehlermeldungen beantworten vier Fragen: **Wer** meldet den Fehler (Programm oder Befehl)? **Wo** trat er auf (Datei, Zeile, Spalte)? **Was** ist passiert (Beschreibung)? **Welcher** Fehler ist es genau (Kennung, Kategorie oder Exit-Code)?

**Aufbau einer Bash-Fehlermeldung:**

```text
./backup.sh: line 12: rsnyc: command not found
```

| Teil | Bedeutung |
| --- | --- |
| `./backup.sh` | Wer meldet: das Skript |
| `line 12` | Wo: Zeile 12 |
| `rsnyc` | Welcher Befehl: hier ein Tippfehler für `rsync` |
| `command not found` | Was: Befehl nicht gefunden; der Exit-Code ist 127 |

**Aufbau einer PowerShell-Fehlermeldung (Windows PowerShell 5.1):**

```powershell
Get-ChildItem : Der Pfad "C:\Berichte" kann nicht gefunden werden, da er nicht vorhanden ist.
In C:\Skripte\bericht.ps1:2 Zeichen:12
+ $dateien = Get-ChildItem -Path $ordner -Filter *.csv
+            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : ObjectNotFound: (C:\Berichte:String) [Get-ChildItem], ItemNotFoundException
    + FullyQualifiedErrorId : PathNotFound,Microsoft.PowerShell.Commands.GetChildItemCommand
```

| Teil | Bedeutung |
| --- | --- |
| `Get-ChildItem :` und Text | Welcher Befehl meldet was |
| `In ...bericht.ps1:2 Zeichen:12` | Datei, Zeile und Spalte des Fehlers |
| Zeile mit `~~~~` | Markiert den fehlerhaften Ausdruck |
| `CategoryInfo` | Fehlerkategorie (hier `ObjectNotFound`), betroffenes Objekt und Ausnahmetyp |
| `FullyQualifiedErrorId` | Eindeutige, **sprachunabhängige** Fehlerkennung. Ideal für die Suche im Internet, weil sie auf deutschen und englischen Systemen gleich lautet |

> **Tipp:** Fehlermeldungen erscheinen in der Sprache des Systems. Englische Meldungen findet man im Internet leichter. In der Bash liefert `LANG=C befehl` die englische Meldung, in PowerShell sucht man am besten nach der `FullyQualifiedErrorId`.

### Warum ist das Verständnis von Fehlermeldungen wichtig?

- **Zeit sparen:** Die Meldung nennt meist schon Ort und Art des Fehlers. Wer sie liest, statt zu raten, ist oft in Minuten fertig.
- **Ursache statt Symptom:** Erst das Verständnis der Meldung führt zur eigentlichen Ursache.
- **Folgefehler erkennen:** Ein einziger Fehler zieht oft viele weitere Meldungen nach sich. Wichtig ist meist die erste.
- **Besser kommunizieren:** Eine genaue Meldung im Ticket hilft Kolleginnen und Kollegen oder dem Hersteller sofort weiter.
- **Sicherheit:** Warnungen wie „Zertifikat ungültig“ oder „Zugriff verweigert“ können auf einen Angriff oder eine Fehlkonfiguration hinweisen und dürfen nicht weggeklickt werden.

### Schritte zum Verstehen von Fehlermeldungen

1. **Vollständig lesen:** die ganze Meldung, nicht nur die erste Zeile. Bei mehreren Meldungen mit der ersten beginnen, die späteren sind oft Folgefehler.
2. **Ort bestimmen:** Datei, Zeile und Befehl aus der Meldung entnehmen und die Stelle im Code öffnen.
3. **Art bestimmen:** Syntax, fehlende Datei, Rechte, Netzwerk, falscher Typ? Kategorie, Ausnahmetyp oder Exit-Code helfen dabei.
4. **Werte prüfen:** Welche Werte hatten die beteiligten Variablen? Oft ist eine Variable leer oder anders als erwartet.
5. **Nachstellen:** Den Befehl einzeln mit denselben Werten ausführen.
6. **Nachschlagen:** `man befehl`, `Get-Help Befehl -Full`, Herstellerdokumentation oder Suche nach der Fehlerkennung.
7. **Hypothese prüfen:** Eine Vermutung aufstellen, gezielt eine Sache ändern und erneut testen.

### Beispiele für häufige Fehlermeldungen

**Bash und Linux:**

| Meldung | Ursache | Lösung |
| --- | --- | --- |
| `command not found` (Exit-Code 127) | Tippfehler im Befehl oder Programm nicht im `PATH` | Schreibweise prüfen, `command -v name`, vollständigen Pfad verwenden |
| `Permission denied` (Exit-Code 126 beim Start) | Fehlendes Ausführrecht oder keine Rechte auf eine Datei | `chmod +x skript.sh`, Rechte mit `ls -l` prüfen |
| `No such file or directory` | Datei oder Pfad existiert nicht, oft relativer Pfad | Pfad mit `ls` prüfen, absolute Pfade verwenden |
| `syntax error near unexpected token` | Syntaxfehler, oft fehlendes `then`, `do` oder `;` | `bash -n skript.sh`, die Zeile davor prüfen |
| `syntax error: unexpected end of file` | Fehlendes `fi`, `done`, `esac` oder Anführungszeichen | Blöcke paarweise prüfen, Editor mit Syntaxhervorhebung |
| `unbound variable` | Nicht gesetzte Variable bei `set -u` | Tippfehler prüfen oder Standardwert `${var:-wert}` |
| `$'\r': command not found` | Windows-Zeilenenden | `dos2unix skript.sh` |
| `bad interpreter: No such file or directory` | Falscher Pfad in der Shebang-Zeile oder Windows-Zeilenende darin | Shebang prüfen, `dos2unix` |
| `integer expression expected` | Zahlenvergleich mit `-gt` usw. auf einen leeren oder nichtnumerischen Wert | Wert vorher prüfen, z. B. `[[ $x =~ ^[0-9]+$ ]]` |

**PowerShell (Meldungen von Windows PowerShell 5.1, deutsch):**

| Meldung (gekürzt) | Fehlerkennung | Ursache und Lösung |
| --- | --- | --- |
| Die Benennung "Get-Procss" wurde nicht als Name eines Cmdlet … erkannt. | `CommandNotFoundException` | Tippfehler oder Modul nicht geladen; mit `Get-Command` suchen |
| Der Pfad "C:\\gibtsnicht" kann nicht gefunden werden, da er nicht vorhanden ist. | `PathNotFound` | Pfad prüfen, vorher `Test-Path` |
| Es wurde kein Parameter gefunden, der dem Parameternamen "Pfad" entspricht. | `NamedParameterNotFound` | Parametername falsch; `Get-Help Befehl` zeigt die gültigen Namen |
| Es ist nicht möglich, eine Methode für einen Ausdruck aufzurufen, der den NULL hat. | `InvokeMethodOnNull` | Variable ist leer, weil ein vorheriger Befehl nichts geliefert hat |
| Die Variable "$unbekannt" kann nicht abgerufen werden, weil sie nicht festgelegt wurde. | `VariableIsUndefined` | Tippfehler im Variablennamen, durch `Set-StrictMode` sichtbar |
| Der Wert "abc" kann nicht in den Typ "System.Int32" konvertiert werden. | `InvalidCastFromStringToInteger` | Eingabe prüfen, Parameter mit Typ und Prüfattribut |
| Die Ausführung von Skripts ist auf diesem System deaktiviert. | `UnauthorizedAccess` | Ausführungsrichtlinie (Abschnitt 4.4) |

## Wie Du systematisch Fehler in Deinem Skript aufspürst

Planloses Ausprobieren kostet Zeit und erzeugt oft neue Fehler. Ein festes Vorgehen führt zuverlässiger zum Ziel:

| Schritt | Vorgehen | Hilfsmittel |
| --- | --- | --- |
| 1. Reproduzieren | Den Fehler gezielt auslösen: gleiche Eingaben, gleiche Umgebung, gleicher Benutzer | `sudo -u dienstkonto ./skript.sh`, Testdaten des Fehlertags |
| 2. Informationen sammeln | Fehlermeldung, Exit-Code, Logdateien, Zeitpunkt. Was hat sich seit dem letzten erfolgreichen Lauf geändert? | `echo $?`, `$Error[0]`, Logs, `git log`, `git diff` |
| 3. Eingrenzen | Den fehlerhaften Bereich verkleinern: Ausgaben einfügen, Teile auskommentieren, ein Minimalbeispiel bauen | `set -x`, `Set-PSDebug`, Haltepunkte |
| 4. Hypothese prüfen | Eine Vermutung aufstellen und genau eine Sache ändern | Testumgebung, Probelauf |
| 5. Ursache beheben | Die Ursache beseitigen, nicht nur das Symptom | Code, Konfiguration, Rechte |
| 6. Absichern | Einen Test für genau diesen Fall ergänzen, damit der Fehler nicht wiederkommt | Pester, Testskript, Eingabeprüfung |
| 7. Dokumentieren | Ursache und Lösung festhalten | Commit-Nachricht, Ticket, Wissensdatenbank (Abschnitt 2.9) |

**Bewährte Techniken zum Eingrenzen:**

- **Halbieren:** Ausgaben oder Prüfungen in der Mitte des Skripts einfügen. Ist dort noch alles richtig, liegt der Fehler in der zweiten Hälfte. So halbiert sich der Suchbereich mit jedem Schritt.
- **Vergleich mit der letzten funktionierenden Version:** `git diff` zeigt, was sich geändert hat. Bei vielen Änderungen findet `git bisect` die fehlerhafte Version automatisch durch Halbieren.
- **Umgebungen vergleichen:** `env | sort` bzw. `Get-ChildItem Env:` und `$PSVersionTable` in beiden Umgebungen ausgeben und vergleichen.
- **Minimalbeispiel:** Den Fehler in einem möglichst kleinen Skript nachstellen. Oft wird die Ursache dabei schon sichtbar.
- **Erklären:** Den Code Zeile für Zeile jemandem erklären, notfalls einer Gummiente. Beim lauten Erklären fallen falsche Annahmen auf.

## Logdateien: Wie Du sie liest und interpretierst, um Fehler zu finden

### Definition Logdateien

> **Definition:** **Logdateien** (Protokolldateien) sind fortlaufende Aufzeichnungen von Ereignissen, die Betriebssystem, Dienste, Anwendungen oder Skripte schreiben. Jeder Eintrag beschreibt, was wann wo passiert ist. Bei unbeaufsichtigten Skripten sind sie oft der einzige Hinweis darauf, was bei einem nächtlichen Fehler geschehen ist.

### Hauptmerkmale von Logdateien

- **Zeitstempel:** Jeder Eintrag hat Datum und Uhrzeit, idealerweise im sortierbaren Format `2026-10-02 06:00:01`.
- **Quelle:** Rechnername, Programm und oft die Prozess-ID.
- **Schweregrad:** Einordnung wie INFO, WARN oder ERROR.
- **Nachricht:** die eigentliche Beschreibung des Ereignisses.
- **Chronologische Reihenfolge:** Neue Einträge werden angehängt.
- **Format:** meist Text, zunehmend strukturiert (z. B. JSON) für die maschinelle Auswertung.
- **Rotation und Aufbewahrung:** Alte Logs werden archiviert und nach einer festgelegten Frist gelöscht, unter Linux z. B. mit `logrotate`.

| Stufe (syslog) | Nr. | Bedeutung |
| --- | --- | --- |
| `emerg` | 0 | System unbenutzbar |
| `alert` | 1 | Sofortiges Handeln nötig |
| `crit` | 2 | Kritischer Zustand |
| `err` | 3 | Fehler |
| `warning` | 4 | Warnung |
| `notice` | 5 | Normales, aber bemerkenswertes Ereignis |
| `info` | 6 | Information |
| `debug` | 7 | Ausführliche Details zur Fehlersuche |

**Wo liegen die Logs?**

| System | Ort | Anzeigen mit |
| --- | --- | --- |
| Linux, allgemein | `/var/log/syslog` (Debian/Ubuntu), `/var/log/messages` (Red Hat), systemd-Journal | `less`, `tail -f`, `journalctl` |
| Linux, Anmeldungen | `/var/log/auth.log` (Debian/Ubuntu), `/var/log/secure` (Red Hat) | `grep`, `journalctl -u ssh` |
| Windows | Ereignisanzeige: System, Anwendung, Sicherheit, `Microsoft-Windows-PowerShell/Operational` | `eventvwr.msc`, `Get-WinEvent` |
| Windows-Aufgabenplanung | `Microsoft-Windows-TaskScheduler/Operational` (Verlauf muss aktiviert sein) | Aufgabenplanung, `Get-WinEvent` |
| Eigene Skripte | Selbst festgelegt, z. B. `/var/log/meinskript.log` oder `D:\Logs` | Texteditor, `grep`, `Select-String` |

**Aufbau eines syslog-Eintrags:**

```text
Oct  2 03:00:01 srv01 CRON[2314]: (root) CMD (/opt/skripte/backup.sh)
```

| Teil | Bedeutung |
| --- | --- |
| `Oct  2 03:00:01` | Zeitstempel |
| `srv01` | Rechnername |
| `CRON[2314]` | Programm und Prozess-ID |
| `(root) CMD (/opt/skripte/backup.sh)` | Nachricht: cron startet das Backup-Skript als root |

### Warum sind Logdateien wichtig?

- **Nachträgliche Analyse:** Sie zeigen, was passiert ist, auch wenn niemand zugesehen hat.
- **Zeitliche Einordnung:** Mehrere Logs lassen sich über den Zeitstempel verknüpfen, z. B. Skript-Log und Mailserver-Log. Dafür müssen alle Systeme dieselbe Uhrzeit haben (NTP, Abschnitt 2.4).
- **Muster erkennen:** Häufen sich Fehler zu bestimmten Zeiten oder an bestimmten Tagen (Abschnitt 2.3)?
- **Nachweis:** Für Audits und Sicherheitsvorfälle sind Logs oft der einzige Beleg (Abschnitt 8.4.2).

**So liest und interpretierst Du Logs:**

1. Beim Zeitpunkt des Fehlers beginnen und von dort rückwärts nach der ersten Auffälligkeit suchen.
2. **Nach Schweregrad filtern:** zuerst ERROR, dann WARN.
3. **Ursache und Folge unterscheiden:** Der erste Fehler ist meist die Ursache, die folgenden sind Folgen.
4. **Auf Fehlendes achten:** Fehlt die Zeile „Lauf beendet“, wurde das Skript abgebrochen oder hart beendet.
5. **Mit einem erfolgreichen Lauf vergleichen:** Was steht dort, was hier nicht?
6. **Mehrere Quellen verknüpfen:** Skript-Log, System-Log und Logs der Gegenstelle zum selben Zeitpunkt ansehen.

```powershell
# die letzten 5 Fehler mit Zeilennummer
grep -n "ERROR" /var/log/bericht.log | tail -5
journalctl -p err --since "2026-10-01 05:00" --until "2026-10-01 07:00"
tail -f /var/log/bericht.log                          # live mitlesen
# Fehler mit den 2 Zeilen davor
Select-String -Path D:\Logs\bericht.log -Pattern 'ERROR' -Context 2,0
Get-WinEvent -FilterHashtable @{ LogName = 'Application'; Level = 2
                                 StartTime = (Get-Date).AddDays(-1) }
```

**Beispiel: erfolgreicher und fehlerhafter Lauf im Vergleich**

```powershell
2026-09-30 06:00:01 [INFO]  Bericht wird erstellt
2026-09-30 06:00:04 [INFO]  1.284 Datensätze gelesen
2026-09-30 06:00:09 [INFO]  Bericht per E-Mail versendet
2026-09-30 06:00:09 [INFO]  Lauf beendet

2026-10-01 06:00:01 [INFO]  Bericht wird erstellt
2026-10-01 06:00:02 [WARN]  Exportdatei ist 0 Byte groß
2026-10-01 06:00:02 [INFO]  0 Datensätze gelesen
2026-10-01 06:00:32 [ERROR] Versand fehlgeschlagen: Zeitüberschreitung bei smtp01
2026-10-01 06:00:32 [INFO]  Lauf beendet
```

Die Fehlermeldung nennt den Mailversand. Der erste Hinweis steht aber zwei Zeilen früher: Die Exportdatei war leer. Ein Blick in das Log des Exports zeigt, dass dieser an diesem Tag erst um 06:05 Uhr fertig war. Die eigentliche Ursache ist also ein Zeitproblem zwischen zwei Abläufen, die Zeitüberschreitung beim Mailserver ist ein zweites, davon unabhängiges Problem.

## Bash vs. PowerShell: Unterschiedliche Ansätze zur Fehlerbehebung

### Bash: Traditionelle Fehlerbehebung mit einem Hauch von Flexibilität

Die Bash kennt keine Fehlerobjekte. Ein Fehler zeigt sich nur auf zwei Wegen: als **Exit-Code** und als **Text auf stderr**. Standardmäßig läuft ein Skript nach einem Fehler einfach weiter. Die Fehlerbehandlung muss deshalb bewusst eingebaut werden: mit `set -e`, Prüfungen von `$?`, `||` und `trap`. Zur Fehlersuche dienen Ablaufverfolgung (`set -x`), eigene Ausgaben mit `echo` und `printf` und externe Werkzeuge wie `shellcheck`. Das ist einfach und flexibel, erfordert aber Disziplin.

### PowerShell: Moderne Fehlerbehebung mit eingebauten Tools

PowerShell erzeugt bei jedem Fehler ein **Fehlerobjekt** (`ErrorRecord`) mit Meldung, Ausnahmetyp, Kategorie, Fehlerkennung und Fundstelle. Alle Fehler einer Sitzung sammeln sich in `$Error`. PowerShell unterscheidet beendende und nicht beendende Fehler (Abschnitt 4.10) und bietet `try/catch/finally`, die Parameter `-ErrorAction` und `-ErrorVariable`, `Set-StrictMode`, `Set-PSDebug` und einen vollwertigen Debugger mit Haltepunkten in der Konsole, in der ISE und in VS Code.

### Vergleich und Anwendung

| Aufgabe | Bash | PowerShell |
| --- | --- | --- |
| Fehlerinformation | Exit-Code und Text auf stderr | Fehlerobjekt mit Typ, Kategorie und Fundstelle |
| Verhalten nach einem Fehler | Läuft weiter | Läuft bei nicht beendenden Fehlern weiter |
| Abbruch erzwingen | `set -e` | `-ErrorAction Stop`, `$ErrorActionPreference = 'Stop'` |
| Fehler abfangen | `if ! befehl`, `befehl \|\| ...`, `trap ... ERR` | `try/catch` |
| Immer aufräumen | `trap ... EXIT` | `finally` |
| Ablaufverfolgung | `set -x`, `bash -x` | `Set-PSDebug -Trace 1` oder `2` |
| Haltepunkte | `read -p`, `trap ... DEBUG`, bashdb | `Set-PSBreakpoint`, ISE, VS Code |
| Liste der Fehler | nicht vorhanden | `$Error`, `-ErrorVariable` |
| Strenge Regeln | `set -u`, `set -o pipefail` | `Set-StrictMode -Version Latest` |
| Statische Prüfung | `bash -n`, `shellcheck` | PSScriptAnalyzer |

In der Praxis entscheidet das Zielsystem über die Sprache (Abschnitt 7.2). Wer beide beherrscht, überträgt die Prinzipien: Fehler früh sichtbar machen, gezielt abfangen, immer aufräumen und jeden Lauf protokollieren.

## Fehlerbehebung in Bash

### Verwende -x und set für eine detaillierte Ausgabe

Die Ablaufverfolgung zeigt jeden Befehl mit den tatsächlich eingesetzten Werten (Abschnitt 5.2). Dadurch werden Fehler sichtbar, die im Code nicht auffallen. Im folgenden Skript ist ein Tippfehler versteckt:

```bash
quelle="/daten"
ziel="/backup"
cp -r "$quelle" "$zeil"
$ bash -x tippfehler.sh
+ quelle=/daten
+ ziel=/backup
+ cp -r /daten ''  # zweites Argument leer: Tippfehler "zeil"

$ bash -u tippfehler.sh
tippfehler.sh: line 3: zeil: unbound variable
```

Mit `set -u` wäre der Fehler sofort mit Zeilennummer gemeldet worden. Deshalb gehört `set -Eeuo pipefail` an den Anfang jedes Skripts.

### Überprüfe Exit-Codes mit $?

`$?` enthält den Exit-Code des **zuletzt** ausgeführten Befehls. Jeder weitere Befehl überschreibt ihn, auch ein `echo`:

```bash
ls /gibtsnicht 2>/dev/null
echo "Exit-Code: $?"      # Exit-Code: 2
echo "Exit-Code: $?"      # Exit-Code: 0  (Exit-Code des vorherigen echo!)
```

Den Wert deshalb sofort sichern oder den Befehl direkt in der Bedingung prüfen:

```bash
rsync -a /daten/ /backup/
rc=$?                                         # sofort sichern
if (( rc != 0 )); then
    echo "rsync fehlgeschlagen (Exit-Code $rc)" >&2
fi

if ! rsync -a /daten/ /backup/; then         # kürzer: direkt prüfen
    echo "rsync fehlgeschlagen" >&2
fi

grep "ERROR" app.log | sort | uniq -c        # Pipe aus drei Befehlen
echo "${PIPESTATUS[@]}"  # z. B. "1 0 0": grep fand nichts
```

### Nutze trap für saubere Exit-Routinen

Ein `trap` auf `EXIT` sorgt dafür, dass Aufräumarbeiten immer laufen, egal ob das Skript normal endet, mit `exit` abbricht oder durch `set -e` gestoppt wird. Ein `trap` auf `ERR` meldet die Fehlerstelle (Abschnitt 5.3.2):

```bash
#!/bin/bash
set -Eeuo pipefail
tmp=$(mktemp -d)

aufraeumen() {
    local rc=$?                               # Exit-Code des Skripts merken
    rm -rf "$tmp"
    echo "$(date '+%F %T') Ende mit Exit-Code $rc" >&2
}
trap aufraeumen EXIT
trap 'echo "FEHLER in Zeile $LINENO: $BASH_COMMAND" >&2' ERR

cp /daten/*.csv "$tmp"/
# ... weitere Verarbeitung im temporären Ordner ...
```

### Verwende bedingte Anweisungen zur Fehlerprüfung

Die beste Fehlerbehandlung verhindert, dass ein Befehl überhaupt scheitert. Bedingungen prüfen Voraussetzungen, bevor gehandelt wird (fail fast):

```bash
die() { echo "FEHLER: $*" >&2; exit 1; }

[[ $# -eq 2 ]]                  || die "Aufruf: $0 <Quellordner> <Tage>"
quelle="$1"; tage="$2"

[[ -d "$quelle" ]]              || die "Quellordner $quelle fehlt."
[[ -r "$quelle" ]]              || die "Keine Leserechte auf $quelle."
[[ "$tage" =~ ^[0-9]+$ ]]       || die "Tage muss eine ganze Zahl sein: $tage"
command -v rsync > /dev/null    || die "rsync ist nicht installiert."
frei=$(df --output=avail /backup | tail -1)   # freier Platz in KB
(( frei > 1048576 ))            || die "Weniger als 1 GB frei auf /backup."
```

### Debugging mit echo und printf

Gezielte Ausgaben zeigen den Zustand an kritischen Stellen. Sie gehören auf stderr, damit sie die eigentliche Ausgabe nicht verfälschen, und lassen sich über eine Variable ein- und ausschalten:

```text
debug() {
    if [[ "${DEBUG:-0}" == 1 ]]; then
        printf '[DEBUG] %s\n' "$*" >&2
    fi
}

# Aufruf mit Debug-Ausgaben: DEBUG=1 ./skript.sh
debug "Quelle: $quelle, Anzahl Dateien: ${#dateien[@]}"
```

> **Achtung:** Die kürzere Form `[[ "$DEBUG" == 1 ]] && echo ...` als letzte Zeile einer Funktion liefert den Exit-Code 1, wenn DEBUG nicht gesetzt ist. Mit `set -e` bricht das Skript dann beim ersten `debug`-Aufruf ab. Deshalb hier `if` verwenden.

`printf '%q'` zeigt unsichtbare Zeichen an. Damit lassen sich Logikfehler finden, bei denen zwei Werte gleich aussehen, aber verschieden sind. Im folgenden Beispiel stammt eine CSV-Datei aus Windows:

```bash
while IFS=';' read -r name status; do
    [[ "$name" == "name" ]] && continue
    printf 'Status: %q\n' "$status" >&2       # Status: $'aktiv\r'
    if [[ "$status" == "aktiv" ]]; then ...   # nie wahr!
done < konten.csv
```

Das Windows-Zeilenende `\r` hängt unsichtbar am Wert. `status=${status%$'\r'}` am Anfang der Schleife entfernt es.

### Leite Fehlerausgaben um

Fehlermeldungen getrennt von den Ergebnissen zu sammeln, erleichtert die Auswertung (Abschnitt 5.4):

| Ziel | Umleitung |
| --- | --- |
| Fehler in eine eigene Datei | `./skript.sh > ergebnis.txt 2> fehler.log` |
| Fehler an ein Log anhängen | `./skript.sh 2>> fehler.log` |
| Alles in eine Datei | `./skript.sh > alles.log 2>&1` |
| Fehler sehen und gleichzeitig speichern | `./skript.sh 2> >(tee -a fehler.log >&2)` |
| Ab einer Stelle im Skript alle Fehler umleiten | `exec 2>> /var/log/skript_fehler.log` |
| Eigene Meldung auf stderr | `echo "Fehler: ..." >&2` |

## Fehlerbehebung in PowerShell

### Verwende Set-PSDebug

`Set-PSDebug` ist das Gegenstück zu `set -x` in der Bash:

| Aufruf | Wirkung |
| --- | --- |
| `Set-PSDebug -Trace 1` | Jede ausgeführte Zeile wird angezeigt |
| `Set-PSDebug -Trace 2` | Zusätzlich Variablenzuweisungen und Funktionsaufrufe |
| `Set-PSDebug -Step` | Vor jeder Zeile wird gefragt, ob sie ausgeführt werden soll |
| `Set-PSDebug -Off` | Alles wieder ausschalten |

```text
Set-PSDebug -Trace 2
$a = 5
$b = $a * 2
Set-PSDebug -Off
DEBUG:    2+  >>>> $a = 5
DEBUG:     ! SET $a = '5'.
DEBUG:    3+  >>>> $b = $a * 2
DEBUG:     ! SET $b = '10'.
DEBUG:    4+  >>>> Set-PSDebug -Off
```

### Nutze Try-Catch-Finally-Blöcke

`try` umschließt den riskanten Code, `catch` reagiert auf Fehler, `finally` läuft immer, sogar nach einem `exit` im `catch`-Block. Mehrere `catch`-Blöcke behandeln verschiedene Fehlertypen unterschiedlich. Der allgemeine `catch` steht immer zuletzt (Abschnitt 4.10).

```powershell
$pfad = 'C:\Export\umsatz.csv'
try {
    Write-Log 'Bericht wird erstellt'
    $daten = Import-Csv -Path $pfad -Delimiter ';' -ErrorAction Stop
    Write-Log "$($daten.Count) Datensätze gelesen"
}
catch [IO.FileNotFoundException], [IO.DirectoryNotFoundException] {
    Write-Log "Exportdatei fehlt: $($_.Exception.Message)" -Stufe ERROR
    exit 3
}
catch {
    $zeileNr = $_.InvocationInfo.ScriptLineNumber
    $meldung = $_.Exception.Message
    Write-Log "Unerwarteter Fehler in Zeile ${zeileNr}: $meldung" -Stufe ERROR
    exit 1
}
finally {
    Write-Log 'Lauf beendet'
}
2026-10-02 08:55:18 [INFO] Bericht wird erstellt
2026-10-02 08:55:18 [ERROR] Exportdatei fehlt: Ein Teil des Pfades "C:\Export\umsatz.csv" konnte nicht gefunden werden.
2026-10-02 08:55:18 [INFO] Lauf beendet
```

**Aus der Praxis:** Fehlt nur die Datei, wirft `Import-Csv` eine `FileNotFoundException`. Fehlt der ganze Ordner, ist es eine `DirectoryNotFoundException`. Wer nur den ersten Typ abfängt, landet im allgemeinen `catch`. Welcher Typ tatsächlich auftritt, zeigt `$Error[0].Exception.GetType().FullName`.

### Überprüfe $Error

Die automatische Variable `$Error` sammelt alle Fehler der aktuellen Sitzung, der neueste steht an Position 0. Sie ist besonders nützlich, wenn ein Fehler schon passiert ist und man ihn nachträglich untersuchen will:

| Ausdruck | Liefert |
| --- | --- |
| `$Error[0]` | Den letzten Fehler |
| `$Error.Count` | Anzahl der gespeicherten Fehler (Standard: höchstens 256) |
| `$Error[0] \| Format-List * -Force` | Alle Details des letzten Fehlers |
| `$Error[0].Exception.GetType().FullName` | Genauer Ausnahmetyp, z. B. für einen passenden `catch`-Block |
| `$Error[0].InvocationInfo.PositionMessage` | Datei, Zeile und fehlerhafter Ausdruck |
| `$Error[0].ScriptStackTrace` | Aufrufkette: aus welcher Funktion wurde der Fehler ausgelöst |
| `$Error.Clear()` | Liste leeren, z. B. vor einem Test |

### Verwende den -ErrorAction-Parameter

`-ErrorAction` legt für **einen einzelnen Befehl** fest, wie er auf nicht beendende Fehler reagiert (Werte siehe Abschnitt 4.10). In PowerShell 7 kommt der Wert `Break` hinzu, der bei einem Fehler direkt in den Debugger wechselt. Mit `-ErrorVariable` landen die Fehler eines Befehls zusätzlich in einer eigenen Variable:

```powershell
Get-ChildItem -Path C:\gibtsnicht, C:\Windows\win.ini `
    -ErrorAction SilentlyContinue -ErrorVariable fehler

if ($fehler) {
    $erste = $fehler[0].Exception.Message
    Write-Warning "$($fehler.Count) Pfad(e) nicht gefunden: $erste"
}
```

Der vorhandene Pfad wird trotzdem verarbeitet, der fehlende wird still gesammelt und danach gezielt gemeldet. So bleibt die Ausgabe übersichtlich, ohne Fehler zu verschweigen.

### Nutze die $ErrorActionPreference-Variable

`$ErrorActionPreference` legt das Standardverhalten für **alle Befehle** im aktuellen Gültigkeitsbereich fest. Standard ist `Continue`. Am Anfang eines Automatisierungsskripts empfiehlt sich `Stop`, damit jeder Fehler abbricht oder im `catch` landet. Ein `-ErrorAction` am einzelnen Befehl hat Vorrang.

```powershell
$ErrorActionPreference = 'Stop'               # ab hier bricht jeder Fehler ab

# Ausnahme für einen Befehl, dessen Fehler erlaubt ist:
Get-Item C:\Temp\vielleicht.txt -ErrorAction SilentlyContinue
```

Ohne diese Einstellung läuft ein Skript nach einem Fehler weiter, oft mit leeren Variablen. Im Beispiel aus Abschnitt 9.2 meldete das Skript nach dem fehlgeschlagenen `Get-ChildItem` trotzdem „Gefunden: 0“ und arbeitete weiter.

> **Achtung:** `$ErrorActionPreference` wirkt nicht auf externe Programme wie `robocopy.exe` oder `git.exe`. Deren Erfolg prüft man über `$LASTEXITCODE`. Erst ab PowerShell 7.4 kann man mit `$PSNativeCommandUseErrorActionPreference = $true` auch dafür einen Abbruch erzwingen.

```powershell
robocopy D:\Daten \\nas01\backup /MIR
if ($LASTEXITCODE -ge 8) {
    throw "robocopy fehlgeschlagen (Exit-Code $LASTEXITCODE)"
}
```

Robocopy ist ein Sonderfall: Exit-Codes bis 7 bedeuten Erfolg mit unterschiedlichen Details, erst ab 8 liegt ein Fehler vor. Die Bedeutung von Exit-Codes immer in der Dokumentation des Programms nachlesen.

### Einsatz von Breakpoints in der PowerShell ISE

Ein **Breakpoint** (Haltepunkt) hält das Skript an einer bestimmten Stelle an. Dann lassen sich alle Variablen ansehen und der Code Zeile für Zeile weiter ausführen. Die Windows PowerShell ISE ist in Windows enthalten und für den Einstieg gut geeignet:

| Taste | Funktion |
| --- | --- |
| **F9** | Haltepunkt in der aktuellen Zeile setzen oder entfernen |
| **F5** | Skript starten bzw. bis zum nächsten Haltepunkt fortsetzen |
| **F10** | Nächste Zeile ausführen, Funktionen überspringen (Prozedurschritt) |
| **F11** | In eine aufgerufene Funktion hineinspringen (Einzelschritt) |
| **Umschalt + F11** | Aus der aktuellen Funktion herausspringen |
| **Umschalt + F5** | Debugging beenden |
| **Strg + Umschalt + F9** | Alle Haltepunkte entfernen |

Steht das Skript am Haltepunkt, zeigt die ISE den Wert einer Variablen, wenn man mit der Maus darauf zeigt. Im Konsolenbereich erscheint die Eingabeaufforderung `[DBG]`, in der man beliebige Befehle ausführen kann, z. B. `$zeile | Format-List`. Haltepunkte lassen sich auch per Befehl setzen, etwa an einer Zeile, bei einem Befehl oder wenn eine Variable geändert wird:

```powershell
Set-PSBreakpoint -Script .\import.ps1 -Line 18
Set-PSBreakpoint -Script .\import.ps1 -Command 'New-ADUser'
Set-PSBreakpoint -Script .\import.ps1 -Variable empfaenger -Mode Write
Get-PSBreakpoint | Remove-PSBreakpoint
```

Am `[DBG]`-Prompt steuern Kurzbefehle den Ablauf: `s` (Einzelschritt), `v` (Prozedurschritt), `o` (herausspringen), `c` (fortsetzen), `l` (Code anzeigen), `k` (Aufrufkette) und `q` (beenden).

> **Hinweis:** Die ISE unterstützt nur Windows PowerShell 5.1 und wird nicht mehr weiterentwickelt. Microsoft empfiehlt Visual Studio Code mit der PowerShell-Erweiterung. Die Tasten F9, F5, F10 und F11 funktionieren dort genauso, zusätzlich gibt es ein Fenster für überwachte Variablen und die Aufrufliste.

## Debugging-Tools: Deine Hilfsmittel bei der Fehlersuche

**Debugging-Tools** sind Programme und Funktionen, die helfen, Fehler zu finden und den Ablauf eines Programms zu verstehen. Sie zeigen, was ein Skript tatsächlich tut, statt was man glaubt, dass es tut.

### Warum sind Debugging-Tools wichtig?

- **Einblick statt Vermutung:** Variablenwerte und Ablauf werden sichtbar, während das Skript läuft.
- **Verborgene Fehler finden:** Logikfehler erzeugen keine Meldung, werden aber im Debugger sichtbar.
- **Zeit sparen:** Ein Haltepunkt ersetzt viele eingefügte und wieder entfernte Ausgaben.
- **Fehler vorab vermeiden:** Statische Prüfwerkzeuge finden Probleme, bevor das Skript überhaupt läuft.
- **Code verstehen:** Auch fremde oder ältere Skripte lassen sich Schritt für Schritt nachvollziehen.

### Erste Schritte mit Debugging-Tools

| Werkzeugart | Bash und Linux | PowerShell und Windows |
| --- | --- | --- |
| Statische Prüfung | `bash -n`, `shellcheck` | PSScriptAnalyzer, Syntaxprüfung im Editor |
| Ablaufverfolgung | `set -x`, `bash -x` | `Set-PSDebug -Trace` |
| Interaktiver Debugger | VS Code mit Erweiterung „Bash Debug“ (nutzt bashdb) | ISE, VS Code, `Set-PSBreakpoint` |
| Protokolle | Logdateien, `journalctl` | Logdateien, Ereignisanzeige, `Get-WinEvent` |
| Systemaufrufe und Dateizugriffe | `strace`, `lsof` | Process Monitor (Sysinternals) |
| Netzwerk | `curl -v`, `ss`, `tcpdump` | `Test-NetConnection`, Wireshark |

**Einstieg mit shellcheck:**

```bash
$ shellcheck backup.sh

In backup.sh line 5:
cp $quelle /backup/
   ^-----^ SC2086 (info): Double quote to prevent globbing and word splitting.

In backup.sh line 8:
echo "Ziel: $zeil"
            ^---^ SC2154 (warning): zeil is referenced but not assigned.
```

Jede Meldung hat eine Kennung wie SC2086. Unter dieser Kennung erklärt die shellcheck-Dokumentation das Problem ausführlich mit Beispielen. Installiert wird das Werkzeug unter Linux über die Paketverwaltung, z. B. `sudo apt install shellcheck`.

**Einstieg mit dem Debugger in VS Code:**

1. VS Code und die Erweiterung „PowerShell“ installieren (für Bash zusätzlich „Bash Debug“).
2. Skript öffnen und mit **F9** einen Haltepunkt an der verdächtigen Stelle setzen.
3. Mit **F5** starten. Das Skript hält am Haltepunkt an.
4. Im Bereich „Variablen“ die aktuellen Werte prüfen, bei Bedarf Ausdrücke unter „Überwachen“ eintragen.
5. Mit **F10** und **F11** schrittweise weitergehen und beobachten, wann ein Wert falsch wird.

### Best Practices

- **Erst reproduzieren, dann debuggen:** Ein Fehler, der sich nicht nachstellen lässt, lässt sich auch nicht gezielt untersuchen.
- **Vom Einfachen zum Aufwendigen:** zuerst Meldung und Log lesen, dann Ablaufverfolgung, dann Debugger.
- **Eine Änderung nach der anderen:** Sonst ist unklar, welche Änderung geholfen hat.
- **Nicht im Produktivsystem experimentieren:** Testumgebung und Testdaten verwenden.
- **Keine Geheimnisse ausgeben:** `set -x` und Debug-Ausgaben zeigen auch Passwörter und Tokens. Vor solchen Stellen `set +x` setzen und Debug-Logs nicht aufbewahren.
- **Aufräumen:** Haltepunkte und Testausgaben vor dem Einchecken entfernen oder hinter einen Debug-Schalter legen.
- **Aus jedem Fehler lernen:** Für jeden gefundenen Fehler einen Test ergänzen und die Ursache dokumentieren.

## Anwendungsbeispiele: Effektiver Einsatz von Debugging-Tools

**Beispiel 1: Skript läuft von Hand, aber nicht unter cron**

**Symptom:** Ein Backup-Skript funktioniert in der Konsole, der nächtliche Lauf über cron schlägt mit `command not found` fehl. **Werkzeug:** Vergleich der Umgebungen. Ein temporärer cron-Eintrag schreibt die Umgebung von cron in eine Datei:

```bash
* * * * * env > /tmp/env_cron.txt  # temporär in crontab -e eintragen

env | sort > /tmp/env_konsole.txt
sort /tmp/env_cron.txt | diff - /tmp/env_konsole.txt
```

**Ergebnis:** Unter cron fehlt `/usr/local/bin` im `PATH`, dort liegt das verwendete Programm. **Lösung:** `PATH` am Skriptanfang setzen oder den vollständigen Pfad verwenden, danach den temporären cron-Eintrag wieder löschen.

**Beispiel 2: Benutzerimport legt nur einen Teil der Konten an**

**Symptom:** Ein PowerShell-Skript importiert 120 neue Konten aus einer CSV-Datei, im Active Directory erscheinen aber nur 113. Fehlermeldungen gibt es keine. **Werkzeug:** Ein bedingter Haltepunkt, der nur bei verdächtigen Datensätzen anhält:

```text
Set-PSBreakpoint -Script .\import.ps1 -Line 18 -Action {
    if ([string]::IsNullOrWhiteSpace($zeile.Abteilung)) { break }
}
.\import.ps1
```

**Ergebnis:** Am Haltepunkt zeigt `$zeile | Format-List`, dass bei sieben Datensätzen die Abteilung leer ist. Das Skript überspringt solche Zeilen still in einem `if`, ohne es zu melden. **Lösung:** Die Daten vor dem Import prüfen (Prüfskript aus Abschnitt 6.2) und übersprungene Zeilen als Warnung protokollieren.

**Beispiel 3: Vergleich ist nie wahr**

**Symptom:** Ein Bash-Skript liest eine Kontenliste und meldet alle Konten als „nicht aktiv“, obwohl in der Datei „aktiv“ steht. **Werkzeug:** `printf '%q'` und `cat -A` machen unsichtbare Zeichen sichtbar:

```text
$ cat -A konten.csv
name;status^M$
lena;aktiv^M$
```

**Ergebnis:** Die Datei hat Windows-Zeilenenden, jeder Wert endet mit `\r`. **Lösung:** Zeilenenden mit `dos2unix` umwandeln oder im Skript entfernen (Abschnitt 9.6.5).

## Übung: Effektiver Einsatz von Debugging-Tools

Nun bist Du an der Reihe. Nachdem Du Dir unterschiedliche Anwendungsbeispiele von Debugging-Tools angeschaut hast, ist es bei dem nächsten Beispiel Deine Aufgabe zu sagen, wie ein solches Tool eingesetzt werden könnte.

**Ein Skript verursacht sporadische Fehler:** Du hast ein Skript, das automatisch tägliche Berichte generiert und versendet. An manchen Tagen läuft das Skript problemlos, an anderen Tagen tritt jedoch ein Fehler auf, und der Bericht wird nicht versendet. Du bist Dir unsicher, was diesen sporadischen Fehler verursacht, da das Skript in den meisten Fällen korrekt funktioniert.

**Aufgabe:** Nutze Dein Wissen über Debugging-Tools und ihre Anwendung, um zu erklären, welche Schritte Du unternehmen würdest und warum diese wichtig sind.

> **Tipp:** Ein sporadischer Fehler lässt sich nicht einfach live beobachten. Überlege zuerst, wie Du an Informationen über die fehlerhaften Läufe kommst, und erst dann, wie Du den Fehler nachstellst. Bearbeite die Übung selbst, bevor Du den Lösungsvorschlag in Abschnitt 9.11 liest.

## Lösungsvorschlag zur Übung

<details>
<summary>Lösungsvorschlag anzeigen</summary>

**Schritt 1: Protokollierung erweitern**

Bei sporadischen Fehlern fehlt meist die wichtigste Information: was an den fehlerhaften Tagen anders war. Deshalb zuerst jeden Schritt mit Zeitstempel protokollieren, inklusive Eingabewerten (Datum, Dateigröße, Anzahl Datensätze, Empfänger), Exit-Codes und vollständiger Fehlermeldungen. In PowerShell eignet sich dafür eine Funktion wie `Write-Log` aus Abschnitt 9.7.2 zusammen mit `try/catch/finally`, in der Bash die Umleitung von stderr in ein Log. **Warum:** Ohne Daten vom Fehlertag bleibt jede Analyse ein Raten.

**Schritt 2: Logs der fehlerhaften Tage auswerten und vergleichen**

Skript-Log, System-Log (Ereignisanzeige bzw. `journalctl`), Verlauf der Aufgabenplanung bzw. cron und das Log des Mailservers zum Fehlerzeitpunkt nebeneinanderlegen. Fehlerhafte und erfolgreiche Läufe vergleichen und nach Mustern suchen: Wochentag, Monatsende, Uhrzeit, Datenmenge, Feiertage. **Warum:** Muster grenzen die möglichen Ursachen stark ein (Abschnitt 9.4.3).

**Schritt 3: Hypothesen bilden**

| Mögliche Ursache | Typisches Muster im Log | Prüfung |
| --- | --- | --- |
| Datenquelle noch nicht fertig | Leere oder kleine Eingabedatei, Fehler an Tagen mit langem Export | Zeitstempel des Exports mit Start des Berichts vergleichen |
| Mailserver zeitweise nicht erreichbar | Zeitüberschreitung beim Versand | `Test-NetConnection smtp01 -Port 587` zum Fehlerzeitpunkt, Mailserver-Log |
| Anhang zu groß | Fehler am Monatsende, wenn der Bericht größer ist | Dateigröße protokollieren, Grenze des Mailservers prüfen |
| Sonderzeichen oder fehlende Werte in den Daten | Fehler nur bei bestimmten Datensätzen | Daten des Fehlertags im Test einlesen |
| Datumsgrenzfälle | Fehler am Monatsersten, Wochenende oder Jahreswechsel | Datumsberechnungen mit diesen Werten testen |
| Abgelaufene Zugangsdaten oder Zertifikate | Anmeldefehler ab einem bestimmten Tag | Ablaufdaten prüfen |
| Gleichzeitige Läufe oder volle Platte | Fehler, wenn andere Jobs laufen | Aufgabenplanung und Speicherplatz zum Fehlerzeitpunkt |

**Schritt 4: Fehler nachstellen und untersuchen**

Mit den Eingabedaten eines Fehlertags in einer Testumgebung ausführen. Mit `Set-PSDebug -Trace 1` bzw. `bash -x` den Ablauf verfolgen, an der Versandstelle einen Haltepunkt setzen und die Variablenwerte prüfen. Den Systemzustand gezielt herstellen, z. B. eine leere Exportdatei oder einen nicht erreichbaren Mailserver. **Warum:** Erst ein reproduzierbarer Fehler lässt sich sicher beheben und die Lösung überprüfen.

**Schritt 5: Ursache beheben und das Skript robuster machen**

- Eigentliche Ursache beheben, z. B. den Bericht erst starten, wenn der Export fertig ist, oder darauf warten.
- **Eingaben prüfen:** leere oder unvollständige Daten erkennen und melden, statt einen leeren Bericht zu versenden.
- **Vorübergehende Fehler abfangen:** Versand mit mehreren Versuchen und wachsender Pause (Abschnitt 7.3.2).
- **Fehler sichtbar machen:** `-ErrorAction Stop` bzw. `set -e`, aussagekräftiger Exit-Code und Alarm bei Fehlern.
- **Ausbleiben erkennen:** Eine Überwachung meldet, wenn bis 7 Uhr kein erfolgreicher Lauf protokolliert wurde (Heartbeat, Abschnitt 2.4).

**Schritt 6: Absichern und dokumentieren**

Für die gefundene Ursache einen Testfall anlegen, die Lösung einige Wochen beobachten und Ursache und Lösung im Ticket oder in der Wissensdatenbank festhalten. **Warum:** So kehrt der Fehler nicht unbemerkt zurück, und andere profitieren bei ähnlichen Problemen.

> **Kurz gesagt:** Bei sporadischen Fehlern führt der Weg über Daten: erst ausführlich protokollieren, dann Muster suchen, dann gezielt nachstellen und debuggen. Wer gleich den Debugger startet, wartet womöglich tagelang auf den nächsten Fehler.

</details>

## Finde das richtige Werkzeug für Deine Anforderungen

### Kriterien für den Vergleich von Debugging-Tools

| Kriterium | Leitfrage |
| --- | --- |
| Sprache und Plattform | Unterstützt das Werkzeug Bash, PowerShell 5.1, PowerShell 7, Linux, Windows? |
| Art der Analyse | Statisch (vor der Ausführung) oder dynamisch (während der Ausführung)? |
| Funktionsumfang | Haltepunkte, Einzelschritte, Variablenanzeige, bedingte Haltepunkte? |
| Einsatzort | Nur am Arbeitsplatz mit Oberfläche oder auch auf Servern ohne Oberfläche und per Fernzugriff? |
| Verfügbarkeit | Bereits vorhanden oder muss es installiert werden? Ist die Installation auf Servern erlaubt? |
| Lernaufwand | Wie schnell kann das Team das Werkzeug sinnvoll nutzen? |
| Integration | Lässt es sich in den Editor und in automatische Prüfungen (CI/CD) einbinden? |
| Kosten und Lizenz | Kostenlos, Open Source oder kostenpflichtig? |

### Beliebte Debugging-Tools im Vergleich

| Werkzeug | Für | Art | Stärken | Grenzen |
| --- | --- | --- | --- | --- |
| `bash -x` / `set -x` | Bash | Ablaufverfolgung | Überall vorhanden, keine Installation | Viel Ausgabe, keine Haltepunkte |
| shellcheck | Bash, sh | Statisch | Findet Quoting- und Logikfehler vor dem Start, gut für CI | Erkennt keine Laufzeitfehler |
| VS Code + Bash Debug (bashdb) | Bash | Interaktiver Debugger | Haltepunkte, Einzelschritte, Variablen | Installation nötig, auf Servern selten vorhanden |
| `Set-PSDebug` | PowerShell | Ablaufverfolgung | Eingebaut, zeigt auch Zuweisungen | Grob, viel Ausgabe |
| `Set-PSBreakpoint` | PowerShell | Haltepunkte in der Konsole | Eingebaut, auch auf Servern und per Fernzugriff | Bedienung über Befehle |
| PowerShell ISE | PowerShell 5.1 | Editor mit Debugger | In Windows enthalten, leicht zu bedienen | Nur 5.1, nicht mehr weiterentwickelt |
| VS Code + PowerShell | PowerShell 5.1 und 7 | Editor mit Debugger | Modern, plattformübergreifend, PSScriptAnalyzer integriert | Einrichtung nötig |
| PSScriptAnalyzer | PowerShell | Statisch | Regeln für Stil und Sicherheit, gut für CI | Erkennt keine Laufzeitfehler |
| strace | Linux, alle Programme | Systemaufrufe | Zeigt jeden Datei- und Netzwerkzugriff | Sehr viel Ausgabe |
| Process Monitor | Windows, alle Programme | Datei-, Registry-, Prozessereignisse | Sehr detailliert, Filter | Große Datenmengen, nur Windows |
| Wireshark / tcpdump | Netzwerk | Paketanalyse | Zeigt die tatsächliche Kommunikation | Fachwissen nötig, Datenschutz beachten |

**Welches Werkzeug für welches Problem?**

| Problem | Erste Wahl |
| --- | --- |
| Syntaxfehler oder typische Flüchtigkeitsfehler | `bash -n`, shellcheck, PSScriptAnalyzer |
| Falsche Werte, Logikfehler | Interaktiver Debugger mit Haltepunkten, `printf '%q'` |
| Ablauf verstehen, Fehler auf einem Server | `set -x` bzw. `Set-PSDebug`, `Set-PSBreakpoint` |
| Sporadische Fehler | Protokollierung und Log-Analyse |
| Datei nicht gefunden, Zugriff verweigert, ohne klare Meldung | strace bzw. Process Monitor |
| Verbindungsprobleme | `curl -v`, `Test-NetConnection`, Wireshark |

## Proaktive Fehlervermeidung durch gutes Skript-Design

### Definition Skript-Design

> **Definition:** **Skript-Design** ist die planvolle Gestaltung eines Skripts, bevor die erste Zeile Code entsteht: Aufbau, Aufteilung in Funktionen, Ein- und Ausgaben, Fehlerverhalten und Protokollierung. Ein gutes Design verhindert viele Fehler, bevor sie entstehen, und macht die übrigen leichter auffindbar. Fehlersuche ist teuer, Fehlervermeidung ist billig.

### Hauptmerkmale des Skript-Designs

| Merkmal | Umsetzung | Vermeidet |
| --- | --- | --- |
| Klare Struktur | Feste Vorlage: Hilfe, Parameter, Einstellungen, Funktionen, Hauptteil (Abschnitte 4.7 und 7.1) | Unübersichtlichen Code, vergessene Teile |
| Modularität | Kleine Funktionen mit genau einer Aufgabe | Seiteneffekte, schwer testbaren Code |
| Eingabeprüfung (fail fast) | Parameter, Dateien und Voraussetzungen am Anfang prüfen | Fehler mitten in der Verarbeitung, halbe Ergebnisse |
| Definierte Schnittstellen | Klare Parameter, Rückgabewerte und dokumentierte Exit-Codes | Missverständnisse zwischen Skripten und Aufrufern |
| Einheitliche Fehlerbehandlung | Strenge Regeln, zentrale Funktion für Fehlermeldungen, Aufräumen per `trap` bzw. `finally` | Still ignorierte Fehler, Datenreste |
| Protokollierung | Einheitliches Format mit Zeitstempel und Stufe, Fehler auf stderr | Fehler ohne Spuren |
| Konfiguration getrennt vom Code | Pfade und Grenzwerte in Parametern oder Konfigurationsdateien | Fehler durch Ändern von Code für jede Umgebung |
| Idempotenz | Vor jeder Änderung prüfen, ob sie nötig ist | Doppelte Objekte, Fehler bei Wiederholung |
| Lesbarkeit | Sprechende Namen, Kommentare zum Warum | Missverständnisse bei späteren Änderungen |
| Testbarkeit | Funktionen einzeln testbar, Probelauf-Modus | Ungetestete Sonderfälle |

Die Coding Challenge im folgenden Abschnitt setzt mehrere dieser Merkmale an einem kleinen Beispiel um: Eingabeprüfung, dokumentierte Exit-Codes, Fehlermeldungen auf stderr und protokollierte Verarbeitung.

## Coding Challenge

**Aufgabe:** Schreibe ein Bash-Skript, das eine Textdatei Zeile für Zeile einliest und den Inhalt ausgibt. Das Skript soll zuerst prüfen, ob ein Dateiname als Parameter übergeben wurde und ob die Datei existiert. Falls nicht, soll eine aussagekräftige Fehlermeldung an STDERR ausgegeben werden und das Skript mit einem entsprechenden Exit-Code beendet werden. Zusätzlich soll der Ablauf der Verarbeitung durch entsprechende Ausgaben dokumentiert werden.

**Vorgehen:**

1. Exit-Codes festlegen und im Kopfkommentar dokumentieren.
2. Zwei kleine Funktionen für Ablauf- und Fehlermeldungen schreiben. Beide geben auf stderr aus, damit die Ausgabe des Dateiinhalts sauber bleibt.
3. **Anzahl der Parameter prüfen:** keiner oder zu viele führen zu einer Fehlermeldung mit Aufrufhinweis.
4. **Datei prüfen:** existiert sie, ist sie eine reguläre Datei, ist sie lesbar?
5. Datei mit `while IFS= read -r` Zeile für Zeile lesen und mit Zeilennummer ausgeben.
6. Beginn und Ende der Verarbeitung mit der Anzahl gelesener Zeilen protokollieren.

<details>
<summary>Musterlösung anzeigen</summary>

**Musterlösung (datei\_lesen.sh):**

```text
#!/bin/bash
# Liest eine Textdatei Zeile für Zeile ein und gibt den Inhalt aus.
# Aufruf:     ./datei_lesen.sh <Datei>
# Exit-Codes: 0 = Erfolg, 2 = falscher Aufruf, 3 = Datei fehlt,
#             4 = keine reguläre Datei, 5 = Datei nicht lesbar
set -euo pipefail

log()    { printf '%s [INFO]   %s\n' "$(date '+%F %T')" "$*" >&2; }
fehler() { printf '%s [FEHLER] %s\n' "$(date '+%F %T')" "$*" >&2; }

# 1. Parameter prüfen
if [[ $# -eq 0 ]]; then
    fehler "Es wurde kein Dateiname übergeben."
    echo "Aufruf: $0 <Datei>" >&2
    exit 2
elif [[ $# -gt 1 ]]; then
    fehler "Zu viele Parameter ($#). Erwartet wird genau ein Dateiname."
    echo "Aufruf: $0 <Datei>" >&2
    exit 2
fi
datei="$1"

# 2. Datei prüfen
if [[ ! -e "$datei" ]]; then
    fehler "Die Datei '$datei' existiert nicht."
    exit 3
elif [[ ! -f "$datei" ]]; then
    fehler "'$datei' ist keine reguläre Datei."
    exit 4
elif [[ ! -r "$datei" ]]; then
    fehler "Die Datei '$datei' ist nicht lesbar (fehlende Rechte)."
    exit 5
fi

# 3. Datei Zeile für Zeile verarbeiten
log "Verarbeitung von '$datei' gestartet."
nr=0
while IFS= read -r zeile || [[ -n "$zeile" ]]; do
    nr=$((nr + 1))
    printf '%4d: %s\n' "$nr" "$zeile"
done < "$datei"

log "Verarbeitung beendet: $nr Zeilen gelesen."
exit 0
```

**Erläuterung der wichtigsten Zeilen:**

| Code | Erklärung |
| --- | --- |
| Kopfkommentar mit Exit-Codes | Aufrufer und spätere Leser wissen sofort, was jeder Code bedeutet. 2 für falschen Aufruf entspricht der üblichen Konvention (Abschnitt 5.3.1) |
| `log()` und `fehler()` mit `>&2` | Ablauf- und Fehlermeldungen gehen auf stderr. Der Dateiinhalt auf stdout lässt sich dadurch sauber umleiten, z. B. `./datei_lesen.sh notizen.txt > kopie.txt` |
| `printf` statt `echo` | Gibt Text unverändert aus, auch wenn er mit `-` beginnt oder Backslashes enthält |
| `[[ $# -eq 0 ]]`, `[[ $# -gt 1 ]]` | Prüft die Anzahl der Parameter und gibt einen Aufrufhinweis aus |
| `-e`, `-f`, `-r` | Existiert der Pfad, ist er eine reguläre Datei (kein Ordner), ist er lesbar? Jeder Fall bekommt eine eigene Meldung und einen eigenen Exit-Code |
| `IFS= read -r zeile` | `IFS=` erhält Leerzeichen am Zeilenanfang, `-r` erhält Backslashes |
| `\|\| [[ -n "$zeile" ]]` | Verarbeitet auch die letzte Zeile, wenn sie nicht mit einem Zeilenumbruch endet |
| `nr=$((nr + 1))` | Zählt die Zeilen. `((nr++))` würde bei `nr=0` mit `set -e` das Skript beenden (Abschnitt 5.2.2) |

**Testen:**

| Aufruf | Erwartetes Ergebnis |
| --- | --- |
| `./datei_lesen.sh` | „Es wurde kein Dateiname übergeben.“ und Aufrufhinweis, Exit-Code 2 |
| `./datei_lesen.sh a b` | „Zu viele Parameter (2) …“, Exit-Code 2 |
| `./datei_lesen.sh fehlt.txt` | „Die Datei 'fehlt.txt' existiert nicht.“, Exit-Code 3 |
| `./datei_lesen.sh /tmp` | „'/tmp' ist keine reguläre Datei.“, Exit-Code 4 |
| Datei ohne Leserecht (`chmod 000`) | „… ist nicht lesbar …“, Exit-Code 5 |
| Leere Datei | Start- und Endmeldung, „0 Zeilen gelesen“, Exit-Code 0 |
| Datei mit Einrückung, Backslash, Leerzeile und letzter Zeile ohne Umbruch | Alle Zeilen unverändert und nummeriert, Exit-Code 0 |
| `./datei_lesen.sh test.txt > kopie.txt` | Meldungen im Terminal, nur der Inhalt in `kopie.txt` |

**Beispielausgabe:**

```text
$ ./datei_lesen.sh test.txt
2026-10-02 08:54:56 [INFO]   Verarbeitung von 'test.txt' gestartet.
   1: Erste Zeile
   2:    eingerückt mit \Backslash
   3:
   4: letzte Zeile ohne Umbruch
2026-10-02 08:54:56 [INFO]   Verarbeitung beendet: 4 Zeilen gelesen.

$ ./datei_lesen.sh fehlt.txt
2026-10-02 08:54:55 [FEHLER] Die Datei 'fehlt.txt' existiert nicht.
$ echo $?
3
```

</details>
