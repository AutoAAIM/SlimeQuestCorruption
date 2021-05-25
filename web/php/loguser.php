<?php
	require_once 'db_config.php';

	$db = pg_connect("host=$dbserver port=5432 dbname=$database user=$user password=$password");

	if($_SERVER['REQUEST_METHOD']=='GET'){
		try{

			echo 'estoy dentro';
			$respuesta = pg_query($db,"select * from usuarios");
			//echo json_encode(pg_fetch_all($respuesta));

			$respuestaz = pg_query($db,"select * from zonas");

			echo json_encode(array(
				'respuesta'=>'200',
				'estado' => 'Se obtuvieron los datos correctamente',
				'data'=>$respuesta,
				'error'=>''
			));
			echo '?';
		}catch(PDOException $e){
			echo json_encode(
				array(
					'respuesta'=>'-1',
					'estado' => 'Ocurrio un error, intentelo mas tarde',
					'data'=>'',
					'error'=>$e->getMessage())
			);
			echo '?';
		}
	}

	$rstr = json_encode(pg_fetch_all($respuesta, true));
	echo $rstr;
	echo '?';
	echo json_encode(pg_fetch_all($respuestaz, true));
	
?>