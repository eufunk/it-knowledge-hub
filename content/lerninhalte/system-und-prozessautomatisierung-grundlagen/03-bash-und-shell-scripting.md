---
title: "Grundlagen von Bash und Shell-Scripting"
description: "Skriptsprachen kennenlernen, grundlegende Bash-Befehle anwenden und erste Skripte schreiben."
duration: "20 Minuten"
---

Die Beispiele in diesem Dokument nutzen vor allem PowerShell. Auf Linux-Servern, in Containern, in CI/CD-Pipelines und auf vielen Netzwerkgeräten ist dagegen die **Bash** das wichtigste Werkzeug. Dieses Kapitel erklärt, was Skriptsprachen ausmacht, stellt die wichtigsten Befehle und Tastenkürzel der Bash vor und zeigt Aufbau und Syntax eines Bash-Skripts. Zum Abschluss folgt eine Coding Challenge mit Musterlösung.

## Einführung in die Skriptsprachen

Eine **Skriptsprache** ist eine Programmiersprache, deren Programme (Skripte) nicht vorab in Maschinencode übersetzt, sondern zur Laufzeit von einem **Interpreter** Zeile für Zeile gelesen und ausgeführt werden. Skripte sind daher schnell geschrieben, sofort lauffähig und leicht anzupassen. Sie eignen sich besonders, um vorhandene Programme und Befehle miteinander zu verbinden, weshalb man sie auch als „Klebstoff-Sprachen“ bezeichnet.

| Aspekt | Skriptsprache | Kompilierte Sprache |
| --- | --- | --- |
| Ausführung | Interpreter liest und führt den Quelltext direkt aus | Compiler übersetzt vorab in ein ausführbares Programm |
| Entwicklungszyklus | Schreiben → sofort ausführen | Schreiben → kompilieren → ausführen |
| Geschwindigkeit | Langsamer, für Verwaltungsaufgaben meist ausreichend | Sehr schnell |
| Typisierung | Meist dynamisch, oft ohne Typangabe | Meist statisch, Typen werden geprüft |
| Typischer Einsatz | Automatisierung, Administration, Datenaufbereitung | Anwendungen, Treiber, Betriebssysteme |
| Beispiele | Bash, PowerShell, Python, JavaScript | C, C++, Go, Rust |

Eine **Shell** (engl. „Schale“) ist das Programm, das zwischen Benutzer und Betriebssystem-Kern vermittelt: Sie nimmt Befehle entgegen, startet Programme und gibt Ergebnisse aus. Jede Shell ist zugleich ein Interpreter für ihre eigene Skriptsprache. Ein **Shell-Skript** ist eine Textdatei mit Befehlen, die die Shell nacheinander ausführt, also genau das, was man sonst von Hand eintippen würde.

Die **Bash** (Bourne Again Shell) wurde 1989 von Brian Fox für das GNU-Projekt als freier Nachfolger der Bourne Shell (`sh`, 1979) entwickelt. Sie ist auf den meisten Linux-Distributionen die Standard-Shell und auch unter Windows verfügbar, z. B. über das Windows-Subsystem für Linux (WSL) oder Git Bash.

| Shell | Plattform | Besonderheit |
| --- | --- | --- |
| sh (Bourne Shell / POSIX-Shell) | Unix, Linux | Kleinster gemeinsamer Nenner, sehr portabel |
| bash (Bourne Again Shell) | Linux, macOS, Windows (WSL, Git Bash) | Standard auf den meisten Linux-Systemen, große Verbreitung |
| zsh (Z Shell) | macOS (Standard seit 10.15), Linux | Komfortable Autovervollständigung, weitgehend Bash-kompatibel |
| fish (Friendly Interactive Shell) | Linux, macOS | Sehr benutzerfreundlich, aber eigene, nicht Bash-kompatible Syntax |
| PowerShell | Windows, Linux, macOS | Objektorientiert statt textorientiert, eng mit Windows verzahnt |

Der wichtigste Unterschied zwischen Bash und PowerShell liegt in den Daten, die zwischen Befehlen weitergereicht werden:

| Aspekt | Bash | PowerShell |
| --- | --- | --- |
| Datenmodell | Text: Befehle geben Zeichenketten aus | Objekte mit Eigenschaften und Methoden |
| Pipeline | Text wird zeilenweise weitergereicht und mit `grep`, `cut`, `awk` zerlegt | Objekte werden weitergereicht, Zugriff z. B. über `Where-Object Status -eq 'Running'` |
| Befehle | Kurze Programmnamen wie `ls`, `cp`, `grep` | Cmdlets im Format Verb-Nomen wie `Get-ChildItem` |
| Stärke | Linux-Server, Container, CI/CD, Netzwerkgeräte | Windows, Active Directory, Microsoft 365, Azure |

> **Kurz gesagt:** Wer Systeme automatisiert, braucht meist beide Welten: PowerShell für Windows-Umgebungen und Bash für Linux, Container und Cloud-Werkzeuge.

## Grundlegende Merkmale und Komponenten der Skriptsprachen

Skriptsprachen unterscheiden sich in ihrer Syntax, teilen aber eine Reihe typischer Merkmale:

- **Interpretiert:** Der Quelltext wird direkt ausgeführt. Fehler zeigen sich oft erst, wenn die betroffene Zeile erreicht wird.
- **Dynamisch typisiert:** Variablen werden ohne Typangabe verwendet. In der Bash ist jeder Wert zunächst eine Zeichenkette.
- **Systemnah:** Skripte rufen vorhandene Programme und Befehle des Betriebssystems auf und verbinden sie miteinander.
- **Textorientiert (Bash):** Ein- und Ausgaben sind Text, der über Pipes von Befehl zu Befehl fließt.
- **Exit-Codes:** Jeder Befehl meldet beim Beenden eine Zahl zurück. `0` bedeutet Erfolg, jeder andere Wert einen Fehler.
- **Plattformabhängig:** Ein Skript ist nur so portabel wie die Befehle, die es aufruft.

Unabhängig von der Sprache besteht ein Skript aus denselben Bausteinen. Die Tabelle zeigt sie am Beispiel der Bash:

| Komponente | Aufgabe | Beispiel in Bash |
| --- | --- | --- |
| Shebang | Erste Zeile: legt fest, welcher Interpreter das Skript ausführt | `#!/bin/bash` |
| Kommentare | Erklären den Code, werden nicht ausgeführt | `# Sicherung starten` |
| Variablen | Speichern Werte. Zugriff mit `$` | `ziel="/backup"` und `echo "$ziel"` |
| Parameter | Werte, die beim Aufruf übergeben werden | `$1`, `$2`, `$@` (alle), `$#` (Anzahl) |
| Ein- und Ausgabe | Daten lesen und ausgeben | `read name`, `echo "Hallo $name"` |
| Umleitung und Pipes | Ausgaben in Dateien schreiben oder an andere Befehle weitergeben | `ls > liste.txt`, `ls \| wc -l` |
| Bedingungen | Entscheidungen treffen | `if [[ -f "$datei" ]]; then ... fi` |
| Schleifen | Anweisungen wiederholen | `for`, `while`, `until` |
| Funktionen | Code bündeln und wiederverwenden | `sichern() { cp "$1" "$1.bak"; }` |
| Befehlsersetzung | Ausgabe eines Befehls als Wert verwenden | `heute=$(date +%F)` |
| Arithmetik | Mit ganzen Zahlen rechnen | `summe=$(( a + b ))` |
| Exit-Code | Erfolg oder Fehler an den Aufrufer melden | `exit 0`, `exit 1`, Abfrage mit `$?` |

**Variablen und Anführungszeichen (Quoting):**

```bash
name="Anna"                 # Zuweisung: KEINE Leerzeichen um das =
echo "Hallo $name"          # Hallo Anna      (doppelte Anführungszeichen: Variablen werden ersetzt)
echo 'Hallo $name'          # Hallo $name     (einfache Anführungszeichen: alles bleibt wörtlich)
anzahl=$(ls | wc -l)        # Befehlsersetzung: Ausgabe eines Befehls in einer Variable speichern
echo "Dateien: $anzahl"
ls /gibt/es/nicht
echo "Exit-Code: $?"        # ungleich 0, weil ls fehlgeschlagen ist
```

> **Wichtig:** `name = "Anna"` mit Leerzeichen funktioniert nicht. Die Bash hält `name` dann für einen Befehl. Variablen sollten außerdem fast immer in doppelten Anführungszeichen stehen (`"$datei"`), sonst zerfallen Werte mit Leerzeichen wie „meine notizen.txt“ in mehrere Wörter.

## Grundlegende Kommandos und Funktionen

Die folgenden Befehle gehören zum täglichen Handwerkszeug. Sie lassen sich direkt im Terminal ausprobieren und später unverändert in Skripten verwenden.

**Navigation und Dateiverwaltung:**

| Befehl | Funktion | Beispiel |
| --- | --- | --- |
| `pwd` | Aktuelles Verzeichnis anzeigen (print working directory) | `pwd` |
| `ls` | Verzeichnisinhalt auflisten | `ls -la` (alle Dateien, Langformat) |
| `cd` | Verzeichnis wechseln | `cd /var/log`, `cd ..`, `cd ~` |
| `mkdir` | Verzeichnis anlegen | `mkdir -p projekt/logs` |
| `touch` | Leere Datei anlegen oder Zeitstempel aktualisieren | `touch notiz.txt` |
| `cp` | Kopieren | `cp -r quelle/ ziel/` |
| `mv` | Verschieben oder umbenennen | `mv alt.txt neu.txt` |
| `rm` | Löschen (ohne Papierkorb!) | `rm datei.txt`, `rm -r ordner/` |
| `ln -s` | Symbolische Verknüpfung anlegen | `ln -s /opt/app/current app` |

**Inhalte anzeigen, suchen und filtern:**

| Befehl | Funktion | Beispiel |
| --- | --- | --- |
| `cat` | Dateiinhalt ausgeben | `cat /etc/hostname` |
| `less` | Seitenweise lesen, mit `q` beenden | `less /var/log/syslog` |
| `head` / `tail` | Anfang bzw. Ende einer Datei | `tail -n 20 app.log`, `tail -f app.log` (live mitlesen) |
| `grep` | Zeilen nach Muster durchsuchen | `grep -i "error" app.log` |
| `find` | Dateien nach Name, Größe, Alter suchen | `find /tmp -name "*.log" -mtime +7` |
| `sort` / `uniq` | Sortieren bzw. doppelte Zeilen zusammenfassen | `sort namen.txt \| uniq -c` |
| `wc` | Zeilen, Wörter, Zeichen zählen | `wc -l benutzer.csv` |
| `cut` | Spalten aus Text ausschneiden | `cut -d ';' -f 1 benutzer.csv` |
| `echo` | Text ausgeben | `echo "Fertig"` |

**System, Rechte und Hilfe:**

| Befehl | Funktion | Beispiel |
| --- | --- | --- |
| `chmod` | Zugriffsrechte ändern | `chmod +x skript.sh` |
| `chown` | Besitzer ändern | `sudo chown anna:team bericht.txt` |
| `sudo` | Befehl mit Administratorrechten ausführen | `sudo apt update` |
| `ps` / `top` | Laufende Prozesse anzeigen | `ps aux \| grep nginx` |
| `kill` | Signal an einen Prozess senden | `kill 1234`, `kill -9 1234` |
| `df` / `du` | Belegung von Laufwerken bzw. Verzeichnissen | `df -h`, `du -sh /var/log` |
| `date` | Datum und Uhrzeit ausgeben | `date +%Y-%m-%d` |
| `man` / `--help` | Handbuchseite bzw. Kurzhilfe eines Befehls | `man find`, `ls --help` |
| `type` | Zeigt, ob ein Name ein Programm, Alias oder Shell-Befehl ist | `type cd` |

**Umleitungen, Pipes und Verkettung:**

| Zeichen | Bedeutung | Beispiel |
| --- | --- | --- |
| `>` | Ausgabe in Datei schreiben (überschreibt) | `ls > liste.txt` |
| `>>` | Ausgabe an Datei anhängen | `echo "Start" >> lauf.log` |
| `2>` | Fehlermeldungen umleiten | `find / -name x 2> /dev/null` |
| `&>` | Ausgabe und Fehler gemeinsam umleiten | `./backup.sh &> backup.log` |
| `<` | Datei als Eingabe verwenden | `sort < namen.txt` |
| `\|` | Pipe: Ausgabe wird Eingabe des nächsten Befehls | `cat app.log \| grep ERROR` |
| `&&` | Nächster Befehl nur bei Erfolg | `mkdir neu && cd neu` |
| `\|\|` | Nächster Befehl nur bei Fehler | `ping -c1 server \|\| echo "offline"` |
| `;` | Befehle nacheinander, unabhängig vom Ergebnis | `cd /tmp; ls` |

Die Stärke der Bash liegt im Kombinieren kleiner Befehle. Das folgende Beispiel entspricht der Fehleranalyse aus Abschnitt 2.3, nur eben für eine Linux-Logdatei: Es zeigt die fünf häufigsten Fehlermeldungen.

```bash
grep -i "error" /var/log/syslog |   # nur Zeilen mit "error"
    cut -d ' ' -f 5- |               # Datum und Rechnername abschneiden
    sort |                           # gleiche Meldungen untereinander
    uniq -c |                        # gleiche Zeilen zählen
    sort -rn |                       # nach Anzahl absteigend sortieren
    head -n 5                        # die ersten fünf anzeigen
```

**Eigene Funktionen und Aliase:**

Häufig benötigte Befehlsfolgen lassen sich als **Funktion** zusammenfassen. Eine Funktion erhält Argumente wie ein Skript über `$1`, `$2` usw. Ein **Alias** ist eine einfache Abkürzung für einen Befehl. Beides kann man in der Datei `~/.bashrc` dauerhaft hinterlegen.

```bash
alias ll='ls -alF'                   # Abkürzung für eine ausführliche Liste

sichern() {                          # Funktion mit einem Argument
    local datei="$1"
    cp "$datei" "$datei.$(date +%F).bak" && echo "Gesichert: $datei"
}

sichern /etc/hosts                   # Aufruf wie ein normaler Befehl
```

## Effizienzsteigerung durch Tastenkombinationen und Shortcuts

Wer viel im Terminal arbeitet, spart mit wenigen Tastenkombinationen viel Zeit und vermeidet Tippfehler. Die Bash nutzt dafür standardmäßig die Bibliothek **Readline** mit Kürzeln im Stil des Editors Emacs.

| Tastenkombination | Wirkung |
| --- | --- |
| **Tab** | Befehl, Datei- oder Verzeichnisnamen automatisch vervollständigen |
| **Tab Tab** | Alle möglichen Vervollständigungen anzeigen |
| **↑ / ↓** | Durch zuletzt eingegebene Befehle blättern |
| **Strg + R** | Befehlsverlauf rückwärts durchsuchen. Erneut Strg + R springt zum nächsten Treffer |
| **Strg + C** | Laufenden Befehl abbrechen (sendet das Signal SIGINT) |
| **Strg + Z** | Laufenden Befehl anhalten. Mit `fg` im Vordergrund, mit `bg` im Hintergrund fortsetzen |
| **Strg + D** | Eingabe beenden (Dateiende). In einer leeren Zeile wird die Shell verlassen |
| **Strg + L** | Bildschirm leeren, wie der Befehl `clear` |
| **Strg + A / Strg + E** | Cursor an den Anfang bzw. das Ende der Zeile |
| **Alt + B / Alt + F** | Cursor ein Wort zurück bzw. vor |
| **Strg + W** | Wort vor dem Cursor löschen |
| **Strg + U / Strg + K** | Alles vor bzw. hinter dem Cursor löschen |
| **Strg + Y** | Zuletzt gelöschten Text wieder einfügen |
| **Alt + .** | Letztes Argument des vorherigen Befehls einfügen |
| **Strg + Umschalt + C / V** | Kopieren und Einfügen in vielen Linux-Terminals, da Strg + C den Befehl abbricht |

Zusätzlich bietet die Bash **History Expansion**, also Kurzformen, die auf frühere Befehle zugreifen:

| Kurzform | Bedeutung | Beispiel |
| --- | --- | --- |
| `!!` | Den letzten Befehl wiederholen | `sudo !!` wiederholt den letzten Befehl mit Administratorrechten |
| `!$` | Letztes Argument des vorherigen Befehls | `mkdir projekt` und dann `cd !$` |
| `!n` | Befehl Nummer n aus dem Verlauf ausführen | `history` zeigt die Nummern, `!42` führt Nr. 42 aus |
| `!text` | Letzten Befehl ausführen, der mit „text“ beginnt | `!ssh` |
| `cd -` | Zum vorherigen Verzeichnis zurückwechseln | `cd /var/log`, `cd /etc`, `cd -` |

> **Tipp:** Friert das Terminal plötzlich ein, wurde oft versehentlich **Strg + S** gedrückt (Ausgabe anhalten). **Strg + Q** gibt die Ausgabe wieder frei. Häufig genutzte Aliase und Einstellungen gehören in `~/.bashrc`, damit sie in jeder neuen Shell verfügbar sind.

## Bash-Skripte: Struktur und Syntax von Bash-Skripten

Ein Bash-Skript ist eine Textdatei, üblicherweise mit der Endung `.sh`. Gut aufgebaute Skripte folgen immer derselben Struktur:

1. **Shebang:** `#!/bin/bash` in der ersten Zeile legt den Interpreter fest.
2. **Kopfkommentar:** Zweck, Aufruf, Parameter, Autor und Datum.
3. **Sicherheitsoptionen:** `set -euo pipefail` bricht bei Fehlern und nicht gesetzten Variablen ab.
4. **Variablen und Konstanten:** Pfade und Einstellungen zentral am Anfang festlegen.
5. **Funktionen:** wiederverwendbare Teile vor dem Hauptprogramm definieren.
6. **Hauptprogramm:** Parameter prüfen, Funktionen aufrufen, Ergebnisse ausgeben.
7. **Exit-Code:** mit `exit 0` (Erfolg) oder einem Fehlercode enden.

**Vorlage für ein Bash-Skript:**

```bash
#!/bin/bash
# ------------------------------------------------------------
# Name:    logs_archivieren.sh
# Zweck:   Packt Logdateien, die älter als N Tage sind, in ein Archiv
# Aufruf:  ./logs_archivieren.sh <Verzeichnis> [Tage]
# ------------------------------------------------------------
set -euo pipefail                     # bei Fehlern sofort abbrechen

LOGDIR="${1:?Bitte ein Verzeichnis angeben}"   # Pflichtparameter
TAGE="${2:-7}"                                  # optional, Standard 7
ARCHIV="logs_$(date +%F).tar.gz"

log() {                                         # Ausgabe mit Zeitstempel
    echo "$(date '+%F %T') $*"
}

if [[ ! -d "$LOGDIR" ]]; then
    log "Fehler: $LOGDIR ist kein Verzeichnis." >&2
    exit 1
fi

dateien=$(find "$LOGDIR" -name "*.log" -mtime +"$TAGE")
if [[ -z "$dateien" ]]; then
    log "Keine Logdateien älter als $TAGE Tage gefunden."
    exit 0
fi

tar -czf "$ARCHIV" $dateien && log "Archiv erstellt: $ARCHIV"
exit 0
```

**Skript ausführbar machen und starten:**

```bash
chmod +x logs_archivieren.sh          # Ausführrecht setzen (einmalig)
./logs_archivieren.sh /var/log/app 14 # starten; ./ = im aktuellen Verzeichnis
bash logs_archivieren.sh /var/log/app # alternativ ohne Ausführrecht
bash -x logs_archivieren.sh /tmp      # Debug-Modus: zeigt jede ausgeführte Zeile
```

**Sonderparameter:**

| Variable | Inhalt |
| --- | --- |
| `$0` | Name des Skripts |
| `$1` … `$9` | Erstes bis neuntes Argument beim Aufruf |
| `$#` | Anzahl der übergebenen Argumente |
| `$@` | Alle Argumente als einzelne Wörter (in Anführungszeichen: `"$@"`) |
| `$?` | Exit-Code des zuletzt ausgeführten Befehls |
| `$$` | Prozess-ID (PID) des laufenden Skripts |
| `${var:-wert}` | Wert von `var` oder, falls leer, `wert` als Standard |

**Bedingungen:**

Bedingungen werden in der Bash mit `[[ ... ]]` geprüft. Wichtig sind die Leerzeichen innerhalb der Klammern. `if` wird mit `fi` abgeschlossen, `case` mit `esac`.

```bash
if [[ -f "$datei" ]]; then
    echo "Datei vorhanden"
elif [[ -d "$datei" ]]; then
    echo "Das ist ein Verzeichnis"
else
    echo "Nicht gefunden"
fi

case "$1" in                          # Mehrfachauswahl
    start) echo "Starte Dienst" ;;
    stop)  echo "Stoppe Dienst" ;;
    *)     echo "Aufruf: $0 {start|stop}"; exit 1 ;;
esac
```

| Prüfung | Bedeutung | Prüfung | Bedeutung |
| --- | --- | --- | --- |
| `-f datei` | ist eine reguläre Datei | `a == b` | Texte gleich (auch Muster wie `*.txt`) |
| `-d pfad` | ist ein Verzeichnis | `a != b` | Texte ungleich |
| `-e pfad` | existiert (Datei oder Ordner) | `-z text` | Text ist leer |
| `-r` / `-w` / `-x` | lesbar / schreibbar / ausführbar | `-n text` | Text ist nicht leer |
| `x -eq y` | Zahlen gleich | `x -ne y` | Zahlen ungleich |
| `x -lt y` / `x -le y` | kleiner / kleiner gleich | `x -gt y` / `x -ge y` | größer / größer gleich |
| `!` | Verneinung, z. B. `! -f datei` | `&&` / `\|\|` | und / oder |

**Schleifen:**

```bash
for server in web01 web02 db01; do     # über eine Liste
    ping -c1 "$server" &> /dev/null && echo "$server erreichbar"
done

for i in {1..5}; do echo "Durchlauf $i"; done   # Zahlenbereich

for datei in /var/log/*.log; do        # über Dateien (Platzhalter)
    echo "$(basename "$datei")"
done

while read -r name; do                 # Datei zeilenweise lesen
    echo "Lege Benutzer an: $name"
done < benutzer.txt
```

**Funktionen mit Rückgabewert:**

```bash
ist_erreichbar() {
    local host="$1"                    # local: Variable gilt nur in der Funktion
    ping -c1 -W2 "$host" &> /dev/null  # Exit-Code von ping wird zum Rückgabewert
}

if ist_erreichbar "fileserver"; then
    echo "Fileserver online"
else
    echo "Fileserver nicht erreichbar" >&2
fi
```

Zur Orientierung zeigt die Tabelle die wichtigsten Konstrukte in Bash und PowerShell nebeneinander:

| Konstrukt | Bash | PowerShell |
| --- | --- | --- |
| Variable | `name="Anna"`, `echo "$name"` | `$name = "Anna"` |
| Bedingung | `if [[ $a -gt 5 ]]; then ... fi` | `if ($a -gt 5) { ... }` |
| Schleife | `for f in *.txt; do ... done` | `foreach ($f in Get-ChildItem *.txt) { ... }` |
| Funktion | `gruss() { echo "Hallo $1"; }` | `function Gruss($n) { "Hallo $n" }` |
| Argumente | `$1`, `$@`, `$#` | `param(...)`, `$args` |
| Fehlerprüfung | `$?`, `set -e`, `\|\|` | `try/catch`, `$?`, `-ErrorAction Stop` |
| Ausgabe | `echo`, `printf` | `Write-Output`, `Write-Host` |

> **Wichtig:** Wird ein Skript unter Windows gespeichert, enthält es oft Windows-Zeilenenden (CRLF). Linux meldet dann Fehler wie `bad interpreter` oder `$'\r': command not found`. Im Editor das Zeilenende auf **LF** umstellen oder die Datei mit `dos2unix skript.sh` umwandeln. Das kostenlose Prüfwerkzeug `shellcheck` findet typische Fehler wie fehlende Anführungszeichen, bevor das Skript läuft.

**Bezug zu den Übungen:** Die Skripte `tempfile_cleanup.sh` und `signal_cleanup.sh` in `Uebungen_29.09` zeigen Funktionen, Bedingungen, Exit-Codes und das Abfangen von Signalen mit `trap`, z. B. um bei Strg + C temporäre Dateien aufzuräumen.

## Coding Challenge

**Aufgabe:** Erstelle ein Bash-Skript, das das Verzeichnis `/home/benutzer/dokumente` durchsucht und für jede Datei mithilfe einer `for`-Schleife prüft, ob sie die Erweiterung `.txt` besitzt. Wenn eine Datei auf `.txt` endet, soll der Dateiname zusammen mit der Nachricht „Die Datei \[Dateiname\] ist eine Textdatei.“ ausgegeben werden. Andernfalls soll die Nachricht „Die Datei \[Dateiname\] ist keine Textdatei.“ erscheinen. Stelle sicher, dass der Dateiname ohne den Verzeichnispfad (also nur der Basename) in der Ausgabe erscheint.

**Vorgehen:**

1. Verzeichnis in einer Variable festlegen und prüfen, ob es existiert.
2. Mit `for datei in "$verzeichnis"/*` über alle Einträge des Verzeichnisses laufen.
3. Unterverzeichnisse überspringen, denn geprüft werden nur Dateien.
4. Mit `basename` den Dateinamen ohne Pfad ermitteln.
5. Mit `[[ "$name" == *.txt ]]` prüfen, ob der Name auf `.txt` endet, und die passende Meldung ausgeben.

<details>
<summary>Musterlösung anzeigen</summary>

**Musterlösung (txt\_pruefen.sh):**

```bash
#!/bin/bash
# Prüft für jede Datei in einem Verzeichnis, ob sie die Endung .txt hat.

verzeichnis="/home/benutzer/dokumente"

# Abbrechen, wenn das Verzeichnis nicht existiert
if [[ ! -d "$verzeichnis" ]]; then
    echo "Fehler: Das Verzeichnis $verzeichnis existiert nicht." >&2
    exit 1
fi

for datei in "$verzeichnis"/*; do
    [[ -f "$datei" ]] || continue        # nur Dateien, Ordner überspringen

    name=$(basename "$datei")            # Pfad entfernen, nur der Dateiname

    if [[ "$name" == *.txt ]]; then
        echo "Die Datei $name ist eine Textdatei."
    else
        echo "Die Datei $name ist keine Textdatei."
    fi
done

exit 0
```

**Erläuterung der wichtigsten Zeilen:**

| Code | Erklärung |
| --- | --- |
| `#!/bin/bash` | Shebang: Das Skript wird mit der Bash ausgeführt. |
| `[[ ! -d "$verzeichnis" ]]` | Prüft, ob das Verzeichnis fehlt. Dann folgen eine Fehlermeldung auf dem Fehlerkanal (`>&2`) und `exit 1`. |
| `for datei in "$verzeichnis"/*` | Der Platzhalter `*` liefert alle Einträge mit vollem Pfad, z. B. `/home/benutzer/dokumente/bericht.txt`. Die Anführungszeichen schützen Pfade mit Leerzeichen. |
| `[[ -f "$datei" ]] \|\| continue` | Ist der Eintrag keine reguläre Datei (z. B. ein Ordner), springt `continue` zum nächsten Durchlauf. Das fängt auch ein leeres Verzeichnis ab: Dann bleibt `*` unverändert stehen und ist keine Datei. |
| `name=$(basename "$datei")` | `basename` entfernt den Verzeichnispfad. Aus `/home/benutzer/dokumente/bericht.txt` wird `bericht.txt`. Gleichwertig ohne externes Programm: `name="${datei##*/}"`. |
| `[[ "$name" == *.txt ]]` | Mustervergleich: wahr, wenn der Name auf `.txt` endet. Das Muster rechts darf dafür nicht in Anführungszeichen stehen. |
| `echo "Die Datei $name ..."` | Gibt die geforderte Meldung mit dem Dateinamen aus. |

**Beispielausgabe:**

Enthält das Verzeichnis die Dateien `bericht.txt`, `foto.jpg`, `meine notizen.txt`, `notizen.TXT`, `skript.sh` und den Unterordner `archiv`, erzeugt das Skript diese Ausgabe:

```text
Die Datei bericht.txt ist eine Textdatei.
Die Datei foto.jpg ist keine Textdatei.
Die Datei meine notizen.txt ist eine Textdatei.
Die Datei notizen.TXT ist keine Textdatei.
Die Datei skript.sh ist keine Textdatei.
```

**Testen:**

Damit nicht im echten Dokumentenordner getestet werden muss, legt man ein Testverzeichnis an und setzt die Variable `verzeichnis` vorübergehend darauf:

```bash
mkdir -p /tmp/test_dok/archiv
touch /tmp/test_dok/{bericht.txt,foto.jpg,"meine notizen.txt",notizen.TXT,skript.sh}
chmod +x txt_pruefen.sh
./txt_pruefen.sh
```

| Testfall | Erwartetes Ergebnis |
| --- | --- |
| Datei mit Endung `.txt` | „… ist eine Textdatei.“ |
| Datei mit anderer Endung (`.jpg`, `.sh`) | „… ist keine Textdatei.“ |
| Dateiname mit Leerzeichen | Name erscheint vollständig, z. B. „meine notizen.txt“ |
| Großgeschriebene Endung `.TXT` | Gilt als keine Textdatei, da der Vergleich zwischen Groß- und Kleinschreibung unterscheidet |
| Unterordner `archiv` | Wird übersprungen, keine Ausgabe |
| Leeres Verzeichnis | Keine Ausgabe, kein Fehler |
| Verzeichnis existiert nicht | Fehlermeldung und Exit-Code 1 |

**Erweiterungen:** Mit `verzeichnis="${1:-/home/benutzer/dokumente}"` lässt sich das Verzeichnis beim Aufruf übergeben. `shopt -s nocasematch` vor der Schleife erkennt auch `.TXT` als Textdatei. Versteckte Dateien (Name beginnt mit einem Punkt) werden von `*` standardmäßig nicht erfasst. `shopt -s dotglob` bezieht sie mit ein.

</details>
