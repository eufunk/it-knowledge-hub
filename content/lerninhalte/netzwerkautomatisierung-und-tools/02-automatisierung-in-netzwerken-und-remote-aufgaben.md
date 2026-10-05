---
title: "Automatisierung in Netzwerken und bei Remote-Aufgaben"
description: "Netzwerkautomatisierung mit SDN, NFV, KI und Frameworks wie Ansible, Sicherheit automatisierter Netzwerke, Remote-Automatisierung mit SSH und PowerShell sowie Erfolgsfaktoren und Fallstricke."
duration: "45 Minuten"
---

Kapitel 1 hat die Automatisierung auf einzelnen Rechnern behandelt. In Unternehmen sind Router, Switches, Firewalls und Server aber über viele Standorte verteilt, und Administratorinnen und Administratoren arbeiten oft nicht vor Ort. Dieses Kapitel zeigt, wie Netzwerke automatisiert werden, welche Technologien dafür eingesetzt werden, wie man automatisierte Netzwerke absichert und wie Aufgaben auf entfernten Systemen automatisiert werden. Praxisbeispiele, Erfolgsfaktoren und typische Fallstricke sowie eine Übung schließen das Kapitel ab.

## Einführung in die Netzwerkautomatisierung

> **Definition:** **Netzwerkautomatisierung** ist der Einsatz von Software und Technologien, um Konfiguration, Verwaltung, Überwachung und Wartung von Netzwerkgeräten und -diensten zu automatisieren. Ziel ist es, Netzwerkprozesse effizienter, einheitlicher und schneller zu machen und menschliche Fehler zu verringern.

| Grundprinzip | Bedeutung |
| --- | --- |
| Automatisierung von Routineaufgaben | Wiederkehrende Aufgaben wie das Einrichten von Geräten, das Aktualisieren von Konfigurationen oder das Überwachen der Netzwerkleistung übernehmen Skripte und Automatisierungswerkzeuge |
| Zentrale Steuerung | Eine zentrale Plattform oder ein Controller verwaltet die Netzwerkressourcen. Das sorgt für eine einheitliche, konsistente Verwaltung |
| Programmierung und Skripting | Mit Programmiersprachen wie Python oder Werkzeugen wie Ansible und Puppet werden Konfigurationen und Abläufe als Code beschrieben |

Früher wurde jedes Netzwerkgerät einzeln über seine Kommandozeile konfiguriert. Bei hundert Switches bedeutet eine Änderung hundert Anmeldungen und hundert Gelegenheiten für Tippfehler. Netzwerkautomatisierung beschreibt die gewünschte Konfiguration **einmal** und verteilt sie auf alle Geräte.

## Technologien zur Netzwerkautomatisierung

Mehrere Technologien machen Netzwerke heute effizienter, flexibler und sicherer. Die wichtigsten werden im Folgenden vorgestellt.

### Software-Defined Networking (SDN)

**Software-Defined Networking** ist eine Architektur, mit der Netzwerke zentral gesteuert und verwaltet werden. In klassischen Netzwerken entscheidet jedes Gerät selbst, wohin es Daten weiterleitet: Steuerungsebene (Control Plane) und Datenebene (Data Plane) sind im selben Gerät eng verbunden. SDN trennt die beiden Ebenen. Ein zentraler **Controller** trifft die Entscheidungen, die Geräte leiten die Daten nur noch weiter.

| Ebene | Aufgabe | Bei SDN |
| --- | --- | --- |
| Steuerungsebene (Control Plane) | Entscheidet, auf welchem Weg Daten fließen | Zentral im SDN-Controller |
| Datenebene (Data Plane) | Leitet die Datenpakete tatsächlich weiter | In den einzelnen Switches und Routern |

- **Zentrale Steuerung:** Das gesamte Netzwerk wird von einem Punkt aus verwaltet. Konfiguration und Management werden deutlich einfacher.
- **Flexibilität:** Netzwerke lassen sich dynamisch an neue Anforderungen anpassen, neue Dienste schnell einführen.
- **Kosteneffizienz:** Standardisierte Hardware verringert die Abhängigkeit von teurer, herstellerspezifischer Netzwerktechnik.

### Network Function Virtualization (NFV)

**Network Function Virtualization** führt Netzwerkfunktionen wie Firewalls, Load Balancer und Router als Software auf Standard-Servern aus. Statt für jede Funktion ein eigenes Spezialgerät zu kaufen, laufen sie als virtuelle Maschinen oder Container.

- **Flexibilität und Skalierbarkeit:** Netzwerkfunktionen lassen sich schnell vergrößern oder an neue Anforderungen anpassen.
- **Kosteneinsparungen:** Standard-Hardware ist günstiger als spezialisierte Netzwerkgeräte.
- **Schnellere Bereitstellung:** Neue Netzwerkdienste sind in Minuten verfügbar, weil keine Hardware installiert werden muss.

> **Merke:** SDN und NFV ergänzen sich. SDN trennt die **Steuerung** von den Geräten, NFV trennt die **Netzwerkfunktion** von der Hardware. Beides macht das Netzwerk per Software steuerbar und damit automatisierbar.

### Künstliche Intelligenz (KI) und maschinelles Lernen (ML)

KI und maschinelles Lernen analysieren große Mengen an Netzwerkdaten und erkennen Muster, die für Optimierung und Fehlerbehebung genutzt werden:

- **Anomalieerkennung:** Ungewöhnliche Muster im Netzwerkverkehr deuten auf Angriffe oder Leistungsprobleme hin.
- **Automatisierte Fehlerbehebung:** Modelle lernen aus vergangenen Störungen und schlagen Lösungen vor oder setzen sie um.
- **Optimierung des Netzwerkverkehrs:** Der Verkehr wird in Echtzeit analysiert und gesteuert, um Engpässe zu vermeiden.

### Automatisierungsframeworks

> **Definition:** **Automatisierungsframeworks** sind Softwarelösungen, die eine strukturierte Umgebung bieten, um Automatisierungsprozesse zu definieren, zu verwalten und auszuführen. Sie bestehen aus Skripten bzw. Beschreibungsdateien, Schnittstellen (APIs) und Werkzeugen zur Überwachung und Verwaltung.

Ihre Kernfunktionen sind:

- **Konfigurationsmanagement:** Netzwerkgeräte zentral konfigurieren und verwalten.
- **Orchestrierung:** Komplexe Abläufe koordinieren, sodass alle Schritte in der richtigen Reihenfolge ausgeführt werden.
- **Skalierbarkeit:** Auch große, wachsende Netzwerke bleiben beherrschbar.

| Vorteil | Erläuterung |
| --- | --- |
| Konsistenz und Fehlerreduktion | Einmal erstellte Abläufe werden immer gleich ausgeführt und liefern einheitliche Ergebnisse |
| Zeitersparnis | Aufgaben, die von Hand Stunden dauern, sind in einem Bruchteil der Zeit erledigt |
| Skalierbarkeit | Wachsende Netzwerke lassen sich verwalten, ohne dass der Aufwand im gleichen Maß steigt |
| Sicherheit | Sicherheitsrichtlinien werden automatisch umgesetzt und überwacht |

| Framework | Merkmale |
| --- | --- |
| Ansible | Open Source, einfach und flexibel. Beschreibt Aufgaben in YAML-Playbooks und braucht auf den Zielsystemen keinen eigenen Agenten, sondern verbindet sich per SSH. Besonders verbreitet für Netzwerkgeräte |
| Puppet | Open Source, vor allem für Konfigurationsmanagement. Beschreibt den gewünschten Zielzustand in einer deklarativen Sprache und stellt sicher, dass er erhalten bleibt |
| Chef | Ähnlich wie Puppet, nutzt aber eine prozedurale, auf Ruby basierende Sprache. Sehr flexibel für komplexe Aufgaben |
| SaltStack (Salt) | Für Konfigurationsmanagement und Orchestrierung, bekannt für hohe Geschwindigkeit und Skalierbarkeit |

**Beispiel: NTP-Server auf allen Routern setzen (Ansible)**

```yaml
- name: NTP-Server auf allen Routern setzen
  hosts: router
  gather_facts: false
  connection: ansible.netcommon.network_cli
  tasks:
    - name: Konfiguration vorher sichern
      cisco.ios.ios_config:
        backup: true

    - name: NTP-Server eintragen
      cisco.ios.ios_config:
        lines:
          - ntp server 10.0.0.10
          - ntp server 10.0.0.11
        save_when: modified
```

Das Playbook sichert zuerst die bestehende Konfiguration jedes Routers aus der Gruppe `router` und trägt dann die beiden Zeitserver ein. Ansible ändert nur Geräte, auf denen die Zeilen noch fehlen, und speichert die Konfiguration nur bei einer Änderung. Ein zweiter Lauf ändert nichts mehr. Gestartet wird es mit `ansible-playbook -i inventar.ini ntp.yml`, ein Probelauf mit der zusätzlichen Option `--check`.

> **Hinweis:** Dass ein zweiter Lauf nichts mehr ändert, nennt man **Idempotenz**. Sie ist eine Kerneigenschaft guter Automatisierung: Ein Playbook beschreibt den gewünschten Zustand und darf beliebig oft laufen, ohne Schaden anzurichten.

**Beispiel: Automatisierung bei Google** – Google betreibt eines der größten Netzwerke der Welt, das seine Rechenzentren auf allen Kontinenten verbindet. Für die Verbindungen zwischen den Rechenzentren setzt Google auf ein selbst entwickeltes Weitverkehrsnetz auf SDN-Basis (**B4**). Ein zentrales System überwacht den Datenverkehr laufend und verteilt ihn automatisch auf die verfügbaren Leitungen (Traffic Engineering). Dadurch werden die Leitungen deutlich besser ausgelastet, die Leistung steigt und die Betriebskosten sinken.

> **Kurz gesagt:** Die Technologien der Netzwerkautomatisierung ergänzen sich: SDN bringt zentrale Steuerung und Flexibilität, NFV spart Hardware, KI und ML optimieren den Betrieb, und Automatisierungsframeworks setzen alles praktisch um.

## Sicherheit in der Netzwerkautomatisierung

Mit der Automatisierung von Netzwerken steigen auch die Anforderungen an die Sicherheit. Ein zentraler Controller oder ein Automatisierungsserver, der alle Geräte konfigurieren darf, ist ein besonders lohnendes Ziel für Angreifer. Vier Bausteine sind grundlegend.

| Baustein | Bedeutung | Beispiel |
| --- | --- | --- |
| Zugriffskontrolle und Authentifizierung | **Zugriffskontrolle** stellt sicher, dass nur berechtigte Personen und Systeme auf Netzwerkressourcen zugreifen. **Authentifizierung** überprüft die Identität einer Person oder eines Systems | Mehr-Faktor-Authentifizierung (MFA) verlangt neben dem Passwort einen zweiten Faktor |
| Datenintegrität und Verschlüsselung | **Datenintegrität** bedeutet, dass Daten bei Übertragung und Speicherung unverändert und unbeschädigt bleiben. **Verschlüsselung** macht Daten für Unbefugte unlesbar | TLS verschlüsselt Daten bei der Übertragung, sodass sie weder mitgelesen noch unbemerkt verändert werden können |
| Netzwerksegmentierung | Das Netzwerk wird in kleinere, voneinander getrennte Bereiche aufgeteilt, z. B. mit VLANs und Firewall-Regeln. Ein Sicherheitsvorfall bleibt auf ein Segment begrenzt | Getrennte Zonen für Produktion, Büro, Gäste und Geräteverwaltung |
| Überwachung und Protokollierung | **Überwachung** beobachtet die Netzwerkaktivitäten laufend, um ungewöhnliches Verhalten zu erkennen. **Protokollierung** zeichnet sie für die spätere Analyse auf | Ein IDS erkennt und meldet verdächtige Aktivitäten |

**Zur Mehr-Faktor-Authentifizierung:** Am sichersten sind Authenticator-Apps oder Hardware-Sicherheitsschlüssel. SMS-Codes sind besser als nur ein Passwort, gelten aber als schwächste Variante, weil SMS umgeleitet oder abgefangen werden können.

**Zur Verschlüsselung:** Für die Verwaltung von Netzwerkgeräten ersetzt **SSH** das unverschlüsselte Telnet, für Web-Schnittstellen **HTTPS** das unverschlüsselte HTTP.

**Zur Segmentierung:** Gäste erreichen nur das Internet, und auf die Verwaltungsschnittstellen der Netzwerkgeräte kann nur das Verwaltungsnetz zugreifen.

**Zur Überwachung:** Ein **Intrusion-Detection-System (IDS)** erkennt verdächtige Aktivitäten und meldet sie. Ein **Intrusion-Prevention-System (IPS)** blockiert sie zusätzlich automatisch. Alle sicherheitsrelevanten Ereignisse werden zentral protokolliert, damit sich ein Vorfall später genau nachvollziehen lässt.

### Schutzmaßnahmen zur Sicherung der Netzwerkautomatisierung

Netzwerke sind ständig Ziel von Angriffen wie Schadsoftware, Ransomware, Phishing und **DDoS-Angriffen**, die Dienste durch eine Flut von Anfragen lahmlegen. Automatisierte Netzwerke ohne angemessenen Schutz können leicht übernommen werden. Die Folgen sind Datenverlust, finanzielle Schäden und ein beschädigter Ruf. Wie groß das Problem ist, zeigen zwei Zahlen:

- Laut Hochrechnungen sind zuletzt **über 20 Millionen Menschen** in Deutschland Opfer von Cyberangriffen geworden. Der Schwerpunkt lag auf Vermögens- und Fälschungsdelikten, der überwiegende Teil davon waren Betrugsdelikte.
- Durch Datendiebstahl, Spionage und Sabotage entstand deutschen Unternehmen im Jahr 2023 laut Hochrechnung des Digitalverbands Bitkom ein Gesamtschaden von rund **206 Milliarden Euro**.

| Schutzmaßnahme | Vorgehen |
| --- | --- |
| Sicherheitsrichtlinien einführen | 1. Die wichtigsten Sicherheitsanforderungen des Netzwerks ermitteln. 2. Detaillierte Richtlinien erstellen, z. B. für Sicherheitsvorfälle, Benutzerzugriffe und die Konfiguration von Netzwerkgeräten. 3. Alle Mitarbeitenden regelmäßig schulen |
| Regelmäßige Sicherheitsüberprüfungen und Audits | 1. Überprüfungen fest einplanen, z. B. vierteljährlich. 2. Automatisierte Werkzeuge zur Schwachstellenanalyse nutzen und durch manuelle Tests ergänzen. 3. Alle Schwachstellen dokumentieren und einen Plan zu ihrer Behebung erstellen |
| Sicherheitslösungen einsetzen | 1. Geeignete Lösungen wie Firewalls, Anti-Malware-Software und Netzwerksicherheitsplattformen passend zu den Anforderungen auswählen. 2. Nach bewährten Vorgaben konfigurieren. 3. Regelmäßig aktualisieren, um gegen neue Bedrohungen geschützt zu sein |

Klare Richtlinien, regelmäßige Prüfungen und passende Sicherheitslösungen schützen das Netzwerk und sorgen dafür, dass die Automatisierung zuverlässig funktioniert.

## Einführung in die Remote-Automatisierung

Homeoffice, verteilte Teams und Server in Rechenzentren oder in der Cloud machen die Remote-Automatisierung zu einem zentralen Thema der IT.

> **Definition:** **Remote-Automatisierung** bezeichnet den Einsatz von Software und Technologien, um Aufgaben auf Computern und Systemen auszuführen, die sich nicht vor Ort befinden. Administratorinnen und Administratoren verwalten, überwachen und warten entfernte Geräte so zentral, ohne sich an jedem einzeln anmelden zu müssen.

| Protokoll | Einsatz | Rolle in der Automatisierung |
| --- | --- | --- |
| RDP (Remote Desktop Protocol) | Grafischer Fernzugriff auf Windows-Systeme | Für die interaktive Bedienung; für Skripte ungeeignet |
| SSH (Secure Shell) | Verschlüsselter Zugriff auf die Kommandozeile, vor allem von Linux, Unix und Netzwerkgeräten, inzwischen auch Windows | Grundlage für Bash-Skripte, Ansible und viele Netzwerk-Werkzeuge |
| WinRM / PowerShell-Remoting | Befehle und Skripte auf entfernten Windows-Systemen ausführen | Standard für die Automatisierung von Windows-Servern, z. B. mit `Invoke-Command` |

### Methoden der Remote-Automatisierung

| Methode | Werkzeuge | Einsatz |
| --- | --- | --- |
| Skripting | PowerShell, Bash | PowerShell automatisiert vor allem Windows-Systeme, Bash vor allem Linux- und Unix-Server. Beide eignen sich für Routineaufgaben auf vielen Systemen |
| Konfigurationsmanagement | Ansible, Puppet | Ansible beschreibt Aufgaben in YAML und eignet sich für Konfiguration, Softwareverteilung und Orchestrierung. Puppet verwaltet Infrastruktur als Code, besonders in großen Umgebungen |
| Orchestrierung | Kubernetes, Docker Swarm | Kubernetes automatisiert Bereitstellung, Skalierung und Verwaltung containerisierter Anwendungen. Docker Swarm verwaltet Container-Cluster direkt mit Docker, z. B. für Microservices |

**Beispiel: Mehrere Linux-Server per SSH prüfen (Bash)**

```bash
#!/bin/bash
# Prüft auf allen Servern der Liste den freien Speicher und die Laufzeit.
set -uo pipefail

while read -r server; do
    [[ -z "$server" || "$server" == \#* ]] && continue  # Leerzeilen, Kommentare
    if ergebnis=$(ssh -o BatchMode=yes -o ConnectTimeout=5 \
                      "admin@$server" 'df -h / | tail -1; uptime -p' 2>&1); then
        echo "== $server"; echo "$ergebnis"
    else
        echo "FEHLER $server: $ergebnis" >&2
    fi
done < server.txt
```

`BatchMode=yes` verhindert, dass das Skript auf eine Passworteingabe wartet: Die Anmeldung erfolgt per SSH-Schlüssel. `ConnectTimeout=5` bricht bei nicht erreichbaren Servern nach fünf Sekunden ab, statt das Skript minutenlang zu blockieren. Fehler landen auf stderr, die übrigen Server werden weiter geprüft.

**Beispiel: Dienst auf mehreren Windows-Servern abfragen (PowerShell)**

```powershell
$server = Get-Content -Path .\server.txt |
    Where-Object { $_ -and $_ -notmatch '^#' }      # ohne Leerzeilen und Kommentare

$ergebnis = Invoke-Command -ComputerName $server -ErrorAction SilentlyContinue `
    -ErrorVariable fehler -ScriptBlock {
        Get-Service -Name Spooler | Select-Object Name, Status
    }

$ergebnis | Select-Object PSComputerName, Name, Status | Format-Table -AutoSize
foreach ($f in $fehler) {
    Write-Warning "$($f.TargetObject): $($f.Exception.Message)"
}
```

`Invoke-Command` führt den Skriptblock auf allen Servern gleichzeitig aus. Die Eigenschaft `PSComputerName` zeigt, von welchem Server ein Ergebnis stammt. Nicht erreichbare Server werden in `$fehler` gesammelt und am Ende gemeldet.

**Beispiel: Automatisierung bei Netflix** – Netflix betreibt seinen weltweiten Streamingdienst fast vollständig automatisiert in der Cloud. Neue Softwareversionen verteilt das Unternehmen mit **Spinnaker**, einem von Netflix entwickelten und als Open Source veröffentlichten Werkzeug für Continuous Delivery. Dadurch gehen Änderungen schneller und zuverlässiger in Betrieb. Bekannt ist Netflix außerdem für **Chaos Engineering**: Das Werkzeug **Chaos Monkey**, ursprünglich Teil des Projekts Simian Army, schaltet im laufenden Betrieb absichtlich zufällige Server ab. So wird geprüft, ob die Systeme Ausfälle verkraften, bevor ein echter Ausfall eintritt.

## Praktische Beispiele der Remote-Automatisierung

| Bereich | Wie Remote-Automatisierung hilft | Beispiel aus der Praxis |
| --- | --- | --- |
| Konfigurationsmanagement | Werkzeuge wie Ansible, Puppet oder Chef verwalten die Konfiguration von Netzwerkgeräten und Servern zentral und verteilen Änderungen automatisch auf alle betroffenen Geräte. Das spart Zeit und vermeidet Fehler durch manuelle Änderungen | Ein international tätiges Unternehmen mit Niederlassungen in mehreren Ländern verwaltet die Konfiguration seiner Router und Switches mit Ansible. Alle Geräte haben stets die aktuelle und sichere Konfiguration, ohne dass ein Techniker vor Ort sein muss |
| Software-Updates und Patching | Regelmäßige Updates und Sicherheits-Patches sind entscheidend für Sicherheit und Stabilität. Mit Remote-Automatisierung werden sie zentral gesteuert und auf alle Geräte verteilt | Ein Finanzinstitut installiert Sicherheits-Patches auf allen Servern und Endgeräten mit Puppet. Die Installation folgt einem festen Zeitplan, der die Zeitzonen der Standorte berücksichtigt, damit Neustarts jeweils außerhalb der Geschäftszeiten erfolgen |
| Fehlerbehebung und Monitoring | Mit Werkzeugen wie Nagios oder Zabbix erkennt die Netzwerkverwaltung Probleme früh und kann automatisch Skripte zur Behebung starten | Ein Telekommunikationsunternehmen überwacht sein Netzwerk mit Zabbix. Ist eine Leitung überlastet, startet automatisch ein Skript, das den Verkehr umleitet und die Last verringert, ohne menschliches Eingreifen |

## Erfolgsfaktoren und Fallstricke bei der Remote-Automatisierung

Remote-Automatisierung macht Aufgaben effizienter und günstiger, unabhängig vom Standort der Mitarbeitenden und Systeme. Um diese Vorteile voll zu nutzen, sollten bewährte Vorgehensweisen beachtet und typische Fallstricke vermieden werden.

### Erfolgsfaktoren der Remote-Automatisierung

| Erfolgsfaktor | Umsetzung |
| --- | --- |
| Klare Ziele | Festlegen, was automatisiert werden soll und warum: mehr Effizienz, geringere Kosten oder weniger Fehler? |
| Schrittweise Einführung | Mit kleinen, überschaubaren Projekten beginnen und dann erweitern. Das senkt das Risiko und erleichtert die Fehlersuche |
| Passende Werkzeuge | Automatisierungssoftware wie Ansible, Puppet oder Chef nach den eigenen Anforderungen auswählen. Cloud-Plattformen wie AWS, Microsoft Azure und Google Cloud bieten zusätzlich eigene Automatisierungsdienste |
| Zugriffskontrollen | Nur berechtigte Personen erhalten Zugriff, abgesichert mit MFA und rollenbasierter Zugriffskontrolle (RBAC) |
| Verschlüsselung | Daten bei der Übertragung (in Bewegung) und bei der Speicherung (im Ruhezustand) verschlüsseln |
| Echtzeit-Monitoring | Automatisierte Abläufe laufend überwachen, z. B. mit Prometheus zur Datenerfassung und Grafana zur Darstellung |
| Automatisierte Fehlerbehebung | Bekannte Fehler automatisch beheben, z. B. einen ausgefallenen Dienst neu starten |

### Fallstricke und wie Du sie vermeidest

| Fallstrick | Gefahr | Lösung |
| --- | --- | --- |
| Unzureichende Dokumentation | Ohne Dokumentation geht der Überblick verloren, und bei Problemen dauert die Ursachensuche lange | Jeden Schritt dokumentieren, zentral z. B. in Confluence oder einem GitHub-Wiki |
| Zu hohe Komplexität | Komplexe Lösungen sind schwer zu warten und erhöhen das Risiko von Fehlern und Ausfällen | So einfach wie möglich bleiben, modular aufbauen, damit Komponenten unabhängig gewartet werden können |
| Mangelnde Schulung | Unzureichend geschulte Personen machen Fehler, die die gesamte Automatisierung gefährden | In Schulungen investieren, regelmäßige Trainings und Workshops anbieten |
| Unsichere Fernzugriffe | Zugriffe von entfernten Standorten auf zentrale Ressourcen sind ein Einfallstor, wenn die Verbindungen nicht gesichert sind | Starke Authentifizierung wie 2FA und verschlüsselte Verbindungen, z. B. VPN |
| Schwachstellen in Skripten | Schlecht geschriebene Skripte führen ungewollte Aktionen aus oder geben sensible Daten preis | Regelmäßige Code-Reviews und Sicherheitsaudits, Werkzeuge zur statischen Code-Analyse |
| Man-in-the-Middle-Angriffe (MITM) | Angreifer fangen die Kommunikation über unsichere Netze ab und verändern sie | Ende-zu-Ende-Verschlüsselung, sichere Protokolle wie HTTPS und SSH, Hostschlüssel und Zertifikate prüfen, Verbindungen überwachen |
| Insider-Bedrohungen | Mitarbeitende oder Dienstleister missbrauchen ihren Zugang | Rollenbasierte Zugriffskontrolle, Zugriffsprotokolle überwachen, Team regelmäßig sensibilisieren |

## Übung: Könntest Du die Fallstricke vermeiden?

In dieser Übung lernst Du, typische Fallstricke der Remote-Automatisierung zu erkennen und geeignete Lösungen zu entwickeln.

**Aufgabe:** Gehe die folgenden Szenarien durch. Erkenne jeweils die Gefahr und mache einen Lösungsvorschlag.

1. Du hast ein komplexes Automatisierungsskript entwickelt, das verschiedene Remote-Server aktualisiert und überwacht. Leider hast Du es versäumt, die einzelnen Schritte und Konfigurationen zu dokumentieren.
2. Dein Automatisierungssystem besteht aus vielen miteinander verknüpften Skripten und Modulen, die auf mehreren Remote-Servern laufen. Die Konfiguration ist sehr komplex und erfordert umfangreiches Wissen.
3. Ein neues Mitglied im Team übernimmt die Verantwortung für die Wartung und Weiterentwicklung der Remote-Automatisierungsskripte, hat jedoch keine ausreichende Schulung erhalten.
4. Deine Automatisierungsskripte greifen von entfernten Standorten auf zentrale Netzwerkressourcen zu, jedoch werden einfache Authentifizierungsmethoden verwendet.

Indem Du die Gefahren erkennst und passende Maßnahmen ableitest, verbesserst Du die Sicherheit und Effizienz Deiner Automatisierung.

> **Tipp:** Ordne jedes Szenario zuerst einem Fallstrick aus der Tabelle „Fallstricke und wie Du sie vermeidest“ zu. Überlege dann, welche Folgen im schlimmsten Fall drohen, und erst danach, welche Maßnahmen helfen. Bearbeite die Übung selbst, bevor Du den Lösungsvorschlag aufklappst.

<details>
<summary>Lösungsvorschlag anzeigen</summary>

| Szenario | Fallstrick und Gefahr | Lösungsvorschlag |
| --- | --- | --- |
| 1. Fehlende Dokumentation | **Unzureichende Dokumentation.** Bei einem Fehler oder Personalwechsel weiß niemand, was das Skript auf welchen Servern tut. Die Fehlersuche dauert lange, Änderungen werden riskant | Zweck, Ablauf, Parameter, Zielserver und Abhängigkeiten dokumentieren, z. B. als README neben dem Code in Git und mit Kommentaren im Skript. Ein Runbook für Störungen anlegen. Dokumentation bei jeder Änderung mitpflegen |
| 2. Zu komplexes System | **Zu hohe Komplexität.** Fehler sind schwer zu finden, eine Änderung an einem Modul hat unerwartete Folgen auf anderen Servern, und nur wenige Personen verstehen das System | Vereinfachen und modular aufbauen: klar abgegrenzte Module mit definierten Schnittstellen. Konfiguration zentral verwalten, z. B. mit Ansible-Rollen statt verstreuter Skripte. Unnötige Abhängigkeiten entfernen und Module einzeln testen |
| 3. Ungeschultes Teammitglied | **Mangelnde Schulung.** Fehlbedienungen können alle Remote-Server gleichzeitig treffen. Sicherheitsregeln werden womöglich unwissentlich verletzt | Strukturierte Einarbeitung mit Schulung zu Werkzeugen und Sicherheitsregeln. Zunächst nur in der Testumgebung arbeiten, Änderungen per Code-Review durch erfahrene Kolleginnen und Kollegen freigeben lassen. Rechte schrittweise erweitern |
| 4. Schwache Authentifizierung | **Unsichere Fernzugriffe.** Gestohlene oder erratene Passwörter geben Angreifern Zugriff auf zentrale Ressourcen, auf die das Skript zugreift. Ohne Verschlüsselung drohen Man-in-the-Middle-Angriffe | SSH-Schlüssel oder Zertifikate statt Passwörtern, für Personen MFA. Eigene Dienstkonten mit minimalen Rechten (RBAC). Verbindungen über VPN und verschlüsselte Protokolle. Zugangsdaten in einem Passwort-Tresor statt im Skript. Zugriffe protokollieren und überwachen |

> **Kurz gesagt:** Alle vier Szenarien haben dieselbe Ursache: Die Automatisierung wurde gebaut, aber nicht für den Dauerbetrieb abgesichert. Dokumentation, Einfachheit, Schulung und sichere Zugänge gehören von Anfang an zur Planung.

</details>

## Fazit

Die Automatisierung von Aufgaben bringt Unternehmen mehr Effizienz, weniger Fehler und geringere Kosten. Der Einsatz von RPA und IPA (Kapitel 1) sowie von Technologien wie SDN und NFV erfordert jedoch eine sorgfältige Planung und die Berücksichtigung von Sicherheitsrisiken. Eine präzise Zielsetzung, die richtige Auswahl der Werkzeuge und strenge Sicherheitsmaßnahmen sind entscheidend.

- Sorgfältige Planung und Sicherheitsmaßnahmen sind unerlässlich.
- Geeignete Werkzeuge auswählen und robuste Strategien umsetzen.
- Dokumentation, Schulung und Sicherheitsaudits helfen, Fallstricke zu vermeiden.
