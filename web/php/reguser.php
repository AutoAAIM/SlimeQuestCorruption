<?php
	require_once 'db_config.php';

	$nombre = $_REQUEST["nombre"];
	$contrasena = $_REQUEST["contrasena"];

	$db = pg_connect("host=ec2-54-72-155-238.eu-west-1.compute.amazonaws.com port=5432 dbname=d2dhrlcmfkusbr user=$user password=5045da018ef45f5de1ff540679eee65915e03d1bf4b4e0d61a52d7c23d0f0efe");
	$query = "INSERT INTO usuarios(nombre, contrasena, dinero, id_zona) VALUES ('$nombre','$contrasena','0','1')";

	//UPDATE usuarios SET id_zona=2 WHERE nombre = $nombre AND contrasena = $contrasena"

	$result = pg_query($query);

	echo $result;

?>