//Creates an html element for the stopwatch
class Stopwatch extends HTMLElement {
    
 
      
    constructor() {
        super();

        
        this.attachShadow({mode: 'open'});
        this.loadStyles('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');
        this.shadowRoot.innerHTML = `
            <style>
                /* ... existing styles ... */
                #reset {
                    position: relative;
                    overflow: hidden;
                    padding: 0; /* Remove padding */
                    line-height: 1; /* Adjust line-height */
                }
                .progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }
            </style>
            <div style="padding: 20px; text-align: center">
                <div class="container" style="margin: 20px auto; max-width: 300px; text-align: center">      
                   <input type="text" class="form-control" placeholder="Name" style="margin-bottom: 20px; border: 2px solid #f8f9fa; background-color: #343a40; color: #f8f9fa; text-align: center;"> 
                </div>  
                <div class="stopwatch" style="font-family: Consolas, fantasy; font-size: 2em; margin-bottom: 20px;">
                    00:00:00
                </div>
                <div class="controls">
                    <button id="start-pause" class="btn btn-primary" style="margin-right: 10px;">Start</button>
                    <button id="reset" class="btn btn-secondary">
                        Reset
                        <div class="progress" style="height: 20px; margin-top: 10px;">
                            <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </button>
                </div>
            </div>
    `;
        this.shadowRoot.querySelector('#start-pause').addEventListener('click', () => this.startPause());
        this.time = 0;
        this.timerDisplay = this.shadowRoot.querySelector('.stopwatch');
        this.resetProgressBar = this.shadowRoot.querySelector('.progress-bar');
        this.shadowRoot.querySelector('#reset').addEventListener('mousedown', () => this.startReset());
        this.shadowRoot.querySelector('#reset').addEventListener('mouseup', () => this.stopReset());
        
    }

    startPause() {
        if (this.shadowRoot.querySelector('#start-pause').textContent === 'Start') {
            this.shadowRoot.querySelector('#start-pause').textContent = 'Pause';
            console.log('Start');
            this.interval = setInterval(() => {
                this.time++;
                var hours = Math.floor(this.time / 3600);
                var minutes = Math.floor((this.time % 3600) / 60);
                var seconds = this.time % 60;
                this.shadowRoot.querySelector('.stopwatch').textContent =
                    `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

            } , 1000);
        } else {
            this.shadowRoot.querySelector('#start-pause').textContent = 'Start';
            console.log('Pause');
            clearInterval(this.interval); // Clear the interval when the stopwatch is paused
        }
    }
    resetStopwatch() {
        this.time = 0;
        this.timerDisplay.textContent = '00:00:00';
        clearInterval(this.interval);
        this.shadowRoot.querySelector('#start-pause').textContent = 'Start';
        this.resetProgressBar.style.width = '0%';
    }

    startReset() {
        const resetDuration = 4000; // 4 seconds
        const startTime = Date.now();
    
        this.resetTimeout = setTimeout(() => this.resetStopwatch(), resetDuration);
        this.resetProgress = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const percentage = Math.min(100, (elapsedTime / resetDuration) * 100);
            this.resetProgressBar.style.width = percentage + '%';
        }, 10);
    }

    stopReset() {
        clearTimeout(this.resetTimeout);
        clearInterval(this.resetProgress);
        this.resetProgressBar.style.width = '0%';
    } 


    async loadStyles(url) {
        const res = await fetch(url);
        const text = await res.text();
        const style = document.createElement('style');
        style.textContent = text;
        this.shadowRoot.appendChild(style);
    }
}


customElements.define('my-stopwatch', Stopwatch);