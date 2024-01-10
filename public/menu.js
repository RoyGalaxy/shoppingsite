const app = {
    catagoryParent: document.getElementById("catagories"),
    productParent: document.getElementById("products"),
    modelScreen: document.querySelector("model-viewer"),
    productCatagories: [],
    catagorisedProducts: {},
    products: [],
    cart: localStorage.cart ? JSON.parse(localStorage.cart) : [],
    activeCatagoryIndex: 0,
    async init(){
        await this.getProducts();
        await this.createCatagorySlider();
        await this.createProducts();
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
            this.products[i].productIndex = i;
            //! Quantity assignment operator deelted from here
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
                left: ((catElm.offsetWidth * (app.activeCatagoryIndex + 1) ) + 8 * app.activeCatagoryIndex) - (innerWidth/2 + catElm.offsetWidth/2),
                behavior: "smooth"
            })
        }
        !slide && elm.scrollIntoView({behavior: "smooth",block: "center"})
    },
    show3dModel(){
        this.modelScreen.src = this.activeProduct.model3d
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
        catagoryElm.style.backgroundImage = `url(${app.catagorisedProducts[this.name][0].image})`
        // catagoryElm.style.backgroundImage = `url(/image/059bdb21-9fe2-48ac-bb70-31a64bb2948cbreakfast.jpeg)`
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
            // if(e.target != addToCart && e.target != cartIcon){
                this.openProductPage(this.product)
                modelViewer.activeProduct = this.product;
            // }
        })

        let imageElm = document.createElement("img")
        imageElm.className = "aspect-square object-cover object-center rounded-t-md"
        imageElm.src = this.product.image

        const infoElm = document.createElement("div")
        infoElm.className = "flex flex-col justify-center items-center py-4 w-full"

        const titleElm = document.createElement("h1")
        titleElm.className = "text-xl font-medium truncate mb-4 py-4 text-gray-600 w-full text-center"
        titleElm.textContent = this.product.name

        const priceElm = document.createElement("h2")
        priceElm.className = "grid place-items-center text-red-400 text-lg font-semibold h-10"
        priceElm.textContent = `AED ${this.product.price}`

        // ! Add TO Cart Code was deleted frm here (not useful)

        infoElm.appendChild(titleElm)
        infoElm.appendChild(priceElm)
        // infoElm.appendChild(addToCart)

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
        // document.querySelector("#productPage .item-count").textContent = app.products[product.productIndex].quantity
    }
}

//! Update the Loader 
const fakeLoader = () => {
    const launchPage = document.getElementById('launchPage');
    const loader = document.getElementById('loaderPage');
    launchPage.classList.add('hidden');
    loader.classList.remove('hidden');
    app.init().then(() => {})
    setTimeout(() => {
        const homePage = document.getElementById('homePage');
        document.body.requestFullscreen();
        loader.classList.add('hidden');
        homePage.classList.remove('hidden');
    }, 2000);
}

/**  Event Listseners **/

// Scroll Event Handler
let scrollTimer = -1;
document.body.addEventListener("scroll",() => {
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