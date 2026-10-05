---
title: "PowerShell Basics für Administratoren"
description: "PowerShell kennenlernen, Cmdlets und Pipelines nutzen, saubere Skripte mit Parametern schreiben, Fehler abfangen und Skripte debuggen."
duration: "45 Minuten"
---

Nach der Bash in Kapitel 3 geht es jetzt um das wichtigste Automatisierungswerkzeug in Windows-Umgebungen. Dieses Kapitel zeigt Dir, was PowerShell ist und wie Du die ersten Schritte machst. Danach lernst Du die Syntax mit Cmdlets, Parametern und Pipelines kennen, schreibst Skripte mit einem sauberen Aufbau und erfährst, wie Du Fehler abfängst, findest und aus ihnen lernst. Zum Schluss warten ein Lückentext, eine Coding Challenge mit Musterlösung und das Fazit zu Modul 2.

## Entdecke die PowerShell

> **Definition:** **PowerShell** ist ein plattformübergreifendes Framework von Microsoft für Task-Automatisierung und Konfigurationsmanagement. Es besteht aus einer **Befehlszeilenschnittstelle (CLI)** und einer zugehörigen **Skriptsprache**. Ursprünglich für die Verwaltung von Windows entwickelt, läuft PowerShell heute auch unter Linux und macOS. Sie bietet eine große Sammlung spezieller Befehle (**Cmdlets**) für die Verwaltung von Systemen und Anwendungen und arbeitet **objektorientiert**, was eine präzise und flexible Verarbeitung von Daten ermöglicht.

PowerShell ist damit ein leistungsfähiges Werkzeug für die Automatisierung von Verwaltungsaufgaben, die Fernverwaltung und die Integration mit Microsoft-Produkten und Werkzeugen anderer Hersteller. Diese acht Aspekte machen sie aus:

| Nr. | Aspekt | Bedeutung |
| --- | --- | --- |
| 01 | **Cmdlets** | Spezielle Befehle (gesprochen „Command-lets“), technisch kleine .NET-Klassen, die je eine bestimmte Aufgabe erledigen, z. B. `Get-Process`, `Set-Service` oder `Get-EventLog` |
| 02 | **Pipelines** | Die Ausgabe eines Cmdlets wird zur Eingabe des nächsten. So lassen sich Befehle verketten und Daten Schritt für Schritt verarbeiten |
| 03 | **Objektorientiert** | Anders als traditionelle Shells, die Text verarbeiten, arbeitet PowerShell mit .NET-Objekten. Die Ausgabe eines Befehls hat Eigenschaften und Methoden, die weiterverarbeitet werden können |
| 04 | **Skriptsprache** | Komplexe Automatisierungen lassen sich als Skripte in Dateien mit der Endung `.ps1` speichern und ausführen |
| 05 | **Erweiterbarkeit** | Modularer Aufbau: Module von Microsoft und anderen Anbietern ergänzen Cmdlets, z. B. für Active Directory, Azure oder Microsoft 365 (früher Office 365) |
| 06 | **Remoting** | Befehle und Skripte auf entfernten Computern ausführen – ideal für große Netzwerke und Aufgaben auf vielen Maschinen gleichzeitig |
| 07 | **Versionsentwicklung** | Erste Version 2006. PowerShell Core war die plattformübergreifende Version auf Basis von .NET Core. Seit Version 7 heißt sie einfach **PowerShell** und vereinheitlicht die Funktionen über alle Betriebssysteme |
| 08 | **Integration** | Tief in Microsoft-Produkte wie Azure, Microsoft 365, Exchange und SharePoint eingebunden |

> **Kurz gesagt:** PowerShell ist ein mächtiges Werkzeug für die Automatisierung und Verwaltung von IT-Umgebungen. Objektorientierung, Modularität und Skriptfähigkeit machen es möglich, viele Aufgaben effizient und einheitlich zu erledigen.

Heute gibt es zwei Linien, die parallel installiert sein können:

| Merkmal | Windows PowerShell 5.1 | PowerShell 7.x |
| --- | --- | --- |
| Programm | `powershell.exe` | `pwsh.exe` (Linux/macOS: `pwsh`) |
| Plattform | Nur Windows, in Windows 10/11 und Server vorinstalliert | Windows, Linux, macOS |
| Grundlage | .NET Framework | Aktuelles .NET |
| Weiterentwicklung | Nur noch Fehlerbehebungen | Aktiv weiterentwickelt, neue Funktionen |
| Editor | Windows PowerShell ISE oder VS Code | VS Code mit PowerShell-Erweiterung |

> **Hinweis:** Einige ältere Cmdlets gibt es nur in Windows PowerShell 5.1. `Get-EventLog` fehlt zum Beispiel in PowerShell 7 – dort liest man Ereignisprotokolle mit `Get-WinEvent`, das in beiden Versionen funktioniert.

**Objekte statt Text:**

```powershell
Get-Service |
    Where-Object Status -eq 'Stopped' |       # Eigenschaft direkt abfragen
    Select-Object Name, DisplayName, StartType |
    Sort-Object Name

Get-Service | Get-Member                      # zeigt alle Eigenschaften und Methoden
```

In der Bash muss man Text mit `grep` und `cut` zerlegen. In PowerShell fragst Du einfach die Eigenschaft ab, z. B. `Status` oder `StartType`.

## Deine ersten Schritte

**PowerShell öffnen:** Auf den meisten Windows-Versionen ist PowerShell (in Version 5.1) bereits vorinstalliert. Gib „PowerShell“ in die Suche der Taskleiste ein und wähle das Programm aus. Für Verwaltungsaufgaben startest Du es am besten **als Administrator** (Rechtsklick → „Als Administrator ausführen“), damit Du vollen Zugriff auf alle Funktionen hast. Bist Du als normaler Benutzer angemeldet, fragt Windows dabei nach den Anmeldedaten eines Administratorkontos (z. B. Domänenbenutzer mit lokalen Administratorrechten).

**Linux und macOS:** Hier musst Du PowerShell zuerst herunterladen und installieren. Microsoft beschreibt das Schritt für Schritt:

- [PowerShell unter Linux installieren](https://learn.microsoft.com/de-de/powershell/scripting/install/installing-powershell-on-linux)
- [PowerShell unter macOS installieren](https://learn.microsoft.com/de-de/powershell/scripting/install/installing-powershell-on-macos)

Nach dem Start siehst Du ein Konsolenfenster – bei Windows PowerShell 5.1 klassisch blau, bei PowerShell 7 und im Windows-Terminal meist schwarz. Die Eingabeaufforderung zeigt den Pfad, in dem Du Dich gerade befindest, z. B. `PS C:\Users\anna>`. Steht im Fenstertitel „Administrator“, läuft die Sitzung mit erhöhten Rechten.

**Die ersten Befehle:** Ein guter Startpunkt ist `Get-Help`. Es erklärt, wie Befehle verwendet werden, und zeigt Beispiele. Probiere zum Beispiel `Get-Help Get-Command` – so erfährst Du, wie Du Informationen über andere Befehle findest, und bekommst einen ersten Eindruck davon, wie viel PowerShell kann.

```powershell
$PSVersionTable.PSVersion          # welche PowerShell-Version läuft?
Get-Help Get-Command               # Hilfe zu einem Befehl
Get-Command -Noun Service          # alle Befehle rund um Dienste
Get-Service | Select-Object -First 5
```

**Die drei wichtigsten Cmdlets zum Selbstlernen:**

| Cmdlet | Zweck | Beispiel |
| --- | --- | --- |
| `Get-Command` | Befehle finden | `Get-Command -Noun Service`, `Get-Command *firewall*` |
| `Get-Help` | Hilfe und Beispiele anzeigen | `Get-Help Get-Process -Examples`, `Update-Help` lädt aktuelle Hilfe |
| `Get-Member` | Eigenschaften und Methoden eines Objekts anzeigen | `Get-Process \| Get-Member` |

> **Tipp:** Wie bei jeder neuen Sprache ist Übung der Schlüssel. Beginne mit einfachen Befehlen und Skripten und steigere Dich langsam. Online-Tutorials, Foren und Bücher helfen beim Vertiefen. Ein guter Einstieg von Microsoft ist der Artikel [Erste Schritte mit PowerShell](https://learn.microsoft.com/de-de/powershell/scripting/learn/ps101/01-getting-started).

## Die Syntax der PowerShell

> **Definition:** **Syntax** bezeichnet die Regeln, nach denen Wörter und Symbole einer Sprache zu gültigen Sätzen und Ausdrücken kombiniert werden. In Programmiersprachen beschreibt sie die korrekte Anordnung von Schlüsselwörtern, Operatoren und anderen Elementen. Nur wenn die Syntax stimmt, kann der Computer den Code richtig interpretieren und ausführen.

In der PowerShell ist die Syntax der Schlüssel zu effizienter Systemverwaltung: Jeder Befehl folgt einem festen Muster. Wer dieses Muster versteht, kann Aufgaben präzise steuern und die Möglichkeiten der PowerShell voll ausschöpfen.

### Cmdlets: Das Herzstück der PowerShell

Die grundlegenden Befehle heißen **Cmdlets**. Jedes Cmdlet folgt dem Schema **Verb-Nomen**, getrennt durch einen Bindestrich. Daran erkennst Du sofort, was der Befehl tut:

- **Verb** (Tätigkeitswort): beschreibt die Aktion, z. B. `Get`, `Set`, `New`, `Remove`. Die Verben folgen einer einheitlichen Liste, das erleichtert Lernen und Merken.
- **Nomen** (Substantiv): nennt das Objekt, auf das sich die Aktion bezieht, z. B. `Item`, `Service`, `Process`.

```powershell
Get-ChildItem -Path C:\Logs -Filter *.log -Recurse
#   Verb-Nomen   Parameter  Wert
```

**Häufig genutzte Cmdlets für Administratoren:**

| Bereich | Cmdlets |
| --- | --- |
| Prozesse und Dienste | `Get-Process`, `Stop-Process`, `Get-Service`, `Start-Service`, `Restart-Service` |
| Dateien und Ordner | `Get-ChildItem`, `Copy-Item`, `Move-Item`, `Remove-Item`, `New-Item`, `Test-Path` |
| Dateiinhalte | `Get-Content`, `Set-Content`, `Add-Content`, `Import-Csv`, `Export-Csv` |
| System und Hardware | `Get-CimInstance`, `Get-ComputerInfo`, `Restart-Computer` |
| Ereignisprotokolle | `Get-WinEvent` (in Windows PowerShell 5.1 auch `Get-EventLog`) |
| Netzwerk | `Test-Connection`, `Test-NetConnection`, `Get-NetIPAddress`, `Invoke-RestMethod` |
| Benutzer | `Get-LocalUser`, `New-LocalUser`, im Active Directory `Get-ADUser`, `New-ADUser` |
| Fernwartung | `Invoke-Command`, `Enter-PSSession` |

### Aussagekräftige Cmdlet-Namen

Auch eigene Funktionen sollten wie Cmdlets heißen. Vergleiche diese beiden Varianten:

```powershell
# weniger aussagekräftig
$users = Get-UD
Set-Pwd -User $user -NewPwd $newPassword
Start-JS
Stop-JS

# aussagekräftig
$users = Get-UserDetails
Set-UserPassword -User $user -NewPassword $newPassword
Start-JobScheduler
Stop-JobScheduler
```

Ein Skript mit klaren, beschreibenden Namen ist leichter zu lesen und zu verstehen – besonders, wenn andere oder Du selbst es später warten oder ändern müssen. Eindeutige Namen verhindern außerdem, dass jemand das Skript falsch versteht oder falsch einsetzt.

**Praktische Tipps für aussagekräftige Namen:**

- **Verb-Nomen-Muster verwenden:** wie bei `Get-Process` oder `Start-Service`. Das fördert Lesbarkeit und Verständlichkeit.
- **Standardisierte Verben nutzen:** PowerShell hat eine Liste zugelassener Verben (z. B. `Get`, `Set`, `New`, `Remove`), die `Get-Verb` anzeigt und die Microsoft in der [Liste genehmigter Verben](https://learn.microsoft.com/de-de/powershell/scripting/developer/cmdlet/approved-verbs-for-windows-powershell-commands) dokumentiert. Module mit anderen Verben erzeugen beim Import eine Warnung.
- **Spezifisch sein:** `Get-SalesData` oder `Get-EmployeeData` statt `Get-Data`.
- **Keine Abkürzungen:** `Get-UserDetails` statt `Get-UD`.
- **Nomen im Singular:** `Get-Service`, nicht `Get-Services`, auch wenn mehrere Objekte zurückkommen.
- **PascalCase:** Jedes Wort beginnt mit einem Großbuchstaben, z. B. `Get-OldLogFile`.
- **Präfix gegen Namenskonflikte:** Ein Kürzel der Firma oder des Teams vor dem Nomen, z. B. `Get-ContosoUser`, verhindert Überschneidungen mit fremden Modulen.
- **Standard-Parameternamen:** `-Path`, `-Name`, `-ComputerName`, `-Credential`, `-Force` statt eigener Erfindungen wie `-Ordner` oder `-PC`.

| Verb | Bedeutung | Statt |
| --- | --- | --- |
| `Get` | Daten abrufen, ohne etwas zu ändern | Read, List, Show |
| `Set` | Vorhandenes ändern | Change, Modify, Update |
| `New` | Etwas Neues anlegen | Create, Make |
| `Remove` | Etwas löschen | Delete, Kill |
| `Add` | Zu etwas hinzufügen, z. B. Benutzer zu einer Gruppe | Append, Insert |
| `Start` / `Stop` | Vorgang oder Dienst starten bzw. beenden | Run, Launch, End |
| `Test` | Prüfen, gibt `$true` oder `$false` zurück | Check, Verify |
| `Invoke` | Aktion oder Befehl ausführen | Execute, Do |
| `Import` / `Export` | Daten aus einer Datei laden bzw. speichern | Load, Save |

| Unglücklicher Name | Besser | Grund |
| --- | --- | --- |
| `Delete-TempFiles` | `Remove-TempFile` | Zugelassenes Verb, Nomen im Singular |
| `CheckServer` | `Test-ServerConnection` | Verb-Nomen-Schema, aussagekräftiges Nomen |
| `Get-Data` | `Get-DiskSpace` | Nomen beschreibt genau, was zurückkommt |
| `Create-User` | `New-ContosoUser` | Zugelassenes Verb, Präfix vermeidet Konflikt mit `New-LocalUser` |

### Parameter: Die Feinabstimmung

Mit **Parametern** steuerst Du genau, was ein Cmdlet tut. Ein Parameter beginnt mit einem Bindestrich, danach folgt sein Wert. In `Get-WinEvent -LogName Application` ist `-LogName` der Parameter und `Application` sein Wert.

Viele Cmdlets kennen außerdem **allgemeine Parameter** (Common Parameters). Besonders nützlich sind `-WhatIf` (nur anzeigen, was passieren würde), `-Confirm` (vor jeder Änderung nachfragen), `-Verbose` (ausführliche Meldungen) und `-ErrorAction` (Verhalten bei Fehlern).

### Pipelines: Die Kraft der Kombination

Eines der mächtigsten Features ist die **Pipeline** (`|`). Sie gibt die Ausgabe eines Cmdlets direkt als Eingabe an das nächste weiter. So kombinierst Du mehrere Cmdlets zu komplexen Abfragen.

```powershell
Get-Process | Where-Object { $_.WorkingSet -gt 100MB } | Sort-Object WorkingSet -Descending
```

In diesem Beispiel listet `Get-Process` alle Prozesse auf, `Where-Object` behält nur die mit mehr als 100 MB Arbeitsspeicher, und `Sort-Object` sortiert sie absteigend nach Speicherverbrauch. `$_` steht dabei für das Objekt, das gerade durch die Pipeline läuft.

> **Achtung:** `100MB` wird ohne Leerzeichen geschrieben. PowerShell kennt die Einheiten `KB`, `MB`, `GB`, `TB` und `PB` als Zahlensuffix (`100MB` = 104.857.600 Byte). Mit Leerzeichen (`100 MB`) meldet PowerShell einen Fehler.

**Cmdlets für die Pipeline:**

| Cmdlet | Aufgabe |
| --- | --- |
| `Where-Object` | Objekte filtern |
| `Select-Object` | Eigenschaften auswählen, erste oder letzte Objekte nehmen |
| `Sort-Object` | Sortieren |
| `Group-Object` / `Measure-Object` | Gruppieren und zählen bzw. Summe, Durchschnitt, Minimum, Maximum berechnen |
| `ForEach-Object` | Für jedes Objekt eine Aktion ausführen |
| `Format-Table` / `Format-List` | Ausgabe auf dem Bildschirm formatieren, nur ganz am Ende der Pipeline verwenden |
| `Export-Csv` / `Out-File` | Ergebnis in eine Datei schreiben |

**Systemressourcen verwalten:** Systemressourcen effektiv zu verwalten ist eine Kernkompetenz in der Administration. Dazu gehören CPU-Auslastung, Speicherplatz, Netzwerkverkehr, Prozesse und Dienste sowie Sicherheitseinstellungen. Wer sie im Blick behält, vermeidet Engpässe, erhöht die Sicherheit und verbessert die Leistung. PowerShell ist dafür die ideale Plattform: Beginne mit einfachen Cmdlets wie im Pipeline-Beispiel oben und baue Deine Fähigkeiten Schritt für Schritt aus, bis Du komplexe Verwaltungsaufgaben automatisierst.

## Alias: Kurzbefehle für den schnellen Zugriff

Ein **Alias** ist ein zweiter, meist kürzerer Name für ein Cmdlet oder einen Befehl. Damit tippst Du schneller. So ist `dir` ein Alias für `Get-ChildItem`, das den Inhalt eines Verzeichnisses auflistet. Viele Aliase entsprechen bekannten Befehlen aus cmd und Bash, damit Umsteiger sofort zurechtkommen.

| Alias | Cmdlet | Herkunft |
| --- | --- | --- |
| `ls`, `dir`, `gci` | `Get-ChildItem` | Bash, cmd, PowerShell-Kurzform |
| `cd`, `sl` | `Set-Location` | Bash/cmd, Kurzform |
| `cat`, `type`, `gc` | `Get-Content` | Bash, cmd, Kurzform |
| `cp`, `copy` | `Copy-Item` | Bash, cmd |
| `rm`, `del` | `Remove-Item` | Bash, cmd |
| `ps` | `Get-Process` | Bash |
| `?`, `where` | `Where-Object` | PowerShell-Kurzform |
| `%`, `foreach` | `ForEach-Object` | PowerShell-Kurzform |
| `select`, `sort` | `Select-Object`, `Sort-Object` | PowerShell-Kurzform |

```powershell
Get-Alias ls                                  # wofür steht ls?
Get-Alias -Definition Get-ChildItem           # welche Aliase gibt es für Get-ChildItem?
Set-Alias -Name np -Value notepad.exe         # eigenen Alias anlegen
```

Selbst angelegte Aliase gelten nur bis zum Schließen der Sitzung. Dauerhaft werden sie, wenn Du sie in Dein Profil schreibst. Den Pfad zur Profildatei enthält die Variable `$PROFILE`.

**Aliase in der Konsole ja, im Skript nein:**

```powershell
# interaktiv: schnell getippt
gci C:\Logs -r | ? Length -gt 10MB | sort Length -desc | select -f 5

# im Skript: dieselbe Aufgabe, für jeden lesbar
Get-ChildItem -Path C:\Logs -Recurse |
    Where-Object Length -gt 10MB |
    Sort-Object -Property Length -Descending |
    Select-Object -First 5
```

> **Tipp:** In Skripten immer die vollständigen Cmdlet-Namen und Parameter verwenden. Aliase sind schwer lesbar und nicht überall gleich: In PowerShell 7 unter Linux sind `ls`, `cp` oder `sort` keine Aliase, sondern rufen die Linux-Programme auf. VS Code ersetzt Aliase per **Umschalt + Alt + E** automatisch durch die vollständigen Namen.

## PowerShell-Skripte: Automatisierung von Aufgaben

Mit Skripten eröffnet Dir PowerShell eine Welt voller Möglichkeiten für Systemverwaltung und Automatisierung. Typische Beispiele:

- **Dienste automatisch starten und stoppen:** Ein Skript prüft, ob bestimmte Dienste laufen, und startet oder stoppt sie bei Bedarf.
- **Berichte über Systemressourcen:** Speicherplatz oder CPU-Auslastung regelmäßig erfassen und auswerten.
- **Benutzerverwaltung:** Benutzerkonten nach festen Kriterien anlegen oder löschen, z. B. aus einer CSV-Datei.
- Außerdem: Logdateien bereinigen, Inventar- und Lizenzberichte erstellen oder Einstellungen auf vielen Rechnern gleichzeitig ändern.

Ein **PowerShell-Skript** ist eine Textdatei mit der Endung `.ps1`, die einen oder mehrere Befehle in der Reihenfolge enthält, in der sie ausgeführt werden. Alles, was in der Konsole funktioniert, funktioniert auch im Skript. Zum Schreiben eignen sich:

- **Visual Studio Code** mit der PowerShell-Erweiterung: Syntaxhervorhebung, Code-Vervollständigung und Debugger. Die Empfehlung für neue Skripte.
- **PowerShell ISE** (Integrated Scripting Environment): bei Windows dabei, funktioniert aber nur mit Windows PowerShell 5.1 und wird nicht mehr weiterentwickelt.

### Führe Dein Skript aus

Speichere Dein Skript mit der Endung `.ps1`, öffne die PowerShell-Konsole, wechsle in den Ordner des Skripts und starte es mit `.\DeinSkriptName.ps1`:

```powershell
.\Speicherbericht.ps1                       # im aktuellen Ordner: .\ ist Pflicht
& 'C:\Skripte\Mein Bericht.ps1'              # Pfad mit Leerzeichen: Aufruf-Operator &
powershell.exe -NoProfile -File C:\Skripte\Speicherbericht.ps1   # aus cmd oder Aufgabenplanung
```

Ein Doppelklick auf eine `.ps1`-Datei öffnet sie standardmäßig nur im Editor. Das ist eine bewusste Sicherheitsmaßnahme. Zusätzlich regelt die **Ausführungsrichtlinie** (Execution Policy), ob Skripte überhaupt laufen dürfen. Eventuell musst Du sie mit `Set-ExecutionPolicy` anpassen:

| Richtlinie | Bedeutung |
| --- | --- |
| `Restricted` | Keine Skripte erlaubt, nur einzelne Befehle. Standard auf Windows-Clients |
| `RemoteSigned` | Lokale Skripte laufen, aus dem Internet geladene müssen signiert sein. Standard auf Windows Server und gängige Empfehlung |
| `AllSigned` | Nur digital signierte Skripte laufen |
| `Unrestricted` | Alle Skripte laufen, bei Internet-Dateien mit Warnung |
| `Bypass` | Nichts wird blockiert, z. B. für geplante Aufgaben |

```powershell
Get-ExecutionPolicy -List                               # aktuelle Einstellungen je Bereich
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser     # nur für den eigenen Benutzer
Unblock-File .\Download.ps1                             # Internet-Markierung entfernen
```

> **Wichtig:** Die Ausführungsrichtlinie schützt vor versehentlichem Ausführen, sie ist aber keine Sicherheitsgrenze. Wer Rechte auf dem System hat, kann sie umgehen. Skripte aus unbekannten Quellen also immer erst lesen.

**Beispiel: Speicherplatzbericht als CSV:**

```powershell
# Speicherbericht.ps1 – freien Speicher aller lokalen Laufwerke als CSV speichern
$ziel = "C:\Berichte\Speicher_$(Get-Date -Format 'yyyy-MM-dd').csv"

Get-CimInstance -ClassName Win32_LogicalDisk -Filter 'DriveType=3' |
    Select-Object DeviceID,
        @{ Name = 'GroesseGB'; Expression = { [math]::Round($_.Size / 1GB, 1) } },
        @{ Name = 'FreiGB';    Expression = { [math]::Round($_.FreeSpace / 1GB, 1) } },
        @{ Name = 'FreiProzent'; Expression = { [math]::Round($_.FreeSpace / $_.Size * 100, 1) } } |
    Export-Csv -Path $ziel -NoTypeInformation -Delimiter ';' -Encoding UTF8

Write-Output "Bericht gespeichert: $ziel"
```

**Skript täglich automatisch ausführen:**

```powershell
$aktion    = New-ScheduledTaskAction -Execute 'powershell.exe' `
             -Argument '-NoProfile -ExecutionPolicy Bypass -File C:\Skripte\Speicherbericht.ps1'
$ausloeser = New-ScheduledTaskTrigger -Daily -At 6am
Register-ScheduledTask -TaskName 'Speicherbericht' -Action $aktion -Trigger $ausloeser
```

**Experimentiere mit weiteren Cmdlets:** Sobald Dein erstes Skript läuft, probiere weitere Cmdlets aus. Möchtest Du Informationen über Prozesse oder die Dateien eines Verzeichnisses? Suche mit `Get-Command` nach passenden Cmdlets wie `Get-Process` oder `Get-ChildItem` und baue sie in Deine Skripte ein.

## Beginnt ein PowerShell-Skript mit einer Shebang-Zeile, ähnlich wie ein Bash-Skript?

**Unter Windows nein.** Windows erkennt PowerShell-Skripte an der Dateiendung `.ps1` und startet sie mit PowerShell. Eine Shebang-Zeile wird nicht benötigt und deshalb meist weggelassen. Stünde sie trotzdem in der Datei, wäre sie harmlos, denn `#` leitet in PowerShell einen Kommentar ein.

**Unter Linux und macOS kann sie sinnvoll sein.** Die Shebang-Zeile `#!/usr/bin/env pwsh` sorgt dafür, dass das Skript mit `pwsh` ausgeführt wird, also mit PowerShell 7. Das ist besonders nützlich, wenn das Skript direkt von der Kommandozeile oder als Cronjob gestartet wird. Zusätzlich muss das Ausführrecht gesetzt sein:

```powershell
#!/usr/bin/env pwsh
Write-Output "Läuft unter $($PSVersionTable.OS)"
```

```bash
chmod +x info.ps1     # in der Bash: Ausführrecht setzen
./info.ps1            # direkt starten
```

Was die Shebang-Zeile in der Bash leistet, übernehmen in PowerShell die **#Requires-Anweisungen**. Sie legen nicht den Interpreter fest, prüfen aber vor dem Start, ob die Voraussetzungen erfüllt sind. Fehlt etwas, bricht das Skript mit einer klaren Meldung ab, bevor die erste Zeile läuft.

```powershell
#Requires -Version 5.1                 # mindestens diese PowerShell-Version
#Requires -RunAsAdministrator          # nur mit Administratorrechten
#Requires -Modules ActiveDirectory     # Modul muss vorhanden sein
```

| Aspekt | Bash | PowerShell |
| --- | --- | --- |
| Interpreter festlegen | Shebang `#!/bin/bash` | Dateiendung `.ps1`, unter Linux optional `#!/usr/bin/env pwsh` |
| Voraussetzungen prüfen | Manuell im Skript | `#Requires` |
| Ausführung erlauben | `chmod +x skript.sh` | Ausführungsrichtlinie, z. B. `RemoteSigned` |
| Starten | `./skript.sh` | `.\skript.ps1` |

## Womit beginnt man ein PowerShell-Skript?

PowerShell verlangt keine besondere erste Zeile – ein Skript darf direkt mit einem Befehl oder Kommentar beginnen. Einige Elemente am Anfang haben sich aber bewährt: Sie sind nicht vorgeschrieben, machen das Skript jedoch lesbarer, leichter wartbar und decken Fehler früh auf. Ein gut aufgebautes Skript beginnt deshalb in dieser Reihenfolge:

1. **#Requires-Anweisungen:** prüfen Version, Rechte und Module.
2. **Kommentare zur Dokumentation:** ein Block `<# … #>`, der beschreibt, was das Skript tut, wer es erstellt hat und welche Parameter es kennt.
3. **\[CmdletBinding()\] und param():** legen die Parameter fest.
4. **Import-Module:** lädt benötigte Module.
5. **Strenge Regeln:** `Set-StrictMode -Version Latest` und `$ErrorActionPreference = 'Stop'`.
6. **Variablen und Funktionen:** Einstellungen und wiederverwendbare Teile.
7. **Hauptteil:** der eigentliche Ablauf, mit Fehlerbehandlung.

> **Merke:** Der `param`-Block muss die **erste ausführbare Anweisung** sein. Davor dürfen nur Kommentare, die Hilfe und `#Requires` stehen. Steht vorher bereits ein Befehl, z. B. `Set-StrictMode` oder `Import-Module`, erkennt PowerShell die Parameter nicht mehr.

### Kommentare zur Dokumentation

Ein einleitender Kommentarblock beschreibt Zweck, Autor und Parameter des Skripts. Kommentare im Code erleichtern das Verständnis, wenn Du später Änderungen vornimmst oder andere Dein Skript verwenden. Schreibst Du den Kopf als **kommentarbasierte Hilfe** mit `.SYNOPSIS`, `.DESCRIPTION`, `.PARAMETER` und `.EXAMPLE`, zeigt `Get-Help .\skript.ps1` sogar eine richtige Hilfe an.

```powershell
# Einzeiliger Kommentar

<#
  Mehrzeiliger Kommentar,
  z. B. für den Skriptkopf
#>
```

### Import-Module

**Module** sind Sammlungen von Cmdlets, Funktionen, Variablen und anderen Ressourcen. Sie ordnen wiederverwendbaren Code, machen ihn teilbar und erweitern PowerShell über die eingebauten Cmdlets hinaus. Benötigt ein Skript bestimmte Module, importierst Du sie am Anfang.

| Modultyp | Inhalt | Dateiendung |
| --- | --- | --- |
| Script Module | PowerShell-Code (Funktionen, Variablen) | `.psm1` |
| Binary Module | .NET-Assembly, typischerweise in C# geschrieben | `.dll` |
| Manifest Module | Metadaten über das Modul (Version, Autor, Abhängigkeiten) | `.psd1` |
| Dynamic Module | Wird zur Laufzeit erzeugt, z. B. mit `New-Module`, und nicht als Datei gespeichert | – |

Module am Anfang zu importieren hat drei Vorteile:

- **Verfügbarkeit:** Alle Cmdlets und Funktionen des Moduls stehen während der gesamten Ausführung bereit. So vermeidest Du Fehler durch nicht geladene Befehle.
- **Klarheit und Wartbarkeit:** Wer das Skript liest, sieht sofort, welche externen Abhängigkeiten es hat.
- **Weniger Laufzeitfehler:** Fehlt ein Modul, fällt das gleich zu Beginn auf – nicht erst mitten in der Ausführung, wenn vielleicht schon die Hälfte der Änderungen erledigt ist.

```powershell
Import-Module ActiveDirectory -ErrorAction Stop   # bricht sofort ab, wenn das Modul fehlt
Get-Module -ListAvailable                         # welche Module sind installiert?
Install-Module PSScriptAnalyzer -Scope CurrentUser   # Modul aus der PowerShell Gallery installieren
```

**Vorlage für ein PowerShell-Skript:**

```powershell
#Requires -Version 5.1

<#
.SYNOPSIS
    Bereinigt alte Logdateien in einem Ordner.
.DESCRIPTION
    Löscht alle .log-Dateien, die älter als die angegebene Anzahl Tage sind,
    und protokolliert jede Löschung.
.PARAMETER Path
    Ordner mit den Logdateien.
.PARAMETER Days
    Mindestalter in Tagen. Standard: 30.
.EXAMPLE
    .\Clear-OldLog.ps1 -Path D:\Logs -Days 14 -WhatIf
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)]
    [string]$Path,

    [int]$Days = 30
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---- Hauptteil --------------------------------------------------
$grenze = (Get-Date).AddDays(-$Days)
Get-ChildItem -Path $Path -Filter *.log -File |
    Where-Object LastWriteTime -lt $grenze |
    Remove-Item -WhatIf:$WhatIfPreference -Verbose
```

## Set-StrictMode

PowerShell ist standardmäßig sehr nachsichtig. Ein Tippfehler in einem Variablennamen erzeugt keinen Fehler, sondern liefert einfach einen leeren Wert. Solche Fehler fallen oft erst spät auf. Das Cmdlet `Set-StrictMode` schaltet strengere Regeln ein und macht aus stillen Fehlern echte Fehlermeldungen. So werden Skripte robuster und es fallen ungenaue Programmierpraktiken früh auf.

```powershell
$benutzername = 'anna'
Write-Output "Hallo $benutzernme"      # Tippfehler: Ausgabe "Hallo " ohne Warnung

Set-StrictMode -Version Latest
Write-Output "Hallo $benutzernme"
# Fehler: Die Variable "$benutzernme" kann nicht abgerufen werden,
#         weil sie nicht festgelegt wurde.
```

Es gibt mehrere Stufen, jede strenger als die vorige:

| Einstellung | Verbietet |
| --- | --- |
| `-Off` | Nichts – der strenge Modus ist ausgeschaltet (Standard) |
| `-Version 1.0` | Nicht zugewiesene Variablen, außer innerhalb von Zeichenketten |
| `-Version 2.0` | Zusätzlich: nicht zugewiesene Variablen auch in Zeichenketten, nicht vorhandene Eigenschaften eines Objekts, Funktionsaufrufe in Methodenschreibweise wie `f(1,2)` |
| `-Version 3.0` | Zusätzlich: Zugriff auf Array-Elemente außerhalb des gültigen Bereichs |
| `-Version Latest` | Immer die strengste Version der installierten PowerShell. Empfehlung für neue Skripte |

`Set-StrictMode` gilt für den Bereich, in dem es aufgerufen wird, und alle darunterliegenden, also z. B. für ein Skript und seine Funktionen. Es ersetzt keine Fehlerbehandlung: Der Strict Mode findet **Programmierfehler**, `try/catch` behandelt **Laufzeitfehler** wie eine fehlende Datei.

## Parameter-Deklarationen

**Skript-Parameter** sind Eingaben, die Du einem Skript beim Aufruf übergibst, um sein Verhalten zu steuern. Statt feste Werte im Code zu ändern, übergibst Du sie beim Start. Das macht ein Skript flexibel und wiederverwendbar. Parameter werden mit dem Schlüsselwort `param` am Anfang des Skripts definiert:

```powershell
param (
    [string]$Name,
    [int]$Age,
    [bool]$IsAdmin
)
# Skriptlogik hier
Write-Host "Name: $Name"
Write-Host "Age: $Age"
Write-Host "IsAdmin: $IsAdmin"
```

**Erklärung der einzelnen Teile:**

| Nr. | Teil | Erklärung |
| --- | --- | --- |
| 01 | `param` | Schlüsselwort, das die Parameter des Skripts einleitet |
| 02 | Parameter-Deklaration | In den runden Klammern nach `param` stehen die Parameter, jeweils mit Datentyp und Namen |
| 03 | `[string]$Name` | Erwartet eine **Zeichenkette** (String): Text aus Buchstaben, Ziffern, Symbolen und Leerzeichen, z. B. Wörter oder Sätze |
| 04 | `[int]$Age` | Erwartet eine **Ganzzahl** (Integer): eine Zahl ohne Nachkommastellen, positiv, negativ oder null |
| 05 | `[bool]$IsAdmin` | Erwartet einen **booleschen Wert**: nur `$true` (wahr) oder `$false` (falsch). Solche Werte steuern Entscheidungen im Programmablauf |
| 06 | `# Skriptlogik hier` | Kommentar: Hier steht der eigentliche Code, im Beispiel nur einfache Ausgaben |
| 07–09 | `Write-Host "Name: $Name"` usw. | Gibt den Wert des jeweiligen Parameters in der Konsole aus |

```powershell
.\Benutzer.ps1 -Name 'Anna' -Age 34 -IsAdmin $true
# Name: Anna
# Age: 34
# IsAdmin: True
```

So arbeitet dasselbe Skript mit beliebigen Eingaben, ohne dass Du den Code ändern musst.

> **Tipp:** Für Ja/Nein-Schalter ist `[switch]` praktischer als `[bool]`. Ein `[switch]$IsAdmin` ist gesetzt, sobald Du `-IsAdmin` angibst – ganz ohne `$true`. Bei `[bool]` musst Du den Wert immer mitgeben.

**Weitere Möglichkeiten bei Parametern:**

| Element | Wirkung | Beispiel |
| --- | --- | --- |
| Datentyp | Wandelt die Eingabe um oder meldet einen Fehler | `[string]`, `[int]`, `[datetime]`, `[string[]]` (Liste) |
| Standardwert | Wird verwendet, wenn nichts übergeben wird | `[int]$Days = 30` |
| `[switch]` | Schalter ohne Wert, ist gesetzt oder nicht | `[switch]$Recurse`, Aufruf mit `-Recurse` |
| `Mandatory` | Pflichtparameter, PowerShell fragt nach, wenn er fehlt | `[Parameter(Mandatory)]` |
| `Position` | Wert darf ohne Parameternamen übergeben werden | `[Parameter(Position = 0)]` |
| `ValueFromPipeline` | Wert kann aus der Pipeline kommen | `'srv01' \| .\skript.ps1` |

**Prüfattribute** stellen sicher, dass nur gültige Werte übergeben werden – noch bevor der Code läuft:

| Prüfattribut | Prüft | Beispiel |
| --- | --- | --- |
| `ValidateSet` | Wert aus einer festen Liste | `[ValidateSet('Dev','Test','Prod')]` |
| `ValidateRange` | Zahl in einem Bereich | `[ValidateRange(1, 3650)]` |
| `ValidateNotNullOrEmpty` | Wert ist nicht leer | `[ValidateNotNullOrEmpty()]` |
| `ValidatePattern` | Wert passt zu einem regulären Ausdruck | `[ValidatePattern('^SRV\d{2}$')]` |
| `ValidateLength` | Länge einer Zeichenkette | `[ValidateLength(3, 20)]` |
| `ValidateScript` | Beliebige eigene Prüfung | `[ValidateScript({ Test-Path $_ })]` |

**Beispiel: Funktion mit geprüften Parametern:**

```powershell
function Remove-OldFile {
    [CmdletBinding(SupportsShouldProcess)]       # aktiviert -WhatIf und -Confirm
    param(
        [Parameter(Mandatory, Position = 0, HelpMessage = 'Zielordner')]
        [ValidateScript({ Test-Path $_ -PathType Container })]
        [string]$Path,

        [ValidateRange(1, 3650)]
        [int]$Days = 30,

        [ValidateSet('*.log', '*.tmp', '*.bak')]
        [string]$Filter = '*.log',

        [switch]$Recurse
    )

    $grenze = (Get-Date).AddDays(-$Days)
    Get-ChildItem -Path $Path -Filter $Filter -File -Recurse:$Recurse |
        Where-Object LastWriteTime -lt $grenze |
        ForEach-Object {
            if ($PSCmdlet.ShouldProcess($_.FullName, 'Löschen')) {
                Remove-Item -Path $_.FullName
                Write-Verbose "Gelöscht: $($_.Name)"
            }
        }
}

Remove-OldFile D:\Logs -Days 14 -WhatIf      # zeigt nur an, was gelöscht würde
Remove-OldFile D:\Logs -Days 0               # Fehler: unter dem Minimum
Remove-OldFile D:\Logs -Filter *.exe         # Fehler: nicht in ValidateSet
```

Durch `[CmdletBinding()]` verhält sich ein Skript oder eine Funktion wie ein echtes Cmdlet und erhält automatisch die allgemeinen Parameter wie `-Verbose` und `-ErrorAction`. Mit `SupportsShouldProcess` kommen `-WhatIf` und `-Confirm` hinzu.

## Fehlerbehandlung und Debugging in PowerShell

**Fehlerbehandlung** (Exception Handling) bedeutet, vorherzusehen, welche Fehler auftreten können, und festzulegen, wie das Skript darauf reagiert. So ist es auf Probleme während der Ausführung vorbereitet und läuft stabil und zuverlässig. PowerShell unterscheidet zwei Arten von Fehlern – das ist der wichtigste Punkt für eine funktionierende Fehlerbehandlung:

| Fehlerart | Verhalten | Beispiel |
| --- | --- | --- |
| Nicht abbrechender Fehler (non-terminating error) | Fehlermeldung wird ausgegeben, das Skript läuft weiter. `try/catch` greift **nicht** | `Get-ChildItem` auf einen fehlenden Ordner, `Stop-Process` auf einen bereits beendeten Prozess |
| Abbrechender Fehler (terminating error) | Ausführung stoppt sofort, `try/catch` kann ihn abfangen | Syntaxfehler, `throw`, Fehler mit `-ErrorAction Stop` |

**Die Mechanismen im Überblick:**

| Nr. | Mechanismus | Aufgabe |
| --- | --- | --- |
| 01 | `try` | Enthält den Code, der einen Fehler verursachen könnte |
| 02 | `catch` | Tritt im `try`-Block ein Fehler auf, springt die Ausführung hierher. Hier legst Du fest, wie reagiert wird |
| 03 | `finally` | Läuft nach `try` und `catch` immer – egal, ob ein Fehler auftrat. Ideal zum Aufräumen, z. B. Verbindungen schließen |
| 04 | `-ErrorAction` | Steuert das Verhalten bei Fehlern für einzelne Cmdlets, z. B. `Continue`, `Stop`, `SilentlyContinue`, `Inquire` |
| 05 | `-ErrorVariable` | Speichert Fehler eines Cmdlets in einer eigenen Variable, um später darauf zuzugreifen |
| 06 | `$Error` | Automatische Variable mit einer Liste der zuletzt aufgetretenen Fehler. `$Error[0]` ist der neueste |
| 07 | `ValidateSet` und `ValidateRange` | Prüfen Parameterwerte, bevor der Code ausgeführt wird (siehe Parameter-Deklarationen) |

> **Hinweis:** `try`, `catch` und `finally` sind keine Cmdlets, sondern **Schlüsselwörter** der Sprache – genau wie `if` oder `foreach`.

Damit `catch` auch nicht abbrechende Fehler erhält, wandelst Du sie mit `-ErrorAction Stop` (für einen Befehl) oder `$ErrorActionPreference = 'Stop'` (für das ganze Skript) in abbrechende Fehler um.

| Wert für -ErrorAction | Wirkung |
| --- | --- |
| `Continue` | Fehler anzeigen und weitermachen (Standard) |
| `Stop` | Fehler wird abbrechend, `catch` greift |
| `SilentlyContinue` | Fehler nicht anzeigen, aber in `$Error` speichern und weitermachen |
| `Ignore` | Fehler vollständig ignorieren |
| `Inquire` | Benutzer fragen, wie es weitergehen soll |

**try, catch und finally:**

```powershell
$log = 'C:\Logs\import.log'
try {
    $daten = Get-Content -Path 'C:\Import\benutzer.csv' -ErrorAction Stop
    Add-Content $log "$(Get-Date -Format s) $($daten.Count) Zeilen gelesen"
}
catch [System.Management.Automation.ItemNotFoundException] {
    Write-Warning "Importdatei fehlt: $($_.Exception.Message)"    # spezieller Fehler zuerst
}
catch {
    Write-Error "Unerwarteter Fehler: $($_.Exception.Message)"   # alle anderen Fehler
    throw                                                        # Fehler weitergeben
}
finally {
    Add-Content $log "$(Get-Date -Format s) Import beendet"       # läuft immer
}
```

**ErrorVariable und $Error:**

```powershell
Get-ChildItem C:\GibtEsNicht, C:\Windows -ErrorAction SilentlyContinue -ErrorVariable fehler
"$($fehler.Count) Fehler aufgetreten"     # ohne $ beim Namen hinter -ErrorVariable
$Error[0].Exception.Message               # Meldung des neuesten Fehlers der Sitzung
```

| Hilfsmittel | Bedeutung |
| --- | --- |
| `$_` im `catch`-Block | Der aktuelle Fehler. `$_.Exception.Message` enthält die Meldung |
| `$?` | `$true`, wenn der letzte Befehl erfolgreich war |
| `$LASTEXITCODE` | Exit-Code des zuletzt gestarteten externen Programms, wie `$?` in der Bash |
| `throw` | Eigenen abbrechenden Fehler auslösen, z. B. `throw 'Konfiguration fehlt'` |
| `Write-Error` | Nicht abbrechenden Fehler ausgeben |

Wer sich gründlich in Fehlerbehandlung und Debugging einarbeitet, schreibt stabilere Skripte und spart langfristig viel Zeit bei der Fehlersuche. Beginne mit den Grundlagen und entwickle Dich von dort zu komplexeren Szenarien weiter.

**Bezug zu den Übungen:** Die Übung `Uebungen_30.09/Ueb1` zeigt Fehlerbehandlung mit `try/catch` in fünf typischen Situationen: Dateizugriff, Netzwerkverbindung, Benutzereingabe, Datenbankabfrage und Verschieben einer Dateiliste.

## Wie Du Fehler in Deinen Skripten findest und behebst

**Debugging** ist ein unverzichtbarer Teil der Entwicklung und Wartung von Skripten: Du findest und behebst Fehler, bevor sie größere Probleme verursachen. PowerShell bietet dafür drei wichtige Hilfsmittel.

### Breakpoints setzen

**Breakpoints** (Haltepunkte) halten ein Skript an einer bestimmten Stelle an, damit Du seinen Zustand untersuchen kannst. In PowerShell gibt es drei Arten:

| Art | Hält an, wenn … | Beispiel |
| --- | --- | --- |
| Zeile | eine bestimmte Zeile erreicht wird | `Set-PSBreakpoint -Script .\skript.ps1 -Line 12` |
| Variable | eine Variable gelesen oder geändert wird | `Set-PSBreakpoint -Script .\skript.ps1 -Variable grenze -Mode Write` |
| Befehl | ein bestimmter Befehl ausgeführt wird | `Set-PSBreakpoint -Script .\skript.ps1 -Command Remove-Item` |

Am Haltepunkt kannst Du Variablen abfragen, mit `s` (Step Into) Zeile für Zeile weitergehen und mit `c` (Continue) fortfahren. `Get-PSBreakpoint` zeigt alle Haltepunkte, `Remove-PSBreakpoint` entfernt sie.

### Grafisch debuggen in ISE und VS Code

Die **PowerShell ISE** bietet eine visuelle Umgebung: Ein Klick in den linken Rand neben dem Code setzt oder entfernt einen Breakpoint, und Du kannst Schritt für Schritt durch das Skript gehen. So siehst Du die Reihenfolge der Ausführung und wie sich Variablenwerte ändern. In **Visual Studio Code** funktioniert das genauso, auch mit PowerShell 7: **F9** setzt einen Haltepunkt, **F5** startet, **F10** führt die nächste Zeile aus, **F11** springt in eine Funktion. Die Variablenwerte stehen im Seitenfenster.

### Write-Host und Write-Verbose

Mit Ausgaben im Code verfolgst Du den Ablauf Deines Skripts:

- `Write-Host` schreibt direkt in die Konsole – schnell, aber die Ausgabe erscheint immer.
- `Write-Verbose` liefert ausführlichere Informationen, die nur erscheinen, wenn Du das Skript mit dem Parameter **-Verbose** startest. Im normalen Betrieb bleibt die Ausgabe sauber.

```powershell
[CmdletBinding()]
param([string]$Path = 'C:\Logs')
Write-Verbose "Durchsuche $Path ..."
$dateien = Get-ChildItem -Path $Path -File
Write-Verbose "$($dateien.Count) Dateien gefunden"
```

Aufruf mit `.\skript.ps1 -Verbose` zeigt die Meldungen, ohne `-Verbose` bleiben sie verborgen.

**Weitere Debugging-Werkzeuge:**

| Werkzeug | Einsatz |
| --- | --- |
| `Write-Debug` | Meldungen, die nur mit `-Debug` erscheinen |
| `Set-PSDebug -Trace 1` | Zeigt jede ausgeführte Zeile, ähnlich wie `bash -x` |
| `-WhatIf` | Zeigt, was ein Befehl ändern würde, ohne es zu tun |
| PSScriptAnalyzer | Findet typische Fehler, bevor das Skript läuft (siehe unten) |

### Vorgehen bei der Fehlersuche

Fehlersuche gelingt am schnellsten mit einem festen Vorgehen statt mit Ausprobieren:

1. **Meldung genau lesen:** Sie nennt Zeile, Spalte und Ursache. `$Error[0] | Format-List * -Force` zeigt alle Details.
2. **Fehler reproduzieren:** Mit denselben Eingaben erneut ausführen. Tritt er immer auf oder nur manchmal?
3. **Eingrenzen:** Verdächtige Zeilen einzeln in der Konsole ausführen. In VS Code führt **F8** die markierte Auswahl aus.
4. **Werte prüfen:** Mit Haltepunkten, `Write-Verbose`, `.GetType()` oder `Get-Member` nachsehen, was in den Variablen wirklich steht.
5. **Ursache beheben:** Eine Änderung nach der anderen und nach jeder Änderung erneut testen.
6. **Absichern:** `Set-StrictMode`, Prüfattribute an Parametern und Tests verhindern, dass der Fehler wiederkommt.

**Typische Fehler und ihre Lösung:**

| Fehlerbild | Ursache | Lösung |
| --- | --- | --- |
| „Die Ausführung von Skripts ist auf diesem System deaktiviert“ | Ausführungsrichtlinie ist `Restricted` | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| „… wurde nicht als Name eines Cmdlet … erkannt“ beim Skriptstart | `.\` vor dem Skriptnamen fehlt | `.\skript.ps1` |
| Plötzlich liegt eine Datei namens „10“ im Ordner | `>` statt `-gt` verwendet: `>` leitet in eine Datei um | Vergleichsoperatoren `-eq`, `-ne`, `-gt`, `-lt` verwenden |
| Variable ist leer, obwohl ein Wert zugewiesen wurde | Tippfehler im Variablennamen | `Set-StrictMode -Version Latest` |
| `catch` wird nie ausgeführt | Nicht abbrechender Fehler | `-ErrorAction Stop` ergänzen |
| CSV enthält unverständliche Zeilen statt Daten | `Format-Table` vor `Export-Csv` | `Format-*` nur ganz am Ende und nie vor dem Export |
| Umlaute erscheinen als „Ã¤“ | Datei ohne BOM gespeichert, Windows PowerShell 5.1 liest sie als ANSI | Skript als „UTF-8 mit BOM“ speichern |

**Beispiel für einen versteckten Fehler:**

```powershell
$frei = 8
if ($frei > 10) { 'Genug Platz' }      # falsch: erzeugt die Datei "10", Bedingung ist immer falsch
if ($frei -gt 10) { 'Genug Platz' }    # richtig: Vergleichsoperator
```

Viele solche Fehler findet das Modul **PSScriptAnalyzer**, bevor das Skript überhaupt läuft. Es prüft auch, ob Aliase oder nicht zugelassene Verben verwendet werden. VS Code nutzt es automatisch und unterstreicht die betroffenen Stellen.

```powershell
Install-Module PSScriptAnalyzer -Scope CurrentUser
Invoke-ScriptAnalyzer -Path .\skript.ps1
```

## Lernen aus Fehlern

Fehler sind beim Entwickeln von Skripten unvermeidlich. Sie sind aber auch eine Chance: Jeder Fehler zeigt Dir etwas über die Funktionsweise von PowerShell und die Anforderungen Deiner Aufgabe.

**Analyse nach dem Fehler:** Nimm Dir nach der Behebung Zeit für eine kurze Auswertung:

- **Ursache:** Was genau hat den Fehler verursacht? Ein Syntaxfehler, ein logischer Fehler oder ein Missverständnis, wie eine Funktion arbeitet?
- **Lösungsstrategie:** Welche Schritte haben zur Lösung geführt? War ein Breakpoint an einer bestimmten Stelle entscheidend, oder hat eine bestimmte Ausgabe den Fehler sichtbar gemacht?
- **Dokumentation:** Halte Deine Erkenntnisse fest. Das hilft Dir bei künftigen Problemen und Deinem Team gleich mit.

**Präventive Maßnahmen:** Nutze das Gelernte, um Fehler künftig zu verhindern:

- **Validierung:** Eingaben und Zustände prüfen, damit Fehler früh auffallen, z. B. mit Prüfattributen und `Test-Path`.
- **Bessere Fehlerbehandlung:** Eigene `catch`-Blöcke für bekannte Fehlerarten machen Skripte robuster und Meldungen aussagekräftiger.
- **Modularer Code:** Kleinere, wiederverwendbare Funktionen und Module erleichtern die Fehlersuche erheblich.

**Kontinuierliches Lernen:**

- **Community-Foren:** Erfahrungen teilen und aus den Problemen anderer lernen.
- **Schulungen und Kurse:** Mit aktuellen Best Practices auf dem Laufenden bleiben.
- **Experimentieren:** In einer Testumgebung neue Techniken ausprobieren, ohne Schaden anzurichten.

> **Merke:** Das Ziel ist nicht, fehlerfreie Skripte zu schreiben – das ist nahezu unmöglich. Das Ziel ist, aus jedem Fehler zu lernen und dieses Wissen für die nächsten Skripte zu nutzen.

## Übung: Lückentext PowerShell-Grundlagen

**Aufgabe:** Fülle die Lücken im folgenden Text aus. So prüfst Du Dein Verständnis der PowerShell-Grundlagen und der Unterschiede und Gemeinsamkeiten zu Bash und Shell-Scripting.

PowerShell ist ein plattformübergreifendes **(1) ________** und Konfigurationsmanagement-Framework von **(2) ________**, das aus einer **(3) ________** und einer zugehörigen **(4) ________** besteht. Im Gegensatz zu traditionellen Shells wie Bash, die Text verarbeiten, arbeitet PowerShell mit **(5) ________**. Das bedeutet, dass die Ausgabe von Befehlen als **(6) ________** behandelt wird, die Eigenschaften und **(7) ________** haben.

Die grundlegenden Befehle in PowerShell werden als **(8) ________** (ausgesprochen „Command-Lets“) bezeichnet. Jedes Cmdlet folgt einer Benennungskonvention, die aus einem **(9) ________** und einem **(10) ________** besteht, getrennt durch einen Bindestrich. Beispiele hierfür sind **(11) ________**, **(12) ________** oder **(13) ________**.

Ein wesentliches Konzept in PowerShell ist die **(14) ________**, die es ermöglicht, die Ausgabe eines Cmdlets als **(15) ________** für ein anderes Cmdlet zu verwenden. Dies erleichtert das **(16) ________** von Befehlen und die Verarbeitung von Daten.

PowerShell ist modular aufgebaut, was bedeutet, dass Nutzende **(17) ________** hinzufügen können, um die Funktionalität zu erweitern. Microsoft und Drittanbieter bieten zahlreiche Module für spezifische Aufgaben an, wie die Verwaltung von **(18) ________**, **(19) ________** oder **(20) ________**.

Ein weiteres leistungsfähiges Feature von PowerShell ist die Möglichkeit, Befehle und Skripte auf **(21) ________** Computern auszuführen. Dies wird als **(22) ________** bezeichnet und ist besonders nützlich für die Verwaltung großer Netzwerke und die Durchführung von Aufgaben auf mehreren Maschinen gleichzeitig.

Im Vergleich zu Bash bietet PowerShell eine **(23) ________** und **(24) ________** Syntax. Während Bash hauptsächlich in **(25) ________**-Umgebungen verwendet wird, kann PowerShell auf **(26) ________**, **(27) ________** und **(28) ________** betrieben werden.

Um mit PowerShell zu beginnen, öffnet man zunächst die PowerShell-Umgebung. Auf den meisten **(29) ________**-Versionen ist PowerShell bereits vorinstalliert. Um PowerShell zu öffnen, kann man einfach „PowerShell“ in die Suche der **(30) ________** eingeben und das Programm auswählen. Es empfiehlt sich, als **(31) ________** zu starten, um vollen Zugriff auf alle Funktionen zu haben.

Ein guter Startpunkt ist der Befehl **(32) ________**, der eine Übersicht über die Nutzung von Befehlen und die Hilfe gibt. Durch das Erlernen der PowerShell-Basics kannst Du Deine **(33) ________**-Fähigkeiten erweitern und die **(34) ________** Deiner IT-Verwaltungsaufgaben erheblich steigern.

<details>
<summary>Lösung anzeigen</summary>

| Lücke | Lösung | Lücke | Lösung |
| --- | --- | --- | --- |
| 1 | Task-Automatisierungs- | 18 | Active Directory |
| 2 | Microsoft | 19 | Azure |
| 3 | Befehlszeilenschnittstelle | 20 | Office 365 (heute Microsoft 365) |
| 4 | Skriptsprache | 21 | entfernten |
| 5 | .NET-Objekten | 22 | Remoting |
| 6 | Objekte | 23 | präzisere |
| 7 | Methoden | 24 | flexiblere |
| 8 | Cmdlets | 25 | Unix/Linux |
| 9 | Verb | 26 | Windows |
| 10 | Nomen | 27 | Linux |
| 11 | `Get-Process` | 28 | macOS |
| 12 | `Set-Service` | 29 | Windows |
| 13 | `Get-EventLog` | 30 | Taskleiste |
| 14 | Pipeline | 31 | Administrator |
| 15 | Eingabe | 32 | `Get-Help` |
| 16 | Verketten | 33 | Skripting |
| 17 | Module | 34 | Effizienz |

Bei 11 bis 13, 18 bis 20 und 26 bis 28 ist die Reihenfolge beliebig. Bei 11 bis 13 sind auch andere Cmdlets richtig, z. B. `Get-Service` oder `Get-ChildItem`.

</details>

## Coding Challenge

**Aufgabe:** Erstelle ein PowerShell-Skript, das Prozesse mit hohem Speicherverbrauch anzeigt. Das Skript soll einen Parameter `-MinMemory` definieren, der den minimalen Arbeitsspeicher in Megabyte angibt (Standardwert: 100 MB). Das Skript soll alle laufenden Prozesse abrufen, jene filtern, die mehr als den angegebenen Arbeitsspeicher belegen, diese absteigend nach ihrem Speicherverbrauch sortieren und schließlich für jeden Prozess den Namen sowie den benutzten Arbeitsspeicher (in MB) auf der Konsole ausgeben.

**Vorgehen:**

1. Parameter `-MinMemory` vom Typ `[int]` mit Standardwert 100 deklarieren und negative Werte mit `ValidateRange` ausschließen.
2. Die Grenze von Megabyte in Byte umrechnen, denn PowerShell liefert den Speicher in Byte. Dafür gibt es die Konstante `1MB` (1.048.576).
3. Mit `Get-Process` alle Prozesse abrufen und mit `Where-Object` nach der Eigenschaft `WorkingSet64` filtern.
4. Mit `Sort-Object -Descending` absteigend sortieren.
5. Für jeden Prozess Name und Speicher in MB ausgeben.

<details>
<summary>Musterlösung anzeigen</summary>

**Musterlösung (Get-HighMemoryProcess.ps1):**

```powershell
<#
.SYNOPSIS
    Zeigt Prozesse an, die mehr Arbeitsspeicher belegen als angegeben.
.PARAMETER MinMemory
    Minimaler Arbeitsspeicher in Megabyte. Standard: 100 MB.
.EXAMPLE
    .\Get-HighMemoryProcess.ps1 -MinMemory 500
#>
[CmdletBinding()]
param(
    [ValidateRange(0, 1048576)]
    [int]$MinMemory = 100
)

Set-StrictMode -Version Latest

$grenzeBytes = [long]$MinMemory * 1MB          # MB in Byte umrechnen

$prozesse = Get-Process |
    Where-Object { $_.WorkingSet64 -gt $grenzeBytes } |
    Sort-Object -Property WorkingSet64 -Descending

if (-not $prozesse) {
    Write-Output "Kein Prozess belegt mehr als $MinMemory MB."
    return
}

Write-Output ('{0,-30} {1,15}' -f 'Prozess', 'Speicher (MB)')
foreach ($prozess in $prozesse) {
    $mb = [math]::Round($prozess.WorkingSet64 / 1MB, 1)
    Write-Output ('{0,-30} {1,15:N1}' -f $prozess.ProcessName, $mb)
}
```

**Erläuterung der wichtigsten Zeilen:**

| Code | Erklärung |
| --- | --- |
| `[ValidateRange(0, 1048576)]` | Erlaubt nur 0 MB bis 1 TB. Eine negative Zahl führt zu einer verständlichen Fehlermeldung |
| `[int]$MinMemory = 100` | Ganzzahliger Parameter mit Standardwert 100. Text wie „abc“ wird abgelehnt |
| `[long]$MinMemory * 1MB` | Rechnet MB in Byte um. `[long]` verhindert einen Überlauf bei großen Werten |
| `$_.WorkingSet64` | Physischer Arbeitsspeicher des Prozesses in Byte. Das ist der Wert, den der Task-Manager als Arbeitsspeicher anzeigt |
| `Sort-Object ... -Descending` | Sortiert absteigend, der größte Verbraucher steht oben |
| `if (-not $prozesse)` | Gibt eine Meldung aus, wenn kein Prozess die Grenze überschreitet |
| `'{0,-30} {1,15:N1}' -f ...` | Formatoperator: Name linksbündig in 30 Zeichen, Speicher rechtsbündig in 15 Zeichen mit einer Nachkommastelle |

**Beispielausgabe (gekürzt, die Werte hängen vom System ab):**

```text
PS C:\Skripte> .\Get-HighMemoryProcess.ps1 -MinMemory 300
Prozess                          Speicher (MB)
firefox                                1.101,6
firefox                                  906,7
msedgewebview2                           718,3
firefox                                  419,5
explorer                                 327,8
```

**Testen:**

| Aufruf | Erwartetes Ergebnis |
| --- | --- |
| `.\Get-HighMemoryProcess.ps1` | Alle Prozesse über 100 MB, größter zuerst |
| `.\Get-HighMemoryProcess.ps1 -MinMemory 500` | Nur Prozesse über 500 MB |
| `.\Get-HighMemoryProcess.ps1 -MinMemory 0` | Alle Prozesse mit Speicherverbrauch |
| `.\Get-HighMemoryProcess.ps1 -MinMemory 900000` | „Kein Prozess belegt mehr als 900000 MB.“ |
| `.\Get-HighMemoryProcess.ps1 -MinMemory -5` | Fehler: Argument kleiner als der zulässige Bereich |
| `.\Get-HighMemoryProcess.ps1 -MinMemory abc` | Fehler: Wert kann nicht in System.Int32 konvertiert werden |
| `Get-Help .\Get-HighMemoryProcess.ps1` | Zeigt die kommentarbasierte Hilfe an |

**Erweiterungen:** Statt Textzeilen kann das Skript Objekte ausgeben, z. B. mit `Select-Object ProcessName, @{ Name = 'SpeicherMB'; Expression = { [math]::Round($_.WorkingSet64 / 1MB, 1) } }`. Dann lässt sich das Ergebnis mit `Export-Csv` speichern oder mit `Format-Table` anzeigen. Ein Parameter `-Top` könnte die Ausgabe auf die größten Verbraucher begrenzen, und mit `Invoke-Command -ComputerName` lässt sich das Skript auf entfernten Servern ausführen.

</details>

## Fazit zu Modul 2

Skriptsprachen sind essenziell für die IT-Automatisierung. **Bash und Shell-Scripting** erledigen mit einfacher Syntax und grundlegenden Kommandos wie `pwd`, `ls`, `cd` und `mkdir` Routineaufgaben effizient. Mit Bedingungen, Schleifen und Fehlerbehandlung entstehen daraus auch komplexe Skripte – ein mächtiges Werkzeug für Administration und Entwicklung.

**PowerShell** erweitert die Automatisierungsmöglichkeiten besonders in Windows-Umgebungen: durch Cmdlets, Pipelines und ihre objektorientierte Struktur. Sie ist plattformübergreifend verfügbar, fügt sich nahtlos in Microsoft-Technologien ein und führt Befehle auch auf entfernten Rechnern aus.

| | Bash | PowerShell |
| --- | --- | --- |
| Heimat | Unix und Linux, auch macOS | Windows, plattformübergreifend auch Linux und macOS |
| Datenmodell | Text | .NET-Objekte |
| Befehle | Kurze Programmnamen wie `ls`, `grep` | Cmdlets im Format Verb-Nomen |
| Stärke | Server, Container, CI/CD | Windows, Active Directory, Microsoft 365, Azure |

> **Kurz gesagt:** Beide Sprachen sind leistungsstarke Werkzeuge der Systemverwaltung. Bash ist in Unix- und Linux-Umgebungen zu Hause, PowerShell bietet eine umfassende Lösung für Windows und darüber hinaus. Wer beide beherrscht, erledigt komplexe Verwaltungsaufgaben deutlich effizienter und zuverlässiger.
