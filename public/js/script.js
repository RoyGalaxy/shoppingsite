const backBtns = document.querySelectorAll(".back-btn")
const user = JSON.parse(localStorage.user)
let dishes = []
let cart = {}
const deliveryCharge = 2


async function fetchProducts() {
    try {
        let res = await fetch("/api/products/")
        let jsonRes = await res.json()
        dishes = await jsonRes
    }
    catch (err) {
        console.log(err)
    }
}

function findProductById(id) {
    for (let i = 0; i < dishes.length; i++) {
        if (dishes[i]._id === id) {
            return dishes[i]
        }
    }
}

async function fetchCart() {
    // cart = JSON.parse(localStorage.cart)
    //! FETCH FROM THE SERVER INSTEAD
    if (user) {
        let headersList = {
            "Accept": "*/*",
            "token": `Bearer ${user.accessToken}`,
        }
        try {
            const res = await fetch(`/api/carts/find/${user._id}`,
                {
                    method: "GET",
                    headers: headersList
                }
            )
            const jsonRes = await res.json()
            const data = await jsonRes
            // cart = (data != undefined) ? data : {products: []}
            cart = data || await createCart()
        }catch(e){
            console.log(e)
        }
    }
}

async function createCart(){
    let headersList = {
        "Accept": "*/*",
        "token": `Bearer ${user.accessToken}`,
        "Content-type": "application/json"
    }
    let body = {
        userId: user._id,
        products: []
    }
    const res = await fetch("/api/carts/",{
        method: "POST",
        headers: headersList,
        body: JSON.stringify(body)
    })
    const jsonRes = await res.json()
    const data = await jsonRes
    console.log(data)
    return data
}

function saveCart(fromCartPage) {
    if (!fromCartPage) {
        cart.products = dishes.filter(dish => dish.quantity >= 1)
    }
    localStorage.cart = JSON.stringify(cart)
    //Also saving to the database
    let headersList = {
        "Accept": "*/*",
        "token": `Bearer ${user.accessToken}`,
        "Content-Type": "application/json"
    }
    let bodyContent = JSON.stringify({
        "products": cart.products.map(item => { return { "productId": item._id, "quantity": item.quantity } })
    });
    fetch(`/api/carts/${cart._id}`, {
        method: 'PUT',
        headers: headersList,
        body: bodyContent
    })
}

function findItemInCart(id) {
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId === id) {
            return cart.products[i]
        }
    }
}

// Event Handlers
for (let i = 0; i < backBtns.length; i++) {
    backBtns[i].addEventListener("click", () => { window.history.back() })
}