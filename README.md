**Pequeña librería para recorrer estructuras anidadas sin realizar recursión, mediante una pila o *stack***

Dado un árbol de objetos, permite recorrerlo utilizando una pila (*stack*), similar a como el procesador ejecutaría esta tarea, para mayor eficiencia. El propósito de esto es poder recorrer o filtrar dichas estructuras utilizando un bucle en lugar de recursión, ya que hoy en día utilizar recursión representa un costo considerable en el rendimiento de una aplicación JavaScript.

### Modo de uso

Incluir `pila.js`  
  
  `<script src="pila.js"></script>`

Crear una instancia de `pila` e invocar `ejecutar()`.

  `new pila(opciones).ejecutar();`
  
**Propiedades de `opciones`:**

| Propiedad | Tipo | Descripción | Opcional | Valor predeterminado |
|--|--|--|--|--|
| `opciones.listado` | `Object[]` | Listado a recorrer. | Si |  |
| `opciones.nombre` | `string` | Nombre de una propiedad que identifique cada elemento. Esta propiedad puede contener cualquier valor único o una función que devuelva la identificación del elemento. | Si | `"nombre"` |
| `opciones.hijos` | `string` | Nombre de una propiedad que contenga o devuelva la descendencia de cada elemento. Esta propiedad puede contener un listado de hijos o una función que devuelva el mismo. | Si | `"hijos"` |
| `opciones.asignarRuta` | `string` | Si se desea asignar la ruta a cada elemento (`padre.hijo.etc`), nombre de una propiedad en la cual se asignará. Esta propiedad puede tener asignada una función, en cuyo caso la misma será invocada con la ruta como único argumento. | Si |  |
| `opciones.filtro` | `(string\|RegExp)` | Filtro por nombre (valor obtenido de la propiedad especificada en `nombre`). | Si |  |
| `opciones.ruta` | `string` | Ruta a buscar, compuesta por los nombres de los elementos separados por punto (`padre.hijo.etc`). | Si |  |
| `opciones.retorno` | `function(elemento,indice,pila)` | Función de retorno. Será invocada una vez por cada elemento que coincida con el filtro, con la instancia del elemento, el índice y la pila actual como argumentos. Si devuelve `false`, se detendrá la operación. | Si |  |
| `opciones.cierre` | `function(elementoPadre,pila)` | Función de retorno al finalizar un nivel. Será invocada al volver a ascender en el árbol, recibiendo como argumentos la instancia del elemento padre y la pila actual. Si devuelve `false`, se detendrá la operación. | Si |  |
| `opciones.siempre` | `function(elemento,indice,pila)` | Función de retorno para todos los casos. Será invocada una vez por cada elemento del árbol, aunque no coincida con el filtro. Recibirá argumentos la instancia del elemento, el índice y la pila actual. Si devuelve `false`, se detendrá la operación. | Si |  |
| `opciones.final` | `function` | Función de retorno al finalizar la operación. | Si |  |

### Ejemplo con un objeto plano o con JSON

    //datos puede provenir de cualquier fuente...
    var datos=[
        {
            id:1,
            subitems:[
                {
                    id:4,
                    subitems:[]
                },
                {
                    id:5,
                    subitems:[]
                }
            ]
        },
        {
            id:2,
            subitems:[
                {
                    id:6,
                    subitems:[]
                },
                {
                    id:7,
                    subitems:[]
                }
            ]
        },
        {
            id:3,
            subitems:[
                {
                    id:8,
                    subitems:[]
                },
                {
                    id:9,
                    subitems:[]
                }
            ]
        }
    ];
    
    new pila({
        listado:datos,
        nombre:"id",
        hijos:"subitems",
        retorno:function(elem) {
            console.log("Analizando el elemento:",elem);
        }
    }).ejecutar();

### Más información

- Ver JSDOC en [pila.js](pila.js).

- Ver [ejemplo.html](ejemplo.html) para más información sobre el modo de uso mediante un ejemplo más complejo.
