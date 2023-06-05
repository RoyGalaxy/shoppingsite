const getProduct = async (id) => {
    const res = await fetch(`/api/products/find/${id}`)
    const jsonRes = await res.json()
    let product = await jsonRes

    return await product
}

const getAllProducts = async () => {
    const res = await fetch(`/api/products/`)
    const jsonRes = await res.json()
    let products = await jsonRes

    return await products
}

const getUser = async (id) => {
    const user = JSON.parse(localStorage.user)
    const res = await fetch(`/api/users/find/${id}`,
    {
        headers: {token: `Bearer ${user.accessToken}`},
    })
    const jsonRes = await res.json()
    let userRes = await jsonRes

    return await userRes
}

const updateOrder = async(orderId,update) => {
    const user = JSON.parse(localStorage.user)
    const res = await fetch(`/api/orders/${orderId}`,
        {
            method: "put",
            body: JSON.stringify(update),
            headers: {
                "content-type": "application/json",
                token: `Bearer ${user.accessToken}`
            },
        })
    const jsonRes = await res.json()
    let userRes = await jsonRes

    return await userRes
}

const setColorScheme = async () => {
    const data = {
        primary: primaryCP.selectedColor,
        secondary: secondaryCP.selectedColor,
        primaryText: textCp.selectedColor
    }
    const user = JSON.parse(localStorage.user)
    const res = await fetch(`/api/colors/set`,
        {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",
                token: `Bearer ${user.accessToken}`
            },
        })
    const jsonRes = await res.json()
    let colorRes = await jsonRes

    return await colorRes

}