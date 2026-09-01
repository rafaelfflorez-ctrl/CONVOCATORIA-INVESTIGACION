export type TabId =
  | 'simulador'
  | 'inverso'
  | 'grafos'
  | 'cinetica'
  | 'generativo'
  | 'multiobjetivo'
  | 'federado'
  | 'validacion'
  | 'informe';

export interface SimulationParams {
  znRatio: number; // mol/mol (0.50 - 2.00)
  temp: number;    // °C (20 - 90)
  tiempo: number;  // min (15 - 180)
  estiraje: number;// ratio λ (1.00 - 2.50)
  cel: number;     // % (50 - 100)
}

export interface SimulationResults {
  k_dis: number;
  alfa_dis: number;
  DP_final: number;
  crI: number;
  tenacidad: number;
  modulo: number;
  elongacion: number;
  deltaE: number;
}

export interface HistoricalSample {
  id: string;
  znRatio: number;
  temp: number;
  tiempo: number;
  estiraje: number;
  cel: number;
  ten: number;
  mod: number;
  elo: number;
  dp: number;
  cri: number;
}

export interface VAERecipe {
  id: string;
  nombre: string;
  desc: string;
  ratioZn: number;
  temp: number;
  tiempo: number;
  estiraje: number;
  cel: number;
  ten: number;
  mod: number;
  elo: number;
  dp: number;
  cri: number;
  co2: number;
}

export interface InverseResult {
  znRatio: number;
  temp: number;
  tiempo: number;
  estiraje: number;
  cel: number;
  dpResultante: number;
  tenacidadEstimada: number;
  deltaEEstimado: number;
  recuperacionDES: number;
}

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'módulo' | 'variable' | 'ecuación' | 'receta' | 'informe';
  tabId: TabId;
  badge?: string;
  actionParams?: Partial<SimulationParams>;
}
