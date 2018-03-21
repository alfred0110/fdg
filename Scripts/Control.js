var oConstantes = Constantes();
var oDatos = Data();

$(document).ready(function () {
	mostrarPantalla("divFooter");
    //Modelo    
    var oConfig = Config();
    
    var oRecursos = Recursos();            
    
    //**********************Init ****************************
    init();
    function init() {
        $("#btnHome").hide();

        if (typeof (Fidegar) !== "undefined")
            oConfig.setMac(Fidegar.obtenerMac().toUpperCase());

        //TODO: quitar en produccion        
        //*******************************************************************************************************************************************      QUINTAR ++++++++++++++++++++++++++++++++++++++

        var urlConfiguracion = oConfig.getMac() != "" ? oRecursos.getUrl_Configuracion() + '/' + oConfig.getMac() : oRecursos.getUrl_Configuracion() + '/0';        
        requestFidegar(urlConfiguracion, "GET", null, function (respuesta) {
			
            mostrarPantalla("Pantalla_Inicio"); //Mostrar pantalla Fuera de Servicio 
			$("divFooter").show();	
            var cadHtml = '';
            if (oConfig.getMac() == "") {
				
				/*
                for (var i = 0; i < respuesta.length; i++) {
                    cadHtml += '<option value=' + respuesta[i].preguntaId + ' >' + respuesta[i].descripcion + '</option>';
                }
				*/
				for (var i = 0; i < respuesta.Preguntas.length; i++)
                    cadHtml += '<option value=' + respuesta.Preguntas[i].preguntaId + ' >' + respuesta.Preguntas[i].descripcion + '</option>';
				
            } else {
                oConfig.setId(respuesta.Kiosko.id); oConfig.setDireccion(respuesta.Kiosko.direccion);
                oConfig.setKioskoId(respuesta.Kiosko.kioskoId);
                                
                oConfig.setTiempoActualiza(respuesta.Kiosko.tiempoActualiza);                

              for (var i = 0; i < respuesta.Preguntas.length; i++)
                    cadHtml += '<option value=' + respuesta.Preguntas[i].preguntaId + ' >' + respuesta.Preguntas[i].descripcion + '</option>';

                setInterval(recargarPagina, ((oConfig.getTiempoActualiza() * 60) * 1000));                
                //setInterval(iniContador, 1000);
            }
            $('#ddlPreguntas').html(cadHtml);
        });
    }           
    //*******************************************************

    function iniContador() {
        contador++;        
        $(".spanVersion").text(contador);
    }

    var contador = 0;
    function recargarPagina() {        
        if (oConstantes.getPantallaActual() == "Pantalla_Inicio") {            
            if (typeof (Fidegar) !== "undefined")
                Fidegar.reiniciarApp(oConstantes.getPantallaActual());
        }  
	 $("#divFooter").show();			
    }

    $(".btnHelp").click(function () {
        switch (this.id) {
            case "btnDirectorio":
                $('#modalDirectorio').modal('show');
                break;
            case "btnAyuda":
                $('#modalAyuda').modal('show');
                break;
            case "btnHome":
                mostrarMenu();                
                break;
            case "btnAvisoPrivacidad":
                $('#modalAvisoPrivacidad').modal('show');
                break;
        }
    });

    $("#Pantalla_Inicio").click(function (e) {
        if (typeof (Fidegar) !== "undefined") {
            if (!Fidegar.puedoImprimir())
                mostrarError("-POR EL MOMENTO NO PUEDO ENTREGAR COMPROBANTE");
        } 
        mostrarPantalla("Pantalla_Menu");
		$("#divFooter").show();	
    });
	
    $(".ctrlmenu").click(function () {  
		
        var id = this.id;
        switch (id) {
            case "opMenu_Retiro":
                mostrarPantalla("Pantalla_ClaveRetiro");
                break;
            case "opMenu_CambioNip":
                mostrarPantalla("Pantalla_CambioNip");
                break;
            case "opMenu_Imprimir": break;
        }
    });

    //Button Aceptar|Cancelar    
    $(document).on('click', '.flujo' , function () {        
        var f = $(this).attr("flujo");        
        switch (f) {
            //FLUJO RETIRO
            case "retiro":
                var p = $(this).attr("pantalla");
                var accion = $(this).attr("opcion");
                switch (p) {
                    case "pantalla_claveRetiro":   
                        switch (accion) {
                            case "ok":							
							//alert(  ' Contrase\u00F1a err\u00F3nea\u0021 \n Int\u00E9ntalo de nuevo. ' );
                                if (validarControl("#txtClaveRetiro_Matricula",  "EL NIP/C\u00d3DIGO DE SEGURIDAD" + " " +
																				"INGRESADO NO COINCIDE," + " " +
																				"<p class='subtitulo'>favor de ingresarlo nuevamente</p>") &&
                                    validarControl("#txtClaveRetiro_Nip", "EL NIP/C\u00d3DIGO DE SEGURIDAD" + " " +
																				"INGRESADO NO COINCIDE," + " " +
																				"<p class='subtitulo'>favor de ingresarlo nuevamente</p>")) {

                                    oConstantes.setPantallaActual("Pantalla_ClaveRetiro");
                                    var parametros1 = { 'pwd': $("#txtClaveRetiro_Nip").val(), 'usr': $("#txtClaveRetiro_Matricula").val() };                                    
                                    requestFidegar(oRecursos.getUrl_Login(), "POST", parametros1, function (respuesta) {
                                        procesarResponse(respuesta, "pantalla_claveRetiro");
                                    });
                                }
                                break;
                            case "cancel":
                                mostrarMenu();
                                break;
                        }
                        break;
                    case "pantalla_Periodo":					
                        switch (accion) {
                            case "ok":			
                                //alert('Matricula:' + oDatos.getMatricula() + ' Mes:' + $(this).attr("mes") + ' Clave:' + $(this).attr("clave"));
                                if (typeof (Fidegar) !== "undefined")
                                    Fidegar.Imprimir(1, oDatos.getMatricula(), $(this).attr("mes"), $(this).attr("clave"), getDate(), oConfig.getId(), oConfig.getDireccion());
                                mostrarProgreso("Imprimiendo su comprobante...");
                                window.setTimeout(mostrarDespedida, oConstantes.getTiempoPantalla());
                                break;
                            case "cancel":
                                mostrarMenu();
                                break;
                        }
                        break;                    
                }
                break;

            case "cambionip":
                var p = $(this).attr("pantalla");
                var accion = $(this).attr("opcion");
                switch (p) {
                    case "pantalla_cambioNip":
                        switch (accion) {
                            case "ok":
                                if (validarControl("#txtCN_Matricula", "EL NIP/C\u00d3DIGO DE SEGURIDAD" + " " +
																	   "INGRESADO NO COINCIDE," + " " +
																	   "<p class='subtitulo'>favor de ingresarlo nuevamente</p>") &&
                                    validarControl("#txtCN_Nip", "EL NIP/C\u00d3DIGO DE SEGURIDAD" + " " +
															     "INGRESADO NO COINCIDE," + " " +
																 "<p class='subtitulo'>favor de ingresarlo nuevamente</p>")) {

                                    oConstantes.setPantallaActual("Pantalla_CambioNip");
                                    var parametros2 = { 'pwd': $("#txtCN_Nip").val(), 'usr': $("#txtCN_Matricula").val() };
                                    requestFidegar(oRecursos.getUrl_Login(), "POST", parametros2, function (respuesta) {
                                        procesarResponse(respuesta, "pantalla_CambioNipDos");
                                    });                                    
                                }                                
                                break;
                            case "cancel":
                                mostrarMenu();
                                break;
                        }
                        break;
                    case "pantalla_CambioNipDos":
                        switch (accion) {
                            case "ok":				
                                if (validarControl("#txtCN_Respuesta", "LA PREGUNTA O RESPUESTA ES INCORRECTA FAVOR DE VALIDAR")) {

                                    oConstantes.setPantallaActual("Pantalla_CambioNipDos");
                                    var parametros3 = { 'preguntaId': $("#ddlPreguntas").val(), 'respuesta': $("#txtCN_Respuesta").val().trim(), 'token': oDatos.getToken() };
                                    requestFidegar(oRecursos.getUrl_ValidaRespuesta(), "POST", parametros3, function (respuesta) {
                                        procesarResponse(respuesta, "pantalla_nuevoNip");
                                    });                                    
                                }                                
                                break;
                            case "cancel":
                                mostrarMenu();
                                break;
                        }
                        break;
                    //case "Pantalla_CambioNipTres":
                    //    switch (accion) {
                    //        case "ok":
                    //            mostrarPantalla("pantalla_nuevoNip");
                    //            break;
                    //        case "cancel":
                    //            mostrarMenu();
                    //            break;
                    //    }
                    //    break;

                    case "pantalla_nuevoNip":
                        switch (accion) {
                            case "ok":
                                if (validarControl("#txtCambioNipDosNip", "EL NIP/C\u00d3DIGO DE SEGURIDAD" + " " +
																	   "INGRESADO NO COINCIDE," + " " +
																	   "<p class='subtitulo'>favor de ingresarlo nuevamente</p>") && 
                                    validarControl("#txtCambioNipDosNuevoNip", "EL NIP/C\u00d3DIGO DE SEGURIDAD" + " " +
																	   "INGRESADO NO COINCIDE," + " " +
																	   "<p class='subtitulo'>favor de ingresarlo nuevamente</p>")) {

                                    if (validarControlesIguales("#txtCambioNipDosNip", "#txtCambioNipDosNuevoNip", "LOS DOS NIP DEBEN SER IGUALES")){

                                        oConstantes.setPantallaActual("Pantalla_nuevoNip");
                                        var parametros4 = null;
                                        if (oConfig.getKioskoId() != 0)
                                            parametros4 = { 'ans': $("#txtCN_Respuesta").val().trim(), 'cel': '', 'mat': '', 'nip': $("#txtCambioNipDosNip").val(), 'qtn': $("#ddlPreguntas").val(), 'tokn': oDatos.getToken(), 'type': 1, 'kioskoId': oConfig.getKioskoId() };
                                        else
                                            parametros4 = { 'ans': $("#txtCN_Respuesta").val().trim(), 'cel': '', 'mat': '', 'nip': $("#txtCambioNipDosNip").val(), 'qtn': $("#ddlPreguntas").val(), 'tokn': oDatos.getToken(), 'type': 1, 'kioskoId': '' };
                                        
                                        requestFidegar(oRecursos.getUrl_Reset(), "POST", parametros4, function (respuesta) {
                                            procesarResponse(respuesta, "pantalla_reset");
                                        });
                                    }                                    
                                }
                                break;
                            case "cancel":
                                mostrarMenu();
                                break;
                        }
                        break;
                }
                break;
            //FLUJO RETIRO
            case "despedida":
                window.setTimeout(mostrarMenu, oConstantes.getTiempoPantalla());
                break;
        }
    });    

    function mostrarDespedida() {
        limpiarData();
        mostrarPantalla("Pantalla_Gracias");        
        window.setTimeout(mostrarMenu, oConstantes.getTiempoPantalla());
		
    }
            
    function ocultar() {
              
            $("#Pantalla_Inicio").hide();
            $("#Pantalla_Menu").hide();
            $("#Pantalla_ClaveRetiro").hide();
            $("#Pantalla_Periodo").hide();
            $("#Pantalla_Progreso").hide();
            $("#Pantalla_CambioNip").hide();
            $("#Pantalla_CambioNipDos").hide();
            $("#Pantalla_nuevoNip").hide();
            $("#Pantalla_Gracias").hide();
			$("#divFooter").hide();
    }    

    function procesarResponse(response, flujo) {
        switch (flujo) {
            case "pantalla_claveRetiro":       
                switch (response.code) {
                    case Codigo.ERROR:						
                        mostrarPantalla("Pantalla_ClaveRetiro");
                        mostrarError(response.desc, false);
                        break
                    case Codigo.EXITO:                        
                        if (response.consultar) {
                            //Guardar datos de usuario correcto
                            oDatos.setMatricula($("#txtClaveRetiro_Matricula").val()); oDatos.setToken(response.tokn);
                            
                            oConstantes.setPantallaActual("Pantalla_Periodo");
                            requestFidegar(oRecursos.getUrl_GetPeriodos() + oDatos.getToken(), "GET", null, function (respuesta) {
                                procesarResponse(respuesta, "pantalla_Periodo");
                            });
                            mostrarPantalla("Pantalla_Periodo");
                        } else {                                                        
                            mostrarError("LA INFORMACI\u00d3N DE SU MATR\u00cdCULA FUE ENVIADA AL N\u00daMERO DE CELULAR REGISTRADO, PARA OBTENER LA CLAVE DE RETIRO DE NUEVO FAVOR DE MARCAR AL 52262693(OPCION 2, RECUPERAR CLAVES COBRO DE CAJERO AUTOMATICO), DESDE EL N\u00daMERO DE CELULAR REGISTRADO.", false);
                            mostrarMenu();
                        }

                        break;
                    case Codigo.REQUIERE_CAMBIO_NIP:
                        //Guardar datos de usuario correcto
                        oDatos.setMatricula($("#txtClaveRetiro_Matricula").val()); oDatos.setToken(response.tokn);
                        window.setTimeout(mostrarError(response.desc, false), oConstantes.getTiempoPantalla());
                        mostrarPantalla("Pantalla_CambioNipDos");
                        break;
                    default:
                }
                break;
            case "pantalla_Periodo":                
                if (typeof (response) !== "undefined") {				   
                    if (response.objetoRespuesta == null)
                        mostrarError("NO CUENTA CON PERIODOS", false);

                    var cadenaHtml = "<thead class='spanTr1'><tr><th class='Letratabla'>Mes</th><th class='Letratabla'>Clave</th><th class='Letratabla'>Imprimir</th></tr></thead>";
					
                    if (response.objetoRespuesta.length == 0)
                        cadenaHtml += "<tr><td colspan='3'>Sin Registros</td></tr></tbody>";

                    for (var i = 0; i < response.objetoRespuesta.length; i++){
                        if (response.objetoRespuesta[i].ESTATUSID == 1)
                            cadenaHtml += "<tr class='spanTr'><td>" + oConstantes.getMeses()[response.objetoRespuesta[i].MES] + "</td><td>" + response.objetoRespuesta[i].CLAVE + "</td>" +
                                              '<td><button class="flujo btn btn-circulo" flujo="retiro" pantalla="pantalla_Periodo" opcion="ok" mes="' + oConstantes.getMeses()[response.objetoRespuesta[i].mes] + '" clave="' + response.objetoRespuesta[i].clave + '">' + 
                                                  '<span class=" glyphicon1 glyphicon-print"></span>' +
                                              '</button></td>' +
                                          "</tr>";                    
                        else
                            cadenaHtml += "<tr class='spanTr'><td>" + oConstantes.getMeses()[response.objetoRespuesta[i].MES] + "</td><td>" + response.objetoRespuesta[i].CLAVE + "</td><td></td></tr>"
                    }
                    $("#tablePeriodos").empty().html(cadenaHtml + "</tbody>");
                }
                break;
            case "pantalla_CambioNipDos":                
                console.log("valida respuesta: "+response);
                switch (response.code) {
                    case Codigo.ERROR:
                        mostrarPantalla("Pantalla_CambioNip");
                        mostrarError(response.desc, false);
                        break;
                    case Codigo.EXITO:
                    case Codigo.REQUIERE_CAMBIO_NIP:
                        //Guardar datos de usuario correcto
                        oDatos.setMatricula($("#txtCN_Matricula").val()); oDatos.setToken(response.tokn);
                        mostrarPantalla("Pantalla_CambioNipDos");
                        break;
                    default:
                }
                break;
            case "pantalla_nuevoNip":                
                switch (response.code) {                    
                    case Codigo.ERROR:
                        mostrarPantalla("Pantalla_CambioNipDos");
                        mostrarError(response.desc, false);
                        break;
                    case Codigo.EXITO:
                        oDatos.setPreguntaId($("#ddlPreguntas").val()); oDatos.setRespuesta($("#txtCN_Respuesta").val().trim());
                        mostrarPantalla("Pantalla_nuevoNip");
                        break;
                    default:
                }                
                break;
            case "pantalla_reset":
                switch (response.code) {
                    case Codigo.ERROR:                        
                        mostrarPantalla("Pantalla_nuevoNip");
                        mostrarError(response.desc, false);
                        break;
                    case Codigo.EXITO:
                        if (typeof (Fidegar) !== "undefined")
                            Fidegar.Imprimir(2, oDatos.getMatricula(), "", "", getDate(), oConfig.getId(), oConfig.getDireccion());                        
                        mostrarProgreso("Imprimiendo su comprobante...");
                        window.setTimeout(mostrarDespedida, oConstantes.getTiempoPantalla());
                        break;
                    default:
                }
                break;
            default:
        }
    }
	
	$(".inputX").keypress(function(e)
	{			
		if(e.which == 13) {					
			 var index = $('.inputX').index(this) + 1;
			$('.inputX').eq(index).focus();
			
			if($(this).attr('class').indexOf('ultimo') > -1)
			{																									
					var pantalla =  $(this).parents().eq(4).attr('id');				    
					$("#" + pantalla).find("span[opcion='ok']").trigger('click');
			
			}
		}		
	});	
});