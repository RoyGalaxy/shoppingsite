const productOverlay = document.getElementById("productOverlay")
const closeProductOverlayBtn = document.getElementById("closeProductOverlay")
const dishesContainer = document.getElementById("dishesContainer")
const catagorySlider = document.getElementById("catagorySlider")
const modelViewer = document.querySelector("model-viewer")
const productName = document.querySelector(".product-name")
const productPrice = document.querySelector(".product-price")
const productDesc = document.querySelector(".product-description")
let productCartOption = document.querySelector("#productOverlay .cart-options")
const cartBtn = document.getElementById("cartBtn")
let currentCatagory;
let catagories = []


function constructProduct(dish, index) {
    const dishContainer = document.createElement("div")
    dishContainer.className = "dish flex"
    dishContainer.id = dish._id
    dishContainer.addEventListener("click", (e) => {
        toggleProduct(dish, index, cartOption)
        productOverlay.classList.toggle("hide")
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
    price.textContent = "$" + dish.price

    const desc = document.createElement("span")
    desc.className = "dish-description"
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

    let cartOption = constructCartOptions(dish, index)

    right.appendChild(img)
    right.appendChild(cartOption)

    dishContainer.appendChild(left)
    dishContainer.appendChild(right)
    return dishContainer
}

function constructCartOptions(dish, index, forProductOverlay) {
    let cartOption = document.createElement("div")
    cartOption.addEventListener("click", (e) => { e.stopPropagation() })
    cartOption.className = "cart-options"
    if (dish.quantity !== 0) {
        const minus = document.createElement("i")
        minus.className = "bx bx-minus minus"
        minus.addEventListener("click", (e) => {
            e.stopPropagation()
            dish.quantity = decrementItem(dish._id)
            if (dish.quantity === 0) {
                toggleCartOption(dish, index, forProductOverlay)
            } else {
                updateItemCount(dish.quantity, index, forProductOverlay)
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
            dish.quantity = incrementItem(dish._id)
            updateItemCount(dish.quantity, index, forProductOverlay)
        })

        cartOption.appendChild(minus)
        cartOption.appendChild(count)
        cartOption.appendChild(plus)
    } else {
        cartOption.className = "cart-options add"
        cartOption.textContent = "Add +"
        cartOption.addEventListener("click", (e) => {
            e.stopPropagation()
            dish.quantity = incrementItem(dish._id)
            toggleCartOption(dish, index, forProductOverlay)
        })
    }
    return cartOption
}

function displayCatagorySlider() {
    for (let i = 0; i < catagories.length; i++) {
        const elm = document.createElement("span")
        elm.textContent = catagories[i].charAt(0).toUpperCase() + catagories[i].slice(1)
        elm.id = catagories[i]
        if (i === 0) {
            elm.className = "active"
            currentCatagory = elm
        }
        elm.addEventListener("click", function () {
            if (this.className.includes("active")) return
            this.classList.add("active")
            currentCatagory.classList.remove("active")
            currentCatagory = this
            const dish = findInCatagory(this.id)[0]
            scrollToElm(document.getElementById(dish._id))
        })
        catagorySlider.appendChild(elm)
    }
}

function findInCatagory(catagory){
    let newDishes = dishes.filter((item,index) => {
        return item.category.toLowerCase() == catagory
    });
    return newDishes
}

function updateItemCount(count, index, forProductOverlay) {
    const elm = dishesContainer.children[index].children[1].children[1].children[1]
    elm.textContent = count
    if (forProductOverlay) productCartOption.children[1].textContent = count;
}

function toggleCartOption(dish, index, toggleInProductOverlay) {
    let cartOption = constructCartOptions(dish, index)
    const elm = dishesContainer.children[index].children[1]
    elm.removeChild(elm.children[1])
    elm.appendChild(cartOption)
    if (toggleInProductOverlay) {
        let elm = productCartOption.parentNode
        elm.removeChild(elm.children[0])
        let cartOption = constructCartOptions(dish, index, true)
        elm.appendChild(cartOption)
        productCartOption = cartOption
    }
    //* Toggles Cart Btn Accordingly
    toggleCartBtn()
}

function toggleProduct(dish, index) {
    modelViewer.src = dish.model3d
    productName.textContent = dish.name
    productPrice.textContent = dish.price
    productDesc.textContent = dish.description
    const elm = productCartOption.parentNode
    elm.removeChild(productCartOption)
    productCartOption = constructCartOptions(dish, index, true)
    elm.appendChild(productCartOption)
}

function incrementItem(id) {
    const product = findProductById(id)
    product.quantity += 1
    saveCart()
    return product.quantity
}

function decrementItem(id) {
    const product = findProductById(id)
    product.quantity -= 1
    saveCart()
    return product.quantity
}

function scrollToElm(elm) {
    // window.scrollBy({ left: 0, top: elm.top - parseInt(dishesContainer.style.marginTop), behavior: "smooth" })
    console.log(elm.offsetTop - 120)
    window.scrollTo({left: 0, top: elm.offsetTop - 120, behavior: "smooth"})
}
// Event Handlers
closeProductOverlayBtn.addEventListener("click", () => {
    productOverlay.classList.toggle("hide")
})
function toggleCartBtn() {
    if (cart.products.length == 0 && !cartBtn.className.includes("hide") || cart.products.length >= 1 && cartBtn.className.includes("hide")) {
        cartBtn.classList.toggle("hide")
    }
}
fetchCart().then(() => {
    toggleCartBtn()
    // Display products from Datatbase
    fetchProducts().then(() => {
        // Filter out Distinct catagories out of dish
        catagories = [...new Set(dishes.map(item => item.category.trim().toLowerCase()))];
        displayCatagorySlider()
        for (let i = 0; i < dishes.length; i++) {
            if (!dishes[i].quantity) dishes[i].quantity = 0
            // Check for the each product to be already in cart or not
            let dish = findItemInCart(dishes[i]._id)
            if (dish) {
                dishes[i].quantity = dish.quantity
            }
            let product = constructProduct(dishes[i], i)
            dishesContainer.appendChild(product)
        }
    })
})
