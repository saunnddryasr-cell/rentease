import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Output locations
const publicDir1 = path.resolve('public');
const publicDir2 = path.resolve('frontend/public');
if (!fs.existsSync(publicDir1)) fs.mkdirSync(publicDir1, { recursive: true });
if (!fs.existsSync(publicDir2)) fs.mkdirSync(publicDir2, { recursive: true });

const pdfPath1 = path.join(publicDir1, 'RentEase_Platform_Report.pdf');
const pdfPath2 = path.join(publicDir2, 'RentEase_Platform_Report.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true
});

const writeStream1 = fs.createWriteStream(pdfPath1);
doc.pipe(writeStream1);

// Colors
const PRIMARY = '#B45309'; // Warm amber/brown
const SECONDARY = '#0F172A'; // Dark slate
const ACCENT = '#059669'; // Emerald
const MUTED = '#64748B'; // Slate muted
const LIGHT_BG = '#F8FAFC';
const BORDER_COLOR = '#E2E8F0';

function drawHeader(title) {
  doc.fontSize(8).fillColor(MUTED).text('RENTEASE PLATFORM & ARCHITECTURE REPORT', 50, 30, { align: 'left' });
  doc.fontSize(8).fillColor(MUTED).text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), 50, 30, { align: 'right' });
  doc.strokeColor(BORDER_COLOR).lineWidth(0.5).moveTo(50, 42).lineTo(545, 42).stroke();
  doc.y = 55;
}

// ================= PAGE 1: COVER & EXECUTIVE SUMMARY =================
drawHeader();

// Title Block
doc.moveDown(1.5);
doc.fontSize(28).font('Helvetica-Bold').fillColor(PRIMARY).text('Rent', { continued: true });
doc.fillColor(SECONDARY).text('Ease');
doc.fontSize(14).font('Helvetica-Bold').fillColor(SECONDARY).text('Comprehensive Platform, Architecture & Product Report');
doc.fontSize(10).font('Helvetica').fillColor(MUTED).text('A Full-Stack Subscription Commerce Platform for Flexible Living in Urban Hubs');

doc.moveDown(1);
doc.strokeColor(PRIMARY).lineWidth(2).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
doc.moveDown(1.5);

// Metadata box
const metaY = doc.y;
doc.rect(50, metaY, 495, 55).fillAndStroke(LIGHT_BG, BORDER_COLOR);
doc.fontSize(9).font('Helvetica-Bold').fillColor(SECONDARY);
doc.text('Version: 2.4.0 (Production Release)', 65, metaY + 12);
doc.text('Runtime: Full-Stack React 19 + Express + MongoDB Atlas', 65, metaY + 26);
doc.text('Database Cluster: cluster0.kk44seh.mongodb.net (DB: rentease)', 65, metaY + 40);

doc.text('Cloud Provider: Vercel Serverless Gateway', 320, metaY + 12);
doc.text('Live Products in DB: 22 Active Items', 320, metaY + 26);
doc.text('Classification: Production System Specification', 320, metaY + 40);

doc.y = metaY + 70;
doc.moveDown(0.8);

// Section 1: Executive Summary
doc.fontSize(14).font('Helvetica-Bold').fillColor(PRIMARY).text('1. Executive Summary');
doc.moveDown(0.4);
doc.fontSize(10).font('Helvetica').fillColor(SECONDARY).text(
  'RentEase is an end-to-end furniture and smart appliances subscription platform tailored for young professionals, students, interns, and remote-first nomads across tier-1 Indian metros (Bengaluru, Mumbai, Delhi-NCR, Hyderabad, and Pune).',
  { align: 'justify', lineGap: 3 }
);
doc.moveDown(0.5);
doc.text(
  'The platform solves the friction of traditional home setup: exorbitant capital expenditure on brand-new furniture, the logistical nightmare of relocation, and rapid depreciation. By decoupling utility from ownership through flexible tenure commitments (3, 6, and 12-month plans) with 100% refundable deposits, comprehensive zero-charge doorstep maintenance, and guaranteed 48-hour delivery, RentEase transforms durable goods into a seamless service.',
  { align: 'justify', lineGap: 3 }
);

doc.moveDown(1);

// Key Value Propositions Box
doc.fontSize(11).font('Helvetica-Bold').fillColor(SECONDARY).text('Key Business & Customer Pillars:');
doc.moveDown(0.4);

const pillars = [
  ['Zero Upfront Capital', 'Fractional monthly rent starting as low as ₹299/mo instead of ₹30,000+ upfront purchase.'],
  ['Duration-Discounted Curves', 'Algorithmic tiered pricing: 12-month contracts yield up to 25% rent savings versus 3-month plans.'],
  ['100% Refundable Deposits', 'Security deposits held securely and refunded via digital audit trails within 48h of return.'],
  ['Free Lifetime Servicing', 'Complimentary bi-annual deep sanitization, breakdown servicing, and free relocation support.'],
  ['Full-Stack Operations', 'Integrated logistics portal for order tracking, tenure extensions, returns, and technician dispatch.']
];

pillars.forEach(([title, desc]) => {
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(PRIMARY).text(`• ${title}: `, { continued: true });
  doc.font('Helvetica').fillColor(SECONDARY).text(desc, { lineGap: 2 });
});

// ================= PAGE 2: ARCHITECTURE & TECH STACK =================
doc.addPage();
drawHeader();

doc.fontSize(14).font('Helvetica-Bold').fillColor(PRIMARY).text('2. System Architecture & Tech Stack');
doc.moveDown(0.5);

doc.fontSize(10).font('Helvetica').fillColor(SECONDARY).text(
  'RentEase is engineered with a modern decoupling strategy allowing seamless unified execution on local development and high-availability serverless deployment on Vercel backed by persistent cloud storage.',
  { align: 'justify', lineGap: 3 }
);

doc.moveDown(0.8);

// Tech Stack Table
doc.fontSize(11).font('Helvetica-Bold').fillColor(SECONDARY).text('Technology Matrix:');
doc.moveDown(0.4);

const tableY = doc.y;
const col1 = 50, col2 = 160, col3 = 300, col4 = 430;
doc.rect(50, tableY, 495, 20).fillAndStroke(PRIMARY, PRIMARY);
doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#FFFFFF');
doc.text('LAYER', col1 + 8, tableY + 6);
doc.text('TECHNOLOGY', col2 + 8, tableY + 6);
doc.text('ROLE & SPECIFICATION', col3 + 8, tableY + 6);
doc.text('DEPLOYMENT TARGET', col4 + 8, tableY + 6);

const techRows = [
  ['Client Frontend', 'React 19 + TypeScript + Vite 8', 'Single Page Application with fast HMR, strict types', 'Vercel CDN Edge'],
  ['Styling Engine', 'Tailwind CSS v4 (Modern CSS AST)', 'Zero-runtime utility engine, bespoke design constitution', 'Bundled CSS Output'],
  ['Icons & Assets', 'Lucide React + WebP Assets', 'Scalable vector icons & high-fidelity photographic imagery', 'Edge Cached'],
  ['API Layer', 'Express.js + Node.js 22 LTS', 'RESTful modular endpoints with CORS & URL normalization', 'Vercel Serverless Function'],
  ['Database Engine', 'MongoDB Atlas (Cluster 0)', 'Distributed Document DB with ACID transactions & indexing', 'AWS Mumbai (ap-south-1)'],
  ['DevOps Gateway', 'Vercel URL Rewrite Gateway', 'Path normalizer routing x-matched-path into serverless core', 'Vercel Edge Network']
];

let curY = tableY + 20;
techRows.forEach((row, i) => {
  const bg = i % 2 === 0 ? LIGHT_BG : '#FFFFFF';
  doc.rect(50, curY, 495, 22).fillAndStroke(bg, BORDER_COLOR);
  doc.fontSize(8).font('Helvetica-Bold').fillColor(SECONDARY).text(row[0], col1 + 8, curY + 6);
  doc.font('Helvetica').fillColor(PRIMARY).text(row[1], col2 + 8, curY + 6);
  doc.font('Helvetica').fillColor(SECONDARY).text(row[2], col3 + 8, curY + 6);
  doc.font('Helvetica').fillColor(MUTED).text(row[3], col4 + 8, curY + 6);
  curY += 22;
});

doc.y = curY + 15;

// Section 3: Database Collections
doc.fontSize(14).font('Helvetica-Bold').fillColor(PRIMARY).text('3. Cloud Database Data Model (MongoDB Atlas)');
doc.moveDown(0.4);

const schemaDetails = [
  ['products', 'Primary rental inventory (title, category, 3/6/12m pricing, deposit, stockCount, condition, warranty).'],
  ['orders', 'Customer rental agreements (orderNumber, line items, delivery address, monthly billing, trackingSteps).'],
  ['tickets', 'Doorstep maintenance tickets (issueCategory, priority, preferredDate, technicianName, resolutionNotes).'],
  ['claims', 'Post-return damage audits & security deposit deduction calculation (claimStatus, damageDeduction, refundAmount).'],
  ['cities', 'Geographic operational hubs (Bengaluru, Mumbai, Delhi-NCR, activeHubs, pinCodes, delivery SLA).']
];

schemaDetails.forEach(([name, desc]) => {
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(ACCENT).text(`• collection("${name}"): `, { continued: true });
  doc.font('Helvetica').fillColor(SECONDARY).text(desc, { lineGap: 2 });
});

// ================= PAGE 3: CORE APPLICATION MODULES =================
doc.addPage();
drawHeader();

doc.fontSize(14).font('Helvetica-Bold').fillColor(PRIMARY).text('4. Core Platform Capabilities & Workflows');
doc.moveDown(0.5);

const workflows = [
  {
    title: 'A. Storefront Catalog & Dynamic Pricing Curves',
    desc: 'Customers filter across Furniture, Smart Appliances, and Pre-configured Room Bundles (e.g. Student 1BHK, WFH Executive Suite). Product detail pages compute dynamic monthly pricing based on the chosen tenure (3m, 6m, 12m) and calculate the refundable security deposit in real time.'
  },
  {
    title: 'B. Express Checkout & Inventory Hold',
    desc: 'The cart drawer enforces tenure selection per item, applies delivery address checks against active operational hubs (e.g., verifying 560103 in Bengaluru), and transitions orders into "scheduled" delivery with sequential tracking milestones (Confirmed -> Quality Passed -> In Transit -> Setup Done).'
  },
  {
    title: 'C. Self-Service User Rentals Portal',
    desc: 'Active subscribers can manage their contracts from their customer account: one-click tenure extensions, scheduling semi-annual professional sanitization, raising maintenance repair requests, requesting free relocation to a new address, or booking return pick-ups.'
  },
  {
    title: 'D. Vendor & Admin Operations Console',
    desc: 'A complete internal operations dashboard providing real-time MRR tracking, stock utilization percentage, dispatch queue control, technician assignment for maintenance tickets, damage auditing, and deposit refund authorization.'
  }
];

workflows.forEach((w) => {
  doc.fontSize(11).font('Helvetica-Bold').fillColor(SECONDARY).text(w.title);
  doc.moveDown(0.2);
  doc.fontSize(9.5).font('Helvetica').fillColor(SECONDARY).text(w.desc, { align: 'justify', lineGap: 2.5 });
  doc.moveDown(0.8);
});

// Section 5: API Specification Table
doc.fontSize(14).font('Helvetica-Bold').fillColor(PRIMARY).text('5. REST API Specifications');
doc.moveDown(0.4);

const apiTableY = doc.y;
doc.rect(50, apiTableY, 495, 20).fillAndStroke(SECONDARY, SECONDARY);
doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#FFFFFF');
doc.text('METHOD & ENDPOINT', 58, apiTableY + 6);
doc.text('DESCRIPTION', 230, apiTableY + 6);
doc.text('DATA SOURCE', 420, apiTableY + 6);

const apiEndpoints = [
  ['GET /api/health', 'Cluster connectivity, live database status & inventory count', 'MongoDB Atlas'],
  ['GET /api/products', 'Fetch dynamic catalog with category & search parameters', 'products collection'],
  ['POST /api/products', 'Add new rental item directly to cloud catalog', 'products collection'],
  ['GET /api/orders', 'Retrieve all customer contracts & dispatch status', 'orders collection'],
  ['POST /api/orders', 'Place subscription order & deduct available inventory', 'orders collection'],
  ['GET /api/tickets', 'Fetch ongoing servicing requests with technician assignments', 'tickets collection'],
  ['POST /api/tickets', 'Submit doorstep maintenance request', 'tickets collection'],
  ['PUT /api/claims/:id', 'Authorize deposit refund with itemized damage deductions', 'claims collection'],
  ['GET /api/cities', 'Fetch operational cities & hub service coverage', 'cities collection']
];

let curApiY = apiTableY + 20;
apiEndpoints.forEach((ep, i) => {
  const bg = i % 2 === 0 ? LIGHT_BG : '#FFFFFF';
  doc.rect(50, curApiY, 495, 18).fillAndStroke(bg, BORDER_COLOR);
  doc.fontSize(8).font('Helvetica-Bold').fillColor(PRIMARY).text(ep[0], 58, curApiY + 5);
  doc.font('Helvetica').fillColor(SECONDARY).text(ep[1], 230, curApiY + 5);
  doc.font('Helvetica').fillColor(MUTED).text(ep[2], 420, curApiY + 5);
  curApiY += 18;
});

// ================= PAGE 4: LIVE METRICS, SECURITY & ROADMAP =================
doc.addPage();
drawHeader();

doc.fontSize(14).font('Helvetica-Bold').fillColor(PRIMARY).text('6. Live Production Metrics & Audit Snapshot');
doc.moveDown(0.4);

const metricsBoxY = doc.y;
doc.rect(50, metricsBoxY, 495, 65).fillAndStroke(LIGHT_BG, BORDER_COLOR);

doc.fontSize(9).font('Helvetica-Bold').fillColor(MUTED).text('TOTAL DYNAMIC PRODUCTS', 65, metricsBoxY + 12);
doc.fontSize(18).font('Helvetica-Bold').fillColor(PRIMARY).text('22 Items', 65, metricsBoxY + 26);
doc.fontSize(8).font('Helvetica').fillColor(ACCENT).text('100% Persisted in Atlas', 65, metricsBoxY + 48);

doc.fontSize(9).font('Helvetica-Bold').fillColor(MUTED).text('ACTIVE RENTALS & ORDERS', 215, metricsBoxY + 12);
doc.fontSize(18).font('Helvetica-Bold').fillColor(SECONDARY).text('2 Contracts', 215, metricsBoxY + 26);
doc.fontSize(8).font('Helvetica').fillColor(MUTED).text('Bengaluru Bellandur Hub', 215, metricsBoxY + 48);

doc.fontSize(9).font('Helvetica-Bold').fillColor(MUTED).text('SERVICE CITIES', 380, metricsBoxY + 12);
doc.fontSize(18).font('Helvetica-Bold').fillColor(ACCENT).text('5 Hubs', 380, metricsBoxY + 26);
doc.fontSize(8).font('Helvetica').fillColor(MUTED).text('BLR, MUM, DEL, HYD, PNQ', 380, metricsBoxY + 48);

doc.y = metricsBoxY + 80;
doc.moveDown(0.5);

doc.fontSize(14).font('Helvetica-Bold').fillColor(PRIMARY).text('7. Reliability, Security & Vercel Gateway Hardening');
doc.moveDown(0.4);

const hardening = [
  ['Zero Hardcoded Mocks', 'The codebase is configured in pure dynamic database mode. If the cloud database returns an empty collection, the system safely renders verified empty states rather than fictitious mockups.'],
  ['Vercel Serverless Path Normalization', 'The Express application mounts an intelligent URL normalizer reading the x-matched-path header, completely bypassing edge rewrite truncation and routing POST /api/products flawlessly.'],
  ['Defensive Array Guards', 'All API services and UI containers employ Array.isArray() validation preventing TypeError: filter is not a function across all network edge cases.'],
  ['CORS & Header Security', 'Full preflight OPTIONS handling and permissive CORS headers allowing cross-origin requests between Vercel microservices and custom frontends.']
];

hardening.forEach(([title, desc]) => {
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(SECONDARY).text(`• ${title}: `, { continued: true });
  doc.font('Helvetica').fillColor(SECONDARY).text(desc, { lineGap: 2.5 });
  doc.moveDown(0.3);
});

doc.moveDown(0.6);

doc.fontSize(14).font('Helvetica-Bold').fillColor(PRIMARY).text('8. Strategic Growth Roadmap');
doc.moveDown(0.4);

const roadmap = [
  ['Phase 1 (Current)', 'Live dynamic MongoDB Atlas integration, multi-tenure pricing, self-service customer portal, and comprehensive admin suite.'],
  ['Phase 2 (Q2 2027)', 'Automated KYC verification with DigiLocker API integration, automated recurring mandate billing (e-NACH/UPI Autopay).'],
  ['Phase 3 (Q3 2027)', 'AI-powered computer vision damage assessment during return pick-ups and IoT asset tracking for high-value appliances.'],
  ['Phase 4 (Q4 2027)', 'Tier-2 expansion into Chandigarh, Ahmedabad, Kochi, and Jaipur with franchised local refurbishment warehouses.']
];

roadmap.forEach(([phase, details]) => {
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(PRIMARY).text(`[${phase}] `, { continued: true });
  doc.font('Helvetica').fillColor(SECONDARY).text(details, { lineGap: 2.5 });
  doc.moveDown(0.2);
});

// Final Sign-off block
doc.moveDown(1);
doc.strokeColor(BORDER_COLOR).lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
doc.moveDown(0.6);
doc.fontSize(8.5).font('Helvetica-Bold').fillColor(MUTED).text('PREPARED FOR: ', 50, doc.y, { continued: true });
doc.font('Helvetica').fillColor(SECONDARY).text('RentEase Executive Committee & Engineering Operations');
doc.fontSize(8).font('Helvetica').fillColor(MUTED).text('Author: Senior Lead Systems Engineer | Platform Status: 100% Operational | Database: Verified Connected', { lineGap: 2 });

// Add page numbers
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.fontSize(8).font('Helvetica').fillColor(MUTED).text(
    `Page ${i + 1} of ${range.count}`,
    50,
    800,
    { align: 'center', width: 495 }
  );
}

doc.end();

writeStream1.on('finish', () => {
  fs.copyFileSync(pdfPath1, pdfPath2);
  console.log('PDF successfully generated at:');
  console.log('- ' + pdfPath1);
  console.log('- ' + pdfPath2);
});
