import './libs/webaudio-controls.js';

const getBaseURL = () => {
    return new URL('.', import.meta.url);
};

const template = document.createElement("template");
template.innerHTML = /*html*/`
  <style>
  canvas {
      border:1px solid black;
      margin-bottom:10px;
      height : 40%;
      background-color:black;
      margin-top : 10px;
      
  }

  blink {
    animation: blinker 0.6s linear infinite;
    color: rgb(204,68,0);
   }

  .main {
    
    border:5px solid;
    border-radius:20px;
    bordor-color: black;
    background-color:rgb(128,128,128);

    width:100%;
    height : 100%;
    text-align:center;
    font-family: "Open Sans";
    font-size: 12px;
  }

  button {
   border: none;
   height:  50px;
   width: 50px;
   border-radius: 50%;	
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   outline: none;
   transition: 0.5s;
   background: rgb(204,68,0);
}

.items{
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   margin-top:10px;

   
}

.itemAudio{
    display: flex;
  
 }

.item{
    padding:5px;
}


#progress{
    width:45%;
}

input[type='range'] {
    overflow: hidden;
    width: 80px;
    -webkit-appearance: none;
    background-color: black;
  }
  
  input[type='range']::-webkit-slider-runnable-track {
    height: 10px;
    -webkit-appearance: none;
    color: rgb(204,68,0);
    margin-top: -1px;
  }
  
  input[type='range']::-webkit-slider-thumb {
    width: 10px;
    -webkit-appearance: none;
    height: 10px;
    cursor: ew-resize;
    background: rgb(220,220,220);
    box-shadow: -100px 0 0 100px rgb(204,68,0);
  }

 

.parent{
    position: relative;
	height: 20%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
    padding : 10px;
	
}
.child{
    position: relative;
	height: 100%;
	width: 20%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

.child .equalizer{
    width:60%;
    color:white;
    background-color:#2d3436;
    margin-top:30px;
    padding:5px;
    border-radius:5px;
}
  
  
}
	
  </style>
  <div class="main">
  <h1>
      <blink>Music Player</blink>
    </h1>
  <canvas id="myCanvas" width=400></canvas>
  <audio id="myPlayer" crossorigin="anonymous"></audio>
  <br>
  <input id="progress" type="range" value=0>
  <label id="progressvalue" for="progress" ></label>
  </br>
<div class = "items">
  <button id="stop"><img src="./myComponents/assets/imgs/stop.png" /></button>
  <button id="recule10"><img src="./myComponents/assets/imgs/backward.png" /></button>
  <button id="play"><img src="./myComponents/assets/imgs/play.png" /></button> 
  <button id="pause"><img src="./myComponents/assets/imgs/pause.png" /></button>
  <button id="avance10"><img src="./myComponents/assets/imgs/forward.png" /></button>
</div>
<div class = "parent">
<div class = "child">
<div class = "itemAudio">
    <div class ="item">
    <br>
        <webaudio-knob id="volumeKnob" 
        src="./assets/imgs/Carbon.png" 
        value=5 min=0 max=20 step=0.01 
        diameter="64" 
        tooltip="Volume: %d"><p>Volume </p>
        </webaudio-knob>
    </div>
    <div class ="item">
    <br>
        <webaudio-knob id="vitesseLecture" 
        src="./assets/imgs/Carbon.png" 
        value=5 min=0 max=4 step=0.01 
        diameter="64" 
        tooltip="Vitesse: %d"><p> Vitesse De Lecture</p>
        </webaudio-knob>
    </div>
</div>
</div>
<div class = "child>
<div class="equalizer" id="equalizer-inputs">
                    <CENTER>
                    <label id="hz-value" for="eq-1">Band 60Hz:   </label>
                    <input id="eq-in-1" type="range" min="-20" max="20" value="0" step="0.1">
                    <label id="eq-value" for="eq-1">0</label>
                    <br>   
                    <label id="hz-value" for="eq-2">Band 170Hz:  </label>
                    <input id="eq-in-2" type="range" min="-20" max="20" value="0" step="0.1">
                    <label id="eq-value" for="eq-2">0</label>
                    <br>
                        <label id="hz-value" for="eq-3">Band 350Hz:  </label>
                    <input id="eq-in-3" type="range" min="-20" max="20" value="0" step="0.1">
                    <label id="eq-value" for="eq-3">0</label>
                    <br>
                        <label id="hz-value" for="eq-4">Band 1000Hz: </label>
                    <input id="eq-in-4" type="range" min="-20" max="20" value="0" step="0.1">
                    <label id="eq-value" for="eq-4">0</label>
                    <br>
                        <label id="hz-value" for="eq-5">Band 3500Hz: </label>
                    <input id="eq-in-5" type="range" min="-20" max="20" value="0" step="0.1">
                    <label id="eq-value" for="eq-5">0</label>
                    <br>
                        <label id="hz-value" for="eq-6">Band 10000Hz:</label>
                    <input id="eq-in-6" type="range" min="-20" max="20" value="0" step="0.1">
                        <label id="eq-value" for="eq-6">0</label>
                    </CENTER>
                </div>
    </div>
    </div>
</div>


  `;

class MyAudioPlayer extends HTMLElement {
    constructor() {
        super();
        // Récupération des attributs HTML
        //this.value = this.getAttribute("value");
        this.filters=[]
        // On crée un shadow DOM
        this.attachShadow({ mode: "open" });
       
        console.log("URL de base du composant : " + getBaseURL())
    }

    connectedCallback() {
        // Appelée automatiquement par le browser
        // quand il insère le web component dans le DOM
        // de la page du parent..

        // On clone le template HTML/CSS (la gui du wc)
        // et on l'ajoute dans le shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // fix relative URLs
        this.fixRelativeURLs();

        this.player = this.shadowRoot.querySelector("#myPlayer");
        this.player.src = this.getAttribute("src");

        // récupérer le canvas
        this.canvas = this.shadowRoot.querySelector("#myCanvas");
        this.ctx = this.canvas.getContext("2d");

        // Récupération du contexte WebAudio
        this.audioCtx = new AudioContext();

        // on définit les écouteurs etc.
        this.defineListeners();

        // On construit un graphe webaudio pour capturer
        // le son du lecteur et pouvoir le traiter
        // en insérant des "noeuds" webaudio dans le graphe
        this.build();
        // on démarre l'animation
        requestAnimationFrame(() => {
            this.animationLoop();
        });
    }

    build(){
        let audioContext = this.audioCtx;
        let player=this.player
        let sourceNode = audioContext.createMediaElementSource(player);
        this.buildAudioGraph(audioContext,player,sourceNode);
        this.buildequalizer(audioContext,player,sourceNode);
    }
    buildAudioGraph(audioContext,player,sourceNode) {
       
        // Create an analyser node
       
        this.analyserNode = audioContext.createAnalyser();
        // Try changing for lower values: 512, 256, 128, 64...
        this.analyserNode.fftSize = 256;
        this.bufferLength = this.analyserNode.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        // lecteur audio -> analyser -> haut parleurs
        sourceNode.connect(this.analyserNode);
        this.analyserNode.connect(audioContext.destination);
    }

    buildequalizer(audioContext,player,sourceNode){

        this.analyser = audioContext.createAnalyser();
        let filters=this.filters;
        [60, 170, 350, 1000, 3500, 10000].forEach(function(freq, i) {
      var eq = audioContext.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      filters.push(eq);
    });
    sourceNode.connect(filters[0]);
   for(var i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i+1]);
    }

   // connect the last filter to the speakers
   filters[filters.length - 1].connect(this.analyserNode);

  this.analyserNode.connect(audioContext.destination);

    }


animationLoop() {
    // 1 on efface le canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 2 on dessine les objets
    //this.ctx.fillRect(10+Math.random()*20, 10, 100, 100);
    // Get the analyser data
    this.analyserNode.getByteFrequencyData(this.dataArray);

    let barWidth = this.canvas.width / this.bufferLength;
    let barHeight;
    let x = 0;

    // values go from 0 to 256 and the canvas heigt is 100. Let's rescale
    // before drawing. This is the scale factor
    let heightScale = this.canvas.height / 128;

    for (let i = 0; i < this.bufferLength; i++) {
        barHeight = this.dataArray[i];

        this.ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        barHeight *= heightScale;
        this.ctx.fillRect(x, this.canvas.height - barHeight / 2, barWidth, barHeight / 2);

        // 2 is the number of pixels between bars
        x += barWidth + 1;
    }
    // 3 on deplace les objets

    // 4 On demande au navigateur de recommencer l'animation
    requestAnimationFrame(() => {
        this.animationLoop();
    });
}
fixRelativeURLs() {
    const elems = this.shadowRoot.querySelectorAll("webaudio-knob, webaudio-slider, webaudio-switch, img");
    elems.forEach(e => {
        const path = e.src;
        if (path.startsWith(".")) {
            e.src = getBaseURL() + path;
        }
    });
}
defineListeners() {
    this.shadowRoot.querySelector("#play").onclick = () => {
        this.player.play();
        this.audioCtx.resume();
    }

    this.shadowRoot.querySelector("#pause").onclick = () => {
        this.player.pause();
    }

    this.shadowRoot.querySelector("#avance10").onclick = () => {
        this.player.currentTime += 10;
    }

    this.shadowRoot.querySelector("#recule10").onclick = () => {
        this.player.currentTime -= 10;
    }

    this.shadowRoot.querySelector("#stop").onclick = () => {
        this.player.currentTime = 0;
        this.player.pause();
    }

    this.shadowRoot.querySelector("#vitesseLecture").oninput = (event) => {
        this.player.playbackRate = parseFloat(event.target.value);
        console.log("vitesse =  " + this.player.playbackRate);
    }

    this.shadowRoot.querySelector("#progress").onchange = (event) => {
        this.player.currentTime = parseFloat(event.target.value);
    }

    this.player.ontimeupdate = (event) => {
        let progressSlider = this.shadowRoot.querySelector("#progress");
        this.shadowRoot.querySelector("#progressvalue").innerHTML = parseInt(this.player.currentTime/60)+":"+parseInt((this.player.currentTime/60-parseInt(this.player.currentTime/60))*60)+"/"+parseInt((parseInt(this.player.duration/60)))+":"+parseInt((this.player.duration/60-parseInt(this.player.duration/60))*60);
         
        progressSlider.max = this.player.duration;
        progressSlider.min = 0;
        progressSlider.value = this.player.currentTime;
    }

    this.shadowRoot.querySelector("#volumeKnob").oninput = (event) => {
        this.player.volume = event.target.value;
    }

    this.shadowRoot.querySelectorAll('[id^=eq-in-]').forEach((e, i) => {
        e.oninput = (e) => {
                this.filters[i].gain.value = e.target.value
                this.shadowRoot.querySelectorAll('#eq-value')[i].innerHTML = e.target.value
            }
        })
}

    // L'API du Web Component

}

customElements.define("my-player", MyAudioPlayer);
