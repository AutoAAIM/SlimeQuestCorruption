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

	$flattened = iterator_to_array(new RecursiveIteratorIterator(new RecursiveIteratorIterator($respuesta)), false);
	echo $flattened;

	$rstr = json_encode($flattened, true);
	//$rstr = implode($rstr);
	echo $rstr;

?>