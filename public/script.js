let cartItems = localStorage.cartItems ? JSON.parse(localStorage.cartItems) : []

function toggleProduct(item){
    foodItems.forEach(element => {
        if(element.name.replace(/ /g,"") == item){
            productName.innerHTML = element.name
            productPrice.innerHTML = "Price: $"+element.price
            productDesc.innerHTML = element["description - English"] ? element["description - English"] : ""

            itemCount = 0
            updateItemCount()
            currentItem = Object.assign({quantity: itemCount},element)
        }
    });
}

function addToCart(){
    if(cartItems.length > 0 && itemCount > 0){
        for (let i = 0; i < cartItems.length; i++) {
            if(currentItem.name == cartItems[i].name){
                alert("Item already in cart")
                return
            }
        }
    }
    if(currentItem.quantity > 0){
        alert("Item added to cart")
        cartItems.push(currentItem)
        saveCart()
    }
}

function incrementItem(index){
    if(index !== undefined){
        cartItems[index].quantity += 1
        saveCart()
        displayCart()
        return
    }
    if(currentItem){
        itemCount+=1
        currentItem.quantity = itemCount
        updateItemCount()
    }
}

function removeItem(index){
    cartItems.splice(index,1)
    saveCart()
    displayCart()
}
function removeAllItems(){
    cartItems = []
    saveCart()
    displayCart()
}
function decrementItem(index){
    if(index !== undefined && cartItems[index].quantity > 1){
        cartItems[index].quantity -= 1
        saveCart()
        displayCart()
        return
    }
    if(currentItem && itemCount > 0){
        itemCount-=1
        currentItem.quantity = itemCount
        updateItemCount()
    }
}
function updateItemCount(){
    currentItem.quantity = itemCount
    productQty.innerHTML = itemCount;
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
