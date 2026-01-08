## Waarom

Digitale handtekeningen worden gebruikt wanneer je **vertrouwen nodig hebt zonder fysiek contact**.
In deze cursus bouwen we een **vereenvoudigde digitale handtekening** om te begrijpen *waarom elke stap nodig is*.



## Waarom geen vertrouwen zonder controle?

Wanneer je een bestand downloadt of ontvangt:

* weet je niet wie het verstuurd heeft
* weet je niet of iemand het onderweg heeft aangepast

Daarom lossen digitale handtekeningen twee problemen op:

1. **Integriteit** – is het bestand gewijzigd?
2. **Authenticiteit** – komt het van de juiste afzender?



## Deel 1 – Waarom we met hashes werken

### Waarom geen bestand vergelijken?

Je zou kunnen denken:

> “Waarom sla ik het originele bestand niet gewoon opnieuw op?”

Dat werkt niet omdat:

* bestanden groot kunnen zijn
* vergelijken traag is
* één byte verschil alles breekt

Een **hash**:

* is klein (32 bytes bij SHA-256)
* is altijd dezelfde lengte
* verandert volledig bij de kleinste wijziging

➡️ Daarom werken digitale handtekeningen **altijd met hashes**, nooit met de volledige data.



## Stap 1 – Hash berekenen van een bestand

### Wat doen we?

We maken een **digitale vingerafdruk** van `secret.txt`.

### Waarom?

* Zo kunnen we later controleren of de inhoud identiek is
* Zonder het volledige bestand te vergelijken

### Code

```csharp
string content = File.ReadAllText("secret.txt");
byte[] contentBytes = Encoding.UTF8.GetBytes(content);
byte[] hashBytes = SHA256.HashData(contentBytes);
string hashBase64 = Convert.ToBase64String(hashBytes);
```

### Belangrijk inzicht

> Twee identieke bestanden → dezelfde hash
> Eén letter verschil → compleet andere hash



## Deel 2 – Waarom een public key (key-id)?

### Waarom koppelen we een bestand aan een key?

Integriteit alleen is **niet genoeg**.

Stel:

* iemand past het bestand aan
* berekent een nieuwe hash
* maakt een nieuwe signature

Zonder identiteit weet je nog steeds niet **wie** het deed.

Daarom koppelen we de hash aan een **sleutel**.



## Stap 2 – Public key simuleren

### Wat doen we?

We maken een bestand dat zegt:

> “Deze handtekening hoort bij KEY-1”

### Waarom apart?

* In echte systemen wordt de public key verspreid
* De private key blijft geheim
* Iedereen mag controleren, niemand mag vervalsen

### Code

```csharp
File.WriteAllText("secret.txt.pubkey", "KEY-1");
```



## Deel 3 – Waarom een signature apart bestand is

### Waarom niet alles samen in één bestand?

Door bestanden te scheiden:

* kun je signature hergebruiken
* blijft het origineel intact
* kan verificatie los gebeuren

Dat is exact hoe:

* software-updates
* PDF-handtekeningen
* e-mailhandtekeningen werken



## Stap 3 – Signature maken

### Wat zit erin?

* Welke key gebruikt werd
* Welke hash ondertekend is

### Code

```csharp
string signature = $"KEY-1:{hashBase64}";
File.WriteAllText("secret.txt.sig", signature);
```



## Wat hebben we nu?

| Bestand           | Functie    |
| -- | - |
| secret.txt        | Data       |
| secret.txt.pubkey | Identiteit |
| secret.txt.sig    | Bewijs     |

Samen vormen ze **vertrouwen**.



# Deel 4 – Waarom verificatie altijd door de ontvanger gebeurt

## Waarom de ontvanger laten rekenen?

De ontvanger **mag niets vertrouwen** wat hij krijgt.

Daarom:

* berekent hij zelf opnieuw de hash
* vergelijkt hij die met de signature
* gebruikt hij alleen de public key

➡️ Vertrouwen ontstaat door **zelf controleren**, niet door aannemen.



## Stap 4 – Verifiëren van de handtekening

### Signature ontleden

```csharp
string[] parts = signatureText.Split(':');
string keyId = parts[0];
string signedHash = parts[1];
```

### Key vergelijken

```csharp
if (pubKey != keyId)
{
    Console.WriteLine("Verkeerde afzender.");
    return;
}
```

### Hash opnieuw berekenen

```csharp
byte[] verifyBytes = Encoding.UTF8.GetBytes(fileContent);
string verifyHash = Convert.ToBase64String(
    SHA256.HashData(verifyBytes)
);
```

### Hashes vergelijken

```csharp
if (verifyHash == signedHash)
{
    Console.WriteLine("Bestand is authentiek en ongewijzigd.");
}
```



## Wat gebeurt bij manipulatie?

* inhoud aangepast → hash verandert
* signature blijft hetzelfde → mismatch
* verificatie faalt

Dit is **bewuste breekbaarheid**.



# Deel 5 – Waarom encryptie en handtekening combineren

## Waarom niet alleen encryptie?

Encryptie:

* verbergt de inhoud
* zegt niets over **wie** het stuurde
* zegt niets over **wijzigingen**

Je kunt perfect versleutelde **malware** ontvangen.



## Waarom eerst signen en dan encrypten?

In de praktijk:

* je **tekent de ciphertext**
* zodat ook de versleuteling beschermd is

➡️ Elke wijziging aan de encrypted data wordt detecteerbaar.



## Stap 5 – Encryptie met AES

### Waarom AES?

* snel
* symmetrisch
* standaard in de industrie

```csharp
using Aes aes = Aes.Create();
aes.GenerateKey();
aes.GenerateIV();
```



## Stap 6 – Ciphertext ondertekenen

### Waarom ciphertext en niet plaintext?

* plaintext zie je pas na decryptie
* je wil **eerst vertrouwen**, dan lezen
* voorkomt dat je corrupte data probeert te decrypten

```csharp
byte[] encHash = SHA256.HashData(encBytes);
```



# Deel 6 – Waarom verify vóór decrypt

## Wat als je eerst decrypt?

* corrupte data → crash
* foutieve sleutel → exceptions
* aanvalsvectoren

Daarom:

1. verify signature
2. pas dan decrypt



## Stap 7 – Decryptie uitvoeren

```csharp
using Aes aes = Aes.Create();
aes.Key = key;
aes.IV = iv;
```

Alleen uitgevoerd **na succesvolle verificatie**.



# TLDR

* Hash = identiteit van data
* Handtekening = bewijs van herkomst
* Encryptie = vertrouwelijkheid
* Verify **altijd** vóór decrypt
* Vertrouwen wordt berekend, niet aangenomen