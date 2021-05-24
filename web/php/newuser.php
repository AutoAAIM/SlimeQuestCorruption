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

	function flatten_array(array $items, array $flattened = []) {
		foreach ($items as $item) {
			if (is_array($item)) {
				$flattened = flatten_array($item, $flattened);
				continue;
			}

			$flattened[] = $item;
		}
		
		return $flattened;
	}

	$rstr = flatten_array($array);

	//$rstr = json_encode($flattened, true);
	//$rstr = implode($rstr);
	echo $rstr;

?>