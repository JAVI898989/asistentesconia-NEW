/**
 * TEMARIO COMPLETO - CURSO DE PROGRAMACIÓN DESDE CERO
 *
 * Curso profesional de programación con Python
 * Nivel: Principiante a Intermedio
 * Duración estimada: 120 horas académicas
 */

export interface Exercise {
  level: string;
  title: string;
  description: string;
  tasks: string[];
}

export interface CodeExample {
  title: string;
  code: string;
  explanation: string;
}

export interface TheorySection {
  subtitle: string;
  content: string;
}

export interface ThemeContent {
  theory: TheorySection[];
  examples: CodeExample[];
  exercises: Exercise[];
}

export interface Theme {
  id: string;
  title: string;
  duration: string;
  content: ThemeContent;
}

export interface Module {
  id: number;
  title: string;
  duration: string;
  themes: Theme[];
}

export interface CourseResources {
  bibliography: string[];
  onlineResources: string[];
  practiceProjects: string[];
}

export interface Curriculum {
  courseTitle: string;
  description: string;
  duration: string;
  level: string;
  modules: Module[];
  resources: CourseResources;
  evaluationCriteria: Record<string, string>;
  prerequisites: string;
  certification: string;
}

export const temarioProgramacionCompleto: Curriculum = {
  courseTitle: "Curso de Programación Desde Cero",
  description:
    "Curso completo y profesional de programación con Python, desde conceptos básicos hasta desarrollo de aplicaciones",
  duration: "120 horas académicas",
  level: "Principiante a Intermedio",

  modules: [
    {
      id: 1,
      title: "Módulo 1: Fundamentos de la Programación",
      duration: "20 horas",
      themes: [
        {
          id: "1.1",
          title: "Tema 1: Introducción a la Programación",
          duration: "4 horas",
          content: {
            theory: [
              {
                subtitle: "¿Qué es la Programación?",
                content: `La programación es el proceso de crear instrucciones precisas que una computadora puede ejecutar para resolver problemas específicos o automatizar tareas. A través del código, los desarrolladores pueden crear aplicaciones, sitios web, videojuegos, sistemas operativos y todo tipo de software que utilizamos diariamente.

Un programador es como un arquitecto digital que diseña y construye soluciones tecnológicas. Cada línea de código es una instrucción que le dice a la computadora exactamente qué hacer, cuándo hacerlo y cómo hacerlo.

La programación combina lógica matemática, creatividad y resolución de problemas. No se trata solo de escribir código, sino de pensar de manera estructurada y sistemática para descomponer problemas complejos en pasos más simples.`,
              },
              {
                subtitle: "Historia de la Programación",
                content: `La programación tiene sus raíces en el siglo XIX con Ada Lovelace, quien escribió el primer algoritmo destinado a ser procesado por una máquina. Sin embargo, la programación moderna comenzó en los años 1940 con los primeros computadores electrónicos.

Hitos importantes:
• 1940s: Primeros lenguajes de máquina
• 1950s: Aparición de FORTRAN y COBOL
• 1960s: Desarrollo de algoritmos fundamentales
• 1970s: Creación de C y conceptos de programación estructurada
• 1980s: Programación orientada a objetos con C++
• 1990s: Internet y lenguajes web como JavaScript
• 2000s: Auge de Python, Java y desarrollo móvil
• 2010s: Inteligencia artificial y machine learning
• 2020s: Computación cuántica y desarrollo low-code`,
              },
              {
                subtitle: "¿Qué es un Programa?",
                content: `Un programa es un conjunto ordenado de instrucciones escritas en un lenguaje de programación que le dice al ordenador qué operaciones debe realizar. Es como una receta de cocina, pero para computadoras.

Características de un programa:
• Precisión: Cada instrucción debe ser exacta y sin ambigüedades
• Secuencia: Las instrucciones se ejecutan en un orden específico
• Lógica: Debe seguir una estructura lógica para resolver el problema
• Entrada: Recibe datos del exterior (usuario, archivos, internet)
• Procesamiento: Manipula y transforma los datos
• Salida: Produce resultados (pantalla, archivos, sonidos)

Los programas pueden ser simples (como una calculadora) o extremadamente complejos (como un sistema operativo), pero todos siguen estos principios básicos.`,
              },
            ],

            examples: [
              {
                title: "Ejemplo 1: Programa básico de saludo",
                code: `# Mi primer programa en Python
print("¡Hola, mundo!")
print("Bienvenido al curso de programación")
print("Estás dando tus primeros pasos como programador")`,
                explanation:
                  "Este programa muestra tres mensajes en pantalla. La función print() es una instrucción que muestra texto al usuario.",
              },
              {
                title: "Ejemplo 2: Programa interactivo",
                code: `# Programa que interactúa con el usuario
nombre = input("¿Cómo te llamas? ")
edad = input("¿Cuántos años tienes? ")

print("Hola " + nombre + ", tienes " + edad + " años")
print("¡Es genial conocerte!")`,
                explanation:
                  "Este programa pide información al usuario y luego la utiliza para crear un mensaje personalizado.",
              },
            ],

            exercises: [
              {
                level: "Básico",
                title: "Ejercicio 1: Tu primer programa",
                description:
                  "Crea un programa que muestre tu información personal",
                tasks: [
                  "Muestra tu nombre completo",
                  "Muestra tu edad",
                  "Muestra tu ciudad de nacimiento",
                  "Muestra qué te gusta hacer en tu tiempo libre",
                ],
              },
              {
                level: "Básico",
                title: "Ejercicio 2: Calculadora de presentación",
                description: "Pide datos al usuario y muestra un resumen",
                tasks: [
                  "Pide el nombre del usuario",
                  "Pide su año de nacimiento",
                  "Calcula y muestra su edad aproximada",
                  "Muestra un mensaje de bienvenida personalizado",
                ],
              },
            ],
          },
        },

        {
          id: "1.2",
          title: "Tema 2: Lenguajes de Programación y Python",
          duration: "3 horas",
          content: {
            theory: [
              {
                subtitle: "Tipos de Lenguajes de Programación",
                content: `Los lenguajes de programación son herramientas que nos permiten comunicarnos con las computadoras. Cada lenguaje tiene sus propias características, ventajas y usos específicos.

Clasificación por nivel:

1. Lenguajes de Bajo Nivel:
• Lenguaje de máquina: Código binario (0s y 1s) que entiende directamente el procesador
• Ensamblador: Usa nemónicos para representar instrucciones de máquina
• Ventajas: Máximo rendimiento y control del hardware
• Desventajas: Muy complejo, específico para cada procesador

2. Lenguajes de Alto Nivel:
• Python, JavaScript, Java, C#, Ruby, etc.
• Más cercanos al lenguaje humano
• Ventajas: Más fáciles de aprender y usar, portables
• Desventajas: Menor control directo del hardware

3. Lenguajes de Nivel Medio:
• C, C++: Balance entre control y facilidad de uso`,
              },
              {
                subtitle: "¿Por qué Python?",
                content: `Python es un lenguaje de programación interpretado, de alto nivel y de propósito general, creado por Guido van Rossum en 1991. Su filosofía enfatiza la legibilidad del código y la simplicidad.

Ventajas de Python:

1. Sintaxis Clara y Simple:
• Fácil de leer y escribir
• Menos líneas de código que otros lenguajes
• Ideal para principiantes

2. Versatilidad:
• Desarrollo web (Django, Flask)
• Ciencia de datos (Pandas, NumPy)
• Inteligencia artificial (TensorFlow, PyTorch)
• Automatización y scripts
• Desarrollo de videojuegos (Pygame)

3. Gran Comunidad:
• Millones de desarrolladores en todo el mundo
• Abundante documentación y tutoriales
• Miles de librerías disponibles

4. Multiplataforma:
• Funciona en Windows, Mac, Linux
• Código portable entre sistemas

5. Interpretado:
• No necesita compilación
• Pruebas rápidas de código
• Desarrollo ágil`,
              },
            ],

            examples: [
              {
                title: "Comparación de sintaxis: Hola Mundo",
                code: `# Python (simple y claro)
print("Hola, mundo!")

# Java (más verboso)
public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("Hola, mundo!");
    }
}

# C++ (complejo para principiantes)
#include <iostream>
using namespace std;

int main() {
    cout << "Hola, mundo!" << endl;
    return 0;
}`,
                explanation:
                  "Python requiere solo una línea para el programa 'Hola Mundo', mientras que otros lenguajes necesitan más código.",
              },
            ],

            exercises: [
              {
                level: "Teórico",
                title: "Ejercicio 1: Investigación de lenguajes",
                description:
                  "Investiga y compara diferentes lenguajes de programación",
                tasks: [
                  "Busca información sobre 5 lenguajes de programación populares",
                  "Identifica para qué se usa principalmente cada uno",
                  "Compara la dificultad de aprendizaje",
                  "Elige cuál te interesa más aprender después de Python y explica por qué",
                ],
              },
            ],
          },
        },

        {
          id: "1.3",
          title: "Tema 3: Variables y Tipos de Datos",
          duration: "5 horas",
          content: {
            theory: [
              {
                subtitle: "¿Qué son las Variables?",
                content: `Las variables son contenedores que almacenan valores de datos. Puedes pensar en una variable como una caja etiquetada donde guardas información que puedes usar más tarde en tu programa.

Características de las variables:
• Tienen un nombre único que las identifica
• Pueden almacenar diferentes tipos de datos
• Su valor puede cambiar durante la ejecución del programa
• Son fundamentales para hacer programas dinámicos e interactivos

Reglas para nombrar variables en Python:
• Deben comenzar con una letra (a-z, A-Z) o guión bajo (_)
• Pueden contener letras, números y guiones bajos
• Son sensibles a mayúsculas y minúsculas (nombre ≠ Nombre)
• No pueden usar palabras reservadas de Python (if, for, while, etc.)

Buenas prácticas:
• Usa nombres descriptivos: edad en lugar de e
• Usa snake_case: nombre_completo en lugar de nombreCompleto
• Evita nombres confusos: l, O, I (se confunden con números)`,
              },
              {
                subtitle: "Tipos de Datos Fundamentales",
                content: `Python maneja varios tipos de datos básicos que debes conocer:

1. CADENAS DE TEXTO (str):
• Secuencia de caracteres entre comillas
• Pueden usar comillas simples ('') o dobles ("")
• Para textos largos se usan comillas triples (\"\"\")
• Son inmutables (no se pueden modificar directamente)

2. NÚMEROS ENTEROS (int):
• Números sin decimales: ..., -2, -1, 0, 1, 2, ...
• No tienen límite de tamaño en Python
• Se pueden expresar en diferentes bases (binario, octal, hexadecimal)

3. NÚMEROS DECIMALES (float):
• Números con punto decimal: 3.14, -2.5, 0.001
• Usan aritmética de punto flotante
• Tienen limitaciones de precisión

4. BOOLEANOS (bool):
• Solo dos valores: True o False
• Resultado de comparaciones y operaciones lógicas
• Útiles para controlar el flujo del programa

5. NULOS (NoneType):
• Valor especial None que representa "ausencia de valor"
• Útil para inicializar variables o indicar valores no definidos`,
              },
            ],

            examples: [
              {
                title: "Declaración y uso de variables",
                code: `# Variables de texto
nombre = "Ana García"
apellido = 'Rodríguez'
mensaje = """Este es un mensaje
muy largo que ocupa
varias líneas"""

# Variables numéricas
edad = 25
altura = 1.65
peso = 60.5
temperatura = -5.2

# Variables booleanas
es_estudiante = True
tiene_trabajo = False
es_mayor_edad = edad >= 18

# Variable nula
telefono = None  # Aún no tenemos el teléfono

# Mostrar valores
print("Nombre completo:", nombre, apellido)
print("Edad:", edad, "años")
print("Altura:", altura, "metros")
print("Es mayor de edad:", es_mayor_edad)`,
                explanation:
                  "Este ejemplo muestra cómo declarar variables de diferentes tipos y cómo usarlas en el programa.",
              },
            ],

            exercises: [
              {
                level: "Básico",
                title: "Ejercicio 1: Perfil personal",
                description:
                  "Crea variables para almacenar información personal",
                tasks: [
                  "Crea variables para: nombre, apellido, edad, altura, peso",
                  "Crea variables booleanas para: tiene_mascota, practica_deporte",
                  "Muestra toda la información de forma organizada",
                  "Verifica el tipo de cada variable usando type()",
                ],
              },
            ],
          },
        },
      ],
    },

    {
      id: 2,
      title: "Módulo 2: Estructuras de Control",
      duration: "25 horas",
      themes: [
        {
          id: "2.1",
          title: "Tema 6: Condicionales (if, elif, else)",
          duration: "6 horas",
          content: {
            theory: [
              {
                subtitle: "Introducción a las Estructuras Condicionales",
                content: `Las estructuras condicionales permiten que nuestros programas tomen decisiones basadas en diferentes condiciones. Son fundamentales para crear programas inteligentes que pueden responder de manera diferente según las circunstancias.

Piensa en las condicionales como las decisiones que tomas en tu vida diaria:
• "Si llueve, llevaré paraguas"
• "Si tengo hambre, comeré algo"
• "Si es tarde, me iré a dormir"

En programación, usamos estas mismas estructuras lógicas para controlar el flujo de ejecución del programa.

¿Por qué son importantes?
• Permiten crear programas adaptativos
• Evitan errores al validar datos
• Hacen que los programas sean más útiles e inteligentes
• Son la base de la lógica de programación`,
              },
            ],

            examples: [
              {
                title: "Condicionales básicas",
                code: `# Ejemplo 1: IF simple
edad = int(input("¿Cuántos años tienes? "))

if edad >= 18:
    print("Eres mayor de edad")
    print("Puedes votar en las elecciones")

print("Este mensaje siempre aparece")

# Ejemplo 2: IF-ELSE
temperatura = float(input("¿Qué temperatura hace? "))

if temperatura > 25:
    print("Hace calor, usa ropa ligera")
else:
    print("Hace frío, lleva abrigo")`,
                explanation:
                  "Ejemplos básicos que muestran diferentes estructuras condicionales.",
              },
            ],

            exercises: [
              {
                level: "Básico",
                title: "Ejercicio 1: Clasificador de edades",
                description:
                  "Programa que clasifica personas por rango de edad",
                tasks: [
                  "Pide la edad del usuario",
                  "Clasifica en: niño (0-12), adolescente (13-17), adulto (18-64), adulto mayor (65+)",
                  "Muestra un mensaje apropiado para cada categoría",
                  "Incluye validación para edades negativas",
                ],
              },
            ],
          },
        },

        {
          id: "2.2",
          title: "Tema 7: Bucles - While",
          duration: "5 horas",
          content: {
            theory: [
              {
                subtitle: "Introducción a los Bucles",
                content: `Los bucles permiten repetir bloques de código múltiples veces. Son esenciales para automatizar tareas repetitivas y procesar grandes cantidades de datos.

El bucle while ejecuta código mientras una condición sea verdadera:

while condicion:
    # código a repetir
    # la condición debe cambiar en algún momento

Componentes importantes:
• Condición inicial: Se evalúa antes de cada iteración
• Cuerpo del bucle: Código que se repite
• Actualización: La condición debe cambiar para evitar bucles infinitos

Usos comunes:
• Validar entrada del usuario
• Procesar datos hasta cumplir una condición
• Crear menús interactivos
• Simulaciones y juegos`,
              },
            ],

            examples: [
              {
                title: "Bucles while básicos",
                code: `# Ejemplo 1: Contador simple
contador = 1
while contador <= 5:
    print(f"Contando: {contador}")
    contador += 1

# Ejemplo 2: Validación de entrada
edad = 0
while edad < 1 or edad > 120:
    edad = int(input("Ingresa tu edad (1-120): "))
    if edad < 1 or edad > 120:
        print("Edad inválida, intenta de nuevo")

print(f"Tu edad es: {edad}")

# Ejemplo 3: Menú interactivo
opcion = ""
while opcion != "salir":
    print("\\n=== MENÚ ===")
    print("1. Opción 1")
    print("2. Opción 2") 
    print("salir - Para terminar")
    
    opcion = input("Elige una opción: ").lower()
    
    if opcion == "1":
        print("Elegiste opción 1")
    elif opcion == "2":
        print("Elegiste opción 2")
    elif opcion != "salir":
        print("Opción no válida")`,
                explanation:
                  "Ejemplos que muestran diferentes usos del bucle while.",
              },
            ],

            exercises: [
              {
                level: "Básico",
                title: "Ejercicio 1: Juego de adivinanza",
                description: "Crea un juego donde el usuario adivine un número",
                tasks: [
                  "Genera un número aleatorio entre 1 y 100",
                  "Pide al usuario que adivine el número",
                  "Da pistas (mayor/menor) después de cada intento",
                  "Cuenta el número de intentos",
                  "Felicita al usuario cuando acierte",
                ],
              },
            ],
          },
        },

        {
          id: "2.3",
          title: "Tema 8: Bucles - For",
          duration: "6 horas",
          content: {
            theory: [
              {
                subtitle: "El Bucle For",
                content: `El bucle for es ideal para iterar sobre secuencias (listas, cadenas, rangos) o cuando conocemos el número exacto de iteraciones.

Sintaxis básica:
for variable in secuencia:
    # código a ejecutar

La función range():
• range(n): números de 0 a n-1
• range(inicio, fin): números de inicio a fin-1
• range(inicio, fin, paso): números con incremento específico

Ventajas del for:
• Más legible para iteraciones conocidas
• Menos propenso a bucles infinitos
• Integrado con estructuras de datos de Python
• Permite acceso directo a elementos`,
              },
            ],

            examples: [
              {
                title: "Bucles for con diferentes secuencias",
                code: `# Ejemplo 1: Range simple
print("Contando del 1 al 5:")
for i in range(1, 6):
    print(f"Número: {i}")

# Ejemplo 2: Iterando sobre una lista
frutas = ["manzana", "banana", "naranja", "pera"]
print("\\nFrutas disponibles:")
for fruta in frutas:
    print(f"- {fruta}")

# Ejemplo 3: Iterando sobre una cadena
palabra = "Python"
print(f"\\nLetras en '{palabra}':")
for letra in palabra:
    print(f"Letra: {letra}")

# Ejemplo 4: Usando enumerate para obtener índices
print("\\nFrutas con índices:")
for indice, fruta in enumerate(frutas):
    print(f"{indice}: {fruta}")

# Ejemplo 5: Range con paso
print("\\nNúmeros pares del 0 al 10:")
for numero in range(0, 11, 2):
    print(numero)`,
                explanation:
                  "Diferentes formas de usar el bucle for con varias estructuras de datos.",
              },
            ],

            exercises: [
              {
                level: "Básico",
                title: "Ejercicio 1: Calculadora de promedio",
                description:
                  "Programa que calcule el promedio de N calificaciones",
                tasks: [
                  "Pide al usuario cuántas calificaciones ingresará",
                  "Usa un bucle for para recopilar las calificaciones",
                  "Calcula y muestra el promedio",
                  "Determina si aprobó o reprobó (promedio >= 6)",
                  "Muestra la calificación más alta y más baja",
                ],
              },
            ],
          },
        },
      ],
    },

    {
      id: 3,
      title: "Módulo 3: Estructuras de Datos",
      duration: "20 horas",
      themes: [
        {
          id: "3.1",
          title: "Tema 11: Listas en Python",
          duration: "6 horas",
          content: {
            theory: [
              {
                subtitle: "Introducción a las Listas",
                content: `Las listas son una de las estructuras de datos más importantes en Python. Permiten almacenar múltiples elementos en una sola variable, manteniendo un orden específico.

Características de las listas:
• Ordenadas: Los elementos mantienen un orden específico
• Mutables: Se pueden modificar después de ser creadas
• Permiten duplicados: Pueden contener el mismo valor múltiples veces
• Heterogéneas: Pueden contener diferentes tipos de datos
• Indexadas: Cada elemento tiene una posición numérica

¿Por qué usar listas?
• Almacenar colecciones de datos relacionados
• Procesar múltiples elementos de manera eficiente
• Implementar algoritmos de ordenamiento y búsqueda
• Representar estructuras de datos complejas

Sintaxis básica:
mi_lista = [elemento1, elemento2, elemento3]
lista_vacia = []
lista_mixta = [1, "texto", True, 3.14]`,
              },
            ],

            examples: [
              {
                title: "Operaciones básicas con listas",
                code: `# Crear listas
numeros = [1, 2, 3, 4, 5]
frutas = ["manzana", "banana", "naranja"]
mixta = [1, "hola", True, 3.14, [1, 2, 3]]

# Acceder a elementos (indexación)
print("Primera fruta:", frutas[0])  # manzana
print("Última fruta:", frutas[-1])  # naranja
print("Segunda fruta:", frutas[1])  # banana

# Modificar elementos
frutas[1] = "pera"
print("Frutas modificadas:", frutas)

# Agregar elementos
frutas.append("uva")  # Agregar al final
frutas.insert(1, "kiwi")  # Insertar en posición específica

# Eliminar elementos
frutas.remove("naranja")  # Eliminar por valor
ultimo = frutas.pop()  # Eliminar y devolver el último
del frutas[0]  # Eliminar por índice

print("Lista final:", frutas)`,
                explanation:
                  "Operaciones fundamentales para trabajar con listas: crear, acceder, modificar, agregar y eliminar elementos.",
              },
            ],

            exercises: [
              {
                level: "Básico",
                title: "Ejercicio 1: Gestión de lista de compras",
                description:
                  "Crea un programa para manejar una lista de compras",
                tasks: [
                  "Crea una lista inicial con 5 productos",
                  "Permite al usuario agregar productos",
                  "Permite eliminar productos por nombre",
                  "Muestra la lista completa y el número de productos",
                ],
              },
            ],
          },
        },
      ],
    },

    {
      id: 4,
      title: "Módulo 4: Funciones",
      duration: "18 horas",
      themes: [
        {
          id: "4.1",
          title: "Tema 16: Introducción a las Funciones",
          duration: "5 horas",
          content: {
            theory: [
              {
                subtitle: "¿Qué son las Funciones?",
                content: `Las funciones son bloques de código reutilizable que realizan una tarea específica. Son fundamentales para escribir código organizado, mantenible y eficiente.

Beneficios de las funciones:
• Reutilización: Escribir una vez, usar múltiples veces
• Organización: Dividir problemas complejos en partes pequeñas
• Legibilidad: Código más fácil de entender
• Mantenimiento: Cambios centralizados
• Pruebas: Más fácil probar partes individuales

Analogía:
Una función es como una receta de cocina:
• Tiene un nombre (ej: "hacer_pastel")
• Recibe ingredientes (parámetros)
• Sigue pasos específicos (código)
• Produce un resultado (valor de retorno)

Sintaxis básica:
def nombre_funcion(parametros):
    """Documentación opcional"""
    # código de la función
    return resultado  # opcional`,
              },
            ],

            examples: [
              {
                title: "Funciones básicas",
                code: `# Función sin parámetros ni retorno
def saludar():
    print("¡Hola mundo!")

# Función con parámetros
def saludar_persona(nombre):
    print(f"¡Hola, {nombre}!")

# Función con retorno
def sumar(a, b):
    resultado = a + b
    return resultado

# Función con múltiples parámetros y retorno
def calcular_area_rectangulo(largo, ancho):
    """Calcula el área de un rectángulo"""
    area = largo * ancho
    return area

# Usar las funciones
saludar()
saludar_persona("Ana")

resultado_suma = sumar(5, 3)
print(f"La suma es: {resultado_suma}")

area = calcular_area_rectangulo(10, 5)
print(f"El área es: {area}")`,
                explanation:
                  "Ejemplos básicos que muestran diferentes tipos de funciones y cómo usarlas.",
              },
            ],

            exercises: [
              {
                level: "Básico",
                title: "Ejercicio 1: Calculadora de funciones",
                description:
                  "Crea funciones para operaciones matemáticas básicas",
                tasks: [
                  "Crea funciones para sumar, restar, multiplicar y dividir",
                  "Cada función debe recibir dos números",
                  "Cada función debe retornar el resultado",
                  "Crea un programa principal que use todas las funciones",
                ],
              },
            ],
          },
        },
      ],
    },

    {
      id: 5,
      title: "Módulo 5: Programación Orientada a Objetos",
      duration: "22 horas",
      themes: [
        {
          id: "5.1",
          title: "Tema 21: Introducción a POO",
          duration: "4 horas",
          content: {
            theory: [
              {
                subtitle: "Conceptos Fundamentales de POO",
                content: `La Programación Orientada a Objetos (POO) es un paradigma de programación que organiza el código en "objetos" que representan entidades del mundo real.

Conceptos principales:

1. CLASE: Plantilla o molde para crear objetos
   • Define atributos (características)
   • Define métodos (comportamientos)
   • Es como un plano arquitectónico

2. OBJETO: Instancia específica de una clase
   • Tiene valores específicos para los atributos
   • Puede ejecutar los métodos de su clase
   • Es como una casa construida según el plano

3. ATRIBUTOS: Variables que pertenecen a un objeto
   • Describen el estado del objeto
   �� Ejemplo: color, tamaño, nombre

4. MÉTODOS: Funciones que pertenecen a una clase
   • Definen lo que puede hacer un objeto
   • Ejemplo: caminar, hablar, calcular

Ventajas de POO:
• Modelado natural del mundo real
• Código más organizado y mantenible
• Reutilización de código
• Encapsulación de datos
• Facilita el trabajo en equipo`,
              },
            ],

            examples: [
              {
                title: "Primera clase en Python",
                code: `# Definir una clase
class Persona:
    def __init__(self, nombre, edad):
        self.nombre = nombre  # Atributo
        self.edad = edad      # Atributo
    
    def presentarse(self):   # Método
        return f"Hola, soy {self.nombre} y tengo {self.edad} años"
    
    def cumplir_anos(self):  # Método
        self.edad += 1
        print(f"¡Feliz cumpleaños! Ahora tengo {self.edad} años")

# Crear objetos (instancias)
persona1 = Persona("Ana", 25)
persona2 = Persona("Carlos", 30)

# Usar los objetos
print(persona1.presentarse())
print(persona2.presentarse())

persona1.cumplir_anos()
print(persona1.presentarse())`,
                explanation:
                  "Ejemplo básico que muestra cómo definir una clase, crear objetos y usar métodos.",
              },
            ],

            exercises: [
              {
                level: "Básico",
                title: "Ejercicio 1: Clase Coche",
                description: "Crea una clase para representar un automóvil",
                tasks: [
                  "Define atributos: marca, modelo, año, color",
                  "Crea método para arrancar y apagar",
                  "Crea método para acelerar",
                  "Crea al menos 3 objetos diferentes",
                  "Prueba todos los métodos",
                ],
              },
            ],
          },
        },
      ],
    },

    {
      id: 6,
      title: "Módulo 6: Manejo de Archivos y Datos",
      duration: "15 horas",
      themes: [
        {
          id: "6.1",
          title: "Tema 26: Lectura y Escritura de Archivos",
          duration: "5 horas",
          content: {
            theory: [
              {
                subtitle: "Trabajando con Archivos",
                content: `El manejo de archivos permite que nuestros programas lean y escriban información en el disco duro, lo que es esencial para:

• Guardar datos de forma permanente
• Procesar grandes cantidades de información
• Intercambiar datos entre programas
• Crear logs y reportes
• Configurar aplicaciones

Tipos de archivos:
• Archivos de texto: .txt, .csv, .json, .xml
• Archivos binarios: .jpg, .pdf, .exe
• Archivos de datos: .xlsx, .db

Modos de apertura:
• 'r': Solo lectura (read)
• 'w': Solo escritura (write) - sobrescribe
• 'a': Agregar (append) - añade al final
• 'r+': Lectura y escritura
• 'x': Creación exclusiva

Buenas prácticas:
• Siempre cerrar archivos después de usarlos
• Usar context managers (with)
• Manejar excepciones
• Verificar que el archivo existe antes de leerlo`,
              },
            ],

            examples: [
              {
                title: "Operaciones básicas con archivos",
                code: `# Escribir en un archivo
with open('mi_archivo.txt', 'w', encoding='utf-8') as archivo:
    archivo.write("Hola mundo\\n")
    archivo.write("Esta es la segunda línea\\n")
    archivo.write("Python es genial\\n")

# Leer todo el archivo
with open('mi_archivo.txt', 'r', encoding='utf-8') as archivo:
    contenido = archivo.read()
    print("Contenido completo:")
    print(contenido)

# Leer línea por línea
with open('mi_archivo.txt', 'r', encoding='utf-8') as archivo:
    print("Leyendo línea por línea:")
    for numero_linea, linea in enumerate(archivo, 1):
        print(f"Línea {numero_linea}: {linea.strip()}")`,
                explanation:
                  "Ejemplos que muestran las operaciones más comunes al trabajar con archivos de texto.",
              },
            ],

            exercises: [
              {
                level: "Básico",
                title: "Ejercicio 1: Diario personal",
                description: "Crea un programa de diario que guarde entradas",
                tasks: [
                  "Permite al usuario escribir entradas de diario",
                  "Guarda cada entrada con fecha y hora",
                  "Permite leer entradas anteriores",
                  "Implementa búsqueda por fecha",
                  "Maneja errores si el archivo no existe",
                ],
              },
            ],
          },
        },
      ],
    },
  ],

  resources: {
    bibliography: [
      "Python Crash Course - Eric Matthes",
      "Automate the Boring Stuff with Python - Al Sweigart",
      "Learn Python the Hard Way - Zed Shaw",
      "Python Programming: An Introduction to Computer Science - John Zelle",
    ],

    onlineResources: [
      "https://docs.python.org/ - Documentación oficial de Python",
      "https://www.python.org/dev/peps/pep-8/ - Guía de estilo PEP 8",
      "https://realpython.com/ - Tutoriales avanzados de Python",
      "https://python.org/downloads/ - Descargar Python",
    ],

    practiceProjects: [
      "Calculadora avanzada con interfaz gráfica",
      "Sistema de gestión de tareas (To-Do List)",
      "Analizador de texto y estadísticas",
      "Juego de adivinanza de números",
      "Sistema de encuestas con análisis de datos",
      "Bot de automatización de tareas",
    ],
  },

  evaluationCriteria: {
    theoreticalKnowledge: "25%",
    practicalExercises: "35%",
    finalProject: "30%",
    participation: "10%",
  },

  prerequisites: "Conocimientos básicos de computación y manejo de archivos",

  certification:
    "Certificado de Programación en Python - Nivel Básico-Intermedio",
};
