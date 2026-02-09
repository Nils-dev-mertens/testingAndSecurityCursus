
# Netwerken en routing: basisconcepten voor Docker en daarbuiten

## Inleiding
Routing en IP-adressering vormen de ruggengraat van elke cloud- of containeromgeving. Deze uitleg sluit aan bij de Docker-lessen: zodra je meerdere containers of machines met elkaar wil laten praten, heb je inzicht nodig in IP-adressen, subnetten en hoe pakketten hun weg vinden.

---

## 1. IP-adressen
- **IPv4-adres**: bestaat uit 32 bits, opgedeeld in 4 octetten (bijv. `192.168.1.10`)
- **Uniek binnen netwerk**: elk apparaat (host) heeft een eigen adres
- **Privé vs. publiek**: privé reeksen (zoals `192.168.x.x`) zijn enkel binnen het lokale netwerk zichtbaar

> Denk aan een IP-adres als een straatadres: het vertelt routers waarheen een pakketje moet.

---

## 2. Subnetmaskers en CIDR
Het subnetmasker bepaalt welk deel van het IP-adres het netwerk aanduidt en welk deel de host aangeeft. In CIDR-notatie schrijf je dit als `/24`, `/16`, ...

| CIDR | Decimale notatie    | Aantal hosts | Typisch gebruik           |
|------|---------------------|--------------|---------------------------|
| /8   | 255.0.0.0           | 16.777.214   | Grote (internet) netwerken|
| /16  | 255.255.0.0         | 65.534       | Middelgrote netwerken     |
| /24  | 255.255.255.0       | 254          | LAN, Docker bridge        |
| /30  | 255.255.255.252     | 2            | Point-to-point links      |

**Werking**: bits die `1` zijn in het masker stellen het netwerkdeel voor, bits die `0` zijn het hostdeel.

---

## 3. Netwerk-, broadcast- en hostadressen bepalen
1. Schrijf IP-adres en subnetmasker in binair
2. Houd het netwerkdeel gelijk
3. Zet alle hostbits op `0` voor het netwerkadres
4. Zet alle hostbits op `1` voor het broadcastadres
5. Hostadressen liggen tussen netwerk + 1 en broadcast - 1

### Voorbeeld
IP `100.103.28.116/17`
- Netwerkadres: `100.103.0.0`
- Broadcastadres: `100.103.127.255`
- Eerste host: `100.103.0.1`
- Laatste host: `100.103.127.254`

Zo weet je welke IP's veilig uitgedeeld kunnen worden.

---

## 4. Subnetten maken
Door de maskerlengte te verhogen, deel je een netwerk op in kleinere subnetten.

### Voorbeeld: splits `10.5.0.0/16` in twee subnetten
- `/17` geeft twee blokken: `10.5.0.0/17` en `10.5.128.0/17`
- Elk blok bevat 32.768 hostadressen

### Nog verder opdelen
`10.5.0.0/18` → `10.5.0.0` t/m `10.5.63.255`
`10.5.64.0/18` → `10.5.64.0` t/m `10.5.127.255`

> In Docker kun je eigen bridge-netwerken aanmaken met een specifiek subnet (bijv. `172.20.0.0/16`). Zo beheers je IP-ranges en voorkom je conflicten.

---

## 5. Controleren of een subnet binnen een groter netwerk valt
Vraag: is `172.25.13.0/24` onderdeel van `172.16.0.0/12`?
- `172.16.0.0/12` loopt van `172.16.0.0` t/m `172.31.255.255`
- `172.25.13.0/24` valt binnen dit bereik → ja

Gebruik hetzelfde principe bij het plannen van cloud VPC's of Docker-netwerken.

---

## 6. Routing in een notendop
- **Default gateway**: het adres waar hosts pakketjes heen sturen die buiten het eigen subnet gaan
- **Routing tabel**: lijst met regels die routers gebruiken om het juiste pad te kiezen
- **Route berekenen**: routers matchen het langste overeenkomstige subnet (Longest Prefix Match)

### Voorbeeldscenario
1. Container A (`172.20.0.5`) wil Container B (`172.21.0.8`) bereiken
2. Beide netwerken zijn verbonden via een router of Docker overlay
3. Router kiest de route met de langste match (bijv. `172.21.0.0/24` boven `172.0.0.0/8`)

---

## 7. Praktische tips voor labs en Packet Tracer
- Teken een schema: IP-ranges, routers, gateways
- Kies subnetten die logisch bij elkaar horen (bijv. per verdieping of service)
- Controleer bereikbaarheid met `ping` en `traceroute`
- Documenteer toegewezen adressen – voorkomt conflicten tijdens groepsopdrachten

---

## Samenvatting
- IP-adressen identificeren hosts binnen een netwerk
- Subnetmaskers (CIDR) bepalen de grootte van het netwerk
- Netwerk-, host- en broadcastadressen bereken je met binair denken
- Subnetting helpt je grote ranges op te splitsen in beheersbare blokken
- Routing maakt communicatie tussen subnetten mogelijk via gateways

Met deze basis leg je het fundament voor Docker-netwerken, cloud VPC's en klassieke netwerkopstellingen.
