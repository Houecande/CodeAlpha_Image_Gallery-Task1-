/* ── DATA ── */
const CAT_COLORS = {
  'Landscape': '#BACED0',
  'Portrait':  '#EEC9B8',
  'Urban':     '#C4BDE8',
  'Nature':    '#C8DDB5',
  'Abstract':  '#F0D4C0',
};

const PHOTOS = [
  { id: 1, title: "Morning Mist",     author: "Elara Voss",   cat: "Landscape", aspect: 1.50, h: "#B8CED6" },
  { id: 2, title: "Inner Gaze",      author: "Mateo Ruiz",   cat: "Portrait",  aspect: 0.75, h: "#D4BEB8" },
  { id: 3, title: "Concrete Light",  author: "Yui Tanaka",   cat: "Urban",     aspect: 1.00, h: "#C6C0DC" },
  { id: 4, title: "Golden Thorns",   author: "Léa Fontaine", cat: "Nature",    aspect: 1.33, h: "#C8D8B8" },
  { id: 5, title: "Between Waters",  author: "Omar Khelil",  cat: "Landscape", aspect: 1.80, h: "#A8C8D4" },
  { id: 6, title: "Soft Flame",      author: "Elara Voss",   cat: "Abstract",  aspect: 0.90, h: "#E8C8B8" },
  { id: 7, title: "Old Walls",       author: "Hana Sato",    cat: "Urban",     aspect: 1.20, h: "#C8C0D8" },
  { id: 8, title: "Portrait No.7",   author: "Mateo Ruiz",   cat: "Portrait",  aspect: 0.80, h: "#DCC4BC" },
  { id: 9, title: "Blue Forest",     author: "Léa Fontaine", cat: "Nature",    aspect: 1.40, h: "#B4D0C4" },
  { id:10, title: "Parallel Lines",  author: "Yui Tanaka",   cat: "Abstract",  aspect: 1.00, h: "#C0C8D8" },
  { id:11, title: "Quiet Dawn",      author: "Omar Khelil",  cat: "Landscape", aspect: 1.60, h: "#D8C8B0" },
  { id:12, title: "Reflections",     author: "Elara Voss",   cat: "Urban",     aspect: 1.10, h: "#B8C8DC" },
  { id:13, title: "Blush",           author: "Hana Sato",    cat: "Portrait",  aspect: 0.85, h: "#E0C0C4" },
  { id:14, title: "Roots",           author: "Léa Fontaine", cat: "Nature",    aspect: 1.25, h: "#C0D0B4" },
  { id:15, title: "Abstract Wave",   author: "Mateo Ruiz",   cat: "Abstract",  aspect: 1.30, h: "#C4C8E0" },
  { id:16, title: "Twilight",        author: "Omar Khelil",  cat: "Landscape", aspect: 1.70, h: "#D0B8C8" },
  { id:17, title: "Steel & Light",   author: "Yui Tanaka",   cat: "Urban",     aspect: 0.95, h: "#C4C0D4" },
  { id:18, title: "White Silence",   author: "Elara Voss",   cat: "Nature",    aspect: 1.45, h: "#C8D4CC" },
  { id:19, title: "Cast Shadow",     author: "Hana Sato",    cat: "Abstract",  aspect: 1.15, h: "#D4C8D8" },
  { id:20, title: "Portrait No.12",  author: "Mateo Ruiz",   cat: "Portrait",  aspect: 0.78, h: "#D8C0B8" },
  { id:21, title: "Frozen Lake",     author: "Léa Fontaine", cat: "Landscape", aspect: 1.55, h: "#B0C8D8" },
  { id:22, title: "Open Window",     author: "Omar Khelil",  cat: "Urban",     aspect: 1.05, h: "#C4CCD8" },
  { id:23, title: "Living Texture",  author: "Yui Tanaka",   cat: "Nature",    aspect: 1.35, h: "#C4D0B8" },
  { id:24, title: "Echoes",          author: "Elara Voss",   cat: "Abstract",  aspect: 0.88, h: "#CCC4DC" },
];

const imgCache = {};

function makePlaceholder(photo) {
  const W = 400;
  const H = Math.round(W / photo.aspect);
  const cvs = document.createElement('canvas');
  cvs.width = W;
  cvs.height = H;
  const ctx = cvs.getContext('2d');
  const r = parseInt(photo.h.slice(1, 3), 16);
  const g = parseInt(photo.h.slice(3, 5), 16);
  const b = parseInt(photo.h.slice(5, 7), 16);
  ctx.fillStyle = `rgb(${Math.round(r * 0.92)}, ${Math.round(g * 0.92)}, ${Math.round(b * 0.92)})`;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 4; i++) {
    const gx = Math.random() * W;
    const gy = Math.random() * H;
    const gs = 65 + Math.random() * 120;
    const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, gs);
    gr.addColorStop(0, 'rgba(255,255,255,0.28)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, W, H);
  }

  return cvs.toDataURL();
}

PHOTOS.forEach(photo => { imgCache[photo.id] = makePlaceholder(photo); });

const cats = ['All', ...new Set(PHOTOS.map(photo => photo.cat))];
let currentCat = 'All';
let filteredPhotos = [...PHOTOS];
let lbIndex = 0;

const filtersEl = document.getElementById('filters');
const gridEl = document.getElementById('grid');
const countLabel = document.getElementById('count-label');
const noResults = document.getElementById('no-results');

cats.forEach(cat => {
  const btn = document.createElement('button');
  btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
  btn.textContent = cat;
  btn.setAttribute('aria-pressed', cat === 'All' ? 'true' : 'false');
  btn.addEventListener('click', () => setFilter(cat));
  filtersEl.appendChild(btn);
});

function setFilter(cat) {
  currentCat = cat;
  document.querySelectorAll('.filter-btn').forEach(button => {
    const active = button.textContent === cat;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  filteredPhotos = cat === 'All' ? [...PHOTOS] : PHOTOS.filter(photo => photo.cat === cat);
  renderGrid();
}

function renderGrid() {
  gridEl.querySelectorAll('.masonry-item').forEach(item => {
    const visible = filteredPhotos.some(photo => photo.id === parseInt(item.dataset.id, 10));
    item.classList.toggle('item-hidden', !visible);
  });

  const count = filteredPhotos.length;
  countLabel.textContent = count + (count === 1 ? ' work' : ' works');
  noResults.style.display = count === 0 ? 'block' : 'none';
}

PHOTOS.forEach((photo, index) => {
  const item = document.createElement('div');
  item.className = 'masonry-item';
  item.dataset.id = photo.id;
  item.tabIndex = 0;
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `View full image: ${photo.title}`);

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
  overlay.innerHTML = '<div class="overlay-icon">&#128065;</div>';

  item.appendChild(img);
  item.appendChild(footer);
  item.appendChild(overlay);

  item.addEventListener('click', () => openLightbox(index));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(index);
    }
  });

  gridEl.appendChild(item);
});

const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbTitle = document.getElementById('lb-title');
const lbCat = document.getElementById('lb-cat');
const lbAuthor = document.getElementById('lb-author');
const lbCounter = document.getElementById('lb-counter');
const lbProgress = document.getElementById('lb-progress');

function openLightbox(index) {
  lbIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleKey);
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleKey);
  const target = gridEl.querySelector(`.masonry-item[data-id="${PHOTOS[lbIndex].id}"]`);
  if (target) target.focus();
}

function updateLightbox() {
  const photo = PHOTOS[lbIndex];
  lbImg.src = imgCache[photo.id];
  lbImg.alt = photo.title;
  lbTitle.textContent = photo.title;
  lbCat.textContent = photo.cat;
  lbAuthor.textContent = photo.author;
  lbCounter.textContent = `${lbIndex + 1} / ${PHOTOS.length}`;
  lbProgress.style.width = `${Math.round(((lbIndex + 1) / PHOTOS.length) * 100)}%`;
}

function navigate(dir) {
  lbIndex = (lbIndex + dir + PHOTOS.length) % PHOTOS.length;
  updateLightbox();
}

function handleKey(event) {
  if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1); }
  if (event.key === 'Escape') closeLightbox();
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => navigate(-1));
document.getElementById('lb-next').addEventListener('click', () => navigate(1));

lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

lbImg.addEventListener('click', closeLightbox);

let touchStartX = 0;
lightbox.addEventListener('touchstart', event => { touchStartX = event.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', event => {
  const dx = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
});
