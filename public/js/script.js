const backBtns = document.querySelectorAll(".back-btn")
let dishes = []
let cart = []


async function fetchProducts(){
    try {
        let res = await fetch("/api/products/")
        let jsonRes = await res.json()
        dishes = await jsonRes
    }
    catch(err){
        console.log(err)
    }
}
fetchProducts()

function findProductById(id){
    for(let i = 0;i < dishes.length;i++){
        if(dishes[i]._id === id){
            return dishes[i]
        }
    }
}

function fetchCart(){
    //! FETCH FROM THE SERVER INSTEAD
    cart = JSON.parse(localStorage.cart)
}
fetchCart()

function saveCart(fromCartPage){
    if(!fromCartPage){
        cart = dishes.filter(dish => dish.quantity >= 1)
    }
    localStorage.cart = JSON.stringify(cart)
    //TODO Also save to the database
}

function findItemInCart(id){
    for(let i = 0;i < cart.length;i++){
        if(cart[i]._id === id){
            return cart[i]
        }
    }
}

// Event Handlers
for(let i = 0; i < backBtns.length;i++){
    backBtns[i].addEventListener("click",() => {console.log(window.history.back() || window.history.next())})
}