const productOverlay = document.getElementById("productOverlay");
const closeProductOverlayBtn = document.getElementById("closeProductOverlay");
const dishesContainer = document.getElementById("dishesContainer");
const catagorySlider = document.getElementById("catagorySlider");
const modelViewerElement = document.querySelector("model-viewer");
const productName = document.querySelector(".product-name");
const productPrice = document.querySelector(".product-price");
const productDesc = document.querySelector(".product-description");
let productCartOption = document.querySelector("#productOverlay .cart-options");
const cartBtn = document.getElementById("cartBtn");
let currentCatagory;


function constructProduct(dish) {
    const dishContainer = document.createElement("div");
    dishContainer.className = "dish flex";
    dishContainer.id = dish._id;
    dishContainer.addEventListener("click", (e) => {
        // toggleProduct(dish, dish.productIndex, cartOption);
        // productOverlay.classList.toggle("hidden");
        const pageIndex = 0; // for list view menu
        // TODO: fix bugs
        app.showProductInformation(dish,pageIndex);
    })

    const left = document.createElement("div")
    left.className = "left flex"

    const veg_nonveg = document.createElement("img")
    veg_nonveg.src = "assets/img/icons/unicons/veg.jpg"
    veg_nonveg.className = "veg_non-veg"

    const name = document.createElement("h4")
    name.className = "dish-name"
    name.textContent = dish.name

    const price = document.createElement("span")
    price.className = "dish-price"
    price.textContent = currencySymbol+" " + dish.price

    const desc = document.createElement("span")
    desc.className = "dish-description ellipsis"
    desc.textContent = dish.description

    left.appendChild(veg_nonveg)
    left.appendChild(name)
    left.appendChild(price)
    left.appendChild(desc)

    const right = document.createElement("dic")
    right.className = "right"

    const img = document.createElement("img")
    img.src = dish.image
    img.className = "dish-image"

    let cartOption = constructCartOptions(dish)

    right.appendChild(img)
    right.appendChild(cartOption)

    dishContainer.appendChild(left)
    dishContainer.appendChild(right)
    return dishContainer
}

function constructCartOptions(dish, forProductOverlay) {
    let cartOption = document.createElement("div")
    cartOption.addEventListener("click", (e) => { e.stopPropagation() })
    cartOption.className = "cart-options"
    if (dish.quantity !== 0) {
        const minus = document.createElement("i")
        minus.className = "bx bx-minus minus"
        minus.addEventListener("click", (e) => {
            e.stopPropagation()
            dish.quantity = decrementItem(dish.productIndex)
            if (dish.quantity === 0) {
                toggleCartOption(dish, forProductOverlay)
            } else {
                updateItemCount(dish.quantity, dish.productIndex, forProductOverlay)
            }
        })

        const count = document.createElement("span")
        count.addEventListener("click", (e) => { e.stopPropagation() })
        count.className = "count"
        count.textContent = dish.quantity

        const plus = document.createElement("i")
        plus.className = "bx bx-plus plus"
        plus.addEventListener("click", (e) => {
            e.stopPropagation()
            dish.quantity = incrementItem(dish.productIndex)
            updateItemCount(dish.quantity, dish.productIndex, forProductOverlay)
        })

        cartOption.appendChild(minus)
        cartOption.appendChild(count)
        cartOption.appendChild(plus)
    } else {
        cartOption.className = "cart-options add"
        cartOption.textContent = "Add +"
        cartOption.addEventListener("click", (e) => {
            dish.quantity = incrementItem(dish.productIndex)
            toggleCartOption(dish, forProductOverlay)
        })
    }
    return cartOption
}

function displayCatagorySlider(catagories) {
    for (let i = 0; i < catagories.length; i++) {
        // if(i > 3) continue
        const elm = document.createElement("span")
        elm.textContent = catagories[i].charAt(0).toUpperCase() + catagories[i].slice(1)
        elm.id = catagories[i]
        if (i === 0) {
            elm.className = "active"
            currentCatagory = elm
        }
        elm.addEventListener("click", function () {
            if (!this.className.includes("active")) {
                this.classList.add("active")
                currentCatagory.classList.remove("active")
            }
            currentCatagory = this
            const dish = app.catagorisedProducts[this.id][0];
            scrollToElm(document.getElementById(dish._id))
        })
        catagorySlider.appendChild(elm)
    }
}

function updateItemCount(count, index, forProductOverlay) {
    const elm = dishesContainer.children[index].children[1].children[1].children[1]
    elm.textContent = count
    if (forProductOverlay) productCartOption.children[1].textContent = count;
}

function toggleCartOption(dish, toggleInProductOverlay) {
    let cartOption = constructCartOptions(dish)
    const elm = dishesContainer.children[dish.productIndex].children[1]
    elm.removeChild(elm.children[1])
    elm.appendChild(cartOption)
    if (toggleInProductOverlay) {
        let elm = document.querySelectorAll(".other-information .product-options")[0];
        elm.innerHTML = "";
        let cartOption = constructCartOptions(dish, true)
        elm.appendChild(cartOption)
        productCartOption = cartOption
    }
    //* Toggles Cart Btn Accordingly
    toggleCartBtn()
}

function toggleProduct(dish) {
    modelViewerElement.src = dish.model3d
    productName.textContent = dish.name
    productPrice.textContent = dish.price
    productDesc.textContent = dish.description
    const elm = productCartOption.parentNode
    elm.removeChild(productCartOption)
    productCartOption = constructCartOptions(dish, true)
    elm.appendChild(productCartOption)
}

function incrementItem(productIndex) {
    // const product = findProductById(id)
    app.products[productIndex].quantity += 1
    if (app.products[productIndex].quantity == 1) {
        app.cart.push(app.products[productIndex])
    }
    app.saveCart().then(() => {});
    return app.products[productIndex].quantity;
}

function decrementItem(productIndex) {
    // const product = findProductById(id)
    app.products[productIndex].quantity -= 1
    if (app.products[productIndex].quantity <= 0) {
        // Double check for negative value
        app.products[productIndex].quantity = 0;
        const indexInCart = app.findInCart(app.products[productIndex]._id)
        if (indexInCart !== false) {
            app.cart.splice(indexInCart, 1)
        }
    }
    app.saveCart().then(() => {})
    return app.products[productIndex].quantity
}

function scrollToElm(elm) {
    // window.scrollBy({ left: 0, top: elm.top - parseInt(dishesContainer.style.marginTop), behavior: "smooth" })
    window.scrollTo({ left: 0, top: elm.offsetTop - 120, behavior: "smooth" })
}

function toggleCartBtn() {
    if (app.cart.length == 0 && !cartBtn.className.includes("hidden") || app.cart.length >= 1 && cartBtn.className.includes("hidden")) {
        cartBtn.classList.toggle("hidden")
    }
}
// Event Handlers
closeProductOverlayBtn.addEventListener("click", () => {
    productOverlay.classList.toggle("hidden")
})

// Initiator
const initiator = () => {
    // Most work done already by app.init();
    if(app.cart.length === 0 && !(app.cartPageBtn.className.includes("hidden"))){
        cartBtn.classList.toggle("hidden")
    }
    toggleCartBtn()
    displayCatagorySlider(app.productCatagories)
    for(product of app.products){
        let product_elm = constructProduct(product);
        dishesContainer.appendChild(product_elm)
    }
    app.hideLoader()

    return;
    fetchCart().then(() => {
        toggleCartBtn()
        // Display products from Datatbase
        fetchProducts().then(() => {
            displayCatagorySlider(app.productCatagories)
            for (let i = 0; i < dishes.length; i++) {
                // set product Index
                if (!app.products[i].quantity) app.products[i].quantity = 0
                // Check for the each product to be already in cart or not
                let dish = findItemInCart(app.products[i]._id)
                if (dish) {
                    app.products[i].quantity = dish.quantity
                }
                let product = constructProduct(app.products[i], i)
                //setup-right-here
                dishesContainer.appendChild(product)
            }
        })

        app.hideLoader()
    })
}

// display
