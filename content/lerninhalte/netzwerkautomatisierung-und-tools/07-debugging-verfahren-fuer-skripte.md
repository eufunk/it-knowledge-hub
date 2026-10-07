---
title: "Debugging-Verfahren für Skripte"
description: "Breakpoints, Stepping und Tracing, Konsole, Debugger, Logging und Assertions, Fehlermuster, fortgeschrittene Debugging-Werkzeuge und ein systematisches Vorgehen – mit Übung und Coding Challenge in Python."
duration: "50 Minuten"
---

Dieses Kapitel erklärt zuerst, was Debugging ist und welche Methoden und Werkzeuge es gibt. Danach geht es um typische Fehlerursachen, um fortgeschrittene Funktionen von Debuggern und um ein schrittweises Vorgehen bei der Fehlerbehebung. Eine Übung und eine Coding Challenge in Python schließen das Kapitel ab.

## Grundlagen des Debuggings

> **Definition:** **Debugging** ist der Prozess, Fehler oder Probleme in Software zu finden, zu analysieren und zu beheben. Diese Fehler, auch „Bugs“ genannt, führen zu unerwartetem Verhalten, Abstürzen oder falschen Ergebnissen. Beim Debugging gehst Du den Code durch, prüfst Fehlermeldungen, fügst Diagnoseausgaben ein und nutzt Debugging-Werkzeuge, mit denen Du den Zustand des Programms Schritt für Schritt untersuchst. Ziel ist, die Ursache des Problems zu finden und zu beheben, damit die Software korrekt und zuverlässig funktioniert.

**Warum brauchst Du Debugging?**

| Grund | Bedeutung |
| --- | --- |
| **Qualitätssicherung** | Fehlerfreie Programme sind zuverlässiger und bieten eine bessere Benutzererfahrung. Durch Debugging stellst Du sicher, dass Dein Code stabil und funktionsfähig ist. |
| **Effizienzsteigerung** | Fehler führen zu Abstürzen und unerwartetem Verhalten. Wer sie früh findet und behebt, spart langfristig Zeit und Ressourcen. |
| **Lernprozess** | Debugging vertieft Dein Verständnis für den eigenen Code: Du lernst, wie die Teile Deines Programms zusammenarbeiten und wie Du Probleme systematisch angehst. |

**Hintergrund:** Der Begriff hat eine bekannte Geschichte: Am 9. September 1947 fand das Team um Grace Hopper im Rechner Mark II (Aiken Relay Calculator) an der Harvard University eine Motte, die zwischen den Kontakten eines Relais steckte und eine Störung verursachte. Die Motte wurde ins Logbuch geklebt, mit dem Vermerk „First actual case of bug being found“. Das Wort „Bug“ für technische Fehler war schon vorher üblich, doch der Vorfall trug dazu bei, „Debugging“ in der Computerwelt fest zu verankern.

## Methoden des Debuggings

Es gibt verschiedene Methoden, um Fehler im Code zu finden und zu beheben. Die drei gängigsten sind Breakpoints, Stepping und Tracing.

### Breakpoints

Ein **Breakpoint** (Haltepunkt) ist eine Stelle im Code, an der die Ausführung anhält. Du kannst dann Variablenwerte prüfen und den Programmfluss analysieren. Breakpoints zeigen Dir, wie Daten durch Dein Programm fließen und wo genau ein Fehler auftritt.

1. Setze einen Breakpoint an der Stelle, an der Du den Fehler vermutest. In den meisten Entwicklungsumgebungen (IDEs) genügt ein Klick neben die Zeilennummer.
2. Starte das Programm im Debugging-Modus. Es läuft bis zum Breakpoint und hält dort an.
3. Prüfe Variablenwerte, den Call Stack und den aktuellen Zustand des Programms.
4. Setze das Programm fort, bis zum nächsten Breakpoint oder bis zum Ende.

### Stepping

Beim **Stepping** gehst Du den Code Zeile für Zeile durch und findest so den genauen Punkt, an dem der Fehler auftritt. Es gibt drei Arten:

| Art | Was passiert | Wann sinnvoll |
| --- | --- | --- |
| **Step Into** | Springt in die aufgerufene Funktion hinein und verfolgt sie Zeile für Zeile | Wenn Du den Ablauf innerhalb einer Funktion untersuchen willst |
| **Step Over** | Führt die aktuelle Zeile aus, Funktionsaufrufe werden als Ganzes ausgeführt | Wenn Dich nur der übergeordnete Ablauf interessiert |
| **Step Out** | Läuft bis zum Ende der aktuellen Funktion und kehrt zur aufrufenden Stelle zurück | Wenn Du eine Funktion verlassen willst, die Du nicht weiter untersuchen musst |

1. Setze einen Breakpoint an der Stelle, an der Du mit dem Stepping beginnen möchtest.
2. Starte das Programm im Debugging-Modus und warte, bis es am Breakpoint anhält.
3. Gehe mit den Stepping-Funktionen Zeile für Zeile weiter.
4. Beobachte, wie sich die Variablenwerte ändern und wo der Fehler auftritt.

### Tracing

Beim **Tracing** verfolgst Du Programmfluss und Variablenwerte über einen längeren Zeitraum, z. B. durch Log-Ausgaben an mehreren Stellen oder durch eine automatische Ablaufverfolgung. Tracing hilft bei komplexen Fehlern, die nur unter bestimmten Bedingungen auftreten.

1. Füge an kritischen Stellen Log-Ausgaben ein, die Ablauf und Zustände protokollieren.
2. Nutze Tracing-Funktionen, die den Programmablauf automatisch aufzeichnen.
3. Untersuche die gesammelten Daten, um Muster zu erkennen und Fehlerquellen einzugrenzen.

In Bash zeigt `bash -x` jede Zeile mit eingesetzten Werten an, bevor sie ausgeführt wird:

```text
$ bash -x logs_sichern.sh
+ ziel=/tmp/sicherung
+ for datei in *.log
+ cp a.log /tmp/sicherung/
+ for datei in *.log
+ cp b.log /tmp/sicherung/
```

Dieselbe Wirkung hat `set -x` im Skript; `set +x` schaltet die Ablaufverfolgung wieder aus. In PowerShell übernimmt das `Set-PSDebug -Trace 1`.

## Techniken und Werkzeuge des Debuggings

### Die Konsole: die einfachste Form des Debuggings

Die Konsole ist oft das erste Werkzeug beim Debuggen. Du beobachtest dort die Ausgaben Deines Programms in Echtzeit und prüfst, ob Variablen die erwarteten Werte haben und ob bestimmte Codeabschnitte überhaupt ausgeführt werden. Für einfache Skripte und schnelle Prüfungen ist das oft der schnellste Weg.

1. **Ausgaben einfügen:** An strategischen Stellen `print` (Python), `echo` (Bash) oder `Write-Host` (PowerShell) einsetzen, um Variablenwerte oder den Ablauf sichtbar zu machen.
2. **Ausgabe beobachten:** Programm starten und prüfen, ob die Ausgaben den Erwartungen entsprechen.
3. **Anpassen und wiederholen:** Code anhand der Beobachtungen ändern, bis der Fehler gefunden ist. Danach die Diagnoseausgaben wieder entfernen.

### Der integrierte Debugger

Bei komplexeren Problemen stößt die Konsole schnell an ihre Grenzen. Moderne Entwicklungsumgebungen wie Visual Studio Code, PyCharm oder Eclipse haben einen integrierten Debugger mit diesen Funktionen:

| Funktion | Beschreibung |
| --- | --- |
| **Breakpoints** | Die Ausführung hält an einer bestimmten Stelle an, damit Du den Zustand dort untersuchen kannst. |
| **Stepping** | Den Code Zeile für Zeile durchlaufen und genau verfolgen, wie er ausgeführt wird. |
| **Variable Watch** | Werte ausgewählter Variablen laufend anzeigen und beobachten, wie sie sich während der Ausführung ändern. |
| **Call Stack** | Zeigt die Kette der Funktionsaufrufe, die zur aktuellen Stelle geführt hat. So verstehst Du, wie das Programm dorthin gelangt ist. |

### Log-Dateien

Log-Dateien protokollieren den Ablauf eines Programms. Sie sind oft der erste Anhaltspunkt, besonders bei Skripten, die unbeaufsichtigt laufen, etwa nachts per cron oder Aufgabenplanung.

1. **Logging einrichten:** Ein Logging-Modul oder Framework einbinden, z. B. `logging` in Python oder Log4j in Java.
2. **Log-Level festlegen:** In Python sind das DEBUG, INFO, WARNING, ERROR und CRITICAL. Sie ordnen Meldungen nach Wichtigkeit. Im Betrieb protokollierst Du meist ab INFO, bei der Fehlersuche ab DEBUG.
3. **Meldungen schreiben:** An strategischen Stellen Log-Meldungen mit relevanten Informationen einfügen, z. B. Variablenwerte, Statusmeldungen oder Fehler.

**Beispiel in Python:**

```python
import logging

logging.basicConfig(level=logging.DEBUG)

def divide(a, b):
    logging.debug(f"Eingaben: a={a}, b={b}")
    if b == 0:
        logging.error("Division durch null versucht!")
        return None
    result = a / b
    logging.info(f"Division erfolgreich: {result}")
    return result
```

**Ausgabe bei den Aufrufen `divide(10, 4)` und `divide(1, 0)`:**

```text
DEBUG:root:Eingaben: a=10, b=4
INFO:root:Division erfolgreich: 2.5
DEBUG:root:Eingaben: a=1, b=0
ERROR:root:Division durch null versucht!
```

Die Funktion `divide` protokolliert Eingaben, Erfolg und Fehler. So kannst Du den Ablauf nachvollziehen und Fehler schnell finden. Mit `logging.basicConfig(filename="skript.log", level=logging.INFO)` landen die Meldungen in einer Datei statt in der Konsole.

### Assertions

**Assertions** prüfen Annahmen über Deinen Code. Eine Assertion ist eine Bedingung, die an dieser Stelle immer wahr sein muss. Ist sie falsch, bricht das Programm mit einer Fehlermeldung ab. So fallen logische Fehler früh auf.

1. **Annahmen definieren:** Überlege, welche Bedingungen immer gelten müssen, z. B. dass eine Liste nicht leer ist.
2. **Assertions einfügen:** In Python mit der Anweisung `assert Bedingung, "Meldung"`.

```python
def calculate_average(numbers):
    assert len(numbers) > 0, "Die Liste darf nicht leer sein"
    return sum(numbers) / len(numbers)
```

Ist die Liste leer, bricht das Programm mit `AssertionError: Die Liste darf nicht leer sein` ab, statt mit einer schwer verständlichen Division durch null.

> **Achtung:** Python überspringt alle `assert`-Anweisungen, wenn ein Skript mit `python -O` gestartet wird. Assertions eignen sich deshalb zum Aufdecken von Programmierfehlern, nicht zum Prüfen von Benutzereingaben. Eingaben prüfst Du mit `if` und einer gezielten Fehlermeldung oder Ausnahme, z. B. `raise ValueError(...)`.

### Debugging-Werkzeuge je Skriptsprache

Jede Skriptsprache bringt eigene Hilfsmittel mit, die ohne Entwicklungsumgebung auskommen:

| Aufgabe | Bash | PowerShell | Python |
| --- | --- | --- | --- |
| Syntax prüfen, ohne auszuführen | `bash -n skript.sh` | Editor mit PowerShell-Erweiterung, `Invoke-ScriptAnalyzer` | `python -m py_compile skript.py` |
| Ablauf verfolgen (Tracing) | `bash -x skript.sh` oder `set -x` | `Set-PSDebug -Trace 1` | Logging, `python -m trace --trace skript.py` |
| Breakpoint setzen | nicht eingebaut, Hilfsmittel `read -p` als Pause | `Set-PSBreakpoint -Script ... -Line 12` | `breakpoint()` im Code, startet den Debugger pdb |
| Strengere Fehlerprüfung | `set -euo pipefail` | `Set-StrictMode -Version Latest` | Linter wie Ruff oder Pylint |
| Fehler abfangen | Exit-Code `$?` prüfen, `trap ... ERR` | `try { } catch { }` mit `-ErrorAction Stop` | `try: ... except ...:` |

**Laufzeitfehler in PowerShell gezielt abfangen:**

```powershell
try {
    $inhalt = Get-Content -Path 'C:\gibt\es\nicht.txt' -ErrorAction Stop
}
catch [System.Management.Automation.ItemNotFoundException] {
    Write-Warning "Datei fehlt: $($_.Exception.Message)"
}
catch {
    Write-Error "Unerwarteter Fehler: $_"
}
```

`-ErrorAction Stop` macht aus einem nicht abbrechenden Fehler eine Ausnahme, die `catch` abfangen kann. Der erste `catch`-Block behandelt gezielt die fehlende Datei, der zweite alle übrigen Fehler.

## Ursachen von Fehlern verstehen

Fehler in Skripten führen zu unerwarteten Ergebnissen, Systemabstürzen oder sogar Sicherheitslücken. Deshalb ist es wichtig, Anomalien früh zu erkennen und zu beheben.

> **Definition:** **Anomalien** sind unerwartete Abweichungen vom normalen Verhalten eines Programms. Sie zeigen sich als Fehler und führen zu Abstürzen, Leistungsproblemen oder falschen Ergebnissen.

Besonders schwierig sind Anomalien, die unregelmäßig auftreten und sich schwer reproduzieren lassen. Dann hilft nur systematisches Vorgehen: Debugging-Werkzeuge einsetzen, Logging ergänzen, kürzliche Codeänderungen prüfen und die Bedingungen herausfinden, unter denen die Anomalie auftritt.

### Gängige Fehlermuster in Skripten

| Fehlerart | Beschreibung | Beispiele | Erkennung |
| --- | --- | --- | --- |
| **Syntaxfehler** | Der Code verstößt gegen die Regeln der Sprache. | Fehlende Klammer oder Doppelpunkt, falsche Einrückung in Python, fehlendes `fi` oder `done` in Bash | Editor markiert sie direkt, Syntaxprüfung wie `bash -n` oder `python -m py_compile` |
| **Logikfehler** | Der Code läuft, liefert aber nicht das gewünschte Ergebnis. Es gibt keine Fehlermeldung. | Falsche Bedingung in `if`, `<` statt `<=`, Schleife läuft einmal zu oft oder zu selten | Code schrittweise durchgehen, Ausgaben mit Erwartungen vergleichen, Tests |
| **Laufzeitfehler** | Der Fehler tritt erst während der Ausführung auf, oft durch unerwartete Eingaben oder Zustände. | Division durch null, fehlende Datei, Zugriff auf eine Variable ohne Wert (`None` in Python, `$null` in PowerShell) | Fehlermeldungen und Ausnahmen auswerten, mit `try/catch` bzw. `try/except` abfangen |

> **Hinweis:** Wann ein Syntaxfehler auffällt, hängt von der Sprache ab. Python prüft die gesamte Datei vor dem Start: Bei einem Syntaxfehler läuft keine einzige Zeile. Bash liest das Skript nach und nach: Befehle vor der fehlerhaften Stelle werden bereits ausgeführt. Ein Bash-Skript kann also halb durchlaufen und dann abbrechen. Deshalb lohnt sich `bash -n` vor dem ersten Lauf.

### Ursachenanalyse von Fehlern

| Schritt | Vorgehen | Beispiel |
| --- | --- | --- |
| **1 Fehler reproduzieren** | Den Fehler gezielt wiederholbar machen und die genauen Schritte dokumentieren. Das grenzt das Problem ein. | Ein Skript stürzt bei einer bestimmten Eingabe ab: Eingabewerte und Bedingungen notieren. |
| **2 Problematischen Code isolieren** | Den Code in kleinere Abschnitte teilen und diese einzeln testen, bis der fehlerhafte Bereich feststeht. | Breakpoints setzen und den Code schrittweise durchlaufen. |
| **3 Fehlermeldungen analysieren** | Fehlermeldungen genau lesen. Sie nennen meist Datei, Zeile und Art des Fehlers. | Meldet Python `'NoneType' object has no attribute ...`, prüfen, warum die Variable keinen Wert hat. |

### Code-Reviews zur Fehlererkennung

Beim **Code-Review** prüft ein Teammitglied den Code eines anderen auf Fehler, Schwachstellen und Verbesserungsmöglichkeiten. Ein frischer Blick deckt oft Probleme auf, die der Autorin oder dem Autor nicht auffallen.

| Kriterium | Leitfrage |
| --- | --- |
| Lesbarkeit | Ist der Code klar und verständlich geschrieben? |
| Konsistenz | Werden ein einheitlicher Stil und einheitliche Namenskonventionen verwendet? |
| Fehlerfreiheit | Gibt es offensichtliche Fehler oder mögliche Bugs? |
| Effizienz | Ist der Code performant und ressourcenschonend? |
| Sicherheit | Sind Eingabeprüfung, Zugriffskontrollen und der Umgang mit Zugangsdaten berücksichtigt? |

**Ablauf eines Code-Reviews:**

1. **Vorbereitung:** Die Autorin oder der Autor beschreibt kurz, was der Code tut und was sich geändert hat.
2. **Durchsicht:** Die Reviewer lesen den Code Zeile für Zeile und achten auf Syntaxfehler, logische Fehler und Best Practices.
3. **Feedback:** Die Reviewer geben konstruktive Rückmeldung, als Kommentar direkt im Code oder im Merge bzw. Pull Request.
4. **Diskussion:** Beide Seiten besprechen das Feedback, klären Unklarheiten und einigen sich auf nötige Änderungen.
5. **Überarbeitung:** Der Code wird anhand des Feedbacks angepasst.
6. **Abschluss:** Ein letzter Blick stellt sicher, dass alle Änderungen korrekt umgesetzt sind.

| Vorteil | Bedeutung |
| --- | --- |
| Qualitätssicherung | Der Code erfüllt die vereinbarten Qualitätsstandards. |
| Wissensaustausch | Wissen über den Code und bewährte Vorgehensweisen verteilt sich im Team. |
| Fehlererkennung | Auch Fehler, die automatisierte Tests übersehen, werden gefunden. |

## Effektive Nutzung von Debugging-Tools

Breakpoints und Stepping sind die Grundlage. Fortgeschrittene Funktionen von Debugging-Werkzeugen geben tiefere Einblicke und beschleunigen die Fehlersuche. Manche stammen aus der Anwendungsentwicklung, etwa mit Java. Die folgenden Abschnitte zeigen jeweils auch, was davon bei Skripten zur Verfügung steht.

### Speicheranalyse und Heap-Dumps

Die **Speicheranalyse** überwacht den Speicherverbrauch eines Programms. Ein **Heap-Dump** ist eine Momentaufnahme des Speichers zu einem bestimmten Zeitpunkt. Er hilft, **Speicherlecks** zu finden: Objekte, die im Speicher bleiben, obwohl sie nicht mehr gebraucht werden.

1. **Heap-Dump erzeugen:** IDEs wie IntelliJ IDEA oder Eclipse haben dafür eingebaute Funktionen, für Java gibt es außerdem VisualVM.
2. **Heap-Dump analysieren:** Den Dump in einem Analysewerkzeug öffnen und auf Objekte achten, die ungewöhnlich viel Speicher belegen.
3. **Speicherlecks identifizieren:** Nach Objekten suchen, die nicht freigegeben werden, obwohl sie nicht mehr benötigt werden.

Bei Skripten genügen meist einfachere Mittel: In Python zeigt das Modul `tracemalloc`, welche Codezeilen wie viel Speicher belegen. In PowerShell liefert `Get-Process -Id $PID` den Speicherverbrauch der laufenden Sitzung, unter Linux zeigen `top` oder `ps` den Verbrauch eines Prozesses.

### Profiling und Performance-Analyse

Ein **Profiler** misst, wie viel Zeit ein Programm in welchen Funktionen verbringt, und zeigt so Engpässe und ineffizienten Code.

1. **Profiler starten:** Viele IDEs haben einen eingebauten Profiler, z. B. Visual Studio oder VisualVM für Java. Für Python ist cProfile bereits enthalten.
2. **Programm ausführen:** Unter realistischen Bedingungen laufen lassen, damit die Messwerte aussagekräftig sind.
3. **Ergebnisse analysieren:** Die Funktionen mit dem größten Zeitanteil zuerst untersuchen.

Ein häufiger Fund beim Profiling ist eine ungünstig gewählte Datenstruktur. Ein Beispiel in Python: Das Skript prüft 2.000 IDs darauf, ob sie in einer Liste mit 100.000 Einträgen vorkommen. Bei einer Liste muss Python dafür jedes Mal die Einträge der Reihe nach durchsuchen, bei einer Menge (`set`) findet es den Eintrag direkt.

```text
$ python -m cProfile -s cumtime pruefung.py
Liste: 0.843 s
Menge: 0.00092 s
   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
     2001    0.842    0.000    0.842    0.000 pruefung.py:4(<genexpr>)
     2001    0.001    0.000    0.001    0.000 pruefung.py:6(<genexpr>)
```

Der Profiler zeigt, dass fast die gesamte Laufzeit in Zeile 4 steckt, der Suche in der Liste. Mit `set(ids)` statt der Liste wird die Prüfung fast tausendmal schneller. Für einzelne Befehle misst in PowerShell `Measure-Command { ... }` und in Bash `time befehl` die Laufzeit.

### Live-Edit und Hot-Swap

Manche Debugging-Werkzeuge erlauben es, Code während der Ausführung zu ändern, ohne das Programm neu zu starten. Das heißt **Live-Edit** oder **Hot-Swap**.

1. **Debug-Modus aktivieren:** Das Programm im Debug-Modus starten.
2. **Code ändern:** Die gewünschte Änderung direkt im Editor vornehmen.
3. **Hot-Swap:** Die IDE übernimmt die Änderung in das laufende Programm.

**Beispiel:** Du entdeckst in einer Webanwendung einen Fehler in der Berechnungslogik einer Methode. Mit Hot-Swap änderst Du die Methode direkt und testest die Wirkung sofort, ohne den Server neu zu starten.

Hot-Swap hat Grenzen: Meist lassen sich nur Methodeninhalte ändern, keine neuen Methoden oder Klassen anlegen. Bei Skripten spielt die Funktion kaum eine Rolle, weil ein Neustart des Skripts ohnehin nur Sekunden dauert.

### Remote-Debugging

Beim **Remote-Debugging** debuggst Du ein Programm, das auf einem anderen Rechner oder Server läuft, etwa weil ein Fehler nur dort auftritt.

1. **Remote-Debugger einrichten:** Auf dem entfernten Rechner den Debugger starten, für Python z. B. debugpy.
2. **Verbindung herstellen:** Von der eigenen IDE aus eine Verbindung zum Remote-Debugger aufbauen, z. B. mit Visual Studio Code.
3. **Wie gewohnt debuggen:** Breakpoints setzen, Variablen prüfen und den Code schrittweise ausführen.

In PowerShell öffnest Du mit `Enter-PSSession -ComputerName server01` eine Sitzung auf dem entfernten Rechner und setzt dort wie gewohnt Breakpoints mit `Set-PSBreakpoint`.

> **Achtung:** Ein Debugger erlaubt vollen Zugriff auf das laufende Programm und seine Daten. Debug-Ports nie offen ins Netz stellen, sondern nur lokal lauschen lassen und über einen SSH-Tunnel verbinden. In Produktionsumgebungen nur nach Absprache debuggen, denn ein angehaltenes Programm bedient in dieser Zeit keine Anfragen.

### Watchpoints und Conditional Breakpoints

Ein **Watchpoint** hält das Programm an, sobald sich der Wert einer bestimmten Variable ändert. Ein **Conditional Breakpoint** (bedingter Haltepunkt) hält nur an, wenn eine festgelegte Bedingung erfüllt ist.

| | Watchpoint | Conditional Breakpoint |
| --- | --- | --- |
| Schritt 1 | Die Variable auswählen, die überwacht werden soll, und den Watchpoint setzen | An der gewünschten Stelle einen Breakpoint setzen |
| Schritt 2 | Der Debugger hält an, sobald die Variable geändert wird | Die Bedingung festlegen, unter der der Breakpoint auslösen soll |

**Beispiel:** Eine Schleife verarbeitet 10.000 Datensätze, der Fehler tritt aber erst bei einem bestimmten Wert auf. Ein normaler Breakpoint würde 10.000-mal anhalten. Ein Conditional Breakpoint hält nur bei genau diesem Wert an.

PowerShell bietet beides über `Set-PSBreakpoint`: Mit `-Variable` entsteht ein Watchpoint, mit `-Action` eine Bedingung. Das Schlüsselwort `break` in der Aktion öffnet den Debugger:

```powershell
# Watchpoint: anhalten, sobald $summe geändert wird
Set-PSBreakpoint -Script .\schleife.ps1 -Variable summe -Mode Write

# Conditional Breakpoint: in Zeile 3 nur anhalten, wenn $i den Wert 4 hat
Set-PSBreakpoint -Script .\schleife.ps1 -Line 3 -Action { if ($i -eq 4) { break } }

Get-PSBreakpoint | Remove-PSBreakpoint    # alle Breakpoints wieder entfernen
```

In Visual Studio Code legst Du eine Bedingung per Rechtsklick auf den Breakpoint fest, im Python-Debugger pdb mit `break skript.py:12, i == 4`.

> **Kurz gesagt:** Speicheranalyse, Profiling, Remote-Debugging und bedingte Haltepunkte machen Deine Programme robuster und schneller. Setze sie gezielt ein, wenn Konsole und einfache Breakpoints nicht mehr ausreichen.

## Fehlerbehebung in Skripten

_„Wenn Du keine Fehler machst, dann sind die Probleme, an denen Du arbeitest, nicht schwierig genug. Und das ist ein großer Fehler.“_ – Frank Wilczek, Physik-Nobelpreisträger

Fehler in Skripten sind unvermeidlich, aber mit den richtigen Strategien löst Du sie effizient. Die folgende Schritt-für-Schritt-Anleitung fasst das Vorgehen zusammen.

### Fehler identifizieren

Achte auf ungewöhnliches Verhalten Deines Skripts: Fehlermeldungen, unerwartete Ausgaben oder Performanceprobleme. Lies Fehlermeldungen genau, denn sie enthalten oft wertvolle Hinweise auf die Ursache. Wer die Symptome genau beobachtet, findet die Fehlerquelle schneller.

### Das Problem verstehen

- **Fehler reproduzieren:** Den Fehler unter denselben Bedingungen erneut auslösen. So stellst Du sicher, dass er nicht zufällig auftritt, und kannst die Ursache eingrenzen.
- **Testfälle erstellen:** Kleine Tests schreiben, die den Fehler auslösen. Sie erleichtern die Analyse und später die Prüfung der Lösung.
- **Symptome dokumentieren:** Notieren, was genau passiert. Welche Fehlermeldungen erscheinen, welche Teile des Skripts sind betroffen?
- **Fehler isolieren:** Den Fehler auf einen bestimmten Teil des Codes eingrenzen. Das macht die Suche nach der Ursache effizienter.

### Den Code analysieren

- **Code-Review:** Eine andere Person prüft den Code. Ein frischer Blick entdeckt oft Fehler, die Du übersehen hast, und fördert den Wissensaustausch im Team.
- **Debugger:** Den Code Schritt für Schritt durchlaufen und die Variablen prüfen, bis die Stelle gefunden ist, an der der Fehler entsteht.
- **Breakpoints:** Den Ablauf an gezielten Stellen anhalten und den Zustand der Variablen inspizieren.
- **Log-Dateien:** Mit Log-Meldungen an strategischen Stellen nachvollziehen, was im Programm passiert, und die Ursache systematisch eingrenzen.

### Hypothesen entwickeln

Entwickle auf Basis Deiner Analyse Vermutungen, was den Fehler verursacht. Das ist ein iterativer Prozess: Du ziehst mehrere Möglichkeiten in Betracht und prüfst sie nacheinander. Hilfreiche Fragen:

- Ist der Fehler auf eine bestimmte Eingabe zurückzuführen?
- Tritt der Fehler nur unter bestimmten Bedingungen auf?
- Könnte eine kürzliche Änderung im Code den Fehler verursacht haben? Ein Blick in `git log` oder `git diff` zeigt, was sich geändert hat.

### Hypothesen testen

| Methode | Beschreibung |
| --- | --- |
| **Unit-Tests** | Prüfen einzelne Funktionen gezielt und zeigen schnell, ob eine Vermutung stimmt. |
| **Automatisierte Tests** | Prüfen das gesamte Skript, besonders wichtig bei größeren Änderungen. In einer CI/CD-Pipeline laufen sie bei jeder Änderung automatisch. |
| **Manuelle Tests** | Bestätigen am Ende, dass der Fehler unter realen Bedingungen tatsächlich behoben ist. Zeitaufwendig, aber oft nötig. |

### Die Lösung umsetzen

1. **Änderungen dokumentieren:** Festhalten, was Du geändert hast und warum, z. B. in einer aussagekräftigen Commit-Nachricht.
2. **Den gesamten Code prüfen:** Sicherstellen, dass die Änderung keine neuen Fehler verursacht, durch umfassende Tests und ein Code-Review.
3. **Aus dem Fehler lernen:** Analysieren, warum der Fehler entstanden ist und wie sich ähnliche Fehler künftig vermeiden lassen, z. B. durch einen zusätzlichen Test.

## Übung: Katharinas Debugging-Abenteuer

Katharina sitzt an ihrem Schreibtisch und starrt auf den Bildschirm. Ihr neues Skript soll die Datenverarbeitung automatisieren, funktioniert aber nicht wie geplant. Statt der erwarteten Ergebnisse gibt es ständig Fehlermeldungen aus, die sie nicht sofort versteht. Sie atmet tief durch und erinnert sich an die Schritte zur Fehlerbehebung, die sie kürzlich gelernt hat.

Zuerst versucht sie, die Symptome zu erkennen. Das Skript produziert unerwartete Ausgaben und läuft viel langsamer als erwartet. Sie liest die Fehlermeldungen genau und erkennt Hinweise auf ein Problem mit einer Datenstruktur.

Katharina reproduziert den Fehler unter denselben Bedingungen. Sie schafft konsistente Bedingungen und erstellt kleine Tests, die den Fehler auslösen. Dabei notiert sie, welche Fehlermeldungen erscheinen und welche Teile des Skripts betroffen sind. Sie isoliert den Fehler auf den Teil des Codes, in dem die Datenstruktur verändert wird.

Katharina setzt Breakpoints und prüft mit dem Debugger den Zustand der Variablen. Sie fügt Log-Meldungen ein, um den Zustand des Programms zu verschiedenen Zeitpunkten zu beobachten. Ein Code-Review lässt sie allerdings aus und bittet ihren Kollegen Alex nicht um Feedback.

Auf Basis ihrer Analyse entwickelt sie Hypothesen: Sie vermutet, dass der Fehler auf eine bestimmte Eingabe zurückgeht und möglicherweise durch eine kürzliche Änderung im Code entstanden ist.

Katharina schreibt Unit-Tests für einzelne Teile ihres Codes. Automatisierte Tests des gesamten Skripts führt sie aber nicht durch, und die Möglichkeit, Continuous Integration (CI) zu nutzen, ignoriert sie. Ob der Fehler behoben ist, prüft sie ausschließlich mit manuellen Tests.

Dann setzt sie die Lösung um. Sie dokumentiert ihre Änderungen, überprüft den gesamten Code danach aber nicht noch einmal gründlich. Zum Schluss notiert sie, was sie aus dem Fehler gelernt hat.

**Aufgabe:**

- Ist Katharina beim Debuggen richtig vorgegangen? Wenn nein, was hat sie vergessen?
- Welche Probleme können entstehen, wenn man beim Debuggen so vorgeht wie Katharina?
- Schlage eine verbesserte Vorgehensweise vor, die Katharina hätte befolgen sollen.

<details>
<summary>Lösungsvorschlag anzeigen</summary>

Katharina hat vieles richtig gemacht: Sie hat Symptome beobachtet, den Fehler reproduziert und isoliert, Debugger, Breakpoints und Logging genutzt, Hypothesen gebildet, Unit-Tests geschrieben, ihre Änderungen dokumentiert und aus dem Fehler gelernt. Drei wichtige Schritte hat sie jedoch ausgelassen:

| Versäumnis | Mögliches Problem | Besseres Vorgehen |
| --- | --- | --- |
| **Kein Code-Review** | Fehlerquellen, die ein anderer Blick entdeckt hätte, bleiben unbemerkt. | Alex um ein Review bitten, z. B. über einen Merge oder Pull Request. |
| **Keine automatisierten Tests und keine CI** | Unerwartete Fehler, auch an anderen Stellen des Skripts, fallen nicht rechtzeitig auf. Das gefährdet die Stabilität. | Automatisierte Tests für das gesamte Skript schreiben und bei jeder Änderung in einer CI-Pipeline ausführen lassen. |
| **Keine Gesamtprüfung nach der Korrektur** | Die Korrektur kann neue Fehler einführen, die später schwerer zu finden sind. | Nach der Umsetzung alle Tests laufen lassen und die Änderung im Review prüfen, bevor sie in Betrieb geht. |

Da das Skript zudem viel langsamer lief als erwartet und die Fehlermeldungen auf eine Datenstruktur hindeuteten, hätte sich auch ein Profiler gelohnt (siehe „Profiling und Performance-Analyse“). Er zeigt, ob eine ungünstige Datenstruktur die Laufzeit verursacht.

</details>

## Coding Challenge

**Aufgabe:** Implementiere in Python eine Funktion `compute_average(numbers)`, die den Durchschnitt einer Liste von Zahlen berechnet. Stelle mit einer Assertion sicher, dass die Liste nicht leer ist. Protokolliere mit dem Modul `logging` wichtige Schritte und Fehler, z. B. wenn die Liste leer ist. Schreibe abschließend zwei einfache Unit-Tests: einen, der den korrekten Mittelwert einer gültigen Liste prüft, und einen, der das Fehlverhalten bei einer leeren Liste prüft (`AssertionError`).

**Vorgehen:**

1. Logging mit `logging.basicConfig` konfigurieren und einen Logger anlegen.
2. In `compute_average` den Aufruf auf Stufe DEBUG protokollieren.
3. Ist die Liste leer, einen Fehler auf Stufe ERROR protokollieren. Danach folgt die Assertion, die das Programm abbricht.
4. Durchschnitt mit `sum(numbers) / len(numbers)` berechnen und das Ergebnis auf Stufe INFO protokollieren.
5. In einer zweiten Datei mit `unittest` die beiden Tests schreiben.

<details>
<summary>Musterlösung anzeigen</summary>

**Musterlösung (average.py):**

```python
"""Durchschnitt einer Zahlenliste mit Assertion und Logging (Coding Challenge)."""
import logging

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(levelname)-8s %(message)s")
log = logging.getLogger(__name__)


def compute_average(numbers):
    """Gibt den Durchschnitt der Zahlen in numbers zurück."""
    log.debug("compute_average aufgerufen mit %s", numbers)
    if not numbers:
        log.error("Leere Liste übergeben, Durchschnitt nicht berechenbar")
    assert len(numbers) > 0, "Die Liste darf nicht leer sein"
    ergebnis = sum(numbers) / len(numbers)
    log.info("Durchschnitt von %d Werten: %s", len(numbers), ergebnis)
    return ergebnis


if __name__ == "__main__":
    print(compute_average([2, 4, 9]))
```

**Unit-Tests (test\_average.py):**

```python
import unittest
from average import compute_average


class TestComputeAverage(unittest.TestCase):

    def test_gueltige_liste(self):
        self.assertAlmostEqual(compute_average([2, 4, 9]), 5.0)

    def test_leere_liste(self):
        with self.assertRaises(AssertionError):
            compute_average([])


if __name__ == "__main__":
    unittest.main()
```

**Ausführen der Tests:**

```text
$ python -m unittest -v test_average
test_gueltige_liste (test_average.TestComputeAverage.test_gueltige_liste) ...
2026-10-07 13:46:30,878 DEBUG    compute_average aufgerufen mit [2, 4, 9]
2026-10-07 13:46:30,878 INFO     Durchschnitt von 3 Werten: 5.0
ok
test_leere_liste (test_average.TestComputeAverage.test_leere_liste) ...
2026-10-07 13:46:30,878 DEBUG    compute_average aufgerufen mit []
2026-10-07 13:46:30,878 ERROR    Leere Liste übergeben, Durchschnitt nicht berechenbar
ok
----------------------------------------------------------------------
Ran 2 tests in 0.001s

OK
```

Die Log-Meldungen zeigen, welchen Weg jeder Test durch die Funktion genommen hat: Beim zweiten Test erscheint die Meldung auf Stufe ERROR, danach bricht die Assertion ab, und genau das erwartet der Test.

**Erläuterung der wichtigsten Zeilen:**

| Code | Erklärung |
| --- | --- |
| `logging.basicConfig(level=logging.DEBUG, format=...)` | Gibt alle Meldungen ab Stufe DEBUG mit Zeitstempel und Stufe aus |
| `log = logging.getLogger(__name__)` | Eigener Logger für dieses Modul, so ist im Log erkennbar, woher eine Meldung stammt |
| `if not numbers: log.error(...)` | Protokolliert den Fehlerfall, bevor die Assertion das Programm abbricht |
| `assert len(numbers) > 0, "..."` | Bricht bei leerer Liste mit `AssertionError` und verständlicher Meldung ab, statt mit einer Division durch null |
| `assertAlmostEqual(...)` | Vergleicht Kommazahlen mit einer kleinen Toleranz, weil Gleitkommaberechnungen minimal ungenau sein können |
| `with self.assertRaises(AssertionError):` | Der Test gilt als bestanden, wenn im Block genau dieser Fehler auftritt |

> **Hinweis:** Wie bei den Assertions beschrieben, entfernt `python -O` alle Assertions. Die Funktion bricht dann mit `ZeroDivisionError` ab, und der zweite Test schlägt fehl. In einem Skript, das Eingaben von außen verarbeitet, wäre deshalb `raise ValueError("Die Liste darf nicht leer sein")` die robustere Wahl. Die Aufgabe verlangt bewusst eine Assertion, um diese Technik zu üben.

</details>
