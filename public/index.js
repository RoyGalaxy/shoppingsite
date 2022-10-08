'use strict'

let cartItems = localStorage.cartItems ? JSON.parse(localStorage.cartItems) : []
const catagories = []

function displayItems(){
    document.getElementById("food-items").innerHTML = ""
    let count = -1
    for(let i = 0;i < catagories.length;i++){
        const foodData = foodItems.filter((item)=>item.category==catagories[i]);
        let itemCards = foodData.map((item) => {
            count += 1
            for(let j = 0;j < cartItems.length;j++){
                if(cartItems[j].name == item.name){
                    item = cartItems[j]
                    break;
                }
            }
            return `<div class="item-card" id="${item.name.replace(/ /g,'')}" onclick="toggleProduct(this.id,event,this)">
                <img src="${item.image}" />
                <div class="item-info">
                    <span id="item-name" class="ellipsis">${item.name}</span>
                    ${item["description - English"] ? `<span id='item-description' class="ellipsis">${item['description']}</span>` : ""}
                </div>
                <div class="item-info item-price-box">
                    <p id="item-price">$${item.price}</p>
                    <span class="cart-options ${(item.quantity > 0 && count !==0)  ? "" : "remove"}">
                        <i class="fa fa-plus" onclick="incrementItem(undefined,${count},this)"></i>
                        <span id="product-quantit">${item.quantity || "0"}</span>
                        <i class="fa fa-minus" onclick="decrementItem(undefined,${count},this)"></i>
                    </span>
                    <span class="add ${(item.quantity > 0 && count !==0) ? "remove" : ""}" onclick="incrementItem(undefined,${count},this.previousSibling)">Add +</span>
                </div>
            </div>`
        })
        const text = `<div id=${catagories[i].replace(/ /g,'')}" class="${catagories[i].replace(/ /g,'')}">
            ${itemCards.map(item => item)}   
        </div>`
        document.getElementById("food-items").innerHTML += text.replace(/>,/g,">")
    }//! One issue over here
}

// `<span class="cart-options">
// <i class="fa fa-plus" onclick="incrementItem(undefined,${count},this)"></i>
// <span id="product-quantity">${item.quantity || "0"}</span>
// <i class="fa fa-minus" onclick="decrementItem(undefined,${count},this)"></i>
// </span>`

let vegData= []

let selectedIndex = 0
var listcards = []

function selectTaste(){
    var categoryList= document.getElementById('category-list');
    vegData.map((item,index)=>{      
        catagories.push(item.category)
        
        var listCard= document.createElement('div');
        listCard.setAttribute('class',index === 0 ? 'list-card active': "list-card");
        listCard.addEventListener("click",() => {
            listcards[selectedIndex].classList.remove("active")
            selectedIndex = index
            listCard.setAttribute("class","list-card active")
        })

        var listImg= document.createElement('img');
        listImg.src= item.img;
    
        var listName= document.createElement('span');
        listName.setAttribute('class','list-name');
        listName.innerText= item.category;
        
        listCard.appendChild(listName);
        listCard.setAttribute('onclick',`scrollToElm(".${item.category.replace(/ /g,'')}")`)
        
        listcards.push(listCard)
    })
    displayItems();
    listcards.map((listCard) => categoryList.appendChild(listCard))
}
getProducts()

