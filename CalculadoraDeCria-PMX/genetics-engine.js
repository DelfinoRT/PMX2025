const GeneticsEngine = (() => {
  const LOCI = {
    blue_series: { type: 'autosomal_allelic_series', alleles: ['blue_wt','blue_1','blue_2','yellowface_1','yellowface_2','goldenface'], dominance: { blue_wt: 0, blue_1: 1, blue_2: 1, yellowface_1: 1, yellowface_2: 1, goldenface: 1 } },
    dark_factor: { type: 'autosomal_incomplete_dominant', alleles: ['normal','dark','dark_dark'], dose: { normal: 0, dark: 1, dark_dark: 2 } },
    grey: { type: 'autosomal_incomplete_dominant', alleles: ['normal','grey'], dose: { normal: 0, grey: 1 } },
    violet: { type: 'autosomal_incomplete_dominant', alleles: ['normal','violet','violet_violet'], dose: { normal: 0, violet: 1, violet_violet: 2 } },
    spangle: { type: 'autosomal_incomplete_dominant', alleles: ['normal','spangle','spangle_df'], dose: { normal: 0, spangle: 1, spangle_df: 2 } },
    dominant_pied: { type: 'autosomal_incomplete_dominant', alleles: ['normal','dominant_pied','dominant_pied_df'], dose: { normal: 0, dominant_pied: 1, dominant_pied_df: 2 } },
    clearflight_pied: { type: 'autosomal_incomplete_dominant', alleles: ['normal','clearflight_pied','clearflight_pied_df'], dose: { normal: 0, clearflight_pied: 1, clearflight_pied_df: 2 } },
    dutch_pied: { type: 'autosomal_incomplete_dominant', alleles: ['normal','dutch_pied','dutch_pied_df'], dose: { normal: 0, dutch_pied: 1, dutch_pied_df: 2 } },
    recessive_pied: { type: 'autosomal_recessive', alleles: ['normal','recessive_pied'] },
    dilution: { type: 'autosomal_allelic_series', alleles: ['normal','clearwing','greywing','dilute'], dominance: { normal: 0, clearwing: 1, greywing: 1, dilute: 1 } },
    blackface: { type: 'autosomal_recessive', alleles: ['normal','blackface'] },
    blackwing: { type: 'autosomal_recessive', alleles: ['normal','blackwing'] },
    saddleback: { type: 'autosomal_recessive', alleles: ['normal','saddleback'] },
    german_fallow: { type: 'autosomal_recessive', alleles: ['normal','german_fallow'] },
    english_fallow: { type: 'autosomal_recessive', alleles: ['normal','english_fallow'] },
    scottish_fallow: { type: 'autosomal_recessive', alleles: ['normal','scottish_fallow'] },
    easley_clearbody: { type: 'autosomal_dominant', alleles: ['normal','easley_clearbody'] },
    anthracite: { type: 'autosomal_incomplete_dominant', alleles: ['normal','anthracite','anthracite_df'], dose: { normal: 0, anthracite: 1, anthracite_df: 2 } },
    nsl_ino: { type: 'autosomal_recessive', alleles: ['normal','nsl_ino'] },
    opaline: { type: 'sex_linked_recessive', alleles: ['normal','opaline'], chromosome: 'Z' },
    cinnamon: { type: 'sex_linked_recessive', alleles: ['normal','cinnamon'], chromosome: 'Z' },
    ino: { type: 'sex_linked_allelic_series', alleles: ['normal','texas_clearbody','pearly','ino'], dominance: { normal: 0, texas_clearbody: 1, pearly: 2, ino: 3 }, chromosome: 'Z' },
    slate: { type: 'sex_linked_recessive', alleles: ['normal','slate'], chromosome: 'Z' },
    faded: { type: 'experimental', alleles: ['normal','faded'] },
    crest: { type: 'polygenic', alleles: ['unknown'] },
    english_grey: { type: 'experimental', alleles: ['normal','english_grey'] },
    recessive_grey: { type: 'experimental', alleles: ['normal','recessive_grey'] },
    manto_negro: { type: 'experimental', alleles: ['normal','manto_negro'] },
    darkwing: { type: 'autosomal_incomplete_dominant', alleles: ['normal','darkwing','darkwing_df'], dose: { normal: 0, darkwing: 1, darkwing_df: 2 } },
    australian_pied: { type: 'autosomal_incomplete_dominant', alleles: ['normal','australian_pied'] }
  };

  const COMPOUNDS = [
    { id: 'lacewing', requires: [{locus:'cinnamon',allele:'cinnamon'},{locus:'ino',allele:'ino'}] },
    { id: 'fullbody_greywing', requires: [{locus:'dilution',genotype:['clearwing','greywing']}] },
    { id: 'dark_eyed_clear', requiresAny: [{locus:'clearflight_pied',visual:true},{locus:'dutch_pied',visual:true}], requiresAll: [{locus:'recessive_pied',visual:true}] },
    { id: 'rainbow', requiresAll: [{locus:'blue_series',condition:'blue_series_blue'},{locus:'opaline',visual:true},{locus:'dilution',condition:'clearwing'},{locus:'blue_series',condition:'yellowface_or_goldenface'}] }
  ];

  const EPISTASIS = [
    { id: 'ino_masks_eumelanin', priority: 100, when: {locus:'ino',condition:'ino_visual'}, masks: ['blackface','blackwing','cinnamon','spangle','dominant_pied','clearflight_pied','dutch_pied','dark_factor','grey','violet'] },
    { id: 'tcb_dominates_ino', priority: 110, when: {locus:'ino',condition:'texas_clearbody_visual'}, effect: 'texas_clearbody' },
    { id: 'opaline_masks_blackface', priority: 80, when: {locus:'opaline',condition:'visual'}, target: {locus:'blackface',condition:'visual'}, effect: 'mask' },
    { id: 'yellowface_green_mask', priority: 70, when: {locus:'blue_series',condition:'green_series'}, target: {locus:'blue_series',condition:'yellowface_or_goldenface'}, effect: 'mask' },
    { id: 'df_spangle_mask', priority: 75, when: {locus:'spangle',condition:'double_factor'}, masks: ['opaline','blackface'] }
  ];

  const LINKAGE = { z_cinnamon_ino: { loci: ['cinnamon','ino'], recombination: 0.03 } };

  function createBird(sex, genotype = {}, zHaplotypes = null) {
    return { sex, genotype: normalizeGenotype(sex, genotype), zHaplotypes };
  }

  function normalizeGenotype(sex, genotype) {
    const out = {};
    for (const [locus, def] of Object.entries(LOCI)) {
      const raw = genotype[locus];
      if (def.type.startsWith('sex_linked')) {
        if (sex === 'female') {
          const allele = Array.isArray(raw) ? raw[0] : raw;
          out[locus] = [allele || 'normal', 'W'];
        } else if (typeof raw === 'string') {
          out[locus] = [raw, raw];
        } else if (Array.isArray(raw)) {
          out[locus] = [raw[0] || 'normal', raw[1] || 'normal'];
        } else {
          out[locus] = ['normal', 'normal'];
        }
      } else if (typeof raw === 'string') {
        out[locus] = [raw, raw];
      } else if (Array.isArray(raw)) {
        out[locus] = [raw[0] || 'normal', raw[1] || 'normal'];
      } else {
        out[locus] = ['normal', 'normal'];
      }
    }
    return out;
  }

  function validateBird(bird) {
    const errors = [];
    if (!['male','female'].includes(bird.sex)) errors.push('Invalid sex');
    for (const [locus, alleles] of Object.entries(bird.genotype)) {
      const def = LOCI[locus];
      if (!def) { errors.push(`Unknown locus: ${locus}`); continue; }
      const valid = def.alleles;
      for (const a of alleles) {
        if (a !== 'W' && !valid.includes(a)) errors.push(`Invalid allele ${a} at ${locus}`);
      }
      if (def.type.startsWith('sex_linked') && bird.sex === 'female') {
        if (alleles.filter(a => a !== 'W').length > 1) errors.push(`Female cannot have two Z alleles at ${locus}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }

  function generateGametes(bird) {
    const autosomalLoci = Object.keys(bird.genotype).filter(l => !LOCI[l].type.startsWith('sex_linked') && bird.genotype[l][0] !== bird.genotype[l][1]);
    const zLoci = Object.keys(bird.genotype).filter(l => LOCI[l].type.startsWith('sex_linked') && (bird.sex === 'male' ? bird.genotype[l][0] !== bird.genotype[l][1] : bird.genotype[l][0] !== 'normal'));
    const autosomalGametes = [];

    function combineAutosomal(loci, idx, current, results) {
      if (idx === loci.length) { results.push({...current}); return; }
      const locus = loci[idx];
      const [a1, a2] = bird.genotype[locus];
      const choices = a1 === a2 ? [a1] : [a1, a2];
      for (const allele of choices) {
        current[locus] = allele;
        combineAutosomal(loci, idx + 1, current, results);
      }
    }

    combineAutosomal(autosomalLoci, 0, {}, autosomalGametes);

    const sexGametes = [];
    if (bird.sex === 'male') {
      const haplotypes = [];
      function combineZ(loci, idx, current, results) {
        if (idx === loci.length) { results.push({...current}); return; }
        const locus = loci[idx];
        const [a1, a2] = bird.genotype[locus];
        const choices = a1 === a2 ? [a1] : [a1, a2];
        for (const allele of choices) {
          current[locus] = allele;
          combineZ(loci, idx + 1, current, results);
        }
      }
      combineZ(zLoci, 0, {}, haplotypes);
      for (const haplotype of haplotypes) {
        sexGametes.push({ type: 'Z', haplotypes: [haplotype, {}], probability: 1 });
      }
    } else {
      const zAlleles = {};
      for (const locus of zLoci) zAlleles[locus] = bird.genotype[locus][0];
      sexGametes.push({ type: 'Z', haplotypes: [zAlleles, {}], probability: 0.5 });
      sexGametes.push({ type: 'W', haplotypes: [{}, {}], probability: 0.5 });
    }

    const gametes = [];
    for (const autosomal of autosomalGametes) {
      for (const sexChromosome of sexGametes) {
        gametes.push({
          autosomal,
          sexChromosome,
          probability: sexChromosome.probability / autosomalGametes.length
        });
      }
    }
    return gametes;
  }

  function buildDefaultHaplotypes(bird, zLoci) {
    const h1 = {}, h2 = {};
    for (const l of zLoci) {
      const [a1, a2] = bird.genotype[l];
      h1[l] = a1; h2[l] = a2;
    }
    return [[h1, h2]];
  }

  function calculateCross(male, female) {
    const mg = generateGametes(male);
    const fg = generateGametes(female);
    const offspring = [];
    for (const mgm of mg) {
      for (const fgm of fg) {
        const sex = fgm.sexChromosome.type === 'W' ? 'female' : 'male';
        const genotype = {};
        for (const l of Object.keys(LOCI)) {
          if (LOCI[l].type.startsWith('sex_linked')) {
            if (sex === 'male') {
              genotype[l] = [mgm.sexChromosome.haplotypes[0][l] || 'normal', fgm.sexChromosome.haplotypes[0][l] || 'normal'];
            } else {
              genotype[l] = [mgm.sexChromosome.haplotypes[0][l] || 'normal', 'W'];
            }
          } else {
            genotype[l] = [mgm.autosomal[l], fgm.autosomal[l]];
          }
        }
        const prob = mgm.probability * fgm.probability;
        const pheno = derivePhenotype({ sex, genotype });
        offspring.push({ sex, genotype, ...pheno, probability: prob });
      }
    }
    return aggregateOffspring(offspring);
  }

  function aggregateOffspring(list) {
    const map = new Map();
    for (const o of list) {
      const key = JSON.stringify({ sex: o.sex, genotype: o.genotype, visible: o.visibleTraits.sort().join(','), masked: o.maskedTraits.sort().join(','), carrier: o.carrierTraits.sort().join(',') });
      if (map.has(key)) map.get(key).probability += o.probability;
      else map.set(key, {...o});
    }
    return Array.from(map.values()).sort((a,b) => b.probability - a.probability);
  }

  function derivePhenotype(bird) {
    const traits = { visible: [], masked: [], carrier: [], compound: [] };
    const geno = bird.genotype;
    const sex = bird.sex;

    function getAlleles(locus) { return geno[locus] || ['normal','normal']; }
    function hasAllele(locus, allele) { return getAlleles(locus).includes(allele); }
    function isVisual(locus, allele) {
      const def = LOCI[locus];
      const [a1, a2] = getAlleles(locus);
      if (def.type === 'autosomal_recessive') return a1 === allele && a2 === allele;
      if (def.type === 'autosomal_dominant') return a1 === allele || a2 === allele;
      if (def.type === 'autosomal_incomplete_dominant') {
        const dose = (def.dose[a1]||0) + (def.dose[a2]||0);
        return dose >= 1 && allele !== 'normal';
      }
      if (def.type === 'autosomal_allelic_series') {
        const ranks = [def.dominance[a1]||0, def.dominance[a2]||0];
        return Math.max(...ranks) === def.dominance[allele];
      }
      if (def.type === 'sex_linked_recessive') {
        if (sex === 'male') return a1 === allele && a2 === allele;
        return a1 === allele;
      }
      if (def.type === 'sex_linked_allelic_series') {
        const ranks = [def.dominance[a1]||0, def.dominance[a2]||0];
        return Math.max(...ranks) === def.dominance[allele];
      }
      return false;
    }
    function isCarrier(locus, allele) {
      const def = LOCI[locus];
      const [a1, a2] = getAlleles(locus);
      if (def.type === 'autosomal_recessive') return (a1 === allele) !== (a2 === allele);
      if (def.type.startsWith('sex_linked') && sex === 'male') return (a1 === allele) !== (a2 === allele);
      return false;
    }

    const blueAlleles = getAlleles('blue_series');
    const hasBlueAllele = blueAlleles.some(a => ['blue_1','blue_2','yellowface_1','yellowface_2','goldenface'].includes(a));
    const isBlueSeries = hasBlueAllele && !blueAlleles.includes('blue_wt');
    const isGreenSeries = !isBlueSeries;
    const hasYellowFace = blueAlleles.some(a => ['yellowface_1','yellowface_2','goldenface'].includes(a));

    if (isBlueSeries && hasYellowFace && blueAlleles.includes('yellowface_1')) traits.visible.push('Yellowface I');
    else if (isBlueSeries && hasYellowFace && blueAlleles.includes('yellowface_2')) traits.visible.push('Yellowface II');
    else if (isBlueSeries && hasYellowFace && blueAlleles.includes('goldenface')) traits.visible.push('Goldenface');
    else if (isBlueSeries) traits.visible.push('Blue');
    else traits.visible.push('Green');

    const darkDose = (LOCI.dark_factor.dose[getAlleles('dark_factor')[0]]||0) + (LOCI.dark_factor.dose[getAlleles('dark_factor')[1]]||0);
    if (darkDose === 1) traits.visible.push(isBlueSeries ? 'Cobalt' : 'Dark Green');
    else if (darkDose === 2) traits.visible.push(isBlueSeries ? 'Mauve' : 'Olive');

    if (hasAllele('grey', 'grey')) traits.visible.push('Grey');
    const violetDose = (LOCI.violet.dose[getAlleles('violet')[0]]||0) + (LOCI.violet.dose[getAlleles('violet')[1]]||0);
    if (violetDose >= 1) traits.visible.push(violetDose === 2 ? 'DF Violet' : 'SF Violet');

    const spDose = (LOCI.spangle.dose[getAlleles('spangle')[0]]||0) + (LOCI.spangle.dose[getAlleles('spangle')[1]]||0);
    if (spDose === 1) traits.visible.push('Spangle');
    else if (spDose === 2) traits.visible.push('DF Spangle');

    if (hasAllele('dominant_pied', 'dominant_pied')) traits.visible.push('Dominant Pied');
    if (hasAllele('clearflight_pied', 'clearflight_pied')) traits.visible.push('Clearflight Pied');
    if (hasAllele('dutch_pied', 'dutch_pied')) traits.visible.push('Dutch Pied');
    if (isVisual('recessive_pied', 'recessive_pied')) traits.visible.push('Recessive Pied');

    const dil = getAlleles('dilution');
    const dilRanks = dil.map(a => LOCI.dilution.dominance[a]||0);
    const maxDil = Math.max(...dilRanks);
    if (maxDil > 0) {
      const top = dil.find(a => (LOCI.dilution.dominance[a]||0) === maxDil);
      if (top === 'clearwing') traits.visible.push('Clearwing');
      else if (top === 'greywing') traits.visible.push('Greywing');
      else if (top === 'dilute') traits.visible.push('Dilute');
    }
    if (dil.includes('clearwing') && dil.includes('greywing')) traits.compound.push('Fullbody Greywing');

    if (isVisual('blackface', 'blackface')) traits.visible.push('Blackface');
    if (isVisual('blackwing', 'blackwing')) traits.visible.push('Blackwing');
    if (isVisual('saddleback', 'saddleback')) traits.visible.push('Saddleback');
    if (isVisual('german_fallow', 'german_fallow')) traits.visible.push('German Fallow');
    if (isVisual('english_fallow', 'english_fallow')) traits.visible.push('English Fallow');
    if (isVisual('scottish_fallow', 'scottish_fallow')) traits.visible.push('Scottish Fallow');
    if (hasAllele('easley_clearbody', 'easley_clearbody')) traits.visible.push('Easley Clearbody');
    if (hasAllele('anthracite', 'anthracite')) traits.visible.push('Anthracite');
    if (isVisual('nsl_ino', 'nsl_ino')) traits.visible.push('NSL Ino');

    const opa = getAlleles('opaline');
    const cin = getAlleles('cinnamon');
    const inoA = getAlleles('ino');
    const inoRank = Math.max(...inoA.map(a => LOCI.ino.dominance[a]||0));
    const inoVisual = inoRank >= LOCI.ino.dominance.ino;
    const tcbVisual = inoRank === LOCI.ino.dominance.texas_clearbody && !inoVisual;
    const pearlyVisual = inoRank === LOCI.ino.dominance.pearly && !inoVisual && !tcbVisual;

    if (opa.some(a => a === 'opaline')) { if (sex === 'male' ? opa[0] === 'opaline' && opa[1] === 'opaline' : true) traits.visible.push('Opaline'); else traits.carrier.push('Opaline'); }
    if (cin.some(a => a === 'cinnamon')) { if (sex === 'male' ? cin[0] === 'cinnamon' && cin[1] === 'cinnamon' : true) traits.visible.push('Cinnamon'); else traits.carrier.push('Cinnamon'); }
    if (inoVisual) { traits.visible.push(isBlueSeries ? 'Albino' : 'Lutino'); }
    else if (tcbVisual) traits.visible.push('Texas Clearbody');
    else if (pearlyVisual) traits.visible.push('Pearly');

    if (hasAllele('slate', 'slate')) { if (sex === 'male' ? getAlleles('slate').every(a => a === 'slate') : true) traits.visible.push('Slate'); else traits.carrier.push('Slate'); }

    for (const c of COMPOUNDS) {
      if (c.id === 'lacewing') {
        const cinVis = (sex === 'male' ? cin[0] === 'cinnamon' && cin[1] === 'cinnamon' : cin[0] === 'cinnamon');
        if (cinVis && inoVisual) traits.compound.push('Lacewing');
      }
      if (c.id === 'dark_eyed_clear') {
        const hasClearflight = isVisual('clearflight_pied', 'clearflight_pied');
        const hasDutch = isVisual('dutch_pied', 'dutch_pied');
        const hasRec = isVisual('recessive_pied', 'recessive_pied');
        if ((hasClearflight || hasDutch) && hasRec) traits.compound.push('Dark-Eyed Clear');
      }
      if (c.id === 'rainbow') {
        const isBlue = isBlueSeries && !hasYellowFace;
        const hasYF = hasYellowFace;
        const hasOpal = traits.visible.includes('Opaline');
        const hasCw = traits.visible.includes('Clearwing');
        if ((isBlue || hasYF) && hasOpal && hasCw) traits.compound.push('Rainbow');
      }
    }

    for (const rule of EPISTASIS.sort((a,b) => b.priority - a.priority)) {
      if (rule.when.locus === 'ino') {
        if (rule.when.condition === 'ino_visual' && inoVisual) {
          for (const m of rule.masks) {
            const idx = traits.visible.indexOf(m);
            if (idx >= 0) { traits.visible.splice(idx,1); traits.masked.push(m); }
          }
        }
        if (rule.when.condition === 'texas_clearbody_visual' && tcbVisual && rule.effect === 'texas_clearbody') {
          const idx = traits.visible.indexOf(isBlueSeries ? 'Albino' : 'Lutino');
          if (idx >= 0) traits.visible.splice(idx,1);
        }
      }
      if (rule.when.locus === 'opaline' && rule.when.condition === 'visual' && traits.visible.includes('Opaline')) {
        const idx = traits.visible.indexOf('Blackface');
        if (idx >= 0) { traits.visible.splice(idx,1); traits.masked.push('Blackface'); }
      }
      if (rule.when.locus === 'blue_series' && rule.when.condition === 'green_series' && isGreenSeries) {
        if (hasYellowFace) {
          const idx = traits.visible.findIndex(t => ['Yellowface I','Yellowface II','Goldenface'].includes(t));
          if (idx >= 0) { traits.visible.splice(idx,1); traits.masked.push(rule.target.condition); }
        }
      }
      if (rule.when.locus === 'spangle' && rule.when.condition === 'double_factor' && spDose === 2) {
        for (const m of rule.masks) {
          const idx = traits.visible.indexOf(m);
          if (idx >= 0) { traits.visible.splice(idx,1); traits.masked.push(m); }
        }
      }
    }

    for (const [locus, def] of Object.entries(LOCI)) {
      for (const a of def.alleles) {
        if (a === 'normal') continue;
        if (isCarrier(locus, a) && !traits.carrier.includes(a) && !traits.visible.includes(a)) traits.carrier.push(a);
      }
    }

    let display = traits.visible.join(' ');
    if (traits.compound.length) display += ' (' + traits.compound.join(', ') + ')';
    if (!display) display = isGreenSeries ? 'Light Green' : 'Sky Blue';

    return { visibleTraits: traits.visible, maskedTraits: traits.masked, carrierTraits: traits.carrier, compoundTraits: traits.compound, displayName: display };
  }

  return { createBird, validateBird, generateGametes, calculateCross, derivePhenotype, LOCI, COMPOUNDS, EPISTASIS, LINKAGE };
})();

if (typeof module !== 'undefined') module.exports = GeneticsEngine;
if (typeof window !== 'undefined') window.GeneticsEngine = GeneticsEngine;