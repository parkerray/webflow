console.log(`Hello world`);

//Adds click listener to submit button
document.getElementById("domain").addEventListener("click", runHowler);

//Main program
function runHowler() {
    const domain = document.getElementById("domain").value;
    console.log(domain);
}

//Fetches records from API
function getRecords() {
    fetch('', {
        method: 'GET',
        headers: {'Accept' : 'application/json'}
    })
    .then(response => response.json())
    .then(data => document.getElementById("joke-text").innerHTML = `${data.x}`);
}

console.log(`the end`);