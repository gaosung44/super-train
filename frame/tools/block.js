const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
let CS = {w:0,h:0,w2:0,h2:0}//canvas size
let key = {r:false,l:false,u:false,d:false}
let touch = {is:false,x:0,y:0,w:30,h:30}
let block;
let T;
let S;
let A;
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
    isHitBall(ball,target,side){
        if (side === "all"){
            return ball.y + ball.r > target.y &&
                ball.y - ball.r < target.y + target.h &&
                ball.x + ball.r > target.x &&
                ball.x - ball.r < target.x + target.w
        }
    }
}
class AudioCtx{
    play(value,type){
        this.ctx = new window.AudioContext();
        this.osc = this.ctx.createOscillator();
        this.gain = this.ctx.createGain();
        if (type){
            this.osc.type = type;
        } else {
            this.osc.type = "sine";
        }
        this.osc.frequency.value = value;
        this.gain.gain.setValueAtTime(0.5,this.ctx.currentTime);
        this.gain.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime + 0.1);
        this.osc.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.osc.start();
        this.osc.stop(this.ctx.currentTime + 0.1);
    }
}
class Test{
    
}
class BlockManager{
    constructor(){
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
            y:CS.h - S.rnd(CS.h/10),
            w:S.rnd(CS.w/4),
            h: 40,
            dx: 8,
            maxY: null,
            standY: null
        }
        this.ball = {
            color: "#ff0",
            x: CS.w2,
            y: 300,
            r: 9,
            dx: 6,
            dy: -6,
            basicSpeed: 8,
            delete: true
        }
        this.block = {
            x: CS.x,
            y: null,
            w: null,
            h: 30,
            row: 5,
            col: 1,
            dropY: null,
            list:[]
        }
    }
    init(){
        if (!this.isInit){
            const pdl = this.paddle;
            this.paddle.x = S.center(pdl.w);
            this.paddle.maxY = pdl.y - 100;
            this.paddle.standY = pdl.y;
            const b = this.block;
            this.block.y = CS.y + this.topBar.h + 50;
            this.block.dropY = CS.y + this.topBar.h + 50;
            this.createBlock();
            this.isInit = true;
        }
    }
    createBlock(){
        const b = this.block;
        this.block.col = this.stageLevel;
        this.block.w = S.rnd(CS.w/b.col);
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
                    y: CS.y + this.topBar.h,
                    w: b.w, h: b.h,
                    addY: r*b.h
                }
            }
        }
    }
    updatePaddle(){
        if (
            key.r &&
            CS.x + CS.w > this.paddle.x + this.paddle.w
        ) this.paddle.x += this.paddle.dx;
        if (
            key.l &&
            CS.x < this.paddle.x
        ) this.paddle.x -= this.paddle.dx;
        if (touch.is){
            let touchX = touch.x;
            if (CS.x + CS.w - this.paddle.w/2 < touchX){
                touchX = CS.x + CS.w - this.paddle.w/2;
            }
            if (CS.x + this.paddle.w/2 > touchX){
                touchX = CS.x + this.paddle.w/2;
            }
            this.paddle.x = touchX - this.paddle.w/2;
        }
        if (S.isHitBall(this.ball, this.paddle, "all")) {
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
        if (this.ball.x + this.ball.r > CS.x + CS.w){
            this.ball.dx = -Math.abs(this.ball.dx);
            A.play(1000);
        }
        if (this.ball.x < CS.x){
            this.ball.dx = Math.abs(this.ball.dx);
            A.play(1000);
        }
        if (this.ball.y < CS.y+this.topBar.h+this.ball.r){
            this.ball.dy = Math.abs(this.ball.dy);
            A.play(1000);
        }
        if (this.ball.y + this.ball.r > CS.y + CS.h){
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
                    this.ball.dy *= -1;
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
            this.stageLevel++;
            this.createBlock();
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
            CS.x,CS.y,
            CS.w,CS.h
        );
        S.drawRect(
            this.topBar.color,
            CS.x,
            CS.y,
            CS.w,
            CS.h
        );
        S.drawText(0,"スコア"+this.allScore,CS.x,CS.y);
        S.drawText(0,"レベル"+(this.stageLevel-4),CS.x+150,CS.y);
        if (this.state === "gameOver"){
            S.drawText(0,"ゲームオーバー",CS.x+290,CS.y);
        }
        if (this.state === "pause"){
            S.drawText(0,"一時停止",CS.x+300,CS.y);
        }
    }
    updateAll(){
        this.init();
        if (this.state === "start"){
            this.updatePaddle();
            this.updateBlock();
            this.ball.x = this.paddle.x + this.paddle.w / 2;
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
    block.updateAll();
    block.drawAll();
    requestAnimationFrame(loop);
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
    const width = Math.round(window.innerWidth * 0.3);
    const height = Math.round(window.innerHeight * 0.8);
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(2,2);
    CS.w = width;
    CS.h = height;
    CS.w2 = width/2;
    CS.h2 = height/2;
    S = new ShortSystem();
    A = new AudioCtx();
    T = new Test();
    block = new BlockManager();
    eventKey();
    eventTouch();
    loop();
});