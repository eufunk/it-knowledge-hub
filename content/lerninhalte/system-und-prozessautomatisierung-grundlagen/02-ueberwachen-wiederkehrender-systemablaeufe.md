---
title: "Überwachen wiederkehrender Systemabläufe"
description: "Systeme überwachen, wiederkehrende Abläufe erkennen und Reaktionen automatisieren."
duration: "15 Minuten"
---

Automatisierung setzt voraus, dass man weiß, **was** in den Systemen passiert und **welche Abläufe sich wiederholen**. Dieses Kapitel zeigt, wie man Systeme überwacht, wiederkehrende Abläufe erkennt und auswertet, Probleme vorhersagt, automatisch reagiert und das Wissen darüber festhält.

## Systemüberwachung – Die ersten Schritte zur Systemüberwachung

**Systemüberwachung (Monitoring)** ist die laufende, automatische Beobachtung von IT-Systemen, um ihren Zustand, ihre Leistung und ihre Verfügbarkeit zu erfassen. Ziel ist, Probleme zu erkennen, **bevor** Benutzer sie bemerken, und Daten für Entscheidungen und Automatisierung zu gewinnen.

Der Einstieg gelingt in folgenden Schritten:

1. **Bestandsaufnahme:** Welche Systeme, Dienste und Anwendungen gibt es? Welche davon sind geschäftskritisch?
2. **Ziele festlegen:** Was soll erreicht werden? Z. B. Ausfälle früh erkennen, Engpässe vermeiden, Verfügbarkeit nachweisen.
3. **Kennzahlen (Metriken) auswählen:** Nur messen, was für die Ziele relevant ist. Mit wenigen, aussagekräftigen Werten beginnen.
4. **Normalzustand (Baseline) ermitteln:** Einige Tage oder Wochen messen, um zu wissen, was „normal“ ist.
5. **Schwellenwerte definieren:** Ab welchem Wert wird gewarnt, ab welchem ist es kritisch?
6. **Werkzeug wählen und einrichten:** Vom einfachen PowerShell-Skript bis zur Monitoring-Plattform (siehe 1.8).
7. **Alarmierung und Zuständigkeiten festlegen:** Wer wird wie benachrichtigt (Mail, Teams, SMS, Ticket)?
8. **Klein anfangen und ausbauen:** Mit den wichtigsten Systemen starten, Erfahrungen sammeln, schrittweise erweitern.

Typische Kennzahlen mit Beispiel-Schwellenwerten (die richtigen Werte hängen immer von der Baseline ab):

| Kennzahl | Bedeutung | Warnung | Kritisch |
| --- | --- | --- | --- |
| CPU-Auslastung | Belastung des Prozessors (Durchschnitt über einige Minuten) | > 80 % | > 95 % |
| Arbeitsspeicher | Belegter RAM | > 85 % | > 95 % |
| Freier Speicherplatz | Freier Platz je Laufwerk | &lt; 20 % | &lt; 10 % |
| Dienststatus | Läuft ein wichtiger Dienst? | – | gestoppt |
| Erreichbarkeit | Antwortet das System im Netzwerk (Ping, Port)? | langsam | keine Antwort |
| Fehler im Ereignisprotokoll | Anzahl Fehlerereignisse pro Stunde | über Baseline | stark erhöht |
| Backup-Status | Letzte erfolgreiche Sicherung | > 24 h | > 48 h |

Ein erster, einfacher **Gesundheitscheck** mit PowerShell:

```powershell
$os   = Get-CimInstance Win32_OperatingSystem
$cpu  = (Get-CimInstance Win32_Processor |
         Measure-Object LoadPercentage -Average).Average
$frei = $os.FreePhysicalMemory / $os.TotalVisibleMemorySize
$ram  = [math]::Round((1 - $frei) * 100, 1)
$disk = Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' |
        Select-Object DeviceID,
            @{n='FreiProzent'; e={[math]::Round($_.FreeSpace / $_.Size * 100, 1)}}

"CPU: $cpu %   RAM belegt: $ram %"
$disk | Format-Table -AutoSize
Get-Service -Name Spooler, W32Time | Select-Object Name, Status
```

## Identifizierung – Methoden zur Identifizierung wiederkehrender Abläufe

Bevor man automatisiert, muss man herausfinden, **welche Abläufe sich regelmäßig wiederholen** und wie viel Zeit sie kosten. Dafür gibt es mehrere Methoden, die sich gut kombinieren lassen:

| Methode | Vorgehen | Stärken / Grenzen |
| --- | --- | --- |
| Tätigkeitsprotokoll | Mitarbeitende notieren 1–2 Wochen lang, welche Aufgaben sie wie oft und wie lange erledigen. | Sehr konkret. Aufwändig, subjektiv |
| Interviews & Workshops | Gespräche mit Admins und Fachabteilungen: „Was nervt? Was machst du jede Woche gleich?“ | Erfasst Erfahrungswissen. Nicht messbar |
| Beobachtung | Arbeitsabläufe direkt begleiten und Schritte mitschreiben. | Zeigt echte Abläufe. Zeitintensiv |
| Ticketanalyse | Tickets im Helpdesk nach Kategorie, Häufigkeit und Bearbeitungszeit auswerten. | Objektiv, datenbasiert. Nur gemeldete Fälle |
| Log- und Ereignisanalyse | Ereignisprotokolle und Logdateien auf wiederkehrende Muster untersuchen. | Automatisierbar. Erfordert Auswertungs-Know-how |
| Process Mining | Spezialsoftware rekonstruiert Prozesse automatisch aus Systemdaten (Zeitstempel, Aktivitäten). | Zeigt Ist-Prozess und Varianten. Kosten, Datenqualität |
| Bestandsaufnahme vorhandener Automatisierung | Geplante Aufgaben, Skripte und Checklisten sichten: Was ist schon (halb) automatisiert? | Schnell. Zeigt Lücken und Doppelungen |

> **Hinweis:** Ein guter Hinweis auf wiederkehrende Abläufe sind Sätze wie **„Das mache ich jeden Montag“**, **„Dafür habe ich eine Checkliste“** oder **„Das kommt ständig rein“**.

## Datenanalyse bei der Identifizierung wiederkehrender Abläufe

Daten liefern objektive Antworten auf die Fragen **Was passiert? Wie oft? Wann? Mit welchem Aufwand?** Typische Datenquellen sind Windows-Ereignisprotokolle, Logdateien von Anwendungen, Ticketsysteme, Leistungsdaten aus dem Monitoring und Exporte aus Verwaltungssystemen.

Vorgehen bei der Analyse:

1. **Daten sammeln:** Relevante Quellen für einen aussagekräftigen Zeitraum exportieren (z. B. 30 Tage).
2. **Bereinigen:** Doppelte, unvollständige oder irrelevante Einträge entfernen und Formate vereinheitlichen.
3. **Gruppieren und zählen:** Gleichartige Ereignisse zusammenfassen. Was kommt am häufigsten vor?
4. **Zeitliche Muster erkennen:** Häufungen nach Uhrzeit, Wochentag oder Monatsende?
5. **Zusammenhänge prüfen (Korrelation):** Treten bestimmte Ereignisse gemeinsam oder nacheinander auf?
6. **Bewerten und priorisieren:** Häufigkeit × Aufwand ergibt das Einsparpotenzial. Nach dem **Pareto-Prinzip** verursachen oft ca. 20 % der Ursachen ca. 80 % des Aufwands.
7. **Visualisieren:** Diagramme oder Dashboards machen Muster für alle sichtbar.

**Beispiel 1:** die zehn häufigsten Fehler im Systemprotokoll der letzten 7 Tage:

```powershell
Get-WinEvent -FilterHashtable @{
    LogName = 'System'; Level = 2; StartTime = (Get-Date).AddDays(-7)
} -ErrorAction SilentlyContinue |
    Group-Object ProviderName, Id |
    Sort-Object Count -Descending |
    Select-Object -First 10 Count, Name
```

**Beispiel 2:** zu welcher Uhrzeit treten die Fehler auf?

```powershell
Get-WinEvent -FilterHashtable @{ LogName = 'System'; Level = 2 } -MaxEvents 1000 |
    Group-Object { $_.TimeCreated.Hour } |
    Sort-Object { [int]$_.Name } |
    Select-Object @{n='Stunde'; e={$_.Name}}, Count
```

**Beispiel 3:** Ticket-Export (CSV) nach Kategorie auswerten, mit Anzahl und Gesamtaufwand:

```powershell
Import-Csv .\tickets.csv -Delimiter ';' |
    Group-Object Kategorie |
    Select-Object Name, Count,
        @{n='AufwandMin'; e={($_.Group | Measure-Object Minuten -Sum).Sum}} |
    Sort-Object AufwandMin -Descending
```

Steht dort z. B. „Passwort zurücksetzen: 120 Tickets, 1.200 Minuten pro Monat“, ist das ein klarer Kandidat für einen Self-Service oder ein Skript.

## Tipps für eine erfolgreiche Systemüberwachung

- **Ziele vor Werkzeugen:** Zuerst klären, was wichtig ist, dann das Werkzeug auswählen.
- **Alarmmüdigkeit vermeiden:** Zu viele (Fehl-)Alarme führen dazu, dass echte Alarme ignoriert werden. Nur alarmieren, wenn jemand handeln muss. Alles andere gehört ins Dashboard oder in den Bericht.
- **Schwellenwerte auf Basis der Baseline:** Keine pauschalen Werte übernehmen, sondern das Normalverhalten des eigenen Systems berücksichtigen.
- **Prioritäten und Eskalationsstufen:** Info, Warnung und Kritisch unterscheiden, mit klaren Reaktionszeiten und Zuständigkeiten.
- **Zentral sammeln:** Daten aller Systeme an einer Stelle zusammenführen statt auf jedem Server einzeln nachzusehen.
- **Übersichtliche Dashboards:** Der Gesamtzustand muss auf einen Blick erkennbar sein (Ampelprinzip).
- **Den Wächter überwachen:** Auch das Monitoring selbst kann ausfallen. Ein regelmäßiges „Lebenszeichen“ (Heartbeat) prüft, ob es noch läuft.
- **Einheitliche Zeit:** Alle Systeme per NTP synchronisieren, sonst lassen sich Ereignisse nicht korrekt zuordnen.
- **Regelmäßig überprüfen:** Sind Schwellenwerte noch sinnvoll? Werden neue Systeme überwacht? Gibt es Alarme, die nie jemand liest?
- **Datenschutz und Aufbewahrung:** Logs können personenbezogene Daten enthalten. Zugriffe beschränken und Aufbewahrungsfristen festlegen.

## Etablierung einer Prozesskultur

Technik allein reicht nicht. Überwachung und Automatisierung funktionieren nur dauerhaft, wenn im Team eine **Prozesskultur** herrscht: ein gemeinsames Verständnis, dass Abläufe **definiert, dokumentiert, gemessen und laufend verbessert** werden.

Wichtige Bausteine einer Prozesskultur:

- **Klare Verantwortlichkeiten:** Jeder Prozess hat eine verantwortliche Person (Process Owner), die ihn pflegt und weiterentwickelt.
- **Standardisierung:** Gleiche Aufgaben werden auf die gleiche Weise erledigt, mit Vorlagen, Checklisten und Namenskonventionen.
- **Transparenz:** Kennzahlen und Ergebnisse sind für alle sichtbar.
- **Konstruktive Fehlerkultur:** Nach Störungen wird nach Ursachen gesucht, nicht nach Schuldigen (schuldfreie Nachbesprechung, „Blameless Post-Mortem“).
- **Mitarbeitende einbinden:** Wer die Arbeit täglich macht, kennt die Verbesserungspotenziale am besten.
- **Führung als Vorbild:** Die Leitung fordert und fördert Dokumentation, Zeit für Verbesserungen und das Einhalten von Prozessen.
- **Bewährte Rahmenwerke nutzen:** **ITIL** beschreibt z. B. Incident-, Problem- und Change-Management als Standardprozesse im IT-Betrieb.

Der Kern ist **kontinuierliche Verbesserung**, oft nach dem **PDCA-Zyklus**:

| Phase | Bedeutung | Beispiel Überwachung |
| --- | --- | --- |
| Plan (Planen) | Ziel und Maßnahme festlegen | Fehlalarme sollen um 50 % sinken |
| Do (Umsetzen) | Maßnahme im kleinen Rahmen umsetzen | Schwellenwerte für 5 Server anpassen |
| Check (Prüfen) | Ergebnis messen und bewerten | Anzahl Alarme nach 2 Wochen vergleichen |
| Act (Handeln) | Bewährtes standardisieren, sonst nachsteuern | Neue Werte auf alle Server übertragen |

## Etablierung eines umfassenden Überwachungssystems

Ein **umfassendes** Überwachungssystem betrachtet nicht nur einzelne Server, sondern die gesamte IT-Landschaft auf mehreren Ebenen:

| Ebene | Was wird überwacht? |
| --- | --- |
| Hardware & Infrastruktur | Server, Speicher, Stromversorgung, Temperatur, Festplattenzustand |
| Netzwerk | Erreichbarkeit, Bandbreite, Latenz, Paketverluste, Firewall |
| Betriebssystem | CPU, RAM, Speicherplatz, Dienste, Updates, Ereignisprotokolle |
| Anwendungen & Datenbanken | Antwortzeiten, Fehlerraten, Warteschlangen, Datenbankverbindungen |
| Sicherheit | Fehlgeschlagene Anmeldungen, Rechteänderungen, Virenschutz, verdächtige Aktivitäten |
| Benutzererfahrung | Ladezeiten und Verfügbarkeit aus Sicht der Anwender (synthetische Tests) |
| Geschäftsprozesse | Laufen fachliche Abläufe durch? z. B. Anzahl verarbeiteter Aufträge pro Stunde |

**Komponenten** eines solchen Systems:

- **Datenerfassung:** über Agenten auf den Systemen oder agentenlos über Schnittstellen wie WMI/CIM, SNMP oder APIs.
- **Zentrale Speicherung:** Zeitreihendatenbank für Messwerte, zentrales Log-Management, für Sicherheitsereignisse ein **SIEM** (Security Information and Event Management).
- **Auswertung und Regeln:** Schwellenwerte, Korrelationen, Anomalieerkennung.
- **Visualisierung:** Dashboards für den Überblick, Detailansichten für die Analyse.
- **Alarmierung:** Benachrichtigung über passende Kanäle, Eskalation, automatische Ticketerstellung.
- **Berichte:** Verfügbarkeit, Trends und Kapazität für Management und Planung.

**Observability:** Moderne Ansätze sprechen von **Observability** (Beobachtbarkeit) und kombinieren drei Datenarten: **Metriken** (Messwerte über die Zeit), **Logs** (Ereignismeldungen) und **Traces** (Weg einer Anfrage durch mehrere Systeme). Zusammen erklären sie nicht nur, **dass** etwas falsch läuft, sondern auch **warum**.

## Einsatz von prädiktiver Analyse

**Prädiktive (vorausschauende) Analyse** nutzt historische Daten, um künftige Ereignisse vorherzusagen. So lässt sich handeln, **bevor** ein Problem eintritt.

| Ansatz | Frage | Beispiel |
| --- | --- | --- |
| Reaktiv | Was ist passiert? | Festplatte ist voll, Dienst ist abgestürzt |
| Proaktiv | Was passiert gerade? | Warnung bei 85 % Belegung |
| Prädiktiv | Was wird passieren? | Festplatte ist bei aktuellem Wachstum in 12 Tagen voll |

**Methoden (von einfach bis komplex):**

- **Trendanalyse:** Eine Gerade durch die bisherigen Messwerte legen (lineare Regression) und fortschreiben.
- **Saisonale Muster:** Wiederkehrende Spitzen berücksichtigen, z. B. Monatsabschluss oder Montagmorgen.
- **Anomalieerkennung:** Abweichungen vom gelernten Normalverhalten automatisch erkennen.
- **Maschinelles Lernen:** Modelle, die aus vielen Faktoren Ausfälle vorhersagen, z. B. aus SMART-Werten von Festplatten.

**Typische Anwendungen:** Kapazitätsplanung (Speicher, Lizenzen), Hardwareausfälle vorhersagen, Lastspitzen einplanen, Zertifikats- und Kennwortabläufe rechtzeitig erkennen.

**Beispiel:** Aus täglich gemessenem Speicherverbrauch (CSV mit Spalte `BelegtGB`, ein Wert pro Tag) wird per linearer Regression berechnet, wann das Laufwerk voll ist:

```powershell
$y = Import-Csv .\speicher_verlauf.csv | ForEach-Object { [double]$_.BelegtGB }
$n = $y.Count;  $x = 1..$n
$mx = ($x | Measure-Object -Average).Average
$my = ($y | Measure-Object -Average).Average

$zaehler = 0; $nenner = 0
for ($i = 0; $i -lt $n; $i++) {
    $zaehler += ($x[$i] - $mx) * ($y[$i] - $my)
    $nenner  += ($x[$i] - $mx) * ($x[$i] - $mx)
}
$zuwachsProTag = $zaehler / $nenner          # Steigung der Trendgeraden

$kapazitaetGB = 500
if ($zuwachsProTag -gt 0) {
    $tage = ($kapazitaetGB - $y[-1]) / $zuwachsProTag
    'Zuwachs {0:N2} GB/Tag - voll in ca. {1:N0} Tagen' -f $zuwachsProTag, $tage
} else { 'Kein Wachstum erkennbar.' }
```

**Grenzen:** Vorhersagen sind Wahrscheinlichkeiten, keine Gewissheiten. Sie sind nur so gut wie die Datenbasis. Einmalige Ereignisse (z. B. ein großer Datenimport) können Trends verfälschen.

## Automatisierung von Reaktionsprozessen

Der nächste Schritt nach dem Erkennen ist das **automatische Reagieren**. Statt dass ein Mensch auf jeden Alarm reagiert, führt das System festgelegte Maßnahmen selbst aus. Das Prinzip lautet **Ereignis → Regel → Aktion**.

Reaktionen lassen sich in Stufen einteilen, von harmlos bis weitreichend:

| Stufe | Reaktion | Beispiel |
| --- | --- | --- |
| 1 – Informieren | Benachrichtigung an Zuständige | Mail oder Teams-Nachricht bei Warnung |
| 2 – Dokumentieren | Ticket automatisch anlegen, mit allen Details | Incident mit Logauszug und Messwerten |
| 3 – Selbstheilung | Bekanntes Problem automatisch beheben | Dienst neu starten, Temp-Dateien löschen |
| 4 – Skalieren / Umschalten | Ressourcen anpassen oder auf Ersatzsystem wechseln | Zusätzliche VM starten, Failover |
| 5 – Eskalieren | Wenn die Automatik nicht hilft: Mensch einschalten | Bereitschaft anrufen |

**Sicherheitsregeln (Leitplanken)** für automatische Reaktionen:

- **Wiederholungen begrenzen:** z. B. maximal 3 Neustarts, danach eskalieren. So entstehen keine Endlosschleifen.
- **Alles protokollieren:** Jede automatische Aktion muss nachvollziehbar sein.
- **Kritische Aktionen freigeben lassen:** Löschen, Herunterfahren oder Umschalten nur mit menschlicher Bestätigung.
- **Runbooks:** Jede Reaktion basiert auf einer dokumentierten Handlungsanweisung. Erst manuell erprobt, dann automatisiert.

**Beispiel:** Dienst überwachen, bis zu dreimal neu starten, protokollieren und bei Misserfolg eskalieren:

```powershell
param([string]$Dienst = 'Spooler', [int]$MaxVersuche = 3)
$log = 'C:\Logs\dienstwaechter.log'

if ((Get-Service -Name $Dienst).Status -eq 'Running') { return }

for ($i = 1; $i -le $MaxVersuche; $i++) {
    Start-Service -Name $Dienst -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 5
    if ((Get-Service -Name $Dienst).Status -eq 'Running') {
        $zeit = Get-Date -Format s
        Add-Content $log "$zeit $Dienst nach Versuch $i wieder gestartet"
        return
    }
}
Add-Content $log "$(Get-Date -Format s) $Dienst startet nicht - Eskalation"
Write-Warning "$Dienst startet nicht. Bitte Administrator informieren!"
```

Eingeplant als Aufgabe, die alle 5 Minuten läuft, entsteht daraus eine einfache **Selbstheilung**.

## Dokumentations- und Wissensmanagement

Überwachung und Automatisierung erzeugen Wissen: über Systeme, typische Fehler und bewährte Lösungen. Damit dieses Wissen nicht nur in einzelnen Köpfen steckt, braucht es **Dokumentations- und Wissensmanagement**.

**Was sollte dokumentiert werden?**

- **Systemlandschaft:** Welche Systeme gibt es, wie hängen sie zusammen, wer ist verantwortlich?
- **Überwachungskonzept:** Was wird überwacht, mit welchen Schwellenwerten, wer wird alarmiert?
- **Runbooks:** Schritt-für-Schritt-Anleitungen für bekannte Störungen und Routineaufgaben.
- **Skripte:** Zweck, Parameter, Abhängigkeiten, Beispiele (kommentarbasierte Hilfe, README).
- **Störungsberichte:** Was ist passiert, Ursache, Lösung, Maßnahmen gegen Wiederholung.
- **Änderungen:** Wer hat wann was geändert und warum (Change-Log, Git-Historie)?

**Grundsätze für gutes Wissensmanagement:**

- **Zentral und auffindbar:** Ein gemeinsamer Ort (Wiki, SharePoint, Confluence, Git-Repository) mit guter Suche und Struktur.
- **Aktuell halten:** Dokumentation ist Teil jeder Änderung, nicht eine Aufgabe „für später“. Veraltete Seiten kennzeichnen oder löschen.
- **Vorlagen nutzen:** Einheitlicher Aufbau erleichtert Schreiben und Lesen.
- **Docs as Code:** Dokumentation als Markdown neben den Skripten in Git versionieren.
- **Aus Störungen lernen:** Bekannte Fehler und Lösungen in einer Wissensdatenbank sammeln (in ITIL: Known Error Database).

Beispiel für den Aufbau eines **Runbooks**:

| Abschnitt | Inhalt (Beispiel „Laufwerk C: fast voll“) |
| --- | --- |
| Auslöser | Monitoring-Alarm: freier Speicher auf C: &lt; 10 % |
| Auswirkung | Dienste können abstürzen, Updates schlagen fehl |
| Diagnose | Größte Ordner ermitteln, Temp-, Log- und Update-Cache prüfen |
| Lösungsschritte | 1. Temp-Dateien älter 7 Tage löschen  2. Alte Logs archivieren  3. Freien Platz erneut prüfen |
| Automatisierung | Skript Bereinigung.ps1 (Schritte 1–3), als Selbstheilung eingeplant |
| Eskalation | Wenn danach &lt; 10 %: Ticket an Server-Team, Priorität hoch |
| Verantwortlich / Stand | Server-Team, letzte Prüfung 01.10.2026 |
