<?php

	require 'SQLGlobal.php';

	if($_SERVER['REQUEST_METHOD']=='POST'){
		try{
			$nombre = $_REQUEST["nombre"];
			$contrasena = $_REQUEST["contrasena"];

			$respuesta = SQLGlobal::selectArray("INSERT INTO usuarios(nombre, contrasena) VALUES ('".$nombre."','".$contrasena."');");
		}catch(PDOException $e){
			echo "null";
		}
	}

?>