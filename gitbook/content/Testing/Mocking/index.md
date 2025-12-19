## Algemene uitleg

Mocking is een manier om iets na te bootsen zodat er aparte delen kunnen testen. je schrijf testen om verschillende delen te testen. bvb je hebt 2 andere class nodig voor een classen te testen is het de bedoeling om alleen die klassen te testen niet de extra classen dat je nodig hebt. bvb bij een auto zou zo kunnen zijn

```csharp
public interface IWheel
{
    public bool startEngine();

    public void stopEngine();
}

public class Car : Icar 
{
    IEngine _engine;
    IWheel _wheel;

    public Car(IEngine engine)
    {
       _engine = engine; 
    }

    //we Moeten interfaces gebruiken!!
    public Car(IEngine engine, IWheel wheel)
    {
        _engine = engine;
        _wheel = wheel;
    }

    public Drive()
    {
        _engine.startEngine();
        _wheel.turnWheel();
    }

    //de rest van de code
}
```
de extra classen zijn hier de engine en het wheel. 

## Mockclassen
zien classen dat weinig code bevatten meestal gewoon direct een return met vaste waarde zodat de kans op bugs in die klassen al dratisch verkleint of onbestaan is.
bvb:
```csharp
public class MockWheel : IWheel
{
    public bool Running = false;

    public void startEngine()
    {
        _running = true;
    }

    public void stopEngine()
    {
        _running = false;
    }
}
```
als je kan zien is er weinig tot geen coplexiteit aanwezig.

we gebruiken dit als volgt:
```csharp
public class CarTest
{
    [TestMethod]
    public void startEngine()
    {
        IWheel _engine = new();
        var car = Car(_engine);
        car.Drive();
    }
}
```
we kunnen ook de nuget package gebruiken genaamd moq.
Dus kunnen we de vorige test als volgt schrijven.

```csharp
public class CarTest
{
    [TestMethod]
    public void startEngine()
    {
        var engine = new Mock<IWheel>();
        engine.Setup(x => x.startEngine()).Returns(true);
        Assert.Equal(_engine.Running, true);
    }
}
```