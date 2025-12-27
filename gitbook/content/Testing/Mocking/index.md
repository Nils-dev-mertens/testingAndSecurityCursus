## Algemene uitleg

Mocking is een manier om iets na te bootsen zodat we afzonderlijke onderdelen kunnen testen. Je schrijft testen om verschillende componenten te isoleren. Bijvoorbeeld, als je twee andere klassen nodig hebt om een klasse te testen, is het de bedoeling om alleen die specifieke klasse te testen, niet de bijbehorende afhankelijkheden. 

Een voorbeeld met een auto:

```csharp
public interface IWheel
{
    bool StartEngine();
    void StopEngine();
}

public interface IEngine
{
    void Start();
    void Stop();
}

public class Car 
{
    private IEngine _engine;
    private IWheel _wheel;

    // Constructor met afhankelijkheidsinjectie
    public Car(IEngine engine, IWheel wheel)
    {
        _engine = engine;
        _wheel = wheel;
    }

    public void Drive()
    {
        _engine.Start();
        _wheel.StartEngine();
    }
}
```

De extra klassen hier zijn de `Engine` en `Wheel`, die we willen mocken tijdens het testen van de `Car` klasse.

## Mock Klassen

Mock klassen bevatten doorgaans minimale code met vaste retourwaarden. Het doel is om de kans op bugs te verkleinen en de test te vereenvoudigen:

```csharp
public class MockWheel : IWheel
{
    public bool IsRunning { get; private set; } = false;

    public bool StartEngine()
    {
        IsRunning = true;
        return true;
    }

    public void StopEngine()
    {
        IsRunning = false;
    }
}
```

## Testvoorbeelden

### Handmatige Mock

```csharp
public class CarTest
{
    [TestMethod]
    public void TestCarDrive()
    {
        // Handmatige mock
        var mockWheel = new MockWheel();
        var mockEngine = new Mock<IEngine>();
        mockEngine.Setup(e => e.Start());

        var car = new Car(mockEngine.Object, mockWheel);
        car.Drive();

        Assert.IsTrue(mockWheel.IsRunning);
        mockEngine.Verify(e => e.Start(), Times.Once);
    }
}
```

### Moq (Dependency Mocking Bibliotheek)

```csharp
public class CarTest
{
    [TestMethod]
    public void TestCarDriveWithMoq()
    {
        // Moq voor het mocken van afhankelijkheden
        var mockWheel = new Mock<IWheel>();
        var mockEngine = new Mock<IEngine>();
        
        // Configureer het gedrag van de mock
        mockWheel.Setup(w => w.StartEngine()).Returns(true);
        mockEngine.Setup(e => e.Start());

        var car = new Car(mockEngine.Object, mockWheel.Object);
        car.Drive();

        // Verifieer interacties
        mockWheel.Verify(w => w.StartEngine(), Times.Once);
        mockEngine.Verify(e => e.Start(), Times.Once);
    }
}
```

## Voordelen van Mocking

1. **Isolatie**: Test specifieke componenten zonder afhankelijkheden
2. **Controle**: Simuleer verschillende scenario's
3. **Snelheid**: Elimineer externe afhankelijkheden
4. **Betrouwbaarheid**: Voorspelbare testomgevingen

## Wanneer Gebruik Je Mocking?

- Unit testing
- Testen van complexe systemen
- Simuleren van externe services
- Voorbereiden van randgevallen
- Testen van foutscenario's