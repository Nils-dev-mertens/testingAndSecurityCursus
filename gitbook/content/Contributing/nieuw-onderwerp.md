# Een nieuw onderwerp toevoegen

Dit platform is bedoeld voor **alle onderwerpen binnen de opleiding**. Zo voeg je een nieuw
onderwerp toe zodat het onmiddellijk zichtbaar is in de navigatie, zoekfunctie en sitemap.

## Stappenplan

1. **Maak een map** voor het onderwerp onder `gitbook/content/`, bijv. `gitbook/content/Machine Learning/`.
   Gebruik een duidelijke naam; deze wordt automatisch omgezet naar een slug voor de URL
   (`Machine Learning` → `/machine-learning`).

2. **Maak `index.md`** met:
   - een `# Titel` en een korte inleiding;
   - een link naar elk hoofdstuk van het onderwerp.

3. **Maak hoofdstukmappen** per deelonderwerp, elk met:
   - een eigen `index.md` (overzicht + links);
   - de lespagina's als `*.md`-bestanden.

4. **Volg het template** in [template.md](./template) voor elke pagina.

5. **Werk de zoekindex bij**:

   ```bash
   cd gitbook
   npm run prebuild
   ```

6. **Controleer lokaal** dat alles klopt voordat je pusht:

   ```bash
   npm run dev        # doorsnuffelen
   npm run lint       # linten
   npm test           # tests draaien
   npm run build      # productiebuild (incl. astro check)
   ```

## Voorbeeldstructuur

```text
gitbook/content/Machine Learning/
├── index.md                 # Overzicht van Machine Learning
├── Supervised Learning/
│   ├── index.md             # Overzicht van dit hoofdstuk
│   ├── regressie.md
│   └── classificatie.md
└── Unsupervised Learning/
    ├── index.md
    └── clustering.md
```

## Wat gebeurt er automatisch?

- De **sidebar** toont de mappen en pagina's op basis van de structuur.
- De **zoekfunctie** (Ctrl+K) gebruikt de gegenereerde `tree.json`.
- De **paginatie** (vorige/volgende-knoppen) wordt per pagina berekend.
- De **sitemap** voor SEO wordt bij elke build opnieuw gegenereerd.

Je hoeft geen code aan te passen om een onderwerp of pagina toe te voegen —
alleen markdown.