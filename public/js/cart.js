const cartParent = document.querySelector(".orders")
const summaryElm = document.getElementById("billSummary")

function constructOrder(dish, index) {
    const product = findProductById(dish.productId)
    cart.products[index] = Object.assign(cart.products[index], product)
    const order = document.createElement("div")
    order.className = "order"

    const left = document.createElement("div")
    left.className = "left"

    const img = document.createElement("img")
    img.src = "assets/img/icons/unicons/veg.jpg"
    img.className = "veg_non-veg"

    left.appendChild(img)

    const center = document.createElement("div")
    center.className = "center"

    const name = document.createElement("span")
    name.className = "item-name"
    name.textContent = cart.products[index].name
    const price = document.createElement("p")
    price.className = "price"
    price.textContent = currencySymbol+" " + cart.products[index].price

    center.append(name)
    center.append(price)

    const right = document.createElement("div")
    right.className = "right"

    let cartOption = document.createElement("div")
    cartOption.className = "cart-options"

    const minus = document.createElement("i")
    minus.className = "bx bx-minus minus"
    minus.addEventListener("click", (e) => {
        decrementItem(index)
        if (cart.products[index].quantity === 0) {
            cart.products.splice(index, 1)
        } else {
            updateItemCount(cart.products[index], index)
        }
    })

    const count = document.createElement("span")
    count.className = "count"
    count.textContent = cart.products[index].quantity

    const plus = document.createElement("i")
    plus.className = "bx bx-plus plus"
    plus.addEventListener("click", (e) => {
        incrementItem(index)
        updateItemCount(cart.products[index], index)
    })

    cartOption.appendChild(minus)
    cartOption.appendChild(count)
    cartOption.appendChild(plus)

    const total = document.createElement("p")
    total.className = "price"
    total.textContent = currencySymbol+" " + (cart.products[index].price * cart.products[index].quantity)

    right.appendChild(cartOption)
    right.appendChild(total)

    order.appendChild(left)
    order.appendChild(center)
    order.appendChild(right)

    return order
}

function Item(index) {
    cart.products[index].quantity += 1
    saveCart(true)
}

function decrementItem(index) {
    cart.products[index].quantity -= 1
    if (cart.products[index].quantity == 0) {
        cart.products.splice(index, 1)
        displayCart()
        displayBillSummary()
    }

    saveCart(true)
}

function updateItemCount(dish, index) {
    const elm = cartParent.children[index + 1].children[2].children[0].children[1]
    elm.textContent = dish.quantity
    elm.parentElement.nextSibling.textContent = currencySymbol+" " + (dish.price * dish.quantity)
    displayBillSummary()
}

function calculateCartTotal(){
    let total = 0;
    for(let i = 0;i < cart.products.length; i++){
        total += cart.products[i].price * cart.products[i].quantity
    }
    return total
}

function displayCart() {
    if (cartParent.children.length > 1) {
        cartParent.innerHTML = '<div class="box-title"><h4>Your Order</h4></div>'
    }
    if (cart.products.length == 0) {
        alert("Cart Empty")
    }
    for (let i = 0; i < cart.products.length; i++) {
        let order = constructOrder(cart.products[i], i)
        cartParent.appendChild(order)
    }
}

function displayBillSummary() {
    summaryElm.innerHTML = ""
    const titleElm = document.createElement("div")
    titleElm.className = "box-title"

    const titleText = document.createElement("h4")
    titleText.textContent = "Bill Summary"
    titleElm.appendChild(titleText)

    const totalElm = document.createElement("div")
    totalElm.className = "item-total"

    const totalText = document.createElement("span")
    totalText.textContent = "Item total"
    totalElm.appendChild(totalText)

    const totalAmount = document.createElement("span")
    const cartTotal = calculateCartTotal()
    totalAmount.textContent = currencySymbol+" "+cartTotal
    totalElm.appendChild(totalAmount)

    const extraChargesElm = document.createElement("div")
    extraChargesElm.className = "extra-charges"

    const extraChargesText = document.createElement("span")
    extraChargesText.textContent = "Delivery Charges"
    extraChargesElm.appendChild(extraChargesText)

    const extraChargeTotal = document.createElement("span")
    extraChargeTotal.textContent = currencySymbol+" " + deliveryCharge
    extraChargesElm.appendChild(extraChargeTotal)

    const grandTotalElm = document.createElement("div")
    grandTotalElm.className = "grand-total"

    const grandTotalText = document.createElement("span")
    grandTotalText.textContent = "Grand Total"
    grandTotalElm.appendChild(grandTotalText)

    const grandTotalAmount = document.createElement("span")
    grandTotalAmount.textContent = currencySymbol+" " + (deliveryCharge + cartTotal)
    grandTotalElm.appendChild(grandTotalAmount)

    summaryElm.appendChild(titleElm)
    summaryElm.appendChild(totalElm)
    summaryElm.appendChild(extraChargesElm)
    summaryElm.appendChild(grandTotalElm)
}

/*
<div class="box-title"><h4>Bill Summary</h4></div>
<div class="item-total"><span>Item total</span><span>₹500</span></div>
<div class="extra-charges"><span>delivery-charges</span><span>₹19</span></div>
<div class="grand-total"><span>Grand Total</span><span>₹574</span></div>
*/

// Initiator
window.onload = () => {
    loader = document.querySelector(".loader")
    fetchCart().then(() => {
        fetchProducts().then(() => {
            displayCart()
            displayBillSummary()
        })
    })
    setTimeout(hideLoader,500)
}

