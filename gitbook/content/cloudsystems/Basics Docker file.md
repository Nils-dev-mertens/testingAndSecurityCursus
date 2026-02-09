# Dockerfile: van basis tot deployment

## Inleiding
Een Dockerfile beschrijft stap voor stap hoe je een containerimage bouwt. Onderstaande gids is opgedeeld in drie delen:
1. Snelle referentie van veelgebruikte bouw- en run-commando's
2. Opslag en debuggingtips tijdens development
3. Diepgaande uitleg van een voorbeeld Dockerfile voor een statische website

---

## 1. Bouw- en runcommando's
### Image bouwen en container starten
```bash
docker build -t mijn-app .
docker run -d -p 3000:3000 --name node-container mijn-app
```
- Bouw een image en geef de tag `mijn-app`
- Start vervolgens een container die poort 3000 aan de host koppelt

---

## 2. Data persistente houden tijdens development
### Bind mount (ontwikkelmodus)
```bash
docker run -d -p 3000:3000 --name node-container \
  --mount type=bind,src=$(pwd)/data,dst=/app/data mijn-app
```
- Gebruik lokale bestanden direct in de container
- Ideaal voor live herladen zonder rebuild

### Named volume (productie)
```bash
docker volume create mijn-volume
docker run -d -p 3000:3000 --name node-container \
  --mount type=volume,src=mijn-volume,dst=/app/data mijn-app
```
- Data blijft beschikbaar, zelfs na het verwijderen van de container
- Docker beheert het pad en de lifecycle van het volume

### Debugging en beheer
```bash
docker logs node-container
docker exec -it node-container /bin/bash
docker ps -a
docker stop node-container
docker rm node-container
docker rmi mijn-app
```
- Combineer `logs` en `exec` om runtime problemen te onderzoeken
- Sluit en verwijder containers/images wanneer ze niet meer nodig zijn

---

## 3. Uitleg bij voorbeeld Dockerfile
```dockerfile
FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY ./public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Stap 1. `FROM nginx:latest`
- Elke Dockerfile start met een basisimage
- Door `nginx:latest` te gebruiken krijg je een klein Linux-systeem inclusief Nginx
- Vermijd eigen installaties; je bouwt verder op de officiële image

### Stap 2. `WORKDIR /usr/share/nginx/html`
- Stelt het standaardwerkpad in voor volgende commando's
- Nginx serveert statische bestanden vanuit deze map
- Voorkomt dat je steeds absolute paden moet herhalen

### Stap 3. `COPY ./public /usr/share/nginx/html`
- Kopieert je lokale `public` map naar het werkpad in de container
- Tijdens de build worden enkel bestanden uit de *build context* meegenomen
- Overschrijft de standaard Nginx demo-content met je eigen website

### Stap 4. `EXPOSE 80`
- Documenteert dat de container luistert op poort 80
- Op zichzelf opent het geen poorten; het helpt tooling en teams
- Combineer met `docker run -p 8080:80` om extern verkeer toe te laten

### Stap 5. `CMD ["nginx", "-g", "daemon off;"]`
- `CMD` specificeert welk proces start wanneer de container draait
- De vlag `daemon off` zorgt ervoor dat Nginx op de voorgrond blijft
- Docker stopt automatisch de container als het hoofdproces eindigt

---

## Samenvattende tabel
| Dockerfile-instructie | Wat doet het?                          | Waarom hier relevant                              |
|-----------------------|----------------------------------------|---------------------------------------------------|
| `FROM`                | Kies startimage                        | Levert direct een werkende Nginx-configuratie     |
| `WORKDIR`             | Zet standaarddirectory                 | Werken in de map waar Nginx content verwacht      |
| `COPY`                | Kopieert bestanden naar het image      | Maakt jouw site beschikbaar binnen de container   |
| `EXPOSE`              | Documenteert netwerkpoort              | Laat zien dat verkeer via 80 verwacht wordt       |
| `CMD`                 | Start het hoofdproces bij runtime      | Houdt Nginx actief zodra de container opstart     |

> Tip: breid deze Dockerfile uit met `RUN`-stappen (bijvoorbeeld build scripts) of `ARG`-variabelen voor build-time configuratie wanneer je een complexere app hebt.
