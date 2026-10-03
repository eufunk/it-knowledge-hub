---
title: "Aufbau fortgeschrittener Linux-Skripte"
description: "Debugging, Fehlerbehandlung, Performance und Sicherheit in Linux-Skripten."
duration: "35 Minuten"
---

Kapitel 3 hat die Grundlagen der Bash gezeigt. Skripte, die auf Servern unbeaufsichtigt laufen, müssen mehr können: Fehler erkennen und sauber reagieren, verständliche Meldungen liefern, Ressourcen schonen und sicher mit Rechten umgehen. Dieses Kapitel behandelt Debugging, Fehlerbehandlung, die Fehlerausgabe stderr, Performance und Sicherheit. Den Abschluss bilden eine Befehlsübersicht und eine Coding Challenge.

## Linux-Skripte

Ein **Linux-Skript** ist ein Shell-Skript, das auf einem Linux-System ausgeführt wird, meist mit der Bash. Linux-Skripte steuern einen großen Teil des Serverbetriebs: Sie laufen als geplante Aufgaben, starten Dienste, richten Container ein und erledigen Installationen und Wartung.

### Was macht Linux-Skripte aus?

- **Alles ist eine Datei:** Konfigurationen liegen als Text in `/etc`, Geräte in `/dev`, Prozessinformationen in `/proc`. Skripte können all das mit Textwerkzeugen lesen und ändern.
- **Kleine Werkzeuge kombinieren:** Jedes Programm erledigt eine Aufgabe gut. Skripte verbinden sie über Pipes zu größeren Abläufen. Das ist die sogenannte Unix-Philosophie.
- **Datenströme:** Jedes Programm hat eine Eingabe (stdin), eine Ausgabe (stdout) und eine Fehlerausgabe (stderr), die sich einzeln umleiten lassen.
- **Exit-Codes und Signale:** Programme melden Erfolg oder Fehler über eine Zahl und reagieren auf Signale wie Strg + C.
- **Benutzer und Rechte:** Jede Datei hat einen Besitzer, eine Gruppe und Rechte. Was ein Skript darf, hängt davon ab, unter welchem Benutzer es läuft.
- **Unbeaufsichtigte Ausführung:** Viele Skripte laufen ohne Bildschirm und ohne Benutzer, z. B. nachts über cron. Fehler müssen deshalb protokolliert werden.

| Einsatzort | Beschreibung | Beispiel |
| --- | --- | --- |
| cron | Zeitgesteuerte Ausführung, eingerichtet mit `crontab -e` | `0 2 * * * /opt/skripte/backup.sh` |
| systemd-Timer | Moderne Alternative zu cron mit Protokoll im Journal | `systemctl list-timers` |
| Anmeldeskripte | Laufen beim Öffnen einer Shell | `~/.bashrc`, `/etc/profile.d/*.sh` |
| Container | Startskript eines Containers | `ENTRYPOINT` im Dockerfile |
| CI/CD | Bauen, Testen und Ausliefern in Pipelines | Schritte in GitLab CI oder GitHub Actions |

**Aufbau eines cron-Eintrags:**

```bash
# ┌──────── Minute (0–59)
# │ ┌────── Stunde (0–23)
# │ │ ┌──── Tag im Monat (1–31)
# │ │ │ ┌── Monat (1–12)
# │ │ │ │ ┌ Wochentag (0–7, 0 und 7 = Sonntag)
# │ │ │ │ │
  0 2 * * * /opt/skripte/backup.sh >> /var/log/backup.log 2>&1
```

### Definition Unix-Betriebssysteme

> **Definition:** **Unix** wurde ab 1969 in den Bell Labs von Ken Thompson und Dennis Ritchie entwickelt. 1973 wurde es in der Programmiersprache C neu geschrieben und konnte dadurch auf viele Rechnertypen übertragen werden. Als **Unix-Betriebssysteme** oder unixoide Systeme bezeichnet man alle Systeme, die nach den Prinzipien von Unix aufgebaut sind. Der Standard **POSIX** legt eine gemeinsame Schnittstelle fest, z. B. für die Shell und grundlegende Befehle. Skripte, die nur POSIX-Funktionen nutzen, laufen auf allen diesen Systemen.

| System | Einordnung | Typischer Einsatz |
| --- | --- | --- |
| Linux | Unixoid. Kernel seit 1991 von Linus Torvalds, verteilt als Distributionen wie Debian, Ubuntu, Red Hat Enterprise Linux oder SUSE | Server, Cloud, Container, Netzwerkgeräte, Android |
| macOS | Zertifiziertes Unix auf BSD-Basis | Arbeitsplatzrechner |
| FreeBSD, OpenBSD | Nachfolger des Berkeley-Unix (BSD) | Server, Firewalls, Netzwerktechnik |
| AIX, HP-UX, Solaris | Kommerzielle Unix-Systeme großer Hersteller | Großrechner und Unternehmenssysteme |

Gemeinsam sind diesen Systemen einige Grundprinzipien:

- **Mehrbenutzer- und Mehrprozessbetrieb:** Viele Benutzer und Programme arbeiten gleichzeitig, getrennt durch Rechte.
- **Ein einziger Verzeichnisbaum:** Alles hängt unter der Wurzel `/`. Laufwerksbuchstaben wie unter Windows gibt es nicht.
- **Alles ist eine Datei:** Geräte, Prozessinformationen und Konfigurationen werden wie Dateien angesprochen.
- **Textbasierte Konfiguration:** Einstellungen stehen in lesbaren Textdateien statt in einer Registry.

| Verzeichnis | Inhalt |
| --- | --- |
| `/bin`, `/usr/bin` | Programme für alle Benutzer |
| `/sbin`, `/usr/sbin` | Programme zur Systemverwaltung |
| `/etc` | Konfigurationsdateien |
| `/home` | Persönliche Verzeichnisse der Benutzer, `/root` für den Administrator |
| `/var/log` | Logdateien |
| `/tmp` | Temporäre Dateien, für alle beschreibbar, wird beim Neustart oft geleert |
| `/opt` | Zusätzlich installierte Software, häufig auch eigene Skripte |
| `/proc`, `/sys` | Virtuelle Dateisysteme mit Informationen zu Prozessen und Kernel |
| `/dev` | Gerätedateien, z. B. Festplatten oder `/dev/null` |

### Wie unterscheidet sich der Aufbau von Linux-Skripten im Vergleich zu Skripten anderer Betriebssysteme?

| Aspekt | Linux (Bash) | Windows (PowerShell) | Windows (cmd/Batch) |
| --- | --- | --- | --- |
| Interpreter festlegen | Shebang `#!/bin/bash` | Dateiendung `.ps1` | Dateiendung `.bat` oder `.cmd` |
| Ausführung erlauben | `chmod +x` | Ausführungsrichtlinie | Immer erlaubt |
| Dateiendung | Beliebig, `.sh` ist Konvention | Pflicht | Pflicht |
| Zeilenende | LF | CRLF oder LF | CRLF |
| Pfade | `/home/anna`, Groß- und Kleinschreibung zählt | `C:\Users\anna`, keine Unterscheidung | Wie PowerShell |
| Datenmodell | Text | Objekte | Text |
| Variablen | `name=wert`, `$name` | `$name = 'wert'` | `set name=wert`, `%name%` |
| Fehlerprüfung | `$?`, `set -e`, `trap` | `try/catch`, `$?`, `$LASTEXITCODE` | `%ERRORLEVEL%` |
| Zeitsteuerung | cron, systemd-Timer | Aufgabenplanung | Aufgabenplanung |

> **Wichtig:** `#!/bin/sh` und `#!/bin/bash` sind nicht dasselbe. Auf Debian und Ubuntu ist `/bin/sh` die schlanke Shell dash, die z. B. `[[ ]]` und Arrays nicht kennt. Wer Bash-Funktionen nutzt, schreibt `#!/bin/bash` oder `#!/usr/bin/env bash`.

## Debugging in Linux-Skripten

Die Bash hat keinen grafischen Debugger wie VS Code für PowerShell. Stattdessen gibt es Shell-Optionen, die jeden Schritt sichtbar machen, den Befehl `trap` für Reaktionen auf Ereignisse und Prüfwerkzeuge wie `bash -n` und `shellcheck`.

### Verstehe und nutze den set-Befehl

Mit `set` schaltet man Optionen der laufenden Shell ein oder aus: `set -x` schaltet ein, `set +x` wieder aus. Dieselben Optionen lassen sich beim Start angeben, z. B. `bash -x skript.sh`. `set -o` listet alle Optionen mit ihrem Zustand, `echo $-` zeigt die aktiven Kurzformen.

| Option | Langform | Wirkung |
| --- | --- | --- |
| `-e` | `errexit` | Skript bricht ab, sobald ein Befehl fehlschlägt. Ausnahmen: Bedingungen in `if` und `while` sowie Befehle vor `&&` oder `\|\|` |
| `-u` | `nounset` | Zugriff auf eine nicht gesetzte Variable ist ein Fehler |
| `-o pipefail` | `pipefail` | Eine Pipe gilt als fehlgeschlagen, wenn irgendein Teil fehlschlägt, nicht nur der letzte |
| `-x` | `xtrace` | Jeder Befehl wird vor der Ausführung mit eingesetzten Werten und einem `+` ausgegeben |
| `-v` | `verbose` | Jede Zeile wird so ausgegeben, wie sie gelesen wird, also vor dem Einsetzen der Werte |
| `-n` | `noexec` | Befehle werden nur gelesen, nicht ausgeführt: reine Syntaxprüfung |
| `-E` | `errtrace` | Ein `ERR`-Trap gilt auch in Funktionen und Subshells |
| `-C` | `noclobber` | `>` überschreibt keine vorhandenen Dateien mehr |

### Einsatz von set für effektives Debugging

Viele Administratoren beginnen jedes Skript mit einer festen Zeile, die Fehler früh sichtbar macht:

```bash
#!/bin/bash
set -Eeuo pipefail  # Abbruch bei Fehlern, leeren Variablen, Pipe-Fehlern
```

**Nur einen Abschnitt verfolgen:**

Statt das ganze Skript mit `bash -x` zu starten, schaltet man die Ablaufverfolgung gezielt für den verdächtigen Teil ein. Die Variable `PS4` legt fest, was vor jeder Zeile steht. Mit Dateiname und Zeilennummer findet man die Stelle sofort:

```bash
PS4='+ ${BASH_SOURCE}:${LINENO}: '
set -x
ziel="/tmp/backup"
anzahl=$(ls / | wc -l)
set +x
+ ps4.sh:4: ziel=/tmp/backup
++ ps4.sh:5: ls /
++ ps4.sh:5: wc -l
+ ps4.sh:5: anzahl=15
+ ps4.sh:6: set +x
```

Zwei Pluszeichen kennzeichnen Befehle, die in einer Subshell laufen, hier die Befehlsersetzung `$(...)`.

**Debugging per Schalter:**

```bash
[[ "${DEBUG:-0}" == 1 ]] && set -x      # im Skript

DEBUG=1 ./backup.sh                      # Aufruf mit Ablaufverfolgung
./backup.sh                              # Aufruf ohne
```

**Ablaufverfolgung in eine eigene Datei schreiben:**

```bash
exec 5> /tmp/debug.log      # Dateideskriptor 5 öffnen
BASH_XTRACEFD=5             # set -x schreibt nach Deskriptor 5
set -x
```

> **Achtung:** `set -e` hat Tücken. `((i++))` liefert den Exit-Code 1, wenn `i` vorher 0 war, und beendet das Skript. Besser `((++i))` oder `i=$((i + 1))` schreiben. Befehle, deren Fehler erlaubt ist, kennzeichnet man mit `|| true`.

### Die Spur des Skripts: Trace und Trap

Die **Trace** (Ablaufverfolgung) mit `set -x` zeigt, was das Skript tut. Ein **Trap** legt fest, was bei einem bestimmten Ereignis passieren soll. Neben echten Signalen kennt die Bash vier besondere Ereignisse:

| Ereignis | Wird ausgelöst | Typischer Einsatz |
| --- | --- | --- |
| `EXIT` | Beim Beenden des Skripts, egal wodurch | Aufräumen: temporäre Dateien löschen, Sperren freigeben |
| `ERR` | Wenn ein Befehl mit einem Exit-Code ungleich 0 endet | Fehlerstelle und Befehl melden |
| `DEBUG` | Vor jedem einzelnen Befehl | Schritt-für-Schritt-Ausführung, eigene Ablaufverfolgung |
| `RETURN` | Wenn eine Funktion oder ein mit `source` geladenes Skript endet | Funktionsaufrufe verfolgen |

**Fehlerstelle automatisch melden:**

```bash
#!/bin/bash
set -Eeuo pipefail
trap 'echo "FEHLER in Zeile $LINENO: \"$BASH_COMMAND\" (Exit-Code $?)" >&2' ERR

echo "Start"
cp /gibt/es/nicht /tmp/
echo "wird nicht erreicht"
Start
cp: cannot stat '/gibt/es/nicht': No such file or directory
FEHLER in Zeile 6: "cp /gibt/es/nicht /tmp/" (Exit-Code 1)
```

**Schritt für Schritt ausführen:**

```bash
trap 'read -r -p "[Zeile $LINENO] $BASH_COMMAND  – ENTER für weiter "' DEBUG
```

Mit diesem `DEBUG`-Trap hält das Skript vor jedem Befehl an und zeigt ihn. Das ersetzt einen einfachen Debugger. Für einzelne Haltepunkte genügt ein `read -r -p "Weiter mit ENTER"` an der gewünschten Stelle.

## Effiziente Fehlerbehandlung in Skripten

Gute Fehlerbehandlung prüft Voraussetzungen, bevor etwas geändert wird, bricht bei Problemen kontrolliert ab und hinterlässt keine halben Ergebnisse. Die Bausteine dafür sind Exit-Codes, `trap` und Signale.

```bash
#!/bin/bash
set -Eeuo pipefail

die() { echo "FEHLER: $*" >&2; exit 1; }  # Meldung auf stderr, dann Abbruch

command -v rsync > /dev/null || die "rsync ist nicht installiert."
[[ -d "$1" ]]                || die "Quellordner $1 fehlt."
[[ -w /backup ]]             || die "Keine Schreibrechte auf /backup."

if ! rsync -a "$1"/ /backup/; then
    die "Sicherung fehlgeschlagen."
fi
```

### Der exit-Befehl

`exit n` beendet ein Skript mit dem Exit-Code n (0 bis 255). Ohne Zahl gilt der Code des letzten Befehls. Der Aufrufer liest ihn mit `$?`. In Funktionen verwendet man `return n`, sonst würde das ganze Skript beendet.

| Exit-Code | Bedeutung |
| --- | --- |
| `0` | Erfolg |
| `1` | Allgemeiner Fehler |
| `2` | Falsche Verwendung, z. B. ungültige Argumente |
| `3` bis `125` | Frei für eigene, dokumentierte Fehlerarten, z. B. 3 = Konfiguration fehlt |
| `126` | Befehl gefunden, aber nicht ausführbar, z. B. fehlendes Ausführrecht |
| `127` | Befehl nicht gefunden |
| `128 + n` | Durch Signal n beendet |
| `130` | Abbruch mit Strg + C (128 + 2, SIGINT) |
| `137` | Hart beendet mit `kill -9` (128 + 9, SIGKILL) |
| `143` | Beendet mit `kill` (128 + 15, SIGTERM) |

```bash
./backup.sh
case $? in
    0) echo "Sicherung erfolgreich" ;;
    3) echo "Konfiguration fehlt" >&2 ;;
    *) echo "Sicherung fehlgeschlagen" >&2 ;;
esac
```

### Der trap-Befehl

`trap 'befehle' EREIGNIS` führt die Befehle aus, sobald das Ereignis eintritt. Das Ereignis kann ein Signal wie `SIGINT` oder `TERM` sein oder eines der besonderen Ereignisse `EXIT`, `ERR`, `DEBUG` und `RETURN`.

| Aufruf | Wirkung |
| --- | --- |
| `trap aufraeumen EXIT` | Funktion `aufraeumen` beim Beenden aufrufen |
| `trap 'echo Abbruch; exit 130' INT` | Auf Strg + C reagieren |
| `trap '' INT` | Signal ignorieren, z. B. während eines kritischen Abschnitts |
| `trap - INT` | Standardverhalten wiederherstellen |
| `trap -p` | Alle gesetzten Traps anzeigen |

**Aufräumen mit EXIT und mktemp:**

```bash
tmp=$(mktemp)  # sichere, eindeutige Temp-Datei
trap 'rm -f "$tmp"; echo "aufgeräumt: $tmp"' EXIT

echo "Zwischenergebnis" > "$tmp"
# ... weitere Verarbeitung ...
exit 3                                              # der Trap läuft trotzdem
```

Der `EXIT`-Trap läuft beim normalen Ende, bei `exit` und nach einem Abbruch durch `set -e`. So bleibt keine temporäre Datei liegen, egal wie das Skript endet. `mktemp` erzeugt einen zufälligen Dateinamen und verhindert, dass zwei Läufe dieselbe Datei verwenden oder ein Angreifer den Namen vorhersagt.

### Der Signal-Mechanismus

**Signale** sind kurze Nachrichten des Kernels oder anderer Prozesse an einen Prozess. Der Prozess kann die Standardaktion ausführen, das Signal ignorieren oder mit `trap` eine eigene Reaktion festlegen. Nur `SIGKILL` und `SIGSTOP` lassen sich weder abfangen noch ignorieren.

| Signal | Nr. | Auslöser | Standardaktion | Abfangbar |
| --- | --- | --- | --- | --- |
| `SIGHUP` | 1 | Terminal geschlossen, oft auch: Konfiguration neu laden | Beenden | ja |
| `SIGINT` | 2 | Strg + C | Beenden | ja |
| `SIGQUIT` | 3 | Strg + \\ | Beenden mit Speicherabbild | ja |
| `SIGKILL` | 9 | `kill -9` | Sofort beenden | nein |
| `SIGUSR1` | 10 | Frei für eigene Zwecke | Beenden | ja |
| `SIGTERM` | 15 | `kill` ohne Option, Herunterfahren, `systemctl stop` | Beenden | ja |
| `SIGCONT` | 18 | `fg`, `bg`, `kill -CONT` | Fortsetzen | ja |
| `SIGSTOP` | 19 | `kill -STOP` | Anhalten | nein |
| `SIGTSTP` | 20 | Strg + Z | Anhalten | ja |

Die Nummern gelten für Linux auf x86- und ARM-Systemen. `kill -l` zeigt die Liste des eigenen Systems. In Skripten verwendet man besser die Namen, also `kill -TERM 1234` statt `kill -15 1234`.

**Dienst-Skript, das sauber auf Signale reagiert:**

```bash
#!/bin/bash
aufraeumen() { echo "Räume auf ..."; rm -f /run/meindienst.pid; }

trap 'echo "SIGTERM erhalten"; aufraeumen; exit 143' TERM
trap 'echo "SIGHUP: lade Konfiguration neu"; source /etc/meindienst.conf' HUP

echo $$ > /run/meindienst.pid                      # eigene PID speichern
while true; do
    echo "$(date '+%T') arbeite ..."
    sleep 30 & wait $!  # Trap reagiert sofort, nicht erst nach 30 s
done
```

Die Bash führt einen Trap erst aus, wenn der laufende Vordergrundbefehl beendet ist. Mit `sleep 30 & wait $!` läuft die Pause im Hintergrund, und `wait` wird durch das Signal sofort unterbrochen.

> **Tipp:** Prozesse immer zuerst mit `SIGTERM` beenden und ihnen Zeit zum Aufräumen geben. `kill -9` nur als letztes Mittel verwenden, denn dann laufen keine Traps, und temporäre Dateien oder Sperren bleiben zurück.

## stderr zur Fehlerdiagnose und -behandlung

Jedes Programm unter Linux hat drei Standard-Datenströme, die über Nummern (Dateideskriptoren) angesprochen werden:

| Datenstrom | Nummer | Zweck | Standardziel |
| --- | --- | --- | --- |
| stdin (Standardeingabe) | 0 | Eingaben lesen | Tastatur |
| stdout (Standardausgabe) | 1 | Ergebnisse ausgeben | Terminal |
| stderr (Standardfehlerausgabe) | 2 | Fehler- und Statusmeldungen ausgeben | Terminal |

### Eigenschaften von stderr

- **Eigener Kanal:** stderr lässt sich getrennt von stdout umleiten. Ergebnisse können in eine Datei gehen, Fehler in eine andere.
- **Bleibt sichtbar:** Wird stdout in eine Datei oder Pipe umgeleitet, erscheinen Fehlermeldungen trotzdem im Terminal.
- **Nicht in der Pipe:** `|` gibt nur stdout weiter. Fehlermeldungen verfälschen deshalb nicht die Daten, die der nächste Befehl verarbeitet.
- **Ungepuffert:** Meldungen auf stderr werden sofort geschrieben, auch wenn das Programm kurz danach abstürzt.
- **Wird gesammelt:** cron schickt Ausgaben per E-Mail an den Besitzer, systemd schreibt stderr eines Dienstes ins Journal.

| Umleitung | Wirkung |
| --- | --- |
| `befehl 2> fehler.log` | stderr in eine Datei schreiben (überschreiben) |
| `befehl 2>> fehler.log` | stderr an eine Datei anhängen |
| `befehl > alles.log 2>&1` | stdout in Datei, stderr dorthin, wohin stdout zeigt: beides in eine Datei |
| `befehl &> alles.log` | Kurzform für beides in eine Datei |
| `echo "Fehler" >&2` | Eigene Meldung auf stderr ausgeben |
| `befehl 2> /dev/null` | Fehlermeldungen verwerfen |
| `befehl \|& grep warn` | stdout und stderr gemeinsam in eine Pipe geben |

> **Achtung, Reihenfolge:** Umleitungen werden von links nach rechts ausgewertet. `befehl > datei 2>&1` schreibt beides in die Datei. `befehl 2>&1 > datei` schreibt nur stdout in die Datei, stderr erscheint weiter im Terminal, weil es auf das alte Ziel von stdout gelenkt wurde.

### stderr zur Fehlerdiagnose nutzen

**Eigene Meldungen mit Zeitstempel und Stufe:**

```bash
log()   { echo "$(date '+%F %T') INFO  $*"; }  # normale Ausgabe -> stdout
warn()  { echo "$(date '+%F %T') WARN  $*" >&2; }      # Warnung -> stderr
error() { echo "$(date '+%F %T') ERROR $*" >&2; }      # Fehler -> stderr

log "Import gestartet"
[[ -s "$datei" ]] || warn "Datei $datei ist leer"
```

**Alle Fehler eines Skripts in einer Logdatei sammeln:**

```bash
exec 2>> /var/log/import_fehler.log  # ab hier geht stderr in die Datei
exec 2> >(tee -a /var/log/import_fehler.log >&2)  # Datei UND Terminal
```

**Ergebnis und Fehler trennen und auswerten:**

```text
./import.sh > ergebnis.csv 2> fehler.log
if [[ -s fehler.log ]]; then  # -s: Datei ist nicht leer
    echo "Import mit Fehlern, siehe fehler.log" >&2
fi
```

**Nur die Fehlermeldung eines Befehls in einer Variable speichern:**

```bash
fehler=$(cp /quelle/daten.csv /ziel/ 2>&1 > /dev/null)
[[ -n "$fehler" ]] && error "Kopieren fehlgeschlagen: $fehler"
```

Zuerst wird stderr auf das Ziel von stdout gelenkt, also in die Variable, danach stdout verworfen. Übrig bleibt nur die Fehlermeldung.

**Fehler an das Systemprotokoll melden:**

```bash
logger -t backup -p user.err "Sicherung von /home fehlgeschlagen"
journalctl -t backup --since today  # Meldungen wieder anzeigen
```

## Optimierung von Skripten für bessere Performance

Zuerst messen, dann optimieren. Die häufigsten Bremsen in Shell-Skripten sind:

- **Externe Programme in Schleifen:** Jeder Aufruf von `expr`, `cut` oder `grep` startet einen neuen Prozess.
- Unnötige Pipes und Subshells, z. B. `cat datei | grep muster` statt `grep muster datei`.
- Dateien mehrfach lesen, statt sie einmal zu verarbeiten.
- Unabhängige Aufgaben nacheinander statt parallel ausführen.

### Verwendung von time und date zur Performance-Analyse

`time` misst, wie lange ein Befehl, eine Schleife oder ein ganzes Skript braucht:

```bash
time ./backup.sh

real    0m14.402s     # tatsächlich vergangene Zeit
user    0m5.063s      # Rechenzeit im Programm selbst
sys     0m7.107s  # Rechenzeit im Kernel (Prozessstarts, Dateizugriffe)
```

Ist `real` viel größer als `user + sys`, wartet das Skript, z. B. auf Netzwerk oder Festplatte. Ist `sys` hoch, startet es oft viele Prozesse. Das Ausgabeformat lässt sich mit `TIMEFORMAT='Laufzeit: %R s'` anpassen.

**Einzelne Abschnitte mit date messen:**

```bash
start=$(date +%s%N)  # Sekunden + Nanosekunden
sortiere_daten
ende=$(date +%s%N)
echo "Sortieren: $(( (ende - start) / 1000000 )) ms" >&2

echo "Gesamtlaufzeit: $SECONDS s"  # Bash zählt Sekunden seit Skriptstart
```

**Beispiel: externer Befehl gegen eingebaute Arithmetik:**

```bash
time for i in {1..300}; do x=$(expr $i + 1); done    # startet 300 Prozesse
time for i in {1..300}; do x=$(( i + 1 )); done  # rechnet in der Bash selbst
```

Die zweite Schleife ist um ein Vielfaches schneller, weil kein einziger neuer Prozess gestartet wird. Auf einem Testsystem brauchte die erste Variante mehrere Sekunden, die zweite wenige Millisekunden.

| Langsam | Schneller | Grund |
| --- | --- | --- |
| `x=$(expr $a + 1)` | `x=$(( a + 1 ))` | Eingebaute Arithmetik statt externem Programm |
| `cat datei \| grep muster` | `grep muster datei` | Ein Prozess und eine Pipe weniger |
| `zeilen=$(cat datei \| wc -l)` | `zeilen=$(wc -l < datei)` | Kein zusätzliches `cat` |
| `name=$(basename "$pfad")` | `name="${pfad##*/}"` | Parameterersetzung der Bash statt externem Programm |
| Schleife mit `while read` über große Dateien | `awk` oder `sort`/`uniq` direkt auf die Datei | Spezialisierte Werkzeuge sind für große Datenmengen gebaut |
| Aufgaben nacheinander | `befehl1 & befehl2 & wait` oder `xargs -P 4` | Mehrere CPU-Kerne nutzen |

### Verwendung von nice und renice zur Prozesspriorisierung

Der **Nice-Wert** bestimmt, wie viel Rechenzeit ein Prozess im Vergleich zu anderen bekommt. Er reicht von -20 (höchste Priorität) bis 19 (niedrigste), Standard ist 0. Je „netter“ ein Prozess, desto mehr Rechenzeit überlässt er anderen. Normale Benutzer dürfen den Wert nur erhöhen, senken darf ihn nur root.

| Nice-Wert | Priorität | Einsatz |
| --- | --- | --- |
| -20 bis -1 | Hoch | Zeitkritische Dienste, nur root |
| 0 | Normal | Standard für alle Prozesse |
| 1 bis 19 | Niedrig | Backups, Komprimierung, Berichte, die den Betrieb nicht stören sollen |

```bash
nice -n 15 ./backup.sh                  # mit niedriger Priorität starten
renice -n 10 -p 4321                    # laufenden Prozess 4321 herabstufen
renice -n 5 -u anna                     # alle Prozesse von anna herabstufen
sudo renice -n -5 -p 4321               # Priorität erhöhen, nur als root
ps -o pid,ni,comm -p 4321               # Nice-Wert prüfen
ionice -c 3 ./backup.sh  # auch Festplattenzugriffe nur im Leerlauf
```

Für nächtliche Sicherungen kombiniert man beides im cron-Eintrag: `0 2 * * * nice -n 15 ionice -c 3 /opt/skripte/backup.sh`.

### Mit top und ps Systemlasten erkennen und analysieren

`top` zeigt die Systemlast laufend aktualisiert an. Die Kopfzeilen fassen den Zustand des Systems zusammen:

| Anzeige in top | Bedeutung |
| --- | --- |
| `load average: 0.52, 0.71, 0.80` | Durchschnittliche Zahl wartender und laufender Prozesse über 1, 5 und 15 Minuten. Liegt der Wert dauerhaft über der Zahl der CPU-Kerne (`nproc`), ist das System überlastet |
| `Tasks` | Anzahl der Prozesse: laufend, schlafend, angehalten, Zombies |
| `%Cpu(s): us sy ni id wa` | CPU-Anteile: Programme, Kernel, Prozesse mit Nice-Wert, Leerlauf und Warten auf Ein-/Ausgabe. Ein hoher `wa`-Wert deutet auf eine langsame Festplatte hin |
| `MiB Mem` / `MiB Swap` | Arbeitsspeicher und Auslagerungsspeicher. Stark genutzter Swap bremst das System |
| Spalten `PID NI %CPU %MEM COMMAND` | Prozess-ID, Nice-Wert, CPU- und Speicheranteil, Befehl |

Wichtige Tasten in `top`: **P** sortiert nach CPU, **M** nach Speicher, **k** beendet einen Prozess, **r** ändert den Nice-Wert, **1** zeigt jeden CPU-Kern einzeln, **q** beendet. Komfortabler ist `htop`, falls installiert.

```bash
top -b -n 1 | head -15  # einmalige Momentaufnahme für Skripte
ps aux --sort=-%cpu | head -6  # die 5 größten CPU-Verbraucher
ps -eo pid,ni,pcpu,pmem,etime,comm --sort=-pmem | head -6   # nach Speicher
pgrep -a backup  # PID und Befehl laufender Backups
uptime; free -h; vmstat 1 5  # Last, Speicher, Verlauf über 5 Sekunden
```

**Skript: Warnung bei hoher Last:**

```bash
#!/bin/bash
kerne=$(nproc)
last=$(cut -d ' ' -f 1 /proc/loadavg)             # Last der letzten Minute

if awk -v l="$last" -v k="$kerne" 'BEGIN { exit !(l > k) }'; then
    echo "$(date '+%F %T') Hohe Last: $last bei $kerne Kernen" >&2
    ps aux --sort=-%cpu | head -6 >&2  # Verursacher mitprotokollieren
fi
```

Die Bash rechnet nur mit ganzen Zahlen. Den Vergleich der Kommazahlen übernimmt deshalb `awk`.

## Sicherheitsaspekte in Linux-Skripten

Skripte laufen oft mit root-Rechten oder unbeaufsichtigt über cron. Ein Fehler oder eine Lücke hat dann große Folgen. Diese Regeln senken das Risiko:

- **Geringste Rechte:** Ein Skript läuft nur mit den Rechten, die es wirklich braucht, und nicht pauschal als root.
- **Keine Passwörter im Skript:** Zugangsdaten gehören in eine geschützte Datei (`chmod 600`), eine Umgebungsvariable oder einen Passwort-Tresor.
- **Variablen in Anführungszeichen und Eingaben prüfen:** Verhindert, dass Dateinamen mit Leerzeichen oder präparierte Eingaben andere Befehle auslösen. Auf `eval` verzichten.
- **Sichere temporäre Dateien:** `mktemp` statt fester Namen wie `/tmp/daten.txt`, die ein anderer Benutzer vorher als Verknüpfung anlegen könnte.
- **Strenge Standardrechte:** `umask 077` am Skriptanfang sorgt dafür, dass neue Dateien nur für den Besitzer lesbar sind.
- **Vollständige Pfade:** `/usr/bin/rsync` oder ein fest gesetztes `PATH` verhindern, dass ein gleichnamiges Programm aus einem fremden Ordner läuft.
- **Gefährliche Befehle absichern:** Leere Variablen dürfen nie zu `rm -rf /` führen.

```bash
umask 077
PATH=/usr/local/bin:/usr/bin:/bin

if [[ $EUID -ne 0 ]]; then                         # nur als root fortfahren
    echo "Bitte mit sudo ausführen." >&2
    exit 1
fi

rm -rf "${ZIEL:?ZIEL ist leer}"/*  # bricht ab, wenn ZIEL leer ist
```

| Rechte | Oktal | Bedeutung | Einsatz |
| --- | --- | --- | --- |
| `rwxr-xr-x` | 755 | Besitzer alles, andere lesen und ausführen | Allgemein nutzbare Skripte |
| `rwxr-x---` | 750 | Besitzer alles, Gruppe lesen und ausführen, andere nichts | Admin-Skripte für eine Gruppe |
| `rwx------` | 700 | Nur der Besitzer | Private Skripte |
| `rw-r--r--` | 644 | Besitzer lesen und schreiben, andere lesen | Konfigurationsdateien |
| `rw-------` | 600 | Nur der Besitzer liest und schreibt | Dateien mit Zugangsdaten |

### chown: Besitzverhältnisse ändern

Jede Datei gehört einem Benutzer und einer Gruppe. `chown` (change owner) ändert beides, `chgrp` nur die Gruppe. Den Besitzer ändern darf nur root.

```bash
sudo chown anna bericht.txt                      # neuer Besitzer
sudo chown anna:admins bericht.txt               # Besitzer und Gruppe
sudo chown :admins bericht.txt                   # nur die Gruppe
sudo chown -R www-data:www-data /var/www/app  # rekursiv
ls -l bericht.txt  # -rw-r----- 1 anna admins 2048 ... bericht.txt
stat -c '%U:%G %a %n' bericht.txt                # anna:admins 640 bericht.txt
```

**Ein root-Skript sicher ablegen:**

```bash
sudo chown root:root /opt/skripte/backup.sh
sudo chmod 750 /opt/skripte/backup.sh
```

> **Wichtig:** Ein Skript, das als root läuft, darf nur root gehören und nur für root schreibbar sein. Kann ein normaler Benutzer es ändern, kann er darüber beliebige Befehle mit root-Rechten ausführen. Das gilt auch für den Ordner, in dem das Skript liegt.

### Entdecke die Bedeutung von sudo, su und chroot

Diese drei Befehle verändern, **unter welchem Benutzer** oder **in welcher Umgebung** ein Befehl läuft. Sie sind für Administratoren unverzichtbar, müssen aber bewusst eingesetzt werden.

**sudo: Befehle mit Superuser-Rechten ausführen**

`sudo` führt einen einzelnen Befehl mit den Rechten eines anderen Benutzers aus, standardmäßig root. Der Benutzer gibt dabei sein eigenes Passwort ein. Wer was darf, steht in `/etc/sudoers`, die nur mit `visudo` bearbeitet werden sollte. Jeder Aufruf wird protokolliert, z. B. in `/var/log/auth.log`.

```bash
sudo systemctl restart nginx          # einzelner Befehl als root
sudo -u postgres psql                 # als anderer Benutzer
sudo -l                               # was darf ich mit sudo?
sudo -i                               # Root-Shell, nur wenn nötig

# Eintrag in /etc/sudoers (nur mit visudo bearbeiten):
# backup darf genau dieses Skript ohne Passwort als root ausführen
backup  ALL=(root) NOPASSWD: /opt/skripte/backup.sh
```

**su: Benutzerkontext wechseln**

`su` (substitute user) wechselt in eine Shell eines anderen Benutzers. Dafür ist das Passwort des **Zielbenutzers** nötig. Mit Bindestrich wird die vollständige Anmeldeumgebung des Zielbenutzers geladen.

```bash
su - anna                             # als anna anmelden, mit deren Umgebung
su -c 'whoami' anna                   # einzelnen Befehl als anna ausführen
su -                                  # root-Shell, benötigt das root-Passwort
```

| Merkmal | sudo | su |
| --- | --- | --- |
| Passwort | Eigenes Passwort | Passwort des Zielbenutzers |
| Umfang | Einzelner Befehl, genau einstellbar | Komplette Shell als anderer Benutzer |
| Protokoll | Jeder Befehl wird protokolliert | Nur der Wechsel wird protokolliert |
| Empfehlung | Standard für Administratoren | Nur wenn sudo nicht verfügbar ist |

**chroot: Die Wurzel des Dateisystems ändern**

`chroot` (change root) startet einen Befehl, für den ein anderes Verzeichnis als Wurzel `/` erscheint. Der Prozess sieht nur die Dateien unterhalb dieses Verzeichnisses. Alle benötigten Programme und Bibliotheken müssen deshalb darin vorhanden sein. Typische Einsätze sind die Reparatur eines Systems von einem Live-USB-Stick aus, Build-Umgebungen und das Testen von Skripten.

```bash
ldd /bin/bash  # welche Bibliotheken braucht bash?
sudo mkdir -p /srv/jail/bin /srv/jail/lib /srv/jail/lib64
sudo cp /bin/bash /srv/jail/bin/  # Programm und Bibliotheken kopieren
sudo chroot /srv/jail /bin/bash  # Shell mit /srv/jail als Wurzel
```

> **Achtung:** chroot ist keine Sicherheitsgrenze. Ein Prozess mit root-Rechten kann aus einem chroot ausbrechen. Prozesse und Netzwerk des Hosts bleiben außerdem erreichbar.

### Verwendung von Docker und chroot zur Skript-Isolation

Ein Skript isoliert auszuführen schützt das eigentliche System, sorgt für eine reproduzierbare Umgebung und erlaubt es, fremde oder neue Skripte gefahrlos zu testen.

**Docker: Container-basierte Isolation**

Ein **Container** ist ein Prozess mit eigenem Dateisystem, eigener Prozessliste und eigenem Netzwerk. Docker nutzt dafür Funktionen des Linux-Kernels (Namespaces für die Trennung, cgroups für Ressourcenlimits). Container teilen sich den Kernel des Hosts und starten daher in Sekunden.

```bash
# Skript aus dem aktuellen Ordner in einem frischen Ubuntu-Container testen
docker run --rm -v "$PWD":/work:ro -w /work ubuntu:24.04 bash skript.sh

# streng abgeschottet
docker run --rm --network none --read-only --user 1000:1000 \
    --memory 256m --cpus 1 --cap-drop ALL \
    -v "$PWD":/work:ro -w /work ubuntu:24.04 bash skript.sh
```

| Option | Wirkung |
| --- | --- |
| `--rm` | Container nach dem Ende automatisch löschen |
| `-v "$PWD":/work:ro` | Aktuellen Ordner nur lesbar in den Container einbinden |
| `--network none` | Kein Netzwerkzugriff |
| `--read-only` | Dateisystem des Containers schreibgeschützt |
| `--user 1000:1000` | Nicht als root im Container laufen |
| `--memory`, `--cpus` | Arbeitsspeicher und CPU begrenzen |
| `--cap-drop ALL` | Alle besonderen Kernel-Rechte entziehen |

**Eigenes Image für ein Skript (Dockerfile):**

```bash
FROM debian:12-slim
RUN apt-get update && apt-get install -y --no-install-recommends rsync \
    && rm -rf /var/lib/apt/lists/*
COPY backup.sh /usr/local/bin/backup.sh
RUN chmod 755 /usr/local/bin/backup.sh
USER nobody
ENTRYPOINT ["/usr/local/bin/backup.sh"]
docker build -t backup-skript .
docker run --rm -v /daten:/daten:ro -v /sicherung:/sicherung backup-skript
```

**chroot: Ändern des Wurzelverzeichnisses**

Statt Programme einzeln zu kopieren, legt man mit `debootstrap` ein vollständiges Minimal-Debian in einem Ordner an und führt das Skript darin aus:

```bash
sudo debootstrap stable /srv/chroot/test http://deb.debian.org/debian
sudo cp skript.sh /srv/chroot/test/root/
sudo chroot /srv/chroot/test /bin/bash /root/skript.sh
```

| Merkmal | Docker | chroot |
| --- | --- | --- |
| Eigenes Dateisystem | Ja | Ja |
| Eigene Prozesse und eigenes Netzwerk | Ja | Nein |
| Ressourcen begrenzen | Ja, CPU und Speicher | Nein |
| Einrichtung | Fertige Images aus einer Registry | Dateien kopieren oder `debootstrap` |
| Sicherheit | Gute Trennung bei richtiger Konfiguration | Schwach, root kann ausbrechen |
| Typischer Einsatz | Skripte testen, Dienste betreiben, CI/CD | Systemreparatur, einfache Build-Umgebungen |

## Übersicht von Befehlen zum Debuggen und zur Fehlerbehebung in Skripten

**Im Skript und beim Aufruf:**

| Befehl | Zweck | Beispiel |
| --- | --- | --- |
| `bash -n` | Syntax prüfen, ohne auszuführen | `bash -n skript.sh` |
| `bash -x` | Ganzes Skript mit Ablaufverfolgung starten | `bash -x skript.sh` |
| `set -x` / `set +x` | Ablaufverfolgung für einen Abschnitt ein- und ausschalten | vor und nach dem verdächtigen Teil |
| `set -v` | Zeilen so ausgeben, wie sie gelesen werden | `set -v` |
| `set -Eeuo pipefail` | Fehler früh erkennen und abbrechen | zweite Zeile des Skripts |
| `PS4` | Präfix der Ablaufverfolgung, z. B. mit Zeilennummer | `PS4='+ ${LINENO}: '` |
| `BASH_XTRACEFD` | Ablaufverfolgung in eine Datei umlenken | `exec 5> debug.log; BASH_XTRACEFD=5` |
| `trap … ERR` | Fehlerstelle melden | `trap 'echo "Zeile $LINENO" >&2' ERR` |
| `trap … DEBUG` | Vor jedem Befehl anhalten oder ausgeben | `trap 'read -p "$BASH_COMMAND"' DEBUG` |
| `trap … EXIT` | Immer aufräumen | `trap 'rm -f "$tmp"' EXIT` |
| `read -p` | Haltepunkt einbauen | `read -r -p "Weiter mit ENTER"` |
| `echo … >&2` | Diagnosemeldung auf stderr | `echo "Wert: $x" >&2` |
| `$?`, `PIPESTATUS` | Exit-Code des letzten Befehls bzw. aller Teile einer Pipe | `echo "${PIPESTATUS[@]}"` |
| `declare -p` | Variable mit Typ und Inhalt anzeigen | `declare -p liste` |

**Werkzeuge außerhalb des Skripts:**

| Befehl | Zweck | Beispiel |
| --- | --- | --- |
| `shellcheck` | Typische Fehler finden, bevor das Skript läuft | `shellcheck skript.sh` |
| `cat -A` | Unsichtbare Zeichen anzeigen, z. B. `^M` für Windows-Zeilenenden | `cat -A skript.sh \| head` |
| `dos2unix` | Windows-Zeilenenden entfernen | `dos2unix skript.sh` |
| `type`, `command -v` | Prüfen, welcher Befehl tatsächlich aufgerufen wird | `command -v python3` |
| `env`, `printenv` | Umgebungsvariablen anzeigen, wichtig bei cron-Problemen | `env \| sort` |
| `strace` | Systemaufrufe eines Prozesses verfolgen | `strace -f -e trace=file ./skript.sh` |
| `lsof` | Geöffnete Dateien und Ports anzeigen | `lsof -p 4321` |
| `journalctl` | Protokolle von Diensten und `logger` | `journalctl -u backup.service -e` |
| `tail -f` | Logdatei live verfolgen | `tail -f /var/log/syslog` |
| `dmesg` | Kernel-Meldungen, z. B. bei Speichermangel | `dmesg -T \| tail` |
| `top`, `ps` | Last und hängende Prozesse finden | `ps aux --sort=-%cpu \| head` |
| `df -h`, `du -sh` | Volle Datenträger als Fehlerursache erkennen | `df -h /var` |

**Vorgehen bei der Fehlersuche:** 1. `bash -n` und `shellcheck` auf Syntaxfehler prüfen. 2. Fehlermeldung auf stderr und in den Logs lesen. 3. Mit `set -x` und `PS4` die genaue Stelle finden. 4. Werte mit `declare -p` oder `echo … >&2` prüfen. 5. Bei Problemen nur unter cron die Umgebung mit `env` vergleichen.

## Coding Challenge

**Aufgabe:** Erstelle ein Bash-Skript, das folgende Aufgaben erfüllt:

1. Überprüfe, ob die Datei `/tmp/test.txt` existiert. Wenn nicht, gib eine entsprechende Meldung aus und beende das Skript mit einem Exit-Status ungleich 0.
2. Falls die Datei existiert, erstelle eine temporäre Datei (`/tmp/tempfile.txt`) und informiere den Benutzer darüber.
3. Aktiviere die Debugging-Optionen mit `set -eux`, sodass alle Befehle vor ihrer Ausführung angezeigt werden und das Skript bei einem Fehler sofort stoppt.
4. Füge mittels `read -p` einen Breakpoint ein, bei dem der Benutzer per Eingabe bestätigen muss, bevor das Skript fortgesetzt wird.
5. Implementiere eine Schleife (z. B. 3 Durchläufe), die in jedem Schritt eine Nachricht ausgibt und eine kurze Pause (`sleep`) einlegt, um eine simulierte Aufgabe darzustellen.
6. Richte einen Trap ein, der das SIGINT-Signal (Strg + C) abfängt und eine Cleanup-Funktion aufruft, welche die temporäre Datei löscht und eine Abschlussmeldung ausgibt.

Am Ende soll das Skript erfolgreich mit Exit-Status 0 beendet werden.

**Vorgehen:**

1. Cleanup-Funktion zuerst definieren, damit sie bereitsteht, wenn der Trap gesetzt wird.
2. Prüfung auf `/tmp/test.txt` mit `[[ ! -f ... ]]`, Fehlermeldung auf stderr und `exit 1`.
3. Temporäre Datei mit `touch` anlegen und den Benutzer informieren.
4. Trap für SIGINT setzen, und zwar vor dem Breakpoint und der Schleife, denn nur dann wirkt er dort.
5. `set -eux` aktivieren, Breakpoint mit `read -r -p`, danach die Schleife.
6. Am Ende die temporäre Datei löschen und mit `exit 0` beenden.

<details>
<summary>Musterlösung anzeigen</summary>

**Musterlösung (signal\_cleanup.sh):**

```bash
#!/bin/bash
# Prüft /tmp/test.txt, nutzt eine Temp-Datei und räumt bei Strg + C auf.

TEMP_FILE="/tmp/tempfile.txt"

# Cleanup-Funktion: wird bei SIGINT (Strg + C) aufgerufen
cleanup() {
    rm -f "$TEMP_FILE"
    echo "Abbruch (SIGINT): Temporäre Datei gelöscht. Skript wird beendet."
    exit 130  # 128 + 2 = Abbruch durch SIGINT
}

# 1. Voraussetzung prüfen
if [[ ! -f /tmp/test.txt ]]; then
    echo "Fehler: Die Datei /tmp/test.txt existiert nicht." >&2
    exit 1
fi

# 2. Temporäre Datei anlegen
touch "$TEMP_FILE"
echo "Temporäre Datei $TEMP_FILE wurde erstellt."

# 6. Trap setzen, bevor Breakpoint und Schleife beginnen
trap cleanup SIGINT

# 3. Debugging: Befehle anzeigen, bei Fehlern sofort abbrechen
set -eux

# 4. Breakpoint
read -r -p "Breakpoint: ENTER drücken, um fortzufahren ... "

# 5. Simulierte Aufgabe
for i in 1 2 3; do
    echo "Schritt $i von 3: Aufgabe wird bearbeitet ..."
    sleep 1
done

rm -f "$TEMP_FILE"
echo "Aufgabe abgeschlossen, temporäre Datei gelöscht."
exit 0
```

**Erläuterung der wichtigsten Zeilen:**

| Code | Erklärung |
| --- | --- |
| `cleanup() { ... exit 130; }` | Löscht die Datei und gibt die Abschlussmeldung aus. Das `exit` ist wichtig: Ohne es setzt die Bash nach dem Trap die Schleife einfach fort |
| `[[ ! -f /tmp/test.txt ]]` | Wahr, wenn die Datei nicht existiert. Die Meldung geht mit `>&2` auf stderr, das Skript endet mit Exit-Code 1 |
| `trap cleanup SIGINT` | Registriert die Funktion für Strg + C. Steht der Trap erst nach der Schleife, hätte er keine Wirkung mehr |
| `set -eux` | `-e` bricht bei Fehlern ab, `-u` bei nicht gesetzten Variablen, `-x` zeigt jeden Befehl mit `+` vor der Ausführung |
| `read -r -p "..."` | Haltepunkt: wartet auf ENTER. `-r` verhindert, dass Backslashes umgedeutet werden |
| `for i in 1 2 3; do ... sleep 1; done` | Drei Durchläufe mit Meldung und einer Sekunde Pause |
| `exit 0` | Erfolgreiches Ende nach dem Aufräumen |

**Beispielausgabe bei normalem Durchlauf (gekürzt):**

```text
Temporäre Datei /tmp/tempfile.txt wurde erstellt.
+ read -r -p 'Breakpoint: ENTER drücken, um fortzufahren ... '
Breakpoint: ENTER drücken, um fortzufahren ...
+ for i in 1 2 3
+ echo 'Schritt 1 von 3: Aufgabe wird bearbeitet ...'
Schritt 1 von 3: Aufgabe wird bearbeitet ...
+ sleep 1
...
+ rm -f /tmp/tempfile.txt
+ echo 'Aufgabe abgeschlossen, temporäre Datei gelöscht.'
Aufgabe abgeschlossen, temporäre Datei gelöscht.
+ exit 0
```

**Beispielausgabe bei Strg + C während der Schleife:**

```text
Schritt 2 von 3: Aufgabe wird bearbeitet ...
+ sleep 1
^C++ cleanup
++ rm -f /tmp/tempfile.txt
++ echo 'Abbruch (SIGINT): Temporäre Datei gelöscht. Skript wird beendet.'
Abbruch (SIGINT): Temporäre Datei gelöscht. Skript wird beendet.
++ exit 130
```

**Testen:**

| Testfall | Vorbereitung | Erwartetes Ergebnis |
| --- | --- | --- |
| Datei fehlt | `rm -f /tmp/test.txt` | Fehlermeldung, Exit-Code 1 (`echo $?`) |
| Normaler Durchlauf | `touch /tmp/test.txt`, dann ENTER drücken | Drei Schritte, Temp-Datei gelöscht, Exit-Code 0 |
| Abbruch am Breakpoint | Am Breakpoint Strg + C drücken | Cleanup-Meldung, Temp-Datei gelöscht, Exit-Code 130 |
| Abbruch in der Schleife | Während der Schritte Strg + C drücken | Keine weiteren Schritte, Cleanup-Meldung, Exit-Code 130 |
| Temp-Datei nach dem Lauf | `ls /tmp/tempfile.txt` | Datei existiert in keinem Fall mehr |
| Automatischer Test | `echo \| ./signal_cleanup.sh` | ENTER wird über die Pipe geliefert, Durchlauf ohne Eingabe |

> **Hinweis:** Wegen `set -e` bricht das Skript ab, wenn `read` keine Eingabe erhält, z. B. bei einem Aufruf ohne Terminal. Für automatische Tests liefert man das ENTER deshalb über eine Pipe. Für echte Skripte ist `mktemp` statt eines festen Namens wie `/tmp/tempfile.txt` sicherer (siehe 5.3.2). Hier ist der Name durch die Aufgabe vorgegeben.

**Bezug zu den Übungen:** `Uebungen_29.09/signal_cleanup.sh` löst dieselbe Aufgabe. Dort beendet die Cleanup-Funktion das Skript nicht. Nach Strg + C läuft die Schleife deshalb weiter, und am Ende erscheint trotzdem „Skript erfolgreich beendet“. Ein `exit 130` am Ende der Funktion behebt das.

</details>
