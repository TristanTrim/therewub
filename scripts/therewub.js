

// ehhhhhhh
//
var butt = document.getElementById("butt");
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

function loop() {
	if ( pointsTouches.length > 0 ) {
		let x = pointsTouches[0].clientX;
		let y = pointsTouches[0].clientY;
		if (x < window.innerWidth/2)
			x=window.innerWidth/2;	
		wubPuck.style.left = x-100+"px";
		wubPuck.style.top = y-100+"px";

		wub.frequency.value =
			Math.pow(2,
			0 +(
			6*( window.innerHeight -y)
			/window.innerHeight));
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
		carrier.frequency.value =
			Math.pow(2,
			5 +( 3*
			( window.innerHeight -y)
			/window.innerHeight));

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
