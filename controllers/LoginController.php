<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController
{
    public static function login(Router $router)
    {
        $alertas = [];
        $auth = new Usuario();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth->sincronizar($_POST);
            $alertas = $auth->validarLogin();

            if (empty($alertas)) {
                // Comprobar que exista el usuario
                $usuario = Usuario::where('email', $auth->email);

                if ($usuario) {
                    // Verificar password
                    if ($usuario->comprobarPasswordAndVerificado($auth->password)) {
                        // Autenticar el usuario
                        session_start();

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = "$usuario->nombre $usuario->apellido";
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                        // Es admin o cliente?
                        if ($usuario->admin === "1") {

                            $_SESSION['admin'] = $usuario->admin ?? null;
                            header('Location: /admin');
                            exit;

                        }
                        else {
                            // Redirecciona a los clientes
                            header('Location: /cita');
                            exit;
                        }

                    }
                }
                else {
                    Usuario::setAlerta("error", "Usuario no encontrado");
                }
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/login', [
            'alertas' => $alertas,
            'auth' => $auth
        ]);
    }

    public static function logout()
    {
        debuguear('LOGOUT');
    }

    public static function olvide(Router $router)
    {
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $auth = new Usuario($_POST);
            $alertas = $auth->validarEmail();

            if (empty($alertas)) {

            }
        }

        $router->render('auth/olvide-password', [
            'alertas' => $alertas
        ]);
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
