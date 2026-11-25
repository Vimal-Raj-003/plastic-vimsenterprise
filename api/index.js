const POLYMER_CATALOG = [
  {
    id: 'pp-homo',
    name: 'Polypropylene (PP)',
    family: 'PP — Polypropylene Homopolymer & Copolymer',
    grade: 'Virgin Injection & Raffia Grade',
    color: 'Natural Virgin White',
    rate: '₹118 / kg',
    density: '0.90 – 0.91 g/cm³',
    applications: ['Automotive interior trim', 'Rigid packaging & caps', 'Household & medical moldings']
  },
  {
    id: 'hdpe-cobalt',
    name: 'High-Density Polyethylene (HDPE)',
    family: 'HDPE — High-Density Polyethylene',
    grade: 'High-Rigidity Molding & Blow Grade',
    color: 'Cobalt Blue',
    rate: '₹124 / kg',
    density: '0.94 – 0.96 g/cm³',
    applications: ['Industrial crates & containers', 'Pressure pipes & fittings', 'Chemical drums & closures']
  },
  {
    id: 'pa66-green',
    name: 'Polyamide 66 (PA66 / Nylon 66)',
    family: 'PA66 — High-Thermal Polyamide 66',
    grade: 'Heat-Stabilized Structural Grade',
    color: 'Emerald Green',
    rate: '₹195 / kg',
    density: '1.14 – 1.15 g/cm³',
    applications: ['Radiator end tanks', 'High-load mechanical gears', 'Terminal blocks & connectors']
  },
  {
    id: 'pa6-red',
    name: 'Polyamide 6 (PA6 / Nylon 6)',
    family: 'PA6 — Polyamide 6 Engineering Resin',
    grade: 'Engineering Gear & Bearing Grade',
    color: 'Crimson Red',
    rate: '₹185 / kg',
    density: '1.13 – 1.15 g/cm³',
    applications: ['Spur gears & bearings', 'Power tool housings', 'Automotive under-hood clips']
  },
  {
    id: 'abs-amber',
    name: 'ABS Engineering Resin',
    family: 'ABS — High-Impact Engineering Terpolymer',
    grade: 'High-Gloss Injection Molding Grade',
    color: 'Amber Gold',
    rate: '₹152 / kg',
    density: '1.04 – 1.06 g/cm³',
    applications: ['Appliance & electronics housings', 'Automotive dashboard fascia', 'Precision enclosures']
  },
  {
    id: 'pet-clear',
    name: 'PET Polyester Granules',
    family: 'PET — Polyethylene Terephthalate',
    grade: 'Optical Preform & Bottle Grade',
    color: 'Crystal Clear',
    rate: '₹114 / kg',
    density: '1.33 – 1.38 g/cm³',
    applications: ['Beverage preforms & containers', 'Optical packaging', 'Electrical coil forms']
  },
  {
    id: 'pc-optical',
    name: 'Polycarbonate (PC)',
    family: 'PC — Engineering Polycarbonate',
    grade: 'High-Impact Optical & Lens Grade',
    color: 'Transparent Clear',
    rate: '₹210 / kg',
    density: '1.20 – 1.22 g/cm³',
    applications: ['Automotive lighting lenses', 'Electrical switchgear housings', 'Safety visors & enclosures']
  },
  {
    id: 'ldpe-film',
    name: 'Low-Density Polyethylene (LDPE)',
    family: 'LDPE — Low-Density Polyethylene',
    grade: 'Flexible Molding & Film Grade',
    color: 'Translucent Natural',
    rate: '₹122 / kg',
    density: '0.91 – 0.93 g/cm³',
    applications: ['Flexible closures & seals', 'Squeeze bottles & liners', 'Wire & cable jacketing']
  },
  {
    id: 'pvc-grey',
    name: 'PVC Industrial Compound',
    family: 'PVC — Rigid & Flexible Compound',
    grade: 'Rigid Fitting & Conduit Compound',
    color: 'Industrial Slate Grey',
    rate: '₹108 / kg',
    density: '1.35 – 1.45 g/cm³',
    applications: ['Pipe fittings & valves', 'Electrical conduit boxes', 'Cable insulation profiles']
  }
];

function buildChatbotReply(message, activePolymerId) {
  const q = String(message || '').toLowerCase().trim();
  const activeProduct = POLYMER_CATALOG.find(p => p.id === activePolymerId) || POLYMER_CATALOG[0];

  const matchedProduct = POLYMER_CATALOG.find(p => {
    if (q.includes('pa66') || q.includes('nylon 66')) return p.id === 'pa66-green';
    if (q.includes('pa6') || q.includes('nylon 6')) return p.id === 'pa6-red';
    if (q.includes('hdpe')) return p.id === 'hdpe-cobalt';
    if (q.includes('ldpe')) return p.id === 'ldpe-film';
    if (q.includes('pet')) return p.id === 'pet-clear';
    if (q.includes('polycarbonate') || /\bpc\b/.test(q)) return p.id === 'pc-optical';
    if (q.includes('abs')) return p.id === 'abs-amber';
    if (q.includes('pvc')) return p.id === 'pvc-grey';
    if (q.includes('polypropylene') || /\bpp\b/.test(q)) return p.id === 'pp-homo';
    return false;
  }) || activeProduct;

  if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('quote')) {
    return {
      reply: `**${matchedProduct.name}**\n• **Indicative Rate:** ${matchedProduct.rate}\n• **Grade:** ${matchedProduct.grade}\n• **Order Contact:** +91 99406 60868 / Vimal@vimsenterprise.com`,
      productContext: matchedProduct
    };
  }

  if (q.includes('contact') || q.includes('team') || q.includes('phone') || q.includes('whatsapp') || q.includes('email')) {
    return {
      reply: `Reach **VIMS Enterprises** directly:\n• **Call / WhatsApp:** +91 99406 60868\n• **Email:** Vimal@vimsenterprise.com`,
      productContext: matchedProduct
    };
  }

  return {
    reply: `**${matchedProduct.name}** (${matchedProduct.rate})\n• **Grade:** ${matchedProduct.grade}\n• **Color:** ${matchedProduct.color}\n• **Density:** ${matchedProduct.density}\n• **Applications:** ${matchedProduct.applications.join(', ')}\n\nContact **+91 99406 60868** or **Vimal@vimsenterprise.com** for orders.`,
    productContext: matchedProduct
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const url = req.url || '';
  if (url.includes('/api/polymers') && req.method === 'GET') {
    res.status(200).json({ status: 'ok', polymers: POLYMER_CATALOG });
    return;
  }

  if (url.includes('/api/chatbot') && req.method === 'POST') {
    const body = typeof req.body === 'object' && req.body ? req.body : {};
    const result = buildChatbotReply(body.message, body.polymerId);
    res.status(200).json({ status: 'ok', ...result });
    return;
  }

  if (url.includes('/api/enquiry') && req.method === 'POST') {
    const referenceId = 'VIMS-' + Date.now().toString(36).toUpperCase();
    res.status(200).json({ status: 'ok', referenceId });
    return;
  }

  res.status(200).json({ status: 'ok', service: 'VIMS Plastic Polymers API' });
};
