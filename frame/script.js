const train = document.getElementById("img");
train.addEventListener("click",()=>{
    let isResult = confirm("この電車は好きですか?");
    if (isResult) alert("ありがとう");
    else alert("は?");
});