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

  // Analyze the audio spectrum using FFT
  let spectrum = fft.analyze();
  
  
  // Define a variable for the gap width between bars
let gapWidth = 4;

// Define a variable for the bar width
let barWidth = 2; // Adjust this value as needed

// Loop for both the left and right sides
for (let side = -1; side <= 1; side += 2) {
  for (let i = 0; i < spectrum.length; i++) {
    // Set the fill color to white with varying opacity based on spectrum frequency
    fill(255, map(i, 0, spectrum.length, 0, 255));
    // Get the amplitude (loudness) of the current frequency band
    let amp = spectrum[i];
    // Map the amplitude to a vertical position on the canvas
    let y = map(amp, 0, 256, height, 0);

    // Calculate the x-position for the current side (left or right)
    let x = width / 2 + side * (i * (barWidth + gapWidth) + barWidth / 2);
    
    // Draw rectangles for the audio visualization on the current side
    rect(x, y, barWidth, height - y);
  }
}


  
 // Display the current song title above the chart
 fill(255); // Set text color to white
 textSize(12); // Set text size
 textAlign(CENTER, TOP); // Center-align the text at the top
 text("Now Playing: " + songTitle, width / 2, 10); // Display the current song title above the chart
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
