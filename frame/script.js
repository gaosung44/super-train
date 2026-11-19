const home_sec = document.getElementById("home-section");
const menu_sec = document.getElementById("menu-section");
const lock_sec = document.getElementById("lock-section");
const box = document.getElementById("parent");
const rulePPP = document.getElementById("rulePopup");
document.getElementById("train").addEventListener("click",()=>{
    alert("こんにちは!www　私はこのサイトのキャラクターだyo");
});
document.getElementById("ruleOpen").addEventListener("click",()=>{
    rulePPP.showModal();
});
document.getElementById("ruleClose").addEventListener("click",()=>{
    rulePPP.close();
});
document.getElementById("lock-btn2").addEventListener("click",()=>{
    localStorage.setItem("isLock","true");
    switchTub("home");
});
document.getElementById("lock-btn").addEventListener("click",()=>{
    const result = prompt("パスワードを入力");
    if (result === "103844"){
        localStorage.setItem("isLock","false");
        switchTub("home");
    }
    console.log(result);
});
function switchTub(name){
    home_sec.style.display = "none";
    menu_sec.style.display = "none";
    lock_sec.style.display = "none";
    switch (name) {
        case "home":
            let lock = localStorage.isLock;
            if (lock === "true"){
                switchTub("lock");
            } else if (!lock){
                switchTub("lock");
            } else {
                localStorage.setItem("show","home");
                document.title = "ホーム";
                home_sec.style.display = "block";
            }
            break;
        case "menu":
            localStorage.setItem("show","menu");
            document.title = "メニュー";
            menu_sec.style.display = "block";
            break;
        case "lock":
            localStorage.setItem("show","lock");
            document.title = "ホーム";
            lock_sec.style.display = "block";
            break;
        default:
            switchTub("home");
            break;
    }
}
let menuItem = [];

window.addEventListener("load",()=>{
    function createItem(imgSrc,href,title,text){
        menuItem.push({src:imgSrc,href,title,text});
    }
    createItem(
        "omikuji.png",
        "tools/omikuji.html",
        "おみくじ",
        "おみくじが引けるおみくじだ"
    );
    createItem(
        "A.png",
        "tools/code.html",
        "暗号変換",
        "とある単語を変換すると..."
    );
    createItem(
        "block.png",
        "none",
        "ブロック崩し",
        "ブロック崩しです"
    );
    createItem(
        "kanji.png",
        "none",
        "暗記",
        "使い方はあなた次第"
    );
    createItem(
        "clock.png",
        "none",
        "現在時間",
        "今の時間を秒単位で"
    );
    createItem(
        "memo.png",
        "none",
        "メモ帳",
        "ごく普通のメモアプリだzoi"
    );
    createItem(
        "onpu.png",
        "none",
        "オシレーター",
        "四種類の波形の音を鑑賞しましょ"
    );
    createItem(
        "plus.png",
        "none",
        "算数",
        "簡単な四則演算"
    );
    /*
    createItem(
        "calc.png",
        "none",
        "電卓",
        "少し特殊な電卓"
    );
    createItem(
        "none",
        "none",
        "ロケットトレイン",
        "障害物を避けよう"
    );
    createItem(
        "none",
        "none",
        "フロッピートレイン",
        "障害物を避けよう"
    );*/
    createItem(
        "none",
        "tools/test.html",
        "移行",
        ""
    )
    menuItem.forEach((obj)=>{
        const create = (element)=>{
            return document.createElement(element);
        }
        const frame = create("div");
        let element;
        for (let i=0; i<5; i++){
            switch (i) {
                case 0:
                    element = create("img");
                    if (obj.src === "none"){
                        element.src = "image/Test_image.png";
                    } else {
                        element.src = "image/" + obj.src;
                    }
                    break;
                case 1:
                    element = create("p");
                    element.classList.add("side");
                    element.textContent = obj.title;
                    if (obj.href === "none"){
                        element.textContent += "（開発中）";
                    }
                    if (element.textContent.length >= 9){
                        element.style.fontSize = "large";
                    }
                    break;
                case 2:
                    element = create("hr");
                    break;
                case 3:
                    element = create("div");
                    element.classList.add("bottom");
                    element.textContent = obj.text;
                    break;
                case 4:
                    element = create("button");
                    element.textContent = "プレイ"
                    element.addEventListener("click",()=>{
                        if (obj.href === "none"){
                            alert("現在使用できません");
                        } else{
                            location.href = obj.href;
                        }
                    });
            }
            frame.appendChild(element);
        }
        frame.classList.add("child");
        box.appendChild(frame);
    });
    const isLock = localStorage.getItem("isLock");
    const show = localStorage.getItem("show");
    if (!show){
        localStorage.setItem("show","lock");
    }
    if (!isLock){
        localStorage.setItem("isLock","true");
    }
    switchTub(show);
});