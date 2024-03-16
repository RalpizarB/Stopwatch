function Stopwatch(display) {
    this.startTime = null;
    this.endTime = null;
    this.running = false;
    this.duration = 0;
    this.display = display;
}

Stopwatch.prototype = {
    start: function() {
        console.log('Start button clicked');
    },
    stop: function() {
        console.log('Stop button clicked');
    },
    reset: function() {
        console.log('Reset button clicked');
    }
}
Stopwatch.prototype.start = function() {
    if (this.running) {
        console.log('Stopwatch is already running');
        return;
    }
    this.running = true;
    this.startTime = new Date();
    console.log('Start button clicked, stopwatch started');

    // Start updating the duration every second
    this.updateInterval = setInterval(() => this.update(), 1000);
};
class StopwatchElement extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._display = document.createElement('span');
        this._shadowRoot.appendChild(this._display);
        this._stopwatch = new Stopwatch(this._display);
    }

    connectedCallback() {
        this._shadowRoot.innerHTML = `
            <button id="start">Start</button>
            <button id="stop">Stop</button>
            <button id="reset">Reset</button>
        `;
        this._shadowRoot.querySelector('#start').addEventListener('click', () => this._stopwatch.start());
        this._shadowRoot.querySelector('#stop').addEventListener('click', () => this._stopwatch.stop());
        this._shadowRoot.querySelector('#reset').addEventListener('click', () => this._stopwatch.reset());
    }

    disconnectedCallback() {
        this._shadowRoot.querySelector('#start').removeEventListener('click', () => this._stopwatch.start());
        this._shadowRoot.querySelector('#stop').removeEventListener('click', () => this._stopwatch.stop());
        this._shadowRoot.querySelector('#reset').removeEventListener('click', () => this._stopwatch.reset());
    }
}

customElements.define('stopwatch-element', StopwatchElement);

Stopwatch.prototype.update = function() {
    if (!this.running) return;
    const now = new Date();
    const seconds = (now.getTime() - this.startTime.getTime()) / 1000;
    this.duration += seconds;
    this.startTime = now;

    // Update the display
    this.display.textContent = this.formatTime(this.duration);
};
Stopwatch.prototype.formatTime = function(timeInSeconds) {
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
    let seconds = Math.floor(timeInSeconds - (hours * 3600) - (minutes * 60));

    if (hours < 10) {hours = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};
Stopwatch.prototype.stop = function() {
    if (!this.running) {
        console.log('Stopwatch is not started');
        return;
    }
    this.running = false;
    clearInterval(this.updateInterval);
    console.log('Stop button clicked, stopwatch stopped');


};

Stopwatch.prototype.reset = function() {
    this.startTime = null;
    this.running = false;
    this.duration = 0;
    clearInterval(this.updateInterval);
    console.log('Reset button clicked, stopwatch reset');
    //Update the display
    this.display.textContent = this.formatTime(this.duration);
};

// Create an instance of the Stopwatch
let stopwatches = [];

// Create the first stopwatch instance and store it in the array
let stopwatch = new Stopwatch(document.querySelector('.stopwatch:first-child .stopwatch-time'));
stopwatches.push(stopwatch);

// Add event listeners to the buttons of the first stopwatch
document.querySelectorAll('.stopwatch button').forEach(button => {
    button.addEventListener('click', function() {
        let action = this.dataset.action;
        stopwatch[action]();
    });
});

let buttons = document.querySelectorAll('[data-action]');
buttons.forEach(button => {
    button.addEventListener('click', function() {
        let action = this.dataset.action;
        stopwatch[action]();
    });
});
document.getElementById('add-stopwatch').addEventListener('click', function() {
    // Create a new stopwatch div
    let newStopwatch = document.createElement('div');
    newStopwatch.className = 'stopwatch';

    // Add the input field for the stopwatch name
    let nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'form-control stopwatch-name';
    nameInput.placeholder = 'Enter stopwatch name';
    newStopwatch.appendChild(nameInput);

    // Add the div for the stopwatch time
    let timeDiv = document.createElement('div');
    timeDiv.className = 'stopwatch-time';
    timeDiv.textContent = '00:00:00';
    newStopwatch.appendChild(timeDiv);

    // Add the start, stop, and reset buttons
    let buttonTypes = ['start', 'pause', 'reset'];
    let buttonClasses = ['btn-success', 'btn-danger', 'btn-warning'];
    let buttonIcons = ['fa-play', 'fa-pause', 'fa-redo'];
    for (let i = 0; i < buttonTypes.length; i++) {
        let button = document.createElement('button');
        button.className = 'btn ' + buttonClasses[i];
        button.dataset.action = buttonTypes[i];

        let icon = document.createElement('i');
        icon.className = 'fas ' + buttonIcons[i];
        button.appendChild(icon);

        button.textContent = ' ' + buttonTypes[i].charAt(0).toUpperCase() + buttonTypes[i].slice(1);
        newStopwatch.appendChild(button);
    }

    // Append the new stopwatch to the container
    document.querySelector('.container').appendChild(newStopwatch);

    // Create a new Stopwatch instance
    let newStopwatchInstance = new Stopwatch(newStopwatch.querySelector('.stopwatch-time'));
    stopwatches.push(newStopwatchInstance);

    // Add event listeners to the buttons
    newStopwatch.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            let action = this.dataset.action;
            newStopwatchInstance[action]();
        });
    });
});