const musicContainer = document.querySelector('.player-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const currTime = document.getElementById('curr-time');
const durTime = document.getElementById('dur-time');
const volumeSlider = document.getElementById('volume-slider');
const trackUrlInput = document.getElementById('track-url');
const loadTrackBtn = document.getElementById('load-track');

// Initialize SoundCloud Widget
const iframeElement = document.querySelector('#sc-widget');
const widget = SC.Widget(iframeElement);

// Song Metadata & URLs
let songs = [
  {
    title: 'Tune In I',
    artist: 'Esteban de Haro',
    url: 'https://soundcloud.com/esteban-de-haro/esteban-de-haro-tune-in-i',
    cover: 'https://i1.sndcdn.com/artworks-qoBvKkJtmN7yRTDD-EvHzQA-t500x500.png'
  },
  {
    title: 'Promo Mix Nov 2025',
    artist: 'Siceron',
    url: 'https://soundcloud.com/siceron/siceron-promo-mix-nov-2025',
    cover: 'https://i1.sndcdn.com/artworks-Hg7zp4MgNynIWQrI-yUDTcA-t500x500.png'
  }
];

let songIndex = 0;
let isPlaying = false;
let currentDuration = 0;

// Initialize
loadSongDetails(songs[songIndex]);

// Setup Widget Events
widget.bind(SC.Widget.Events.READY, function() {
    console.log('SoundCloud Widget Ready');
    // Set initial volume
    widget.setVolume(50);
    
    // Get duration of the initially loaded track
    widget.getDuration(function(duration) {
        currentDuration = duration / 1000; // Convert to seconds
        updateTimeDisplay(0, currentDuration);
    });
});

widget.bind(SC.Widget.Events.PLAY, function() {
    isPlaying = true;
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    
    // Attempt to fetch current sound metadata to update UI if it was a custom load
    widget.getCurrentSound(function(sound) {
        if (sound) {
            // Only update if it differs from current to avoid flickering
            if (sound.title && title.innerText !== sound.title) {
                title.innerText = sound.title;
            }
            if (sound.user && sound.user.username && artist.innerText !== sound.user.username) {
                artist.innerText = sound.user.username;
            }
            if (sound.artwork_url) {
                 // SoundCloud returns small images by default, let's try to get larger ones
                 let artworkUrl = sound.artwork_url.replace('-large', '-t500x500'); 
                 cover.src = artworkUrl;
            }
        }
    });
});

widget.bind(SC.Widget.Events.PAUSE, function() {
    isPlaying = false;
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
});

widget.bind(SC.Widget.Events.FINISH, function() {
    nextSong();
});

widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
    // data.currentPosition is in milliseconds
    const currentTime = data.currentPosition / 1000;
    
    // Update Progress Bar
    if (currentDuration > 0) {
        const progressPercent = (currentTime / currentDuration) * 100;
        progress.style.width = `${progressPercent}%`;
        updateTimeDisplay(currentTime, currentDuration);
    }
});

function loadSongDetails(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    cover.src = song.cover || 'https://via.placeholder.com/300/1DB954/FFFFFF?text=SoundCloud';
}

function loadAndPlaySong(song) {
    loadSongDetails(song);
    
    // Load new track into widget
    widget.load(song.url, {
        auto_play: true,
        show_artwork: false,
        callback: function() {
             setTimeout(() => {
                widget.getDuration(function(duration) {
                    currentDuration = duration / 1000;
                });
             }, 1000);
        }
    });
    
    // Reset progress
    progress.style.width = '0%';
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadAndPlaySong(songs[songIndex]);
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadAndPlaySong(songs[songIndex]);
}

function togglePlay() {
    widget.toggle();
}

function updateTimeDisplay(current, duration) {
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) { durationSeconds = `0${durationSeconds}`; }
    
    const currentMinutes = Math.floor(current / 60);
    let currentSeconds = Math.floor(current % 60);
    if (currentSeconds < 10) { currentSeconds = `0${currentSeconds}`; }
    
    currTime.innerText = `${currentMinutes}:${currentSeconds}`;
    if (!isNaN(durationMinutes)) {
        durTime.innerText = `${durationMinutes}:${durationSeconds}`;
    }
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Progress Bar Click (Seek)
progressContainer.addEventListener('click', function(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    if (currentDuration > 0) {
        const seekTimeSeconds = (clickX / width) * currentDuration;
        const seekTimeMilliseconds = seekTimeSeconds * 1000;
        
        widget.seekTo(seekTimeMilliseconds);
    }
});

// Volume Control
volumeSlider.addEventListener('input', function() {
    const volume = this.value;
    widget.setVolume(volume);
});

// Load Custom Track
loadTrackBtn.addEventListener('click', () => {
    const url = trackUrlInput.value;
    if(url) {
        // Add to our list so next/prev works nicely
        const newSong = {
            title: 'Loading...',
            artist: 'SoundCloud User',
            url: url,
            cover: 'https://via.placeholder.com/300/1DB954/FFFFFF?text=Loading...'
        };
        
        // Insert after current song
        songs.splice(songIndex + 1, 0, newSong);
        
        // Skip to it
        nextSong();
        
        // Clear input
        trackUrlInput.value = '';
    }
});
