import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SimulationParams, SimulationResults } from '../types';
import { generarInformeTecnicoDinamico } from './dynamicReportGenerator';

export interface ControlTrial {
  id: string;
  nombre: string;
  editorial: string;
  categoria: 'optima' | 'critica' | 'cinetica' | 'mecano' | 'ambiental';
  badge?: string;
  color?: string;
  co2?: number;
  params: SimulationParams;
  results: SimulationResults;
}

/**
 * Utility to reliably export, print and download the technical report
 * across iframe environments, pop-up blockers, and mobile devices.
 */

export function sanitizeFileName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9_-]/g, '_') // replace non-alphanumeric with _
    .replace(/_+/g, '_') // collapse multiple underscores
    .replace(/^_|_$/g, ''); // trim leading/trailing underscores
}

export function triggerDirectPrint(): void {
  try {
    const previousTitle = document.title;
    document.title = '';
    window.print();
    setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  } catch (err) {
    console.warn('Direct window.print() failed:', err);
  }
}

export function openPrintWindow(reportElementId: string = 'area-informe-apa'): boolean {
  const reportElement = document.getElementById(reportElementId);
  if (!reportElement) {
    // Fallback to window.print if element is not found
    triggerDirectPrint();
    return false;
  }

  // Clone node and convert canvases to image elements for perfect rendering
  const clone = reportElement.cloneNode(true) as HTMLElement;
  const originalCanvases = reportElement.querySelectorAll('canvas');
  const cloneCanvases = clone.querySelectorAll('canvas');

  originalCanvases.forEach((origCanvas, index) => {
    try {
      const dataUrl = origCanvas.toDataURL('image/png');
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.maxHeight = '280px';
      img.style.objectFit = 'contain';
      img.className = 'report-chart-canvas';
      
      const targetCanvas = cloneCanvases[index];
      if (targetCanvas && targetCanvas.parentNode) {
        targetCanvas.parentNode.replaceChild(img, targetCanvas);
      }
    } catch (e) {
      console.warn('Canvas conversion to image failed:', e);
    }
  });

  const printWindow = window.open('', '_blank', 'width=1000,height=900,menubar=yes,toolbar=yes');
  if (!printWindow) {
    // Popup was blocked, trigger standard window.print
    triggerDirectPrint();
    return false;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title></title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm 18mm 20mm 18mm;
    }
    *, *::before, *::after {
      box-sizing: border-box !important;
    }
    body {
      font-family: 'Times New Roman', Times, 'Liberation Serif', Georgia, serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      width: 100%;
      max-width: 100%;
      text-align: justify;
      text-justify: inter-word;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }
    @media screen {
      body {
        max-width: 840px;
        margin: 0 auto;
        padding: 24px 32px;
      }
    }
    h1, h2, h3, h4, h5, h6 {
      color: #000000;
      font-family: 'Times New Roman', Times, Georgia, serif;
      page-break-after: avoid;
      break-after: avoid;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
    h1 { font-size: 15pt; text-align: center; line-height: 1.3; font-weight: bold; }
    h2 { font-size: 12.5pt; margin-top: 16pt; border-bottom: 1.5pt solid #0f172a; padding-bottom: 3pt; }
    h3 { font-size: 11pt; margin-top: 10pt; font-weight: bold; }
    p { text-align: justify; text-justify: inter-word; margin-top: 6pt; margin-bottom: 6pt; overflow-wrap: break-word; word-wrap: break-word; }
    .apa-table {
      width: 100% !important;
      max-width: 100% !important;
      table-layout: fixed;
      border-collapse: collapse;
      border-top: 1.5pt solid #0f172a;
      border-bottom: 1.5pt solid #0f172a;
      margin: 10pt 0;
      font-size: 9pt;
      page-break-inside: avoid;
      break-inside: avoid;
      overflow-wrap: break-word;
    }
    .apa-table thead tr { border-bottom: 1pt solid #0f172a; }
    .apa-table th, .apa-table td {
      padding: 3.5pt 5pt;
      text-align: left;
      border-left: none;
      border-right: none;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
    .apa-table tbody tr { border-bottom: 0.5pt solid #e2e8f0; }
    .apa-table tbody tr:last-child { border-bottom: none; }
    .report-chart-container {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 8pt;
      margin: 12pt 0;
      page-break-inside: avoid;
      break-inside: avoid;
      border-radius: 4px;
      max-width: 100%;
    }
    .report-chart-canvas {
      width: 100%;
      max-height: 250px;
      display: block;
      margin: 0 auto;
      object-fit: contain;
    }
    .page-break-inside-avoid {
      page-break-inside: avoid;
      break-inside: avoid;
      max-width: 100%;
    }
    pre, code {
      white-space: pre-wrap;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .print-actions {
      position: fixed;
      top: 12px;
      right: 12px;
      background: #0f172a;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: sans-serif;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
    }
    @media print {
      .print-actions { display: none !important; }
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions" onclick="window.print()">
    🖨️ Imprimir / Guardar como PDF
  </div>
  ${clone.innerHTML}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  return true;
}

/**
 * Genera el documento HTML completo y estructurado para una prueba específica
 */
export function buildTrialReportHtml(trial: ControlTrial): string {
  const dynamic = generarInformeTecnicoDinamico(trial.params, trial.results);
  const fechaHoy = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title></title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm 18mm 20mm 18mm;
    }
    *, *::before, *::after {
      box-sizing: border-box !important;
    }
    body {
      font-family: 'Times New Roman', Times, 'Liberation Serif', Georgia, serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      width: 100%;
      max-width: 100%;
      text-align: justify;
      text-justify: inter-word;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }
    @media screen {
      body {
        max-width: 820px;
        margin: 0 auto;
        padding: 24px 30px;
      }
    }
    .header-box {
      border-bottom: 2pt solid #0f172a;
      padding-bottom: 10pt;
      margin-bottom: 14pt;
      text-align: center;
      max-width: 100%;
      overflow-wrap: break-word;
    }
    .inst-title {
      font-size: 9.5pt;
      font-weight: bold;
      letter-spacing: 0.5pt;
      text-transform: uppercase;
      color: #334155;
      margin: 0;
      overflow-wrap: break-word;
    }
    .inst-sub {
      font-size: 8pt;
      color: #64748b;
      margin: 2pt 0 6pt 0;
      overflow-wrap: break-word;
    }
    .doc-badge {
      display: inline-block;
      padding: 2pt 8pt;
      border-radius: 12pt;
      font-family: monospace;
      font-size: 8pt;
      font-weight: bold;
      background: #f1f5f9;
      color: #0f172a;
      border: 1pt solid #cbd5e1;
      margin-bottom: 6pt;
    }
    h1 {
      font-size: 14pt;
      line-height: 1.3;
      font-weight: bold;
      color: #0f172a;
      margin: 6pt 0;
      overflow-wrap: break-word;
    }
    .editorial {
      font-size: 8.5pt;
      font-style: italic;
      color: #0284c7;
      margin: 0 0 6pt 0;
      overflow-wrap: break-word;
    }
    .meta-line {
      font-family: monospace;
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 6pt;
      border-top: 0.5pt solid #e2e8f0;
      padding-top: 4pt;
      overflow-wrap: break-word;
    }
    h2 {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1.2pt solid #0f172a;
      padding-bottom: 2pt;
      margin-top: 12pt;
      margin-bottom: 6pt;
      color: #0f172a;
      page-break-after: avoid;
      overflow-wrap: break-word;
    }
    p {
      text-align: justify;
      text-justify: inter-word;
      margin: 4.5pt 0;
      overflow-wrap: break-word;
      word-wrap: break-word;
      max-width: 100%;
    }
    .apa-table {
      width: 100% !important;
      max-width: 100% !important;
      table-layout: fixed;
      border-collapse: collapse;
      border-top: 1.2pt solid #0f172a;
      border-bottom: 1.2pt solid #0f172a;
      margin: 8pt 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
      overflow-wrap: break-word;
    }
    .apa-table thead tr {
      border-bottom: 1pt solid #0f172a;
      background: #f8fafc;
    }
    .apa-table th, .apa-table td {
      padding: 3pt 4.5pt;
      text-align: left;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
    .apa-table td.num, .apa-table th.num {
      text-align: right;
      font-family: monospace;
    }
    .apa-table tbody tr {
      border-bottom: 0.5pt solid #f1f5f9;
    }
    .apa-table tbody tr:nth-child(even) {
      background: #fafafa;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6pt;
      margin: 8pt 0;
      max-width: 100%;
    }
    .metric-card {
      border: 1pt solid #cbd5e1;
      border-radius: 4pt;
      padding: 5pt 4pt;
      text-align: center;
      background: #f8fafc;
      overflow-wrap: break-word;
    }
    .metric-val {
      font-size: 11.5pt;
      font-weight: bold;
      font-family: monospace;
      color: #0f172a;
    }
    .metric-lbl {
      font-size: 7pt;
      text-transform: uppercase;
      color: #64748b;
      font-weight: bold;
      margin-top: 2pt;
    }
    .rec-item {
      border: 1pt solid #e2e8f0;
      border-radius: 4pt;
      padding: 4pt 6pt;
      margin-bottom: 3.5pt;
      font-size: 8pt;
      background: #f8fafc;
      overflow-wrap: break-word;
    }
    .rec-tag {
      display: inline-block;
      padding: 1pt 3.5pt;
      border-radius: 3pt;
      font-size: 6.5pt;
      font-weight: bold;
      text-transform: uppercase;
      font-family: monospace;
      margin-right: 4pt;
      background: #e2e8f0;
      color: #334155;
    }
    .rec-tag.critico { background: #fee2e2; color: #b91c1c; }
    .rec-tag.operativo { background: #e0f2fe; color: #0369a1; }
    .rec-tag.optimizacion { background: #dcfce7; color: #15803d; }
    .rec-tag.estrategico { background: #f3e8ff; color: #7e22ce; }
    .signatures {
      margin-top: 20pt;
      padding-top: 10pt;
      border-top: 1pt solid #cbd5e1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10pt;
      text-align: center;
      font-size: 7.5pt;
      page-break-inside: avoid;
      max-width: 100%;
    }
    .sig-line {
      border-top: 1pt solid #94a3b8;
      margin: 14pt 8pt 3pt 8pt;
    }
  </style>
</head>
<body>
  <div style="width: 100%; max-width: 100%; box-sizing: border-box; text-align: justify; overflow-wrap: break-word; word-wrap: break-word;">
  <div class="header-box">
    <div class="inst-title">UNIVERSIDAD DE CARTAGENA · FACULTAD DE INGENIERÍA</div>
    <div class="inst-sub">Grupo de Investigación en Modelado Molecular, Catálisis &amp; Procesos Circulares (GIMCPC) · Dotaciones H-SEG S.A.S.</div>
    <div class="doc-badge">${trial.badge || 'ENSAYO TÉCNICO'} · ${trial.nombre.split(':')[0]}</div>
    <h1>${dynamic.tituloDocumento}</h1>
    <div class="editorial">${dynamic.enfoqueEditorial}</div>
    <div class="meta-line">
      Dictamen: <strong>${dynamic.docId}</strong> | Ensayo: <strong>${trial.nombre}</strong> | Fecha: <strong>${fechaHoy}</strong>
    </div>
  </div>

  <h2>1. ${dynamic.bloqueResumen.encabezado}</h2>
  <p><strong>Contexto:</strong> ${dynamic.bloqueResumen.parrafo1}</p>
  <p><strong>Metodología de Transporte y Cinética:</strong> ${dynamic.bloqueResumen.parrafo2}</p>
  <p><strong>Resultados Clave del Lote:</strong> ${dynamic.bloqueResumen.parrafo3}</p>

  <h2>2. Variables Operativas y Desempeño Mecánico (ASTM D3822)</h2>
  <div class="metric-grid">
    <div class="metric-card">
      <div class="metric-val" style="color: ${trial.color || '#0284c7'}">${trial.results.tenacidad.toFixed(2)} cN/tex</div>
      <div class="metric-lbl">Tenacidad Tracción</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${trial.results.modulo.toFixed(2)} GPa</div>
      <div class="metric-lbl">Módulo de Young</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${trial.results.DP_final} DP</div>
      <div class="metric-lbl">Grado Polimerización</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${trial.co2 !== undefined ? trial.co2 : dynamic.co2Estimado.toFixed(2)} kg/kg</div>
      <div class="metric-lbl">Huella CO₂ Global</div>
    </div>
  </div>

  <table class="apa-table">
    <thead>
      <tr>
        <th>Variable Físico-Química</th>
        <th>Valor Ensayo</th>
        <th>Rango Normativo</th>
        <th>Diagnóstico Técnico</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Temperatura del Reactor (T)</td>
        <td class="num">${trial.params.temp} °C</td>
        <td>40.0 – 60.0 °C</td>
        <td>${trial.params.temp > 65 ? 'Alerta: Sobrecalentamiento' : 'Conforme'}</td>
      </tr>
      <tr>
        <td>Tiempo de Residencia (t)</td>
        <td class="num">${trial.params.tiempo} min</td>
        <td>45.0 – 90.0 min</td>
        <td>${trial.params.tiempo < 40 ? 'Sub-residencia' : 'Conforme'}</td>
      </tr>
      <tr>
        <td>Relación Molar DES ZnCl₂/H₃PO₄</td>
        <td class="num">${trial.params.znRatio.toFixed(2)} mol/mol</td>
        <td>0.90 – 1.30 mol/mol</td>
        <td>Conforme</td>
      </tr>
      <tr>
        <td>Relación de Estiraje (λ)</td>
        <td class="num">${trial.params.estiraje.toFixed(2)}</td>
        <td>1.20 – 1.80</td>
        <td>Orientación Molecular Activa</td>
      </tr>
      <tr>
        <td>Fracción Disuelta (α_dis)</td>
        <td class="num">${(trial.results.alfa_dis * 100).toFixed(1)} %</td>
        <td>≥ 85.0 %</td>
        <td>${trial.results.alfa_dis >= 0.85 ? 'Solvatación Homogénea' : 'Fase Incompleta'}</td>
      </tr>
      <tr>
        <td>Grado de Polimerización (DP)</td>
        <td class="num">${trial.results.DP_final}</td>
        <td>350 – 650</td>
        <td>${trial.results.DP_final >= 350 ? 'Conforme ISO 5351' : 'No Conforme (Hidrólisis)'}</td>
      </tr>
      <tr>
        <td>Tenacidad a la Tracción (σ_ten)</td>
        <td class="num">${trial.results.tenacidad.toFixed(2)} cN/tex</td>
        <td>≥ 20.0 cN/tex</td>
        <td>${trial.results.tenacidad >= 20.0 ? 'Conforme ASTM D3822' : 'No Conforme (Frágil)'}</td>
      </tr>
      <tr>
        <td>Módulo Elástico (E)</td>
        <td class="num">${trial.results.modulo.toFixed(2)} GPa</td>
        <td>≥ 4.5 GPa</td>
        <td>${trial.results.modulo >= 4.5 ? 'Conforme ASTM D3822' : 'Bajo Módulo'}</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Dinámica Termocinética y Tabla de Tendencias (Máx. 4 Columnas A4)</h2>
  <p>Proyección comparativa del comportamiento de transporte, solvatación y degradación macromolecular calculada a partir de los principios constitutivos de Arrhenius y Ekenstam para la formulación actual (Relación ZnCl₂: ${trial.params.znRatio.toFixed(2)} mol/mol, λ = ${trial.params.estiraje.toFixed(2)}):</p>

  <table class="apa-table">
    <thead>
      <tr>
        <th>Temp (°C)</th>
        <th>Tiempo (min)</th>
        <th class="num">DP (ISO 5351)</th>
        <th class="num">Tenacidad (ASTM D3822)</th>
      </tr>
    </thead>
    <tbody>
      ${dynamic.tablaTendenciaTermocinetica
        .map(
          (row) => `
        <tr ${row.temperatura === trial.params.temp ? 'style="background: #e0f2fe; font-weight: bold;"' : ''}>
          <td>${row.temperatura} °C</td>
          <td>${row.tiempo} min</td>
          <td class="num">${row.dp_calc}</td>
          <td class="num">${row.tenacidad_est} cN/tex</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h2>4. Esquema Fenomenológico Vertical de Transferencia de Masa y Transición</h2>
  <div class="page-break-inside-avoid" style="margin: 12pt 0; padding: 10pt; border: 1pt solid #cbd5e1; background: #f8fafc; border-radius: 4pt;">
    <div style="margin-bottom: 6pt;">
      <strong>Fase I: Matriz Celulosa I Nativa (Algodón Insoluble)</strong><br/>
      <span style="font-size: 8.5pt; color: #475569;">Cadenas paralelas estabilizadas por puentes O(3)-H...O(5) intra e intermoleculares.</span>
    </div>
    <div style="color: #0284c7; font-weight: bold; font-size: 9pt; margin: 4pt 0 4pt 12pt;">
      ↓ [Difusión y ataque coordinativo del ácido de Lewis: aductos [Zn(H₂O)ₙClₘ]²⁻ᵐ]
    </div>
    <div style="margin-bottom: 6pt;">
      <strong>Fase II: Solvatación Coordinativa y Dope Amorfo</strong><br/>
      <span style="font-size: 8.5pt; color: #475569;">Quelación de hidroxilos en C2, C3 y C6; apantallamiento de puentes H y fluidez pseudoplástica.</span>
    </div>
    <div style="color: #0284c7; font-weight: bold; font-size: 9pt; margin: 4pt 0 4pt 12pt;">
      ↓ [Inmersión en baño antidisolvente H₂O / Difusión osmótica rápida (ΔG_m &lt; 0)]
    </div>
    <div style="margin-bottom: 6pt;">
      <strong>Fase III: Regeneración y Transición Sol-Gel (Celulosa II)</strong><br/>
      <span style="font-size: 8.5pt; color: #475569;">Desplazamiento del zinc y nucleación espontánea hacia conformación monoclínica antiparalela.</span>
    </div>
    <div style="color: #0284c7; font-weight: bold; font-size: 9pt; margin: 4pt 0 4pt 12pt;">
      ↓ [Estiraje mecánico uniaxial continuo bajo relación λ = ${trial.params.estiraje.toFixed(2)}]
    </div>
    <div>
      <strong>Fase IV: Filamento Orientado de Celulosa II (Alta Tenacidad)</strong><br/>
      <span style="font-size: 8.5pt; color: #475569;">Alineación macromolecular axial; conformidad mecánica ASTM D3822 (${trial.results.tenacidad.toFixed(2)} cN/tex).</span>
    </div>
  </div>

  <h2>5. Balance de Materia y Escalamiento Industrial (Base 100 kg Residuo)</h2>
  <p>${dynamic.balanceMasaYProceso.texto}</p>

  <h2>6. Discusión Fenomenológica y Modelos Físico-Químicos Autocontenidos</h2>
  <p>${dynamic.discusionAcademicaEnsayo.cuerpo1}</p>
  <p>${dynamic.discusionAcademicaEnsayo.cuerpo2}</p>
  <p>${dynamic.discusionAcademicaEnsayo.cuerpo3}</p>

  <h2>7. Fundamentos Teóricos y Ecuaciones Constitutivas Universales</h2>
  <div class="page-break-inside-avoid" style="margin: 8pt 0;">
    ${dynamic.fundamentosUniversales
      .map(
        (fund) => `
      <div style="border-bottom: 0.5pt solid #e2e8f0; padding: 4pt 0; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; font-size: 8.5pt;">
          <strong>${fund.nombre}</strong>
          <code style="background: #f1f5f9; padding: 1pt 4pt; border-radius: 3pt; font-size: 8pt; color: #0f172a;">${fund.ecuacion}</code>
        </div>
        <p style="font-size: 8pt; color: #475569; margin: 2pt 0;">${fund.principio} <em>(${fund.aplicacion})</em></p>
      </div>`
      )
      .join('')}
  </div>

  <h2>8. Dictamen y Recomendaciones Operativas para Mamonal</h2>
  ${dynamic.recomendacionesMamonal
    .map(
      (rec) => `
    <div class="rec-item">
      <span class="rec-tag ${rec.nivelUrgencia.toLowerCase()}">${rec.nivelUrgencia}</span>
      <strong>${rec.foco}:</strong> ${rec.accion}
    </div>`
    )
    .join('')}

  <div class="signatures">
    <div>
      <div class="sig-line"></div>
      <strong>Dr. Ing. Rafael Flórez</strong><br>
      Director de Investigación GIMCPC<br>
      Universidad de Cartagena
    </div>
    <div>
      <div class="sig-line"></div>
      <strong>Ing. Jefe de Procesos</strong><br>
      Planta Piloto Mamonal<br>
      Dotaciones H-SEG S.A.S.
    </div>
    <div>
      <div class="sig-line"></div>
      <strong>Auditor de Calidad Textil</strong><br>
      Certificación ASTM D3822<br>
      MinCiencias Colombia
    </div>
  </div>
  </div>
</body>
</html>`;
}

/**
 * Exporta un archivo PDF individual con el nombre de la prueba
 */
export async function exportTrialAsPdf(trial: ControlTrial): Promise<void> {
  const htmlContent = buildTrialReportHtml(trial);
  
  // Create hidden container with strict A4 proportional layout
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '760px';
  container.style.padding = '25px 30px';
  container.style.boxSizing = 'border-box';
  container.style.background = '#ffffff';
  container.style.wordWrap = 'break-word';
  container.style.overflowWrap = 'break-word';
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const marginSide = 14;
    const marginTop = 14;
    const imgWidth = pdfWidth - (marginSide * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = marginTop;

    pdf.addImage(imgData, 'JPEG', marginSide, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - (marginTop * 2));

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + marginTop;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', marginSide, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - (marginTop * 2));
    }

    const cleanName = sanitizeFileName(trial.nombre.replace(/[:\/]/g, '_'));
    const fileName = `${cleanName}_DES_UdeC.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating trial PDF:', error);
    // Fallback: download as printable HTML
    downloadTrialPrintableHTML(trial);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Descarga el archivo HTML individual para una prueba
 */
export function downloadTrialPrintableHTML(trial: ControlTrial): void {
  const html = buildTrialReportHtml(trial);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanName = sanitizeFileName(trial.nombre.replace(/[:\/]/g, '_'));
  a.download = `${cleanName}_DES_UdeC.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Descarga TODOS los PDFs por separado con el nombre de cada prueba de forma secuencial
 */
export async function exportAllTrialsAsSeparatePdfs(
  trials: ControlTrial[],
  onProgress?: (current: number, total: number, trialName: string) => void
): Promise<void> {
  const total = trials.length;
  
  for (let i = 0; i < total; i++) {
    const trial = trials[i];
    if (onProgress) {
      onProgress(i + 1, total, trial.nombre);
    }
    
    await exportTrialAsPdf(trial);
    
    // Pequeño intervalo de 450ms entre descargas para evitar bloqueos del navegador
    if (i < total - 1) {
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
  }
}

export function downloadPrintableHTML(reportElementId: string = 'area-informe-apa'): void {
  const reportElement = document.getElementById(reportElementId);
  if (!reportElement) {
    alert('No se encontró el contenedor del dictamen para descargar.');
    return;
  }

  // Clone node and convert canvases to image elements
  const clone = reportElement.cloneNode(true) as HTMLElement;
  const originalCanvases = reportElement.querySelectorAll('canvas');
  const cloneCanvases = clone.querySelectorAll('canvas');

  originalCanvases.forEach((origCanvas, index) => {
    try {
      const dataUrl = origCanvas.toDataURL('image/png');
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.maxHeight = '280px';
      img.style.objectFit = 'contain';
      
      const targetCanvas = cloneCanvases[index];
      if (targetCanvas && targetCanvas.parentNode) {
        targetCanvas.parentNode.replaceChild(img, targetCanvas);
      }
    } catch (e) {
      console.warn('Canvas conversion to image failed:', e);
    }
  });

  const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title></title>
  <style>
    @page { 
      size: A4 portrait; 
      margin: 20mm 18mm 20mm 18mm; 
    }
    *, *::before, *::after {
      box-sizing: border-box !important;
    }
    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      text-align: justify;
      text-justify: inter-word;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }
    @media screen {
      body {
        max-width: 840px;
        margin: 0 auto;
        padding: 24px 32px;
      }
    }
    h1 { font-size: 15pt; text-align: center; font-weight: bold; margin-bottom: 12pt; overflow-wrap: break-word; }
    h2 { font-size: 12pt; margin-top: 14pt; border-bottom: 1.5pt solid #0f172a; padding-bottom: 3pt; overflow-wrap: break-word; }
    h3 { font-size: 10.5pt; margin-top: 10pt; font-weight: bold; overflow-wrap: break-word; }
    p { text-align: justify; text-justify: inter-word; margin-top: 6pt; margin-bottom: 6pt; overflow-wrap: break-word; word-wrap: break-word; }
    .apa-table {
      width: 100% !important;
      max-width: 100% !important;
      table-layout: fixed;
      border-collapse: collapse;
      border-top: 1.5pt solid #0f172a;
      border-bottom: 1.5pt solid #0f172a;
      margin: 10pt 0;
      font-size: 9pt;
      overflow-wrap: break-word;
    }
    .apa-table th, .apa-table td { padding: 3.5pt 5pt; text-align: left; overflow-wrap: break-word; word-wrap: break-word; }
    .apa-table thead tr { border-bottom: 1pt solid #0f172a; }
    .apa-table tbody tr { border-bottom: 0.5pt solid #e2e8f0; }
    .report-chart-container {
      border: 1px solid #cbd5e1;
      padding: 8pt;
      margin: 10pt 0;
      border-radius: 4px;
      background: #fafafa;
      max-width: 100%;
    }
    @media print {
      body { padding: 0 !important; max-width: 100% !important; margin: 0 !important; width: 100% !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; padding: 12px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; font-family: sans-serif; font-size: 13px;">
    <strong>📄 Archivo de Monografía Científica Generado</strong> · Presione <code>Ctrl + P</code> (o <code>⌘ + P</code> en Mac) para Guardar como PDF o Imprimir en formato A4 con márgenes estandarizados de 20mm/18mm.
  </div>
  ${clone.innerHTML}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Dictamen_Tecnico_Investigacion_DES_UdeC_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
