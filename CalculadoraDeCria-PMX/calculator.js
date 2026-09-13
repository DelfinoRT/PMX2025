(() => {
  const engine = window.GeneticsEngine;
  if (!engine) {
    console.error('GeneticsEngine not loaded');
    return;
  }

  const parentKeys = ['male', 'female'];
  const state = { male: {}, female: {} };
  const filters = {
    male: { query: '', category: 'all' },
    female: { query: '', category: 'all' }
  };
  const results = { raw: [], grouped: [] };
  let selectedOutcome = null;

  const categoryMap = {
    blue_series: 'base',
    dark_factor: 'color',
    grey: 'color',
    violet: 'color',
    spangle: 'pattern',
    dominant_pied: 'pattern',
    clearflight_pied: 'pattern',
    dutch_pied: 'pattern',
    recessive_pied: 'pattern',
    dilution: 'color',
    blackface: 'pattern',
    blackwing: 'pattern',
    saddleback: 'pattern',
    german_fallow: 'pattern',
    english_fallow: 'pattern',
    scottish_fallow: 'pattern',
    easley_clearbody: 'pattern',
    anthracite: 'color',
    nsl_ino: 'rare',
    opaline: 'sex',
    cinnamon: 'sex',
    ino: 'sex',
    slate: 'sex',
    faded: 'rare',
    crest: 'rare',
    english_grey: 'rare',
    recessive_grey: 'rare',
    manto_negro: 'rare',
    darkwing: 'rare',
    australian_pied: 'pattern'
  };

  const statusMap = {
    blue_series: 'core',
    dark_factor: 'core',
    grey: 'core',
    violet: 'core',
    spangle: 'core',
    dominant_pied: 'core',
    clearflight_pied: 'core',
    dutch_pied: 'core',
    recessive_pied: 'core',
    dilution: 'core',
    blackface: 'core',
    blackwing: 'core',
    saddleback: 'core',
    german_fallow: 'core',
    english_fallow: 'core',
    scottish_fallow: 'core',
    easley_clearbody: 'core',
    anthracite: 'core',
    nsl_ino: 'core',
    opaline: 'core',
    cinnamon: 'core',
    ino: 'core',
    slate: 'core',
    faded: 'experimental',
    crest: 'polygenic',
    english_grey: 'experimental',
    recessive_grey: 'experimental',
    manto_negro: 'experimental',
    darkwing: 'experimental',
    australian_pied: 'experimental'
  };

  const labelMap = {
    blue_series: 'Serie verde / azul',
    dark_factor: 'Factor oscuro',
    grey: 'Gris',
    violet: 'Violeta',
    spangle: 'Spangle',
    dominant_pied: 'Pío dominante',
    clearflight_pied: 'Pío clearflight',
    dutch_pied: 'Pío holandés',
    recessive_pied: 'Pío recesivo',
    dilution: 'Dilución',
    blackface: 'Cara negra',
    blackwing: 'Ala negra',
    saddleback: 'Saddleback',
    german_fallow: 'Fallow alemán',
    english_fallow: 'Fallow inglés',
    scottish_fallow: 'Fallow escocés',
    easley_clearbody: 'Easley Clearbody',
    anthracite: 'Antracita',
    nsl_ino: 'NSL Ino',
    opaline: 'Opalino',
    cinnamon: 'Canela',
    ino: 'Ino',
    slate: 'Slate',
    faded: 'Faded',
    crest: 'Cresta',
    english_grey: 'Gris inglés',
    recessive_grey: 'Gris recesivo',
    manto_negro: 'Manto negro',
    darkwing: 'Darkwing',
    australian_pied: 'Pío australiano'
  };

  const descriptionMap = {
    blue_series: 'Serie de color base: verde (salvaje), azul, yellowface, goldenface.',
    dark_factor: 'Factor oscuro: 0 (claro), 1 (oscuro), 2 (muy oscuro).',
    grey: 'Factor gris: añade pigmento gris.',
    violet: 'Factor violeta: añade tono violeta.',
    spangle: 'Spangle: patrón de alas con borde claro.',
    dominant_pied: 'Pío dominante: manchas claras en plumaje.',
    clearflight_pied: 'Pío clearflight: alas claras.',
    dutch_pied: 'Pío holandés: patrón de manchas específico.',
    recessive_pied: 'Pío recesivo: manchas claras recesivas.',
    dilution: 'Dilución: clearwing, greywing, dilute, fullbody greywing.',
    blackface: 'Cara negra: máscara facial oscura.',
    blackwing: 'Ala negra: alas oscuras.',
    saddleback: 'Saddleback: patrón de silla en la espalda.',
    german_fallow: 'Fallow alemán: ojos rojos, plumaje pálido.',
    english_fallow: 'Fallow inglés: similar al alemán.',
    scottish_fallow: 'Fallow escocés: similar.',
    easley_clearbody: 'Easley Clearbody: cuerpo claro dominante.',
    anthracite: 'Antracita: color gris oscuro intenso.',
    nsl_ino: 'NSL Ino: ino no ligado al sexo.',
    opaline: 'Opalino: patrón de alas alterado, ligado al sexo.',
    cinnamon: 'Canela: color canela, ligado al sexo.',
    ino: 'Ino: albino/lutino, serie alélica ligada al sexo.',
    slate: 'Slate: color pizarra, ligado al sexo.',
    faded: 'Faded: mutación experimental, color desvaído.',
    crest: 'Cresta: penacho en la cabeza, poligénico.',
    english_grey: 'Gris inglés: mutación experimental.',
    recessive_grey: 'Gris recesivo: mutación experimental.',
    manto_negro: 'Manto negro: mutación experimental.',
    darkwing: 'Darkwing: alas oscuras, experimental.',
    australian_pied: 'Pío australiano: mutación experimental.'
  };

  // Diccionario de traducción para resultados del GeneticsEngine
  const translationDict = {
    'Green Dark Green': 'Verde Oscuro',
    'Green Light Green': 'Verde Claro',
    'Green Olive': 'Verde Oliva',
    'Blue Skyblue': 'Azul Cielo',
    'Blue Sky Blue': 'Azul Cielo',
    'Blue Cobalt': 'Azul Cobalto',
    'Blue Mauve': 'Azul Malva',
    'Double Factor Spangle': 'Spangle Doble Factor',
    'Single Factor Spangle': 'Spangle Factor Simple',
    'DF Spangle': 'Spangle DF',
    'SF Spangle': 'Spangle SF',
    'Fullbody Greywing': 'Alas Grises Cuerpo Completo',
    'Full Body Greywing': 'Alas Grises Cuerpo Completo',
    'Dark Green': 'Verde Oscuro',
    'Light Green': 'Verde Claro',
    'Green': 'Verde',
    'Blue': 'Azul',
    'Skyblue': 'Azul Cielo',
    'Sky Blue': 'Azul Cielo',
    'Cobalt': 'Cobalto',
    'Mauve': 'Malva',
    'Olive': 'Oliva',
    'Yellowface I': 'Cara Amarilla I',
    'Yellowface II': 'Cara Amarilla II',
    'Yellowface': 'Cara Amarilla',
    'Goldenface': 'Cara Dorada',
    'Grey': 'Gris',
    'Gray': 'Gris',
    'Violet': 'Violeta',
    'Opaline': 'Opalino',
    'Cinnamon': 'Canela',
    'Ino': 'Ino',
    'Albino': 'Albino',
    'Lutino': 'Lutino',
    'Spangle': 'Spangle',
    'Dominant Pied': 'Pío Dominante',
    'Recessive Pied': 'Pío Recesivo',
    'Clearflight Pied': 'Pío Clearflight',
    'Dutch Pied': 'Pío Holandés',
    'Australian Pied': 'Pío Australiano',
    'Clearwing': 'Alas Claras',
    'Greywing': 'Alas Grises',
    'Dilute': 'Diluido',
    'Texas Clearbody': 'Texas Clearbody',
    'Easley Clearbody': 'Easley Clearbody',
    'Slate': 'Slate (Pizarra)',
    'Anthracite': 'Antracita',
    'Blackface': 'Cara Negra',
    'Blackwing': 'Ala Negra',
    'Saddleback': 'Saddleback',
    'German Fallow': 'Fallow Alemán',
    'English Fallow': 'Fallow Inglés',
    'Scottish Fallow': 'Fallow Escocés',
    'Crested': 'Crestado',
    'Crest': 'Cresta',
    'Darkwing': 'Darkwing',
    'Faded': 'Faded',
    'Manto Negro': 'Manto Negro',
    'English Grey': 'Gris Inglés',
    'Recessive Grey': 'Gris Recesivo',
    'Normal': 'Normal',
    'Carrier': 'Portador',
    'Split': 'Portador'
  };

  function translateText(str) {
    if (!str) return '';
    let text = String(str);
    const sortedKeys = Object.keys(translationDict).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      const regex = new RegExp('\\b' + key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'gi');
      text = text.replace(regex, translationDict[key]);
    }
    return text;
  }

  function translateAllele(allele) {
    if (!allele) return 'Normal';
    const map = {
      'normal': 'Normal',
      'blue_wt': 'Silvestre (Verde)',
      'blue_1': 'Azul 1',
      'blue_2': 'Azul 2',
      'yellowface_1': 'Cara Amarilla I',
      'yellowface_2': 'Cara Amarilla II',
      'goldenface': 'Cara Dorada',
      'dark_factor': 'Factor Oscuro',
      'dark_factor_df': 'Factor Oscuro DF',
      'texas_clearbody': 'Texas Clearbody',
      'clearwing': 'Alas Claras',
      'greywing': 'Alas Grises',
      'dilute': 'Diluido',
      'pearly': 'Pearly',
      'ino': 'Ino',
      'opaline': 'Opalino',
      'cinnamon': 'Canela',
      'slate': 'Slate',
      'violet': 'Violeta',
      'grey': 'Gris',
      'spangle': 'Spangle',
      'dominant_pied': 'Pío Dominante',
      'recessive_pied': 'Pío Recesivo',
      'clearflight_pied': 'Pío Clearflight',
      'dutch_pied': 'Pío Holandés',
      'australian_pied': 'Pío Australiano',
      'blackface': 'Cara Negra',
      'blackwing': 'Ala Negra',
      'saddleback': 'Saddleback',
      'german_fallow': 'Fallow Alemán',
      'english_fallow': 'Fallow Inglés',
      'scottish_fallow': 'Fallow Escocés',
      'easley_clearbody': 'Easley Clearbody',
      'anthracite': 'Antracita',
      'nsl_ino': 'NSL Ino',
      'crest': 'Cresta',
      'faded': 'Faded',
      'english_grey': 'Gris Inglés',
      'recessive_grey': 'Gris Recesivo',
      'manto_negro': 'Manto Negro',
      'darkwing': 'Darkwing',
      'W': 'W'
    };
    return map[allele] || translateText(allele);
  }

  function getMeta(locusId) {
    return {
      name: labelMap[locusId] || locusId,
      category: categoryMap[locusId] || 'pattern',
      status: statusMap[locusId] || 'core',
      description: descriptionMap[locusId] || ''
    };
  }

  function getLocusDef(locusId) {
    return engine.LOCI[locusId];
  }

  function wildtypeAllele(def) {
    if (!def || !def.alleles || def.alleles.length === 0) return 'normal';
    return def.alleles.find(a => 
      a === 'normal' || 
      a.endsWith('_wt') || 
      a.includes('wt') || 
      a.startsWith('non_')
    ) || def.alleles[0];
  }

  function isWildtypeAllele(allele, locusId) {
    if (!allele || allele === 'normal' || allele === 'W') return true;
    if (allele.endsWith('_wt') || allele.includes('wt') || allele.startsWith('non_')) return true;
    const def = getLocusDef(locusId);
    if (def) {
      const wt = wildtypeAllele(def);
      if (allele === wt) return true;
    }
    return false;
  }

  function mutantAllele(def) {
    const wt = wildtypeAllele(def);
    return def.alleles.find(a => a !== wt && a !== 'unknown');
  }

  function defaultAlleles(locusId, sex) {
    const def = getLocusDef(locusId);
    const wt = wildtypeAllele(def);
    if (def.type.startsWith('sex_linked')) {
      if (sex === 'female') return [wt, 'W'];
      return [wt, wt];
    }
    return [wt, wt];
  }

  function stateOptions(locusId, sex) {
    const def = getLocusDef(locusId);
    const wt = wildtypeAllele(def);
    const mut = mutantAllele(def);
    const options = [];

    options.push({
      value: 'normal',
      label: 'Normal',
      alleles: defaultAlleles(locusId, sex)
    });

    if (def.type === 'autosomal_recessive') {
      options.push({ value: 'carrier', label: 'Portador', alleles: [wt, mut] });
      options.push({ value: 'visual', label: 'Visual', alleles: [mut, mut] });
    } else if (def.type === 'autosomal_incomplete_dominant') {
      const dfAllele = def.alleles.find(a => a.endsWith('_df')) || mut;
      options.push({ value: 'sf', label: 'SF', alleles: [wt, mut] });
      options.push({ value: 'df', label: 'DF', alleles: [dfAllele, dfAllele] });
    } else if (def.type === 'autosomal_dominant') {
      options.push({ value: 'visual', label: 'Visual', alleles: [wt, mut] });
    } else if (def.type === 'autosomal_allelic_series') {
      if (locusId === 'blue_series') {
        options.push({ value: 'green', label: 'Verde', alleles: ['blue_wt', 'blue_wt'] });
        options.push({ value: 'blue', label: 'Azul', alleles: ['blue_1', 'blue_1'] });
        options.push({ value: 'yellowface1', label: 'Yellowface I', alleles: ['yellowface_1', 'blue_1'] });
        options.push({ value: 'yellowface2', label: 'Yellowface II', alleles: ['yellowface_2', 'blue_2'] });
        options.push({ value: 'goldenface', label: 'Goldenface', alleles: ['goldenface', 'blue_1'] });
        options.push({ value: 'green_blue', label: 'Verde / portador azul', alleles: ['blue_wt', 'blue_1'] });
      } else if (locusId === 'dilution') {
        options.push({ value: 'clearwing', label: 'Clearwing', alleles: ['clearwing', 'clearwing'] });
        options.push({ value: 'greywing', label: 'Greywing', alleles: ['greywing', 'greywing'] });
        options.push({ value: 'dilute', label: 'Dilute', alleles: ['dilute', 'dilute'] });
        options.push({ value: 'fullbody', label: 'Fullbody Greywing', alleles: ['clearwing', 'greywing'] });
      }
    } else if (def.type === 'sex_linked_recessive') {
      if (sex === 'male') {
        options.push({ value: 'carrier', label: 'Portador', alleles: [wt, mut] });
        options.push({ value: 'visual', label: 'Visual', alleles: [mut, mut] });
      } else {
        options.push({ value: 'visual', label: 'Visual', alleles: [mut, 'W'] });
      }
    } else if (def.type === 'sex_linked_allelic_series') {
      if (locusId === 'ino') {
        if (sex === 'male') {
          options.push({ value: 'carrier_ino', label: 'Portador Ino', alleles: [wt, 'ino'] });
          options.push({ value: 'carrier_tcb', label: 'Portador TCB', alleles: [wt, 'texas_clearbody'] });
          options.push({ value: 'tcb', label: 'Texas Clearbody', alleles: ['texas_clearbody', 'texas_clearbody'] });
          options.push({ value: 'pearly', label: 'Pearly', alleles: ['pearly', 'pearly'] });
          options.push({ value: 'ino', label: 'Ino', alleles: ['ino', 'ino'] });
          options.push({ value: 'tcb_ino', label: 'TCB / Ino', alleles: ['texas_clearbody', 'ino'] });
        } else {
          options.push({ value: 'tcb', label: 'Texas Clearbody', alleles: ['texas_clearbody', 'W'] });
          options.push({ value: 'pearly', label: 'Pearly', alleles: ['pearly', 'W'] });
          options.push({ value: 'ino', label: 'Ino', alleles: ['ino', 'W'] });
        }
      }
    } else if (def.type === 'experimental' || def.type === 'polygenic') {
      if (mut) {
        options.push({ value: 'visual', label: 'Visual (referencia)', alleles: sex === 'female' && def.type.startsWith('sex_linked') ? [mut, 'W'] : [mut, mut] });
      }
    }
    return options;
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  function renderParent(parent) {
    const root = document.getElementById(`${parent}-loci`);
    const loci = Object.entries(engine.LOCI);
    let html = '';
    for (const [locusId, def] of loci) {
      const meta = getMeta(locusId);
      const opts = stateOptions(locusId, parent);
      const selected = state[parent][locusId] || 'normal';
      const opt = opts.find(o => o.value === selected) || opts[0];
      const isSelected = selected !== 'normal';

      let stateButtons = '';
      for (const o of opts) {
        const active = o.value === selected ? 'active' : '';
        stateButtons += `<button type="button" class="mutation-state ${active}" data-state="${escapeHtml(o.value)}" data-locus="${escapeHtml(locusId)}" ${o.value !== 'normal' && def.type === 'polygenic' ? 'disabled' : ''}>${escapeHtml(o.label)}</button>`;
      }

      const statusClass = meta.status === 'core' ? '' : `status-${meta.status}`;

      html += `
        <article class="mutation-card ${isSelected ? 'is-selected' : ''} ${statusClass}" data-locus="${escapeHtml(locusId)}" data-category="${escapeHtml(meta.category)}" data-status="${escapeHtml(meta.status)}">
          <div class="mutation-card-top">
            <div>
              <h3>${escapeHtml(meta.name)}</h3>
              <span class="mutation-type">${escapeHtml(def.type.replace(/_/g, ' '))}</span>
            </div>
            <span class="mutation-status">${escapeHtml(meta.status.charAt(0).toUpperCase() + meta.status.slice(1))}</span>
          </div>
          <p class="mutation-description">${escapeHtml(meta.description)}</p>
          <div class="mutation-states" role="group" aria-label="Estado genético">${stateButtons}</div>
          <div class="mutation-current"><span>Estado:</span> <strong>${escapeHtml(opt.label)}</strong></div>
        </article>
      `;
    }
    if (!html) html = '<p class="no-mutations">No hay mutaciones que coincidan con el filtro.</p>';
    root.innerHTML = html;
    applyFilters(parent);
    updateParentSummary();
  }

  function updateParentSummary() {
    const maleCount = Object.values(state.male).filter(v => v !== 'normal').length;
    const femaleCount = Object.values(state.female).filter(v => v !== 'normal').length;
    const summary = document.getElementById('parent-summary');
    if (maleCount === 0 && femaleCount === 0) {
      summary.textContent = 'Selecciona estados genéticos para los progenitores.';
    } else {
      summary.textContent = `Macho: ${maleCount} mutación(es) seleccionada(s). Hembra: ${femaleCount} mutación(es) seleccionada(s).`;
    }
  }

  function buildGenotype(parent) {
    const genotype = {};
    for (const [locusId, def] of Object.entries(engine.LOCI)) {
      const sel = state[parent][locusId] || 'normal';
      const opts = stateOptions(locusId, parent);
      const opt = opts.find(o => o.value === sel) || opts[0];
      genotype[locusId] = opt.alleles;
    }
    return genotype;
  }

  function calculate() {
    const maleGenotype = buildGenotype('male');
    const femaleGenotype = buildGenotype('female');
    const male = engine.createBird('male', maleGenotype);
    const female = engine.createBird('female', femaleGenotype);
    const valM = engine.validateBird(male);
    const valF = engine.validateBird(female);
    if (!valM.valid || !valF.valid) {
      document.getElementById('parent-summary').textContent = 'Error de validación: ' + [...valM.errors, ...valF.errors].join('; ');
      return;
    }
    try {
      results.raw = engine.calculateCross(male, female);
    } catch (e) {
      document.getElementById('parent-summary').textContent = 'Error en cálculo: ' + e.message;
      return;
    }
    groupResults();
    renderResults();
  }

  function groupResults() {
    const map = new Map();
    for (const o of results.raw) {
      const spanishName = translateText(o.displayName);
      const key = `${o.sex}|${spanishName}`;
      if (!map.has(key)) {
        map.set(key, { ...o, displayName: spanishName, probability: o.probability, count: 1 });
      } else {
        const g = map.get(key);
        g.probability += o.probability;
        g.count++;
      }
    }
    results.grouped = Array.from(map.values()).sort((a, b) => b.probability - a.probability);
  }

  function formatPercent(p) {
    if (p < 0.001) return '<0.1%';
    if (p < 0.01) return (p * 100).toFixed(2) + '%';
    return (p * 100).toFixed(1) + '%';
  }

  function renderResults() {
    const section = document.getElementById('results-section');
    section.hidden = false;
    const summaryGrid = document.getElementById('summary-grid');
    const totalOutcomes = results.raw.length;
    const maleProb = results.grouped.filter(g => g.sex === 'male').reduce((s, g) => s + g.probability, 0);
    const femaleProb = results.grouped.filter(g => g.sex === 'female').reduce((s, g) => s + g.probability, 0);
    const top = results.grouped[0] || { displayName: 'Ninguno', probability: 0 };
    summaryGrid.innerHTML = `
      <div class="summary-card"><strong>${totalOutcomes}</strong><span>Genotipos únicos</span></div>
      <div class="summary-card"><strong>${formatPercent(maleProb)}</strong><span>Prob. macho</span></div>
      <div class="summary-card"><strong>${formatPercent(femaleProb)}</strong><span>Prob. hembra</span></div>
      <div class="summary-card"><strong>${escapeHtml(top.displayName)}</strong><span>Fenotipo principal</span></div>
    `;

    const list = document.getElementById('probability-list');
    list.innerHTML = results.grouped.map((g, idx) => `
      <button class="probability-row ${selectedOutcome === idx ? 'active' : ''}" data-index="${idx}" type="button">
        <span class="prob-rank">${idx + 1}</span>
        <span class="prob-name"><strong>${escapeHtml(g.displayName)}</strong><small>${g.sex === 'male' ? '♂' : '♀'}</small></span>
        <span class="prob-bar"><i style="width:${(g.probability * 100).toFixed(1)}%"></i></span>
        <span class="prob-value">${formatPercent(g.probability)}</span>
      </button>
    `).join('');

    document.getElementById('outcome-count').textContent = `${results.grouped.length} fenotipos agrupados`;
    if (selectedOutcome !== null && selectedOutcome >= results.grouped.length) selectedOutcome = null;
    if (selectedOutcome !== null) showDetail(selectedOutcome);
    else document.getElementById('genotype-empty').hidden = false, document.getElementById('genotype-detail').hidden = true;
  }

  function showDetail(idx) {
    const g = results.grouped[idx];
    selectedOutcome = idx;
    document.querySelectorAll('.probability-row').forEach((btn, i) => btn.classList.toggle('active', i === idx));
    document.getElementById('genotype-empty').hidden = true;
    const detail = document.getElementById('genotype-detail');
    detail.hidden = false;

    const visible = (g.visibleTraits || []).map(translateText);
    const masked = (g.maskedTraits || []).map(translateText);
    const carrier = (g.carrierTraits || []).map(translateText);
    const compound = (g.compoundTraits || []).map(translateText);

    const traits = [];
    if (visible.length) traits.push(`<div class="trait-group"><strong>Visibles:</strong> ${visible.map(escapeHtml).join(', ')}</div>`);
    if (masked.length) traits.push(`<div class="trait-group"><strong>Enmascarados:</strong> ${masked.map(escapeHtml).join(', ')}</div>`);
    if (carrier.length) traits.push(`<div class="trait-group"><strong>Portadores:</strong> ${carrier.map(escapeHtml).join(', ')}</div>`);
    if (compound.length) traits.push(`<div class="trait-group"><strong>Compuestos:</strong> ${compound.map(escapeHtml).join(', ')}</div>`);

    // Filtrar únicamente los loci que poseen mutaciones (no silvestres)
    const nonNormalLoci = Object.entries(g.genotype || {}).filter(([locusId, alleles]) => {
      if (!alleles || !Array.isArray(alleles)) return false;
      return alleles.some(a => a && !isWildtypeAllele(a, locusId));
    });

    detail.innerHTML = `
      <h4>${escapeHtml(g.displayName)} <small>${g.sex === 'male' ? '♂ Macho' : '♀ Hembra'}</small></h4>
      <p class="detail-prob">Probabilidad: ${formatPercent(g.probability)}</p>
      ${traits.join('')}
      <div class="genotype-table">
        <h5>Genotipo (loci no normales)</h5>
        <table>
          <thead><tr><th>Locus</th><th>Alelos</th></tr></thead>
          <tbody>
            ${nonNormalLoci.length ? nonNormalLoci.map(([k, v]) => `
              <tr>
                <td>${escapeHtml(labelMap[k] || k)}</td>
                <td>${v.map(a => escapeHtml(translateAllele(a))).join(' / ')}</td>
              </tr>
            `).join('') : '<tr><td colspan="2">Sin mutaciones adicionales (silvestre)</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  function clearParents() {
    state.male = {};
    state.female = {};
    renderParent('male');
    renderParent('female');
    document.getElementById('results-section').hidden = true;
  }

  function loadExample() {
    state.male = {
      blue_series: 'blue',
      dark_factor: 'sf',
      opaline: 'carrier'
    };
    state.female = {
      blue_series: 'blue',
      cinnamon: 'visual'
    };
    renderParent('male');
    renderParent('female');
  }

  function swapParents() {
    [state.male, state.female] = [state.female, state.male];
    renderParent('male');
    renderParent('female');
  }

  function applyFilters(parent) {
    const root = document.getElementById(`${parent}-loci`);
    const filter = filters[parent];
    const cards = root.querySelectorAll('.mutation-card');

    cards.forEach(card => {
      const cat = card.dataset.category;
      const status = card.dataset.status;
      const name = card.querySelector('h3').textContent.toLowerCase();
      const locus = card.dataset.locus.toLowerCase();
      let show = true;

      if (filter.category !== 'all') {
        if (filter.category === 'rare') {
          show = status !== 'core';
        } else {
          show = cat === filter.category;
        }
      }

      if (show && filter.query) {
        const q = filter.query.toLowerCase();
        show = name.includes(q) || locus.includes(q);
      }

      card.hidden = !show;
    });
  }

  function bindEvents() {
    document.querySelectorAll('.mutation-grid').forEach(grid => {
      grid.addEventListener('click', e => {
        const btn = e.target.closest('.mutation-state');
        if (!btn) return;
        const locus = btn.dataset.locus;
        const parent = grid.id === 'male-loci' ? 'male' : 'female';
        const val = btn.dataset.state;
        state[parent][locus] = val;
        if (val === 'normal') delete state[parent][locus];
        renderParent(parent);
      });
    });

    document.addEventListener('input', e => {
      const input = e.target.closest('[data-mutation-search]');
      if (!input) return;
      const panel = input.closest('.parent-panel');
      if (!panel) return;
      const parent = panel.dataset.parent;
      filters[parent].query = e.target.value;
      applyFilters(parent);
    });

    document.addEventListener('click', e => {
      const filterBtn = e.target.closest('[data-mutation-filter]');
      if (filterBtn) {
        const panel = filterBtn.closest('.parent-panel');
        if (!panel) return;
        const parent = panel.dataset.parent;
        filters[parent].category = filterBtn.dataset.mutationFilter;
        filterBtn.parentElement.querySelectorAll('.mutation-filter').forEach(b => b.classList.remove('active'));
        filterBtn.classList.add('active');
        applyFilters(parent);
        return;
      }

      const resultRow = e.target.closest('.probability-row');
      if (resultRow) {
        const idx = parseInt(resultRow.dataset.index, 10);
        showDetail(idx);
        return;
      }

      const resultFilterBtn = e.target.closest('.result-filter');
      if (resultFilterBtn) {
        const filter = resultFilterBtn.dataset.filter;
        document.querySelectorAll('.result-filter').forEach(b => b.classList.remove('active'));
        resultFilterBtn.classList.add('active');
        document.querySelectorAll('.probability-row').forEach(row => {
          const sex = row.querySelector('.prob-name small').textContent;
          if (filter === 'all' || (filter === 'male' && sex === '♂') || (filter === 'female' && sex === '♀')) {
            row.hidden = false;
          } else {
            row.hidden = true;
          }
        });
        return;
      }

      if (e.target.id === 'calculate') {
        calculate();
        return;
      }

      if (e.target.id === 'clear-parents') {
        clearParents();
        return;
      }

      if (e.target.id === 'load-example') {
        loadExample();
        return;
      }

      if (e.target.id === 'swap-parents') {
        swapParents();
        return;
      }
    });
  }

  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const resp = await fetch('mutations.json');
      if (resp.ok) {
        const data = await resp.json();
        const byId = new Map(data.loci.map(l => [l.id, l]));
        for (const [id, meta] of Object.entries(labelMap)) {
          if (byId.has(id)) {
            const src = byId.get(id);
            labelMap[id] = src.name || meta;
          }
        }
      }
    } catch (_) {}
    renderParent('male');
    renderParent('female');
    bindEvents();
  });
})();