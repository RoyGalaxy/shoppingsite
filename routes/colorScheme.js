const express = require("express")
const router = express.Router()
const {verifyTokenAndAdmin} = require("./verifyToken")
const path = require("path")
const fs = require("fs")
// const hexToHsl = require("")

// :root{
//     --primary: hsl(0, 0%, 100%);
//     --primary-light:hsl(216, 30%, 96%);
//     --primary-text:hsla(0, 0%, 0%, 1);
//     --primary-text-light: hsla(0, 0%, 0%, 0.653);
//     --secondary: hsl(6, 93%, 71%);
//     --secondary-light: hsl(6, 95%, 97.4%);
//     --border-light:hsl(216, 10%, 85%);
//     --green: hsl(137, 55%, 32%);
//     --blue-light: hsl(220, 100%, 96%);
//     --blue: hsl(218, 85%, 54%);
// }

function makeSecondaryColor(colorCode){
    if(colorCode === undefined){
        return false
    }
    let regex = /hsl\(\d+,\s*\d+%,\s*(\d+)/;
    const match = colorCode.match(regex);

    const newLightness = match[1] - 10

    regex = /(^hsl\(\d+,\s*\d+%,\s*)\d+/;
    const newColorCode = colorCode.replace(regex, `$1${newLightness}`);

    console.log(newColorCode);
    return newColorCode
}

router.post("/set",verifyTokenAndAdmin,(req,res) => {
    const obj = req.body
    const data = `:root{
    --primary: ${obj.primary || "hsl(0, 0%, 100%)"};
    --primary-light: ${makeSecondaryColor(obj.primary) || "hsl(216, 30%, 96%)"};
    --primary-text: ${obj.primaryText || "hsla(0, 0%, 0%, 1)"};
    --primary-text-light: ${makeSecondaryColor(obj.primaryText) || "hsla(0, 0%, 0%, 0.653)"};
    --secondary: ${obj.secondary || "hsl(6, 93%, 71%)"};
    --secondary-light: ${makeSecondaryColor(obj.secondary) || "hsl(6, 95%, 97.4%)"};
    --border-light: ${obj.borderLight || "hsl(216, 10%, 85%)"};
    --green: ${obj.green || "hsl(137, 55%, 32%)"};
    --blue-light: ${obj.blueLight || "hsl(220, 100%, 96%)"};
    --blue: ${obj.blue || "hsl(218, 85%, 54%)"};
}
    `    
    fs.writeFile(path.join("public/css/newfile.css"),data,err => {
        if(err){
            console.log(err)
            res.end()
        }else{
            console.log("file written successfully!")
            res.send("Color Scheme Set Successfully")
        }
    })
})

module.exports = router