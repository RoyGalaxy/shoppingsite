const mobileInput = document.getElementById("mobileNumber")
const btn = document.getElementById("btn")
const resendBtn = document.querySelector(".resend-button")
const otpInput = document.getElementById("otpInput")
let ele = document.querySelectorAll('.otp-input input');
let otp = ""


let digitValidate = function (elm) {
    elm.value = elm.value.replace(/[^0-9]/g, '');
}

ele.forEach((input,index) => {
    input.addEventListener("keyup", () => {
        const currentInput = input;
        const nextInput = input.nextElementSibling;
        const inputIndex = index;
        if(currentInput.value === ""){
            if(inputIndex!== 0){
                ele[inputIndex - 1].focus()
            }
        }

        if(currentInput.value.length > 1){
            let len = currentInput.value.length
            currentInput.value = currentInput.value.substring(len-1,len)
            console.log(currentInput.value)
        }

        if(nextInput !== null && currentInput.value !== ""){
            if(nextInput.hasAttribute("disabled")){
                nextInput.removeAttribute("disabled")
            }
            nextInput.focus()
        }
        updateOtp()
        if(otp.length === 4) {
            btn.classList.add("active")
        }else{
            btn.classList.remove("active")
        }
    })
})

let updateOtp = () => {
    otp = ""
    for (let i = 0; i < ele.length; i++) {
        otp += ele[i].value
    }
}

resendBtn.addEventListener("click",async () => {
    const phone = mobileInput.value
    // Send a request to backend
    await registerUser(phone)
})

function validatePhoneNumber(input_str) {
    // var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    // const re = /^(?:\971|00971|0)(?:2|3|4|6|7|9|50|51|52|55|56)[0-9]{7}$/

    // return re.test(input_str);
    return true
}

// Event Listeners
btn.addEventListener("click", async function () {
    const phone = mobileInput.value
    if (this.className.includes("otp-submit")) {
        const newUser = await loginUser(phone, otp)
        if (newUser?.accessToken) window.location = "/checkout.html"
        else alert(newUser.message)
        return
    }
    // Process the number and send otp
    if (validatePhoneNumber(phone)) {
        // Send a request to backend
        await registerUser(phone)
        // Show otp inputs
        btn.classList.remove("active")
        otpInput.classList.remove("hide")
        resendBtn.classList.remove("hide")
        document.querySelector(".iti").classList.add("hide")
        document.querySelector("label").classList.add("hide")
        ele[0].focus()
        this.classList.add("otp-submit")
        this.textContent = "Submit OTP"
    } else {
        console.log("Invallid Number")
    }
})