---
title: "Sicherheitsaspekte bei der Automatisierung"
description: "Prinzipien der IT-Sicherheit, Schutz vor unerlaubtem Zugriff, Updates und Audits."
duration: "25 Minuten"
---

Automatisierung ist ein Sicherheitswerkzeug und ein Sicherheitsrisiko zugleich. Skripte verteilen Updates, prüfen Konfigurationen und reagieren auf Angriffe schneller als jeder Mensch. Gleichzeitig laufen sie oft mit hohen Rechten, kennen Zugangsdaten und erreichen viele Systeme auf einmal. Wer ein Automatisierungsskript manipuliert, kontrolliert damit alle Systeme, auf denen es läuft. Dieses Kapitel zeigt die Grundlagen der IT-Sicherheit und wie man sie in der Automatisierung umsetzt. Es endet mit einer Übung und einem Lösungsvorschlag.

## Grundlegende Prinzipien der IT-Sicherheit

IT-Sicherheit verfolgt drei **Schutzziele**, oft nach den englischen Begriffen als CIA-Triade bezeichnet:

| Schutzziel | Bedeutung | Bedrohung (Beispiel) | Maßnahme in der Automatisierung |
| --- | --- | --- | --- |
| Vertraulichkeit (Confidentiality) | Nur Berechtigte können Daten lesen | Passwort steht im Klartext im Skript und landet in Git | Passwort-Tresor, Verschlüsselung, Zugriffsrechte |
| Integrität (Integrity) | Daten und Programme sind vollständig und unverändert | Jemand ändert ein Skript, das als root läuft | Schreibrechte nur für Berechtigte, Code-Signatur, Prüfsummen, Review |
| Verfügbarkeit (Availability) | Systeme und Daten stehen zur Verfügung, wenn sie gebraucht werden | Fehlerhaftes Skript fährt alle Server herunter | Tests, schrittweise Einführung, Backups, Notfallplan |

Ergänzend werden häufig **Authentizität** (Echtheit: Kommt die Nachricht wirklich vom Absender?) und **Nachvollziehbarkeit** (Wer hat wann was getan?) genannt. Aus den Schutzzielen leiten sich Grundprinzipien ab, die für jede Automatisierung gelten:

| Prinzip | Bedeutung | Umsetzung in der Automatisierung |
| --- | --- | --- |
| Least Privilege (geringste Rechte) | Jede Person und jedes Programm erhält nur die Rechte, die es wirklich braucht | Eigenes Dienstkonto je Skript statt Domänen-Admin, `sudo` nur für einen bestimmten Befehl |
| Defense in Depth (gestaffelte Verteidigung) | Mehrere unabhängige Schutzschichten, damit eine einzelne Lücke nicht genügt | Firewall, Rechte, Verschlüsselung, Logging und Monitoring kombinieren |
| Zero Trust | Kein Zugriff wird automatisch vertraut, auch nicht im internen Netz; jede Anfrage wird geprüft | Jeder API-Aufruf mit Token, verschlüsselte Verbindungen auch intern |
| Security by Design und by Default | Sicherheit von Anfang an einplanen; Standardeinstellungen sind sicher | Skriptvorlage mit Strict Mode, Probelauf als Standard, keine Passwörter im Code |
| Funktionstrennung | Kritische Vorgänge nicht von einer Person allein | Vier-Augen-Prinzip bei Code-Änderungen, getrennte Rechte für Entwicklung und Betrieb |
| Einfachheit | Komplexität ist der Feind der Sicherheit | Kleine, verständliche Skripte statt schwer prüfbarer Speziallösungen |

### Sicherheitsrichtlinien und -standards

Sicherheit braucht verbindliche Regeln. In Unternehmen sind sie meist in Stufen aufgebaut:

| Ebene | Inhalt | Beispiel |
| --- | --- | --- |
| Leitlinie (Policy) | Grundsätzliche Ziele und Verantwortung, von der Geschäftsleitung verabschiedet | „Informationssicherheit ist Aufgabe aller Mitarbeitenden.“ |
| Richtlinien | Verbindliche Regeln für ein Thema | Passwortrichtlinie, Richtlinie für Automatisierung und Skripte |
| Standards und Verfahren | Konkrete technische Vorgaben und Abläufe | „Skripte liegen in Git, Zugangsdaten nur im Tresor.“ |
| Arbeitsanweisungen | Schritt-für-Schritt-Anleitungen | Runbook „Neues Dienstkonto anlegen“ |

Statt alles selbst zu erfinden, orientiert man sich an anerkannten Standards:

| Standard | Inhalt | Bedeutung |
| --- | --- | --- |
| ISO/IEC 27001 | Anforderungen an ein Informationssicherheits-Managementsystem (ISMS) mit Risikomanagement und kontinuierlicher Verbesserung. Die Fassung von 2022 enthält im Anhang A 93 Maßnahmen | Internationaler Standard, Unternehmen können sich zertifizieren lassen |
| ISO/IEC 27002 | Leitfaden mit Erläuterungen zu den Maßnahmen aus ISO 27001 | Praktische Umsetzungshilfe |
| BSI IT-Grundschutz | BSI-Standards 200-1 bis 200-4 und das IT-Grundschutz-Kompendium mit Bausteinen und Anforderungen | In Deutschland weit verbreitet, besonders in Behörden; mit ISO 27001 kombinierbar |
| NIST Cybersecurity Framework | Funktionen Govern, Identify, Protect, Detect, Respond, Recover (Version 2.0) | International verbreiteter Rahmen aus den USA |
| CIS Controls und CIS Benchmarks | Priorisierte Schutzmaßnahmen und konkrete Härtungsvorgaben für Betriebssysteme und Programme | Gut automatisierbar, z. B. als Prüfskript |
| DSGVO, Art. 32 | Technische und organisatorische Maßnahmen (TOM) zum Schutz personenbezogener Daten | Gesetzliche Pflicht für alle, die personenbezogene Daten verarbeiten |
| NIS2 | EU-Richtlinie zur Cybersicherheit wichtiger und besonders wichtiger Einrichtungen | In Deutschland über das NIS2-Umsetzungsgesetz verpflichtend für viele Unternehmen |
| DORA | EU-Verordnung zur digitalen Widerstandsfähigkeit im Finanzsektor, gilt seit Januar 2025 | Pflicht für Banken, Versicherungen und weitere Finanzunternehmen |

**Beispiel: Richtlinie für Automatisierungsskripte (Auszug)**

1. Produktive Skripte liegen ausschließlich im zentralen Git-Repository. Jede Änderung wird von einer zweiten Person geprüft.
2. Skripte laufen unter eigenen Dienstkonten mit minimalen Rechten. Persönliche Administratorkonten sind für Automatisierung verboten.
3. Zugangsdaten werden nur im Passwort-Tresor gespeichert, nie im Code, in Parametern oder in Logdateien.
4. Verbindungen zu anderen Systemen nutzen ausschließlich verschlüsselte Protokolle. Zertifikatsprüfungen werden nicht abgeschaltet.
5. Jeder Lauf wird mit Zeitstempel protokolliert, Fehler lösen einen Alarm aus.
6. Skripte, Dienstkonten und deren Rechte werden mindestens einmal jährlich überprüft.

### Sicherheitsrisiken identifizieren und bewerten

Ein **Risiko** entsteht, wenn eine **Bedrohung** auf eine **Schwachstelle** eines schützenswerten **Werts** (Asset) trifft. Bewertet wird es nach Eintrittswahrscheinlichkeit und Schadenshöhe:

```text
Risiko = Eintrittswahrscheinlichkeit × Schadenshöhe
```

**Vorgehen:**

1. **Werte erfassen:** Welche Systeme, Daten, Skripte und Dienstkonten sind schützenswert?
2. **Bedrohungen und Schwachstellen finden:** Interviews, Schwachstellenscanner, Herstellerwarnungen, Methoden wie STRIDE (siehe unten).
3. **Bewerten:** Wahrscheinlichkeit und Schaden je auf einer Skala von 1 (gering) bis 4 (sehr hoch) einschätzen und multiplizieren.
4. **Einordnen:** Das Ergebnis in die Risikomatrix eintragen: 1–3 niedrig, 4–6 mittel, 8–9 hoch, 12–16 sehr hoch.
5. **Behandeln:** Maßnahmen festlegen, beginnend mit den höchsten Risiken (Abschnitt 8.1.3).

| Risiko in der Automatisierung | Wahrsch. | Schaden | Wert | Stufe |
| --- | --- | --- | --- | --- |
| Passwort im Klartext im Skript, Skript liegt in Git | 3 | 4 | 12 | sehr hoch |
| Skript läuft mit Domänen-Admin-Rechten | 2 | 4 | 8 | hoch |
| Normale Benutzer haben Schreibrechte auf ein root-Skript | 2 | 4 | 8 | hoch |
| Unverschlüsselte Übertragung (HTTP, FTP) | 3 | 3 | 9 | hoch |
| Ungetestete Massenänderung | 2 | 3 | 6 | mittel |
| Logdateien enthalten personenbezogene Daten | 3 | 2 | 6 | mittel |
| Ausfall des Automatisierungsservers | 2 | 2 | 4 | mittel |
| Veraltetes PowerShell-Modul aus dem Internet | 1 | 3 | 3 | niedrig |

**Bedrohungen systematisch finden mit STRIDE:**

| Bedrohung | Bedeutung | Beispiel in der Automatisierung | Verletztes Schutzziel |
| --- | --- | --- | --- |
| Spoofing | Falsche Identität vortäuschen | Angreifer nutzt gestohlene Zugangsdaten eines Dienstkontos | Authentizität |
| Tampering | Daten oder Code manipulieren | Skript wird um einen schädlichen Befehl ergänzt | Integrität |
| Repudiation | Handlungen abstreiten | Änderung ohne Protokoll, niemand weiß, wer sie gemacht hat | Nachvollziehbarkeit |
| Information Disclosure | Informationen preisgeben | Passwort erscheint in einer Logdatei | Vertraulichkeit |
| Denial of Service | Verfügbarkeit stören | Endlosschleife legt einen Server lahm | Verfügbarkeit |
| Elevation of Privilege | Rechte ausweiten | Benutzer ändert ein Skript, das als root läuft | Integrität und Vertraulichkeit |

Für bekannte Schwachstellen in Software gibt es eindeutige Kennungen (**CVE**, Common Vulnerabilities and Exposures) und eine Bewertung von 0 bis 10 (**CVSS**, Common Vulnerability Scoring System). Beides hilft bei der Einschätzung, wie dringend ein Update ist (Abschnitt 8.3.1).

### Sei vorbereitet: Risikomanagement und Notfallplanung

Für jedes bewertete Risiko gibt es vier Möglichkeiten der Behandlung:

| Strategie | Bedeutung | Beispiel |
| --- | --- | --- |
| Vermeiden | Die riskante Tätigkeit wird nicht ausgeführt | Kein Fernzugriff auf Produktionsserver aus dem Internet |
| Vermindern | Wahrscheinlichkeit oder Schaden durch Maßnahmen senken | Passwörter in den Tresor verlagern, Rechte reduzieren |
| Übertragen | Das Risiko ganz oder teilweise an andere abgeben | Cyberversicherung, Betrieb durch einen spezialisierten Dienstleister |
| Akzeptieren | Das Restrisiko bewusst tragen | Geringes Risiko, dessen Behandlung teurer wäre als der mögliche Schaden; schriftlich von der Leitung bestätigt |

Risikomanagement ist ein Kreislauf nach dem PDCA-Prinzip (Abschnitt 2.5): Risiken werden regelmäßig neu bewertet, weil sich Systeme, Bedrohungen und Geschäftsprozesse ändern.

**Notfallplanung:**

Trotz aller Maßnahmen kann ein Sicherheitsvorfall oder Ausfall eintreten. Ein Notfallplan legt vorher fest, wer was tut. Grundlage ist das **Business Continuity Management** (BSI-Standard 200-4) mit zwei zentralen Kennzahlen:

| Kennzahl | Bedeutung | Beispiel |
| --- | --- | --- |
| RTO (Recovery Time Objective) | Wie lange darf ein System höchstens ausfallen? | Ticketsystem: 4 Stunden |
| RPO (Recovery Point Objective) | Wie viel Datenverlust ist höchstens hinnehmbar? | Datenbank: 1 Stunde, also mindestens stündliche Sicherung |

Bei einem Sicherheitsvorfall wird meist in vier Phasen gearbeitet: **Vorbereitung** (Notfallhandbuch, Kontaktliste, geübte Abläufe), **Erkennen und Analysieren**, **Eindämmen, Beseitigen und Wiederherstellen** sowie **Nachbereiten** (Ursachen, Verbesserungen).

**Datensicherung nach der 3-2-1-1-0-Regel:**

- 3 Kopien der Daten,
- auf 2 unterschiedlichen Speichermedien,
- davon 1 Kopie an einem anderen Standort,
- davon 1 Kopie offline oder unveränderbar (Schutz vor Ransomware),
- 0 Fehler bei regelmäßig getesteten Wiederherstellungen.

> **Wichtig:** Ein Backup, dessen Wiederherstellung nie getestet wurde, ist nur eine Hoffnung. Wiederherstellungstests lassen sich gut automatisieren. Gleichzeitig muss der Notfallplan auch ohne Automatisierung funktionieren, denn im Ernstfall kann gerade der Automatisierungsserver betroffen sein.

## Schutz vor unerlaubtem Zugriff

Zugriffsschutz beantwortet zwei Fragen: **Authentifizierung** prüft, wer jemand ist. **Autorisierung** legt fest, was diese Person oder dieses Programm darf. Für beides gilt in der Automatisierung das Prinzip der geringsten Rechte.

| Maßnahme | Umsetzung |
| --- | --- |
| Mehr-Faktor-Authentifizierung (MFA) | Anmeldung mit zwei von drei Faktoren: Wissen (Passwort), Besitz (Smartphone, Token), Sein (Fingerabdruck). Pflicht für alle Administratorkonten |
| Eigene Dienstkonten | Je Skript oder Aufgabe ein eigenes Konto mit genau den nötigen Rechten. Unter Windows bieten sich gruppenverwaltete Dienstkonten (gMSA) an, deren Passwort das Active Directory automatisch wechselt |
| Rollenbasierte Rechte (RBAC) | Rechte werden Rollen zugewiesen, nicht einzelnen Personen |
| Eingeschränkte Administration | PowerShell Just Enough Administration (JEA) erlaubt nur bestimmte Befehle; unter Linux beschränkt `sudo` auf einzelne Skripte (Abschnitt 5.6.2) |
| Schutz der Skripte selbst | Schreibrechte nur für Administratoren (Abschnitt 5.6.1), Code-Signatur, geschützte Branches in Git |
| SSH-Schlüssel statt Passwörter | Schlüsselpaar je Automatisierung, im Zielsystem auf einen Befehl und eine Quell-IP beschränkt |
| Getrennte Automatisierungsumgebung | Eigener Server für die Automatisierung, nur von Administratoren erreichbar |
| Regelmäßige Rechteprüfung | Nicht mehr benötigte Konten und Rechte entfernen |

**SSH-Schlüssel auf einen Befehl beschränken (Eintrag in ~/.ssh/authorized\_keys des Zielsystems):**

```text
from="10.0.5.20",command="/opt/skripte/backup.sh",no-port-forwarding,no-pty ssh-ed25519 AAAAC3Nza... backup@automation
```

Mit diesem Schlüssel kann sich nur der Automatisierungsserver 10.0.5.20 anmelden und ausschließlich das Backup-Skript starten. Wird der Schlüssel gestohlen, ist der mögliche Schaden begrenzt.

**PowerShell-Skripte signieren:**

```powershell
$zert = Get-ChildItem Cert:\CurrentUser\My -CodeSigningCert |
    Select-Object -First 1
Set-AuthenticodeSignature -FilePath .\Bereinigung.ps1 -Certificate $zert `
    -TimestampServer 'http://timestamp.digicert.com'
Get-AuthenticodeSignature -FilePath .\Bereinigung.ps1     # Status: Valid
```

Mit der Ausführungsrichtlinie `AllSigned` laufen nur noch signierte Skripte. Wird ein signiertes Skript nachträglich verändert, ist die Signatur ungültig, und PowerShell verweigert die Ausführung.

### Verschlüsselung und sichere Speicherlösungen für Deine Automatisierungsskripte

| Verfahren | Funktionsweise | Beispiele | Einsatz |
| --- | --- | --- | --- |
| Symmetrische Verschlüsselung | Ein gemeinsamer Schlüssel ver- und entschlüsselt | AES-256 | Dateien, Backups, Festplatten |
| Asymmetrische Verschlüsselung | Öffentlicher Schlüssel verschlüsselt, privater entschlüsselt (bzw. signiert) | RSA, elliptische Kurven (z. B. Ed25519) | Schlüsselaustausch, Signaturen, SSH, TLS |
| Hashfunktion | Erzeugt einen eindeutigen Fingerabdruck, keine Entschlüsselung möglich | SHA-256 | Integrität prüfen, Passwörter gesichert speichern |

Man unterscheidet den Schutz **gespeicherter Daten** (Data at Rest, z. B. verschlüsselte Festplatten und Backups) und **übertragener Daten** (Data in Transit, z. B. TLS, Abschnitt 8.4.1). Für Automatisierungsskripte ist vor allem der sichere Umgang mit Zugangsdaten entscheidend:

| Unsicher | Besser |
| --- | --- |
| Passwort im Klartext im Skript | Passwort-Tresor oder verschlüsselte Datei |
| Passwort als Kommandozeilenparameter | Aus Tresor oder Datei lesen; Parameter sind in der Prozessliste (`ps`) für andere sichtbar |
| Base64-„Verschlüsselung“ | Base64 ist nur eine Kodierung und in Sekunden umkehrbar |
| Ein Schlüssel fest im Skript | Schlüssel getrennt von den Daten aufbewahren, z. B. im Tresor oder HSM |
| Zugangsdaten in Logdateien | Passwörter und Tokens vor dem Protokollieren entfernen |

**Windows: Anmeldedaten verschlüsselt speichern (DPAPI):**

```powershell
# Einmalig als das Dienstkonto, unter dem das Skript später läuft:
$pfad = 'D:\Skripte\svc_backup.xml'
Get-Credential -UserName 'svc_backup' | Export-Clixml -Path $pfad

# Im Skript:
$cred = Import-Clixml -Path 'D:\Skripte\svc_backup.xml'
Invoke-Command -ComputerName fs01 -Credential $cred -ScriptBlock { Get-Volume }
```

`Export-Clixml` verschlüsselt das Passwort mit der Windows-Datenschutz-API (DPAPI). Nur derselbe Benutzer auf demselben Rechner kann es wieder entschlüsseln. In der Datei steht das Passwort nur als verschlüsselte Zeichenfolge.

**PowerShell SecretManagement: einheitlicher Zugriff auf Tresore**

```powershell
Install-Module Microsoft.PowerShell.SecretManagement -Scope CurrentUser
Install-Module Microsoft.PowerShell.SecretStore -Scope CurrentUser
Register-SecretVault -Name Lokal -DefaultVault `
    -ModuleName Microsoft.PowerShell.SecretStore

Set-Secret -Name SmtpPasswort -Secret (Read-Host -AsSecureString 'Passwort')
$pw = Get-Secret -Name SmtpPasswort  # liefert einen SecureString
```

Dasselbe Skript kann später ohne Codeänderung auf einen zentralen Tresor wie Azure Key Vault oder HashiCorp Vault umgestellt werden, indem man dort einen anderen Tresor registriert.

**Linux: geschützte Datei mit Rechteprüfung**

```bash
cred=/etc/backup/credentials.conf                 # gehört backup, Rechte 600
[[ "$(stat -c '%a %U' "$cred")" == "600 backup" ]] ||
    { echo "Unsichere Rechte auf $cred" >&2; exit 1; }
source "$cred"
```

**Backup verschlüsseln und Integrität prüfen:**

```bash
#!/bin/bash
set -Eeuo pipefail
SCHLUESSEL="/etc/backup/schluessel"  # Rechte 600, getrennt vom Backup
DATEI="backup.tar.gz"

openssl enc -aes-256-cbc -pbkdf2 -salt -in "$DATEI" -out "$DATEI.enc" \
    -pass "file:$SCHLUESSEL"
sha256sum "$DATEI.enc" > "$DATEI.enc.sha256"     # Prüfsumme für später
rm -f "$DATEI"
echo "Verschlüsselt: $DATEI.enc"
sha256sum -c backup.tar.gz.enc.sha256  # backup.tar.gz.enc: OK  (oder FAILED)
openssl enc -d -aes-256-cbc -pbkdf2 -in backup.tar.gz.enc -out backup.tar.gz \
    -pass file:/etc/backup/schluessel             # entschlüsseln
```

Die Prüfsumme zeigt vor der Wiederherstellung, ob die Datei unverändert ist. Schon ein einziges geändertes Byte führt zu `FAILED`.

## Schutz vor neuen Bedrohungen durch regelmäßige Aktualisierungen

Täglich werden neue Schwachstellen in Betriebssystemen, Anwendungen und Bibliotheken bekannt. Die Zeit zwischen der Veröffentlichung einer Lücke und ihrer Ausnutzung durch Angreifer wird immer kürzer. Gegen bekannte Schwachstellen hilft nur eines: zügig aktualisieren.

### Die Bedeutung von regelmäßigen Updates und Patches

Ein **Patch** ist eine Korrektur, die eine Schwachstelle oder einen Fehler behebt. Wie wichtig zügiges Patchen ist, zeigen zwei bekannte Fälle:

- **WannaCry (Mai 2017):** Die Ransomware nutzte eine Lücke in SMBv1, für die Microsoft bereits im März 2017 ein Update veröffentlicht hatte. Betroffen waren vor allem Systeme, auf denen dieses Update fehlte.
- **Log4Shell (Dezember 2021):** Eine Lücke in der weit verbreiteten Java-Bibliothek Log4j (CVE-2021-44228, CVSS 10,0) betraf unzählige Anwendungen. Viele Unternehmen wussten nicht einmal, wo die Bibliothek überall eingesetzt war.

Eine **Zero-Day-Lücke** ist eine Schwachstelle, die ausgenutzt wird, bevor ein Update existiert. Hier helfen nur gestaffelte Schutzmaßnahmen (Defense in Depth) und eine schnelle Reaktion, sobald das Update erscheint.

**Patchmanagement als Prozess:**

1. **Inventar:** Welche Systeme, Programme, Module und Bibliotheken sind im Einsatz? Ohne Inventar keine vollständige Aktualisierung.
2. **Informieren:** Sicherheitshinweise der Hersteller, Warnmeldungen des BSI, CVE-Datenbanken verfolgen. Microsoft veröffentlicht reguläre Updates am zweiten Dienstag des Monats (Patch Tuesday).
3. **Bewerten und priorisieren:** nach CVSS-Wert, Erreichbarkeit des Systems und bekannter aktiver Ausnutzung.
4. **Testen:** zuerst in einer Testumgebung oder einer kleinen Pilotgruppe.
5. **Verteilen:** in Wellen (Ringen), z. B. erst IT-Abteilung, dann 10 % der Geräte, dann alle.
6. **Prüfen und dokumentieren:** Wurde das Update überall installiert? Gab es Probleme?
7. **Notfallprozess:** Für kritische, aktiv ausgenutzte Lücken gilt ein beschleunigtes Verfahren.

| CVSS-Wert | Einstufung | Beispielfrist für die Installation |
| --- | --- | --- |
| 9,0–10,0 | Kritisch | 24–72 Stunden, bei Systemen mit Internetzugang sofort |
| 7,0–8,9 | Hoch | 7 Tage |
| 4,0–6,9 | Mittel | 30 Tage |
| 0,1–3,9 | Niedrig | Nächster regulärer Updatezyklus |

Die Fristen sind Beispielwerte, die jedes Unternehmen in seiner Richtlinie festlegt. Wird eine Lücke nachweislich bereits aktiv ausgenutzt, ist sie unabhängig vom CVSS-Wert vorrangig zu behandeln.

**Updates automatisieren:**

| Bereich | Werkzeuge |
| --- | --- |
| Windows-Clients und -Server | Windows Update for Business mit Update-Ringen in Intune, WSUS, Configuration Manager |
| Debian und Ubuntu | `unattended-upgrades` für automatische Sicherheitsupdates |
| Red Hat, Rocky, Alma Linux | `dnf-automatic` |
| PowerShell-Module, Python-Pakete | `Update-Module`, `pip list --outdated`, feste Versionsangaben |
| Container | Basis-Images regelmäßig neu bauen, Images auf Schwachstellen scannen |
| Code-Abhängigkeiten in Git | Automatische Update-Vorschläge, z. B. mit Dependabot oder Renovate |

```text
# /etc/apt/apt.conf.d/20auto-upgrades (Debian/Ubuntu)
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

**Patchstand per Skript überwachen (Windows):**

```powershell
$grenzeTage = 35
$letztes = Get-HotFix |
    Where-Object InstalledOn |
    Sort-Object -Property InstalledOn -Descending |
    Select-Object -First 1

$alter = ((Get-Date) - $letztes.InstalledOn).Days
$kb    = $letztes.HotFixID
if ($alter -gt $grenzeTage) {
    Write-Warning "Letztes Update vor $alter Tagen ($kb). Patchstand prüfen!"
    exit 1
}
Write-Output "Letztes Update vor $alter Tagen: $kb - in Ordnung."
Letztes Update vor 16 Tagen: KB5129195 - in Ordnung.
```

35 Tage entsprechen einem monatlichen Patchzyklus mit kurzem Puffer. Als geplante Aufgabe mit Alarm bei Exit-Code 1 fällt ein Rechner auf, der keine Updates mehr erhält.

> **Merke:** Auch Automatisierungsskripte haben Abhängigkeiten: Module, Bibliotheken, Container-Images und die Skriptsprache selbst. Sie gehören ins Inventar und in den Patchprozess.

## Sicherheitsprotokolle in Automatisierungsprozessen

Automatisierungsskripte kommunizieren ständig mit anderen Systemen: Sie rufen APIs auf, kopieren Dateien, melden sich auf Servern an und verschicken E-Mails. **Sicherheitsprotokolle** sorgen dafür, dass diese Kommunikation vertraulich, unverändert und mit dem richtigen Gegenüber stattfindet.

### Sicherheitsprotokolle und ihre Anwendung in der Automatisierung

| Protokoll | Schicht und Zweck | Einsatz in der Automatisierung |
| --- | --- | --- |
| TLS 1.2 und 1.3 | Verschlüsselt Verbindungen von Anwendungen, prüft die Identität des Servers über Zertifikate | HTTPS für REST-APIs, LDAPS, SMTPS, FTPS |
| SSH | Verschlüsselte Anmeldung und Befehlsausführung, Dateiübertragung (SFTP, SCP) | Linux-Server verwalten, Dateien übertragen, Ansible, PowerShell-Remoting über SSH |
| IPsec | Verschlüsselt den gesamten Netzwerkverkehr auf IP-Ebene | VPN zwischen Standorten oder in die Cloud |
| Kerberos | Anmeldung im Windows-Netz ohne Übertragung des Passworts | WinRM und PowerShell-Remoting in der Domäne |
| OAuth 2.0 und OpenID Connect | Zugriff auf APIs über zeitlich begrenzte Tokens statt Passwörter | Microsoft Graph, Cloud-Dienste, Ticketsysteme |
| SNMPv3 | Netzwerküberwachung mit Anmeldung und Verschlüsselung | Monitoring von Switches und Routern |

SSL und die alten TLS-Versionen 1.0 und 1.1 gelten als unsicher und sind abgekündigt. Wer heute „SSL“ sagt, meint meist TLS. Entscheidend ist, dass tatsächlich nur TLS 1.2 oder 1.3 erlaubt ist.

| Unsicher | Sicher |
| --- | --- |
| HTTP | HTTPS (TLS) |
| FTP | SFTP oder FTPS |
| Telnet | SSH |
| LDAP ohne Verschlüsselung | LDAPS oder LDAP mit Signierung und Verschlüsselung |
| SMTP ohne Verschlüsselung | SMTP mit STARTTLS oder SMTPS |
| SNMPv1 und v2c | SNMPv3 |
| SMBv1 | SMB 3 mit Verschlüsselung |
| SSL, TLS 1.0 und 1.1 | TLS 1.2 oder 1.3 |

**Regeln für Skripte:**

- Nur verschlüsselte Protokolle verwenden, auch im internen Netz (Zero Trust).
- **Zertifikatsprüfung nie abschalten:** kein `curl -k`, kein `-SkipCertificateCheck`, kein `verify=False` in Python. Bei internen Zertifikaten die eigene Zertifizierungsstelle als vertrauenswürdig hinterlegen.
- **SSH-Hostschlüssel prüfen:** `StrictHostKeyChecking yes` und bekannte Hosts in `known_hosts` pflegen.
- Für APIs Tokens statt Passwörtern verwenden, möglichst mit Zertifikat statt geheimem Schlüssel und mit minimalen Berechtigungen.
- Tokens und Schlüssel regelmäßig erneuern.

**Sichere API-Aufrufe:**

```powershell
# Bash: nur HTTPS, mindestens TLS 1.2, Fehler bei HTTP-Status >= 400
curl --fail --silent --show-error --proto '=https' --tlsv1.2 \
     -H "Authorization: Bearer $TOKEN" https://api.example.com/v1/tickets
# PowerShell: OAuth-2.0-Token holen und Microsoft Graph abfragen
$body = @{
    client_id     = $clientId
    client_secret = $clientSecret  # aus dem Tresor, nicht im Code
    scope         = 'https://graph.microsoft.com/.default'
    grant_type    = 'client_credentials'
}
$token = Invoke-RestMethod -Method Post -Body $body `
    -Uri "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"

Invoke-RestMethod -Uri 'https://graph.microsoft.com/v1.0/users?$top=5' `
    -Headers @{ Authorization = "Bearer $($token.access_token)" }
```

### Sicherheitsüberprüfungen und Audits zur Aufrechterhaltung der Systemsicherheit

Sicherheit ist kein Zustand, der einmal hergestellt wird. Konfigurationen ändern sich, neue Lücken werden bekannt, Rechte sammeln sich an. Regelmäßige Überprüfungen zeigen, ob die Maßnahmen noch wirken.

| Prüfung | Vorgehen | Häufigkeit (Beispiel) |
| --- | --- | --- |
| Schwachstellenscan | Automatische Suche nach bekannten Lücken, z. B. mit Greenbone/OpenVAS oder Nessus | Wöchentlich bis täglich |
| Konfigurationsprüfung | Abgleich mit Härtungsvorgaben, z. B. CIS Benchmarks, Lynis unter Linux | Monatlich oder bei jeder Änderung |
| Code- und Skriptprüfung | Review, Linter, Suche nach Passwörtern im Code, z. B. mit gitleaks | Bei jeder Änderung |
| Rechteprüfung | Welche Konten und Dienstkonten haben welche Rechte? Werden sie noch gebraucht? | Halbjährlich bis jährlich |
| Penetrationstest | Fachleute greifen das System gezielt an, um Lücken zu finden | Jährlich und nach großen Änderungen |
| Internes Audit | Prüfung, ob Richtlinien eingehalten werden und das ISMS wirkt | Jährlich |
| Externes Audit | Zertifizierung nach ISO 27001: jährliche Überwachungsaudits, alle drei Jahre Rezertifizierung | Nach Zertifizierungsplan |

**Sicherheitsrelevante Protokollierung:**

Audits und Vorfallsanalysen brauchen Protokolle, die festhalten, **wer wann was auf welchem System mit welchem Ergebnis** getan hat. Protokolle gehören zentral gesammelt (SIEM, Abschnitt 2.6), gegen Veränderung geschützt und mit festgelegter Aufbewahrungsfrist gespeichert.

| Quelle | Was wird protokolliert |
| --- | --- |
| Windows-Sicherheitsprotokoll | Anmeldungen (Ereignis 4624), fehlgeschlagene Anmeldungen (4625), neue Benutzerkonten (4720), Gruppenänderungen (z. B. 4728) |
| PowerShell Script Block Logging | Inhalt ausgeführter PowerShell-Befehle (Ereignis 4104), per Gruppenrichtlinie aktivierbar |
| Linux auditd | Zugriffe auf überwachte Dateien und Ordner, z. B. Änderungen an Skripten |
| sudo und SSH | Wer hat welche Befehle mit erhöhten Rechten ausgeführt, wer hat sich angemeldet |
| Eigene Skripte | Start, Ende, Ergebnis, geänderte Objekte, ausführendes Konto |

```bash
# auditd: Änderungen an Skripten protokollieren
sudo auditctl -w /opt/skripte -p wa -k skriptaenderung
sudo ausearch -k skriptaenderung --start today
```

**Einfache Selbstprüfung von Skriptordnern:**

```bash
# Passwörter, Schlüssel oder Tokens im Code?
grep -rniE '(passw(or)?[dt]|secret|api_?key|token)[[:alnum:]_]*[[:space:]]*=' \
    /opt/skripte/

# Für alle beschreibbare Skripte?
find /opt/skripte -type f -perm -o+w
/opt/skripte/alt.ps1:1:$smtpPasswort = "Sommer2026!"
/opt/skripte/sync.sh:1:API_KEY=abc123
```

Jeder Treffer ist ein Befund. Wie bei jedem Audit folgen daraus Maßnahmen mit Verantwortlichen und Terminen, deren Umsetzung beim nächsten Audit überprüft wird.

**Audit-Checkliste für die Automatisierung:**

| Prüfpunkt | Erfüllt, wenn … |
| --- | --- |
| Zugangsdaten | Kein Passwort im Code, in Git oder in Logs; alle im Tresor |
| Dienstkonten | Jedes Skript hat ein eigenes Konto mit minimalen Rechten; ungenutzte Konten sind deaktiviert |
| Integrität | Nur Administratoren können Skripte ändern; Änderungen laufen über Git und Review |
| Kommunikation | Nur verschlüsselte Protokolle, Zertifikatsprüfung aktiv |
| Aktualität | Skriptsprache, Module und Bibliotheken sind aktuell |
| Protokollierung | Jeder Lauf ist nachvollziehbar, Protokolle sind zentral und geschützt |
| Notfall | Wiederherstellung ist dokumentiert und getestet, auch ohne Automatisierung |

## Übung: Bewertung und Verbesserung von Sicherheitsvorkehrungen in Unternehmen

**Aufgabe:** In dieser Übung analysierst Du die Sicherheitsvorkehrungen dreier verschiedener Unternehmen. Deine Aufgabe ist es, die aktuellen Maßnahmen jedes Unternehmens zu bewerten und auf Basis der gelernten Prinzipien und Techniken Verbesserungsvorschläge zu machen. Beachte dabei die grundlegenden Prinzipien der IT-Sicherheit (Vertraulichkeit, Integrität, Verfügbarkeit), Sicherheitsrichtlinien und -standards, Risikobewertung und -minderung sowie die Implementierung von Sicherheitsprotokollen und regelmäßigen Audits.

**Bewerte die aktuellen Sicherheitsvorkehrungen jedes Unternehmens:**

- Identifiziere die Stärken und Schwächen der vorhandenen Sicherheitsmaßnahmen.
- Beurteile die Angemessenheit der Maßnahmen hinsichtlich der grundlegenden Prinzipien der IT-Sicherheit.

**Erstelle Verbesserungsvorschläge für jedes Unternehmen:**

- Nutze die gelernten Inhalte zu Sicherheitsrichtlinien und -standards, Risikobewertung, Sicherheitsprotokollen und Audits.
- Begründe Deine Vorschläge detailliert und erkläre, wie sie zur Verbesserung der IT-Sicherheit beitragen.

| Unternehmen | Aktuelle Sicherheitsvorkehrungen |
| --- | --- |
| **A: TechCorp** | Verwendung von TLS für die sichere Übertragung von Daten · Regelmäßige Software-Updates und Patches · Nutzung von Firewalls und Antivirensoftware · Grundlegende Zugangskontrollen (Passwortschutz) |
| **B: HealthCare Solutions** | Verschlüsselung aller Datenübertragungen mit SSL · Zwei-Faktor-Authentifizierung für alle Mitarbeitenden · Regelmäßige Schulungen für Mitarbeitende zur Erkennung von Phishing-Angriffen · Wöchentliche Backups der Datenbanken, jedoch ohne Verschlüsselung der Backups |
| **C: FinServ Inc.** | Implementierung von IPSec für sichere Kommunikation zwischen verschiedenen Standorten · Nutzung von Hardware-Sicherheitsmodulen (HSMs) zur sicheren Speicherung von kryptografischen Schlüsseln · Tägliche Überprüfungen auf Sicherheitslücken mit automatisierten Tools · Einhaltung von ISO 27001 Standards |

**Abschluss:** Vergleiche die Sicherheitsvorkehrungen der drei Unternehmen und erkläre, welches Unternehmen Deiner Meinung nach am besten aufgestellt ist und warum.

> **Tipp:** Gehe für jedes Unternehmen die drei Schutzziele durch und frage: Welche Maßnahme schützt dieses Ziel? Was fehlt? Prüfe außerdem die organisatorische Seite: Gibt es Richtlinien, Risikobewertung, Notfallplanung und Audits? Bearbeite die Übung zuerst selbst, bevor Du den Lösungsvorschlag in Abschnitt 8.6 liest.

## Lösungsvorschlag zur Übung

<details>
<summary>Lösungsvorschlag anzeigen</summary>

Die folgende Lösung ist ein Vorschlag. Andere Schwerpunkte sind möglich, solange sie mit den Schutzzielen und den Inhalten dieses Kapitels begründet werden. Da die Beschreibungen kurz sind, gilt: Was nicht genannt ist, wird als nicht vorhanden oder nicht nachgewiesen bewertet.

**Unternehmen A: TechCorp**

|  | Bewertung |
| --- | --- |
| **Stärken** | TLS schützt Vertraulichkeit und Integrität bei der Übertragung. Regelmäßige Updates schließen bekannte Lücken. Firewall und Virenschutz bilden einen Grundschutz am Netzrand und auf den Geräten. |
| **Schwächen** | Nur Passwortschutz: Ein gestohlenes Passwort genügt für den Zugriff, keine MFA, keine Angaben zu Rechtekonzept oder Least Privilege. Keine Backups genannt: Die Verfügbarkeit ist bei Ransomware oder Hardwareausfall gefährdet. Keine Verschlüsselung gespeicherter Daten. Keine Richtlinien, keine Risikoanalyse, keine Protokollierung, keine Audits, keine Schulungen, kein Notfallplan. „Regelmäßig“ ist nicht definiert. |
| **Schutzziele** | Vertraulichkeit: teilweise (nur Übertragung). Integrität: teilweise. Verfügbarkeit: unzureichend. Insgesamt rein technischer Grundschutz ohne organisatorisches Fundament. |

| Verbesserungsvorschlag | Begründung und Wirkung |
| --- | --- |
| MFA für alle Konten, zuerst für Administratoren und Fernzugriff | Gestohlene Passwörter allein reichen nicht mehr. Schützt Vertraulichkeit und Integrität (8.2) |
| Rechtekonzept nach Least Privilege, eigene Dienstkonten für Automatisierung | Begrenzt den Schaden eines kompromittierten Kontos (8.1) |
| Backup-Konzept nach 3-2-1-1-0 mit Wiederherstellungstests, RTO und RPO festlegen | Sichert die Verfügbarkeit, auch bei Ransomware (8.1.3) |
| Sicherheitsleitlinie, Risikoanalyse und Orientierung an BSI IT-Grundschutz oder ISO 27001 | Schafft das fehlende organisatorische Fundament und priorisiert Maßnahmen nach Risiko (8.1.1, 8.1.2) |
| Patchmanagement mit Fristen nach CVSS, TLS nur in Version 1.2 oder 1.3 | Macht „regelmäßig“ messbar und überprüfbar (8.3.1, 8.4.1) |
| Zentrale Protokollierung, Schwachstellenscans, jährlicher Penetrationstest | Angriffe und Lücken werden erkannt, Wirksamkeit wird geprüft (8.4.2) |
| Awareness-Schulungen und Notfallplan | Mitarbeitende als häufigstes Einfallstor werden geschult, im Ernstfall ist klar, wer was tut |

**Unternehmen B: HealthCare Solutions**

|  | Bewertung |
| --- | --- |
| **Stärken** | Zwei-Faktor-Authentifizierung für alle schützt wirksam vor gestohlenen Passwörtern. Phishing-Schulungen stärken den Faktor Mensch. Übertragungen werden verschlüsselt. Es gibt überhaupt Backups. |
| **Schwächen** | Unverschlüsselte Backups von Gesundheitsdaten: Gesundheitsdaten gehören nach Art. 9 DSGVO zu den besonders schützenswerten Daten. Ein gestohlenes Backup legt alle Patientendaten offen. „SSL“ ist veraltet und unsicher, falls tatsächlich SSL oder TLS 1.0/1.1 im Einsatz ist. Wöchentliche Backups bedeuten bis zu sieben Tage Datenverlust. Keine Angaben zu Wiederherstellungstests, Offline-Kopie, Patchmanagement, Firewall, Protokollierung oder Audits. |
| **Schutzziele** | Vertraulichkeit: im Betrieb gut, bei Backups kritisch. Integrität: teilweise. Verfügbarkeit: unzureichend wegen des langen Sicherungsintervalls. |

| Verbesserungsvorschlag | Begründung und Wirkung |
| --- | --- |
| Backups mit AES-256 verschlüsseln, Schlüssel getrennt aufbewahren (Tresor oder HSM) | Schließt die größte Lücke: Ein entwendetes Backup ist ohne Schlüssel wertlos (8.2.1) |
| Tägliche Vollsicherung plus stündliche Sicherung der Transaktionsprotokolle, 3-2-1-1-0, regelmäßige Wiederherstellungstests | Senkt den möglichen Datenverlust (RPO) von einer Woche auf etwa eine Stunde, unveränderbare Kopie schützt vor Ransomware (8.1.3) |
| Nur TLS 1.2 oder 1.3 zulassen, SSL und TLS 1.0/1.1 abschalten | Veraltete Protokolle haben bekannte Schwächen (8.4.1) |
| Patchmanagement, Schwachstellenscans und Protokollierung aller Zugriffe auf Patientendaten | Schließt bekannte Lücken und macht Zugriffe nachvollziehbar (8.3, 8.4.2) |
| Datenschutz-Folgenabschätzung, Risikoanalyse, ISMS nach ISO 27001 oder branchenspezifischen Standards | Gesundheitsdaten verlangen ein systematisches Vorgehen und erfüllen gesetzliche Anforderungen (8.1.1) |

**Unternehmen C: FinServ Inc.**

|  | Bewertung |
| --- | --- |
| **Stärken** | ISO 27001 bedeutet ein ISMS mit Richtlinien, Risikomanagement, internen und externen Audits und kontinuierlicher Verbesserung. HSMs bieten den bestmöglichen Schutz für kryptografische Schlüssel. Tägliche automatisierte Schwachstellenprüfungen erkennen neue Lücken schnell. IPsec schützt die Kommunikation zwischen den Standorten. |
| **Schwächen** | Keine Angaben zu MFA, Rechtekonzept und Schulungen. Die Verschlüsselung externer Verbindungen, z. B. zu Kunden oder Cloud-Diensten, ist nicht genannt. Schwachstellen werden gefunden, aber der Prozess zur Behebung ist nicht beschrieben. Backups und Notfallübungen sind nicht erwähnt. Eine Zertifizierung zeigt, dass ein System vorhanden ist, garantiert aber nicht, dass jede Maßnahme wirkt. |
| **Schutzziele** | Vertraulichkeit und Integrität: stark. Verfügbarkeit: über das ISMS grundsätzlich adressiert, aber nicht konkret belegt. |

| Verbesserungsvorschlag | Begründung und Wirkung |
| --- | --- |
| MFA für alle Konten, privilegierte Zugänge über ein Privileged-Access-Management | Schützt die wertvollsten Konten im Finanzbereich (8.2) |
| Feste Fristen für die Behebung gefundener Schwachstellen nach CVSS, Nachverfolgung bis zum Abschluss | Ein Scan ohne Behebung senkt kein Risiko (8.3.1) |
| TLS 1.2/1.3 für alle externen Verbindungen, Zero-Trust-Ansatz auch intern | IPsec schützt nur die Strecke zwischen Standorten (8.4.1) |
| Penetrationstests, SIEM mit Überwachung rund um die Uhr, regelmäßige Notfallübungen | Prüft die tatsächliche Wirksamkeit über die Zertifizierung hinaus; der Finanzsektor muss nach DORA seine digitale Widerstandsfähigkeit nachweisen (8.1.1, 8.4.2) |
| Awareness-Schulungen | Gegen Phishing und Social Engineering hilft Technik allein nicht |

**Vergleich:**

| Kriterium | A: TechCorp | B: HealthCare | C: FinServ |
| --- | --- | --- | --- |
| Vertraulichkeit | mittel | mittel (Backups kritisch) | hoch |
| Integrität | mittel | mittel | hoch |
| Verfügbarkeit | gering (keine Backups) | gering (wöchentlich, ungetestet) | mittel (nicht belegt) |
| Zugriffsschutz | gering (nur Passwort) | hoch (2FA) | nicht beschrieben |
| Richtlinien und Standards | keine | keine genannt | ISO 27001 |
| Risikomanagement | nicht erkennbar | nicht erkennbar | Teil des ISMS |
| Prüfungen und Audits | keine | keine | täglich automatisiert, Zertifizierungsaudits |
| Faktor Mensch | keine Schulungen | Phishing-Schulungen | nicht beschrieben |

**Ergebnis:** FinServ Inc. ist am besten aufgestellt. Entscheidend ist nicht eine einzelne Technik, sondern das ISMS nach ISO 27001. Es sorgt dafür, dass Risiken systematisch bewertet, Maßnahmen geplant und regelmäßig überprüft werden. Dazu kommen der stärkste Schlüsselschutz durch HSMs und die tägliche Schwachstellensuche. Lücken wie fehlende Angaben zu MFA oder Schulungen würden im ISMS-Kreislauf auffallen und behoben.

HealthCare Solutions liegt auf Platz zwei. Beim Zugriffsschutz und bei den Mitarbeitenden ist es sogar besser als FinServ, hat aber mit unverschlüsselten Backups von Gesundheitsdaten ein sehr hohes Einzelrisiko. TechCorp ist am schwächsten aufgestellt: Es setzt nur technische Grundmaßnahmen ein, ohne MFA, Backups, Richtlinien oder Prüfungen.

> **Kurz gesagt:** Gute IT-Sicherheit entsteht aus dem Zusammenspiel von Technik, Organisation und Menschen. Einzelne starke Maßnahmen helfen wenig, wenn an anderer Stelle eine große Lücke bleibt. Gestaffelte Verteidigung, ein systematisches Risikomanagement und regelmäßige Überprüfung machen den Unterschied.

</details>
