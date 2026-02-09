## Inleiding
Docker biedt een uitgebreide CLI om containers en infrastructuur snel te beheren. Dit overzicht bundelt de meest gebruikte commando's, gegroepeerd per scenario. Zie het als een naslagwerk voor dagelijks gebruik en als inspiratie voor eigen scripts of automation.

---

## 1. Opruimen en systeembeheer
### Docker resources opschonen
```bash
docker system prune -af
```
- **`prune`** verwijdert ongebruikte containers, images, volumes en netwerken
- **`-a`** ruimt ook oude (non-dangling) images op
- **`-f`** slaat de bevestigingsvraag over – gebruik bewust

> Let op: voer dit alleen uit wanneer je zeker weet dat geen enkele container of image nog nodig is.

---

## 2. Images en containers beheren
### Eigen image bouwen
```bash
docker build -t <image_naam> .
```
- **`-t`** geeft de image een herkenbare naam en tag
- De punt (`.`) gebruikt de huidige map als build-context

### Container starten
```bash
docker run -d -p <host_port>:<container_port> --name <container_naam> <image_naam>
```
- **`-d`** draait de container op de achtergrond
- **`-p`** publiceert een poort naar de host
- **`--name`** geeft een vaste naam zodat je de container makkelijk kan terugvinden

### Container lifecycle
```bash
docker stop <container_naam>
docker rm <container_naam>
```
- **`stop`** beëindigt het proces netjes
- **`rm`** verwijdert de container (alleen mogelijk als deze gestopt is)

---

## 3. Opslag: bind mounts en volumes
### Bind mount – werken met lokale bestanden
```bash
docker run --mount type=bind,src=$(pwd)/<local_path>,dst=/<container_path> \
  -d -p <host_port>:<container_port> --name <container_naam> <image_naam>
```
- **`type=bind`** koppelt een bestaande map of file van de host
- **`src`** verwijst naar het absolute pad op de host (hier de huidige map)
- **`dst`** is het pad in de container

### Named volume – persistente data los van de host
```bash
docker volume create <volume_naam>
docker run --mount type=volume,src=<volume_naam>,dst=/<container_path> \
  -d -p <host_port>:<container_port> --name <container_naam> <image_naam>
```
- Volumes leven buiten de container en zijn ideaal voor data zoals databases

### Volume beheren
```bash
docker volume inspect <volume_naam>
docker volume rm <volume_naam>
```
- **`inspect`** toont locatie, drivers en gebruik
- **`rm`** werkt alleen als het volume niet gekoppeld is

### Volume exporteren als back-up
```bash
docker run --rm \
  --mount type=volume,src=<volume_naam>,dst=/data,ro \
  --mount type=bind,src=$(pwd),dst=/backup \
  debian tar cfz /backup/data.tar.gz /data
```
- Combineert een tijdelijk container met **`tar`** om een gecomprimeerd archief te maken
- De flag **`--rm`** ruimt de tijdelijke container na afloop automatisch op

---

## 4. Netwerken
### Netwerk aanmaken
```bash
docker network create <netwerk_naam>
```
- Standaard wordt een bridge-netwerk aangemaakt, geschikt voor lokale multi-container setups

### Bestaande container verbinden
```bash
docker network connect <netwerk_naam> <container_naam>
```
- Laat containers met elkaar communiceren via interne DNS (containernaam)

### Netwerk verwijderen
```bash
docker network rm <netwerk_naam>
```
- Kan pas wanneer alle containers van het netwerk zijn losgekoppeld

### IP-adres van een container opvragen
```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_naam>
```
- De `-f` vlag gebruikt Go templates om enkel het IP-adres te tonen

---

## 5. MySQL-container met persistente data
### Container starten met volume en wachtwoord
```bash
docker run --mount type=volume,src=<volume_naam>,dst=/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=<wachtwoord> \
  -d --name <container_naam> mysql:latest
```
- **`MYSQL_ROOT_PASSWORD`** is verplicht voor een veilige configuratie
- Door het volume te mounten blijft de database behouden wanneer de container verdwijnt

### Interactief inloggen
```bash
docker exec -it <container_naam> /bin/bash
mysql -u root -h 127.0.0.1 -p
```
- **`exec -it`** start een shell in de container; vanuit daar kun je de MySQL-client gebruiken

### Voorbeeld SQL-script
```sql
CREATE USER 'dbUser'@'127.0.0.1' IDENTIFIED BY 'DitIsGoed';
GRANT ALL PRIVILEGES ON *.* TO 'dbUser'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
CREATE DATABASE Cloudsystemen;
USE Cloudsystemen;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- Maak een gebruiker, database en tabel aan voor een demo

### Data beheren
```sql
INSERT INTO users (name, email, age) VALUES
('Alice Johnson', 'alice@example.com', 28),
('Bob Smith', 'bob@example.com', 34),
('Charlie Brown', 'charlie@example.com', 25);
SELECT * FROM users;
```
- Gebruik `SELECT` om resultaten meteen te controleren

### Container vervangen zonder data te verliezen
```bash
docker stop <container_naam>
docker rm <container_naam>
docker run --mount type=volume,src=<volume_naam>,dst=/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=<wachtwoord> \
  -d --name <container_naam> mysql:latest
```
- Het volume bevat alle data, waardoor een nieuwe container meteen dezelfde database ziet

---

## 6. Demo: webserver en client-container
### Containers opzetten
```bash
docker run -p 80:80 -d --name webserver httpd:latest
docker run -d --name client debian sleep infinity
```
- `httpd:latest` levert een Apache-server
- Een minimalistische Debian-container blijft draaien met `sleep infinity`

### Verbinding testen vanuit de client
```bash
docker exec -it client /bin/bash
apt-get update && apt-get install -y curl
curl webserver
```
- Installeer `curl` om HTTP-verzoeken uit te voeren binnen het netwerk

### Eigen netwerk maken
```bash
docker network create demo_network
docker network connect demo_network webserver
docker network connect demo_network client
```
- Zodra beide containers in hetzelfde netwerk zitten, kun je de service aanspreken via de containernaam

### Controle
```bash
docker exec -it client /bin/bash
curl webserver
```
- Verwacht een HTML-respons van de Apache-server

---

## Snelle checklist
- Houd de host schoon met `docker system prune`
- Tag images en geef containers duidelijke namen
- Kies bind mounts voor lokale ontwikkeling, volumes voor persistente data
- Maak per project een apart netwerk voor overzicht en isolatie
- Automatiseer databaseback-ups met volumes en `tar`
