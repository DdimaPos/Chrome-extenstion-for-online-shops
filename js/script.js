/*chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
    const activeTabId = tabs[0].id;
    chrome.storage.sync.get(null, () => {
      chrome.runtime.sendMessage({type: 'getTabData'}, response => {
        const data = response.tabData[activeTabId];
        console.log(data);
      });
    });
});*/
const send_button=document.querySelector('.send-button');
let site_url;

send_button.addEventListener("click", (ev)=>{
    ev.preventDefault()
    let user_prompt=document.querySelector('.user-prompt').value;
    //send prompt to server
    Send_prompt(user_prompt);
    //console.log(user_prompt);
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ type: 'getCurrentTabUrl' }, response => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
        site_url = response.url;
        //console.log(site_url);
    });
});

function ProcessUrl (unprocessed){
    //console.log(unprocessed)
    //console.log("called")
    
    let hostname = unprocessed.split("://")[1];
    let index = hostname.indexOf('/');
    //console.log(index)
    hostname = hostname.substring(0, index)
    //console.log(hostname)
    if (hostname.startsWith('www.')) {
        hostname = hostname.slice(4);
    }

    return hostname;
    
}


const Send_prompt = (prompt) =>{
    const url = 'http://192.168.234.4:5000/';
    //console.log(site_url)
    site_url_processed=ProcessUrl(site_url);
    //console.log(site_url_processed)
    
    const data = {
        prompt_sent: prompt,
        pageurl: site_url_processed
    };
    //console.log(data)
    //console.log(current_url)
    fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'tipo token avtorizatii'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        console.log(response)
        return response.json(); // parses JSON response into native JavaScript objects
    })
    .then(responseData => {
        console.log(responseData); // handle the data from the response
        //update the content of dialog page
        Update_content(responseData)
    })
    .catch(error => {
        console.error('Error returned', error); // handle error
    });
}

const Update_content = (responseData) =>{

    const place_to_modify=document.querySelector('.dialog');
}