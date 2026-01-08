## Wat

2FA is een methode die we toepassen op een applicatie om deze te beveiligen tegen hackers en verkeerde gebruikers. Dit is vooral handig tegen geautomatiseerde systemen die per gebruiker proberen in te loggen.

## Hoe

Dit gebeurt op de backend, zodat een aanvaller de clientcode minder gemakkelijk kan aanpassen om ergens binnen te geraken. Clientcode is niet altijd veilig; servercode is betrouwbaarder.

## Wanneer

Voor systemen met gevoelige informatie of gebruikersspecifieke data.

## Voorbeelden

Hier volgen enkele voorbeelden die stap voor stap worden uitgelegd.
We doen dit in twee fases:

1. Een basis 2FA-code
2. Een 2FA-code met tijdsbeperking (zoals in echte apps)

Alles gebeurt in een **console-applicatie**, zodat de logica duidelijk blijft.

## Stap 1 – Wat gaan we maken?

We bouwen een loginproces met een **extra beveiligingsstap**:

1. De gebruiker is “ingelogd” (dit simuleren we)
2. Het systeem genereert een **eenmalige code**
3. De gebruiker moet die code ingeven
4. Alleen bij een correcte code krijgt de gebruiker toegang

Dit is exact hoe banken, e-maildiensten en cloudplatformen werken — alleen gebruiken zij een app of sms in plaats van de console.



## Stap 2 – Projectstructuur

We werken met één `Program.cs`.

```text
2FactorAuth
└── Program.cs
```

Geen extra klassen of frameworks, focus puur op de logica.



## Stap 3 – Een 2FA-code genereren

Een 2FA-code is:

* tijdelijk
* moeilijk te raden
* maar makkelijk in te geven door een gebruiker

Daarom gebruiken we **6 cijfers**.

```csharp
Random random = new Random();
int twoFactorCode = random.Next(100000, 999999);
```

Wat gebeurt hier?

* `Random` genereert een willekeurig getal
* Door het bereik krijg je altijd exact 6 cijfers
* Dit simuleert de code uit een authenticator-app



## Stap 4 – Code “versturen” naar de gebruiker

In een echte applicatie:

* sms
* e-mail
* authenticator-app

In deze cursus tonen we de code in de console, zodat we verder kunnen bouwen.

```csharp
Console.WriteLine($"[2FA] Jouw code is: {twoFactorCode}");
```

Dit is **bewust onveilig**, maar didactisch noodzakelijk.



## Stap 5 – Code laten ingeven

Nu voegen we de tweede authenticatiefactor toe:
*iets wat de gebruiker heeft* → de juiste code.

```csharp
Console.Write("Voer de 2FA-code in: ");
string input = Console.ReadLine();
```

Belangrijk:

* `Console.ReadLine()` geeft altijd een string
* Daarom vergelijken we straks met `ToString()`



## Stap 6 – Code controleren

```csharp
if (input == twoFactorCode.ToString())
{
    Console.WriteLine("2FA succesvol. Toegang verleend.");
}
else
{
    Console.WriteLine("2FA mislukt. Toegang geweigerd.");
}
```

Op dit punt:

* wachtwoord of gebruikersnaam spelen **geen rol meer**
* één fout → geen toegang

Dit is de kern van 2FA.



## Volledige basis-implementatie

```csharp
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Login succesvol. 2FA vereist.");

        Random random = new Random();
        int twoFactorCode = random.Next(100000, 999999);

        Console.WriteLine($"[2FA] Jouw code is: {twoFactorCode}");

        Console.Write("Voer de 2FA-code in: ");
        string input = Console.ReadLine();

        if (input == twoFactorCode.ToString())
        {
            Console.WriteLine("2FA succesvol. Toegang verleend.");
        }
        else
        {
            Console.WriteLine("2FA mislukt. Toegang geweigerd.");
        }
    }
}
```



# Volgende stap: 2FA realistischer maken met tijdslimiet

In echte systemen is een code **maar kort geldig**.
Als iemand de code onderschept, moet die **snel verlopen**.

Daarom voegen we nu **tijd** toe aan onze logica.



## Stap 7 – Tijdstip van generatie bijhouden

```csharp
DateTime generatedAt = DateTime.Now;
```

Vanaf dit moment weten we:

* wanneer de code gemaakt werd
* hoe lang hij al bestaat



## Stap 8 – Geldigheid instellen

```csharp
TimeSpan validFor = TimeSpan.FromSeconds(30);
```

Dit simuleert:

* TOTP (Time-based One-Time Password)
* authenticator-apps die elke 30 seconden vernieuwen



## Stap 9 – Tijd controleren bij invoer

```csharp
DateTime now = DateTime.Now;

bool codeIsCorrect = input == twoFactorCode.ToString();
bool codeIsValid = (now - generatedAt) <= validFor;
```

We splitsen de controle bewust op:

* leesbaar
* uitbreidbaar
* realistisch



## Stap 10 – Beslissing nemen

```csharp
if (codeIsCorrect && codeIsValid)
{
    Console.WriteLine("2FA correct en binnen de tijd.");
}
else if (codeIsCorrect && !codeIsValid)
{
    Console.WriteLine("Code correct, maar verlopen.");
}
else
{
    Console.WriteLine("Foute 2FA-code.");
}
```

Dit is exact hoe echte systemen werken:

* juiste code ≠ automatisch toegang
* tijd is even belangrijk als de waarde



## Volledige 2FA met tijdscontrole

```csharp
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Login succesvol. 2FA vereist.");

        Random random = new Random();
        int twoFactorCode = random.Next(100000, 999999);
        DateTime generatedAt = DateTime.Now;
        TimeSpan validFor = TimeSpan.FromSeconds(30);

        Console.WriteLine($"[2FA] Jouw code is: {twoFactorCode}");
        Console.Write("Voer de 2FA-code in: ");
        string input = Console.ReadLine();

        DateTime now = DateTime.Now;

        bool codeIsCorrect = input == twoFactorCode.ToString();
        bool codeIsValid = (now - generatedAt) <= validFor;

        if (codeIsCorrect && codeIsValid)
        {
            Console.WriteLine("2FA correct en binnen de tijd.");
        }
        else if (codeIsCorrect && !codeIsValid)
        {
            Console.WriteLine("Code correct, maar verlopen.");
        }
        else
        {
            Console.WriteLine("Foute 2FA-code.");
        }
    }
}
```



## TLDR

* 2FA is **extra logica**, geen magie
* Tijd maakt brute-force en phishing veel moeilijker
* Correcte data ≠ geldige toegang
* Dit patroon wordt 1-op-1 gebruikt in webapps en API’s