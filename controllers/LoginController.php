<?php

namespace Controllers;

use MVC\Router;

class LoginController
{
    public static function login(Router $router)
    {
        $router->render('auth/login', [

        ]);
    }

    public static function logout()
    {
        debuguear('LOGOUT');
    }

    public static function olvide()
    {
        debuguear('OOOOLVIDE!!!');
    }

    public static function recuperar()
    {
        debuguear('RECUPERAR');
    }

    public static function crear()
    {
        debuguear('CREAR!!!!');
    }
}
