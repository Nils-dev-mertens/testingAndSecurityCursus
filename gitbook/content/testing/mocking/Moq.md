## Moq data row met datarowmethod
als we meerdere soorten data willen testen zonder voor elk een aparte test te schrijven kunnen we het zo doen.

```csharp
[DataTestMethod]
[DataRow("a", "b")]
[DataRow(" ", "a")]
public void TestMethod1(string value1, string value2)
{
    Assert.AreEqual(value1 + value2, string.Concat(value1, value2));
}
```


## Moq een exception laten veroorzaken in een dependency

Voeg aan `WeatherServiceTests` de volgende test case toe:

```csharp
[TestMethod()]
public void GetCurrentWeatherInAntwerp_When_Getting_Temperature_Fails()
{
     // Arrange
     var openWeatherMap = new Mock<IOpenWeatherMapApi>();
     openWeatherMap.Setup(x => x.GetCurrentTemperatureInAntwerp()).Throws<Exception>(); // (1)

     // Act
     var weatherService = new WeatherService(openWeatherMap.Object);

     // Assert
     Assert.ThrowsException<Exception>(() => weatherService.GetCurrentWeatherInAntwerp()); // (2)
}

```

In `(1)` vertellen we aan `Moq` dat als de `GetCurrentTemperatureInAntwerp` methode van de api aangeroepen wordt, we willen dat er een exception gegooid wordt van het type `Exception`. Omdat in de weather service er geen afhandeling hiervan gebeurt, verwachten we dat de exception hier door passeert. Dit zien we in `(2)` waar er getest wordt dat als de `GetCurrentWeatherInAntwerp` aangeroepen wordt, die methode ook een exception gooit.

## Error handling toevoegen in de weather service

Stel de requirements voor de `GetCurrentWeatherInAntwerp` method worden gewijzigd zodat er een speciale boodschap teruggegeven wordt als de gebruikte weather api faalt. Dit wordt geïmplementeerd in het onderstaande stukje code:

```csharp
public string GetCurrentWeatherInAntwerp()
{
    float temp;
    try
    {
        temp = weatherApi.GetCurrentTemperatureInAntwerp();
    }
    catch (Exception)
    {
        return "Failed to get temperature";
    }
    if (temp < 0)
    {
        return "Brrrr, it's freezing";
    }
    if (temp < 15)
    {
        return "It's cold";
    }
    if (temp < 24)
    {
        return "it's ok";
    }
    return "It's HOT!!!";
}
```

We passen ook de test case aan:

```csharp
[TestMethod()]
public void GetCurrentWeatherInAntwerp_When_Getting_Temperature_Fails_Returns_Failed()
{
    // Arrange
    var weatherApi = new Mock<IOpenWeatherMapApi>();
    weatherApi.Setup(x => x.GetCurrentTemperatureInAntwerp()).Throws<Exception>();

    // Act
    var weatherService = new WeatherService(weatherApi.Object);
    var result = weatherService.GetCurrentWeatherInAntwerp();

    // Assert
    Assert.AreEqual("Failed to get temperature", result);
}
```
