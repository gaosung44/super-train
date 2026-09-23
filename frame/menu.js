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
        "none",
        "tools/omikuji.html",
        "おみくじ",
        "おみくじです"
    );/*
    createItem(
        "none",
        "none",
        "電卓",
        "普通の電卓"
    );
    createItem(
        "none",
        "none",
        "ブロック崩し",
        "ブロック崩しです"
    );
    createItem(
        "none",
        "none",
        "現在時間",
        "現在時間を秒単位で見れます"
    );
    createItem(
        "none",
        "none",
        "メモ帳",
        "いろいろ使い方ができます"
    );
    createItem(
        "none",
        "none",
        "オシレーター",
        "四種類の波形の音が聞けます"
    );
    createItem(
        "none",
        "none",
        "算数",
        "四則演算を練習できます"
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
                    element.src=(obj.src==="none")?"image/Test_image.png":obj.src;
                    break;
                case 1:
                    element = create("div");
                    element.classList.add("side");
                    element.textContent = obj.title;
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
                            alert("現在開発中")
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