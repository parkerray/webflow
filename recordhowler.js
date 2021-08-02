console.log(`Hello world`);


window.onload = function() {
    //Adds click listener to submit button
    const submitButton = document.querySelector("#submit");
    const domainInput = document.querySelector("#domain");
    submitButton.addEventListener("click", runHowler);
}

//Main program
function runHowler() {
    const domainInput = document.querySelector("#domain");
    getRootRecords(getRootDomain(domainInput));
    getSubdomainRecords(getDomain(domainInput));
}

//Gets the domain without http:// or https://
function getDomain(url) {
    const domain = new URL(url);
    return domain.hostname;
};

//Gets the root domain without a subdomain
function getRootDomain(domain) {
    const rootDomain = domain.split(".").slice(1);
    return rootDomain.join('');
}

//Fetches A & AAAA records from API
function getRootRecords(url) {
    fetch(`https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=at_aXKafoG6V0tpe5ooMU0cxh7TZ0lNA&domainName=${url}&type=A,AAAA&outputFormat=JSON`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => listRecords(data));
}

//Fetches CNAME records from API
function getSubdomainRecords(url) {
    fetch(`https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=at_aXKafoG6V0tpe5ooMU0cxh7TZ0lNA&domainName=${url}&type=CNAME&outputFormat=JSON`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => listRecords(data));
}

//Lists DNS records
function listRecords(data) {
    for (const key in data){
        if(obj.hasOwnProperty(key)){
        console.log(`${key} : ${data[key]}`)
    }
  }
}

listRecords();
console.log(`the end`);