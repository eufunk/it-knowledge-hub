---
title: "Glossar"
description: "Die wichtigsten Begriffe des Kurses kurz erklärt."
duration: "5 Minuten"
anhang: true
---

| Begriff | Erklärung |
| --- | --- |
| AIOps | Artificial Intelligence for IT Operations: KI-Einsatz im IT-Betrieb, z. B. zur Anomalieerkennung |
| Alarmmüdigkeit | Zu viele (Fehl-)Alarme führen dazu, dass auch wichtige Alarme ignoriert werden |
| Alias | Alternativer, meist kürzerer Name für ein Cmdlet, z. B. ls für Get-ChildItem |
| Amortisationszeit | Zeit, nach der sich der Aufwand einer Automatisierung durch die eingesparte Arbeitszeit ausgeglichen hat |
| Automatisierung | Ausführung von Aufgaben durch Software ohne manuelles Eingreifen |
| Baseline | Gemessener Normalzustand eines Systems, Grundlage für sinnvolle Schwellenwerte |
| Bash | Bourne Again Shell: verbreitete Kommandozeile und Skriptsprache unter Linux |
| BPA / BPM | Business Process Automation / Management: Automatisierung bzw. Steuerung von Geschäftsprozessen |
| Breakpoint | Haltepunkt: Stelle, an der ein Debugger das Skript anhält, um Variablen und Ablauf zu prüfen |
| Cmdlet | Ein PowerShell-Befehl im Format Verb-Nomen, z. B. `Get-Process` |
| CI/CD | Continuous Integration / Continuous Delivery: automatisches Bauen, Testen und Ausliefern von Software |
| chroot | Change Root: startet einen Prozess mit einem anderen Verzeichnis als Wurzel des Dateisystems |
| Container | Isolierte Laufzeitumgebung mit eigenem Dateisystem, eigenen Prozessen und eigenem Netzwerk, z. B. mit Docker |
| CVE / CVSS | Common Vulnerabilities and Exposures: eindeutige Kennung einer Schwachstelle; Common Vulnerability Scoring System: Bewertung von 0 bis 10 |
| Debugging | Systematisches Suchen und Beheben von Fehlern, oft mit Werkzeugen wie Ablaufverfolgung oder Debugger |
| Defense in Depth | Gestaffelte Verteidigung aus mehreren unabhängigen Schutzschichten |
| Dry Run | Probelauf: Das Skript zeigt an, was es tun würde, ohne etwas zu ändern, z. B. mit -WhatIf |
| DSC | Desired State Configuration: deklaratives Konfigurationsmanagement in PowerShell |
| EVA-Prinzip | Eingabe – Verarbeitung – Ausgabe: Grundmuster jeder Datenverarbeitung |
| Execution Policy | Ausführungsrichtlinie: legt fest, ob und welche PowerShell-Skripte ausgeführt werden dürfen |
| Exit-Code | Zahl, die ein Befehl oder Skript beim Beenden zurückgibt: 0 = Erfolg, alles andere = Fehler |
| HSM | Hardware-Sicherheitsmodul: spezielles Gerät, das kryptografische Schlüssel sicher speichert und verwendet |
| Hyperautomation | Kombination von RPA, Workflows und KI, um möglichst viele Prozesse durchgängig zu automatisieren |
| IaC | Infrastructure as Code: Infrastruktur wird als versionierter Code beschrieben |
| Idempotenz | Mehrfaches Ausführen führt immer zum selben Ergebnis; ist der Zielzustand erreicht, ändert ein weiterer Lauf nichts |
| ISMS | Informationssicherheits-Managementsystem: Regeln, Verfahren und Verantwortlichkeiten zur Steuerung der Informationssicherheit, z. B. nach ISO 27001 |
| ITIL | Verbreitetes Rahmenwerk mit Best Practices für IT-Service-Management |
| KI | Künstliche Intelligenz: Systeme, die Aufgaben lösen, für die sonst menschliche Intelligenz nötig wäre |
| Laufzeitfehler | Fehler, der erst bei der Ausführung auftritt, z. B. fehlende Datei oder nicht erreichbarer Server |
| Least Privilege | Prinzip der geringsten Rechte: nur so viele Berechtigungen wie nötig |
| Linter | Prüfwerkzeug, das typische Fehler und Stilprobleme im Code findet, ohne ihn auszuführen, z. B. shellcheck oder PSScriptAnalyzer |
| LLM | Large Language Model: großes Sprachmodell, Grundlage generativer Text-KI |
| Logdatei | Fortlaufende Aufzeichnung von Ereignissen mit Zeitstempel, Quelle, Schweregrad und Nachricht |
| Logikfehler | Fehler, bei dem ein Skript ohne Fehlermeldung läuft, aber ein falsches Ergebnis liefert |
| Maschinelles Lernen | Teilgebiet der KI: Algorithmen lernen Muster aus Daten, statt explizit programmiert zu werden |
| Medienbruch | Wechsel des Mediums im Ablauf, z. B. Daten aus einer E-Mail werden von Hand in ein System getippt |
| MFA | Mehr-Faktor-Authentifizierung: Anmeldung mit mindestens zwei Faktoren aus Wissen, Besitz und Sein |
| Nutzwertanalyse | Entscheidungsmethode mit gewichteten Kriterien zum Vergleich mehrerer Alternativen |
| Observability | Beobachtbarkeit eines Systems durch Metriken, Logs und Traces |
| Patch | Korrektur, die eine Schwachstelle oder einen Fehler in Software behebt |
| PDCA | Plan – Do – Check – Act: Zyklus der kontinuierlichen Verbesserung |
| Pipeline | Weitergabe von Objekten von einem Befehl zum nächsten mit `\|` |
| Post-Mortem | Nachbesprechung einer Störung zur Ursachenanalyse, idealerweise ohne Schuldzuweisung |
| Prädiktive Analyse | Vorhersage künftiger Ereignisse aus historischen Daten |
| Process Mining | Automatische Rekonstruktion von Prozessen aus Systemdaten |
| Quick Win | Maßnahme mit hohem Nutzen bei geringem Aufwand, die schnell umgesetzt werden kann |
| Risiko | Eintrittswahrscheinlichkeit × Schadenshöhe einer Bedrohung, die auf eine Schwachstelle trifft |
| RPA | Robotic Process Automation: Software-Roboter bedienen Benutzeroberflächen |
| RTO / RPO | Recovery Time Objective: maximale Ausfallzeit; Recovery Point Objective: maximal hinnehmbarer Datenverlust |
| Runbook | Dokumentierte Schritt-für-Schritt-Anleitung für eine Routineaufgabe oder Störung |
| Schwellenwert | Grenzwert, ab dem eine Warnung oder ein Alarm ausgelöst wird |
| Self-Service | Anwender erledigen Standardanliegen wie Passwort-Reset oder Softwareinstallation selbst über ein Portal |
| Shebang | Erste Zeile eines Skripts (z. B. #!/bin/bash), die den Interpreter festlegt |
| Shell | Programm, das Befehle entgegennimmt, ausführt und Ergebnisse ausgibt, z. B. Bash oder PowerShell |
| SIEM | Security Information and Event Management: zentrale Sammlung und Auswertung von Sicherheitsereignissen |
| Signal | Kurze Nachricht an einen Prozess, z. B. SIGINT (Strg + C) oder SIGTERM (Beenden) |
| SMART | Regel für gute Ziele: spezifisch, messbar, attraktiv, realistisch, terminiert |
| stderr | Standardfehlerausgabe (Datenstrom 2) für Fehler- und Statusmeldungen |
| Strict Mode | Mit Set-StrictMode aktivierte strengere Regeln, die z. B. Tippfehler in Variablennamen als Fehler melden |
| sudo | Führt einzelne Befehle mit den Rechten eines anderen Benutzers aus, meist root |
| Syntaxfehler | Verstoß gegen die Regeln der Programmiersprache, z. B. fehlendes fi oder fehlende Klammer |
| TLS | Transport Layer Security: Protokoll für verschlüsselte Verbindungen, Nachfolger von SSL; aktuell sind TLS 1.2 und 1.3 |
| trap | Bash-Befehl, der festlegt, was bei einem Signal oder Ereignis wie EXIT oder ERR passiert |
| Trigger | Auslöser, der einen automatisierten Ablauf startet |
| Workflow | Festgelegte Abfolge von Arbeitsschritten |
| Zero Trust | Sicherheitsansatz, bei dem kein Zugriff automatisch vertraut wird, auch nicht im internen Netz |
