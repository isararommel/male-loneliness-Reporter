# Deployment auf isararommel.de

Zielaufbau: `dickpic-anzeige.isararommel.de`, als eigener Docker-Container hinter
deinem bestehenden nginx – bewusst **ohne** Authelia, da das Tool öffentlich
und ohne Login nutzbar sein muss.

## 1. Vor dem Go-Live: Betreiberdaten eintragen

`src/legal/operatorInfo.ts` enthält noch Platzhalter für Impressum und
Datenschutzerklärung. Solange dort `TODO`-Werte stehen, zeigt die App selbst
eine rote Warnbanner an. Bitte mit echten Daten (Name, Anschrift, E-Mail)
befüllen und neu bauen, bevor der Container live geht.

## 2. DNS

A-/AAAA-Record für `dickpic-anzeige.isararommel.de` auf die IP dieses Servers
anlegen.

## 3. Image bauen und Container starten

```bash
git clone <repo-url> /opt/dickpic-anzeige   # oder wo eure Docker-Projekte liegen
cd /opt/dickpic-anzeige
docker build -t dickpic-anzeige:latest .
```

Service in eurer bestehenden `docker-compose.yml` ergänzen – Vorlage in
`deploy/docker-compose.snippet.yml`. `PROXY_NETWORK_NAME` durch den Namen
des Docker-Netzwerks ersetzen, über das euer edge-nginx andere Container
erreicht (falls unklar: `docker network ls` und `docker inspect <euer-nginx-container>`
zeigen, welches Netzwerk er nutzt).

```bash
docker compose up -d dickpic-anzeige
```

## 4. TLS-Zertifikat

Für die neue Subdomain ein Zertifikat ausstellen, z. B. mit certbot:

```bash
certbot certonly --webroot -w /pfad/zu/eurem/acme-webroot -d dickpic-anzeige.isararommel.de
```

(Falls ihr eine andere ACME-Automatisierung nutzt, entsprechend anpassen.)

## 5. nginx-vhost

`deploy/vhost.example.conf` als Vorlage nehmen, an eure Konventionen
anpassen (Zertifikatspfade, ggf. abweichender Log-Pfad) und **ohne** die
Authelia-`auth_request`-Zeile übernehmen, die eure anderen vhosts haben.
Danach:

```bash
nginx -t
systemctl reload nginx   # oder: docker exec <euer-nginx-container> nginx -s reload
```

## 6. Prüfen

- `https://dickpic-anzeige.isararommel.de` ohne eingeloggt zu sein aufrufen
  → sollte direkt laden, kein Authelia-Login-Screen.
- Kompletten Durchlauf testen: Profil ausfüllen, Vorfall erfassen, PDF
  erzeugen, "Anzeige einreichen" prüfen.
- Impressum/Datenschutz-Seiten aufrufen und sicherstellen, dass keine
  TODO-Platzhalter mehr sichtbar sind.

## Updates ausrollen

```bash
cd /opt/dickpic-anzeige
git pull
docker build -t dickpic-anzeige:latest .
docker compose up -d dickpic-anzeige
```
