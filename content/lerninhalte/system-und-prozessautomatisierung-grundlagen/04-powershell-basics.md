---
title: "PowerShell Basics für Administratoren"
description: "Cmdlets, Skripte, Parameter und Fehlerbehandlung in PowerShell für Administratoren."
duration: "20 Minuten"
---

Nach der Bash in Kapitel 3 geht es jetzt um das wichtigste Automatisierungswerkzeug in Windows-Umgebungen. Dieses Kapitel erklärt, was PowerShell ist, wie Cmdlets und Aliase funktionieren, wie ein sauberes Skript aufgebaut wird und wie man Fehler abfängt und findet. Am Ende steht wieder eine Coding Challenge mit Musterlösung.

## Definition PowerShell

> **Definition:** **PowerShell** ist eine Kommandozeilen-Shell, Skriptsprache und Automatisierungsplattform von Microsoft. Sie basiert auf .NET und ist **objektorientiert**: Befehle geben keine Textzeilen aus wie in der Bash, sondern Objekte mit Eigenschaften und Methoden. Dadurch lassen sich Ergebnisse direkt filtern, sortieren und weiterverarbeiten, ohne Text zerlegen zu müssen.

Heute gibt es zwei Linien, die parallel installiert sein können:

| Merkmal | Windows PowerShell 5.1 | PowerShell 7.x |
| --- | --- | --- |
| Programm | `powershell.exe` | `pwsh.exe` (Linux/macOS: `pwsh`) |
| Plattform | Nur Windows, in Windows 10/11 und Server vorinstalliert | Windows, Linux, macOS |
| Grundlage | .NET Framework | Aktuelles .NET |
| Weiterentwicklung | Nur noch Fehlerbehebungen | Aktiv weiterentwickelt, neue Funktionen |
| Editor | Windows PowerShell ISE oder VS Code | VS Code mit PowerShell-Erweiterung |

Welche Version läuft, zeigt `$PSVersionTable.PSVersion`. Zu PowerShell gehören neben Konsole und Skriptsprache weitere Bausteine:

- **Cmdlets:** eingebaute Befehle im Format Verb-Nomen, z. B. `Get-Service`.
- **Module:** Sammlungen von Cmdlets und Funktionen, z. B. für Active Directory, Exchange oder Azure. Sie werden mit `Import-Module` geladen.
- **Provider:** machen Datenspeicher wie Laufwerke zugänglich, z. B. `Env:` (Umgebungsvariablen), `HKLM:` (Registry) oder `Cert:` (Zertifikate).
- **Remoting:** Befehle auf entfernten Rechnern ausführen, z. B. mit `Invoke-Command` oder `Enter-PSSession`.
- **Pipeline:** gibt Objekte von einem Befehl zum nächsten weiter.

**Objekte statt Text:**

```powershell
Get-Service |
    Where-Object Status -eq 'Stopped' |       # Eigenschaft direkt abfragen
    Select-Object Name, DisplayName, StartType |
    Sort-Object Name

Get-Service | Get-Member                      # zeigt alle Eigenschaften und Methoden
```

> **Kurz gesagt:** In der Bash muss man Text mit `grep` und `cut` zerlegen. In PowerShell fragt man einfach die Eigenschaft ab, z. B. `Status` oder `StartType`.

## Cmdlets: Das Herzstück der PowerShell

Ein **Cmdlet** (gesprochen „Command-let“) ist ein kleiner, spezialisierter Befehl, der genau eine Aufgabe erledigt. Jedes Cmdlet folgt dem Schema **Verb-Nomen**: Das Verb sagt, was getan wird, das Nomen, womit. Optionen werden als Parameter mit Bindestrich angehängt.

```powershell
Get-ChildItem -Path C:\Logs -Filter *.log -Recurse
#   Verb-Nomen   Parameter  Wert
```

**Die drei wichtigsten Cmdlets zum Selbstlernen:**

| Cmdlet | Zweck | Beispiel |
| --- | --- | --- |
| `Get-Command` | Befehle finden | `Get-Command -Noun Service`, `Get-Command *firewall*` |
| `Get-Help` | Hilfe und Beispiele anzeigen | `Get-Help Get-Process -Examples`, `Update-Help` lädt aktuelle Hilfe |
| `Get-Member` | Eigenschaften und Methoden eines Objekts anzeigen | `Get-Process \| Get-Member` |

**Häufig genutzte Cmdlets für Administratoren:**

| Bereich | Cmdlets |
| --- | --- |
| Prozesse und Dienste | `Get-Process`, `Stop-Process`, `Get-Service`, `Start-Service`, `Restart-Service` |
| Dateien und Ordner | `Get-ChildItem`, `Copy-Item`, `Move-Item`, `Remove-Item`, `New-Item`, `Test-Path` |
| Dateiinhalte | `Get-Content`, `Set-Content`, `Add-Content`, `Import-Csv`, `Export-Csv` |
| System und Hardware | `Get-CimInstance`, `Get-ComputerInfo`, `Restart-Computer` |
| Ereignisprotokolle | `Get-WinEvent` |
| Netzwerk | `Test-Connection`, `Test-NetConnection`, `Get-NetIPAddress`, `Invoke-RestMethod` |
| Benutzer | `Get-LocalUser`, `New-LocalUser`, im Active Directory `Get-ADUser`, `New-ADUser` |
| Fernwartung | `Invoke-Command`, `Enter-PSSession` |

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

Viele Cmdlets kennen **allgemeine Parameter** (Common Parameters). Besonders nützlich sind `-WhatIf` (nur anzeigen, was passieren würde), `-Confirm` (vor jeder Änderung nachfragen), `-Verbose` (ausführliche Meldungen) und `-ErrorAction` (Verhalten bei Fehlern).

## Praktische Tipps für aussagekräftige Cmdlet-Namen

Eigene Funktionen sollten wie eingebaute Cmdlets heißen. Dann versteht jeder sofort, was sie tun, und sie lassen sich mit `Get-Command` leicht finden. Die folgenden Regeln haben sich bewährt:

- **Zugelassene Verben verwenden:** PowerShell kennt eine Liste genehmigter Verben, die `Get-Verb` anzeigt. Module mit anderen Verben erzeugen beim Import eine Warnung.
- **Nomen im Singular:** `Get-Service`, nicht `Get-Services`, auch wenn mehrere Objekte zurückkommen.
- **PascalCase:** Jedes Wort beginnt mit einem Großbuchstaben, z. B. `Get-OldLogFile`.
- **Spezifisch statt allgemein:** `Get-DiskSpace` sagt mehr als `Get-Info`.
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

## PowerShell-Skripte: Automatisierung von Aufgaben mit PowerShell-Skripten

Ein PowerShell-Skript ist eine Textdatei mit der Endung `.ps1`, die Befehle in der Reihenfolge enthält, in der sie ausgeführt werden. Alles, was in der Konsole funktioniert, funktioniert auch im Skript. Geschrieben werden Skripte am besten in **Visual Studio Code** mit der PowerShell-Erweiterung, die Syntaxhervorhebung, Autovervollständigung und einen Debugger bietet.

**Skripte starten:**

```powershell
.\Speicherbericht.ps1                       # im aktuellen Ordner: .\ ist Pflicht
& 'C:\Skripte\Mein Bericht.ps1'              # Pfad mit Leerzeichen: Aufruf-Operator &
powershell.exe -NoProfile -File C:\Skripte\Speicherbericht.ps1   # aus cmd oder Aufgabenplanung
```

Ein Doppelklick auf eine `.ps1`-Datei öffnet sie nur im Editor. Das ist eine bewusste Sicherheitsmaßnahme. Zusätzlich regelt die **Ausführungsrichtlinie** (Execution Policy), ob Skripte überhaupt laufen dürfen:

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

Typische Aufgaben für PowerShell-Skripte sind Benutzerkonten aus einer CSV-Datei anlegen, Dienste überwachen und neu starten, Logdateien bereinigen, Inventar- und Lizenzberichte erstellen oder Einstellungen auf vielen Rechnern gleichzeitig ändern.

## Alias: Kurzbefehle für den schnellen Zugriff

Ein **Alias** ist ein zweiter, meist kürzerer Name für ein Cmdlet. Viele Aliase entsprechen bekannten Befehlen aus cmd und Bash, damit Umsteiger sofort zurechtkommen.

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

Selbst angelegte Aliase gelten nur bis zum Schließen der Sitzung. Dauerhaft werden sie, wenn man sie in das eigene Profil schreibt. Den Pfad zur Profildatei enthält die Variable `$PROFILE`.

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

## Beginnt ein PowerShell-Skript mit einer Shebang-Zeile, ähnlich wie ein Bash-Skript?

**Unter Windows nein.** Windows erkennt PowerShell-Skripte an der Dateiendung `.ps1` und startet sie mit PowerShell. Eine Shebang-Zeile wird nicht benötigt. Stünde sie trotzdem in der Datei, wäre sie harmlos, denn `#` leitet in PowerShell einen Kommentar ein.

**Unter Linux und macOS kann sie sinnvoll sein.** Mit PowerShell 7 lassen sich Skripte dort wie Bash-Skripte direkt starten, wenn die erste Zeile auf `pwsh` verweist und das Ausführrecht gesetzt ist:

```powershell
#!/usr/bin/env pwsh
Write-Output "Läuft unter $($PSVersionTable.OS)"
chmod +x info.ps1
./info.ps1
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

Ein gut aufgebautes Skript beginnt immer mit denselben Bausteinen in fester Reihenfolge:

1. **#Requires-Anweisungen:** prüfen Version, Rechte und Module.
2. **Kommentarbasierte Hilfe:** ein Block `<# … #>` mit `.SYNOPSIS`, `.DESCRIPTION`, `.PARAMETER` und `.EXAMPLE`. Dann zeigt `Get-Help .\skript.ps1` eine richtige Hilfe an.
3. **\[CmdletBinding()\] und param():** legen die Parameter fest. Der `param`-Block muss die erste ausführbare Anweisung sein. Davor dürfen nur Kommentare, Hilfe und `#Requires` stehen.
4. **Strenge Regeln:** `Set-StrictMode -Version Latest` und `$ErrorActionPreference = 'Stop'`.
5. **Variablen und Funktionen:** Einstellungen und wiederverwendbare Teile.
6. **Hauptteil:** der eigentliche Ablauf, mit Fehlerbehandlung.

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

> **Merke:** Steht vor dem `param`-Block bereits ein Befehl, z. B. `Set-StrictMode`, erkennt PowerShell die Parameter nicht mehr. Erst Hilfe und `param`, dann alles andere.

## Set-StrictMode

PowerShell ist standardmäßig sehr nachsichtig. Ein Tippfehler in einem Variablennamen erzeugt keinen Fehler, sondern liefert einfach einen leeren Wert. Solche Fehler fallen oft erst spät auf. `Set-StrictMode` schaltet strengere Regeln ein und macht aus stillen Fehlern echte Fehlermeldungen.

```powershell
$benutzername = 'anna'
Write-Output "Hallo $benutzernme"      # Tippfehler: Ausgabe "Hallo " ohne Warnung

Set-StrictMode -Version Latest
Write-Output "Hallo $benutzernme"
# Fehler: Die Variable "$benutzernme" kann nicht abgerufen werden,
#         weil sie nicht festgelegt wurde.
```

| Version | Verbietet |
| --- | --- |
| `1.0` | Nicht zugewiesene Variablen, außer innerhalb von Zeichenketten |
| `2.0` | Zusätzlich: nicht zugewiesene Variablen auch in Zeichenketten, nicht vorhandene Eigenschaften eines Objekts, Funktionsaufrufe in Methodenschreibweise wie `f(1,2)` |
| `3.0` | Zusätzlich: Zugriff auf Array-Elemente außerhalb des gültigen Bereichs |
| `Latest` | Immer die strengste Version der installierten PowerShell. Empfehlung für neue Skripte |
| `-Off` | Schaltet den Strict Mode wieder aus |

`Set-StrictMode` gilt für den Bereich, in dem es aufgerufen wird, und alle darunter liegenden, also z. B. für ein Skript und seine Funktionen. Es ersetzt keine Fehlerbehandlung: Der Strict Mode findet **Programmierfehler**, `try/catch` behandelt **Laufzeitfehler** wie eine fehlende Datei.

## Parameter-Deklarationen

Parameter machen ein Skript flexibel: Statt feste Werte im Code zu ändern, übergibt man sie beim Aufruf. Sie werden im `param()`-Block deklariert, mit Datentyp, optionalem Standardwert und Attributen, die die Eingabe prüfen.

| Element | Wirkung | Beispiel |
| --- | --- | --- |
| Datentyp | Wandelt die Eingabe um oder meldet einen Fehler | `[string]`, `[int]`, `[datetime]`, `[string[]]` (Liste) |
| Standardwert | Wird verwendet, wenn nichts übergeben wird | `[int]$Days = 30` |
| `[switch]` | Schalter ohne Wert, ist gesetzt oder nicht | `[switch]$Recurse`, Aufruf mit `-Recurse` |
| `Mandatory` | Pflichtparameter, PowerShell fragt nach, wenn er fehlt | `[Parameter(Mandatory)]` |
| `Position` | Wert darf ohne Parameternamen übergeben werden | `[Parameter(Position = 0)]` |
| `ValueFromPipeline` | Wert kann aus der Pipeline kommen | `'srv01' \| .\skript.ps1` |

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

PowerShell unterscheidet zwei Arten von Fehlern. Das ist der wichtigste Punkt für eine funktionierende Fehlerbehandlung:

| Fehlerart | Verhalten | Beispiel |
| --- | --- | --- |
| Nicht beendender Fehler (non-terminating) | Fehlermeldung wird ausgegeben, das Skript läuft weiter. `try/catch` greift **nicht** | `Get-ChildItem` auf einen fehlenden Ordner, `Stop-Process` auf einen bereits beendeten Prozess |
| Beendender Fehler (terminating) | Ausführung bricht ab, `try/catch` kann ihn abfangen | Syntaxfehler, `throw`, Fehler mit `-ErrorAction Stop` |

Damit `catch` auch nicht beendende Fehler erhält, wandelt man sie mit `-ErrorAction Stop` (für einen Befehl) oder `$ErrorActionPreference = 'Stop'` (für das ganze Skript) in beendende Fehler um.

| Wert für -ErrorAction | Wirkung |
| --- | --- |
| `Continue` | Fehler anzeigen und weitermachen (Standard) |
| `Stop` | Fehler wird beendend, `catch` greift |
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

| Hilfsmittel | Bedeutung |
| --- | --- |
| `$_` im `catch`-Block | Der aktuelle Fehler. `$_.Exception.Message` enthält die Meldung |
| `$Error` | Liste der letzten Fehler der Sitzung, `$Error[0]` ist der neueste |
| `$?` | `$true`, wenn der letzte Befehl erfolgreich war |
| `$LASTEXITCODE` | Exit-Code des zuletzt gestarteten externen Programms, wie `$?` in der Bash |
| `throw` | Eigenen beendenden Fehler auslösen, z. B. `throw 'Konfiguration fehlt'` |
| `Write-Error` | Nicht beendenden Fehler ausgeben |

**Debugging-Werkzeuge:**

| Werkzeug | Einsatz |
| --- | --- |
| `Write-Verbose` / `Write-Debug` | Zusätzliche Meldungen im Code, die nur mit `-Verbose` bzw. `-Debug` erscheinen |
| Haltepunkte in VS Code | **F9** setzt einen Haltepunkt, **F5** startet, **F10** führt die nächste Zeile aus, **F11** springt in eine Funktion. Variablenwerte sind im Seitenfenster sichtbar |
| `Set-PSBreakpoint` | Haltepunkt in der Konsole, z. B. `Set-PSBreakpoint -Script .\skript.ps1 -Line 12` |
| `Set-PSDebug -Trace 1` | Zeigt jede ausgeführte Zeile, ähnlich wie `bash -x` |
| `-WhatIf` | Zeigt, was ein Befehl ändern würde, ohne es zu tun |

**Bezug zu den Übungen:** Die Übung `Uebungen_30.09/Ueb1` zeigt Fehlerbehandlung mit `try/catch` in fünf typischen Situationen: Dateizugriff, Netzwerkverbindung, Benutzereingabe, Datenbankabfrage und Verschieben einer Dateiliste.

## Wie du Fehler in deinen Skripten findest und behebst

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
| `catch` wird nie ausgeführt | Nicht beendender Fehler | `-ErrorAction Stop` ergänzen |
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
