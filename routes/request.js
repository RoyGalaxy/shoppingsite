
async function getProducts(){
    const res = await fetch('http://127.0.0.1:3000/api/products/',{
        method: 'GET'
    });
    const jsonRes = await res.json();

    return (jsonRes);

}

getProducts()
    .then(data => {
        data.forEach(async function(entry, index){
            const form = {
                // image: entry.image.replace('.jpeg','.jpg') 
                image: 'Hello World'
            }

            let bodyContent = new FormData();
            // bodyContent.append('image',entry.image.replace('.jpeg','.jpg'))
            bodyContent.append('image','/image/1QCFCk1SDXlEoHVwIAyHLjscmJ2ngRO2a.jpg')

            let headersList = {
                "token": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NzVkMzViNjY4YTVjYWQ3NTc2YTdiZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwMzY0NzAyNywiZXhwIjoxNzA2MjM5MDI3fQ.9HBECt2G6CLvSxoFl2um0R7q76qB_3dkf4q8bnrxv3k`,
               }
            
            await fetch(`http://127.0.0.1:3000/api/products/${entry._id}`,{
                method: 'PUT',
                'Content-Type': 'application/json',
                body: bodyContent,
                headers: headersList
            })
        })
    })

