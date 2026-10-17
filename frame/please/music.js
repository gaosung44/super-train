const button1 = document.getElementById("btn1");
const button2 = document.getElementById("btn2");
const button3 = document.getElementById("btn3");

button2.addEventListener("click",()=>{
    //オーディオコンテキスト
    const audioCtx = new window.AudioContext();
    //オシレーター(発振器)
    const oscillator = audioCtx.createOscillator();
    //ゲイン(音量調整)
    const gainNode = audioCtx.createGain();
    //設定
    oscillator.type = "square";
    //音の高さ(hz);
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    //音の余韻（エンベロープ）を設定して「ピコッ」と短くする
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // 初期音量
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1); // 0.1秒で消音
    // 5. 接続して再生
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1); // 0.1秒後に停止
});
button1.addEventListener("click",()=>{
    const audioCtx = new window.AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = "aquare";
    oscillator.frequency.value = 900;
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
});
button3.addEventListener("click",()=>{
    playMelody();
});
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const melody = [
    { f: 261.63, duration: 0.4 }, // ド
    { f: 293.66, duration: 0.4 }, // レ
    { f: 329.63, duration: 0.8 }, // ミ
];
function playMelody() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    let startTime = audioCtx.currentTime;
    melody.forEach((note) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = note.f;
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + note.duration - 0.05);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + note.duration);
        startTime += note.duration;
    });
}
