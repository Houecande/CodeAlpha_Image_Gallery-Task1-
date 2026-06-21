const CAT_LABELS = {
  Landscape: 'Landscape',
  Portrait: 'Portrait',
  Urban: 'Urban',
  Nature: 'Nature',
  Abstract: 'Abstract',
  Upload: 'Upload',
};

const PHOTOS = [
  {
    id: 1,
    title: 'Morning Mist',
    author: 'Elara Voss',
    cat: 'Landscape',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    description: 'A calm morning view with soft light and mist drifting across gentle hills.'
  },
  {
    id: 2,
    title: 'Inner Gaze',
    author: 'Mateo Ruiz',
    cat: 'Portrait',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
    description: 'A portrait that feels intimate, with quiet emotion and strong composition.'
  },
  {
    id: 3,
    title: 'Concrete Light',
    author: 'Yui Tanaka',
    cat: 'Urban',
    src: 'https://images.unsplash.com/photo-1495486241858-5f02b8d3f37f?auto=format&fit=crop&w=1200&q=80',
    description: 'Hard edges softened by warm sunlight, capturing urban architecture in detail.'
  },
  {
    id: 4,
    title: 'Golden Thorns',
    author: 'Léa Fontaine',
    cat: 'Nature',
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    description: 'Golden branches and soft textures create a tactile natural study.'
  },
  {
    id: 5,
    title: 'Between Waters',
    author: 'Omar Khelil',
    cat: 'Landscape',
    src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
    description: 'Open water and horizon lines produce a sense of calm and depth.'
  },
  {
    id: 6,
    title: 'Soft Flame',
    author: 'Elara Voss',
    cat: 'Abstract',
    src: 'https://images.unsplash.com/photo-1500530853340-a3a8d24e0b8d?auto=format&fit=crop&w=1200&q=80',
    description: 'A soft, abstract glow that feels warm and crafted for reflection.'
  },
  {
    id: 7,
    title: 'Old Walls',
    author: 'Hana Sato',
    cat: 'Urban',
    src: 'https://images.unsplash.com/photo-1489158633940-9c7d0c19f4be?auto=format&fit=crop&w=1200&q=80',
    description: 'Urban textures and history captured in a single architectural frame.'
  },
  {
    id: 8,
    title: 'Portrait No.7',
    author: 'Mateo Ruiz',
    cat: 'Portrait',
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    description: 'Striking portrait lighting with a contemplative mood.'
  },
  {
    id: 9,
    title: 'Blue Forest',
    author: 'Léa Fontaine',
    cat: 'Nature',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    description: 'A blue-toned forest scene that feels serene and expansive.'
  },
  {
    id: 10,
    title: 'Parallel Lines',
    author: 'Yui Tanaka',
    cat: 'Abstract',
    src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
    description: 'Geometric flow and repeated forms create a precise visual rhythm.'
  },
  {
    id: 11,
    title: 'Quiet Dawn',
    author: 'Omar Khelil',
    cat: 'Landscape',
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
    description: 'A tranquil sunrise captured with soft color transitions and stillness.'
  },
  {
    id: 12,
    title: 'Reflections',
    author: 'Elara Voss',
    cat: 'Urban',
    src: 'https://images.unsplash.com/photo-1495462913691-ffe0d22c32f2?auto=format&fit=crop&w=1200&q=80',
    description: 'Light and glass meet in a reflective urban composition.'
  }
];

let nextId = PHOTOS.length + 1;
let currentCat = 'All';
let searchQuery = '';
let filteredPhotos = [...PHOTOS];

const filtersEl = document.getElementById('filters');
const gridEl = document.getElementById('grid');
const countLabel = document.getElementById('count-label');
const noResults = document.getElementById('no-results');
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const dropZone = document.getElementById('drop-zone');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

function catLabel(cat) {
  return CAT_LABELS[cat] || cat;
}

function createCard(photo, index) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'masonry-item';
  item.dataset.id = photo.id;
  item.dataset.index = index;
  item.style.animationDelay = `${Math.min(index, 11) * 0.04}s`;
  item.setAttribute('aria-label', `Open ${photo.title} in reader`);

  item.innerHTML = `
    <div class="image-wrap">
      <img src="${photo.src}" alt="${photo.title}" loading="lazy" decoding="async" />
      <div class="item-overlay" aria-hidden="true">
        <div class="overlay-icon">+</div>
      </div>
    </div>
    <div class="item-footer">
      <div class="item-cat-row">
        <span class="item-cat-label">${catLabel(photo.cat)}</span>
      </div>
      <p class="item-title">${photo.title}</p>
    </div>
  `;

  item.addEventListener('click', () => showPreview(index));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showPreview(index);
    }
  });

  gridEl.appendChild(item);
}

function showPreview(index) {
  const photo = PHOTOS[index];
  const params = new URLSearchParams({
    id: photo.id,
    title: photo.title,
    author: photo.author,
    cat: photo.cat,
    src: photo.src,
    description: photo.description || ''
  });
  window.location.href = `reader.html?${params.toString()}`;
}

function buildFilters() {
  filtersEl.innerHTML = '';
  const categories = ['All', ...new Set(PHOTOS.map(photo => photo.cat))];
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat === 'All' ? 'All' : catLabel(cat);
    btn.dataset.cat = cat;
    btn.setAttribute('aria-pressed', cat === 'All' ? 'true' : 'false');
    btn.addEventListener('click', () => setFilter(cat));
    filtersEl.appendChild(btn);
  });
}

function setFilter(cat) {
  currentCat = cat;
  document.querySelectorAll('.filter-btn').forEach(button => {
    const active = button.dataset.cat === cat;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  renderGrid();
}

function setSearch(query) {
  searchQuery = query.trim().toLowerCase();
  renderGrid();
}

function renderGrid() {
  filteredPhotos = currentCat === 'All' ? [...PHOTOS] : PHOTOS.filter(photo => photo.cat === currentCat);
  const visiblePhotos = filteredPhotos.filter(photo => {
    if (!searchQuery) return true;
    return [photo.title, photo.author, photo.cat, catLabel(photo.cat)].some(value =>
      value.toLowerCase().includes(searchQuery)
    );
  });

  gridEl.innerHTML = '';
  visiblePhotos.forEach(photo => {
    const originalIndex = PHOTOS.findIndex(item => item.id === photo.id);
    createCard(photo, originalIndex);
  });

  countLabel.textContent = `${visiblePhotos.length} ${visiblePhotos.length === 1 ? 'photo' : 'photos'}`;
  noResults.style.display = visiblePhotos.length === 0 ? 'block' : 'none';
}

function handleFiles(files) {
  const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
  if (!validFiles.length) return;

  validFiles.forEach(file => {
    const url = URL.createObjectURL(file);
    const photo = {
      id: nextId++,
      title: file.name.replace(/\.[^/.]+$/, ''),
      author: 'Local upload',
      cat: 'Upload',
      src: url,
      description: 'A local photo added to the gallery for quick reading and sharing.'
    };
    PHOTOS.push(photo);
  });

  buildFilters();
  renderGrid();
}

function openFileDialog() {
  fileInput.click();
}

uploadButton.addEventListener('click', openFileDialog);
fileInput.addEventListener('change', event => {
  handleFiles(event.target.files);
  event.target.value = '';
});

dropZone.addEventListener('dragover', event => {
  event.preventDefault();
  dropZone.classList.add('hover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('hover');
});

dropZone.addEventListener('drop', event => {
  event.preventDefault();
  dropZone.classList.remove('hover');
  handleFiles(event.dataTransfer.files);
});

searchForm?.addEventListener('submit', event => {
  event.preventDefault();
  setSearch(searchInput.value);
});

searchInput?.addEventListener('input', event => {
  setSearch(event.target.value);
});

function initializeGallery() {
  buildFilters();
  renderGrid();
}

initializeGallery();
