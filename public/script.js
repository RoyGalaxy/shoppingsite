// let cartItems = localStorage.cartItems ? JSON.parse(localStorage.cartItems) : []

function toggleProduct(item,event,thisElm){
    if(event){
        if (thisElm.children[2].children[1] === event.target.parentNode || thisElm.children[2].children[2] == event.target){
            return
        }
    }
    const element = findProduct(item)
    let i = checkItemInCart(element)
    itemCount = ( i === false) ? 0 : cartItems[i].quantity
    

    productName.innerHTML = element.name
    productPrice.innerHTML = "$"+element.price
    productDesc.innerHTML = element.description ? element.description : ""
    productModel3d.src = element.model3d
    productModel3d["ios-src"] = element.model3d
    currentItem = element
    currentItem.quantity = itemCount
    if(currentItem.quantity == 0 && !cartBtns.children[0].className.includes("remove") || currentItem.quantity > 0 && cartBtns.children[0].className.includes("remove")){
        cartBtns.children[0].classList.toggle("remove")
        cartBtns.children[1].classList.toggle("remove")
    }
    updateItemCount(currentItem)

}

function addToCart(item){
    if(item){
        cartItems.push(item)
        return
    }
    if(cartItems.length > 0 && itemCount > 0){
        for (let i = 0; i < cartItems.length; i++) {
            if(currentItem.name == cartItems[i].name){
                return
            }
        }
    }
    if(currentItem.quantity > 0){
        cartItems.push(currentItem)
    }
    saveCart()
}

function checkItemInCart(item){
    if(cartItems.length > 0){
        for (let i = 0; i < cartItems.length; i++) {
            if(item.name == cartItems[i].name){
                return i
            }
        }
    }
    return false
}

function incrementItem(cartIndex,foodIndex){
    if(cartIndex !== undefined){
        cartItems[cartIndex].quantity += 1
        displayCart()
    }
    else if(foodIndex !== undefined){
        i = checkItemInCart(foodItems[foodIndex])
        let qty = 0
        if(i === false){
            let item = foodItems[foodIndex]
            
            item.quantity = 1
            addToCart(item)
            i = cartItems.length - 1 
            qty = item.quantity
        } else{
            cartItems[i].quantity += 1
            qty = cartItems[i].quantity
        }
        (qty === 1) ? updateItemCount(cartItems[i],true) : updateItemCount(cartItems[i]) 
        // thisElm.parentNode.children[1].innerHTML = qty
    }
    else if(currentItem){
        i = checkItemInCart(currentItem)
        if(i !== false){
            currentItem = cartItems[i]
        }
        currentItem.quantity +=1
        currentItem.quantity == 1 && addToCart()
        if(currentItem.quantity == 1){
            updateItemCount(currentItem,true)
        }
        else updateItemCount(currentItem)
    }
    saveCart()
}
function decrementItem(cartIndex,foodIndex){
    if(cartIndex !== undefined){
        if(cartItems[cartIndex].quantity >= 1) cartItems[cartIndex].quantity -= 1
        if(cartItems[cartIndex].quantity == 0) removeItem(cartIndex)
        displayCart()
    }
    else if(foodIndex !== undefined){
        i = checkItemInCart(foodItems[foodIndex])
        let qty = 0
        if(i !== false){
            cartItems[i].quantity -= 1
            qty = cartItems[i].quantity;
            (qty === 0) ? updateItemCount(cartItems[i],true) : updateItemCount(cartItems[i]) 
            if(qty < 1)cartItems.splice(i,1)
        }
    }
    else if(currentItem){
        i = checkItemInCart(currentItem)
        if(i !== false){
            currentItem = cartItems[i]
        }
        if(currentItem.quantity >= 1){
            currentItem.quantity-=1
            updateItemCount(currentItem)
        } 
        if(currentItem.quantity == 0){
            cartItems.splice(i,1)
            updateItemCount(currentItem,true)
        }
    }
    saveCart()
}

function removeItem(index){
    if(index === undefined) return
    cartItems.splice(index,1)
    saveCart()
    displayCart()
}

function updateItemCount(item,toggle){
    if(currentItem.name === item.name){
        currentItem.quantity = item.quantity
        productQty.innerHTML = item.quantity;
        if(toggle){
            cartBtns.children[0].classList.toggle("remove")
            cartBtns.children[1].classList.toggle("remove")
        }
    }
    const listCard = document.getElementById(item._id)
    listCard.children[2].children[1].children[1].innerHTML = item.quantity
    if(toggle){
        listCard.children[2].children[1].classList.toggle("remove")
        listCard.children[2].children[2].classList.toggle("remove")
    }
}

function saveCart(){
    localStorage.cartItems = JSON.stringify(cartItems)
    cartItems = localStorage.cartItems ? JSON.parse(localStorage.cartItems) : []
}

function scrollToElm(elm){
    const rect = document.querySelector(elm).getBoundingClientRect()
    // alert(rect.top)
    window.scrollBy({left: 0, top: rect.top - parseInt(foodContainer.style.marginTop),behavior: "smooth"})
    // window.scrollBy()   
}

function findProduct(id){
    let product
    foodItems.forEach(element => {
        if(element._id == id){
            product = element
        }
    })
    return product
}
