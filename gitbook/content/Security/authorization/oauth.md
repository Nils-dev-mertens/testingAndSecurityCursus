# OAuth 2.0 Basics - C# / ASP.NET

## Wat probleem lost OAuth op?

Stel je voor:

* Je app wil Google Calendar gebruiken
* De gebruiker moet inloggen
* **Maar je wil het wachtwoord niet**

### Klassiek probleem (zonder OAuth)

Zonder OAuth zou je dit moeten doen:

* Vraag gebruiker: "Geef je Google wachtwoord"
* Bewaar dit wachtwoord
* Log in als de gebruiker

Problemen:

* Enge beveiligingsrisico's
* Gebruiker moet jou volledig vertrouwen
* Geen controle over wat je app doet
* Wachtwoord wijzigen = alle apps kapot

### OAuth-oplossing (idee)

OAuth zegt:

> De gebruiker geeft **toestemming** (geen wachtwoord) aan jouw app om specifieke dingen te doen

Belangrijk:

* Jouw app **ziet nooit** het wachtwoord
* Gebruiker bepaalt wat je mag
* Toestemming kan ingetrokken worden
* Je krijgt een **access token** (tijdelijk pasje)

---

## OAuth flow visueel

```
┌─────────┐                                  ┌─────────┐
│  Jouw   │                                  │ Google  │
│   App   │                                  │  (Auth  │
│         │                                  │ Server) │
└────┬────┘                                  └────┬────┘
     │                                            │
     │  1. "Login met Google" (button)           │
     │───────────────────────────────────────────>│
     │                                            │
     │  2. Redirect naar Google login            │
     │<───────────────────────────────────────────│
     │                                            │
     │     ┌──────────────────┐                  │
     │     │  Gebruiker logt  │                  │
     │     │  in bij Google   │                  │
     │     │  + geeft toest.  │                  │
     │     └──────────────────┘                  │
     │                                            │
     │  3. Redirect terug met authorization code │
     │<───────────────────────────────────────────│
     │                                            │
     │  4. Ruil code in voor access token        │
     │───────────────────────────────────────────>│
     │                                            │
     │  5. Access token + refresh token          │
     │<───────────────────────────────────────────│
     │                                            │
```

**Dit is de Authorization Code Flow**

---

## Belangrijke begrippen

### Authorization Code

> Eenmalige code die je krijgt na toestemming

* Korte levensduur (seconden)
* Moet geruild worden voor tokens
* Alleen bruikbaar met `client_secret`

### Access Token

> Het echte toegangsbewijs

* Stuur mee bij API-calls
* Korte levensduur (minuten/uur)
* Geeft toegang tot resources

### Refresh Token

> Token om nieuwe access tokens te krijgen

* Lange levensduur (dagen/weken)
* Moet veilig opgeslagen worden
* Kan ingetrokken worden

### Scopes

> Wat mag je app precies?

Voorbeelden:

* `profile` → basis profielinfo
* `email` → emailadres
* `calendar.read` → kalender lezen
* `calendar.write` → kalender aanpassen

Waarom belangrijk?

* Gebruiker ziet wat je vraagt
* Principe van least privilege

---

## OAuth in ASP.NET (setup)

### Dependencies installeren

```bash
dotnet add package Microsoft.AspNetCore.Authentication.Google
dotnet add package Microsoft.AspNetCore.Authentication.OpenIdConnect
```

### Configuration (appsettings.json)

```json
{
  "Authentication": {
    "Google": {
      "ClientId": "your-client-id.apps.googleusercontent.com",
      "ClientSecret": "your-client-secret"
    }
  }
}
```

Waarom?

* Client ID = publiek, identificeert jouw app
* Client Secret = geheim, bewijst dat jij het bent

**Hoe krijg je deze?**

→ Google Cloud Console → API's & Services → Credentials

---

## OAuth configureren (Program.cs)

### Authentication toevoegen

```csharp
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    
    // Welke data wil je?
    options.Scope.Add("profile");
    options.Scope.Add("email");
    
    // Token opslaan voor later gebruik
    options.SaveTokens = true;
});
```

Waarom `AddCookie`?

* OAuth geeft tokens
* Cookie bewaart je ingelogde sessie lokaal
* Gebruiker hoeft niet elke keer opnieuw OAuth te doen

### Middleware activeren

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

Volgorde is belangrijk:

1. Eerst authentication (wie ben je?)
2. Dan authorization (wat mag je?)

---

## Login/Logout endpoints

### Login controller

```csharp
[Route("auth")]
public class AuthController : Controller
{
    [HttpGet("login")]
    public IActionResult Login()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action("Callback")
        };
        
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }
    
    [HttpGet("callback")]
    public async Task<IActionResult> Callback()
    {
        var result = await HttpContext.AuthenticateAsync();
        
        if (!result.Succeeded)
        {
            return RedirectToAction("Login");
        }
        
        // Gebruiker is ingelogd
        var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
        var name = result.Principal.FindFirst(ClaimTypes.Name)?.Value;
        
        return RedirectToAction("Index", "Home");
    }
    
    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction("Index", "Home");
    }
}
```

### Wat gebeurt er?

1. **Login** → `Challenge()` stuurt gebruiker naar Google
2. **Callback** → Google stuurt gebruiker terug met code
3. ASP.NET ruilt code automatisch in voor tokens
4. Claims worden opgeslagen in cookie
5. Gebruiker is ingelogd

---

## Claims lezen (wie is ingelogd?)

### In een controller

```csharp
[Authorize]
public class ProfileController : Controller
{
    public IActionResult Index()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var name = User.FindFirst(ClaimTypes.Name)?.Value;
        
        return View(new ProfileViewModel
        {
            UserId = userId,
            Email = email,
            Name = name
        });
    }
}
```

Waarom `[Authorize]`?

* Zorgt dat alleen ingelogde gebruikers binnen kunnen
* Redirect naar login als niet ingelogd

### Claims in een view

```razor
@if (User.Identity?.IsAuthenticated == true)
{
    <p>Welkom, @User.Identity.Name!</p>
    <a asp-controller="Auth" asp-action="Logout">Uitloggen</a>
}
else
{
    <a asp-controller="Auth" asp-action="Login">Inloggen met Google</a>
}
```

---

## Tokens gebruiken (API calls)

### Access token ophalen

```csharp
[Authorize]
public class CalendarController : Controller
{
    private readonly IHttpClientFactory _httpClientFactory;
    
    public CalendarController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }
    
    public async Task<IActionResult> MyEvents()
    {
        // Token uit authentication result halen
        var accessToken = await HttpContext.GetTokenAsync("access_token");
        
        if (string.IsNullOrEmpty(accessToken))
        {
            return RedirectToAction("Login", "Auth");
        }
        
        // API call naar Google
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", accessToken);
        
        var response = await client.GetAsync(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events");
        
        if (!response.IsSuccessStatusCode)
        {
            return View("Error");
        }
        
        var json = await response.Content.ReadAsStringAsync();
        var events = JsonSerializer.Deserialize<GoogleCalendarResponse>(json);
        
        return View(events);
    }
}
```

### Wat gebeurt hier?

1. Token uit cookie halen (`GetTokenAsync`)
2. HTTP client maken
3. Token meesturen als `Authorization: Bearer {token}`
4. API-call maken
5. Response verwerken

---

## Token refresh (automatisch)

### Probleem

* Access tokens verlopen snel (1 uur)
* Gebruiker wil niet steeds opnieuw inloggen

### Oplossing: Refresh token

```csharp
public class TokenRefreshService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    
    public async Task<string> GetValidAccessTokenAsync(HttpContext context)
    {
        var accessToken = await context.GetTokenAsync("access_token");
        var refreshToken = await context.GetTokenAsync("refresh_token");
        var expiresAt = await context.GetTokenAsync("expires_at");
        
        // Is token nog geldig?
        if (DateTime.Parse(expiresAt) > DateTime.UtcNow.AddMinutes(5))
        {
            return accessToken;
        }
        
        // Token is verlopen, refresh
        var client = _httpClientFactory.CreateClient();
        
        var request = new HttpRequestMessage(HttpMethod.Post, 
            "https://oauth2.googleapis.com/token");
        
        request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"] = "refresh_token",
            ["refresh_token"] = refreshToken,
            ["client_id"] = _configuration["Authentication:Google:ClientId"],
            ["client_secret"] = _configuration["Authentication:Google:ClientSecret"]
        });
        
        var response = await client.SendAsync(request);
        var json = await response.Content.ReadAsStringAsync();
        var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(json);
        
        // Nieuwe tokens opslaan
        var tokens = new List<AuthenticationToken>
        {
            new() { Name = "access_token", Value = tokenResponse.AccessToken },
            new() { Name = "expires_at", Value = DateTime.UtcNow
                .AddSeconds(tokenResponse.ExpiresIn).ToString("o") }
        };
        
        var authenticateResult = await context.AuthenticateAsync();
        authenticateResult.Properties.StoreTokens(tokens);
        
        await context.SignInAsync(authenticateResult.Principal, 
            authenticateResult.Properties);
        
        return tokenResponse.AccessToken;
    }
}
```

### Response model

```csharp
public class TokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
    
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
    
    [JsonPropertyName("token_type")]
    public string TokenType { get; set; }
}
```

---

## OAuth zonder framework (conceptueel begrip)

Wat ASP.NET voor je doet, stap voor stap:

### Stap 1: Authorization URL maken

```csharp
string authUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=" + clientId +
    "&redirect_uri=" + Uri.EscapeDataString(redirectUri) +
    "&response_type=code" +
    "&scope=" + Uri.EscapeDataString("profile email") +
    "&state=" + GenerateRandomState();
```

Waarom `state`?

* CSRF-bescherming
* Random string die je controleert bij callback

### Stap 2: Authorization code ontvangen

Google stuurt gebruiker terug naar:

```
https://yourapp.com/callback?code=abc123&state=xyz789
```

### Stap 3: Code inwisselen voor tokens

```csharp
var client = new HttpClient();

var request = new HttpRequestMessage(HttpMethod.Post, 
    "https://oauth2.googleapis.com/token");

request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
{
    ["code"] = authorizationCode,
    ["client_id"] = clientId,
    ["client_secret"] = clientSecret,
    ["redirect_uri"] = redirectUri,
    ["grant_type"] = "authorization_code"
});

var response = await client.SendAsync(request);
var json = await response.Content.ReadAsStringAsync();

// json bevat: access_token, refresh_token, expires_in
```

Waarom `client_secret` hier?

* Bewijst dat jij de echte app bent
* Google weet: deze code is voor jou

---

## Beveiligingsoverwegingen

### HTTPS verplicht

OAuth zonder HTTPS = grote ramp

Waarom?

* Tokens kunnen onderschept worden
* Man-in-the-middle aanvallen
* Authorization codes gestolen

### State parameter

```csharp
// Bij starten flow
string state = GenerateRandomString();
HttpContext.Session.SetString("oauth_state", state);

// Bij callback
string returnedState = Request.Query["state"];
string savedState = HttpContext.Session.GetString("oauth_state");

if (returnedState != savedState)
{
    throw new SecurityException("CSRF aanval gedetecteerd");
}
```

### Token opslag

**Slecht:**

* LocalStorage → kwetsbaar voor XSS
* Sessie zonder encryption
* Hardcoded in frontend

**Goed:**

* HttpOnly cookies (ASP.NET doet dit)
* Server-side sessie
* Encrypted database voor refresh tokens

### Scope minimaliseren

Vraag alleen wat je echt nodig hebt:

```csharp
// ❌ Te veel
options.Scope.Add("https://www.googleapis.com/auth/userinfo.profile");
options.Scope.Add("https://www.googleapis.com/auth/userinfo.email");
options.Scope.Add("https://www.googleapis.com/auth/calendar");
options.Scope.Add("https://www.googleapis.com/auth/drive");

// ✅ Alleen wat nodig is
options.Scope.Add("profile");
options.Scope.Add("email");
```

---

## OAuth vs OpenID Connect

### OAuth 2.0

* Bedoeld voor **autorisatie**
* "Wat mag deze app?"
* Geeft access tokens

### OpenID Connect

* Uitbreiding op OAuth
* Bedoeld voor **authenticatie**
* "Wie is deze gebruiker?"
* Geeft ID tokens (JWT formaat)

### In ASP.NET

```csharp
builder.Services.AddAuthentication()
    .AddOpenIdConnect("oidc", options =>
    {
        options.Authority = "https://accounts.google.com";
        options.ClientId = "your-client-id";
        options.ClientSecret = "your-client-secret";
        options.ResponseType = "code";
        
        options.Scope.Add("openid");
        options.Scope.Add("profile");
        options.Scope.Add("email");
        
        options.SaveTokens = true;
        
        options.GetClaimsFromUserInfoEndpoint = true;
    });
```

Verschil met gewone OAuth:

* `openid` scope → OIDC activeren
* ID token bevat gebruikersinfo
* Gestandaardiseerde claims

---

## Veelgemaakte fouten

### 1. Client Secret in frontend

```javascript
// ❌ NOOIT DOEN
const clientSecret = "your-secret-key";
```

Waarom fout?

* Iedereen kan JavaScript zien
* Secret is niet meer secret

### 2. Tokens in URL

```csharp
// ❌ FOUT
return Redirect($"/profile?access_token={token}");
```

Waarom fout?

* URLs komen in logs
* Browser history
* Referrer headers

### 3. Geen token validatie

```csharp
// ❌ Blind vertrouwen
var token = Request.Headers["Authorization"];
// gebruik token zonder checks
```

Waarom fout?

* Token kan vervalst zijn
* Kan verlopen zijn
* Kan ingetrokken zijn

### 4. Refresh token niet veilig opslaan

```csharp
// ❌ FOUT
Response.Cookies.Append("refresh_token", refreshToken);
```

Waarom fout?

* JavaScript kan cookie lezen
* Refresh token heeft lange levensduur

**Goed:**

```csharp
Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
{
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Strict
});
```

---

## Voor- en nadelen

### Voordelen

* Geen wachtwoorden opslaan
* Gebruiker heeft controle
* Standaard protocol
* Werkt met alle grote platforms
* Tokens kunnen ingetrokken worden

### Nadelen

* Complexer dan simpele login
* Afhankelijk van externe partij
* Tokens kunnen gestolen worden
* Refresh token management nodig
* Rate limits van provider

---

## TLDR

* OAuth = **toestemming zonder wachtwoord**
* Authorization code → ruil in voor tokens
* Access token = **korte geldigheid, gebruik voor API**
* Refresh token = **lange geldigheid, haal nieuwe access token**
* Scopes = **wat mag je app precies**
* HTTPS + HttpOnly cookies = **minimaal vereist**
* ASP.NET doet het zware werk, maar begrip blijft belangrijk