// ─── MODAL ────────────────────────────────────────────────────────────────────

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


// ─── VISIT CITY ───────────────────────────────────────────────────────────────

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


// ─── DOM CONTENT LOADED ───────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {

    let photosGrid = document.getElementById('photosGrid');
    if (photosGrid && photosGrid.querySelector('.photoCard')) {
        let msnryPhotos = new Masonry(photosGrid, {
            itemSelector: '.photoCard',
            columnWidth: '.photoCard',
            gutter: 15,
            percentPosition: true
        });
        imagesLoaded(photosGrid, function() {
            msnryPhotos.layout();
        });
    }

});