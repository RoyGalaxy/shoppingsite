"use strict";

const menuOpen = document.querySelectorAll(".head-lft__btn");
const menu = document.querySelectorAll(".head-nav");
const menuBtnImg = document.querySelectorAll(".head-lft__btn-img");

const bodyOverlay = document.querySelectorAll(".body-wrapper");
const body = document.querySelector("body");

const headerCart = document.querySelectorAll(".head-rgt");

/* Eventlisteners related to cart and items adding */
let nextImg = 0,
  noOfItems = 0,
  clicked,
  trasitionTimer;

// let cartItems = JSON.parse(localStorage.cartItems) || []

const minQuery = window.matchMedia("(min-width: 850px)"),
  maxQuery = window.matchMedia("(max-width: 850px)");

/*//////////////////////
 Functions 
 /////////////////////*/
/*Function to stop transition animation from triggering when page resize and reloading  */
function transitionDelay() {
  body.classList.add("preload");
  clearTimeout(trasitionTimer);
  trasitionTimer = setTimeout(() => {
    body.classList.remove("preload");
  }, 1000);
}


/* Function to close navigation menu */
function closeMenu() {
  menu.forEach(item => {item.classList.remove(".open-menu");})
  body.style.overflow = "visible";
  bodyOverlay.forEach(elm => elm.classList.remove("open-overlay"));
  menuBtnImg.forEach(elm => elm.src = "product-page/images/icon-menu.svg");
}

/* Function to open navigation menu */

function openMenu() {
  menu.forEach(item => {item.classList.add(".open-menu");})
  menuBtnImg.forEach(elm => elm.src = "product-page/images/icon-close.svg");
  body.style.overflow = "hidden";
  bodyOverlay.forEach(elm => elm.classList.add("open-overlay"));
}

/*//////////////////////
 Event Listeners 
 /////////////////////*/

/*  Eventlistener to close and open cart   */


/*  Eventlistener to increase and decrease no. of items   */

// class Counter{
//   constructor(initialCount){
//     this.counter = (initialCount) ? initialCount : 0
//   }
//   display(){
//     return this.counter
//   }
//   setCount(count){
//     this.counter = count
//   }
// }

/*  Eventlistener for add to cart button  */

/*  Eventlistener to open overlay image modal   */

/*  Eventlistener to close overlay image modal   */

/*  Eventlistener for overlay image modal btn to change overlay image same as button image  */

/*  Eventlistener for  image to change when image button is clicked  */

/* Menu eventlisteners */
/*  Eventlistener to open menu / navigation  */
menuOpen.forEach(item => item.addEventListener("click", function () {
  menu.forEach(menuElm => {
    menuElm.classList.toggle("open-menu")
    if (menuElm.classList.contains("open-menu")) {
      openMenu();
    } else {
      closeMenu();
    }
  })
}));

/*  Eventlistener to stop transition animation from triggering when page resize */
window.addEventListener("resize", function () {
  transitionDelay();

  if (minQuery.matches) closeMenu();
});

/*  Eventlistener to stop transition animation from triggering when page reloading  */
window.addEventListener("load", function () {
  transitionDelay();
});
