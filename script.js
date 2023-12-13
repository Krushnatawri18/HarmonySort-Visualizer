// source - visual web dev course or the melody maker

const n=10;
const array = [];

init();

let audioCtx = null;

function playSong(freq){
    if(audioCtx==null){
        // creating new object of audiocontext of native web audio API 
        audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)()
    }
    const dur=0.2;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init(){
    for(let i=0; i<n; i++){
        array[i]=Math.random();
    }
    showBars();
}

function play(){
    const copy=[...array];
    const moves=bubbleSort(copy);
    animate(moves);
}

function animate(moves){
    if(moves.length == 0){
        // to get black color after completing sorting
        showBars();
        return;
    }

    // shift method will always takes out first element and removes it from swapped array whenever animate() function calls again & again
    // const[i,j]=moves.shift();

    const move=moves.shift();
    const[i,j]=move.indices;
    if(move.type == "swap"){
        [array[i],array[j]]=[array[j],array[i]];
    }
    
    // linear intepolation
    playSong(200+array[i]*500);
    playSong(200+array[j]*500);

    // showBars([i,j]);
    showBars(move);
    setTimeout(function(){
        animate(moves);
    },100);
}

function bubbleSort(array){
    const moves = [];
    let swapped;
    do{
        swapped=false;
        for(let i=1; i<array.length; i++){
            // to get blue color if it is other "swap"
            // moves.push({indices:[i-1,i],type:"comp"});
            if(array[i-1]>array[i]){
                swapped=true;
                moves.push({indices:[i-1,i],type:"swap"});
                [array[i-1],array[i]]=[array[i],array[i-1]];
            }
        }
    }while(swapped);
    return moves;
}

function showBars(move){
    container.innerHTML="";
    for(let i=0; i<array.length; i++){
        const bar=document.createElement("div");
        bar.style.height = array[i]*100+"%";
        bar.classList.add("bar");

        // to emphsize on elements need to be sorted
        if(move && move.indices.includes(i)){
            // checking for indices of move where we need to change background
            // checking first and next bar as in blue color and then if it is swap then swap it and color it as red
            bar.style.backgroundColor = move.type =="swap"?"red":"blue";
        }

        container.appendChild(bar);
    }
}