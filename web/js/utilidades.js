export function collisionSwitch(obj, value)
{
	obj.collideDown = value;
	obj.collideLeft = value;
	obj.collideRight = value;
	obj.collideUp = value;
}

export function convertToProperties(obj)
{
	obj.properties = obj.data.list;
}
