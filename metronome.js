// Everying is instantiated in an immediately invoked function
// Because all the code lives inside of an anonymous function none of it is accessible to the Global scope
(function(){
	const minute = 60000; // one minute in milliseconds

	let bpm ; // will store the metronome play rate Beats Per Minute (BPM)
	let readyPlay = false; // indicates whether metronome will play or not
	let timer; // this will store setInterval, so we can stop/pause the metronome
	let audioCtx; // Audio Context - contains web audio objects
	let gainNode; // controls the web audio
	// store DOM object nodes
	let _playController, _controllerText, _beats, _beatSlider;

	// Initializes Metronome
	function init(){
		_cacheDom();
		_addEvents();
		updateBPM();
		buildAudio(); 
	}

	// captures and stores needed html DOM elements
	function _cacheDom(){
		_playController = document.querySelector('.play'); // Play button
		_controllerText = document.querySelector('.play-text'); // Button content (icon)
		_beats = document.querySelector('.beats'); // BPM display number
		_beatSlider = document.querySelector('.beat-slider'); // BMP Slider Input
	}

	// applies required event listeners to DOM Objects
	function _addEvents(){
		// Fires on click of play/pause button
		_playController.addEventListener('click', function(){
			readyPlay = !readyPlay; // swaps boolean value
			playController();
		});

		//When dragging the slider will update the bpm value
		_beatSlider.addEventListener('input', function(){updateBPM()});

		// Restart/update the playing BPM upon moving the slider, regardless of whether it's on or off
		//event fires upon releasing the slider
		_beatSlider.addEventListener('change', function(){
			stop(); // stops the current setInterval BPM
			playController(); // starts the new BPM
		});
	}

	// updates the bpm value
	function updateBPM(){
		// 40 lowest bpm on slider, slide increments by 4
		bpm = _beatSlider.value * 4 + 40;
		// displays BPM rate on UI
		_beats.innerHTML = bpm;
	}

	// Checks whether or not to start playing or stop the metronome
	function playController(){
		// If ready to play
		if(readyPlay)
			play();
		else {
			stop();
		}
	}

	//starts the metronome
	function play(){
		beat(); // plays the first beat
		// need to store setInterval in timer, so that we can stop it and call it when we wish to stop
		timer = window.setInterval(function(){beat()}, minute/bpm);
		// Modify Button content - change play icon to pause icon
		_controllerText.classList.remove('fa-play');
		_controllerText.classList.add('fa-pause');
	}

	// stops the metronome
	function stop(){
		// Stops setInterval function from making any more timed calls
		window.clearInterval(timer);
		// Modify Button content - change pause icon to play icon
		_controllerText.classList.remove('fa-pause');
		_controllerText.classList.add('fa-play');
	}

	// this function produces the beat audio
	function beat(){
		gainNode.gain.value = .4; // sets audio to 40% volume
		_playController.classList.add('hit-effect'); // applies visual beat display
		
		// Determines length of time to play each beat sound - in this case being 100 milliseconds
		window.setTimeout(function(){
			// set audio to zero(inaudible) to end beat sound and prevents audio clipping
			gainNode.gain.value = 0;
			
			// removes visual effect to replicate pulse
			_playController.classList.remove('hit-effect');
		},100);
	}

	// Creates the WebAudio objects needed to produce tone
	function buildAudio(){
		// AudioContext is used to create the neccesary audio controllers, and connect them together to produce audio
		audioCtx = new window.AudioContext;
		
		// Creates an oscillator - oscillators generates a period wave form (this is what produces sound, think of "sound wave")
		let oscillator = audioCtx.createOscillator();
		
		// creates a gainNode - used as the volume controller
		gainNode = audioCtx.createGain();
		
		// connects the gain and oscillator nodes, so that the gain can control the oscillators volume
		oscillator.connect(gainNode);

		// this dictates the shape of the sound wave which changes the type of noise produced
		// the default is a 'sine' wave, which looks like a tradional ocean wave with a crest and trough
		oscillator.type = 'triangle'; // traingle wave  — other values are 'square', 'sawtooth', and 'custom'

		oscillator.frequency.value = 261.63; // sets the frequency value in hertz for a C - note
		
		// turns on the oscillator to produce sound - will not produce sound at this po
		oscillator.start();
		
		// A final connection needs to be made between the gainNode and destination(typcially the speakers of your device)
		// We are building a chain of nodes to produce the sound 
		// oscillator(sound signal) -- gain(volume) -- destination (speakers)
		gainNode.connect(audioCtx.destination);

		gainNode.gain.value = 0; // sets volume to 0% so we will not hear anything
	}
	// build metronome
	init();
})()

