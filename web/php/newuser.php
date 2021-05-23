<?php
	require 'SQLGlobal.php';

	if($_SERVER['REQUEST_METHOD']=='GET'){
		try{
			$respuesta = SQLGlobal::selectArray("select * from usuarios");
			echo json_encode(array(
				'respuesta'=>'200',
				'estado' => 'Se obtuvieron los datos correctamente',
				'data'=>$respuesta,
				'error'=>''
			));
		}catch(PDOException $e){
			echo json_encode(
				array(
					'respuesta'=>'-1',
					'estado' => 'Ocurrio un error, intentelo mas tarde',
					'data'=>'',
					'error'=>$e->getMessage())
			);
		}
	}

	//$rstr = implode("?", $respuesta);
	//$rstr = print_r($respuesta, true);
	$rstr = implode("?",$respuesta));
	//print_r($out);
	//$rstr = json_encode($respuesta);
	//$rstr = convert_multi_array($respuesta);
	echo $rstr;

?>