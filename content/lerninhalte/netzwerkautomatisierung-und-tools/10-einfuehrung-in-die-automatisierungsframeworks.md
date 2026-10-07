---
title: "Einführung in die Automatisierungsframeworks"
description: "Was ein Automatisierungsframework ist, RPA, Selenium, Jenkins und Ansible im Einsatz und im Vergleich, Auswahl des passenden Frameworks in vier Schritten – mit Übung und Lösung."
duration: "40 Minuten"
---

Kapitel 9 hat gezeigt, wie Skripte über APIs mit anderen Systemen sprechen. Für viele wiederkehrende Aufgaben musst Du aber nicht alles selbst programmieren: Automatisierungsframeworks liefern ein fertiges Grundgerüst, in das Du nur noch Deine Aufgaben einträgst. Dieses Kapitel stellt die wichtigsten Arten vor, zeigt drei Frameworks im Einsatz und übt die Auswahl des passenden Frameworks an einem Szenario.

## Was ist ein Automatisierungsframework?

> **Definition:** Ein **Automatisierungsframework** ist ein Grundgerüst aus Werkzeugen, Regeln und wiederverwendbaren Bausteinen, mit dem sich bestimmte Arten von Aufgaben einheitlich automatisieren lassen. Es übernimmt wiederkehrende Arbeit wie Ablaufsteuerung, Protokollierung, Fehlerbehandlung und Berichte. Du beschreibst nur noch, was erledigt werden soll.

Der Unterschied zu einer einfachen Bibliothek: Eine Bibliothek rufst Du aus Deinem eigenen Code auf. Ein Framework gibt den Rahmen vor und ruft Deinen Code an den vorgesehenen Stellen auf, z. B. jeden Testfall oder jeden Schritt einer Pipeline. Automatisierungsframeworks helfen, Prozesse zu optimieren, Fehler zu minimieren und die Effizienz zu steigern.

| Art | Zweck | Beispiele |
| --- | --- | --- |
| **RPA** (Robotic Process Automation) | Software-Roboter bedienen Benutzeroberflächen wie ein Mensch | UiPath, Blue Prism, Power Automate Desktop |
| **Testautomatisierung** | Anwendungen automatisch testen, z. B. Webseiten im Browser | Selenium, Robot Framework, Playwright |
| **CI/CD** | Code bei jeder Änderung automatisch bauen, testen und ausliefern | Jenkins, GitHub Actions, GitLab CI |
| **Konfigurationsmanagement** | Server und Geräte einheitlich einrichten und in einem gewünschten Zustand halten | Ansible, Puppet, Chef |
| **Workflow-Orchestrierung** | Mehrstufige, zeitgesteuerte Abläufe mit Abhängigkeiten planen und überwachen | Apache Airflow |

## Robotic Process Automation (RPA)

RPA-Frameworks automatisieren regelbasierte Geschäftsprozesse, die normalerweise Menschen am Bildschirm erledigen: Daten aus E-Mails in ein Formular übertragen, Rechnungen erfassen, Berichte aus mehreren Programmen zusammenstellen. Sie sind besonders verbreitet im Finanzwesen, im Kundenservice und im Personalwesen. Ihre Stärke: Sie funktionieren auch bei Anwendungen, die keine API anbieten. Ihre Schwäche: Ändert sich die Oberfläche, muss der Roboter angepasst werden.

| Typ | Arbeitsweise | Beispiel |
| --- | --- | --- |
| **Attended RPA** (begleitet) | Der Roboter arbeitet auf dem Arbeitsplatzrechner zusammen mit einer Person und übernimmt Teilschritte. Die Person startet ihn bei Bedarf, z. B. per Klick. | Eine Servicekraft lässt sich während eines Kundengesprächs alle Vertragsdaten aus drei Systemen zusammensuchen. |
| **Unattended RPA** (unbegleitet) | Der Roboter arbeitet völlig selbstständig, meist auf einem Server, zeitgesteuert oder durch ein Ereignis ausgelöst. | Jede Nacht werden eingegangene Rechnungen erfasst und im Buchhaltungssystem verbucht. |

Die großen Anbieter unterstützen meist beide Typen. UiPath ist für beide verbreitet, Blue Prism setzt vor allem auf unbegleitete Roboter. Microsoft Power Automate Desktop ist in Windows 11 bereits enthalten.

> **Tipp:** Bietet eine Anwendung eine API, ist sie fast immer die bessere Wahl als RPA. API-Aufrufe sind schneller, stabiler und unabhängig von Änderungen an der Oberfläche (siehe Kapitel 9).

## Automatisierungsframeworks in der Praxis

Wie sehen Automatisierungsframeworks im Einsatz aus? Die folgenden drei Beispiele decken drei typische Einsatzbereiche ab: Webanwendungen testen, Software kontinuierlich ausliefern und IT-Infrastruktur konfigurieren.

### Selenium: Webanwendungen automatisieren

**Selenium** ist ein Open-Source-Framework, das einen Webbrowser fernsteuert. Es wird hauptsächlich zum Testen von Webanwendungen eingesetzt, eignet sich aber auch für wiederkehrende Abläufe in Weboberflächen. Selenium unterstützt alle gängigen Browser und Programmiersprachen wie Java, C#, Python, JavaScript und Ruby und ist dadurch sehr flexibel.

1. **Testfälle definieren:** Festlegen, welche Funktionen geprüft werden, z. B. „Anmeldung mit gültigen Daten führt zur Startseite“.
2. **Skripte erstellen:** Die Testfälle in einer unterstützten Programmiersprache umsetzen.
3. **Tests ausführen:** Die Skripte in verschiedenen Browsern und Umgebungen laufen lassen, oft automatisch in einer CI-Pipeline.
4. **Ergebnisse analysieren:** Fehlgeschlagene Tests auswerten und die gefundenen Fehler beheben.

**Beispiel: Anmeldeformular mit Python und Selenium testen**

```python
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By

URL = Path("login.html").resolve().as_uri()   # sonst: URL der Testumgebung

optionen = webdriver.EdgeOptions()
optionen.add_argument("--headless=new")       # ohne sichtbares Fenster
browser = webdriver.Edge(options=optionen)
try:
    browser.get(URL)
    browser.find_element(By.ID, "benutzer").send_keys("test")
    browser.find_element(By.ID, "passwort").send_keys("test123")
    browser.find_element(By.ID, "anmelden").click()
    meldung = browser.find_element(By.ID, "meldung").text
    assert meldung == "Willkommen, test", f"Unerwartet: {meldung}"
    print("Test bestanden:", meldung)
finally:
    browser.quit()                            # Browser immer schließen

# Ausgabe: Test bestanden: Willkommen, test
```

`find_element(By.ID, ...)` sucht ein Element der Seite über seine ID, `send_keys` tippt Text ein, `click` klickt. Die `assert`-Anweisung prüft, ob das erwartete Ergebnis erscheint. `--headless=new` lässt den Browser ohne sichtbares Fenster laufen, z. B. auf einem Server. Den passenden Browsertreiber lädt Selenium seit Version 4.6 automatisch herunter.

### Jenkins: Continuous Integration und Continuous Deployment

**Jenkins** ist ein Open-Source-Automatisierungsserver für **Continuous Integration** (CI) und **Continuous Delivery/Deployment** (CD). Er baut und testet Software bei jeder Änderung automatisch und verbessert so Qualität und Geschwindigkeit der Entwicklung. Kapitel 6 hat Jenkins bereits im Skriptmanagement vorgestellt.

1. **Repository überwachen:** Jenkins bemerkt neue Commits, entweder durch regelmäßiges Abfragen oder durch eine Benachrichtigung (Webhook) von GitHub oder GitLab.
2. **Build ausführen:** Bei einer Änderung startet ein Build-Job, der den Code holt und vorbereitet.
3. **Tests ausführen:** Automatisierte Tests prüfen die Änderung.
4. **Bereitstellen:** Erfolgreiche Builds werden ausgeliefert. Bei Continuous Delivery gibt eine Person die Produktion frei, bei Continuous Deployment geschieht auch das automatisch.

**Beispiel: Pipeline als Datei im Repository (Jenkinsfile)**

```groovy
pipeline {
    agent any
    stages {
        stage('Prüfen') {
            steps { sh 'shellcheck skripte/*.sh' }
        }
        stage('Testen') {
            steps { sh 'python -m unittest discover tests' }
        }
        stage('Ausliefern') {
            when { branch 'main' }
            steps { sh 'ansible-playbook -i inventory.ini skripte_verteilen.yml' }
        }
    }
}
```

Die Pipeline prüft die Shell-Skripte, führt die Tests aus und verteilt die Skripte nur dann, wenn die Änderung im Haupt-Branch `main` liegt. Schlägt eine Stufe fehl, bricht Jenkins ab und meldet den Fehler.

> **Hinweis:** Die Bedingung `when { branch 'main' }` wirkt in einer Multibranch-Pipeline, in der Jenkins für jeden Branch des Repositorys einen eigenen Lauf startet.

### Ansible: IT-Infrastruktur automatisieren

**Ansible** ist ein agentenloses Framework für Konfigurationsmanagement: Auf den Zielsystemen muss keine zusätzliche Software laufen, Ansible verbindet sich mit Linux-Servern per SSH und mit Windows-Servern per WinRM oder SSH. Es konfiguriert, verwaltet und versorgt Server und Anwendungen. Die Aufgaben stehen in **Playbooks** im einfachen Datenformat YAML. Sie beschreiben überwiegend den gewünschten Zustand (deklarativ), nicht die einzelnen Befehle.

1. **Playbook erstellen:** Die gewünschten Konfigurationsschritte beschreiben (Beispiel siehe Kapitel 6, „Werkzeuge zur Automatisierung“).
2. **Inventar festlegen:** Die Server, auf die das Playbook angewendet wird, in Gruppen eintragen.
3. **Playbook ausführen:** Mit `--check` zuerst einen Probelauf ohne Änderungen machen, dann die Server konfigurieren.
4. **Überwachen:** Das Playbook regelmäßig erneut laufen lassen. Weil Ansible idempotent arbeitet, korrigiert es nur Abweichungen.

**Beispiel: Inventar und Aufruf**

```ini
# inventory.ini
[linux_server]
web01.firma.local
web02.firma.local
db01.firma.local  ansible_user=admin
```

```bash
# Probelauf: zeigt, was sich ändern würde, ohne etwas zu ändern
ansible-playbook -i inventory.ini skripte_verteilen.yml --check --diff

# echter Lauf
ansible-playbook -i inventory.ini skripte_verteilen.yml
```

### Die Frameworks im Vergleich

|  | Selenium | Jenkins | Ansible |
| --- | --- | --- | --- |
| **Aufgabe** | Browser fernsteuern, Webanwendungen testen | Bauen, testen, ausliefern bei jeder Änderung | Server konfigurieren und einheitlich halten |
| **Beschreibung der Aufgaben** | Programmcode (Python, Java, C# u. a.) | Jenkinsfile (Groovy-basierte Syntax) | Playbooks in YAML |
| **Ausgelöst durch** | Testlauf, oft aus einer CI-Pipeline | Commit, Zeitplan oder manuellen Start | Aufruf von Hand, Zeitplan oder CI-Pipeline |
| **Lizenz** | Open Source | Open Source | Open Source, kommerzielle Plattform als Erweiterung |

Die Frameworks ergänzen sich: Jenkins kann bei jeder Änderung die Selenium-Tests starten und anschließend mit Ansible ausliefern. Von Webtests über CI/CD bis zur Infrastruktur zeigen die Beispiele, wie vielfältig Automatisierungsframeworks sind. Richtig eingesetzt steigern sie die Effizienz, verringern Fehler und erhöhen so die Wettbewerbsfähigkeit.

## Übung: Das richtige Automatisierungsframework finden

Die Auswahl des passenden Frameworks ist gerade am Anfang eine Herausforderung. Die folgende Anleitung führt Dich in vier Schritten zur Entscheidung. Am besten arbeitest Du sie parallel an einem eigenen Beispiel durch. Hast Du keines, nutze das folgende Szenario. Einen Lösungsvorschlag findest Du am Ende der Übung.

> **Hinweis:** **Szenario:** Du erstellst täglich Berichte, die Daten aus mehreren Quellen zusammenführen: aus einer SQL-Datenbank, aus CSV-Dateien und aus einer REST-API. Die Berichte müssen jeden Morgen um 9 Uhr in einem festen Format an mehrere Abteilungen gehen. Bisher geschieht alles von Hand: Daten exportieren, in einer Excel-Datei zusammenführen, per E-Mail versenden. Du möchtest den Ablauf automatisieren, um Zeit zu sparen und Fehler zu vermeiden.

### Schritt 1: Anforderungen definieren

Ein häufiger Fehler ist, die eigenen Anforderungen nicht gründlich genug zu klären. Beantworte zuerst diese Fragen:

- Welche Prozesse sollen automatisiert werden? Einfache, wiederkehrende Einzelaufgaben oder komplexe, mehrstufige Abläufe?
- Welche Technologien nutzt Du bereits? Programmiersprachen, Betriebssysteme und Werkzeuge. Das Framework muss dazu passen.
- Wie hoch ist das Budget? Viele Frameworks sind Open Source und kostenlos, andere kostenpflichtig mit zusätzlichen Funktionen und Support.
- Wie groß ist das Team, und was kann es? Kann es ein komplexes Framework betreiben, oder braucht es eine besonders einfache Lösung?

### Schritt 2: Frameworks anhand von Kriterien bewerten

| Kriterium | Leitfrage |
| --- | --- |
| **Kompatibilität** | Passt das Framework zu Deinen Programmiersprachen, Systemen und Werkzeugen? Wer in Python arbeitet, ist z. B. mit Selenium, Robot Framework oder Apache Airflow gut bedient. |
| **Benutzerfreundlichkeit** | Ist es einfach zu installieren, zu konfigurieren und zu bedienen? Gibt es eine gute Dokumentation? |
| **Skalierbarkeit** | Wächst es mit, wenn aus einem kleinen Projekt ein großes wird, mit mehr Daten und komplexeren Abläufen? |
| **Unterstützung und Community** | Gibt es eine aktive Community oder professionellen Support, der bei Problemen hilft? |
| **Kosten** | Was kosten Anschaffung, Betrieb, Wartung und Support, auch der eigene Aufwand für Einarbeitung? |
| **Flexibilität** | Lässt es sich an veränderte Anforderungen anpassen und für verschiedene Aufgaben nutzen? |
| **Sicherheit** | Wie werden Zugangsdaten gespeichert? Gibt es Rollen und Rechte? Wird das Framework regelmäßig mit Sicherheitsupdates versorgt? |

Mehrere Kandidaten vergleichst Du am besten mit einer Nutzwertanalyse: Kriterien gewichten, jedes Framework bewerten, gewichtete Punkte addieren. Das Vorgehen kennst Du aus Kapitel 3.

### Schritt 3: Pilotphase durchführen

Teste ein oder zwei Favoriten in einer kontrollierten Umgebung an einer echten, aber unkritischen Aufgabe, bevor Du Dich festlegst. Achte dabei auf:

- **Leistungsfähigkeit:** Erfüllt das Framework Deine Anforderungen in der Praxis?
- **Akzeptanz im Team:** Kommen die Personen, die damit arbeiten sollen, gut zurecht?
- **Integration:** Wie gut fügt es sich in die bestehende Infrastruktur ein, z. B. Anmeldung, Netzwerk, Monitoring?

### Schritt 4: Langfristig überwachen und anpassen

Mit der Einführung endet der Prozess nicht. Überwache, ob das Framework seine Aufgaben zuverlässig erfüllt, und passe die Automatisierung an, wenn sich Anforderungen ändern. Regelmäßige Reviews und Rückmeldungen aus dem Team zeigen, ob das Framework noch passt.

<details>
<summary>Lösungsvorschlag anzeigen</summary>

**Schritt 1: Anforderungen**

| Frage | Antwort im Szenario |
| --- | --- |
| Prozesse | Daten aus Datenbank, CSV-Dateien und API abrufen, zusammenführen, als Excel-Bericht speichern, per E-Mail versenden. Jeden Werktag, rechtzeitig vor 9 Uhr. |
| Technologien | SQL-Datenbank, CSV-Dateien, REST-API, Excel, E-Mail. Es gibt bereits einzelne Python-Skripte. |
| Budget | Open Source bevorzugt, Geld für kostenpflichtige Werkzeuge wäre vorhanden. |
| Team | Kleines Team mit Grundkenntnissen in Python und Excel. |

**Schritt 2: Bewertung**

Der Ablauf ist ein typischer **ETL-Prozess** (Extract, Transform, Load): Daten aus Quellen holen, umwandeln und zusammenführen, Ergebnis ablegen und verteilen. Dafür kommen diese Kandidaten in Frage:

| Kandidat | Bewertung |
| --- | --- |
| **Python-Skript mit Aufgabenplanung** | Bibliotheken wie pandas und openpyxl lesen SQL, CSV und JSON und schreiben Excel-Dateien, `smtplib` versendet E-Mails. Gestartet wird das Skript per cron oder Windows-Aufgabenplanung. Einfach, kostenlos, passt zu den Python-Kenntnissen des Teams. Schwächen: Überwachung, Wiederholung bei Fehlern und Übersicht muss das Team selbst bauen. |
| **Apache Airflow** | Open-Source-Plattform zur Workflow-Orchestrierung. Abläufe werden in Python als **DAG** (Directed Acyclic Graph, gerichteter azyklischer Graph) beschrieben: Schritte mit Abhängigkeiten, die keine Kreise bilden. Bietet Zeitplanung, automatische Wiederholungen, Benachrichtigung bei Fehlern, eine Weboberfläche mit Rollen und Rechten sowie verschlüsselt gespeicherte Verbindungsdaten. Skaliert sehr gut. Kostenlos, aber Betrieb und Einarbeitung kosten Aufwand. Kommerzieller Support über Drittanbieter und Cloud-Dienste. |
| **Robot Framework** | Open-Source-Framework mit leicht lesbarer, stichwortbasierter Syntax, gute Dokumentation, große Community. Ursprünglich für Tests, mit Zusatzbibliotheken auch für RPA nutzbar. Für reine Datenverarbeitung weniger naheliegend als Python oder Airflow. |
| **Selenium** | Nur nötig, wenn eine der Quellen ausschließlich über eine Weboberfläche erreichbar ist. Datenbank, CSV-Dateien und API lassen sich ohne Browser direkter und stabiler abfragen. |

**Schritt 3: Pilotphase**

- **Ausgewählt:** Python-Skript mit Aufgabenplanung als einfache Lösung und Apache Airflow als ausbaufähige Lösung.
- **Leistungsfähigkeit:** Den kompletten Ablauf mit echten Daten testen, vom Abruf bis zum Versand an eine Testadresse.
- **Akzeptanz:** Das Team baut den Ablauf in beiden Varianten nach und gibt Rückmeldung zu Aufwand und Verständlichkeit.
- **Integration:** Prüfen, ob Datenbankzugriff, API-Token und E-Mail-Versand sicher eingebunden werden können, z. B. mit Zugangsdaten aus einem Passwort-Tresor.

**So könnte der Ablauf in Airflow aussehen:**

```text
Zeitplan: werktags 8:30 Uhr  (Cron-Ausdruck: 30 8 * * 1-5)

  db_abruf  ──┐
  csv_abruf ──┼──► zusammenfuehren ──► excel_erstellen ──► mail_senden
  api_abruf ──┘
```

Die drei Abrufe laufen parallel. Erst wenn alle erfolgreich waren, folgen die weiteren Schritte. Schlägt ein Abruf fehl, wiederholt Airflow ihn und benachrichtigt bei dauerhaftem Fehler das Team, bevor ein unvollständiger Bericht verschickt wird.

**Schritt 4: Überwachung und Anpassung**

- Jeden Lauf protokollieren und bei Fehlern sofort benachrichtigen.
- Laufzeit beobachten, damit der Bericht auch bei wachsenden Datenmengen pünktlich fertig ist.
- In regelmäßigen Reviews mit den Abteilungen prüfen, ob Inhalt und Format noch passen, und den Ablauf anpassen.

**Fazit der Lösung:** Für den Einstieg reicht oft ein gut geschriebenes Python-Skript mit Aufgabenplanung. Kommen weitere Berichte und Abhängigkeiten hinzu oder sind Überwachung und automatische Wiederholung wichtig, lohnt sich ein Orchestrierungs-Framework wie Apache Airflow.

</details>

## Fazit zu Modul 5

APIs und Automatisierungsframeworks erweitern, was Skripte leisten können. Über APIs sprechen Skripte direkt mit Cloud-Diensten, Ticketsystemen und Anwendungen, statt Oberflächen zu bedienen. Frameworks nehmen wiederkehrende Arbeit wie Ablaufsteuerung, Protokollierung und Fehlerbehandlung ab. Welches Framework passt, hängt von den eigenen Anforderungen ab, nicht von seiner Bekanntheit.

> **Kurz gesagt:**
>
> - Ein Framework gibt den Rahmen vor und ruft Deinen Code auf; eine Bibliothek rufst Du selbst auf.
> - RPA bedient Oberflächen und hilft, wo es keine API gibt; mit API ist die API fast immer die bessere Wahl.
> - Selenium testet Webanwendungen, Jenkins baut, testet und liefert aus, Ansible konfiguriert Server – und sie ergänzen sich.
> - Die Auswahl folgt vier Schritten: Anforderungen definieren, Kriterien bewerten, Pilotphase, langfristig überwachen.
