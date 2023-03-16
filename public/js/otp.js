const mobileInput = document.getElementById("mobileNumber")
const btn = document.getElementById("btn")
const otpInput = document.getElementById("otpInput")
let ele = document.querySelectorAll('input.otp');
let otp = ""


let digitValidate = function (elm) {
    elm.value = elm.value.replace(/[^0-9]/g, '');
}

let tabChange = function (val) {
    ele = document.querySelectorAll('input.otp');
    if (ele[val - 1].value != '') {
        ele[val].focus()
    } else if (ele[val - 1].value == '') {
        ele[val - 2].focus()
    }
}

let updateOtp = () => {
    otp = ""
    for (let i = 0; i < ele.length; i++) {
        otp += ele[i].value
    }
}

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
        return
    }
    // Process the number and send otp
    if (validatePhoneNumber(phone)) {
        // Send a request to backend
        await registerUser(phone)
        // Show otp inputs
        otpInput.classList.remove("hide")
        document.querySelector(".iti").classList.add("hide")
        document.querySelector("label").classList.add("hide")
        this.classList.add("otp-submit")
        this.textContent = "Verify OTP"
    } else {
        console.log("Invallid Number")
    }
})