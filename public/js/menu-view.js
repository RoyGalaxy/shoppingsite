// import {fetchProducts} from 'PRODUCT.js';

const app = {
    listMenuScreen: document.getElementById("list-view-menu"),
    tileMenuScreen: document.getElementById("tile-view-menu"),
    loaderScreen: document.getElementById("loaderScreen"),
    catagoryTileParentElm: document.getElementById("tileCatagories"),
    modelViewerContainer: document.getElementById("model-viewer-container"),
    modelViewerElm: document.querySelector(".popup-3d-model-container model-viewer"),
    // productInformationPages: document.querySelectorAll(".product-information-page"),
    productInformationPage: document.querySelector(".product-information-page"),
    cartPageBtn: document.querySelector("#tile-view-menu .cart-btn"),
    backBtn: document.getElementById("backBtn"),
    arMenuBtn: document.getElementById("ar-menu-btn"),
    arMenuTab: document.getElementById("ar-menu-tab"),
    arCartTab: document.getElementById("ar-cart-tab"),
    activeArProductIndex: 0,
    activeArCatagoryIndex: 0,
    products: [],
    productTiles: [],
    cart: [],
    productCatagories: [],
    catagorisedProducts: {},
    init() {
        this.screens = [
            this.listMenuScreen,
            this.tileMenuScreen,
        ]
        // Remove Existing tiles when switching screens
        this.catagoryTileParentElm.innerHTML = ""
        this.fetchProducts().then((products) => {
            this.products = products
            this.processProducts();
            this.hideAllScreens();
            this.updateCartFromLocalStorage().then(() => {
                this.renderCatagoryTiles().then(() => {
                    this.hideLoader()
                    this.showScreen("tile-view-menu")
                    this.setArSwipeEventListener();
                })
            })
        })
    },
    async fetchProducts() {
        try {
            let res = await fetch("/api/products/")
            let jsonRes = await res.json();
            let products = await jsonRes;
            return products;
        }
        catch (err) {
            console.log(err);
        }
    },
    // TODO: REFACTOR
    catagoriseProducts() {
        for (let i = 0; i < this.products.length; i++){
            // Create an array in the object if not already exists then push the product
            if(this.catagorisedProducts[this.products[i].catagory] === undefined){
                this.catagorisedProducts[this.products[i].catagory] = []
            }
            this.catagorisedProducts[this.products[i].catagory].push(this.products[i])
        }
    },
    async processProducts(){
        this.catagoriseProducts()
        for (let i = 0; i < this.products.length; i++) {
            this.products[i].quantity = 0; // Take this quantity from the cart instead ..
            this.products[i].productIndex = i
            if (!this.productCatagories.includes(this.products[i].catagory)) {
                this.productCatagories.push(this.products[i].catagory)
            }
        }
    },
    //* REFACTORED CODE 
    fetchFromLocalStorage(data){
        if(localStorage[data] !== undefined && localStorage[data] !== null){
            return JSON.parse(localStorage[data]);
        }
        return -1;
    },
    findProductById(id){
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i]._id === id) {
                return i
            }
        }
        return -1;
    },
    // TODO: REFACTOR
    // TODO: FIX THE CART THING IN BOTH FILES
    async updateCartFromLocalStorage(){
        // Reset Cart
        app.cart = []
        let cart = this.fetchFromLocalStorage('cart');
        if(cart == -1) return;
        // update the quantity from cart and set to app.cart
        for (let i = 0; i < cart.length; i++) {
            let index = this.findProductById(cart[i].productId);
            if(index >= 0){
                app.products[index].quantity = cart[i].quantity;
                app.cart.push({
                    productId: app.products[index]._id,
                    quantity: app.products[index].quantity
                });
            } 
        }
        if(app.cart.length > 0 && this.cartPageBtn.className.includes("hidden")){
            this.cartPageBtn.classList.remove("hidden")
        }else if(!this.cartPageBtn.className.includes('hidden') && app.cart.length == 0){
            this.cartPageBtn.classList.add('hidden')
        }
    },
    // TODO: REFACTOR
    async renderCatagoryTiles() {
        for (let i = 0; i < this.productCatagories.length; i++) {
            const tile = document.createElement("div")
            tile.className = "tile catagory-tile"
            tile.setAttribute("style",`background-image:url(${this.catagorisedProducts[this.productCatagories[i]][0].image})`)
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
    // TODO: REFACTOR
    openTileCatagory(catagory) {
        this.hideScreen(this.catagoryTileParentElm.id)
        const container = document.getElementById("productTiles")
        app.productTiles = []
        this.activeArCatagoryIndex = this.productCatagories.indexOf(catagory);
        container.innerHTML = ""
        for (let i = 0; i < this.catagorisedProducts[catagory].length; i++) {
            let dish = this.catagorisedProducts[catagory][i]
            for (let j = 0; j < app.cart.length; j++) {
                if(this.catagorisedProducts[catagory][i]._id === app.cart[j].productId){
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
    // TODO: REFACTOR
    showProductInformation(product,pageIndex){
        this.productInformationPage.classList.remove("hidden");
        this.productInformationPage.setAttribute("data-indexed",product.productIndex);
        const imageElm = document.querySelectorAll(".primary-information")[pageIndex];
        const nameElm = document.querySelectorAll(".primary-information .product-name")[pageIndex];
        const priceElm = document.querySelectorAll(".primary-information .product-price")[pageIndex];
        const descriptionElm = document.querySelectorAll(".other-information .product-description")[pageIndex];
        const optionElm = document.querySelectorAll(".other-information .product-options")[pageIndex];

        imageElm.style.backgroundImage = `url(${product.image})`;
        nameElm.textContent = product.name;
        priceElm.textContent = "AED "+product.price;
        descriptionElm.innerHTML = "<i class='bx bx-info-circle'></i> " + product.description;
        if(pageIndex === 1){
            optionElm.appendChild(app.productTiles[product.productIndex- app.catagorisedProducts[product.catagory][0].productIndex].cartOption);
        }else{
            optionElm.appendChild(constructCartOptions(product,false));
        }
    },
    // TODO: REFACTOR
    hideProductInformation(pageIndex){
        if(pageIndex === 1){
            const index = this.productInformationPage[pageIndex].getAttribute("data-indexed")
            const cartOption = app.productTiles[index - app.catagorisedProducts[app.products[index].catagory][0].productIndex].cartOption
            const tileOptions = app.productTiles[index - app.catagorisedProducts[app.products[index].catagory][0].productIndex].tileOptions
            tileOptions.insertBefore(cartOption,tileOptions.firstChild)
        }
        app.productInformationPage.classList.add("hidden");
    },
    // TODO: REFACTOR
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
        await fetch(`/api/carts/${user._id}`, {
            method: 'PUT',
            headers: headersList,
            body: bodyContent
        })
    },
    incrementItem(product) {
        this.products[product.productIndex].quantity += 1
        this.quantityCounter.textContent = app.products[this.product.productIndex].quantity;
        if (app.products[this.product.productIndex].quantity == 1) {
            this.cartOptionsBtn()
            app.cart.push(app.products[this.product.productIndex])
        }
        app.saveCart().then(() => {})
        if(app.cart.length > 0 && app.cartPageBtn.className.includes("hidden")){
            app.cartPageBtn.classList.remove("hidden")
        }
        return this
    },
    // TODO: REFACTOR
    decrementItem() {
        app.products[this.product.productIndex].quantity -= 1
        // update the qunatity in the UI
        this.quantityCounter.textContent = app.products[this.product.productIndex].quantity;
        if (app.products[this.product.productIndex].quantity <= 0) {
            // Double check for negative value
            app.products[this.product.productIndex].quantity = 0;
            this.cartAddBtn()
            const indexInCart = app.findInCart(this.product._id)
            console.log(indexInCart)
            if (indexInCart >= 0) {
                console.log('this one')
                app.cart.splice(indexInCart, 1)
            }
        }
        app.saveCart().then(() => {})
        if(app.cart.length === 0 && !(app.cartPageBtn.className.includes("hidden"))){
            app.cartPageBtn.classList.add("hidden")
        }
        return this
    },
    // TODO: REFACTOR
    findInCart(productId) {
        for (let i = 0; i < this.cart.length; i++) {
            if (this.cart[i]._id === productId || this.cart[i].productId === productId) {
                return i
            }
        }
        return -1;
    },
    // Basic Methods
    hideLoader() {
        !this.loaderScreen.className.includes("hidden") && this.loaderScreen.classList.add("hidden")
    },
    showLoader() {
        this.loaderScreen.className.includes("hidden") && this.loaderScreen.classList.remove("hidden")
    },
    alterBackBtn(){
        if(app.catagoryTileParentElm.className.includes("hidden")){
            app.backBtn.classList.remove("hidden")
            return
        }
        app.backBtn.classList.add("hidden")
    },
    goBack(){
        this.switchScreens(app.currentScreenId,app.previousScreenId)
    },
    hideAllScreens() {
        for (let i = 0; i < this.screens.length; i++) {
            this.hideScreen(this.screens[i].id)
        }
    },
    // TODO: ADD ANIMATION
    hideScreen(id) {
        const elm = document.getElementById(id)
        if(!(elm.className.includes("hidden"))){
            elm.classList.add("hidden");
        }
        if(id != "list-view-menu" && id != "tile-view-menu"){
            app.previousScreenId = id;
        }
        this.alterBackBtn()
    },
    // TODO: ADD ANIMATION
    showScreen(id) {
        const elm = document.getElementById(id)
        if(elm.className.includes("hidden")){
            elm.classList.remove("hidden")
        }
        if(id != "list-view-menu" && id != "tile-view-menu"){
            app.currentScreenId = id
        }
        this.alterBackBtn()
    },
    // TODO: REFACTOR
    switchScreens(oldScreenId,newScreenId){
        if(newScreenId === "list-view-menu" && oldScreenId === "tile-view-menu"){
            const catagorySlider = document.getElementById("catagorySlider")
            const dishesContainer = document.getElementById("dishesContainer")
            catagorySlider.innerHTML = ""
            dishesContainer.innerHTML = ""
            app.loaderScreen.classList.remove("hidden")
            initiator()
        }
        if(newScreenId === "tile-view-menu" && oldScreenId === "list-view-menu"){
            app.loaderScreen.classList.remove("hidden")
            app.init()
            if(app.catagoryTileParentElm.className.includes("hidden")){
                app.switchScreens(app.currentScreenId,app.catagoryTileParentElm.id)
            }
        }
        this.hideScreen(oldScreenId)
        this.showScreen(newScreenId)
    },
    copyToClipboard(){
        navigator.clipboard.writeText("https://realitydiner.blackpepper.ae")
        alert("Copied the text")
    },
    shareToWhatsApp(){
        window.open("whatsapp://send?text=https://realitydiner.blackpepper.ae","_self")
    },
    // Event Listeners
    // TODO: REFACTOR
    setArSwipeEventListener(){
        const parentElements = document.querySelectorAll("model-viewer .swipe-ar-container");
        parentElements.forEach(el => {
            el.addEventListener("scroll",e => {
                const children = el.children;
                for(let i = 0; i < children.length; i++){
                    if((children[i].offsetLeft - el.scrollLeft) < 20 && (children[i].offsetLeft - el.scrollLeft) > 0){
                        const productCatagory = children[i].getAttribute("data-catagory");
                        const product = this.catagorisedProducts[productCatagory][i]
                        this.activeArProductIndex = i;
                        this.modelViewerElm.setAttribute("src",product.model3d);
                    }
                }
            })
        })
    },
    // TODO: REFACTOR
    hideUnhideArMenu(){
        if(this.arMenuTab.className.includes("hidden")){
            this.constructArMenu(this.productCatagories,'catagories',this.activeArCatagoryIndex);
            this.arMenuTab.classList.remove("hidden")
            this.arMenuBtn.innerHTML = '<i class="bx bx-menu-alt-right"></i> Close'
        }else{
            this.arMenuTab.classList.add("hidden")
            this.arMenuBtn.innerHTML = '<i class="bx bx-menu-alt-left"></i> AR Menu'
        }
    },
    // TODO: REFACTOR
    constructArMenu(objects, type, activeIndex){

        this.arMenuTab.innerHTML = `<h1>AR Menu </h1>`
        for(let i = 0; i < objects.length; i++){
            const li = document.createElement("li");
            i == activeIndex ? li.classList.add("active") : "";
            if(type == "catagories"){
                li.innerHTML = `${objects[i]} <span>${this.catagorisedProducts[objects[i]].length}</span>`
                li.addEventListener("click",()=> {
                    const catagory = this.productCatagories[i];
                    let index = (i == activeIndex) ? this.activeArProductIndex : -1;
                    this.constructArMenu(this.catagorisedProducts[catagory], "products", index)
                })
            }
            if(type == "products"){
                li.innerHTML = `${objects[i].name}`
                li.addEventListener("click",() => {
                    const catagory = objects[i].catagory;
                    modelViewer.show(this.catagorisedProducts[catagory][i])
                    this.hideUnhideArMenu();
                })
            }
            this.arMenuTab.appendChild(li)
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
    // TODO: REFACTOR
    incrementItem() {
        app.products[this.product.productIndex].quantity += 1
        this.quantityCounter.textContent = app.products[this.product.productIndex].quantity;
        if (app.products[this.product.productIndex].quantity == 1) {
            this.cartOptionsBtn()
            app.cart.push(app.products[this.product.productIndex])
        }
        app.saveCart().then(() => {})
        if(app.cart.length > 0 && app.cartPageBtn.className.includes("hidden")){
            app.cartPageBtn.classList.remove("hidden")
        }
        return this
    }
    // TODO: REFACTOR
    decrementItem() {
        app.products[this.product.productIndex].quantity -= 1
        // update the qunatity in the UI
        this.quantityCounter.textContent = app.products[this.product.productIndex].quantity;
        if (app.products[this.product.productIndex].quantity <= 0) {
            // Double check for negative value
            app.products[this.product.productIndex].quantity = 0;
            this.cartAddBtn()
            const indexInCart = app.findInCart(this.product._id)
            if (indexInCart !== false) {
                app.cart.splice(indexInCart, 1)
                console.table(indexInCart, app.cart)
            }
        }
        app.saveCart().then(() => {})
        if(app.cart.length === 0 && !(app.cartPageBtn.className.includes("hidden"))){
            app.cartPageBtn.classList.add("hidden")
        }
        return this
    }
    // TODO: REFACTOR
    constructTile() {
        const tile = document.createElement("div")
        tile.className = "tile product-tile"
        tile.setAttribute("style",`background-image:url(${this.product.image})`)
        tile.addEventListener("click",(e) => {
            if(e.target == tile){
                // const pageIndex = 1; // for tile view-menu
                // app.showProductInformation(this.product,pageIndex);
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
            modelViewer.show(this.product)
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
    // TODO: REFACTOR
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
    // TODO: REFACTOR
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
    // TODO: REFACTOR
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
