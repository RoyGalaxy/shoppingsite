'use strict'

// import {foodItems} from './food_items.js'
const catagories = []

function displayItems(){
    for(let i = 0;i < catagories.length;i++){
        const foodData = foodItems.filter((item)=>item.category==catagories[i]);
        let itemCards = foodData.map(item => {

            return `<div id="item-card">
                <div id="card-top">
                    <i class="fa fa-star" id="rating">${item.rating}</i>
                </div>
                <a href="#" class='item-card-link' id="${item.name.replace(/ /g,'')}" onclick="toggleProductPage(this.id)">
                    <img src="${item.img}" />
                    <p id="item-name">${item.name}</p>
                    <p id="item-price">Price : $${item.price}</p>
                </a>
            </div>`
        })
        const text = `<div id=${catagories[i].replace(/ /g,'')}" class="${catagories[i].replace(/ /g,'')}">
            <p id="category-name">${catagories[i]}</p>
            ${itemCards.map(item => item)}    
        </div>`
        document.getElementById("food-items").innerHTML += text
    }
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
        
        listCard.appendChild(listImg);
        listCard.appendChild(listName);
        listCard.setAttribute('onclick',`document.querySelector(".${item.category.replace(/ /g,'')}").scrollIntoView({behavior: "smooth"})`)
        
        listcards.push(listCard)
    })
    displayItems();
    listcards.map((listCard) => categoryList.appendChild(listCard))
}
selectTaste();


document.querySelectorAll('.add-to-cart').forEach(item=>{
    item.addEventListener('click',addToCart)
})

var cartData = [];
function addToCart(){
    var itemToAdd= this.id
    var itemObj= foodItems.find(element=>element.name.replace(/ /g,"")==itemToAdd);

    var index= cartData.indexOf(itemObj);
    if(index=== -1){
        cartData.push(itemObj)
    }
    else if(index > -1){
        cartData.splice(index,1)
    }
    document.getElementById(this.id).classList.toggle('toggle-heart');
    document.getElementById('cart-plus').innerText=
    ' ' + cartData.length + ' Items';
    totalAmount();
    cartItems();
}


function cartItems(){
    var tableBody=  document.getElementById('table-body');
    tableBody.innerHTML= '';

    cartData.map(item=> {
        var tableRow= document.createElement('tr');
        
        var rowData1= document.createElement('td');
        var img= document.createElement('img');
        img.src= item.img;
        rowData1.appendChild(img);
    
        var rowData2= document.createElement('td');
        rowData2.innerText= item.name;
        
        var rowData3= document.createElement('td');
        var btn1= document.createElement('button');
        btn1.setAttribute('class','decrease-item');
        btn1.innerText= '-';
        var span= document.createElement('span');
        span.innerText= item.quantity;
        var btn2= document.createElement('button');
        btn2.setAttribute('class','increase-item');
        btn2.innerText= '+';
        
        rowData3.appendChild(btn1);
        rowData3.appendChild(span);
        rowData3.appendChild(btn2);
    
        var rowData4= document.createElement('td');
        rowData4.innerText= item.price;
    
        tableRow.appendChild(rowData1);
        tableRow.appendChild(rowData2);
        tableRow.appendChild(rowData3);
        tableRow.appendChild(rowData4);
    
        tableBody.appendChild(tableRow);
    })
    document.querySelectorAll('.increase-item').forEach(item=>{
        item.addEventListener('click',incrementItem)
    })

    document.querySelectorAll('.decrease-item').forEach(item=>{
        item.addEventListener('click',decrementItem)
    })
}


function incrementItem(){
    let itemToInc= this.parentNode.previousSibling.innerText;
    var incObj= cartData.find(element=>element.name==itemToInc);
    incObj.quantity+=1;
    
    currPrice= (incObj.price*incObj.quantity - incObj.price*(incObj.quantity-1))/(incObj.quantity-1);
    incObj.price= currPrice*incObj.quantity;
    totalAmount()
    cartItems();
}

var currPrice= 0;
function decrementItem(){
    let itemToInc= this.parentNode.previousSibling.innerText;
    let decObj= cartData.find(element=>element.name==itemToInc);
    let ind= cartData.indexOf(decObj);
    if(decObj.quantity >1){
        currPrice= (decObj.price*decObj.quantity - decObj.price*(decObj.quantity-1))/(decObj.quantity);
        decObj.quantity-= 1;
        decObj.price= currPrice*decObj.quantity;
    }
    else{
        document.getElementById(decObj.name.replace(/ /g,"")).classList.remove('toggle-heart')
        cartData.splice(ind,1);
        document.getElementById('cart-plus').innerText= ' ' + cartData.length + ' Items';
        if(cartData.length < 1 && flag){
            document.getElementById('food-items').classList.toggle('remove');
            document.getElementById('category-list').classList.toggle('remove');
            document.getElementById('cart-page').classList.toggle('remove');
            document.getElementById('checkout').classList.toggle('remove');
            flag= false;
            console.log(flag)
        }
    }
    totalAmount()
    cartItems()
}

function totalAmount(){
    var sum=0;
    cartData.map(item=>{
        sum+= item.price;
    })
    document.getElementById('total-item').innerText= 'Total Item : ' + cartData.length;
    document.getElementById('total-price').innerText= 'Total Price : $ ' + sum;
    document.getElementById('m-total-amount').innerText= 'Total Price : $ ' + sum;
}

var flag= false;
function cartToggle(){
    if(cartData.length > 0){
        document.getElementById('food-items').classList.toggle('remove');
        document.getElementById('category-list').classList.toggle('remove');
        document.getElementById('cart-page').classList.toggle('remove');
        document.getElementById('checkout').classList.toggle('remove');
        flag= true;
        console.log(flag)
    }
    else{
        alert("Currently no item in cart!");
    }
}

function toggleMenu(){
    document.getElementById("menu").classList.toggle("active")
}

window.onload = function(){
    // addEvents()
}

function addEvents(){
    document.getElementById('m-cart-btn').addEventListener('click',cartToggle);
    document.getElementById('menu-cart-btn').addEventListener('click',cartToggle);
    
    document.querySelectorAll('.add-to-cart').forEach(item=>{
        item.addEventListener('click',addToCart)
    });
    // document.querySelectorAll('.item-card-link').forEach(item=>{
    //     item.addEventListener('click',toggleProductPage(this))
    // });
    document.querySelectorAll('.increase-item').forEach(item=>{
        item.addEventListener('click',incrementItem)
    })

    document.querySelectorAll('.decrease-item').forEach(item=>{
        item.addEventListener('click',decrementItem)
    })
    document.getElementById("menu-toggle-btn").addEventListener("click",() => {
        toggleMenu()
    })
}
