/* ----------------------------------------------------------------------------------------------------------
 2860Poker.dk
   SMP  09-09-2026  ver. 3.60                       
------------------------------------------------------------------------------------------------------------- */ 
"use strict";    // keep god coding habits

const urlParams     = new URLSearchParams(window.location.search); // URL Params break up the URL querystring 
const parambgColor  = urlParams.get('bgcolor');                    // get background color

const cGameTime     = "GameTime";                                   // cookie name 
const wstatistics   = document.getElementById('statistics');     
const allGameTimes  = getCookie(cGameTime);   
const dataRaw       = replaceAll(allGameTimes, "\r\n", ";");
const dataArr       = dataRaw.split(";");

let dispaly = "";

setbgColor(parambgColor);                                          // call this on page load

dataArr.forEach(showIt);          // display all lines
wstatistics.innerHTML = dispaly;

/* ---------------------------------------------------------------------------------------------------------- */

function getCookie(cName) {
  if (localStorage.getItem(cName) == "undefined" ) return "";
  return (localStorage.getItem(cName)) ? localStorage.getItem(cName) : "";
}
/* ---------------------------------------------------------------------------------------------------------- */

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}
/* ---------------------------------------------------------------------------------------------------------- */

function showIt(item, index) {
   dispaly += item + "<br>"; 
}


/* adopt timers bbackground color */
function setbgColor(bgColor ) {
  if (bgColor != null) document.querySelector(':root').style.setProperty('--bgColor', bgColor)     // set the bg color
  else                 document.querySelector(':root').style.setProperty('--bgColor', "#000000");  // set the bg color
} 
/*------------------------------------------------------------------------------------------------------------- */ 
