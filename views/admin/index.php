<h1 class="nombre-pagina">Panel de Administracion</h1>

<?php include_once __DIR__ . "/../templates/barra.php"; ?>

<h2>Buscar Citas</h2>

<div class="busqueda">
    <form method="POST" class="formulario" action="">

        <div class="campo">
            <label for="fecha">Fecha</label>
            <input type="date" name="fecha" id="fecha" value="<?= $fecha ?>" />
        </div>

    </form>
</div>

<?php
if (count($citas) === 0) {
    echo "<h2>No hay citas en esta fecha</h2>";
}
?>

<div class="citas-admin">
    <ul class="citas">
        <?php $idCita = -1; ?>

        <?php foreach ($citas as $key => $cita): ?>
            <?php if ($idCita !== $cita->id): ?>
                <?php $total = 0; ?>

                <li>

                    <p>ID: <span><?= $cita->id ?></span></p>
                    <p>Hora: <span><?= $cita->hora ?></span></p>
                    <p>Cliente: <span><?= $cita->cliente ?></span></p>
                    <p>Email: <span><?= $cita->email ?></span></p>
                    <p>Telefono: <span><?= $cita->telefono ?></span></p>


                    <?php $idCita = $cita->id; ?>

                    <h3>Servicios</h3>

            <?php endif; ?>

                <p class="servicio"> <?= $cita->servicio . " " . $cita->precio ?> </p>

                <?php
                $total += $cita->precio;

                $actual = $cita->id;
                $proximo = $citas[$key + 1]->id ?? 0;
                ?>

                <?php if (esUltimo($actual, $proximo)): ?>
                    <p class="total">Total: <span>$ <?= $total ?></span> </p>
                    <form method="POST" action="/api/eliminar">
                        <input type="hidden" name="id" value="<?= $cita->id ?>" />
                        <input type="submit" class="boton-eliminar" value="Eliminar" />
                    </form>
                </li>
                <?php endif; ?>

        <?php endforeach; ?>
    </ul>
</div>

<?php
$script = "
<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
<script type='text/javascript' src='build/js/modernizr.js'></script>
<script type='text/javascript' src='build/js/buscador.js'></script>
";
?>
