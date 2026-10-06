---
title: "Grundlagen von Bash und Shell-Scripting"
description: "Skriptsprachen kennenlernen, Programmiergrundlagen auffrischen, sicher mit der Befehlszeile arbeiten und erste Bash-Skripte schreiben."
duration: "45 Minuten"
---

Auf Linux-Servern, in Containern, in CI/CD-Pipelines und auf vielen Netzwerkgeräten ist die **Bash** das wichtigste Werkzeug für die Automatisierung. Dieses Kapitel erklärt zuerst, was Skriptsprachen ausmacht, und frischt die Programmiergrundlagen auf, die Du dafür brauchst. Danach geht es um die Arbeit mit der Befehlszeile: die wichtigsten Kommandos, Eingabe und Ausgabe sowie Tastenkürzel, die Dir viel Tipparbeit sparen. Zum Schluss lernst Du Aufbau und Syntax von Bash-Skripten kennen – mit einer Übung und einer Coding Challenge samt Musterlösung.

## Einführung in Skriptsprachen

> **Definition:** Eine **Skriptsprache** ist eine Programmiersprache, deren Programme (Skripte) innerhalb einer Laufzeitumgebung ausgeführt werden. Anders als bei kompilierten Sprachen wird der Code nicht vorab in Maschinencode übersetzt, sondern meist zur Laufzeit von einem **Interpreter** gelesen und direkt ausgeführt. Änderungen wirken dadurch sofort, ohne zeitaufwendigen Kompilierungsschritt.

Skriptsprachen sind darauf ausgelegt, mit wenig Code viel zu erreichen. Sie werden eingesetzt, um wiederkehrende Aufgaben zu automatisieren, Schnittstellen zwischen verschiedenen Systemen zu schaffen oder Webanwendungen zu entwickeln. Weil sie vorhandene Programme und Befehle geschickt miteinander verbinden, nennt man sie auch „Klebstoff-Sprachen“. Bekannte Beispiele sind **Bash**, **PowerShell**, **Python**, **JavaScript**, **Ruby** und **PHP**.

| Aspekt | Skriptsprache | Kompilierte Sprache |
| --- | --- | --- |
| Ausführung | Interpreter liest und führt den Quelltext direkt aus | Compiler übersetzt vorab in ein ausführbares Programm |
| Entwicklungszyklus | Schreiben → sofort ausführen | Schreiben → kompilieren → ausführen |
| Geschwindigkeit | Langsamer, für Verwaltungsaufgaben meist ausreichend | Sehr schnell |
| Typisierung | Meist dynamisch, oft ohne Typangabe | Meist statisch, Typen werden geprüft |
| Typischer Einsatz | Automatisierung, Administration, Datenaufbereitung, Web | Anwendungen, Treiber, Betriebssysteme |
| Beispiele | Bash, PowerShell, Python, JavaScript | C, C++, Go, Rust |

Eine **Shell** (engl. „Schale“) ist das Programm, das zwischen Dir und dem Betriebssystem vermittelt: Sie nimmt Befehle entgegen, startet Programme und gibt Ergebnisse aus. Jede Shell ist zugleich ein Interpreter für ihre eigene Skriptsprache. Ein **Shell-Skript** ist eine Textdatei mit Befehlen, die die Shell nacheinander ausführt – also genau das, was Du sonst von Hand eintippen würdest.

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

> **Kurz gesagt:** Wer Systeme automatisiert, braucht meist beide Welten: PowerShell für Windows-Umgebungen und Bash für Linux, Container und Cloud-Werkzeuge. Die PowerShell lernst Du im nächsten Kapitel kennen.

## Auffrischung der Grundlagen

Bevor Du mit Skriptsprachen automatisierst, lohnt sich ein Blick auf die Grundlagen, auf denen jedes Skript aufbaut. Vier Bereiche sind dabei besonders wichtig:

1. **Grundlagen der Programmierung:** Variablen, Datentypen, Kontrollstrukturen, Funktionen und Fehlerbehandlung.
2. **Algorithmen und Datenstrukturen:** Listen, Arrays, Stacks, Queues und Dictionaries.
3. **Umgang mit APIs und Bibliotheken:** fremde Dienste und fertigen Code einbinden.
4. **Betriebssystemkenntnisse:** Dateisystem, Prozessverwaltung und Netzwerkkonfiguration.

### Grundlagen der Programmierung

Diese fünf Konzepte bilden das Fundament aller Programmiersprachen – auch der Skriptsprachen:

**1. Variablen** sind benannte Speicherstellen, in denen ein Programm während der Ausführung Daten ablegt. Über ihren Namen werden sie im Code angesprochen, ihr Wert kann sich ändern. Die Zuweisung erfolgt meist mit einem Gleichheitszeichen, z. B. `x = 5` (in der Bash ohne Leerzeichen: `x=5`).

**2. Datentypen** legen fest, welche Art von Daten eine Variable aufnehmen kann. Jede Sprache bietet darüber hinaus eigene Typen und Strukturen an.

| Datentyp | Englisch | Inhalt | Beispiel |
| --- | --- | --- | --- |
| Ganzzahl | integer | ganze Zahlen | `42`, `-7` |
| Fließkommazahl | floating-point number | Dezimalzahlen | `3.14` |
| Zeichenkette | string | Text | `"Hallo"` |
| Boolescher Wert | boolean | nur zwei Zustände: wahr oder falsch | `true`, `false` |

**3. Kontrollstrukturen** steuern, in welcher Reihenfolge und wie oft Code ausgeführt wird:

- **Schleifen** führen einen Codeblock wiederholt aus. `for`-Schleifen laufen eine bestimmte Anzahl von Durchläufen oder über eine Liste, `while`-Schleifen so lange, wie eine Bedingung wahr ist.
- **Bedingte Anweisungen** entscheiden anhand einer Bedingung, ob ein Codeblock ausgeführt wird. Die Grundformen sind `if`, `else` und `elif` bzw. `else if`.

**4. Funktionen** sind wiederverwendbare Codeblöcke für eine bestimmte Aufgabe. Eine Funktion hat einen Namen, eventuell eine Liste von Parametern und einen Block von Anweisungen. Sie kann einen Wert zurückgeben und beliebig oft aufgerufen werden – innerhalb eines Programms oder sogar aus anderen Programmen heraus.

**5. Fehlerbehandlung** bedeutet, Fehler während der Ausführung zu erkennen und kontrolliert darauf zu reagieren. Die meisten modernen Sprachen nutzen dafür ein `try ... catch`-System (in Python `try ... except`). So bricht das Programm nicht abrupt ab, sondern kann zum Beispiel eine Meldung ausgeben, aufräumen oder es erneut versuchen. In der Bash übernehmen diese Aufgabe Exit-Codes, `set -e` und `trap` (mehr dazu in Kapitel 5).

### Algorithmen und Datenstrukturen

Skriptsprachen sind benutzerfreundlich, trotzdem hilft ein Grundverständnis gängiger Datenstrukturen, um effiziente Lösungen zu entwickeln.

| Datenstruktur | Prinzip | Typische Operationen |
| --- | --- | --- |
| **Liste** | Geordnete Sammlung, jedes Element über einen Index erreichbar. Die Größe ist dynamisch, Elemente können hinzugefügt und entfernt werden. | Hinzufügen, Entfernen, Zugreifen, Durchsuchen, Sortieren |
| **Array** | Ähnlich wie eine Liste, in vielen Sprachen aber mit fester Größe und nur einem Datentyp. Sehr schneller Zugriff über den Index. | Zugreifen über den Index, Durchsuchen, Sortieren |
| **Stack** (Stapel) | **LIFO** – Last in, first out: Das zuletzt hinzugefügte Element wird als erstes entfernt. | `push` (oben ablegen), `pop` (oberstes entfernen), `peek`/`top` (oberstes ansehen) |
| **Queue** (Warteschlange) | **FIFO** – First in, first out: Das zuerst hinzugefügte Element wird als erstes entfernt. | `enqueue` (hinten anstellen), `dequeue` (vorderstes entfernen), `front` (vorderstes ansehen) |
| **Dictionary** (Hashmap) | Schlüssel-Wert-Speicher: Jeder Schlüssel ist eindeutig und mit einem Wert verknüpft. | Paar hinzufügen oder entfernen, Wert über Schlüssel abrufen, Schlüssel auf Existenz prüfen |

Welche Struktur passt wann?

- **Arrays**, wenn Du schnell über einen Index auf Elemente zugreifen musst.
- **Stacks**, um Operationen rückgängig zu machen – das zuletzt Getane wird zuerst zurückgenommen.
- **Queues**, wenn Elemente in der Reihenfolge ihrer Ankunft verarbeitet werden, z. B. Druckaufträge.
- **Dictionaries**, wenn Du schnell über einen Schlüssel nachschlagen, einfügen oder löschen musst, z. B. beim Zwischenspeichern (Caching) von Ergebnissen.

> **Tipp:** Auch die Bash kennt Arrays (`server=(web01 web02 db01)`, Zugriff mit `"${server[0]}"`, alle Elemente mit `"${server[@]}"`) und Dictionaries als „assoziative Arrays“ (`declare -A port=([web]=80 [ssh]=22)`). Die Größe von Bash-Arrays ist nicht festgelegt.

### Umgang mit APIs und Bibliotheken

Viele Automatisierungsaufgaben erfordern es, mit fremden Diensten zu sprechen oder fertigen Code zu nutzen.

> **Definition:** Eine **API** (Application Programming Interface) ist eine Schnittstelle, über die Programme mit anderen Programmen oder Diensten zusammenarbeiten, ohne deren interne Funktionsweise kennen zu müssen. Sie legt fest, welche Methoden und Datenformate es gibt, z. B. für Datenabfragen oder Aktualisierungen.

Um eine API sinnvoll zu nutzen, liest Du zuerst ihre **Dokumentation**: Welche Funktionen gibt es, wie müssen Anfragen aufgebaut sein und welche Antworten kommen zurück? Gute Dokumentationen enthalten Beispiele, die beim Schreiben des eigenen Codes helfen.

**Bibliotheken** sind Sammlungen von fertigem Code für bestimmte Aufgaben – von kleinen Hilfsfunktionen bis zu umfangreichen Frameworks. Sie sparen Entwicklungszeit. Eingebunden werden sie direkt in der Sprache (z. B. mit `import` in Python) oder über einen **Paketmanager**, der Installation und Abhängigkeiten verwaltet (z. B. `pip` für Python, `npm` für JavaScript, `apt` unter Debian/Ubuntu).

Worauf Du bei der Integration achten solltest:

- **Authentifizierung und Autorisierung:** Viele APIs verlangen einen API-Schlüssel oder ein Token. Diese Zugangsdaten gehören nie direkt in den Code (siehe Kapitel 5, „Sicherheitsaspekte in Linux-Skripten“).
- **Leistung und Rate Limits:** Externe APIs begrenzen oft die Zahl der Anfragen. Caching und sparsame Abfragen vermeiden eine Überlastung.
- **Fehlerbehandlung:** Netzwerkfehler, fehlerhafte Daten und Ausnahmen der API oder Bibliothek müssen abgefangen werden.
- **Tests:** Teile des Skripts, die APIs oder Bibliotheken nutzen, mit Tests absichern, damit sie auch unter wechselnden Bedingungen korrekt arbeiten.

So sieht ein einfacher API-Aufruf in der Bash aus. `curl` stellt die Anfrage, `jq` liest einen Wert aus der JSON-Antwort:

```bash
# Öffentliche IP-Adresse über eine Web-API abfragen
antwort=$(curl -s --fail "https://api.ipify.org?format=json") || { echo "API nicht erreichbar" >&2; exit 1; }
echo "$antwort" | jq -r '.ip'
```

### Betriebssystemkenntnisse

Skripte automatisieren meist Aufgaben des Betriebssystems. Drei Bereiche solltest Du deshalb kennen:

**Dateisystem:** Das Dateisystem organisiert, wie Dateien und Verzeichnisse auf Datenträgern wie Festplatten oder SSDs abgelegt werden. Wichtig sind **Pfade**, die den Ort einer Datei angeben, und **Berechtigungen**, die festlegen, wer eine Datei lesen, schreiben oder ausführen darf. Wer das versteht, schreibt Skripte, die zuverlässig mit Dateien arbeiten.

**Prozessverwaltung:** Jedes laufende Programm ist ein **Prozess**. Das Betriebssystem startet, überwacht und beendet Prozesse und teilt ihnen Ressourcen wie CPU-Zeit und Arbeitsspeicher zu. Dieses Wissen hilft, ressourcenintensive Skripte zu optimieren und Prozesse gezielt zu starten, zu überwachen oder zu beenden.

**Netzwerkkonfiguration:** Dazu gehören Einstellungen wie IP-Adressen, Netzmasken, Gateways und DNS-Server. Sie sind die Grundlage für Skripte, die Netzwerkressourcen nutzen – etwa um Netzwerk-Backups zu automatisieren, Verbindungen zu überwachen oder mit anderen Systemen zu kommunizieren.

| Bereich | Typische Bash-Befehle |
| --- | --- |
| Dateisystem | `ls`, `cd`, `cp`, `mv`, `chmod`, `find`, `df` |
| Prozessverwaltung | `ps`, `top`, `kill`, `systemctl` |
| Netzwerk | `ip addr`, `ping`, `ss`, `curl`, `dig` |

## Grundlegende Merkmale und Komponenten von Skriptsprachen

Nach dieser Auffrischung geht es nun um die Skriptsprachen selbst. Viele von ihnen teilen dieselben Merkmale – sie machen sie zum idealen Werkzeug für Automatisierung, schnelle Anpassungen und kleine Hilfsskripte:

- **Einfache Syntax:** Skriptsprachen sind meist gut lesbar, sodass auch Einsteiger schnell loslegen können. Die Syntax legt fest, wie Variablen, Schleifen, Bedingungen, Funktionen und andere Elemente geschrieben werden.
- **Interpretiert:** Der Quelltext wird zur Laufzeit gelesen und direkt ausgeführt. Das erleichtert Entwicklung und Test – Fehler zeigen sich aber oft erst, wenn die betroffene Zeile erreicht wird.
- **Dynamische Typisierung:** Datentypen werden nicht vorab festgelegt, sondern zur Laufzeit bestimmt. Das macht den Code flexibler und kürzer, kann aber zu unerwarteten Laufzeitfehlern führen. In der Bash ist jeder Wert zunächst eine Zeichenkette.
- **Umfangreiche Standardbibliothek:** Eingebaute Funktionen und Module erleichtern häufige Aufgaben wie Dateioperationen, Netzwerkverbindungen und Textverarbeitung.
- **Ereignisse und Automatisierung:** Einfache Mechanismen, um auf Benutzeraktionen oder Systemereignisse zu reagieren.
- **Plattformunabhängigkeit:** Viele Skripte laufen ohne Änderung auf verschiedenen Betriebssystemen, weil der Interpreter die Unterschiede verbirgt. Ein Skript ist allerdings nur so portabel wie die Befehle, die es aufruft.
- **Exit-Codes:** Jeder Befehl meldet beim Beenden eine Zahl zurück. `0` bedeutet Erfolg, jeder andere Wert einen Fehler.

> **Merke:** Skriptsprachen sind leicht erweiterbar und lassen sich gut in andere Anwendungen integrieren. Sie bieten Schnittstellen zu anderen Programmiersprachen und erlauben das Einbinden externer Bibliotheken oder System-APIs.

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

## Interaktion mit der Befehlszeile

Skripte für die Automatisierung kannst Du sowohl in einer **Shell** als auch in einer **Entwicklungsumgebung (IDE)** schreiben und ausführen. Beide haben ihre Stärken:

| | Shell | IDE (integrierte Entwicklungsumgebung) |
| --- | --- | --- |
| Was ist das? | Textbasierte Schnittstelle zum Betriebssystem für Befehle, Skripte und Systemverwaltung | Softwarepaket mit Code-Editor, Interpreter/Compiler, Debugger und oft Versionskontrolle |
| Beispiele | Bash (Linux, macOS), Eingabeaufforderung und PowerShell (Windows) | Visual Studio Code, PyCharm |
| Stärken | Direkte Befehlseingabe, Dateiverwaltung, Systemüberwachung, Arbeit direkt auf dem Server | Syntax-Hervorhebung, Code-Vervollständigung, Debugging, Integration mit Git und anderen Werkzeugen |
| Geeignet für | Schnelle oder einmalige Aufgaben, kleine Automatisierungen, Testen von Codeschnipseln | Komplexere Skripte, größere und langfristige Projekte |

In beiden Fällen führt am Ende meist ein **Interpreter** das Skript aus, der in die Shell oder die IDE eingebunden ist. Welche Umgebung Du wählst, hängt vom Projekt, der Komplexität des Skripts und Deinen Vorlieben ab. Viele arbeiten kombiniert: In der IDE schreiben und pflegen sie Skripte, in der Shell probieren sie Befehle schnell aus.

> **Definition:** Die **Befehlszeile** – auch Kommandozeile oder Terminal – ist eine textbasierte Schnittstelle zum Betriebssystem. Statt mit der Maus zu klicken, gibst Du Befehle in Textform ein, um z. B. Dateien zu verschieben, Inhalte anzuzeigen oder Programme zu starten. Unter Windows heißt sie „Eingabeaufforderung“ oder „PowerShell“, unter macOS und Linux „Terminal“.

Der Umgang mit der Befehlszeile ist für viele IT-Berufe unverzichtbar. Du arbeitest damit schnell und effizient, schreibst Skripte, löst Probleme – und bekommst einen tiefen Einblick, wie Computer und Betriebssysteme funktionieren.

### Eingabe, Ausgabe und Rückmeldung

Jede Arbeit mit der Befehlszeile folgt demselben Muster:

| Element | Bedeutung | Beispiel |
| --- | --- | --- |
| **Eingabe** | Ein **Kommando** sagt, welche Aktion ausgeführt wird. **Argumente** geben an, worauf (Dateien, Verzeichnisse) und wie (Optionen) es angewendet wird. | In `cp datei1.txt datei2.txt` ist `cp` das Kommando zum Kopieren, `datei1.txt` und `datei2.txt` sind die Argumente für Quelle und Ziel. |
| **Ausgabe** | Was nach der Ausführung angezeigt wird: eine Bestätigung, eine Liste, das Ergebnis eines Programms oder eine Fehlermeldung | `ls` listet alle Dateien und Ordner im aktuellen Verzeichnis auf. |
| **Rückmeldung** | Zeigt, ob und wie ein Befehl ausgeführt wurde. Fehlermeldungen geben wertvolle Hinweise, warum etwas nicht funktioniert hat. | `cp gibtsnicht.txt kopie.txt` meldet: `No such file or directory` – die Quelldatei wurde nicht gefunden. |

> **Tipp:** Lies Fehlermeldungen immer vollständig. Meist steht darin genau, was fehlt: eine Datei, ein Recht (`Permission denied`) oder ein Befehl (`command not found`). Ob der letzte Befehl erfolgreich war, verrät Dir außerdem `echo $?` – `0` heißt Erfolg.

### Tipps für die effektive Interaktion

- **Tab-Vervollständigung:** Beginne einen Befehl oder Dateinamen und drücke **Tab** – die Shell ergänzt den Rest automatisch.
- **Verlauf nutzen:** Die Shell merkt sich Deine Befehle. Mit den Pfeiltasten **↑** und **↓** holst Du frühere Befehle zurück.
- **Handbuchseiten:** Mit `man` zeigst Du die Hilfe zu einem Kommando an, z. B. `man ls`. Dort stehen alle Optionen mit Erklärung. Eine Kurzhilfe liefert meist `ls --help`.

## Grundlegende Kommandos und Funktionen

Die folgenden Befehle gehören zum täglichen Handwerkszeug. Du kannst sie direkt im Terminal ausprobieren und später unverändert in Skripten verwenden. Für den Einstieg reichen diese acht:

| Befehl | Bedeutung | Was er tut | Beispiel |
| --- | --- | --- | --- |
| `pwd` | print working directory | Zeigt den Pfad des aktuellen Verzeichnisses, also wo Du Dich im Dateisystem befindest | `pwd` |
| `ls` | list | Listet den Inhalt des aktuellen Verzeichnisses auf. `ls -l` zeigt eine ausführliche Liste | `ls -l` |
| `cd` | change directory | Wechselt das Verzeichnis | `cd Dokumente` |
| `mkdir` | make directory | Legt ein neues Verzeichnis an | `mkdir MeineProjekte` |
| `touch` | – | Legt eine neue, leere Datei an | `touch notizen.txt` |
| `rm` | remove | Löscht Dateien oder Verzeichnisse | `rm notizen.txt` |
| `cp` | copy | Kopiert eine Datei: `cp quelle ziel` | `cp bericht.txt bericht_alt.txt` |
| `mv` | move | Verschiebt oder benennt um: `mv quelle ziel` | `mv alt.txt neu.txt` |

> **Achtung:** `rm` löscht ohne Papierkorb. Gelöschte Dateien lassen sich normalerweise nicht einfach wiederherstellen. Prüfe vorher mit `ls`, was betroffen ist, und nutze bei Unsicherheit `rm -i`, das vor jedem Löschen nachfragt.

Der erste Kontakt mit der Befehlszeile mag ungewohnt sein. Beginne mit einfachen Aufgaben wie dem Navigieren im Dateisystem oder dem Anlegen von Dateien – je mehr Du ausprobierst, desto sicherer wirst Du.

**Weitere Befehle zur Navigation und Dateiverwaltung:**

| Befehl | Funktion | Beispiel |
| --- | --- | --- |
| `ls -la` | Alle Dateien inkl. versteckter, im Langformat | `ls -la ~` |
| `cd ..` / `cd ~` / `cd -` | Eine Ebene höher / ins Home-Verzeichnis / zurück zum vorherigen Verzeichnis | `cd /var/log`, `cd ..` |
| `mkdir -p` | Verzeichnis samt fehlender Zwischenordner anlegen | `mkdir -p projekt/logs` |
| `cp -r` | Verzeichnisse mit Inhalt kopieren | `cp -r quelle/ ziel/` |
| `rm -r` | Verzeichnis mit Inhalt löschen | `rm -r ordner/` |
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

Die Stärke der Bash liegt im Kombinieren kleiner Befehle. Das folgende Beispiel greift die Fehleranalyse aus Kapitel 2 auf, hier für eine Linux-Logdatei: Es zeigt die fünf häufigsten Fehlermeldungen.

```bash
grep -i "error" /var/log/syslog |   # nur Zeilen mit "error"
    cut -d ' ' -f 5- |               # Datum und Rechnername abschneiden
    sort |                           # gleiche Meldungen untereinander
    uniq -c |                        # gleiche Zeilen zählen
    sort -rn |                       # nach Anzahl absteigend sortieren
    head -n 5                        # die ersten fünf anzeigen
```

## Effizienzsteigerung durch Tastenkombinationen und Shortcuts

Tastenkombinationen sind ein entscheidender Faktor, um im Terminal produktiv zu arbeiten. Mit ihnen erledigst Du häufige Aktionen ohne Umweg über die Maus, navigierst durch Deine Befehlshistorie und vermeidest Tippfehler. Die Bash nutzt dafür die Bibliothek **Readline** mit Kürzeln im Stil des Editors Emacs.

> **Hinweis:** Im Terminal steht **Strg** für die Steuerungstaste. Auf dem Mac ist das die Taste **control (⌃)**, nicht die Befehlstaste ⌘ – Strg + C heißt dort also **control + C**. Abweichungen für macOS stehen in Klammern.

**Grundlegende Tastenkombinationen:**

| Tastenkombination | Wirkung |
| --- | --- |
| **Strg + C** | Bricht den laufenden Befehl ab (sendet das Signal SIGINT). Hilft, wenn ein Befehl länger dauert als erwartet oder nicht reagiert. |
| **Strg + Z** | Hält den laufenden Prozess an. Mit `bg` läuft er im Hintergrund weiter, mit `fg` holst Du ihn in den Vordergrund zurück. So kannst Du zwischendurch etwas anderes im Terminal erledigen. |
| **Strg + D** | Signalisiert das Ende der Eingabe. In einer leeren Zeile wird die Shell beendet – wie mit dem Befehl `exit`. |
| **Strg + L** (macOS-Terminal zusätzlich **⌘ + K**) | Leert den Bildschirm, wie der Befehl `clear`, nur schneller. |

**Navigation und Bearbeitung:**

| Tastenkombination | Wirkung |
| --- | --- |
| **↑ / ↓** | Durch die zuletzt eingegebenen Befehle blättern, um sie erneut auszuführen |
| **Strg + R** | Interaktive Suche in der Befehlshistorie: Tippe einen Teil des Befehls, passende Treffer erscheinen. Erneut **Strg + R** springt zum nächsten Treffer, **Enter** führt den Befehl aus. |
| **Tab** | Befehl, Datei- oder Verzeichnisnamen automatisch vervollständigen |
| **Tab Tab** | Alle möglichen Vervollständigungen anzeigen |

**Fortgeschrittene Shortcuts:**

| Tastenkombination | Wirkung |
| --- | --- |
| **Strg + A / Strg + E** | Cursor an den Anfang (A) bzw. das Ende (E) der Zeile – praktisch bei langen Befehlen |
| **Alt + B / Alt + F** (macOS: **Option + ← / →**) | Cursor ein Wort zurück (B) bzw. vor (F) |
| **Strg + U / Strg + K** | Text vom Cursor bis zum Anfang (U) bzw. bis zum Ende (K) der Zeile löschen |
| **Strg + W** | Wort vor dem Cursor löschen |
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

Wer diese Kürzel beherrscht, arbeitet nicht nur schneller, sondern macht auch weniger Fehler. Probiere sie nach und nach aus und übernimm die, die Dir am meisten nützen, in Deine tägliche Routine.

> **Tipp:** Friert das Terminal plötzlich ein, wurde oft versehentlich **Strg + S** gedrückt (Ausgabe anhalten). **Strg + Q** gibt die Ausgabe wieder frei. Häufig genutzte Aliase und Einstellungen gehören in `~/.bashrc`, damit sie in jeder neuen Shell verfügbar sind.

## Bash-Skripte: Struktur und Syntax

Bash ist mehr als nur ein Weg, mit dem Computer zu kommunizieren: Sie ist eine vollwertige Sprache, mit der Du Aufgaben automatisierst, Prozesse steuerst und Dein System voll ausschöpfst. In diesem Abschnitt geht es um den grundlegenden Aufbau und die Syntax von Bash-Skripten.

> **Definition:** **Bash** steht für **Bourne Again Shell** – ein Wortspiel und eine Hommage an die ursprüngliche Unix-Shell `sh`, die **Bourne Shell** von **Stephen Bourne**. „Bourne“ verweist auf ihren Entwickler, „Again“ darauf, dass Bash eine erneuerte und verbesserte Version ist, „Shell“ auf die Schnittstelle, über die Du mit dem Betriebssystem arbeitest. Bash wurde 1989 von **Brian Fox** für das GNU-Projekt entwickelt.

Bash ist die Standard-Shell der meisten Linux-Distributionen und war es lange auch unter macOS (seit macOS 10.15 ist dort zsh voreingestellt, Bash bleibt aber verfügbar). Gegenüber der Bourne Shell bietet sie bessere Skriptfähigkeiten, mehr Komfort bei der interaktiven Arbeit und zusätzliche eingebaute Befehle.

### Grundlegende Struktur und Shebang-Zeile

Ein Bash-Skript ist eine Textdatei mit einer Reihe von Befehlen, die die Bash ausführt, üblicherweise mit der Endung `.sh`. Du schreibst es in einem beliebigen Texteditor. Jedes Skript beginnt mit der **Shebang-Zeile**: Sie steht in der ersten Zeile, beginnt mit `#!` und nennt den Pfad zum Interpreter. So wird das Skript immer mit dem richtigen Programm ausgeführt, egal welche Shell Du gerade verwendest.

| Interpreter | Shebang-Zeile |
| --- | --- |
| Bash | `#!/bin/bash` |
| Python | `#!/usr/bin/env python3` |
| Perl | `#!/usr/bin/perl` |
| sh (Bourne Shell) | `#!/bin/sh` |

`bin` steht für **binary**. Das Verzeichnis `/bin` enthält auf Unix-ähnlichen Systemen wichtige ausführbare Programme (Binaries), die das System und grundlegende Benutzeroperationen brauchen – darunter auch Interpreter wie die Bash.

Hinter `#!` steht immer ein absoluter Pfad. Er kann direkt zum Interpreter führen (`#!/bin/bash`) oder zum Hilfsprogramm `env` (`#!/usr/bin/env python3`). `env` sucht den Interpreter dann in den Verzeichnissen der Umgebungsvariable `PATH`. Das ist nützlich, wenn der Interpreter auf verschiedenen Systemen an unterschiedlichen Orten liegt, und macht das Skript portabler.

### Was ist ein Pfad?

Ein **Pfad** ist eine Zeichenkette, die den Ort einer Datei oder eines Verzeichnisses im Dateisystem beschreibt. Es gibt zwei Arten:

| | Relativer Pfad | Absoluter Pfad |
| --- | --- | --- |
| Ausgangspunkt | Das aktuelle Arbeitsverzeichnis | Das Wurzelverzeichnis: `/` unter Unix/Linux, z. B. `C:\` unter Windows |
| Beispiel Unix | `dokumente/datei.txt` (aktuelles Verzeichnis ist `/home/benutzer`) | `/home/benutzer/dokumente/datei.txt` |
| Beispiel Windows | `Dokumente\datei.txt` (aktuelles Verzeichnis ist `C:\Benutzer\Benutzername`) | `C:\Benutzer\Benutzername\Dokumente\datei.txt` |
| Eigenschaft | Kürzer, funktioniert aber nur vom richtigen Standort aus | Funktioniert immer, unabhängig vom aktuellen Verzeichnis |

Ein Alltagsvergleich hilft: Ein **absoluter Pfad** ist wie eine vollständige Adresse, die vom Stadtzentrum ausgeht und genau beschreibt, wie man zu einem Raum gelangt:

```text
Hauptstraße -> Blumenstraße -> 123 -> 1. Stock -> Raum 4
```

Ein **relativer Pfad** ist dagegen eine Wegbeschreibung von Deinem aktuellen Standort aus. Stehst Du schon in der Blumenstraße 123, 1. Stock, in Raum 1, genügt: „Geh von Raum 1 zu Raum 4.“

> **Tipp:** In der Bash steht `.` für das aktuelle Verzeichnis, `..` für das übergeordnete und `~` für Dein Home-Verzeichnis. Deshalb startest Du ein Skript im aktuellen Ordner mit `./skript.sh`. In Skripten sind absolute Pfade sicherer, weil ein Skript oft nicht aus dem Ordner gestartet wird, in dem es liegt – etwa bei einem Cronjob.

### Variablen

In Bash-Skripten speichern **Variablen** Daten, die später im Skript verwendet werden – vergleichbar mit Abkürzungen für Text, Zahlen oder andere Werte.

- **Zuweisen:** `Variablenname=Wert` – um das Gleichheitszeichen dürfen **keine Leerzeichen** stehen.
- **Verwenden:** Ein Dollarzeichen vor dem Namen liefert den Wert: `$Variablenname`. Mit `echo` gibst Du ihn aus.
- **Ändern:** Eine neue Zuweisung überschreibt den bisherigen Wert.

```bash
#!/bin/bash
name="Alice"
echo "Hallo, $name!"     # Hallo, Alice!

name="Bob"               # Der Wert der Variable 'name' wird auf 'Bob' geändert
echo "Hallo, $name!"     # Hallo, Bob!
```

Beim Verwenden von Variablen spielen die **Anführungszeichen** eine wichtige Rolle:

```bash
name="Anna"
echo "Hallo $name"     # Hallo Anna   – doppelte: Variablen werden ersetzt
echo 'Hallo $name'     # Hallo $name  – einfache: alles bleibt wörtlich
anzahl=$(ls | wc -l)   # Befehlsersetzung: Ausgabe in Variable speichern
echo "Dateien: $anzahl"
```

> **Wichtig:** `name = "Anna"` mit Leerzeichen funktioniert nicht – die Bash hält `name` dann für einen Befehl. Setze Variablen außerdem fast immer in doppelte Anführungszeichen (`"$datei"`), sonst zerfallen Werte mit Leerzeichen wie „meine notizen.txt“ in mehrere Wörter.

### Bedingungen

Mit **Bedingungen** trifft ein Skript Entscheidungen. Die einfachste Form ist die `if`-Anweisung. Sie prüft, ob ein Ausdruck wahr ist:

- ✓ Ist die Bedingung **wahr**, wird ein Block von Befehlen ausgeführt.
- ✕ Ist sie **falsch**, können mit `else` oder `elif` alternative Befehle folgen.

**Vergleichsoperatoren für Zahlen** funktionieren in `[ ... ]` und `[[ ... ]]`:

| Operator | Bedeutung | Englisch |
| --- | --- | --- |
| `-eq` | gleich | equal |
| `-ne` | ungleich | not equal |
| `-lt` | kleiner als | less than |
| `-le` | kleiner oder gleich | less than or equal |
| `-gt` | größer als | greater than |
| `-ge` | größer oder gleich | greater than or equal |

Statt dieser Buchstaben-Operatoren kannst Du auch die gewohnten Zeichen verwenden – allerdings nur in bestimmten Klammern. Hier sind die Zeichen nicht einfach austauschbar:

| Zweck | Schreibweise | Beispiel |
| --- | --- | --- |
| Zahlen mit Zeichen vergleichen | doppelte runde Klammern `(( ... ))` mit `==`, `!=`, `<`, `<=`, `>`, `>=` | `if (( zahl >= 10 )); then` |
| Zeichenketten vergleichen | `[[ ... ]]` mit `==` und `!=` (in `[ ... ]` ein einfaches `=`) | `if [[ "$antwort" == "ja" ]]; then` |
| Zeichenketten alphabetisch vergleichen | `[[ ... ]]` mit `<` und `>` | `if [[ "$a" < "$b" ]]; then` |

> **Achtung:** In `[[ ... ]]` vergleichen `<` und `>` Texte **alphabetisch**, nicht numerisch: `[[ 9 > 10 ]]` ist wahr, weil „9“ alphabetisch hinter „1“ steht. Für Zahlen deshalb `-gt`, `-lt` usw. oder `(( ... ))` verwenden.

Weitere häufige Prüfungen:

| Prüfung | Bedeutung | Prüfung | Bedeutung |
| --- | --- | --- | --- |
| `-f datei` | ist eine reguläre Datei | `-z text` | Text ist leer |
| `-d pfad` | ist ein Verzeichnis | `-n text` | Text ist nicht leer |
| `-e pfad` | existiert (Datei oder Ordner) | `!` | Verneinung, z. B. `! -f datei` |
| `-r` / `-w` / `-x` | lesbar / schreibbar / ausführbar | `&&` / `\|\|` | und / oder (in `[[ ... ]]`) |

**Beispiel 1 – einfaches `if`:** Das Skript prüft, ob eine Zahl größer als 10 ist.

```bash
#!/bin/bash
zahl=15

if [ $zahl -gt 10 ]; then
    echo "Die Zahl ist größer als 10."
fi
```

`fi` schließt den `if`-Block ab – es ist einfach „if“ rückwärts geschrieben. Nach demselben Prinzip endet ein `case`-Block mit `esac`.

**Beispiel 2 – `if` mit `else`:** Trifft die Bedingung nicht zu, erscheint eine alternative Meldung.

```bash
#!/bin/bash
zahl=5

if [ $zahl -gt 10 ]; then
    echo "Die Zahl ist größer als 10."
else
    echo "Die Zahl ist 10 oder kleiner."
fi
```

**Beispiel 3 – `if`, `elif` und `else`:** Mehrere Bedingungen werden nacheinander geprüft.

```bash
#!/bin/bash
zahl=10

if [ $zahl -gt 10 ]; then
    echo "Die Zahl ist größer als 10."
elif [ $zahl -eq 10 ]; then
    echo "Die Zahl ist gleich 10."
else
    echo "Die Zahl ist kleiner als 10."
fi
```

Für viele feste Auswahlmöglichkeiten ist `case` übersichtlicher als eine lange `elif`-Kette:

```bash
case "$1" in
    start) echo "Starte Dienst" ;;
    stop)  echo "Stoppe Dienst" ;;
    *)     echo "Aufruf: $0 {start|stop}"; exit 1 ;;
esac
```

> **Merke:** Eine `if`-Anweisung prüft eine Bedingung und führt je nach Ergebnis unterschiedliche Befehle aus. Sie ist das grundlegende Werkzeug, um den Ablauf eines Skripts zu steuern, und wird mit `else` und `elif` für komplexere Entscheidungen kombiniert. Wichtig sind die **Leerzeichen innerhalb der Klammern**: `[ $zahl -gt 10 ]`, nicht `[$zahl -gt 10]`.

### Schleifen

**Schleifen** führen einen Block von Befehlen wiederholt aus. Sie sind das Herzstück der Automatisierung, weil sie dieselbe Aufgabe für viele Dateien, Server oder Benutzer erledigen.

| Schleife | Läuft … | Typischer Einsatz |
| --- | --- | --- |
| `while` | solange eine Bedingung **wahr** ist | Datei zeilenweise lesen, auf ein Ereignis warten |
| `until` | solange eine Bedingung **falsch** ist – das Gegenstück zu `while` | warten, bis ein Dienst erreichbar ist |
| `for` | einmal für jeden Wert einer Liste | über Dateien, Server oder einen Zahlenbereich laufen |

```bash
for server in web01 web02 db01; do     # über eine Liste
    ping -c1 "$server" &> /dev/null && echo "$server erreichbar"
done

for i in {1..5}; do echo "Durchlauf $i"; done   # Zahlenbereich

while read -r name; do                 # Datei zeilenweise lesen
    echo "Lege Benutzer an: $name"
done < benutzer.txt

until ping -c1 fileserver &> /dev/null; do      # warten, bis der Server antwortet
    echo "Warte auf fileserver ..."; sleep 5
done
```

### Kommentare

**Kommentare** sind Textzeilen, die die Bash ignoriert. Sie dokumentieren den Code, erklären Zusammenhänge und machen das Skript für Dich und andere verständlich. Alles, was nach einem `#` steht, wird nicht ausgeführt – mit einer Ausnahme: Die Shebang-Zeile `#!` in der ersten Zeile ist ein Sonderfall, den das Betriebssystem auswertet.

```bash
# Ganze Zeile als Kommentar: Sicherung der Konfiguration
cp /etc/hosts /backup/hosts.bak   # Kommentar am Zeilenende
```

## Aufbau und Strukturierung von mehrzeiligen Bash-Skripten

Jetzt geht es vom einzelnen Befehl zum vollständigen Skript. Mehrzeilige Bash-Skripte folgen demselben Grundaufbau wie einfache, enthalten aber mehrere Befehle, Variablen, Kontrollstrukturen und Funktionen. Die Kunst besteht darin, diese Elemente so zu ordnen, dass das Skript **verständlich, wartbar und erweiterbar** bleibt. Gut aufgebaute Skripte folgen deshalb immer derselben Reihenfolge:

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

**Funktionen und Aliase:**

Häufig benötigte Befehlsfolgen fasst Du als **Funktion** zusammen. Eine Funktion erhält Argumente wie ein Skript über `$1`, `$2` usw. Ihr Rückgabewert ist der Exit-Code des letzten Befehls – so lässt sie sich direkt in einer Bedingung verwenden. Ein **Alias** ist eine einfache Abkürzung für einen Befehl. Beides kannst Du in der Datei `~/.bashrc` dauerhaft hinterlegen.

```bash
alias ll='ls -alF'                     # Abkürzung für eine ausführliche Liste

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

> **Wichtig:** Wird ein Skript unter Windows gespeichert, enthält es oft Windows-Zeilenenden (CRLF). Linux meldet dann Fehler wie `bad interpreter` oder `$'\r': command not found`. Stelle im Editor das Zeilenende auf **LF** um oder wandle die Datei mit `dos2unix skript.sh` um. Das kostenlose Prüfwerkzeug `shellcheck` findet typische Fehler wie fehlende Anführungszeichen, bevor das Skript läuft.

**Bezug zu den Übungen:** Die Skripte `tempfile_cleanup.sh` und `signal_cleanup.sh` in `Uebungen_29.09` zeigen Funktionen, Bedingungen, Exit-Codes und das Abfangen von Signalen mit `trap`, z. B. um bei Strg + C temporäre Dateien aufzuräumen.

## Übung: Verständnis bestehender Skripte

Beschreibe die Funktion dieses Bash-Skripts: Was macht das Skript? Welche Ausgabe erzeugt es?

```bash
#!/bin/bash

zahl=3

if [ $zahl -gt 10 ]; then
    echo "Die Zahl ist größer als 10."
elif [ $zahl -eq 10 ]; then
    echo "Die Zahl ist gleich 10."
else
    echo "Die Zahl ist kleiner als 10."
fi
```

<details>
<summary>Lösung anzeigen</summary>

**Was macht das Skript?** Es speichert den Wert `3` in der Variable `zahl` und ordnet die Zahl dann mit einer `if`-`elif`-`else`-Anweisung in eine von drei Gruppen ein: größer als 10, gleich 10 oder kleiner als 10.

**Ablauf Schritt für Schritt:**

| Zeile | Was passiert | Ergebnis bei `zahl=3` |
| --- | --- | --- |
| `#!/bin/bash` | Shebang: Das Skript wird mit der Bash ausgeführt. | – |
| `zahl=3` | Die Variable `zahl` erhält den Wert 3. | `zahl` ist 3 |
| `if [ $zahl -gt 10 ]` | Ist 3 größer als 10? | falsch, weiter zu `elif` |
| `elif [ $zahl -eq 10 ]` | Ist 3 gleich 10? | falsch, weiter zu `else` |
| `else` | Keine der Bedingungen war wahr. | Dieser Block wird ausgeführt. |
| `fi` | Ende der `if`-Anweisung. | – |

**Ausgabe:**

```text
Die Zahl ist kleiner als 10.
```

**Zum Weiterdenken:** Mit `zahl=10` lautet die Ausgabe „Die Zahl ist gleich 10.“, mit `zahl=15` „Die Zahl ist größer als 10.“. Flexibler wird das Skript, wenn die Zahl beim Aufruf übergeben wird: `zahl="${1:-3}"` übernimmt das erste Argument und nutzt 3 als Standardwert.

</details>

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

Damit Du nicht im echten Dokumentenordner testen musst, legst Du ein Testverzeichnis an und setzt die Variable `verzeichnis` vorübergehend darauf:

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
