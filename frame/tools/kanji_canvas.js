const leftCanvas = document.getElementById("area1");
const writeCanvas= document.getElementById("write-canvas");
const Lctx = leftCanvas.getContext("2d");
const Wctx = writeCanvas.getContext("2d");
const dpr = 2;//window.devicePixelRatio;
let S;
let L;
let W;
class ShortSystem{//sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
    rou(value){
        return Math.round(value);
    }
    
    drawRect(canvas,color,x,y,w,h){
        if (color === 0) color = "#000";
        if (color === 1) color = "#fff";
        if (canvas === 0){
            Lctx.fillStyle = color;
            Lctx.fillRect(x,y,w,h);
        }
        if (canvas === 1){
            Wctx.fillStyle = color;
            Wctx.fillRect(x,y,w,h);
        }
    }
    drawCircle(canvas,color,x,y,r){
        if (color === 0) color = "#000";
        if (color === 1) color = "#fff";
        if (canvas === 0){
            Lctx.beginPath();
            Lctx.arc(x,y,r,0,Math.PI*2);
            Lctx.fillStyle = color;
            Lctx.fill();
        }
        if (canvas === 1){
            Wctx.beginPath();
            Wctx.arc(x,y,r,0,Math.PI*2);
            Wctx.fillStyle = color;
            Wctx.fill();
        }
    }
    drawLine(canvas,color,x1,y1,x2,y2,size){
        if (color === 0) color = "#000";
        if (color === 1) color = "#fff";
        if (!size) size = 10;
        if (canvas === 0){
            Lctx.beginPath();
            Lctx.moveTo(x1,y1);
            Lctx.lineTo(x2,y2);
            Lctx.strokeStyle = color;
            Lctx.lineWidth = size;
            Lctx.stroke();
        }
        if (canvas === 1){
            Wctx.beginPath();
            Wctx.moveTo(x1,y1);
            Wctx.lineTo(x2,y2);
            Wctx.strokeStyle = color;
            Wctx.lineWidth = size;
            Wctx.stroke();
        }
    }
    drawText(canvas,color,text,x,y,size,mw){
        if (color === 0) color = "#000";
        if (color === 1) color = "#fff";
        if (!size) size = 20;
        if (canvas === 0){
            Lctx.fillStyle = color;
            Lctx.font = size+"px sans-serif";
            Lctx.fillText(text,x,y+size,mw);
        }
        if (canvas === 1){
            Wctx.fillStyle = color;
            Wctx.font = size+"px sans-serif";
            Wctx.fillText(text,x,y+size,mw);
        }
    }
    clearCanvas(){
        Lctx.clearRect(0,0,L.CS.w,L.CS.h);
        if (!W.isFrame) Wctx.clearRect(0,0,W.CS.w,W.CS.h);
    }
    isHitBall(ball,target){
        if (ball.is === false){
            return;
        }
        return ball.y + ball.r > target.y &&
            ball.y - ball.r < target.y + target.h &&
            ball.x + ball.r > target.x &&
            ball.x - ball.r < target.x + target.w
    }
}
class LeftCanvasManager{//lllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
    constructor(){
        this.CS = {w:null,h:null,w2:null,h2:null}//canvas size
        this.touch = {
            is:false,
            x: -100,
            y: -100,
            r: 10,
            color: "rgba(255,255,255,0.2)"
        }
        this.topBar = {
            y: 60,
            btn: {x:null,y:0,w:30,h:30},
            currentNum: null,//今の問題番号
        }
        this.problemsSet = [];//セットされた問題集
        this.isInit = false;
        this.init();
    }
    addTouchEvent(){
        leftCanvas.addEventListener("pointerdown",e=>{
            const rect = leftCanvas.getBoundingClientRect();
            this.touch.is = true;
            this.touch.x = S.rou(e.clientX - rect.left);
            this.touch.y = S.rou(e.clientY - rect.top);
        });
        leftCanvas.addEventListener("pointermove",e=>{
            if (this.touch.is){
                const rect = leftCanvas.getBoundingClientRect();
                this.touch.x = S.rou(e.clientX - rect.left);
                this.touch.y = S.rou(e.clientY - rect.top);
            }
        });
        const stop = ()=>{
            this.touch.is = false;
        }
        leftCanvas.addEventListener("pointerup",stop);
        leftCanvas.addEventListener("pointerleave",stop);
        leftCanvas.addEventListener("pointercancel",stop);
        leftCanvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    }
    init(){
        if (!this.isInit){
            this.isInit = true;
            const width = S.rou(window.innerWidth * 0.45);
            const height = S.rou(window.innerHeight * 0.5);
            leftCanvas.width = width * dpr;
            leftCanvas.height = height * dpr;
            leftCanvas.style.width = width+"px";
            leftCanvas.style.height = height+"px";
            Lctx.scale(dpr,dpr);
            this.CS.w = width;
            this.CS.h = height;
            this.CS.w2 = width /2;
            this.CS.h2 = height/2;
            this.topBar.btn.x = this.CS.w - this.topBar.btn.w;
            this.addTouchEvent();
        }
    }
    drawPointer(){
        const t = this.touch;
        if (t.is){
            S.drawCircle(0,"rgba(0,0,0,0.5)",t.x,t.y,t.r);
        }
    }
    drawTopBar(){
        S.drawLine(0,0,0,this.topBar.y,this.CS.w,this.topBar.y,5);
        S.drawRect(
            0,"#aaa",
            this.topBar.btn.x,
            this.topBar.btn.y,
            this.topBar.btn.w,
            this.topBar.btn.h
        );
    }
    drawSomething(){//なんでも
    }
    allCollision(){//当たり判定
        if (S.isHitBall(this.touch,this.topBar.btn)){
            console.log("hit");
        }
        if (S.isHitBall(this.touch,this.problemsSet[this.topBar.currentNum].btnDate[0])){
            W.setFrame(this.problemsSet[this.topBar.currentNum].btnDate[0]);
        }
    }
    setProblem(array){//問題を改造
        for (let i=0; array.length>i; i++){
            this.problemsSet.push(
                {Q:array[i].Q, A:array[i].A, btnDate:[]}
            );
        }
        for (let i=0; this.problemsSet.length>i; i++){
            for (let j=0; this.problemsSet[i].A.length>j; j++){
                this.problemsSet[i].btnDate.push(
                    {name:j,x:100,y:150,w:50,h:50,drawDate:[]}
                );
            }
        }
        this.topBar.currentNum = 0;
    }
    drawProblem(){//this.topbarより下
        if (!this.problemsSet){
            console.error("problem is undefined",this.problemsSet);
            return;
        }
        const PC = this.problemsSet[this.topBar.currentNum];
        S.drawText(
            0,0,
            PC.Q,
            100,100,
        );
        S.drawRect(
            0,"#aaa",
            PC.btnDate[0].x,
            PC.btnDate[0].y,
            PC.btnDate[0].w,
            PC.btnDate[0].h
        );
    }
    updateAll(){
        this.allCollision();
        this.drawTopBar();
        this.drawSomething();
        this.drawProblem();
        this.drawPointer();
    }
}
class WriteCanvasManager{//wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
    constructor(){
        this.CS = {w:null,h:null,w2:null,h2:null}
        this.touch = {
            is:false,
            x:-100,lastX:0,
            y:-100,lastY:0,
            r:5, up:true
        }
        this.isInit = false;
        this.isFrame = false;
        this.writeFlame;
        this.init();
    }
    addTouchEvent(){
        const stop = ()=>{
            this.touch.is = false;
            if (this.touch.up === false) {
                this.touch.up = true;
            }
        }
        writeCanvas.addEventListener("pointerdown",e=>{
            const rect = writeCanvas.getBoundingClientRect();
            this.touch.is = true;
            this.touch.x = e.clientX - rect.left;
            this.touch.y = e.clientY - rect.top;
            this.touch.lastX = this.touch.x;
            this.touch.lastY = this.touch.y;
        });
        writeCanvas.addEventListener("pointermove",e=>{
            if (this.touch.is){
                const rect = writeCanvas.getBoundingClientRect();
                this.touch.x = e.clientX - rect.left;
                this.touch.y = e.clientY - rect.top;
                Wctx.lineCap = 'round';
                Wctx.lineJoin = 'round';
                S.drawLine(
                    1,0,
                    this.touch.lastX,
                    this.touch.lastY,
                    this.touch.x,
                    this.touch.y,10
                )
                this.touch.lastX = this.touch.x;
                this.touch.lastY = this.touch.y;
            }
        });
        window.addEventListener("pointerup",stop);
        writeCanvas.addEventListener("pointercancel",stop);
        writeCanvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    }
    init(){
        if (!this.isInit){
            this.isInit = true;
            const width = 150;
            const height = 150;
            writeCanvas.width = width * dpr;
            writeCanvas.height = height * dpr;
            writeCanvas.style.width = width+"px";
            writeCanvas.style.height = height+"px";
            Wctx.scale(dpr,dpr);
            this.CS.w = width;
            this.CS.h = height;
            this.CS.w2 = width /2;
            this.CS.h2 = height/2;
            this.addTouchEvent();
        }
    }
    drawPointer(){
        const t = this.touch;
        if (t.is){
            S.drawCircle(1,0,t.x,t.y,t.r);
        }
    }
    display(){
        if (!this.isFrame){
            S.drawLine(1,"#f00",0,0,this.CS.w,this.CS.h);
            S.drawLine(1,"#f00",this.CS.w,0,0,this.CS.h);
        }
        if (this.isFrame){
            if (this.touch.up){
                console.log("up");
                this.touch.up = false;
            }
        }
    }
    setFrame(array){
        if (array === "delete" || !array){
            this.isFrame = false;
            return;
        }
        this.isFrame = true;
        this.writeFlame = array;
    }
    updateAll(){
        //this.drawPointer();
        this.display();
    }
}
function loop(){
    S.clearCanvas();
    L.updateAll();
    W.updateAll();
    requestAnimationFrame(loop);
}
window.addEventListener("load",()=>{
    state("output");
    S = new ShortSystem();
    L = new LeftCanvasManager();
    W = new WriteCanvasManager();
    L.setProblem(problems);
    loop();
});