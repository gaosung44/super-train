const PP = document.getElementById("playPopup");
document.getElementById("how").addEventListener("click",()=>{
    PP.showModal();
});
document.getElementById("close").addEventListener("click",()=>{
    PP.close();
});
const inputArea = document.getElementById("input");
const outputArea= document.getElementById("output");
const hex = document.getElementById("hex");
const bin = document.getElementById("bin");
const encode = document.getElementById("encode");
const decode = document.getElementById("decode");
const copy = document.getElementById("copy");
const clear = document.getElementById("delete");
encode.addEventListener("click",()=>{
    outputArea.value = "";
    for (let i=0; i<inputArea.value.length; i++){
        let text = inputArea.value.toString(10).charCodeAt(i);
        if (hex.checked){
            text = text.toString(16).toUpperCase();
        }
        if (bin.checked){
            text = text.toString(2);
        }
        text += " ";
        outputArea.value += text;
    }
    console.log(outputArea.value);
    if (
        outputArea.value === "304B 3064 3060 " ||
        outputArea.value === "30AB 30C4 3060 "
    ){
        console.log("1");
        if (
            inputArea.value === "カツだ" ||
            inputArea.value === "かつだ" 
        ) location.href = "katsuda.html";
    }
});
decode.addEventListener("click", () => {
    const inputText = inputArea.value.trim();//前後の余白を除去
    if (!inputText) {
        outputArea.value = "";
        return;
    }
    //スペースで区切って配列にする（連続スペースもまとめて分割）
    const codeList = inputText.split(/\s+/);
    let result = "";
    //進数を判定（デフォルトは10進数）
    let radix = 10;
    if (hex.checked) {
        radix = 16;
    } else if (bin.checked) {
        radix = 2;
    }
    for (let i = 0; i < codeList.length; i++) {
        const codeStr = codeList[i];
        //文字列を指定した進数の数値に変換
        const codeNum = parseInt(codeStr, radix);
        //数値として正しい場合のみ文字に変換
        if (!isNaN(codeNum)) {
            //文字コードから元の文字を復元して追加
            result += String.fromCharCode(codeNum);
        }
    }
    outputArea.value = result;
});
clear.addEventListener("click",()=>{
    inputArea.value = "";
    outputArea.value ="";
});
copy.addEventListener("click", () => {
    if (!outputArea.value) {
        alert("コピーする文字がありません");
        return;
    }
    navigator.clipboard.writeText(outputArea.value)
        .then(() => {
            alert("コピーしました");
        })
        .catch(() => {
            alert("コピーに失敗しました");
        });
});