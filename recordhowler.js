
window.onload = function() {
    //Adds click listener to submit button and input
    const submitButton = document.querySelector("#submit");
    const domainInput = document.querySelector("#domain");
    submitButton.addEventListener("click", runHowler);
}

//DNS record lists for comparison
const currentRecords = [];
const neededRecords = [
    {   
        'label': 'A',
        'value':'99.83.190.102'
    },
    {   
        'label': 'A',
        'value':'75.2.70.75'
    },
    {
        'label': 'CNAME',
        'value': 'proxy-ssl.webflow.com.'
    }
];

//Runs the program when the Enter key is pressed
window.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        runHowler();
    }
});

//Caller function to fix timing issues
function runHowler() {
    currentRecords = [];
    getDomains();
    setTimeout(()=>{
        console.log(findMissingRecords(neededRecords, currentRecords));
        ;}, 2000
    );
}

//Gets all the domains
function getDomains() {
    const domainInput = document.querySelector("#domain").value;

    //Clears DOM from previous run
    document.querySelectorAll('.record').forEach(e => e.remove());
    document.querySelectorAll('.expected-record').forEach(e => e.remove());

    if (hasProtocol(domainInput)) {
        if (hasSubdomain(domainInput)) { //if http and www are in the URL
            getRootRecords(getRootDomain(domainInput));
            getSubdomainRecords(getDomain(domainInput));
        } else { //if http is in the URL but www is not
            const domainWithSubdomain = `https://www.${getDomain(domainInput)}`;
            getRootRecords(getRootDomain(domainWithSubdomain));
            getSubdomainRecords(getDomain(domainWithSubdomain));
        }
    } else {
        if (hasSubdomain(domainInput)) { //if http is not in the URL but www is
            const domainWithProtocol = `https://${domainInput}`;
            getRootRecords(getRootDomain(domainWithProtocol));
            getSubdomainRecords(getDomain(domainWithProtocol));
        } else { //if neither http or www are in the URL
            const domainWithEverything = `https://www.${domainInput}`;
            getRootRecords(getRootDomain(domainWithEverything));
            getSubdomainRecords(getDomain(domainWithEverything));
        }
    }
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

function listRootRecords(arr) {
    const thisRecord = {};
    arr.forEach(record => {
        addRecordCard(record.dnsType, record.address);
        thisRecord.label = record.dnsType;
        thisRecord.value = record.address;
        currentRecords.push(thisRecord);
    });
}

function listSubdomainRecords(arr) {
    const thisRecord = {};
    arr.forEach(record => {
        addRecordCard(record.dnsType, record.alias);
        thisRecord.label = record.dnsType;
        thisRecord.value = record.alias;
        currentRecords.push(thisRecord);
    });
}

//Adds current records to the DOM
function addRecordCard(label, value) {
    document.querySelector('.list-label').classList.remove('hide');
    document.querySelector('#records').insertAdjacentHTML('beforeend',
    `
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
    `
    );
    formatRecords();
}

//Formats record boxes based on values
function formatRecords() {
    records = document.querySelectorAll('.record');
    records.forEach( record => {
        if (record.innerText.includes('99.83.190.102') || record.innerText.includes('75.2.70.75') || record.innerText.includes('proxy-ssl.webflow.com')) {
            record.style.backgroundColor = '#38d996';
        } else record.style.backgroundColor = '#ff8a8a';
    });
}

//Lists missing records
function findMissingRecords(needList, currentList) {
    const result = [];
    for (let i = 0; i < needList.length; i++) {
      const needed = needList[i];
      const found = currentList.findIndex(
        record => record.value === needed.value
      );
      if (found === -1) {
        result.push(needed);
      }
    }
    return result;
}

//Adds missing records to the DOM
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

function addAllMissingRecordCards(missingList) {
    findMissingRecords(neededRecords, currentRecords).forEach(record => {
        addMissingRecordCard(record.label, record.value);
    });
}

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