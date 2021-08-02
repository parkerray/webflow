console.log(`Hello world`);


window.onload = function() {
    //Adds click listener to submit button
    const submitButton = document.querySelector("#submit");
    submitButton.addEventListener("click", runHowler);
}

//Main program
function runHowler() {
    const domain = document.getElementById("domain").value;
    getRecords();
    console.log(domain);
}

//Gets the root domain without http://, https://, or any subdomains
function getRootDomain(url) {
        const r =  /.*\.([^.]*[^0-9][^.]*\.[^.]*[^.0-9][^.]*$)/;
        return s.replace(r, '$1');
};


//Fetches records from API
function getRecords() {
    fetch('https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=at_aXKafoG6V0tpe5ooMU0cxh7TZ0lNA&domainName=adalocado.com&type=A,AAAA,CNAME&outputFormat=JSON', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => console.log(data));
}

console.log(getRootDomain(`https://www.adalocado.com/test`));
console.log(`the end`);