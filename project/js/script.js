
/*
// ─── MODAL (City Page) ───────────────────────────────────────────────────────

let currentModalPhotoId = null;

function openModal(photoId) {
    const photo = photos.find(p => p.id == photoId);
    if (!photo) return;

    currentModalPhotoId = photo.id;

    const exif = photo.exif_data ? JSON.parse(photo.exif_data) : null;

    document.getElementById('modalImg').src = '../images/' + photo.image_path;
    document.getElementById('modalTitle').textContent = photo.title;
    document.getElementById('modalDesc').textContent = photo.description || '';
    document.getElementById('modalTags').textContent = '';

    if (exif) {
        document.getElementById('exifCamera').textContent = exif.camera ? 'Camera: ' + exif.camera : '';
        document.getElementById('exifFocal').textContent = exif.focal_length ? 'Focal Length: ' + exif.focal_length : '';
        document.getElementById('exifAperture').textContent = exif.aperture ? 'Aperture: ' + exif.aperture : '';
        document.getElementById('exifShutter').textContent = exif.shutter_speed ? 'Shutter Speed: ' + exif.shutter_speed : '';
        document.getElementById('exifIso').textContent = exif.iso ? 'ISO: ' + exif.iso : '';
        document.getElementById('exifMode').textContent = exif.mode ? 'Mode: ' + exif.mode : '';
        document.getElementById('exifWb').textContent = exif.white_balance ? 'White Balance: ' + exif.white_balance : '';
    } else {
        ['exifCamera', 'exifFocal', 'exifAperture', 'exifShutter', 'exifIso', 'exifMode', 'exifWb'].forEach(function(id) {
            document.getElementById(id).textContent = '';
        });
    }

    let isLiked = likedPhotos.includes(photo.id);
    let modalLikeBtn = document.getElementById('modalLikeBtn');
    let modalLikeIcon = document.getElementById('modalLikeIcon');
    let modalLikeText = document.getElementById('modalLikeText');

    modalLikeBtn.setAttribute('data-id', photo.id);
    modalLikeIcon.className = isLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart';
    modalLikeText.textContent = isLiked ? 'Liked' : 'Like';

    let isSaved = savedPhotos && savedPhotos.includes(photo.id);
    let modalBookmarkIcon = document.getElementById('modalBookmarkIcon');
    let modalBookmarkText = document.getElementById('modalBookmarkText');
    if (modalBookmarkIcon) {
        modalBookmarkIcon.className = isSaved ? 'fa-solid fa-bookmark saved' : 'fa-regular fa-bookmark';
        modalBookmarkText.textContent = isSaved ? 'Saved' : 'Save';
    }

    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    currentModalPhotoId = null;
}


// ─── LIKE ─────────────────────────────────────────────────────────────────────

function toggleLike(event, photoId, btn) {
    event.stopPropagation();

    fetch('../php/like.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + photoId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        let icon = btn.querySelector('i');
        if (data.status === 'liked') {
            icon.className = 'fa-solid fa-heart liked';
            if (typeof likedPhotos !== 'undefined') likedPhotos.push(parseInt(photoId));
        } else {
            icon.className = 'fa-regular fa-heart';
            if (typeof likedPhotos !== 'undefined') likedPhotos = likedPhotos.filter(id => id != photoId);
        }
    });
}

function toggleLikeModal(btn) {
    let photoId = btn.getAttribute('data-id');
    let icon = document.getElementById('modalLikeIcon');
    let text = document.getElementById('modalLikeText');

    fetch('../php/like.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + photoId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status === 'liked') {
            icon.className = 'fa-solid fa-heart liked';
            text.textContent = 'Liked';
            if (typeof likedPhotos !== 'undefined') likedPhotos.push(parseInt(photoId));
            let cardBtn = document.querySelector('.likeBtn[onclick*="' + photoId + '"]');
            if (cardBtn) cardBtn.querySelector('i').className = 'fa-solid fa-heart liked';
        } else {
            icon.className = 'fa-regular fa-heart';
            text.textContent = 'Like';
            if (typeof likedPhotos !== 'undefined') likedPhotos = likedPhotos.filter(id => id != photoId);
            let cardBtn = document.querySelector('.likeBtn[onclick*="' + photoId + '"]');
            if (cardBtn) cardBtn.querySelector('i').className = 'fa-regular fa-heart';
        }
    });
}

function unlikePhoto(event, photoId, btn) {
    event.stopPropagation();

    fetch('../php/like.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + photoId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status === 'unliked') {
            let card = btn.closest('.photoCard');
            if (card) card.remove();
        }
    });
}


// ─── BOOKMARK / COLLECTION ───────────────────────────────────────────────────

let currentPhotoIdForCollection = null;
let allCollections = [];
let currentCollectBtn = null;

function handleBookmark(event, photoId, isSaved, btn) {
    event.stopPropagation();
    currentPhotoIdForCollection = photoId;
    currentCollectBtn = btn;

    if (isSaved) {
        openRemoveCollectionModal(photoId);
    } else {
        openCollectionModal(event, photoId);
    }
}

function openCollectionModal(event, photoId) {
    if (event) event.stopPropagation();
    currentPhotoIdForCollection = photoId;
    if (event) currentCollectBtn = event.currentTarget;

    fetch('../php/getCollections.php')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            allCollections = data;
            document.getElementById('collectionSearch').value = '';
            renderCollectionResults('');
            document.getElementById('collectionModal').classList.remove('hidden');
        });
}

function renderCollectionResults(query) {
    let container = document.getElementById('collectionResults');
    container.innerHTML = '';

    let filtered = allCollections.filter(function(c) {
        return c.name.toLowerCase().includes(query.toLowerCase());
    });

    filtered.forEach(function(collection) {
        let div = document.createElement('div');
        div.className = 'collectionOption';
        div.textContent = collection.name;
        div.onclick = function() { addToCollection(collection.id); };
        container.appendChild(div);
    });

    if (query.length > 0) {
        let exactMatch = allCollections.find(function(c) {
            return c.name.toLowerCase() === query.toLowerCase();
        });

        if (!exactMatch) {
            let createBtn = document.createElement('div');
            createBtn.className = 'collectionCreate';
            createBtn.textContent = '+ Create "' + query + '"';
            createBtn.onclick = function() { createAndAddCollection(query); };
            container.appendChild(createBtn);
        }
    }
}

function closeCollectionModal() {
    document.getElementById('collectionModal').classList.add('hidden');
}

function addToCollection(collectionId) {
    fetch('../php/addToCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + currentPhotoIdForCollection + '&collection_id=' + collectionId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (currentCollectBtn) {
            let icon = currentCollectBtn.querySelector ? currentCollectBtn.querySelector('i') : null;
            if (icon) icon.className = 'fa-solid fa-bookmark saved';
        }
        if (typeof savedPhotos !== 'undefined' && !savedPhotos.includes(parseInt(currentPhotoIdForCollection))) {
            savedPhotos.push(parseInt(currentPhotoIdForCollection));
        }
        closeCollectionModal();
    });
}

function createAndAddCollection(name) {
    fetch('../php/createCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'name=' + encodeURIComponent(name) + '&description='
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status === 'success') addToCollection(data.collection_id);
    });
}


// ─── REMOVE FROM COLLECTION ──────────────────────────────────────────────────

let currentRemovePhotoId = null;

function openRemoveCollectionModal(photoId) {
    currentRemovePhotoId = photoId || currentPhotoIdForCollection;

    fetch('../php/getPhotoCollections.php?photo_id=' + currentRemovePhotoId)
        .then(function(response) { return response.json(); })
        .then(function(collections) {
            let list = document.getElementById('removeCollectionList');
            list.innerHTML = '';

            collections.forEach(function(c) {
                let div = document.createElement('div');
                div.className = 'removeCollectionOption';
                div.textContent = c.name;
                div.onclick = function() { removeFromCollection(c.id); };
                list.appendChild(div);
            });

            document.getElementById('removeCollectionModal').classList.remove('hidden');
        });
}

function closeRemoveCollectionModal() {
    document.getElementById('removeCollectionModal').classList.add('hidden');
}

function removeFromCollection(collectionId) {
    fetch('../php/removeFromCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + currentRemovePhotoId + '&collection_id=' + collectionId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        closeRemoveCollectionModal();

        // Bookmark Icon zurücksetzen falls in keiner Kollektion mehr
        fetch('../php/getPhotoCollections.php?photo_id=' + currentRemovePhotoId)
            .then(function(r) { return r.json(); })
            .then(function(remaining) {
                if (remaining.length === 0) {
                    let btns = document.querySelectorAll('.collectBtn[onclick*="' + currentRemovePhotoId + '"]');
                    btns.forEach(function(btn) {
                        btn.querySelector('i').className = 'fa-regular fa-bookmark';
                    });
                    if (typeof savedPhotos !== 'undefined') {
                        savedPhotos = savedPhotos.filter(id => id != currentRemovePhotoId);
                    }
                }
            });
    });
}

function removeFromAllCollections() {
    fetch('../php/removeFromCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + currentRemovePhotoId + '&remove_all=1'
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        closeRemoveCollectionModal();

        let btns = document.querySelectorAll('.collectBtn[onclick*="' + currentRemovePhotoId + '"]');
        btns.forEach(function(btn) {
            btn.querySelector('i').className = 'fa-regular fa-bookmark';
        });

        if (typeof savedPhotos !== 'undefined') {
            savedPhotos = savedPhotos.filter(id => id != currentRemovePhotoId);
        }

        // Modal Bookmark auch zurücksetzen
        let modalBookmarkIcon = document.getElementById('modalBookmarkIcon');
        let modalBookmarkText = document.getElementById('modalBookmarkText');
        if (modalBookmarkIcon) {
            modalBookmarkIcon.className = 'fa-regular fa-bookmark';
            modalBookmarkText.textContent = 'Save';
        }
    });
}


// ─── MODAL BOOKMARK ──────────────────────────────────────────────────────────

function handleModalBookmark() {
    if (!currentModalPhotoId) return;

    let isSaved = savedPhotos && savedPhotos.includes(currentModalPhotoId);

    if (isSaved) {
        currentRemovePhotoId = currentModalPhotoId;
        openRemoveCollectionModal(currentModalPhotoId);
    } else {
        currentPhotoIdForCollection = currentModalPhotoId;
        currentCollectBtn = null;
        openCollectionModal(null, currentModalPhotoId);
    }
}


// ─── COLLECTION OVERLAY (Profile) ────────────────────────────────────────────

let currentCollectionId = null;

function openCollectionOverlay(collectionId) {
    currentCollectionId = collectionId;

    fetch('../php/getCollectionPhotos.php?collection_id=' + collectionId)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            let grid = document.getElementById('collectionOverlayGrid');
            let title = document.getElementById('collectionOverlayTitle');
            title.textContent = data.name;
            grid.innerHTML = '';

            data.photos.forEach(function(photo) {
                let div = document.createElement('div');
                div.className = 'collectionPhotoCard';
                div.innerHTML = `
                    <img src="../images/${photo.image_path}" alt="${photo.title}">
                    <div class="removeFromCollectionBtn" onclick="removePhotoFromCollectionOverlay(event, ${photo.id})">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <div class="collectionPhotoOverlay">
                        <p class="collectionPhotoTitle">${photo.title}</p>
                    </div>
                `;
                div.onclick = function() { openPhotoDetail(photo); };
                grid.appendChild(div);
            });

            document.getElementById('collectionOverlayModal').classList.remove('hidden');
        });
}

function removePhotoFromCollectionOverlay(event, photoId) {
    event.stopPropagation();

    fetch('../php/removeFromCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + photoId + '&collection_id=' + currentCollectionId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        let btn = event.currentTarget;
        btn.closest('.collectionPhotoCard').remove();
    });
}

function closeCollectionOverlay() {
    document.getElementById('collectionOverlayModal').classList.add('hidden');
}


// ─── PHOTO DETAIL (Profile) ──────────────────────────────────────────────────

let currentDetailPhotoId = null;

function openPhotoDetail(photo) {
    currentDetailPhotoId = photo.id;

    document.getElementById('photoDetailImg').src = '../images/' + photo.image_path;
    document.getElementById('photoDetailTitle').textContent = photo.title;
    document.getElementById('photoDetailDesc').textContent = photo.description || '';

    let exifDiv = document.getElementById('photoDetailExif');
    if (exifDiv) exifDiv.innerHTML = '';

    document.getElementById('photoDetailModal').classList.remove('hidden');
}

function openPhotoDetailById(photoId, photoArray) {
    const photo = photoArray.find(p => p.id == photoId);
    if (!photo) return;

    currentDetailPhotoId = photo.id;
    const exif = photo.exif_data ? JSON.parse(photo.exif_data) : null;

    document.getElementById('photoDetailImg').src = '../images/' + photo.image_path;
    document.getElementById('photoDetailTitle').textContent = photo.title;
    document.getElementById('photoDetailDesc').textContent = photo.description || '';

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

    let exifDiv = document.getElementById('photoDetailExif');
    if (exifDiv) exifDiv.innerHTML = exifHtml;

    // Like Status setzen
    let likeBtn = document.getElementById('photoDetailLikeBtn');
    let likeIcon = document.getElementById('photoDetailLikeIcon');
    let likeText = document.getElementById('photoDetailLikeText');
    if (likeBtn) {
        let isLiked = typeof likedPhotosData !== 'undefined'
            ? likedPhotosData.find(p => p.id == photoId)
            : false;
        likeIcon.className = isLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart';
        likeText.textContent = isLiked ? 'Liked' : 'Like';
        likeBtn.setAttribute('data-id', photo.id);
    }

    document.getElementById('photoDetailModal').classList.remove('hidden');
}

function toggleLikeDetail() {
    let btn = document.getElementById('photoDetailLikeBtn');
    let photoId = btn.getAttribute('data-id');
    let icon = document.getElementById('photoDetailLikeIcon');
    let text = document.getElementById('photoDetailLikeText');

    fetch('../php/like.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + photoId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status === 'liked') {
            icon.className = 'fa-solid fa-heart liked';
            text.textContent = 'Liked';
        } else {
            icon.className = 'fa-regular fa-heart';
            text.textContent = 'Like';
            // Karte aus Liked Photos entfernen
            let card = document.querySelector('.photoCard[data-photo-id="' + photoId + '"]');
            if (card) card.remove();
        }
    });
}

function closePhotoDetail() {
    document.getElementById('photoDetailModal').classList.add('hidden');
    currentDetailPhotoId = null;
}


// ─── SECTION OVERLAY (Profile - Show All) ────────────────────────────────────

function openSectionOverlay(section) {
    let grid = document.getElementById('sectionOverlayGrid');
    let title = document.getElementById('sectionOverlayTitle');
    grid.innerHTML = '';

    if (section === 'myPhotos') {
        title.textContent = 'My Photos';
        photos.forEach(function(photo) {
            let div = document.createElement('div');
            div.className = 'collectionPhotoCard';
            div.innerHTML = '<img src="../images/' + photo.image_path + '" alt="' + photo.title + '">';
            div.onclick = function() { openPhotoDetailById(photo.id, photos); };
            grid.appendChild(div);
        });
    } else if (section === 'likedPhotos') {
        title.textContent = 'Liked Photos';
        likedPhotosData.forEach(function(photo) {
            let div = document.createElement('div');
            div.className = 'collectionPhotoCard';
            div.innerHTML = '<img src="../images/' + photo.image_path + '" alt="' + photo.title + '">';
            div.onclick = function() { openPhotoDetailById(photo.id, likedPhotosData); };
            grid.appendChild(div);
        });
    } else if (section === 'visited') {
        title.textContent = 'Cities Visited';
        visitedCitiesData.forEach(function(city) {
            let div = document.createElement('div');
            div.className = 'collectionPhotoCard';
            div.innerHTML = `
                <img src="../images/${city.hero_image}" alt="${city.name}">
                <div class="collectionPhotoOverlay">
                    <p class="collectionPhotoTitle">${city.name}</p>
                </div>
            `;
            grid.appendChild(div);
        });
    }

    document.getElementById('sectionOverlay').classList.remove('hidden');
}

function closeSectionOverlay() {
    document.getElementById('sectionOverlay').classList.add('hidden');
}


// ─── DELETE COLLECTION ────────────────────────────────────────────────────────

let collectionToDelete = null;

function deleteCollection(event, collectionId) {
    event.stopPropagation();
    collectionToDelete = { id: collectionId, card: event.currentTarget.parentElement };
    document.getElementById('deleteModal').classList.remove('hidden');

    document.getElementById('deleteConfirmBtn').onclick = function() {
        fetch('../php/addToCollection.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=delete&collection_id=' + collectionToDelete.id
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.status === 'deleted') {
                collectionToDelete.card.remove();
                closeDeleteModal();
            }
        });
    };
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
    collectionToDelete = null;
}


// ─── VISIT CITY ──────────────────────────────────────────────────────────────

function toggleVisit(cityId) {
    fetch('../php/visitCity.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'city_id=' + cityId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        let btn = document.getElementById('visitBtn');
        let icon = btn.querySelector('i');
        let text = document.getElementById('visitText');

        if (data.status === 'visited') {
            btn.classList.add('visited');
            icon.className = 'fa-solid fa-location-dot';
            text.textContent = "I've been here";
        } else {
            btn.classList.remove('visited');
            icon.className = 'fa-solid fa-location-dot';
            text.textContent = 'Mark as visited';
        }
    });
}


// ─── GALLERY SWITCH & PHOTOS VIEW ────────────────────────────────────────────

let currentView = 'cities';
let currentTag = '';
let photoSearchTimeout = null;
let galleryMsnry = null;
let currentGalleryPhoto = null;

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
    let url = '../php/getPhotos.php?search=' + encodeURIComponent(search) + '&tag=' + encodeURIComponent(tag);

    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(photos) {
            let grid = document.getElementById('photosGrid');
            grid.innerHTML = '';

            if (photos.length === 0) {
                grid.innerHTML = '<p style="color:#555; font-size:13px; letter-spacing:1px;">No photos found.</p>';
                return;
            }

            photos.forEach(function(photo) {
                let div = document.createElement('div');
                div.className = 'galleryPhotoCard';
                div.innerHTML = `
                    <img src="../images/${photo.image_path}" alt="${photo.title}">
                    <div class="galleryPhotoLikes">
                        <i class="fa-solid fa-heart"></i>
                        <span>${photo.like_count}</span>
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

            let imgs = grid.querySelectorAll('img');
            let loaded = 0;
            imgs.forEach(function(img) {
                img.addEventListener('load', function() {
                    loaded++;
                    if (loaded === imgs.length) galleryMsnry.layout();
                });
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

    document.getElementById('galleryPhotoModal').classList.remove('hidden');
}

function closeGalleryPhotoModal() {
    document.getElementById('galleryPhotoModal').classList.add('hidden');
    currentGalleryPhoto = null;
}

function toggleGalleryLike() {
    if (!currentGalleryPhoto) return;

    fetch('../php/like.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + currentGalleryPhoto.id
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        let icon = document.getElementById('galleryModalLikeIcon');
        let text = document.getElementById('galleryModalLikeText');
        if (data.status === 'liked') {
            icon.className = 'fa-solid fa-heart liked';
            text.textContent = 'Liked';
            currentGalleryPhoto.like_count++;
        } else {
            icon.className = 'fa-regular fa-heart';
            text.textContent = 'Like';
            currentGalleryPhoto.like_count--;
        }
        document.getElementById('galleryModalLikes').textContent = currentGalleryPhoto.like_count + ' likes';
    });
}

function openGalleryCollectionModal() {
    if (!currentGalleryPhoto) return;
    currentPhotoIdForCollection = currentGalleryPhoto.id;
    currentCollectBtn = null;

    fetch('../php/getCollections.php')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            allCollections = data;
            document.getElementById('collectionSearch').value = '';
            renderCollectionResults('');
            document.getElementById('collectionModal').classList.remove('hidden');
        });
}


// ─── UPLOAD ──────────────────────────────────────────────────────────────────

let selectedUploadTags = [];
let customTagName = '';
const MAX_TAGS = 5;

function openUploadModal() {
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

    document.querySelectorAll('.uploadTagBtn').forEach(function(btn) {
        btn.classList.remove('selected');
    });

    document.getElementById('uploadTagsCount').textContent = '(0/5)';

    let dropzone = document.getElementById('uploadDropzone');
    if (dropzone) dropzone.style.display = 'block';
}

function submitUpload() {
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

    selectedUploadTags.forEach(function(tagId) {
        formData.append('tags[]', tagId);
    });

    if (customTagName) {
        formData.append('new_tag', customTagName);
    }

    let btn = document.getElementById('uploadSubmitBtn');
    btn.textContent = 'Uploading...';
    btn.disabled = true;

    fetch('../php/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        btn.textContent = 'Upload';
        btn.disabled = false;
        if (data.status === 'success') {
            closeUploadModal();
        } else {
            console.error('Upload error:', data.message);
        }
    })
    .catch(function(err) {
        btn.textContent = 'Upload';
        btn.disabled = false;
        console.error(err);
    });
}

// City Search
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

        if (query.length < 1) {
            suggestions.classList.add('hidden');
            return;
        }

        let filtered = cities.filter(function(c) {
            return c.name.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            suggestions.classList.add('hidden');
            notFound.classList.remove('hidden');
            return;
        }

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
        if (!document.getElementById('citySearchWrapper').contains(e.target)) {
            suggestions.classList.add('hidden');
        }
    });
}

// Tag Selection
function initUploadTags() {
    document.addEventListener('click', function(e) {

        // Normale Tag Buttons
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

        // Create Tag Button
        if (e.target.id === 'createTagBtn') {
            document.getElementById('createTagInput').classList.toggle('hidden');
            document.getElementById('newTagName').focus();
        }

        // Add Tag Button
        if (e.target.id === 'addTagBtn') {
            let name = document.getElementById('newTagName').value.trim();
            if (!name) return;
            if (selectedUploadTags.length >= MAX_TAGS) return;

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


// ─── DOM CONTENT LOADED ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {

    // Collection Search
    let collectionSearchInput = document.getElementById('collectionSearch');
    if (collectionSearchInput) {
        collectionSearchInput.addEventListener('input', function() {
            renderCollectionResults(this.value);
        });
    }

    // City Search (Gallery)
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

    // Photo Search (Gallery Photos View)
    let photoSearch = document.getElementById('photoSearchInput');
    if (photoSearch) {
        photoSearch.addEventListener('input', function() {
            clearTimeout(photoSearchTimeout);
            let val = this.value;
            photoSearchTimeout = setTimeout(function() {
                loadGalleryPhotos(val, currentTag);
            }, 400);
        });
    }

    // Tag Filter
    document.querySelectorAll('.tagBtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tagBtn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            currentTag = this.getAttribute('data-tag');
            let search = document.getElementById('photoSearchInput') ? document.getElementById('photoSearchInput').value : '';
            loadGalleryPhotos(search, currentTag);
        });
    });

    // Upload Tag Buttons
    document.querySelectorAll('.uploadTagBtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });

    // File Preview
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

    // Masonry – City Gallery Grid
    let galleryGrid = document.getElementById('grid');
    if (galleryGrid) {
        let msnryGallery = new Masonry(galleryGrid, {
            itemSelector: '.cityCard',
            columnWidth: '.cityCard',
            gutter: 20,
            percentPosition: true
        });

        let imgs = galleryGrid.querySelectorAll('img');
        let loaded = 0;
        imgs.forEach(function(img) {
            img.addEventListener('load', function() {
                loaded++;
                if (loaded === imgs.length) msnryGallery.layout();
            });
        });
    }

    // Masonry – City Photos Grid
    let photosGrid = document.getElementById('photosGrid');
    if (photosGrid && photosGrid.querySelector('.photoCard')) {
        let msnryPhotos = new Masonry(photosGrid, {
            itemSelector: '.photoCard',
            columnWidth: '.photoCard',
            gutter: 15,
            percentPosition: true
        });

        let imgs2 = photosGrid.querySelectorAll('img');
        let loaded2 = 0;
        imgs2.forEach(function(img) {
            img.addEventListener('load', function() {
                loaded2++;
                if (loaded2 === imgs2.length) msnryPhotos.layout();
            });
        });
    }
    initCitySearch();
    initUploadTags();
});
*/