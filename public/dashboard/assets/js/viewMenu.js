const user = localStorage.user ? JSON.parse(localStorage.getItem("user")) : {}
var selectedProduct;
const form = document.getElementById("updateDish")
const nameElm = document.getElementById("name")
const descriptionElm = document.getElementById("description")
const categoryElm = document.getElementById("category")
const priceElm = document.getElementById("price")
const imageElm = document.getElementById("image")
const modelElm = document.getElementById("model3d")

function toggleProductForm(product) {
    selectedProduct = product

    document.getElementById("updateForm").classList.toggle("d-none")
    document.getElementById("productList").classList.toggle("d-none")

    nameElm.value = product.name
    descriptionElm.value = product.description
    categoryElm.value = product.catagory
    priceElm.value = product.price
    imageElm.value = ""
    modelElm.value = ""
}

getAllProducts()
    .then(products => {
        for (let i = 0; i < products.length; i++) {
            const productElm = document.createElement("div")
            productElm.className = "content active"

            const wrapper = document.createElement("div")
            wrapper.className = "wrapper"

            const avatar = document.createElement("div")
            avatar.className = "avatar flex-shrink-0 me-3"

            const avatarInitial = document.createElement("img")
            avatarInitial.src = products[i].image
            avatarInitial.className = "avatar-initial rounded bg-label-primary"

            let icon = document.createElement("i")
            icon.className = "bx bx-mobile-alt"

            avatar.appendChild(avatarInitial)
            avatar.appendChild(icon)
            wrapper.appendChild(avatar)

            const bodyWrapper = document.createElement("div")
            bodyWrapper.className = "d-flex w-100 flex-wrap align-items-center justify-content-between gap-2"

            const productDetail = document.createElement("div")
            productDetail.className = "me-2"

            const productName = document.createElement("h6")
            productName.className = "mb-0"
            productName.textContent = products[i].name

            const productCategory = document.createElement("small")
            productCategory.className = "text-muted"
            productCategory.textContent = products[i].catagory

            productDetail.appendChild(productName)
            productDetail.appendChild(productCategory)
            bodyWrapper.appendChild(productDetail)

            const userProgress = document.createElement("div")
            userProgress.className = "options"

            const editIcon = document.createElement("i")
            editIcon.className = "bx bx-edit"
            editIcon.addEventListener("click", () => {
                toggleProductForm(products[i])
            })

            const deleteIcon = document.createElement("i")
            deleteIcon.className = "bx bx-trash"
            deleteIcon.addEventListener("click",async () => {
                if(confirm(`Do you really want to delete ${products[i].name || 'dish'}`)){
                    await fetch(`/api/products/${products[i]._id}`,{
                        method: "DELETE",
                        headers: {token: `Bearer ${user.accessToken}`}
                    })
                    location.reload()
                }
            })

            userProgress.appendChild(editIcon)
            userProgress.appendChild(deleteIcon)
            bodyWrapper.appendChild(userProgress)

            wrapper.appendChild(bodyWrapper)
            productElm.appendChild(wrapper)

            productsContainer.appendChild(productElm)
        }
    })

form.onsubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const user = JSON.parse(localStorage.user)

    const res = await fetch(`/api/products/${selectedProduct._id}`, {
        method: "put",
        headers: {
            token: `Bearer ${user.accessToken}`
        },
        body: formData
    }).catch(err => console.log(err))
    const jsonRes = res.json()
    jsonRes.then(data => {
        if (data.price) {
            alert("Product has been updated")
            window.location = "/dashboard/html/viewMenu.html"
        } else {
            alert("Error Updating Product")
            conosle.log(jsonRes)
        }
    })
}