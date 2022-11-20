const generateOTP = (otp_length) => {
    // Declare a digits variable
    // which stores all digits
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otp_length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

async function sendSMS(phone,message){
    const body = {
        MobileNumbers: [`${phone}`],
        Message: message,
        SenderName: "ToBePrecise",
        ReportRequired: true,
    }

    const res = await fetch("https://restapi.tobeprecisesms.com/api/SendSMS/SingleSMS/?Username=testsms&Password=TSpc@9710",{
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(body)
    })
    const jsonRes = await res.json()
    const data = await jsonRes
    return data
}

async function getCredit(){
    try{
        const res = await fetch("https://restapi.tobeprecisesms.com/api/Credits/GetBalance/?Username=testsms&Password=TSpc@9710")
        const jsonRes = await res.json()
        const data = await jsonRes
        return data
    }catch(err){
        console.log(err)
        return false
    }
}

module.exports = {
    generateOTP,
    sendSMS,
    getCredit
}