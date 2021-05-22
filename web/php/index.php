<?php
// Activación de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

function consulta_bbdd() {
  // aqui hace lo necesario para consultar o escribir en la base de datos
  $datos = array();
  $response[0] = array(
    'id' => '1',
    'valor1'=> 'v1',
    'valor2'=> 'v2'
  );
  return $datos;
}

// Permite peticiones php desde culquien origen
// esto deberia de delimitarse solo a la url del juego
header('Access-Control-Allow-Origin: *');

// Comprobamos si se han recibido parámetros
if ( !isset( $HTTP_RAW_POST_DATA ) ) { 
    $HTTP_RAW_POST_DATA = file_get_contents( 'php://input' );
} 

$secret = filter_input(INPUT_POST, "secret", FILTER_SANITIZE_STRING);
$usuario = filter_input(INPUT_POST, "usuario", FILTER_SANITIZE_STRING);
$funcion = filter_input(INPUT_POST, "funcion", FILTER_SANITIZE_STRING);
$contador = filter_input(INPUT_POST, "contador", FILTER_SANITIZE_STRING);
$contadormax = filter_input(INPUT_POST, "contadormax", FILTER_SANITIZE_STRING);

// respuesta en json
if ( $secret != "" && $funcion != "" && $usuario != "" && $contador != "" && $contadormax != "") {
  /*
  echo "Se han recibido todos los parámetros<br>";
  echo "Parametro 'secret' = $secret<br>";
  echo "Parametro 'usuario' = $usuario<br>";
  echo "Parametro 'funcion' = $funcion<br>";  
  echo "Parametro 'contador' = $contador<br>";
  echo "Parametro 'contadormax' = $contadormax<br>";
  */
  header('Content-type: application/json');
  $data = consulta_bbdd();
  echo json_encode( $data );
  exit;
}

$secret="NADA";