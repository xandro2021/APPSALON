<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController
{
    public static function login(Router $router)
    {
        $router->render('auth/login', []);
    }

    public static function logout()
    {
        debuguear('LOGOUT');
    }

    public static function olvide(Router $router)
    {
        $router->render('auth/olvide-password', []);
    }

    public static function recuperar()
    {
        debuguear('RECUPERAR');
    }

    public static function crear(Router $router)
    {
        $usuario = new Usuario();
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $usuario->sincronizar($_POST);
            $alertas = $usuario->validar();

            // Revisar que alertas este vacio
            if (empty($alertas)) {
                // Verificar que el usuario este registrado
                $resultado = $usuario->existeUsuario();

                if ($resultado->num_rows) {
                    $alertas = Usuario::getAlertas();
                } else {
                    // No esta registrado
                    $usuario->hashPassword();

                    // Generar token unico
                    $usuario->crearToken();

                    // Enviar el email de verificacion
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);

                    $email->enviarConfirmacion();

                    $resultado = $usuario->guardar();

                    if ($resultado) {
                        header('Location: /mensaje');
                        exit;
                    }
                }
            }
        }

        $router->render('auth/crear-cuenta', [
            "usuario" => $usuario,
            "alertas" => $alertas
        ]);
    }

    public static function mensaje(Router $router)
    {
        $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router)
    {
        $alertas = [];
        $token = s($_GET['token']);

        $usuario = Usuario::where('token', $token);

        if (!$usuario) {
            // Mostrar mensaje de error
            Usuario::setAlerta("error", "TOKEN NO VALIDO");
        } else {
            // Modificar usuario confirmado
            $usuario->confirmado = 1;
            $usuario->token = null;
            $usuario->guardar();
            Usuario::setAlerta("exito", "Cuenta comprobada correctamente");
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
        ]);
    }
}
