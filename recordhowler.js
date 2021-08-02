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
    .then(data => listRootRecords(data.DNSData.dnsRecords));
}

//Fetches CNAME records from API
function getSubdomainRecords(url) {
    fetch(`https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=at_aXKafoG6V0tpe5ooMU0cxh7TZ0lNA&domainName=${url}&type=CNAME&outputFormat=JSON`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => listSubdomainRecords(data.DNSData.dnsRecords));
}

function listRootRecords(arr) {
    arr.forEach(record => {
        console.log(`${record.dnsType} : ${record.address}`);
        addRecordCard(record.dnsType, record.address);
    });
}

function listSubdomainRecords(arr) {
    arr.forEach(record => {
        console.log(`${record.dnsType} : ${record.alias}`);
        addRecordCard(record.dnsType, record.alias);
    });
}

function addRecordCard(label, value) {
    document.querySelector('.list-label').style.removeProperty('hide');
    document.querySelector('#records').insertAdjacentHTML('beforeend', `
        <div class="record">
            <div class="record-info">
                <div class="record-info-label">Type</div>
                <div class="record-info-label">${label}</div>
            </div>
            <div class="record-info">
                <div class="record-info-label">Value</div>
                <div class="record-info-label">${value}</div>
            </div>
        </div>
    `);
}

console.log(`the end`);