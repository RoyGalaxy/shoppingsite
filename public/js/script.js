const currencySymbol = "AED"
const backBtns = document.querySelectorAll(".back-btn")
let loader;
let user = localStorage.user ? JSON.parse(localStorage.user) : {}
let dishes = []
let cart = localStorage.cart ? { products: JSON.parse(localStorage.cart) } : {}
const deliveryCharge = 1

function hideLoader(){
    loader = document.querySelector(".loader")
    loader.classList.add("hide")
}

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

async function fetchCart(fromLoginPage) {
    if (user.accessToken) {
        let headersList = {
            "Accept": "*/*",
            "token": `Bearer ${user.accessToken}`,
        }
        if(fromLoginPage){
            cart = await createCart()
        }else{
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
            } catch (e) {
                console.log(e)
            }
        }
    } else {
        cart.products = localStorage.cart ? JSON.parse(localStorage.cart) : []
        return
    }
}

async function createCart() {
    if (!user?.accessToken) return
    let products = cart.products?.map(item => { return { "productId": item._id || item.productId, "quantity": item.quantity } })
    let headersList = {
        "Accept": "*/*",
        "token": `Bearer ${user.accessToken}`,
        "Content-type": "application/json"
    }
    let body = {
        userId: user._id,
        products: products || []
    }
    const res = await fetch("/api/carts/", {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(body)
    })
    const jsonRes = await res.json()
    const data = await jsonRes
    return data
}

async function deleteCart() {
    if (user.accessToken) {
        let headersList = {
            "Accept": "*/*",
            "token": `Bearer ${user.accessToken}`
        }
        await fetch(`/api/carts/${user._id}`, {
            method: "DELETE",
            headers: headersList
        });
    }
}

async function saveCart(fromCartPage) {
    if (!fromCartPage) {
        cart.products = dishes.filter(dish => dish.quantity >= 1)
    }
    if (!user?.accessToken) {
        let products = cart.products.map(item => { return { "productId": item._id, "quantity": item.quantity } })
        localStorage.cart = JSON.stringify(products)
        return
    }
    localStorage.cart = JSON.stringify(cart.products)
    let headersList = {
        "Accept": "*/*",
        "token": `Bearer ${user.accessToken}`,
        "Content-Type": "application/json"
    }
    let bodyContent = JSON.stringify({
        "products": cart.products.map(item => { return { "productId": item._id, "quantity": item.quantity } })
    });
    console.log(bodyContent)
    const res = await fetch(`/api/carts/${user._id}`, {
        method: 'PUT',
        headers: headersList,
        body: bodyContent
    })
    const jsonRes = await res.json()
    const data = await jsonRes
}

function findItemInCart(id) {
    for (let i = 0; i < cart.products?.length; i++) {
        if (cart.products[i]?.productId === id) {
            return cart.products[i]
        }
    }
}

function sortProducts() {
    dishes.sort((a, b) => {
        let fa = a.catagory.toLowerCase(),
            fb = b.catagory.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });
}

function checkLogin() {
    if (user?.phone) {
        return true
    }
    return false
}

async function registerUser(phone) {
    //! Just adding Temporarily
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ phone })
    })
    const jsonRes = await res.json()
    const data = await jsonRes
    return data
}

async function loginUser(phone, otp) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ phone, phoneOtp: otp })
    })
    const jsonRes = await res.json()
    const newUser = await jsonRes
    if (newUser?.accessToken) {
        localStorage.user = JSON.stringify(newUser)
        user = newUser
        await deleteCart()
        let newCart = await fetchCart(true)
        cart = newCart
    }
    return newUser
}

// Event Handlers
for (let i = 0; i < backBtns.length; i++) {
    backBtns[i].addEventListener("click", () => { window.history.back() })
}