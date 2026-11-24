/* ----------------------------------------------------------------------------------------------------------
 2860Poker.dk - PokerTimer - Approx. 1,5 - 2 hours game time 
   SMP  22-11-2024  ver. 1.00 
   SMP  27-11-2024  ver. 2.10  Single button for action, color on progressbar
   SMP  30-11-2024  ver. 2.50  Reset button, auto fullscreen while running
   SMP  03-12-2024  ver. 3.00  [Pause/Break] now supported    
   SMP  14-12-2024  ver. 3.10    shortcut keys [ctrl]+[alt]+ "n", "t"  
   SMP  28-12-2024  ver. 3.21    dialogs for sound profiles and blinds mm. profiles  "F1"
   SMP  02-01-2025  ver. 3.30    enable blinds speak 
   SMP  08-01-2025  ver. 3.31    fix keyboard input for older browser versions
   SMP  14-01-2025  ver. 3.32    terminate video on gameover and exit fullscreen
   SMP  22-01-2025  ver. 3.40    ES6 compliant
   SMP  27-01-2025  ver. 3.41    voice selector
   SMP  30-01-2025  ver. 3.50    enable new config panel
   SMP  28-02-2025  ver. 3.51    color selector dialog, dim blinds on pause, keep fullscreen on new game, touch enable
   SMP  28-02-2025  ver. 3.52    add new blinds structure for 3 hours game
   SMP  28-02-2025  ver. 3.53    add "ChipUp break"
   SMP  16-10-2025  ver. 3.54    add clock at bottombar, add purple chip added, new plan for wed.
   SMP  14-12-2025  ver. 3.55    removed test blinds from selection, command line only blinds=test, show chips as default
   SMP  24-03-2026  ver. 3.56    add suport for TV-Remote Start/Pause buttons
   SMP  02-05-2026  ver. 3.57    new default blinds structure
   SMP  03-09-2026  ver. 3.60    add game logging, [ctrl]+[alt]+ "l" 
   SMP  06-11-2026  ver. 3.70    better fit for 1080p screens (Full HD 1920 x 1080 pixels)
   SMP  19-11-2026  ver. 3.70.x  minor fixes 
------------------------------------------------------------------------------------------------------------- */
"use strict";    // keep god coding habits 
const sysVersion   = "Ver. 3.70";                                 // major poker clock version 
const minorVersion = ".1911.10";                                  // minor version id: ddmm.hh 

const urlParams    = new URLSearchParams(window.location.search); // URL Params break up the URL querystring 
const synthVoice   = window.speechSynthesis;                      // speak  support   
const docRoot      = document.documentElement;                    // HTML Element get document attributes and css root variables 
const lineBreak    = "\r\n";                                      // Linebreak

/* Application display Strings */
const pressStart       = "Tryk 'Start'";  // game is loaded 
const blindsLevelText  = "Blinds level";  // current blinds level
const blindsNext       = "Next blinds";   // next blinds level
const gameOver         = "Game Over";     // no more blinds
const gamePause        = "Pause";         // game is on "Pause" displayed in next blinds panel
const gameChipupPause  = "Veksle Pause";  // game is on "Veksle Pause" displayed in next blinds panel
const playTime         = "Spil tid:";     // total game time

const defaultBlinds    = ("2860 1:40h w".toLowerCase()); // dafault blinds structure - param blinds=test enforce test blinds

/* Button labels */
const buttoneContinue  = "Fortsæt";       // actionbutton text,  continue after pause 
const buttonStart      = "Start";         // actionbutton text,  game is on pause or not started yet
const buttonPause      = gamePause;       // actionbutton text,  game is running
const buttonNewGame    = "Nyt spil";      // newgamebutton text, game is on pause

/* Config topbar text labels */
const strSound         = "Lyde: ";        // config bar sounds
const strBlind         = "Blinds: ";      // config bar blinds
const strBlindPlan     = "Plan: ";        // config bar blinds plan
const strChips         = "Chips";         // config bar chips chk.
const strVoice         = "Stemme";        // config bar voice chk.
const strMute          = "Mute";          // config bar mute chk.
const strBreak         = "Break";         // config bar chip up break chk.
const strColor         = "Farve: ";       // config bar color select

/* misc. */
const startInfo        = "Pokertimer by 2860poker.dk";       // start info
const titlePrompt      = "Avgiv en titel til spillet";       // game titel prompt
const resetGameCookies = "Reset application settings ?";     // Game reset dialog 
const resetStatistics  = "Reset game statistics ?";          // Game reset dialog 
const anounceBlinds    = "blinds are";                       // speak lead in
const defSpeakerName   = "Microsoft David - English (United States)"; // default speaker name

/* javascript attributes */
const hideIt           = "hidden";                           // Set element hidden 
const showIt           = "visible";                          // Set element visible 

/* URL parameters */
const paramPageTitle   = urlParams.get('title');             // Add a title on the timer page
const paramReset       = urlParams.get('reset');             // Reset game settings
const paramConfig      = urlParams.get('config');            // For debug Only  show the status  paramStatus
const paramSpeed       = Number(urlParams.get('speed'));     // For debug Only  speed=59 for 1 min. increments
const paramDebugInfo   = urlParams.get('debug');             // For debug Only 
const paramBlinds      = urlParams.get('blinds');            // For debug Only - fill blinds structure to test only

/* Document html main panel elements  */
const wAppTable        = document.getElementById('applicationTable'); // entire application window   
const wTitle           = document.getElementById('pageTitle');        // timer title
const wLineFeed        = document.getElementById('linefeed');         // linefeed after title if any
const wBtitle          = document.getElementById('blindsHeader');     // level blinds header 
const wBlinds          = document.getElementById('theBlinds');        // current blinds
const wTime            = document.getElementById('levelTimer');       // level remaining time
const wBnext           = document.getElementById('theNextBlinds');    // next blinds
const wChipValues      = document.getElementById('chipValues');       // chip values  
const wProgressBar     = document.getElementById('levelProgressBar'); // the progress bar
const wProgress        = document.getElementById('levelProgress');    // progress at the progressbar
const wKeepAlive       = document.getElementById('keepalive');        // keepalive video
const wDebugInfo       = document.getElementById('debuginfo');        // debug info

/* status bar top elements */
const wtChips          = document.getElementById('statChips');        // chips display
const wtMute           = document.getElementById('statMute');         // status bar mute
const wtBreak          = document.getElementById('statBreak');        // status bar break
const wtVoice          = document.getElementById('statVoice');        // status bar current voice
const wtVoiceOnOff     = document.getElementById('statVoiceOnOff');   // voice on off dialog 
const wtSoundPlan      = document.getElementById('statSound');        // the current sound
const wtBlinds         = document.getElementById('statBlinds');       // the current blinds schema
const wtBlindsLevel    = document.getElementById('statBlindsLevel');  // the current blinds level
const wtColor          = document.getElementById('statColor');        // the color

/* status bar bottom elements */
const wGameTime        = document.getElementById('gametime');         // status bar spilletid 
const wApplicationInfo = document.getElementById('sysver');           // status bar versionsinfo before start 
const wVersion         = document.getElementById('version');          // status bar current version

/* dialogs elements */
const dlgActionButton  = document.getElementById('actionButton');     // Action Button
const dlgRestartButton = document.getElementById('restartButton');    // New Gamen Button
const dlgVoice         = document.getElementById('dlgVoice');         // Select voice dialog
const dlgVoiceSelect   = document.getElementById('voiceSelect');      // voice selection value dialog
const dlgVoiceOnOff    = document.getElementById('dlgVoiceOnOff');    // voice on off dialog
const dlgVoiceOOSelect = document.getElementById('rVoiceOnOff');      // voice on off Checkbox 
const dlgSound         = document.getElementById('dlgSound');         // Select sound profile dialog
const dlgSoundSelect   = document.getElementById('soundSelect');      // sound selection value dialog
const dlgBlinds        = document.getElementById('dlgBlinds');        // Select blinds profile dialog
const dlgBlindsSelect  = document.getElementById('blindSelect');      // blinds selection value dialog
const dlgColorSelect   = document.getElementById('colorSelect');      // select color
const dlgBlindsLevel   = document.getElementById('dlgBlindLevel');    // Select blinds level dialog
const dlgBLevelSelect  = document.getElementById('blindLevelSelect'); // blinds level selection value dialog
const dlgMute          = document.getElementById('dlgMute');          // mute element 
const dlgMuteSelect    = document.getElementById('rMute');            // sound on off Checkbox 
const dlgBreakSelect   = document.getElementById('rBreak');           // chip up break on off Checkbox 
const dlgBreak         = document.getElementById('dlgBreak');         // chip up break on off dialog 
const dlgChips         = document.getElementById('dlgChips');         // the chips panel
const dlgChipsSelect   = document.getElementById('rChips');           // show/hide the chips

/* Application system Strings */
const coSounds         = "SoundProfile";       // Cookie name (localStorage)
const coBlinds         = "BlindsProfile";      // Cookie name (localStorage)
const coVoice          = "VoiceProfile";       // Cookie name (localStorage)
const coChips          = "ChipDisplay";        // Cookie name (localStorage)
const coSoundMute      = "SoundMute";          // Cookie name (localStorage)
const coBreak          = "BreakEnabled";       // Cookie name (localStorage)
const coVoiceMute      = "VoiceMute";          // Cookie name (localStorage)
const coVersion        = "TimerVersion";       // Cookie name (localStorage)
const coColor          = "Color";              // Cookie name (localStorage)
const cGameTime        = "GameTime";           // Cookie name (localStorage)
const cGameTimeWrk     = "GTTemp";             // Cookie name (localStorage)
const cGameTitle       = "GameTitle";          // Cookie name (localStorage)

const optVoiceLang     = "voicelang";          // voice language options list 
const optVoiceName     = "voicename";          // name of voice options list

/* File references */
const soundsPath       = "res/mm/sounds/";     // path to sounds 
const soundLevel       = "/NewLevel.wav";      // sound name new level          (same name in alle folders)
const soundLevelwarn   = "/NewLevelWarn.wav";  // sound name new level warning  (same name in alle folders)
const soundDefault     = "GongGong";           // default sound                 (folder name)
const fileHelp         = "help.html";          // help page
const fileStatistics   = "statistics.html";    // statistics page

const keepAliveVideo   = "res/mm/video.mp4";   // the keepalive video
const videoType        = "video/mp4";          // type of video

/* other */
const voiceDelay       = 3;                    // delay in sec. before new blinds speak, after new level sound
const minStatTime      = 600;                  // minimum 10 min. to record game statistics

/* ========================================================================================================== */
/* Global variables */
/* ========================================================================================================== */
/* sound variables */
let nextLevelSound      = null;           // sound next level
let levelWarningSound   = null;           // sound next level warning
let theSpeaker          = 0;              // the speaker index
let theSpeakerName      = "";             // the voice
let systemVoices        = [];             // system voice array

/* Application variables */
let timerInst           = null;           // blind timer instance   
let gameTimeInst        = null;           // game runtime timer instance   
let gameTime            = 0;              // game running time 
let gameTimePlay        = gameTime;       // game running time without pause 

let remainLevelTime     = 0;              // remaining seconds of current level
let levelTime           = 0;              // original amount of seconds in this level
let colorIndex          = 0;              // selected color index
let colorName           = "";             // selected color name
let colorValue          = 0;              // selected color value #000000

let blindsTable         = [];             // blinds definitions - new empty array
let blindsLevel         = 0;              // blinds level  - starting level
let blindsLastLevel     = 0;              // level count
let bBlindSelect        = null;           // selected blinds structure 
let bSoundSelect        = null;           // selected sounds 
let nextBlinds          = "";             // next blinds string 
let bChipUpBreak        = false;          // On chip up break
let bChipUpDone         = false;          // Chip up break done
let pageTitle           = paramPageTitle; // the page title from command line, if any
let sysInfo             = startInfo + " - " + sysVersion + minorVersion; // system version info
let allGameTimes        = "";             // Game time statistics
let gameTimeWork        = "";             // Game statistics  work string variable

/* logical flags */
let showConfigPanel     = (paramConfig != null); // show/hide the config line in the top   
let isSoundMute         = false;                 // is sound muted ?
let isBreakEnabled      = true;                  // is break enabled
let isVoiceMute         = true;                  // is voice muted ?
let isGamePaused        = true;                  // is game paused ?
let isVoiceSupport      = true;                  // is voice supported on this device ?
let isGameOver          = false;                 // is game over ?
let isBlindLevelChanged = false;                 // if blinds level changed manually
let showChipPanel       = true;                  // hide/show chips panel 

/* ========================================================================================================== */
initializeTimer();     // Call the initializeTimer function and let the fun begin
/* ========================================================================================================== */

/* ---------------------------------------------------------------------------------------------------------- */
/* initialize Timer function called only when the page is loaded */
/* ---------------------------------------------------------------------------------------------------------- */
function initializeTimer() {
  console.clear();             // clear console   
  
  //console.trace();           // See where this function is being called from  (Chrome only)
  wDebugInfo.innerHTML = "";   // clear local debug info
  addDebugInfo("Build " + sysVersion + minorVersion);
  addDebugInfo("Resolution: " + screen.width      + " x " + screen.height +  " " +      "(width x height)  ratio: " + Math.round(screen.height      / screen.width      * 100 )  / 100);
  addDebugInfo("Window: "     + window.innerWidth + " x " + window.innerHeight +  " " + "(width x height)  ratio: " + Math.round(window.innerHeight / window.innerWidth * 100 )  / 100);
  addDebugInfo(navigator.userAgent);
  
  /* Add keyboard listners */
  document.addEventListener("touchstart", countFingers);        // listen for touch events set "countFingers" as callback function
  document.addEventListener("keyup",      handleKeyboard);      // listen to keyboard events, set "handleKeyboard" as callback function
  document.addEventListener("keydown",    handleFunctionKeys);  // listen to function keys (F1 help) "handleFunctionKeys" as callback function
  isGamePaused               = true;                            // game paused from the start
  dlgRestartButton.innerHTML = buttonNewGame;                   // new game button text
  dlgRestartButton.hidden    = true;                            // hide new game button is a new game
  dlgActionButton.innerHTML  = buttonStart;                     // action button text
  dlgActionButton.hidden     = false;                           // show the start button
  allGameTimes               = getCookie(cGameTime);            // saved  game statistics
  clearInterval(gameTimeInst);                                  // stop the game timer instance  
  if (getCookie(coVersion) != sysVersion) clearGameSettings();  // New version, so reset settings to default, but save game statistics
  readGameSettings();                                           // read game settings
  setCookie(cGameTime, allGameTimes);                           // Restore game statistics
  wVersion.innerHTML = sysVersion;                              // display version 
  
  /* Handle command line parameters */
  /* ---------------------------------------------------------------------------------------------------------- */
  wDebugInfo.style.visibility = hideIt;                             // hide debug panel 
  if (paramDebugInfo != null) wDebugInfo.style.visibility = showIt; // show debug panel  "debug"
  else wDebugInfo.innerHTML = "";                                   // clear local debug info
  if (paramReset != null) {
    clearGameSettings();                                            // delete game settings  "reset"
    readGameSettings();                                             // read new game settings
    setCookie(cGameTime, "");                                       // also clear game stat.
    setCookie(cGameTimeWrk, "");                                    // also clear working data
  }
  if (paramPageTitle != null) {                                     // we have a parameter title
    pageTitle = paramPageTitle;
    setCookie(cGameTitle,  pageTitle);  
  }
  if (pageTitle.length > 0 ) wLineFeed.innerHTML = "&nbsp;";        // page title make a little space 
  else wLineFeed.innerHTML = "";                                    // no title so no need for space 
  wTitle.textContent = pageTitle;                                   // display title, if any  html tags ignored     
  
  if (gameTime > minStatTime || gameTime == 0 ) {                   // only log games over 10 min.
    let savedTime = getCookie(cGameTimeWrk);
    if  (savedTime.length > 0) {   
      allGameTimes = allGameTimes + savedTime;   
      setCookie(cGameTime,    allGameTimes);                        // save statistics
      setCookie(cGameTimeWrk, "");                                  // clear
    }
  } 
  
  /* reset global variables for a new game */
  gameTime              = 0;          // total game time 
  gameTimePlay          = gameTime;   // game time without pause
  remainLevelTime       = 0;          // remaining seconds of current level 
  levelTime             = 0;          // original amount of seconds in this level
  blindsLevel           = 0;          // blinds level  - starting level
  blindsLastLevel       = 0;          // level count
  wProgress.style.width = 0;          // reset the progress bar
  gameTimeInst          = null;       // clear the instance id 
  wGameTime.innerHTML   = "";         // clear game time display
  isGameOver            = false;      // is game over ?
  bChipUpDone           = false;      // chip up break not none
  populateKeepAliveVideo();           // handle keep alive video
  populateBlindsSelector();           // fill blinds selector
  populateSoundsSelector();           // fill sounds selector
  populateColorSelector();            // fill color selector
  populateBlinds();                   // fill the blinds select dialog
  
  // load game sounds
  dlgSoundSelect.value = bSoundSelect;                                                     // set the dialog value 
  nextLevelSound    = new Audio(soundsPath + bSoundSelect.toLowerCase() + soundLevel);     // NewLevel sound
  levelWarningSound = new Audio(soundsPath + bSoundSelect.toLowerCase() + soundLevelwarn); // NewLevel warning sound 
    
  // load voices 
  isVoiceSupport = loadSyntheticVoices();                     // load voice and check for voice support 
  theSpeaker = selectVoice(theSpeakerName);

  // perpare for dispaly 
  // dlgBlindsSelect
  
  dlgBLevelSelect.selectedIndex = blindsLevel;                 // set level selector
  dlgMuteSelect.checked = isSoundMute;                         // set mute check box
  dlgBreakSelect.checked  = isBreakEnabled;                    // is break enabled
  dlgVoiceOOSelect.checked = !isVoiceMute;                     // set voice check box
  showConfig(showConfigPanel);                                 // show the config panel if enabled
  displayPage();                                               // show the page
  showChips(showChipPanel);                                    // show/hide the chip value panel
  wTime.style.color  = grapCssColor('--fgDimmed');             // dim the time
  wTime.style.backgroundColor = colorValue;                    // set background color  Note: fix color problem on old browsers
  wBnext.style.color = grapCssColor('--fgColor');              // highlight start action
  wBnext.innerHTML   = pressStart;                             // show start text
  wGameTime.innerHTML = playTime + " " + formatTime(gameTime); // Show the total game time
  wApplicationInfo.innerHTML = sysInfo;                        // application info before start
  openFullscreen();                                            // switch to fullscreen mode (if game has been running)
}
/* ---------------------------------------------------------------------------------------------------------- */
/* Initialize done - now waiting for events - button click or keyboard */
/* ---------------------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------------------- */
/* Display page content */
/* ---------------------------------------------------------------------------------------------------------- */
function displayPage() {
  let nextLevel = Number(blindsLevel) + 1;
  //console.trace();
  /* Game over */
  if (blindsLevel > blindsLastLevel ) { // Game Over - clear the display
    wBtitle.innerHTML = "";             // Clear blinds title
    wBlinds.innerHTML = "";             // Clear blinds
    wTime.innerHTML  = "";              // Clear timer
    wChipValues.innerHTML = "";         // clear chips display
    wProgressBar.innerHTML = "";        // remove progress bar 
    wVersion.innerHTML = "";            // clear version
    wGameTime.innerHTML   = "";         // clear game time display
    isGameOver = true;                  // set game over flag
    dlgRestartButton.hidden = false;    // show the reset button
    dlgActionButton.hidden  = true;     // hide the start button
    clearInterval(gameTimeInst);        // Stop the game timer instance   
    clearInterval(timerInst);           // Stop the blinds timer instance
    wKeepAlive.pause();                 // Stop keepalive video so the screen saver can take over
    closeFullscreen();                  // Exit full screen mode  
    wProgress.style.width = 0;          // reset progress bar
    speakText(gameOver, theSpeaker);    // speak game over
  } 
  /* Game running */
  else {
    wBtitle.innerHTML   = blindsLevelText + " " + blindsTable[blindsLevel].level;  // display blinds level
    wBlinds.innerHTML   = formatBlinds(blindsLevel);                  // format and display blinds
    levelTime           = blindsTable[blindsLevel].time * 60;         // seconds in this level   
    remainLevelTime     = levelTime;                                  // remaining seconds in this level
    wTime.innerHTML     = formatTime(remainLevelTime);                // show remaining seconds in this level
    if (blindsLevel >= blindsLastLevel) wBnext.innerHTML = gameOver;  // we are out of blind levels announce 'Game Over'
    else wBnext.innerHTML = formatBlinds(nextLevel);                  // format and display next blinds
    nextBlinds = wBnext.innerHTML;                                    // Save blinds string  for pause/start actions
    if (gameTime == 0) {                                              // this is a new game
      wBnext.style.color = grapCssColor('--fgColor');                 // highlight start action
      wBnext.innerHTML   = pressStart;                                // show start  text
    }
  }
}
/* ---------------------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------------------- */
/* Game Start / Pause event function */
/* ---------------------------------------------------------------------------------------------------------- */
function gameAction() {
  //console.trace();
  //wApplicationInfo.innerHTML = "";                                  // Clear versions info 
  
  if (!isGamePaused) {                                                // game is running
    if (timerInst) {                                                  // game timer is running
      let colorDim = grapCssColor('--fgDimmed');                      // read the dim color
      dlgActionButton.innerHTML = buttoneContinue;                    // update button text to 'Fortsæt'
      isGamePaused = true;                                            // update game status
      clearInterval(timerInst);                                       // Stop the blinds timer instance      
      timerInst = null;                                               // clear the instance id                                       
      nextBlinds = wBnext.innerHTML;                                  // Save next blinds string for later use
      wBnext.innerHTML = " " + gamePause + " ";                       // show 'Pause' in next blinds field
      if (isBreakEnabled) {
        if (bChipUpBreak) {
          if (blindsTable[blindsLevel].pause == 1) {
            wBnext.innerHTML = " " + gameChipupPause + " ";
          }
          bChipUpDone = true;                                         // chip up break done
          showChips(showChipPanel);                                   // show/hide the chip value panel
        }
      }
      dlgRestartButton.hidden = false;                                // show new game button
      wTime.style.color               = grapCssColor('--fgColorAlt'); // set the text color
      wTime.style.backgroundColor     = grapCssColor('--fgWarning');  // set the background color
      wBtitle.style.color             = colorDim;                     // dim the blinds title
      wBlinds.style.color             = colorDim;                     // dim the blinds
      wProgress.style.backgroundColor = colorDim;                     // dim the progressbar
    }
  }
  else {                                                              // game is on 'pause'
    if (gameTime == 0 && blindsLevel == 0 || isBlindLevelChanged ) {  // is it a new game 
      displayPage(); 
      soundPlay(nextLevelSound);
      isBlindLevelChanged = false;                                    // avoid playing new level sound again
      if (gameTimeInst == null) {
        gameTimeInst = setInterval(gameTimeCounter, 1000);            // new game - start the total gametime counter
      }
    }                                                             
    /* continue the game after pause */
    wBtitle.style.color = grapCssColor('--fgColorAlt');                 // set blinds title to normal color
    wBnext.style.color  = grapCssColor('--fgColorAlt');                 // set next blind to normal color
    wBlinds.style.color = grapCssColor('--fgColor');                    // Set blinds color
    setTimerColor(remainLevelTime);                                     // remaining level time color  
    wKeepAlive.play();                                                  // play video to keep screen NOTE: must be after a user event
    openFullscreen();                                                   // switch to fullscreen mode
    if (blindsTable[blindsLevel].pause == 1) soundPlay(nextLevelSound); // after chipup break play sound again
    blindsTable[blindsLevel].pause = -1;
    bChipUpBreak = false
    dlgRestartButton.hidden = true;                                     // hide restart button while running
    showConfig(false);                                                  // hide config panel while running
    dlgActionButton.innerHTML = buttonPause;                            // update button text to 'Pause'
    wBnext.innerHTML = nextBlinds;                                      // restore next blinds from saved string
    wTime.style.backgroundColor = grapCssColor('--bgColor');            // set the background color
    isGamePaused = false;                                               // update game status
    /* Ready to start the 1000 mSec. timer loop */
    if (!timerInst) timerInst = setInterval(setTimeAction, 1000);       // Start the blind timer, setTimeAction() get called every second
  }
}
/* ---------------------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------------------- */
/* Callback functions  */
/* ---------------------------------------------------------------------------------------------------------- */

/* The total game time callback function - get called every 1000 mSec.   */ 
function gameTimeCounter() {
  gameTime ++;
  if ( (gameTime % 60) == 0) {                                          // save statistics temp every minute
    gameTimeWork = formatGameTime(gameTime, gameTimePlay, blindsLevel); 
    setCookie(cGameTimeWrk, gameTimeWork);                              
  }
  if (!isGamePaused) {
    gameTimePlay ++;                                                    // count game running time
  }
  wGameTime.innerHTML = playTime + " " + formatTime(gameTime);          // Show the total game time
  wApplicationInfo.innerHTML = timeNow();
}
/* ---------------------------------------------------------------------------------------------------------- */

/* ========================================================================================================== */
/* The blinds timer callback function - get called every 1000 mSec.   */ 
/* ========================================================================================================== */
function setTimeAction() {
  let curProgress = 0;
  remainLevelTime --;                                                         // count down current level
  remainLevelTime = remainLevelTime - paramSpeed;                             // just for test - make the clock run faster 
  curProgress = (levelTime - remainLevelTime)/levelTime * 100;                // calculate the progress percentage
  wProgress.style.width = curProgress + "%";                                  // update progress bar 
  wTime.innerHTML = formatTime(remainLevelTime);                              // display time
  levelWarningSound.muted = false;
  if (remainLevelTime == 60) soundPlay(levelWarningSound);                    // play 1 min. warning sound
  setTimerColor(remainLevelTime);                                             // set remaining level time color   
  
  if (remainLevelTime <= 0) {                                                 // blinds level end 
    blindsLevel++;                                                            // go to next level
    if (blindsLevel <= blindsLastLevel )  soundPlay(nextLevelSound);          // play next level sound
    wTime.style.color = grapCssColor('--fgColor');                            // set the text color
    displayPage();                                                            // show the page
    if( isBreakEnabled) {
      if (blindsTable[blindsLevel].pause >  0) {
        bChipUpBreak = true;                                                  // set game on pause / chip up pause
        gameAction(); 
      }
    }
  }
  if ((levelTime - remainLevelTime) == voiceDelay) {                          // speak blinds after some delay (3 sec.)
    theSpeaker = selectVoice(theSpeakerName); 
    speakBlinds(blindsTable[blindsLevel].sb, blindsTable[blindsLevel].bb, theSpeaker ); 
  }
}
/* ========================================================================================================== */

/* Two finger tap - show / hide the config panel only on pause */
function countFingers(event) {
  let fingerCount = event.touches.length;
  if ((fingerCount == 2) && isGamePaused) {
    showConfigPanel = !showConfigPanel;                         // show / hide toggle
    showConfig(showConfigPanel);                                // show / hide the config panel
  }
}

/* Keyboard events handler  [pause] mm. keyup event */
/* ---------------------------------------------------------------------------------------------------------- */
/* Keyboard  events handler  keydown F1   The event object is automatically passed to all event handlers */
function handleFunctionKeys() {                                 // document.addEventListener callback function set in the initTimer function
   if (paramDebugInfo != null) {
     wTitle.textContent = "FKey code: " + event.code + "  keyCode: " + event.keyCode;
  }                       
  if (keyEvent(event, "F1") ) {                                 // F1 key                                     
    showPage(fileHelp, "width=600,height=785");                 // show help page
    event.preventDefault();                                     // disable normal F1 actions
  }
  if (keyEvent(event, "F3") ) {                                 // disable F3 key actions      
    event.preventDefault();
  }
}

/* Keyboard  handler  keyup - The event object is automatically passed to all event handlers */
function handleKeyboard() {                                     // document.addEventListener callback function set in the initTimer function
  if (paramDebugInfo != null) {
     wTitle.textContent = "code: " + event.code + "  keyCode: " + event.keyCode;
  } 
  if (keyEvent(event, "Pause")          || 
      keyEvent(event, "MediaPlay")      ||                      // remote control keys - "MediaPlay", "MediaPlayPause", "BrowserStop" 
      keyEvent(event, "MediaPlayPause") ||                      // https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/
      keyEvent(event, "Space") ) {                              // event.code == "Space" -  pause/run toggle 
    if ( isGameOver ) location.reload(true);                    // game over - reload page
    gameAction();                                               // pause / continue action
  }
  
  if (keyActionReady(event, "KeyC")) {                          // ctrl + alt + c  show config only on pause
    showConfigPanel = !showConfigPanel;                         // show / hide toggle
    showConfig(showConfigPanel);                                // show / hide the config panel
  }

  if (keyActionReady(event, "KeyN")) {                          // ctrl + alt + n  mew game only on pause
    initializeTimer();                                          // keep browser in fullscreen and restart    
  }

  if (keyActionReady(event, "KeyT" )) {                         // ctrl + alt + "t" set title only on pause
    pageTitle = prompt(titlePrompt, pageTitle);                 // prompt for game title
    if (pageTitle.length > 0 ) wLineFeed.innerHTML = "&nbsp;";  // add extra line space if we have a title
    else wLineFeed.innerHTML = "";                              // no line space
    setCookie(cGameTitle,  pageTitle);                          // save game title
    wTitle.textContent = pageTitle;                             // set the page title
  }

  if (keyActionReady(event, "KeyD" )) {                         // ctrl + alt + "d" delete game cookies only on pause
    if (confirm(resetGameCookies)) {                            // prompt for reset confirmation
      let savedTime = getCookie(cGameTimeWrk);
      if  (savedTime.length > 0) {   
        allGameTimes = allGameTimes + savedTime;                // save statistics
        setCookie(cGameTimeWrk, "");                            // clear work
      }
      clearGameSettings();                                      // delete all cookies
      if (confirm(resetStatistics)) {
        allGameTimes = "";
        setCookie(cGameTime,    "");                            // clear game statistics
        setCookie(cGameTimeWrk, ""); 
      }
      location.reload(true);                                    // reload entire window 
    }
  }

  if (keyActionReady(event, "KeyL" )) {                         // ctrl + alt + "l" show game log only on pause
    showPage(fileStatistics, "width=800,height=700");      
  }
  
}  // end keyboard handler
/* ---------------------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------------------- */
/* Dialog and Button click event functions */
/* ---------------------------------------------------------------------------------------------------------- */
dlgRestartButton.onclick = function() {                       // New Game button (to the right)
  initializeTimer();                                          // keep browser in fullscreen and restart
};

dlgActionButton.onclick = function() {                        // Start/Pause action button  (button to the left)
  //document.activeElement.blur();                            // remove keyboard focus from button  
  levelWarningSound.muted = true;                             // mute sound 
  soundPlay(levelWarningSound);                               // initialize sound  (hack for android TV)
  gameAction();                                               // continue
};
/* ---------------------------------------------------------------------------------------------------------- */

dlgBreakSelect.onclick = function() {
  isBreakEnabled = dlgBreakSelect.checked;                                              // chip up break
  setCookie(coBreak, isBreakEnabled);                                                   // save the selection
};

dlgMuteSelect.onclick = function() {
  isSoundMute = dlgMuteSelect.checked;                                                  // mute /unmute game sounds
  setCookie(coSoundMute, isSoundMute);                                                  // save the selection
};

dlgVoiceOOSelect.onclick = function () {
  isVoiceMute = !(dlgVoiceOOSelect.checked);                                            // mute /unmute voice
  setCookie(coVoiceMute, isVoiceMute);                                                  // save the selection
};

dlgChipsSelect.onclick = function() {
  showChipPanel = dlgChipsSelect.checked;                                               // enable/disable chips panel
  showChips(showChipPanel);                                                             // this function also handles the cookie
};

dlgSound.onchange = function() {
  let newSounds = "";
  newSounds = dlgSoundSelect.value;                                                     // get current sounds from list box
  nextLevelSound    = new Audio(soundsPath + newSounds.toLowerCase() + soundLevel);     // NewLevel sound
  levelWarningSound = new Audio(soundsPath + newSounds.toLowerCase() + soundLevelwarn); // NewLevel warning sound 
  setCookie(coSounds, newSounds);                                                       // save the selection
  setStatusInfo(wtSoundPlan, strSound  + newSounds);                                    // show current sound schema
  soundPlay(nextLevelSound);                                                            // play the sound
};

dlgBlinds.onchange = function() {
  setCookie(coBlinds, dlgBlindsSelect.value);                                           // save the selection
  initializeTimer();                                                                    // keep browser in fullscreen and restart
};

dlgColorSelect.onchange = function() {
  let curIndex   = dlgColorSelect.selectedIndex;                                        // color list box index
  setCookie(coColor, curIndex);                                                         // save the selection
  colorValue     = dlgColorSelect[curIndex].value;                                      // color value 
  colorName      = dlgColorSelect[curIndex].textContent;                                // name of the color
  changeCssColor('--bgColor', colorValue);                                              // change style sheet CSS color
  setStatusInfo(wtColor, strColor + colorName);                                         // show the selection
  if (gameTime == 0 ) wTime.style.backgroundColor = grapCssColor('--bgColor');          // a new game
}; 

dlgBLevelSelect.onchange = function() {
  setStatusInfo(wtBlindsLevel, "Blinds: " + blindsConfigFormat(dlgBLevelSelect.value));       // show blinds
  blindsLevel = Number(dlgBLevelSelect.value);                                          // get blinds level
  isBlindLevelChanged = true;                                                           // blinds level changed
  wProgress.style.width = 0;                                                            // update progress bar 
  wProgress.innerHTML = "";                                                             // clear progress bar 
  wBnext.style.color = grapCssColor('--fgColorAlt');                                    // set next blind to normal color
  displayPage();
};

dlgVoice.onchange = function() {
  let selectedOption = dlgVoiceSelect.selectedOptions[0].getAttribute(optVoiceName);    // speaker list box index
  let voiceIndex = selectVoice(selectedOption);                                         // 'theSpeakerName' is updateted here      
  setCookie(coVoice, selectedOption);                                                   // save the selection
  theSpeaker = voiceIndex;                                                              // selected speaker voice 
  speakBlinds(blindsTable[blindsLevel].sb, blindsTable[blindsLevel].bb, theSpeaker);    // speak blinds
  setStatusInfo(wtVoice, strVoice + ": " + theSpeakerName);                             // show current voice 
};
/* ---------------------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------------------- */
/* Misc. helper functions    */
/* ---------------------------------------------------------------------------------------------------------- */

/* Return current time */
function timeNow(){
    let d = new Date();
    return (zeroPad(d.getHours()) + ":" + zeroPad(d.getMinutes()) + ":" + zeroPad(d.getSeconds()) );
}

/* Set colors on the timer digts and on the progress bar */
function setTimerColor(pLeveTime) {
  if (pLeveTime <= 60) {                                             // 1 min. to next blinds - set warning color
    wTime.style.color = grapCssColor('--fgWarning');                 // turn remaining level time red
    wProgress.style.backgroundColor = grapCssColor('--fgWarning');   // turn progress bar red
  }
  else {
    wTime.style.color = grapCssColor('--fgColor');                   // turn remaining level time yellow
    wProgress.style.backgroundColor = grapCssColor('--fgProgress');  // turn progress bar green
  }
  wBlinds.style.color = grapCssColor('--fgColor');  
}
/* ---------------------------------------------------------------------------------------------------------- */

/* format blinds for main display 'sb / bb' */
function formatBlinds(aLevel) {
  let resStr = blindsTable[aLevel].sb +                              // build the string
      "<small>&nbsp;</small>/<small>&nbsp;</small>" +                // make some space around the '/' char
      blindsTable[aLevel].bb;
  return resStr;       
}
/* ---------------------------------------------------------------------------------------------------------- */

/* format time  hh:mm:ss */
function fTimeBasic(curTime, showHour) {
  let theTime   = curTime;
  let dHour     = parseInt( theTime / 3600);
  let dMin      = parseInt((theTime - (dHour * 3600)) / 60);
  let dSec      = parseInt( theTime % 60);
  let resString = "hh:mm:ss";
  
  if (((theTime / 3600) > 1) || showHour > 0 ) resString = zeroPad(dHour) + ":" + zeroPad(dMin) + ":" + zeroPad(dSec);     // hh:mm:ss 
  else                                         resString = zeroPad(parseInt(theTime / 60)) + ":" + zeroPad(theTime % 60);  //    mm:ss 
  return resString;
}
/* ---------------------------------------------------------------------------------------------------------- */
/* format time for display   hh:mm:ss */
function formatTime(curTime) {
  return "&nbsp;" + fTimeBasic(curTime, 0) + "&nbsp;";
}
/* ---------------------------------------------------------------------------------------------------------- */

/* Create and format a game time statistics string */
function formatGameTime(pGameTime, pGameTimePlay, pLevel ) {
   let cDate    = new Date();
   let level    = zeroPad(Math.round(pLevel + 1));
   let weekday  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
   
   let newItem  = weekday[cDate.getDay()]       + " "       + 
                  zeroPad(cDate.getDate())      + "/"       +   
                  zeroPad(cDate.getMonth() + 1) + " Total " +
                  fTimeBasic(pGameTime,     1)  + " Play  " +
                  fTimeBasic(pGameTimePlay, 1)  + " Level " +
                  level                         + " ("      + 
                  blindsTable[pLevel].sb        + "/"       + 
                  blindsTable[pLevel].bb        + ")  \""   +
                  bBlindSelect                  + "\""      + 
                  lineBreak;
    return newItem;                                           // Tue 08/09 Total 01:40:13 Play 01:35:11 Level 01 (10/20) "2860 1:40h w"
} 
/* ---------------------------------------------------------------------------------------------------------- */


/* Add leading zero to time digits */
function zeroPad(val) {
  return ("00" + val).slice(-2);
}
/* ---------------------------------------------------------------------------------------------------------- */

/* get colores from the stylesheet */
function grapCssColor(color) {
  return getComputedStyle(docRoot).getPropertyValue(color); 
}
/* ---------------------------------------------------------------------------------------------------------- */

/* update css Color */
function changeCssColor(cssName, pcolorValue) {
  let cssRoot = document.querySelector(':root');
  cssRoot.style.setProperty(cssName, pcolorValue);
}
/* ---------------------------------------------------------------------------------------------------------- */

/* Keyboard info https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/          */
/* handle keyboard event */
function keyEvent(event, keyCode) {
  return (event.code == keyCode );
}

/* handle Ctrl + Alt keyboard event */
function keyEventCA(event, keyCode) {
  return (event.ctrlKey && event.altKey && event.code == keyCode );
}

/* ready for actions only on game pause */
function keyActionReady(event, key) {
  return  (( keyEventCA(event, key) ) && isGamePaused );
}
/* ---------------------------------------------------------------------------------------------------------- */

/* set a local cookie (not a real cookie) */
function setCookie(cName, cValue) {  
  localStorage.setItem(cName, cValue);                                        
}

/* read a local cookie */
function getCookie(cName) {
  if (localStorage.getItem(cName) == "undefined" ) return "";
  return (localStorage.getItem(cName)) ? localStorage.getItem(cName) : "";
}

/* delete a local cookie */
function deleteCookie(cName) {
  localStorage.removeItem(cName);
}

/* clear all game cookies/settings from 'localstorage' */
function clearGameSettings() {
  localStorage.clear();
  setCookie(coVersion, sysVersion);         // just save the version for now
  setCookie(cGameTime, allGameTimes);       // Restore game statistics
}
/* ---------------------------------------------------------------------------------------------------------- */

/* read and write game settings from 'localstorage' or set default values  */
function readGameSettings() {
  colorIndex = getCookie(coColor);
  if (colorIndex == "") colorIndex = 0;                      // default color 
  colorIndex = Number(colorIndex);
    
  bSoundSelect = getCookie(coSounds);
  if (bSoundSelect == "")  bSoundSelect = soundDefault;      // default sound scheme 
    
  bBlindSelect = getCookie(coBlinds);
  if (bBlindSelect == "") bBlindSelect = defaultBlinds;      // default blinds scheme 
  
  theSpeakerName = getCookie(coVoice);
  if (theSpeakerName == "") theSpeakerName = defSpeakerName; // default voice
  
  pageTitle      = getCookie(cGameTitle);                    // read game title 
  gameTimeWork   = getCookie(cGameTimeWrk);                  // saved game time statistics
  
  showChipPanel  = readBoolean(coChips,     true);           // read setting or set default value
  isSoundMute    = readBoolean(coSoundMute, false);
  isBreakEnabled = readBoolean(coBreak,     true); 
  isVoiceMute    = readBoolean(coVoiceMute, true);
  
  writeGameSettings();                                       // save all to 'localstorage'
}
/* ---------------------------------------------------------------------------------------------------------- */

/* write all game settings to localstorage */
function writeGameSettings() {
    setCookie(coSounds,     bSoundSelect);
    setCookie(coBlinds,     bBlindSelect);
    setCookie(coVoice,      theSpeakerName);
    setCookie(coChips,      showChipPanel);
    setCookie(coSoundMute,  isSoundMute);    
    setCookie(coBreak,      isBreakEnabled);    
    setCookie(coVoiceMute,  isVoiceMute);   
    setCookie(coVersion,    sysVersion);
    setCookie(coColor,      colorIndex);
    setCookie(cGameTitle,   pageTitle);
    setCookie(cGameTimeWrk, gameTimeWork);
}
/* ---------------------------------------------------------------------------------------------------------- */

/* read boolean value from cookie settings */
function readBoolean(coName, defValue) {
  let resValue  = defValue;                      // default value
  let reading = getCookie(coName);   
  if (reading == "true")  resValue = true;
  if (reading == "false") resValue = false; 
  return resValue;  
}
/* ---------------------------------------------------------------------------------------------------------- */

/* set value data in the top config panel */
function setStatusInfo(tag, value) {
  if (showConfigPanel) tag.innerHTML = value;    
  else                 tag.innerHTML = "";
}
/* ---------------------------------------------------------------------------------------------------------- */

/* Add debuginfo to debug paragraph */
function addDebugInfo(msg) {
  if (wDebugInfo.style.visibility != hideIt) {
    wDebugInfo.innerHTML = wDebugInfo.innerHTML + "<br>" +  msg;
  }
  console.log (msg);
}
/* ---------------------------------------------------------------------------------------------------------- */

/* load voices if any  (synthVoice may be undefined) */
function loadSyntheticVoices() {
  try {
    dlgVoiceSelect.innerHTML = "";                            // clear listbox
    populateVoiceList();                                      // fill voice listbox or fail
    if (speechSynthesis.onvoiceschanged !== undefined) {      // support for voice
      speechSynthesis.onvoiceschanged = populateVoiceList;    // voice changed  fill listbox callback function 
    }
    return true;
  }
  catch(err) {                                                // no support for voice
    addDebugInfo("No support for Speech Synthesis");
    isVoiceMute = true;
    isVoiceSupport = false;
    return false;
  }  
} 
/* ---------------------------------------------------------------------------------------------------------- */

/* populate voices - callback funtion on voice change */
function populateVoiceList() {
  let i = 0;
  let cLang = "";
  systemVoices = synthVoice.getVoices();
  dlgVoiceSelect.innerHTML = "";                                      // clear listbox
  for(i = 0; i < systemVoices.length ; i++) {
    let option = document.createElement('option');
    option.textContent = systemVoices[i].name;
    option.setAttribute(optVoiceLang, systemVoices[i].lang);
    option.setAttribute(optVoiceName, systemVoices[i].name);
    cLang = ((systemVoices[i].lang).toLowerCase()).replace('_','-');  // make it homogeneous
    if ((cLang.search("en-us") == 0 ) ||  
        (cLang.search("en-gb") == 0 ) ||    
        (cLang.search("da-dk") == 0 ) ) {
      dlgVoiceSelect.appendChild(option);                             // fill listbox only English & danish
      //addDebugInfo(systemVoices[i].name);
    }
  }
  dlgVoiceSelect.selectedIndex = selectVoice(theSpeakerName) ;        // set selected voice
  if (dlgVoiceSelect.selectedIndex < 0 ) {
    dlgVoiceSelect.selectedIndex = 0;
  }
  // if (dlgVoiceSelect.length == 0) isVoiceSupport = false;          // not working on old PC at telefonfabrikken
}
/* ---------------------------------------------------------------------------------------------------------- */

/* Find voice index */
function selectVoice(findTheVoice) {
  //console.trace();
  let i = 0; 
  theSpeakerName = findTheVoice;
  for(i = 0; i < systemVoices.length ; i++) {
    if(systemVoices[i].name == findTheVoice)  return i;
  }  
  return 0;
}
/* ---------------------------------------------------------------------------------------------------------- */

/* speak text function */
function speakText(pText, pVoice) {
  if (!isVoiceSupport || isVoiceMute) return;
  let textMsg = new window.SpeechSynthesisUtterance(pText);     // create a utterance element
  theSpeakerName = systemVoices[Number(pVoice)].voiceURI;       // update speaker name
  setStatusInfo(wtVoice, strVoice + ": " + theSpeakerName);     // show it in the config panel
  setCookie(coVoice, theSpeakerName);                       // save it
  textMsg.voice = systemVoices[Number(pVoice)];                 // set active voice
  synthVoice.speak(textMsg);                                    // speak the text
}
/* ---------------------------------------------------------------------------------------------------------- */

/* Speak blinds */
function speakBlinds(sb, bb, voice) {
  //if (!isVoiceMute) {  
    speakText(anounceBlinds, voice);   // blinds are 
    speakText(sb,            voice);   // small blind
    speakText(bb,            voice);   // big blind 
  //}
}
/* ---------------------------------------------------------------------------------------------------------- */

/* ========================================================================================================== */

/* play sound / audio file */
function soundPlay(audio) {  
  if (!isSoundMute)  audio.play();
}
/* ---------------------------------------------------------------------------------------------------------- */

/* show / hide the config panel */
function showConfig(bAction) {
  let dispalyIt           = showIt;
  if (!bAction) dispalyIt = hideIt;
  showConfigPanel = bAction;                                                // update global panel mode  
  setStatusInfo(wtVoice,       strVoice + ": " + theSpeakerName);           // show current speaker
  setStatusInfo(wtVoiceOnOff,  strVoice);                                   // display voice
  setStatusInfo(wtMute,        strMute);                                    // display mute
  setStatusInfo(wtBreak,       strBreak);                                   // display break
  
  setStatusInfo(wtSoundPlan,   strSound + bSoundSelect);                    // show current sound schema 
  setStatusInfo(wtBlinds,      strBlindPlan + bBlindSelect);                // show current blinds schema
  setStatusInfo(wtChips,       strChips );                                  // show chips
  setStatusInfo(wtBlindsLevel, strBlind + blindsConfigFormat(blindsLevel)); // show blinds level 

  colorName  = dlgColorSelect[colorIndex].textContent;                      // get readable color name
  setStatusInfo(wtColor,       strColor + ": " + colorName);                // show color text 
   
  dlgVoice.style.visibility        = dispalyIt;   // show / hide voice dialog
  dlgVoiceOnOff.style.visibility   = dispalyIt;   // show / hide voice On/Off dialog 
  dlgBlinds.style.visibility       = dispalyIt;   // show / hide blinds dialog
  dlgBreak.style.visibility        = dispalyIt;   // show / hide break dialog
  dlgSound.style.visibility        = dispalyIt;   // show / hide sounds dialog
  dlgMute.style.visibility         = dispalyIt;   // show / hide mute dialog
  dlgChips.style.visibility        = dispalyIt;   // show / hide chips dialog
  dlgBLevelSelect.style.visibility = dispalyIt;   // show / hide current blinds
  dlgColorSelect.style.visibility  = dispalyIt;   // show / hide color select
   
  if (!isVoiceSupport) {                                 
    dlgVoice.style.visibility      = hideIt;      // hide voice dialog
    dlgVoiceOnOff.style.visibility = hideIt;      // hide voice On/Off dialog
    dlgVoiceSelect.innerHTML          = "";       // hide selector   
    setStatusInfo(wtVoice,      "");              // hide text
    setStatusInfo(wtVoiceOnOff, "");              // hide text
  }
}
/* ---------------------------------------------------------------------------------------------------------- */

/* show/hide the chip value panel */
function showChips(show) {
  if (show) { 
    wChipValues.innerHTML =     "<img class='chip' src='res/images/tWhite.png'><br>10<br>"  +
                            "<br><img class='chip' src='res/images/tRed.png'>  <br>20<br>"  +
                            "<br><img class='chip' src='res/images/tBlue.png'> <br>50<br>"  +
                            "<br><img class='chip' src='res/images/tGreen.png'><br>100<br>" +
                            "<br><img class='chip' src='res/images/tBlack.png'><br>500";
    if (bChipUpDone) {
      wChipValues.innerHTML =   "<img class='chip' src='res/images/tGreen.png'><br>100<br>" +
                            "<br><img class='chip' src='res/images/tBlack.png'><br>500<br>" +
                            "<br><img class='chip' src='res/images/tPurple.png'><br>1000";
    }
  }
  else wChipValues.innerHTML = "";

  setCookie(coChips, show);
  dlgChipsSelect.checked = show;
}
/* ---------------------------------------------------------------------------------------------------------- */

/* Set window to full screen (F11) */
function openFullscreen() {
  if (docRoot.requestFullscreen) {
    docRoot.requestFullscreen(); 
  } else if (docRoot.webkitRequestFullscreen) { // Chrome, Safari & Opera   unused
    docRoot.webkitRequestFullscreen();
  } else if (docRoot.msRequestFullscreen) {     // IE / Edge                unused
    docRoot.msRequestFullscreen();
  } else if (docRoot.mozRequestFullScreen) {    // Firefox                  unused
    docRoot.mozRequestFullScreen();
  }
}
/* ---------------------------------------------------------------------------------------------------------- */


/* exit fullscreen mode  */
function closeFullscreen() {
  if (document.fullscreen)  document.exitFullscreen(); 
}
/* ---------------------------------------------------------------------------------------------------------- * /

/* Show page page */
function showPage(page, size) {
  const urlbgColor = "?bgcolor=" + (grapCssColor('--bgColor')).replace("#", "%23");  // fix color for URL transfer
  window.open( page + urlbgColor, "", size);                                         // build the  URL
} 
/* ---------------------------------------------------------------------------------------------------------- */

/* invisible video loop (1x1 pixel)  */
function populateKeepAliveVideo() {  
  wKeepAlive.innerHTML = "";             // clear element
  wKeepAlive.src = keepAliveVideo;       // the video
  wKeepAlive.type = videoType;           // video type
  wKeepAlive.loop = true;                // let the video loop forever
  wKeepAlive.volume = 0.01;              // keep video sound low, must be > 0
  wKeepAlive.height = 1;                 // video height
  wKeepAlive.width  = 1;                 // video width
}

function populateBlindsSelector() {
  let opt = null;
  dlgBlindsSelect.innerHTML = "";                          // clear listbox - all list box in lower case
  opt = document.createElement("option");  opt.textContent  = "2860 1:40h";     dlgBlindsSelect.appendChild(opt);  
  opt = document.createElement("option");  opt.textContent  = "2860 1:40h w";   dlgBlindsSelect.appendChild(opt); 
  opt = document.createElement("option");  opt.textContent  = "2860 3:00h";     dlgBlindsSelect.appendChild(opt); 
//opt = document.createElement("option");  opt.textContent  = "Test";           dlgBlindsSelect.appendChild(opt); 
}

function populateSoundsSelector() {
  let opt = null;
  dlgSoundSelect.innerHTML = "";                          // clear listbox
  opt = document.createElement("option");  opt.textContent  = soundDefault;  dlgSoundSelect.appendChild(opt);  
  opt = document.createElement("option");  opt.textContent  = "Modern";      dlgSoundSelect.appendChild(opt);  
  opt = document.createElement("option");  opt.textContent  = "Lounge";      dlgSoundSelect.appendChild(opt);  
  opt = document.createElement("option");  opt.textContent  = "Fancy";       dlgSoundSelect.appendChild(opt);  
  opt = document.createElement("option");  opt.textContent  = "DoorBell";    dlgSoundSelect.appendChild(opt);  
}

function populateColorSelector() {
  let opt = null;
  dlgColorSelect.innerHTML = "";                          // clear listbox
  opt = document.createElement("option"); opt.textContent = "Black";  opt.value = "#000000"; dlgColorSelect.appendChild(opt);
  opt = document.createElement("option"); opt.textContent = "Blue";   opt.value = "#000080"; dlgColorSelect.appendChild(opt);  
  opt = document.createElement("option"); opt.textContent = "Green";  opt.value = "#005000"; dlgColorSelect.appendChild(opt); 
  opt = document.createElement("option"); opt.textContent = "Red";    opt.value = "#8B0000"; dlgColorSelect.appendChild(opt); 
  opt = document.createElement("option"); opt.textContent = "Indigo"; opt.value = "#390063"; dlgColorSelect.appendChild(opt); 
  dlgColorSelect.selectedIndex = colorIndex;
  colorValue = dlgColorSelect[colorIndex].value;
  changeCssColor('--bgColor', colorValue);
}

/* format the blinds for config display "level - small / big - time"  */
function blindsConfigFormat(idx) {
  let resStr = zeroPad(blindsTable[idx].level) + " - " +
               blindsTable[idx].sb + "/" + 
               blindsTable[idx].bb + " - " +
               blindsTable[idx].time + " min."; 
  if ( (blindsTable[idx].pause != 0) && isBreakEnabled )  resStr = resStr + " *";  // Add star if level is auto paused
  return resStr;
}

/* fill the blinds level selector dialog */
function populateBlinds() {
  let index = 0;
  let element = [];
  dlgBLevelSelect.innerHTML = "";                             // clear listbox
  dlgBlindsSelect.value = bBlindSelect;                       // set the dialog value 
  blindsLastLevel = loadBlinds( bBlindSelect.toLowerCase() ); // load the blinds structure
  for(element in blindsTable)
  {
   let opt = document.createElement("option");
   opt.value = index;
   opt.textContent  = blindsConfigFormat(index);
   dlgBLevelSelect.appendChild(opt);                          // then append it to the select element
   index++;
  }
}
/* -------------------------------------------------------------- */

/* Initialize the blinds structure  NOTE: blinds names in lowercase */ 
function loadBlinds(bSelector)
{
  let levelcount = 0;
  blindsTable = [];             // blinds definitions - new empty array
  // push content to the blinds table                                            Game Time
  // estimatet game time 1:40 timer  -  1500 chips
  // pause 1 = vekslepause, 2 = Pause
  /* ---------------------------------------------------------------------------------------------------------- */
  if (bSelector == "2860 1:40h".toLowerCase()) {
    blindsTable.push({level:  1, sb:   '10', bb:   '20', time: 10, pause: 0 });  // 00:10
    blindsTable.push({level:  2, sb:   '20', bb:   '40', time:  9, pause: 0 });  // 00:19
    blindsTable.push({level:  3, sb:   '30', bb:   '60', time:  9, pause: 0 });  // 00:28
    blindsTable.push({level:  4, sb:   '50', bb:  '100', time:  9, pause: 0 });  // 00:37
    blindsTable.push({level:  5, sb:  '100', bb:  '200', time:  9, pause: 1 });  // 00:46     veksling til 100 og 500 chips
    blindsTable.push({level:  6, sb:  '200', bb:  '400', time:  9, pause: 0 });  // 00:55
    blindsTable.push({level:  7, sb:  '300', bb:  '600', time:  9, pause: 0 });  // 01:04
    blindsTable.push({level:  8, sb:  '500', bb: '1000', time:  9, pause: 0 });  // 01:13
    blindsTable.push({level:  9, sb:  '700', bb: '1400', time:  9, pause: 0 });  // 01:22
    blindsTable.push({level: 10, sb: '1000', bb: '2000', time:  8, pause: 0 });  // 01:30
    blindsTable.push({level: 11, sb: '1500', bb: '3000', time:  8, pause: 0 });  // 01:38
    blindsTable.push({level: 12, sb: '2000', bb: '4000', time:  8, pause: 0 });  // 01:48
    blindsTable.push({level: 13, sb: '3000', bb: '6000', time:  8, pause: 0 });  // 01:54
    blindsTable.push({level: 14, sb: '5000', bb:'10000', time:  8, pause: 0 });  // 02:02
    blindsTable.push({level: 15, sb: '7000', bb:'14000', time:  8, pause: 0 });  // 02:10
    blindsTable.push({level: 16, sb:'10000', bb:'20000', time:  8, pause: 0 });  // 02:18
    blindsTable.push({level: 17, sb:'20000', bb:'40000', time: 90, pause: 0 });  // Game over
  }
  /* ---------------------------------------------------------------------------------------------------------- */

  // estimatet game time 1:40 timer  -  2500 chips  Onsdag
  /* ---------------------------------------------------------------------------------------------------------- */
  if (bSelector == "2860 1:40h w".toLowerCase()) {
    blindsTable.push({level:  1, sb:    '10', bb:    '20', time: 12, pause: 0 });  // 00:12 
    blindsTable.push({level:  2, sb:    '20', bb:    '40', time: 10, pause: 0 });  // 00:22 
    blindsTable.push({level:  3, sb:    '30', bb:    '60', time: 10, pause: 0 });  // 00:32 
    blindsTable.push({level:  4, sb:    '50', bb:   '100', time: 10, pause: 0 });  // 00:42 
    blindsTable.push({level:  5, sb:   '100', bb:   '200', time:  9, pause: 1 });  // 00:51    veksling til 100 og 500 chips
    blindsTable.push({level:  6, sb:   '200', bb:   '400', time:  9, pause: 0 });  // 01:00 
    blindsTable.push({level:  7, sb:   '300', bb:   '600', time:  9, pause: 0 });  // 01:09 
    blindsTable.push({level:  8, sb:   '500', bb:  '1000', time:  9, pause: 0 });  // 01:18 
    blindsTable.push({level:  9, sb:  '1000', bb:  '2000', time:  9, pause: 0 });  // 01:27 
    blindsTable.push({level: 10, sb:  '1500', bb:  '3000', time:  8, pause: 0 });  // 01:35 
    blindsTable.push({level: 11, sb:  '2000', bb:  '4000', time:  8, pause: 0 });  // 01:43 
    blindsTable.push({level: 12, sb:  '3000', bb:  '6000', time:  8, pause: 0 });  // 01:51 
    blindsTable.push({level: 13, sb:  '5000', bb: '10000', time:  8, pause: 0 });  // 01:59 
    blindsTable.push({level: 14, sb: '10000', bb: '20000', time:  8, pause: 0 });  // 02:07
    blindsTable.push({level: 15, sb: '15000', bb: '30000', time: 90, pause: 0 });  // Game over
  }
  /* ---------------------------------------------------------------------------------------------------------- */


  // estimatet game time 3 timer - 1500 chips  hvidovre
  /* ---------------------------------------------------------------------------------------------------------- */
  if (bSelector == "2860 3:00h".toLowerCase()) {
    blindsTable.push({level:   1, sb:    '10', bb:    '20', time:  12, pause: 0 });  // 00:12 
    blindsTable.push({level:   2, sb:    '20', bb:    '40', time:  12, pause: 0 });  // 00:24 
    blindsTable.push({level:   3, sb:    '30', bb:    '60', time:  12, pause: 0 });  // 00:36 
    blindsTable.push({level:   4, sb:    '40', bb:    '80', time:  12, pause: 0 });  // 00:48 
    blindsTable.push({level:   5, sb:    '50', bb:   '100', time:  12, pause: 0 });  // 01:00 
    blindsTable.push({level:   6, sb:    '60', bb:   '120', time:  12, pause: 0 });  // 01:12 
    blindsTable.push({level:   7, sb:    '80', bb:   '160', time:  12, pause: 0 });  // 01:24 
    blindsTable.push({level:   8, sb:   '100', bb:   '200', time:  12, pause: 1 });  // 01:36 veksling til 100 og 500 chips
    blindsTable.push({level:   9, sb:   '200', bb:   '400', time:  12, pause: 0 });  // 01:48  
    blindsTable.push({level:  10, sb:   '300', bb:   '600', time:  12, pause: 0 });  // 02:00 
    blindsTable.push({level:  11, sb:   '500', bb:  '1000', time:  10, pause: 0 });  // 02:10 
    blindsTable.push({level:  12, sb:   '600', bb:  '1200', time:  10, pause: 0 });  // 02:20 
    blindsTable.push({level:  13, sb:   '700', bb:  '1400', time:  10, pause: 0 });  // 02:30 
    blindsTable.push({level:  14, sb:   '800', bb:  '1600', time:  10, pause: 0 });  // 02:40 
    blindsTable.push({level:  15, sb:  '1000', bb:  '2000', time:  10, pause: 0 });  // 02:50 
    blindsTable.push({level:  16, sb:  '1500', bb:  '3000', time:  10, pause: 0 });  // 03:00 
    blindsTable.push({level:  17, sb:  '2000', bb:  '4000', time:  10, pause: 0 });  // 03:10 
    blindsTable.push({level:  18, sb:  '3000', bb:  '6000', time:  10, pause: 0 });  // 03:20 
    blindsTable.push({level:  19, sb:  '5000', bb: '10000', time:  10, pause: 0 });  // 03:30 
    blindsTable.push({level:  20, sb: '10000', bb: '20000', time:  60, pause: 0 });  // Game over
  }

  /* ---------------------------------------------------------------------------------------------------------- */
  if (bSelector == "Test".toLowerCase() || (paramBlinds != null)) {
    blindsTable = [];             // blinds definitions - new empty array
    blindsTable.push({level:  1,  sb:   '110', bb:   '220', time: 2, pause: 0 });     
    blindsTable.push({level:  2,  sb:   '210', bb:   '420', time: 2, pause: 1 });      // veksle pause
    blindsTable.push({level:  3,  sb:   '610', bb:  '1220', time: 2, pause: 2 });      // pause
    blindsTable.push({level:  4,  sb: '10100', bb: '20200', time: 2, pause: 0 });      
  }
  /* ---------------------------------------------------------------------------------------------------------- */
  
  levelcount = blindsTable.length - 1;     // level count 
  if (levelcount < 0 ) {
    wTitle.innerHTML  = "Ukendt blinds struktur " +  bSelector + "'";
    blindsTable.push({level:   1, sb:   '100', bb:    '200', time:  180});    // 3 hour  100/200
    levelcount = blindsTable.length - 1;     // level count 
  }
  return levelcount;
}
/* ------------------------------------------------------------------------------------------------------------ */

/* ============================================================================================================ */
