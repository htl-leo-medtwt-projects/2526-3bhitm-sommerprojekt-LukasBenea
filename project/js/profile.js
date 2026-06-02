// ─── COLLECTION OVERLAY ───────────────────────────────────────────────────────

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
        event.currentTarget.closest('.collectionPhotoCard').remove();
    });
}

function closeCollectionOverlay() {
    document.getElementById('collectionOverlayModal').classList.add('hidden');
}


// ─── PHOTO DETAIL ─────────────────────────────────────────────────────────────

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

    let bookmarkIcon = document.getElementById('photoDetailBookmarkIcon');
    if (bookmarkIcon) {
        let isSaved = typeof savedPhotos !== 'undefined' && savedPhotos.includes(parseInt(photo.id));
        bookmarkIcon.className = isSaved ? 'fa-solid fa-bookmark saved' : 'fa-regular fa-bookmark';
    }

    currentPhotoIdForCollection = photo.id;
    currentRemovePhotoId = photo.id;

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
            let card = document.querySelector('.photoCard[data-photo-id="' + photoId + '"]');
            if (card) card.remove();
        }
    });
}

function handlePhotoDetailBookmark() {
    if (!currentDetailPhotoId) return;
    currentPhotoIdForCollection = currentDetailPhotoId;
    currentRemovePhotoId = currentDetailPhotoId;
    currentCollectBtn = null;

    let isActuallySaved = typeof savedPhotos !== 'undefined' && savedPhotos.includes(parseInt(currentDetailPhotoId));

    if (isActuallySaved) {
        openSaveModal(currentDetailPhotoId);
    } else {
        openSimpleCollectionModal(currentDetailPhotoId);
    }
}

function closePhotoDetail() {
    document.getElementById('photoDetailModal').classList.add('hidden');
    currentDetailPhotoId = null;
}


// ─── SECTION OVERLAY ──────────────────────────────────────────────────────────

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
