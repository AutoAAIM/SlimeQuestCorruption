<?php
	require_once 'db_config.php';

	$nombre = $_REQUEST["nombre"];
	$contrasena = $_REQUEST["contrasena"];
	$dinero = $_REQUEST["dinero"];
	$zona = $_REQUEST["zona"];

	$db = pg_connect("host=$dbserver port=5432 dbname=$database user=$user password=$password");
	$query = "UPDATE usuarios SET id_zona=$zona, dinero=$dinero WHERE nombre = $nombre AND contrasena = $contrasena";
	echo $query;
	pg_query($query);

	$queryz = "select usuarios.nombre, usuarios.contrasena, usuarios.dinero, zonas.nombre as zonanombre from usuarios, zonas where usuarios.nombre = '$nombre' and usuarios.contrasena = '$contrasena' and usuarios.id_zona = zonas.id_zona";


	//ejemplo de update//UPDATE usuarios SET id_zona=2 WHERE nombre = $nombre AND contrasena = $contrasena"

	$result = pg_query($queryz);

	//echo $result;

?>