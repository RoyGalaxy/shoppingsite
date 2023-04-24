const app = {
    listMenuScreen: document.getElementById("list-view-menu"),
    tileMenuScreen: document.getElementById("tile-view-menu"),
    swipeMenuScreen: document.getElementById("slide-view-menu"),
    loaderScreen: document.getElementById("loaderScreen"),
    catagoryTileParentElm: document.getElementById("tileCatagories"),
    modelViewerContainer: document.getElementById("model-viewer-container"),
    modelViewer: document.querySelector(".popup-3d-model-container model-viewer"),
    productInformationPage: document.querySelector(".product-information-page"),
    cartPageBtn: document.querySelector("#tile-view-menu .cart-btn"),
    backBtn: document.getElementById("backBtn"),
    products: [],
    productTiles: [],
    cart: [],
    productCatagories: [],
    catagorisedProducts: {},
    init() {
        this.screens = [
            this.listMenuScreen,
            this.tileMenuScreen,
            this.swipeMenuScreen
        ]
        this.catagoryTileParentElm.innerHTML = ""
        this.getProducts().then(() => {
            this.hideAllScreens()
            this.updateCartFromLocalStorage().then(() => {
                this.renderCatagoryTiles().then(() => {
                    this.hideLoader()
                    this.showScreen("tile-view-menu")
                })
            })
        })
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
            if (!this.productCatagories.includes(this.products[i].catagory)) {
                this.productCatagories.push(this.products[i].catagory)
            }
        }
        this.catagoriseProducts()
    },
    async updateCartFromLocalStorage(){
        if(localStorage.cart === undefined){
            return
        }
        for (let i = 0; i < JSON.parse(localStorage.cart).length; i++) {
            for (let j = 0; j < app.products.length; j++) {
                if(JSON.parse(localStorage.cart)[i].productId === app.products[j]._id){
                    app.products[j].quantity = JSON.parse(localStorage.cart)[i].quantity;
                    app.cart.push(app.products[j])
                    console.log(app.products[j])
                    break;
                }
            } 
        }
        if(app.cart.length > 0 && this.cartPageBtn.className.includes("hide")){
            this.cartPageBtn.classList.remove("hide")
        }
    },
    catagoriseProducts() {
        for (let i = 0; i < this.productCatagories.length; i++) {
            this.catagorisedProducts[this.productCatagories[i]] = []
        }
        for (let i = 0; i < this.products.length; i++) {
            this.catagorisedProducts[this.products[i].catagory].push(this.products[i])
        }
    },
    async renderCatagoryTiles() {
        for (let i = 0; i < this.productCatagories.length; i++) {
            const tile = document.createElement("div")
            tile.className = "tile catagory-tile"
            tile.addEventListener("click", () => {
                app.openTileCatagory(app.productCatagories[i])
            })

            const tileHeading = document.createElement("h2")
            tileHeading.className = "catagory-tile tile-heading"
            tileHeading.textContent = this.productCatagories[i]

            tile.appendChild(tileHeading)
            this.catagoryTileParentElm.appendChild(tile)
        }
    },
    openTileCatagory(catagory) {
        this.hideScreen(this.catagoryTileParentElm.id)
        const container = document.getElementById("productTiles")
        app.productTiles = []
        container.innerHTML = ""
        for (let i = 0; i < this.catagorisedProducts[catagory].length; i++) {
            let dish = this.catagorisedProducts[catagory][i]
            for (let j = 0; j < app.cart.length; j++) {
                if(this.catagorisedProducts[catagory][i]._id === app.cart[j]._id){
                    dish.quantity = app.cart[j].quantity
                    break;
                }
            }
            const product = new ProductTile(dish)
            app.productTiles.push(product)
            product.constructTile()
            product.show()
        }
        this.showScreen(container.id)
    },
    showProductInformation(product){
        this.productInformationPage.classList.remove("hide");
        this.productInformationPage.setAttribute("data-indexed",product.productIndex)
        const nameElm = document.querySelector(".primary-information .product-name")
        const priceElm = document.querySelector(".primary-information .product-price")
        const descriptionElm = document.querySelector(".other-information .product-description")
        const optionElm = document.querySelector(".other-information .product-options")

        nameElm.textContent = product.name
        priceElm.textContent = "AED "+product.price
        descriptionElm.innerHTML = "<i class='bx bx-info-circle'></i> " + product.description
        optionElm.appendChild(app.productTiles[product.productIndex - app.catagorisedProducts[product.catagory][0].productIndex].cartOption)
    },
    hideProductInformation(){
        const index = this.productInformationPage.getAttribute("data-indexed")
        const cartOption = app.productTiles[index - app.catagorisedProducts[app.products[index].catagory][0].productIndex].cartOption
        const tileOptions = app.productTiles[index - app.catagorisedProducts[app.products[index].catagory][0].productIndex].tileOptions
        tileOptions.insertBefore(cartOption,tileOptions.firstChild)
        app.productInformationPage.classList.add("hide")
    },
    async saveCart() {
        if (!user?.accessToken) {
            let products = app.cart.map(item => { return { "productId": item._id, "quantity": item.quantity } })
            localStorage.cart = JSON.stringify(products)
            return
        }
        localStorage.cart = JSON.stringify(app.cart)
        let headersList = {
            "Accept": "*/*",
            "token": `Bearer ${user.accessToken}`,
            "Content-Type": "application/json"
        }
        let bodyContent = JSON.stringify({
            "products": app.cart.map(item => { return { "productId": item._id, "quantity": item.quantity } })
        });
        const res = await fetch(`/api/carts/${user._id}`, {
            method: 'PUT',
            headers: headersList,
            body: bodyContent
        })
        const jsonRes = await res.json()
        const data = await jsonRes
    },
    findInCart(productIndex) {
        for (let i = 0; i < this.cart.length; i++) {
            if (this.cart[i].productIndex === productIndex) {
                return i
            }
        }
        return false;
    },
    // Basic Methods
    hideLoader() {
        !this.loaderScreen.className.includes("hide") && this.loaderScreen.classList.add("hide")
    },
    showLoader() {
        this.loaderScreen.className.includes("hide") && this.loaderScreen.classList.remove("hide")
    },
    alterBackBtn(){
        if(app.catagoryTileParentElm.className.includes("hide")){
            app.backBtn.classList.remove("hide")
            return
        }
        app.backBtn.classList.add("hide")
    },
    goBack(){
        this.switchScreens(app.currentScreenId,app.previousScreenId)
    },
    showModelViewer(modelUrl){
        this.modelViewer.setAttribute("src",modelUrl)
        this.modelViewerContainer.classList.remove("hide")
    },
    hideModelViewer(){
        this.modelViewerContainer.classList.add("hide")
    },
    hideAllScreens() {
        for (let i = 0; i < this.screens.length; i++) {
            this.hideScreen(this.screens[i].id)
        }
    },
    hideScreen(id) {
        const elm = document.getElementById(id)
        !(elm.className.includes("hide")) && elm.classList.add("hide")
        if(id != "list-view-menu" && id != "tile-view-menu"){
            app.previousScreenId = id
        }
        this.alterBackBtn()
    },
    showScreen(id) {
        const elm = document.getElementById(id)
        elm.className.includes("hide") && elm.classList.remove("hide")
        console.log(id)
        if(id != "list-view-menu" && id != "tile-view-menu"){
            app.currentScreenId = id
        }
        this.alterBackBtn()
    },
    switchScreens(oldScreenId,newScreenId){
        this.hideScreen(oldScreenId)
        this.showScreen(newScreenId)
        if(newScreenId === "list-view-menu" && oldScreenId === "tile-view-menu"){
            const catagorySlider = document.getElementById("catagorySlider")
            const dishesContainer = document.getElementById("dishesContainer")
            catagorySlider.innerHTML = ""
            dishesContainer.innerHTML = ""
            app.loaderScreen.classList.remove("hide")
            initiator()
        }
        if(newScreenId === "tile-view-menu" && oldScreenId === "list-view-menu"){
            app.loaderScreen.classList.remove("hide")
            app.cart = []
            app.init()
            if(app.catagoryTileParentElm.className.includes("hide")){
                app.switchScreens(app.currentScreenId,app.catagoryTileParentElm.id)
            }
        }
    }
}

class ProductTile {
    constructor(product) {
        this.product = product
        this.parentElement = document.getElementById("productTiles");
        this.quantityCounter = document.createElement("span")
    }
    show() {
        this.parentElement.appendChild(this.tileComponent)
        return this
    }
    hide() {
        return this
    }
    incrementItem() {
        app.products[this.product.productIndex].quantity += 1
        this.quantityCounter.textContent = app.products[this.product.productIndex].quantity;
        if (app.products[this.product.productIndex].quantity == 1) {
            this.cartOptionsBtn()
            app.cart.push(app.products[this.product.productIndex])
        }
        app.saveCart().then(() => {})
        if(app.cart.length > 0 && app.cartPageBtn.className.includes("hide")){
            app.cartPageBtn.classList.remove("hide")
        }
        return this
    }
    decrementItem() {
        app.products[this.product.productIndex].quantity -= 1
        this.quantityCounter.textContent = app.products[this.product.productIndex].quantity;
        if (app.products[this.product.productIndex].quantity === 0) {
            this.cartAddBtn()
            const indexInCart = app.findInCart(this.product.productIndex)
            if (indexInCart !== false) {
                app.cart.splice(indexInCart, 1)
            }
        }
        app.saveCart().then(() => {})
        if(app.cart.length === 0 && !(app.cartPageBtn.className.includes("hide"))){
            app.cartPageBtn.classList.add("hide")
        }
        return this
    }
    constructTile() {
        const tile = document.createElement("div")
        tile.className = "tile product-tile"
        tile.addEventListener("click",(e) => {
            if(e.target == tile){
                app.showProductInformation(this.product)
            }
        })
        //  Header div
        this.tileOptions = document.createElement("div")
        this.tileOptions.className = "product-tile-options"
        // Todo Replace this code with {Construct cart options}
        const cartOptions = this.constructCartOption(this.product, this.product.productIndex, false)

        const button = document.createElement("i")
        button.className = "bx bx-cube"
        button.addEventListener("click",() => {
            app.showModelViewer(this.product.model3d)
        })

        this.tileOptions.appendChild(cartOptions)
        this.tileOptions.appendChild(button)
        // Footer Div
        const productInfo = document.createElement("div")
        productInfo.className = "product-tile-info"

        const productTitle = document.createElement("h2")
        productTitle.className = "product-title tile-heading"
        productTitle.textContent = this.product.name

        const productPrice = document.createElement("span")
        productPrice.className = "product-price"
        productPrice.textContent = "AED " + this.product.price

        productInfo.appendChild(productTitle)
        productInfo.appendChild(productPrice)

        tile.appendChild(this.tileOptions)
        tile.appendChild(productInfo)

        this.tileComponent = tile;
        return this
    }
    cartAddBtn() {
        this.cartOption.className = "cart-options add"
        this.cartOption.innerHTML = "Add +"
        if(this.cartOption.getAttribute("data-listener") !== "true"){
            this.cartOption.addEventListener("click", (e) => {
                e.stopPropagation()
                this.incrementItem()
            })
            this.cartOption.setAttribute("data-listener","true")
        }
    }
    cartOptionsBtn() {
        this.cartOption.innerHTML = ""
        this.cartOption.className = "cart-options"
        const minus = document.createElement("i")
        minus.className = "bx bx-minus minus"
        minus.addEventListener("click", (e) => {
            e.stopPropagation()
            this.decrementItem()
        })

        this.quantityCounter.addEventListener("click", (e) => { e.stopPropagation() })
        this.quantityCounter.className = "count"
        this.quantityCounter.textContent = this.product.quantity

        const plus = document.createElement("i")
        plus.className = "bx bx-plus plus"
        plus.addEventListener("click", (e) => {
            e.stopPropagation()
            this.incrementItem()
            // updateItemCount(dish.quantity, index, forProductOverlay)
        })

        this.cartOption.appendChild(minus)
        this.cartOption.appendChild(this.quantityCounter)
        this.cartOption.appendChild(plus)
    }
    constructCartOption(dish) {
        this.cartOption = document.createElement("div")
        this.cartOption.addEventListener("click", (e) => { e.stopPropagation() })
        this.cartOption.setAttribute("data-listener","false")
        this.cartOption.className = "cart-options"
        if (dish.quantity !== 0) {
            this.cartOptionsBtn()
        } else {
            this.cartAddBtn()
        }
        return this.cartOption
    }
}

// app.init()

// To be Continued from saving the cart function...