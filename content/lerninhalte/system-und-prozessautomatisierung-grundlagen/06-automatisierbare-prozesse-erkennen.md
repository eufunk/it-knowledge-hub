---
title: "Analyse und Identifikation automatisierbarer Prozesse"
description: "Routineaufgaben systematisch erfassen, analysieren und für die Automatisierung planen."
duration: "15 Minuten"
---

Die vorigen Kapitel zeigen, **wie** man automatisiert. Dieses Kapitel klärt, **was** sich zu automatisieren lohnt. Nicht jede Aufgabe eignet sich, und nicht jede geeignete Aufgabe bringt genug Nutzen. Ein strukturiertes Vorgehen in vier Schritten hilft, die richtigen Kandidaten zu finden und den Erfolg zu prüfen. Ein durchgehendes Beispiel aus dem IT-Support zeigt am Ende, wie das in der Praxis aussieht.

## Erkennung von Routineaufgaben

**Routineaufgaben** sind Tätigkeiten, die regelmäßig wiederkehren und jedes Mal nach demselben Muster ablaufen. Sie binden viel Zeit, sind für die Mitarbeitenden wenig anspruchsvoll und gerade deshalb fehleranfällig. Sie sind die besten Kandidaten für eine Automatisierung.

| Merkmal | Leitfrage | Gut geeignet, wenn … |
| --- | --- | --- |
| Häufigkeit | Wie oft fällt die Aufgabe an? | täglich oder wöchentlich, viele Fälle |
| Regelbasiert | Lässt sich jede Entscheidung mit „wenn … dann …“ beschreiben? | es kaum Ermessensspielraum gibt |
| Digitale, strukturierte Eingaben | Liegen die Daten in Systemen, Formularen oder Dateien vor? | keine Papierformulare oder Freitext nötig sind |
| Stabilität | Ändert sich der Ablauf häufig? | der Ablauf seit Monaten gleich ist |
| Zeitaufwand | Wie lange dauert ein Fall? | jeder Fall spürbar Zeit kostet |
| Fehleranfälligkeit | Passieren beim manuellen Ablauf Fehler? | Tippfehler oder vergessene Schritte vorkommen |

Typische Hinweise auf Routineaufgaben sind Sätze wie „Das mache ich jeden Montag“, „Dafür habe ich eine Checkliste“ oder „Das kopiere ich aus einem System ins andere“ (siehe auch Abschnitt 2.2). Weniger geeignet sind Aufgaben, die Fingerspitzengefühl, Verhandlung oder physische Handgriffe erfordern, die sehr selten vorkommen oder deren Ablauf sich ständig ändert.

Die Erkennung und Umsetzung folgt einem Kreislauf aus vier Schritten:

| Schritt | Kernfrage | Ergebnis |
| --- | --- | --- |
| 1. Datenerfassung | Was passiert wie oft, wie lange und mit welchen Schritten? | Zahlen und Prozessbeschreibungen |
| 2. Analyse | Welche Aufgaben eignen sich und lohnen sich? | Bewertete und priorisierte Kandidatenliste |
| 3. Planung | Wie, womit, von wem und bis wann wird automatisiert? | Maßnahmenplan mit Zielen und Kennzahlen |
| 4. Reflexion | Wurde das Ziel erreicht, und was lernen wir daraus? | Bewertung, Verbesserungen, nächste Kandidaten |

Nach der Reflexion beginnt der Kreislauf von vorn. Er entspricht dem PDCA-Zyklus aus Abschnitt 2.5: Datenerfassung, Analyse und Planung bilden „Plan“, die Umsetzung „Do“, die Reflexion „Check“ und „Act“.

### Datenerfassung

Ohne Zahlen bleibt jede Entscheidung ein Bauchgefühl. Ziel der Datenerfassung ist es, für jede Aufgabe Häufigkeit, Aufwand und Ablauf möglichst objektiv festzuhalten.

**Was wird erfasst?**

- **Häufigkeit:** Wie viele Fälle pro Tag, Woche oder Monat?
- **Dauer:** Wie lange dauert ein Fall im Durchschnitt, und wie stark schwankt das?
- **Ablauf:** Welche Schritte, in welcher Reihenfolge, mit welchen Entscheidungen?
- **Beteiligte und Systeme:** Wer arbeitet mit, welche Programme und Dateien werden genutzt?
- **Ein- und Ausgaben:** Woher kommen die Daten, was entsteht am Ende?
- **Fehler und Ausnahmen:** Was geht schief, welche Sonderfälle gibt es?

**Woher kommen die Daten?**

| Quelle | Liefert | Hinweis |
| --- | --- | --- |
| Ticketsystem | Häufigkeit, Kategorie, Bearbeitungszeit | Objektiv, aber nur gemeldete Fälle; Kategorien vorher vereinheitlichen |
| Ereignisprotokolle, Logdateien | Technische Abläufe und Fehler | Lässt sich per Skript auswerten (Abschnitt 2.3) |
| Zeiterfassung, Tätigkeitsprotokoll | Aufwand je Tätigkeit | 1–2 Wochen führen lassen |
| Interviews und Workshops | Erfahrungswissen, Ausnahmen, Ärgernisse | Mitarbeitende kennen die Schwachstellen am besten |
| Beobachtung | Tatsächlicher Ablauf mit allen Klicks | Zeigt Schritte, die niemand erwähnt |
| Vorhandene Skripte und Checklisten | Bereits teilweise automatisierte Abläufe | Schnell erledigt, zeigt Lücken |

**Prozesssteckbrief:**

Für jede Kandidatenaufgabe hält ein kurzer Steckbrief die wichtigsten Daten einheitlich fest:

| Feld | Beispiel „Neues Benutzerkonto anlegen“ |
| --- | --- |
| Auslöser | E-Mail der Personalabteilung mit Name, Abteilung und Eintrittsdatum |
| Häufigkeit | ca. 12 Fälle pro Monat |
| Dauer je Fall | ca. 90 Minuten, verteilt über mehrere Tage |
| Schritte | Konto anlegen, Gruppen zuweisen, Postfach und Lizenz einrichten, Laufwerke freigeben, Zugangsdaten übergeben |
| Systeme | Active Directory, Microsoft 365, Dateiserver, Ticketsystem |
| Beteiligte | Personalabteilung, Helpdesk, Vorgesetzte |
| Fehler und Ausnahmen | Falsch geschriebene Namen, vergessene Gruppen, Praktikanten ohne Personalnummer |
| Ergebnis | Arbeitsfähiges Konto am ersten Arbeitstag |

Bei der Zeitmessung gilt: mehrere Durchläufe messen (mindestens fünf) und den Median verwenden, weil einzelne Ausreißer den Durchschnitt verzerren. Wartezeiten, z. B. auf eine Rückmeldung, getrennt von der reinen Arbeitszeit erfassen.

**Datenschutz:** Tätigkeitsprotokolle und Ticketauswertungen können Rückschlüsse auf die Leistung einzelner Personen zulassen. Daten deshalb anonymisiert oder zusammengefasst auswerten. In Unternehmen mit Betriebsrat ist dieser bei technischen Einrichtungen zur Leistungs- oder Verhaltenskontrolle zu beteiligen (§ 87 Abs. 1 Nr. 6 BetrVG).

### Analyse

In der Analyse werden die erfassten Aufgaben verstanden, bewertet und in eine Reihenfolge gebracht.

**Ist-Prozess verstehen und Schwachstellen finden:**

Zunächst wird der aktuelle Ablauf Schritt für Schritt dargestellt, z. B. als Ablaufdiagramm oder Liste. Dabei fallen typische Schwachstellen auf, die gleichzeitig auf Automatisierungspotenzial hinweisen:

| Schwachstelle | Beispiel | Möglicher Ansatz |
| --- | --- | --- |
| Medienbruch | Daten aus einer E-Mail werden von Hand in ein System getippt | Formular oder Schnittstelle, Daten direkt übernehmen |
| Doppelte Erfassung | Dieselben Daten werden in drei Systemen eingegeben | Ein führendes System, die anderen automatisch befüllen |
| Wartezeiten | Ticket liegt zwei Tage, bis jemand es freigibt | Automatische Weiterleitung, Erinnerung, Self-Service |
| Wiederkehrende Klickfolgen | Jedes Konto wird mit denselben 25 Klicks angelegt | Skript mit Parametern |
| Vergessene Schritte | Lizenz wird beim Austritt nicht entzogen | Checkliste als Skript, das jeden Schritt ausführt und protokolliert |
| Viele Varianten | Jede Abteilung macht es etwas anders | Erst vereinheitlichen, dann automatisieren |

> **Merke:** Erst vereinfachen, dann automatisieren. Wer einen umständlichen Ablauf automatisiert, bekommt einen schnellen umständlichen Ablauf. Überflüssige Schritte und Freigaben gehören vorher gestrichen.

**Eignung bewerten:**

Jede Aufgabe erhält für die fünf Kriterien Häufigkeit, Regelbasiert, Digitale Eingaben, Stabilität und Zeitaufwand je 1 (schlecht) bis 5 (sehr gut) Punkte. Die Summe zeigt die Eignung: ab 18 Punkten sehr gut geeignet, 12 bis 17 Punkte genauer prüfen, unter 12 Punkten kaum geeignet. Bei Bedarf lassen sich die Kriterien wie bei der Nutzwertanalyse in Abschnitt 1.9 gewichten.

**Nutzen berechnen:**

```text
Einsparung pro Monat (h) = Fälle pro Monat × automatisierter Anteil
                           × eingesparte Minuten je Fall ÷ 60

Amortisationszeit (Monate) = Umsetzungsaufwand (h)
                             ÷ (Einsparung pro Monat − Wartung pro Monat)
```

Die **Amortisationszeit** gibt an, nach wie vielen Monaten sich der Aufwand für die Umsetzung durch die eingesparte Zeit ausgeglichen hat. Der Wartungsaufwand wird oft vergessen: Skripte müssen angepasst werden, wenn sich Systeme ändern. Neben der Zeit zählen auch schwer messbare Vorteile wie weniger Fehler, schnellere Bearbeitung und zufriedenere Mitarbeitende.

**Priorisieren mit der Aufwand-Nutzen-Matrix:**

|  | Geringer Aufwand | Hoher Aufwand |
| --- | --- | --- |
| **Hoher Nutzen** | **Quick Wins:** sofort umsetzen | **Große Projekte:** sorgfältig planen, in Etappen umsetzen |
| **Geringer Nutzen** | **Lückenfüller:** umsetzen, wenn Zeit ist | **Zeitfresser:** nicht umsetzen |

Zusammen mit dem Pareto-Prinzip (Abschnitt 2.3) ergibt sich so eine klare Reihenfolge: Quick Wins zuerst, weil sie schnell sichtbare Erfolge bringen und Vertrauen in die Automatisierung schaffen.

### Planung

Die Planung legt fest, wie die ausgewählten Aufgaben automatisiert werden. Sie sollte schriftlich festgehalten werden und folgende Punkte klären:

1. **Ziel:** messbar und mit Termin formulieren, z. B. nach der SMART-Regel (spezifisch, messbar, attraktiv, realistisch, terminiert).
2. **Soll-Prozess:** Wie sieht der Ablauf nach der Automatisierung aus? Wo bleibt ein Mensch beteiligt, z. B. für Freigaben?
3. **Umfang:** Mit einer kleinen, funktionierenden Version beginnen und später erweitern, statt alles auf einmal zu bauen.
4. **Werkzeug:** passend zu Aufgabe und Umgebung auswählen (Kriterien aus Abschnitt 1.9).
5. **Ressourcen und Zeitplan:** Wer setzt um, wie viele Stunden, bis wann?
6. **Risiken und Rückfallebene:** Was passiert, wenn die Automatisierung ausfällt? Der manuelle Weg muss dokumentiert bleiben.
7. **Tests:** zuerst in einer Testumgebung oder mit `-WhatIf`, dann in einem kleinen Pilotbereich.
8. **Kennzahlen:** Ausgangswerte (Baseline) vor dem Start festhalten, sonst lässt sich der Erfolg später nicht messen.
9. **Kommunikation und Schulung:** Betroffene früh informieren und einbinden, Anleitungen bereitstellen.
10. **Betrieb und Dokumentation:** Logging, Alarmierung bei Fehlern (Abschnitt 2.8) und ein Runbook (Abschnitt 2.9) einplanen.

| Häufiges Risiko | Gegenmaßnahme |
| --- | --- |
| Betroffene nutzen das neue Angebot nicht | Früh einbinden, Nutzen erklären, Anleitung und Ansprechpartner bereitstellen |
| Eingangsdaten sind unvollständig oder fehlerhaft | Pflichtfelder einführen, Daten im Skript prüfen, Fehlerbericht statt stillem Abbruch |
| Automatisierung richtet Schaden an | Testumgebung, `-WhatIf`, Freigabe kritischer Schritte durch einen Menschen |
| Skript fällt unbemerkt aus | Protokollierung, Alarm bei Fehlern, regelmäßige Kontrolle |
| Wissen hängt an einer Person | Code in Git, Dokumentation, zweite Person einarbeiten |

### Reflexion

Nach der Einführung wird geprüft, ob die Automatisierung ihr Ziel erreicht hat. Dafür werden dieselben Kennzahlen wie in der Datenerfassung erneut gemessen und mit der Baseline und dem Ziel verglichen.

| Kennzahl | Aussage |
| --- | --- |
| Manueller Aufwand pro Monat | Wie viel Arbeitszeit wird tatsächlich eingespart? |
| Fallzahl, z. B. Tickets pro Monat | Wird das neue Angebot genutzt? |
| Durchlaufzeit | Wie schnell ist ein Fall vom Auslöser bis zum Ergebnis erledigt? |
| Fehlerquote | Gibt es weniger Nacharbeit und Rückfragen? |
| Erfolgsquote der Automatisierung | Wie oft läuft das Skript ohne Fehler durch? |
| Tatsächlicher Umsetzungs- und Wartungsaufwand | Stimmt die Planung, wann ist die Amortisation erreicht? |
| Zufriedenheit | Wie bewerten Mitarbeitende und Anwender das Ergebnis? |

Neben den Zahlen gehört eine kurze **Nachbesprechung** (Retrospektive) mit allen Beteiligten dazu. Drei Fragen reichen meist aus:

- Was lief gut und soll beibehalten werden?
- Was lief schlecht oder hat länger gedauert als geplant, und warum?
- Was machen wir beim nächsten Mal anders?

Die Ergebnisse fließen in drei Richtungen: Verbesserungen an der bestehenden Automatisierung, Anpassungen am Vorgehen und neue Kandidaten für den nächsten Durchlauf des Kreislaufs. Ausnahmen, die die Automatisierung nicht abdeckt, werden gesammelt. Häufen sie sich, lohnt sich eine Erweiterung.

> **Tipp:** Die Reflexion ist kein einmaliger Termin. Automatisierungen sollten regelmäßig, z. B. vierteljährlich, überprüft werden. Systeme, Abläufe und Anforderungen ändern sich, und ein Skript, das niemand mehr pflegt, wird zum Risiko.

## Beispiel: Automatisierung im IT-Support eines Unternehmens

Ein mittelständisches Unternehmen mit 400 Mitarbeitenden betreibt einen Helpdesk mit vier Personen. Das Team klagt über Überlastung: Für Projekte und Beratung bleibt kaum Zeit. Die IT-Leitung beschließt im Oktober 2026, Routineaufgaben systematisch zu automatisieren. Die folgenden Zahlen sind ein durchgerechnetes Lehrbeispiel.

**Schritt 1 – Datenerfassung:**

Das Team exportiert alle Tickets des dritten Quartals (Juli bis September) aus dem Ticketsystem als CSV-Datei und wertet sie mit PowerShell aus:

```text
$tickets = Import-Csv -Path .\tickets_q3.csv -Delimiter ';'
$monate  = 3                                   # Zeitraum der Auswertung

$tickets |
    Group-Object -Property Kategorie |
    ForEach-Object {
        $minuten = ($_.Group | Measure-Object -Property Minuten -Sum).Sum
        [pscustomobject]@{
            Kategorie       = $_.Name
            FaelleProMonat  = [math]::Round($_.Count / $monate)
            MinutenJeFall   = [math]::Round($minuten / $_.Count)
            StundenProMonat = [math]::Round($minuten / $monate / 60, 1)
        }
    } |
    Sort-Object -Property StundenProMonat -Descending |
    Format-Table -AutoSize
Kategorie             FaelleProMonat MinutenJeFall StundenProMonat
---------             -------------- ------------- ---------------
Passwort zurücksetzen            140             8            18,7
Onboarding                        12            90              18
Hardware defekt                   15            60              15
Softwareinstallation              45            20              15
Offboarding                       10            60              10
Speicherplatz voll                25            15             6,2
Druckerwarteschlange              30            12               6
```

Zusammen kosten diese sieben Kategorien rund **89 Stunden pro Monat**, mehr als eine halbe Vollzeitstelle. Ergänzend führt das Team Interviews und erstellt Prozesssteckbriefe für die Kandidaten. Dabei zeigt sich z. B., dass das Onboarding aus 14 Einzelschritten in vier Systemen besteht und Daten aus einer E-Mail der Personalabteilung abgetippt werden.

**Schritt 2 – Analyse:**

Jede Kategorie wird nach den fünf Kriterien bewertet:

| Kategorie | Häufigkeit | Regelbasiert | Digitale Eingaben | Stabilität | Zeit je Fall | Summe | Eignung |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Passwort zurücksetzen | 5 | 5 | 5 | 5 | 2 | **22** | sehr gut |
| Onboarding | 2 | 4 | 4 | 4 | 5 | **19** | sehr gut |
| Softwareinstallation | 4 | 4 | 4 | 4 | 3 | **19** | sehr gut |
| Offboarding | 2 | 4 | 4 | 4 | 4 | **18** | sehr gut |
| Druckerwarteschlange | 3 | 4 | 4 | 3 | 2 | **16** | prüfen |
| Speicherplatz voll | 3 | 3 | 4 | 3 | 2 | **15** | prüfen |
| Hardware defekt | 2 | 1 | 2 | 2 | 4 | **11** | kaum |

Defekte Hardware muss von Hand getauscht werden und scheidet aus. Für die übrigen Kategorien schätzt das Team Lösung, Umsetzungsaufwand und Einsparung:

| Kategorie | Lösung | Einsparung | Aufwand | Wartung | Amortisation |
| --- | --- | --- | --- | --- | --- |
| Passwort zurücksetzen | Self-Service-Passwortzurücksetzung, 80 % der Fälle | 14,9 h/Monat | 24 h | 0,5 h/Monat | 1,7 Monate |
| Onboarding | PowerShell-Skript aus HR-Export, 90 → 15 min | 15,0 h/Monat | 40 h | 1,0 h/Monat | 2,9 Monate |
| Softwareinstallation | Self-Service-Portal, 70 % der Fälle | 10,5 h/Monat | 30 h | 1,0 h/Monat | 3,2 Monate |
| Offboarding | PowerShell-Skript, 60 → 15 min | 7,5 h/Monat | 24 h | 0,5 h/Monat | 3,4 Monate |
| Druckerwarteschlange | Selbstheilung: Spooler-Neustart (Abschnitt 2.8), 60 % der Fälle | 3,6 h/Monat | 6 h | 0,2 h/Monat | 1,8 Monate |
| Speicherplatz voll | Bereinigungs- und Warnskript, 50 % der Fälle | 3,1 h/Monat | 8 h | 0,3 h/Monat | 2,9 Monate |

Beispielrechnung für die Passwörter: 140 Fälle × 80 % × 8 Minuten ÷ 60 = 14,9 Stunden pro Monat. Amortisation: 24 h ÷ (14,9 h − 0,5 h) = 1,7 Monate. Insgesamt kosten die sechs Maßnahmen 132 Stunden und sparen nach Abzug der Wartung rund 51 Stunden pro Monat. Die gesamte Umsetzung hat sich damit nach etwa 2,6 Monaten amortisiert.

|  | Geringer Aufwand | Hoher Aufwand |
| --- | --- | --- |
| **Hoher Nutzen** | **Quick Wins:** Passwort zurücksetzen, Druckerwarteschlange | **Große Projekte:** Onboarding und Offboarding, Softwareinstallation |
| **Geringer Nutzen** | **Lückenfüller:** Speicherplatz voll | **Zeitfresser:** keine |

**Schritt 3 – Planung:**

**Ziel (SMART):** Bis zum 31.03.2027 sinkt der manuelle Aufwand des Helpdesks für die sechs Routinekategorien von 74 auf unter 30 Stunden pro Monat. Hardwaredefekte sind ausgenommen.

| Phase | Maßnahme | Werkzeug | Aufwand | Zeitraum | Messgröße |
| --- | --- | --- | --- | --- | --- |
| 1 | Self-Service-Passwortzurücksetzung | Microsoft Entra ID | 24 h | Okt. 2026 | Passwort-Tickets pro Monat |
| 1 | Selbstheilung Druckerwarteschlange | PowerShell, Aufgabenplanung | 6 h | Okt. 2026 | Drucker-Tickets pro Monat |
| 2 | On- und Offboarding-Skript | PowerShell, HR-Export als CSV | 64 h | Nov.–Dez. 2026 | Minuten je Fall |
| 3 | Self-Service-Portal für Software | Intune-Unternehmensportal | 30 h | Dez. 2026–Jan. 2027 | Software-Tickets pro Monat |
| 3 | Bereinigungs- und Warnskript | PowerShell | 8 h | Jan. 2027 | Speicher-Tickets pro Monat |

Weitere Festlegungen: Das On- und Offboarding-Skript wird zuerst in einer Test-OU mit `-WhatIf` erprobt und dann bei drei echten Einstellungen begleitet. Jede Ausführung wird protokolliert, Fehler lösen eine Benachrichtigung an den Helpdesk aus. Die Passwort-Selbstbedienung wird per Rundmail, Intranet-Anleitung und einem Hinweis auf dem Anmeldebildschirm bekannt gemacht. Der manuelle Weg bleibt als Runbook dokumentiert.

**Schritt 4 – Reflexion nach drei Monaten (Januar 2027):**

| Kategorie | Vorher | Geplant | Gemessen | Bewertung |
| --- | --- | --- | --- | --- |
| Passwort zurücksetzen | 18,7 h | 3,7 h | 5,6 h (42 statt 140 Tickets) | Gut, aber unter Plan: nur 85 % haben sich registriert |
| Druckerwarteschlange | 6,0 h | 2,4 h | 2,4 h (12 statt 30 Tickets) | Ziel erreicht |
| Onboarding | 18,0 h | 3,0 h | 4,0 h (20 statt 15 min je Fall) | Nacharbeit wegen unvollständiger HR-Daten |
| Offboarding | 10,0 h | 2,5 h | 3,3 h (20 statt 15 min je Fall) | Ausnahmen bei Leihgeräten noch manuell |
| Softwareinstallation | 15,0 h | 4,5 h | 15,0 h | Portal erst im Dezember gestartet, noch keine Wirkung |
| Speicherplatz voll | 6,2 h | 3,1 h | 6,2 h | Für Januar geplant |
| **Summe** | **73,9 h** | **19,3 h** | **36,6 h** | Zwischenziel erreicht, Endziel &lt; 30 h bis März realistisch |

Der Aufwand für Phase 1 und 2 lag mit 112 statt 94 geplanten Stunden über dem Plan, vor allem wegen der Datenqualität beim Onboarding. In der Nachbesprechung hält das Team fest:

- **Gut:** Die Quick Wins haben schon im ersten Monat spürbar entlastet und die Akzeptanz im Team erhöht.
- **Schlecht:** Jede vierte Meldung der Personalabteilung war unvollständig. Das Skript brach dann ab, und die Nacharbeit kostete Zeit.
- **Schlecht:** Das Skript lief im Dezember zweimal nicht, weil ein Dienstkonto-Kennwort abgelaufen war. Bemerkt wurde es erst durch Beschwerden.
- **Ändern:** Daten vor der Verarbeitung prüfen und Fehler an HR zurückmelden, Fehlerbenachrichtigung auch für Anmeldeprobleme einrichten, Registrierung für die Passwort-Selbstbedienung beim Onboarding direkt einplanen.

Als erste Verbesserung prüft ein vorgeschaltetes Skript den HR-Export auf Pflichtfelder und meldet unvollständige Datensätze, bevor Konten angelegt werden:

```powershell
$pflicht = 'Vorname', 'Nachname', 'Personalnummer', 'Abteilung', 'Eintritt'
$daten   = Import-Csv -Path .\neue_mitarbeitende.csv -Delimiter ';'

$fehler = foreach ($zeile in $daten) {
    $fehlend = $pflicht |
        Where-Object { [string]::IsNullOrWhiteSpace($zeile.$_) }
    if ($fehlend) {
        [pscustomobject]@{
            Name  = "$($zeile.Vorname) $($zeile.Nachname)"
            Fehlt = $fehlend -join ', '
        }
    }
}

if ($fehler) {
    $fehler | Format-Table -AutoSize
    $anzahl = @($fehler).Count
    Write-Warning "$anzahl Datensätze unvollständig. Bitte an HR zurückgeben."
    exit 1
}
Write-Output "Alle $(@($daten).Count) Datensätze vollständig."
Name         Fehlt
----         -----
Jonas Becker Personalnummer
Mia Schulz   Abteilung, Eintritt

WARNUNG: 2 Datensätze unvollständig. Bitte an HR zurückgeben.
```

Damit schließt sich der Kreislauf: Die Erkenntnisse aus der Reflexion verbessern die bestehende Lösung, und die nächste Datenerfassung im April 2027 sucht nach neuen Kandidaten, z. B. der automatischen Zuweisung von Tickets an das richtige Team.

> **Kurz gesagt:** Erst messen, dann bewerten, dann planen und nach der Umsetzung ehrlich nachmessen. Im Beispiel halbiert sich der Routineaufwand nach drei Monaten, obwohl nicht alles nach Plan lief. Gerade die Abweichungen liefern die wichtigsten Hinweise für die nächsten Verbesserungen.
