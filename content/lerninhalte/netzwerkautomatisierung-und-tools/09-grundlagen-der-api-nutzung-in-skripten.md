---
title: "Grundlagen der API-Nutzung in Skripten"
description: "Was APIs sind und wie sie aufgebaut sind, HTTP und REST, API-Aufrufe mit curl, PowerShell und Python, Sicherheitslücken und wie Du die API-Nutzung absicherst – mit Übung."
duration: "50 Minuten"
---

Viele Systeme, mit denen Automatisierungsskripte arbeiten, bieten keine Kommandozeile, sondern eine Programmierschnittstelle: Cloud-Dienste, Ticketsysteme, Monitoring-Werkzeuge, Netzwerkgeräte oder Webanwendungen. Modul 5 zeigt, wie Skripte über solche Schnittstellen Daten abrufen und Aktionen auslösen und welche Frameworks Dir dabei Arbeit abnehmen.

Dieses Kapitel erklärt, was APIs sind, wie sie aufgebaut sind und wie sie Systeme verbinden. Danach geht es um die Protokolle HTTP und REST, um praktische API-Aufrufe mit curl, PowerShell und Python und schließlich um die Sicherheit bei der API-Nutzung.

## APIs: Was sie sind und wie sie funktionieren

> **Definition:** Eine **API** (Application Programming Interface, Programmierschnittstelle) ist eine Schnittstelle, über die zwei Anwendungen miteinander kommunizieren und Daten austauschen. Sie legt fest, welche Anfragen möglich sind, wie sie aussehen müssen und welche Antworten zurückkommen.

Du kannst Dir eine API wie die Bedienung in einem Restaurant vorstellen: Du gehst nicht selbst in die Küche, sondern bestellst nach der Speisekarte. Die Bedienung bringt die Bestellung in die Küche und Dir das Essen zurück. Die Speisekarte entspricht der API-Dokumentation, die Bestellung der Anfrage, das Essen der Antwort. Wie die Küche intern arbeitet, musst Du nicht wissen.

Web-APIs arbeiten in der Regel über das Internet mit dem Protokoll **HTTP** (Hypertext Transfer Protocol). Braucht eine Anwendung Daten von einer anderen, sendet sie eine HTTP-Anfrage an deren API. Die API verarbeitet die Anfrage und schickt eine Antwort zurück: die gewünschten Daten oder eine Bestätigung, dass eine Aktion ausgeführt wurde.

**Anwendungsbeispiele:**

| Bereich | Wie APIs genutzt werden |
| --- | --- |
| **Anmeldung mit fremden Konten** | Meldest Du Dich auf einer Website mit Deinem Google- oder Facebook-Konto an, nutzt die Website deren APIs, um Deine Identität bestätigen zu lassen. Dein Passwort bekommt die Website dabei nicht zu sehen. |
| **Wetter-Apps** | Rufen aktuelle Daten über die API eines Wetterdienstes ab und zeigen sie an. |
| **Online-Zahlungen** | Onlineshops wickeln Zahlungen per PayPal oder Kreditkarte über die APIs der Zahlungsdienste ab. |
| **IT-Administration** | Skripte legen über APIs Benutzerkonten an (z. B. Microsoft Graph), erstellen Tickets, lesen Monitoring-Daten aus oder starten virtuelle Maschinen in der Cloud. |

### Übung: Wo begegnen Dir APIs im Alltag?

In dieser Übung findest Du heraus, wo Dir APIs im Alltag begegnen.

| Schritt | Aufgabe |
| --- | --- |
| **1. Liste erstellen** | Notiere Anwendungen und Dienste, die Du täglich nutzt und bei denen Du vermutest, dass sie eine API verwenden. Anregungen: soziale Netzwerke, Wetter-Apps, Online-Zahlungsdienste, Musik-Streaming, E-Mail-Programme, Navigations-Apps, Smart-Home-Geräte. |
| **2. Recherchieren** | Prüfe im Internet, ob Deine Vermutungen stimmen. Hilfreiche Suchbegriffe: „[Anwendungsname] API“, „[Anwendungsname] Developer“ oder „[Anwendungsname] technische Dokumentation“. |
| **3. Ergebnisse zusammenfassen** | Halte in einem kurzen Text fest, welche Anwendungen tatsächlich APIs anbieten oder nutzen und wofür. |

**Ziel der Übung:** Du erkennst, wie verbreitet APIs sind und wie Anwendungen über sie zusammenarbeiten.

> **Tipp:** Viele Anbieter haben ein eigenes Entwicklerportal mit Dokumentation, z. B. für Spotify, Google Maps oder Philips Hue.

## Aufbau und Funktionsweise einer API

### Bestandteile einer Anfrage

| Bestandteil | Beschreibung | Beispiel |
| --- | --- | --- |
| **Endpunkt** (Endpoint) | Eine URL, die für eine bestimmte Funktion der API steht | `https://api.example.com/users` |
| **HTTP-Methode** | Legt fest, welche Aktion ausgeführt wird: abrufen, anlegen, ändern oder löschen | `GET` ruft die Liste aller Nutzenden ab |
| **Header** | Zusatzinformationen zur Anfrage oder Antwort, z. B. Anmeldedaten oder Datenformat | `Authorization: Bearer <Token>`, `Content-Type: application/json` |
| **Body** | Die eigentlichen Daten, die gesendet oder empfangen werden. Bei `POST` und `PUT` enthält er die neuen oder geänderten Daten | `{ "name": "Anna Berg", "email": "anna.berg@example.com" }` |

### Ablauf: Anfrage, Verarbeitung, Antwort

| Schritt | Was passiert | Beispiel |
| --- | --- | --- |
| **1. Anfrage** (Request) | Der Client sendet Methode, Endpunkt, Header und gegebenenfalls einen Body an den Server. | `GET https://api.example.com/users` mit Authorization-Header |
| **2. Verarbeitung** | Der Server prüft die Anfrage, liest z. B. Daten aus einer Datenbank, rechnet oder leitet die Anfrage an einen anderen Dienst weiter. | Der Server sucht die Nutzenden in seiner Datenbank. |
| **3. Antwort** (Response) | Der Server schickt einen Statuscode, Header und gegebenenfalls einen Body mit Daten zurück. | Statuscode 200 (OK) und eine Liste der Nutzenden im JSON-Format |

**So sieht ein solcher Austausch im Klartext aus:**

```http
POST /users HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{"name": "Lea Wolf", "email": "lea.wolf@example.com"}

HTTP/1.1 201 Created
Content-Type: application/json
Location: /users/2

{"id": 2, "name": "Lea Wolf", "email": "lea.wolf@example.com"}
```

Der erste Teil ist die Anfrage mit Methode, Pfad, Headern und – nach einer Leerzeile – dem Body. Danach folgt die Antwort: Statuscode 201 meldet, dass die Ressource angelegt wurde, der Header `Location` nennt ihre Adresse.

## Wie APIs Systeme und Anwendungen verbinden

Unternehmen nutzen viele verschiedene Anwendungen, die Daten austauschen müssen. APIs verbinden sie, ohne dass jede Anwendung die Interna der anderen kennen muss:

| Eigenschaft | Bedeutung |
| --- | --- |
| **Standardisierte Kommunikation** | APIs nutzen verbreitete Standards wie HTTP, REST und JSON. Das erleichtert Umsetzung und Wartung. |
| **Modularität** | Einzelne Funktionen oder Datenbereiche lassen sich unabhängig voneinander anbinden. Das macht Systeme flexibler. |
| **Interoperabilität** | Eine Web-API ist plattformunabhängig: Ein PowerShell-Skript unter Windows kann genauso mit ihr sprechen wie ein Python-Skript unter Linux oder eine Java-Anwendung. |

**Schritte zur erfolgreichen Integration mit APIs:**

1. **Bedarf ermitteln:** Welche Systeme sollen verbunden werden, welche Daten sollen fließen, wie oft und in welche Richtung?
2. **API auswählen:** Bietet das System eine API mit den benötigten Funktionen? Ist sie gut dokumentiert, und welche Nutzungsgrenzen gelten?
3. **Authentifizierung und Sicherheit klären:** Zugangsdaten mit minimalen Rechten einrichten und sicher speichern (siehe „Sicherheitsaspekte bei der Nutzung von APIs in Skripten“ weiter unten).
4. **Entwickeln und testen:** Die Integration umsetzen und gründlich testen, möglichst zuerst gegen eine Testumgebung.
5. **Warten und skalieren:** Die Integration überwachen und anpassen, wenn Datenmengen wachsen oder sich die API ändert.

## API-Protokolle verstehen

Um APIs effektiv zu nutzen, musst Du die zugrunde liegenden Protokolle verstehen. Die Grundlage der meisten Web-APIs ist HTTP, der verbreitetste Architekturstil ist REST.

### HTTP: das Fundament der Webkommunikation

**HTTP** (Hypertext Transfer Protocol) legt fest, wie Nachrichten zwischen Client und Server aufgebaut sind und übertragen werden. Die wichtigsten Bestandteile:

| HTTP-Methode | Aktion | Beispiel |
| --- | --- | --- |
| `GET` | Daten abrufen, ohne etwas zu verändern | `GET /users/123` liefert die Person mit der ID 123 |
| `POST` | Neue Ressource anlegen | `POST /users` mit den Daten im Body |
| `PUT` | Bestehende Ressource vollständig ersetzen | `PUT /users/123` mit allen Feldern |
| `PATCH` | Bestehende Ressource teilweise ändern | `PATCH /users/123` nur mit der neuen E-Mail-Adresse |
| `DELETE` | Ressource löschen | `DELETE /users/123` |

| Statuscode | Bedeutung | Was Dein Skript tun sollte |
| --- | --- | --- |
| **200** OK | Anfrage erfolgreich | Antwort verarbeiten |
| **201** Created | Ressource angelegt | Neue ID oder Adresse aus der Antwort übernehmen |
| **400** Bad Request | Anfrage fehlerhaft, z. B. Pflichtfeld fehlt | Eingaben prüfen, nicht unverändert wiederholen |
| **401** Unauthorized | Nicht oder falsch angemeldet | Token prüfen oder erneuern |
| **403** Forbidden | Angemeldet, aber keine Berechtigung | Rechte des Kontos prüfen |
| **404** Not Found | Ressource gibt es nicht | Endpunkt und ID prüfen |
| **429** Too Many Requests | Zu viele Anfragen in kurzer Zeit (Rate Limit) | Warten (oft nennt der Header `Retry-After` die Dauer), dann erneut versuchen |
| **500** Internal Server Error | Fehler auf dem Server | Später erneut versuchen, Fehler protokollieren |

> **Merke:** Codes ab 400 bedeuten einen Fehler auf Seiten des Clients, also Deines Skripts, Codes ab 500 einen Fehler auf dem Server.

Wichtige Header sind `Content-Type` für das Format der gesendeten Daten, z. B. `application/json`, `Accept` für das gewünschte Antwortformat und `Authorization` für die Anmeldedaten.

### REST: ein Architekturstil

**REST** (Representational State Transfer) ist kein Protokoll, sondern ein Architekturstil, der auf HTTP aufbaut. APIs, die seinen Prinzipien folgen, heißen RESTful. Sie sind einfach, skalierbar und gut wartbar.

| Nr. | Prinzip | Bedeutung | Beispiel |
| --- | --- | --- | --- |
| 01 | **Ressourcen** | Alles ist eine Ressource, z. B. Nutzende, Dokumente oder Geräte. Jede Ressource hat eine eindeutige URL. | `/users/123` steht für die Person mit der ID 123 |
| 02 | **Stabile Adressen** | Die URLs bleiben gleich und beschreiben Dinge, nicht Aktionen. Das erleichtert Skalierung und Wartung. | `/products` statt `/getAllProducts` |
| 03 | **HTTP-Methoden** | Die Aktion ergibt sich aus der HTTP-Methode, nicht aus der URL. | `GET /products/123` liest, `DELETE /products/123` löscht |
| 04 | **Zustandslosigkeit** (Statelessness) | Jede Anfrage enthält alle nötigen Informationen. Der Server merkt sich zwischen zwei Anfragen nichts über den Client. Deshalb muss z. B. das Token bei jeder Anfrage mitgeschickt werden. | Der Server muss keine Sitzungen verwalten und lässt sich leicht auf mehrere Rechner verteilen. |
| 05 | **Repräsentationen** | Eine Ressource kann in verschiedenen Formaten geliefert werden, meist JSON, aber auch XML oder HTML. Der Client wählt das Format über den `Accept`-Header. | `{ "id": 123, "name": "Anna Berg" }` |

Neben REST gibt es weitere Ansätze. **SOAP** (Simple Object Access Protocol) ist ein älteres, streng definiertes Protokoll mit XML-Nachrichten, das noch in vielen Unternehmens- und Behördensystemen läuft. **GraphQL** lässt den Client genau festlegen, welche Felder er zurückhaben möchte.

## Automatisierung mit APIs

Automatisierung heißt, Aufgaben, die früher von Hand erledigt wurden, von Software ausführen zu lassen. APIs sind dafür ideal, weil sie für Programme gemacht sind: Sie liefern strukturierte Daten statt Bildschirmseiten und ändern sich seltener als Benutzeroberflächen.

| Vorteil | Bedeutung |
| --- | --- |
| **Wiederkehrende Aufgaben automatisieren** | Statt Daten von Hand von einer Anwendung in eine andere zu übertragen, erledigt das ein Skript über die APIs. Das spart Zeit und vermeidet Tippfehler. |
| **Daten zeitnah abgleichen** | Änderungen in einem System werden automatisch in andere Systeme übernommen, z. B. eine neue Mitarbeiterin aus dem HR-System ins Ticketsystem. |
| **Systeme integrieren** | Werkzeuge und Plattformen, die eigentlich nichts voneinander wissen, arbeiten über APIs zusammen. |

**Schritte zur Automatisierung mit APIs:**

1. **Wiederkehrende Aufgaben identifizieren:** Welche Tätigkeiten werden regelmäßig von Hand erledigt, z. B. Daten abrufen, Berichte erstellen, Konten anlegen?
2. **Passende API auswählen:** Welches System bietet die nötigen Funktionen? Für Webanwendungen ist meist eine REST-API passend, ältere Unternehmenssysteme bieten teils nur SOAP.
3. **API integrieren:** Anhand der API-Dokumentation Endpunkte, Parameter und Authentifizierung umsetzen.
4. **Testen und debuggen:** Die Lösung vor dem produktiven Einsatz gründlich testen, auch Fehlerfälle wie falsche Zugangsdaten oder Zeitüberschreitungen.
5. **Überwachen und warten:** APIs ändern sich. Läufe protokollieren, Fehler melden lassen und die Ankündigungen des Anbieters zu neuen API-Versionen verfolgen.

### API-Aufrufe mit curl

`curl` ist auf Linux, macOS und Windows vorhanden und eignet sich zum schnellen Ausprobieren einer API. Das folgende Beispiel fragt die frei zugängliche Wetter-API von Open-Meteo nach der aktuellen Temperatur in Berlin:

```bash
$ URL="https://api.open-meteo.com/v1/forecast"
$ curl "$URL?latitude=52.52&longitude=13.41&current=temperature_2m"
{"latitude":52.512604,"longitude":13.419517, ... ,
 "current":{"time":"2026-10-07T12:45","interval":900,"temperature_2m":21.2}}
```

Die Parameter stehen nach dem `?` in der URL. Für eine API mit Anmeldung und das Anlegen eines Datensatzes per `POST`:

```bash
# Token aus einer Umgebungsvariable, nicht direkt in den Befehl schreiben
curl -H "Authorization: Bearer $API_TOKEN" https://api.example.com/users

curl -X POST https://api.example.com/users \
     -H "Authorization: Bearer $API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name": "Lea Wolf", "email": "lea.wolf@example.com"}'
```

### API-Aufrufe mit PowerShell

`Invoke-RestMethod` sendet die Anfrage und wandelt die JSON-Antwort automatisch in PowerShell-Objekte um. Auf die Werte greifst Du direkt mit Punktnotation zu:

```powershell
$url = 'https://api.open-meteo.com/v1/forecast' +
       '?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m'
$wetter = Invoke-RestMethod -Uri $url
$jetzt = $wetter.current
"Berlin: $($jetzt.temperature_2m) °C, Wind $($jetzt.wind_speed_10m) km/h"
# Ausgabe: Berlin: 21.2 °C, Wind 8.8 km/h
```

Mit Anmeldung und `POST`:

```powershell
$kopf = @{ Authorization = "Bearer $env:API_TOKEN" }
$body = @{ name = 'Jonas Peters'; email = 'jonas.peters@example.com' } |
        ConvertTo-Json

try {
    $neu = Invoke-RestMethod -Uri 'https://api.example.com/users' -Method Post `
               -Headers $kopf -Body $body -ContentType 'application/json'
    "Angelegt: ID $($neu.id), $($neu.name)"
}
catch {
    $code = [int]$_.Exception.Response.StatusCode
    Write-Warning "API-Fehler: HTTP $code"
}
```

`ConvertTo-Json` wandelt die Hashtable in JSON für den Body um. Bei einem Statuscode ab 400 löst `Invoke-RestMethod` einen Fehler aus, den `catch` abfängt; der Statuscode steht in `$_.Exception.Response.StatusCode`.

### API-Aufrufe mit Python

In Python ist das Paket `requests` der Standard für HTTP-Anfragen (Installation mit `pip install requests`):

```python
import requests

URL = "https://api.open-meteo.com/v1/forecast"
parameter = {"latitude": 52.52, "longitude": 13.41,
             "current": "temperature_2m,wind_speed_10m"}

antwort = requests.get(URL, params=parameter, timeout=10)
antwort.raise_for_status()      # Ausnahme bei Statuscode ab 400
daten = antwort.json()          # JSON-Body als Python-Dictionary

aktuell = daten["current"]
print(f"Berlin: {aktuell['temperature_2m']} °C, "
      f"Wind {aktuell['wind_speed_10m']} km/h")
# Ausgabe: Berlin: 21.2 °C, Wind 8.8 km/h
```

`params` baut die Parameter korrekt in die URL ein, `timeout` verhindert, dass das Skript bei einem hängenden Server ewig wartet. Das folgende Skript `benutzer_anlegen.py` legt eine Person an und reagiert dabei auf das Rate Limit der API:

```python
import os
import time
import requests

BASIS_URL = os.environ.get("API_URL", "https://api.example.com")
TOKEN = os.environ["API_TOKEN"]     # Token aus Umgebungsvariable, nie im Code
KOPF = {"Authorization": f"Bearer {TOKEN}"}


def anfrage(methode, pfad, versuche=3, **kwargs):
    """Sendet eine Anfrage; wartet bei 429 so lange, wie der Server verlangt."""
    for versuch in range(1, versuche + 1):
        antwort = requests.request(methode, BASIS_URL + pfad,
                                   headers=KOPF, timeout=10, **kwargs)
        if antwort.status_code != 429:
            antwort.raise_for_status()
            return antwort
        wartezeit = int(antwort.headers.get("Retry-After", 5))
        print(f"Rate Limit erreicht, Versuch {versuch}: warte {wartezeit} s")
        time.sleep(wartezeit)
    raise RuntimeError("API weiterhin überlastet")


neu = anfrage("POST", "/users",
              json={"name": "Max Kühn", "email": "max.kuehn@example.com"})
print(neu.status_code, neu.json())
print(anfrage("GET", "/limited").json())   # Endpunkt der Test-API mit Rate Limit
```

```text
$ python benutzer_anlegen.py
201 {'id': 2, 'name': 'Max Kühn', 'email': 'max.kuehn@example.com'}
Rate Limit erreicht, Versuch 1: warte 2 s
{'status': 'ok'}
```

| Code | Erklärung |
| --- | --- |
| `os.environ["API_TOKEN"]` | Liest das Token aus einer Umgebungsvariable. Fehlt sie, bricht das Skript sofort mit einer klaren Meldung ab |
| `requests.request(methode, ...)` | Eine Funktion für alle HTTP-Methoden, so lässt sich die Wiederholungslogik für GET und POST gemeinsam nutzen |
| `json={...}` | Wandelt das Dictionary in JSON um und setzt den Header `Content-Type: application/json` automatisch |
| `status_code != 429` | Bei jedem anderen Code wird die Antwort geprüft und zurückgegeben |
| `raise_for_status()` | Löst bei Codes ab 400 eine Ausnahme aus, z. B. `401 Client Error: Unauthorized` bei falschem Token |
| `headers.get("Retry-After", 5)` | Wartet so lange, wie der Server verlangt, sonst 5 Sekunden |

> **Hinweis:** Die Beispiele mit `api.example.com` zeigen das Prinzip. Getestet wurden sie gegen eine lokale Test-API mit demselben Verhalten. Die Open-Meteo-Beispiele funktionieren ohne Anmeldung direkt.

## Sicherheitsaspekte bei der Nutzung von APIs in Skripten

APIs geben Zugriff auf Daten und Funktionen, oft auf sensible. Die folgenden Sicherheitslücken sind besonders häufig.

### Unzureichende Authentifizierung und Autorisierung

Die API muss sicherstellen, dass nur berechtigte Personen oder Systeme zugreifen (**Authentifizierung**) und dass sie nur tun dürfen, was ihnen erlaubt ist (**Autorisierung**). Gängige Verfahren:

| Verfahren | Funktionsweise | Vorteile | Nachteile und Hinweise |
| --- | --- | --- | --- |
| **API-Schlüssel** (API Key) | Eine eindeutige Zeichenfolge wird bei jeder Anfrage mitgeschickt, meist im Header | Einfach umzusetzen und zu nutzen | Gilt meist unbegrenzt und wird bei Diebstahl leicht missbraucht. Nur für einfache Anwendungen oder unkritische Daten. Nie im Quellcode oder in einem Repository speichern |
| **OAuth 2.0** | Ein Autorisierungsverfahren: Eine Anwendung erhält ein zeitlich begrenztes Zugriffstoken für bestimmte Ressourcen, ohne das Passwort der Person zu kennen. Für die Anmeldung selbst baut OpenID Connect darauf auf | Hohe Sicherheit, Tokens laufen ab und lassen sich auf bestimmte Rechte (Scopes) beschränken | Aufwendiger umzusetzen. Tokens regelmäßig erneuern lassen. Für Skripte gibt es den Ablauf „Client Credentials“ ohne Benutzeranmeldung |
| **JWT** (JSON Web Token) | Ein kompaktes Token mit Angaben zur Person und ihren Rechten, digital signiert | Der Server kann die Signatur prüfen, ohne eine Datenbank abzufragen. Wird oft als Zugriffstoken bei OAuth 2.0 verwendet | Signiert heißt nicht verschlüsselt: Der Inhalt ist nur Base64-kodiert und für jeden lesbar. Keine Geheimnisse hineinschreiben. Große Tokens vergrößern jede Anfrage |

### Unverschlüsselte Kommunikation

Läuft die Kommunikation über einfaches HTTP, können Angreifer im selben Netz, etwa in einem öffentlichen WLAN, die Daten mitlesen und verändern, einschließlich Tokens und API-Schlüsseln (Man-in-the-Middle-Angriff).

- **HTTPS verwenden:** Alle API-Aufrufe ausschließlich über HTTPS senden. HTTPS verschlüsselt die Übertragung mit TLS (Transport Layer Security) und schützt sie vor Abhören und Manipulation.
- **Aktuelle TLS-Versionen:** Nur TLS 1.2 oder 1.3 zulassen. Die Vorgänger SSL und TLS 1.0/1.1 gelten als unsicher.
- **Zertifikate prüfen:** Die Zertifikatsprüfung nie abschalten, auch nicht „nur zum Testen“. Optionen wie `curl -k`, `verify=False` in Python oder `-SkipCertificateCheck` in PowerShell öffnen Man-in-the-Middle-Angriffen die Tür.

### Fehlende Eingabevalidierung

Werden Eingaben ungeprüft weiterverarbeitet, drohen Angriffe wie **SQL-Injection** (Schadcode in Datenbankabfragen), **Cross-Site Scripting** (XSS, Schadcode, der im Browser anderer Personen ausgeführt wird) oder **Remote Code Execution** (RCE, Ausführen beliebiger Befehle auf dem Server).

> **Achtung:** 2012 stahlen Angreifer über eine SQL-Injection-Lücke im Dienst Yahoo Voices rund 450.000 Zugangsdaten. Die Passwörter waren zudem unverschlüsselt gespeichert und wurden anschließend im Internet veröffentlicht.

- **Eingaben validieren:** Alle Eingaben prüfen, bevor sie verarbeitet oder an eine API weitergegeben werden. Am sichersten ist eine Positivliste (Whitelisting): Nur ausdrücklich erlaubte Werte und Formate werden akzeptiert.
- **Prepared Statements:** Datenbankabfragen mit Parametern statt zusammengesetzten Zeichenketten bauen. Das verhindert SQL-Injection.
- **Bereinigen und Kodieren:** Eingaben von schädlichen Zeichen befreien (Sanitization) und Ausgaben für ihren Zielort kodieren, z. B. für HTML.

### Übermäßige Preisgabe von Daten

Eine API gibt mehr Daten zurück, als für die Funktion nötig sind, z. B. komplette Personendatensätze mit Geburtsdatum, obwohl nur der Name gebraucht wird. Das führt schnell zu Datenschutzverletzungen.

- **Minimaler Datenzugriff:** Nur die Daten zurückgeben und abfragen, die wirklich gebraucht werden. Viele APIs erlauben eine Feldauswahl, z. B. `$select=displayName,mail` bei Microsoft Graph.
- **Datenmaskierung:** Sensible Angaben ganz oder teilweise verbergen, z. B. nur die letzten vier Ziffern einer Kontonummer.
- **API-Gateway:** Eine vorgeschaltete Instanz, die Zugriffe zentral prüft, filtert und protokolliert.

### Rate Limiting und Denial-of-Service-Angriffe

Bei einem **Denial-of-Service-Angriff** (DoS) wird eine API mit so vielen Anfragen überflutet, dass sie für alle anderen unbrauchbar wird. Schutz bieten:

- **Rate Limiting:** Die Zahl der Anfragen pro Person, Schlüssel oder IP-Adresse in einem Zeitraum begrenzen. Wer die Grenze überschreitet, erhält den Statuscode 429.
- **Throttling:** Anfragen verlangsamen statt abzuweisen, um Überlastung zu verhindern.
- **Monitoring:** Die Nutzung laufend überwachen, um verdächtige Muster früh zu erkennen.

> **Wichtig:** Für Dein Skript heißt das umgekehrt: Halte Dich an die Grenzen der API. Reagiere auf 429 mit Warten wie im Beispiel `benutzer_anlegen.py` oben, statt die Anfragen sofort zu wiederholen. Sonst sperrt der Anbieter Deinen Zugang möglicherweise.

## Sicherheit an erster Stelle: API-Nutzung absichern

### Grundlegende Sicherheitsprinzipien

| Schutzziel | Bedeutung |
| --- | --- |
| **Vertraulichkeit** | Nur berechtigte Personen und Systeme haben Zugriff auf die Daten. |
| **Integrität** | Die Daten können bei der Übertragung nicht unbemerkt verändert werden. |
| **Verfügbarkeit** | Die API-Dienste sind zuverlässig und ohne Unterbrechungen erreichbar. |

### HTTPS als Basis

Wer eine API selbst betreibt, richtet HTTPS in drei Schritten ein:

1. **TLS-Zertifikat besorgen:** von einer vertrauenswürdigen Zertifizierungsstelle (CA). Kostenlose, automatisch erneuerte Zertifikate gibt es z. B. von Let's Encrypt, im Unternehmen oft von der eigenen internen CA.
2. **Zertifikat installieren:** auf dem Server einrichten und nur aktuelle TLS-Versionen zulassen.
3. **HTTPS erzwingen:** Alle HTTP-Anfragen automatisch auf HTTPS umleiten.

### Authentifizierung und Autorisierung

1. **Starke Zugangsdaten:** Lange, zufällige Passwörter und API-Schlüssel verwenden und sie in einem Passwort-Tresor oder in geschützten Umgebungsvariablen speichern, nie im Skript.
2. **Mehr-Faktor-Authentifizierung (MFA):** Für Konten, die API-Schlüssel erzeugen oder verwalten, einen zweiten Faktor verlangen, am besten eine Authentifizierungs-App oder einen Sicherheitsschlüssel. SMS-Codes sind besser als nichts, aber leichter abzufangen.
3. **Berechtigungen begrenzen:** Jedes Skript bekommt ein eigenes Konto oder Token mit genau den Rechten, die es braucht. Ein Berichtsskript braucht nur Leserechte.
4. **Tokens regelmäßig erneuern und widerrufen:** Abgelaufene oder nicht mehr benötigte Schlüssel sofort sperren, z. B. wenn ein Skript außer Betrieb geht.

### Schutz vor häufigen Angriffen

| Angriff | Vorgehen der Angreifer | Schutzmaßnahmen |
| --- | --- | --- |
| **SQL-Injection** | Schleusen schädlichen SQL-Code über Eingaben in Datenbankabfragen ein | Prepared Statements oder ORM-Bibliotheken (Object-Relational Mapping), Eingaben validieren |
| **Cross-Site Scripting** (XSS) | Bringen schädlichen JavaScript-Code in Daten unter, die eine Webanwendung später im Browser anderer Personen anzeigt | Eingaben validieren, Ausgaben für HTML kodieren, korrekten `Content-Type` setzen |
| **Überlastung** (DoS) | Senden massenhaft Anfragen, um die API lahmzulegen | Rate Limiting, Throttling, Monitoring |
| **Ausnutzen bekannter Schwachstellen** | Greifen über Sicherheitslücken in veralteter Software an | Server, Frameworks und Bibliotheken zeitnah aktualisieren, Sicherheitsmeldungen verfolgen |

> **Achtung:** Beim Angriff auf die US-Auskunftei Equifax 2017 nutzten Angreifer eine bekannte Schwachstelle im Webframework Apache Struts 2 aus. Ein Sicherheitsupdate war bereits seit rund zwei Monaten verfügbar, aber nicht eingespielt. Betroffen waren Namen, Sozialversicherungsnummern, Geburtsdaten und Adressen von rund 147 Millionen Menschen, außerdem etwa 209.000 Kreditkartennummern. Dass die Daten monatelang unbemerkt abflossen, lag auch an einem abgelaufenen Zertifikat in einem Überwachungssystem, das den verschlüsselten Datenverkehr deshalb nicht mehr prüfte.

Die Sicherheit Deiner API-Nutzung sollte immer an erster Stelle stehen. HTTPS, sichere Authentifizierung mit minimalen Rechten, geprüfte Eingaben, sparsame Datenabfragen, Rate Limiting und aktuelle Software schützen Deine Daten und Systeme.

> **Kurz gesagt:**
>
> - Eine API ist eine Schnittstelle, über die Anwendungen Daten austauschen; Web-APIs nutzen meist HTTP und REST.
> - Eine Anfrage besteht aus Endpunkt, Methode, Headern und Body; die Antwort liefert einen Statuscode und Daten.
> - Skripte rufen APIs mit `curl`, `Invoke-RestMethod` oder Python `requests` auf, prüfen den Statuscode und warten bei 429.
> - Zugangsdaten gehören in Umgebungsvariablen oder einen Tresor, nie in den Code. Immer HTTPS, Zertifikate nie ungeprüft lassen.
> - Sicherheit ist kein einmaliger Schritt, sondern ein fortlaufender Prozess mit regelmäßigen Überprüfungen.
