<?php
	require_once 'db_config.php';

	$db = pg_connect("host=$dbserver port=5432 dbname=$database user=$user password=$password");

	$nombre = $_REQUEST["nombre"];
	$contrasena = $_REQUEST["contrasena"];	

	$respuesta = pg_query("select usuarios, zonas.nombre as zonanombre from usuarios, zonas where usuarios.nombre = 'skull' and usuarios.contrasena = 'skag' and usuarios.id_zona = zonas.id_zona");

	$rstr = json_encode(pg_fetch_all($respuesta, true));
	echo $rstr;
	
?>