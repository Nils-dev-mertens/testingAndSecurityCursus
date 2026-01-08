# Overzicht

In dit deel van de cursus bekijken we **HTTPS** niet als iets “magisch” dat browsers automatisch doen, maar als een **combinatie van technieken** die we al kennen:

* encryptie
* digitale handtekeningen
* authenticatie
* sleutels

We bouwen en simuleren die onderdelen stap voor stap met C#.

## Wat is HTTPS?

HTTPS is **geen nieuw protocol**, maar:

> **HTTP + TLS (Transport Layer Security)**

TLS zorgt ervoor dat:

* data niet leesbaar is voor derden
* data niet ongemerkt kan worden aangepast
* de client weet met **welke server** hij praat

Zonder TLS is HTTP gewoon **platte tekst**.



## Waarom is HTTP onveilig?

Zonder HTTPS:

* kan iedereen op het netwerk meelezen
* kunnen wachtwoorden onderschept worden
* kan content onderweg aangepast worden

Denk aan:

* open Wi-Fi
* bedrijfsnetwerken
* compromised routers

➡️ HTTPS lost dit op **zonder dat de applicatiecode verandert**.



### De drie garanties van HTTPS (CIA-model)

HTTPS levert exact de drie klassieke beveiligingsprincipes. zie cia model

## Certificaten – waarom vertrouwen we een server?

### Wat zit in een certificaat?

Een certificaat bevat o.a.:

* domeinnaam
* public key van de server
* geldigheidsperiode
* digitale handtekening van een CA

De browser controleert:

* is dit certificaat geldig?
* hoort het bij deze domeinnaam?
* is het ondertekend door een vertrouwde CA?



## Waarom Certificate Authorities (CA’s)?

Zonder CA’s zou iedereen kunnen zeggen:

> “Ik ben google.com”

CA’s fungeren als:

* identiteitscontrole
* vertrouwde derde partij

Browsers vertrouwen CA’s omdat hun **root certificates** ingebouwd zijn.



## Self-signed certificaat

Een self-signed certificaat:

* is technisch geldig
* maar niet vertrouwd

➡️ Perfect voor **development**, ongeschikt voor productie.



# We bouwen nu zelf HTTPS (praktisch)

## Stap 1 – Een mini HTTPS-server maken

### Waarom doen we dit?

Om te **zien** dat:

* HTTPS echt encryptie + authenticatie toevoegt
* browsers waarschuwen bij gebrek aan vertrouwen



### ASP.NET Minimal API met HTTPS

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5001, listenOptions =>
    {
        listenOptions.UseHttps();
    });
});

var app = builder.Build();

app.MapGet("/", () => "Hello HTTPS (dummy cert)");

app.Run();
```

### Wat gebeurt hier?

* Kestrel start op poort 5001
* HTTPS wordt automatisch gebruikt
* ASP.NET genereert een **self-signed certificaat**



### Waarom krijg je een browserwaarschuwing?

Omdat:

* het certificaat niet door een CA is ondertekend
* de browser geen trust chain kan opbouwen

➡️ Encryptie werkt, vertrouwen ontbreekt.



# Inspecteren van een servercertificaat

## Waarom inspecteren?

Als client wil je weten:

* wie de server is
* wie het certificaat heeft uitgegeven



## Stap 2 – Certificaat uitlezen met HttpClient

```csharp
HttpClientHandler handler = new HttpClientHandler();

handler.ServerCertificateCustomValidationCallback =
    (message, cert, chain, errors) =>
    {
        Console.WriteLine("Subject: " + cert.Subject);
        Console.WriteLine("Issuer: " + cert.Issuer);
        return true;
    };

HttpClient client = new HttpClient(handler);
var resp = await client.GetAsync("https://localhost:5001");

Console.WriteLine("Status: " + resp.StatusCode);
```

### Waarom werkt dit ondanks waarschuwing?

We **forceren** de client om het certificaat te accepteren.

➡️ Exact wat je **niet** mag doen in productie.



## Wat leer je hier?

* Subject → identiteit van de server
* Issuer → wie dit certificaat vertrouwt
* Self-signed → Subject == Issuer



# TLS-handshake begrijpen door simulatie

## Waarom combineren asymmetrisch + symmetrisch?

### Probleem:

* asymmetrische encryptie is **traag**
* symmetrische encryptie is **snel**, maar vereist gedeelde sleutel

### Oplossing:

* asymmetrisch → sleutel uitwisselen
* symmetrisch → data versturen



## Stap 3 – Mini-handshake simuleren

### RSA keypair (server)

```csharp
RSA rsa = RSA.Create(2048);
```

### Client genereert geheime sleutel

```csharp
byte[] secretKey = new byte[32];
RandomNumberGenerator.Fill(secretKey);
```

### Client encrypt met public key

```csharp
byte[] encrypted = rsa.Encrypt(secretKey, RSAEncryptionPadding.Pkcs1);
```

### Server decrypt met private key

```csharp
byte[] decrypted = rsa.Decrypt(encrypted, RSAEncryptionPadding.Pkcs1);
```

### Controleren

```csharp
bool match = secretKey.SequenceEqual(decrypted);
Console.WriteLine("Match: " + match);
```



## Wat heb je nu gesimuleerd?

* RSA → key exchange
* gedeeld geheim → sessiesleutel
* exact wat TLS doet (vereenvoudigd)



## Waarom niet alles met RSA?

* RSA is traag
* grote data → inefficiënt
* gevoelig voor timing attacks

➡️ Daarom schakelt TLS na de handshake over naar AES.



# Digitale handtekening binnen TLS

## Waarom handtekeningen in TLS?

Zonder handtekeningen:

* kan iedereen een sleutel uitwisselen
* maar niemand weet **met wie**

TLS gebruikt handtekeningen om:

* certificaten te verifiëren
* handshake-berichten te beschermen



## Stap 4 – Data ondertekenen en verifiëren

```csharp
RSA rsa = RSA.Create(2048);
byte[] data = Encoding.UTF8.GetBytes("Hello TLS!");
```

### Signeren

```csharp
byte[] signature = rsa.SignData(
    data,
    HashAlgorithmName.SHA256,
    RSASignaturePadding.Pkcs1
);
```

### Verifiëren

```csharp
bool verify = rsa.VerifyData(
    data,
    signature,
    HashAlgorithmName.SHA256,
    RSASignaturePadding.Pkcs1
);

Console.WriteLine("Geldig: " + verify);
```



## Wat betekent dit in TLS?

* CA ondertekent servercertificaat
* browser verifieert handtekening
* authenticatie is cryptografisch bewezen



# TLDR

* HTTPS = HTTP + TLS
* TLS levert:

  * privacy
  * integriteit
  * authenticatie
* Certificaten zorgen voor vertrouwen
* Asymmetrisch → sleuteluitwisseling
* Symmetrisch → snelle data
* Handtekeningen → identiteit

HTTPS is **geen magie**, maar een **compositie van technieken** die je nu afzonderlijk begrijpt.