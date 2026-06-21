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

function catLabel(cat) {
  return CAT_LABELS[cat] || cat;
}

function renderReader(photo) {
  if (!photo.src) {
    readerView.innerHTML = '<div class="reader-card empty"><p class="preview-label">Image failed to load. Return to gallery and try again.</p></div>';
    return;
  }
  
  readerView.innerHTML = `
    <div class="reader-card">
      <img src="${photo.src}" alt="${photo.title}" />
      <div class="reader-details">
        <p class="reader-eyebrow">${catLabel(photo.cat)}</p>
        <h1 class="reader-title">${photo.title}</h1>
        <div class="reader-meta">
          <div class="reader-meta-row"><span>Author</span><span>${photo.author}</span></div>
          <div class="reader-meta-row"><span>Category</span><span>${catLabel(photo.cat)}</span></div>
          <div class="reader-meta-row"><span>Reference</span><span>#${String(photo.id).padStart(3, '0')}</span></div>
        </div>
        <p class="preview-label">${photo.description || 'No description available.'}</p>
      </div>
    </div>
  `;
}

if (photoId) {
  renderReader({
    id: photoId,
    title: decodeURIComponent(params.get('title')) || 'Untitled',
    author: decodeURIComponent(params.get('author')) || 'Unknown',
    cat: params.get('cat') || 'Unknown',
    src: decodeURIComponent(params.get('src')) || '',
    description: decodeURIComponent(params.get('description')) || ''
  });
}
