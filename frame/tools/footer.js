const footer = document.createElement("footer");
const body = document.body;
let footerTag = 6;
let dialogTag = 6;
let setElememt;
let setElememt2;
let dialog;
function input(element){
    setElememt = document.createElement(element);
}
function input2(element){
    setElememt2 = document.createElement(element);
}
window.addEventListener("load",()=>{
    for (let i=0; i<footerTag; i++){
        switch (i){//footer tag
            case 0:
                input("span");
                setElememt.textContent = "\u00A9 2026 gaosung44";
                break;
            case 1:
                input("span");
                setElememt.textContent = "利用規約";
                setElememt.id = "ruleOpen";
                setElememt.addEventListener("click",()=>{
                    document.getElementById("rulePopup").showModal();
                });
                break;
            case 2:
                input("dialog");
                setElememt.id = "rulePopup";
                for (let i=0; i<dialogTag; i++){
                    switch (i){
                        case 0:
                            input2("p");
                            setElememt2.textContent = "当サイトの利用について";
                            break;
                        case 1:
                            input2("p");
                            setElememt2.textContent = "・フリー素材について";
                            break;
                        case 2:
                            input2("span");
                            setElememt2.textContent = 
                            "サイト内で使用しているフリー素材は、"+
                            "配布元様（いらすとや等）が著作権を所有しています。"+
                            "これらを当サイトから保存して他で再利用する場合は、"+
                            "必ず各素材サイトの利用規約に従ってください。"+
                            "当サイト側での責任は負いかねます。";
                            break;
                        case 3:
                            input2("p");
                            setElememt2.textContent = "・免責事項";
                            break;
                        case 4:
                            input2("span");
                            setElememt2.textContent =
                            "当サイトは管理人の個人的な見解や好みを掲載しています。"+
                            "内容によって生じたトラブルや、閲覧されて不快に感じられた場合"+
                            "におきましても、一切の責任を負いかねます。"+
                            "ご利用はすべて自己責任でお願いいたします。";
                            break;
                        case 5:
                            input2("button");
                            setElememt2.textContent = "閉じる";
                            setElememt2.id = "ruleClose";
                            setElememt2.addEventListener("click",()=>{
                                document.getElementById("rulePopup").close();
                            });
                            break;
                    }
                    setElememt.appendChild(setElememt2);
                }
                break;
            case 3:
                input("p");
                setElememt.textContent = 
                "※このサイトは、香川県高松市および関連自治体・団体等とは一切関係ありません。";
                break;
            case 4:
                input("p");
                setElememt.textContent = "製作者　髙松(漆黒の翼)";
                break;
        }
        footer.appendChild(setElememt);
    }
    body.appendChild(footer);
});
document.getElementById("home").addEventListener("click",()=>{
    location.href = "../index.html";
});