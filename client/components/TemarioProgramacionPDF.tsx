import React from "react";

interface TemarioPDFProps {
  forPrint?: boolean;
}

export default function TemarioProgramacionPDF({
  forPrint = false,
}: TemarioPDFProps) {
  const containerClass = forPrint
    ? "pdf-content max-w-none mx-0 p-8 bg-white text-black font-serif"
    : "max-w-4xl mx-auto p-8 bg-white text-gray-900 font-serif";

  return (
    <div className={containerClass}>
      {/* Portada */}
      <div className="text-center mb-16 page-break-after">
        <h1 className="text-5xl font-bold mb-6 text-blue-800">
          Curso de Programación Desde Cero
        </h1>
        <h2 className="text-2xl mb-8 text-gray-600">
          Temario Completo y Profesional
        </h2>
        <div className="text-lg space-y-2 mb-12">
          <p>
            <strong>Duración:</strong> 120 horas académicas
          </p>
          <p>
            <strong>Nivel:</strong> Principiante a Intermedio
          </p>
          <p>
            <strong>Modalidad:</strong> Presencial y Virtual
          </p>
          <p>
            <strong>Lenguaje:</strong> Python
          </p>
        </div>
        <div className="text-center text-gray-500">
          <p>Academia de Programación Profesional</p>
          <p>{new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Índice */}
      <div className="mb-12 page-break-before">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 border-b-2 border-blue-200 pb-2">
          Índice de Contenidos
        </h2>

        <div className="space-y-3 text-base">
          <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
            <span>
              <strong>Módulo 1:</strong> Fundamentos de la Programación
            </span>
            <span className="font-mono">20 horas</span>
          </div>
          <div className="ml-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>1.1 Introducción a la Programación</span>
              <span className="font-mono">4h</span>
            </div>
            <div className="flex justify-between">
              <span>1.2 Lenguajes de Programación y Python</span>
              <span className="font-mono">3h</span>
            </div>
            <div className="flex justify-between">
              <span>1.3 Variables y Tipos de Datos</span>
              <span className="font-mono">5h</span>
            </div>
            <div className="flex justify-between">
              <span>1.4 Operadores en Python</span>
              <span className="font-mono">4h</span>
            </div>
            <div className="flex justify-between">
              <span>1.5 Entrada y Salida de Datos</span>
              <span className="font-mono">4h</span>
            </div>
          </div>

          <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
            <span>
              <strong>Módulo 2:</strong> Estructuras de Control
            </span>
            <span className="font-mono">25 horas</span>
          </div>
          <div className="ml-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>2.1 Condicionales (if, elif, else)</span>
              <span className="font-mono">6h</span>
            </div>
            <div className="flex justify-between">
              <span>2.2 Bucles - While</span>
              <span className="font-mono">5h</span>
            </div>
            <div className="flex justify-between">
              <span>2.3 Bucles - For</span>
              <span className="font-mono">6h</span>
            </div>
            <div className="flex justify-between">
              <span>2.4 Control de Bucles (break, continue)</span>
              <span className="font-mono">4h</span>
            </div>
            <div className="flex justify-between">
              <span>2.5 Bucles Anidados</span>
              <span className="font-mono">4h</span>
            </div>
          </div>

          <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
            <span>
              <strong>Módulo 3:</strong> Estructuras de Datos
            </span>
            <span className="font-mono">20 horas</span>
          </div>
          <div className="ml-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>3.1 Listas en Python</span>
              <span className="font-mono">6h</span>
            </div>
            <div className="flex justify-between">
              <span>3.2 Tuplas</span>
              <span className="font-mono">4h</span>
            </div>
            <div className="flex justify-between">
              <span>3.3 Diccionarios</span>
              <span className="font-mono">6h</span>
            </div>
            <div className="flex justify-between">
              <span>3.4 Conjuntos (Sets)</span>
              <span className="font-mono">4h</span>
            </div>
          </div>

          <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
            <span>
              <strong>Módulo 4:</strong> Funciones
            </span>
            <span className="font-mono">18 horas</span>
          </div>
          <div className="ml-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>4.1 Introducción a las Funciones</span>
              <span className="font-mono">5h</span>
            </div>
            <div className="flex justify-between">
              <span>4.2 Parámetros y Argumentos</span>
              <span className="font-mono">4h</span>
            </div>
            <div className="flex justify-between">
              <span>4.3 Funciones Lambda</span>
              <span className="font-mono">3h</span>
            </div>
            <div className="flex justify-between">
              <span>4.4 Módulos y Paquetes</span>
              <span className="font-mono">6h</span>
            </div>
          </div>

          <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
            <span>
              <strong>Módulo 5:</strong> Programación Orientada a Objetos
            </span>
            <span className="font-mono">22 horas</span>
          </div>
          <div className="ml-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>5.1 Introducción a POO</span>
              <span className="font-mono">4h</span>
            </div>
            <div className="flex justify-between">
              <span>5.2 Clases y Objetos</span>
              <span className="font-mono">6h</span>
            </div>
            <div className="flex justify-between">
              <span>5.3 Herencia</span>
              <span className="font-mono">6h</span>
            </div>
            <div className="flex justify-between">
              <span>5.4 Polimorfismo y Encapsulación</span>
              <span className="font-mono">6h</span>
            </div>
          </div>

          <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
            <span>
              <strong>Módulo 6:</strong> Manejo de Archivos y Proyecto Final
            </span>
            <span className="font-mono">15 horas</span>
          </div>
          <div className="ml-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>6.1 Lectura y Escritura de Archivos</span>
              <span className="font-mono">5h</span>
            </div>
            <div className="flex justify-between">
              <span>6.2 Manejo de Errores y Excepciones</span>
              <span className="font-mono">4h</span>
            </div>
            <div className="flex justify-between">
              <span>6.3 Proyecto Final Integrador</span>
              <span className="font-mono">6h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Módulo 1: Fundamentos */}
      <div className="mb-16 page-break-before">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 border-b-2 border-blue-200 pb-2">
          Módulo 1: Fundamentos de la Programación
        </h2>
        <p className="text-lg mb-6 text-gray-700">
          <strong>Duración:</strong> 20 horas académicas |{" "}
          <strong>Objetivo:</strong> Establecer las bases conceptuales y
          prácticas de la programación
        </p>

        {/* Tema 1.1 */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4 text-blue-700">
            Tema 1.1: Introducción a la Programación (4 horas)
          </h3>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              ¿Qué es la Programación?
            </h4>
            <p className="mb-4 leading-relaxed">
              La programación es el proceso de crear instrucciones precisas que
              una computadora puede ejecutar para resolver problemas específicos
              o automatizar tareas. A través del código, los desarrolladores
              pueden crear aplicaciones, sitios web, videojuegos, sistemas
              operativos y todo tipo de software que utilizamos diariamente.
            </p>
            <p className="mb-4 leading-relaxed">
              Un programador es como un arquitecto digital que diseña y
              construye soluciones tecnológicas. Cada línea de código es una
              instrucción que le dice a la computadora exactamente qué hacer,
              cuándo hacerlo y cómo hacerlo.
            </p>
            <p className="mb-4 leading-relaxed">
              La programación combina lógica matemática, creatividad y
              resolución de problemas. No se trata solo de escribir código, sino
              de pensar de manera estructurada y sistemática para descomponer
              problemas complejos en pasos más simples.
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              Historia de la Programación
            </h4>
            <p className="mb-4 leading-relaxed">
              La programación tiene sus raíces en el siglo XIX con Ada Lovelace,
              quien escribió el primer algoritmo destinado a ser procesado por
              una máquina. Sin embargo, la programación moderna comenzó en los
              años 1940 con los primeros computadores electrónicos.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h5 className="font-semibold mb-2">Hitos importantes:</h5>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>1940s:</strong> Primeros lenguajes de máquina
                </li>
                <li>
                  <strong>1950s:</strong> Aparición de FORTRAN y COBOL
                </li>
                <li>
                  <strong>1960s:</strong> Desarrollo de algoritmos fundamentales
                </li>
                <li>
                  <strong>1970s:</strong> Creación de C y conceptos de
                  programación estructurada
                </li>
                <li>
                  <strong>1980s:</strong> Programación orientada a objetos con
                  C++
                </li>
                <li>
                  <strong>1990s:</strong> Internet y lenguajes web como
                  JavaScript
                </li>
                <li>
                  <strong>2000s:</strong> Auge de Python, Java y desarrollo
                  móvil
                </li>
                <li>
                  <strong>2010s:</strong> Inteligencia artificial y machine
                  learning
                </li>
                <li>
                  <strong>2020s:</strong> Computación cuántica y desarrollo
                  low-code
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              ¿Qué es un Programa?
            </h4>
            <p className="mb-4 leading-relaxed">
              Un programa es un conjunto ordenado de instrucciones escritas en
              un lenguaje de programación que le dice al ordenador qué
              operaciones debe realizar. Es como una receta de cocina, pero para
              computadoras.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="font-semibold mb-2 text-blue-800">
                Características de un programa:
              </h5>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>Precisión:</strong> Cada instrucción debe ser exacta y
                  sin ambigüedades
                </li>
                <li>
                  <strong>Secuencia:</strong> Las instrucciones se ejecutan en
                  un orden específico
                </li>
                <li>
                  <strong>Lógica:</strong> Debe seguir una estructura lógica
                  para resolver el problema
                </li>
                <li>
                  <strong>Entrada:</strong> Recibe datos del exterior (usuario,
                  archivos, internet)
                </li>
                <li>
                  <strong>Procesamiento:</strong> Manipula y transforma los
                  datos
                </li>
                <li>
                  <strong>Salida:</strong> Produce resultados (pantalla,
                  archivos, sonidos)
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              Primer Ejemplo Práctico
            </h4>
            <p className="mb-3 leading-relaxed">
              Veamos nuestro primer programa en Python. Este ejemplo muestra la
              estructura básica de un programa:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div className="mb-2 text-green-400">
                # Mi primer programa en Python
              </div>
              <div className="mb-2">print("¡Hola, mundo!")</div>
              <div className="mb-2">
                print("Bienvenido al curso de programación")
              </div>
              <div>
                print("Estás dando tus primeros pasos como programador")
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600 italic">
              Este programa muestra tres mensajes en pantalla. La función
              print() es una instrucción que muestra texto al usuario.
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              Ejercicios Prácticos
            </h4>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h5 className="font-semibold mb-2 text-purple-800">
                Ejercicio 1: Tu primer programa
              </h5>
              <p className="mb-2 text-sm">
                Crea un programa que muestre tu información personal:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Muestra tu nombre completo</li>
                <li>• Muestra tu edad</li>
                <li>• Muestra tu ciudad de nacimiento</li>
                <li>• Muestra qué te gusta hacer en tu tiempo libre</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tema 1.2 */}
        <div className="mb-12 page-break-before">
          <h3 className="text-2xl font-bold mb-4 text-blue-700">
            Tema 1.2: Lenguajes de Programación y Python (3 horas)
          </h3>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              Tipos de Lenguajes de Programación
            </h4>
            <p className="mb-4 leading-relaxed">
              Los lenguajes de programación son herramientas que nos permiten
              comunicarnos con las computadoras. Cada lenguaje tiene sus propias
              características, ventajas y usos específicos.
            </p>

            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h5 className="font-semibold mb-2 text-red-800">
                  1. Lenguajes de Bajo Nivel:
                </h5>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • <strong>Lenguaje de máquina:</strong> Código binario (0s y
                    1s) que entiende directamente el procesador
                  </li>
                  <li>
                    • <strong>Ensamblador:</strong> Usa nemónicos para
                    representar instrucciones de máquina
                  </li>
                  <li>
                    • <strong>Ventajas:</strong> Máximo rendimiento y control
                    del hardware
                  </li>
                  <li>
                    • <strong>Desventajas:</strong> Muy complejo, específico
                    para cada procesador
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold mb-2 text-green-800">
                  2. Lenguajes de Alto Nivel:
                </h5>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • <strong>Ejemplos:</strong> Python, JavaScript, Java, C#,
                    Ruby, etc.
                  </li>
                  <li>
                    • <strong>Características:</strong> Más cercanos al lenguaje
                    humano
                  </li>
                  <li>
                    • <strong>Ventajas:</strong> Más fáciles de aprender y usar,
                    portables
                  </li>
                  <li>
                    • <strong>Desventajas:</strong> Menor control directo del
                    hardware
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold mb-2 text-blue-800">
                  3. Lenguajes de Nivel Medio:
                </h5>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • <strong>Ejemplos:</strong> C, C++
                  </li>
                  <li>
                    • <strong>Características:</strong> Balance entre control y
                    facilidad de uso
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              ¿Por qué Python?
            </h4>
            <p className="mb-4 leading-relaxed">
              Python es un lenguaje de programación interpretado, de alto nivel
              y de propósito general, creado por Guido van Rossum en 1991. Su
              filosofía enfatiza la legibilidad del código y la simplicidad.
            </p>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <h5 className="font-semibold mb-2 text-yellow-800">
                Ventajas de Python:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h6 className="font-semibold">1. Sintaxis Clara y Simple:</h6>
                  <ul className="ml-4 space-y-1">
                    <li>• Fácil de leer y escribir</li>
                    <li>• Menos líneas de código</li>
                    <li>• Ideal para principiantes</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-semibold">2. Versatilidad:</h6>
                  <ul className="ml-4 space-y-1">
                    <li>• Desarrollo web (Django, Flask)</li>
                    <li>• Ciencia de datos (Pandas, NumPy)</li>
                    <li>• Inteligencia artificial</li>
                    <li>• Automatización y scripts</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-semibold">3. Gran Comunidad:</h6>
                  <ul className="ml-4 space-y-1">
                    <li>• Millones de desarrolladores</li>
                    <li>• Abundante documentación</li>
                    <li>• Miles de librerías disponibles</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-semibold">4. Multiplataforma:</h6>
                  <ul className="ml-4 space-y-1">
                    <li>• Funciona en Windows, Mac, Linux</li>
                    <li>• Código portable entre sistemas</li>
                    <li>• Desarrollo ágil e interpretado</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h5 className="font-semibold mb-2">
                Comparación de sintaxis: "Hola Mundo"
              </h5>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h6 className="text-sm font-semibold text-green-600 mb-1">
                    Python (simple y claro):
                  </h6>
                  <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-sm">
                    print("Hola, mundo!")
                  </div>
                </div>
                <div>
                  <h6 className="text-sm font-semibold text-orange-600 mb-1">
                    Java (más verboso):
                  </h6>
                  <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-xs">
                    <div>public class HolaMundo {"{"} </div>
                    <div className="ml-4">
                      public static void main(String[] args) {"{"}
                    </div>
                    <div className="ml-8">
                      System.out.println("Hola, mundo!");
                    </div>
                    <div className="ml-4">{"}"}</div>
                    <div>{"}"}</div>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 italic">
                Python requiere solo una línea para el programa "Hola Mundo",
                mientras que otros lenguajes necesitan más código.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              Ejercicios Prácticos
            </h4>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h5 className="font-semibold mb-2 text-purple-800">
                Ejercicio 1: Investigación de lenguajes
              </h5>
              <p className="mb-2 text-sm">
                Investiga y compara diferentes lenguajes de programación:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>
                  • Busca información sobre 5 lenguajes de programación
                  populares
                </li>
                <li>• Identifica para qué se usa principalmente cada uno</li>
                <li>• Compara la dificultad de aprendizaje</li>
                <li>
                  • Elige cuál te interesa más aprender después de Python y
                  explica por qué
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tema 1.3 */}
        <div className="mb-12 page-break-before">
          <h3 className="text-2xl font-bold mb-4 text-blue-700">
            Tema 1.3: Variables y Tipos de Datos (5 horas)
          </h3>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              ¿Qué son las Variables?
            </h4>
            <p className="mb-4 leading-relaxed">
              Las variables son contenedores que almacenan valores de datos.
              Puedes pensar en una variable como una caja etiquetada donde
              guardas información que puedes usar más tarde en tu programa.
            </p>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <h5 className="font-semibold mb-2 text-green-800">
                Características de las variables:
              </h5>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Tienen un nombre único que las identifica</li>
                <li>• Pueden almacenar diferentes tipos de datos</li>
                <li>
                  • Su valor puede cambiar durante la ejecución del programa
                </li>
                <li>
                  • Son fundamentales para hacer programas dinámicos e
                  interactivos
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h5 className="font-semibold mb-2 text-blue-800">
                Reglas para nombrar variables en Python:
              </h5>
              <ul className="text-sm space-y-1 ml-4">
                <li>
                  • Deben comenzar con una letra (a-z, A-Z) o guión bajo (_)
                </li>
                <li>• Pueden contener letras, números y guiones bajos</li>
                <li>
                  • Son sensibles a mayúsculas y minúsculas (nombre ≠ Nombre)
                </li>
                <li>
                  • No pueden usar palabras reservadas de Python (if, for,
                  while, etc.)
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h5 className="font-semibold mb-2 text-yellow-800">
                Buenas prácticas:
              </h5>
              <ul className="text-sm space-y-1 ml-4">
                <li>
                  • Usa nombres descriptivos:{" "}
                  <code className="bg-gray-200 px-1 rounded">edad</code> en
                  lugar de <code className="bg-gray-200 px-1 rounded">e</code>
                </li>
                <li>
                  • Usa snake_case:{" "}
                  <code className="bg-gray-200 px-1 rounded">
                    nombre_completo
                  </code>{" "}
                  en lugar de{" "}
                  <code className="bg-gray-200 px-1 rounded">
                    nombreCompleto
                  </code>
                </li>
                <li>
                  • Evita nombres confusos:{" "}
                  <code className="bg-gray-200 px-1 rounded">l</code>,{" "}
                  <code className="bg-gray-200 px-1 rounded">O</code>,{" "}
                  <code className="bg-gray-200 px-1 rounded">I</code> (se
                  confunden con números)
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              Tipos de Datos Fundamentales
            </h4>
            <p className="mb-4 leading-relaxed">
              Python maneja varios tipos de datos básicos que debes conocer:
            </p>

            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h5 className="font-semibold mb-2 text-orange-800">
                  1. CADENAS DE TEXTO (str):
                </h5>
                <ul className="text-sm space-y-1 ml-4 mb-3">
                  <li>• Secuencia de caracteres entre comillas</li>
                  <li>• Pueden usar comillas simples ('') o dobles ("")</li>
                  <li>• Para textos largos se usan comillas triples (""")</li>
                  <li>
                    • Son inmutables (no se pueden modificar directamente)
                  </li>
                </ul>
                <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-sm">
                  <div>nombre = "Ana García"</div>
                  <div>apellido = 'Rodríguez'</div>
                  <div>mensaje = """Este es un mensaje muy largo"""</div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h5 className="font-semibold mb-2 text-red-800">
                  2. NÚMEROS ENTEROS (int):
                </h5>
                <ul className="text-sm space-y-1 ml-4 mb-3">
                  <li>• Números sin decimales: ..., -2, -1, 0, 1, 2, ...</li>
                  <li>• No tienen límite de tamaño en Python</li>
                  <li>• Se pueden expresar en diferentes bases</li>
                </ul>
                <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-sm">
                  <div>edad = 25</div>
                  <div>temperatura = -5</div>
                  <div>puntuacion = 1500</div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold mb-2 text-green-800">
                  3. NÚMEROS DECIMALES (float):
                </h5>
                <ul className="text-sm space-y-1 ml-4 mb-3">
                  <li>• Números con punto decimal: 3.14, -2.5, 0.001</li>
                  <li>• Usan aritmética de punto flotante</li>
                  <li>• Tienen limitaciones de precisión</li>
                </ul>
                <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-sm">
                  <div>altura = 1.75</div>
                  <div>peso = 68.5</div>
                  <div>pi = 3.14159</div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold mb-2 text-purple-800">
                  4. BOOLEANOS (bool):
                </h5>
                <ul className="text-sm space-y-1 ml-4 mb-3">
                  <li>• Solo dos valores: True o False</li>
                  <li>• Resultado de comparaciones y operaciones lógicas</li>
                  <li>• Útiles para controlar el flujo del programa</li>
                </ul>
                <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-sm">
                  <div>es_estudiante = True</div>
                  <div>tiene_trabajo = False</div>
                  <div>es_mayor_edad = edad &gt;= 18</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              Ejemplo Práctico Completo
            </h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-3">
              <div className="mb-2 text-green-400">
                # Declaración y uso de variables
              </div>
              <div className="mb-1">nombre = "Ana García"</div>
              <div className="mb-1">edad = 25</div>
              <div className="mb-1">altura = 1.65</div>
              <div className="mb-1">es_estudiante = True</div>
              <div className="mb-1">
                telefono = None{" "}
                <span className="text-green-400">
                  # Aún no tenemos el teléfono
                </span>
              </div>
              <div className="mb-3"></div>
              <div className="mb-1 text-green-400"># Mostrar valores</div>
              <div className="mb-1">print("Nombre:", nombre)</div>
              <div className="mb-1">print("Edad:", edad, "años")</div>
              <div className="mb-1">print("Altura:", altura, "metros")</div>
              <div>print("Es estudiante:", es_estudiante)</div>
            </div>
            <p className="text-sm text-gray-600 italic">
              Este ejemplo muestra cómo declarar variables de diferentes tipos y
              cómo usarlas en el programa.
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">
              Ejercicios Prácticos
            </h4>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold mb-2 text-purple-800">
                  Ejercicio 1: Perfil personal
                </h5>
                <p className="mb-2 text-sm">
                  Crea variables para almacenar información personal:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>
                    • Crea variables para: nombre, apellido, edad, altura, peso
                  </li>
                  <li>
                    • Crea variables booleanas para: tiene_mascota,
                    practica_deporte
                  </li>
                  <li>• Muestra toda la información de forma organizada</li>
                  <li>• Verifica el tipo de cada variable usando type()</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold mb-2 text-blue-800">
                  Ejercicio 2: Calculadora de datos personales
                </h5>
                <p className="mb-2 text-sm">
                  Programa que calcule información derivada:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Pide al usuario su año de nacimiento</li>
                  <li>• Calcula su edad actual</li>
                  <li>• Pide su altura en centímetros y convierte a metros</li>
                  <li>• Determina si es mayor de edad (booleano)</li>
                  <li>• Muestra un resumen completo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recursos y Evaluación */}
      <div className="mb-12 page-break-before">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 border-b-2 border-blue-200 pb-2">
          Recursos y Evaluación
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Bibliografía Recomendada
            </h3>
            <ul className="text-sm space-y-2">
              <li>• Python Crash Course - Eric Matthes</li>
              <li>• Automate the Boring Stuff with Python - Al Sweigart</li>
              <li>• Learn Python the Hard Way - Zed Shaw</li>
              <li>
                • Python Programming: An Introduction to Computer Science - John
                Zelle
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Recursos Online
            </h3>
            <ul className="text-sm space-y-2">
              <li>• docs.python.org - Documentación oficial</li>
              <li>• realpython.com - Tutoriales avanzados</li>
              <li>• python.org - Descargar Python</li>
              <li>• github.com - Proyectos de código abierto</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Criterios de Evaluación
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">25%</div>
                <div>Conocimiento Teórico</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">35%</div>
                <div>Ejercicios Prácticos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">30%</div>
                <div>Proyecto Final</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">10%</div>
                <div>Participación</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Información del Curso
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm">
            <p>
              <strong>Prerrequisitos:</strong> Conocimientos básicos de
              computación y manejo de archivos
            </p>
            <p>
              <strong>Certificación:</strong> Certificado de Programación en
              Python - Nivel Básico-Intermedio
            </p>
            <p>
              <strong>Modalidad:</strong> Presencial con apoyo virtual
            </p>
            <p>
              <strong>Material:</strong> Se proporciona todo el material digital
              y ejercicios
            </p>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="text-center text-gray-500 text-sm border-t pt-4">
        <p>Academia de Programación Profesional - {new Date().getFullYear()}</p>
        <p>Temario Completo de Programación desde Cero con Python</p>
      </div>
    </div>
  );
}
