var Percentage = 1;
var base = "CNY";
var target = "EUR";
var Rate;
var name = "";
var before = 0;
var after = 0;
var currBefore = "RMB";
var currAfter = "EUR";
var storNum = 1;
var currOneSum = 0;
var currTwoSum = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setRate() {
    await sleep(500);
    var selectElement = document.getElementById("secondary");
    target = (selectElement.value);
    var tocurr = (selectElement.value);

    fetch(`https://exchange-rates.abstractapi.com/v1/live/?api_key=daaa52fb144545498fe37e279f5c200b&base=${base}&target=${target}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            console.log(tocurr)
            Rate = parseFloat(data["exchange_rates"][tocurr]);
            console.log(Rate)
            getRate()
            saveNumber()
        })
        .catch(error => {
            console.error('Error:', error);
        });

}
function getRate() {
    return Rate
}

console.log(Rate)

function saveNumber() {
    var numberInput = document.getElementById("amount")
    var number = parseFloat(numberInput.value);

    var afterExchange = ((number * getRate()) * Percentage).toFixed(2);

    let result = document.getElementById("result")
    result.value = afterExchange;
    console.log(result.value)
}

function changeCurrency() {
    var selectElementSecondary = document.getElementById("secondary");
    target = (selectElementSecondary.value);

    var selectElementPrimary = document.getElementById("primary");
    base = (selectElementPrimary.value);
}

function changePercentage() {
    var selectElement = document.getElementById("PercentageValue");
    Percentage = parseFloat(selectElement.value);
}

function addItem(item) {
    var getMainDiv = document.getElementById("saveItemDiv");

    var saveStorage = document.createElement('div');
    saveStorage.classList.add("saveStorage")
    saveStorage.id = `deleteId${storNum}`
    console.log(`Created element with ID: deleteId${storNum}`);
    getMainDiv.appendChild(saveStorage)

    var captions = document.createElement('div');
    captions.classList.add("captions")
    saveStorage.appendChild(captions)

    var saveModule = document.createElement('div');
    saveModule.classList.add("saveModule")
    saveStorage.appendChild(saveModule)

    captions.innerHTML = "<p style=\"margin: 5px 10px\">#</p><p>Name</p>"

    if (item) {
        storNum = item.id;
        currBefore = item.currBefore;
        currAfter = item.currAfter;
        name = item.name;
        before = item.before;
        after = item.after;
    } else {
        var getCurrBefore = document.getElementById("primary");
        currBefore = (getCurrBefore.value);

        var getCurrAfter = document.getElementById("secondary");
        currAfter = (getCurrAfter.value)

        var getName = document.getElementById("inputSkinName");
        name = (getName.value)

        var getBefore = document.getElementById("amount");
        before = (getBefore.value)

        var getAfter = document.getElementById("result");
        after = (getAfter.value)
    }

    let curBefore = document.createElement("p");
    curBefore.id = `curBefore${storNum}`;
    curBefore.classList.add("curBefore")
    curBefore.innerText = currBefore;
    captions.appendChild(curBefore)

    let curAfter = document.createElement("p");
    curAfter.id = `curAfter${storNum}`;
    curAfter.classList.add("curAfter")
    curAfter.innerText = currAfter;
    captions.appendChild(curAfter)

    let getlistNum = document.createElement("p")
    getlistNum.innerText = storNum;
    getlistNum.id =`listNum${storNum}`
    getlistNum.classList.add("listNum")
    saveModule.appendChild(getlistNum)

    let skimName = document.createElement("p")
    skimName.id = `skinName${storNum}`
    skimName.classList.add("skinName")
    skimName.innerText = name;
    saveModule.appendChild(skimName)

    let priceBefore = document.createElement("p")
    priceBefore.id = `priceBefore${storNum}`
    priceBefore.classList.add("priceBefore")
    priceBefore.innerText = before;
    saveModule.appendChild(priceBefore)

    let priceAfter = document.createElement("p")
    priceAfter.id = `priceAfter${storNum}`
    priceAfter.classList.add("priceAfter")
    priceAfter.innerText = after;
    saveModule.appendChild(priceAfter)

    var delButton = document.createElement("button");
    delButton.classList.add("bi-trash3-fill");
    delButton.id = `buttonId${storNum}`;
    delButton.addEventListener("click", function() {
        deleteItem(this);
    });
    saveModule.appendChild(delButton);

    currOneSum += parseFloat(before);
    currTwoSum += parseFloat(after);

    var summOneElement = document.getElementById('summOne')
    summOneElement.innerHTML = (currOneSum).toFixed(2) + " " + currBefore;
    var summTwoElement = document.getElementById('summTwo')
    summTwoElement.innerHTML = (currTwoSum).toFixed(2) + " " + currAfter;

    if (!item) {
        var newItem = {
            id: storNum,
            currBefore: currBefore,
            currAfter: currAfter,
            name: name,
            before: before,
            after: after
        };
        localStorage.setItem(`item${storNum}`, JSON.stringify(newItem));
    }

    storNum++;
    console.log("ITEM SUCCESSFULLY ADDED")
    console.log(before)
    console.log(after)
    console.log(currOneSum)
    console.log(currTwoSum)
}

function deleteItem(elem) {
    var summOneElement = document.getElementById('summOne')
    var summTwoElement = document.getElementById('summTwo')
    var storId = elem.id.replace("buttonId", "");
    console.log(`Deleting element with ID: deleteId${storId}`);
    var elem = document.querySelector(`#deleteId${storId}`);
    elem.parentNode.removeChild(elem);
    localStorage.removeItem(`item${storId}`);
    console.log("item storID : " + `item${storId}`)
    storNum--;
    currOneSum -= parseFloat(before)
    currTwoSum -= parseFloat(after)
    summOneElement.innerHTML = (currOneSum).toFixed(2) + " " + currBefore;
    summTwoElement.innerHTML = (currTwoSum).toFixed(2) + " " + currAfter;
    console.log("item deleted");
}

function loadItems() {
    for (var i = 1; i <= localStorage.length; i++) {
        var item = localStorage.getItem(`item${i}`);
        if (item) {
            item = JSON.parse(item);
            addItem(item);
        }
    }
}

document.addEventListener("DOMContentLoaded", loadItems);
