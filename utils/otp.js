require('dotenv').config();

const generateOTP = (otp_length) => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otp_length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

async function sendWhatsapp(phone, otp) {

    const response = await fetch('https://graph.facebook.com/v19.0/177232718809404/messages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "messaging_product": "whatsapp",
            "to": phone,
            "type": "template",
            "template": {
                "name": "otp",
                "language": {
                    "code": "en"
                },
                components: [
                    {
                        type: "body",
                        parameters: [
                            {
                                type: "text",
                                text: otp.toString(),
                            },
                        ],
                    },
                    {
                        type: "button",
                        sub_type: "url",
                        index: "0", // index of the button
                        parameters: [
                            {
                                type: "text",
                                text: otp.toString() // this replaces {{1}} in button URL
                            }
                        ]
                    }
                ]
            },
        })
    })
    const data = await response.json();

    return data
}

// sendWhatsapp("918058523111", "123456");

module.exports = {
    generateOTP,
    sendWhatsapp,
}