export function collisionSwitch(obj, value)
{
	obj.collideDown = value;
	obj.collideLeft = value;
	obj.collideRight = value;
	obj.collideUp = value;
}

export function convertToProperties(obj)
{
	/*var num = 0// = obj.data.list.length

	while(obj.data.list[num] != undefined){num++}

	console.log(obj.data.list)
	//var cadena = String('')
	obj.properties = new Object

	for (var i = 0; i < num; i++)
	{
		var o = obj.data.list[i]
		
		eval('obj.properties.'+o.name+' = '+o.value+';')
	}

	//console.log(cadena)*/

	obj.properties = obj.data.list;
	//console.log(obj.properties)
}

/*export function createTextInput(scene)
{
	scene.load.html('nameform', 'assets/text/nameform.html');

	var element = scene.add.dom(100, 100).createFromCache('nameform');

    element.addListener('click');

    element.on('click', function (event) {

        if (event.target.name === 'playButton')
        {
            var inputText = this.getChildByName('nameField');

            //  Have they entered anything?
            if (inputText.value !== '')
            {
                //  Turn off the click events
                this.removeListener('click');

                //  Hide the login element
                this.setVisible(false);

                //  Populate the text with whatever they typed in
                text.setText('Welcome ' + inputText.value);
            }
            else
            {
                //  Flash the prompt
                this.scene.tweens.add({
                    targets: text,
                    alpha: 0.2,
                    duration: 250,
                    ease: 'Power3',
                    yoyo: true
                });
                        }
        }

    });

	return element;
}*/

