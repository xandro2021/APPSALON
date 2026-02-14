<?php

function conectarDB() : mysqli {
  $db = new mysqli('127.0.0.1', 'root', 'root', 'BienesRaicesJuan');

  if(!$db) {
    echo "Error: No se pudo conectar a MySQL.";
    echo "errno de depuración: " . mysqli_connect_errno();
    echo "error de depuración: " . mysqli_connect_error();
    exit;
  }

  return $db;
}
