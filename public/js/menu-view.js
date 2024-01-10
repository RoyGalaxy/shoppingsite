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
            this.swipeMenuScreen
        ]
        this.catagoryTileParentElm.innerHTML = ""
        this.getProducts().then(() => {
            this.hideAllScreens()
            this.updateCartFromLocalStorage().then(() => {
                this.renderCatagoryTiles().then(() => {
                    this.hideLoader()
                    this.showScreen("tile-view-menu")
                    this.setArSwipeEventListener();
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
        if(!localStorage.cart){
            return
        }
        let cart = JSON.parse(localStorage.cart)
        for (let i = 0; i < cart.length; i++) {
            for (let j = 0; j < app.products.length; j++) {
                
                if(cart[i]._id === app.products[j]._id || cart[i].productId === app.products[j]._id){
                    app.products[j].quantity = cart[i].quantity;
                    app.cart.push(app.products[j])
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
    openTileCatagory(catagory) {
        this.hideScreen(this.catagoryTileParentElm.id)
        const container = document.getElementById("productTiles")
        app.productTiles = []
        this.activeArCatagoryIndex = this.productCatagories.indexOf(catagory);
        console.log(this.activeArCatagoryIndex)
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
        const imageElm = document.querySelector(".primary-information")
        const nameElm = document.querySelector(".primary-information .product-name")
        const priceElm = document.querySelector(".primary-information .product-price")
        const descriptionElm = document.querySelector(".other-information .product-description")
        const optionElm = document.querySelector(".other-information .product-options")

        imageElm.style.backgroundImage = `url(${product.image})`
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
        await fetch(`/api/carts/${user._id}`, {
            method: 'PUT',
            headers: headersList,
            body: bodyContent
        })
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
    //! Use this function to show model-viewer ar
    showModelViewer(product){
        this.modelViewer.setAttribute("src",product.model3d);
        this.modelViewerContainer.classList.remove("hide");

        const parentElements = document.querySelectorAll("model-viewer .swipe-ar-container");
        parentElements.forEach(el => {
            el.textContent = ''
        })

        const catagoryProducts = this.catagorisedProducts[product.catagory];
        
        for(let i = 0; i < catagoryProducts.length; i++){
            const arTile = new ArMenuProductTile(catagoryProducts[i]);
            arTile.constructTile()
            if(catagoryProducts[i]._id === product._id){
                const tile = document.getElementById(`arTile-${product._id}`);
                tile.scrollIntoView();
                activeArProductIndex = i;
            }
        }
    },
    hideModelViewer(){
        app.openTileCatagory(this.productCatagories[this.activeArCatagoryIndex]);
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
    },
    copyToClipboard(){
        navigator.clipboard.writeText("https://realitydiner.blackpepper.ae")
        alert("Copied the text")
    },
    shareToWhatsApp(){
        window.open("whatsapp://send?text=https://realitydiner.blackpepper.ae","_self")
    },
    // Event Listeners
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
                        this.modelViewer.setAttribute("src",product.model3d);
                    }
                }
            })
        })
    },
    hideUnhideArMenu(){
        if(this.arMenuTab.className.includes("hide")){
            this.constructArMenu(this.productCatagories,'catagories',this.activeArCatagoryIndex);
            this.arMenuTab.classList.remove("hide")
            this.arMenuBtn.innerHTML = '<i class="bx bx-menu-alt-right"></i> Close'
        }else{
            this.arMenuTab.classList.add("hide")
            this.arMenuBtn.innerHTML = '<i class="bx bx-menu-alt-left"></i> AR Menu'
        }
    },
    constructArMenu(objects, type, activeIndex){
        console.log(objects)
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
                    this.showModelViewer(this.catagorisedProducts[catagory][i])
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
        tile.setAttribute("style",`background-image:url(${this.product.image})`)
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

class ArMenuProductTile{
    constructor(product){
        this.product = product;
        this.parentElements = document.querySelectorAll("model-viewer .swipe-ar-container");
        this.quantityCounter = document.createElement("span");
    }
    constructTile() {
        const tile = document.createElement("div");
        tile.className = "swipe-ar-dish";
        tile.id = `arTile-${this.product._id}`
        tile.setAttribute("data-catagory",this.product.catagory)

        const left = document.createElement("div");
        left.className = "left";

        const leftTop = document.createElement("div");
        leftTop.className = "left-top"
        const veg_nonVeg = document.createElement("img");
        veg_nonVeg.src = "assets/img/icons/unicons/veg.jpg"
        const dishName = document.createElement("h1");
        dishName.className = "dish-name ellipsis";
        dishName.textContent = this.product.name;
        leftTop.appendChild(veg_nonVeg);
        leftTop.appendChild(dishName);

        const leftCenter = document.createElement("div");
        const dishDescription = document.createElement("span");
        dishDescription.className = "dish-description ellipsis";
        dishDescription.textContent = this.product.description;

        // leftCenter.appendChild(dishName);
        leftCenter.appendChild(dishDescription);

        const dishPrice = document.createElement("span");
        dishPrice.className = "dish-price";
        dishPrice.textContent = "AED " + this.product.price;
        leftCenter.appendChild(dishPrice)

        left.appendChild(leftTop)
        left.appendChild(leftCenter)

        const right = document.createElement("div")
        right.className = "right";

        const cartOptions = this.constructCartOption(this.product, this.product.productIndex, false);
        right.appendChild(cartOptions);

        tile.appendChild(left);
        tile.appendChild(right);

        this.parentElements.forEach(el => {
            el.appendChild(tile);
        })
        // Show Cart tab if required
        if(app.cart.length > 0 && app.arCartTab.className.includes("hide")){
            console.log(app.arCartTab);
            app.arCartTab.classList.remove("hide");
        }
        return this;
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
            app.arCartTab.classList.remove("hide")
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
            app.cartPageBtn.classList.add("hide");
            app.arCartTab.classList.add("hide");
        }
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