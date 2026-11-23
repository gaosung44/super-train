const input_sec = document.getElementById("input");
const text1 = document.getElementById("input1");
const text2 = document.getElementById("input2");
const addBtn= document.getElementById("add-btn");
const addList = document.getElementById("list");
const compBtn = document.getElementById("comp-btn");
const menu_sec = document.getElementById("menu");
const ranStartBtn = document.getElementById("ran_btn");
const keepStartBtn = document.getElementById("kee-btn");
const backBtn = document.getElementById("back-btn");
const output_sec = document.getElementById("output");
const result_sec = document.getElementById("result");
let current = "";
let container;
let addElement;
let problems = [
    {Q: "1+1",A: "2"},
    {Q: "1+2",A: "3"}
];
function state(value,add){/*
    if (value === "output"){
        const result = confirm("始めますか?");
        if (!result){
            return;
        }
    }*/
    current = value + add;
    input_sec.style.display = "none";
    menu_sec.style.display = "none";
    output_sec.style.display = "none";
    result_sec.style.display = "none";
    if (value === "input"){
        input_sec.style.display = "block";
    }
    if (value === "menu"){
        menu_sec.style.display = "block";
    }
    if (value === "output"){
        output_sec.style.display = "block";
    }
    if (value === "result"){
        result_sec.style.display = "block";
    }
}
function addE(element){
    addElement = document.createElement(element);
}
addBtn.addEventListener("click",()=>{
    const p = document.createElement("p");
    const EN = 3;//element number
    if (!text1.value || !text2.value){
        alert("入力してください");
        return;
    }
    for (let i=0; i<EN; i++){
        switch (i){
            case 0:
                addE("span");
                addElement.classList.add("counter");
                addElement.textContent = problems.length+". ";
                break;
            case 1:
                addE("span");
                addElement.textContent = `[ ${text1.value} ],[ ${text2.value} ]`
                break;
            case 2:
                addE("button");
                addElement.textContent = "削除";
                addElement.addEventListener("click",()=>{
                    //p.remove();
                });
        }
        p.appendChild(addElement);
    }
    addList.appendChild(p);
    problems.push({msg: text1.value, ans: text2.value});
});
compBtn.addEventListener("click",()=>{
    if(problems.length === 1){
        const result = confirm("どっち");
        if (result){
            state("menu");
        }
    } else {
        state("menu");
    }
});