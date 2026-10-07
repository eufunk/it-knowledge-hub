---
title: "Einsatz von Versionskontrollsystemen für Skriptcodes"
description: "Repository, Commit, Branch und Merge, Git, SVN und Mercurial im Vergleich, ein VCS einführen, im Team zusammenarbeiten und Konflikte lösen – mit Coding Challenge in Python."
duration: "45 Minuten"
---

Die Versionskontrolle ist ein unverzichtbares Werkzeug in der modernen Softwareentwicklung und Skriptprogrammierung. Sie hilft Dir nicht nur, den Überblick über Deine Codeänderungen zu behalten, sondern trägt auch maßgeblich zur Qualität und Sicherheit Deines Codes bei.

Dieses Kapitel erklärt zuerst die wichtigsten Begriffe, dann Auswahl und Einführung eines Versionskontrollsystems (VCS) und schließlich die Zusammenarbeit im Team. Den Abschluss bildet eine Coding Challenge in Python.

## Grundlagen und Bedeutung der Versionskontrolle

> **Definition:** Ein **Versionskontrollsystem** (Version Control System, VCS) speichert jede Änderung an Dateien zusammen mit Autor, Zeitpunkt und Beschreibung. So lässt sich jederzeit nachvollziehen, wer was wann geändert hat, und jeder frühere Stand kann wiederhergestellt werden.

### Wichtige Begriffe

Bevor es in die Details geht, solltest Du einige grundlegende Begriffe kennen:

| Begriff | Bedeutung |
| --- | --- |
| **Repository** (Repo) | Speicherort für Deinen Code und die zugehörigen Dateien, lokal auf Deinem Computer oder auf einem Server. Das Repository enthält alle Versionen der Dateien und den Verlauf der Änderungen. |
| **Commit** | Eine gespeicherte Version Deines Codes, ein Schnappschuss des Projekts zu einem bestimmten Zeitpunkt. Jeder Commit hat eine Nachricht, die beschreibt, was geändert wurde. |
| **Branch** | Ein paralleler Entwicklungsstrang im Repository. Features oder Fehlerkorrekturen entstehen in eigenen Branches, ohne den Hauptcode (meist der Branch `main` oder `master`) zu beeinflussen. |
| **Merge** | Das Zusammenführen von Änderungen aus verschiedenen Branches. Ein Merge kombiniert die Entwicklungsstränge und zeigt eventuelle Konflikte an. |
| **Merge Request** (MR) / **Pull Request** (PR) | Ein Antrag, Änderungen aus einem Branch in einen anderen zu übernehmen. GitLab spricht von Merge Request, GitHub und Bitbucket von Pull Request. Vor der Übernahme prüfen Teammitglieder den Code, kommentieren ihn und schlagen Verbesserungen vor. |

Branches sind ein mächtiges Werkzeug, um die Arbeit im Team zu organisieren: Jede Person arbeitet in einem eigenen Branch, das verringert die Gefahr von Konflikten. Üblich sind diese Strategien:

- **Feature Branches:** Für jede neue Funktion entsteht ein eigener Branch. Ist die Arbeit fertig, wird er in den Haupt-Branch zusammengeführt.
- **Release Branches:** Hier wird eine stabile Version vorbereitet, die veröffentlicht werden soll.
- **Hotfix Branches:** Dienen dringenden Fehlerbehebungen, ohne die laufende Entwicklung zu stören.

**Die Begriffe in der Praxis mit Git:**

```bash
git init skripte                       # neues Repository anlegen
cd skripte
git add backup.sh                      # Änderung für den nächsten Commit vormerken
git commit -m "[backup] Erste Version" # Commit mit Nachricht
git switch -c feature/logging          # Branch anlegen und dorthin wechseln
# ... Skript ändern, git add und git commit ...
git switch main                        # zurück zum Haupt-Branch
git merge feature/logging              # Branch zusammenführen
```

### Qualitätssicherung durch Versionskontrolle

| Aspekt | Wie die Versionskontrolle hilft |
| --- | --- |
| **Nachvollziehbarkeit und Rückverfolgbarkeit** | Jeder Commit hat eine eindeutige Kennung und speichert Autor, Datum und Beschreibung. Tritt ein Fehler auf, findest Du schnell die verantwortliche Änderung und kannst sie gezielt rückgängig machen. |
| **Code-Reviews und Peer-Reviews** | Teammitglieder prüfen den Code, bevor er in den Hauptzweig übernommen wird. Das verbreitet Wissen und bewährte Vorgehensweisen im Team und deckt Fehler früh auf. Bei Google etwa durchlaufen Codeänderungen grundsätzlich ein Review. |
| **Automatisierte Tests und Continuous Integration (CI)** | Mit CI/CD-Pipelines (Continuous Integration/Continuous Deployment) laufen bei jedem Commit automatisierte Tests. So fällt sofort auf, wenn eine Änderung bestehende Funktionen beeinträchtigt. Große Plattformen wie Facebook testen und integrieren auf diese Weise täglich sehr viele Änderungen. |

```bash
git log --oneline --author=anna    # Änderungen einer Person
git log -p -- backup.sh            # Verlauf einer Datei mit allen Änderungen
git blame backup.sh                # wer hat welche Zeile zuletzt geändert?
git revert a211014                 # fehlerhaften Commit durch Gegen-Commit rückgängig machen
```

### Sicherheitsaspekte der Versionskontrolle

_„Wiege Dich nicht in Sicherheit, denn es hindert Dich daran, weiter an Dir zu arbeiten.“_ – Matthias Müller-Sarnowski

| Aspekt | Bedeutung | Beispiel |
| --- | --- | --- |
| **Verhinderung von Datenverlust** | Das VCS speichert den gesamten Verlauf mit allen Änderungen und Versionen. Geht etwas schief, greifst Du auf einen früheren Stand zurück. | Auch die NASA setzt bei der Entwicklung ihrer Missionssoftware auf Versionskontrolle, damit jede Änderung dokumentiert ist und nichts verloren geht. |
| **Zugriffskontrollen und Berechtigungen** | Du legst fest, wer Änderungen vornehmen darf und wer nur lesen kann. Kritische Bereiche bearbeiten nur autorisierte Personen. | Atlassian bietet in Bitbucket z. B. Berechtigungen pro Repository und geschützte Branches. |
| **Nachvollziehbarkeit von Sicherheitslücken** | Wird eine Lücke entdeckt, zeigt der Verlauf, wann und mit welcher Änderung sie entstanden ist. Das beschleunigt die Behebung. | Bei der OpenSSL-Lücke Heartbleed (2014) ließ sich anhand der Versionsgeschichte genau nachvollziehen, mit welcher Änderung der Fehler Ende 2011 in den Code gelangt war. |

> **Achtung:** Passwörter, API-Schlüssel und private Schlüssel gehören nie in ein Repository. Was einmal committet wurde, bleibt im Verlauf erhalten, auch wenn die Datei später gelöscht wird. Zugangsdaten gehören in Umgebungsvariablen oder einen Passwort-Tresor, und Dateien wie `.env` werden über `.gitignore` ausgeschlossen.

## Auswahl und Implementierung geeigneter Versionskontrollsysteme

Versionskontrollsysteme verfolgen Änderungen im Quellcode, verwalten verschiedene Versionen und erleichtern die Zusammenarbeit im Team. Grundsätzlich gibt es zwei Bauarten.

### Verteiltes und zentrales Versionskontrollsystem

| Merkmal | Zentrales VCS (CVCS) | Verteiltes VCS (DVCS) |
| --- | --- | --- |
| Beispiele | Subversion (SVN) | Git, Mercurial |
| Speicherung | Ein zentraler Server speichert alle Versionen. Er ist die einzige Quelle der Wahrheit | Jeder Rechner hat eine vollständige Kopie des Repositorys mit der gesamten Historie |
| Arbeiten ohne Netzwerk | Kaum möglich: Für Commit und Update ist die Verbindung zum Server nötig | Möglich: Commits, Branches und Verlauf sind lokal verfügbar |
| Stärken | Einfach zu verwalten, klare zentrale Kontrolle | Hohe Redundanz, Flexibilität und Geschwindigkeit |
| Schwächen | Fällt der Server aus, steht die Arbeit still (Engpass, Single Point of Failure) | Steilere Lernkurve, mehr Konzepte (z. B. lokal und entfernt) |

### Kriterien für die Auswahl

Diese Kriterien solltest Du bei der Auswahl eines passenden Versionskontrollsystems berücksichtigen:

| Kriterium | Wieso ist es wichtig? | Zentrales VCS (CVCS) | Verteiltes VCS (DVCS) |
| --- | --- | --- | --- |
| **Skalierbarkeit und Performance** | Ein gutes VCS wächst mit der Größe des Projekts. Es sollte auch bei zunehmender Codebasis und Teamgröße effizient bleiben. Git ist für seine hervorragende Performance auch bei sehr großen Projekten bekannt. | SVN kann bei sehr großen Projekten und Teams an Grenzen stoßen, da alle Operationen über das zentrale Repository laufen. | Git bietet exzellente Skalierbarkeit und Performance, da jede Person eine vollständige Kopie des Repositorys lokal hat. |
| **Benutzerfreundlichkeit und Lernkurve** | Besonders wichtig, wenn das Team aus Entwickler:innen mit unterschiedlicher Erfahrung besteht. Git ist schwerer zu lernen als SVN, die mächtigen Funktionen rechtfertigen aber oft die Einarbeitung. Oberflächen wie GitHub und GitLab erleichtern den Umgang. | SVN hat meist eine flachere Lernkurve und ist dadurch für Neulinge und kleinere Teams attraktiv. | Git hat eine steilere Lernkurve, bietet aber mächtige Funktionen und zahlreiche Werkzeuge, die den Umgang erleichtern. |
| **Unterstützung und Integration** | Das VCS muss sich in die vorhandene Entwicklungsumgebung einfügen. Git und SVN lassen sich in IDEs wie Visual Studio Code, IntelliJ IDEA und Eclipse einbinden. Wichtig ist auch die Unterstützung durch CI/CD-Werkzeuge wie Jenkins, Travis CI und CircleCI. | SVN bietet gute Integration in viele IDEs und CI/CD-Werkzeuge, die Möglichkeiten sind aber im Vergleich zu Git begrenzter. | Git ist in nahezu alle modernen IDEs und CI/CD-Werkzeuge integriert, was die Entwicklung effizienter macht. |
| **Community und Support** | Eine aktive Community und guter Support helfen bei Problemen und bei der Weiterentwicklung. Git hat eine sehr große Community mit zahlreichen Ressourcen, Tutorials und Plugins. Auch SVN hat eine solide, wenn auch kleinere Community. | SVN hat eine gute, aber kleinere Community, was den Zugang zu Ressourcen und Support einschränken kann. | Git hat eine große und aktive Community, die den Zugang zu Ressourcen, Support und Weiterentwicklung erleichtert. |
| **Sicherheitsfunktionen** | Zugriffskontrollen, Verschlüsselung und Audit-Logs sind entscheidend, besonders in sensiblen oder regulierten Branchen. Git-Plattformen können Zugriffsrechte auf Repositorys und einzelne Branches beschränken. | SVN bietet solide Sicherheitsfunktionen. Durch die zentrale Architektur ist der Server aber ein möglicher Single Point of Failure. | Git bietet zusammen mit Plattformen wie GitHub oder GitLab fein abgestufte Zugriffsrechte, geschützte Branches, verschlüsselte Übertragung per SSH oder HTTPS und signierte Commits. |

### Git

Git ist ein verteiltes Versionskontrollsystem, das 2005 von Linus Torvalds, dem Schöpfer des Linux-Kernels, entwickelt wurde. Es ist bekannt für seine Geschwindigkeit, Flexibilität und die starke Unterstützung nicht-linearer Entwicklung mit vielen parallelen Branches.

- **Verteilte Architektur:** Jede Person hat eine vollständige Kopie des Repositorys mit der gesamten Historie und kann auch ohne Netzwerkverbindung arbeiten.
- **Branching und Merging:** Branches sind leichtgewichtig und schnell angelegt. Git bietet leistungsstarke Funktionen, um sie wieder zusammenzuführen.
- **Staging Area:** Änderungen werden mit `git add` zuerst vorgemerkt. So kannst Du sie vor dem Commit prüfen und gezielt zusammenstellen.
- **Geschwindigkeit:** Commit, Branching und Merging laufen lokal und sind deshalb sehr schnell.

**Beispiel:** Google nutzt Git unter anderem für Android und den Browser Chromium. Durch die verteilte Arbeitsweise können Entwicklerinnen und Entwickler weltweit effizient zusammenarbeiten und Änderungen schnell integrieren.

**Wichtige Git-Befehle:**

| Befehl | Zweck |
| --- | --- |
| `git clone <url>` | Vorhandenes Repository samt Verlauf kopieren |
| `git status` | Geänderte, vorgemerkte und neue Dateien anzeigen |
| `git diff` | Änderungen gegenüber dem letzten Commit anzeigen |
| `git add <datei>` | Änderung in die Staging Area übernehmen |
| `git commit -m "…"` | Vorgemerkte Änderungen als Commit speichern |
| `git log --oneline` | Verlauf kompakt anzeigen |
| `git switch -c <branch>` | Neuen Branch anlegen und dorthin wechseln |
| `git merge <branch>` | Branch in den aktuellen Branch zusammenführen |
| `git pull` / `git push` | Änderungen vom Server holen bzw. dorthin hochladen |
| `git tag -a v1.0 -m "…"` | Version markieren |
| `git revert <commit>` | Commit durch einen Gegen-Commit rückgängig machen |

### Apache Subversion (SVN)

Apache Subversion, kurz SVN, ist ein zentrales Versionskontrollsystem. Es wurde entwickelt, um die Schwächen älterer Systeme wie CVS zu überwinden, und bietet eine robuste Lösung für die Versionskontrolle.

- **Zentrale Architektur:** Alle Daten liegen in einem zentralen Repository. Für Commits und Aktualisierungen ist eine Verbindung zum Server nötig.
- **Verzeichnisversionierung:** SVN versioniert nicht nur Dateien, sondern auch Verzeichnisse und damit die gesamte Projektstruktur.
- **Atomare Commits:** Eine Änderung wird entweder vollständig übernommen oder gar nicht.
- **Sperren (Locking):** Dateien lassen sich sperren, um Konflikte bei binären Dateien zu vermeiden, die sich nicht zusammenführen lassen.

```bash
svn checkout https://svn.example.org/repo/trunk skripte   # Arbeitskopie holen
svn update                                                # neueste Version vom Server
svn lock vorlage.docx                                     # Binärdatei sperren
svn commit -m "Vorlage aktualisiert"                      # Änderung zum Server senden
```

**Beispiel:** Die Apache Software Foundation hat Subversion lange für ihre Open-Source-Projekte genutzt. Die zentrale Architektur erleichtert die Verwaltung und Kontrolle der Projektressourcen. Viele Apache-Projekte sind inzwischen zu Git gewechselt.

### Mercurial

Mercurial ist ein weiteres verteiltes Versionskontrollsystem, das ähnlich wie Git funktioniert. Es wurde als einfache und skalierbare Lösung entwickelt.

- **Verteilte Architektur:** Wie bei Git hat jede Person eine vollständige Kopie des Repositorys.
- **Einfache Bedienung:** Mercurial legt großen Wert auf Benutzerfreundlichkeit. Viele Befehle sind intuitiv und leicht verständlich.
- **Leistung:** Mercurial ist für seine hohe Leistung und Skalierbarkeit auch bei sehr großen Projekten bekannt.
- **Integrierte Weboberfläche:** Mit `hg serve` lassen sich Änderungen und Verlauf direkt im Browser durchsuchen.

**Beispiel:** Facebook (heute Meta) hat Mercurial für seinen sehr großen Quellcodebestand eingesetzt und erweitert. Ausschlaggebend waren Skalierbarkeit und Leistung. Aus dieser Arbeit ist später das eigene Versionskontrollsystem Sapling hervorgegangen.

> **Kurz gesagt:** Die Wahl des richtigen Systems hängt von den Anforderungen Deines Projekts und Deines Teams ab. Git bietet hohe Flexibilität und ist ideal für verteilte Teams, SVN ist eine robuste zentrale Lösung, und Mercurial verbindet verteiltes Arbeiten mit einfacher Bedienung. Wer die Merkmale dieser Systeme kennt, kann eine fundierte Entscheidung treffen.

## Übung: Auswahl des optimalen Versionskontrollsystems

**Aufgabe:** Wähle für jede Situation das am besten geeignete Versionskontrollsystem aus Git, SVN und Mercurial und begründe Deine Entscheidung kurz.

1. **Situation 1:** Ein kleines Team von 5 Personen arbeitet in einem Büro an einem internen Projekt. Alle Änderungen sollen zentral verwaltet werden, und jede Person soll leicht auf die aktuelle Version zugreifen können. Das Team möchte Konflikte bei der Bearbeitung von Dateien vermeiden und hat häufig mit binären Dateien zu tun.
2. **Situation 2:** Ein großes, weltweit verteiltes Team arbeitet an einem Open-Source-Projekt. Jede Person soll lokal arbeiten und auch offline committen können. Das Projekt erfordert häufiges Branching und Merging, und das Team braucht eine schnelle und flexible Lösung.
3. **Situation 3:** Ein mittelgroßes Softwareunternehmen sucht ein Versionskontrollsystem mit einfacher Bedienung und hoher Leistung. Eine Weboberfläche soll das Durchsuchen von Projektverlauf und Änderungen erleichtern. Die Teammitglieder legen großen Wert auf Benutzerfreundlichkeit und Effizienz.
4. **Situation 4:** Ein Unternehmen entwickelt eine große Softwarelösung und braucht eine robuste zentrale Lösung für den Quellcode. Die Entwicklerinnen und Entwickler arbeiten meist im Büro mit ständigem Zugang zum zentralen Server. Das System muss atomare Commits unterstützen.
5. **Situation 5:** Ein kleines Start-up entwickelt eine mobile App. Das Team arbeitet parallel an Features und Bugfixes, braucht häufige Branches und Merges und ein System, das auch bei wachsender Codebasis schnell bleibt.

<details>
<summary>Lösungsvorschlag anzeigen</summary>

| Situation | Empfehlung | Begründung |
| --- | --- | --- |
| 1 Kleines Büroteam, Binärdateien | SVN | Zentrale Verwaltung, einfacher Zugriff auf den aktuellen Stand und Sperren von Dateien, damit zwei Personen nicht gleichzeitig dieselbe Binärdatei bearbeiten |
| 2 Weltweites Open-Source-Team | Git | Verteilt, Commits auch offline, schnelles Branching und Merging, große Community und Plattformen wie GitHub oder GitLab für die Zusammenarbeit |
| 3 Einfache Bedienung und Weboberfläche | Mercurial | Legt Wert auf einfache Bedienung, ist leistungsfähig und bringt mit `hg serve` eine Weboberfläche zum Durchsuchen des Verlaufs mit |
| 4 Große Software, zentraler Server | SVN | Robuste zentrale Lösung mit atomaren Commits; der ständige Serverzugang macht die zentrale Architektur unproblematisch |
| 5 Start-up mit vielen Branches | Git | Leichtgewichtige Branches, schnelle lokale Operationen und gute Skalierbarkeit bei wachsender Codebasis |

> **Hinweis:** In der Praxis ist Git heute in den meisten Fällen der Standard, auch für kleine Teams. Für große Binärdateien gibt es die Erweiterung Git LFS (Large File Storage), die ebenfalls Dateisperren unterstützt. Die Übung zeigt aber, wofür die Eigenschaften der einzelnen Systeme gedacht sind.

</details>

## Wie Du ein Versionskontrollsystem erfolgreich implementierst

Die Einführung eines VCS ist ein entscheidender Schritt, um Qualität und Sicherheit Deines Codes zu gewährleisten. Dieser Abschnitt führt durch die nötigen Schritte: Planung, Installation und Konfiguration, Schulung und die Einbindung in automatische Abläufe.

### Vorbereitung und Planung

**Analyse der Anforderungen:**

- **Teamgröße und -struktur:** Wie viele Personen werden das VCS nutzen, und wie ist das Team organisiert? Ein kleines Team braucht oft weniger Funktionen als ein großes, verteiltes.
- **Art der Projekte:** Geht es vor allem um kleine Skripte oder um große, komplexe Anwendungen?
- **Integration in bestehende Abläufe:** Welche Werkzeuge und Plattformen nutzt das Team bereits, und wie fügt sich das VCS dort ein?

**Auswahl des passenden VCS:**

- **Git:** das verbreitetste verteilte System, ideal für dezentrale Teams.
- **Subversion (SVN):** zentrales System, gut für Teams, die eine zentrale Codebasis bevorzugen.
- **Mercurial:** verteiltes System mit ähnlichen Funktionen wie Git, aber einfacherer Bedienung.

### Installation und Konfiguration

**Installation:**

- **Git:** von [git-scm.com](https://git-scm.com) für Windows, macOS oder Linux herunterladen, unter Linux meist über den Paketmanager (`sudo apt install git`).
- **SVN:** über [subversion.apache.org](https://subversion.apache.org) bzw. den Paketmanager installieren.
- **Mercurial:** von [mercurial-scm.org](https://www.mercurial-scm.org) herunterladen und installieren.

**Konfiguration:**

- **Repository einrichten:** Lege ein Repository als zentralen Speicherort für Deinen Code an, bei Git mit `git init`.
- **Benutzer und Berechtigungen:** Lege fest, wer Zugriff hat. Bei GitHub oder GitLab geschieht das über die Weboberfläche.
- **Hooks und Skripte:** Git-Hooks führen bei Ereignissen wie Commit oder Push automatisch Aktionen aus, z. B. Tests.

```bash
git config --global user.name "Anna Beispiel"         # Name für alle Commits
git config --global user.email "anna@example.org"
git config --global init.defaultBranch main           # Haupt-Branch heißt main
git init skripte
```

Ein Hook ist ein Skript im Ordner `.git/hooks`. Der folgende `pre-commit`-Hook prüft vor jedem Commit die Syntax aller vorgemerkten Shell-Skripte und bricht den Commit bei einem Fehler ab:

```bash
#!/bin/bash
# .git/hooks/pre-commit – Syntax aller vorgemerkten Shell-Skripte prüfen
fehler=0
for datei in $(git diff --cached --name-only --diff-filter=ACM -- '*.sh'); do
    bash -n "$datei" || fehler=1
done
exit $fehler   # ungleich 0: Commit wird abgebrochen
```

Zwei kleine Dateien im Repository vermeiden typische Probleme mit Skripten:

```text
# .gitignore – diese Dateien nie versionieren
*.log
*.tmp
.env

# .gitattributes – Shell-Skripte immer mit Linux-Zeilenenden speichern
*.sh  text eol=lf
*.ps1 text eol=crlf
```

> **Tipp:** Ohne `.gitattributes` wandelt Git unter Windows Zeilenenden oft in CRLF um. Ein so ausgechecktes Bash-Skript bricht unter Linux mit Fehlern wie `$'\r': command not found` ab. Die Regel `*.sh text eol=lf` verhindert das für alle im Team.

### Schulung und Einführung

- **Dokumentation:** Stelle eine verständliche Anleitung für die Nutzung des VCS im Team bereit. Git bietet zusätzlich eine umfangreiche Online-Dokumentation.
- **Tutorials und Workshops:** Bring dem Team die grundlegenden und fortgeschrittenen Funktionen in Schulungen näher.
- **Klein anfangen:** Ein erstes Repository mit vorhandenen Skripten zeigt schnell den Nutzen und schafft Routine.

### Integration und Automatisierung

Ein gut eingeführtes VCS ist nahtlos in die vorhandenen Werkzeuge und Abläufe eingebunden.

> **Definition:** **Continuous Integration** (CI) bedeutet, dass Codeänderungen regelmäßig und automatisch in ein zentrales Repository integriert und geprüft werden. Ziel ist es, Qualität und Stabilität des Codes durch häufiges Zusammenführen und Testen zu sichern.

| Aspekt | Bedeutung |
| --- | --- |
| Automatisierte Builds | Bei jeder Integration startet automatisch ein Build. Er prüft, ob die Software korrekt gebaut wird und die Tests erfolgreich laufen. |
| Automatisierte Tests | Unit-Tests, Integrationstests und weitere Tests stellen sicher, dass neue Änderungen bestehende Funktionen nicht beeinträchtigen. |
| Fehlererkennung | Durch häufige Integration und automatische Tests werden Fehler schnell erkannt. Das spart Zeit beim Debuggen. |
| Feedback | Das CI-System meldet die Ergebnisse sofort. Bei einem Fehler wird die verantwortliche Person benachrichtigt. |
| Kontinuierliche Integration | Änderungen werden regelmäßig integriert, bei aktiver Entwicklung auch mehrmals täglich. |

Bekannte CI-Werkzeuge sind Jenkins, Travis CI, CircleCI, GitLab CI und GitHub Actions. Für Skripte genügt oft schon eine kurze Pipeline, die bei jedem Push alle Shell-Skripte prüft, hier als Beispiel für GitLab CI:

```yaml
# .gitlab-ci.yml – bei jedem Push alle Shell-Skripte prüfen
skripte_pruefen:
  image: koalaman/shellcheck-alpine:stable
  script:
    - shellcheck skripte/*.sh
```

## Zusammenarbeit mit Versionskontrollsystemen

Ein Versionskontrollsystem ist nicht nur ein technisches Werkzeug, sondern auch ein Kommunikationsmittel. Deshalb braucht es klare Regeln und Abläufe für seine Nutzung.

### Regeln für die Zusammenarbeit

| Regel | Umsetzung |
| --- | --- |
| **Commit-Nachrichten** | Committe häufig, z. B. nach jeder abgeschlossenen Funktion oder jedem behobenen Fehler, und vermeide große Sammel-Commits. Jede Nachricht beschreibt klar und knapp die Änderung, in einer einheitlichen Struktur wie „[Modul] Kurze Beschreibung der Änderung“. |
| **Code-Reviews** | Bevor Änderungen in den Haupt-Branch kommen, prüft sie ein anderes Teammitglied. Das verbessert die Codequalität und verbreitet Wissen. Plane feste Zeiten für Reviews ein. |
| **Pull Requests (PR)** | Ein Teammitglied schlägt vor, Änderungen aus einem Branch in einen anderen zu übernehmen. Andere prüfen den Code, kommentieren, diskutieren und fordern Änderungen an, bevor der PR genehmigt und zusammengeführt wird. |
| **Regelmäßige Meetings** | Kurze Abstimmungen wie Stand-ups oder Sprint-Reviews zeigen den Fortschritt, decken Probleme früh auf und verbessern die Kommunikation. |
| **Tags und Releases** | Tags markieren Meilensteine und Versionen. Setze ein Tag für jede neue Version eines Skripts, um stabile Stände schnell wiederzufinden. |

```bash
git commit -m "[backup] Aufbewahrungsdauer auf 30 Tage erhöht"
git tag -a v1.2.0 -m "Backup-Skript Version 1.2.0"
git push origin main --tags              # Commits und Tags hochladen
```

### Konflikte in Versionskontrollsystemen

Trotz aller Vorsicht entstehen Konflikte, wenn mehrere Personen an denselben Dateien arbeiten:

- **Gleichzeitige Änderungen:** Zwei oder mehr Personen ändern dieselbe Stelle einer Datei und laden ihre Änderungen hoch.
- **Unterschiedliche Branches:** Änderungen aus verschiedenen Branches passen beim Zusammenführen nicht zueinander.
- **Fehlende Kommunikation:** Teammitglieder arbeiten unwissentlich an denselben Teilen des Codes.

Ein VCS bietet mehrere Wege, Konflikte zu lösen:

1. **Automatisches Zusammenführen:** Liegen die Änderungen in verschiedenen Bereichen der Datei, führt das VCS sie meist selbst zusammen.
2. **Manuelles Zusammenführen:** Gelingt das nicht, markiert das VCS die Konfliktstellen in der Datei. Eine Person entscheidet, welche Änderungen übernommen werden.
3. **Rebase:** Die Commits eines Branches werden auf die Spitze eines anderen Branches gesetzt. Das ergibt einen linearen Verlauf und kann Konflikte vermeiden.
4. **Testen:** Nach dem Lösen des Konflikts wird der Code gründlich getestet, damit keine neuen Fehler entstehen.
5. **Commit und Push:** Erst dann wird die Lösung committet und in das zentrale Repository übertragen.

**So sieht ein Konflikt in Git aus:**

```text
#!/bin/bash
<<<<<<< HEAD
ZIEL="/backup/daily"
=======
ZIEL="/mnt/nas/backup"
>>>>>>> feature/nas
echo "Sichere nach $ZIEL"
```

Oberhalb von `=======` steht der Stand des aktuellen Branches (`HEAD`), darunter der Stand des zusammengeführten Branches. Du entfernst die Markierungen, behältst die richtige Zeile und schließt den Merge ab:

```bash
git status                    # zeigt die Datei als Konflikt (UU)
# Datei bearbeiten und die Markierungen entfernen
git add backup.sh             # Konflikt als gelöst markieren
git commit                    # Merge abschließen
git merge --abort             # alternativ: Merge abbrechen, alter Stand
```

> **Achtung:** Ein Rebase schreibt den Verlauf um. Wende ihn nur auf eigene Branches an, die noch niemand anderes verwendet. Bei bereits geteilten Branches führt er zu doppelten Commits und Verwirrung im Team.

### Konflikte vermeiden mit Issue-Trackern

Der beste Weg, Konflikte zu verringern, ist gute Abstimmung. Issue-Tracker wie GitHub Issues, GitLab Issues oder Jira dokumentieren Aufgaben und Änderungen und weisen sie Personen zu. Alle sehen, woran die anderen gerade arbeiten. Das erhöht die Transparenz und verringert das Risiko, dass zwei Personen gleichzeitig dieselbe Datei ändern.

> **Tipp:** Wird ein Branch nach dem Issue benannt, z. B. `feature/42-nas-backup`, ist auch im Verlauf sofort erkennbar, wozu eine Änderung gehört.

## Coding Challenge

**Aufgabe:** Erstelle ein einfaches Simulationsprogramm eines Versionskontrollsystems in Python. Das Programm soll ein Repository simulieren, in dem Commits gespeichert werden. Implementiere dazu eine Klasse `Repository` mit den folgenden Methoden:

- `commit(message)`: Fügt einen neuen Commit hinzu, der eine eindeutige ID (inkrementell, beginnend bei 1) und eine Commit-Nachricht enthält.
- `log()`: Gibt alle bisher erstellten Commits in absteigender zeitlicher Reihenfolge aus, also den neuesten zuerst.
- `revert(commit_id)`: Setzt das Repository auf den Zustand des angegebenen Commits zurück, indem alle später erstellten Commits entfernt werden. Existiert die `commit_id` nicht, wird eine Fehlermeldung ausgegeben.

Schreibe außerdem ein kleines Hauptprogramm (`main`), das die Methoden vorführt: mehrere Commits erstellen, das Log anzeigen, einen Revert durchführen und das Log erneut anzeigen.

**Vorgehen:**

1. Im Konstruktor eine leere Liste für die Commits und einen Zähler für die nächste ID anlegen.
2. In `commit` ein Dictionary mit ID, Nachricht und Zeitstempel an die Liste anhängen und den Zähler erhöhen.
3. In `log` die Liste mit `reversed` von hinten nach vorn durchlaufen.
4. In `revert` die Position des Commits suchen und die Liste bis einschließlich dieser Position abschneiden.
5. In `main` alle drei Methoden nacheinander aufrufen, auch mit einer ungültigen ID.

<details>
<summary>Musterlösung anzeigen</summary>

**Musterlösung (vcs\_simulation.py):**

```python
"""Einfache Simulation eines Versionskontrollsystems: commit, log und revert."""
from datetime import datetime


class Repository:
    def __init__(self, name):
        self.name = name
        self.commits = []          # Liste von Commits, ältester zuerst
        self.next_id = 1           # nächste freie Commit-ID

    def commit(self, message):
        """Neuen Commit mit fortlaufender ID und Nachricht anlegen."""
        if not message.strip():
            print("Fehler: Die Commit-Nachricht darf nicht leer sein.")
            return None
        eintrag = {"id": self.next_id, "message": message,
                   "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        self.commits.append(eintrag)
        self.next_id += 1
        print(f"[{self.name}] Commit {eintrag['id']}: {message}")
        return eintrag["id"]

    def log(self):
        """Alle Commits ausgeben, neuester zuerst."""
        if not self.commits:
            print("Noch keine Commits vorhanden.")
            return
        for c in reversed(self.commits):
            print(f"  {c['id']:>3}  {c['time']}  {c['message']}")

    def revert(self, commit_id):
        """Auf den Stand von commit_id zurücksetzen: spätere Commits entfernen."""
        ids = [c["id"] for c in self.commits]
        if commit_id not in ids:
            print(f"Fehler: Commit {commit_id} existiert nicht.")
            return False
        position = ids.index(commit_id)
        entfernt = len(self.commits) - position - 1
        self.commits = self.commits[:position + 1]
        print(f"Zurückgesetzt auf Commit {commit_id}, {entfernt} Commit(s) entfernt.")
        return True


def main():
    repo = Repository("skripte")
    repo.commit("Backup-Skript angelegt")
    repo.commit("Logging ergänzt")
    repo.commit("Fehlerbehandlung verbessert")
    repo.commit("Experimentelle Komprimierung")

    print("\nLog vor dem Revert:")
    repo.log()

    print()
    repo.revert(2)
    repo.revert(99)

    print("\nLog nach dem Revert:")
    repo.log()

    print()
    repo.commit("Komprimierung neu umgesetzt")
    repo.log()


if __name__ == "__main__":
    main()
```

**Erläuterung der wichtigsten Zeilen:**

| Code | Erklärung |
| --- | --- |
| `self.commits = []` | Liste aller Commits in der Reihenfolge ihrer Entstehung, der älteste steht vorn |
| `self.next_id = 1` | Zähler für die nächste ID. Er wird nach jedem Commit erhöht und nach einem Revert nicht zurückgesetzt, damit jede ID eindeutig bleibt, wie bei einem echten VCS |
| `eintrag = {...}` | Ein Commit als Dictionary mit ID, Nachricht und Zeitstempel |
| `reversed(self.commits)` | Durchläuft die Liste von hinten: der neueste Commit zuerst |
| `if commit_id not in ids` | Fehlerfall: Die angegebene ID gibt es nicht, das Repository bleibt unverändert |
| `self.commits[:position + 1]` | Slicing: behält alle Commits bis einschließlich des Ziel-Commits und verwirft die späteren |
| `if __name__ == "__main__":` | Startet `main` nur, wenn die Datei direkt ausgeführt wird, nicht beim Import als Modul |

**Ausgabe:**

```text
[skripte] Commit 1: Backup-Skript angelegt
[skripte] Commit 2: Logging ergänzt
[skripte] Commit 3: Fehlerbehandlung verbessert
[skripte] Commit 4: Experimentelle Komprimierung

Log vor dem Revert:
    4  2026-10-07 10:15:00  Experimentelle Komprimierung
    3  2026-10-07 10:15:00  Fehlerbehandlung verbessert
    2  2026-10-07 10:15:00  Logging ergänzt
    1  2026-10-07 10:15:00  Backup-Skript angelegt

Zurückgesetzt auf Commit 2, 2 Commit(s) entfernt.
Fehler: Commit 99 existiert nicht.

Log nach dem Revert:
    2  2026-10-07 10:15:00  Logging ergänzt
    1  2026-10-07 10:15:00  Backup-Skript angelegt

[skripte] Commit 5: Komprimierung neu umgesetzt
    5  2026-10-07 10:15:00  Komprimierung neu umgesetzt
    2  2026-10-07 10:15:00  Logging ergänzt
    1  2026-10-07 10:15:00  Backup-Skript angelegt
```

**Testen:**

| Testfall | Erwartetes Ergebnis |
| --- | --- |
| Mehrere Commits anlegen | IDs 1, 2, 3, … in aufsteigender Reihenfolge |
| `log()` aufrufen | Neuester Commit steht oben |
| `log()` ohne Commits | „Noch keine Commits vorhanden.“ |
| `revert(2)` bei vier Commits | Commits 3 und 4 werden entfernt, Meldung „2 Commit(s) entfernt“ |
| `revert(99)` | Fehlermeldung, das Repository bleibt unverändert |
| Commit nach einem Revert | Erhält die nächste freie ID (hier 5), keine ID wird doppelt vergeben |
| `commit("")` | Fehlermeldung, es entsteht kein Commit |

> **Hinweis:** Das `revert` dieser Simulation entfernt spätere Commits. In Git entspricht das eher `git reset --hard`. Der Befehl `git revert` arbeitet anders: Er macht einen Commit durch einen neuen Gegen-Commit rückgängig, und der Verlauf bleibt vollständig erhalten.

**Erweiterungen:** Jeder Commit könnte zusätzlich den Inhalt einer Datei speichern, sodass `revert` auch diesen Stand wiederherstellt. Eine Methode `diff(id1, id2)` könnte mit dem Modul `difflib` die Unterschiede zwischen zwei Ständen zeigen. Ein echtes VCS wie Git verwendet statt fortlaufender Nummern Prüfsummen (Hashes) über den Inhalt als Commit-ID.

</details>
