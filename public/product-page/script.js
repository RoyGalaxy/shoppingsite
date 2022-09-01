"use strict";

const imgBtn = Array.from(document.querySelectorAll(".img-btn"));
const img = document.querySelector(".img-main");
const mainImgBtns = Array.from(document.querySelectorAll(".img-main__btn"));

const overlayCon = document.querySelector(".overlay-container");
const overlayImg = document.querySelector(".item-overlay__img");
const overlayImgBtn = Array.from(
  document.querySelectorAll(".overlay-img__btn")
);
const overlayBtnImgs = Array.from(
  document.querySelectorAll(".overlay-img__btn-img")
);
const overlayCloseBtn = document.querySelector(".item-overlay__btn ");
const overlayBtns = Array.from(document.querySelectorAll(".overlay-btn"));

const addToCart = document.querySelector(".price-cart__btn");
const priceSingle = document.querySelectorAll(".head-cart__price-single");
const priceTotal = document.querySelectorAll(".head-cart__price-total");

const priceBtns = Array.from(document.querySelectorAll(".price-btn__img"));
const totalItems = document.querySelector(".price-btn__txt");

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

let cartItems = []

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

/* Function to get next and previous images*/
function imgBtns(btns, img, imgName) {
  btns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      if (e.target.classList.contains(`${imgName}__btnlft-img`)) {
        if (nextImg <= 0) nextImg = 3;
        else nextImg--;

        img.src = `product-page/images/image-product-${nextImg + 1}.jpg`;
      }

      if (e.target.classList.contains(`${imgName}__btnrgt-img`)) {
        if (nextImg >= 3) nextImg = 0;
        else nextImg++;

        img.src = `product-page/images/image-product-${nextImg + 1}.jpg`;
      }
    });
  });
}

imgBtns(overlayBtns, overlayImg, "item-overlay");
imgBtns(mainImgBtns, img, "img-main");

/* Function to show single and total items price in the cart  */
function productPrice(items) {
  totalItems.textContent = items;
  priceTotal.forEach(elm => elm.textContent = `$${125 * items}`);
  if (items >= 1) {
    headerCart.forEach(elm => elm.setAttribute("data-content", `${items}`));
    headerCart.forEach(elm => elm.style.setProperty("--display", `block`));
  } else {
    headerCart.forEach(elm => elm.style.setProperty("--display", `none`));
  }
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
priceBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    clicked = false;
    if (e.target.classList.contains("price-btn__add-img")) {
      if (noOfItems >= 10) return;
      noOfItems++;
      productPrice(noOfItems);
    } else if (e.target.classList.contains("price-btn__remove-img")) {
      if (noOfItems <= 0) return;
      noOfItems--;
      productPrice(noOfItems);
    }
  });
});

/*  Eventlistener for add to cart button  */
addToCart.addEventListener("click", function (e) {
  clicked = true;
  foodItems.forEach(element => {
    if(element.name == addToCart.id){
      cartItems.push({
        name: element.name,
        price: element.price,
        qty: noOfItems,
        img: 'images/biryani/Ambur-Chicken-Biryani.jpg'
      })
    }
  })
});

/*  Eventlistener to open overlay image modal   */
img.addEventListener("click", function () {
    overlayCon.style.display = "block";
});

/*  Eventlistener to close overlay image modal   */
overlayCloseBtn.addEventListener("click", function () {
    overlayCon.style.display = "none";
});

/*  Eventlistener for overlay image modal btn to change overlay image same as button image  */
overlayImgBtn.forEach((btn, i) => {
  btn.addEventListener("click", function (e) {
    overlayImg.src = `product-page/images/image-product-${i + 1}.jpg`;
    nextImg = e.target.dataset.img;
  });
});

/*  Eventlistener for  image to change when image button is clicked  */
imgBtn.forEach((btn, i) => {
  btn.addEventListener("click", function () {
    img.src = `product-page/images/image-product-${i + 1}.jpg`;
  });
});

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

  if (maxQuery.matches) overlayCon.style.display = "none";

  if (minQuery.matches) closeMenu();
});

/*  Eventlistener to stop transition animation from triggering when page reloading  */
window.addEventListener("load", function () {
  transitionDelay();
});
