function validarControl(nombreControl, mensaje) {
    var resultado = true;
    var valor = $(nombreControl).val();
    $(nombreControl).css("background-color", "#ffffff");
    if (valor != undefined) {
        if (valor == "" || valor.length < 1) {
            resultado = false;
            $(nombreControl).css("background-color", "#ffffcc");
            mostrarError(mensaje, false);
        }
    } else {
        resultado = false;
        $(nombreControl).css("background-color", "#ffffcc");
        mostrarError(mensaje);
    }
    return resultado;
}

function validarControlesIguales(control1, control2, mensaje) {
    var resultado = true;
    $(control1).css("background-color", "#ffffff"); $(control2).css("background-color", "#ffffff");
    if ($(control1).val() != $(control2).val()) {        
        resultado = false;
        $(control1).css("background-color", "#ffffcc"); $(control2).css("background-color", "#ffffcc");
        mostrarError(mensaje, false);
    }
    return resultado;
}

function soloNumeros(e, obj, tamanio) {
    var key = window.Event ? e.which : e.keyCode
    //key: 32 espacio 
    if (key == 8 || key == 0)
        return true;

    if (obj && tamanio)
        if (obj.value.length + 1 > tamanio) {
            return false;
        }

    //key == 32 RETURN
    return (key >= 48 && key <= 57)
}

function mostrarPantalla(pantalla) {       
    $("#Pantalla_Inicio").hide();
    $("#Pantalla_FueraServicio").hide();
    $("#Pantalla_Menu").hide();
    $("#Pantalla_ClaveRetiro").hide();
    $("#Pantalla_Periodo").hide();
    $("#Pantalla_Progreso").hide();
    $("#Pantalla_CambioNip").hide();
    $("#Pantalla_CambioNipDos").hide();
    $("#Pantalla_nuevoNip").hide();
    $("#Pantalla_Gracias").hide();
	$("#divFooter").hide();

    if (pantalla)
        $("#" + pantalla).show();
    
    if (pantalla == "Pantalla_Progreso" || pantalla == "Pantalla_Gracias")
        $(".btnHelp").hide();    
    else
        $(".btnHelp").show();

    if (pantalla == "Pantalla_Inicio") {        
        $("#btnHome").hide();
        $("#btnAvisoPrivacidad").show();        
    }
    else
        $("#btnAvisoPrivacidad").hide();

    oConstantes.setPantallaActual(pantalla);
}

function mostrarMenu() {
    limpiarData();
    mostrarPantalla("Pantalla_Inicio");
	$("#divFooter").show();
}

function limpiarData() {
    oDatos = Data();
    $("input[type='text']").val('');
    $("input[type='password']").val('');
    $("#tablePeriodos").empty().html("<thead><tr><th>Mes</th><th>Clave</th><th>Imprimir</th></tr></thead>");
}

function mostrarProgreso(mensaje) {
    $(".spanLoading").text(mensaje);
    mostrarPantalla("Pantalla_Progreso");
}

function requestFidegar(url, typeRequest, parametros, funcionRespueta) {
    mostrarProgreso("ESPERE POR FAVOR");
    $.ajax({
        url: oConstantes.getServer() + url,
        type: typeRequest,        
        data: (parametros) ? JSON.stringify(parametros) : '',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: funcionRespueta,
        timeout: oConstantes.getTimeOut(),
        error: function (response) {
            mostrarMenu();
            console.log(response);
            if (typeof (response.responseJSON) !== "undefined")
                mostrarError("Error: " + response.responseJSON.desc, false);
            else
                mostrarError("Error: " + response.statusText, false);
        }
    });
}

function mostrarError(mensaje, mostrarBotones) {
    $('#modalAvisoSpan').text(mensaje);
    $('#modalAviso').modal('show');

    if (mostrarBotones) {
        var footer =
                    '<div class="modal-footer">' +
                        '<button id="btnAceptar" class="btn btn-primary" type="button" onclick="guardar()">ACEPTAR</button>' +
                        '<button id="btnCancelar" class="btn btn-primary" type="button" onclick="cancelar()">CANCELAR</button>' +
                    '</div>';
        $("#miFooter").empty().html(footer);
    }
}

function mostrarError(mensaje) {
    $('#modalAvisoSpan').html(mensaje);
    $('#modalAviso').modal('show');
}



function getDate() {
    var date = new Date();
    var str = date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
    return str;
}