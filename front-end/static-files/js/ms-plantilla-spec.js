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
const TITULO_NAZ = "Listado de NOMBRES Aa-Zz de motociclistas"
const TITULO_MOTOCICLISTAS = "Listado de motocilistas"
const TITULO_NOMBRE = "Listado de NOMBRES de motociclistas"



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

describe("Plantilla.imprime: ", function() {
    it("Mostrar datos nulos cuando le pasamos vector nulo", 
        function () {
            // Objeto vacio
            Plantilla.imprime([])
            expect(elementoTitulo.innerHTML).toBe(TITULO_IMPRIME)
           
    })
})
    
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

describe('Plantilla.cuerpoTr', () => {
    it('debería retornar una cadena que contenga el nombre del piloto', () => {
      const data = {
        nombre: 'Marc Márquez',
        nombre_equipo: 'Repsol Honda Team',
        tipo_moto: 'Honda',
        fecha_nacimiento: { dia: 17, mes: 2, anio: 1993 },
        anios_experiencia: [8, 9],
        puntuaciones_carrera: [25, 20],
        marcas_motocicletas: ['Honda', 'Yamaha'],
        posicion_campeonato: 2
      };
      const result = Plantilla.cuerpoTr({ data });
      expect(result).toContain(data.nombre);
    });
  
    it('debería retornar una cadena que contenga el nombre del equipo en cursiva', () => {
      const data = {
        nombre: 'Valentino Rossi',
        nombre_equipo: 'Petronas Yamaha SRT',
        tipo_moto: 'Yamaha',
        fecha_nacimiento: { dia: 16, mes: 2, anio: 1979 },
        anios_experiencia: [21, 22],
        puntuaciones_carrera: [16, 10],
        marcas_motocicletas: ['Yamaha', 'Ducati', 'Honda'],
        posicion_campeonato: 10
      };
      const result = Plantilla.cuerpoTr({ data });
      expect(result).toContain(`<em>${data.nombre_equipo}</em>`);
    });
  
    it('debería retornar una cadena que contenga la fecha de nacimiento en formato "dd/mm/yyyy"', () => {
      const data = {
        nombre: 'Joan Mir',
        nombre_equipo: 'Team Suzuki Ecstar',
        tipo_moto: 'Suzuki',
        fecha_nacimiento: { dia: 1, mes: 9, anio: 1997 },
        anios_experiencia: [4, 5],
        puntuaciones_carrera: [10, 8],
        marcas_motocicletas: ['Suzuki', 'KTM'],
        posicion_campeonato: 3
      };
      const result = Plantilla.cuerpoTr({ data });
      expect(result).toContain(`${data.fecha_nacimiento.dia}/${data.fecha_nacimiento.mes}/${data.fecha_nacimiento.anio}`);
    });
  
    // Puedes seguir agregando más pruebas para verificar el comportamiento de la función en distintos casos
  });
  
  
  

  

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
   
    describe("Plantilla.imprimeNombres: ", function() {
        it("Mostrar datos nulos cuando le pasamos vector nulo", 
            function () {
                // Objeto vacio
                Plantilla.imprimeNombres([])
                expect(elementoTitulo.innerHTML).toBe(TITULO_NOMBRE)
               
        })
    })
        
    //TDD CABECERA GETNOMBRES
    
    describe("Plantilla.cabeceraTableN: ", function () {
      
        it("debería devolver una cadena de texto que contienen las cabeceras de una tabla HTML",
            function () {
                expect(Plantilla.cabeceraTableN()).toBe(`<table class="listado-Plantilla">
        <thead>
        <th>Nombre</th>
        </thead>
        <tbody>
    `);
            });
    });
    
    //TDD CUERPO GETNOMBRES

    describe('Plantilla.cuerpoTrN', () => {
        it("debería contener el nombre pasado como parámetro en la cadena que retorna la función",
            function () {
                expect(Plantilla.cuerpoTrN("Jorge Lorenzo")).toContain("Jorge Lorenzo");
            });
      });
      
    
    //TDD PIETABLE GETNOMBRES
    describe("Plantilla.pieTableN ", function () {
        it("debería devolver las etiquetas HTML para el pie de tabla",
            function () {
                expect(Plantilla.pieTableN()).toBe("</tbody></table>");
            });
    });

    //TDD METODO :  NOMBRES ORDENADOS ALFABETICAMENTE (getNAlfabeticamente)

describe("Plantilla.recuperaNombresAZ", function () {
    // TDD RECUPERA getNAlfabeticamente
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
            await Plantilla.recuperaNombresAZ(callBackFn)
    
            // Verificaciones
            expect(window.fetch).toHaveBeenCalledWith(Frontend.API_GATEWAY + "/plantilla/getNAlfabeticamente")
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
            await Plantilla.recuperaNombresAZ(callBackFn)
    
            // Verificaciones
            expect(window.fetch).toHaveBeenCalledWith(Frontend.API_GATEWAY + "/plantilla/getNAlfabeticamente")
            expect(callBackFn).not.toHaveBeenCalled()
            expect(window.alert).toHaveBeenCalledWith("Error: No se han podido acceder al API Gateway")
            expect(console.error).toHaveBeenCalled()
        })
    })
    
    // TDD IMPRIME getNAlfabeticamente
    
    describe("Plantilla.imprimeNAZ: ", function() {
        it("Mostrar datos nulos cuando le pasamos vector nulo", 
            function () {
                // Objeto vacio
                Plantilla.imprimeNAZ([])
                expect(elementoTitulo.innerHTML).toBe(TITULO_NAZ)
               
        })
    })
        
    //TDD CABECERA getNAlfabeticamente
    
    describe("Plantilla.cabeceraTableN: ", function () {
      
        it("debería devolver una cadena de texto que contienen las cabeceras de una tabla HTML",
            function () {
                expect(Plantilla.cabeceraTableNAZ()).toBe(`<table class="listado-Plantilla">
        <thead>
        <th>Nombre</th>
        </thead>
        <tbody>
    `);
            });
    });
    
    //TDD CUERPO getNAlfabeticamente

      describe('Plantilla.cuerpoTrNAZ', function () {

        // Prueba 1
        
        it("debería contener el nombre pasado como parámetro en la cadena que retorna la función",
            function () {
                expect(Plantilla.cuerpoTrNAZ("Jorge Lorenzo")).toContain("Jorge Lorenzo");
            });

    });
    
    //TDD PIETABLE getNAlfabeticamente
    describe("Plantilla.pieTableNAZ ", function () {
        it("debería devolver las etiquetas HTML para el pie de tabla",
            function () {
                expect(Plantilla.pieTableNAZ()).toBe("</tbody></table>");
            });
    });

//TDD DE SUSTITUYETAGS
    describe('Plantilla.sustituyeTags', function () {
        // Preparar los datos de la prueba
        const plantilla = '<tr><td>### NOMBRE ###</td><td>### NOMBRE_EQUIPO ###</td><td>### TIPO_MOTO ###</td><td>### FECHA_NACIMIENTO ###</td><td>### ANIOS_EXPERIENCIA ###</td><td>### PUNTUACIONES_CARRERA ###</td><td>### MARCAS_MOTOCICLETAS ###</td><td>### POSICION_CAMPEONATO ###</td></tr>';
        const persona = {
            data: {
                nombre: 'Jorge Lorenzo',
                nombre_equipo: 'Equipo 1',
                tipo_moto: 'Moto 1',
                fecha_nacimiento: {
                    dia: '01',
                    mes: '01',
                    anio: '1990'
                },
                anios_experiencia: 5,
                puntuaciones_carrera: '10,8,6',
                marcas_motocicletas: 'Marca 1, Marca 2',
                posicion_campeonato: 1
            }
        };
    
        // Realizar los expect
        it('debería devolver la plantilla con los tags reemplazados por los datos de la persona',
            function () {
                expect(Plantilla.sustituyeTags(plantilla, persona)).toBe('<tr><td>Jorge Lorenzo</td><td>Equipo 1</td><td>Moto 1</td><td>01/01/1990</td><td>5</td><td>10,8,6</td><td>Marca 1, Marca 2</td><td>1</td></tr>');
            });
    });

    //TDD DE LA FUNCION RECUPERAPERSONABUSCAR
    describe("Plantilla.recuperapersonaBuscar", function () {
        // TDD RECUPERA getTodos
        beforeEach(() => {
            spyOn(window, 'alert')
            spyOn(console, 'error')
        })

       
        it("muestra un mensaje de error si no se puede acceder al API Gateway",
            async function () {
                const nombreBuscar = "Juan"
                // Mock del resultado del fetch
                spyOn(window, 'fetch').and.throwError("Error al acceder al API Gateway")
    
                // Mock de la función callback
                const callBackFn = jasmine.createSpy("callBackFn")
    
                // Ejecutar la función a probar
                await Plantilla.recuperapersonaBuscar(nombreBuscar, callBackFn)
    
                // Verificaciones
                expect(window.fetch).toHaveBeenCalledWith(Frontend.API_GATEWAY + "/plantilla/getTodos")
                expect(callBackFn).not.toHaveBeenCalled()
                expect(window.alert).toHaveBeenCalledWith("Error: No se han podido acceder al API Gateway")
                expect(console.error).toHaveBeenCalled()
            })
    })
    
    //TDD DE IMPRIMETODOSMOTOCICLISTAS

    describe("Plantilla.imprimeTodosMotociclistas: ", function() {
        it("Mostrar datos nulos cuando le pasamos vector nulo", 
            function () {
                // Objeto vacio
                Plantilla.imprimeTodosMotociclistas([])
                expect(elementoTitulo.innerHTML).toBe(TITULO_MOTOCICLISTAS)
                
        })})

    //TDD DE recuperaCumpleVariosCriterios

    describe("Plantilla.recuperaCumpleVariosCriterios", function () {
        // TDD RECUPERA recuperaCumpleVariosCriterios
        beforeEach(() => {
            spyOn(window, 'alert')
            spyOn(console, 'error')
        })
        
        it("muestra un mensaje de error si no se puede acceder al API Gateway",
            async function () {
                // Mock del resultado del fetch
                spyOn(window, 'fetch').and.throwError("Error al acceder al API Gateway")
        
                // Mock de la función callback
                const callBackFn = jasmine.createSpy("callBackFn")
        
                // Ejecutar la función a probar
                await Plantilla.recuperaCumpleVariosCriterios("MotoGP", "Yamaha", "1", callBackFn)
        
                // Verificaciones
                expect(window.fetch).toHaveBeenCalledWith(Frontend.API_GATEWAY + "/plantilla/getTodos")
                expect(callBackFn).not.toHaveBeenCalled()
                expect(window.alert).toHaveBeenCalledWith("Error: No se han podido acceder al API Gateway")
                expect(console.error).toHaveBeenCalled()
            })
        })
    


    //TDD DE recuperaVariosCriterios
    describe("Plantilla.recuperaVariosCriterios", function () {
        // TDD RECUPERA recuperaVariosCriterios
        beforeEach(() => {
            spyOn(window, 'alert')
            spyOn(console, 'error')
        })
        
        it("llama al API Gateway para obtener todos los datos y ejecuta la función callback con los datos filtrados",
            async function () {
                // Mock del resultado del fetch
                const datosPrueba = [
                    {
                        data: {
                            tipo_moto: "MotoGP",
                            nombre_equipo: "Yamaha",
                            posicion_campeonato: 1
                        }
                    },
                    {
                        data: {
                            tipo_moto: "Moto2",
                            nombre_equipo: "Kalex",
                            posicion_campeonato: 5
                        }
                    },
                    {
                        data: {
                            tipo_moto: "Moto3",
                            nombre_equipo: "Honda",
                            posicion_campeonato: 8
                        }
                    }
                ]
                const respuestaMock = {
                    json: function () { return { data: datosPrueba } }
                }
                spyOn(window, 'fetch').and.returnValue(Promise.resolve(respuestaMock))
        
                // Mock de la función callback
                const callBackFn = jasmine.createSpy("callBackFn")
        
                // Ejecutar la función a probar
                await Plantilla.recuperaVariosCriterios("MotoGP", null, null, callBackFn)
        
                // Verificaciones
                expect(window.fetch).toHaveBeenCalledWith(Frontend.API_GATEWAY + "/plantilla/getTodos")
                expect(callBackFn).toHaveBeenCalledWith([datosPrueba[0]])
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
                await Plantilla.recuperaVariosCriterios("MotoGP", null, null, callBackFn)
        
                // Verificaciones
                expect(window.fetch).toHaveBeenCalledWith(Frontend.API_GATEWAY + "/plantilla/getTodos")
                expect(callBackFn).not.toHaveBeenCalled()
                expect(window.alert).toHaveBeenCalledWith("Error: No se han podido acceder al API Gateway")
                expect(console.error).toHaveBeenCalled()
            })
    })
    

    


    

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
