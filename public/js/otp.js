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
}

function validatePhoneNumber(input_str) {
    // var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    // const re = /^(?:\971|00971|0)(?:2|3|4|6|7|9|50|51|52|55|56)[0-9]{7}$/

    // return re.test(input_str);
    return true
  }
