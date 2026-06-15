let heroSection = document.getElementById('heroSection');
let zoomOverlay = document.getElementById('zoomOverlay');
let title = document.getElementById('title');

if (heroSection) {
    heroSection.addEventListener('click', function() {
        title.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
        title.style.transform = 'scale(8)';
        title.style.opacity = '0';
        zoomOverlay.classList.add('active');
        setTimeout(function() {
            window.location.href = 'gallery.php';
        }, 700);
    });
}

function openIndexPhoto(photoId) {
    if (typeof latestPhotosData === 'undefined') return;
    var photo = latestPhotosData.find(function(p) { return p.id == photoId; });
    if (!photo) return;

    document.getElementById('indexPhotoImg').src = '../images/' + photo.image_path;
    document.getElementById('indexPhotoTitle').textContent = photo.title;
    document.getElementById('indexPhotoCity').textContent = photo.city_name || '';
    document.getElementById('indexPhotoDesc').textContent = photo.description || '';

    var meta = document.getElementById('indexPhotoMeta');
    var metaHtml = '';
    if (photo.photographer) {
        var avatar = photo.photographer_avatar
            ? '<img src="../images/' + photo.photographer_avatar + '" alt="' + photo.photographer + '">'
            : '<div class="indexMetaAvatarPlaceholder">' + photo.photographer.charAt(0).toUpperCase() + '</div>';
        metaHtml += '<div class="indexMetaPhotographer"><div class="indexMetaAvatar">' + avatar + '</div>'
            + '<div class="indexMetaInfo"><span class="indexMetaLabel">Photographer</span><span class="indexMetaName">' + photo.photographer + '</span></div></div>';
    }
    var dateText = photo.year_taken || (photo.created_at ? photo.created_at.substring(0, 10) : '');
    if (dateText) {
        metaHtml += '<div class="indexMetaRow"><i class="fa-regular fa-calendar"></i><span>' + dateText + '</span></div>';
    }
    if (photo.tags) {
        var chips = photo.tags.split(',').map(function(t) { return '<span class="indexMetaTag">' + t + '</span>'; }).join('');
        metaHtml += '<div class="indexMetaTags">' + chips + '</div>';
    }
    meta.innerHTML = metaHtml;

    var exif = photo.exif_data ? JSON.parse(photo.exif_data) : null;
    var exifHtml = '';
    if (exif) {
        exifHtml += exif.camera ? '<p class="exifRow">Camera: ' + exif.camera + '</p>' : '';
        exifHtml += exif.focal_length ? '<p class="exifRow">Focal Length: ' + exif.focal_length + '</p>' : '';
        exifHtml += exif.aperture ? '<p class="exifRow">Aperture: ' + exif.aperture + '</p>' : '';
        exifHtml += exif.shutter_speed ? '<p class="exifRow">Shutter Speed: ' + exif.shutter_speed + '</p>' : '';
        exifHtml += exif.iso ? '<p class="exifRow">ISO: ' + exif.iso + '</p>' : '';
        exifHtml += exif.mode ? '<p class="exifRow">Mode: ' + exif.mode + '</p>' : '';
        exifHtml += exif.white_balance ? '<p class="exifRow">White Balance: ' + exif.white_balance + '</p>' : '';
    }
    document.getElementById('indexPhotoExif').innerHTML = exifHtml;

    document.getElementById('indexPhotoModal').classList.remove('hidden');
}

function closeIndexPhoto() {
    document.getElementById('indexPhotoModal').classList.add('hidden');
}

document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    var modal = document.getElementById('indexPhotoModal');
    if (modal && !modal.classList.contains('hidden')) modal.classList.add('hidden');
});
