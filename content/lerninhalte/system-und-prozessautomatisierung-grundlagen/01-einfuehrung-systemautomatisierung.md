---
title: "Einführung in die Systemautomatisierung"
description: "Was Automatisierung bedeutet, wie sie funktioniert, welche Arten und Werkzeuge es gibt und welche Rolle KI spielt."
duration: "15 Minuten"
---

Dieses Kapitel gibt einen Überblick: was Automatisierung ist, wie sie funktioniert, welche Vorteile und Arten es gibt, welche Rolle künstliche Intelligenz spielt und mit welchen Techniken und Werkzeugen Automatisierung umgesetzt wird. Die folgenden Kapitel vertiefen einzelne Aspekte.

## Automatisierung – Was bedeutet Automatisierung genau?

Der Begriff leitet sich vom griechischen **„autómatos“** ab, was „sich selbst bewegend“ bzw. „selbsttätig“ bedeutet. **Automatisierung** bezeichnet den Einsatz von Technik, damit Vorgänge **selbsttätig nach festgelegten Regeln** ablaufen, also ohne oder mit nur geringem menschlichem Eingreifen.

Ursprünglich stammt der Begriff aus der Industrie (Fertigungsstraßen, Steuerungen, Roboter). In der IT spricht man von **Systemautomatisierung** oder **IT-Automatisierung**. Dort übernimmt Software wiederkehrende Aufgaben in IT-Systemen, etwa das Einrichten von Rechnern, das Verwalten von Benutzern oder das Sichern von Daten.

Automatisierung ist kein „Alles oder Nichts“. Man unterscheidet verschiedene **Automatisierungsgrade**:

| Automatisierungsgrad | Beschreibung | Beispiel |
| --- | --- | --- |
| Manuell | Ein Mensch führt jeden Schritt selbst aus. | Benutzerkonto per Klick in der Verwaltungskonsole anlegen |
| Teilautomatisiert | Einzelne Schritte laufen automatisch, ein Mensch startet, prüft oder entscheidet. | Admin startet ein Skript, das 50 Konten aus einer CSV anlegt |
| Vollautomatisiert | Der gesamte Ablauf läuft ohne Eingriff. Menschen werden nur bei Problemen informiert. | Neue Einträge im HR-System lösen automatisch die Kontoerstellung aus |
| Autonom / intelligent | Das System erkennt Situationen selbst und wählt passende Maßnahmen, teils KI-gestützt. | Monitoring erkennt Engpass und skaliert Server selbstständig hoch |

> **Kurz gesagt:** Automatisierung heißt, eine Aufgabe **einmal sauber zu beschreiben**, sodass sie danach **beliebig oft, gleichbleibend und ohne manuelles Zutun** ausgeführt werden kann.

## Funktionsweise der Automatisierung

Jede Automatisierung folgt im Kern dem **EVA-Prinzip** (Eingabe – Verarbeitung – Ausgabe), ergänzt um einen Auslöser und eine Rückmeldung:

1. **Auslöser (Trigger):** Ein Zeitpunkt, ein Ereignis oder ein manueller Start setzt den Ablauf in Gang.
2. **Eingabe:** Das System liest Daten ein, z. B. aus Dateien, Datenbanken, Schnittstellen (APIs) oder Messwerten.
3. **Verarbeitung:** Regeln und Logik werden angewendet: Bedingungen (`if`), Schleifen (`foreach`), Berechnungen, Entscheidungen.
4. **Aktion / Ausgabe:** Das System führt Änderungen aus (Datei kopieren, Dienst starten, Mail senden) oder erzeugt ein Ergebnis.
5. **Rückmeldung:** Ergebnis und Fehler werden protokolliert. Bei Problemen wird benachrichtigt oder erneut versucht.

Viele Automatisierungen arbeiten zusätzlich als **Regelkreis** (Soll-Ist-Vergleich), ähnlich einem Thermostat: Der Ist-Zustand wird gemessen, mit dem Soll-Zustand verglichen, und bei Abweichung wird korrigiert. In der IT nutzen z. B. Konfigurationsmanagement-Werkzeuge wie PowerShell DSC oder Ansible dieses Prinzip.

| Schritt im Regelkreis | Thermostat | IT-Beispiel: Speicherplatz |
| --- | --- | --- |
| Messen (Ist) | Raumtemperatur ist 18 °C | Laufwerk C: hat noch 8 % frei |
| Vergleichen (Soll) | Soll-Temperatur ist 21 °C | Mindestens 15 % sollen frei sein |
| Stellen (Korrektur) | Heizung einschalten | Temp-Dateien und alte Logs löschen, Admin informieren |
| Erneut messen | Temperatur prüfen | Freien Speicher erneut prüfen und Ergebnis protokollieren |

Das IT-Beispiel als vereinfachtes PowerShell-Skript:

```powershell
$sollProzent = 15
$laufwerk    = Get-PSDrive -Name C
$gesamt      = $laufwerk.Used + $laufwerk.Free
$istProzent  = [math]::Round($laufwerk.Free / $gesamt * 100, 1)

if ($istProzent -lt $sollProzent) {
    Write-Warning "Nur noch $istProzent % frei – Bereinigung wird gestartet."
    Get-ChildItem $env:TEMP -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object LastWriteTime -lt (Get-Date).AddDays(-7) |
        Remove-Item -WhatIf          # -WhatIf entfernen, um wirklich zu löschen
} else {
    Write-Host "Speicher in Ordnung: $istProzent % frei."
}
```

## Die vielfältigen Vorteile der Automatisierung

Automatisierung bringt Vorteile auf mehreren Ebenen, technisch, wirtschaftlich und für die Menschen im Team:

| Vorteil | Erläuterung | Beispiel |
| --- | --- | --- |
| Zeit- und Kostenersparnis | Routinearbeit erledigt sich in Sekunden. Personalaufwand sinkt, Ergebnisse liegen schneller vor. | Monatlicher Bericht in 1 Minute statt 2 Stunden |
| Höhere Qualität | Gleiche Schritte, gleiche Reihenfolge, keine Tipp- oder Flüchtigkeitsfehler. | Jeder neue PC erhält exakt dieselbe Konfiguration |
| Rund-um-die-Uhr-Betrieb | Automatisierte Abläufe arbeiten auch nachts, am Wochenende und an Feiertagen. | Backups um 2 Uhr nachts |
| Skalierbarkeit | Der Aufwand wächst kaum mit der Menge. | Update auf 500 statt 5 Servern |
| Schnellere Reaktion | Probleme werden sofort erkannt und teils automatisch behoben. | Abgestürzter Dienst wird automatisch neu gestartet |
| Nachvollziehbarkeit & Compliance | Logs dokumentieren lückenlos, wer wann was geändert hat. | Nachweis für Audits und Datenschutzprüfungen |
| Mehr Sicherheit | Sicherheitsupdates und Richtlinien werden zuverlässig und zeitnah verteilt. | Patches sind nach 24 h auf allen Geräten |
| Entlastung der Mitarbeitenden | Weniger monotone Arbeit, mehr Zeit für Planung, Beratung und Weiterentwicklung. | Admin kümmert sich um Projekte statt Passwort-Resets |
| Wissenssicherung | Das Wissen über den Ablauf steckt im (dokumentierten) Skript, nicht nur im Kopf einer Person. | Vertretung kann den Prozess problemlos ausführen |

Den Vorteilen stehen auch Grenzen und Risiken gegenüber, etwa Aufwand für Pflege oder Fehler, die sich vervielfachen.

## Welche Arten von Automatisierung gibt es?

Automatisierung lässt sich nach verschiedenen Gesichtspunkten einteilen. **Nach Einsatzbereich:**

| Art | Beschreibung | Beispiel |
| --- | --- | --- |
| IT- / Systemautomatisierung | Automatisierung von Aufgaben in IT-Infrastruktur, Servern, Clients und Netzwerken | Software verteilen, Benutzer anlegen |
| Aufgabenautomatisierung | Einzelne, klar abgegrenzte Tätigkeiten werden automatisiert | Dateien umbenennen, Ordner aufräumen |
| Geschäftsprozessautomatisierung (BPA) | Mehrstufige Abläufe über Abteilungen und Systeme hinweg | Rechnungsfreigabe, Onboarding |
| Robotic Process Automation (RPA) | Software-Roboter bedienen Programmoberflächen wie ein Mensch | Daten aus Altsystem ohne Schnittstelle übertragen |
| Intelligente Automatisierung / Hyperautomation | Kombination aus RPA, Workflows und KI. Möglichst viele Prozesse werden durchgängig automatisiert | Eingehende Rechnungen per KI auslesen und verbuchen |
| Industrielle Automatisierung | Steuerung von Maschinen und Anlagen (SPS, Robotik) | Fertigungsstraße, Lagerlogistik |

**Nach Auslöser:**

- **Zeitgesteuert:** Start zu festen Zeiten oder in Intervallen (Aufgabenplanung, cron).
- **Ereignisgesteuert:** Start durch ein Ereignis, z. B. eine neue Datei, einen Fehler im Ereignisprotokoll oder ein eingehendes Ticket.
- **Bedarfsgesteuert (on demand):** Start manuell oder per Self-Service-Portal, wenn die Aufgabe gebraucht wird.

**Nach Flexibilität** (klassische Einteilung aus der Industrie, übertragbar auf die IT):

- **Feste Automatisierung:** Ein Ablauf ist fest vorgegeben und kaum veränderbar. Sehr effizient für immer gleiche Aufgaben.
- **Programmierbare Automatisierung:** Der Ablauf kann durch Umprogrammieren oder Parameter angepasst werden, z. B. ein Skript mit Parametern.
- **Flexible Automatisierung:** Das System passt sich ohne Umbau an wechselnde Anforderungen an, z. B. regel- oder KI-basiert.

## Die Rolle von KI in Automatisierungstechnologien

Klassische Automatisierung ist **regelbasiert**: Sie funktioniert hervorragend, solange Eingaben strukturiert sind und sich jede Situation mit „wenn … dann …“ beschreiben lässt. **Künstliche Intelligenz (KI)** erweitert Automatisierung um die Fähigkeit, mit **unstrukturierten Daten**, **unklaren Situationen** und **Mustern** umzugehen, die vorher niemand als Regel formuliert hat.

| Aspekt | Regelbasierte Automatisierung | KI-gestützte Automatisierung |
| --- | --- | --- |
| Grundlage | Fest programmierte Regeln | Aus Daten gelernte Muster |
| Eingabedaten | Strukturiert (CSV, Datenbank, Formulare) | Auch unstrukturiert (Text, E-Mails, Bilder, Sprache) |
| Verhalten | Deterministisch: gleiche Eingabe, gleiches Ergebnis | Wahrscheinlichkeitsbasiert: Ergebnis mit Unsicherheit |
| Stärke | Zuverlässig, nachvollziehbar, prüfbar | Flexibel, erkennt Muster und Ausnahmen |
| Schwäche | Scheitert an unvorhergesehenen Fällen | Weniger transparent, kann sich irren |

**Typische Einsatzfelder von KI in der Automatisierung:**

- **Dokumentenverarbeitung:** Texterkennung (OCR) und Sprachverarbeitung lesen Rechnungen, Formulare oder Verträge aus.
- **AIOps (KI im IT-Betrieb):** Anomalien in Logs und Monitoring-Daten erkennen, Ausfälle vorhersagen, Ursachen eingrenzen.
- **Ticket- und Mail-Klassifizierung:** Anfragen automatisch kategorisieren, priorisieren und an das richtige Team weiterleiten.
- **Chatbots und Self-Service:** Standardanfragen wie Passwort-Reset oder Statusabfragen ohne menschliche Bearbeitung beantworten.
- **Vorausschauende Wartung:** Aus Sensordaten oder Hardware-Werten ableiten, wann eine Komponente ausfallen wird.
- **Code-Erstellung:** KI-Assistenten helfen beim Schreiben, Erklären, Testen und Refactoring von Automatisierungsskripten.

> **Wichtig:** KI-Ergebnisse können falsch sein. Kritische Entscheidungen sollten deshalb mit einem **„Human in the Loop“** abgesichert werden, d. h. ein Mensch prüft und gibt frei. Außerdem sind **Datenschutz** (DSGVO) und die **EU-KI-Verordnung (AI Act)** zu beachten, besonders wenn personenbezogene Daten verarbeitet werden. Von einer KI erzeugte Skripte müssen vor dem Einsatz immer verstanden und getestet werden.

## Hauptarten der KI

KI lässt sich auf unterschiedliche Weise einteilen. Am häufigsten sind die Einteilung nach **Leistungsfähigkeit** und nach **Methode/Technik**.

**Nach Leistungsfähigkeit:**

| Art | Beschreibung | Status |
| --- | --- | --- |
| Schwache KI (Narrow AI, ANI) | Für eine bestimmte Aufgabe oder einen begrenzten Aufgabenbereich entwickelt, z. B. Bilderkennung, Übersetzung, Spamfilter, Sprachassistenten. | Heute im Einsatz |
| Starke KI (Allgemeine KI, AGI) | Hätte menschenähnliche, allgemeine Intelligenz und könnte beliebige geistige Aufgaben lösen und Wissen übertragen. | Forschungsziel, umstritten |
| Superintelligenz (ASI) | Würde menschliche Intelligenz in nahezu allen Bereichen übertreffen. | Hypothetisch |

**Nach Methode bzw. Technik** (alle Formen der heute eingesetzten schwachen KI):

| Teilgebiet | Beschreibung | Beispiel in der Automatisierung |
| --- | --- | --- |
| Regelbasierte Systeme / Expertensysteme | Wissen wird als Regeln hinterlegt („wenn … dann …“). Die älteste Form der KI. | Diagnose-Assistent im Helpdesk |
| Maschinelles Lernen (ML) | Algorithmen lernen Muster aus Beispieldaten, statt explizit programmiert zu werden. | Erkennung ungewöhnlicher Anmeldungen |
| – Überwachtes Lernen | Lernen aus Beispielen mit bekannter richtiger Antwort (gelabelte Daten). | Ticket-Kategorisierung |
| – Unüberwachtes Lernen | Findet selbstständig Gruppen und Auffälligkeiten in Daten ohne Vorgaben. | Anomalieerkennung in Logs |
| – Bestärkendes Lernen | Lernt durch Belohnung und Bestrafung, welche Aktionen zum Ziel führen. | Optimierung von Ressourcenzuteilung |
| Deep Learning | ML mit tiefen künstlichen neuronalen Netzen. Besonders stark bei Bildern, Sprache und Text. | Texterkennung in gescannten Belegen |
| Natural Language Processing (NLP) | Verarbeitung und Verstehen natürlicher Sprache. | E-Mails nach Anliegen sortieren |
| Computer Vision | Auswerten von Bildern und Videos. | Qualitätskontrolle, Dokumentenerkennung |
| Generative KI / Large Language Models (LLMs) | Erzeugt neue Inhalte wie Text, Code oder Bilder auf Basis großer Sprachmodelle. | Skript-Entwürfe, Zusammenfassungen, Chatbots |

## Techniken – Grundlegende Techniken der Automatisierung

Unabhängig vom Werkzeug kommen immer wieder dieselben grundlegenden Techniken zum Einsatz:

| Technik | Beschreibung |
| --- | --- |
| Skripting | Abläufe werden als Programmcode in einer Skriptsprache formuliert (PowerShell, Bash, Python). Die Basis fast jeder IT-Automatisierung. |
| Zeitplanung (Scheduling) | Aufgaben werden zu festen Zeiten oder in Intervallen gestartet, z. B. Windows-Aufgabenplanung, cron. |
| Ereignissteuerung (Event-driven) | Ein Ereignis löst eine Aktion aus: neue Datei, Eintrag im Ereignisprotokoll, Webhook-Aufruf. |
| Schnittstellen-Integration (APIs) | Systeme werden über Programmierschnittstellen verbunden, z. B. REST-APIs mit `Invoke-RestMethod`. |
| Vorlagen (Templates) | Wiederkehrende Strukturen werden einmal definiert und mehrfach verwendet, z. B. VM-Vorlagen oder Dokumentvorlagen. |
| Konfigurationsmanagement (Desired State) | Der gewünschte Zielzustand wird beschrieben. Das Werkzeug stellt ihn her und hält ihn aufrecht. |
| Infrastructure as Code (IaC) | Infrastruktur wird als versionierter Code beschrieben und automatisch bereitgestellt. |
| Orchestrierung | Mehrere automatisierte Schritte und Systeme werden zu einem Gesamtablauf koordiniert. |
| UI-Automatisierung (RPA) | Bedienung von Benutzeroberflächen per Software-Roboter, wenn keine Schnittstelle existiert. |
| Überwachung & Alarmierung | Systeme werden laufend geprüft. Bei Abweichungen wird benachrichtigt. |
| Selbstheilung (Self-Healing) | Erkannte Probleme werden automatisch behoben, z. B. Dienst neu starten oder Speicher bereinigen. |

Beispiel für **Ereignissteuerung** mit PowerShell: Jede neue Datei in einem Eingangsordner wird sofort gemeldet.

```powershell
$watcher = New-Object System.IO.FileSystemWatcher 'C:\Eingang', '*.*'
$watcher.EnableRaisingEvents = $true

Register-ObjectEvent -InputObject $watcher -EventName Created -Action {
    Write-Host "Neue Datei: $($Event.SourceEventArgs.Name)"
} | Out-Null
```

Beispiel für **Schnittstellen-Integration**: Daten von einer REST-API abrufen und weiterverarbeiten.

```powershell
$daten = Invoke-RestMethod -Uri 'https://api.example.com/v1/tickets?status=offen'
$daten | Where-Object prioritaet -eq 'hoch' | Select-Object id, titel
```

## Automatisierungswerkzeuge – Ein Überblick über gängige Werkzeuge

Für jede Technik gibt es spezialisierte Werkzeuge. Die Tabelle zeigt verbreitete Vertreter (Auswahl):

| Kategorie | Werkzeuge | Typischer Einsatz |
| --- | --- | --- |
| Skriptsprachen | PowerShell, Bash, Python | Aufgaben auf Windows, Linux, plattformübergreifend |
| Aufgabenplanung | Windows-Aufgabenplanung, cron, systemd-Timer | Skripte zeitgesteuert starten |
| Konfigurationsmanagement | Ansible, PowerShell DSC, Puppet, Chef | Server einheitlich konfigurieren |
| Infrastructure as Code | Terraform / OpenTofu, Bicep, Pulumi | Cloud- und VM-Ressourcen bereitstellen |
| CI/CD | GitHub Actions, GitLab CI, Azure DevOps, Jenkins | Code testen, bauen, ausliefern |
| Container & Orchestrierung | Docker, Kubernetes | Anwendungen paketieren und skalieren |
| Client- / Geräteverwaltung | Microsoft Intune, Configuration Manager, Gruppenrichtlinien | PCs und Mobilgeräte verwalten, Software verteilen |
| Cloud-Automatisierung | Azure Automation, AWS Systems Manager | Runbooks und Wartung in der Cloud |
| RPA | UiPath, Power Automate Desktop, Automation Anywhere | Oberflächen-Automatisierung |
| Workflow / Integration | Power Automate, n8n, Zapier, Make | Dienste und Apps verbinden, Geschäftsprozesse |
| Monitoring | Prometheus, Grafana, Zabbix, PRTG | Überwachung, Alarmierung, Auslöser für Self-Healing |
| Versionsverwaltung | Git (GitHub, GitLab, Azure Repos) | Skripte versionieren, gemeinsam entwickeln |

## Kriterien bei der Auswahl des richtigen Automatisierungstools

Es gibt nicht „das beste“ Werkzeug, sondern nur das **passende** für eine konkrete Aufgabe und Umgebung. Folgende Kriterien helfen bei der Auswahl:

| Kriterium | Leitfragen |
| --- | --- |
| Anwendungsfall | Welche Aufgabe soll gelöst werden? Einzelaufgabe, Systemkonfiguration oder ganzer Geschäftsprozess? |
| Kompatibilität | Passt das Werkzeug zur Systemlandschaft (Windows, Linux, Cloud, vorhandene Software)? |
| Know-how & Lernkurve | Kennt das Team die Sprache oder das Werkzeug bereits? Wie schnell lässt es sich erlernen? |
| Kosten | Lizenzkosten, Betriebskosten, Schulungsaufwand. Ist eine Open-Source-Alternative ausreichend? |
| Integration | Gibt es Schnittstellen, Module oder Konnektoren zu den benötigten Systemen? |
| Skalierbarkeit | Funktioniert das Werkzeug auch bei 10-facher Menge an Systemen oder Daten? |
| Sicherheit | Wie werden Zugangsdaten verwaltet? Gibt es Rollen und Rechte, Protokollierung, Verschlüsselung? |
| Wartbarkeit | Lässt sich der Code versionieren, testen und dokumentieren? Ist er für andere verständlich? |
| Support & Community | Gibt es Dokumentation, Herstellersupport, eine aktive Community, Beispiele? |
| Zukunftssicherheit | Wird das Werkzeug weiterentwickelt? Wie stark ist die Abhängigkeit von einem Hersteller? |
| Datenschutz & Compliance | Wo werden Daten verarbeitet (lokal oder Cloud)? Werden Vorgaben (DSGVO, interne Richtlinien) erfüllt? |

Bei mehreren Kandidaten hilft eine **Nutzwertanalyse**: Kriterien werden gewichtet (Summe 100 %), jedes Werkzeug erhält pro Kriterium Punkte (1 = schlecht bis 5 = sehr gut), und die gewichteten Punkte werden addiert. Beispiel für die Aufgabe „Dateiverwaltung auf Windows-PCs automatisieren“:

| Kriterium | Gewicht | PowerShell | Python | Power Automate |
| --- | --- | --- | --- | --- |
| Kompatibilität (Windows) | 30 % | 5 | 4 | 3 |
| Lernaufwand / Know-how | 20 % | 4 | 4 | 5 |
| Kosten | 20 % | 5 | 5 | 3 |
| Integration | 15 % | 4 | 4 | 4 |
| Community & Doku | 15 % | 4 | 5 | 3 |
| **Gewichtete Summe** | **100 %** | **4,50** | **4,35** | **3,55** |

**Ergebnis:** Für diese Aufgabe ist **PowerShell** am besten geeignet. Es ist auf Windows bereits vorhanden, kostet nichts und ist eng mit dem Betriebssystem verzahnt. Bei einer anderen Aufgabe oder Umgebung, z. B. Linux-Server oder Datenanalyse, kann das Ergebnis ganz anders ausfallen.
