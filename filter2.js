const alzaziraOutput = document.querySelector("#alzaziraOutput");
const bbcOutput = document.querySelector("#bbcOutput");
const starOutput = document.querySelector("#starOutput");
const alzaziraSentsOutput = document.querySelector("#alzaziraSentsOutput");
const bbcSentsOutput = document.querySelector("#bbcSentsOutput");
const starSentsOutput = document.querySelector("#starSentsOutput");
const newspapers = document.querySelectorAll(".newspaper");
const alzaziraStockBtn = document.querySelector("#alzaziraStock");
const bbcStockBtn = document.querySelector("#bbcStock");
const starStockBtn = document.querySelector("#starStock");
const addToStockBtns = document.querySelectorAll(".addBtn");
const downloadBtn = document.querySelector("#downloadStock");


//Fetch files

let stock = [];
let alzaziraNews = [];
let bbcNews = [];
let starNews = [];
let alzaziraNewsSents = [];
let bbcNewsSents = [];
let starNewsSents = [];

fetch('./stock.txt').then((resp) => {
    return resp.text();
}).then ((text) => {
    let casedText = text.match(/\b(\w+)\b/g);
    casedText.forEach(word => {
        stock.push(word.toLowerCase());
    });
});
fetch('./starnews.txt').then((resp) => {return resp.text() }).then((text) => {
    starNewsSents = text.split(/(?<=[.?!]) /g);
    starNews = text.match(/\b(\w+)\b/g);
});
fetch('./bbcNews.txt').then((resp) => {return resp.text() }).then((text) => {
    bbcNewsSents = text.split(/(?<=[.?!]) /g);
    bbcNews = text.match(/\b(\w+)\b/g);
});
fetch('./alzaziraNews.txt').then((resp) => {return resp.text() }).then((text) => {
    alzaziraNewsSents = text.split(/(?<=[.?!]) /g);
    alzaziraNews = text.match(/\b(\w+)\b/g);
});


//Search Words On NewsPaper-Button Click

newspapers.forEach (np => {
    np.addEventListener("click", finderOnNewsClick); 
});

let alzaziraStock = [];
let bbcStock = [];
let starStock = [];
let bbcMatchedSents = [];
let starMatchedSents = [];
let alzaziraMatchedSents = [];
function finderOnNewsClick (e) {
    let inputVal;
    let newsIdString = `${e.target.id}News`;
    inputVal = eval(newsIdString);
    e.target.disabled = true;
    
    //Assumed, news has already been splited into string!
    // let foundWordFromNewspaper = inputVal.filter(x => !stock.includes(x));
    let allFoundWordFromNewspaper = inputVal.filter(x => !stock.includes(x.toLowerCase()));
    let foundWordFromNewspaper = [...new Set(allFoundWordFromNewspaper)];
    let stockIdString = `${e.target.id}Stock`;
    let subStock = eval(stockIdString);
    subStock.push(...foundWordFromNewspaper);
    //loop is made on foundWord Variable not on subStock!
    for (let i = 0; i < foundWordFromNewspaper.length; i++){
        const li = document.createElement("li");
        li.innerHTML = foundWordFromNewspaper[i];
        let outputIdString = `${e.target.id}Output`;
        let outputElem = eval(outputIdString);
        outputElem.appendChild(li);        
    }
    // Print Sentences
    let newsSents = eval(`${e.target.id}NewsSents`);
    let outputElem = eval(`${e.target.id}SentsOutput`);
    let sentsId = eval(`${e.target.id}MatchedSents`);
    getSentence(subStock, newsSents, outputElem, sentsId);
};


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
