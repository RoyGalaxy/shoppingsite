const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs")

let data = "Hello new file!!!"

router.post("/set",(req,res) => {
    // Update the file with new colors received
    fs.writeFile(path.join("public/css/newfile.css"),data,err => {
        if(err){
            console.log(err)
        }else{
            console.log("file written successfully!")
        }
    })

    res.end()
})

module.exports = router