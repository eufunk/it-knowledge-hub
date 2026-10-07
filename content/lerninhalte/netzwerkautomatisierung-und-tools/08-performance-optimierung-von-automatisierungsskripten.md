---
title: "Performance-Optimierung von Automatisierungsskripten"
description: "Leistung messen und Engpässe finden, Redundanzen, Datenstrukturen und Algorithmen, CPU, Speicher und I/O schonen, Hardware-Upgrades und typische Fehler – mit Übung."
duration: "45 Minuten"
---

Kapitel 7 hat gezeigt, wie Du Fehler findest. Ein Skript kann aber fehlerfrei und trotzdem zu langsam sein oder zu viele Ressourcen verbrauchen. Dieses Kapitel erklärt, wie Du die Leistung eines Skripts misst, Engpässe findest und gezielt beseitigst: durch besseren Code, sparsamen Umgang mit Ressourcen und, wenn nötig, durch bessere Hardware. Eine Übung und typische Fehler bei der Optimierung schließen das Kapitel und Modul 4 ab.

## Steigerung der Skriptleistung: Einführung und Überblick

> **Definition:** Die **Performance** eines Skripts beschreibt, wie effizient und schnell es seine Aufgaben erledigt. Ein performantes Skript braucht für dieselbe Aufgabe weniger Zeit und weniger Ressourcen als ein schlecht optimiertes. Das zählt besonders, wenn Skripte häufig laufen oder große Datenmengen verarbeiten.

Die Leistung von Skripten wirkt sich direkt auf Effizienz und Produktivität eines Unternehmens aus. **Effizienz** heißt, Aufgaben mit möglichst wenig Aufwand und Ressourcen zu erledigen. **Produktivität** misst, wie viel Arbeit in einer bestimmten Zeit erledigt wird. Langsame Skripte verzögern Arbeitsabläufe und erhöhen die Kosten.

| Nr. | Grund | Bedeutung |
| --- | --- | --- |
| 01 | **Zeitersparnis** | Kürzere Laufzeiten machen sich besonders bei häufig wiederholten Aufgaben bemerkbar und sind in zeitkritischen Umgebungen entscheidend. |
| 02 | **Skalierbarkeit** | Performante Skripte kommen auch mit wachsenden Datenmengen zurecht. |
| 03 | **Ressourcenschonung** | Skripte auf Servern oder in der Cloud teilen sich Rechenleistung, Speicher und Netzwerkbandbreite mit anderen Prozessen. Ein ineffizientes Skript bremst diese aus, besonders wenn mehrere Skripte gleichzeitig laufen oder das System ohnehin stark ausgelastet ist. |
| 04 | **Kosteneffizienz** | Weniger Ressourcenverbrauch heißt: Die vorhandene Infrastruktur reicht länger, teure Hardware-Upgrades oder zusätzliche Cloud-Ressourcen werden seltener nötig. In der Cloud wird oft nach Rechenzeit abgerechnet. |
| 05 | **Zufriedenheit der Nutzenden** | Langsame Abläufe führen zu Wartezeiten und Frust, etwa wenn ein Skript hinter einem Self-Service-Portal oder einer Webanwendung läuft. |

## Grundlagen der Performance-Optimierung

### Analyse des aktuellen Zustands

Am Anfang jeder Optimierung steht die **Performance-Analyse**: die systematische Untersuchung, wie effizient ein Skript arbeitet. Ziel ist, **Engpässe** (englisch Bottlenecks) zu finden und zu beseitigen. Daten zu sammeln reicht dabei nicht, Du musst sie auch richtig deuten. Profiler stellen die Ergebnisse dafür oft grafisch dar:

| Darstellung | Beschreibung |
| --- | --- |
| **Heatmap** | Stellt Werte als Farben dar, z. B. die Laufzeit einzelner Codeabschnitte. Auffällige Farben zeigen auf einen Blick, wo die meiste Zeit verbraucht wird. Eine verbreitete Variante ist der **Flame Graph**: Jeder Balken ist eine Funktion, je breiter, desto mehr Zeit entfällt auf sie. |
| **Call-Graph** | Zeigt, welche Funktion welche andere aufruft. **Knoten** (Nodes) sind die Funktionen, **Kanten** (Edges) die Aufrufe: Ruft Funktion A die Funktion B auf, führt eine Kante von A nach B. So siehst Du, über welchen Weg eine teure Funktion erreicht wird. |

Steht der Engpass fest, folgen gezielte Maßnahmen: die betroffene Funktion verbessern, sie durch eine effizientere ersetzen oder unabhängige Aufgaben parallel ausführen.

**Wichtige Kennzahlen:**

| Kennzahl | Bedeutung | Messen z. B. mit |
| --- | --- | --- |
| **Ausführungszeit** | Zeit, die das Skript für einen vollständigen Lauf braucht. Die wichtigste Kennzahl für die Effizienz. | `time` (Bash), `Measure-Command` (PowerShell), `timeit` (Python) |
| **CPU-Auslastung** | Anteil der Prozessorleistung, den das Skript beansprucht. Dauerhaft hohe Werte können auf ineffizienten Code hinweisen, aber auch einfach auf eine rechenintensive Aufgabe. | `top`, `htop`, Task-Manager, `Get-Process` |
| **Speichernutzung** | Arbeitsspeicher, den das Skript belegt. Zu viel davon führt zu Auslagerung auf die Festplatte oder zu Abstürzen. | `top`, `ps`, `tracemalloc` (Python) |
| **I/O-Operationen** | Anzahl und Dauer der Lese- und Schreibzugriffe auf Datenträger und Netzwerk. Viele kleine Zugriffe bremsen stark. | `iostat`, `iotop`, Ressourcenmonitor |

### Methoden der Performance-Analyse

| Methode | Was sie leistet | Schritte |
| --- | --- | --- |
| **Benchmarking** | Vergleicht die Leistung mit einer Referenz, z. B. dem Stand vor einer Änderung. So siehst Du, ob eine Optimierung wirklich etwas gebracht hat. | 1. Referenzpunkt (Basislinie) festlegen 2. Skript mehrfach ausführen und Messwerte sammeln 3. Mit der Basislinie vergleichen |
| **Profiling** | Zeigt im Detail, welche Teile des Codes die meiste Zeit oder die meisten Ressourcen verbrauchen. | 1. Profiler einrichten 2. Skript ausführen und Daten erfassen 3. Bericht auswerten und Engpässe benennen |
| **Log-Analyse** | Logs mit Zeitstempeln zeigen, wie lange einzelne Schritte dauern und wann Fehler oder Warnungen auftreten. | 1. Aussagekräftige Logs erzeugen 2. Mit Werkzeugen wie Logstash oder dem ELK-Stack auswerten 3. Wiederkehrende Muster und Ausreißer erkennen |

| Werkzeug | Einsatz |
| --- | --- |
| `timeit` (Python) | Misst die Laufzeit kleiner Codeabschnitte, führt sie dafür viele Male aus und gleicht so Zufallsschwankungen aus |
| `cProfile` (Python) | Profiler der Standardbibliothek, zählt Aufrufe und misst die Zeit je Funktion (siehe Kapitel 7, „Profiling und Performance-Analyse“) |
| Py-Spy (Python) | Beobachtet ein laufendes Python-Programm von außen, ohne es zu verändern, und erzeugt Flame Graphs |
| `Measure-Command` (PowerShell) | Misst die Laufzeit eines Befehls oder Skriptblocks |
| `time` (Bash) | Misst die Laufzeit eines Befehls, aufgeteilt in Gesamtzeit sowie CPU-Zeit für Programm und Betriebssystem |
| Apache JMeter | Lasttests für Webanwendungen, APIs und Server: simuliert viele gleichzeitige Zugriffe. Sinnvoll, wenn ein Skript einen Webdienst bereitstellt oder abfragt |

**Beispiel: Suche in Liste und Menge mit timeit vergleichen**

```text
$ python -m timeit -s "ids = list(range(100_000))" "99_999 in ids"
500 loops, best of 5: 820 usec per loop
$ python -m timeit -s "ids = set(range(100_000))" "99_999 in ids"
10000000 loops, best of 5: 35.3 nsec per loop
```

`-s` legt die Vorbereitung fest, die nicht mitgemessen wird. Die Suche in der Menge dauert 35 Nanosekunden, in der Liste 820 Mikrosekunden, also über zwanzigtausendmal so lange.

### Vorgehen in sechs Schritten

1. **Ausgangsmessung:** Die Leistung des Skripts unter realistischen Bedingungen messen, wenn möglich mit unterschiedlichen Datenmengen. Das ist die Basislinie.
2. **Profiler einsetzen:** Mit einem Profiler wie cProfile oder Py-Spy die Hotspots ermitteln, also die Stellen mit dem größten Zeitanteil.
3. **Daten auswerten und Engpässe benennen:** Auf Funktionen mit besonders viel Laufzeit und auf Bereiche mit hoher CPU-Auslastung achten.
4. **Gezielt optimieren:** z. B. einen besseren Algorithmus wählen, Arbeit aus Schleifen herausziehen oder Aufgaben parallelisieren. Jede Änderung einzeln umsetzen, damit ihre Wirkung erkennbar bleibt.
5. **Erneut messen:** Nach jeder Änderung mit denselben Werkzeugen messen und mit der Basislinie vergleichen. Außerdem prüfen, ob das Skript noch dieselben Ergebnisse liefert.
6. **Dokumentieren und überwachen:** Maßnahmen und Ergebnisse festhalten und die Laufzeit dauerhaft überwachen, z. B. mit Monitoring-Werkzeugen, um Verschlechterungen früh zu bemerken.

## Code-Optimierung

Besserer Code ist oft der erste und wirksamste Hebel. Drei Ansatzpunkte stehen im Vordergrund.

### Redundanzen vermeiden

**Redundanz** bedeutet, dass dieselbe Operation mehrfach ausgeführt wird, obwohl einmal genügen würde. Typisch ist Arbeit innerhalb einer Schleife, deren Ergebnis sich bei jedem Durchlauf nicht ändert. Solche Berechnungen gehören vor die Schleife, das Ergebnis in eine Variable.

```python
# vorher: Konfiguration wird bei jedem der 20.000 Durchläufe neu gelesen
for groesse in groessen:
    with open("config.json") as f:
        grenzwert = json.load(f)["grenzwert_mb"]
    if groesse > grenzwert:
        zu_gross.append(groesse)

# nachher: einmal vor der Schleife lesen
with open("config.json") as f:
    grenzwert = json.load(f)["grenzwert_mb"]
zu_gross = [groesse for groesse in groessen if groesse > grenzwert]
```

Gemessen mit `timeit`: vorher 0,91 Sekunden, nachher 0,002 Sekunden bei identischem Ergebnis. Dasselbe Muster gibt es in jeder Sprache: In Bash ist es teuer, für jede Zeile einer Datei ein externes Programm zu starten.

```bash
# langsam: startet für jede Zeile zwei Prozesse (echo-Pipe und tr)
while read -r host; do
    echo "$host" | tr a-z A-Z
done < hosts.txt

# schnell: ein einziger Aufruf für die ganze Datei
tr a-z A-Z < hosts.txt
```

Bei nur 200 Zeilen brauchte die Schleife in Git Bash unter Windows 39 Sekunden, der einzelne Aufruf 0,1 Sekunden. Unter Linux starten Prozesse viel schneller, der Abstand bleibt aber groß.

**Ein bekanntes Beispiel in PowerShell:**

```powershell
# langsam: += legt bei jedem Durchlauf ein neues, größeres Array an
$ergebnis = @()
foreach ($i in 1..20000) { $ergebnis += "Server$i" }

# schnell: die Ausgabe der Schleife direkt zuweisen
$ergebnis = foreach ($i in 1..20000) { "Server$i" }
```

In Windows PowerShell 5.1 gemessen: 13 Sekunden mit `+=`, 0,06 Sekunden mit direkter Zuweisung. Ab PowerShell 7.5 ist `+=` deutlich schneller geworden, die direkte Zuweisung bleibt aber die bessere Wahl.

### Effiziente Datenstrukturen

Eine **Datenstruktur** legt fest, wie Daten organisiert und gespeichert werden, und bestimmt damit, wie schnell Du auf sie zugreifen und sie ändern kannst.

| Datenstruktur (Python) | Geeignet für | Hinweis |
| --- | --- | --- |
| Liste (`list`) | Geordnete Werte, Zugriff über die Position | Die Suche nach einem Wert (`in`) prüft die Elemente nacheinander |
| Menge (`set`) | Eindeutige Werte, schnelle Prüfung „ist enthalten?“ | Findet einen Wert direkt, unabhängig von der Größe |
| Wörterbuch (`dict`) | Zuordnung Schlüssel → Wert, z. B. Hostname → IP-Adresse | Findet einen Schlüssel direkt, wie die Menge |
| NumPy-Array | Große Mengen von Zahlen, numerische Berechnungen | Zusatzpaket, rechnet sehr viel schneller als Listen |

In PowerShell entspricht der Menge ein HashSet, dem Wörterbuch eine Hashtable (`@{}`), in Bash ein assoziatives Array (`declare -A`).

### Algorithmen optimieren

Ein **Algorithmus** ist eine Schritt-für-Schritt-Anleitung zur Lösung eines Problems. Für dieselbe Aufgabe gibt es oft mehrere Algorithmen mit sehr unterschiedlichem Aufwand. Die **Big-O-Notation** beschreibt, wie Laufzeit oder Speicherbedarf eines Algorithmus mit der Größe der Eingabe n wachsen:

| Klasse | Bedeutung | Beispiel | Doppelte Datenmenge bedeutet |
| --- | --- | --- | --- |
| O(1) | konstant | Suche in `set` oder `dict` | gleiche Laufzeit |
| O(log n) | logarithmisch | Binäre Suche in sortierten Daten | einen Schritt mehr |
| O(n) | linear | Suche in einer Liste | doppelte Laufzeit |
| O(n log n) | quasilinear | Gute Sortierverfahren wie QuickSort im Mittel, Pythons `sorted()` | etwas mehr als doppelte Laufzeit |
| O(n²) | quadratisch | BubbleSort, zwei verschachtelte Schleifen über dieselben Daten | vierfache Laufzeit |

**QuickSort** sortiert im Mittel in O(n log n) und ist daher bei großen Datenmengen schnell, im ungünstigsten Fall allerdings O(n²). **BubbleSort** vergleicht immer wieder benachbarte Elemente und braucht O(n²). Es ist einfach zu verstehen und wird deshalb im Unterricht verwendet, in der Praxis aber kaum.

**Messung mit zufälligen Zahlen:**

```text
n= 1000  BubbleSort   0.051 s   sorted() 0.00157 s
n= 2000  BubbleSort   0.216 s   sorted() 0.00029 s
n= 4000  BubbleSort   0.890 s   sorted() 0.00045 s
```

Jede Verdopplung der Datenmenge vervierfacht die Laufzeit von BubbleSort, genau wie O(n²) es vorhersagt. Die eingebaute Funktion `sorted()` ist um ein Vielfaches schneller.

> **Tipp:** Schreibe Sortier- und Suchverfahren nicht selbst. Die eingebauten Funktionen wie `sorted()` in Python, `Sort-Object` in PowerShell oder `sort` in Bash sind ausgereift und schnell. Optimieren lohnt sich bei der Frage, welche Datenstruktur und welchen Ansatz Du wählst.

## Ressourcenmanagement

Neben dem Code selbst zählt, wie ein Skript mit den Ressourcen des Systems umgeht.

| Ressource | Rolle | Typisches Problem |
| --- | --- | --- |
| **CPU** (Central Processing Unit) | Führt die Rechenoperationen aus | Dauerhaft hohe Auslastung bremst das Skript und andere Prozesse |
| **Arbeitsspeicher** (RAM) | Hält die Daten, die gerade verarbeitet werden | Zu hoher Verbrauch führt zu Auslagerung auf die Festplatte oder zu Abstürzen |
| **I/O** (Input/Output) | Datenaustausch mit Festplatten und Netzwerk | Langsame oder sehr viele Zugriffe lassen das Skript warten |

### Systemressourcen allgemein schonen

1. **Unnötige Berechnungen vermeiden:** Zwischenergebnisse in Variablen speichern statt sie mehrfach zu berechnen (siehe „Redundanzen vermeiden“).
2. **Schleifen optimieren:** Alles, was sich bei jedem Durchlauf nicht ändert, vor die Schleife ziehen, und in der Schleife keine teuren Aufrufe wie Dateizugriffe, externe Programme oder Netzwerkabfragen wiederholen. Wo möglich eine ganze Datenmenge auf einmal verarbeiten statt Element für Element.
3. **Ressourcen freigeben:** Dateien, Datenbank- und Netzwerkverbindungen nach Gebrauch schließen. In Python sorgt `with open(...) as f:` dafür automatisch, auch bei einem Fehler. In PowerShell gibt `.Dispose()` solche Objekte frei, am besten in einem `finally`-Block.

> **Hinweis:** `del variable` in Python entfernt nur den Namen. Den Speicher gibt Python erst frei, wenn kein anderer Verweis mehr auf das Objekt besteht. Den Garbage Collector mit `gc.collect()` von Hand aufzurufen, ist nur in Sonderfällen nötig, etwa bei Objekten, die sich gegenseitig referenzieren.

### CPU effizient nutzen: Parallelisierung

Bei der **Parallelisierung** wird eine Aufgabe in unabhängige Teilaufgaben zerlegt, die gleichzeitig laufen. Welche Technik passt, hängt davon ab, ob das Skript vor allem rechnet oder vor allem wartet:

| Technik | Geeignet für | Beispiele |
| --- | --- | --- |
| **Multithreading** | Wartende Aufgaben (I/O-gebunden): Netzwerkabfragen, Downloads, Dateizugriffe | Python `ThreadPoolExecutor`, PowerShell 7 `ForEach-Object -Parallel` |
| **Asynchrone Programmierung** | Viele gleichzeitige Wartevorgänge, z. B. Hunderte API-Anfragen, ohne eigene Threads | Python `asyncio` |
| **Mehrere Prozesse** | Rechenintensive Aufgaben (CPU-gebunden), die mehrere Prozessorkerne nutzen sollen | Python `ProcessPoolExecutor`, Bash `xargs -P 4`, PowerShell `Start-Job` |

> **Hinweis:** In der Standardversion von Python kann immer nur ein Thread gleichzeitig Python-Code ausführen (Global Interpreter Lock, GIL). Threads beschleunigen deshalb Aufgaben, die warten, aber keine reinen Rechenaufgaben. Für diese brauchst Du mehrere Prozesse. Bei allen Techniken gilt: Die Teilaufgaben müssen wirklich unabhängig sein. Greifen mehrere Threads gleichzeitig auf dieselben Daten zu, drohen **Race Conditions**, also Ergebnisse, die von der zufälligen Reihenfolge abhängen.

**Beispiel: zehn Server prüfen, jede Abfrage wartet eine Sekunde**

```python
import time
from concurrent.futures import ThreadPoolExecutor

def pruefe(host):
    time.sleep(1)    # simuliert eine Netzwerkabfrage
    return f"{host}: ok"

hosts = [f"srv{i:02}" for i in range(1, 11)]

start = time.perf_counter()
ergebnisse = [pruefe(h) for h in hosts]
print(f"nacheinander: {time.perf_counter() - start:.1f} s")

start = time.perf_counter()
with ThreadPoolExecutor(max_workers=10) as pool:
    ergebnisse = list(pool.map(pruefe, hosts))
print(f"parallel:     {time.perf_counter() - start:.1f} s")
```

Ausgabe:

```text
nacheinander: 10.0 s
parallel:     1.0 s
```

### Speicher optimieren

1. **Daten schrittweise verarbeiten:** Große Dateien Zeile für Zeile lesen statt komplett in den Speicher zu laden. In PowerShell verarbeitet die Pipeline Objekte ebenfalls einzeln, z. B. `Get-Content datei.log | Where-Object { ... }`.
2. **Nicht mehr benötigte Daten freigeben:** Große Zwischenergebnisse nicht länger als nötig aufbewahren.
3. **Passende Datenstrukturen wählen:** z. B. NumPy-Arrays für große Zahlenmengen, Wörterbücher für schnelle Suche (siehe „Effiziente Datenstrukturen“).

```python
# Zeile für Zeile: belegt nur den Speicher für eine Zeile
with open("gross.log") as f:
    fehler = sum(1 for zeile in f if "ERROR" in zeile)

# alles auf einmal: lädt die gesamte Datei in den Speicher
with open("gross.log") as f:
    zeilen = f.readlines()
```

Bei einer Log-Datei mit 500.000 Zeilen maß `tracemalloc` zeilenweise 0,2 MB Spitzenverbrauch, beim Einlesen der ganzen Datei 44,7 MB. Bei Dateien mit mehreren Gigabyte entscheidet das darüber, ob das Skript überhaupt läuft.

### I/O-Operationen optimieren

- **Batch-Verarbeitung:** Viele kleine Zugriffe zu wenigen großen zusammenfassen, z. B. Datensätze gesammelt in die Datenbank schreiben statt einzeln oder eine Datei einmal öffnen statt für jede Zeile neu.
- **Caching:** Häufig benötigte Daten im Speicher halten, statt sie wiederholt von der Festplatte oder über das Netzwerk zu holen. Eine verbreitete Strategie ist **LRU** (Least Recently Used): Ist der Cache voll, fliegt der am längsten nicht genutzte Eintrag heraus.

```python
import time
from functools import lru_cache

@lru_cache(maxsize=256)
def standort_von(hostname):
    time.sleep(0.5)  # simuliert eine langsame API-Abfrage
    return "Berlin" if hostname.startswith("ber") else "Hamburg"

start = time.perf_counter()
for host in ["ber-srv01", "ham-srv02", "ber-srv01", "ber-srv01", "ham-srv02"]:
    standort_von(host)
print(f"{time.perf_counter() - start:.1f} s, Cache: {standort_von.cache_info()}")
```

Ausgabe:

```text
1.0 s, Cache: CacheInfo(hits=3, misses=2, maxsize=256, currsize=2)
```

Der Dekorator `@lru_cache` merkt sich die Ergebnisse. Von fünf Aufrufen lösen nur zwei die langsame Abfrage aus, die übrigen drei kommen aus dem Cache. Statt 2,5 Sekunden dauert der Durchlauf 1 Sekunde.

> **Wichtig:** Ein Cache passt nur für Daten, die sich während der Laufzeit nicht ändern, sonst liefert er veraltete Werte.

## Hardware-Upgrades

Manchmal reichen Software-Optimierungen nicht aus. Dann kann bessere Hardware die Lösung sein:

| Komponente | Beschreibung | Wann es hilft |
| --- | --- | --- |
| **Prozessor (CPU)** | Die zentrale Recheneinheit, die die meisten Berechnungen ausführt | Bei rechenintensiven Skripten; mehr Kerne nur, wenn das Skript parallel arbeitet |
| **Arbeitsspeicher (RAM)** | Flüchtiger Speicher für Daten und Programme, die gerade in Benutzung sind | Wenn das System Daten auf die Festplatte auslagern muss oder Out-of-Memory-Fehler auftreten |
| **SSD statt HDD** | Eine Solid-State-Drive (SSD) speichert Daten in Flash-Speicher ohne bewegliche Teile und ist dadurch viel schneller als eine herkömmliche Festplatte (HDD) | Bei vielen Datei- und Datenbankzugriffen |

> **Tipp:** Erst messen, dann kaufen. Welche Ressource der Engpass ist, zeigen die Kennzahlen aus „Analyse des aktuellen Zustands“. Mehr RAM hilft nicht bei einem CPU-Engpass und eine schnellere CPU nicht bei langsamer Festplatte. In der Cloud lässt sich eine größere Instanz oft vorübergehend testen, bevor Du Dich festlegst.

## Übung: Was muss optimiert werden?

In dieser Übung gehst Du verschiedene Szenarien durch, in denen ein Skript nicht optimal funktioniert. Benenne jeweils die zugrunde liegenden Probleme und entscheide, welche Optimierungen die Performance verbessern.

| Nr. | Szenario | Symptome | Frage |
| --- | --- | --- | --- |
| 1 | **Langsame Ausführung:** Ein täglich laufendes Skript zur Datenverarbeitung ist viel langsamer als erwartet. Die Laufzeit hat sich in den letzten Wochen verdoppelt. | Lange Wartezeiten, erhöhte CPU-Auslastung | Welche Maßnahmen verkürzen die Ausführungszeit? |
| 2 | **Hohe CPU-Auslastung:** Ein Skript verursacht dauerhaft hohe CPU-Last, andere Prozesse auf dem Server werden langsamer. | Hohe CPU-Auslastung, träge Reaktion anderer Anwendungen | Welche Techniken senken die CPU-Auslastung? |
| 3 | **Hohe Speichernutzung:** Ein Skript verbraucht ungewöhnlich viel Arbeitsspeicher, es kommt häufig zu Out-of-Memory-Fehlern. | Hohe Speichernutzung, häufige Abstürze | Welche Schritte optimieren die Speichernutzung? |
| 4 | **Ineffiziente I/O-Operationen:** Ein Skript führt sehr viele Lese- und Schreibzugriffe aus. | Langsame Dateizugriffe, hohe I/O-Wartezeiten | Wie werden die I/O-Operationen effizienter? |
| 5 | **Unklare Fehlerursache:** Ein Skript gibt unregelmäßig schwer nachvollziehbare Fehlermeldungen aus. | Unregelmäßige Fehler, Ursache schwer zu finden | Mit welchen Methoden findest und behebst Du die Fehlerquelle? |

<details>
<summary>Lösungsvorschlag anzeigen</summary>

| Nr. | Mögliche Ursachen | Maßnahmen |
| --- | --- | --- |
| 1 | Die Datenmenge ist gewachsen, und ein Algorithmus mit O(n²) oder eine Suche in einer langen Liste skaliert schlecht. Oder eine kürzliche Änderung hat das Skript verlangsamt. | Basislinie messen, mit einem Profiler die Hotspots finden, Datenstrukturen und Algorithmen verbessern (z. B. `set` statt Liste), Redundanzen aus Schleifen entfernen. Per `git log` prüfen, was sich zuletzt geändert hat. Nach jeder Änderung erneut messen. |
| 2 | Unnötige Berechnungen in Schleifen, ineffiziente Algorithmen, Warteschleifen, die ständig abfragen statt zu warten | Profiler einsetzen, Berechnungen reduzieren, Algorithmus verbessern. Statt ständig zu prüfen, in Abständen warten (`sleep`). Laufzeit in ruhige Zeiten verlegen, die Priorität senken (`nice` unter Linux) oder die Zahl paralleler Prozesse begrenzen. |
| 3 | Ganze Dateien oder Abfrageergebnisse werden auf einmal geladen, große Zwischenergebnisse bleiben im Speicher, ein Cache wächst unbegrenzt | Daten zeilen- oder blockweise verarbeiten, mit `tracemalloc` oder Heap-Analyse die Speicherfresser finden, nicht mehr benötigte Daten freigeben, Cache-Größe begrenzen (z. B. `maxsize` bei `lru_cache`). Erst danach über mehr RAM nachdenken. |
| 4 | Viele kleine Einzelzugriffe, Datei wird für jede Zeile neu geöffnet, dieselben Daten werden wiederholt gelesen | Zugriffe bündeln (Batch-Verarbeitung), Dateien einmal öffnen, häufig gelesene Daten cachen, Wartezeiten bei Netzwerkzugriffen parallelisieren. Bei Bedarf schnellere Datenträger (SSD). |
| 5 | Ursache hängt von Eingaben, Zeitpunkt oder Umgebung ab, z. B. Race Conditions bei paralleler Ausführung oder zeitweise nicht erreichbare Server | Ausführliches Logging mit Zeitstempeln und Kontext, Fehler reproduzieren und isolieren, Debugger und bedingte Haltepunkte einsetzen, Hypothesen mit Tests prüfen (siehe Kapitel 7, „Fehlerbehebung in Skripten“). |

</details>

## Häufige Fehler bei der Performance-Optimierung

Performance-Optimierung erfordert sorgfältige Planung. Die folgenden Fehler sind besonders häufig und lassen sich mit etwas Disziplin vermeiden.

| Fehler | Folge | So vermeidest Du ihn |
| --- | --- | --- |
| **Unzureichende Analyse der Ausgangssituation** | Es wird an Stellen optimiert, die kaum Laufzeit kosten, der eigentliche Engpass bleibt. | Erst mit Benchmarking und Profiler messen, dann gezielt ändern. |
| **Best Practices ignorieren** | Ineffizienter, schwer wartbarer Code, der sich später kaum noch verbessern lässt. | Code regelmäßig überarbeiten (Refactoring), in Funktionen und Module gliedern, Ressourcen sauber freigeben. |
| **Überoptimierung** | Unlesbarer, schwer wartbarer Code für einen kaum messbaren Gewinn. | Kosten-Nutzen-Analyse: Lohnt der Aufwand den Gewinn? Lesbarkeit und Wartbarkeit erhalten. |
| **Hardware vernachlässigen** | Vorhandene Ressourcen bleiben ungenutzt, z. B. arbeitet ein Skript nur auf einem von acht Prozessorkernen. | Das Skript an die Hardware anpassen, z. B. unabhängige Aufgaben parallelisieren. |
| **Fehlende Tests und Validierung** | Die Optimierung verändert unbemerkt die Ergebnisse oder verursacht neue Fehler in der Produktion. | Nach jeder Optimierung testen, ob die Ergebnisse gleich bleiben, und erst dann ausrollen. |
| **Kein Monitoring nach der Umsetzung** | Neue Engpässe durch wachsende Datenmengen fallen erst auf, wenn sie Schaden anrichten. | Laufzeiten und Ressourcenverbrauch dauerhaft überwachen und Grenzwerte mit Alarmierung festlegen. |

_„Premature optimization is the root of all evil.“_ – Donald Knuth, Informatiker, sinngemäß: Verfrühte Optimierung ist die Wurzel allen Übels

Optimiere also nicht auf Verdacht, sondern dort, wo Messungen einen Engpass zeigen. Performance-Optimierung ist dabei kein einmaliger Vorgang, sondern ein kontinuierlicher Prozess aus Messen, Verbessern und Überwachen.

## Fazit zu Modul 4

Debugging und Performance-Optimierung sind Grundlagen effizienter Skriptentwicklung. Debugging verbessert die Codequalität, indem es Fehler findet und behebt. Performance-Optimierung spart Zeit und schont Ressourcen. Werkzeuge wie integrierte Debugger, Profiler und kontinuierliche Überwachung sind dafür entscheidend.

> **Kurz gesagt:**
>
> - Debugging verbessert die Codequalität durch Fehlererkennung und -behebung.
> - Performance-Optimierung spart Zeit und schont Ressourcen, aber erst messen, dann optimieren.
> - Debugger, Profiler und Monitoring sind die wichtigsten Werkzeuge.
