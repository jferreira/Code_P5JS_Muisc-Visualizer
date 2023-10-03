// An array to hold all loaded songs
let songs = [];
// Index to keep track of the currently playing song
let currentSongIndex = 0;
// Variable to store the current song title
let songTitle = "";

function preload() {
  // List all the MP3 files in the "audio/" folder
  let songFiles = [
    'audio/01 • Bicep • Glue.mp3',
    'audio/02 • DJ T. • Patci.mp3',
    'audio/03 • Roman Flugel • Wilkie.mp3',
    'audio/04 • Weval • Someday.mp3',
    'audio/05 • Bicep • Apricots.mp3',
    // Add more songs here as needed
  ];

  // Load each song and store it in the 'songs' array
  for (let i = 0; i < songFiles.length; i++) {
    let song = loadSound(songFiles[i]);
    songs.push(song);
  }
}

function setup() {
  createCanvas(windowWidth, 640);
  // Set angle mode to DEGREES
  angleMode(DEGREES);
  // Set color mode to HSB
  colorMode(HSB);

// Create a button to play the previous song
let prevButton = createButton('Previous');
prevButton.mousePressed(playPreviousSong);

// Create a button to toggle play/pause
let toggleButton = createButton('Toggle Play');
toggleButton.mousePressed(toggleSong);

// Create a button to play the next song
let nextButton = createButton('Next');
nextButton.mousePressed(playNextSong);
  
  // Start playing the first song
  songs[currentSongIndex].play();
  
// Create an FFT object for audio analysis
// Parameters: (smoothing, bands)
// smoothing: Controls graph responsiveness (0.0 to 1.0, higher values make it smoother)
// bands: Number of frequency bands in the audio spectrum
fft = new p5.FFT(0.9, 128);

// Calculate the space between lines for visualization
// This value controls the gap between bars in the audio visualization
space_between_lines = 6; // Adjust this value for thicker bars and larger gaps


}

function toggleSong() {
  // If the current song is playing, pause it. Otherwise, play it.
  if (songs[currentSongIndex].isPlaying()) {
    songs[currentSongIndex].pause();
  } else {
    songs[currentSongIndex].play();
  }
}

function playNextSong() {
  // Pause the current song
  songs[currentSongIndex].pause();
  // Increment the current song index
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  // Play the new current song
  songs[currentSongIndex].play();
  // Update the displayed song title
  updateSongTitle();
}

function playPreviousSong() {
  // Pause the current song
  songs[currentSongIndex].pause();
  // Decrement the current song index
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  // Play the new current song
  songs[currentSongIndex].play();
  // Update the displayed song title
  updateSongTitle();
}


function draw() {
  // Set the background color to black
  background(0);

  // Camera settings
  orbitControl(); // Enable 3D camera control

  // Perform FFT analysis on the audio
  let spectrum = fft.analyze();

  // Create an array to store audio amplitudes
  let myAmps = new Array(specSize).fill(0);

  // Loop through the audio spectrum
  for (let i = 0; i < specSize; i += 20) {
    myAmps[i] = fft.getFreq(i); // Get the frequency data
  }

  // Store the audio amplitudes in the buffer
  myBuffer[myPointer] = myAmps;
  myPointer++;
  myPointer = myPointer % myBuffer.length;

  // Loop through the spectrum and draw lines based on audio amplitudes
  for (let shiftX = 0; shiftX < specSize; shiftX += 20) {
    for (let i = 0; i < myBuffer.length; i++) {
      let j = (i + myPointer) % myBuffer.length;
      let amplitude = 0;

      // Check if audio data is available in the buffer
      if (myBuffer[j]) {
        amplitude = myBuffer[j][shiftX]; // Get the amplitude for a specific frequency band
      }

      // Normalize the amplitude and calculate line position and length
      let amplitudeNormalized1 = 180 * amplitude / (height / 2);
      let deGrade = (70 - abs(i - 60)) / 70;
      let deGrade2 = deGrade * deGrade;
      let amplitudeNormalized = amplitudeNormalized1 * deGrade;
      let displace = 0;

      // Calculate horizontal displacement for drawing lines
      if (i < 31) {
        displace = (31 - i) * 10;
      } else if (i > 31) {
        displace = (i - 31) * -10;
      }

      // Draw lines based on audio amplitudes
      stroke(255, 255, 255, 200 * deGrade2); // Set stroke color with transparency
      // Draw a line from one point to another
      line(shiftX / 4, height / 3, displace, shiftX / 4, height / 3 - amplitudeNormalized, displace);

      stroke(255, 255, 255, 200 * deGrade2); // Set stroke color with transparency
      // Draw a line from one point to another
      line(-shiftX / 4, height / 3, displace, -shiftX / 4, height / 3 - amplitudeNormalized, displace);

      stroke(255, 255, 255, 50 * deGrade2); // Set stroke color with transparency
      // Draw a line from one point to another
      line(shiftX / 4, height / 3, displace, shiftX / 4, height / 3 + amplitudeNormalized, displace);

      stroke(255, 255, 255, 50 * deGrade2); // Set stroke color with transparency
      // Draw a line from one point to another
      line(-shiftX / 4, height / 3, displace, -shiftX / 4, height / 3 + amplitudeNormalized, displace);
    }
  }

  // Check if the song is not playing, and if it's not paused, rewind and play it
  if (!song.isPlaying() && isPlaying) {
    song.play(); // Resume playing the song
  }
}

function keyPressed() {
  if (keyCode === RIGHT) {
    // Right arrow: Increment the current song index
    currentSongKey = (currentSongKey + 1) % songTitles.length;

    // Load and play the new song
    setupSong(songTitles[currentSongKey]);
  } else if (keyCode === LEFT) {
    // Left arrow: Decrement the current song index
    currentSongKey = (currentSongKey - 1 + songTitles.length) % songTitles.length;

    // Load and play the new song
    setupSong(songTitles[currentSongKey]);
  } else if (key === ' ') {
    // Spacebar: Toggle play/pause
    if (isPlaying) {
      song.pause(); // Pause the song
    } else {
      song.play(); // Resume playing the song
    }
    isPlaying = !isPlaying; // Toggle the play/pause state
  }
}




function touchStarted() {
  // Resume the audio context to enable audio playback on touch devices
  getAudioContext().resume();
}

// Function to update the current song title
function updateSongTitle() {
  // Get the URL of the current song
  let filename = songs[currentSongIndex].url();
  // Split the URL by '/' to extract the filename
  let parts = filename.split('/');
  // Set the songTitle variable to the extracted filename
  songTitle = parts[parts.length - 1];
}
