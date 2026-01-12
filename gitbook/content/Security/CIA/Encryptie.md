# Encryptie en Beveiliging van Gevoelige Gegevens

## Authenticatie en Gegevensbeveiliging

### Wachtwoordbeveiliging: Meer dan Alleen Opslaan

#### Plain Text is Gevaarlijk
Wachtwoorden in plain text opslaan is een ernstige beveiligingsfout:
- Kwetsbaar voor datalekken
- Eenvoudig te misbruiken door aanvallers
- Geen enkele bescherming bij systeeminbraken

#### Beschermingsmethoden

1. **Hashing**
   - Zet wachtwoord om in een onomkeerbaar formaat
   - Zelfde invoer geeft altijd zelfde hash
   - Onmogelijk om oorspronkelijk wachtwoord terug te herleiden

```csharp
public static string HashString(string wachtwoord)
{
    using (SHA256 sha256 = SHA256.Create())
    {
        byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(wachtwoord));
        return Convert.ToBase64String(bytes);
    }
}
```

2. **Encryptie**
   - Omkeerbaar proces
   - Vereist een sleutel voor ontsleutelen
   - Geschikt voor gegevens die later terug leesbaar moeten zijn

> installeer de package System.Security.Cryptography.Pkcs als dit niet beschikbaar is

```csharp
public static byte[] Versleutel(string tekst, X509Certificate2 certificaat)
{
    byte[] data = Encoding.UTF8.GetBytes(tekst);
    ContentInfo contentInfo = new ContentInfo(data);
    EnvelopedCms cms = new EnvelopedCms(contentInfo);
    CmsRecipient ontvanger = new CmsRecipient(certificaat);
    
    cms.Encrypt(ontvanger);
    return cms.Encode();
}
```

### Authenticatie Strategieën

#### Account Lockout Mechanisme
Bescherm tegen brute force aanvallen:
- Begrens aantal inlogpogingen
- Tijdelijke blokkering na meerdere mislukte pogingen

```csharp
public class AuthenticatieService
{
    private const int MAX_POGINGEN = 3;
    private int _huidigePoging = 0;

    public bool Authenticeer(string wachtwoord)
    {
        if (_huidigePoging >= MAX_POGINGEN)
        {
            Console.WriteLine("Account geblokkeerd");
            return false;
        }

        bool isCorrect = ControleerWachtwoord(wachtwoord);
        
        if (!isCorrect)
        {
            _huidigePoging++;
        }
        else
        {
            _huidigePoging = 0;
        }

        return isCorrect;
    }
}
```

## Cryptografische Concepten

### Symmetrische vs Asymmetrische Encryptie

#### Symmetrische Encryptie
- Zelfde sleutel voor versleutelen en ontsleutelen
- Snel en efficiënt
- Uitdaging: Veilige sleuteluitwisseling

#### Asymmetrische Encryptie (Public Key)
- Publieke en private sleutel
- Publieke sleutel voor versleutelen
- Private sleutel voor ontsleutelen
- Gebruikt bij X.509 certificaten

### X.509 Certificaten

```csharp
public class CertificaatBeheer
{
    public static X509Certificate2 LaadCertificaat()
    {
        X509Store store = new X509Store(StoreLocation.CurrentUser);
        store.Open(OpenFlags.ReadOnly);
        
        foreach (var cert in store.Certificates)
        {
            if (cert.HasPrivateKey)
            {
                store.Close();
                return cert;
            }
        }
        
        throw new Exception("Geen geldig certificaat gevonden");
    }
}
```

## Best Practices

1. **Nooit Plain Text Wachtwoorden**
   - Gebruik altijd hashing
   - Voeg salt toe voor extra beveiliging

2. **Sterke Encryptie-algoritmen**
   - SHA-256 voor hashing
   - AES voor symmetrische encryptie
   - RSA voor asymmetrische encryptie

3. **Certificaatbeheer**
   - Gebruik gekwalificeerde certificaten
   - Regelmatig vernieuwen
   - Veilig private keys beheren

## Reflectievragen

- Wat zijn de fundamentele verschillen tussen hashing en encryptie?
- Hoe bescherm je tegen veelvoorkomende authenticatieaanvallen?
- Wanneer gebruik je symmetrische vs asymmetrische encryptie?

## Conclusie

Beveiliging van gevoelige gegevens vereist een gelaagde aanpak:
- Juiste cryptografische technieken
- Bewuste implementatie
- Continue evaluatie van beveiligingsmaatregelen

Cryptografie is niet alleen een technische uitdaging, maar ook een fundamentele beschermlaag voor digitale informatie.