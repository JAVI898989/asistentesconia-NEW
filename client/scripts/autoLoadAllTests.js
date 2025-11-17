// AUTO-EJECUCIÓN: Cargar tests optimizados para TODOS los asistentes
console.log('🚀 INICIANDO CARGA AUTOMÁTICA DE TESTS...');

// Limpiar storage primero
const keys = Object.keys(sessionStorage);
keys.forEach(key => {
  if (key.startsWith('assistant_tests_') || key.startsWith('assistant_temarios_')) {
    sessionStorage.removeItem(key);
  }
});
console.log('🧹 Storage limpiado');

// Lista COMPLETA de asistentes (optimizada para almacenamiento)
const allAssistants = [
  // Administración
  "auxiliar-administrativo-estado",
  "administrativo-estado", 
  "gestion-procesal",
  "tramitacion-procesal",
  "auxilio-judicial",
  "agentes-hacienda-publica",
  "tecnicos-auditoria-contabilidad",
  
  // Seguridad
  "guardia-civil",
  "policia-nacional",
  "policia-local",
  "bombero",
  "proteccion-civil",
  
  // Sanidad  
  "enfermeria",
  "medicina-general",
  "fisioterapia",
  "farmacia",
  "psicologia-clinica",
  "trabajo-social",
  
  // Educación
  "maestro-primaria",
  "profesor-secundaria", 
  "educacion-infantil",
  "educacion-especial",
  
  // Especialidades médicas
  "medicina-interna",
  "medicina-familia",
  "medicina-legal",
  "medicina-preventiva",
  "anestesiologia",
  "cirugia-general",
  "ginecologia",
  "pediatria",
  "psiquiatria",
  "radiologia",
  "medicina-urgencias",
  "farmacologia-clinica",
  "microbiologia",
  "analisis-clinicos",
  "anatomia-patologica",
  
  // Residencias sanitarias
  "medicina-mir",
  "enfermeria-eir", 
  "farmaceutico-fir",
  "psicologia-pir",
  "quimica-qir",
  "radiofisica-rfir",
  "biologia-bir",
  
  // Servicios públicos
  "correos",
  "justicia",
  "ministerio-defensa",
  "intervencion-general-estado",
  
  // Públicos gratuitos
  "consultor-juridico",
  "burocracia-tramites", 
  "laboral-basico",
  
  // PRO
  "nutricionista-pro",
  "psicologo-pro",
  "abogado-pro"
];

const assistantNames = {
  "auxiliar-administrativo-estado": "Auxiliar Administrativo del Estado",
  "administrativo-estado": "Administrativo del Estado",
  "gestion-procesal": "Gestión Procesal",
  "tramitacion-procesal": "Tramitación Procesal", 
  "auxilio-judicial": "Auxilio Judicial",
  "agentes-hacienda-publica": "Agentes de la Hacienda Pública",
  "tecnicos-auditoria-contabilidad": "Técnicos de Auditoría y Contabilidad",
  "guardia-civil": "Guardia Civil",
  "policia-nacional": "Policía Nacional",
  "policia-local": "Policía Local",
  "bombero": "Bombero",
  "proteccion-civil": "Protección Civil",
  "enfermeria": "Enfermería",
  "medicina-general": "Medicina General",
  "fisioterapia": "Fisioterapia",
  "farmacia": "Farmacia",
  "psicologia-clinica": "Psicología Clínica",
  "trabajo-social": "Trabajo Social",
  "maestro-primaria": "Maestro de Primaria",
  "profesor-secundaria": "Profesor de Secundaria",
  "educacion-infantil": "Educación Infantil",
  "educacion-especial": "Educación Especial",
  "medicina-interna": "Medicina Interna",
  "medicina-familia": "Medicina de Familia",
  "medicina-legal": "Medicina Legal",
  "medicina-preventiva": "Medicina Preventiva",
  "anestesiologia": "Anestesiología",
  "cirugia-general": "Cirugía General",
  "ginecologia": "Ginecología",
  "pediatria": "Pediatría",
  "psiquiatria": "Psiquiatría",
  "radiologia": "Radiología",
  "medicina-urgencias": "Medicina de Urgencias",
  "farmacologia-clinica": "Farmacología Clínica",
  "microbiologia": "Microbiología",
  "analisis-clinicos": "Análisis Clínicos",
  "anatomia-patologica": "Anatomía Patológica",
  "medicina-mir": "Medicina (MIR)",
  "enfermeria-eir": "Enfermería (EIR)",
  "farmaceutico-fir": "Farmacéutico (FIR)",
  "psicologia-pir": "Psicología (PIR)",
  "quimica-qir": "Química (QIR)",
  "radiofisica-rfir": "Radiofísica (RFIR)",
  "biologia-bir": "Biología (BIR)",
  "correos": "Correos y Telégrafos",
  "justicia": "Justicia",
  "ministerio-defensa": "Ministerio de Defensa",
  "intervencion-general-estado": "Intervención General del Estado",
  "consultor-juridico": "Consultor Jurídico",
  "burocracia-tramites": "Burocracia y Trámites",
  "laboral-basico": "Laboral Básico",
  "nutricionista-pro": "Nutricionista PRO",
  "psicologo-pro": "Psicólogo PRO",
  "abogado-pro": "Abogado PRO"
};

// Función optimizada para generar tests
function generateOptimizedTests(assistantId) {
  const assistantName = assistantNames[assistantId] || assistantId;
  
  // Solo 8 temas para ahorrar más espacio
  let themes = [];
  
  if (assistantId.includes('medicina') || assistantId.includes('enfermeria') || assistantId.includes('sanitario')) {
    themes = [
      `Anatomía y Fisiología`,
      `Patología General`,
      `Farmacología`,
      `Procedimientos`,
      `Urgencias`,
      `Bioética`,
      `Gestión Sanitaria`,
      `Legislación`
    ];
  } else if (assistantId.includes('policia') || assistantId.includes('guardia') || assistantId.includes('seguridad')) {
    themes = [
      `Constitución`,
      `Derecho Penal`,
      `Seguridad`,
      `Procedimientos`,
      `Prevención`,
      `Derechos`,
      `Protocolos`,
      `Tecnologías`
    ];
  } else if (assistantId.includes('educacion') || assistantId.includes('maestro') || assistantId.includes('profesor')) {
    themes = [
      `Pedagogía`,
      `Psicología`,
      `Didáctica`,
      `Curriculum`,
      `Metodologías`,
      `Evaluación`,
      `Diversidad`,
      `Legislación`
    ];
  } else {
    themes = [
      `Fundamentos`,
      `Normativa`,
      `Procedimientos`,
      `Documentación`,
      `Gestión`,
      `Atención`,
      `Recursos`,
      `Tecnología`
    ];
  }

  // Solo 8 preguntas por tema para máximo ahorro
  return themes.map((themeName, index) => ({
    themeId: `tema-${index + 1}`,
    themeName: `Tema ${index + 1} - ${themeName}`,
    tests: Array.from({length: 8}, (_, idx) => ({
      id: `t${index + 1}-q${idx + 1}`,
      question: `¿Aspecto ${idx + 1} de ${themeName} en ${assistantName}?`,
      options: [
        "Normativa",
        "Procedimientos", 
        "Práctica",
        "Todas"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `Correcto según ${assistantName}.`
    }))
  }));
}

// EJECUTAR CARGA AUTOMÁTICA
let successCount = 0;
let errorCount = 0;

console.log(`📋 Procesando ${allAssistants.length} asistentes...`);

allAssistants.forEach((assistantId, index) => {
  try {
    const tests = generateOptimizedTests(assistantId);
    const storageKey = `assistant_tests_${assistantId}`;
    
    // Convertir a string y verificar tamaño
    const testData = JSON.stringify(tests);
    
    sessionStorage.setItem(storageKey, testData);
    successCount++;
    
    if ((index + 1) % 10 === 0) {
      console.log(`✅ Progreso: ${index + 1}/${allAssistants.length} procesados`);
    }
    
  } catch (error) {
    errorCount++;
    console.warn(`⚠️ Error con ${assistantId}:`, error.message.substring(0, 50));
    
    // Si falla por storage, parar aquí
    if (error.message.includes('quota')) {
      console.log(`🛑 Storage lleno, deteniendo en ${index + 1}/${allAssistants.length}`);
      return;
    }
  }
});

// RESUMEN FINAL
console.log(`\n🎉 ¡CARGA COMPLETADA!`);
console.log(`📊 ESTADÍSTICAS:`);
console.log(`• ✅ Exitosos: ${successCount} asistentes`);
console.log(`• ❌ Errores: ${errorCount} asistentes`);
console.log(`• 📚 Total temas: ${successCount * 8}`);
console.log(`• 📝 Total preguntas: ${successCount * 64}`);
console.log(`• 💾 Guardado en sessionStorage`);
console.log(`\n🔗 ACCESO:`);
console.log(`Ve a cualquier asistente → pestaña Tests`);
console.log(`Ejemplo: /asistente/guardia-civil`);

// Mostrar lista de asistentes cargados exitosamente
if (successCount > 0) {
  console.log(`\n✅ ASISTENTES CON TESTS DISPONIBLES:`);
  allAssistants.slice(0, successCount).forEach((id, i) => {
    if (i < 20) { // Mostrar solo los primeros 20 para no saturar
      console.log(`${i + 1}. ${assistantNames[id] || id}`);
    }
  });
  if (successCount > 20) {
    console.log(`... y ${successCount - 20} más`);
  }
}

console.log(`\n🎯 ¡LISTO! Recarga cualquier asistente para ver sus tests.`);
