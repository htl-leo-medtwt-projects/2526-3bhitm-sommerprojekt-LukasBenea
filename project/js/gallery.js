// ─── GALLERY ──────────────────────────────────────────────────────────────────

let currentView = 'cities';
let currentTag = '';
let currentSort = 'popular';
let photoSearchTimeout = null;
let galleryMsnry = null;
let currentGalleryPhoto = null;
let galleryPhotosList = [];

function switchView(view) {
    currentView = view;
    let citiesBtn = document.getElementById('citiesBtn');
    let photosBtn = document.getElementById('photosBtn');
    let citiesView = document.getElementById('citiesView');
    let photosView = document.getElementById('photosView');

    if (view === 'cities') {
        citiesBtn.classList.add('active');
        photosBtn.classList.remove('active');
        citiesView.classList.remove('hidden');
        photosView.classList.add('hidden');
    } else {
        photosBtn.classList.add('active');
        citiesBtn.classList.remove('active');
        photosView.classList.remove('hidden');
        citiesView.classList.add('hidden');
        loadGalleryPhotos('', '');
    }
}

function loadGalleryPhotos(search, tag) {
    let grid = document.getElementById('photosGrid');
    grid.innerHTML = '<div class="galleryLoader"><div class="gallerySpinner"></div></div>';
    let url = '../php/getPhotos.php?search=' + encodeURIComponent(search) + '&tag=' + encodeURIComponent(tag) + '&sort=' + encodeURIComponent(currentSort);
    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(photos) {
            galleryPhotosList = photos;
            grid.innerHTML = '';

            if (photos.length === 0) {
                grid.innerHTML = '<p style="color:#555; font-size:13px; letter-spacing:1px;">No photos found.</p>';
                return;
            }

            photos.forEach(function(photo) {
                let div = document.createElement('div');
                div.className = 'galleryPhotoCard';
                div.setAttribute('data-photo-id', photo.id);
                let likedClass = (typeof likedPhotos !== 'undefined' && likedPhotos.includes(parseInt(photo.id)))
                    ? 'fa-solid fa-heart liked'
                    : 'fa-regular fa-heart';
                div.innerHTML = `
                    <img src="../images/${photo.image_path}" alt="${photo.title}">
                    <div class="galleryPhotoLikes">
                        <i class="fa-solid fa-heart"></i>
                        <span>${photo.like_count}</span>
                    </div>
                    <div class="cardBtns">
                        <div class="likeBtn" onclick="toggleGalleryCardLike(event, ${photo.id}, this)">
                            <i class="${likedClass}"></i>
                        </div>
                    </div>
                    <div class="galleryPhotoOverlay">
                        <p class="galleryPhotoTitle">${photo.title}</p>
                        <p class="galleryPhotoCity">${photo.city_name}</p>
                    </div>
                `;
                div.onclick = function() { openGalleryPhotoModal(photo); };
                grid.appendChild(div);
            });

            if (galleryMsnry) galleryMsnry.destroy();
            galleryMsnry = new Masonry(grid, {
                itemSelector: '.galleryPhotoCard',
                columnWidth: '.galleryPhotoCard',
                gutter: 15,
                percentPosition: true
            });

            imagesLoaded(grid, function() {
                galleryMsnry.layout();
            });
        });
}

function openGalleryPhotoModal(photo) {
    currentGalleryPhoto = photo;

    document.getElementById('galleryModalImg').src = '../images/' + photo.image_path;
    document.getElementById('galleryModalTitle').textContent = photo.title;
    document.getElementById('galleryModalCity').textContent = photo.city_name || '';
    document.getElementById('galleryModalDesc').textContent = photo.description || '';
    document.getElementById('galleryModalLikes').textContent = photo.like_count + ' likes';

    let likeIcon = document.getElementById('galleryModalLikeIcon');
    let likeText = document.getElementById('galleryModalLikeText');
    let isLiked = typeof likedPhotos !== 'undefined' && likedPhotos.includes(parseInt(photo.id));
    likeIcon.className = isLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart';
    likeText.textContent = isLiked ? 'Liked' : 'Like';

    let bookmarkIcon = document.getElementById('galleryModalBookmarkIcon');
    let bookmarkText = document.getElementById('galleryModalBookmarkText');
    if (bookmarkIcon) {
        let isSaved = typeof savedPhotos !== 'undefined' && savedPhotos.includes(parseInt(photo.id));
        bookmarkIcon.className = isSaved ? 'fa-solid fa-bookmark saved' : 'fa-regular fa-bookmark';
        if (bookmarkText) bookmarkText.textContent = isSaved ? 'Saved' : 'Save';
    }

    let exif = photo.exif_data ? JSON.parse(photo.exif_data) : null;
    let exifHtml = '';
    if (exif) {
        exifHtml += exif.camera ? '<p class="exifRow">Camera: ' + exif.camera + '</p>' : '';
        exifHtml += exif.focal_length ? '<p class="exifRow">Focal Length: ' + exif.focal_length + '</p>' : '';
        exifHtml += exif.aperture ? '<p class="exifRow">Aperture: ' + exif.aperture + '</p>' : '';
        exifHtml += exif.shutter_speed ? '<p class="exifRow">Shutter Speed: ' + exif.shutter_speed + '</p>' : '';
        exifHtml += exif.iso ? '<p class="exifRow">ISO: ' + exif.iso + '</p>' : '';
        exifHtml += exif.mode ? '<p class="exifRow">Mode: ' + exif.mode + '</p>' : '';
        exifHtml += exif.white_balance ? '<p class="exifRow">White Balance: ' + exif.white_balance + '</p>' : '';
    }
    document.getElementById('galleryModalExif').innerHTML = exifHtml;

    renderGalleryMeta(photo);
    updateGalleryModalNav();

    document.getElementById('galleryPhotoModal').classList.remove('hidden');
}

function renderGalleryMeta(photo) {
    let meta = document.getElementById('galleryModalMeta');
    if (!meta) return;
    let html = '';

    if (photo.photographer) {
        let avatar = photo.photographer_avatar
            ? '<img src="../images/' + photo.photographer_avatar + '" alt="' + photo.photographer + '">'
            : '<div class="galleryMetaAvatarPlaceholder">' + photo.photographer.charAt(0).toUpperCase() + '</div>';
        html += '<div class="galleryMetaPhotographer">'
            + '<div class="galleryMetaAvatar">' + avatar + '</div>'
            + '<div class="galleryMetaInfo"><span class="galleryMetaLabel">Photographer</span><span class="galleryMetaName">' + photo.photographer + '</span></div>'
            + '</div>';
    }

    let dateText = photo.year_taken || (photo.created_at ? photo.created_at.substring(0, 10) : '');
    if (dateText) {
        html += '<div class="galleryMetaRow"><i class="fa-regular fa-calendar"></i><span>' + dateText + '</span></div>';
    }

    if (photo.tags) {
        let chips = photo.tags.split(',').map(function(t) {
            return '<span class="galleryMetaTag">' + t + '</span>';
        }).join('');
        html += '<div class="galleryMetaTags">' + chips + '</div>';
    }

    meta.innerHTML = html;
}

function updateGalleryModalNav() {
    let prev = document.querySelector('#galleryPhotoBox .photoNavPrev');
    let next = document.querySelector('#galleryPhotoBox .photoNavNext');
    if (!prev || !next) return;
    let show = galleryPhotosList.length > 1;
    prev.classList.toggle('hidden', !show);
    next.classList.toggle('hidden', !show);
}

function navGalleryModal(dir) {
    if (galleryPhotosList.length <= 1 || !currentGalleryPhoto) return;
    let idx = galleryPhotosList.findIndex(p => p.id == currentGalleryPhoto.id);
    if (idx === -1) return;
    let newIdx = (idx + dir + galleryPhotosList.length) % galleryPhotosList.length;
    openGalleryPhotoModal(galleryPhotosList[newIdx]);
}

function closeGalleryPhotoModal() {
    document.getElementById('galleryPhotoModal').classList.add('hidden');
    currentGalleryPhoto = null;
}

document.addEventListener('keydown', function(e) {
    let modal = document.getElementById('galleryPhotoModal');
    if (!modal || modal.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft') navGalleryModal(-1);
    if (e.key === 'ArrowRight') navGalleryModal(1);
});

function toggleGalleryLike() {
    if (!currentGalleryPhoto) return;
    if (!requireLogin()) return;
    fetch('../php/like.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + currentGalleryPhoto.id
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status !== 'liked' && data.status !== 'unliked') return;
        let icon = document.getElementById('galleryModalLikeIcon');
        let text = document.getElementById('galleryModalLikeText');
        let photoId = currentGalleryPhoto.id;
        if (data.status === 'liked') {
            icon.className = 'fa-solid fa-heart liked';
            text.textContent = 'Liked';
            currentGalleryPhoto.like_count++;
            if (typeof likedPhotos !== 'undefined' && !likedPhotos.includes(parseInt(photoId))) likedPhotos.push(parseInt(photoId));
        } else {
            icon.className = 'fa-regular fa-heart';
            text.textContent = 'Like';
            currentGalleryPhoto.like_count--;
            if (typeof likedPhotos !== 'undefined') likedPhotos = likedPhotos.filter(id => id != photoId);
        }
        document.getElementById('galleryModalLikes').textContent = currentGalleryPhoto.like_count + ' likes';
        syncGalleryCardLike(photoId, data.status === 'liked', currentGalleryPhoto.like_count);
    });
}

function toggleGalleryCardLike(event, photoId, btn) {
    event.stopPropagation();
    if (!requireLogin()) return;
    fetch('../php/like.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + photoId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status !== 'liked' && data.status !== 'unliked') return;
        let card = btn.closest('.galleryPhotoCard');
        let countSpan = card.querySelector('.galleryPhotoLikes span');
        let count = parseInt(countSpan.textContent) || 0;
        if (data.status === 'liked') {
            count++;
            if (typeof likedPhotos !== 'undefined' && !likedPhotos.includes(parseInt(photoId))) likedPhotos.push(parseInt(photoId));
        } else {
            count--;
            if (typeof likedPhotos !== 'undefined') likedPhotos = likedPhotos.filter(id => id != photoId);
        }
        syncGalleryCardLike(photoId, data.status === 'liked', count);
        if (currentGalleryPhoto && currentGalleryPhoto.id == photoId) {
            currentGalleryPhoto.like_count = count;
            document.getElementById('galleryModalLikes').textContent = count + ' likes';
            document.getElementById('galleryModalLikeIcon').className = data.status === 'liked' ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart';
            document.getElementById('galleryModalLikeText').textContent = data.status === 'liked' ? 'Liked' : 'Like';
        }
    });
}

function syncGalleryCardLike(photoId, isLiked, count) {
    let card = document.querySelector('.galleryPhotoCard[data-photo-id="' + photoId + '"]');
    if (!card) return;
    let cardIcon = card.querySelector('.likeBtn i');
    if (cardIcon) cardIcon.className = isLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart';
    let cardCount = card.querySelector('.galleryPhotoLikes span');
    if (cardCount) cardCount.textContent = count;
}

function openGalleryCollectionModal() {
    if (!currentGalleryPhoto) return;
    if (!requireLogin()) return;
    currentPhotoIdForCollection = currentGalleryPhoto.id;
    currentRemovePhotoId = currentGalleryPhoto.id;
    currentCollectBtn = null;

    let isActuallySaved = typeof savedPhotos !== 'undefined' && savedPhotos.includes(parseInt(currentGalleryPhoto.id));

    if (isActuallySaved) {
        openSaveModal(currentGalleryPhoto.id);
    } else {
        openSimpleCollectionModal(currentGalleryPhoto.id);
    }
}


// ─── UPLOAD ──────────────────────────────────────────────────────────────────

let selectedUploadTags = [];
let customTagName = '';
const MAX_TAGS = 5;

function openUploadModal() {
    if (!requireLogin()) return;
    document.getElementById('uploadModal').classList.remove('hidden');
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.add('hidden');
    document.getElementById('uploadPreview').classList.add('hidden');
    document.getElementById('uploadPreview').src = '';
    document.getElementById('uploadTitle_input').value = '';
    document.getElementById('uploadDesc').value = '';
    document.getElementById('uploadCityInput').value = '';
    document.getElementById('uploadCityId').value = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('cityNotFound').classList.add('hidden');
    document.getElementById('citySuggestions').classList.add('hidden');
    document.getElementById('createTagInput').classList.add('hidden');
    document.getElementById('newTagName').value = '';
    customTagName = '';
    selectedUploadTags = [];
    document.querySelectorAll('.uploadTagBtn').forEach(function(btn) { btn.classList.remove('selected'); });
    document.getElementById('uploadTagsCount').textContent = '(0/5)';
    let dropzone = document.getElementById('uploadDropzone');
    if (dropzone) dropzone.style.display = 'block';
}

function submitUpload() {
    if (!requireLogin()) return;
    let title = document.getElementById('uploadTitle_input').value.trim();
    let desc = document.getElementById('uploadDesc').value.trim();
    let cityId = document.getElementById('uploadCityId').value;
    let file = document.getElementById('fileInput').files[0];

    if (!title || !cityId || !file) {
        if (!title) document.getElementById('uploadTitle_input').style.borderBottomColor = '#e74c3c';
        if (!cityId) document.getElementById('uploadCityInput').style.borderBottomColor = '#e74c3c';
        return;
    }

    let formData = new FormData();
    formData.append('photo', file);
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('city_id', cityId);
    selectedUploadTags.forEach(function(tagId) { formData.append('tags[]', tagId); });
    if (customTagName) formData.append('new_tag', customTagName);

    let btn = document.getElementById('uploadSubmitBtn');
    btn.textContent = 'Uploading...';
    btn.disabled = true;

    fetch('../php/upload.php', { method: 'POST', body: formData })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            btn.textContent = 'Upload';
            btn.disabled = false;
            if (data.status === 'success') {
                closeUploadModal();
                showToast('Photo uploaded');
                if (currentView === 'photos') loadGalleryPhotos(document.getElementById('photoSearchInput').value, currentTag);
            } else {
                showToast('Upload failed', 'error');
            }
        })
        .catch(function(err) {
            btn.textContent = 'Upload';
            btn.disabled = false;
            showToast('Upload failed', 'error');
        });
}

function initCitySearch() {
    let input = document.getElementById('uploadCityInput');
    let suggestions = document.getElementById('citySuggestions');
    let notFound = document.getElementById('cityNotFound');
    let hiddenId = document.getElementById('uploadCityId');
    if (!input) return;

    input.addEventListener('input', function() {
        let query = this.value.toLowerCase().trim();
        hiddenId.value = '';
        notFound.classList.add('hidden');
        suggestions.innerHTML = '';
        if (query.length < 1) { suggestions.classList.add('hidden'); return; }

        let filtered = cities.filter(function(c) { return c.name.toLowerCase().includes(query); });
        if (filtered.length === 0) { suggestions.classList.add('hidden'); notFound.classList.remove('hidden'); return; }

        notFound.classList.add('hidden');
        filtered.forEach(function(city) {
            let div = document.createElement('div');
            div.className = 'citySuggestion';
            div.textContent = city.name + ' – ' + city.country;
            div.onclick = function() {
                input.value = city.name;
                hiddenId.value = city.id;
                suggestions.classList.add('hidden');
                input.style.borderBottomColor = '#c9a84c';
            };
            suggestions.appendChild(div);
        });
        suggestions.classList.remove('hidden');
    });

    document.addEventListener('click', function(e) {
        let wrapper = document.getElementById('citySearchWrapper');
        if (wrapper && !wrapper.contains(e.target)) suggestions.classList.add('hidden');
    });
}

function initUploadTags() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('uploadTagBtn') && !e.target.classList.contains('createTag') && !e.target.getAttribute('data-custom')) {
            let tagId = e.target.getAttribute('data-id');
            if (e.target.classList.contains('selected')) {
                e.target.classList.remove('selected');
                selectedUploadTags = selectedUploadTags.filter(id => id != tagId);
            } else {
                if (selectedUploadTags.length >= MAX_TAGS) return;
                e.target.classList.add('selected');
                selectedUploadTags.push(tagId);
            }
            document.getElementById('uploadTagsCount').textContent = '(' + selectedUploadTags.length + '/5)';
        }
        if (e.target.id === 'createTagBtn') {
            document.getElementById('createTagInput').classList.toggle('hidden');
            document.getElementById('newTagName').focus();
        }
        if (e.target.id === 'addTagBtn') {
            let name = document.getElementById('newTagName').value.trim();
            if (!name || selectedUploadTags.length >= MAX_TAGS) return;
            customTagName = name;
            let existing = document.querySelector('.uploadTagBtn[data-custom="true"]');
            if (existing) existing.remove();
            let newBtn = document.createElement('span');
            newBtn.className = 'uploadTagBtn selected';
            newBtn.setAttribute('data-custom', 'true');
            newBtn.textContent = name;
            newBtn.onclick = function() {
                this.remove();
                customTagName = '';
                document.getElementById('uploadTagsCount').textContent = '(' + selectedUploadTags.length + '/5)';
            };
            document.getElementById('uploadTags').insertBefore(newBtn, document.getElementById('createTagBtn'));
            document.getElementById('createTagInput').classList.add('hidden');
            document.getElementById('newTagName').value = '';
            document.getElementById('uploadTagsCount').textContent = '(' + (selectedUploadTags.length + 1) + '/5)';
        }
    });
}


// ─── DOM CONTENT LOADED ───────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {

    let citySearch = document.getElementById('searchInput');
    if (citySearch) {
        citySearch.addEventListener('input', function() {
            let query = this.value.toLowerCase();
            document.querySelectorAll('.cityCard').forEach(function(card) {
                let name = card.querySelector('.cityName').textContent.toLowerCase();
                let country = card.querySelector('.cityCountry').textContent.toLowerCase();
                card.style.display = (name.includes(query) || country.includes(query)) ? 'block' : 'none';
            });
        });
    }

    let photoSearch = document.getElementById('photoSearchInput');
    if (photoSearch) {
        photoSearch.addEventListener('input', function() {
            clearTimeout(photoSearchTimeout);
            let val = this.value;
            photoSearchTimeout = setTimeout(function() { loadGalleryPhotos(val, currentTag); }, 400);
        });
    }

    document.querySelectorAll('.tagBtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tagBtn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            currentTag = this.getAttribute('data-tag');
            let search = document.getElementById('photoSearchInput') ? document.getElementById('photoSearchInput').value : '';
            loadGalleryPhotos(search, currentTag);
        });
    });

    document.querySelectorAll('.sortBtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sortBtn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            currentSort = this.getAttribute('data-sort');
            let search = document.getElementById('photoSearchInput') ? document.getElementById('photoSearchInput').value : '';
            loadGalleryPhotos(search, currentTag);
        });
    });

    let fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            let file = this.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    let preview = document.getElementById('uploadPreview');
                    preview.src = e.target.result;
                    preview.classList.remove('hidden');
                    document.getElementById('uploadDropzone').style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    let galleryGrid = document.getElementById('grid');
    if (galleryGrid) {
        let msnryGallery = new Masonry(galleryGrid, {
            itemSelector: '.cityCard',
            columnWidth: '.cityCard',
            gutter: 20,
            percentPosition: true
        });
        imagesLoaded(galleryGrid, function() {
            msnryGallery.layout();
        });
    }

    initCitySearch();
    initUploadTags();

});