/* =====================================================================
   GUÍA 5.º · PRIMER TRIMESTRE (GAMES-17): contenido de la guía de estudio
   (4 campos formativos, 21 temas), tomado de "5to - Guía de estudio -
   1er trim 26-27". Cada tema tiene su tarjeta de repaso y sus preguntas:
     choice    - opción múltiple (la primera opción es la correcta; las guías las mezclan)
     truefalse - verdadero o falso
     pairs     - [término, definición] para relacionar columnas
     bank      - oración con ___ y su palabra, para el banco de palabras
     open      - respuesta abierta corta: ideas clave (grupos de sinónimos),
                 cuántas deben aparecer (need) y la respuesta modelo
   CLASIFICA: conjuntos para clasificar (categorías y elementos).
   Puro: sin DOM; las pruebas lo cargan en Node (English/tests/).
   ===================================================================== */

const CAMPOS = [
    { id: "lenguajes", name: "Lenguajes", emoji: "📝" },
    { id: "saberes", name: "Saberes y pensamiento científico", emoji: "🔬" },
    { id: "etica", name: "Ética, naturaleza y sociedades", emoji: "🌎" },
    { id: "humano", name: "De lo humano y lo comunitario", emoji: "🤝" }
];

// Atajos para escribir las preguntas
const mc = (text, options, tip, explanation) => ({ text, options, answer: 0, tip, explanation });
const tf = (text, answer, explanation) => ({ text, answer, explanation });
const blank = (text, answer, tip) => ({ text, answer, tip });
const abierta = (text, ideas, need, model, tip) => ({ text, ideas, need, model, tip });

const TEMAS = [
    // ---------- Lenguajes ----------
    {
        id: "sustantivos", campo: "lenguajes", title: "Tipos de sustantivos",
        card: {
            points: [
                "<b>Sustantivos:</b> palabras que sirven para nombrar personas, animales, cosas, lugares o ideas.",
                "<b>Comunes:</b> nombres generales que no se refieren a algo específico. Ejemplo: <i>niño, perro, ciudad</i>.",
                "<b>Propios:</b> identifican a alguien o algo específico, siempre con mayúscula. Ejemplo: <i>Juan, Monterrey</i>.",
                "<b>Concretos:</b> cosas que podemos ver, tocar, oler, etc. Ejemplo: <i>mesa, gato</i>.",
                "<b>Abstractos:</b> ideas o sentimientos que no podemos tocar. Ejemplo: <i>amor, libertad</i>.",
                "Común y concreto: <i>libro, árbol</i>. Propio: <i>México</i>; abstracto: <i>felicidad</i>."
            ]
        },
        choice: [
            mc("¿Qué es un sustantivo?", ["Una palabra que nombra personas, animales, cosas, lugares o ideas", "Una palabra que indica una acción", "Una palabra que une dos oraciones"],
                "Piensa en las palabras que usamos para nombrar.", "Los sustantivos nombran personas, animales, cosas, lugares o ideas."),
            mc("¿Qué tipo de sustantivo es «Monterrey»?", ["Propio", "Común", "Abstracto"],
                "¿Es un lugar específico? ¿Cómo se escribe?", "Monterrey es un lugar específico y se escribe con mayúscula: es un sustantivo propio."),
            mc("¿Cuál de estos es un sustantivo abstracto?", ["amor", "mesa", "gato"],
                "Busca algo que no se puede tocar.", "El amor es un sentimiento que no podemos tocar: es abstracto."),
            mc("Los sustantivos propios siempre se escriben…", ["con mayúscula inicial", "en plural", "con acento"],
                "Piensa en cómo escribes tu nombre.", "Los sustantivos propios siempre llevan mayúscula al inicio: Juan, México.")
        ],
        truefalse: [
            tf("«Libro» es un sustantivo común y concreto.", true, "Es un nombre general y lo podemos tocar."),
            tf("Los sustantivos abstractos nombran cosas que podemos tocar.", false, "Los abstractos nombran ideas o sentimientos que no podemos tocar."),
            tf("«Juan» es un sustantivo propio.", true, "Identifica a una persona específica y lleva mayúscula."),
            tf("«Felicidad» es un sustantivo concreto.", false, "La felicidad no se puede tocar: es un sustantivo abstracto.")
        ],
        pairs: [
            ["Sustantivo común", "Nombre general que no se refiere a algo específico"],
            ["Sustantivo propio", "Nombre de alguien o algo específico, con mayúscula"],
            ["Sustantivo concreto", "Nombra cosas que podemos ver, tocar u oler"],
            ["Sustantivo abstracto", "Nombra ideas o sentimientos que no podemos tocar"]
        ],
        bank: [
            blank("«Ciudad» es un sustantivo ___ porque es un nombre general.", "común", "No se refiere a una ciudad específica."),
            blank("«Libertad» es un sustantivo ___ porque no la podemos tocar.", "abstracto", "Es una idea, no un objeto."),
            blank("«Mesa» es un sustantivo ___ porque la podemos ver y tocar.", "concreto", "Se puede tocar."),
            blank("«México» es un sustantivo ___ y se escribe con mayúscula.", "propio", "Es el nombre de un país específico.")
        ]
    },
    {
        id: "variables", campo: "lenguajes", title: "Palabras variables e invariables",
        card: {
            points: [
                "<b>Variables:</b> cambian en género (masculino, femenino), número (singular, plural) o persona.",
                "Sustantivos: <i>niño (niños), gata (gatas)</i>. Adjetivos: <i>bonito (bonitos), roja (rojas)</i>. Verbos: <i>correr (corro, corres, corremos)</i>.",
                "<b>Invariables:</b> no cambian de forma, sin importar el género o el número.",
                "Adverbios: <i>ayer, bien, aquí</i>. Conjunciones: <i>y, pero, aunque</i>. Preposiciones: <i>de, para, sobre</i>.",
                "En oración: <i>La niña feliz juega</i> (variables) · <i>Aquí está el libro</i> (invariable)."
            ]
        },
        choice: [
            mc("¿Qué son las palabras variables?", ["Las que cambian en género, número o persona", "Las que nunca cambian de forma", "Solo los verbos"],
                "Piensa en niño → niños o gata → gatas.", "Las palabras variables cambian en género, número o persona."),
            mc("¿Cuál de estas palabras es invariable?", ["aquí", "niña", "bonito"],
                "Busca la palabra que no tiene femenino ni plural.", "«Aquí» es un adverbio: no cambia de forma."),
            mc("¿Qué tipo de palabras son «y, pero, aunque»?", ["Conjunciones", "Adjetivos", "Sustantivos"],
                "Sirven para unir ideas.", "«Y, pero, aunque» son conjunciones: palabras invariables."),
            mc("¿Qué tipo de palabras son «de, para, sobre»?", ["Preposiciones", "Verbos", "Adjetivos"],
                "Son invariables y relacionan palabras.", "«De, para, sobre» son preposiciones.")
        ],
        truefalse: [
            tf("Los adverbios «ayer», «bien» y «aquí» son palabras invariables.", true, "Los adverbios no cambian de forma."),
            tf("Los verbos son variables porque cambian de persona: corro, corres, corremos.", true, "El verbo cambia según la persona."),
            tf("Las preposiciones «de, para, sobre» cambian según el género.", false, "Las preposiciones son invariables."),
            tf("Los adjetivos son palabras invariables.", false, "Los adjetivos son variables: bonito, bonitos; roja, rojas.")
        ],
        pairs: [
            ["Palabras variables", "Cambian en género, número o persona"],
            ["Palabras invariables", "No cambian de forma"],
            ["Conjunciones", "y, pero, aunque"],
            ["Preposiciones", "de, para, sobre"],
            ["Adverbios", "ayer, bien, aquí"]
        ],
        bank: [
            blank("«Ayer», «bien» y «aquí» son ___.", "adverbios", "Son palabras invariables que indican tiempo, modo o lugar."),
            blank("«De», «para» y «sobre» son ___.", "preposiciones", "Relacionan unas palabras con otras."),
            blank("«Y», «pero» y «aunque» son ___.", "conjunciones", "Sirven para unir ideas.")
        ],
        open: [
            abierta("¿Por qué «niña» es una palabra variable?",
                [["cambia", "cambiar", "cambian"], ["genero", "numero", "ninas", "nino", "plural", "masculino", "femenino"]], 2,
                "Porque cambia de género y de número: niña, niño, niñas.", "Piensa en sus formas: niño, niñas…")
        ]
    },
    {
        id: "articulos", campo: "lenguajes", title: "Artículos determinados e indeterminados",
        card: {
            points: [
                "<b>Artículos:</b> acompañan al sustantivo y lo identifican como algo específico o no específico.",
                "<b>Determinados:</b> se refieren a algo específico: <i>el, la, los, las</i>. Ejemplo: <i>el carro, las niñas</i>.",
                "<b>Indeterminados:</b> cuando el sustantivo no es algo específico: <i>un, una, unos, unas</i>. Ejemplo: <i>una casa, unos amigos</i>.",
                "Uso: <i>La maestra está en el salón</i> (determinados) · <i>Una flor crece en el jardín</i> (indeterminado)."
            ]
        },
        choice: [
            mc("¿Cuáles son los artículos determinados?", ["el, la, los, las", "un, una, unos, unas", "y, pero, aunque"],
                "Se usan para algo específico.", "Los determinados son el, la, los, las."),
            mc("En «Una flor crece en el jardín», ¿qué tipo de artículo es «una»?", ["Indeterminado", "Determinado", "Adjetivo"],
                "¿Es una flor específica?", "«Una» no habla de una flor específica: es indeterminado."),
            mc("¿Para qué sirven los artículos?", ["Acompañan al sustantivo y lo identifican como específico o no", "Describen cómo es el sustantivo", "Indican una acción"],
                "Siempre van junto a un sustantivo.", "Los artículos acompañan al sustantivo y dicen si es algo específico o no.")
        ],
        truefalse: [
            tf("«Unos» es un artículo indeterminado.", true, "Un, una, unos, unas son indeterminados."),
            tf("Los artículos determinados se usan cuando el sustantivo no es algo específico.", false, "Los determinados se refieren a algo específico."),
            tf("En «La maestra está en el salón», «la» es un artículo determinado.", true, "Habla de una maestra específica."),
            tf("«Las» es un artículo indeterminado.", false, "«Las» es determinado.")
        ],
        pairs: [
            ["Artículos determinados", "el, la, los, las"],
            ["Artículos indeterminados", "un, una, unos, unas"],
            ["Artículo", "Palabra que acompaña al sustantivo"]
        ],
        bank: [
            blank("Ayer lavaron ___ carro de mi papá. (determinado)", "el", "Es un carro específico, masculino y singular."),
            blank("Vi ___ casa nueva en mi calle. (indeterminado)", "una", "No es una casa específica; es femenino y singular."),
            blank("En el patio juegan ___ niñas de mi salón. (determinado)", "las", "Son niñas específicas, femenino y plural."),
            blank("Tengo ___ amigos en otra escuela. (indeterminado)", "unos", "No son amigos específicos; masculino y plural.")
        ]
    },
    {
        id: "sustantivos-adjetivos", campo: "lenguajes", title: "Sustantivos y adjetivos",
        card: {
            points: [
                "<b>Sustantivos:</b> nombran personas, animales, lugares, objetos, sentimientos o ideas. Ejemplos: <i>María, perro, escuela, lápiz, alegría</i>.",
                "<b>Adjetivos:</b> describen las características o cualidades de un sustantivo. Ejemplos: <i>inteligente, pequeño, hermoso, alegre</i>.",
                "<i>La mariposa amarilla vuela por el jardín</i>: sustantivo <b>mariposa</b>, adjetivo <b>amarilla</b>."
            ]
        },
        choice: [
            mc("¿Qué son los adjetivos?", ["Palabras que describen las cualidades de un sustantivo", "Palabras que nombran personas o lugares", "Palabras que unen ideas"],
                "Dicen cómo es algo.", "Los adjetivos describen características o cualidades del sustantivo."),
            mc("En «La mariposa amarilla vuela por el jardín», ¿cuál es el adjetivo?", ["amarilla", "mariposa", "jardín"],
                "¿Qué palabra dice cómo es la mariposa?", "«Amarilla» describe a la mariposa."),
            mc("¿Cuál de estas palabras es un sustantivo?", ["escuela", "alegre", "pequeño"],
                "Busca la que nombra un lugar.", "«Escuela» nombra un lugar: es un sustantivo.")
        ],
        truefalse: [
            tf("«Inteligente» es un adjetivo.", true, "Describe una cualidad."),
            tf("«Lápiz» es un adjetivo.", false, "«Lápiz» nombra un objeto: es un sustantivo."),
            tf("En «La mariposa amarilla vuela», «mariposa» es el sustantivo.", true, "Nombra al animal."),
            tf("Los sustantivos describen las cualidades de los adjetivos.", false, "Es al revés: los adjetivos describen a los sustantivos.")
        ],
        pairs: [
            ["Sustantivo", "Nombra personas, animales, lugares, objetos o ideas"],
            ["Adjetivo", "Describe las características o cualidades de un sustantivo"]
        ],
        bank: [
            blank("En «el perro pequeño», la palabra «pequeño» es un ___.", "adjetivo", "Dice cómo es el perro."),
            blank("En «la escuela grande», la palabra «escuela» es un ___.", "sustantivo", "Nombra un lugar.")
        ]
    },
    {
        id: "polisemicas", campo: "lenguajes", title: "Palabras polisémicas",
        card: {
            points: [
                "Son palabras que tienen <b>dos o más significados</b>, dependiendo del contexto en el que se utilizan.",
                "<b>Banco:</b> lugar donde guardamos dinero / asiento para descansar.",
                "<b>Planta:</b> ser vivo vegetal / parte inferior del pie.",
                "<b>Pico:</b> parte de la boca de un ave / cima de una montaña."
            ],
            remember: "Para conocer el significado de una palabra polisémica, debes leer la oración completa."
        },
        choice: [
            mc("¿Qué son las palabras polisémicas?", ["Palabras con dos o más significados según el contexto", "Palabras que significan lo contrario", "Palabras que no tienen significado"],
                "«Poli» quiere decir muchos.", "Las palabras polisémicas tienen varios significados según el contexto."),
            mc("En «Me senté en el banco del parque», ¿qué significa «banco»?", ["Asiento para descansar", "Lugar donde guardamos dinero", "Grupo de peces"],
                "¿Dónde te sientas en un parque?", "Aquí «banco» es un asiento para descansar."),
            mc("En «El águila tiene un pico curvo», ¿qué significa «pico»?", ["Parte de la boca de un ave", "Cima de una montaña", "Una herramienta"],
                "Habla de un ave.", "El pico del águila es la parte de su boca."),
            mc("¿Qué debes hacer para conocer el significado de una palabra polisémica?", ["Leer la oración completa", "Contar sus letras", "Ver solo la primera letra"],
                "El contexto te ayuda.", "Hay que leer la oración completa para saber qué significado tiene.")
        ],
        truefalse: [
            tf("«Planta» puede ser un ser vivo vegetal o la parte inferior del pie.", true, "Es una palabra polisémica."),
            tf("Una palabra polisémica tiene un solo significado.", false, "Tiene dos o más significados."),
            tf("En «Subimos al pico de la montaña», «pico» significa cima.", true, "Habla de una montaña."),
            tf("Para entender una palabra polisémica no importa el contexto.", false, "El contexto dice qué significado tiene.")
        ],
        pairs: [
            ["«Guardé mis ahorros en el banco»", "banco: lugar donde guardamos dinero"],
            ["«Descansé en un banco del parque»", "banco: asiento para descansar"],
            ["«Me lastimé la planta del pie»", "planta: parte inferior del pie"],
            ["«Regué la planta del jardín»", "planta: ser vivo vegetal"],
            ["«Escalamos hasta el pico»", "pico: cima de una montaña"]
        ],
        open: [
            abierta("¿Por qué necesitas leer la oración completa para entender una palabra polisémica?",
                [["significado", "significados", "sentido", "sentidos"], ["contexto", "oracion", "completa"]], 1,
                "Porque la palabra tiene varios significados y el contexto de la oración dice cuál es.", "Piensa en «banco»: ¿cómo sabes cuál es?")
        ]
    },
    {
        id: "prefijos", campo: "lenguajes", title: "Prefijos y sufijos",
        card: {
            points: [
                "Son elementos que se agregan a una palabra para <b>modificar su significado o formar nuevas palabras</b>.",
                "<b>Prefijos:</b> se colocan al inicio. <i>Des + ordenar = desordenar · Re + leer = releer · In + visible = invisible</i>.",
                "<b>Sufijos:</b> se colocan al final. <i>Pan + adero = panadero · Flor + ero = florero · Pequeñ + ito = pequeñito</i>."
            ],
            remember: "El prefijo va antes de la base de la palabra y el sufijo va después."
        },
        choice: [
            mc("¿Dónde se coloca un prefijo?", ["Al inicio de la palabra", "Al final de la palabra", "En medio de la palabra"],
                "«Pre» significa antes.", "El prefijo va antes de la base de la palabra."),
            mc("¿Qué palabra se forma con «pan + adero»?", ["panadero", "empanada", "panes"],
                "Es la persona que hace pan.", "Pan + adero = panadero."),
            mc("En «invisible», ¿cuál es el prefijo?", ["in", "visi", "ble"],
                "Busca lo que se agregó al inicio de «visible».", "In + visible = invisible: «in» es el prefijo."),
            mc("¿Cuál de estas palabras tiene un sufijo?", ["florero", "releer", "desordenar"],
                "Busca la que tiene algo agregado al final.", "Flor + ero = florero: «ero» es un sufijo.")
        ],
        truefalse: [
            tf("El sufijo va después de la base de la palabra.", true, "Los sufijos se colocan al final."),
            tf("En «releer», «re» es un sufijo.", false, "«Re» está al inicio: es un prefijo."),
            tf("«Pequeñito» se forma con el sufijo «ito».", true, "Pequeñ + ito = pequeñito."),
            tf("Los prefijos y sufijos sirven para formar palabras nuevas.", true, "Modifican el significado o forman palabras nuevas.")
        ],
        pairs: [
            ["Des + ordenar", "desordenar"],
            ["Re + leer", "releer"],
            ["In + visible", "invisible"],
            ["Pan + adero", "panadero"],
            ["Flor + ero", "florero"],
            ["Pequeñ + ito", "pequeñito"]
        ],
        bank: [
            blank("___ + ordenar = desordenar", "des", "Se agrega al inicio."),
            blank("___ + leer = releer", "re", "Significa volver a hacer algo."),
            blank("___ + visible = invisible", "in", "Significa «no»."),
            blank("Pan + ___ = panadero", "adero", "Se agrega al final."),
            blank("Flor + ___ = florero", "ero", "Se agrega al final."),
            blank("Pequeñ + ___ = pequeñito", "ito", "Hace la palabra más pequeña.")
        ]
    },

    // ---------- Saberes y pensamiento científico ----------
    {
        id: "huella", campo: "saberes", title: "Huella hídrica y agua virtual",
        card: {
            points: [
                "El agua es indispensable para la vida y también se necesita para fabricar productos y producir alimentos.",
                "<b>Huella hídrica:</b> cantidad total de agua que se usa de manera directa e indirecta. Ejemplo: el agua al bañarnos y la de los productos que consumimos.",
                "<b>Agua virtual:</b> agua que se necesita para producir alimentos, ropa y otros objetos, aunque no la veamos. Ejemplo: cultivar una manzana o fabricar una camiseta.",
                "Desperdiciar alimentos es desperdiciar agua, porque se usó agua para producirlos.",
                "Para reducirla: cerrar las llaves al cepillarnos, reparar fugas y reutilizar agua, comprar solo lo necesario y no desperdiciar comida."
            ]
        },
        choice: [
            mc("¿Qué es la huella hídrica?", ["El agua total que usamos de manera directa e indirecta", "El agua que cae cuando llueve", "El agua de los océanos"],
                "Incluye el agua que vemos y la que no vemos.", "La huella hídrica es el agua usada de manera directa e indirecta para actividades y productos."),
            mc("¿Qué es el agua virtual?", ["El agua necesaria para producir alimentos, ropa y objetos", "El agua que vemos en una pantalla", "El agua que tomamos"],
                "No la vemos en el producto final.", "El agua virtual es la que se usa para producir un bien."),
            mc("¿Cuál es un ejemplo de agua virtual?", ["El agua para cultivar una manzana", "El agua de la regadera", "El agua de un vaso"],
                "Busca el agua que se usa para producir algo.", "Para cultivar una manzana se necesita agua que no vemos en la fruta."),
            mc("¿Qué acción reduce nuestra huella hídrica?", ["Cerrar la llave al cepillarnos los dientes", "Dejar la manguera abierta", "Tirar la comida que sobra"],
                "Piensa en no desperdiciar.", "Cerrar las llaves ahorra agua.")
        ],
        truefalse: [
            tf("Desperdiciar alimentos también significa desperdiciar agua.", true, "Para producir los alimentos se usó agua."),
            tf("El agua virtual se ve en el producto final.", false, "El agua virtual no la vemos en el producto final."),
            tf("Reparar fugas ayuda a reducir la huella hídrica.", true, "Así se desperdicia menos agua."),
            tf("La huella hídrica solo incluye el agua que tomamos.", false, "Incluye el agua directa e indirecta."),
            tf("Para fabricar una camiseta se necesita agua.", true, "Es un ejemplo de agua virtual.")
        ],
        pairs: [
            ["Huella hídrica", "Agua usada de manera directa e indirecta"],
            ["Agua virtual", "Agua usada para producir un bien"],
            ["Uso directo del agua", "El agua que usamos al bañarnos"]
        ],
        bank: [
            blank("El agua que se necesita para fabricar una camiseta es agua ___.", "virtual", "No la vemos en la camiseta."),
            blank("La huella ___ incluye el agua usada de manera directa e indirecta.", "hídrica", "Hídrica viene de agua.")
        ],
        open: [
            abierta("¿Por qué desperdiciar alimentos también significa desperdiciar agua?",
                [["agua"], ["producir", "producirlos", "producirla", "cultivo", "cultivar", "cultivarlos", "elaborar", "elaboracion", "procesamiento", "limpieza", "sembrar"]], 2,
                "Porque para producir los alimentos se usó agua en su cultivo, limpieza, procesamiento o elaboración.", "¿Qué se necesitó para cultivar esos alimentos?"),
            abierta("Escribe dos acciones para reducir tu huella hídrica.",
                [["llave", "llaves"], ["fuga", "fugas"], ["reutilizar", "reutilizo", "reutilizando"], ["comprar", "compras", "necesitamos", "necesario"], ["desperdiciar", "desperdicio", "comida", "alimentos"], ["cubeta", "cubetas"]], 2,
                "Cerrar las llaves mientras nos cepillamos los dientes y reparar las fugas.", "Piensa en las llaves, las fugas o la comida.")
        ]
    },
    {
        id: "contaminacion", campo: "saberes", title: "Contaminación del agua, aire y suelo",
        card: {
            points: [
                "La contaminación ocurre cuando se introducen sustancias o residuos que alteran el ambiente y pueden perjudicar a los seres vivos.",
                "<b>Agua:</b> basura, aceites, aguas residuales y químicos en ríos y lagos → muerte de organismos acuáticos y enfermedades.",
                "<b>Aire:</b> humo de automóviles, fábricas, incendios y quema de basura → irritación de ojos y nariz, tos y enfermedades respiratorias.",
                "<b>Suelo:</b> basura, derrames de aceite, plásticos y exceso de pesticidas → pérdida de fertilidad y daño a plantas, animales y cultivos.",
                "Los tres se relacionan: la lluvia arrastra la basura del suelo a los ríos y quemar residuos contamina el aire."
            ],
            remember: "La contaminación afecta a la naturaleza y a las personas, porque todos dependemos del agua, el aire y el suelo."
        },
        choice: [
            mc("¿Cuándo ocurre la contaminación?", ["Cuando entran sustancias o residuos que alteran el ambiente", "Cuando llueve mucho", "Cuando plantamos árboles"],
                "Piensa en lo que daña el ambiente.", "Hay contaminación cuando se introducen sustancias o residuos que alteran el ambiente."),
            mc("¿Cuál es una causa de la contaminación del aire?", ["El humo de automóviles y fábricas", "Plantar árboles", "Separar la basura"],
                "Algo que sale por un escape o una chimenea.", "El humo de autos, fábricas e incendios contamina el aire."),
            mc("¿Cuál es una consecuencia de la contaminación del agua?", ["La muerte de organismos acuáticos", "Un aire más limpio", "Suelos más fértiles"],
                "Piensa en los peces.", "El agua contaminada daña a los organismos acuáticos."),
            mc("¿Cuál es una consecuencia de la contaminación del suelo?", ["Pérdida de fertilidad y daño a los cultivos", "Más peces en los ríos", "Menos basura"],
                "Piensa en las plantas que crecen en la tierra.", "El suelo contaminado pierde fertilidad y daña plantas, animales y cultivos.")
        ],
        truefalse: [
            tf("La contaminación siempre se queda en un solo lugar.", false, "La lluvia puede llevarla del suelo a los ríos."),
            tf("La lluvia puede arrastrar la basura del suelo hacia los ríos.", true, "Así se relacionan los tipos de contaminación."),
            tf("Quemar residuos libera gases que contaminan el aire.", true, "Los gases y partículas contaminan el aire."),
            tf("El uso excesivo de pesticidas contamina el suelo.", true, "Es una de sus causas."),
            tf("La contaminación solo afecta a la naturaleza, no a las personas.", false, "También daña a las personas.")
        ],
        pairs: [
            ["Contaminación del agua", "Aguas residuales y aceites en ríos y lagos"],
            ["Contaminación del aire", "Humo de automóviles, fábricas e incendios"],
            ["Contaminación del suelo", "Plásticos, derrames de aceite y pesticidas"]
        ],
        open: [
            abierta("¿Cómo se relacionan los tres tipos de contaminación? Da un ejemplo.",
                [["lluvia", "arrastra", "arrastrar", "arrastran", "rio", "rios"], ["quema", "quemar", "queman", "gases", "humo", "aire"]], 1,
                "La lluvia puede arrastrar la basura del suelo hacia los ríos, y si se queman residuos se contamina el aire.", "Piensa en lo que hace la lluvia con la basura.")
        ]
    },
    {
        id: "respiratorio", campo: "saberes", title: "Sistema respiratorio",
        card: {
            points: [
                "Permite obtener el oxígeno que el cuerpo necesita y eliminar el dióxido de carbono.",
                "<b>Nariz:</b> deja entrar el aire, lo filtra, humedece y calienta. <b>Tráquea:</b> conduce el aire a los bronquios.",
                "<b>Bronquios:</b> distribuyen el aire a cada pulmón. <b>Pulmones:</b> tienen los alvéolos, donde el oxígeno pasa a la sangre.",
                "<b>Diafragma:</b> músculo que ayuda a realizar los movimientos respiratorios.",
                "El aire contaminado irrita las vías respiratorias y provoca tos, dificultad para respirar y enfermedades."
            ]
        },
        choice: [
            mc("¿Para qué sirve el sistema respiratorio?", ["Para obtener oxígeno y eliminar dióxido de carbono", "Para bombear la sangre", "Para digerir los alimentos"],
                "Piensa en lo que pasa cuando respiras.", "El sistema respiratorio obtiene oxígeno y elimina dióxido de carbono."),
            mc("¿Qué órgano filtra, humedece y calienta el aire?", ["La nariz", "El corazón", "El diafragma"],
                "Es por donde entra el aire.", "La nariz deja entrar el aire, lo filtra, humedece y calienta."),
            mc("¿Dónde pasa el oxígeno a la sangre?", ["En los alvéolos de los pulmones", "En la tráquea", "En la nariz"],
                "Son pequeñas partes dentro de los pulmones.", "En los alvéolos el oxígeno pasa a la sangre."),
            mc("¿Qué es el diafragma?", ["Un músculo que ayuda a respirar", "Un vaso sanguíneo", "Una parte de la nariz"],
                "Se mueve cuando respiras.", "El diafragma es el músculo de los movimientos respiratorios.")
        ],
        truefalse: [
            tf("La tráquea conduce el aire hacia los bronquios.", true, "Es su función."),
            tf("Los bronquios bombean la sangre.", false, "Los bronquios distribuyen el aire a los pulmones; el corazón bombea la sangre."),
            tf("Respirar aire contaminado puede provocar tos y dificultad para respirar.", true, "Las partículas irritan las vías respiratorias."),
            tf("Los pulmones contienen los alvéolos.", true, "Ahí se intercambian los gases.")
        ],
        pairs: [
            ["Nariz", "Deja entrar el aire, lo filtra, humedece y calienta"],
            ["Tráquea", "Conduce el aire hacia los bronquios"],
            ["Bronquios", "Distribuyen el aire hacia cada pulmón"],
            ["Pulmones", "Tienen los alvéolos, donde el oxígeno pasa a la sangre"],
            ["Diafragma", "Músculo que ayuda a los movimientos respiratorios"]
        ],
        bank: [
            blank("La ___ conduce el aire hacia los bronquios.", "tráquea", "Es un tubo entre la garganta y los bronquios."),
            blank("Los ___ distribuyen el aire hacia cada pulmón.", "bronquios", "Se dividen hacia los dos pulmones."),
            blank("En los ___ el oxígeno pasa a la sangre.", "alvéolos", "Están dentro de los pulmones."),
            blank("El ___ es el músculo que ayuda a respirar.", "diafragma", "Está debajo de los pulmones.")
        ],
        open: [
            abierta("¿Qué sucede cuando respiramos aire contaminado?",
                [["irritar", "irrita", "irritan", "irritacion", "tos", "dificultad", "enfermedad", "enfermedades", "enfermarnos", "danar", "dana"]], 1,
                "Las sustancias contaminantes irritan las vías respiratorias y provocan tos, dificultad para respirar y enfermedades.", "Piensa en cómo se sienten la nariz y la garganta con humo.")
        ]
    },
    {
        id: "circulatorio", campo: "saberes", title: "Sistema circulatorio",
        card: {
            points: [
                "Transporta sangre, oxígeno, nutrientes y otras sustancias por todo el cuerpo.",
                "<b>Corazón:</b> bombea la sangre. <b>Arterias:</b> llevan la sangre del corazón a los órganos. <b>Venas:</b> regresan la sangre al corazón.",
                "<b>Capilares:</b> vasos muy pequeños donde se intercambian oxígeno, nutrientes y desechos con los tejidos. <b>Sangre:</b> transporta oxígeno, nutrientes y desechos.",
                "Juntos: el oxígeno entra por la nariz y llega a los pulmones, pasa a la sangre y el corazón lo impulsa a todo el cuerpo; las células producen dióxido de carbono que regresa a los pulmones.",
                "Con el ejercicio respiramos más rápido y el corazón late más fuerte porque los músculos necesitan más oxígeno y energía."
            ]
        },
        choice: [
            mc("¿Qué hace el sistema circulatorio?", ["Transporta sangre, oxígeno y nutrientes por el cuerpo", "Filtra el aire", "Produce la voz"],
                "Piensa en la sangre.", "El sistema circulatorio transporta sangre, oxígeno y nutrientes."),
            mc("¿Qué hacen las arterias?", ["Llevan la sangre del corazón a los órganos", "Regresan la sangre al corazón", "Llevan aire a los pulmones"],
                "Salen del corazón.", "Las arterias llevan la sangre desde el corazón hacia los órganos."),
            mc("¿Qué hacen las venas?", ["Regresan la sangre al corazón", "Bombean la sangre", "Filtran el aire"],
                "Van de regreso.", "Las venas regresan la sangre al corazón."),
            mc("¿Por qué el corazón late más fuerte cuando hacemos ejercicio?", ["Porque los músculos necesitan más oxígeno y energía", "Porque necesitamos menos sangre", "Porque dejamos de respirar"],
                "¿Qué necesitan los músculos al moverse?", "Los músculos necesitan más oxígeno y energía, y el corazón envía más sangre.")
        ],
        truefalse: [
            tf("El corazón bombea la sangre para que circule por el cuerpo.", true, "Es su función."),
            tf("Las venas llevan la sangre desde el corazón hacia los órganos.", false, "Eso lo hacen las arterias; las venas la regresan al corazón."),
            tf("La sangre transporta oxígeno, nutrientes y sustancias de desecho.", true, "Es lo que lleva por el cuerpo."),
            tf("Los sistemas respiratorio y circulatorio trabajan juntos.", true, "El oxígeno de los pulmones viaja en la sangre."),
            tf("Las células producen oxígeno y lo envían a los pulmones.", false, "Las células usan el oxígeno y producen dióxido de carbono.")
        ],
        pairs: [
            ["Corazón", "Bombea la sangre para que circule"],
            ["Arterias", "Llevan la sangre del corazón hacia los órganos"],
            ["Venas", "Regresan la sangre al corazón"],
            ["Capilares", "Vasos muy pequeños donde se intercambian sustancias"],
            ["Sangre", "Transporta oxígeno, nutrientes y desechos"]
        ],
        bank: [
            blank("El ___ bombea la sangre por todo el cuerpo.", "corazón", "Late en tu pecho."),
            blank("Las ___ regresan la sangre al corazón.", "venas", "Van de regreso."),
            blank("Las ___ llevan la sangre del corazón hacia los órganos.", "arterias", "Salen del corazón."),
            blank("Los ___ son vasos sanguíneos muy pequeños.", "capilares", "Son los más delgados.")
        ],
        open: [
            abierta("¿Cómo trabajan juntos los sistemas respiratorio y circulatorio?",
                [["oxigeno"], ["sangre", "corazon"]], 2,
                "El oxígeno entra por la nariz y llega a los pulmones; pasa a la sangre y el corazón la impulsa a todo el cuerpo.", "Sigue el camino del oxígeno desde la nariz."),
            abierta("¿Por qué respiramos más rápido cuando hacemos ejercicio?",
                [["oxigeno", "energia", "aire"], ["musculo", "musculos", "cuerpo"]], 2,
                "Porque nuestros músculos necesitan más oxígeno y energía.", "¿Qué necesitan los músculos?")
        ]
    },
    {
        id: "impacto", campo: "saberes", title: "El impacto de nuestras acciones en el ambiente y la salud",
        card: {
            points: [
                "Las actividades humanas pueden alterar el equilibrio de los ecosistemas y afectar nuestra salud.",
                "Ejemplo: en una comunidad agrícola se usan demasiados pesticidas y se queman residuos de los cultivos.",
                "<b>Ambiente:</b> los pesticidas contaminan el suelo y llegan a los ríos. <b>Salud:</b> el humo irrita y daña el sistema respiratorio.",
                "<b>Relación entre sistemas:</b> el respiratorio intercambia gases y el circulatorio lleva oxígeno a las células; por eso hay que cuidar el aire."
            ],
            remember: "Los problemas ambientales también perjudican la salud y la calidad de vida de las personas."
        },
        choice: [
            mc("¿Qué puede pasar si se usan demasiados pesticidas?", ["Contaminan el suelo y llegan a los ríos", "El agua se vuelve más limpia", "No pasa nada"],
                "Piensa en dónde terminan los pesticidas.", "Los pesticidas pueden contaminar el suelo y llegar a los ríos."),
            mc("¿Qué daño causa el humo de quemar residuos?", ["Irrita y daña el sistema respiratorio", "Fortalece los pulmones", "Limpia el aire"],
                "¿Qué pasa al respirar humo?", "El humo irrita y daña el sistema respiratorio."),
            mc("¿Por qué cuidar el aire es importante para el cuerpo?", ["Porque respiramos ese aire y la sangre lleva su oxígeno a las células", "Porque el aire no entra al cuerpo", "Porque solo afecta a las plantas"],
                "Piensa en los dos sistemas que trabajan juntos.", "El respiratorio intercambia gases y el circulatorio lleva el oxígeno a las células.")
        ],
        truefalse: [
            tf("Las actividades humanas pueden alterar el equilibrio de los ecosistemas.", true, "Por ejemplo, con pesticidas o quemas."),
            tf("Los problemas ambientales solo afectan a plantas y animales.", false, "También afectan la salud de las personas."),
            tf("Algunas sustancias contaminantes pueden entrar al organismo y afectar otros órganos.", true, "Pueden afectar otros órganos y sistemas.")
        ],
        pairs: [
            ["Consecuencia ambiental", "Los pesticidas contaminan el suelo y los ríos"],
            ["Consecuencia para la salud", "El humo irrita el sistema respiratorio"],
            ["Relación entre sistemas", "El aire limpio ayuda a respirar y a llevar oxígeno a las células"]
        ],
        open: [
            abierta("Da un ejemplo de cómo una acción humana afecta al ambiente y a la salud.",
                [["pesticida", "pesticidas", "humo", "quemar", "quema", "basura", "contamina", "contaminar", "contaminacion", "residuos"], ["salud", "respirar", "respiratorio", "enfermedad", "enfermedades", "tos", "cuerpo", "personas"]], 2,
                "Quemar residuos contamina el aire y el humo daña el sistema respiratorio de las personas.", "Piensa en el ejemplo de la comunidad agrícola.")
        ]
    },
    {
        id: "acciones", campo: "saberes", title: "Acciones para cuidar el ambiente",
        card: {
            points: [
                "<b>Desperdicio de agua:</b> cerrar llaves, reparar fugas y usar cubetas en lugar de mangueras.",
                "<b>Desperdicio de alimentos:</b> planear las compras y aprovechar los alimentos antes de que se echen a perder.",
                "<b>Basura en calles y ríos:</b> separar residuos, depositarlos bien y organizar jornadas de limpieza.",
                "<b>Contaminación del aire:</b> evitar quemar basura, compartir transporte y caminar cuando sea posible.",
                "<b>Desconocimiento sobre la salud:</b> organizar campañas informativas sobre los sistemas respiratorio y circulatorio."
            ]
        },
        choice: [
            mc("¿Qué acción ayuda contra el desperdicio de agua?", ["Cerrar llaves, reparar fugas y usar cubetas", "Lavar el carro con la manguera abierta", "Dejar la llave goteando"],
                "Piensa en usar solo el agua necesaria.", "Cerrar llaves, reparar fugas y usar cubetas ahorra agua."),
            mc("¿Qué acción ayuda contra el desperdicio de alimentos?", ["Planear las compras", "Comprar de más", "Tirar la comida que sobra"],
                "Piensa antes de comprar.", "Planear las compras y aprovechar los alimentos evita desperdiciarlos."),
            mc("¿Qué podemos hacer contra la basura en calles y ríos?", ["Separar residuos y organizar jornadas de limpieza", "Tirarla al río", "Quemarla"],
                "Busca la acción que limpia.", "Separar residuos y organizar limpiezas ayuda."),
            mc("¿Qué ayuda a reducir la contaminación del aire?", ["Evitar quemar basura y compartir transporte", "Usar el carro para todo", "Quemar hojas secas"],
                "Piensa en menos humo.", "Evitar quemas, compartir transporte y caminar reducen el humo.")
        ],
        truefalse: [
            tf("Organizar campañas informativas ayuda a cuidar la salud.", true, "Así más personas conocen cómo cuidar su cuerpo."),
            tf("Quemar basura es una buena forma de deshacernos de ella.", false, "Quemar basura contamina el aire."),
            tf("Compartir transporte ayuda a reducir la contaminación del aire.", true, "Hay menos autos echando humo.")
        ],
        pairs: [
            ["Desperdicio de agua", "Cerrar llaves y reparar fugas"],
            ["Desperdicio de alimentos", "Planear las compras"],
            ["Basura en calles y ríos", "Separar residuos y organizar jornadas de limpieza"],
            ["Contaminación del aire", "Evitar quemar basura y compartir transporte"],
            ["Desconocimiento sobre la salud", "Organizar campañas informativas"]
        ]
    },

    // ---------- Ética, naturaleza y sociedades ----------
    {
        id: "sustentabilidad", campo: "etica", title: "Sustentabilidad y las 5 R",
        card: {
            points: [
                "<b>Sustentabilidad:</b> satisfacer nuestras necesidades usando responsablemente los recursos naturales, sin quitar a las futuras generaciones la posibilidad de satisfacer las suyas.",
                "Busca un equilibrio entre el cuidado del medioambiente, el bienestar de las personas y el desarrollo económico.",
                "<b>Reducir:</b> consumir menos y generar menos residuos. <b>Reutilizar:</b> volver a usar un objeto sin transformarlo.",
                "<b>Reciclar:</b> transformar materiales usados en productos nuevos. <b>Reparar:</b> arreglar objetos para seguir usándolos.",
                "<b>Rechazar:</b> evitar productos que generan residuos innecesarios (popotes, bolsas desechables)."
            ],
            remember: "Las 5 R ayudan a disminuir la basura, ahorrar recursos naturales y reducir la contaminación."
        },
        choice: [
            mc("¿Qué es la sustentabilidad?", ["Usar responsablemente los recursos sin afectar a las futuras generaciones", "Usar todos los recursos lo más rápido posible", "Comprar muchos productos nuevos"],
                "Piensa en el futuro.", "Sustentabilidad es satisfacer nuestras necesidades sin comprometer las de las futuras generaciones."),
            mc("Usar las hojas de papel por ambos lados es un ejemplo de…", ["Reutilizar", "Reciclar", "Rechazar"],
                "Se usa otra vez sin transformarla.", "Usar la hoja otra vez sin transformarla es reutilizar."),
            mc("No aceptar popotes ni bolsas desechables es un ejemplo de…", ["Rechazar", "Reparar", "Reciclar"],
                "Dices «no, gracias».", "Evitar productos que generan residuos innecesarios es rechazar."),
            mc("¿Qué significa reciclar?", ["Transformar materiales usados en productos nuevos", "Volver a usar un objeto sin cambiarlo", "Arreglar un objeto"],
                "El material se transforma.", "Reciclar es transformar materiales usados para fabricar productos nuevos.")
        ],
        truefalse: [
            tf("Reparar una mochila en lugar de tirarla es un ejemplo de «reparar».", true, "Se arregla para seguir usándola."),
            tf("Reutilizar es transformar materiales para fabricar productos nuevos.", false, "Eso es reciclar; reutilizar es volver a usar sin transformar."),
            tf("Las 5 R ayudan a disminuir la basura y a ahorrar recursos.", true, "También reducen la contaminación."),
            tf("Reducir significa comprar más productos.", false, "Reducir es disminuir nuestro consumo y nuestros residuos.")
        ],
        pairs: [
            ["Reducir", "Disminuir el consumo y la basura que generamos"],
            ["Reutilizar", "Volver a usar un objeto sin transformarlo"],
            ["Reciclar", "Transformar materiales usados en productos nuevos"],
            ["Reparar", "Arreglar objetos para seguir usándolos"],
            ["Rechazar", "Evitar productos que generan residuos innecesarios"]
        ],
        bank: [
            blank("Volver a usar un objeto sin transformarlo se llama ___.", "reutilizar", "Lo usas otra vez tal como está.")
        ],
        open: [
            abierta("¿Por qué es importante la sustentabilidad?",
                [["recursos", "recurso", "agua", "naturaleza"], ["futuras", "generaciones", "futuro", "vida"]], 1,
                "Porque los recursos naturales son indispensables para la vida; si los desperdiciamos, las futuras generaciones tendrán problemas.", "Piensa en las personas del futuro.")
        ]
    },
    {
        id: "energias", campo: "etica", title: "Energías renovables y no renovables",
        card: {
            points: [
                "<b>Renovables:</b> vienen de fuentes naturales que se reponen, como el sol y el viento.",
                "<b>No renovables:</b> recursos limitados que tardan millones de años en formarse: petróleo, carbón y gas natural.",
                "<b>Solar:</b> radiación del Sol (paneles solares). <b>Eólica:</b> fuerza del viento (aerogeneradores).",
                "<b>Hidráulica:</b> movimiento o caída del agua. <b>Geotérmica:</b> calor del interior de la Tierra.",
                "Beneficios: menos dependencia de combustibles fósiles, menos gases de efecto invernadero y menos contaminación del aire."
            ],
            remember: "Las renovables también tienen impactos, pero usarlas con responsabilidad disminuye muchos problemas de los combustibles fósiles."
        },
        choice: [
            mc("¿Qué son las energías renovables?", ["Las que vienen de fuentes naturales que se reponen", "Las que tardan millones de años en formarse", "Las que se acaban pronto"],
                "Piensa en el sol y el viento.", "Las renovables vienen de fuentes que se reponen continuamente."),
            mc("¿Cuál es una energía no renovable?", ["El petróleo", "El viento", "El sol"],
                "Tarda millones de años en formarse.", "El petróleo es un recurso limitado: no renovable."),
            mc("¿Qué energía usa la fuerza del viento?", ["Eólica", "Solar", "Geotérmica"],
                "Mueve aerogeneradores.", "La energía eólica usa el viento."),
            mc("¿Qué energía aprovecha el calor del interior de la Tierra?", ["Geotérmica", "Hidráulica", "Eólica"],
                "«Geo» significa Tierra.", "La geotérmica usa el calor del interior de la Tierra."),
            mc("¿Qué energía aprovecha el movimiento o la caída del agua?", ["Hidráulica", "Solar", "Geotérmica"],
                "Piensa en una presa.", "La energía hidráulica aprovecha el agua en movimiento.")
        ],
        truefalse: [
            tf("Las energías renovables ayudan a disminuir la contaminación del aire.", true, "Es uno de sus beneficios."),
            tf("El carbón es una energía renovable.", false, "El carbón es no renovable."),
            tf("La energía solar produce electricidad con paneles solares.", true, "Aprovecha la radiación del Sol."),
            tf("Las energías renovables no tienen ningún impacto ambiental.", false, "También pueden tener impactos, aunque menores.")
        ],
        pairs: [
            ["Energía solar", "Aprovecha la radiación del Sol"],
            ["Energía eólica", "Usa la fuerza del viento"],
            ["Energía hidráulica", "Aprovecha el movimiento o la caída del agua"],
            ["Energía geotérmica", "Usa el calor del interior de la Tierra"],
            ["Energías no renovables", "Petróleo, carbón y gas natural"]
        ],
        bank: [
            blank("La energía ___ usa la fuerza del viento.", "eólica", "Mueve aerogeneradores."),
            blank("La energía ___ aprovecha la radiación del Sol.", "solar", "Usa paneles."),
            blank("La energía ___ usa el calor del interior de la Tierra.", "geotérmica", "«Geo» es Tierra."),
            blank("La energía ___ aprovecha la caída del agua.", "hidráulica", "Piensa en una presa.")
        ]
    },
    {
        id: "esferas", campo: "etica", title: "Las capas de la Tierra",
        card: {
            points: [
                "<b>Atmósfera:</b> capa de gases que rodea la Tierra (nitrógeno y oxígeno); contiene el aire y regula la temperatura.",
                "<b>Hidrosfera:</b> toda el agua del planeta, líquida, sólida y gaseosa; indispensable para los seres vivos.",
                "<b>Litosfera:</b> parte sólida de rocas y minerales; da soporte y muchos recursos naturales.",
                "<b>Biosfera:</b> los seres vivos y las regiones donde existe vida, con sus relaciones con el ambiente.",
                "Cuidar la atmósfera: usar bien la electricidad, preferir energías renovables, no quemar basura, usar menos el auto y que las industrias controlen sus emisiones."
            ],
            remember: "No confundas estas cuatro esferas con las capas internas de la Tierra (corteza, manto y núcleo) ni con las capas de la atmósfera."
        },
        choice: [
            mc("¿Qué es la atmósfera?", ["La capa de gases que rodea la Tierra", "Toda el agua del planeta", "La parte sólida de la Tierra"],
                "Contiene el aire.", "La atmósfera es la capa de gases que rodea la Tierra."),
            mc("¿Qué esfera incluye toda el agua del planeta?", ["Hidrosfera", "Litosfera", "Biosfera"],
                "«Hidro» significa agua.", "La hidrosfera es toda el agua del planeta."),
            mc("¿Qué es la litosfera?", ["La parte sólida de rocas y minerales", "La capa de gases", "Los seres vivos"],
                "«Lito» significa piedra.", "La litosfera es la parte sólida de la Tierra."),
            mc("¿Qué es la biosfera?", ["Los seres vivos y las regiones donde existe vida", "El agua salada", "El núcleo de la Tierra"],
                "«Bio» significa vida.", "La biosfera son los seres vivos y donde viven."),
            mc("¿Qué gases forman principalmente la atmósfera?", ["Nitrógeno y oxígeno", "Solo dióxido de carbono", "Helio e hidrógeno"],
                "Uno de ellos lo respiramos.", "La atmósfera tiene principalmente nitrógeno y oxígeno.")
        ],
        truefalse: [
            tf("La atmósfera ayuda a regular la temperatura.", true, "Es parte de su importancia."),
            tf("La hidrosfera incluye agua líquida, sólida y gaseosa.", true, "Es toda el agua del planeta."),
            tf("Las cuatro esferas son lo mismo que la corteza, el manto y el núcleo.", false, "Esas son las capas internas de la Tierra."),
            tf("El aumento del dióxido de carbono contribuye al calentamiento global.", true, "Es un gas de efecto invernadero."),
            tf("Quemar basura ayuda a proteger la atmósfera.", false, "Quemar basura la contamina.")
        ],
        pairs: [
            ["Atmósfera", "Capa de gases que rodea la Tierra"],
            ["Hidrosfera", "Toda el agua del planeta"],
            ["Litosfera", "Parte sólida de rocas y minerales"],
            ["Biosfera", "Seres vivos y regiones donde existe vida"]
        ],
        open: [
            abierta("Escribe dos formas de proteger la atmósfera.",
                [["electricidad", "luz"], ["renovable", "renovables", "solar", "eolica"], ["quemar", "basura"], ["automovil", "automoviles", "carro", "carros", "auto", "autos", "coche", "caminar", "bicicleta"], ["industrias", "emisiones", "fabricas"]], 2,
                "Evitar quemar basura y usar menos el automóvil.", "Piensa en el humo y la electricidad.")
        ]
    },
    {
        id: "independencia", campo: "etica", title: "Independencia de México",
        card: {
            points: [
                "Movimiento político, social y militar que buscó terminar con el dominio español sobre la Nueva España y conseguir un gobierno independiente.",
                "Causas: desigualdades del Virreinato, los peninsulares tenían los cargos de gobierno, diferencias de derechos, pobreza e ideas de libertad e igualdad.",
                "<b>Miguel Hidalgo y Costilla:</b> convocó al levantamiento del 16 de septiembre de 1810 (Grito de Dolores). <b>Josefa Ortiz de Domínguez:</b> conspiración de Querétaro; avisó que los planes fueron descubiertos.",
                "<b>José María Morelos y Pavón:</b> Sentimientos de la Nación (Congreso de Chilpancingo, 1813). <b>Vicente Guerrero:</b> mantuvo la resistencia y ayudó a consumarla.",
                "1821: el Ejército Trigarante entra a la Ciudad de México el 27 de septiembre y se consuma la Independencia."
            ],
            remember: "La lucha comenzó en 1810 y se consumó en 1821, después de once años."
        },
        choice: [
            mc("¿Qué buscaba la Independencia de México?", ["Terminar con el dominio español y tener un gobierno independiente", "Conquistar España", "Fundar la Ciudad de México"],
                "Piensa en quién gobernaba la Nueva España.", "Buscaba terminar con el dominio español."),
            mc("¿Quién convocó al levantamiento del 16 de septiembre de 1810?", ["Miguel Hidalgo y Costilla", "Vicente Guerrero", "José María Morelos"],
                "Es el Grito de Dolores.", "Miguel Hidalgo convocó al Grito de Dolores."),
            mc("¿Quién avisó que los planes de la conspiración de Querétaro habían sido descubiertos?", ["Josefa Ortiz de Domínguez", "Miguel Hidalgo", "Vicente Guerrero"],
                "Fue una mujer.", "Josefa Ortiz de Domínguez advirtió a los insurgentes."),
            mc("¿Quién presentó «Sentimientos de la Nación»?", ["José María Morelos y Pavón", "Josefa Ortiz de Domínguez", "Miguel Hidalgo"],
                "Fue en el Congreso de Chilpancingo.", "Morelos presentó Sentimientos de la Nación en 1813."),
            mc("¿En qué año se consumó la Independencia?", ["1821", "1810", "1813"],
                "Once años después de 1810.", "La Independencia se consumó en 1821.")
        ],
        truefalse: [
            tf("La lucha por la Independencia duró once años.", true, "De 1810 a 1821."),
            tf("El Ejército Trigarante entró a la Ciudad de México el 27 de septiembre de 1821.", true, "Así se consumó la Independencia."),
            tf("Vicente Guerrero mantuvo activa la resistencia insurgente.", true, "Y participó en la consumación."),
            tf("Durante el Virreinato todos tenían los mismos derechos.", false, "Había desigualdades y diferencias de derechos."),
            tf("El Congreso de Chilpancingo fue en 1810.", false, "Fue en 1813.")
        ],
        pairs: [
            ["Miguel Hidalgo y Costilla", "Convocó al Grito de Dolores en 1810"],
            ["Josefa Ortiz de Domínguez", "Participó en la conspiración de Querétaro"],
            ["José María Morelos y Pavón", "Presentó Sentimientos de la Nación"],
            ["Vicente Guerrero", "Mantuvo activa la resistencia insurgente"],
            ["1821", "Consumación de la Independencia"],
            ["1813", "Congreso de Chilpancingo"]
        ],
        bank: [
            blank("La Independencia comenzó en ___.", "1810", "Fue el Grito de Dolores."),
            blank("El Congreso de Chilpancingo fue en ___.", "1813", "Morelos presentó Sentimientos de la Nación."),
            blank("La Independencia se consumó en ___.", "1821", "Once años después de que comenzó."),
            blank("El Ejército ___ entró a la Ciudad de México el 27 de septiembre de 1821.", "Trigarante", "Su nombre viene de tres garantías.")
        ],
        open: [
            abierta("¿Por qué fue importante la Independencia?",
                [["depender", "dependiera", "independiente", "independencia", "espana", "libre", "nacion"], ["leyes", "instituciones", "gobierno", "camino", "propias"]], 1,
                "Porque México dejó de depender de España y pudo construir sus propias leyes e instituciones.", "Piensa en quién mandaba antes y después."),
            abierta("¿Por qué comenzó la Independencia?",
                [["desigualdad", "desigualdades", "diferencias", "derechos", "injusticia", "injusticias"], ["pobreza", "libertad", "igualdad", "gobierno", "espanoles", "peninsulares", "cargos"]], 1,
                "Porque había desigualdades: los españoles peninsulares tenían los cargos de gobierno y gran parte de la población vivía en pobreza.", "Piensa en cómo vivía la gente en el Virreinato.")
        ]
    },

    // ---------- De lo humano y lo comunitario ----------
    {
        id: "escucha", campo: "humano", title: "Escuchar activamente",
        card: {
            points: [
                "<b>Escuchar activamente:</b> prestar atención completa a quien habla, sin interrupciones y con interés genuino.",
                "<b>Contacto visual:</b> mirar a quien habla demuestra interés y respeto.",
                "<b>Resumir y aclarar:</b> repetir lo que entendiste confirma que el mensaje llegó bien. <b>Evitar interrumpir:</b> dejar que termine su idea.",
                "Importancia: permite comprender mejor las ideas de los demás y tomar decisiones que benefician a todo el grupo."
            ]
        },
        choice: [
            mc("¿Qué significa escuchar activamente?", ["Prestar atención completa a quien habla, sin interrumpir", "Oír mientras hacemos otra cosa", "Hablar al mismo tiempo"],
                "Requiere atención completa.", "Es prestar atención completa, sin interrupciones y con interés."),
            mc("¿Qué demuestra el contacto visual?", ["Interés y respeto", "Aburrimiento", "Enojo"],
                "Mirar a quien habla…", "Mirar a la persona que habla demuestra interés y respeto."),
            mc("Repetir lo que entendiste para confirmar el mensaje es…", ["Resumir y aclarar", "Interrumpir", "Votar"],
                "Confirma que entendiste bien.", "Resumir y aclarar ayuda a confirmar el mensaje.")
        ],
        truefalse: [
            tf("Escuchar activamente incluye interrumpir para opinar rápido.", false, "Hay que dejar que la persona termine su idea."),
            tf("La escucha activa ayuda a tomar decisiones que benefician a todo el grupo.", true, "Permite comprender mejor las ideas de los demás."),
            tf("Mirar a la persona que habla demuestra interés.", true, "Es el contacto visual.")
        ],
        pairs: [
            ["Contacto visual", "Mirar a la persona que habla"],
            ["Resumir y aclarar", "Repetir lo que se entendió"],
            ["Evitar interrumpir", "Dejar que la persona termine su idea"]
        ],
        bank: [
            blank("Mirar a la persona que habla es hacer contacto ___.", "visual", "Se hace con los ojos.")
        ],
        open: [
            abierta("¿Por qué es importante escuchar activamente?",
                [["comprender", "comprendemos", "entender", "entendemos", "entiendo"], ["ideas", "decisiones", "grupo", "demas", "respeto"]], 1,
                "Porque nos permite comprender mejor las ideas de los demás y tomar decisiones que benefician a todo el grupo.", "Piensa en qué ganamos al escuchar bien.")
        ]
    },
    {
        id: "decisiones", campo: "humano", title: "Tomar decisiones en grupo",
        card: {
            points: [
                "Implica escuchar todas las opiniones, discutir opciones y llegar a un acuerdo que considere las ideas de todos.",
                "<b>Exponer las ideas:</b> cada persona expresa su punto de vista sin interrupciones.",
                "<b>Buscar opciones en común:</b> encontrar una opción que combine los intereses de todos.",
                "<b>Llegar a un acuerdo:</b> votar o acordar de manera justa una decisión que el grupo apoye.",
                "Beneficio: una decisión grupal es más justa y crea respeto y colaboración."
            ]
        },
        choice: [
            mc("¿Qué implica tomar decisiones en grupo?", ["Escuchar todas las opiniones y llegar a un acuerdo", "Que decida solo el más fuerte", "No hablar"],
                "Participan todos.", "Se escuchan todas las opiniones, se discuten opciones y se llega a un acuerdo."),
            mc("¿Cuál es el primer paso para tomar una buena decisión en grupo?", ["Exponer las ideas", "Votar sin hablar", "Terminar rápido"],
                "Primero hay que conocer lo que piensa cada quien.", "Primero cada persona expone sus ideas."),
            mc("¿Cuál es un beneficio de una decisión grupal?", ["Es más justa y crea respeto y colaboración", "Nadie tiene que opinar", "Solo beneficia a uno"],
                "Piensa en cómo se siente el grupo.", "La decisión grupal es más justa y crea respeto.")
        ],
        truefalse: [
            tf("En una decisión en grupo, cada persona debe poder expresar su punto de vista.", true, "Es el primer paso."),
            tf("Buscar opciones en común significa ignorar las ideas de los demás.", false, "Es combinar los intereses de todos."),
            tf("Votar puede ser una forma justa de llegar a un acuerdo.", true, "Así decide el grupo.")
        ],
        pairs: [
            ["Exponer las ideas", "Cada persona expresa su punto de vista"],
            ["Buscar opciones en común", "Encontrar una opción que combine los intereses de todos"],
            ["Llegar a un acuerdo", "Votar o acordar una decisión de manera justa"]
        ]
    },
    {
        id: "conflictos", campo: "humano", title: "Resolución de conflictos",
        card: {
            points: [
                "<b>Resolver conflictos:</b> encontrar soluciones a los desacuerdos de manera pacífica y justa.",
                "<b>Escuchar ambas partes:</b> cada uno expresa su punto de vista sin ser interrumpido.",
                "<b>Hacer preguntas:</b> «¿por qué?» o «¿cómo te sientes?» ayudan a entender el problema.",
                "<b>Buscar soluciones juntos:</b> proponer opciones y llegar a un acuerdo para ambas partes.",
                "Ejemplo: si dos compañeros quieren el mismo juguete, pueden escucharse y turnarse o buscar otra actividad."
            ]
        },
        choice: [
            mc("¿Qué significa resolver conflictos?", ["Encontrar soluciones pacíficas y justas a los desacuerdos", "Ganar una pelea", "Ignorar el problema"],
                "Sin violencia.", "Es solucionar los desacuerdos de manera pacífica y justa."),
            mc("¿Qué pregunta ayuda a entender a la otra persona?", ["¿Cómo te sientes?", "¿Por qué siempre lo haces mal?", "¿Quién ganó?"],
                "Busca la pregunta amable.", "Preguntar «¿cómo te sientes?» ayuda a entender el problema."),
            mc("Si dos compañeros quieren el mismo juguete, ¿qué pueden hacer?", ["Escucharse y turnarse", "Pelearse", "Esconder el juguete"],
                "Busca una solución para los dos.", "Pueden escucharse y turnarse o buscar otra actividad.")
        ],
        truefalse: [
            tf("Para resolver un conflicto hay que escuchar a ambas partes.", true, "Cada quien cuenta su punto de vista."),
            tf("Buscar soluciones juntos ayuda a llegar a un acuerdo para ambas partes.", true, "Así los dos quedan satisfechos."),
            tf("Gritar es una buena forma de resolver un conflicto.", false, "Los conflictos se resuelven de manera pacífica.")
        ],
        pairs: [
            ["Escuchar ambas partes", "Que cada uno cuente lo que pasó sin ser interrumpido"],
            ["Hacer preguntas", "Preguntar «¿por qué?» o «¿cómo te sientes?»"],
            ["Buscar soluciones juntos", "Proponer opciones y acordar algo bueno para ambos"]
        ],
        open: [
            abierta("¿Qué pueden hacer dos compañeros que quieren usar el mismo juguete?",
                [["escuchar", "escucharse", "hablar", "dialogar", "platicar"], ["turnarse", "turnos", "turno", "compartir", "compartirlo", "otra actividad", "alternativa", "acuerdo"]], 1,
                "Pueden escucharse y decidir turnarse o buscar otra actividad.", "Piensa en una solución buena para los dos.")
        ]
    },
    {
        id: "comunicacion", campo: "humano", title: "Importancia de la comunicación en grupo",
        card: {
            points: [
                "La comunicación en grupo implica que todos expresen sus ideas y opiniones de manera respetuosa y abierta.",
                "<b>Turnos de palabra:</b> hablar por turnos evita interrupciones y todos se sienten escuchados.",
                "<b>Parafrasear:</b> repetir con nuestras palabras lo que alguien dijo para asegurarnos de entender.",
                "<b>Hablar con respeto:</b> expresar desacuerdos sin ofender ni elevar la voz.",
                "Beneficio: evita malentendidos y facilita la toma de decisiones en grupo."
            ]
        },
        choice: [
            mc("¿Qué ayuda a que todos se sientan escuchados?", ["Hablar por turnos", "Hablar todos al mismo tiempo", "Hablar más fuerte"],
                "Uno a la vez.", "Hablar por turnos evita interrupciones."),
            mc("¿Qué es parafrasear?", ["Repetir con nuestras palabras lo que alguien dijo", "Copiar exactamente un texto", "Cambiar de tema"],
                "Es para asegurarnos de entender.", "Parafrasear es repetir con nuestras palabras lo que alguien dijo."),
            mc("¿Qué significa hablar con respeto?", ["Expresar desacuerdos sin ofender ni elevar la voz", "No decir nunca lo que pienso", "Gritar para que me escuchen"],
                "Puedes no estar de acuerdo, pero…", "Hablar con respeto es expresar desacuerdos sin ofender ni gritar.")
        ],
        truefalse: [
            tf("Una buena comunicación ayuda a evitar malentendidos.", true, "Es su beneficio."),
            tf("Parafrasear es repetir lo que alguien dijo con nuestras propias palabras.", true, "Así nos aseguramos de entender."),
            tf("Elevar la voz es parte de hablar con respeto.", false, "Hablar con respeto es sin ofender ni elevar la voz.")
        ],
        pairs: [
            ["Turnos de palabra", "Hablar por turnos para evitar interrupciones"],
            ["Parafrasear", "Repetir con nuestras palabras para asegurarnos de entender"],
            ["Hablar con respeto", "Expresar desacuerdos sin ofender"]
        ],
        bank: [
            blank("Repetir con nuestras palabras lo que alguien dijo se llama ___.", "parafrasear", "Ayuda a asegurarnos de entender."),
            blank("Hablar por ___ evita interrupciones.", "turnos", "Uno a la vez.")
        ]
    },
    {
        id: "reuniones", campo: "humano", title: "Reuniones para llegar a acuerdos",
        card: {
            points: [
                "Una reunión para tomar decisiones permite que todos participen y expresen sus ideas de manera ordenada.",
                "<b>Preparar los temas a tratar:</b> tener una lista de lo importante.",
                "<b>Escuchar con atención:</b> que todos puedan hablar sin ser interrumpidos.",
                "<b>Votar o llegar a un consenso:</b> cuando todos hablaron, votar o encontrar un punto medio que todos apoyen.",
                "Ejemplo: para organizar una fiesta, la clase hace una reunión para elegir el tema, la decoración y las actividades."
            ]
        },
        choice: [
            mc("¿Para qué sirve una reunión para tomar decisiones?", ["Para que todos participen y expresen sus ideas en orden", "Para que hable una sola persona", "Para jugar"],
                "Participan todos.", "Una reunión permite que todos participen de manera ordenada."),
            mc("¿Cuál es el primer paso de una reunión efectiva?", ["Preparar los temas a tratar", "Votar antes de hablar", "Terminar rápido"],
                "Antes de empezar…", "Primero se prepara la lista de temas."),
            mc("¿Qué es llegar a un consenso?", ["Encontrar un punto medio que todos puedan apoyar", "Que gane el que grita más", "No decidir nada"],
                "Todos están de acuerdo.", "El consenso es un punto medio que todos pueden apoyar.")
        ],
        truefalse: [
            tf("En una reunión efectiva todos pueden hablar sin ser interrumpidos.", true, "Es escuchar con atención."),
            tf("Tener una lista de temas ayuda a organizar una reunión.", true, "Es preparar los temas a tratar."),
            tf("En una reunión solo opina una persona.", false, "Todos participan y expresan sus ideas.")
        ],
        pairs: [
            ["Preparar los temas a tratar", "Tener una lista de los temas importantes"],
            ["Escuchar con atención", "Que todos hablen sin ser interrumpidos"],
            ["Votar o llegar a un consenso", "Elegir una opción que todos puedan apoyar"]
        ],
        bank: [
            blank("Un ___ es un punto medio que todos pueden apoyar.", "consenso", "Todos están de acuerdo.")
        ]
    }
];

// Conjuntos para clasificar: [elemento, índice de su categoría]
const CLASIFICA = [
    {
        id: "comun-propio", campo: "lenguajes", tema: "sustantivos", prompt: "¿Sustantivo común o propio?", categories: ["común", "propio"],
        items: [["niño", 0], ["Juan", 1], ["perro", 0], ["Monterrey", 1], ["ciudad", 0], ["México", 1], ["árbol", 0], ["María", 1]]
    },
    {
        id: "concreto-abstracto", campo: "lenguajes", tema: "sustantivos", prompt: "¿Sustantivo concreto o abstracto?", categories: ["concreto", "abstracto"],
        items: [["mesa", 0], ["amor", 1], ["gato", 0], ["libertad", 1], ["libro", 0], ["felicidad", 1], ["lápiz", 0], ["alegría", 1]]
    },
    {
        id: "variable-invariable", campo: "lenguajes", tema: "variables", prompt: "¿Palabra variable o invariable?", categories: ["variable", "invariable"],
        items: [["niño", 0], ["aquí", 1], ["roja", 0], ["pero", 1], ["correr", 0], ["sobre", 1], ["gata", 0], ["ayer", 1], ["bonito", 0], ["para", 1]]
    },
    {
        id: "articulos", campo: "lenguajes", tema: "articulos", prompt: "¿Artículo determinado o indeterminado?", categories: ["determinado", "indeterminado"],
        items: [["el", 0], ["una", 1], ["los", 0], ["unos", 1], ["la", 0], ["un", 1], ["las", 0], ["unas", 1]]
    },
    {
        id: "sustantivo-adjetivo", campo: "lenguajes", tema: "sustantivos-adjetivos", prompt: "¿Sustantivo o adjetivo?", categories: ["sustantivo", "adjetivo"],
        items: [["María", 0], ["inteligente", 1], ["perro", 0], ["pequeño", 1], ["escuela", 0], ["hermoso", 1], ["lápiz", 0], ["alegre", 1], ["alegría", 0], ["amarilla", 1]]
    },
    {
        id: "prefijo-sufijo", campo: "lenguajes", tema: "prefijos", prompt: "¿La palabra tiene prefijo o sufijo?", categories: ["prefijo", "sufijo"],
        items: [["desordenar", 0], ["panadero", 1], ["releer", 0], ["florero", 1], ["invisible", 0], ["pequeñito", 1]]
    },
    {
        id: "contaminacion", campo: "saberes", tema: "contaminacion", prompt: "¿Qué se contamina principalmente?", categories: ["agua", "aire", "suelo"],
        items: [["Aguas residuales que llegan a un río", 0], ["Humo de las fábricas", 1], ["Exceso de pesticidas en un cultivo", 2],
            ["Aceite tirado en un lago", 0], ["Quema de basura", 1], ["Plásticos enterrados en un terreno", 2], ["Humo de los automóviles", 1], ["Derrame de aceite en la tierra", 2]]
    },
    {
        id: "sistemas", campo: "saberes", tema: "respiratorio", prompt: "¿A qué sistema pertenece?", categories: ["respiratorio", "circulatorio"],
        items: [["nariz", 0], ["corazón", 1], ["tráquea", 0], ["arterias", 1], ["bronquios", 0], ["venas", 1], ["pulmones", 0], ["capilares", 1], ["diafragma", 0], ["sangre", 1]]
    },
    {
        id: "cinco-r", campo: "etica", tema: "sustentabilidad", prompt: "¿Cuál de las 5 R es?", categories: ["Reducir", "Reutilizar", "Reciclar", "Reparar", "Rechazar"],
        items: [["Evitar comprar productos innecesarios", 0], ["Usar las hojas de papel por ambos lados", 1], ["Separar papel y cartón para su reciclaje", 2],
            ["Reparar una mochila en lugar de tirarla", 3], ["No aceptar popotes desechables", 4], ["Usar un frasco de vidrio como lapicero", 1],
            ["Coser un pantalón roto", 3], ["Llevar tu propia bolsa y no aceptar bolsas de plástico", 4]]
    },
    {
        id: "energias", campo: "etica", tema: "energias", prompt: "¿Energía renovable o no renovable?", categories: ["renovable", "no renovable"],
        items: [["el sol", 0], ["el petróleo", 1], ["el viento", 0], ["el carbón", 1], ["el agua en movimiento", 0], ["el gas natural", 1], ["el calor del interior de la Tierra", 0]]
    },
    {
        id: "esferas", campo: "etica", tema: "esferas", prompt: "¿A qué esfera de la Tierra pertenece?", categories: ["atmósfera", "hidrosfera", "litosfera", "biosfera"],
        items: [["el oxígeno del aire", 0], ["un río", 1], ["una montaña de roca", 2], ["los animales de un bosque", 3], ["el hielo de los polos", 1],
            ["los minerales del suelo", 2], ["el nitrógeno", 0], ["los seres humanos", 3]]
    },
    {
        id: "convivencia", campo: "humano", tema: "comunicacion", prompt: "¿Ayuda o no ayuda a la convivencia en grupo?", categories: ["ayuda", "no ayuda"],
        items: [["Mirar a quien habla", 0], ["Interrumpir a un compañero", 1], ["Hablar por turnos", 0], ["Gritar cuando no estoy de acuerdo", 1],
            ["Parafrasear lo que entendí", 0], ["Ignorar las ideas de los demás", 1], ["Votar de manera justa", 0], ["Burlarse de una opinión", 1]]
    }
];

const CAMPO_BY_ID = Object.fromEntries(CAMPOS.map(c => [c.id, c]));
const TEMA_BY_ID = Object.fromEntries(TEMAS.map(t => [t.id, t]));
