<?php

	require 'SQLGlobal.php';

	require_once 'db_config.php';

	$nombre = $_REQUEST["nombre"];
	$contrasena = $_REQUEST["contrasena"];

	$db = pg_connect("host=ec2-54-72-155-238.eu-west-1.compute.amazonaws.com port=5432 dbname=d2dhrlcmfkusbr user=xwtkuhegmhwgib password=5045da018ef45f5de1ff540679eee65915e03d1bf4b4e0d61a52d7c23d0f0efe");
	$query = "INSERT INTO usuarios(nombre, contrasena, dinero, id_zona) VALUES ('$nombre','$contrasena','0','1')";
	$result = pg_query($query);

	echo $result;

	/*if($_SERVER['REQUEST_METHOD']=='POST'){
		try{
			

			//$respuesta = SQLGlobal::selectArray("INSERT INTO usuarios(nombre, contrasena) VALUES ('".$nombre."','".$contrasena."');");

			//$db = pg_connect(Database::getDb());
			//$query = "INSERT INTO usuarios(nombre, contrasena) VALUES ('".$nombre."','".$contrasena."')";
			//$result = pg_query($query);

			echo $contrasena;
		}catch(PDOException $e){
			echo "null";
		}
	}*/

?>