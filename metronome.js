(function(){
	const minute = 60000; // one minute in milliseconds
	let bpm ; // will store the metronome play rate Beats Per Minute (BPM)
	let readyPlay = false; // indicates whether metronome will play or not
	let timer; // this will store setInterval, so we can stop the metronome
	let audioCtx; // Audio Context - contains web audio objects
	let gainNode; // controls the web audio
	let _playController, _beats, _beatSlider; // store DOM object nodes

	// Initializes Metronome
	function init(){
		_cacheDom();
		_addEvents();
		updateBPM();
		buildAudio(); 
	}

	// captures and store needed html DOM elements
	function _cacheDom(){
		_playController = document.querySelector('.play');
		_controllerText = document.querySelector('.play-text');
		_beats = document.querySelector('.beats');
		_beatSlider = document.querySelector('.beat-slider');
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
		// need to store setInterval in timer, so that we can stop, so we can call it when we wish to stop
		timer = window.setInterval(function(){beat()}, minute/bpm);
		// Modify Button content
		_controllerText.classList.remove('fa-play');
		_controllerText.classList.add('fa-pause');
	}

	// stops the metronome
	function stop(){
		// Stop setInterval function
		window.clearInterval(timer);
		// Modify Button content
		_controllerText.classList.remove('fa-pause');
		_controllerText.classList.add('fa-play');
	}

	// this function produces the beat audio
	function beat(){
		gainNode.gain.value = .4; // sets audio to 40% volume
		_playController.classList.add('hit-effect'); // visual beat display
		window.setTimeout(function(){
			gainNode.gain.value = 0;// set audio to zero(inaudible) and prevents audio clipping
			_playController.classList.remove('hit-effect'); // hide to replicate pulse
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
		// this dictates the shape of the sound wave which changes the type of noice produced
		// the default is a 'sine' wave, which looks like a tradional ocean wave with an crest and trough
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

