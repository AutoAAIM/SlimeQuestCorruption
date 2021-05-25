<?php
	require_once 'db_config.php';

	$db = pg_connect("host=ec2-54-72-155-238.eu-west-1.compute.amazonaws.com port=5432 dbname=d2dhrlcmfkusbr user=$user password=5045da018ef45f5de1ff540679eee65915e03d1bf4b4e0d61a52d7c23d0f0efe");

	if($_SERVER['REQUEST_METHOD']=='GET'){
		try{

			$respuesta = pg_query($db,"select * from usuarios");
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

	$rstr = json_encode($respuesta, true);
	echo $rstr;
	echo '?';
	echo json_encode($respuestaz, true);
	
?>