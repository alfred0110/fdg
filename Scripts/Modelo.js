
var Codigo = {
    ERROR: 0,
    EXITO: 1,
    REQUIERE_CAMBIO_NIP: 11
};

var Constantes = (function () {
    _req_contenType = 'application/json; charset=UTF-8';
    _req_Accept = 'application/json; charset=UTF-8';
    _timeOut = 20000; // 5 segundos: 5000
    //_server = 'http://www.tkinova.com/demofidegarWS/';
    _server = 'http://192.168.0.128/WAFidegar/WSFidegar.svc/'
    _tiempoPantalla = 3000; // 3 segundos
    _meses = ['-', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
               'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    _pantallaActual = "";

    return {
        getReq_contenType: function () { return _req_contenType; },
        getReq_Accept: function () { return _req_Accept; },
        getTimeOut: function () { return _timeOut; },
        getServer: function () { return _server; },
        getTiempoPantalla: function () { return _tiempoPantalla; },
        getMeses: function () { return _meses; },

        getPantallaActual: function () { return _pantallaActual; },
        setPantallaActual: function (p) { _pantallaActual = p; }
    };
});

var Recursos = (function () {
    _url_Login = 'app/login';
    _url_GetPeriodos = 'app/obten-periodos/';
    _url_Reset = 'app/reset';    
    _url_ValidaRespuesta = 'app/valida-respuesta';
    _url_Configuracion = 'app/obten-configuracion';

    return {
        getUrl_Login: function () { return _url_Login; },
        getUrl_GetPeriodos: function () { return _url_GetPeriodos; },
        getUrl_Reset: function () { return _url_Reset; },        
        getUrl_ValidaRespuesta: function () { return _url_ValidaRespuesta; },
        getUrl_Configuracion: function () { return _url_Configuracion; }
    };
});

var Data = (function () {
    _matricula = "";
    _token = "";
    _pregundaId = 0;
    _respuesta = "";

    return {
        setMatricula: function (m) { _matricula = m; },
        setToken: function (t) { _token = t },
        setPreguntaId: function (p) { _pregundaId = p; },
        setRespuesta: function (r) { _respuesta = r; },

        getMatricula: function () { return _matricula; },
        getToken: function () { return _token; },
        getPreguntaId: function () { return _pregundaId; },
        getRespuesta: function () { return _respuesta; }        
    };
});

var Config = (function () {
    _mac = "";
    _id = "";
    _kioskoId = 0;
    _direccion = "";
    _tiempoActualiza = 0;// En minutos

    return {
        setMac: function (m) { _mac = m; },
        setId: function (i) { _id = i; },
        setKioskoId: function (k) { _kioskoId = k; },
        setDireccion: function (d) { _direccion = d; },
        setTiempoActualiza: function (t) { _tiempoActualiza = t; },

        getMac: function () { return _mac; },
        getId: function () { return _id; },
        getKioskoId: function () { return _kioskoId; },
        getDireccion: function () { return _direccion; },
        getTiempoActualiza: function () { return _tiempoActualiza; }
    };
});