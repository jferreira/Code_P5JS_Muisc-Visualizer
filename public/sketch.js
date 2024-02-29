// An array to hold all loaded songs
let songs = [];
// Index to keep track of the currently playing song
let currentSongIndex = 0;
// Variable to store the current song title
let songTitle = "";
let length = 0;
let angle = 0;

const myBufferLength = 5;
const frequencyBand = 128;
let myBufferPos = 0;
let myBuffer = get_2d_array_filled(61,128,0); // fill buffer array so it has values before data from fft analysis is in

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
   f = loadFont(
    "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
  );
}

function setup() {
  
  //createCanvas(windowWidth, 1024);
  // Set up the canvas size and frame rate
 createCanvas(1024, 1024, WEBGL); // Canvas size is 1200x1200 pixels in 3D mode
 camera(width/2, height/2-200, (height/2.0) / tan(PI*30.0 / 180.0), width/2, height/2, 0, 0, -1, 0);

 textFont(f, 50);

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
  fft = new p5.FFT(0.9, frequencyBand);

  // Calculate the space between lines for visualization
  // This value controls the gap between bars in the audio visualization
  space_between_lines = 6; // Adjust this value for thicker bars and larger gaps
}

// https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
function get_2d_array_filled(numRows, numColumnns, fillValue) {
  return [...Array(numRows)].map(e => Array(numColumnns).fill(fillValue));
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
  //lights();
  frameRate(30); // Set the frame rate to 30 frames per second
   // Camera settings
  orbitControl(); // Enable 3D camera control
  let cal = new Date();
  let remainder = ((cal.getMilliseconds()) + (cal.getSeconds() * 1000)) % 20001;
  
  //push();
  //fill('red');
  //rect(0,0,1532,24);
  //pop();
  
  translate(width/2, height/2, 0);
  rotateX(20);
  rotateY(map(remainder, 0, 20000, 0, 2*PI));
  

  // Analyze the audio spectrum using FFT
  let spectrum = fft.analyze();

  //strokeWeight(2);  
  
  // Define a variable for the gap width between bars
  let gapWidth = 10;

  // Define a variable for the bar width
  let barWidth = 2; // Adjust this value as needed

  myBuffer[myBufferPos] = spectrum;

  strokeWeight(barWidth);
  stroke(255,255,255, 50);

  for(let z = 0; z < myBufferLength; z++) { 
    translate (0, 0, z * gapWidth);

    for (let i = 0; i < frequencyBand; i++) {
      let x = i * gapWidth - width/2;
      let amp = myBuffer[z][i];

      line(x, 0, x, amp);
    }
  }

  myBufferPos++;
  myBufferPos = myBufferPos % myBufferLength;


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