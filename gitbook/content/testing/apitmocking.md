## 1. Opruimen en beheer
### Verwijderen van ongebruikte containers, images en netwerken:
```bash
docker system prune -af
```
* `prune`: Verwijdert ongebruikte data
* `-a`: Verwijdert alle ongebruikte images, niet alleen "dangling" ones
* `-f`: Forceert de verwijdering zonder bevestiging

## 2. Docker Image en Container Management
### Image bouwen:
```bash
docker build -t <image_naam> .
```
* `-t`: Geeft de image een naam
* `.`: Geeft de build-context aan (huidige map)

### Container starten:
```bash
docker run -d -p <host_port>:<container_port> --name <container_naam> <image_naam>
```
* `-d`: Start container in "detached" mode (op de achtergrond)
* `-p`: Bindt een poort van de host naar de container
* `--name`: Geeft de container een specifieke naam

### Container stoppen en verwijderen:
```bash
docker stop <container_naam>
docker rm <container_naam>
```
* `stop`: Stopt een draaiende container
* `rm`: Verwijdert een gestopte container

## 3. Docker Bind Mounts en Volumes
### Bind mount gebruiken:
```bash
docker run --mount type=bind,src=$(pwd)/<local_path>,dst=/<container_path> -d -p <host_port>:<container_port> --name <container_naam> <image_naam>
```
* `--mount type=bind`: Bindt een lokale map of bestand aan de container
* `src=$(pwd)/<local_path>`: Pad op de host
* `dst=/<container_path>`: Mountpoint in de container

### Volume aanmaken en gebruiken:
```bash
docker volume create <volume_naam>
docker run --mount type=volume,src=<volume_naam>,dst=/<container_path> -d -p <host_port>:<container_port> --name <container_naam> <image_naam>
```
* `docker volume create`: Maakt een persistente opslag aan
* `--mount type=volume`: Verbindt het volume aan de container

### Volume inspecteren en verwijderen:
```bash
docker volume inspect <volume_naam>
docker volume rm <volume_naam>
```
* `inspect`: Geeft details over het volume
* `rm`: Verwijdert het volume (alleen als het niet in gebruik is)

### Volume exporteren:
```bash
docker run --rm --mount type=volume,src=<volume_naam>,dst=/data,ro --mount type=bind,src=$(pwd),dst=/backup debian tar cfz /backup/data.tar.gz /data
```
* `--rm`: Verwijdert de tijdelijke container na uitvoering
* `tar cfz`: Maakt een gecomprimeerd archief aan

## 4. Docker Networking
### Netwerk aanmaken:
```bash
docker network create <netwerk_naam>
```
* `create`: Maakt een nieuwe bridge-netwerk

### Container verbinden met netwerk:
```bash
docker network connect <netwerk_naam> <container_naam>
```
* `connect`: Verbindt een bestaande container aan een netwerk

### Netwerk verwijderen:
```bash
docker network rm <netwerk_naam>
```
* `rm`: Verwijdert het netwerk (alleen als er geen containers op draaien)

### Container IP-adres ophalen:
```bash
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_naam>
```
* `inspect`: Haalt details van de container op
* `-f '{{...}}'`: Formatteert de output om enkel het IP-adres te tonen

## 5. MySQL Container Management
### MySQL-container starten met volume:
```bash
docker run --mount type=volume,src=<volume_naam>,dst=/var/lib/mysql -e MYSQL_ROOT_PASSWORD=<wachtwoord> -d --name <container_naam> mysql:latest
```
* `-e MYSQL_ROOT_PASSWORD`: Stelt een root-wachtwoord in
* `--mount type=volume`: Zorgt voor persistente opslag van databasegegevens

### Inloggen op MySQL in de container:
```bash
docker exec -it <container_naam> /bin/bash
mysql -u root -h 127.0.0.1 -p
```
* `exec -it`: Voert een interactief commando uit in de container
* `mysql -u root -h 127.0.0.1 -p`: Verbindt met de MySQL-server binnen de container

### Database en gebruiker aanmaken:
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
* `CREATE USER`: Nieuwe MySQL-gebruiker aanmaken
* `GRANT ALL PRIVILEGES`: Toegang verlenen aan gebruiker
* `FLUSH PRIVILEGES`: Veranderingen toepassen
* `CREATE DATABASE`: Nieuwe database aanmaken
* `CREATE TABLE`: Een nieuwe tabel aanmaken met verschillende velden

### Data in de MySQL-tabel invoegen en bekijken:
```sql
INSERT INTO users (name, email, age) VALUES
('Alice Johnson', 'alice@example.com', 28),
('Bob Smith', 'bob@example.com', 34),
('Charlie Brown', 'charlie@example.com', 25);
SELECT * FROM users;
```
* `INSERT INTO`: Voegt data toe aan de tabel
* `SELECT * FROM`: Bekijkt de opgeslagen gegevens

### Container verwijderen en data behouden:
```bash
docker stop <container_naam>
docker rm <container_naam>
docker run --mount type=volume,src=<volume_naam>,dst=/var/lib/mysql -e MYSQL_ROOT_PASSWORD=<wachtwoord> -d --name <container_naam> mysql:latest
```
* Data blijft behouden in het volume, ook al wordt de container verwijderd

## 6. Webserver en Client Container Networking
### Webserver en client opzetten:
```bash
docker run -p 80:80 -d --name webserver httpd:latest
docker run -d --name client debian sleep infinity
```
* `httpd:latest`: Apache-webserver
* `debian sleep infinity`: Houdt de client-container actief

### Curl installeren en verbinding testen:
```bash
docker exec -it client /bin/bash
apt-get update && apt-get install -y curl
curl webserver
```

### Containers verbinden via netwerk:
```bash
docker network create demo_network
docker network connect demo_network webserver
docker network connect demo_network client
```
* Zorgt ervoor dat client de webserver kan bereiken via de naam `webserver`

### Netwerk testen vanuit client:
```bash
docker exec -it client /bin/bash
curl webserver
```
* De webserver reageert nu via DNS-resolutie binnen Docker