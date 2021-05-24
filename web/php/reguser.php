<?php

	require 'SQLGlobal.php';

	require_once 'db_config.php';

	if($_SERVER['REQUEST_METHOD']=='POST'){
		try{
			$nombre = $_REQUEST["nombre"];
			$contrasena = $_REQUEST["contrasena"];

			//$respuesta = SQLGlobal::selectArray("INSERT INTO usuarios(nombre, contrasena) VALUES ('".$nombre."','".$contrasena."');");

			//$db = pg_connect(Database::getDb());
			//$query = "INSERT INTO usuarios(nombre, contrasena) VALUES ('".$nombre."','".$contrasena."')";
			//$result = pg_query($query);

			echo $contrasena;
		}catch(PDOException $e){
			echo "null";
		}
	}

?>