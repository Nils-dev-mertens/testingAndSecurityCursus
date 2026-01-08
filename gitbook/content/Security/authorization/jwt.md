

## Wat probleem lost JWT op?

Wanneer een gebruiker inlogt, moet de server bij elke volgende request weten:

* **Wie** is deze gebruiker?
* **Wat** mag deze gebruiker doen?

### Klassieke oplossing (probleem)

Bij klassieke sessies:

* Server bewaart sessies in geheugen of database
* Client stuurt een sessie-id (cookie)
* Server moet **state bijhouden**

Problemen:

* Schaalbaarheidsissues (load balancers, meerdere servers)
* Sessies delen tussen services is complex
* Niet geschikt voor API’s en mobiele apps

### JWT-oplossing (idee)

Een JWT is:

> een **ondertekend gegevenspakket** dat de client bewaart en bij elke request meestuurt

Belangrijk:

* De server **onthoudt niets**
* Het token bevat zelf de info (claims)
* De server controleert alleen: *“Is dit token echt en geldig?”*



## Wat is een JWT technisch?

Een JWT is **geen magie**, gewoon een string met drie delen:

```
header.payload.signature
```

### 2.1 Header – hoe controleren we?

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Dit zegt:

* Welke **handtekening-algoritme**
* Dat het om een JWT gaat

Waarom belangrijk?
→ De server moet weten **hoe** hij de signature moet controleren.



### Payload – wat zit erin?

```json
{
  "sub": "123",
  "role": "admin",
  "exp": 1693780000
}
```

Dit zijn **claims**:

* `sub` → wie is de gebruiker
* `role` → autorisatie
* `exp` → vervaltijd

Waarom dit bestaat:

* Server kan beslissingen nemen **zonder database**
* Claims worden gelezen na validatie

Belangrijk:

> Payload is **leesbaar**, dus nooit gevoelige data opslaan



### Signature – waarom vertrouwen we dit?

De signature wordt zo gemaakt:

```
HMACSHA256(
  base64(header) + "." + base64(payload),
  secretKey
)
```

➡️ Alleen de server kent `secretKey`
➡️ Als iemand payload wijzigt → signature klopt niet meer

**Dit is het kernidee van JWT-beveiliging**



## JWT is géén encryptie (cruciaal)

Veel studenten denken:

> “JWT is veilig want je ziet niks”

Dat is fout.

JWT:

* ❌ niet versleuteld
* ✅ wel ondertekend

Iedereen kan dit doen:

```csharp
var json = Convert.FromBase64String(payload);
```

**Veiligheid = integriteit, niet geheimhouding**



## Mini JWT bouwen (console, puur begrip)

### Payload maken

```csharp
var payload = new
{
    sub = "1",
    role = "admin",
    exp = DateTimeOffset.UtcNow.AddMinutes(10).ToUnixTimeSeconds()
};

string payloadJson = JsonSerializer.Serialize(payload);
```

Waarom?

* We simuleren wat een server “in het token stopt”



### Base64 encoderen

```csharp
string payloadBase64 =
    Convert.ToBase64String(Encoding.UTF8.GetBytes(payloadJson));
```

Waarom?

* JWT gebruikt URL-veilige tekst
* Geen binaire data in HTTP-headers



### Signature maken

```csharp
string secret = "supersecretkey";

using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
byte[] sigBytes = hmac.ComputeHash(
    Encoding.UTF8.GetBytes(payloadBase64));

string signature = Convert.ToBase64String(sigBytes);
```

Waarom?

* Dit is de **controle**
* Alleen iemand met `secret` kan dit opnieuw berekenen



### Token samenstellen

```csharp
string token = payloadBase64 + "." + signature;
Console.WriteLine(token);
```

Dit **is** het JWT-concept.
Geen framework. Geen magie.



## Token valideren (server-denken)

Bij een request doet de server:

1. Payload lezen
2. Signature opnieuw berekenen
3. Vergelijken
4. `exp` controleren

### Signature check

```csharp
bool valid = signature == recalculatedSignature;
```

Waarom?

* Payload mag nooit blind vertrouwd worden



### Expiry check

```csharp
if (payload.exp < DateTimeOffset.UtcNow.ToUnixTimeSeconds())
{
    Console.WriteLine("Token verlopen");
}
```

Waarom?

* Gestolen tokens moeten beperkt bruikbaar zijn



## JWT in echte applicaties (conceptueel)

### Login-flow

1. Gebruiker logt in
2. Server valideert wachtwoord
3. Server maakt JWT
4. Client bewaart JWT
5. Client stuurt JWT bij elke request

```http
Authorization: Bearer eyJhbGciOi...
```



### Waarom Bearer?

> “Wie dit token heeft, mag het gebruiken”

Daarom:

* HTTPS verplicht
* Korte geldigheid
* Veilige opslag



## Hoofdstuk 7 – Opslag en risico’s

### Slechte opslag

* localStorage
* sessionStorage

→ gevoelig voor XSS

### Betere opslag

* httpOnly Secure cookies

Waarom?

* JavaScript kan token niet lezen
* Minder impact bij XSS



## Hoofdstuk 8 – Voor- en nadelen (eerlijk beeld)

### Voordelen

* Stateless
* Snel
* Ideaal voor API’s
* Geen sessiedatabase

### Nadelen

* Intrekken is moeilijk
* Payload leesbaar
* Slechte opslag = groot risico



## TLDR

* JWT ≠ encryptie
* JWT = **handtekening + claims**
* Vertrouwen komt van **signature**
* Claims bepalen **autorisatie**
* HTTPS is verplicht
