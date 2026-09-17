# Bijdragen aan deze cursus

Dit platform is een gedeelde cursus voor **alle onderwerpen en vakken binnen de opleiding** —
niet alleen Testing en Security. Elke richting of elk team kan hier een eigen cursus in schema's
neerzetten, zolang deze aan een aantal regels voldoet zodat alles er uniform uitziet.

## Hoe werkt de structuur?

```text
gitbook/content/
├── index.md                     <-- Homepagina van de docs
├── Contributing/                <-- Jij bent hier
├── <Nieuw Onderwerp>/           <-- Hoofdmap per vak/onderwerp
│   ├── index.md                 <-- Overzicht + links naar hoofdstukken
│   └── <Hoofdstuk>/
│       ├── index.md             <-- Overzicht van dit hoofdstuk
│       └── <pagina>.md          <-- Lespagina's (zoveel als nodig)
```

- **Elk onderwerp** is een eigen map op het hoogste niveau.
- **Elk hoofdstuk** is een submap met een eigen `index.md` en losse pagina's.
- De site genereert automatisch de navigatie, zoekindex en volgende/vorige-knoppen op basis van
  deze mappen en bestanden.

## Template-regels

Elke pagina moet deze opbouw volgen (zie het volledige voorbeeld in [template.md](./template)):

1. **Titel** als `# Titelpagina`
2. **Inleiding** in 2–3 zinnen: waarover gaat deze pagina en waarom is het belangrijk
3. **Leerdoelen** (indien nuttig)
4. **Inhoud** in secties met `##`-koppen; kort en concreet
5. **Codevoorbeelden** altijd in een fenced codeblok met taal-tag
6. **Hands-on / oefening** voor praktische onderwerpen
7. **Bronnen / verder lezen** aan het einde

## Regels voor schrijven

- Schrijf in het **Nederlands** (bestaande onderwerpen zijn Nederlandstalig).
- Schrijf voor een student die het onderwerp nog niet kent; geen aannames.
- Tools die niet meer bestaan of gelinkt zijn gewijzigd: verwĳder of werk bij.
- Gebruik relatieve links tussen pagina's, geen absolute URL's.
- Mappen en bestanden worden automatisch naar slugs omgezet:
  `Digital Verification.md` wordt `/digital-verification/digital-verification`.

## Een nieuw onderwerp toevoegen

1. Maak een nieuwe map onder `gitbook/content/`, bijv. `Machine Learning/`.
2. Voeg `index.md` toe met een overzicht en links naar de hoofdstukken.
3. Voeg per hoofdstuk een submap met `index.md` en de lespagina's toe.
4. Draai `npm run prebuild` zodat de zoekindex bijgewerkt wordt.

Zie [nieuw-onderwerp.md](./nieuw-onderwerp) voor een stappenplan.

## Meer details

- [Template](./template) — het volledige pagina-template om te kopiëren
- [Nieuw onderwerp toevoegen](./nieuw-onderwerp) — stappenplan voor een nieuwe cursus