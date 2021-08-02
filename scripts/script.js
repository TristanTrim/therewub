/* multi-touch tracker */
var loopInterval = 20;//ms

var canvas,
	c, // c is the canvas' context 2D
	devicePixelRatio,
	container;

var pointsTouches = [], pointsTargetTouches = [], pointsChangedTouches = [];


function loop() {

	let startTime = Date.now();

	var slider = document.getElementById("myRange");
	b.innerHTML = slider.value;
	loopInterval = slider.value;

	if(canvas.height != window.innerHeight * devicePixelRatio) {
		resetCanvas();
	} else {
		c.clearRect(0,0,canvas.width, canvas.height);
	}

	if ( pointsTouches.length > 0 ) {
		c.fillStyle = "#fa0";
		c.fillRect(
			pointsTouches[0].clientX-50,
			pointsTouches[0].clientY-50,
			100,
			100,
		);
		genTone(
			Math.exp(
			5
			+(
			(
			window.innerHeight
			-pointsTouches[0].clientY
			)
			/200
			)
			)

			,

			pointsTouches[0].clientX
			/window.innerWidth
		).play();
	}

	if ( pointsTouches.length > 1 ) {
		c.fillStyle = "#00f";
		c.fillRect(
			pointsTouches[1].clientX-50,
			pointsTouches[1].clientY-50,
			100,
			100,
		);
	}


	let calcTime = Date.now() - startTime;
	b = document.getElementsByTagName('button')[0];
	//b.innerHTML=calcTime;
	
	setTimeout(loop,
		loopInterval);
} // end loop

function positionHandler(e) {
	if ((e.clientX)&&(e.clientY)) {
		points[0] = e;
	} else if (e.targetTouches) {
		pointsTouches = e.touches;
		//pointsTargetTouches = e.targetTouches;
		//pointsChangedTouches = e.changedTouches;
		e.preventDefault();
	}
}

function init() {
	canvas = document.createElement( 'canvas' );
	c = canvas.getContext( '2d' );
	container = document.createElement( 'div' );
	container.className = "container";
	resetCanvas();
	container.appendChild(canvas);
	document.body.appendChild( container );

	//b = document.getElementsByTagName('button')[0];
	b = canvas;
	
	// b.addEventListener('mousemove', positionHandler, false );
	b.addEventListener('touchstart', positionHandler, false );
	b.addEventListener('touchmove',  positionHandler, false );
	b.addEventListener('touchend',  positionHandler, false );
	b.addEventListener('touchcancel',  positionHandler, false );
	
	setTimeout(loop, loopInterval);


}// end of init

function resetCanvas() {
	// HiDPI canvas adapted from http://www.html5rocks.com/en/tutorials/canvas/hidpi/
	devicePixelRatio = window.devicePixelRatio || 1;
	canvas.width = window.innerWidth * devicePixelRatio;
	canvas.height = window.innerHeight * devicePixelRatio;
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';
	c.scale(devicePixelRatio, devicePixelRatio);
}

window.addEventListener('load',function() {
	/* hack to prevent firing the init script before the window object's values are populated */
	setTimeout(init,100);
},false);
