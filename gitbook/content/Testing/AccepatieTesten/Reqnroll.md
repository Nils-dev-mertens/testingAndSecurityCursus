# 3. Automatisch testen met Reqnroll

## Inleiding tot Behavior-Driven Development (BDD) met Reqnroll

Behavior-Driven Development (BDD) is een agile softwareontwikkelingsmethode waarbij de nadruk ligt op het beschrijven van het gedrag van een systeem in een voor mensen begrijpelijke taal. Reqnroll is een open-source BDD framework voor .NET dat het mogelijk maakt om specificaties te schrijven en te automatiseren met behulp van Gherkin-syntaxis.

## Wat is Reqnroll?

Reqnroll (voorheen SpecFlow) is een tool die:
- Het schrijven van geautomatiseerde acceptatietesten vergemakkelijkt
- Communicatie tussen ontwikkelaars, testers en zakelijke belanghebbenden verbetert
- Specificaties omzet in geautomatiseerde tests
- Ondersteunt verschillende testframeworks zoals NUnit, xUnit en MSTest

## Voorbereiding

### Vereisten
- Visual Studio (2019 of hoger)
- .NET SDK

### Installatie

1. **Installeer Reqnroll NuGet Packages**:
   Open Package Manager Console of NuGet Package Manager en installeer de volgende pakketten:
   ```
   Install-Package Reqnroll
   Install-Package Reqnroll.NUnit  # of een ander testframework
   Install-Package Reqnroll.Tools.DotNet
   ```

2. **Visual Studio Extension**:
   Reqnroll biedt ook een Visual Studio Extension voor verbeterde ondersteuning:
   - Open Visual Studio
   - Ga naar Extensions -> Manage Extensions
   - Zoek naar "Reqnroll" in de Online sectie
   - Download en installeer de extensie

## Gherkin Basisprincipes

Gherkin is een leesbare taal voor het beschrijven van softwaregedrag. Het gebruikt een aantal sleutelwoorden:

- `Feature`: Beschrijft de hoogniveau functionaliteit
- `Scenario`: Een specifiek testscenario
- `Given`: Stelt de begintoestand in
- `When`: Beschrijft de actie of gebeurtenis
- `Then`: Beschrijft het verwachte resultaat

### Voorbeeld: Calculator Feature

```gherkin
Feature: Calculator
    Als een gebruiker
    Wil ik basale rekenbewerkingen kunnen uitvoeren
    Zodat ik eenvoudige berekeningen kan doen

Scenario: Twee getallen optellen
    Given de eerste waarde is 5
    And de tweede waarde is 7
    When ik de getallen optеl
    Then is het resultaat 12
```

## Stap Definities

Stap definities verbinden Gherkin-scenario's met de daadwerkelijke code:

```csharp
[Binding]
public class CalculatorStepDefinitions
{
    private Calculator _calculator = new Calculator();
    private int _result;

    [Given("de eerste waarde is (.*)")]
    public void GegevenEersteWaarde(int waarde)
    {
        _calculator.FirstNumber = waarde;
    }

    [When("ik de getallen optел")]
    public void WanneerOptellenUitgevoerd()
    {
        _result = _calculator.Add();
    }

    [Then("is het resultaat (.*)")]
    public void DanVerwachtResultaat(int verwachtResultaat)
    {
        Assert.AreEqual(verwachtResultaat, _result);
    }
}
```

## Best Practices

1. **Schrijf Leesbare Scenario's**
   - Gebruik duidelijke, begrijpelijke taal
   - Focus op gedrag, niet op implementatiedetails

2. **Herbruikbare Stappen**
   - Maak generieke stap definities
   - Gebruik parameters voor flexibiliteit

3. **Scheiding van Zorgen**
   - Houd stap definities simpel en gefocust
   - Gebruik hulpklassen voor complexe logica

4. **Onderhoudbaarheid**
   - Documenteer je stappen
   - Gebruik descriptieve methode- en variabelenamen

## Veelvoorkomende Uitdagingen

- **Syncen van Specificaties en Code**: Zorg ervoor dat je stap definities altijd up-to-date blijven
- **Onderhoudbaarheid**: Houd je stappen DRY (Don't Repeat Yourself)
- **Performance**: Grote hoeveelheden tests kunnen traag worden

## Volgende Stappen

- Lees de officiële [Reqnroll documentatie](https://docs.reqnroll.net/)
- Experimenteer met meer complexe scenario's
- Integreer Reqnroll in je Continue Integratie pipeline

## Conclusie

Reqnroll biedt een krachtige manier om geautomatiseerde acceptatietesten te schrijven die zowel voor ontwikkelaars als niet-technische stakeholders begrijpelijk zijn. Door de juiste principes toe te passen, kun je de kwaliteit en communicatie in je softwareontwikkelingsproces verbeteren.