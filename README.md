<h1 align="center"> ✨ Glowify Theme for SpotiKit ✨ </h1>

<p align="center">
  <b>A modern, rounded and glowified theme for SpotiKit</b><br>
</p>

## Contents

<!-- toc -->

- [Introduction](#introduction)
- [Installation](#installation)
- [Theme screenshots](#theme-screenshots)
- [Features](#features)
- [Building from source](#building-from-source)
<!-- tocstop -->

## Introduction

**Glowify** - is a glow-infused theme for Spotify, made for [SpotiKit](https://github.com/NMWplays/SpotiKit), featuring a modern, luminous interface and smooth animations.

Prefer Windows-style window buttons over the macOS ones? You can switch them on in the Glowify Settings.

If you like the theme, consider starring the repository on GitHub! ⭐

**For support join the Discord!**:

<a href="https://discord.gg/QRMnrgjhvq" target="_blank">
  <img src="discord-icon.png" alt="Discord-server-link" width="64" />
</a>

## Installation

Open the **SpotiKit Marketplace**, search for **Glowify** and install it. On the first start, a short tour shows you around the Glowify Settings and offers to install Liquid Lyrics.

## Theme screenshots

<details>
<summary>Click to watch screenshots</summary>
<img width="2557" height="1377" alt="Homescreen" src="screenshots/Homescreen.png" />

<img width="2557" height="1380" alt="Playlist-View" src="screenshots/Playlist-View.png" />

<img width="2557" height="1381" alt="Search" src="screenshots/Search.png" />

<img width="2557" height="1376" alt="Artist-Page" src="screenshots/Artist-Page.png" />

<img width="2557" height="1377" alt="Glowify-Settings" src="screenshots/Glowify-Settings.png" />

<img width="2557" height="1376" alt="Popup" src="screenshots/Popup.png" />

<img width="2557" height="1377" alt="Settings" src="screenshots/Settings.png" />

<img width="2557" height="1375" alt="Fullscreen-View" src="screenshots/Fullscreen-View.png" />

</details>

---

## Features

**Glowify offers:**

- A glow around the whole UI, with its size, color and an outline mode you can set yourself
- Many customization options in the Glowify Settings
- Beautiful dynamic colors, taken from the cover or your background
- Animated backgrounds, your own images or URLs as background
- Vinyl cover art, cover flip and cover swipe animations, a floating player and a next song card
- A playbar equalizer and a playbar glow that react to the song
- [Liquid Lyrics](https://github.com/NMWplays/Liquid-Lyrics), the official lyrics extension for Glowify
- And much more!

## Building from source

```sh
npm install
npm run build
```

`src/` builds into `dist/theme.js`. `theme.css` holds the static styles and is not built. `npm run deploy` builds and copies `theme.js` into SpotiKit's theme folder.

The `main` branch holds the Spicetify version of Glowify.

## Credits

Created by NMW.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE.txt) file for details.
