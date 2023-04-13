/**
 * @file ms-plantilla-spec.js
 * @description Fichero TDD para probar todo lo relacionado con MS Plantilla en el front-end
 * @author Víctor M. Rivas <vrivas@ujaen.es>
 * @date 03-feb-2023
 */

// SPECS para Jasmine

// Constantes para usar en las pruebas
const elementoTitulo = document.getElementById(Frontend.ID_SECCION_PRINCIPAL_TITULO)
const elementoContenido = document.getElementById(Frontend.ID_SECCION_PRINCIPAL_CONTENIDO)
const TITULO_HOME = "Plantilla Home"
const TITULO_ACERCA_DE = "Plantilla Acerca de"
const TITULO_IMPRIME = "Listado de motociclistas"
/*const CONTENIDO_VACIO =''*/


const datosDescargadosPrueba = {
    mensaje: "Mensaje de prueba descargado",
    autor: "Prueba de autor",
    email: "Prueba de email",
    fecha: "00/00/0000"
}


// Función para esperar y dar tiempo a que responda el microservicio
function esperar(ms) {
    var inicio = new Date().getTime();
    var fin = 0;
    while ((fin - inicio) < ms) {
        fin = new Date().getTime();
    }
}



// SPECS a probar

describe("Plantilla.mostrarHome: ", function () {

    it("muestra datos nulos cuando le pasamos un valor nulo",
        function () {
            Plantilla.mostrarHome()
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)
        })

    it("muestra datos nulos cuando le pasamos un valor que no es un objeto",
        function () {
            Plantilla.mostrarHome(23)
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)
        })

    it("muestra datos nulos cuando le pasamos un objeto que no tiene campo mensaje",
        function () {
            // Objeto vacío
            Plantilla.mostrarHome({})
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)

            // Objeto sin campo mensaje
            Plantilla.mostrarHome({ foo: "bar" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(Plantilla.datosDescargadosNulos.mensaje)
        })

    it("muestra correctamente el título y el mensaje",
        function () {
            Plantilla.mostrarHome(datosDescargadosPrueba)
            expect(elementoTitulo.innerHTML).toBe(TITULO_HOME)
            expect(elementoContenido.innerHTML).toBe(datosDescargadosPrueba.mensaje)
        })
})


describe("Plantilla.mostrarAcercaDe: ", function () {
    it("muestra datos nulos cuando le pasamos un valor nulo",
        function () {
            Plantilla.mostrarAcercaDe()
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
        })

    it("muestra datos nulos cuando le pasamos un valor que no es un objeto",
        function () {
            Plantilla.mostrarAcercaDe(23)
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
        })

    it("muestra datos nulos cuando le pasamos un objeto que no tiene campo mensaje o autor o email o fecha ",
        function () {
            // Objeto vacío
            Plantilla.mostrarAcercaDe({})
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()

            // Objeto sin campo mensaje
            Plantilla.mostrarAcercaDe({ autor: "un autor", email: "un email", fecha: "una fecha" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
            // Objeto sin campo autor
            Plantilla.mostrarAcercaDe({ mensaje: "un mensaje", email: "un email", fecha: "una fecha" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
            // Objeto sin campo email
            Plantilla.mostrarAcercaDe({ mensaje: "un mensaje", autor: "un autor", fecha: "una fecha" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
            // Objeto sin campo fecha
            Plantilla.mostrarAcercaDe({ mensaje: "un mensaje", autor: "un autor", email: "un email" })
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)
            expect(elementoContenido.innerHTML.search(Plantilla.datosDescargadosNulos.mensaje) >= 0).toBeTrue()
        })
    it("muestra correctamente el título y el mensaje conteniendo el autor, el email y la fecha",
        function () {
            Plantilla.mostrarAcercaDe(datosDescargadosPrueba)
            expect(elementoTitulo.innerHTML).toBe(TITULO_ACERCA_DE)

            // Comprobamos que al buscar el autor, el email y la fecha de prueba los encuentra dentro del contenido del article
            expect(elementoContenido.innerHTML.search(datosDescargadosPrueba.autor) >= 0).toBeTrue()
            expect(elementoContenido.innerHTML.search(datosDescargadosPrueba.email) >= 0).toBeTrue()
            expect(elementoContenido.innerHTML.search(datosDescargadosPrueba.fecha) >= 0).toBeTrue()
        })
})

describe("Plantilla.recupera", function () {
// TDD RECUPERA GETTODOS
beforeEach(() => {
    spyOn(window, 'alert')
    spyOn(console, 'error')
})

it("llama al API Gateway para obtener todos los datos y ejecuta la función callback",
    async function () {
        // Mock del resultado del fetch
        const respuestaMock = {
            json: function () { return { data: [datosDescargadosPrueba] } }
        }
        spyOn(window, 'fetch').and.returnValue(Promise.resolve(respuestaMock))

        // Mock de la función callback
        const callBackFn = jasmine.createSpy("callBackFn")

        // Ejecutar la función a probar
        await Plantilla.recupera(callBackFn)

        // Verificaciones
        expect(window.fetch).toHaveBeenCalledWith(Frontend.API_GATEWAY + "/plantilla/getTodos")
        expect(callBackFn).toHaveBeenCalledWith([datosDescargadosPrueba])
        expect(window.alert).not.toHaveBeenCalled()
        expect(console.error).not.toHaveBeenCalled()
    })

it("muestra un mensaje de error si no se puede acceder al API Gateway",
    async function () {
        // Mock del resultado del fetch
        spyOn(window, 'fetch').and.throwError("Error al acceder al API Gateway")

        // Mock de la función callback
        const callBackFn = jasmine.createSpy("callBackFn")

        // Ejecutar la función a probar
        await Plantilla.recupera(callBackFn)

        // Verificaciones
        expect(window.fetch).toHaveBeenCalledWith(Frontend.API_GATEWAY + "/plantilla/getTodos")
        expect(callBackFn).not.toHaveBeenCalled()
        expect(window.alert).toHaveBeenCalledWith("Error: No se han podido acceder al API Gateway")
        expect(console.error).toHaveBeenCalled()
    })
})

// TDD IMPRIME GETTODOS
/*describe("Plantilla.imprime", function () {
    it ("Cuando le pasamos un vector vacío, los datos tienen que ser nulos",
    function () {
        Plantilla.imprime([])
        expect(elementoTitulo.innerHTML).toBe(TITULO_IMPRIME)
        expect(elementoContenido.querySelector('tbody').innerHTML).toBe(CONTENIDO_VACIO)//Selecciona lo que esta dentro del tbody y tiene que ser un objeto vacío
    })
})*/
    
//TDD CABECERA GETTODOS

describe("Plantilla.cabeceraTable: ", function () {
  
    it("debería devolver una cadena de texto que contienen las cabeceras de una tabla HTML",
        function () {
            expect(Plantilla.cabeceraTable()).toBe(`<table class="listado-Plantilla">
        <thead>
        <th>Nombre</th><th>Nombre_Equipo</th><th>Tipo_Moto</th><th>Fecha_Nacimiento</th><th>Anios_Experiencia</th><th>Puntuaciones_Carrera</th><th>Marcas_Motocicletas</th><th>Posicion_Campeonato</th>
        </thead>
        <tbody>
    `);
        });
});

//TDD CUERPO GETTODOS

/*describe("Plantilla.cuerpoTr: ", function () {
  
    it("debería devolver una fila de tabla con los datos de un proyecto",
        function () {
            expect(Plantilla.cuerpoTr()).toBe(`<tr title="${p.ref['@ref'].id}"><td>${d.nombre}</td><td><em>${d.nombre_equipo}</em></td><td>${d.tipo_moto}</td><td>${fecha.dia}/${fecha.mes}/${fecha.anio}</td><td>${anios_experiencia}</td><td>${puntuaciones_carrera}</td><td>${marcas_motocicletas}</td><td>${d.posicion_campeonato}</td></tr>`);
        });
});*/

//TDD PIETABLE GETTODOS
describe("Plantilla.pieTable ", function () {
    it("debería devolver las etiquetas HTML para el pie de tabla",
        function () {
            expect(Plantilla.pieTable()).toBe("</tbody></table>");
        });
});

//TDD METODO : SOLO NOMBRES (GETNOMBRES)

describe("Plantilla.recuperaNombres", function () {
    // TDD RECUPERA GETNOMBRES
    beforeEach(() => {
        spyOn(window, 'alert')
        spyOn(console, 'error')
    })
    
    it("llama al API Gateway para obtener todos los datos y ejecuta la función callback",
        async function () {
            // Mock del resultado del fetch
            const respuestaMock = {
                json: function () { return { data: [datosDescargadosPrueba] } }
            }
            spyOn(window, 'fetch').and.returnValue(Promise.resolve(respuestaMock))
    
            // Mock de la función callback
            const callBackFn = jasmine.createSpy("callBackFn")
    
            // Ejecutar la función a probar
            await Plantilla.recuperaNombres(callBackFn)
    
            // Verificaciones
            expect(window.fetch).toHaveBeenCalledWith(Frontend.API_GATEWAY + "/plantilla/getNombres")
            expect(callBackFn).toHaveBeenCalledWith([datosDescargadosPrueba])
            expect(window.alert).not.toHaveBeenCalled()
            expect(console.error).not.toHaveBeenCalled()
        })
    
    it("muestra un mensaje de error si no se puede acceder al API Gateway",
        async function () {
            // Mock del resultado del fetch
            spyOn(window, 'fetch').and.throwError("Error al acceder al API Gateway")
    
            // Mock de la función callback
            const callBackFn = jasmine.createSpy("callBackFn")
    
            // Ejecutar la función a probar
            await Plantilla.recuperaNombres(callBackFn)
    
            // Verificaciones
            expect(window.fetch).toHaveBeenCalledWith(Frontend.API_GATEWAY + "/plantilla/getNombres")
            expect(callBackFn).not.toHaveBeenCalled()
            expect(window.alert).toHaveBeenCalledWith("Error: No se han podido acceder al API Gateway")
            expect(console.error).toHaveBeenCalled()
        })
    })
    
    // TDD IMPRIME GETNOMBRES
    /*describe("Plantilla.imprime", function () {
        it ("Cuando le pasamos un vector vacío, los datos tienen que ser nulos",
        function () {
            Plantilla.imprime([])
            expect(elementoTitulo.innerHTML).toBe(TITULO_IMPRIME)
            expect(elementoContenido.querySelector('tbody').innerHTML).toBe(CONTENIDO_VACIO)//Selecciona lo que esta dentro del tbody y tiene que ser un objeto vacío
        })
    })*/
        
    //TDD CABECERA GETNOMBRES
    
    /*describe("Plantilla.cabeceraTable: ", function () {
      
        it("debería devolver una cadena de texto que contienen las cabeceras de una tabla HTML",
            function () {
                expect(Plantilla.cabeceraTable()).toBe(`<table class="listado-Plantilla">
            <thead>
            <th>Nombre</th><th>Nombre_Equipo</th><th>Tipo_Moto</th><th>Fecha_Nacimiento</th><th>Anios_Experiencia</th><th>Puntuaciones_Carrera</th><th>Marcas_Motocicletas</th><th>Posicion_Campeonato</th>
            </thead>
            <tbody>
        `);
            });
    });*/
    
    //TDD CUERPO GETNOMBRES
    
    /*describe("Plantilla.cuerpoTr: ", function () {
      
        it("debería devolver una fila de tabla con los datos de un proyecto",
            function () {
                expect(Plantilla.cuerpoTr()).toBe(`<tr title="${p.ref['@ref'].id}"><td>${d.nombre}</td><td><em>${d.nombre_equipo}</em></td><td>${d.tipo_moto}</td><td>${fecha.dia}/${fecha.mes}/${fecha.anio}</td><td>${anios_experiencia}</td><td>${puntuaciones_carrera}</td><td>${marcas_motocicletas}</td><td>${d.posicion_campeonato}</td></tr>`);
            });
    });*/
    
    //TDD PIETABLE GETNOMBRES
    /*describe("Plantilla.pieTable ", function () {
        it("debería devolver las etiquetas HTML para el pie de tabla",
            function () {
                expect(Plantilla.pieTable()).toBe("</tbody></table>");
            });
    });*/


/*
IMPORTANTE
==========

Las pruebas TDD que se encargan de probar las conexiones con el microservicio desde el cliente son difíciles de probar 
dado que requieren solucionar temas de sincronización. 
Esto afecta a los métodos:
 - Plantilla.descargarRuta
 - Plantilla.procesarAcercaDe
 - Plantilla.procesarHome

 Las soluciones propuestas en distintos sitios web no han producido el resultado esperado, 
 por tanto: para esta práctica, se pueden dejar SIN HACER.

 */
