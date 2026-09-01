import { A_DEGRADACION, A_DISOLUCION, EA_DEGRADACION, EA_DISOLUCION, R_GAS } from '../data/constants';
import { InverseResult, SimulationParams, SimulationResults } from '../types';

/**
 * Motor fisicoquímico acoplado a GNN para el Gemelo Digital Textil (DES ZnCl2/H3PO4/H2O)
 */
export function calcularModeloFisicoquimico(params: SimulationParams): SimulationResults {
  const { znRatio, temp, tiempo, estiraje, cel } = params;
  const T_K = temp + 273.15;

  // 1. Cinética de disolución (Arrhenius recalibrada)
  const k_dis = Math.max(0.002, A_DISOLUCION * Math.exp(-EA_DISOLUCION / (R_GAS * T_K)) * (0.85 + 0.15 * znRatio));
  const alfa_dis = 1 - Math.exp(-k_dis * tiempo);

  // 2. Cinética de degradación macromolecular (DP, ecuación de Ekenstam)
  const k_deg = A_DEGRADACION * Math.exp(-EA_DEGRADACION / (R_GAS * T_K)) * (0.8 + 0.4 * znRatio);
  const DP_0 = 1850;
  const invDP = (1 / DP_0) + (k_deg * tiempo);
  let DP_final = Math.round(1 / invDP);
  DP_final = Math.max(120, Math.min(1850, DP_final));

  // 3. Índice de Cristalinidad (celulosa II regenerada, rango 45-60%)
  let crI = 58 - (temp - 20) * 0.22 + (estiraje - 1.0) * 6.0;
  crI = Math.max(36, Math.min(60, crI)) * (0.55 + 0.45 * (cel / 100));

  // 4. Tenacidad Mecánica (pico en ventana segura DP 350-650)
  let tenacidadBase: number;
  if (DP_final >= 300 && DP_final <= 700) {
    tenacidadBase = 26.0 - 0.00007 * Math.pow(DP_final - 500, 2);
  } else if (DP_final > 700) {
    tenacidadBase = (26.0 - 0.00007 * 40000) * Math.exp(-(DP_final - 700) / 400);
  } else {
    tenacidadBase = 2.5 + 23.5 * Math.pow((DP_final - 120) / 180, 1.6);
  }
  const factorOrientacion = 0.88 + 0.12 * (estiraje / 1.5);
  const factorCelulosa = 0.85 + 0.15 * (cel / 100);
  const factorSolvatacion = 0.85 + 0.15 * Math.min(1.0, alfa_dis / 0.85);

  let tenacidad = tenacidadBase * factorOrientacion * factorCelulosa * factorSolvatacion;
  tenacidad = Math.max(2.0, Math.min(32.0, tenacidad));

  // 5. Módulo de Young (5-8 GPa)
  let modulo = (4.2 + (estiraje - 1.0) * 3.0 + (crI / 100) * 2.6) * (0.75 + 0.25 * (cel / 100));
  modulo = Math.max(1.0, Math.min(9.5, modulo));

  // 6. Elongación (8-15%)
  let elongacion = 15.0 - (estiraje - 1.0) * 4.0 + (1 - (crI / 100)) * 6.0;
  elongacion = Math.max(4.0, Math.min(20.0, elongacion));

  // 7. Descoloración Delta E*
  let deltaE = 6.5 - (temp / 90) * 3.0 - (tiempo / 180) * 2.5;
  deltaE = Math.max(1.2, Math.min(11.0, deltaE));

  return { k_dis, alfa_dis, DP_final, crI, tenacidad, modulo, elongacion, deltaE };
}

/**
 * Deducción de variables de reciclado a partir de especificaciones de prenda
 */
export function deducirVariablesInversas(
  pctReciclado: number,
  tenacidadDeseada: number,
  tipoPrenda: string,
  deltaEDeseado: number
): InverseResult {
  let celAlimentacion = 100;
  if (pctReciclado < 80) celAlimentacion = Math.max(60, Math.round(pctReciclado * 1.15));

  let estirajeDeducido = 1.20;
  if (tenacidadDeseada >= 26.0 || tipoPrenda === 'pesada') {
    estirajeDeducido = 1.65;
  } else if (tenacidadDeseada >= 22.0) {
    estirajeDeducido = 1.45;
  } else if (tenacidadDeseada >= 18.0) {
    estirajeDeducido = 1.30;
  } else {
    estirajeDeducido = 1.15;
  }

  let tempDeducida = 48;
  let tiempoDeducido = 60;
  let ratioZnDeducido = 1.05;

  if (tenacidadDeseada >= 25.5) {
    tempDeducida = 45;
    tiempoDeducido = 55;
    ratioZnDeducido = 1.05;
  } else if (tipoPrenda === 'ligera') {
    tempDeducida = 38;
    tiempoDeducido = 75;
    ratioZnDeducido = 1.15;
  } else if (deltaEDeseado <= 2.0) {
    tempDeducida = 55;
    tiempoDeducido = 65;
    ratioZnDeducido = 1.00;
  }

  const forwardTest = calcularModeloFisicoquimico({
    znRatio: ratioZnDeducido,
    temp: tempDeducida,
    tiempo: tiempoDeducido,
    estiraje: estirajeDeducido,
    cel: celAlimentacion,
  });

  return {
    znRatio: ratioZnDeducido,
    temp: tempDeducida,
    tiempo: tiempoDeducido,
    estiraje: estirajeDeducido,
    cel: celAlimentacion,
    dpResultante: forwardTest.DP_final,
    tenacidadEstimada: forwardTest.tenacidad,
    deltaEEstimado: forwardTest.deltaE,
    recuperacionDES: 94.2,
  };
}
