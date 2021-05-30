<?php
	require_once 'db_config.php';

	$db = pg_connect("host=$dbserver port=5432 dbname=$database user=$user password=$password");

	$nombre = $_REQUEST["nombre"];
	$contrasena = $_REQUEST["contrasena"];	


	$respuesta = pg_query("select usuarios.nombre, usuarios.contrasena, usuarios.dinero, zonas.nombre as zonanombre, usuarios.inventario1, usuarios.inventario2, usuarios.inventario3, usuarios.inventario4 from usuarios, zonas where usuarios.nombre = '$nombre' and usuarios.contrasena = '$contrasena' and usuarios.id_zona = zonas.id_zona");

	$rstr = json_encode(pg_fetch_all($respuesta, true));
	echo $rstr;
	
?>