<?php
	require_once 'db_config.php';

	$nombre = $_REQUEST["nombre"];
	$contrasena = $_REQUEST["contrasena"];
	$dinero = $_REQUEST["dinero"];
	$zona = $_REQUEST["zona"];

	$db = pg_connect("host=$dbserver port=5432 dbname=$database user=$user password=$password");
	$query = "INSERT INTO usuarios(nombre, contrasena, dinero, id_zona) VALUES ('$nombre','$contrasena','0','1')";

	//ejemplo de update//UPDATE usuarios SET id_zona=2 WHERE nombre = $nombre AND contrasena = $contrasena"

	$result = pg_query($query);

	echo $result;

?>