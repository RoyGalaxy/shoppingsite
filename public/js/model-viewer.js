const modelViewer = {
    activeProduct: null,
    activeArProductIndex: 0,
    activeArCatagoryIndex: 0,

    init(){
        this.modelViewer = document.querySelector('model-viewer');
        this.modelViewerContainer = document.querySelector('.model-viewer-container');
        this.arMenuBtn = document.getElementById('ar-menu-btn');
        this.arMenuTab = document.getElementById('ar-menu-tab');

    },    
    show(product){
        this.modelViewer.setAttribute("src",product.model3d);
        this.modelViewerContainer.classList.remove("hidden");

        const parentElements = document.querySelectorAll("model-viewer .swipe-ar-container");
        parentElements.forEach(el => {
            el.textContent = ''
        })

        const catagoryProducts = app.catagorisedProducts[product.catagory];
        
        for(let i = 0; i < catagoryProducts.length; i++){
            const arTile = new ArMenuProductTile(catagoryProducts[i],true);
            arTile.constructTile()
            if(catagoryProducts[i]._id === product._id){
                const tile = document.getElementById(`arTile-${product._id}`);
                tile.scrollIntoView();
                activeArProductIndex = i;
            }
        }
    },
    hide(){
        app.openTileCatagory(app.productCatagories[this.activeArCatagoryIndex]);
        this.modelViewerContainer.classList.add("hidden")
    },
    hideUnhideArMenu(){
        if(this.arMenuTab.className.includes("hidden")){
            this.constructArMenu(app.productCatagories,'catagories',this.activeArCatagoryIndex);
            this.arMenuTab.classList.remove("hidden")
            this.arMenuBtn.innerHTML = '<i class="bx bx-menu-alt-right"></i> Close'
        }else{
            this.arMenuTab.classList.add("hidden")
            this.arMenuBtn.innerHTML = '<i class="bx bx-menu-alt-left"></i> AR Menu'
        }
    },
    constructArMenu(objects, type, activeIndex){
        this.arMenuTab.innerHTML = `<h1>AR Menu </h1>`
        for(let i = 0; i < objects.length; i++){
            const li = document.createElement("li");
            i == activeIndex ? li.classList.add("active") : "";
            if(type == "catagories"){
                li.innerHTML = `${objects[i]} <span>${app.catagorisedProducts[objects[i]].length}</span>`
                li.addEventListener("click",()=> {
                    const catagory = app.productCatagories[i];
                    let index = (i == activeIndex) ? this.activeArProductIndex : -1;
                    this.constructArMenu(app.catagorisedProducts[catagory], "products", index)
                })
            }
            if(type == "products"){
                li.innerHTML = `${objects[i].name}`
                li.addEventListener("click",() => {
                    const catagory = objects[i].catagory;
                    this.show(app.catagorisedProducts[catagory][i])
                    this.hideUnhideArMenu();
                })
            }
            this.arMenuTab.appendChild(li)
        }
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
                        const product = app.catagorisedProducts[productCatagory][i]
                        this.activeArProductIndex = i;
                        this.modelViewer.setAttribute("src",product.model3d);
                    }
                }
            })
        })
    },
}


// class ArMenuProductTile{
//     constructor(product){
//         this.product = product;
//         this.parentElements = document.querySelectorAll("model-viewer .swipe-ar-container");
//         this.quantityCounter = document.createElement("span");
//     }
//     constructTile() {
//         const tile = document.createElement("div");
//         tile.className = "swipe-ar-dish";
//         tile.id = `arTile-${this.product._id}`
//         tile.setAttribute("data-catagory",this.product.catagory)

//         const left = document.createElement("div");
//         left.className = "left";

//         const leftTop = document.createElement("div");
//         leftTop.className = "left-top"
//         const veg_nonVeg = document.createElement("img");
//         veg_nonVeg.src = "assets/img/icons/unicons/veg.jpg"
//         const dishName = document.createElement("h1");
//         dishName.className = "dish-name ellipsis";
//         dishName.textContent = this.product.name;
//         leftTop.appendChild(veg_nonVeg);
//         leftTop.appendChild(dishName);

//         const leftCenter = document.createElement("div");
//         const dishDescription = document.createElement("span");
//         dishDescription.className = "dish-description ellipsis";
//         dishDescription.textContent = this.product.description;

//         // leftCenter.appendChild(dishName);
//         leftCenter.appendChild(dishDescription);

//         const dishPrice = document.createElement("span");
//         dishPrice.className = "dish-price";
//         dishPrice.textContent = "AED " + this.product.price;
//         leftCenter.appendChild(dishPrice)

//         left.appendChild(leftTop)
//         left.appendChild(leftCenter)

//         const right = document.createElement("div")
//         right.className = "right";

//         // const cartOptions = this.constructCartOption(this.product, this.product.productIndex, false);
//         // right.appendChild(cartOptions);

//         tile.appendChild(left);
//         tile.appendChild(right);

//         this.parentElements.forEach(el => {
//             el.appendChild(tile);
//         })
//         // Show Cart tab if required
//         // if(app.cart.length > 0 && app.arCartTab.className.includes("hide")){
//         //     console.log(app.arCartTab);
//         //     app.arCartTab.classList.remove("hide");
//         // }
//         return this;
//     }
//     incrementItem() {
//         app.products[this.product.productIndex].quantity += 1
//         this.quantityCounter.textContent = app.products[this.product.productIndex].quantity;
//         if (app.products[this.product.productIndex].quantity == 1) {
//             this.cartOptionsBtn()
//             app.cart.push(app.products[this.product.productIndex])
//         }
//         app.saveCart().then(() => {})
//         if(app.cart.length > 0 && app.cartPageBtn.className.includes("hide")){
//             app.cartPageBtn.classList.remove("hide")
//             app.arCartTab.classList.remove("hide")
//         }
//         return this
//     }
//     decrementItem() {
//         app.products[this.product.productIndex].quantity -= 1
//         this.quantityCounter.textContent = app.products[this.product.productIndex].quantity;
//         if (app.products[this.product.productIndex].quantity === 0) {
//             this.cartAddBtn()
//             const indexInCart = app.findInCart(this.product.productIndex)
//             if (indexInCart !== false) {
//                 app.cart.splice(indexInCart, 1)
//             }
//         }
//         app.saveCart().then(() => {})
//         if(app.cart.length === 0 && !(app.cartPageBtn.className.includes("hide"))){
//             app.cartPageBtn.classList.add("hide");
//             app.arCartTab.classList.add("hide");
//         }
//         return this
//     }
//     //! DELETED MORE METHODS DOWN HERE 
// }

class ArMenuProductTile{
    constructor(product, hasCartEnabled){
        this.product = product;
        this.parentElements = document.querySelectorAll("model-viewer .swipe-ar-container");
        this.quantityCounter = document.createElement("span");
        this.hasCartEnabled = hasCartEnabled;
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

        if(this.hasCartEnabled){
            const cartOptions = this.constructCartOption(this.product, this.product.productIndex, false);
            right.appendChild(cartOptions);

            if(app.cart.length > 0 && app.arCartTab.className.includes("hide")){
                app.arCartTab.classList.remove("hide");
            }
        }

        tile.appendChild(left);
        tile.appendChild(right);

        this.parentElements.forEach(el => {
            el.appendChild(tile);
        })
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