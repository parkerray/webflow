let neededRecords = [
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

let currentRecords = [
    {   'label': 'A',
        'value':'99.83.109.102'
    },
    {
        'label': 'CNAME',
        'value': 'proxy-ssl.webflow.com'
    }
];

function findMissingRecords(needed, current) {
    let result = [];
    for (let i = 0; i < needed.length; i++) {
        needed.findIndex(function (record) {
            if (record.value === -1) {
                result.push(current[i]);
            };
        })

    } return result;
}

findMissingRecords(neededRecords, currentRecords);

[
    {   
        'label': 'A',
        'value':'99.83.109.102'
    },
    {   
        'label': 'A',
        'value':'75.2.70.75'
    }
]