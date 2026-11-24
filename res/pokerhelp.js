/* ----------------------------------------------------------------------------------------------------------
 2860Poker.dk - online help
   SMP  05-09-2026   ver. 3.60                           
------------------------------------------------------------------------------------------------------------- */ 
"use strict";    // keep god coding habits

const urlParams     = new URLSearchParams(window.location.search); // URL Params break up the URL querystring 
const parambgColor  = urlParams.get('bgcolor');                    // get background color

setbgColor(parambgColor);                                          // call this on page load

/* adopt timers bbackground color */
function setbgColor(bgColor ) {
  if (bgColor != null) document.querySelector(':root').style.setProperty('--bgColor', bgColor); // set the bg color
} 
/*------------------------------------------------------------------------------------------------------------- */ 
