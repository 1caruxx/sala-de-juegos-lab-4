<?php

    require_once './src/BaseDeDatos.php';
    use \Firebase\JWT\JWT;

    class Usuario {

        public static function Logear($request, $response) {

            $datosUsuario = $request->getParsedBody();
            $datosUsuario["nombre"] = $request->getAttribute('nombre');

            $key = "12345";
            $token = array(

                "nombre" => $datosUsuario["nombre"],
                "clave" => $datosUsuario["clave"],
                "correo" => $datosUsuario["correo"]
            );

            $jwt = JWT::encode($token, $key);

            $response->getBody()->write('{"token":"'.$jwt.'"}');
        }

        public static function Registrar($request, $response) {

            $datosUsuario = $request->getParsedBody();
            $conexion = $request->getAttribute('conexion');

            $consulta = "INSERT INTO `usuarios`(`correo`, `nombre`, `clave`, `puntaje_PPT`, `puntaje_AA`, `puntaje_AeN`, `puntaje_mio`) VALUES (
                '".$datosUsuario["correo"]."',
                '".$datosUsuario["nombre"]."',
                '".$datosUsuario["clave"]."',
                0, 0, 0, 0)";

            $resultados = $conexion->prepare($consulta);
            $resultados->execute();
            $response->getBody()->write('{"valido":"true"}');
            return $response;
        }

        public static function ObtenerScore($request, $response) {

            $datos = BaseDeDatos::$datos;
            $user  = BaseDeDatos::$user;
            $pass  = BaseDeDatos::$pass;
            $url   = BaseDeDatos::$url;
            $datosUsuario = $request->getQueryParams();

            try {

                $conexion = new PDO($datos, $user, $pass);
                $consula = "SELECT `".$datosUsuario["juego"]."` FROM `usuarios` WHERE `correo`='".$datosUsuario["correo"]."'";
                $resultados = $conexion->prepare($consula);
                $resultados->execute();
                $fila = $resultados->fetch(PDO::FETCH_ASSOC);
                $response->getBody()->write('{"puntaje":"'.$fila[$datosUsuario["juego"]].'"}');
            } catch(Exception $exception) {

                $response->getBody()->write('{"valido":"false","mensaje":"Se ha atrapado una excepcion: '.$exception->getMessage().'"}');
            }

        }

        public static function ObtenerTodosLosScores($request, $response) {

            $datos = BaseDeDatos::$datos;
            $user  = BaseDeDatos::$user;
            $pass  = BaseDeDatos::$pass;
            $url   = BaseDeDatos::$url;
            $puntajes = [];

            try {

                $conexion = new PDO($datos, $user, $pass);
                $consula = "SELECT `correo`, `nombre`, `puntaje_PPT`, `puntaje_AA`, `puntaje_AeN`, `puntaje_mio` FROM `usuarios`";
                $resultados = $conexion->prepare($consula);
                $resultados->execute();

                while($fila = $resultados->fetch(PDO::FETCH_ASSOC)) {
                        
                    array_push($puntajes , $fila);
                }
  
                $response->getBody()->write('{"puntajes":'.json_encode($puntajes).'}');
            } catch(Exception $exception) {

                $response->getBody()->write('{"valido":"false","mensaje":"Se ha atrapado una excepcion: '.$exception->getMessage().'"}');
            }
        }

        public static function SetearScore($request, $response) {

            $datos = BaseDeDatos::$datos;
            $user  = BaseDeDatos::$user;
            $pass  = BaseDeDatos::$pass;
            $url   = BaseDeDatos::$url;
            $datosUsuario = $request->getParsedBody();

            try {

                $conexion = new PDO($datos, $user, $pass);
                $consula = "UPDATE `usuarios` SET `".$datosUsuario["juego"]."`=".$datosUsuario["puntaje"]." WHERE `correo`= '".$datosUsuario["correo"]."'";
                $resultados = $conexion->prepare($consula);
                $resultados->execute();
            } catch(Exception $exception) {

                $response->getBody()->write('{"valido":"false","mensaje":"Se ha atrapado una excepcion: '.$exception->getMessage().'"}');
            }
        }
    }

?>