const send_button=document.querySelector('.submit_button');

console.log(send_button)
send_button.addEventListener("click", ()=>{
    let user_prompt=document.querySelector('.user_prompt').value;
    //send prompt to server
    Send_prompt(user_prompt);
    //console.log(user_prompt);
});

const Send_prompt = (prompt) =>{
    const url = 'http://192.168.137.144:5000';
    const data = prompt;

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
        return response.json(); // parses JSON response into native JavaScript objects
    })
    .then(responseData => {
        console.log(responseData); // handle the data from the response
        //update the content of dialog page
        Update_content(responseData)
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error); // handle error
    });
}

const Update_content = (responseData) =>{

    const place_to_modify=document.querySelector('.dialog');
}