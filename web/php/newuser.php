<?php
// Activación de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

function alta_usuario_bbdd( $usuario, $contrasenya ) {
  // aqui hace lo necesario para consultar o escribir en la base de datos
  echo $usuario;
  echo $contrasenya;
  return "Alta OK";
}

// Permite peticiones php desde culquien origen
// esto deberia de delimitarse solo a la url del juego
header('Access-Control-Allow-Origin: *');

// Comprobamos si se han recibido parámetros
if ( !isset( $HTTP_RAW_POST_DATA ) ) { 
    $HTTP_RAW_POST_DATA = file_get_contents( 'php://input' );
} 

$nombre_usuario = filter_input(INPUT_POST, "user", FILTER_SANITIZE_STRING);
$contrasenya = filter_input(INPUT_POST, "pass", FILTER_SANITIZE_STRING);

// respuesta en json
if ( $nombre_usuario != "" && $contrasenya != "" ) {
  header('Content-type: application/json');
  $respuesta = alta_usuario_bbdd( $nombre_usuario, $contrasenya );
  echo json_encode( $respuesta );
  exit;
}

?>

<!--<html>
  <head>
    <title>newuser.php</title>
  </head>
  <body>
    <h1>php database interface for Jumper Little Demo Phaser Game</h1>
    <div>
        Este sitio web no funciona por si solo.<br>
        Espera recibir una petición AJAX del juego.<br><br>
        
        <?php
          echo "Espera recibir un usuario y una contraseña]";
        ?>
    </div>
    <h3>No se ha recibido ningún parámetro.</h3>
  </body>
</html>-->
