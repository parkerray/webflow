window.onload = function() {
    //Adds click listener to submit button and input
    const submitButton = document.querySelector("#submit");
    const domainInput = document.querySelector("#domain");
    submitButton.addEventListener("click", runHowler);
    const copyButton = document.querySelector("#copyButton")
    copyButton.addEventListener("click", copy);
}

//DNS record lists for comparison
let currentRecords = [];
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

let issuesFound = [];

//Runs the program when the Enter key is pressed
window.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        runHowler();
    }
});

//Caller function to fix timing issues
function runHowler() {
    currentRecords = [];
    document.querySelector('.loading-animation').classList.remove('hide');
    getDomains();
    setTimeout( () => { 
        addAllMissingRecordCards(); 
        document.querySelector('.loading-animation').classList.add('hide');
        handleResponseFunctions();
    }, 2000 );
}

//Gets all the domains
function getDomains() {
    const domainInput = document.querySelector("#domain").value;

    //Clears DOM from previous run
    document.querySelectorAll('.record').forEach(e => e.remove());
    document.querySelectorAll('.expected-record').forEach(e => e.remove());
    document.querySelectorAll('.list-label').forEach(e => e.classList.add('hide'));
    document.querySelector('#snippet').classList.add('hide');

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
    arr.forEach(record => {
        addRecordCard(record.dnsType, record.address);
        let thisRecord = {};
        thisRecord.label = record.dnsType;
        thisRecord.value = record.address;
        currentRecords.push(thisRecord);
    });
}

function listSubdomainRecords(arr) {
    arr.forEach(record => {
        addRecordCard(record.dnsType, record.alias);
        let thisRecord = {};
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

//Lists incorrect records
function findIncorrectRecords(needList, currentList) {
	return currentList.filter(
		item => !needList.some(i => i.value === item.value)
	)
}

//Lists AAAA records
function findAAAARecords(currentList) {
	return currentList.filter(i => i.label === 'AAAA');
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

function addAllMissingRecordCards() {
    findMissingRecords(neededRecords, currentRecords).forEach(record => {
        addMissingRecordCard(record.label, record.value);
    });
}

/*----------------------------------------------------------------------
This part of the code is where we check for a scenario and offer the right customer response!
----------------------------------------------------------------------*/

function handleResponseFunctions() {
    let incorrectRecords = findIncorrectRecords(neededRecords, currentRecords);
    let missingRecords = findMissingRecords(neededRecords, currentRecords);
    let AAAARecords = findAAAARecords(currentRecords);

    //Creates an array 'issuesFound' of all the record conflicts (missing, incorrect, AAAA)
    function identifyErrors() {
    if (incorrectRecords.length == 0) {
        return false;
    } else {
        issuesFound.push({
            'name': 'incorrect records',
            'records': incorrectRecords
        });
    }
    
    if (missingRecords.length == 0) {
        console.log('no missing records')
    } else {
        issuesFound.push({
            'name': 'missing records',
            'records': missingRecords
        });
    }
    
    if (AAAARecords.length == 0) {
        return false;
    } else {
        issuesFound.push({
            'name': 'AAAA records',
            'records': AAAARecords
        });
    }
}



let responses = [];

const cloudFlareProxyEnabled = (element) => element.name === 'AAAA records';

function writeResponses(issuesFound) {
    if (issuesFound.some(cloudFlareProxyEnabled)) {
        responses.push({
            'issue': 'AAAA records',
            'response': `Your domain appears to be connected through Cloudflare with the Cloudflare Proxy enabled.

Webflow Hosting is not compatible with the Cloudflare Proxy, so we recommend switching your DNS records to "DNS Only." To do that, click on the "orange cloud" next to each Webflow DNS record in your Cloudflare settings.

For reference, here's our full documentation on using Cloudflare with Webflow hosting: Webflow + Cloudflare (https://university.webflow.com/integrations/cloudflare).`
        })
    } else {
        for (let i = 0; i < issuesFound.length; i++) {
            if (issuesFound[i].name === 'incorrect records') {
    
                let recordsToBeListed = issuesFound[i].records;
                let stringRecordsToBeListed = [];
    
                for (let x = 0; x < recordsToBeListed.length; x++) {
                    stringRecordsToBeListed.push(`
Record ${x+1}:
- Type: ${recordsToBeListed[x].label}
- Value: ${recordsToBeListed[x].value}
`)
                }
    
                responses.push({
                    'issue': issuesFound[i].name,
                    'response': `The following DNS records are not Webflow records and should be removed from your domain:

${stringRecordsToBeListed.join(`
`)}`
                })
            } else if (issuesFound[i].name === 'missing records') {
    
                let recordsToBeListed = issuesFound[i].records;
                let stringRecordsToBeListed = [];
    
                for (let x = 0; x < recordsToBeListed.length; x++) {
                    stringRecordsToBeListed.push(`
Record ${x+1}:
- Type: ${recordsToBeListed[x].label}
- Value: ${recordsToBeListed[x].value}
`)
                }
                responses.push({
                    'issue': issuesFound[i].name,
                    'response': `The following DNS records are missing and will need to be added to your domain:

${stringRecordsToBeListed.join(``)}
`
                })
            } else {
                console.log('Something went wrong with the writeResponses function... Sorry :(')
            }
        }
    }
}

identifyErrors();

if (issuesFound.length > 0) {
    writeResponses(issuesFound);
    document.querySelector('#snippet').classList.remove('hide');
}

function combineMiddleText(responses) {
    let onlyResponses = [];
    responses.forEach(element => onlyResponses.push(element.response));
    return onlyResponses.join(`
    `);
}

let introText = `After taking a closer look at the current records that have propagated for your domain, we noticed potential conflicts that will need to be resolved with your domain provider.`

let middleText = combineMiddleText(responses);

let outroText = `Note: These changes will need to be made in your domain provider's settings (not in Webflow).

Once you've made these updates, please allow up to 48 hours for the DNS records to update globally.

If you're still having issues after 48 hours, let us know! If you're able to provide a screenshot of your DNS records, that might help us get to the bottom of things more quickly.`

copyText = `${introText}

${middleText}

${outroText}`

document.querySelector('#copySnippet').innerText = copyText;
} //End of handleResponseFunctions()

function copy() {
    try {
        navigator.clipboard.writeText(copyText);
        copyButton.innerText = 'Copied!';
        resetCopyButton();
    } catch (err) {
        copyButton.innerText = 'Error';
        resetCopyButton();
    }
}

function resetCopyButton() {
    setTimeout( () => {
        copyButton.innerText = 'Copy Snippet';
    }, 2500);
}