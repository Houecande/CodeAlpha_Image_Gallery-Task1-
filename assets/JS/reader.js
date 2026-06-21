const CAT_LABELS = {
  Landscape: 'Landscape',
  Portrait: 'Portrait',
  Urban: 'Urban',
  Nature: 'Nature',
  Abstract: 'Abstract',
  Upload: 'Upload',
};

const readerView = document.getElementById('reader-view');
const params = new URLSearchParams(window.location.search);
const photoId = params.get('id');
const READER_STORAGE_KEY = 'aperture-selected-photo';
let galleryList = [];
let currentIndex = -1;
let currentPhoto = null;
let _previousActiveElement = null;

function catLabel(cat) {
  return CAT_LABELS[cat] || cat;
}

function loadFromStorage() {
  try {
    const stored = sessionStorage.getItem(READER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Unable to read stored photo:', error);
    return null;
  }
}

function decodeParam(name) {
  const value = params.get(name);
  if (!value || value === 'null' || value === 'undefined') return '';
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

function idbOpen() {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open('aperture-db', 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore('uploads', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
}

function idbGetAllUploads() {
  return idbOpen().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('uploads', 'readonly');
    const store = tx.objectStore('uploads');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  })).catch(() => []);
}

function selectPhotoFromStorage(id, stored) {
  if (!stored) return null;
  if (stored.selectedId && String(stored.selectedId) === String(id)) {
    return stored.selectedPhoto || null;
  }
  if (stored.gallery) {
    return stored.gallery.find(item => String(item.id) === String(id)) || null;
  }
  if (stored.uploads) {
    return stored.uploads.find(item => String(item.id) === String(id)) || null;
  }
  return null;
}

function findGalleryIndex(id) {
  if (!galleryList.length) return -1;
  return galleryList.findIndex(photo => String(photo.id) === String(id));
}

function updateLightbox(photo) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.title;
  lightboxCaption.textContent = `${photo.title} — ${photo.author}`;

  const prevButton = document.getElementById('lightbox-prev');
  const nextButton = document.getElementById('lightbox-next');
  if (prevButton) prevButton.disabled = currentIndex <= 0;
  if (nextButton) nextButton.disabled = currentIndex === -1 || currentIndex >= galleryList.length - 1;
}

function openLightbox(photo) {
  const lightbox = document.getElementById('lightbox');
  const closeButton = document.getElementById('lightbox-close');
  if (!lightbox) return;

  try { _previousActiveElement = document.activeElement; } catch (e) { _previousActiveElement = null; }
  updateLightbox(photo);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.querySelector('main')?.setAttribute('inert', '');
  try { closeButton?.focus(); } catch (e) { /* ignore */ }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  document.querySelector('main')?.removeAttribute('inert');
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');

  try {
    if (_previousActiveElement && typeof _previousActiveElement.focus === 'function') {
      _previousActiveElement.focus();
    }
  } catch (e) {
    // ignore focus restoration errors
  }
}

function renderReader(photo) {
  currentPhoto = photo;
  currentIndex = findGalleryIndex(photo.id);

  const prevDisabled = currentIndex <= 0 ? 'disabled' : '';
  const nextDisabled = currentIndex === -1 || currentIndex >= galleryList.length - 1 ? 'disabled' : '';

  readerView.innerHTML = `
    <div class="reader-card">
      <img id="reader-main-img" src="${photo.src}" alt="${photo.title}" />
      <div class="reader-details">
        <p class="reader-eyebrow">${catLabel(photo.cat)}</p>
        <h1 class="reader-title">${photo.title}</h1>
        <div class="reader-meta">
          <div class="reader-meta-row"><span>Author</span><span>${photo.author}</span></div>
          <div class="reader-meta-row"><span>Category</span><span>${catLabel(photo.cat)}</span></div>
          <div class="reader-meta-row"><span>Reference</span><span>#${String(photo.id).padStart(3, '0')}</span></div>
        </div>
        <p class="preview-label">${photo.description || 'No description available.'}</p>
        <div class="reader-actions">
          <button class="reader-nav" id="prev-button" type="button" ${prevDisabled}>Previous</button>
          <button class="reader-nav" id="next-button" type="button" ${nextDisabled}>Next</button>
        </div>
      </div>
    </div>
  `;

  const mainImage = document.getElementById('reader-main-img');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  if (mainImage) mainImage.onclick = () => openLightbox(photo);
  if (prevButton) prevButton.onclick = goPrevious;
  if (nextButton) nextButton.onclick = goNext;
}

function goToIndex(index) {
  if (index < 0 || index >= galleryList.length) return;
  renderReader(galleryList[index]);
  if (document.getElementById('lightbox')?.classList.contains('open')) {
    updateLightbox(galleryList[index]);
  }
}

function goPrevious() {
  goToIndex(currentIndex - 1);
}

function goNext() {
  goToIndex(currentIndex + 1);
}

function initializeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const backdrop = document.getElementById('lightbox-backdrop');
  const closeButton = document.getElementById('lightbox-close');
  const prevButton = document.getElementById('lightbox-prev');
  const nextButton = document.getElementById('lightbox-next');

  backdrop?.addEventListener('click', closeLightbox);
  closeButton?.addEventListener('click', closeLightbox);
  prevButton?.addEventListener('click', goPrevious);
  nextButton?.addEventListener('click', goNext);

  document.addEventListener('keydown', event => {
    if (!lightbox?.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') goPrevious();
    if (event.key === 'ArrowRight') goNext();
  });
}

if (photoId) {
  (async function initReader() {
    const stored = loadFromStorage();

    galleryList = Array.isArray(stored?.gallery) ? stored.gallery.slice() : [];

    if (stored?.uploads && Array.isArray(stored.uploads)) {
      stored.uploads.forEach(up => {
        if (!galleryList.find(g => String(g.id) === String(up.id))) galleryList.push(up);
      });
    }

    let idbUploads = [];
    if (typeof indexedDB !== 'undefined') {
      try {
        idbUploads = await idbGetAllUploads();
        if (Array.isArray(idbUploads) && idbUploads.length) {
          idbUploads.forEach(up => {
            if (!galleryList.find(g => String(g.id) === String(up.id))) galleryList.push(up);
          });
        }
      } catch (e) {
        // ignore idb errors
      }
    }

    if (stored?.selectedPhoto && !galleryList.find(g => String(g.id) === String(stored.selectedPhoto.id))) {
      galleryList.push(stored.selectedPhoto);
    }

    let storedPhoto = selectPhotoFromStorage(photoId, stored);
    if (!storedPhoto && Array.isArray(idbUploads) && idbUploads.length) {
      storedPhoto = idbUploads.find(u => String(u.id) === String(photoId)) || null;
      if (storedPhoto && !galleryList.find(g => String(g.id) === String(storedPhoto.id))) galleryList.push(storedPhoto);
    }

    if (storedPhoto) {
      renderReader(storedPhoto);
    } else {
      renderReader({
        id: photoId,
        title: decodeParam('title') || 'Untitled',
        author: decodeParam('author') || 'Unknown',
        cat: decodeParam('cat') || 'Unknown',
        src: decodeParam('src') || '',
        description: decodeParam('description') || ''
      });
    }
  })();
}

initializeLightbox();
