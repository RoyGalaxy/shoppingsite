'use strict'

const catagories = []

function displayItems(){
    for(let i = 0;i < catagories.length;i++){
        const foodData = foodItems.filter((item)=>item.category==catagories[i]);
        let itemCards = foodData.map(item => {

            return `<div class="item-card" id="${item.name.replace(/ /g,'')}" onclick="toggleProduct(this.id)">
                <div id="card-top">
                    <i class="fa fa-star" id="rating">${item.rating}</i>
                </div>
                <img src="${item.img}" />
                <p id="item-name">${item.name}</p>
                <p id="item-price">Price : $${item.price}</p>
            </div>`
        })
        const text = `<div id=${catagories[i].replace(/ /g,'')}" class="${catagories[i].replace(/ /g,'')}">
            <p id="category-name">${catagories[i]}</p>
            ${itemCards.map(item => item)}   
        </div>`
        document.getElementById("food-items").innerHTML += text
    }//! One issue over here
}

const vegData= [...new Map(foodItems.map(item=> [item['category'],item])).values()];

function selectTaste(){
    var categoryList= document.getElementById('category-list');
    var listcards = []
    vegData.map(item=>{      
        catagories.push(item.category)
        
        var listCard= document.createElement('div');
        listCard.setAttribute('class','list-card');
    
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
selectTaste();



