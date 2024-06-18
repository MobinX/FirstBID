const showTooltip = (msg, timeout = 3000, autohide = true) => {
    // Create a tooltip 
    var tooltip = document.createElement('div');
    tooltip.style.position = 'fixed';
    tooltip.style.background = 'white';
    tooltip.style.color = 'black';
    tooltip.style.padding = '10px 12px';
    tooltip.style.borderRadius = '10px';
    tooltip.style.zIndex = '10000';
    tooltip.style.bottom = '0px';
    tooltip.style.opacity = '0.2';
    tooltip.style.right = '20px';
    tooltip.style.fontSize = '18px';
    tooltip.style.fontFamily = 'Arial';
    tooltip.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    //set transition
    tooltip.style.transition = 'all 0.8s';
    tooltip.textContent = msg;
    document.body.appendChild(tooltip);
    // Trigger a reflow, flushing the CSS changes
    tooltip.offsetHeight; // jshint ignore:line
    tooltip.style.opacity = '1';
    tooltip.style.bottom = '35px';
    console.log('tooltip created');
    console.log(tooltip);

    const hide = () => {
        tooltip.style.opacity = '0';
        document.body.removeChild(tooltip);
        console.log('tooltip removed');
    }
    // Remove tooltip after 3 seconds
    if (autohide) {
        setTimeout(() => {
            hide();
        }, timeout);
    }
    return hide;
}

const getAIProposal = async (desciption,tamplate,portfolio) => {
    const response = await chrome.runtime.sendMessage({ type: "getAIProposal", desc: desciption , tamplate: tamplate, portfolio: portfolio});
    console.log("response", response.res)
    return response.res;
}


document.addEventListener("readystatechange", async (event) => {
    if (document.readyState === "complete") {
        console.log("document is ready");
        let executed = false;
        let oldHref = document.location.href;
        const bodyElement = document.querySelector("body");
        if (bodyElement) {
            let isFetchingProposal = false;

            console.log("adding observer")
            const observer = new MutationObserver(async () => {
                if (oldHref !== document.location.href) {
                    if (executed) {
                        executed = false;
                    }
                    oldHref = document.location.href;
                }
                let descElm = document.querySelector("fl-bit.ProjectDescription")
                let textarea = document.querySelector("textarea");
                if (descElm !== null && descElm !== undefined && textarea !== null && textarea !== undefined && !executed && !isFetchingProposal) {
                    isFetchingProposal = true;
                    let hideTooltip = showTooltip("Generating proposal ...", 9000, false);
                    let info = await chrome.storage.local.get(['tamplate','portfolio'])
                    if(!info.tamplate || !info.portfolio || info.tamplate === "" || info.portfolio === ""){
                        hideTooltip();
                        showTooltip("Please set tamplate and portfolio in the sidebar", 3000);
                     
                        return;
                    }
                    const response = await getAIProposal(descElm.innerText,info.tamplate,info.portfolio);
                    if(response === "ERROR"){
                        hideTooltip();
                        showTooltip("Error generating proposal", 3000);
                        isFetchingProposal = false;
                        return;
                    }
                    console.log("lol  ......")
                    textarea.value = response;
                    console.log("executed .......", executed)
                    executed = true;
                    descElm = null;
                    textarea = null;
                    isFetchingProposal = false;
                    hideTooltip();
                    showTooltip("Generated", 3000);

                }
            });

            observer.observe(bodyElement, {
                subtree: true,
                childList: true,
            });
        }


    }
});