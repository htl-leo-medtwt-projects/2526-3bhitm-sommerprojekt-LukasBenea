function openModal(photoId) {
    let photo = photos.find(p => p.id == photoId);
    if (!photo) return;

    let exif = JSON.parse(photo.exif_data);

    document.getElementById('modalImg').src = '../images/' + photo.image_path;
    document.getElementById('modalTitle').textContent = photo.title;
    document.getElementById('modalDesc').textContent = photo.description;
    document.getElementById('modalTags').textContent = 'x ' + photo.description;
    document.getElementById('exifCamera').textContent = 'Camera: ' + exif.camera;
    document.getElementById('exifFocal').textContent = 'Focal Length: ' + exif.focal_length;
    document.getElementById('exifAperture').textContent = 'Aperture: ' + exif.aperture;
    document.getElementById('exifShutter').textContent = 'Shutter Speed: ' + exif.shutter_speed;
    document.getElementById('exifIso').textContent = 'ISO: ' + exif.iso;
    document.getElementById('exifMode').textContent = 'Mode: ' + exif.mode;
    document.getElementById('exifWb').textContent = 'White Balance: ' + exif.white_balance;

    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', function() {

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
                if (loaded === imgs.length) {
                    msnryGallery.layout();
                }
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
                if (loaded2 === imgs2.length) {
                    msnryPhotos.layout();
                }
            });
        });
    }

});