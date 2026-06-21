/* ── DATA ── */
const CAT_COLORS = {
  'Paysage':  '#BACED0',
  'Portrait': '#EEC9B8',
  'Urbain':   '#C4BDE8',
  'Nature':   '#C8DDB5',
  'Abstrait': '#F0D4C0',
};

const PHOTOS = [
  { id:1,  title:"Brume matinale",    author:"Elara Voss",    cat:"Paysage",  aspect:1.50, h:"#B8CED6" },
  { id:2,  title:"Regard intérieur",  author:"Mateo Ruiz",    cat:"Portrait", aspect:0.75, h:"#D4BEB8" },
  { id:3,  title:"Béton & lumière",   author:"Yui Tanaka",    cat:"Urbain",   aspect:1.00, h:"#C6C0DC" },
  { id:4,  title:"Épines dorées",     author:"Léa Fontaine",  cat:"Nature",   aspect:1.33, h:"#C8D8B8" },
  { id:5,  title:"Entre deux eaux",   author:"Omar Khelil",   cat:"Paysage",  aspect:1.80, h:"#A8C8D4" },
  { id:6,  title:"Feu doux",          author:"Elara Voss",    cat:"Abstrait", aspect:0.90, h:"#E8C8B8" },
  { id:7,  title:"Murs anciens",      author:"Hana Sato",     cat:"Urbain",   aspect:1.20, h:"#C8C0D8" },
  { id:8,  title:"Portrait no.7",     author:"Mateo Ruiz",    cat:"Portrait", aspect:0.80, h:"#DCC4BC" },
  { id:9,  title:"Forêt bleue",       author:"Léa Fontaine",  cat:"Nature",   aspect:1.40, h:"#B4D0C4" },
  { id:10, title:"Lignes parallèles", author:"Yui Tanaka",    cat:"Abstrait", aspect:1.00, h:"#C0C8D8" },
  { id:11, title:"Aube silencieuse",  author:"Omar Khelil",   cat:"Paysage",  aspect:1.60, h:"#D8C8B0" },
  { id:12, title:"Reflets",           author:"Elara Voss",    cat:"Urbain",   aspect:1.10, h:"#B8C8DC" },
  { id:13, title:"Douceur rose",      author:"Hana Sato",     cat:"Portrait", aspect:0.85, h:"#E0C0C4" },
  { id:14, title:"Racines",           author:"Léa Fontaine",  cat:"Nature",   aspect:1.25, h:"#C0D0B4" },
  { id:15, title:"Vague abstraite",   author:"Mateo Ruiz",    cat:"Abstrait", aspect:1.30, h:"#C4C8E0" },
  { id:16, title:"Crépuscule",        author:"Omar Khelil",   cat:"Paysage",  aspect:1.70, h:"#D0B8C8" },
  { id:17, title:"Fer & lumière",     author:"Yui Tanaka",    cat:"Urbain",   aspect:0.95, h:"#C4C0D4" },
  { id:18, title:"Silence blanc",     author:"Elara Voss",    cat:"Nature",   aspect:1.45, h:"#C8D4CC" },
  { id:19, title:"Ombre portée",      author:"Hana Sato",     cat:"Abstrait", aspect:1.15, h:"#D4C8D8" },
  { id:20, title:"Portrait no.12",    author:"Mateo Ruiz",    cat:"Portrait", aspect:0.78, h:"#D8C0B8" },
  { id:21, title:"Lac gelé",          author:"Léa Fontaine",  cat:"Paysage",  aspect:1.55, h:"#B0C8D8" },
  { id:22, title:"Fenêtre ouverte",   author:"Omar Khelil",   cat:"Urbain",   aspect:1.05, h:"#C4CCD8" },
  { id:23, title:"Texture vivante",   author:"Yui Tanaka",    cat:"Nature",   aspect:1.35, h:"#C4D0B8" },
  { id:24, title:"Échos",             author:"Elara Voss",    cat:"Abstrait", aspect:0.88, h:"#CCC4DC" },
];

/* ── PLACEHOLDER GENERATOR (canvas) ──
   Replace imgCache[id] with real image paths or URLs when deploying.
   Example: imgCache[1] = 'images/photo-01.jpg';
*/
const imgCache = {};

function makePlaceholder(photo) {
  const W = 400, H = Math.round(W / photo.aspect);
  const cvs = document.createElement('canvas');
  cvs.width = W; cvs.height = H;
  const ctx = cvs.getContext('2d');
  const r = parseInt(photo.h.slice(1,3), 16);
  const g = parseInt(photo.h.slice(3,5), 16);
  const b = parseInt(photo.h.slice(5,7), 16);
  ctx.fillStyle = `rgb(${Math.round(r*.9)},${Math.round(g*.9)},${Math.round(b*.9)})`;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 5; i++) {
    const gx = Math.random() * W;
    const gy = Math.random() * H;
    const gs = 60 + Math.random() * 140;
    const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, gs);
    gr.addColorStop(0, 'rgba(255,255,255,0.3)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, W, H);
  }
  return cvs.toDataURL();
}

PHOTOS.forEach(p => { imgCache[p.id] = makePlaceholder(p); });

/* ── FILTER SETUP ── */
const cats = ['Tous', ...new Set(PHOTOS.map(p => p.cat))];
let currentCat = 'Tous';
let filteredPhotos = [...PHOTOS];
let lbIndex = 0;

const filtersEl  = document.getElementById('filters');
const gridEl     = document.getElementById('grid');
const countLabel = document.getElementById('count-label');
const noResults  = document.getElementById('no-results');

cats.forEach(cat => {
  const btn = document.createElement('button');
  btn.className = 'filter-btn' + (cat === 'Tous' ? ' active' : '');
  btn.textContent = cat;
  btn.setAttribute('aria-pressed', cat === 'Tous' ? 'true' : 'false');
  btn.addEventListener('click', () => setFilter(cat));
  filtersEl.appendChild(btn);
});

function setFilter(cat) {
  currentCat = cat;
  document.querySelectorAll('.filter-btn').forEach(b => {
    const active = b.textContent === cat;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  filteredPhotos = cat === 'Tous' ? [...PHOTOS] : PHOTOS.filter(p => p.cat === cat);
  renderGrid();
}

function renderGrid() {
  gridEl.querySelectorAll('.masonry-item').forEach(item => {
    const visible = filteredPhotos.some(p => p.id === parseInt(item.dataset.id, 10));
    item.classList.toggle('item-hidden', !visible);
  });
  const n = filteredPhotos.length;
  countLabel.textContent = n + (n === 1 ? ' œuvre' : ' œuvres');
  noResults.style.display = n === 0 ? 'block' : 'none';
}

/* ── BUILD GRID ── */
PHOTOS.forEach((photo, idx) => {
  const item = document.createElement('div');
  item.className = 'masonry-item';
  item.dataset.id = photo.id;
  item.tabIndex = 0;
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `Voir en grand : ${photo.title}`);

  const img = document.createElement('img');
  img.src = imgCache[photo.id];
  img.alt = photo.title;
  img.loading = 'lazy';
  img.decoding = 'async';

  const footer = document.createElement('div');
  footer.className = 'item-footer';
  const dotColor = CAT_COLORS[photo.cat] || '#C4BDE8';
  footer.innerHTML = `
    <div class="item-cat-row">
      <span class="item-cat-dot" style="background:${dotColor}" aria-hidden="true"></span>
      <span class="item-cat-label">${photo.cat}</span>
    </div>
    <p class="item-title">${photo.title}</p>
  `;

  const overlay = document.createElement('div');
  overlay.className = 'item-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `<div class="overlay-icon">&#128065;</div>`;

  item.appendChild(img);
  item.appendChild(footer);
  item.appendChild(overlay);

  item.addEventListener('click', () => openLightbox(idx));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
  });

  gridEl.appendChild(item);
});

/* ── LIGHTBOX ── */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbTitle   = document.getElementById('lb-title');
const lbCat     = document.getElementById('lb-cat');
const lbAuthor  = document.getElementById('lb-author');
const lbCounter = document.getElementById('lb-counter');
const lbProgress= document.getElementById('lb-progress');

function openLightbox(idx) {
  lbIndex = idx;
  updateLb();
  lightbox.classList.add('open');
  lightbox.focus();
  document.addEventListener('keydown', handleKey);
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.removeEventListener('keydown', handleKey);
  const target = gridEl.querySelector(`.masonry-item[data-id="${PHOTOS[lbIndex].id}"]`);
  if (target) target.focus();
}

function updateLb() {
  const p = PHOTOS[lbIndex];
  lbImg.src     = imgCache[p.id];
  lbImg.alt     = p.title;
  lbTitle.textContent  = p.title;
  lbCat.textContent    = p.cat;
  lbAuthor.textContent = p.author;
  lbCounter.textContent = `${lbIndex + 1} / ${PHOTOS.length}`;
  lbProgress.style.width = `${Math.round(((lbIndex + 1) / PHOTOS.length) * 100)}%`;
}

function navigate(dir) {
  lbIndex = (lbIndex + dir + PHOTOS.length) % PHOTOS.length;
  updateLb();
}

function handleKey(e) {
  if (e.key === 'ArrowLeft')  { e.preventDefault(); navigate(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
  if (e.key === 'Escape')     closeLightbox();
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => navigate(-1));
document.getElementById('lb-next').addEventListener('click', () => navigate(1));

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
});
