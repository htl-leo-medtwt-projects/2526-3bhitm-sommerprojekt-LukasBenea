// ─── MODAL ────────────────────────────────────────────────────────────────────

let currentModalPhotoId = null;

function openModal(photoId) {
    const photo = photos.find(p => p.id == photoId);
    if (!photo) return;

    currentModalPhotoId = photo.id;

    const exif = photo.exif_data ? JSON.parse(photo.exif_data) : null;

    document.getElementById('modalImg').src = '../images/' + photo.image_path;
    document.getElementById('modalCity').textContent = photo.city_name || '';
    document.getElementById('modalTitle').textContent = photo.title;
    document.getElementById('modalDesc').textContent = photo.description || '';
    renderCityModalMeta(photo);

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

    updateCityModalNav();

    document.getElementById('modal').classList.remove('hidden');
}

function renderCityModalMeta(photo) {
    let meta = document.getElementById('modalMeta');
    if (!meta) return;
    let html = '';

    if (photo.photographer) {
        let avatar = photo.photographer_avatar
            ? '<img src="../images/' + photo.photographer_avatar + '" alt="' + photo.photographer + '">'
            : '<div class="cityMetaAvatarPlaceholder">' + photo.photographer.charAt(0).toUpperCase() + '</div>';
        html += '<div class="cityMetaPhotographer">'
            + '<div class="cityMetaAvatar">' + avatar + '</div>'
            + '<div class="cityMetaInfo"><span class="cityMetaLabel">Photographer</span><span class="cityMetaName">' + photo.photographer + '</span></div>'
            + '</div>';
    }

    let dateText = photo.year_taken || (photo.created_at ? photo.created_at.substring(0, 10) : '');
    if (dateText) {
        html += '<div class="cityMetaRow"><i class="fa-regular fa-calendar"></i><span>' + dateText + '</span></div>';
    }

    if (photo.tags) {
        let chips = photo.tags.split(',').map(function(t) {
            return '<span class="cityMetaTag">' + t + '</span>';
        }).join('');
        html += '<div class="cityMetaTags">' + chips + '</div>';
    }

    meta.innerHTML = html;
}

function updateCityModalNav() {
    let prev = document.querySelector('#modalBox .photoNavPrev');
    let next = document.querySelector('#modalBox .photoNavNext');
    if (!prev || !next) return;
    let show = typeof photos !== 'undefined' && photos.length > 1;
    prev.classList.toggle('hidden', !show);
    next.classList.toggle('hidden', !show);
}

function navCityModal(dir) {
    if (typeof photos === 'undefined' || photos.length <= 1) return;
    let idx = photos.findIndex(p => p.id == currentModalPhotoId);
    if (idx === -1) return;
    let newIdx = (idx + dir + photos.length) % photos.length;
    openModal(photos[newIdx].id);
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    currentModalPhotoId = null;
}

document.addEventListener('keydown', function(e) {
    let modal = document.getElementById('modal');
    if (!modal || modal.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft') navCityModal(-1);
    if (e.key === 'ArrowRight') navCityModal(1);
});


// ─── VISIT CITY ───────────────────────────────────────────────────────────────

function toggleVisit(cityId) {
    if (!requireLogin()) return;
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