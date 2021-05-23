<?php

	$numero = $_REQUEST["numero"];

	$db = parse_url(getenv("postgres://xwtkuhegmhwgib:5045da018ef45f5de1ff540679eee65915e03d1bf4b4e0d61a52d7c23d0f0efe@ec2-54-72-155-238.eu-west-1.compute.amazonaws.com:5432/d2dhrlcmfkusbr"));
	$db["d2dhrlcmfkusbr"] = ltrim($db["d2dhrlcmfkusbr"], "/");

	//$db = $numero;

	echo $db;
?>