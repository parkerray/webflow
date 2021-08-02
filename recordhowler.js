console.log(`Hello world`);


window.onload = function() {
    //Adds click listener to submit button
    const submitButton = document.querySelector("#submit");
    const domainInput = document.querySelector("#domain");
    submitButton.addEventListener("click", runHowler);
}

//Main program
function runHowler() {
    const domainInput = document.querySelector("#domain").value;
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
    const hostName = getDomain(domain);
    const rootDomain = hostName.split('.').slice(1);
    return rootDomain.join('.');
}

//Fetches A & AAAA records from API
function getRootRecords(url) {
    fetch(`https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=at_aXKafoG6V0tpe5ooMU0cxh7TZ0lNA&domainName=${url}&type=A,AAAA&outputFormat=JSON`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => listRecords(data.DNSData.dnsRecords));
}

//Fetches CNAME records from API
function getSubdomainRecords(url) {
    fetch(`https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=at_aXKafoG6V0tpe5ooMU0cxh7TZ0lNA&domainName=${url}&type=CNAME&outputFormat=JSON`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => listRecords(data.DNSData.dnsRecords));
}

function listRecords(arr) {
    arr.forEach(record => {
        console.log(`${record.dnsType} : ${record.address}`)
    });
    console.log(arr);
}

console.log(`the end`);