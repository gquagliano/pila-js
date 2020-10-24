/**
 * (c) Gabriel Quagliano - gabriel@foxtrot.ar
 */

/**
 * @typedef {Pila}
 */

/**
 * @var {Object} [opciones] - Configuración de la instancia.
 * @var {Object[]} [opciones.listado] - Listado a recorrer.
 * @var {string} [opciones.nombre="nombre"] - Propiedad o función que identifique cada elemento.
 * @var {string} [opciones.hijos="hijos"] - Propiedad o función que devuelva la descendencia de cada elemento.
 * @var {string} [opciones.asignarRuta] - Nombre de una propiedad o función si se desea asignar su ruta a cada elemento.
 * @var {(string|RegExp)} [opciones.filtro] - Filtro por nombre.
 * @var {string} [opciones.ruta] - Ruta a buscar, compuesta por los nombres de los elementos separados por punto.
 * @var {function} [opciones.retorno] - Función de retorno. Recibirá como parámetros la instancia del elemento, el índice y la pila actual. Devolviendo false, suspenderá la operación.
 * @var {function} [opciones.cierre] - Función de retorno al finalizar un nivel. Recibirá como parámetros la instancia del elemento padre y la pila actual. Devolviendo false, suspenderá la operación.
 * @var {function} [opciones.siempre] - Función de retorno para todos los casos, aunque no coincidan con el filtro. Recibirá como parámetros la instancia del elemento, el índice y la pila actual. Devolviendo false, suspenderá la operación.
 * @var {function} [opciones.final] - Función de retorno al finalizar la operación.
 * @constructor
 */
var pila=function(opciones) {
    "use strict";

    var t=this;

    this.opciones={
        listado:[],
        nombre:"nombre",
        hijos:"hijos",
        asignarRuta:null,
        filtro:null,
        ruta:null,
        retorno:null,
        siempre:null,
        final:null
    };

    /**
     * Actualiza la configuración de la instancia.
     * @var {Object} opciones - Configuración de la instancia.
     * @var {Object[]} [opciones.listado] - Listado a recorrer.
     * @var {string} [opciones.nombre="nombre"] - Propiedad o función que identifique cada elemento.
     * @var {string} [opciones.hijos="hijos"] - Propiedad o función que devuelva la descendencia de cada elemento.
     * @var {string} [opciones.asignarRuta] - Nombre de una propiedad o función si se desea asignar su ruta a cada elemento.
     * @var {(string|RegExp)} [opciones.filtro] - Filtro por nombre.
     * @var {string} [opciones.ruta] - Ruta a buscar, compuesta por los nombres de los elementos separados por punto.
     * @var {function} [opciones.retorno] - Función de retorno. Recibirá como parámetros la instancia del elemento, el índice y la pila actual. Devolviendo false, suspenderá la operación.
     * @var {function} [opciones.cierre] - Función de retorno al finalizar un nivel. Recibirá como parámetros la instancia del elemento padre y la pila actual. Devolviendo false, suspenderá la operación.
     * @var {function} [opciones.siempre] - Función de retorno para todos los casos, aunque no coincidan con el filtro. Recibirá como parámetros la instancia del elemento, el índice y la pila actual. Devolviendo false, suspenderá la operación.
     * @var {function} [opciones.final] - Función de retorno al finalizar la operación.
     * @returns {Pila}
     */
    this.establecerOpciones=function(opciones) {
        this.opciones=Object.assign(this.opciones,opciones);
        return this;
    };

    /**
     * Intenta obtener el valor de una propiedad considerando que puede tratarse de una función que devuelva el valor buscado.
     * @param {Object} obj - Objeto.
     * @param {string} propiedad - Nombre de la propiedad.
     * @param {string} tipo - Tipo esperado.
     * @returns {*}
     */
    var obtenerValor=function(obj,propiedad,tipo) {
        if(typeof obj==="undefined"||typeof propiedad!=="string") return null;

        var evaluar=obj[propiedad];

        //Si contiene una función, ejecutar y tomar el valor de retorno
        if(typeof evaluar==="function") evaluar=evaluar.call(obj);

        if(typeof evaluar===tipo) return evaluar;
        return null;
    };

    /**
     * Intenta establecer el valor de una propiedad considerando que puede tratarse de una función que reciba el valor.
     * @param {Object} obj - Objeto.
     * @param {string} propiedad - Nombre de la propiedad.
     * @param {*} valor - Valor a asignar.
     */
    var establecerValor=function(obj,propiedad,valor) {
        if(typeof obj==="undefined"||typeof propiedad!=="string") return;

        var evaluar=obj[propiedad];
        if(typeof evaluar==="function") {
            //Si contiene una función, pasar como argumento
            evaluar.call(obj,valor);
        } else {
            obj[propiedad]=valor;
        }
    };

    /**
     * Ejecuta el recorrido.
     * @returns {Pila}
     */
    this.ejecutar=function() {
        var listado=this.opciones.origen,
            padre=null,
            elem,
            i=0,
            pila=[],
            ruta=[],
            continuar=true;
        
        if(typeof listado==="object"||typeof listado.length!=="undefined") {
            while(pila.length>0||i<listado.length) {
                while(i<listado.length) {
                    var elem=listado[i],
                        //Obtener la descendencia
                        hijos=obtenerValor(elem,this.opciones.hijos,"object"),
                        //Obtener el nombre
                        nombre=obtenerValor(elem,this.opciones.nombre,"string"),
                        filtro=true,
                        retorno,
                        retornoSiempre;

                    if(nombre) {
                        //Reemplazar último componente de la ruta actual
                        if(i>0) ruta.pop();
                        ruta.push(nombre);

                        if(typeof this.opciones.asignarRuta==="string") establecerValor(elem,this.opciones.asignarRuta,ruta.join("."));
                    }

                    //Búsqueda por ruta
                    if(typeof this.opciones.ruta==="string"&&this.opciones.ruta!=ruta.join(".")) filtro=false;

                    //Filtros (escrito para legibilidad, podría ser una sola línea)
                    if(nombre) {
                        if(typeof this.opciones.filtro==="string") {
                            if(nombre!=this.opciones.filtro) filtro=false;
                        } else if(this.opciones.filtro instanceof RegExp) {
                            if(!this.opciones.filtro.test(nombre)) filtro=false;
                        }
                    }

                    if(filtro&&typeof this.opciones.retorno==="function") retorno=this.opciones.retorno(elem,i,pila);

                    if(typeof this.opciones.siempre==="function") retornoSiempre=this.opciones.siempre(elem,i,pila);
                    
                    if(!continuar||retorno===false||retornoSiempre===false) {
                        //Detener
                        continuar=false;
                        break;
                    }

                    i++;

                    //Entrar a la descendencia

                    if(typeof hijos!=="object"||typeof hijos.length==="undefined"||hijos.length===0) continue; //La descendencia no es un array o está vacía
                    
                    //Guardar la posición actual en la pila
                    pila.push({
                        listado:listado,
                        indice:i,
                        padre:padre,
                        ruta:ruta
                    });

                    //Pasar al listado de hijos
                    listado=hijos;
                    padre=elem;
                    i=0;
                }

                if(!continuar) break;

                if(typeof this.opciones.cierre==="function") {
                    var retorno=this.opciones.cierre(padre,pila);
                    if(retorno===false) break; //Detener
                }

                //Finalizado el listado, retomar la posición anterior
                var anterior=pila.pop();
                if(typeof anterior!=="undefined") {
                    listado=anterior.listado;
                    i=anterior.indice;
                    padre=anterior.padre;
                    ruta.pop();
                }
            }
        }

        if(typeof this.opciones.final==="function") this.opciones.final();
    };

    /**
     * Obtiene un elemento dada su ruta. A diferencia de ejecutar(), este método busca propiedades por nombre (no elementos del listado).
     * @var {string} ruta - Ruta del elemento solicitado (nombres separados por punto).
     * @returns {*}
     */
    this.obtener=function(ruta) {
        var partes=ruta.split("."),
            origen=this.opciones.origen;

        for(var i=0;i<partes.length;i++) {
            var parte=partes[i],
                origen=origen[parte];
            if(typeof origen!=="object") break;
        }

        return origen;
    };

    this.establecerOpciones(opciones);
};
