const submitBtn = document.querySelector("#submitButton");
const inputField = document.querySelector("#inputField");
const manualOutput = document.querySelector("#manualOutput");
const alzaziraOutput = document.querySelector("#alzaziraOutput");
const manualSentsOutput = document.querySelector("#manualSentsOutput");
const addToStockBtns = document.querySelectorAll(".addBtn");
const downloadBtn = document.querySelector("#downloadStock");


//Fetch files

let stock = [];

fetch('./stock.txt').then((resp) => {
    return resp.text();
}).then ((text) => {
    let casedText = text.match(/\b(\w+)\b/g);
    casedText.forEach(word => {
        stock.push(word.toLowerCase());
    });
});

//Search Words On Submit-Button Click

submitBtn.addEventListener("click", finderOnSubmit); 

let manualStock = [];
let manualSents = [];
let manualMatchedSents = [];
function finderOnSubmit (e) {
    let input = inputField.value;

    if (input !== "") {
        manualSents = input.split(/(?<=[.?!]) /g);
        let splitWord = input.match(/\b(\w+)\b/g);
        let allFoundWord = splitWord.filter(x => !stock.includes(x.toLowerCase()));
        let foundWord = [...new Set(allFoundWord)];
        //loop is made on foundWord Variable not manualStock
        for (let i = 0; i < foundWord.length; i++){
            manualStock.push(foundWord[i]);
            const li = document.createElement("li");
            li.innerHTML = foundWord[i];
            manualOutput.appendChild(li);
        }
        inputField.value = "";
        // Print Sentences
        getSentence(manualStock, manualSents, manualSentsOutput, manualMatchedSents);
    } else {
        alert("Wow! I Have No Input.")
    }
};


// Handle Success Message

const successDiv = document.createElement("div");
successDiv.setAttribute("id", "successDiv");
const successMsg = document.createElement("p");
successMsg.innerHTML = "Added Successfully!"
successDiv.appendChild(successMsg);

function handleSuccessMsg(e) {
    e.target.parentElement.appendChild(successDiv);
    setTimeout(() => {
        e.target.parentElement.removeChild(successDiv);
    }, 3000);
}


// Print the sentences

let startIndex = 0;
function getSentence(subStock, newsSents, outputElem, sentsId) {
    for(let i = 0; i < subStock.length; i++) {
        for(let j = 0; j < newsSents.length; j++) {
            let crntSent = newsSents[j];
            let crntSubStock = subStock[i];
            let found = crntSent.indexOf(crntSubStock);

            if(found !== -1){
                sentsId.push(crntSent);
            }
        }
    }
    let uniqSentsArr = [...new Set(sentsId)];
    for (let k = startIndex; k < uniqSentsArr.length; k++) {
        let li = document.createElement("li");
        li.innerHTML = uniqSentsArr[k];
        outputElem.appendChild(li);
        startIndex++;
    }    
}


//On every 4 add button-click, subStock Pushed to main Stock

addToStockBtns.forEach (ab => {
    ab.addEventListener("click", (e) => {
        let stockIdString = e.target.id;
        let subStock = eval(stockIdString);
        
        let lowCasedSubStock = [];
        subStock.forEach(word => {
            lowCasedSubStock.push(word.toLowerCase());
        });
        stock.push(...lowCasedSubStock);
        // stock.push(...subStock);

        if(subStock.length !== 0) {
            if(e.target.id !== "manualStock"){e.target.disabled = true};
            // alert(`Successfully added!`);
            handleSuccessMsg(e);
            console.log(stock);
        } else {alert`Plesase, select the newspaper or input manually.`};
        subStock.length = 0;
    }); 
});


// Downloader Function

function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/SecurityPolicyViolationEvent;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}


// Call to download

downloadBtn.addEventListener('click', () => {
    let words = stock.join(" ");
    download("stock.txt", words);
});
