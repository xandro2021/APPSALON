<?php

namespace Model;

use mysqli_result;

class Usuario extends ActiveRecord
{
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'apellido', 'email', 'password', 'telefono', 'admin', 'confirmado', 'token'];

    public $id, $nombre, $apellido, $email, $password, $telefono, $admin, $confirmado, $token;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->apellido = $args['apellido'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->telefono = $args['telefono'] ?? '';
        $this->admin = $args['admin'] ?? 0;
        $this->confirmado = $args['confirmado'] ?? 0;
        $this->token = $args['token'] ?? '';
    }

    /**
     * @return array<string, string[]>
     */
    public function validar(): array
    {
        if (!$this->nombre) {
            self::$alertas['error'][] = "El nombre es obligatorio";
        }

        if (!$this->apellido) {
            self::$alertas['error'][] = "El apellido es obligatorio";
        }

        if (!$this->email) {
            self::$alertas['error'][] = "El email es obligatorio";
        }

        if (!$this->password) {
            self::$alertas['error'][] = "El password es obligatorio";
        }

        if (strlen($this->password) < 6) {
            self::$alertas['error'][] = "El password debe contener al menos 6 caracteres";
        }

        return self::$alertas;
    }

    /**
     * @return array<string, string[]>
     */
    public function validarLogin(): array
    {
        if (!$this->email) {
            self::$alertas['error'][] = "El email es obligatorio";
        }

        if (!$this->password) {
            self::$alertas['error'][] = "El password es obligatorio";
        }

        return self::$alertas;
    }

    /**
     * @return array<string, string[]>
     */
    public function validarEmail(): array
    {
        if (!$this->email) {
            self::$alertas['error'][] = "El email es obligatorio";
        }

        return self::$alertas;
    }

    public function existeUsuario(): mysqli_result | bool
    {
        $query = "SELECT * FROM " . self::$tabla . " WHERE email = '$this->email' LIMIT 1;";
        $resultado = self::$db->query($query);

        if ($resultado->num_rows) {
            self::$alertas['error'][] = "El usuario ya se encuentra registrado";
        }

        return $resultado;
    }

    public function hashPassword()
    {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    public function crearToken()
    {
        $this->token = uniqid();
    }

    public function comprobarPasswordAndVerificado(string $password): bool
    {
        $resultado = password_verify($password, $this->password);

        if (!$resultado || !$this->confirmado) {
            self::$alertas['error'][] = "Password incorrecto o tu cuenta no ha sido confirmada";
            return false;
        } else {
            return true;
        }
    }
}
