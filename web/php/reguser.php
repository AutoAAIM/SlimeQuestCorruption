<?php

	require 'SQLGlobal.php';

	if($_SERVER['REQUEST_METHOD']=='POST'){
		try{
			$nombre = $_REQUEST["nombre"];
			$contrasena = $_REQUEST["contrasena"];

			$respuesta = SQLGlobal::selectArray("INSERT INTO usuarios(nombre, contrasena) VALUES ('".$nombre."','".$contrasena."');");

			$db = pg_connect("host=localhost port=5432 dbname=postgres user=postgres password=myadmin123");
			$query = "INSERT INTO book VALUES ('$_POST[bookid]','$_POST[book_name]',
			'$_POST[price]','$_POST[dop]')";
			$result = pg_query($query);

			echo 
		}catch(PDOException $e){
			echo "null";
		}
	}

?>