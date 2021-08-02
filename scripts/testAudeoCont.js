var context = new AudioContext()
var wub = context.createOscillator()
var carrier = context.createOscillator()
var wubGain = context.createGain();
var carrierGain = context.createGain();
var modulationGain = context.createGain();

wub.frequency.value = 5;
carrier.frequency.value = 120;

wubGain.gain = 1;
carrierGain.gain = 0.5;

wub.connect(wubGain);
carrier.connect(carrierGain);

carrierGain.connect(modulationGain);
wubGain.connect(modulationGain.gain);


//c = new ConstantSourceNode(c, {offset: 1})
c =  context.createConstantSource();//{offset: 1})
c.offset.value = 1;
c.connect(modulationGain.gain);
c.start(0);
//o.connect(g);
//c.connect(g);


modulationGain.connect(context.destination);

wub.start(0);
carrier.start(0);

var freaq = 100;
b = document.getElementsByTagName('button')[0];
b.addEventListener('touchstart',
	()=>{
		freaq=freaq+100;
		carrier.frequency.value = freaq;
	}, false );

var slider = document.getElementById("myRange");

slider.onchange = ()=>{
	wubGain.gain.value = slider.value;
	b.innerHTML = wubGain.gain;
}

