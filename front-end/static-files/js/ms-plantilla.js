/**
 * @file Plantilla.js
 * @description Funciones para el procesamiento de la info enviada por el MS Plantilla
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

"use strict";

/// Creo el espacio de nombres
let Plantilla = {};

// Plantilla de datosDescargados vacíos
Plantilla.datosDescargadosNulos = {
    mensaje: "Datos Descargados No válidos",
    autor: "",
    email: "",
    fecha: ""
}


/**
 * Función que descarga la info MS Plantilla al llamar a una de sus rutas
 * @param {string} ruta Ruta a descargar
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.descargarRuta = async function (ruta, callBackFn) {
    let response = null

   // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + ruta
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }
    

    // Muestro la info que se han descargado
    let datosDescargados = null
    if (response) {
        datosDescargados = await response.json()
        callBackFn(datosDescargados)
    }
}



/**
 * Función principal para mostrar los datos enviados por la ruta "home" de MS Plantilla
 */
Plantilla.mostrarHome = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene el campo mensaje
    if (typeof datosDescargados.mensaje === "undefined") datosDescargados = this.datosDescargadosNulos

    Frontend.Article.actualizar("Plantilla Home", datosDescargados.mensaje)
}

/**
 * Función principal para mostrar los datos enviados por la ruta "acerca de" de MS Plantilla
 */
Plantilla.mostrarAcercaDe = function (datosDescargados) {
    // Si no se ha proporcionado valor para datosDescargados
    datosDescargados = datosDescargados || this.datosDescargadosNulos

    // Si datos descargados NO es un objeto 
    if (typeof datosDescargados !== "object") datosDescargados = this.datosDescargadosNulos

    // Si datos descargados NO contiene los campos mensaje, autor, o email
    if (typeof datosDescargados.mensaje === "undefined" ||
        typeof datosDescargados.autor === "undefined" ||
        typeof datosDescargados.email === "undefined" ||
        typeof datosDescargados.fecha === "undefined"
    ) datosDescargados = this.datosDescargadosNulos

    const mensajeAMostrar = `<div>
    <p>${datosDescargados.mensaje}</p>
    <ul>
        <li><b>Autor/a</b>: ${datosDescargados.autor}</li>
        <li><b>E-mail</b>: ${datosDescargados.email}</li>
        <li><b>Fecha</b>: ${datosDescargados.fecha}</li>
    </ul>
    </div>
    `;
    Frontend.Article.actualizar("Plantilla Acerca de", mensajeAMostrar)
}


/**
 * Función principal para responder al evento de elegir la opción "Home"
 */
Plantilla.procesarHome = function () {
    this.descargarRuta("/plantilla/", this.mostrarHome);
}

/**
 * Función principal para responder al evento de elegir la opción "Acerca de"
 */
Plantilla.procesarAcercaDe = function () {
    this.descargarRuta("/plantilla/acercade", this.mostrarAcercaDe);
}


/**
 * Función que recuperar todos los datos llamando al MS Plantilla
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.recupera = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio proyectos
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/getTodos"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todos los proyectos que se han descargado
    let vectorPlantilla = null
    if (response) {
        vectorPlantilla = await response.json()
        callBackFn(vectorPlantilla.data)
    }
}


/**
 * Función para mostrar en pantalla todos los proyectos que se han recuperado de la BBDD.
 * @param {Vector_de_motociclistas} vector Vector con los datos de los motociclistas a mostrar
 */
Plantilla.imprime = function (vector) {
    //console.log( vector ) // Para comprobar lo que hay en vector
    let msj = "";
    msj += Plantilla.cabeceraTable();
    vector.forEach(e => msj += Plantilla.cuerpoTr(e))
    msj += Plantilla.pieTable();

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar( "Listado de motociclistas", msj )

}

// Funciones para mostrar como TABLE

/**
 * Crea la cabecera para mostrar la info como tabla
 * @returns Cabecera de la tabla
 */
Plantilla.cabeceraTable = function () {
    return `<table class="listado-Plantilla">
        <thead>
        <th>Nombre</th><th>Nombre_Equipo</th><th>Tipo_Moto</th><th>Fecha_Nacimiento</th><th>Anios_Experiencia</th><th>Puntuaciones_Carrera</th><th>Marcas_Motocicletas</th><th>Posicion_Campeonato</th>
        </thead>
        <tbody>
    `;
}

/**
 * Muestra la información de cada proyecto en un elemento TR con sus correspondientes TD
 * @param {motociclistas} m Datos del motociclista a mostrar
 * @returns Cadena conteniendo todo el elemento TR que muestra el proyecto.
 */
Plantilla.cuerpoTr = function (p) {
    const d = p.data
    const fecha = d.fecha_nacimiento;
    const anios_experiencia = d.anios_experiencia.join(', ');
    const puntuaciones_carrera = d.puntuaciones_carrera.join(', ');
    const marcas_motocicletas = d.marcas_motocicletas.join(', ');

    return `<tr title="${p.ref['@ref'].id}">
    <td>${d.nombre}</td>
    <td><em>${d.nombre_equipo}</em></td>
    <td>${d.tipo_moto}</td>
    <td>${fecha.dia}/${fecha.mes}/${fecha.anio}</td>
    <td>${anios_experiencia}</td>
    <td>${puntuaciones_carrera}</td>
    <td>${marcas_motocicletas}</td>
    <td>${d.posicion_campeonato}</td>
    </tr>
    `;
}

/**
 * Pie de la tabla en la que se muestran las personas
 * @returns Cadena con el pie de la tabla
 */
Plantilla.pieTable = function () {
    return "</tbody></table>";
}

/**
 * Función principal para recuperar los datos desde el MS y, posteriormente, imprimirlos.
 * @returns True
 */

Plantilla.listar = function () {
  this.recupera(this.imprime);
}

// REALIZAMOS LA OPCIÓN DE MOSTRAR SOLO NOMBRES

/**
 * Función que recuperar todos los datos llamando al MS Plantilla
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.recuperaNombres = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/getNombres"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todos los datos que se han descargado
    let vectorPlantilla = null
    if (response) {
        vectorPlantilla = await response.json()
        callBackFn(vectorPlantilla.data)
    }
}


/**
 * Función para mostrar en pantalla todos los DATOS que se han recuperado de la BBDD.
 * @param {Vector_de_motociclistas} vector Vector con los datos de los motociclistas a mostrar
 */
Plantilla.imprimeNombres = function (vector) {
    //console.log( vector ) // Para comprobar lo que hay en vector
    let msj = "";
    msj += Plantilla.cabeceraTableN();
    vector.forEach(e => msj += Plantilla.cuerpoTrN(e))
    msj += Plantilla.pieTableN();

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar( "Listado de NOMBRES de motociclistas", msj )

}

// Funciones para mostrar como TABLE

/**
 * Crea la cabecera para mostrar la info como tabla
 * @returns Cabecera de la tabla
 */
Plantilla.cabeceraTableN = function () {
    return `<table class="listado-Plantilla">
        <thead>
        <th>Nombre</th>
        </thead>
        <tbody>
    `;
}


/**
 * Muestra la información de cada proyecto en un elemento TR con sus correspondientes TD
 * @param {motociclistas} m Datos del motociclista a mostrar
 * @returns Cadena conteniendo todo el elemento TR que muestra el proyecto.
 */
Plantilla.cuerpoTrN = function (nombre) {
   
    return `
    <tr">
    <td>${nombre}</td>

    </tr>
    `;
}

/**
 * Pie de la tabla en la que se muestran las personas
 * @returns Cadena con el pie de la tabla
 */
Plantilla.pieTableN = function () {
    return "</tbody></table>";
}

/**
 * Función principal para recuperar los nombres de los motociclistas desde el MS y, posteriormente, imprimirlos.
 * @returns True
 */

Plantilla.listarNombres = function () {
  this.recuperaNombres(this.imprimeNombres);
}



// REALIZAMOS LA OPCIÓN DE MOSTRAR NOMBRES POR RORDEN ALFABÉTICO

/**
 * Función que recuperar todos los datos llamando al MS Plantilla
 * @param {función} callBackFn Función a la que se llamará una vez recibidos los datos.
 */
Plantilla.recuperaNombresAZ = async function (callBackFn) {
    let response = null

    // Intento conectar con el microservicio Plantilla
    try {
        const url = Frontend.API_GATEWAY + "/plantilla/getNAlfabeticamente"
        response = await fetch(url)

    } catch (error) {
        alert("Error: No se han podido acceder al API Gateway")
        console.error(error)
        //throw error
    }

    // Muestro todos los datos que se han descargado
    let vectorPlantilla = null
    if (response) {
        vectorPlantilla = await response.json()
        callBackFn(vectorPlantilla.data.sort())
    }
}


/**
 * Función para mostrar en pantalla todos los DATOS que se han recuperado de la BBDD.
 * @param {Vector_de_motociclistas} vector Vector con los datos de los motociclistas a mostrar
 */
Plantilla.imprimeNAZ = function (vector) {
    console.log( vector ) // Para comprobar lo que hay en vector
    let msj = "";
    msj += Plantilla.cabeceraTableNAZ();
    vector.forEach(e => msj += Plantilla.cuerpoTrNAZ(e))
    msj += Plantilla.pieTableNAZ();

    // Borro toda la info de Article y la sustituyo por la que me interesa
    Frontend.Article.actualizar( "Listado de NOMBRES Aa-Zz de motociclistas", msj )

}

// Funciones para mostrar como TABLE

/**
 * Crea la cabecera para mostrar la info como tabla
 * @returns Cabecera de la tabla
 */
Plantilla.cabeceraTableNAZ = function () {
    return `<table class="listado-Plantilla">
        <thead>
        <th>Nombre</th>
        </thead>
        <tbody>
    `;
}


/**
 * Muestra los nombres ordenados alfabéticamente en un elemento TR con sus correspondientes TD
 * @param {motociclistas} m Datos del motociclista a mostrar
 * @returns Cadena conteniendo todo el elemento TR que muestra el proyecto.
 */
Plantilla.cuerpoTrNAZ = function (nombre) {

    return `
    <tr">
    <td>${nombre}</td>

    </tr>
    `;
}

/**
 * Pie de la tabla en la que se muestran las personas
 * @returns Cadena con el pie de la tabla
 */
Plantilla.pieTableNAZ = function () {
    return "</tbody></table>";
}

/**
 * Función principal para recuperar los nombres por orden alfabético de los motociclistas desde el MS y, posteriormente, imprimirlos.
 * @returns True
 */

Plantilla.listarNombresAZ = function () {
  this.recuperaNombresAZ(this.imprimeNAZ);
}