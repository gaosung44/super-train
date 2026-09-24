const box = document.getElementById("parent");
let menuItem = [];
function createItem(imgSrc,href,title,text){
    menuItem.push({src:imgSrc,href,title,text});
}
document.getElementById("GoToHome").addEventListener("click",()=>{
    location.href = "index.html";
});
window.addEventListener("load",()=>{
    createItem(
        "omikuji.png",
        "tools/omikuji.html",
        "おみくじ",
        "おみくじです"
    );
    createItem(
        "block.png",
        "none",
        "ブロック崩し",
        "ブロック崩しです"
    );
    createItem(
        "clock.png",
        "none",
        "現在時間",
        "現在時間を秒単位で見れます"
    );
    createItem(
        "memo.png",
        "none",
        "メモ帳",
        "いろいろ使い方ができます"
    );
    createItem(
        "onpu.png",
        "none",
        "オシレーター",
        "四種類の波形の音が聞けます"
    );
    createItem(
        "plus.png",
        "none",
        "算数",
        "四則演算を練習できます"
    );
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
    );
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
                    element = create("div");
                    element.classList.add("side");
                    element.textContent = obj.title;
                    if (obj.href === "none"){
                        element.textContent += "（開発中）";
                    }
                    if (element.textContent.length >= 11){
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
});