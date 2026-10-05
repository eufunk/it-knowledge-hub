---
title: "Automatisierung lokaler Wartungsaufgaben"
description: "Grundprinzipien, RPA und IPA, Vorteile und Herausforderungen, Planung in fünf Schritten, Automatisierung im Alltag und eine Backup-Anwendung in Python."
duration: "50 Minuten"
---

Viele Aufgaben auf einem einzelnen Rechner oder Server wiederholen sich ständig: Daten sichern, temporäre Dateien aufräumen, Updates einspielen, Logdateien kürzen. Werden sie von Hand erledigt, werden sie vergessen oder unterschiedlich ausgeführt. Dieses Kapitel klärt zunächst die Grundbegriffe der Automatisierung, stellt Vorteile und Herausforderungen gegenüber und zeigt, wie Du Automatisierungsaufgaben planst, absicherst und überwachst. Beispiele aus dem Alltag, eine Übung und eine Coding Challenge zur automatischen Datensicherung runden das Kapitel ab.

| Lokale Wartungsaufgabe | Windows | Linux |
| --- | --- | --- |
| Daten sichern | Dateiversionsverlauf, Windows-Sicherung, eigenes Skript | `rsync`, `tar`, eigenes Skript |
| Temporäre Dateien aufräumen | Speicheroptimierung, PowerShell-Skript | `systemd-tmpfiles`, `find ... -delete` |
| Updates einspielen | Windows Update, `winget upgrade --all` | `unattended-upgrades`, `dnf-automatic` |
| Logdateien begrenzen | Größe der Ereignisprotokolle festlegen | `logrotate` |
| Datenträger prüfen | `chkdsk`, `Optimize-Volume` | `fsck`, `smartctl` |
| Zeitgesteuert ausführen | Aufgabenplanung | `cron`, systemd-Timer |

## Grundprinzipien der Automatisierung

Automatisierung ist ein Begriff, der in der digitalen Welt immer häufiger auftaucht. Doch was genau bedeutet er, und welche Konzepte stecken dahinter?

> **Definition:** **Automatisierung** bezeichnet den Einsatz von Technologie und Maschinen, um Prozesse und Aufgaben ohne menschliches Eingreifen auszuführen. Das kann durch Software, Roboter oder mechanische Systeme geschehen. Ziel ist es, die Effizienz zu steigern, Fehler zu vermeiden, Ressourcen zu schonen und eine gleichbleibende Ausführung sicherzustellen.

Automatisierung findet sich in vielen Bereichen: in der industriellen Produktion, in IT- und Geschäftsprozessen, im Büroalltag und im privaten Umfeld.

| Grundprinzip | Bedeutung |
| --- | --- |
| Regeln statt Einzelentscheidungen | Der Ablauf wird einmal festgelegt und danach immer gleich ausgeführt |
| Auslöser | Ein Zeitpunkt, ein Ereignis oder ein Aufruf startet den Ablauf |
| Wiederholbarkeit | Gleiche Eingaben führen zum gleichen Ergebnis |
| Rückmeldung | Ergebnis und Fehler werden protokolliert, bei Problemen wird benachrichtigt |
| Menschliche Kontrolle | Der Mensch legt die Regeln fest, überwacht und greift bei Ausnahmen ein |

**Beispiel:** In der Fertigungsindustrie betreiben Roboter ganze Produktionslinien. Sie arbeiten rund um die Uhr ohne Pausen, was die Produktivität erheblich steigert.

Wie weit die Automatisierung in der Industrie fortgeschritten ist, zeigt die **Roboterdichte**, also die Zahl der Industrieroboter je 10.000 Beschäftigte im Verarbeitenden Gewerbe. Deutschland lag 2022 mit 415 Robotern hinter Südkorea (1.012) weltweit auf Platz zwei. Am stärksten gewachsen ist China: Die Roboterdichte hat sich dort zwischen 2017 und 2022 von 97 auf 392 etwa vervierfacht.

| Land | 2017 | 2022 |
| --- | --- | --- |
| Südkorea | 710 | 1.012 |
| Deutschland | 322 | 415 |
| Japan | 308 | 397 |
| China | 97 | 392 |
| Schweden | 240 | 343 |
| Schweiz | 129 | 296 |
| USA | 200 | 285 |
| Italien | 190 | 219 |
| Kanada | 161 | 198 |
| Frankreich | 137 | 180 |

*Industrieroboter je 10.000 Beschäftigte im Verarbeitenden Gewerbe, 2017 und 2022. Daten: International Federation of Robotics. Quelle: [Statista](https://de.statista.com/infografik/13676/roboterdichte-in-der-fertigungsindustrie/)*

## Effiziente Prozessautomatisierung: Die Rolle von RPA und IPA

**Robotic Process Automation (RPA)** und **Intelligent Process Automation (IPA)** sind Technologien zur Automatisierung von Geschäftsprozessen. Sie beruhen auf unterschiedlichen Prinzipien und bieten verschiedene Stufen von Komplexität und Intelligenz.

### Automatisierung leicht gemacht: RPA im Einsatz

> **Definition:** **RPA** bezeichnet den Einsatz von Software-Robotern, die regelbasierte, sich wiederholende Aufgaben ausführen, die sonst Menschen erledigen. Die Roboter bedienen die Oberflächen verschiedener Anwendungen wie ein Mensch: Sie klicken, tippen, lesen Daten aus und übertragen sie in andere Systeme.

Werkzeuge wie **UiPath**, **Blue Prism** und **Automation Anywhere** automatisieren solche Aufgaben, ohne dass die bestehenden Systeme verändert werden müssen. Beispiele für RPA-Anwendungen:

- Bearbeitung von Rechnungen
- Aktualisierung von Kundeninformationen
- Verarbeitung von Bestellungen

### Künstliche Intelligenz trifft auf Automatisierung: IPA

**IPA** geht über RPA hinaus und verbindet sie mit Technologien wie künstlicher Intelligenz (KI), maschinellem Lernen, Verarbeitung natürlicher Sprache und Bilderkennung (Computer Vision). Dadurch kann IPA auch komplexere und weniger strukturierte Aufgaben bewältigen, für die bisher menschliches Urteilsvermögen nötig war: Daten analysieren, Muster erkennen, Entscheidungen treffen und sich an veränderte Bedingungen anpassen. Beispiele für IPA-Anwendungen:

- Kundenservice-Systeme, die Anfragen verstehen und beantworten
- Analyse großer Datenmengen zur Vorhersage von Trends
- Verarbeitung unstrukturierter Daten wie E-Mails oder gescannter Dokumente
- Intelligente Chatbots, die Anfragen in natürlicher Sprache bearbeiten

| Merkmal | RPA | IPA |
| --- | --- | --- |
| Grundlage | Feste Regeln | Regeln plus KI und maschinelles Lernen |
| Eingabedaten | Strukturiert, z. B. Formulare und Tabellen | Auch unstrukturiert, z. B. E-Mails, Scans, Sprache |
| Entscheidungen | Nur vorher festgelegte | Auch eigene Einschätzungen auf Basis gelernter Muster |
| Anpassung | Muss bei Änderungen neu eingerichtet werden | Kann sich an veränderte Bedingungen anpassen |
| Typischer Einsatz | Daten zwischen Systemen übertragen | Dokumente auslesen, Anfragen klassifizieren und beantworten |

Knapp drei Viertel der Unternehmen (73 Prozent) messen der Prozessautomatisierung laut einer Unternehmensbefragung eine „sehr große“ oder „große“ Bedeutung zu. Vielerorts ist sie auch in den strategischen Zielen verankert.

> **Kurz gesagt:** RPA automatisiert regelbasierte, sich wiederholende Aufgaben über die Oberflächen bestehender Systeme. IPA kombiniert RPA mit KI, um auch komplexere und weniger strukturierte Aufgaben zu automatisieren. Beide tragen dazu bei, Effizienz und Produktivität zu steigern.

## Vorteile und Herausforderungen der Automatisierung

### Vorteile

| Vorteil | Erläuterung | Beispiel |
| --- | --- | --- |
| Effizienzsteigerung | Wiederkehrende Aufgaben werden schneller und präziser erledigt. Maschinen und Software arbeiten ohne Pausen | Software sortiert und analysiert Daten in einem Bruchteil der Zeit, die ein Mensch bräuchte |
| Fehlerreduktion | Automatisierte Systeme arbeiten nach festen Regeln und werden nicht müde oder unaufmerksam | Die Rechtschreibprüfung erkennt Tippfehler sofort |
| Kosteneinsparungen | Weniger manueller Aufwand und weniger Fehler senken die Kosten, Ressourcen werden effizienter genutzt | Roboter übernehmen in der Fertigung wiederkehrende Arbeiten und senken die Produktionskosten |
| Verbesserte Qualität | Präzise Vorgaben sorgen für ein gleichbleibend hohes Ergebnis | Roboter setzen in der Automobilindustrie präzise Schweißnähte |
| Skalierbarkeit | Die Kapazität lässt sich durch zusätzliche Ressourcen erhöhen, ohne Schulung oder Einarbeitung | Cloud-Dienste wachsen bei steigender Nachfrage schnell mit |

### Herausforderungen

| Herausforderung | Erläuterung | Beispiel |
| --- | --- | --- |
| Hohe Anfangsinvestitionen | Hardware, Software und Schulungen kosten zunächst Geld, die Einsparungen kommen erst später | Industrieroboter verursachen hohe Anschaffungskosten, bringen langfristig aber Einsparungen |
| Komplexität der Implementierung | Die richtigen Prozesse müssen ausgewählt und die Lösung nahtlos in bestehende Systeme eingebunden werden | Einführung eines ERP-Systems (Enterprise Resource Planning), das alle Geschäftsprozesse verbindet |
| Abhängigkeit von Technologie | Fällt ein automatisiertes System aus, entstehen erhebliche Störungen | Ausfall automatisierter Kassensysteme führt zu Warteschlangen und Umsatzeinbußen |
| Verlust von Arbeitsplätzen | Besonders einfache, wiederkehrende Tätigkeiten können wegfallen | Roboter übernehmen einfache Montagearbeiten |
| Sicherheitsrisiken | Vernetzte automatisierte Systeme können angegriffen, lahmgelegt oder manipuliert werden | Angriff auf das ukrainische Stromnetz im Dezember 2015: Angreifer übernahmen Steuerungssysteme und verursachten einen großflächigen Stromausfall |

## Planung und Implementierung von Automatisierungsaufgaben

Automatisierung kann Dir die Arbeit erheblich erleichtern. Wie bei allen technischen Projekten gibt es aber Fallstricke. Die folgenden fünf Schritte helfen Dir, häufige Fehler zu vermeiden und Deine Automatisierungsprojekte erfolgreich umzusetzen.

### Schritt 1: Klare Zielsetzung und Planung

Bevor Du beginnst, solltest Du wissen, **was** Du automatisieren möchtest und **warum**. Eine klare Zielsetzung hilft, den Fokus zu behalten und die richtigen Werkzeuge auszuwählen.

1. **Analyse der aktuellen Prozesse:** Untersuche, welche Aufgaben wiederkehrend und zeitaufwendig sind. So erkennst Du, wo Automatisierung den größten Nutzen bringt.
2. **Festlegung der Ziele:** Was soll die Automatisierung erreichen, und welche Anforderungen muss sie erfüllen?
3. **Machbarkeitsstudie:** Sind die technischen Voraussetzungen erfüllt, und sind die nötigen Ressourcen und Kenntnisse vorhanden?
4. **Risikoanalyse:** Welche Risiken wie Datenverlust, Systemausfälle oder Sicherheitslücken bestehen, und wie lassen sie sich verringern?
5. **Erstellung eines Plans:** Alle Schritte und Meilensteine mit Verantwortlichkeiten und Zeitplan festhalten.

### Schritt 2: Auswahl der richtigen Werkzeuge

Welches Werkzeug passt, hängt von der Art der Aufgabe, ihrer Komplexität und der vorhandenen Infrastruktur ab.

| Werkzeugart | Beispiele | Typischer Einsatz |
| --- | --- | --- |
| Skriptsprachen | Python, Bash, PowerShell | Einfache bis mittlere Automatisierungsaufgaben. Python bietet viele Bibliotheken, z. B. PyAutoGUI zur Steuerung von Maus und Tastatur oder Requests für die Kommunikation mit Webseiten und Web-Schnittstellen |
| Automatisierungsplattformen | Ansible, Puppet, Chef | Konfigurationsverwaltung, Server bereitstellen, Netzwerke konfigurieren |
| Robotic Process Automation | UiPath, Blue Prism, Automation Anywhere | Regelbasierte Geschäftsprozesse über die Oberflächen bestehender Programme |

Kriterien für die Auswahl:

- **Kompatibilität:** Passt das Werkzeug zur bestehenden IT-Infrastruktur?
- **Skalierbarkeit:** Kann es mit wachsenden Anforderungen umgehen?
- **Benutzerfreundlichkeit:** Ist es leicht zu erlernen und zu bedienen?

### Schritt 3: Testen und Validieren

- **Testumgebung einrichten:** Teste Deine Skripte in einer isolierten Umgebung, ohne das Produktivsystem zu gefährden.
- **Inkrementell testen:** Teste in kleinen Schritten, um Fehler früh zu erkennen. Teile die Automatisierung dafür in kleine, wiederverwendbare Module auf, in Python z. B. getrennte Funktionen oder Skripte für Datenextraktion, Datenverarbeitung und Datenexport. Das erleichtert auch Wartung und Fehlersuche.
- **Tests dokumentieren:** Halte fest, welche Tests Du durchgeführt hast und welche Ergebnisse sie geliefert haben.

### Schritt 4: Fehlerbehandlung und Monitoring

*„Fehler zu machen ist nicht schlimm, doch schlimmer ist, sie nicht einzusehen.“ – Monika Kühn-Görg*

Fehler sind ein unvermeidlicher Bestandteil der Automatisierung. Mit früher Fehlererkennung, wirksamer Fehlerbehandlung und kontinuierlicher Verbesserung bleiben Deine Automatisierungen trotzdem zuverlässig.

**Fehlerprotokollierung**

Jeder Fehler sollte ausführlich protokolliert werden: Zeitpunkt, betroffene Komponente, Art des Fehlers und mögliche Ursache. Diese Angaben sind die Grundlage für jede Analyse. Ergänzend gehören dazu eine gute Dokumentation des Codes und eine Versionsverwaltung wie Git, mit der sich Änderungen nachverfolgen und frühere Versionen wiederherstellen lassen. In Python übernimmt das Modul `logging` die Protokollierung:

```python
import logging

logging.basicConfig(
    filename="automatisierung.log",
    encoding="utf-8",  # sonst falsche Umlaute unter Windows
    level=logging.INFO,
    format="%(asctime)s %(levelname)-7s %(name)s: %(message)s",
)
log = logging.getLogger("backup")

try:
    sichere_daten()
except OSError:
    log.exception("Backup fehlgeschlagen")  # mit vollständiger Fehlerspur
```

**Automatische Benachrichtigungen**

Benachrichtigungen informieren Dich, sobald ein Fehler auftritt, z. B. per E-Mail, SMS oder über einen Messaging-Dienst wie Slack. Dabei hilft folgendes Vorgehen:

1. **Auslöser festlegen:** Welche Fehler und Ereignisse sollen eine Benachrichtigung auslösen, z. B. kritische Fehler, Ausfälle oder bestimmte Ausnahmen?
2. **Benachrichtigungssystem wählen:** Dienste wie Amazon SNS oder Twilio oder die eingebauten Benachrichtigungen von CI/CD-Plattformen wie Jenkins senden Nachrichten an festgelegte Empfänger.
3. **Eskalation einplanen:** Wird ein kritischer Fehler nicht innerhalb einer festgelegten Zeit behoben, geht die Meldung an weitere Personen oder über einen anderen Kanal.
4. **Benachrichtigungen testen:** Mit simulierten Fehlern regelmäßig prüfen, ob die Meldungen tatsächlich ankommen.

**E-Mail-Benachrichtigung:** Python versendet E-Mails mit dem eingebauten Modul `smtplib`. Das Passwort steht dabei nicht im Code, sondern kommt aus einer Umgebungsvariable, und die Verbindung wird mit STARTTLS verschlüsselt:

```python
import os
import smtplib
from email.message import EmailMessage


def send_error_email(fehlertext: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = "Automatisierungsfehler"
    msg["From"] = "automation@example.com"
    msg["To"] = "admin@example.com"
    msg.set_content(fehlertext)

    with smtplib.SMTP("smtp.example.com", 587, timeout=30) as server:
        server.starttls()  # Verbindung verschlüsseln
        server.login("automation@example.com", os.environ["SMTP_PASSWORT"])
        server.send_message(msg)
```

**Slack-Benachrichtigung:** Slack ist eine Plattform für Teamkommunikation, die Gespräche in themen- oder projektbezogenen Kanälen organisiert. Über die Slack-API lassen sich andere Anwendungen anbinden. Am einfachsten ist ein sogenannter **Webhook**: eine geheime Adresse, an die ein Skript eine Nachricht schickt, die dann im gewünschten Kanal erscheint. Das Beispiel nutzt die Bibliothek Requests:

```python
import os

import requests


def send_slack_notification(nachricht: str) -> None:
    webhook_url = os.environ["SLACK_WEBHOOK_URL"]  # geheim, nicht im Code
    antwort = requests.post(webhook_url, json={"text": nachricht}, timeout=10)
    if antwort.status_code != 200:
        raise ValueError(
            f"Slack meldet Fehler {antwort.status_code}: {antwort.text}"
        )
```

> **Wichtig:** Zugangsdaten wie SMTP-Passwörter oder Webhook-Adressen gehören nie in den Code. Wer sie kennt, kann in Deinem Namen E-Mails versenden oder Nachrichten posten. Umgebungsvariablen, geschützte Konfigurationsdateien oder ein Passwort-Tresor sind sichere Alternativen.

**Fallback-Mechanismen und Wiederholungen**

Lässt sich ein Fehler nicht sofort beheben, braucht es eine **Ausweichlösung**: einen alternativen Weg, die Aufgabe zu erledigen, eine Benachrichtigung an eine verantwortliche Person für den manuellen Eingriff oder die Rückkehr in einen sicheren Zustand. In Python fangen `try`-`except`-Blöcke Fehler ab. Vorübergehende Fehler, z. B. kurze Netzwerkausfälle, löst oft ein erneuter Versuch. Wichtig sind eine begrenzte Zahl von Versuchen und wachsende Pausen, damit das System nicht überlastet wird:

```python
import time


def mit_wiederholung(funktion, versuche=3, pause=5):
    """Führt funktion() aus und wiederholt sie bei vorübergehenden Fehlern."""
    for versuch in range(1, versuche + 1):
        try:
            return funktion()
        except OSError as fehler:
            log.warning("Versuch %d von %d fehlgeschlagen: %s",
                        versuch, versuche, fehler)
            if versuch == versuche:
                raise  # endgültig gescheitert
            time.sleep(pause * versuch)  # 5, 10, ... Sekunden warten
```

**Automatisierte Tests**

Automatisierte Tests stellen sicher, dass Automatisierungen korrekt funktionieren:

| Testart | Prüft |
| --- | --- |
| Unit-Tests | Einzelne Funktionen |
| Integrationstests | Das Zusammenspiel mehrerer Teile |
| End-to-End-Tests | Den gesamten Ablauf |

Für Python-Skripte eignet sich **pytest**, für Webanwendungen **Selenium**. CI-Werkzeuge wie **Jenkins** oder **Travis CI** führen die Tests bei jeder Änderung automatisch aus.

**Proaktive Fehlererkennung durch Monitoring**

Durch kontinuierliches Monitoring und Logging erkennst Du Auffälligkeiten und Fehler sofort, oft bevor sie Folgen haben. Spezialisierte Werkzeuge bieten Dashboards und Alarme:

- **Nagios:** Open-Source-Werkzeug zur Überwachung von Netzwerken und Systemen.
- **Prometheus:** Monitoring-System, das speziell für dynamische Umgebungen wie Container und Cloud entwickelt wurde.

### Schritt 5: Sicherheitsaspekte berücksichtigen

Automatisierungen müssen sicher sein: Sensible Daten sind zu schützen, Sicherheitslücken zu vermeiden. Bei vertraulichen Informationen verwendest Du sichere Verfahren für Anmeldung und Verschlüsselung.

**Risikomanagement**

> **Definition:** **Risikomanagement** umfasst alle Maßnahmen, mit denen Risiken erkannt, bewertet und beherrscht werden. Bei der Automatisierung geht es vor allem darum, Datenverlust und Systemausfälle zu verhindern oder ihre Folgen gering zu halten.

Häufige Risiken sind:

- **Hardware-Ausfälle:** Defekte Festplatten, Netzwerk- oder Stromausfälle führen zu Datenverlust.
- **Software-Fehler:** Fehler in Skripten oder Anwendungen bringen Systeme zum Absturz.
- **Menschliches Versagen:** Fehler bei Konfiguration oder Bedienung von Automatisierungswerkzeugen.
- **Cyberangriffe:** Angreifer stehlen Daten oder legen Systeme lahm.

Bewertet werden die Risiken nach **Eintrittswahrscheinlichkeit** und **Auswirkungen**. Eine **Risikomatrix** ordnet sie danach ein, sodass die größten Risiken zuerst behandelt werden. Bewährte Maßnahmen zur Risikominimierung sind:

- **Regelmäßige Backups:** an mehreren Orten speichern, lokal und in der Cloud.
- **Redundante Systeme:** Fällt ein Gerät aus, übernimmt ein anderes.
- **Fehlerüberwachung:** Monitoring-Werkzeuge melden Probleme sofort.
- **Sicherheitsupdates:** Software stets aktuell halten, um Lücken zu schließen.
- **Schulung und Dokumentation:** Alle, die Automatisierungswerkzeuge nutzen, sind geschult und haben eine aktuelle Dokumentation.

**Beispiel:** Ein mittelständisches IT-Unternehmen hat seine internen IT-Prozesse weitgehend automatisiert. Es erstellt täglich inkrementelle und wöchentlich vollständige Backups, lokal und in der Cloud. Nagios und Zabbix überwachen die Systeme rund um die Uhr und melden Auffälligkeiten sofort. Server und Netzwerk sind redundant ausgelegt, sodass bei einem Ausfall automatisch ein anderes System übernimmt. Regelmäßige Penetrationstests und Sicherheitsüberprüfungen decken Schwachstellen auf. So hat das Unternehmen die Risiken von Datenverlust und Systemausfällen deutlich gesenkt.

**Sicherheitsmaßnahmen**

| Maßnahme | Umsetzung |
| --- | --- |
| Zugriffsrechte | Benutzerrollen definieren, z. B. mehr Rechte für Administratorinnen und Administratoren als für normale Benutzer. Least-Privilege-Prinzip: jede Person nur mit den Rechten, die sie für ihre Arbeit braucht. Rechte regelmäßig überprüfen und anpassen |
| Sichere Kommunikation | Übertragene Daten verschlüsseln (TLS ist der Standard; das ältere SSL gilt als unsicher). Für Verbindungen über unsichere Netze wie das Internet VPNs nutzen. Starke Anmeldeverfahren wie Zwei-Faktor-Authentifizierung (2FA) einsetzen |
| Sicherheitsupdates und Patches | Werkzeuge und Betriebssysteme regelmäßig aktualisieren, Patchmanagement einführen und per Monitoring prüfen, ob kritische Updates fehlen |
| Datensicherung und Wiederherstellung | Regelmäßige Backups, möglichst auch an einem externen Ort. Wiederherstellung regelmäßig testen. Versionierung nutzen, um auf frühere Stände zurückgreifen zu können |
| Schulung und Sensibilisierung | Regelmäßige Schulungen zu den Sicherheitsanforderungen, Awareness-Kampagnen per E-Mail, Poster oder Workshop und simulierte Angriffe, um die Reaktion des Teams zu üben |

> **Kurz gesagt:** Automatisierung bietet enormes Potenzial, wenn sie sorgfältig geplant wird. Klare Ziele, passende Werkzeuge, gründliche Tests, wirksame Fehlerbehandlung und durchdachte Sicherheit verhindern die häufigsten Fallstricke.

## Automatisierung im Alltag

Automatisierung ist längst nicht nur ein Thema für große Unternehmen oder Fachleute. Auch im Alltag kann sie eine große Erleichterung sein. Die folgenden Beispiele kannst Du selbst umsetzen.

### Automatisierung von Routineaufgaben

**E-Mail-Filter und -Regeln**

Eine der einfachsten und wirksamsten Automatisierungen sind E-Mail-Filter. Ein **Filter** wählt allgemein Elemente anhand festgelegter Kriterien aus oder schließt sie aus. Ein E-Mail-Filter prüft eingehende Nachrichten, z. B. nach Absender, Betreff oder Schlüsselwörtern, und führt dann eine Aktion aus: in einen Ordner verschieben, als gelesen markieren, weiterleiten oder löschen. So verwaltest Du Deine E-Mails effizienter, reduzierst Spam und findest wichtige Nachrichten schneller.

1. **Bedürfnisse ermitteln:** Welche E-Mails sollen automatisch sortiert werden, z. B. Newsletter, Rechnungen oder Benachrichtigungen?
2. **Regeln erstellen:** Im E-Mail-Programm, z. B. Outlook oder Gmail, Regeln anlegen, die E-Mails nach Absender, Betreff oder Schlüsselwörtern in Ordner verschieben.
3. **Testen und anpassen:** Regelmäßig prüfen, ob die Regeln wie gewünscht funktionieren, und sie bei Bedarf anpassen.

**Automatisierte Backups**

> **Definition:** Ein **Backup** ist eine Kopie von Daten, die nach Datenverlust, Beschädigung oder Hardwareausfall eine Wiederherstellung ermöglicht. Backups sind damit eine grundlegende Maßnahme, um persönliche Daten und Geschäftsprozesse zu schützen. Damit sie zuverlässig entstehen, sollten sie automatisch laufen.

| Eigenschaft | Bedeutung |
| --- | --- |
| Regelmäßigkeit | Backups laufen in festen Abständen, damit auch die neuesten Daten gesichert sind |
| Speicherort | Lokal, z. B. auf einer externen Festplatte, oder entfernt, z. B. in der Cloud |
| Vollständigkeit | Ein **Vollbackup** sichert alle Daten. Ein **inkrementelles** Backup sichert nur die Änderungen seit dem letzten Backup, ein **differenzielles** die Änderungen seit dem letzten Vollbackup |
| Wiederherstellbarkeit | Die Daten lassen sich im Bedarfsfall einfach und schnell zurückholen |

| Zweck | Bedeutung |
| --- | --- |
| Datenwiederherstellung | Daten nach Verlust oder Beschädigung zurückholen |
| Katastrophenschutz | Schutz vor größeren Ausfällen wie Naturkatastrophen oder Cyberangriffen |
| Archivierung | Wichtige Daten langfristig aufbewahren |

Wie nötig die Automatisierung von Backups ist, zeigt eine Umfrage: 16 Prozent der Befragten haben in den letzten zwölf Monaten kein einziges Mal ihre Daten gesichert, ein Viertel nur ein- oder zweimal. Nur rund jede fünfte Person sichert ihre Daten etwa monatlich oder häufiger.

| Sicherheitskopien in den letzten 12 Monaten | Anteil der Befragten |
| --- | --- |
| Habe (bislang) keine wichtigen Daten darauf | 10 % |
| Keinmal | 16 % |
| 1–2 Mal | 25 % |
| 3–4 Mal | 13 % |
| 5–6 Mal | 8 % |
| 7–8 Mal | 5 % |
| 9–10 Mal | 4 % |
| 11–12 Mal | 6 % |
| 13–16 Mal | 1 % |
| 17–20 Mal | 1 % |
| Mehr als 20 Mal | 12 % |

*Frage: „Wie häufig haben Sie innerhalb der letzten 12 Monate eine Sicherheitskopie Ihrer (wichtigen) Daten von Ihrem PC, Notebook oder MacBook gemacht?“ Quelle: [Statista](https://de.statista.com/statistik/daten/studie/1031207/umfrage/umfrage-zum-anlegen-von-sicherungskopien-von-pc-daten-in-deutschland/)*

### Automatisierung von Haushaltsaufgaben

**Smarte Haushaltsgeräte**

Smarte Haushaltsgeräte lassen sich per App steuern und so programmieren, dass sie Aufgaben zu bestimmten Zeiten erledigen.

> **Definition:** Smarte Geräte gehören zum **Internet der Dinge** (Internet of Things, **IoT**): einem Netzwerk aus physischen Geräten, Fahrzeugen, Gebäuden und anderen Objekten, die mit Elektronik, Software, Sensoren und Netzwerkanschluss ausgestattet sind. Dadurch können sie Daten sammeln und austauschen. Das IoT verbindet die physische Welt mit computergestützten Systemen und wird z. B. in Smart Homes, Wearables, der industriellen Automatisierung und in intelligenten Städten eingesetzt.

- **Saugroboter:** reinigen die Wohnung zu festgelegten Zeiten.
- **Intelligente Thermostate:** regeln die Temperatur automatisch und sparen Energie.
- **Smarte Beleuchtung:** Lichtszenen passen sich automatisch dem Tagesablauf an.

Wie verbreitet solche Geräte sind, zeigt eine Umfrage des Internetverbands eco: Jeder zweite Haushalt in Deutschland nutzt bereits mehr als vier Geräte mit Onlinezugang. (Quelle: [eco – Verband der Internetwirtschaft](https://www.eco.de/presse/smart-home-jeder-zweite-haushalt-in-deutschland-nutzt-bereits-mehr-als-vier-geraete-mit-onlinezugang/))

> **Achtung:** Jedes vernetzte Gerät ist ein möglicher Angriffspunkt. Standardpasswörter ändern, Updates einspielen und smarte Geräte möglichst in einem eigenen WLAN (Gastnetz) betreiben.

**Automatisierte Einkaufslisten**

Apps und smarte Kühlschränke können Einkaufslisten automatisch erstellen, indem sie erkennen, wenn Lebensmittel zur Neige gehen.

1. App installieren, die diese Funktion unterstützt, z. B. AnyList oder Out of Milk.
2. Smarten Kühlschrank, falls vorhanden, mit der App verbinden.
3. Funktion nutzen: Die App aktualisiert die Einkaufsliste anhand der erkannten Bestände.

### Automatisierung von Arbeitsaufgaben

**Automatisierte Berichterstellung**

In vielen Berufen gehören regelmäßige Berichte zum Alltag. Sie lassen sich weitgehend automatisieren:

1. **Software auswählen:** Werkzeuge wie Microsoft Power BI oder Tableau analysieren und visualisieren Daten automatisch.
2. **Daten anbinden:** Die Software mit den Datenquellen verbinden, z. B. Excel-Dateien oder Datenbanken.
3. **Vorlagen erstellen:** Berichtsvorlagen entwickeln, die die Software automatisch füllt.
4. **Berichte automatisieren:** Die Software so einrichten, dass sie die Berichte regelmäßig erstellt und versendet.

**Aufgaben mit Makros automatisieren**

Ein **Makro** ist eine festgelegte Folge von Anweisungen, die auf Knopfdruck automatisch abläuft. Programme wie Microsoft Excel, Google Sheets, Textverarbeitungen oder Datenbankprogramme bieten Makros an, um wiederkehrende Aufgaben zu erledigen.

1. **Makro aufzeichnen:** Die Schritte einer wiederkehrenden Aufgabe mit der Aufzeichnungsfunktion festhalten.
2. **Makro bearbeiten:** Das aufgezeichnete Makro bei Bedarf anpassen und verbessern.
3. **Makro ausführen:** Die Aufgabe künftig per Makro erledigen.

> **Achtung:** Makros in Dokumenten aus unbekannten Quellen sind ein häufiger Weg für Schadsoftware. Nur Makros aus vertrauenswürdigen Quellen aktivieren.

Indem Du Routineaufgaben wie E-Mail-Sortierung, Backups, Haushaltsaufgaben und Arbeitsprozesse automatisierst, gewinnst Du Zeit für wichtigere Aufgaben und mehr Komfort im Alltag. Die Beispiele dienen als Leitfaden für Deine eigenen Automatisierungen.

## Übung: Implementierung einer Automatisierungsaufgabe

Diese Übung hilft Dir, die Vorteile der Automatisierung im Alltag zu erkennen und praktisch anzuwenden. Durch die Umsetzung einer Automatisierungsaufgabe kannst Du Zeit sparen und Deine Effizienz steigern.

**Aufgabe:** Wähle eine Automatisierungsaufgabe aus den Beispielen im Abschnitt „Automatisierung im Alltag“ aus.

1. Begründe Deine Auswahl.
2. Führe die angegebenen Schritte durch, um die Automatisierung in Deinem Alltag umzusetzen.

Falls keine der vorgestellten Automatisierungen für Dich möglich ist:

1. Begründe für jede Option, warum sie nicht umsetzbar ist.
2. Überlege Dir eine alternative Automatisierung, die Du in Deinem Alltag umsetzen könntest, und beschreibe die Schritte dazu.

> **Tipp:** Gehe bei Deiner Beschreibung wie im Abschnitt „Planung und Implementierung von Automatisierungsaufgaben“ vor: Was ist das Ziel? Welches Werkzeug nutzt Du? Wie testest Du, ob es funktioniert? Was passiert, wenn die Automatisierung einmal nicht läuft?

## Coding Challenge

**Aufgabe:** Erstelle ein Python-Skript, das als einfache Backup-Anwendung dient. Das Skript soll aus einem definierten Quellverzeichnis alle Dateien in ein Ziel-Backup-Verzeichnis kopieren. Für jede Datei wird der Kopiervorgang (Dateiname und Zeitpunkt) in einer Log-Datei (`log.txt`) protokolliert. Falls beim Kopieren ein Fehler auftritt (z. B. weil eine Datei nicht lesbar ist), soll dieser mithilfe eines `try`-`except`-Blocks abgefangen und ebenfalls im Log festgehalten werden. Stelle außerdem sicher, dass das Zielverzeichnis existiert oder bei Bedarf automatisch erstellt wird.

**Vorgehen:**

1. Quell- und Zielverzeichnis als Standardwerte festlegen und optional per Parameter überschreibbar machen.
2. Zielverzeichnis mit `mkdir(parents=True, exist_ok=True)` anlegen. Existiert es schon, passiert nichts.
3. Eine Funktion `log()` schreiben, die jede Meldung mit Zeitstempel an `log.txt` anhängt.
4. Prüfen, ob das Quellverzeichnis existiert.
5. Alle Dateien des Quellverzeichnisses durchlaufen und jede mit `shutil.copy2()` kopieren, eingeschlossen in `try`-`except`.
6. Erfolg und Fehler je Datei protokollieren, am Ende eine Zusammenfassung schreiben und einen passenden Exit-Code zurückgeben.

<details>
<summary>Musterlösung anzeigen</summary>

**Musterlösung (backup.py):**

```python
#!/usr/bin/env python3
"""Einfache Backup-Anwendung.

Kopiert alle Dateien eines Quellverzeichnisses in ein Backup-Verzeichnis und
protokolliert jeden Kopiervorgang mit Zeitstempel in log.txt.

Aufruf: python backup.py [Quellverzeichnis] [Zielverzeichnis]
"""
import shutil
import sys
from datetime import datetime
from pathlib import Path

QUELLE = Path("C:/Daten/Dokumente")  # Standardwerte, per Parameter änderbar
ZIEL = Path("D:/Backup/Dokumente")


def log(logdatei: Path, nachricht: str) -> None:
    """Schreibt eine Zeile mit Zeitstempel in die Logdatei."""
    zeitstempel = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with logdatei.open("a", encoding="utf-8") as datei:
        datei.write(f"{zeitstempel} {nachricht}\n")


def backup(quelle: Path, ziel: Path) -> int:
    ziel.mkdir(parents=True, exist_ok=True)   # Ziel anlegen, falls nötig
    logdatei = ziel / "log.txt"

    if not quelle.is_dir():
        log(logdatei, f"FEHLER Quellverzeichnis {quelle} existiert nicht")
        print(f"Fehler: Quellverzeichnis {quelle} existiert nicht.",
              file=sys.stderr)
        return 1

    log(logdatei, f"START  Backup von {quelle} nach {ziel}")
    kopiert = fehler = 0

    for datei in sorted(quelle.iterdir()):
        if not datei.is_file():               # Unterordner überspringen
            continue
        try:
            shutil.copy2(datei, ziel / datei.name)
            log(logdatei, f"OK     {datei.name}")
            kopiert += 1
        except OSError as ausnahme:
            log(logdatei, f"FEHLER {datei.name}: {ausnahme}")
            fehler += 1

    log(logdatei, f"ENDE   {kopiert} Dateien kopiert, {fehler} Fehler")
    return 0 if fehler == 0 else 2


if __name__ == "__main__":
    quelle = Path(sys.argv[1]) if len(sys.argv) > 1 else QUELLE
    ziel = Path(sys.argv[2]) if len(sys.argv) > 2 else ZIEL
    sys.exit(backup(quelle, ziel))
```

**Erläuterung der wichtigsten Zeilen:**

| Code | Erklärung |
| --- | --- |
| `from pathlib import Path` | `Path` behandelt Pfade plattformunabhängig, das Skript läuft unter Windows und Linux |
| `ziel.mkdir(parents=True, exist_ok=True)` | Legt das Zielverzeichnis samt fehlender Elternordner an. `exist_ok=True` verhindert einen Fehler, wenn es schon existiert |
| `log()` mit `open("a", encoding="utf-8")` | Hängt jede Meldung an die Logdatei an, statt sie zu überschreiben. UTF-8 sorgt für korrekte Umlaute |
| `quelle.iterdir()` und `is_file()` | Durchläuft alle Einträge des Quellordners und überspringt Unterordner |
| `shutil.copy2()` | Kopiert die Datei samt Zeitstempel der letzten Änderung |
| `try` / `except OSError` | Fängt Fehler beim Kopieren ab, z. B. gesperrte oder nicht lesbare Dateien. Das Backup läuft mit den übrigen Dateien weiter |
| `return 0 if fehler == 0 else 2` | Exit-Code für Aufgabenplanung oder Monitoring: 0 = alles gut, 1 = Quelle fehlt, 2 = einzelne Dateien fehlgeschlagen |

**Beispiel-Log mit einem Fehler:** Im Test war die Datei `tabelle.csv` während des Backups von einem anderen Programm exklusiv geöffnet:

```text
2026-10-05 09:48:22 START  Backup von quelle nach ziel4
2026-10-05 09:48:22 OK     bericht.txt
2026-10-05 09:48:22 OK     notiz.txt
2026-10-05 09:48:22 FEHLER tabelle.csv: [WinError 32] Der Prozess kann nicht auf die
                    Datei zugreifen, da sie von einem anderen Prozess verwendet wird
2026-10-05 09:48:22 ENDE   2 Dateien kopiert, 1 Fehler
```

**Testen:**

| Testfall | Erwartetes Ergebnis |
| --- | --- |
| Normaler Lauf mit drei Dateien | Drei OK-Einträge, Zusammenfassung „3 Dateien kopiert, 0 Fehler“, Exit-Code 0 |
| Zielverzeichnis existiert noch nicht (auch mehrere Ebenen tief) | Verzeichnis wird angelegt, Backup läuft normal |
| Eine Datei ist gesperrt oder nicht lesbar | FEHLER-Eintrag mit Ursache für diese Datei, die übrigen werden kopiert, Exit-Code 2 |
| Quellverzeichnis existiert nicht | Fehlermeldung auf dem Bildschirm und im Log, Exit-Code 1 |
| Quelle enthält Unterordner | Unterordner werden übersprungen |
| Zweiter Lauf direkt nach dem ersten | Dateien werden überschrieben, neue Einträge werden an das Log angehängt |

**Backup automatisch ausführen:**

```bash
# Windows: täglich um 18 Uhr (Aufgabenplanung, Standardpfade)
schtasks /Create /TN "Dokumente-Backup" /SC DAILY /ST 18:00 /TR "python C:\Skripte\backup.py"

# Linux: täglich um 18 Uhr per cron (crontab -e)
0 18 * * * /usr/bin/python3 /opt/skripte/backup.py /home/anna/dokumente /backup/dokumente
```

**Erweiterungen:** Mit `quelle.rglob("*")` statt `iterdir()` lassen sich auch Unterordner sichern, dabei muss die Ordnerstruktur im Ziel nachgebaut werden. Ein Zeitstempel im Zielordner, z. B. `ziel / datetime.now().strftime("%Y-%m-%d")`, bewahrt mehrere Versionen auf. Bei Fehlern kann das Skript eine Benachrichtigung aus dem Abschnitt „Fehlerbehandlung und Monitoring“ verschicken.

</details>
