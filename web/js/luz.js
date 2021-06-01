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
		scene.lights.enable().setAmbientColor(0xCDCDCD);
	}

	oscuridad = false;
}