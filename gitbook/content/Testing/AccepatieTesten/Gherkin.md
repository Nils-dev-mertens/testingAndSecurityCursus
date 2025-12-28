## Wat

> Gherkin is a domain-specific language for describing formalized examples of how a system should interact with the user. In Behavior Driven Development, examples are discovered in collaboration with all parties involved in the software development process (developer, tester, subject matter expert, .) before they are formalized in Gherkin

Gherkin gebruikt de "Given-When-Then" structuur om de voorbeelden vast te leggen. Hierin heb je dus 3 delen:<br>

**Given**

Beschrijft enkel die delen van de systeem staat die relevant is voor de regels die in het scenario worden beschreven. Je beschrijft daarin de staat waarin het systeem zich moet bevinden om aan de test te beginnen.

#### When

Beschrijft een actie van de gebruiker die het gedrag van het gedrag van he systeem trigger (onder de beschreven systeem staat). Beschrijft meestal een ingave door de gebruiker of een call naar een service.

#### Then

Beschrijft hoe het systeem moet reageren op de trigger in termen van het resultaat naar de gebuiker toe. We geven een paar voorbeelden om bovenstaande te verduidelijken:

```
Feature: Guess the word
# The first example has two steps
Scenario: Maker starts a game
When the Maker starts a game
Then the Maker waits for a Breaker to join
# The second example has three steps
Scenario: Breaker joins a game
Given the Maker has started a game 
    with the word "silky"
When the Breaker joins the Maker's game
Then the Breaker must guess a word with 5 characters

```

```
Feature: Serve coffee
In order to earn money Customers should be able 
to buy coffee at all times 

Scenario: Buy last coffee
Given there are 1 coffees left in the machine
And I have deposited 1 dollar 
When I press the coffee button 
Then I should be served a coffee
```

Het is niet de bedoeling om de kunst van het schrijven van goede specificaties aan te leren. Wat betreft de cursus Software Testing is het voldoende dat je Gherkin kan herkennen en dat je de link met het automatisch testen van de specificaties begrijpt.

Er bestaan ook Gherkin editors zodat voor het schrijven van de specificaties geen IDE zoals Visual Studio nodig is. Je vindt een voorbeeld hiervan