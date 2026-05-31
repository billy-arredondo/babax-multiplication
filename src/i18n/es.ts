export const es = {
  // App-level
  appTitle: 'Tablas de Multiplicar',
  appSubtitle: '¡Practica y diviértete!',

  // Language toggle
  langToggle: 'EN',

  // Admin screen
  adminTitle: 'Configurar evaluación',
  selectTables: 'Selecciona las tablas',
  selectAll: 'Todas',
  clearAll: 'Ninguna',
  questionCount: 'Cantidad de preguntas',
  customCount: 'Personalizado',
  customPlaceholder: 'Ej. 12',
  answerType: 'Tipo de respuesta',
  multipleChoice: '4 opciones',
  keypadInput: 'Teclado numérico',
  timerSection: 'Temporizador',
  timerOff: 'Sin límite',
  timerOn: 'Con límite',
  difficulty: 'Dificultad',
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
  estimatedTime: 'Tiempo estimado',
  startGame: '¡Empezar!',
  startDisabled: 'Elige al menos una tabla',
  viewHistory: 'Ver historial',

  // Player screen
  question: 'Pregunta',
  of: 'de',
  pause: 'Pausa',
  resume: 'Continuar',
  stop: 'Detener',
  confirm: 'Confirmar',
  delete: 'Borrar',
  paused: '— En pausa —',
  timeLeft: 'Tiempo restante',
  elapsed: 'Tiempo',

  // Feedback
  correct: '¡Correcto! 🎉',
  incorrect: 'Incorrecto 😅',
  correctAnswer: 'La respuesta correcta era',

  // Results screen
  resultsTitle: '¡Terminaste!',
  totalQuestions: 'Preguntas',
  correctAnswers: 'Correctas',
  incorrectAnswers: 'Incorrectas',
  accuracy: 'Aciertos',
  timeUsed: 'Tiempo usado',
  failedTitle: 'Preguntas falladas',
  yourAnswer: 'Tu respuesta',
  correctAns: 'Correcta',
  noFailed: '¡Sin errores! 🏆',
  playAgain: 'Repetir',
  newGame: 'Nueva configuración',
  goHistory: 'Ver historial',

  // Motivational messages by accuracy bracket
  motivational100: '¡Perfecto! ¡Eres una campeona! 🏆',
  motivational80: '¡Excelente trabajo! ¡Casi perfecta! ⭐⭐⭐',
  motivational60: '¡Muy bien! ¡Sigue practicando! ⭐⭐',
  motivational40: '¡Buen intento! ¡La práctica hace al maestro! ⭐',
  motivational0: '¡No te rindas! ¡La próxima vez lo harás mejor! 💪',

  // History screen
  historyTitle: 'Historial de partidas',
  historyEmpty: 'Aún no hay partidas guardadas.',
  historyDate: 'Fecha',
  historyTables: 'Tablas',
  historyScore: 'Puntaje',
  historyTime: 'Tiempo',
  clearHistory: 'Borrar historial',
  backToAdmin: '← Volver',
  confirmClear: '¿Borrar todo el historial?',
} as const;

export type TranslationKey = keyof typeof es;
