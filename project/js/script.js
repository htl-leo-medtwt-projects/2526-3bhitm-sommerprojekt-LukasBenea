function openModal(photoId) {
    const photo = photos.find(p => p.id == photoId);
    if (!photo) return;

    const exif = photo.exif_data ? JSON.parse(photo.exif_data) : null;

    document.getElementById('modalImg').src = '../images/' + photo.image_path;
    document.getElementById('modalTitle').textContent = photo.title;
    document.getElementById('modalDesc').textContent = photo.description;

    if (exif) {
        document.getElementById('exifCamera').textContent = exif.camera ? 'Camera: ' + exif.camera : '';
        document.getElementById('exifFocal').textContent = exif.focal_length ? 'Focal Length: ' + exif.focal_length : '';
        document.getElementById('exifAperture').textContent = exif.aperture ? 'Aperture: ' + exif.aperture : '';
        document.getElementById('exifShutter').textContent = exif.shutter_speed ? 'Shutter Speed: ' + exif.shutter_speed : '';
        document.getElementById('exifIso').textContent = exif.iso ? 'ISO: ' + exif.iso : '';
        document.getElementById('exifMode').textContent = exif.mode ? 'Mode: ' + exif.mode : '';
        document.getElementById('exifWb').textContent = exif.white_balance ? 'White Balance: ' + exif.white_balance : '';
    } else {
        document.getElementById('exifCamera').textContent = '';
        document.getElementById('exifFocal').textContent = '';
        document.getElementById('exifAperture').textContent = '';
        document.getElementById('exifShutter').textContent = '';
        document.getElementById('exifIso').textContent = '';
        document.getElementById('exifMode').textContent = '';
        document.getElementById('exifWb').textContent = '';
    }

    let isLiked = likedPhotos.includes(photo.id);
    let modalLikeBtn = document.getElementById('modalLikeBtn');
    let modalLikeIcon = document.getElementById('modalLikeIcon');
    let modalLikeText = document.getElementById('modalLikeText');

    modalLikeBtn.setAttribute('data-id', photo.id);
    modalLikeIcon.className = isLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart';
    modalLikeText.textContent = isLiked ? 'Liked' : 'Like';

    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

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
            likedPhotos.push(parseInt(photoId));
        } else {
            icon.className = 'fa-regular fa-heart';
            likedPhotos = likedPhotos.filter(id => id != photoId);
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
            likedPhotos.push(parseInt(photoId));
            let cardLikeBtn = document.querySelector('.likeBtn[onclick*="' + photoId + '"]');
            if (cardLikeBtn) cardLikeBtn.querySelector('i').className = 'fa-solid fa-heart liked';
        } else {
            icon.className = 'fa-regular fa-heart';
            text.textContent = 'Like';
            likedPhotos = likedPhotos.filter(id => id != photoId);
            let cardLikeBtn = document.querySelector('.likeBtn[onclick*="' + photoId + '"]');
            if (cardLikeBtn) cardLikeBtn.querySelector('i').className = 'fa-regular fa-heart';
        }
    });
}

let currentPhotoIdForCollection = null;
let allCollections = [];
let currentCollectBtn = null;

function openCollectionModal(event, photoId) {
    event.stopPropagation();
    currentPhotoIdForCollection = photoId;
    currentCollectBtn = event.currentTarget;

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
            currentCollectBtn.querySelector('i').className = 'fa-solid fa-bookmark saved';
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

function openCollectionOverlay(collectionId) {
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
                div.innerHTML = '<img src="../images/' + photo.image_path + '" alt="' + photo.title + '">';
                div.onclick = function() { openPhotoDetail(photo); };
                grid.appendChild(div);
            });

            document.getElementById('collectionOverlayModal').classList.remove('hidden');
        });
}

function closeCollectionOverlay() {
    document.getElementById('collectionOverlayModal').classList.add('hidden');
}

function openPhotoDetail(photo) {
    document.getElementById('photoDetailImg').src = '../images/' + photo.image_path;
    document.getElementById('photoDetailTitle').textContent = photo.title;
    document.getElementById('photoDetailDesc').textContent = photo.description;
    document.getElementById('photoDetailModal').classList.remove('hidden');
}

function openPhotoDetailById(photoId, photoArray) {
    const photo = photoArray.find(p => p.id == photoId);
    if (!photo) return;

    const exif = photo.exif_data ? JSON.parse(photo.exif_data) : null;

    document.getElementById('photoDetailImg').src = '../images/' + photo.image_path;
    document.getElementById('photoDetailTitle').textContent = photo.title;
    document.getElementById('photoDetailDesc').textContent = photo.description;

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

    document.getElementById('photoDetailExif').innerHTML = exifHtml;
    document.getElementById('photoDetailModal').classList.remove('hidden');
}

function closePhotoDetail() {
    document.getElementById('photoDetailModal').classList.add('hidden');
}

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

document.addEventListener('DOMContentLoaded', function() {

    let searchInput = document.getElementById('collectionSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderCollectionResults(this.value);
        });
    }

    var galleryGrid = document.getElementById('grid');
    if (galleryGrid) {
        var msnryGallery = new Masonry(galleryGrid, {
            itemSelector: '.cityCard',
            columnWidth: '.cityCard',
            gutter: 20,
            percentPosition: true
        });

        var imgs = galleryGrid.querySelectorAll('img');
        var loaded = 0;
        imgs.forEach(function(img) {
            img.addEventListener('load', function() {
                loaded++;
                if (loaded === imgs.length) msnryGallery.layout();
            });
        });
    }

    var photosGrid = document.getElementById('photosGrid');
    if (photosGrid) {
        var msnryPhotos = new Masonry(photosGrid, {
            itemSelector: '.photoCard',
            columnWidth: '.photoCard',
            gutter: 15,
            percentPosition: true
        });

        var imgs2 = photosGrid.querySelectorAll('img');
        var loaded2 = 0;
        imgs2.forEach(function(img) {
            img.addEventListener('load', function() {
                loaded2++;
                if (loaded2 === imgs2.length) msnryPhotos.layout();
            });
        });
    }

});