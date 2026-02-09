# Docker Compose: multi-container applicaties beheren

## Inleiding
Met Docker Compose definieer je een volledige omgeving (services, netwerken en volumes) in één YAML-bestand. Ideaal voor projecten waar meerdere containers – bijvoorbeeld een webapp en een database – samenwerken. Deze pagina geeft context, een voorbeeldbestand en de belangrijkste commando's.

---

## 1. Structuur van `docker-compose.yml`
```yaml
services:
  app:
    build: .
    ports:
      - "80:80"
    depends_on:
      - mongodb
    networks:
      - mongodb_network

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root
    volumes:
      - mongodb_data:/data/db
    networks:
      - mongodb_network

networks:
  mongodb_network:
    driver: bridge

volumes:
  mongodb_data:
```

### Uitleg per onderdeel
#### `services`
Hier definieer je elke container.
- `app` wordt gebouwd met de Dockerfile in de huidige directory
- `depends_on` zorgt ervoor dat `mongodb` eerst start
- Beide services delen het netwerk `mongodb_network`

#### `mongodb`
- Gebaseerd op de officiële `mongo:latest` image
- Gebruikt environment variabelen om de root-user en wachtwoord te configureren
- Slaat data op in het volume `mongodb_data`

#### `networks`
- `mongodb_network` gebruikt de standaard `bridge`-driver zodat containers elkaar via DNS kunnen vinden

#### `volumes`
- `mongodb_data` bewaart databasebestanden buiten de container, zodat data behouden blijft bij herstart

---

## 2. Workflow met Docker Compose
### Project starten
```bash
docker compose up -d
```
- Bouwt ontbrekende images
- Start alle services in de achtergrond (detached)

### Status opvragen
```bash
docker compose ps
```
- Toont containers die bij het project horen

### Logs volgen
```bash
docker compose logs -f app
```
- De `-f` vlag houdt de output open; vervang `app` door de service die je wil zien

### Project stoppen en opruimen
```bash
docker compose down
```
- Stopt containers en verwijdert standaard de gekoppelde netwerken
- Voeg `--volumes` toe wanneer je ook volumes wil verwijderen

---

## 3. Tips voor teams
- Commit je `docker-compose.yml` zodat iedereen dezelfde omgeving gebruikt
- Gebruik `.env`-bestanden voor gevoelige waarden (zoals wachtwoorden)
- Label services met `profiles` indien je optionele onderdelen (bijv. monitoring) wil activeren
- Combineer Compose met CI/CD pipelines om lokale setups te spiegelen naar testomgevingen
