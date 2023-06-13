
var loopInterval = 20;//ms



	// heres stuff for pucks
	//
var wubPuck = document.getElementById("wub");
var carrierPuck = document.getElementById("carrier");
var untouched = true;
var whichPuck = 0;

// because I am coding on a phone, my debug
// tools consist of printlining to this div
// It's super dumb.
var debugDisplay = document.getElementById("debug-display");
var wubDisplay = document.getElementById("wub-display");
var carrierDisplay = document.getElementById("carrier-display");
var initOnce = false;

wubDisplay.innerHTML = "foo";
carrierDisplay.innerHTML = "foo";

function initTherewub(){
	if(initOnce){
		return;
	}
	initOnce = true;
	// ehhhhhhh
	//
	/* multi-touch tracker */
	var pointsTouches = [];

	// audio
	//
	var context = new AudioContext()
	window.wub = context.createOscillator()
	window.carrier = context.createOscillator()
	window.wubGain = context.createGain();
	window.carrierGain = context.createGain();
	window.modulationGain = context.createGain();

	window.wub.frequency.value = 5;
	window.carrier.frequency.value = 120;

	window.wubGain.gain = 0;
	window.carrierGain.gain = 0;

	window.wub.connect(window.wubGain);
	window.carrier.connect(window.carrierGain);

	window.carrierGain.connect(window.modulationGain);
	window.wubGain.connect(window.modulationGain.gain);

	c =  context.createConstantSource();//{offset: 1})
	c.offset.value = 1;
	c.connect(window.modulationGain.gain);

	window.modulationGain.connect(context.destination);

	c.start(0);
	window.wub.start(0);
	window.carrier.start(0);

}

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

	if ( pointsTouches.length == 0){
		//console.log("I feel so untouched");
		untouched = true;
	}else{
		if( untouched ){
			//console.log("I feel so touched");
			if( pointsTouches[0].clientX < window.innerWidth/2 ){
				whichPuck = 1;
			}else{
				whichPuck = 0;
			}
			untouched = false;
		}

		// wub aka modulation
		if ( whichPuck == 0  || pointsTouches.length > 1) {
			if (untouched){
				
			}
			let x = pointsTouches[0+whichPuck].clientX;
			let y = pointsTouches[0+whichPuck].clientY;

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


			window.wub.frequency.value = freq;

			let wg = 
				8*( 
				(window.innerWidth- x)
				/window.innerWidth
				)-0.5;
			if (wg<0) wg=0;
			window.wubGain.gain.value = wg;
		}

		// melody / carrier / car
		if ( whichPuck == 1 || pointsTouches.length > 1) {
			let x = pointsTouches[1-whichPuck].clientX;
			let y = pointsTouches[1-whichPuck].clientY;

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

			window.carrier.frequency.value = freq;

			window.carrierGain.gain.value = 
				4* x /window.innerWidth;
		}
	}
}

function positionHandler(e) {
	if (e.targetTouches) {
		pointsTouches = e.touches;
		e.preventDefault();
	}
	else if( e.buttons == 1 )
	{
		pointsTouches = [{"clientX":e.x,"clientY":e.y}];
		e.preventDefault();
	}
	else{
		pointsTouches = [];
	}
}

function initLoad() {

	document.addEventListener('touchstart', initAfterClick, false );
	document.addEventListener('mousedown', initAfterClick, false );

}
function initAfterClick() {
	wubPuck.style.position = "absolute";
	carrierPuck.style.position = "absolute";

	initTherewub();

	document.addEventListener('touchstart', positionHandler, false );
	document.addEventListener('touchmove',  positionHandler, false );
	document.addEventListener('touchend',  positionHandler, false );
	document.addEventListener('touchcancel',  positionHandler, false );
	
	document.addEventListener('mousemove',  positionHandler, false );
	document.addEventListener('mousedown',  positionHandler, false );

	setInterval(loop,loopInterval);
}

window.addEventListener('load',function() {
	/* hack to prevent firing the init script before the window object's values are populated */
	setTimeout(initLoad,100);
},false);
