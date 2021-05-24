<?php
	require 'SQLGlobal.php';

	if($_SERVER['REQUEST_METHOD']=='GET'){
		try{
			$respuesta = SQLGlobal::selectArray("select * from usuarios");
			/*echo json_encode(array(
				'respuesta'=>'200',
				'estado' => 'Se obtuvieron los datos correctamente',
				'data'=>$respuesta,
				'error'=>''
			));*/
		}catch(PDOException $e){
			/*echo json_encode(
				array(
					'respuesta'=>'-1',
					'estado' => 'Ocurrio un error, intentelo mas tarde',
					'data'=>'',
					'error'=>$e->getMessage())
			);*/
		}
	}

	$data=array(
        'title'=>$title,
        'firstname'=>$firstname,
        'middlename'=>$middlename,
        'surname'=>$surname
    );

	$rstr = json_encode($data=, true);
	//$rstr = implode(",", (array)$respuesta);
	//$rstr = implode($rstr);
	echo $rstr;
	//echo var_dump($respuesta);
	//echo var_dump($rstr);

?>