import { HistoricalSample, SearchItem, VAERecipe } from '../types';

export const R_GAS = 8.314; // J/(mol*K)
export const EA_DISOLUCION = 40000; // J/mol (40 kJ/mol)
export const A_DISOLUCION = 1.0e5; // min^-1
export const EA_DEGRADACION = 70000; // J/mol (70 kJ/mol)
export const A_DEGRADACION = 5.2e6; // min^-1

export const HISTORIAL_MUESTRAS: HistoricalSample[] = [
  { id: "EXP-01", znRatio: 1.0, temp: 25, tiempo: 60, estiraje: 1.2, cel: 100, ten: 18.5, mod: 4.5, elo: 14.2, dp: 950, cri: 58 },
  { id: "EXP-02", znRatio: 1.0, temp: 45, tiempo: 60, estiraje: 1.4, cel: 100, ten: 24.2, mod: 5.8, elo: 12.4, dp: 520, cri: 54 },
  { id: "EXP-03", znRatio: 1.2, temp: 60, tiempo: 45, estiraje: 1.6, cel: 100, ten: 26.8, mod: 6.4, elo: 11.0, dp: 430, cri: 51 },
  { id: "EXP-04", znRatio: 0.8, temp: 45, tiempo: 90, estiraje: 1.3, cel: 100, ten: 20.1, mod: 4.9, elo: 13.8, dp: 610, cri: 56 },
  { id: "EXP-05", znRatio: 1.5, temp: 75, tiempo: 60, estiraje: 1.5, cel: 80,  ten: 16.2, mod: 4.1, elo: 8.5,  dp: 280, cri: 44 },
  { id: "EXP-06", znRatio: 1.0, temp: 85, tiempo: 120, estiraje: 1.1, cel: 100, ten: 9.8,  mod: 2.5, elo: 5.2,  dp: 165, cri: 38 },
  { id: "EXP-07", znRatio: 1.0, temp: 50, tiempo: 50, estiraje: 1.5, cel: 90,  ten: 25.1, mod: 6.0, elo: 11.8, dp: 480, cri: 53 }
];

export const RECETAS_VAE_PRESET: VAERecipe[] = [
  {
    id: 'gen-01',
    nombre: 'Receta Gen-01 (Alta Tenacidad)',
    desc: 'Optimizada para confección de uniformes ignífugos de faena pesada',
    ratioZn: 1.05,
    temp: 48,
    tiempo: 55,
    estiraje: 1.65,
    cel: 100,
    ten: 27.4,
    mod: 6.8,
    elo: 11.2,
    dp: 510,
    cri: 56,
    co2: 1.75
  },
  {
    id: 'gen-02',
    nombre: 'Receta Gen-02 (Eco-Eficiente / Bajo Calor)',
    desc: 'Minimiza consumo energético industrial a 35°C',
    ratioZn: 1.15,
    temp: 35,
    tiempo: 75,
    estiraje: 1.40,
    cel: 100,
    ten: 23.8,
    mod: 5.4,
    elo: 13.0,
    dp: 680,
    cri: 55,
    co2: 1.32
  },
  {
    id: 'gen-03',
    nombre: 'Receta Gen-03 (Mezcla Industrial Poliéster/Algodón)',
    desc: 'Formulación para separación selectiva y regeneración con 30% PET',
    ratioZn: 0.95,
    temp: 55,
    tiempo: 60,
    estiraje: 1.50,
    cel: 70,
    ten: 21.5,
    mod: 5.1,
    elo: 10.5,
    dp: 420,
    cri: 48,
    co2: 2.10
  }
];

export const FUNDAMENTOS_FISICOQUIMICOS_INTERNOS = [
  { id: "WernerLewis", titulo: 'Teoría de Solvatación de Werner-Lewis', texto: 'Coordinación electrófila de especies [Zn(H₂O)ₙClₘ]²⁻ᵐ sobre pares de electrones libres en C2, C3 y C6 del anillo de D-glucopiranosa, quebrando los puentes de H intra e intermoleculares.' },
  { id: "EkenstamKin", titulo: 'Cinética de Ruptura Glucosídica de Ekenstam', texto: 'Modelo de despolimerización de orden cero para la escisión aleatoria de enlaces β-1,4: (1/DP_t) - (1/DP_0) = k_deg · t, catalizada por la acidez de Brønsted del medio.' },
  { id: "ArrheniusEq", titulo: 'Ecuación Termoquímica de Arrhenius', texto: 'Dependencia térmica de las velocidades de reacción: k(T) = A · exp(-Ea / RT), con Ea_disolución = 40.0 kJ/mol y Ea_degradación = 70.0 kJ/mol.' },
  { id: "FloryHuggins", titulo: 'Termodinámica de Mezclas de Flory-Huggins', texto: 'Energía libre de mezclado ΔG_m = RT[n₁ ln φ₁ + n₂ ln φ₂ + χ₁₂ φ₁ φ₂] y transición de fase de Celulosa I nativa (red paralela) a Celulosa II regenerada (red antiparalela).' },
  { id: "RheologySpinn", titulo: 'Reología No Newtoniana y Orientación Macromolecular', texto: 'Comportamiento pseudoplástico (shear-thinning) del dope en tobera y alineación uniaxial inducida por relación de estiraje mecánico λ.' },
  { id: "ISO14044_LCA", titulo: 'Evaluación de Ciclo de Vida (ISO 14044)', texto: 'Modelo de contabilidad de carbono cradle-to-gate para cuantificación de emisiones de GEI y análisis de sostenibilidad en reciclaje textil circular.' }
];

export const REFERENCIAS_APA = FUNDAMENTOS_FISICOQUIMICOS_INTERNOS;

export const CATALOGO_BUSQUEDA: SearchItem[] = [
  // Módulos
  { id: 'm-sim', title: 'Simulador Fisicoquímico & GNN', subtitle: 'Ajuste interactivo de variables operativas de disolución y predicción en tiempo real', category: 'módulo', tabId: 'simulador', badge: 'Módulo 1' },
  { id: 'm-inv', title: 'Ingeniería Inversa de Textiles', subtitle: 'Deducción de variables químicas de proceso a partir de prendas terminadas o recicladas', category: 'módulo', tabId: 'inverso', badge: 'Módulo 2' },
  { id: 'm-gra', title: 'Simulación Interactiva de Grafos', subtitle: 'Exploración molecular en tiempo real, diagrama de planta y Message Passing GNN', category: 'módulo', tabId: 'grafos', badge: 'Módulo 3' },
  { id: 'm-cin', title: 'Cinética de Arrhenius & Ventana DP', subtitle: 'Constante cinética de solvatación y degradación hidrolítica de Ekenstam', category: 'módulo', tabId: 'cinetica', badge: 'Módulo 4' },
  { id: 'm-gen', title: 'IA Generativa (VAE - Recetas)', subtitle: 'Exploración del espacio latente 2D y diseño inverso de formulaciones químicas', category: 'módulo', tabId: 'generativo', badge: 'Módulo 5' },
  { id: 'm-mul', title: 'Optimización Circular (TEA / LCA)', subtitle: 'Frente de Pareto: Tenacidad vs Huella de Carbono y análisis tecnoeconómico', category: 'módulo', tabId: 'multiobjetivo', badge: 'Módulo 6' },
  { id: 'm-fed', title: 'Aprendizaje Federado (FedGNN)', subtitle: 'Entrenamiento multicliente con preservación de privacidad diferencial', category: 'módulo', tabId: 'federado', badge: 'Módulo 7' },
  { id: 'm-val', title: 'Validación Científica (MAPE ≤ 15%)', subtitle: 'Dispersión medido vs predicho y auditoría de métricas de convocatoria', category: 'módulo', tabId: 'validacion', badge: 'Módulo 8' },
  { id: 'm-inf', title: 'Dictamen Técnico Exportable (APA 7a Ed.)', subtitle: 'Informe completo para exportación/impresión directa en PDF', category: 'módulo', tabId: 'informe', badge: 'Módulo 9' },

  // Variables y Parámetros
  { id: 'v-zn', title: 'Relación Molar ZnCl₂ en DES', subtitle: 'Parámetro de acidez de Lewis (0.50 a 2.00 mol/mol) para disolver celulosa', category: 'variable', tabId: 'simulador', badge: 'Parámetro', actionParams: { znRatio: 1.10 } },
  { id: 'v-temp', title: 'Temperatura del Reactor (°C)', subtitle: 'Control térmico de solvatación e hidrólisis ácida (20 a 90 °C)', category: 'variable', tabId: 'simulador', badge: 'Parámetro', actionParams: { temp: 50 } },
  { id: 'v-time', title: 'Tiempo de Residencia / Agitación (min)', subtitle: 'Cinética de residencia en reactor (15 a 180 min)', category: 'variable', tabId: 'simulador', badge: 'Parámetro', actionParams: { tiempo: 60 } },
  { id: 'v-est', title: 'Relación de Estiraje en Hilatura (λ)', subtitle: 'Orientación axial molecular del filamento regenerado (1.00 a 2.50)', category: 'variable', tabId: 'simulador', badge: 'Parámetro', actionParams: { estiraje: 1.60 } },
  { id: 'v-cel', title: 'Contenido de Celulosa en Residuo (%)', subtitle: 'Proporción de algodón puro vs mezclas sintéticas (50 a 100%)', category: 'variable', tabId: 'simulador', badge: 'Parámetro', actionParams: { cel: 100 } },
  { id: 'v-ten', title: 'Tenacidad a Tracción (cN/tex)', subtitle: 'Resistencia mecánica objetivo (20 a 30 cN/tex para hilatura húmeda)', category: 'variable', tabId: 'simulador', badge: 'KPI' },
  { id: 'v-dp', title: 'Grado de Polimerización (DP)', subtitle: 'Ventana macromolecular de seguridad (350 a 650 DP)', category: 'variable', tabId: 'cinetica', badge: 'KPI' },
  { id: 'v-cri', title: 'Cristalinidad Celulosa II (XRD %)', subtitle: 'Alomorfo regenerado medido por difracción de rayos X (45 a 60%)', category: 'variable', tabId: 'simulador', badge: 'Estructura' },

  // Ecuaciones
  { id: 'e-arr', title: 'Ecuación de Arrhenius (Solvatación DES)', subtitle: 'k_dis = A · exp(-Ea / RT), con Ea = 40 kJ/mol y A = 1.0e5 min⁻¹', category: 'ecuación', tabId: 'cinetica', badge: 'Cinética' },
  { id: 'e-eke', title: 'Ecuación de Ekenstam (Hidrólisis Ácida)', subtitle: '1/DP_t - 1/DP_0 = k_deg · t, catalizada por H₃PO₄ a baja temperatura', category: 'ecuación', tabId: 'cinetica', badge: 'Degradación' },
  { id: 'e-fed', title: 'Algoritmo FedAvg (Privacidad Diferencial)', subtitle: 'Agregación ponderada de gradientes neuronales sin compartir datos crudos', category: 'ecuación', tabId: 'federado', badge: 'FedGNN' },

  // Recetas IA
  { id: 'r-g01', title: 'Receta Gen-01 (Alta Tenacidad - 27.4 cN/tex)', subtitle: 'Optimizada para uniformes ignífugos de faena pesada (DES ZnCl₂ 1.05 M, 48°C, λ=1.65)', category: 'receta', tabId: 'generativo', badge: 'VAE', actionParams: { znRatio: 1.05, temp: 48, tiempo: 55, estiraje: 1.65, cel: 100 } },
  { id: 'r-g02', title: 'Receta Gen-02 (Eco-Eficiente / Bajo Calor - 35°C)', subtitle: 'Minimiza consumo energético con huella de 1.32 kg CO₂/kg (DES ZnCl₂ 1.15 M, 35°C)', category: 'receta', tabId: 'generativo', badge: 'VAE', actionParams: { znRatio: 1.15, temp: 35, tiempo: 75, estiraje: 1.40, cel: 100 } },
  { id: 'r-g03', title: 'Receta Gen-03 (Mezcla PET/Algodón 30%)', subtitle: 'Formulación para separación selectiva y regeneración con 70% de celulosa', category: 'receta', tabId: 'generativo', badge: 'VAE', actionParams: { znRatio: 0.95, temp: 55, tiempo: 60, estiraje: 1.50, cel: 70 } },

  // Secciones del Informe
  { id: 'i-por', title: 'Portada y Resumen APA 7a Edición', subtitle: 'Créditos institucionales, investigadores principales y resumen ejecutivo', category: 'informe', tabId: 'informe', badge: 'Informe' },
  { id: 'i-met', title: 'Materiales y Métodos (Tablas APA 1, 2 y 3)', subtitle: 'Diseño factorial, caracterización de materias primas y variables operativas', category: 'informe', tabId: 'informe', badge: 'Informe' },
  { id: 'i-gra', title: 'Evidencia Gráfica y Figuras 1 a 6', subtitle: 'Curvas cinéticas, frente de Pareto, federado, dispersión y espacio VAE', category: 'informe', tabId: 'informe', badge: 'Informe' },
  { id: 'i-ref', title: 'Referencias Bibliográficas APA', subtitle: 'Tong et al. (2021), Scarselli et al. (2009), Liu et al. (2025), Ekenstam, etc.', category: 'informe', tabId: 'informe', badge: 'Bibliografía' }
];
