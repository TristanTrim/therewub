/**
 * RIFF WAVE PCM file generator
 *
 * Reference: www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html
 * Author: Lara Sophie Schütt
 * License: CC0
 *
 * Hacks for the Therewub
 * Author: Tristan Trim
 * License: GPL
 *
 */

const DUR = 0.05     // duration in seconds
const NCH = 1     // number of channels
const SPS = 44100 // samples per second
const BPS = 1     // bytes per sample

const SIZE = DUR * NCH * SPS * BPS

// PCM Data
// --------------------------------------------
// Field           | Bytes | Content
// --------------------------------------------
// ckID            |     4 | "fmt "
// cksize          |     4 | 0x0000010 (16)
// wFormatTag      |     2 | 0x0001 (PCM)
// nChannels       |     2 | NCH
// nSamplesPerSec  |     4 | SPS
// nAvgBytesPerSec |     4 | NCH * BPS * SPS
// nBlockAlign     |     2 | NCH * BPS * NCH
// wBitsPerSample  |     2 | BPS * 8

// data_size = DUR * NCH * SPS * BPS
// file_size = 44 (Header) + data_size

function dec2hex(n, l)
{
    n = n.toString(16)
    return new Array(l*2-n.length+1).join("0") + n
}

function hex2str(hex)
{
    let str = []

    if (hex.length % 2)
    {
        throw new Error("hex2str(\"" + hex + "\"): invalid input (# of digits must be divisible by 2)")
    }

    for (let i = 0; i < hex.length; i+=2)
    {
        str.push(String.fromCharCode(parseInt(hex.substr(i,2),16)))
    }

    return str.reverse().join("")
}

function put(n, l)
{
    return hex2str(dec2hex(n,l))
}



let b = document.getElementsByTagName('button')[0];

function genTone(freaq,vol){

	b.innerHTML = "foo";

	let data = "RIFF" + put(44 + SIZE, 4) + "WAVEfmt " + put(16, 4)

	data += put(1              , 2) // wFormatTag (pcm)
	data += put(NCH            , 2) // nChannels
	data += put(SPS            , 4) // nSamplesPerSec
	data += put(NCH * BPS * SPS, 4) // nAvgBytesPerSec
	data += put(NCH * BPS      , 2) // nBlockAlign
	data += put(BPS * 8        , 2) // wBitsPerSample

	data += "data" + put(SIZE, 4)



	for (let j = 0; j < SPS*DUR; j++)
	{
		data += put(
			Math.floor(
			(
			Math.sin(
			j/SPS * Math.PI * 2 * freaq
			) + 1
			) / 2 
			* 
			(
			Math.sin(
			j/SPS * Math.PI * 2 * 30
			) + 1
			) / 2 
			*
			vol
			*
			//((SPS*DUR-j)/(SPS*DUR))
			//* 
			Math.pow(
			2, BPS * 8
			)
			), BPS
		);
	}
	b.innerHTML = "bar";

	const WAV = new Audio("data:Audio/WAV;base64," + btoa(data))
	return(WAV);
}

function positionHandler(e) {
	b.innerHTML="pre";
	let s = 0;
	for (let i = 1;i<5;i++){
		setTimeout(
			()=>{genTone(120*i).play();},
			1000*DUR*s
		);
		s = s+1;

	}
	for (let i = 5;i>1;i--){
		setTimeout(
			()=>{genTone(120*i).play();},
			1000*DUR*s
		);
		s = s+1;

	}
	b.innerHTML="yo";
}
//WAV.setAttribute("controls","controls");
window.addEventListener('load',function() {
	/* hack to prevent firing the init script before the window object's values are populated */
	b.addEventListener('touchstart', positionHandler, false );
},false);

//document.body.appendChild(WAV)

/* Minified version with pre-defined header

    // RIFF WAVE PCM | Mono | 44100Hz | 8 bit
    for(i=44100*DUR,d="";i--;)d+=String.fromCharCode(~~((Math.sin(i/44100*6.283*440)+1)*128))
    new Audio("data:Audio/WAV;base64,"+btoa("RIFFdataWAVEfmt "+atob("EAAAAAEAAQBErAAARKwAAAEACABkYXRh/////w==")+d)).play()

    // Web Audio API equivalent (assumes 44100 kHz sample rate)
    a=new AudioContext()
    s=a.createScriptProcessor(t=b=4096,1,1)
    s.connect(a.destination)
    s.onaudioprocess=function(e){for(i=0;i<b;)e.outputBuffer.getChannelData(0)[i++]=Math.sin(t++/44100*6.283*440)}

*/
