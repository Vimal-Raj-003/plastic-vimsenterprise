const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 4500;
const BASE_DIR = __dirname;
const ENQUIRIES_FILE = path.join(BASE_DIR, 'enquiries.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.zip': 'application/zip'
};

// Verified single-source-of-truth polymer catalog matching frontend app.js
const POLYMER_CATALOG = [
  {
    id: 'pp-homo',
    name: 'Polypropylene (PP)',
    family: 'PP — Polypropylene Homopolymer & Copolymer',
    grade: 'Injection & Extrusion Grade (Request Grade TDS)',
    color: 'Natural Virgin White',
    priceStatus: 'Request Price',
    priceUnit: 'Per MT / 25 kg Bag (Custom B2B Quote)',
    density: '0.90 – 0.91 g/cm³',
    processingNote: 'High stiffness, chemical resistance, and hinge fatigue durability for automotive, packaging, and appliance components.',
    applications: ['Automotive interior trim', 'Rigid packaging & caps', 'Household & medical moldings']
  },
  {
    id: 'hdpe-cobalt',
    name: 'High-Density Polyethylene (HDPE)',
    family: 'HDPE — High-Density Polyethylene',
    grade: 'High-Rigidity Molding & Blow Grade (Request Grade TDS)',
    color: 'Cobalt Blue Masterbatch / Natural',
    priceStatus: 'Request Price',
    priceUnit: 'Per MT / 25 kg Bag (Custom B2B Quote)',
    density: '0.94 – 0.96 g/cm³',
    processingNote: 'High impact strength, low moisture absorption, and strong environmental stress-crack resistance.',
    applications: ['Industrial crates & containers', 'Pressure pipes & fittings', 'Chemical drums & closures']
  },
  {
    id: 'ldpe-film',
    name: 'Low-Density Polyethylene (LDPE)',
    family: 'LDPE — Low-Density Polyethylene',
    grade: 'Flexible Molding & Film Grade (Request Grade TDS)',
    color: 'Translucent Natural',
    priceStatus: 'Request Price',
    priceUnit: 'Per MT / 25 kg Bag (Custom B2B Quote)',
    density: '0.91 – 0.93 g/cm³',
    processingNote: 'Excellent flexibility, toughness, and flow characteristics for thin-wall molding and squeeze applications.',
    applications: ['Flexible closures & seals', 'Squeeze bottles & liners', 'Wire & cable jacketing']
  },
  {
    id: 'pet-bottle',
    name: 'Polyethylene Terephthalate (PET)',
    family: 'PET — Polyethylene Terephthalate',
    grade: 'Preform & Optical Molding Grade (Request Grade TDS)',
    color: 'Crystal Clear',
    priceStatus: 'Request Price',
    priceUnit: 'Per MT / 25 kg Bag (Custom B2B Quote)',
    density: '1.33 – 1.38 g/cm³',
    processingNote: 'High optical clarity, gas barrier performance, and dimensional stability for preforms and technical housings.',
    applications: ['Beverage preforms & containers', 'Optical packaging', 'Electrical coil forms']
  },
  {
    id: 'pc-optical',
    name: 'Polycarbonate (PC)',
    family: 'PC — Engineering Polycarbonate',
    grade: 'High-Impact Optical & Electrical Grade (Request Grade TDS)',
    color: 'Transparent Clear / Tinted',
    priceStatus: 'Request Price',
    priceUnit: 'Per MT / 25 kg Bag (Custom B2B Quote)',
    density: '1.20 – 1.22 g/cm³',
    processingNote: 'Exceptional impact toughness, heat resistance, and optical transparency for precision engineering parts.',
    applications: ['Automotive lighting lenses', 'Electrical switchgear housings', 'Safety visors & enclosures']
  },
  {
    id: 'abs-hi',
    name: 'Acrylonitrile Butadiene Styrene (ABS)',
    family: 'ABS — High-Impact Engineering Terpolymer',
    grade: 'High-Gloss Injection Molding Grade (Request Grade TDS)',
    color: 'Amber Gold / Custom Color Match',
    priceStatus: 'Request Price',
    priceUnit: 'Per MT / 25 kg Bag (Custom B2B Quote)',
    density: '1.04 – 1.06 g/cm³',
    processingNote: 'Balanced impact toughness, surface gloss, and dimensional accuracy for consumer electronics and automotive trim.',
    applications: ['Appliance & electronics housings', 'Automotive dashboard fascia', 'Precision enclosures']
  },
  {
    id: 'pa6-eng',
    name: 'Polyamide 6 (PA6 / Nylon 6)',
    family: 'PA6 — Polyamide 6 Engineering Resin',
    grade: 'Unfilled & Glass-Fiber Reinforced Grade (Request Grade TDS)',
    color: 'Signal Red / Natural Ivory',
    priceStatus: 'Request Price',
    priceUnit: 'Per MT / 25 kg Bag (Custom B2B Quote)',
    density: '1.13 – 1.15 g/cm³',
    processingNote: 'High toughness, abrasion resistance, and damping capacity for dynamic mechanical gears and brackets.',
    applications: ['Spur gears & bearings', 'Power tool housings', 'Automotive under-hood clips']
  },
  {
    id: 'pa66-thermal',
    name: 'Polyamide 66 (PA66 / Nylon 66)',
    family: 'PA66 — High-Thermal Polyamide 66',
    grade: 'Heat-Stabilized Structural Grade (Request Grade TDS)',
    color: 'Emerald Green / Natural',
    priceStatus: 'Request Price',
    priceUnit: 'Per MT / 25 kg Bag (Custom B2B Quote)',
    density: '1.14 – 1.15 g/cm³',
    processingNote: 'Higher thermal resistance, tensile rigidity, and creep resistance for structural under-hood and electrical connectors.',
    applications: ['Radiator end tanks', 'High-load mechanical gears', 'Terminal blocks & connectors']
  },
  {
    id: 'pvc-compound',
    name: 'Polyvinyl Chloride (PVC)',
    family: 'PVC — Rigid & Flexible Compound',
    grade: 'Industrial Fitting & Cable Compound (Request Grade TDS)',
    color: 'Industrial Slate Grey',
    priceStatus: 'Request Price',
    priceUnit: 'Per MT / 25 kg Bag (Custom B2B Quote)',
    density: '1.35 – 1.45 g/cm³',
    processingNote: 'Inherent flame retardancy, chemical resistance, and weatherability for industrial fittings and electrical conduits.',
    applications: ['Pipe fittings & valves', 'Electrical conduit boxes', 'Cable insulation profiles']
  }
];

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function buildChatbotReply(message, activePolymerId) {
  const q = String(message || '').toLowerCase().trim();
  const activeProduct = POLYMER_CATALOG.find(p => p.id === activePolymerId) || POLYMER_CATALOG[0];

  // Check if user mentioned a specific polymer in their message
  const matchedProduct = POLYMER_CATALOG.find(p => {
    const idTokens = p.id.split('-');
    const nameLower = p.name.toLowerCase();
    if (q.includes('pa66') || q.includes('nylon 66')) return p.id === 'pa66-thermal';
    if (q.includes('pa6') || q.includes('nylon 6')) return p.id === 'pa6-eng';
    if (q.includes('hdpe')) return p.id === 'hdpe-cobalt';
    if (q.includes('ldpe')) return p.id === 'ldpe-film';
    if (q.includes('pet')) return p.id === 'pet-bottle';
    if (q.includes('polycarbonate') || /\bpc\b/.test(q)) return p.id === 'pc-optical';
    if (q.includes('abs')) return p.id === 'abs-hi';
    if (q.includes('pvc')) return p.id === 'pvc-compound';
    if (q.includes('polypropylene') || /\bpp\b/.test(q)) return p.id === 'pp-homo';
    return q.includes(nameLower) || idTokens.some(t => t.length > 2 && q.includes(t));
  }) || activeProduct;

  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('quote') || q.includes('moq')) {
    return {
      reply: `Pricing for **${matchedProduct.name}** (${matchedProduct.family}) depends on the specific grade TDS, color masterbatch requirement, and order volume (25 kg sample bags vs. metric ton dispatches). Because resin rates vary by batch and grade specification, we list **${matchedProduct.priceStatus}** rather than publishing unverified static prices. Click **Open Quote Form for ${matchedProduct.name.split(' ')[0]}** below or email **Vimal@vimsenterprise.com** (+91 9940660868) for an official quotation.`,
      suggestedAction: 'open-enquiry',
      productContext: matchedProduct
    };
  }

  if (q.includes('molding') || q.includes('process') || q.includes('inject') || q.includes('screw') || q.includes('cool') || q.includes('eject')) {
    return {
      reply: `Our scroll-driven manufacturing demonstration illustrates the 6-stage thermoplastic injection molding cycle using **${matchedProduct.name}**: (1) Hopper feeding from the material container, (2) Reciprocating screw conveying & plasticizing inside the heated barrel, (3) High-pressure injection into the closed & clamped steel mold cavity, (4) Holding pressure & cooling channel solidification, and (5) Mold platen opening & ejector-pin part release. Need processing guidance or a Technical Data Sheet (TDS) for **${matchedProduct.name}**? Our team can share verified grade parameters.`,
      suggestedAction: 'open-enquiry',
      productContext: matchedProduct
    };
  }

  if (q.includes('contact') || q.includes('team') || q.includes('phone') || q.includes('whatsapp') || q.includes('email') || q.includes('human')) {
    return {
      reply: `You can reach the **VIMS Enterprises** technical and sales team directly:\n• **Phone / WhatsApp:** +91 9940660868\n• **Email:** Vimal@vimsenterprise.com\n• **Currently selected material:** ${matchedProduct.name} (${matchedProduct.color})\nWould you like to open the pre-filled enquiry form for **${matchedProduct.name}**?`,
      suggestedAction: 'open-enquiry',
      productContext: matchedProduct
    };
  }

  if (q.includes('find') || q.includes('recommend') || q.includes('compare') || q.includes('which polymer') || q.includes('catalog')) {
    return {
      reply: `VIMS Enterprises supplies 9 core thermoplastic resin families:\n• **Polyolefins:** PP, HDPE, LDPE\n• **Clear & Packaging Resins:** PET, PC\n• **Engineering & Industrial Resins:** ABS, PA6 (Nylon 6), PA66 (Nylon 66), PVC\n\nYou are currently viewing **${matchedProduct.name}** (${matchedProduct.density}), commonly used for ${matchedProduct.applications.join(', ')}. Tell me your part application (e.g., gears, clear lenses, crates, pipe fittings) or request a grade quote below.`,
      suggestedAction: 'open-enquiry',
      productContext: matchedProduct
    };
  }

  return {
    reply: `**${matchedProduct.name}**\n• **Resin Family:** ${matchedProduct.family}\n• **Grade Status:** ${matchedProduct.grade}\n• **Color Shown:** ${matchedProduct.color}\n• **Typical Density:** ${matchedProduct.density}\n• **Applications:** ${matchedProduct.applications.join(', ')}\n\nFor verified grade-specific TDS sheets or bulk pricing (${matchedProduct.priceStatus}), use the enquiry form or contact **Vimal@vimsenterprise.com** (+91 9940660868).`,
    suggestedAction: 'open-enquiry',
    productContext: matchedProduct
  };
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  if (req.method === 'GET' && pathname === '/api/polymers') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', polymers: POLYMER_CATALOG }));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/chatbot') {
    try {
      const body = await readJsonBody(req);
      if (body && body.simulateError) {
        res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Assistant service temporarily unavailable.' }));
        return;
      }
      const result = buildChatbotReply(body.message, body.polymerId);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        status: 'ok',
        assistantType: 'VIMS Automated Product Assistant (Verified Catalog)',
        ...result
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Invalid request payload.' }));
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/enquiry') {
    try {
      const body = await readJsonBody(req);
      const name = String(body.name || '').trim();
      const contact = String(body.contact || '').trim();
      const polymer = String(body.polymer || '').trim();
      if (!name || !contact || !polymer) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Name, email/phone, and polymer selection are required.' }));
        return;
      }
      let existing = [];
      if (fs.existsSync(ENQUIRIES_FILE)) {
        try {
          existing = JSON.parse(fs.readFileSync(ENQUIRIES_FILE, 'utf8'));
          if (!Array.isArray(existing)) existing = [];
        } catch (_) {
          existing = [];
        }
      }
      const referenceId = 'VIMS-' + Date.now().toString(36).toUpperCase();
      const record = {
        referenceId,
        createdAt: new Date().toISOString(),
        name,
        company: String(body.company || '').trim(),
        contact,
        polymer,
        family: String(body.family || '').trim(),
        grade: String(body.grade || '').trim(),
        quantity: String(body.quantity || '').trim(),
        notes: String(body.notes || '').trim()
      };
      existing.push(record);
      fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(existing, null, 2), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'ok', referenceId, record }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Could not save enquiry.' }));
    }
    return;
  }

  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.join(BASE_DIR, relativePath);

  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`VIMS Enterprises 3D Polymer Server running at http://localhost:${PORT}`);
});
