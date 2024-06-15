
const send_button=document.querySelector('.send-button');
let site_url;
let quizz_data;

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
send_button.addEventListener("click", (ev)=>{
    ev.preventDefault()
    let user_prompt=document.querySelector('.user-prompt').value;
    //send prompt to server
    Send_prompt(user_prompt);
    //console.log(user_prompt);
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
        type: "category",
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

const Send_answers = (answer_arr) => {
    console.log(answer_arr)
    const url = 'http://192.168.234.4:5000/';
    const data = {
        type: "response",
        answer_sent: "answer_arr"
    };
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
        //Update_content(responseData)
    })
    .catch(error => {
        console.error('Error returned', error); // handle error
    });
}

const Update_content = (responseData) =>{
    const chatbox=document.querySelector('.chat-window');
    let options=responseData;
    let currentStep = 0;
    const steps = Object.keys(options);
    let users_choices=[]
    function displayMessage(message, isBot = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isBot ? 'message_bot' : 'message_user';
        messageDiv.textContent = message;
        chatbox.appendChild(messageDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function showOptions(step) {
        if (step < steps.length) {
            const currentOptions = options[steps[step]];
            let optionsText = `Please choose a ${steps[step]}:`;
            displayMessage(optionsText);

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'option-buttons';
            currentOptions.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.addEventListener('click', () => {
                    users_choices.push(option);
                    //console.log(users_choices);
                    displayMessage(option, false);
                    currentStep++;
                    optionsContainer.remove();
                    showOptions(currentStep);
                });
                optionsContainer.appendChild(button);
            });
            chatbox.appendChild(optionsContainer);
            chatbox.scrollTop = chatbox.scrollHeight;
        } else {
            Send_answers(users_choices);
            displayMessage("Thank you for making your selections!");
        }
    }

    // Initialize the chatbot with the first set of options
    showOptions(currentStep);
}





let next_button=document.querySelector(".next-button");
next_button.addEventListener("click", () =>{
    data={type:"response",
        answers:["Low","Stainless","No steam","Lightweight"]}
    const url = 'http://192.168.234.4:5000/';
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
});