const generateOTP = (otp_length) => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otp_length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

async function sendWhatsapp(phone, message) {

    const response = await fetch('https://graph.facebook.com/v19.0/177232718809404/messages', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer EAAO7ZApFTEgwBO5CnBUpIu1dA4Y3jWo9efsjr7E1xTndLTlTbFAuWncOS1pZCVMvoJG2UZAqySpoOktaV0FGrfvOkOZCjBKX1UZCZBYoXzpiZByU0dUhEDl5HxnQWCvxg0mb0I3JVtq1fqPOmhYHx4neeHuwpP1biPkAhzmuexuLAj4QyjtdMQFII2Lk642KjZBuM2pFYrNZACgmAvC0QjOkZD',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "messaging_product": "whatsapp",
            "to": phone,
            "type": "template",
            "template": {
                "name": "otp",
                "language": {
                    "code": "en_US"
                }
            }
        })
    })
    const data = await response.json();
    console.log(data);

    return data
}

async function getCredit() {
    try {
        const res = await fetch("https://restapi.tobeprecisesms.com/api/Credits/GetBalance/?Username=testsms&Password=TSpc@9710")
        const jsonRes = await res.json()
        const data = await jsonRes
        return data
    } catch (err) {
        console.log(err)
        return false
    }
}

module.exports = {
    generateOTP,
    sendWhatsapp,
    getCredit
}