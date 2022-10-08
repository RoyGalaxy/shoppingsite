const getProduct = async (id) => {
    const res = await fetch(`/api/products/find/${id}`)
    const jsonRes = await res.json()
    let product = await jsonRes

    return await product
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