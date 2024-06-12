import axios from 'axios';

app.get("/webhook", (req,res) => {
    let mode = req.query["hub.mode"]
    let challenge = req.query["hub.challenge"]
    let token = req.query["hub.verify_token"]

    if(!mode || token != process.env.WHATSAPP_WEBHOOK_TOKEN){
        res.status(403).end();
        return;
    }
    if(mode == "subscribe"){
        res.status(200).send(challenge)
    }
})

app.post("/webhook", (req,res) => {
    let body = req.body;
    console.log(JSON.stringify(body,null,2))

    if(body.object){
        if(
            body.entry &&
            body.entry[0]?.changes&&
            body.entry[0].changes[0]?.value?.messages &&
            body.entry[0].changes[0]?.value?.messages[0]
        ){
            let phone_no = body.entry[0].challenge[0].value.metadata.phone_number_id;
            let from = body.entry[0].challenge[0].value.messages[0].from;
            let msg_body = body.entry[0].challenge[0].value.messages[0].text.body;          

            axios({
                method: "POST",
                url: "https://graph.facebook.com/v19.0/177232718809404/messages?access_token="+process.env.WHATSAPP_API_TOKEN,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body
                    }
                }
            })
            
        }
    }
})