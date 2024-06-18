const generate = async (desc) => {
    console.log(desc)
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB4aGfd7YIhJDiOJaFAVh2PzuKr6FaHxxk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "contents": [{
                "parts": [
                    {
                        "text": `
                        Write a short  proposal for this freelance job description: 
                        ${desc} 
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
    if(data.candidates[0]?.content.parts?.length > 0){
        return (JSON.parse(data.candidates[0].content.parts[0].text))?.response;
    }
    return data;
}

//=======================================================
//listen for msg from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.type === "getAIProposal") {
        generate(request.desc).then(response => {
            console.log("responsey", "response")
            sendResponse({res: response}); //send response back to content.js
        });
        return true; // Will respond asynchronously.
    }
});