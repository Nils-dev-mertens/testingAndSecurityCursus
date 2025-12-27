## Moq Datarij met DataRowMethod

Wanneer we meerdere soorten data willen testen zonder voor elk een aparte test te schrijven, kunnen we de DataRow-methode gebruiken:

```csharp
[DataTestMethod]
[DataRow("a", "b")]
[DataRow(" ", "a")]
public void TestMethodSamenvoegen(string waarde1, string waarde2)
{
    Assert.AreEqual(waarde1 + waarde2, string.Concat(waarde1, waarde2));
}
```

## Moq: Een Exception Veroorzaken in een Dependency

We kunnen Moq gebruiken om te simuleren hoe onze service reageert wanneer een afhankelijkheid een fout veroorzaakt:

```csharp
[TestMethod]
public void HuidigWeer_Bij_TemperatuurOphalen_Mislukt()
{
     // Arrange
     var openWeatherMap = new Mock<IOpenWeatherMapApi>();
     openWeatherMap.Setup(x => x.HuidigeTemperatuurInAntwerpen()).Throws<Exception>();

     // Act
     var weerService = new WeerService(openWeatherMap.Object);

     // Assert
     Assert.ThrowsException<Exception>(() => weerService.HuidigWeerInAntwerpen());
}
```

## Foutafhandeling Toevoegen aan de Weer Service

Stel dat de vereisten voor de `HuidigWeerInAntwerpen`-methode worden gewijzigd om een speciale boodschap te retourneren als de weer-API mislukt:

```csharp
public string HuidigWeerInAntwerpen()
{
    float temperatuur;
    try
    {
        temperatuur = weerApi.HuidigeTemperatuurInAntwerpen();
    }
    catch (Exception)
    {
        return "Temperatuur ophalen mislukt";
    }

    // Temperatuur classificatie
    if (temperatuur < 0)
    {
        return "Brr, het vriest";
    }
    if (temperatuur < 15)
    {
        return "Het is koud";
    }
    if (temperatuur < 24)
    {
        return "Het is prima weer";
    }
    return "Het is heet!!!";
}
```

Bijbehorende testcase:

```csharp
[TestMethod]
public void HuidigWeer_Bij_TemperatuurOphalen_Mislukt_Geeft_Foutmelding()
{
    // Arrange
    var weerApi = new Mock<IOpenWeatherMapApi>();
    weerApi.Setup(x => x.HuidigeTemperatuurInAntwerpen()).Throws<Exception>();

    // Act
    var weerService = new WeerService(weerApi.Object);
    var resultaat = weerService.HuidigWeerInAntwerpen();

    // Assert
    Assert.AreEqual("Temperatuur ophalen mislukt", resultaat);
}
```

## Belangrijkste Moq Concepten

1. **Mocking**: Het creëren van een gefingeerd object dat een interface of klasse nabootst
2. **Setup**: Het configureren van het gedrag van het mock-object
3. **Verify**: Controleren of specifieke methoden zijn aangeroepen
4. **Throws**: Simuleren van uitzonderingen
5. **Returns**: Definiëren van terugkeerwaarden voor methoden

## Best Practices

- Gebruik mocking om afhankelijkheden te isoleren
- Test verschillende scenario's
- Houd mock-objecten simpel en gefocust
- Vermijd te complexe mock-configuraties
- Test zowel het gelukkige pad als foutscenario's