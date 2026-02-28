# Modern Music Player

![Modern Music Player](public-images/cover.png)

A sleek, responsive, and functional music player web application built with modern HTML, CSS, and JavaScript. This project integrates with the SoundCloud Widget API, allowing users to play pre-loaded tracks and dynamically load any SoundCloud track by URL.

## Features

*   **Modern Aesthetics:**
    *   **Glassmorphism Design:** Semi-transparent, blurred background card.
    *   **Dark Mode:** Deep purple and grey color palette (`#2e2836`).
    *   **Interactive Visuals:** Album art rotates like a vinyl record during playback.
    *   **Responsive:** Works beautifully on desktop and mobile devices.

*   **Core Functionality:**
    *   **Play/Pause Control:** Seamlessly toggles the SoundCloud widget.
    *   **Track Navigation:** Skip to previous or next tracks in the playlist.
    *   **Progress Bar:** 
        *   Real-time playback tracking.
        *   Click-to-seek functionality.
    *   **Volume Control:** Adjustable volume slider.
    *   **Dynamic Metadata:** Automatically updates title, artist, and album art when a new track loads.

*   **Dynamic Loading:**
    *   **Input Field:** Users can paste any public SoundCloud track URL.
    *   **Instant Play:** The player immediately loads and starts playing the new track.
    *   **Playlist Integration:** New tracks are added to the internal playlist queue.

## Live Demo

(If you host this on GitHub Pages or similar, put the link here)

## How to Use

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DanielZmGt/modern-music-player.git
    ```
2.  **Open the project:**
    Simply open `index.html` in your preferred web browser. No build steps or server required!

3.  **Play Music:**
    *   Click the big **Play** button to start the default playlist.
    *   Paste a SoundCloud URL (e.g., `https://soundcloud.com/artist/song`) into the input box and click **Load**.

## Technologies Used

*   **HTML5**
*   **CSS3** (Flexbox, CSS Variables, Animations)
*   **JavaScript (ES6+)**
*   **SoundCloud Widget API**

## Customization

You can easily modify the default playlist by editing the `songs` array in `script.js`:

```javascript
const songs = [
  {
    title: 'Your Song Title',
    artist: 'Artist Name',
    url: 'https://soundcloud.com/your-artist/your-song',
    cover: 'https://path-to-your-image.jpg'
  },
  // ...
];
```

## License

This project is open source and available under the [MIT License](LICENSE).
