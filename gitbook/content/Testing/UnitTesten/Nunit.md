## Wat is NUnit

NUnit is een testframework voor .NET dat wordt gebruikt om geautomatiseerde tests te schrijven. Het wordt vaak ingezet voor unit- en acceptatietesten en is conceptueel vergelijkbaar met MSTest en xUnit.

## Basics

```cs
public class Tests
{
    private Calculator.Calculator _calculator = new();

    [SetUp]
    public void Setup()
    {
        _calculator = new Calculator.Calculator();
    }

    [Test]
    public void TestZ()
    {
        Assert.That(_calculator.Add(7, 2), Is.EqualTo(9));
    }
}
```

## [Test]

Het `[Test]`-attribuut geeft aan dat een methode een testmethode is. NUnit zal deze methode automatisch uitvoeren bij het draaien van de tests.

Kenmerken:

* De methode moet `public` zijn
* De methode retourneert `void`
* Elke `[Test]` wordt onafhankelijk uitgevoerd

Voorbeeld:

```cs
[Test]
public void Add_TwoNumbers_ReturnsSum()
{
    var result = _calculator.Add(3, 4);
    Assert.That(result, Is.EqualTo(7));
}
```

## [SetUp]

De `[SetUp]`-methode wordt vóór elke test uitgevoerd. Dit wordt gebruikt om de testomgeving opnieuw te initialiseren, zodat tests elkaar niet beïnvloeden.

Typische use-cases:

* Aanmaken van objecten
* Reset van testdata
* Initialiseren van mocks

## [TearDown]

De `[TearDown]`-methode wordt na elke test uitgevoerd. Deze wordt gebruikt voor het opruimen van resources.

Voorbeeld:

```cs
[TearDown]
public void Cleanup()
{
    _calculator = null;
}
```

## Assertions

Assertions worden gebruikt om te controleren of het resultaat van een test overeenkomt met de verwachting.

Veelgebruikte assertions:

* `Assert.That(actual, Is.EqualTo(expected))`
* `Assert.That(value, Is.Not.Null)`
* `Assert.That(collection, Is.Empty)`
* `Assert.That(number, Is.GreaterThan(0))`

Voorbeeld:

```cs
Assert.That(_calculator.Add(1, 1), Is.EqualTo(2));
```

## [TestCase]

Met `[TestCase]` kun je meerdere invoerwaarden testen met één testmethode.

Voorbeeld:

```cs
[TestCase(1, 2, 3)]
[TestCase(2, 3, 5)]
[TestCase(10, 5, 15)]
public void Add_MultipleInputs_ReturnsCorrectSum(int a, int b, int expected)
{
    Assert.That(_calculator.Add(a, b), Is.EqualTo(expected));
}
```

## [TestFixture]

Een `[TestFixture]` markeert een class die tests bevat. Dit attribuut is optioneel; NUnit herkent testclasses ook zonder dit attribuut.

```cs
[TestFixture]
public class CalculatorTests
{
}
```

## Test uitvoeren

NUnit-tests kunnen worden uitgevoerd via:

* Visual Studio Test Explorer
* `dotnet test` via de command line
* CI/CD pipelines

## Samenvatting

* NUnit gebruikt attributen om testgedrag te definiëren
* `[Test]` markeert een test
* `[SetUp]` en `[TearDown]` regelen de levenscyclus
* Assertions bepalen of een test slaagt of faalt
* `[TestCase]` maakt parametrische tests mogelijk
