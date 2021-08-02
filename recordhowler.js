console.log(`Hello world`);

window.onload = function() {
    //Adds click listener to submit button
    const submitButton = document.querySelector("#submit");
    submitButton.addEventListener("click", runHowler);
}

//Main program
function runHowler() {
    const domain = document.getElementById("domain").value;
    console.log(domain);
}

//Fetches records from API
function getRecords() {
    fetch('https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=at_aXKafoG6V0tpe5ooMU0cxh7TZ0lNA&domainName=adalocado.com&type=_all', {
        method: 'GET',
        headers: {'Accept' : 'application/json'}
    })
    .then(response => response.json())
    .then(data => console.log(data));
}

console.log(`the end`);