const cartParent = document.querySelector(".orders")



function constructOrder(dish,index){
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
    name.textContent = dish.name
    const price = document.createElement("p")
    price.className = "price"
    price.textContent = "$"+dish.price

    center.append(name)
    center.append(price)

    const right = document.createElement("div")
    right.className = "right"

    let cartOption = document.createElement("div")
    cartOption.className = "cart-options"

    const minus = document.createElement("i")
    minus.className = "bx bx-minus minus"
    minus.addEventListener("click",(e)=>{
        decrementItem(index)
        if(dish.quantity === 0){
            cart.splice()
        }else{
            updateItemCount(cart[index],index)
        }
    })

    const count = document.createElement("span")
    count.className = "count"
    count.textContent = dish.quantity

    const plus = document.createElement("i")
    plus.className = "bx bx-plus plus"
    plus.addEventListener("click",(e)=>{
        incrementItem(index)
        updateItemCount(cart[index],index)
    })

    cartOption.appendChild(minus)
    cartOption.appendChild(count)
    cartOption.appendChild(plus)

    const total = document.createElement("p")
    total.className = "price"
    total.textContent = "$"+(dish.price * dish.quantity)

    right.appendChild(cartOption)
    right.appendChild(total)

    order.appendChild(left)
    order.appendChild(center)
    order.appendChild(right)

    return order
}

function incrementItem(index){
    cart[index].quantity += 1
    saveCart(true)
}

function decrementItem(index){
    cart[index].quantity -= 1
    if(cart[index].quantity == 0){
        cart.splice(index,1)
        displayCart()
    }

    saveCart(true)
}

function updateItemCount(dish,index){
    const elm = cartParent.children[index+1].children[2].children[0].children[1]
    elm.textContent = dish.quantity
    elm.parentElement.nextSibling.textContent = "$"+(dish.price * dish.quantity)
}

function displayCart(){
    if(cartParent.children.length > 1){
        cartParent.innerHTML = '<div class="box-title"><h4>Your Order</h4></div>'
    }
    if(cart.length == 0){
        alert("Cart Empty")
    }
    for(let i = 0;i < cart.length;i ++){
        let order = constructOrder(cart[i],i)
        cartParent.appendChild(order)
    }
}
displayCart()

