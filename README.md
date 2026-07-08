# Carnival Days — Remote Games

Two self-contained games for people playing remotely:

- **duck-pond.html** — chance game. Players pick a duck ahead of the event; you reveal the winning duck live at the event.
- **balloon-pop.html** — 30-second reflex game. Players compete for the highest score.

Both are single HTML files — no build tools, no dependencies beyond a Google Font link. They work by simply opening the file in a browser, and they're ready to host as-is on GitHub Pages.

## 1. Set up the results spreadsheet (do this once)

1. Create a new Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Paste in the contents of `apps-script.gs`.
4. Click **Deploy > New deployment > Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize it (you'll see a Google warning screen for unverified apps — this is normal for a personal script; click **Advanced > Go to project (unsafe)** to proceed).
6. Copy the **Web app URL**.

The first time each game is played, it will automatically create a `DuckPond` tab and a `BalloonPop` tab in your Sheet with all submissions (name, email, pick or score, timestamp).

## 2. Connect the games to your Sheet

In both `duck-pond.html` and `balloon-pop.html`, find this line near the top of the `<script>` section:

```js
const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
```

Replace the placeholder with the Web app URL from step 1. Do this in **both** files.

## 3. Host on GitHub Pages

1. Create a new repo (or use an existing one), and add these two HTML files to it.
2. Go to the repo's **Settings > Pages**.
3. Under "Build and deployment," set Source to your main branch, root folder.
4. Save — GitHub will give you a URL like `https://yourusername.github.io/repo-name/duck-pond.html`.

Share those two links out however you're circulating the games (email, Slack, intranet page).

## 4. Picking winners

Open your Google Sheet after the event (or anytime) and sort/filter as needed:
- **DuckPond tab**: filter by whichever duck color you draw at the event.
- **BalloonPop tab**: sort by Score, descending, for the leaderboard.

## Swapping in your own art

Both games currently use simple built-in vector shapes (ducks, balloons) so they work with zero assets. Once you have your vector artwork:
- In `duck-pond.html`, look for the `renderDuck()` function — swap it out for `<img src="your-duck.svg">` per color.
- In `balloon-pop.html`, look for the `balloonSVG()` function similarly.

Both games share the same color palette and header style (circus stripe banner, scalloped tent edge) so they read as a matched pair — happy to adjust colors/fonts once your tent and photo booth designs are locked in, so everything matches.
