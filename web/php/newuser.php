<?php

	$numero = $_REQUEST("numero");

	$db = parse_url(getenv("DATABASE_URL"));
	$db["path"] = ltrim($db["path"], "/");

	//$db = $numero * 3;

	echo $db;
?>