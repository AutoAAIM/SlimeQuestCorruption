import * as juego from './juego.js';
import * as yasha from './yasha.js';
import * as jotun from './jotun.js';

var scene;
var light;
var oscuridad = false;

export function create(s)
{
	scene = s;
}

export function encenderOscuridad()
{
	oscuridad = true;
}

export function darkMode()
{
	if(oscuridad)
	{
		scene.lights.enable().setAmbientColor(0x656565);
	}

	else
	{
		scene.lights.enable().setAmbientColor(0xffffff);
	}

	oscuridad = false;
}