

// ehhhhhhh
//
/* multi-touch tracker */
var loopInterval = 20;//ms

var pointsTouches = [];

// audio
//
var context = new AudioContext()
var wub = context.createOscillator()
var carrier = context.createOscillator()
var wubGain = context.createGain();
var carrierGain = context.createGain();
var modulationGain = context.createGain();

wub.frequency.value = 5;
carrier.frequency.value = 120;

wubGain.gain = 0;
carrierGain.gain = 0;

wub.connect(wubGain);
carrier.connect(carrierGain);

carrierGain.connect(modulationGain);
wubGain.connect(modulationGain.gain);

c =  context.createConstantSource();//{offset: 1})
c.offset.value = 1;
c.connect(modulationGain.gain);

modulationGain.connect(context.destination);

c.start(0);
wub.start(0);
carrier.start(0);

// heres stuff for pucks
//
var wubPuck = document.getElementById("wub");
var carrierPuck = document.getElementById("carrier");

var wubDisplay = document.getElementById("wub-display");
var carrierDisplay = document.getElementById("carrier-display");

wubDisplay.innerHTML = "foo";
carrierDisplay.innerHTML = "foo";

function floorNote(f){
	if ( f < notes[0][1] ){
		return("too low", 1);
	}
	for (let i = 1; i<notes.length; i++){
		if ( f < notes[i][1] ){
			return(notes[i-1]);
		}
	}
	return(["too high",9001]);
}

function straightWubFreq(y){
	f = Math.pow(2,
		0 +(
		6*( window.innerHeight -y)
		/window.innerHeight));
	return( f );
}

function straightCarFreq(y){
	f = Math.pow(2,
		5 +( 3*
		( window.innerHeight -y)
		/window.innerHeight));
	return( floorNote( f ) );
}



// scales ! how do they work? Is this dorian mode? How can one know until they start to play!?!?!!!
carrierDisplay.innerHTML = "1";
carrierDisplay.innerHTML = getParameterByName("car");
if (getParameterByName("car") == "CmajAmin") {

	raw = false;

	carrierDisplay.innerHTML = "2";
	let newNotes = [];
	let i = 0;
	while (true){

		newNotes.push(notes[i]);
		// tone
		i+=2;
		if (i>= notes.length) break;

		newNotes.push(notes[i]);
		// tone
		i+=2;
		if (i>= notes.length) break;

		newNotes.push(notes[i]);
		// semitone
		i+=1;
		if (i>= notes.length) break;

		newNotes.push(notes[i]);
		// tone
		i+=2;
		if (i>= notes.length) break;

		newNotes.push(notes[i]);
		// tone
		i+=2;
		if (i>= notes.length) break;

		newNotes.push(notes[i]);
		// tone
		i+=2;
		if (i>= notes.length) break;

		newNotes.push(notes[i]);
		// semitone
		i+=1;
		if (i>= notes.length) break;

	}

	notes = newNotes;
} else if (getParameterByName("car") == "Chrom") {
	raw = false;
} else {
	raw = true;
}

function loop() {
	if ( pointsTouches.length > 0 ) {
		let x = pointsTouches[0].clientX;
		let y = pointsTouches[0].clientY;

		if (x < window.innerWidth/2)
			x=window.innerWidth/2;	
		wubPuck.style.left = x-100+"px";
		wubPuck.style.top = y-100+"px";

		f = straightWubFreq(y);

		wubDisplay.innerHTML = f.toFixed(4)+" Hz";

		wub.frequency.value = f;

		let wg = 
			8*( 
			(window.innerWidth- x)
			/window.innerWidth
			)-0.5;
		if (wg<0) wg=0;
		wubGain.gain.value = wg;
	}

	if ( pointsTouches.length > 1 ) {
		let x = pointsTouches[1].clientX;
		let y = pointsTouches[1].clientY;

		if (x > window.innerWidth/2)
			x=window.innerWidth/2;	
		carrierPuck.style.left = x-100+"px";
		carrierPuck.style.top = y-100+"px";

		nameandfreq = straightCarFreq(y);
		name = nameandfreq[0];
		if (raw){
			freq = f;
		}else{
			freq = nameandfreq[1];
		}

		carrierDisplay.innerHTML = freq.toFixed(4)+" Hz ("+name+")";

		carrier.frequency.value = freq;

		carrierGain.gain.value = 
			4* x /window.innerWidth;
	}
}

function positionHandler(e) {
	if (e.targetTouches) {
		pointsTouches = e.touches;
		e.preventDefault();
	}
}

function init() {
	wubPuck.style.position = "absolute";
	carrierPuck.style.position = "absolute";

	document.addEventListener('touchstart', positionHandler, false );
	document.addEventListener('touchmove',  positionHandler, false );
	document.addEventListener('touchend',  positionHandler, false );
	document.addEventListener('touchcancel',  positionHandler, false );

	setInterval(loop,loopInterval);
}

window.addEventListener('load',function() {
	/* hack to prevent firing the init script before the window object's values are populated */
	setTimeout(init,100);
},false);
