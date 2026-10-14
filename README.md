# SoftTech website

A simple website for SoftTech: plain HTML, CSS and JavaScript, no build step. It runs on GitHub Pages for free.

What's inside:

| File | What it is |
|---|---|
| `index.html`, `styles.css`, `script.js`, `portfolio.js` | The website |
| `projects.json` | The list under "Sites we build". **This is the file you edit to add or remove a site** |
| `site-config.js` | The contact email (already set to help@soft-tech.net) |
| `assets/`, `images/` | Logo and icons; project pictures go in `images/` |
| `.nojekyll`, `robots.txt` | Small helper files for GitHub Pages and search engines |

Everything below is done in a web browser. Do steps 1 and 2 on a computer (uploading folders from a phone is awkward). After that, adding a site works from your phone too.

---

## 1. Put the files on GitHub

1. Unzip `softtech-website.zip` on your computer.
2. Go to **github.com/new**.
   - Repository name: `softtech-website` (or any name you like).
   - Choose **Public** (free GitHub Pages needs a public repo).
   - Leave "Add a README" **unticked**.
   - Press **Create repository**.
3. On the new, empty repo page, click the link **"uploading an existing file"** (or **Add file → Upload files**).
4. Open the unzipped folder, select **everything inside it** (all files AND the `assets` and `images` folders) and drag it onto the GitHub page. Drag the contents, not the folder itself, so `index.html` ends up at the top level of the repo.
   - On a Mac the `.nojekyll` file is hidden and may not get dragged. That's OK, the site works without it.
5. Press **Commit changes**.

## 2. Turn on GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, Source: **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**. Press **Save**.
4. Wait 1 to 2 minutes and refresh. GitHub shows "Your site is live at `https://USERNAME.github.io/softtech-website/`". Open it to check.

## 3. Use your own domain (soft-tech.net)

Pick ONE address for the site. Both work; GitHub automatically sends the other one to it if you set up both DNS records below.

### Option A: `www.soft-tech.net` (recommended, simplest)

1. In **Settings → Pages → Custom domain**, type `www.soft-tech.net` and press **Save**. (GitHub adds a `CNAME` file to the repo by itself. Don't delete it.)
2. Where you manage the DNS for soft-tech.net (the same place you added `kayi.soft-tech.net`), add:

   | Type | Name / Host | Value |
   |---|---|---|
   | CNAME | `www` | `USERNAME.github.io` (your username, no repo name, no https) |

3. Optional but nice: also add the four `A` records from Option B for `@`, so typing plain `soft-tech.net` goes to `www.soft-tech.net`.

### Option B: `soft-tech.net` (no www)

1. In **Settings → Pages → Custom domain**, type `soft-tech.net` and press **Save**.
2. In your DNS, for the root of the domain (Name / Host `@`), remove any old `A` / `AAAA` records for `@` and add:

   | Type | Name / Host | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `USERNAME.github.io` |

Either way:

- Your other addresses (`kayi.soft-tech.net`, `mdm.soft-tech.net`, …) are separate records and are **not affected**. Don't change them.
- DNS can take from a few minutes up to a day. When GitHub shows "DNS check successful", tick **Enforce HTTPS** on the same Pages screen (it may take a little while to become available).
- If your DNS is at Cloudflare, set these records to **DNS only** (grey cloud) so GitHub can issue the HTTPS certificate.

## 4. Add a site (on your phone or computer)

1. Open your repo on **github.com** and tap **`projects.json`**.
2. Tap the **pencil** (Edit). On a phone it may be under the **⋯** menu.
3. Copy the Kayi block: from its `{` down to its `}`.
4. Paste it right after Kayi's `}`, and put a **comma** between the two blocks: `},` then `{`.
5. In the new block, change `name`, `url`, `description` and `image`.
6. Tap **Commit changes** (then **Commit changes** again). The site updates in about 1 minute.

With two sites, the whole file looks exactly like this:

```json
[
  {
    "name": "Kayi",
    "url": "https://kayi.soft-tech.net/",
    "description": "AI over SMS for kosher phones: ask anything by text, with phone sign-in, chat history and an admin console.",
    "image": "images/kayi.png"
  },
  {
    "name": "My New Site",
    "url": "https://newsite.soft-tech.net/",
    "description": "One short line about the site.",
    "image": "images/newsite.png"
  }
]
```

The rules:

- A **comma after every `}` except the last one**. The last block has no comma after it.
- Every name and value is inside "double quotes", with a comma at the end of each line except the last line in a block.
- `name` and `url` are required. `url` must start with `https://`.
- `description` and `image` are optional. No picture? Leave out the `image` line (and the comma before it) and the card shows a neat tile with the site's first letter.
- The order in the file is the order on the site.

### Add a picture

1. In the repo, open the **`images`** folder → **Add file → Upload files**.
2. Pick the picture (a square logo works best, e.g. `newsite.png`) and tap **Commit changes**.
3. In `projects.json`, set `"image": "images/newsite.png"` (exactly the file name you uploaded; capitals matter).

If the picture's name is wrong, the card still shows, with the letter tile instead.

## 5. Remove a site

1. Open **`projects.json`** → **pencil** (Edit).
2. Delete that site's whole block, from its `{` to its `}`, and the comma that went with it.
3. Make sure the **last** block has **no** comma after its `}`.
4. Tap **Commit changes**. Gone in about 1 minute.

To delete its picture too, open it in the `images` folder → **⋯** → **Delete file**.

## If the site list disappears

It's almost always a missing comma or quote in `projects.json`.

- Open `projects.json` on GitHub and check the commas between blocks and the quotes around every value.
- Or copy the whole file into **jsonlint.com** and press **Validate JSON**. It shows the exact line with the mistake.
- A single block with a mistake (like a missing `url`) is just skipped; the other sites still show.
- You can always go back: on GitHub, open `projects.json` → **History**, open the last good version and copy it back.
