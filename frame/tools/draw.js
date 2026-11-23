const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
let isDrawing = false;
canvas.addEventListener('pointerdown',(e)=>{
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});
canvas.addEventListener('pointermove',(e)=>{
    if (!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});
canvas.addEventListener('pointerup',()=>{
    isDrawing = false;
});
canvas.addEventListener('pointercancel',()=>{
    isDrawing = false;
});
canvas.addEventListener("pointerout",()=>{
    isDrawing = false;
});