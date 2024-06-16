
const send_button=document.querySelector('.send-button');
const help_button=document.querySelector('.help-button');
const comparison_button=document.querySelector('.comparison-button');
const close_popup_button=document.querySelector(".close_popup")
let current_option=0;
let site_url;
let quizz_data;
close_popup_button.addEventListener('click', ()=>{
    closePopup();
    
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
send_button.addEventListener("click", (ev)=>{
    ev.preventDefault()
    let input_field=document.querySelector('.user-prompt')
    let user_prompt=input_field.value;
    if(user_prompt==='') return;
    document.querySelector(".input-form").classList.add("active")
    setTimeout(() => {
        document.querySelector(".input-form").classList.remove("active")
    }, 500);
    const chatbox=document.querySelector('.chat-window');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message_user';
    messageDiv.textContent = user_prompt;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
    //send prompt to server
    Send_prompt(user_prompt);
    document.querySelector('.user-prompt').value = '';
    //console.log(user_prompt);
});

comparison_button.addEventListener("click", ()=>{
    if(comparison_button.classList.contains("active-button")){
       GetTabel(); 
    }else return;
});

const GetTabel = () =>{
    const url = 'http://192.168.234.4:5000';
    const data = {
        type: "table",
        prompt_sent: prompt,
        pageurl: site_url_processed
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
        //console.log(response)
        return response.json();//.json(); // parses JSON response into native JavaScript objects
    })
    .then(responseData => {
        //console.log(responseData); // handle the data from the response
        Inject_table(responseData);
        //update the content of dialog page
        //ShowTable(responseData)
    })
    .catch(error => {
        console.error('Error returned', error); // handle error
        //ShowTable()
    });
}
const Inject_table = (jsonData) =>{
    let htmlString = '';
    for (let key in jsonData) {
        htmlString += jsonData[key];
    } 
    // Create a new table element
    const table = document.createElement('table');

    // Set the innerHTML of the table to the collected HTML string
    table.innerHTML = htmlString;
    //console.log(table)
    showTabelPopup(table);
}
const ShowTable =()=>{
    console.log("show table called")
    //showPopup()
}
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
    console.log(hostname);
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
        //console.log(response)
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
    site_url_processed=ProcessUrl(site_url);
    const url = 'http://192.168.234.4:5000/';
    const data = {
        type: "response",
        url: site_url_processed,
        answer_sent: answer_arr
    };
    console.log(data);
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
        //console.log(responseData); // handle the data from the response
        Show_final_data(responseData);
        //update the content of dialog page
        //Update_content(responseData)
    })
    .catch(error => {
        console.error('Error returned', error); // handle error
    });
}

const Show_final_data = (responseData) =>{
    const chatbox=document.querySelector('.chat-window');
    let final_answers=responseData;
    function displayMessage(message, isBot = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message_bot';
        messageDiv.innerHTML = message;
        chatbox.appendChild(messageDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
    let final_message='';
    final_answers.forEach(el => {
        final_message += `${el.name} <a href="${el.link}">Link to this product</a><br>`;
    });
    displayMessage(final_message)
}
const DisplayHelp = (currentStep, options) => {
    console.log("display once")
    console.log(currentStep)
    console.log(options["helpinfo"][currentStep]);
    showPopup(options["helpinfo"][currentStep])
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
    help_button.addEventListener("click", ()=>{
        console.log(currentStep);
        DisplayHelp(currentStep, options)
    });
    function showOptions(step) {
        //console.log(options)
        //console.log(options);
        //console.log(steps.length)
        //help_info=options['HELP_INFO']
        ////////display the helping information
        
        //add handling of helping information incoming
        if (step < steps.length-1) {
            const currentOptions = options[steps[step]];
            //console.log(steps[step])
            
                let optionsText = `Please choose a ${steps[step]}:`;
                setTimeout(() => {
                displayMessage(optionsText);
                const optionsContainer = document.createElement('div');
                optionsContainer.className = 'option-buttons';
                currentOptions.forEach(option => {
                    
                    const button = document.createElement('button');
                    button.textContent = option;
                    //console.log(option);
                    button.addEventListener('click', () => {
                        
                        users_choices.push(option);
                        //console.log(users_choices);
                        displayMessage(option, false);
                        current_option++;
                        currentStep++;
                        optionsContainer.remove();
                        showOptions(currentStep);
                        
                        
                    });
                    optionsContainer.appendChild(button);
                });
                chatbox.appendChild(optionsContainer);
                chatbox.scrollTop = chatbox.scrollHeight;
            }, 500); // 500ms delay
            
            

            
        } else {
            Send_answers(users_choices);
            document.querySelector('.comparison-button').classList.add("active-button");
            displayMessage("Thank you for making your selections!");
        }
    }

    // Initialize the chatbot with the first set of options
    showOptions(currentStep);
}


function showPopup(code_to_show) {
    //console.log(code_to_show)
    let show_info=document.createElement('div');
    show_info.classList.add("helping_text");
    show_info.textContent = code_to_show;
    let popup_el = document.getElementById('popup');
    
    popup_el.style.display = 'block';
    popup_el.appendChild(show_info);
    //show_info.remove();
    //console.log(show_info);
}
function showTabelPopup(table){
    console.log(table);
    window.resizeBy(500, 500)
    //document.querySelector('html').style.height=600;
    //document.querySelector('html').style.width=600;
    //browser.windows.getCurrent().then(window => {
    //    browser.windows.update(window.id, { width: 500, height: 600 });
    //});
    //let show_info=document.createElement('div');
    //show_info.classList.add("helping_text");
    //show_info.innerHTML = table;
    let popup_el = document.getElementById('popup');
    document.querySelector("html").classList.add("table_active");
    popup_el.style.display = 'block';
    popup_el.appendChild(table);
}

function closePopup() {
    if(document.querySelector("html").classList.contains("table_active")){
        //browser.windows.getCurrent().then(window => {
        //    browser.windows.update(window.id, { width: 400, height:  472});
        //});
        window.resizeBy(400, 437)
        document.querySelector("html").classList.remove("table_active");
    }
    let popup_el = document.getElementById('popup');
    //console.log(popup_el.lastChild);
    popup_el.removeChild(popup_el.lastChild)
    //popup_el.innerHTML=`<button class="close_popup">Close</button>`;

    popup_el.style.display = 'none';
}







