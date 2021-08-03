let neededRecords = [
    {label: 'A', value: '99.83.190.102'},
    {label: 'A', value: '75.2.70.75'},
    {
      label: 'CNAME',
      value: 'proxy-ssl.webflow.com',
    },
  ];
  let currentRecords = [
    {label: 'A', value: '99.83.109.102'},
    {
      label: 'CNAME',
      value: 'proxy-ssl.webflow.com',
    },
  ];
  function findMissingRecords(needList, currentList) {
    let result = [];
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
  const missing = findMissingRecords(neededRecords, currentRecords);
  console.log(missing);