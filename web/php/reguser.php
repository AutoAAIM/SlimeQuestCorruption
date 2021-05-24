<?php

	require 'SQLGlobal.php';

	if($_SERVER['REQUEST_METHOD']=='POST'){
		try{
			$nombre = $_REQUEST["nombre"];
			$contrasena = $_REQUEST["contrasena"];
		}
	}

?>