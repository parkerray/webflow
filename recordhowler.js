
window.onload = function() {
    //Adds click listener to submit button
    const submitButton = document.querySelector("#submit");
    const domainInput = document.querySelector("#domain");
    submitButton.addEventListener("click", runHowler);
}

//Main program
function runHowler() {
    const domainInput = document.querySelector("#domain").value;

    document.querySelectorAll('.record').forEach(e => e.remove());
    document.querySelectorAll('.expected-record').forEach(e => e.remove());

    if (hasProtocol(domainInput)) {
        if (hasSubdomain(domainInput)) {
            getRootRecords(getRootDomain(domainInput));
            getSubdomainRecords(getDomain(domainInput));
        } else {
            const domainWithSubdomain = `https://www.${getDomain(domainInput)}`;
            getRootRecords(getRootDomain(domainWithSubdomain));
            getSubdomainRecords(getDomain(domainWithSubdomain));
        }
    } else {
        if (hasSubdomain(domainInput)) {
            const domainWithProtocol = `https://${domainInput}`;
            getRootRecords(getRootDomain(domainWithProtocol));
            getSubdomainRecords(getDomain(domainWithProtocol));
        } else {
            const domainWithEverything = `https://www.${domainInput}`;
            getRootRecords(getRootDomain(domainWithEverything));
            getSubdomainRecords(getDomain(domainWithEverything));
        }
    }

    findMissingRecords();
}

//Checks if http:// or https:// exist
function hasProtocol(domain) {
    if (domain.includes('http')) {
        return true;
    } return false;
}

//Checks if www exists
function hasSubdomain(domain) {
    if (domain.includes('www')) {
        return true;
    } return false;
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
        mode: 'cors'
    })
    .then(response => response.json())
    .then(data => listRootRecords(data.DNSData.dnsRecords));
}

//Fetches CNAME records from API
function getSubdomainRecords(url) {
    fetch(`https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=at_aXKafoG6V0tpe5ooMU0cxh7TZ0lNA&domainName=${url}&type=CNAME&outputFormat=JSON`, {
        method: 'GET',
        mode: 'cors'
    })
    .then(response => response.json())
    .then(data => listSubdomainRecords(data.DNSData.dnsRecords));
}

let currentRecords = [];

function listRootRecords(arr) {
    arr.forEach(record => {
        console.log(`${record.dnsType} : ${record.address}`);
        addRecordCard(record.dnsType, record.address);
        let thisRecord = {};
        thisRecord.label = record.dnsType;
        thisRecord.value = record.address;
        currentRecords.push(thisRecord);
    });
}

function listSubdomainRecords(arr) {
    arr.forEach(record => {
        console.log(`${record.dnsType} : ${record.alias}`);
        addRecordCard(record.dnsType, record.alias);
        let thisRecord = {};
        thisRecord.label = record.dnsType;
        thisRecord.value = record.alias;
        currentRecords.push(thisRecord);
    });
}

function addRecordCard(label, value) {
    document.querySelector('.list-label').classList.remove('hide');
    document.querySelector('.color-key').classList.remove('hide');
    document.querySelector('#records').insertAdjacentHTML('beforeend', `
        <div class="record">
            <div class="record-info">
                <div class="record-info-label">Type</div>
                <div class="record-info-value">${label}</div>
            </div>
            <div class="record-info">
                <div class="record-info-label">Value</div>
                <div class="record-info-value">${value}</div>
            </div>
        </div>
    `);
    formatRecords();
}

window.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        runHowler();
    }
});

//Gets the allowance left in our DNS account\
/*
function getAllowance() {
    fetch(`https://user.whoisxmlapi.com/service/account-balance?apiKey=at_aXKafoG6V0tpe5ooMU0cxh7TZ0lNA`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => document.querySelector('.allowance').innerText = `${data[9].credits} credits remaining this month`);
    document.querySelector('.allowance').style.removeProperty('hide');
}
*/

//Formats record boxes based on values
function formatRecords() {
    records = document.querySelectorAll('.record');
    records.forEach( record => {
        if (record.innerText.includes('99.83.190.102') || record.innerText.includes('75.2.70.75') || record.innerText.includes('proxy-ssl.webflow.com')) {
            record.style.backgroundColor = '#38d996';
        } else record.style.backgroundColor = '#ff6382';
    });
}

let missingRecords = [
    {   'label': 'A',
        'value':'99.83.190.102'
    },
    {   'label': 'A',
        'value':'75.2.70.75'
    },
    {
        'label': 'CNAME',
        'value': 'proxy-ssl.webflow.com'
    }
];

let currentMissingRecords = missingRecords.filter(x => !currentRecords.includes(x));

//Lists missing records
function findMissingRecords() {
    let currentMissingRecords = missingRecords.filter(x => !currentRecords.includes(x));
    currentMissingRecords.forEach( record => {
        addMissingRecordCard(record.label, record.value);
    });
}

function addMissingRecordCard(label, value) {
    document.querySelector('#missingRecordsLabel').classList.remove('hide');
    document.querySelector('#missingRecords').insertAdjacentHTML('beforeend',
    `
        <div class="expected-record">
            <div class="record-info">
                <div class="record-info-label">Type</div>
                <div class="record-info-value">${label}</div>
            </div>
            <div class="record-info">
                <div class="record-info-label">Value</div>
                <div class="record-info-value">${value}</div>
            </div>
        </div>
    `
    );
}


console.log(currentMissingRecords);