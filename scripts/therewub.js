

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

// because I am coding on a phone, my debug
// tools consist of printlining to this div
// It's super dumb.
var debugDisplay = document.getElementById("debug-display");
var wubDisplay = document.getElementById("wub-display");
var carrierDisplay = document.getElementById("carrier-display");

wubDisplay.innerHTML = "foo";
carrierDisplay.innerHTML = "foo";


////////////////////////////////////////
// coord to frequency & frequency floor
////////////////////////////////////////

function floorNote(f){
	if ( f < carNotes[0][1] ){
		return("too low", 1);
	}
	for (let i = 1; i<carNotes.length; i++){
		if ( f < carNotes[i][1] ){
			return(carNotes[i-1]);
		}
	}
	return(["too high",9001]);
}

function floorWub(f){
	if ( f < wubNotes[0][1] ){
		return("too slow", 0.01);
	}
	for (let i = 1; i<wubNotes.length; i++){
		if ( f < wubNotes[i][1] ){
			return(wubNotes[i-1]);
		}
	}
	return(wubNotes[wubNotes.length-1]);
}

function getWubFreq(y){
	f = Math.pow(2,
		0 +(
		6*( window.innerHeight -y)
		/window.innerHeight));
	return( floorWub(f) );
}

function getCarFreq(y){
	f = Math.pow(2,
		5 +( 3*
		( window.innerHeight -y)
		/window.innerHeight));
	return( floorNote( f ) );
}


//////////////////////////
// create musical scale
//////////////////////////

///// MELODY SCALE

// scales ! how do they work? Is this dorian mode? How can one know until they start to play!?!?!!!
if (getParameterByName("car") == "CmajAmin") {

	carrierIsRaw = false;

	let newNotes = [];
	let i = 0;
	while (true){

		newNotes.push(carNotes[i]);
		// tone
		i+=2;
		if (i>= carNotes.length) break;

		newNotes.push(carNotes[i]);
		// tone
		i+=2;
		if (i>= carNotes.length) break;

		newNotes.push(carNotes[i]);
		// semitone
		i+=1;
		if (i>= carNotes.length) break;

		newNotes.push(carNotes[i]);
		// tone
		i+=2;
		if (i>= carNotes.length) break;

		newNotes.push(carNotes[i]);
		// tone
		i+=2;
		if (i>= carNotes.length) break;

		newNotes.push(carNotes[i]);
		// tone
		i+=2;
		if (i>= carNotes.length) break;

		newNotes.push(carNotes[i]);
		// semitone
		i+=1;
		if (i>= carNotes.length) break;

	}

	carNotes = newNotes;

} else if (getParameterByName("car") == "Chrom") {
	carrierIsRaw = false;
} else {
	carrierIsRaw = true;
}

///// WUB SCALE

wubNotes = [["2/1",0.5]];
for( let i=1; i<=64; i=2*i ){
	wubNotes.push(["1/"+i,i]);
}
if (getParameterByName("wub") == "dubs") {
	wubIsRaw = false;
}else{
	wubIsRaw = true;
}


///////////////////
// "mainloop"
///////////////////

function loop() {

	// TODO handle multi touches better
	// maybe have any touch -> car or wub
	// be based on side of screen
	// then... you could also allow
	// chords. That would be cool.

	// wub aka modulation
	if ( pointsTouches.length > 0 ) {
		let x = pointsTouches[0].clientX;
		let y = pointsTouches[0].clientY;

		if (x < window.innerWidth/2)
			x=window.innerWidth/2;	
		wubPuck.style.left = x-100+"px";
		wubPuck.style.top = y-100+"px";

		let nameandfreq = getWubFreq(y);// TODO not side effect f

		let name = nameandfreq[0];
		if (wubIsRaw){
			freq = f;
			name = name+"ish";
		}else{
			freq = nameandfreq[1];
		}
		wubDisplay.innerHTML = freq.toFixed(4)+" Hz ("+name+")";


		wub.frequency.value = freq;

		let wg = 
			8*( 
			(window.innerWidth- x)
			/window.innerWidth
			)-0.5;
		if (wg<0) wg=0;
		wubGain.gain.value = wg;
	}

	// melody / carrier / car
	if ( pointsTouches.length > 1 ) {
		let x = pointsTouches[1].clientX;
		let y = pointsTouches[1].clientY;

		if (x > window.innerWidth/2)
			x=window.innerWidth/2;	
		carrierPuck.style.left = x-100+"px";
		carrierPuck.style.top = y-100+"px";

		let nameandfreq = getCarFreq(y);
		name = nameandfreq[0];
		if (carrierIsRaw){
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
