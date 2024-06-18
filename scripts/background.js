const generate = async (info) => {
    
    const apires = await fetch("https://x.mobin.workers.dev/api/key")
    const apikey = (await apires.json()).apikey;
    console.log(apikey)

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apikey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "contents": [{
                "parts": [
                    {
                        "text": `
                        Write a short  proposal for this freelance job description must be within 1400 characters.: 
                        ${info.desc} 
                        You must use the following tamplate:
                        ${info.tamplate}
                        You must use the following portfolios:
                        ${info.portfolio}
                        
                        Using this JSON schema: 
                            "response": string,
                        Strictly follow the instructions and provide a detailed proposal.
                        `
                    }
                ]
            }],
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_ONLY_HIGH"
                }
            ],
            "generationConfig": {
                "temperature": 1,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
                "response_mime_type": "application/json",
            }
        })
    });

    const data = await response.json();
    console.log(data);
    if(data.candidates){
        return (JSON.parse(data.candidates[0].content.parts[0].text))?.response;
    }
    return "ERROR";
}

//=======================================================
//listen for msg from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.type === "getAIProposal") {
        generate(request).then(response => {
            if(response === "ERROR"){
                sendResponse({type:"error",res: "ERROR"});
                return;
            }
            console.log("responsey", response)
            sendResponse({res: response,type:"ok"}); //send response back to content.js
        });
        return true; // Will respond asynchronously.
    }
});

//side Panel
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));