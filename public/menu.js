const app = {
    catagoryParent: document.getElementById("catagories"),
    productParent: document.getElementById("products"),
    modelScreen: document.querySelector("model-viewer"),
    productCatagories: [],
    catagorisedProducts: {},
    products: [],
    cart: JSON.parse(localStorage.cart) || [],
    activeCatagoryIndex: 0,
    async init(){
        await this.getProducts()
        await this.createCatagorySlider()
        await this.createProducts()
    },
    async getProducts() {
        try {
            let res = await fetch("/api/products/")
            let jsonRes = await res.json()
            this.products = await jsonRes
        }
        catch (err) {
            console.log(err)
        }
        for (let i = 0; i < this.products.length; i++) {
            this.products[i].quantity = 0; // Take this quantity from the cart instead ..
            this.products[i].productIndex = i
            this.products[i].quantity = this.cart.filter(item => item.productId == this.products[i]._id)[0]?.quantity || 0;
            if (!this.productCatagories.includes(this.products[i].catagory)) {
                this.productCatagories.push(this.products[i].catagory)
            }
        }
        this.catagoriseProducts()
    },
    catagoriseProducts() {
        for (let i = 0; i < this.productCatagories.length; i++) {
            this.catagorisedProducts[this.productCatagories[i]] = []
        }
        for (let i = 0; i < this.products.length; i++) {
            this.catagorisedProducts[this.products[i].catagory].push(this.products[i])
        }
    },
    async createCatagorySlider(){
        for(let i = 0; i < this.productCatagories.length; i++){
            let catagory = new Catagory({ name: this.productCatagories[i], i })
            let catagoryElm = catagory.construct()
            this.catagoryParent.appendChild(catagoryElm)
        }
    },
    async createProducts(){
        for (let i = 0; i < this.productCatagories.length; i++) {
            let lastRow;
            let catagory = this.productCatagories[i]
            let catagoryProducts = this.catagorisedProducts[catagory]
            if(catagoryProducts.length % 3 !== 0){
                lastRow = document.createElement("div")
                lastRow.className = "px-4 flex items-center justify-center col-span-3 gap-4"
            }
            let sectionTitleElm = document.createElement("h1")
            sectionTitleElm.className = "flex items-center justify-center font-medium h-20 text-4xl col-span-3 capitalize"
            sectionTitleElm.textContent = catagory
            sectionTitleElm.id = catagory.replace(" ","")
            this.productParent.appendChild(sectionTitleElm)

            const catagoryProductContainer = document.createElement("div")
            catagoryProductContainer.className = "grid grid-cols-3 w-screen justify-center px-4 py-4 gap-4 "

            for(let j = 0; j < catagoryProducts.length; j++){
                
                let product = new Product(catagoryProducts[j])
                let productElm = product.construct()
    
                if(j >= (parseInt(catagoryProducts.length / 3) * 3)){
                    lastRow.appendChild(productElm)
                }else{
                    catagoryProductContainer.appendChild(productElm)
                }
            }
            lastRow && catagoryProductContainer.appendChild(lastRow)
            this.productParent.appendChild(catagoryProductContainer)
        }
    },
    incrementItem(index){
        console.log(index, !isNaN(index) ? "true" : "false")
        app.products[!isNaN(index) ? index : this.activeProduct.productIndex].quantity += 1
        document.querySelector("#productPage .item-count").textContent = app.products[!isNaN(index) ? index : this.activeProduct.productIndex].quantity;
    },
    decrementItem(){
        app.products[this.activeProduct.productIndex].quantity -= 1
        if (app.products[this.activeProduct.productIndex].quantity <= 0) {
            app.products[this.activeProduct.productIndex].quantity = 0
        }
        document.querySelector("#productPage .item-count").textContent = app.products[this.activeProduct.productIndex].quantity;
    },
    addToCart(index){
        let product = app.products[!isNaN(index) ? index : this.activeProduct.productIndex]
        if(product.quantity == 0){
            this.incrementItem(index)
        }
        const inCart = app.cart.filter(item => (item.productId == product._id) || (item._id == product._id))
        if(inCart?.length !== 0){
            app.cart = app.cart.map(item => {
                if((item.productId == product._id) || (item._id == product._id)){
                    item.quantity = product.quantity
                }
                return item
            })
        }else app.cart.push(product)
        this.saveCart()
    },
    saveCart() {
        const user = JSON.parse(localStorage.user)
        let products = app.cart.map(item => { return { "productId": item._id || item.productId, "quantity": item.quantity } })
        localStorage.cart = JSON.stringify(products)
        if (!user?.accessToken) {
            return
        }
        let headersList = {
            "Accept": "*/*",
            "token": `Bearer ${user.accessToken}`,
            "Content-Type": "application/json"
        }
        let bodyContent = JSON.stringify({
            "products": app.cart.map(item => { return { "productId": item._id, "quantity": item.quantity } })
        });
        fetch(`/api/carts/${user._id}`, {
            method: 'PUT',
            headers: headersList,
            body: bodyContent
        }).then(() => {}) 
    },
    switchActiveCatagory(name,index,scroll){
        let catagories = this.catagoryParent.children;
        
        !catagories[index].className.includes("border-2 border-red-500")  && catagories[index].classList.add("border-2")
        index !== this.activeCatagoryIndex && catagories[this.activeCatagoryIndex].classList.remove("border-2")
        this.activeCatagoryIndex = index
        // !scroll && catagories[this.activeCatagoryIndex].scrollIntoView({behavior: "smooth",block: "center"})
        this.scrollToCatagory(name,!scroll)
        clearTimeout(scrollTimer)
    },
    scrollToCatagory(name,slide){
        let elm = document.getElementById(name)
        if(slide){
            const catElm = document.getElementById(`cat-${name}`)
            catElm.parentNode.parentNode.scrollTo({
                left: ((catElm.offsetWidth * this.activeCatagoryIndex) + catElm.offsetWidth) - (innerWidth/2 + (8* app.activeCatagoryIndex)),
                behavior: "smooth"
            })
        }
        !slide && elm.scrollIntoView({behavior: "smooth",block: "center"})
    },
    show3dModel(){
        this.modelScreen.src = this.activeProduct.model3d
        console.log(this.activeProduct.model3d)
        this.modelScreen.parentNode.classList.remove("hidden")
    },
    hide3dModel(){
        this.modelScreen.parentNode.classList.add("hidden")
    },
    switchPage(oldId,newId){
        document.getElementById(oldId).classList.add("hidden")
        document.getElementById(newId).classList.remove("hidden")
    }
}

class Catagory{
    constructor({name, i }){
        this.name = name
        this.index = i
    }
    construct(){
        let catagoryElm = document.createElement("div")
        catagoryElm.className = `${this.index === 0 ? "border-2" : ""} border-red-500 inline-flex items-end justify-center w-48 h-28 bg-center bg-cover mr-2 rounded-md shadow-md`
        catagoryElm.id = `cat-${this.name.replace(" ","")}`
        // catagoryElm.style.backgroundImage = `url(${app.catagorisedProducts[this.name][0].image})`
        catagoryElm.style.backgroundImage = `url(/image/059bdb21-9fe2-48ac-bb70-31a64bb2948cbreakfast.jpeg)`
        catagoryElm.addEventListener("click", () => { app.switchActiveCatagory(this.name.replace(" ",""),this.index,true) })

        let catagoryTitleElm = document.createElement("h2")
        catagoryTitleElm.className = "text-gray-50 text-lg font-bold mb-2 capitalize"
        catagoryTitleElm.textContent = this.name

        catagoryElm.appendChild(catagoryTitleElm)
        return catagoryElm;
    }
}

class Product{
    constructor(product){
        this.product = product
    }
    construct(){
        let productElm = document.createElement("div")
        productElm.className = "relative flex flex-col basis-4/12 shadow-lg rounded-md bg-white"
        productElm.addEventListener("click",(e) => {
            if(e.target != addToCart && e.target != cartIcon){
                this.openProductPage(this.product)
            }
        })

        let imageElm = document.createElement("img")
        imageElm.className = "aspect-square object-cover object-center rounded-t-md"
        imageElm.src = this.product.image

        const infoElm = document.createElement("div")
        infoElm.className = "flex flex-col justify-center items-center py-4"

        const titleElm = document.createElement("h1")
        titleElm.className = "text-xl font-medium truncate mb-4 text-gray-600"
        titleElm.textContent = this.product.name

        const priceElm = document.createElement("h2")
        priceElm.className = "grid place-items-center text-red-400 text-lg font-semibold h-10"
        priceElm.textContent = `AED ${this.product.price}`

        const addToCart = document.createElement("div")
        addToCart.className = "absolute flex justify-center items-center h-10 w-10 bg-red-400 bottom-4 right-4 rounded-md add-to-cart"
        addToCart.addEventListener("click", () => {
            let product = this.product
            app.incrementItem(product.productIndex)
            app.addToCart(product.productIndex)
        })
        
        const cartIcon = document.createElement("i")
        cartIcon.className = "bx bx-plus text-2xl text-gray-50"

        addToCart.appendChild(cartIcon)

        infoElm.appendChild(titleElm)
        infoElm.appendChild(priceElm)
        infoElm.appendChild(addToCart)

        productElm.appendChild(imageElm)
        productElm.appendChild(infoElm)
        return productElm;
    }
    openProductPage(product){
        app.switchPage("homePage","productPage")
        app.activeProduct = app.products[product.productIndex]
        document.querySelector("#productPage img").src = product.image
        document.querySelector("#productPage h1").textContent = product.name
        document.querySelector("#productPage span").textContent = `AED ${product.price}`
        document.querySelector("#productPage p").textContent = product.description
        document.querySelector("#productPage .item-count").textContent = app.products[product.productIndex].quantity
    }
}

let scrollTimer = -1;
this.addEventListener("scroll",() => {
    if(scrollTimer != -1){
        clearTimeout(scrollTimer)
    }
    scrollTimer = setTimeout(() => {
        for(let i = 0; i < app.productCatagories.length; i++){
            let catagory = app.productCatagories[i].replace(" ","")
            let el = document.getElementById(catagory)
            const { top, bottom } = el.getBoundingClientRect()
            const productElm = el.nextElementSibling
            const productRect = productElm.getBoundingClientRect()
            if((top >= 0 && bottom <= window.innerHeight) || (productRect.top >= 0 || productRect.bottom + 70 - innerHeight >= 0) ){
                app.switchActiveCatagory(catagory,app.productCatagories.indexOf(app.productCatagories[i]),false)
                return
            }
        }
        scrollTimer = -1
    },100)
})