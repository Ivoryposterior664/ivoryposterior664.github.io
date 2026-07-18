(function () {
  var photos = Array.from(document.querySelectorAll('.photo'));
  var tagCloud = document.getElementById('tag-cloud');
  var filterClear = document.getElementById('filter-clear');
  var filterToggle = document.getElementById('filter-toggle');
  var filterPanel = document.getElementById('filter-panel');
  var filterOverlay = document.getElementById('filter-overlay');

  var activeTags = new Set();

  /* ---------- Build tag cloud from each photo's data-tags ---------- */

  var counts = {};
  photos.forEach(function (photo) {
    var tags = (photo.dataset.tags || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    photo.dataset.tagList = JSON.stringify(tags);
    tags.forEach(function (tag) {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  var tagNames = Object.keys(counts).sort();
  var maxCount = Math.max.apply(null, Object.values(counts));
  var minCount = Math.min.apply(null, Object.values(counts));

  tagNames.forEach(function (tag) {
    var btn = document.createElement('button');
    btn.textContent = tag;
    btn.dataset.tag = tag;
    var ratio = maxCount === minCount ? 1 : (counts[tag] - minCount) / (maxCount - minCount);
    var size = 13 + ratio * 20; // 13px - 33px
    btn.style.fontSize = size.toFixed(1) + 'px';
    btn.addEventListener('click', function () {
      if (activeTags.has(tag)) {
        activeTags.delete(tag);
        btn.classList.remove('is-active');
      } else {
        activeTags.add(tag);
        btn.classList.add('is-active');
      }
      applyFilter();
    });
    tagCloud.appendChild(btn);
  });

  function applyFilter() {
    filterClear.classList.toggle('is-visible', activeTags.size > 0);
    photos.forEach(function (photo) {
      var tags = JSON.parse(photo.dataset.tagList);
      var show = activeTags.size === 0 || tags.some(function (t) { return activeTags.has(t); });
      photo.classList.toggle('is-hidden', !show);
    });
  }

  filterClear.addEventListener('click', function () {
    activeTags.clear();
    tagCloud.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-active'); });
    applyFilter();
  });

  /* ---------- Filter panel open/close ---------- */

  function openPanel() {
    filterPanel.classList.add('is-open');
    filterOverlay.classList.add('is-open');
  }
  function closePanel() {
    filterPanel.classList.remove('is-open');
    filterOverlay.classList.remove('is-open');
  }
  filterToggle.addEventListener('click', function () {
    filterPanel.classList.contains('is-open') ? closePanel() : openPanel();
  });
  filterOverlay.addEventListener('click', closePanel);

  /* ---------- Lightbox ---------- */

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxTags = document.getElementById('lightbox-tags');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');
  var currentIndex = 0;

  function visiblePhotos() {
    return photos.filter(function (p) { return !p.classList.contains('is-hidden'); });
  }

  function showAt(index) {
    var list = visiblePhotos();
    if (list.length === 0) return;
    currentIndex = (index + list.length) % list.length;
    var photo = list[currentIndex];
    var img = photo.querySelector('img');
    lightboxImg.src = img.dataset.full || img.src;
    lightboxImg.alt = img.alt;
    var tags = JSON.parse(photo.dataset.tagList);
    lightboxTags.textContent = tags.join(' · ');
  }

  photos.forEach(function (photo, i) {
    photo.addEventListener('click', function () {
      var list = visiblePhotos();
      var idx = list.indexOf(photo);
      showAt(idx);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  prevBtn.addEventListener('click', function () { showAt(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { showAt(currentIndex + 1); });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
    if (e.key === 'ArrowRight') showAt(currentIndex + 1);
  });
})();
