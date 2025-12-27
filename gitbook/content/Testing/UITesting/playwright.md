## Waarschuwing

Let op: Dit onderwerp gaat enigszins buiten de scope van de cursus. Echter, Playwright wordt beschouwd als de meest moderne en uitgebreide UI testing oplossing voor web, met ondersteuning voor de meeste programmeertalen.

## Installatie

Maak het project aan:

```sh
dotnet new mstest -n PlaywrightTests
cd PlaywrightTests
```

Installeer de benodigde NuGet-pakketten:
```sh
dotnet add package Microsoft.Playwright.MSTest
```

Bouw het project zodat het `playwright.ps1`-script beschikbaar wordt:
```sh
dotnet build
```

Installeer de vereiste browsers:
```sh
pwsh bin/Debug/net8.0/playwright.ps1 install
```

## Basis Test Scenario's

### Titel Verificatie

```csharp
[TestMethod]
public async Task ControleerWebsiteTitel()
{
    await Page.GotoAsync("https://playwright.dev");

    // Controleer of de titel de verwachte substring bevat
    await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
}
```

### Navigatie en Link Klik

```csharp
[TestMethod]
public async Task NavigeerNaarStartpagina()
{
    await Page.GotoAsync("https://playwright.dev");

    // Klik op de "Get Started" link
    await Page.GetByRole(AriaRole.Link, new() { Name = "Get Started" }).ClickAsync();

    // Verifieer dat de installatiepagina wordt weergegeven
    await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Installation" })).ToBeVisibleAsync();
}
```

### Interactie met Formulieren en Knoppen

```csharp
[TestMethod]
public async Task TestKnopInteractie()
{
    await Page.GotoAsync("https://example.com/login");

    // Vul gebruikersnaam in
    var gebruikersnaamVeld = Page.GetByLabel("Gebruikersnaam");
    await gebruikersnaamVeld.FillAsync("testgebruiker");

    // Vul wachtwoord in
    var wachtwoordVeld = Page.GetByLabel("Wachtwoord");
    await wachtwoordVeld.FillAsync("geheimwachtwoord");

    // Klik op inlogknop
    var inlogKnop = Page.GetByRole(AriaRole.Button, new() { Name = "Inloggen" });
    await inlogKnop.ClickAsync();

    // Verifieer doorverwijzing na inloggen
    await Expect(Page).ToHaveURLAsync(new Regex("/dashboard$"));
}
```

### Geavanceerde Interacties

```csharp
[TestMethod]
public async Task TestFormulierValidatie()
{
    await Page.GotoAsync("https://example.com/registratie");

    // Vul formulier niet volledig in
    await Page.GetByLabel("Naam").FillAsync("Test Gebruiker");
    await Page.GetByLabel("E-mail").FillAsync("ongeldig-email");

    // Klik op verzenden
    var verzendKnop = Page.GetByRole(AriaRole.Button, new() { Name = "Registreren" });
    await verzendKnop.ClickAsync();

    // Controleer foutmeldingen
    var foutMelding = Page.GetByText("Ongeldig e-mailadres");
    await Expect(foutMelding).ToBeVisibleAsync();
}
```

## Best Practices

1. Gebruik specifieke selectors
2. Wacht op elementen voordat je interacteert
3. Scheid test logica van page object models
4. Gebruik async/await voor betere performance
5. Implementeer herbruikbare hulpmethoden

## Veelvoorkomende Selectie Methoden

- `GetByRole()`: Selecteer op basis van ARIA-rol
- `GetByLabel()`: Selecteer formuliervelden via labels
- `GetByText()`: Selecteer op basis van tekst
- `GetByTestId()`: Gebruik data-testid attributen

## Aandachtspunten

- Zorg voor stabiele netwerkcondities
- Gebruik wachttijden en auto-waiting
- Behandel asynchrone acties correct
- Test verschillende browsers en apparaten

## Debugging Tips

- Gebruik `Page.PauseAsync()` voor interactieve debugging
- Maak screenshots bij test failures
- Log belangrijke acties en staten

## Conclusie

Playwright biedt krachtige mogelijkheden voor het testen van web-applicaties, met uitgebreide ondersteuning voor moderne web-interacties.