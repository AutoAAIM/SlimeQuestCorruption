<?php
	require_once 'db_config.php';

	$nombre = $_REQUEST["nombre"];
	$contrasena = $_REQUEST["contrasena"];
	$dinero = $_REQUEST["dinero"];
	$zona = $_REQUEST["zona"];
	$objeto1 = $_REQUEST["inventario1"];
	$objeto2 = $_REQUEST["inventario2"];
	$objeto3 = $_REQUEST["inventario3"];
	$objeto4 = $_REQUEST["inventario4"];

	$db = pg_connect("host=$dbserver port=5432 dbname=$database user=$user password=$password");
	$update = "UPDATE usuarios SET id_zona=$zona, dinero=$dinero, inventario1='$objeto1', inventario2='$objeto2', inventario3='$objeto3', inventario4='$objeto4' WHERE nombre = '$nombre' AND contrasena = '$contrasena'";
	//echo $query;
	pg_query($update);

	$queryz = "select usuarios.nombre, usuarios.contrasena, usuarios.dinero, zonas.nombre as zonanombre, usuarios.inventario1, usuarios.inventario2, usuarios.inventario3, usuarios.inventario4 from usuarios, zonas where usuarios.nombre = '$nombre' and usuarios.contrasena = '$contrasena' and usuarios.id_zona = zonas.id_zona";


	//ejemplo de update//UPDATE usuarios SET id_zona=2 WHERE nombre = $nombre AND contrasena = $contrasena"

	$result = pg_query($queryz);

	echo json_encode(pg_fetch_all($result, true));

?>