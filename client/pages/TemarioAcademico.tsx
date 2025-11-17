import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurredPreview from "@/components/BlurredPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ArrowLeft,
  Download,
  Clock,
  Users,
  Target,
  CheckCircle,
  GraduationCap,
  FileText,
  Award,
  Star,
  Calendar,
  MessageCircle,
  FileQuestion,
  Zap,
  Trophy,
} from "lucide-react";
import Header from "@/components/Header";
import ChatEspecializado from "@/components/curso/ChatEspecializado";
import TemarioCompleto from "@/components/curso/TemarioCompleto";
import TestPorTema from "@/components/curso/TestPorTema";
import Flashcards from "@/components/curso/Flashcards";
import ProgresoMotivacion from "@/components/curso/ProgresoMotivacion";

export default function TemarioAcademico() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("temario");

  // Datos del curso - aquí puedes expandir para más cursos
  const courseData: Record<string, any> = {
    "programador-desde-cero": {
      name: "Curso Profesional de Programación desde Cero",
      subtitle: "Desarrollo de Software y Aplicaciones Web",
      image: "💻",
      category: "Tecnología",
      difficulty: "Intermedio",
      duration: "240 horas académicas",
      modalidad: "Online con tutorías",
      certification: "Certificado Profesional de Programador",
      price: "200€",
    },
    "auxiliar-veterinaria": {
      name: "Curso Profesional de Auxiliar de Veterinaria",
      subtitle: "Asistencia Sanitaria en Clínicas Veterinarias",
      image: "🐕",
      category: "Sanidad Animal",
      difficulty: "Intermedio",
      duration: "180 horas académicas",
      modalidad: "Online con prácticas presenciales",
      certification: "Certificado Profesional de Auxiliar de Veterinaria",
      price: "180€",
    },
    "peluqueria-profesional": {
      name: "Curso Profesional de Peluquería",
      subtitle: "Técnicas de Corte, Peinado y Estilismo",
      image: "✂️",
      category: "Belleza",
      difficulty: "Básico",
      duration: "120 horas académicas",
      modalidad: "Online con talleres prácticos",
      certification: "Certificado Profesional de Peluquería",
      price: "80€",
    },
  };

  const course = courseData[courseId || "programador-desde-cero"];

  const temarioProgramacion = {
    objetivos: [
      "Dominar los fundamentos de la programación y la lógica computacional",
      "Aprender a desarrollar aplicaciones web modernas con tecnologías actuales",
      "Manejar bases de datos y sistemas de gestión de información",
      "Implementar buenas prácticas de desarrollo y metodologías ágiles",
      "Prepararse para el mercado laboral como programador junior",
    ],
    metodologia: [
      "Clases teóricas con ejemplos prácticos",
      "Ejercicios guiados paso a paso",
      "Proyectos reales de desarrollo",
      "Revisión de código y feedback personalizado",
      "Tutorías individuales y grupales",
    ],
    evaluacion: [
      "Exámenes teóricos por módulo (40%)",
      "Proyectos prácticos individuales (40%)",
      "Proyecto final integrador (20%)",
      "Nota mínima para aprobar: 7/10",
    ],
    modulos: [
      {
        numero: 1,
        titulo: "Fundamentos de Programación",
        horas: 40,
        objetivos: [
          "Comprender qué es la programación y su importancia",
          "Aprender los conceptos básicos de algoritmos y estructuras de datos",
          "Dominar la lógica de programación y resolución de problemas",
          "Conocer los diferentes paradigmas de programación",
        ],
        contenidos: [
          {
            tema: "1.1 Introducción a la Programación",
            explicacion:
              "La programación es el arte y la ciencia de crear instrucciones precisas que una computadora puede seguir para resolver problemas específicos. Este tema fundamental establece las bases conceptuales que todo programador debe dominar antes de avanzar a aspectos más técnicos.",
            subtemas: [
              {
                titulo: "¿Qué es un programa de computadora?",
                contenido:
                  "Un programa de computadora es un conjunto de instrucciones escritas en un lenguaje específico que le dice a la computadora exactamente qué hacer. Estas instrucciones deben ser precisas, lógicas y seguir una secuencia específica para lograr el resultado deseado. Los programas pueden realizar desde tareas simples como calcular una suma, hasta operaciones complejas como gestionar una base de datos o crear videojuegos.",
              },
              {
                titulo: "Historia de la programación",
                contenido:
                  "La programación ha evolucionado desde los primeros programas escritos en código máquina en los años 1940, pasando por lenguajes como FORTRAN y COBOL en los 50s y 60s, hasta llegar a los lenguajes modernos como Python, JavaScript y Go. Conocer esta evolución nos ayuda a entender por qué existen diferentes paradigmas de programación y cómo la industria ha respondido a las necesidades cambiantes de la tecnología.",
              },
              {
                titulo:
                  "Lenguajes de programación: compilados vs interpretados",
                contenido:
                  "Los lenguajes compilados (como C++ o Java) traducen todo el código a lenguaje máquina antes de ejecutarlo, lo que resulta en programas más rápidos pero menos flexibles. Los lenguajes interpretados (como Python o JavaScript) ejecutan el código línea por línea, ofreciendo mayor flexibilidad para desarrollo y debugging, pero con menor velocidad de ejecución. Esta distinción es crucial para elegir la herramienta adecuada según el proyecto.",
              },
              {
                titulo: "Entornos de desarrollo integrado (IDE)",
                contenido:
                  "Un IDE es una aplicación que proporciona herramientas completas para el desarrollo de software, incluyendo editor de código con resaltado de sintaxis, depurador, compilador y herramientas de gestión de proyectos. Ejemplos populares incluyen Visual Studio Code, IntelliJ IDEA y Eclipse. Dominar un IDE aumenta significativamente la productividad del programador.",
              },
              {
                titulo: "Instalación y configuración del entorno de trabajo",
                contenido:
                  "La configuración adecuada del entorno de desarrollo incluye la instalación del IDE, configuración de extensiones útiles, setup de control de versiones (Git), configuración de linters y formateadores de código, y establecimiento de un flujo de trabajo eficiente. Un entorno bien configurado es fundamental para el éxito en cualquier proyecto de programación.",
              },
            ],
            ejercicios_practicos: [
              "Instalación y configuración de Visual Studio Code con extensiones esenciales",
              "Creación del primer programa 'Hola Mundo' en diferentes lenguajes",
              "Análisis comparativo de código compilado vs interpretado",
              "Configuración de un repositorio Git local",
            ],
          },
          {
            tema: "1.2 Algoritmos y Lógica de Programación",
            explicacion:
              "Los algoritmos son la base fundamental de toda programación. Representan una secuencia lógica y ordenada de pasos para resolver un problema específico. Dominar el pensamiento algorítmico es esencial para convertirse en un programador eficiente.",
            subtemas: [
              {
                titulo: "Conceptos de algoritmo y pseudocódigo",
                contenido:
                  "Un algoritmo es una secuencia finita de instrucciones bien definidas para resolver un problema. El pseudocódigo es una forma de escribir algoritmos usando un lenguaje similar al natural, que nos permite planificar la lógica antes de programar. Por ejemplo, el algoritmo para preparar café incluye pasos como: 1) Hervir agua, 2) Añadir café molido, 3) Verter agua caliente, 4) Esperar 4 minutos, 5) Servir. En programación, seguimos la misma lógica estructurada.",
              },
              {
                titulo: "Diagramas de flujo y representación gráfica",
                contenido:
                  "Los diagramas de flujo son representaciones gráficas de algoritmos que utilizan símbolos estándar: óvalos para inicio/fin, rectángulos para procesos, diamantes para decisiones, y flechas para el flujo. Estos diagramas nos ayudan a visualizar la lógica antes de programar y son especialmente útiles para identificar posibles errores en la lógica. Son fundamentales en el análisis y diseño de sistemas.",
              },
              {
                titulo:
                  "Estructuras de control: secuencial, condicional, iterativa",
                contenido:
                  "Las estructuras de control determinan el orden de ejecución de las instrucciones. La estructura secuencial ejecuta instrucciones una tras otra. La condicional (if-then-else) permite ejecutar diferentes caminos según condiciones. La iterativa (bucles) repite instrucciones mientras se cumpla una condición. Estas tres estructuras son suficientes para resolver cualquier problema computacional (teorema de la estructura).",
              },
              {
                titulo: "Resolución de problemas paso a paso",
                contenido:
                  "La metodología de resolución de problemas en programación sigue estos pasos: 1) Comprensión del problema, 2) Análisis y descomposición en subproblemas, 3) Diseño del algoritmo, 4) Codificación, 5) Pruebas y depuración, 6) Documentación. Esta metodología sistemática es crucial para abordar problemas complejos de manera eficiente.",
              },
              {
                titulo: "Ejercicios prácticos de lógica",
                contenido:
                  "Los ejercicios prácticos incluyen problemas como: calcular el factorial de un número, determinar si un número es primo, ordenar una lista de números, encontrar el mayor común divisor, resolver series matemáticas como Fibonacci. Estos ejercicios desarrollan el pensamiento lógico y la capacidad de descomponer problemas complejos.",
              },
            ],
            ejercicios_practicos: [
              "Creación de diagramas de flujo para problemas cotidianos",
              "Desarrollo de algoritmos en pseudocódigo",
              "Resolución de problemas lógicos con diferentes enfoques",
              "Análisis de eficiencia algorítmica básica",
            ],
          },
          {
            tema: "1.3 Variables y Tipos de Datos",
            explicacion:
              "Las variables son contenedores que almacenan datos en la memoria del programa. Comprender los tipos de datos y cómo las variables los manejan es fundamental para escribir programas eficientes y sin errores.",
            subtemas: [
              {
                titulo: "Concepto de variable y constante",
                contenido:
                  "Una variable es un espacio en memoria que puede cambiar su valor durante la ejecución del programa. Las constantes mantienen su valor fijo. Las variables tienen un nombre (identificador), un tipo de dato, y un valor. Por ejemplo, 'edad = 25' declara una variable llamada 'edad' con valor 25. Las buenas prácticas incluyen usar nombres descriptivos y seguir convenciones de nomenclatura.",
              },
              {
                titulo: "Tipos de datos primitivos: números, texto, booleanos",
                contenido:
                  "Los tipos de datos primitivos son los bloques básicos: Números enteros (int) para valores como 42, -17; Números decimales (float/double) para 3.14, -2.5; Texto/cadenas (string) para 'Hola Mundo'; Booleanos (bool) para true/false. Cada tipo tiene un rango de valores y operaciones específicas. La elección correcta del tipo optimiza memoria y rendimiento.",
              },
              {
                titulo: "Declaración e inicialización de variables",
                contenido:
                  "Declarar una variable significa reservar espacio en memoria y asignarle un nombre. Inicializar significa darle un valor inicial. Ejemplo: 'int edad;' declara, 'edad = 25;' inicializa, o 'int edad = 25;' hace ambos. La inicialización es crucial para evitar errores de variables no definidas. Diferentes lenguajes tienen sintaxis específicas para esta operación.",
              },
              {
                titulo: "Operadores aritméticos, lógicos y de comparación",
                contenido:
                  "Operadores aritméticos: +, -, *, /, % (módulo). Operadores de comparación: ==, !=, <, >, <=, >=. Operadores lógicos: && (AND), || (OR), ! (NOT). La precedencia de operadores determina el orden de evaluación: paréntesis, multiplicación/división, suma/resta, comparación, lógicos. Ejemplo: 5 + 3 * 2 = 11, no 16.",
              },
              {
                titulo: "Conversión entre tipos de datos",
                contenido:
                  "La conversión puede ser implícita (automática) o explícita (manual). Implícita: 5 + 2.5 = 7.5 (entero se convierte a decimal). Explícita: int(3.7) = 3, str(42) = '42'. Las conversiones pueden causar pérdida de precisión o errores si no se manejan correctamente. Es importante validar datos antes de convertir.",
              },
            ],
            ejercicios_practicos: [
              "Declaración y uso de variables de diferentes tipos",
              "Operaciones aritméticas y lógicas complejas",
              "Conversiones seguras entre tipos de datos",
              "Debugging de errores comunes con variables",
            ],
          },
          {
            tema: "1.4 Estructuras de Control",
            explicacion:
              "Las estructuras de control permiten dirigir el flujo de ejecución del programa, creando lógica compleja a partir de instrucciones simples. Son la base para crear programas dinámicos e inteligentes.",
            subtemas: [
              {
                titulo: "Condicionales: if, else, else if",
                contenido:
                  "Las estructuras condicionales ejecutan código basado en condiciones verdaderas o falsas. 'if (condicion) { código }' ejecuta el código solo si la condición es verdadera. 'else' proporciona una alternativa cuando la condición es falsa. 'else if' permite múltiples condiciones encadenadas. Ejemplo: if (edad >= 18) { console.log('Mayor de edad'); } else { console.log('Menor de edad'); }",
              },
              {
                titulo: "Bucles: for, while, do-while",
                contenido:
                  "Los bucles repiten código mientras se cumpla una condición. 'for' es ideal cuando conocemos el número de iteraciones: for(i=0; i<10; i++). 'while' evalúa la condición antes de cada iteración: while(condicion). 'do-while' ejecuta al menos una vez antes de evaluar. Los bucles infinitos ocurren cuando la condición nunca se vuelve falsa, causando que el programa se cuelgue.",
              },
              {
                titulo: "Estructuras de control anidadas",
                contenido:
                  "Las estructuras pueden anidarse para crear lógica compleja. Un if dentro de otro if, o un bucle dentro de otro bucle. Por ejemplo, una matriz se recorre con bucles anidados: for(fila) { for(columna) { proceso elemento[fila][columna] } }. La indentación correcta es crucial para legibilidad y mantenimiento del código.",
              },
              {
                titulo: "Sentencias break y continue",
                contenido:
                  "'break' termina inmediatamente el bucle y continúa con la siguiente instrucción después del bucle. 'continue' salta la iteración actual y continúa con la siguiente. Ejemplo: en un bucle que busca un número, 'break' termina cuando lo encuentra, 'continue' salta números pares para procesar solo impares.",
              },
              {
                titulo: "Switch-case y su aplicación",
                contenido:
                  "Switch-case es una alternativa a múltiples if-else cuando comparamos una variable contra varios valores específicos. Más eficiente y legible para menús, días de la semana, etc. Cada 'case' debe terminar con 'break' para evitar ejecución de casos siguientes. 'default' maneja valores no contemplados.",
              },
            ],
            ejercicios_practicos: [
              "Implementación de calculadora con estructuras condicionales",
              "Creación de menús interactivos con switch-case",
              "Desarrollo de juegos simples con bucles",
              "Optimización de algoritmos con break y continue",
            ],
          },
        ],
        recursos: [
          "Manual de fundamentos de programación (PDF)",
          "Videos tutoriales de algoritmos",
          "Ejercicios interactivos online",
          "Simulador de pseudocódigo",
        ],
        evaluacion: "Examen teórico + 5 ejercicios prácticos",
      },
      {
        numero: 2,
        titulo: "Introducción a JavaScript",
        horas: 50,
        objetivos: [
          "Dominar la sintaxis básica de JavaScript",
          "Manejar el DOM y la interacción con páginas web",
          "Comprender la programación asíncrona",
          "Aplicar conceptos de programación orientada a objetos",
        ],
        contenidos: [
          {
            tema: "2.1 Sintaxis Básica de JavaScript",
            subtemas: [
              "Historia y evolución de JavaScript",
              "Configuración del entorno de desarrollo",
              "Variables: var, let, const",
              "Tipos de datos en JavaScript",
              "Funciones: declaración y expresión",
              "Scope y hoisting",
            ],
          },
          {
            tema: "2.2 Estructuras de Datos en JavaScript",
            subtemas: [
              "Arrays: declaración, métodos y propiedades",
              "Objetos: creación y manipulación",
              "Destructuring de arrays y objetos",
              "Spread operator y rest parameters",
              "Map, Set y otras estructuras modernas",
            ],
          },
          {
            tema: "2.3 Manipulación del DOM",
            subtemas: [
              "¿Qué es el DOM? Document Object Model",
              "Selección de elementos: getElementById, querySelector",
              "Modificación de contenido y atributos",
              "Creación y eliminación de elementos",
              "Eventos: click, submit, load, etc.",
              "Event listeners y propagación de eventos",
            ],
          },
          {
            tema: "2.4 Programación Asíncrona",
            subtemas: [
              "Concepto de asincronía en JavaScript",
              "Callbacks y callback hell",
              "Promesas: then, catch, finally",
              "Async/await: sintaxis moderna",
              "Fetch API para peticiones HTTP",
              "Manejo de errores en código asíncrono",
            ],
          },
        ],
        recursos: [
          "Documentación oficial de MDN Web Docs",
          "Ejercicios interactivos en codepen",
          "Proyectos prácticos de manipulación DOM",
          "Videos de programación asíncrona",
        ],
        evaluacion: "3 proyectos prácticos + examen de sintaxis",
      },
      {
        numero: 3,
        titulo: "HTML5 y CSS3 Avanzado",
        horas: 45,
        objetivos: [
          "Crear estructuras HTML semánticas y accesibles",
          "Aplicar estilos CSS modernos y responsive design",
          "Implementar animaciones y transiciones",
          "Optimizar el rendimiento y accesibilidad web",
        ],
        contenidos: [
          {
            tema: "3.1 HTML5 Semántico",
            subtemas: [
              "Estructura básica de un documento HTML5",
              "Etiquetas semánticas: header, nav, main, article, section",
              "Formularios HTML5: nuevos tipos de input",
              "Atributos de accesibilidad: ARIA labels",
              "Meta etiquetas para SEO",
              "Validación HTML y buenas prácticas",
            ],
          },
          {
            tema: "3.2 CSS3 Fundamentos",
            subtemas: [
              "Selectores CSS: básicos, de atributo, pseudoclases",
              "Box model: margin, padding, border",
              "Posicionamiento: static, relative, absolute, fixed",
              "Display: block, inline, inline-block, none",
              "Flexbox: flex container y flex items",
              "CSS Grid: grid container y grid items",
            ],
          },
          {
            tema: "3.3 Diseño Responsive",
            subtemas: [
              "Concepto de diseño responsive",
              "Media queries: breakpoints y viewport",
              "Mobile-first vs desktop-first",
              "Imágenes responsive",
              "Tipografía responsive",
              "Testing en diferentes dispositivos",
            ],
          },
          {
            tema: "3.4 CSS Avanzado",
            subtemas: [
              "Variables CSS (custom properties)",
              "Animaciones y transiciones",
              "Transformaciones 2D y 3D",
              "Gradientes y sombras",
              "Filtros y efectos visuales",
              "Preprocesadores CSS: introducción a SASS",
            ],
          },
        ],
        recursos: [
          "Guía completa de Flexbox y Grid",
          "Biblioteca de animaciones CSS",
          "Herramientas de testing responsive",
          "Ejemplos de diseños modernos",
        ],
        evaluacion: "Proyecto de página web responsive completa",
      },
      {
        numero: 4,
        titulo: "Frameworks y Librerías Modernas",
        horas: 60,
        objetivos: [
          "Comprender la arquitectura de componentes",
          "Desarrollar aplicaciones con React o Vue.js",
          "Manejar el estado de la aplicación",
          "Implementar enrutamiento y navegación",
        ],
        contenidos: [
          {
            tema: "4.1 Introducción a React",
            subtemas: [
              "¿Qué es React y por qué usarlo?",
              "Configuración del entorno: Create React App",
              "JSX: sintaxis y reglas",
              "Componentes funcionales y de clase",
              "Props: paso de datos entre componentes",
              "Estado local con useState",
            ],
          },
          {
            tema: "4.2 Gestión de Estado",
            subtemas: [
              "Estado local vs estado global",
              "useEffect para efectos secundarios",
              "Contexto de React: createContext y useContext",
              "Introducción a Redux (opcional)",
              "Patrones de estado: lifting state up",
              "Custom hooks",
            ],
          },
          {
            tema: "4.3 Enrutamiento y Navegación",
            subtemas: [
              "React Router: configuración básica",
              "Rutas dinámicas y parámetros",
              "Navegación programática",
              "Protección de rutas",
              "Lazy loading de componentes",
              "Manejo de errores 404",
            ],
          },
          {
            tema: "4.4 Integración con APIs",
            subtemas: [
              "Consumo de APIs REST",
              "Axios vs Fetch",
              "Manejo de estados de carga",
              "Gestión de errores de red",
              "Optimización de peticiones",
              "Testing de integración",
            ],
          },
        ],
        recursos: [
          "Documentación oficial de React",
          "Proyectos de ejemplo en GitHub",
          "Videos tutoriales avanzados",
          "Plantillas de aplicaciones React",
        ],
        evaluacion: "Aplicación web completa con React",
      },
      {
        numero: 5,
        titulo: "Backend y Bases de Datos",
        horas: 45,
        objetivos: [
          "Comprender la arquitectura cliente-servidor",
          "Desarrollar APIs REST con Node.js",
          "Manejar bases de datos relacionales y no relacionales",
          "Implementar autenticación y autorización",
        ],
        contenidos: [
          {
            tema: "5.1 Introducción al Backend",
            subtemas: [
              "Arquitectura cliente-servidor",
              "Protocolos HTTP/HTTPS",
              "APIs REST: conceptos y principios",
              "Códigos de estado HTTP",
              "Herramientas de testing: Postman",
              "Documentación de APIs",
            ],
          },
          {
            tema: "5.2 Node.js y Express",
            subtemas: [
              "¿Qué es Node.js? Event loop",
              "NPM: gestión de paquetes",
              "Express.js: framework web minimalista",
              "Middlewares y su funcionamiento",
              "Rutas y controladores",
              "Manejo de errores",
            ],
          },
          {
            tema: "5.3 Bases de Datos",
            subtemas: [
              "Bases de datos relacionales vs no relacionales",
              "SQL básico: SELECT, INSERT, UPDATE, DELETE",
              "MongoDB: documentos y colecciones",
              "ORMs: Mongoose para MongoDB",
              "Diseño de esquemas de base de datos",
              "Migraciones y seeders",
            ],
          },
          {
            tema: "5.4 Autenticación y Seguridad",
            subtemas: [
              "Conceptos de autenticación vs autorización",
              "JWT: JSON Web Tokens",
              "Hashing de contraseñas: bcrypt",
              "Middleware de autenticación",
              "CORS: Cross-Origin Resource Sharing",
              "Validación de datos de entrada",
            ],
          },
        ],
        recursos: [
          "Documentación de Node.js y Express",
          "Tutoriales de bases de datos",
          "Ejemplos de APIs REST",
          "Guías de seguridad web",
        ],
        evaluacion: "API REST completa con autenticación",
      },
    ],
    proyecto_final: {
      titulo: "Aplicación Web Full Stack",
      descripcion:
        "Desarrollo de una aplicación web completa que integre frontend y backend",
      requisitos: [
        "Frontend desarrollado en React con al menos 5 componentes",
        "Backend con API REST en Node.js/Express",
        "Base de datos MongoDB con al menos 3 colecciones",
        "Sistema de autenticación de usuarios",
        "Diseño responsive y accesible",
        "Documentación técnica del proyecto",
        "Despliegue en plataforma cloud (Heroku, Netlify, etc.)",
      ],
      entregables: [
        "Código fuente en repositorio Git",
        "Aplicación desplegada y funcional",
        "Documentación técnica (README)",
        "Video demostración (5-10 minutos)",
        "Presentación final del proyecto",
      ],
      criterios_evaluacion: [
        "Funcionalidad completa (25%)",
        "Calidad del código (25%)",
        "Diseño y UX (20%)",
        "Documentación (15%)",
        "Presentación (15%)",
      ],
    },
    requisitos_tecnicos: [
      "Ordenador con acceso a internet",
      "Navegador web moderno (Chrome, Firefox, Safari)",
      "Editor de código (VS Code recomendado)",
      "Cuenta en GitHub para control de versiones",
    ],
    certificacion: {
      requisitos: [
        "Asistencia mínima del 80% a las clases",
        "Aprobación de todos los exámenes con nota ≥ 7",
        "Entrega y aprobación del proyecto final",
        "Participación activa en foros y actividades",
      ],
      beneficios: [
        "Certificado oficial de programador",
        "Validez en el mercado laboral español",
        "Acceso a bolsa de empleo exclusiva",
        "Actualizaciones gratuitas del curso durante 1 año",
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/cursos")}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a cursos
          </Button>

          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-8 border border-blue-500/30">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{course.image}</div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {course.name}
              </h1>
              <p className="text-xl text-blue-300 mb-4">{course.subtitle}</p>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Badge className="bg-blue-500/20 text-blue-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.duration}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {course.difficulty}
                </Badge>
                <Badge className="bg-green-500/20 text-green-400">
                  <Award className="w-3 h-3 mr-1" />
                  Certificado Oficial
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  <Star className="w-3 h-3 mr-1" />
                  {course.price}
                </Badge>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Descargar Temario PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Índice General */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              📋 ÍNDICE GENERAL DEL CURSO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-slate-300">
              <div>
                <h3 className="font-semibold text-blue-400 mb-3">
                  INFORMACIÓN GENERAL
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>• Objetivos del curso</li>
                  <li>• Metodología de enseñanza</li>
                  <li>• Sistema de evaluación</li>
                  <li>• Requisitos técnicos</li>
                  <li>• Certificación</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-3">
                  MÓDULOS FORMATIVOS
                </h3>
                <ul className="space-y-1 text-sm">
                  {temarioProgramacion.modulos.map((modulo, index) => (
                    <li key={index}>
                      • Módulo {modulo.numero}: {modulo.titulo} ({modulo.horas}
                      h)
                    </li>
                  ))}
                  <li>• Proyecto Final Integrador</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objetivos */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              🎯 OBJETIVOS GENERALES DEL CURSO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {temarioProgramacion.objetivos.map((objetivo, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300">{objetivo}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Metodología */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              📚 METODOLOGÍA DE ENSEÑANZA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-400 mb-3">
                  ENFOQUE PEDAGÓGICO
                </h3>
                <ul className="space-y-2">
                  {temarioProgramacion.metodologia.map((metodo, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-slate-300 text-sm">{metodo}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-3">
                  SISTEMA DE EVALUACIÓN
                </h3>
                <ul className="space-y-2">
                  {temarioProgramacion.evaluacion.map((eval_, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span className="text-slate-300 text-sm">{eval_}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Módulos Detallados */}
        {temarioProgramacion.modulos.map((modulo, index) => (
          <Card key={index} className="mb-8 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                📘 MÓDULO {modulo.numero}: {modulo.titulo}
              </CardTitle>
              <div className="flex gap-4 text-sm">
                <Badge className="bg-blue-500/20 text-blue-400">
                  {modulo.horas} horas académicas
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
                  {modulo.contenidos.length} temas
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Objetivos del módulo */}
              <div>
                <h3 className="font-semibold text-green-400 mb-3">
                  OBJETIVOS ESPECÍFICOS
                </h3>
                <ul className="grid gap-2">
                  {modulo.objetivos.map((objetivo, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{objetivo}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contenidos detallados */}
              <div>
                <h3 className="font-semibold text-yellow-400 mb-3">
                  CONTENIDOS TEMÁTICOS
                </h3>
                {modulo.contenidos.map((contenido, idx) => (
                  <div
                    key={idx}
                    className="mb-4 bg-slate-700/30 p-4 rounded-lg"
                  >
                    <h4 className="font-semibold text-white mb-2">
                      {contenido.tema}
                    </h4>
                    <div className="space-y-3">
                      {contenido.subtemas ? (
                        contenido.subtemas.map((subtema, subIdx) => (
                          <div
                            key={subIdx}
                            className="bg-slate-600/20 p-3 rounded"
                          >
                            <h5 className="text-blue-300 font-semibold text-sm mb-1">
                              {typeof subtema === "string"
                                ? subtema
                                : subtema.titulo}
                            </h5>
                            {typeof subtema === "object" &&
                              subtema.contenido && (
                                <p className="text-slate-300 text-xs">
                                  {subtema.contenido}
                                </p>
                              )}
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 text-sm">
                          Contenido en desarrollo...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recursos */}
              <div>
                <h3 className="font-semibold text-cyan-400 mb-3">
                  RECURSOS DIDÁCTICOS
                </h3>
                <ul className="grid gap-2">
                  {modulo.recursos.map((recurso, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{recurso}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evaluación */}
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                <h3 className="font-semibold text-red-400 mb-2">
                  EVALUACIÓN DEL MÓDULO
                </h3>
                <p className="text-slate-300 text-sm">{modulo.evaluacion}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Proyecto Final */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              🏆 PROYECTO FINAL INTEGRADOR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">
                {temarioProgramacion.proyecto_final.titulo}
              </h3>
              <p className="text-slate-300 mb-4">
                {temarioProgramacion.proyecto_final.descripcion}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-400 mb-3">
                  REQUISITOS TÉCNICOS
                </h4>
                <ul className="space-y-1">
                  {temarioProgramacion.proyecto_final.requisitos.map(
                    (req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1 text-xs">▸</span>
                        <span className="text-slate-300 text-sm">{req}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-green-400 mb-3">
                  ENTREGABLES
                </h4>
                <ul className="space-y-1">
                  {temarioProgramacion.proyecto_final.entregables.map(
                    (ent, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1 text-xs">▸</span>
                        <span className="text-slate-300 text-sm">{ent}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-yellow-400 mb-3">
                CRITERIOS DE EVALUACIÓN
              </h4>
              <ul className="space-y-1">
                {temarioProgramacion.proyecto_final.criterios_evaluacion.map(
                  (crit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1 text-xs">▸</span>
                      <span className="text-slate-300 text-sm">{crit}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Certificación */}
        <Card className="mb-8 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              🎓 CERTIFICACIÓN PROFESIONAL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-400 mb-3">
                  REQUISITOS PARA CERTIFICAR
                </h4>
                <ul className="space-y-2">
                  {temarioProgramacion.certificacion.requisitos.map(
                    (req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{req}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-3">
                  BENEFICIOS DEL CERTIFICADO
                </h4>
                <ul className="space-y-2">
                  {temarioProgramacion.certificacion.beneficios.map(
                    (ben, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{ben}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requisitos Técnicos */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              💻 REQUISITOS TÉCNICOS Y RECOMENDACIONES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {temarioProgramacion.requisitos_tecnicos.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span className="text-slate-300">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Footer de acción */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">
              ¿Listo para comenzar tu carrera en programación?
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                <GraduationCap className="w-4 h-4 mr-2" />
                Matricularme Ahora
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Users className="w-4 h-4 mr-2" />
                Hablar con Asesor
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </div>

        {/* TABS DEL CURSO - Chat, Tests, Flashcards, etc. */}
        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700">
              <TabsTrigger value="temario" className="text-slate-300">
                <BookOpen className="w-4 h-4 mr-2" />
                Temario Completo
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-slate-300">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat IA
              </TabsTrigger>
              <TabsTrigger value="tests" className="text-slate-300">
                <FileQuestion className="w-4 h-4 mr-2" />
                Tests
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="text-slate-300">
                <Zap className="w-4 h-4 mr-2" />
                Flashcards
              </TabsTrigger>
              <TabsTrigger value="progreso" className="text-slate-300">
                <Trophy className="w-4 h-4 mr-2" />
                Progreso
              </TabsTrigger>
            </TabsList>

            <TabsContent value="temario" className="mt-6">
              <Card className="bg-green-900/20 border-green-500/30">
                <CardContent className="p-6">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      ✅ Temario Académico Completo Mostrado Arriba
                    </h3>
                    <p className="text-green-300">
                      El temario completo y extenso de la academia está visible
                      en la sección superior de esta página. Incluye 5 módulos
                      detallados con 240 horas académicas de contenido
                      profesional.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              <BlurredPreview
                isLocked={true}
                title="Chat IA Especializado en Programación"
                description="Accede a nuestro asistente de IA especializado en programación"
                unlockButtonText="Desbloquear Chat IA"
                blurLevel="medium"
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      💬 Chat IA Especializado en Programación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-slate-300">
                        Accede a nuestro asistente de IA especializado en
                        programación para resolver dudas específicas del curso.
                      </p>
                      <div className="bg-slate-700/30 p-4 rounded">
                        <p className="text-slate-400 text-sm">
                          🤖 IA: ¡Hola! Soy tu asistente especializado en
                          programación. Puedo ayudarte con:
                        </p>
                        <ul className="mt-2 text-slate-400 text-sm space-y-1">
                          <li>• Explicación de conceptos de programación</li>
                          <li>• Debugging y solución de errores</li>
                          <li>• Mejores prácticas de código</li>
                          <li>• Revisión de algoritmos</li>
                        </ul>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Iniciar Chat con IA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </BlurredPreview>
            </TabsContent>

            <TabsContent value="tests" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    📝 Tests y Evaluaciones por Módulo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-300">
                      Evalúa tu progreso con tests específicos para cada módulo
                      del curso.
                    </p>
                    <div className="grid gap-4">
                      {temarioProgramacion.modulos.map((modulo, index) => (
                        <div
                          key={index}
                          className="bg-slate-700/30 p-4 rounded flex items-center justify-between"
                        >
                          <div>
                            <h4 className="text-white font-semibold">
                              Test Módulo {modulo.numero}: {modulo.titulo}
                            </h4>
                            <p className="text-slate-400 text-sm">
                              20 preguntas • {modulo.horas} horas de contenido
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Hacer Test
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flashcards" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    🃏 Flashcards para Estudio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-300">
                      Repasa conceptos clave con nuestras flashcards
                      interactivas organizadas por módulo.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {temarioProgramacion.modulos.map((modulo, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded border border-purple-500/30"
                        >
                          <h4 className="text-white font-semibold mb-2">
                            {modulo.titulo}
                          </h4>
                          <p className="text-purple-300 text-sm mb-3">
                            15 flashcards • Conceptos clave
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-purple-500 text-purple-300"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Estudiar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progreso" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    🏆 Progreso y Logros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-semibold mb-3">
                        Progreso General del Curso
                      </h3>
                      <div className="bg-slate-700/30 p-4 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-300">Progreso Total</span>
                          <span className="text-blue-400 font-semibold">
                            0%
                          </span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "0%" }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-3">
                        Logros Disponibles
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-slate-700/30 p-3 rounded flex items-center gap-3">
                          <Trophy className="w-8 h-8 text-yellow-400" />
                          <div>
                            <p className="text-white font-semibold">
                              Primer Paso
                            </p>
                            <p className="text-slate-400 text-sm">
                              Completa el primer módulo
                            </p>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 p-3 rounded flex items-center gap-3">
                          <Award className="w-8 h-8 text-purple-400" />
                          <div>
                            <p className="text-white font-semibold">
                              Programador Junior
                            </p>
                            <p className="text-slate-400 text-sm">
                              Completa 3 módulos
                            </p>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 p-3 rounded flex items-center gap-3">
                          <Star className="w-8 h-8 text-blue-400" />
                          <div>
                            <p className="text-white font-semibold">Experto</p>
                            <p className="text-slate-400 text-sm">
                              Completa todos los módulos
                            </p>
                          </div>
                        </div>
                        <div className="bg-slate-700/30 p-3 rounded flex items-center gap-3">
                          <GraduationCap className="w-8 h-8 text-green-400" />
                          <div>
                            <p className="text-white font-semibold">
                              Certificado
                            </p>
                            <p className="text-slate-400 text-sm">
                              Completa el proyecto final
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
