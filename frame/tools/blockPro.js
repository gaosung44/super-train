const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
const imgSource = [];
const audios = [];
let CS = {w: 0,h: 0,w2: 0,h2: 0}//canvas size
let key = {
    r:false,l:false,u:false,d:false,
    Sh:false,
}
let touch = {is:false,x:0,y:0,w:30,h:30};
let imgOBJ = [];
let gameVessel;
let frame;
let S;//short
let A;//audio
class ShortSystem{
    center(value){
        return CS.w2 - value/2;
    }
    rnd(value){
        return Math.round(value);
    }
    ran(value){
        return Math.random() * value;
    }
    drawRect(color,x,y,w,h){
        if (color === 0) color = "#000";
        ctx.fillStyle = color;
        if (x === "center") x = this.center(w);
        if (y === "center") y = this.center(h);
        ctx.fillRect(x,y,w,h);
    }
    drawText(color,text,x,y,size){
        if (color === 0) color = "#000";
        ctx.fillStyle = color;
        if (!size) size = 30;
        ctx.font = `${size}px sans-serif`;
        ctx.fillText(text,x,y+size);
    }
    isHitBall(ball,target){
        return ball.y + ball.r > target.y &&
            ball.y - ball.r < target.y + target.h &&
            ball.x + ball.r > target.x &&
            ball.x - ball.r < target.x + target.w
    }
}
class Frame{
    constructor(width,height,border){
        if (!width || !height || !border) console.error(
            "入れてねぇよ"
        );
        this.border = border;
        this.borderColor = "#aaa";
        this.frameCount = 0;
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.scrollCount = 0;
        this.init();
    }
    init() {
        if (this.width > window.innerWidth) {
            this.width = window.innerWidth-20;
        }
        if (this.height > window.innerHeight) {
            this.height = window.innerHeight;
        }
        this.x = CS.w2 - this.width / 2;
        this.y = this.border;
        this.w = this.width;
        this.h = this.height - this.border * 2;
    }
    draw(){
        this.frameCount++;
        S.drawRect(
            this.borderColor,
            this.x-this.border,
            this.y-this.border,
            this.w+this.border*2,
            this.h+this.border*2
        );
        S.drawRect(
            "#fff",
            this.x,
            this.y,
            this.w,
            this.h
        );/*
        S.drawText(
            "#fff",
            this.frameCount,
            0,0
        );*/
    }
    scrollTitle(){
        const maxNum = 10
        if (this.frameCount % 20 === 0) {
            this.scrollCount++;
        }
        const num = this.scrollCount % maxNum;
        let topText = "";
        let bottomText = "";
        for (let i=0; i<num; i++){
            topText += "_";
        }
        for (let i=0; i<maxNum-num-1; i++){
            bottomText += "_";
        }
        document.title = topText + "ブロック崩し" + bottomText;
    }
}
class AudioCtx {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    async play(value, type = "sine") {
        if (this.ctx.state === "suspended") {
            await this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = value;
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
        };
    }
}
class BlockManager{
    constructor(frame){
        if (!frame) console.error("ねぇよ");
        this.GS = {//game size
            x: frame.x,
            y: frame.y,
            w: frame.w,
            h: frame.h
        }
        this.backColor = "#000";
        this.isInit = false;
        this.state = "start";
        this.allScore = 0;
        this.addScore = 10;
        this.clearScore = null;
        this.stageLevel = 5;
        this.topBar = {
            color: "#aff",
            h: 50,
        }
        this.paddle = {
            color: "#0a3",
            x: null,
            y:this.GS.h - S.rnd(this.GS.h/10),
            w:S.rnd(this.GS.w/4),
            h: 40,
            dx: 8,
            maxY: null,
            standY: null
        }
        this.ball = {
            color: "#ff0",
            x: CS.w2,
            y: 0,
            r: 9,
            dx: 6,
            dy: -6,
            basicSpeed: 8,
            delete: true
        }
        this.block = {
            x: this.GS.x,
            y: null,
            w: null,
            h: 30,
            row: 5,
            col: 1,
            dropY: null,
            list:[],
            wait: false
        }
    }
    init(){
        if (!this.isInit){
            const pdl = this.paddle;
            this.paddle.x = S.center(pdl.w);
            this.paddle.maxY = pdl.y - 100;
            this.paddle.standY = pdl.y;
            const b = this.block;
            this.block.y = this.GS.y + this.topBar.h + 50;
            this.block.dropY = this.GS.y + this.topBar.h + 50;
            this.createBlock();
            this.isInit = true;
        }
    }
    createBlock(){
        const b = this.block;
        this.block.col = this.stageLevel;
        this.block.w = S.rnd(this.GS.w/b.col);
        this.block.list = [];
        for (let r=0; r<b.row; r++){
            this.block.list[r] = [];
            for (let c=0; c<b.col; c++){
                this.clearScore += this.addScore;
                const color = `hsl(${S.ran(360)},100%,50%)`
                this.block.list[r][c] = {
                    alive: 1,
                    color: color,
                    border: 1,
                    x: b.x + c*b.w,
                    y: this.GS.y + this.topBar.h,
                    w: b.w, h: b.h,
                    addY: r*b.h
                }
            }
        }
    }
    updatePaddle(){
        if (
            key.r &&
            this.GS.x + this.GS.w > this.paddle.x + this.paddle.w
        ) this.paddle.x += this.paddle.dx;
        if (
            key.l &&
            this.GS.x < this.paddle.x
        ) this.paddle.x -= this.paddle.dx;
        if (touch.is){
            let touchX = touch.x;
            if (this.GS.x + this.GS.w - this.paddle.w/2 < touchX){
                touchX = this.GS.x + this.GS.w - this.paddle.w/2;
            }
            if (this.GS.x + this.paddle.w/2 > touchX){
                touchX = this.GS.x + this.paddle.w/2;
            }
            this.paddle.x = touchX - this.paddle.w/2;
        }
        if (S.isHitBall(this.ball,this.paddle)) {
            const paddleCenter = this.paddle.x + this.paddle.w / 2;
            const hitDist = this.ball.x - paddleCenter;
            const hitRatio = (hitDist / (this.paddle.w / 2)) * 0.8; 
            this.ball.dx = S.rnd(hitRatio * this.ball.basicSpeed);
            const dySquared = Math.pow(this.ball.basicSpeed, 2) - Math.pow(this.ball.dx, 2);
            this.ball.dy = -Math.sqrt(Math.max(0.1, dySquared));
            A.play(880,"sawtooth");
        }
    }
    updateBall(){
        this.basicSpeed = this.stageLevel + 8;
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        if (this.ball.x + this.ball.r > this.GS.x + this.GS.w){
            this.ball.dx = -Math.abs(this.ball.dx);
            A.play(1000);
        }
        if (this.ball.x < this.GS.x){
            this.ball.dx = Math.abs(this.ball.dx);
            A.play(1000);
        }
        if (this.ball.y < this.GS.y+this.topBar.h+this.ball.r){
            this.ball.dy = Math.abs(this.ball.dy);
            A.play(1000);
        }
        if (this.ball.y + this.ball.r > this.GS.y + this.GS.h){
            A.play(523);
            this.ball.dy = 0;
            this.ball.dx = 0;
        }
    }
    updateBlock(){
        for (let r=0; r<this.block.row; r++){
            for (let c=0; c<this.block.col; c++){
                const b = this.block.list[r][c];
                if (b.alive <= 0){
                    continue;
                }
                if (S.isHitBall(this.ball,b,"all")){
                    if (this.ball.delete){
                        this.block.list[r][c].alive--;
                        this.ball.delete = false;
                        this.allScore += this.addScore;
                        A.play(880);
                    }
                    const ball = this.ball;
                    let overlapX = Math.min(ball.x + ball.r - b.x, (b.x + b.w) - (ball.x - ball.r));
                    let overlapY = Math.min(ball.y + ball.r - b.y, (b.y + b.h) - (ball.y - ball.r));
                    if (overlapX < overlapY) {
                        this.ball.dx *= -1;
                    } else {
                        this.ball.dy *= -1;
                    }
                }
            }
        }
    }
    judge(){
        if (this.state === "start"){
            if (key.u) this.state = "next_play";
            if (S.isHitBall(this.ball,touch,"all")){
                this.state = "play";
            }
        }
        if (this.state === "next_play"){
            if (!key.u) this.state = "play";
        }
        if (this.state === "play"){
            if (key.u) this.state = "next_pause";
        }
        if (this.state === "next_pause"){
            if (!key.u) this.state = "pause";
        }
        if (this.state === "pause"){
            if (key.u) this.state = "next_play";
        }
        if (this.state === "gameOver"){
            if (key.u) location.reload();
            if (S.isHitBall(this.ball,touch,"all")){
                location.reload();
            }
        }
        if (
            this.ball.dx === 0 &&
            this.ball.dy === 0
        ){
            this.state = "gameOver";
        }
        if (this.clearScore === this.allScore){
            if (this.ball.y > CS.h2){
                this.stageLevel++;
                this.createBlock();
            }
        }
    }
    drawPaddle(){
        const pdl = this.paddle;
        S.drawRect(
            pdl.color,
            pdl.x,pdl.y,
            pdl.w,pdl.h
        );
    }
    drawBall(){
        ctx.beginPath();
        ctx.arc(
            this.ball.x,
            this.ball.y,
            this.ball.r,
            0,Math.PI * 2
        );
        ctx.fillStyle = this.ball.color;
        ctx.fill();
    }
    drawBlocks(){
        for (let r=0; r<this.block.row; r++){
            for (let c=0; c<this.block.col; c++){
                const b = this.block.list[r][c];
                if (this.block.dropY > b.y - b.addY){
                    this.block.list[r][c].y+=2;
                }
                if (b.alive <= 0) continue;
                S.drawRect(
                    "#000",
                    b.x, b.y,
                    b.w, b.h
                );
                S.drawRect(
                    b.color,
                    b.x + b.border,
                    b.y + b.border,
                    b.w - b.border*2,
                    b.h - b.border*2
                );
            }
        }
    }
    drawBack(){
        S.drawRect(
            this.backColor,
            this.GS.x,this.GS.y,
            this.GS.w,this.GS.h
        );
        S.drawRect(
            this.topBar.color,
            this.GS.x,
            this.GS.y,
            this.GS.w,
            this.topBar.h
        );
        S.drawText(0,"スコア"+this.allScore,this.GS.x,this.GS.y);
        S.drawText(0,"レベル"+(this.stageLevel-4),this.GS.x+150,this.GS.y);
        if (this.state === "gameOver"){
            S.drawText(0,"ゲームオーバー",this.GS.x+290,this.GS.y);
        }
        if (this.state === "pause"){
            S.drawText(0,"一時停止",this.GS.x+300,this.GS.y);
        }
    }
    updateAll(){
        this.init();
        if (this.state === "start"){
            this.updatePaddle();
            this.updateBlock();
            this.ball.x = this.paddle.x + this.paddle.w / 2;
            this.ball.y = this.paddle.y - 50;
        }
        if (this.state === "play"){
            this.updatePaddle();
            this.updateBall();
            this.updateBlock();
        }
        this.judge();
        this.ball.delete = true;
    }
    drawAll(){
        this.drawBack();
        this.drawPaddle();
        this.drawBall();
        this.drawBlocks();
    }
}
function loop(){
    ctx.clearRect(0,0,CS.w,CS.h);
    frame.draw();
    frame.scrollTitle();
    gameVessel.updateAll();
    gameVessel.drawAll();
    requestAnimationFrame(loop);
}
function resize(w){
    if (!w) w = window.innerWidth;
    const width = w;
    const height = window.innerHeight;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);
    CS.w = width;
    CS.h = height;
    CS.w2 = Math.floor(CS.w/2);
    CS.h2 = Math.floor(CS.h/2);
}
function audioPlay(name) {
    const audio = new Audio(`./sound/${name}`);
    audio.play();
    audios.push(audio);
}
function stopAll() {
    audios.forEach(a => {
        a.pause();
    });
    audios.length = 0;
}
function loadImages(){
    let loadedCount = 0;
    imgSource.forEach((src,index)=>{
        const img = new Image();
        img.src = "images/"+src;
        img.onload = ()=>{
            ctx.drawImage(img,index*50,0,50,50);
            imgOBJ[index] = img;
            loadedCount++;
            if(loadedCount===imgSource.length){
                console.log(loadedCount+"枚完了");
                state="loaded";
            }
        } 
    });
}
function eventKey(){
    window.addEventListener("keydown",e=>{
        if (e.key === "ArrowRight")key.r = true;
        if (e.key === "ArrowLeft") key.l = true;
        if (e.key === "ArrowUp")   key.u = true;
        if (e.key === "ArrowDown") key.d = true;
        if (e.key === "Shift")     key.Sh= true;
    });
    window.addEventListener("keyup",e=>{
        if (e.key === "ArrowRight")key.r = false;
        if (e.key === "ArrowLeft") key.l = false;
        if (e.key === "ArrowUp")   key.u = false;
        if (e.key === "ArrowDown") key.d = false;
        if (e.key === "Shift")     key.Sh= false;
    });
}
function eventTouch(){
    window.addEventListener("pointerdown",e=>{
        touch.is = true;
        touch.x = S.rnd(e.clientX);
        touch.y = S.rnd(e.clientY);
    });
    window.addEventListener("pointermove",e=>{
        if (touch.is){
            touch.x = S.rnd(e.clientX);
            touch.y = S.rnd(e.clientY);
        }
    });
    window.addEventListener("pointerup",e=>{
        touch.is = false;
    });
}
window.addEventListener("load",()=>{
    resize();
    eventKey();
    eventTouch();
    S = new ShortSystem();
    A = new AudioCtx();
    frame = new Frame(500,700,10);
    gameVessel = new BlockManager(frame);
    loop();
});