'use strict'

let cartItems;
const catagories = []

function displayItems() {
    document.getElementById("food-items").innerHTML = ""
    let count = -1
    for (let i = 0; i < catagories.length; i++) {
        const foodData = foodItems.filter((item) => item.category == catagories[i]);
        let itemCards = foodData.map((item, index) => {
            count += 1
            for (let j = 0; j < cartItems.length; j++) {
                if (cartItems[j].name == item.name) {
                    item = cartItems[j]
                    break;
                }
            }
            const itemCard = document.createElement("div")
            itemCard.className = "item-card"
            itemCard.id = item._id
            // itemCard.addEventListener("click", function(event){toggleProduct(this.id,event,this)})
            itemCard.addEventListener("click", function (event) {
                if (thisElm.children[2].children[1] === event.target.parentNode || thisElm.children[2].children[2] == event.target) {
                    return
                }
                app.showProductInformation(item)
            });

            const itemImage = document.createElement("img")
            itemImage.src = item.image

            const itemInfo = document.createElement("div")
            itemInfo.className = "item-info"

            const itemName = document.createElement("span")
            itemName.className = "ellipsis"
            itemName.id = "item-name"
            itemName.textContent = item.name

            const itemDesc = document.createElement("span")
            itemDesc.id = "item-description"
            itemDesc.className = "ellipsis"
            itemDesc.textContent = item.description ? item.description : ""

            itemInfo.appendChild(itemName)
            itemInfo.appendChild(itemDesc)

            const itemPriceBox = document.createElement("div")
            itemPriceBox.className = "item-info item-price-box"

            const itemPrice = document.createElement("p")
            itemPrice.id = "item-price"
            itemPrice.textContent = currencySymbol + " " + item.price

            const cartOptions = document.createElement("span")
            cartOptions.className = `cart-options ${(item.quantity > 0 && count !== 0) ? "" : "remove"}`

            const faPlus = document.createElement("i")
            faPlus.className = "fa fa-plus"
            faPlus.addEventListener("click", incrementItem.bind(this, undefined, count))

            const productQuantity = document.createElement("span")
            productQuantity.id = "product-quantit"
            productQuantity.textContent = item.quantity ? item.quantity : "0"

            const faMinus = document.createElement("i")
            faMinus.className = "fa fa-minus"
            faMinus.addEventListener("click", decrementItem.bind(this, undefined, count))

            cartOptions.appendChild(faPlus)
            cartOptions.appendChild(productQuantity)
            cartOptions.appendChild(faMinus)

            const addBtn = document.createElement("span")
            addBtn.className = `add ${(item.quantity > 0 && count !== 0) ? "remove" : ""}`
            addBtn.addEventListener("click", incrementItem.bind(this, undefined, count))
            addBtn.textContent = "Add +"

            itemPriceBox.appendChild(itemPrice)
            itemPriceBox.appendChild(cartOptions)
            itemPriceBox.appendChild(addBtn)

            itemCard.appendChild(itemImage)
            itemCard.appendChild(itemInfo)
            itemCard.appendChild(itemPriceBox)

            return itemCard;
        })
        const itemsContainer = document.createElement("div")
        itemsContainer.id = catagories[i].replace(/ /g, '')
        itemsContainer.className = catagories[i].replace(/ /g, '')
        itemCards.map((item, index) => { itemsContainer.appendChild(item) })
        // const text = `<div id=${catagories[i].replace(/ /g,'')}" class="${catagories[i].replace(/ /g,'')}">
        //     ${itemCards.map(item => item)}   
        // </div>`

        // document.getElementById("food-items").innerHTML = text
        document.getElementById("food-items").appendChild(itemsContainer)
    }
}

let vegData = []

let selectedIndex = 0
var listcards = []

function selectTaste() {
    var categoryList = document.getElementById('category-list');
    vegData.map((item, index) => {
        catagories.push(item.category)

        var listCard = document.createElement('div');
        listCard.setAttribute('class', index === 0 ? 'list-card active' : "list-card");
        listCard.addEventListener("click", () => {
            listcards[selectedIndex].classList.remove("active")
            selectedIndex = index
            listCard.setAttribute("class", "list-card active")
        })

        var listImg = document.createElement('img');
        listImg.src = item.img;

        var listName = document.createElement('span');
        listName.setAttribute('class', 'list-name');
        listName.innerText = item.category;

        listCard.appendChild(listName);
        listCard.setAttribute('onclick', `scrollToElm(".${item.category.replace(/ /g, '')}")`)

        listcards.push(listCard)
    })
    displayItems();
    listcards.map((listCard) => categoryList.appendChild(listCard))
}
getProducts()

