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
    for(let i = 0;i < ele.length;i++){
        otp += ele[i].value
    }
    console.log(otp)
}

function validatePhoneNumber(input_str) {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    return re.test(input_str);
  }
