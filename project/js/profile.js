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
            currentDetailList = data.photos;

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
    let card = event.currentTarget.closest('.collectionPhotoCard');
    fetch('../php/removeFromCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + photoId + '&collection_id=' + currentCollectionId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (card) card.remove();
        if (currentDetailList) {
            let idx = currentDetailList.findIndex(p => p.id == photoId);
            if (idx !== -1) currentDetailList.splice(idx, 1);
        }
        showToast('Removed from collection');
    });
}

function closeCollectionOverlay() {
    document.getElementById('collectionOverlayModal').classList.add('hidden');
}

document.addEventListener('keydown', function(e) {
    let modal = document.getElementById('photoDetailModal');
    if (!modal || modal.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft') navDetailModal(-1);
    if (e.key === 'ArrowRight') navDetailModal(1);
});


// ─── PHOTO DETAIL ─────────────────────────────────────────────────────────────

let currentDetailPhotoId = null;
let currentDetailPhoto = null;
let currentDetailList = [];

function openPhotoDetail(photo) {
    currentDetailPhotoId = photo.id;
    currentDetailPhoto = photo;

    document.getElementById('photoDetailImg').src = '../images/' + photo.image_path;
    document.getElementById('photoDetailCity').textContent = photo.city_name || '';
    document.getElementById('photoDetailTitle').textContent = photo.title;
    document.getElementById('photoDetailDesc').textContent = photo.description || '';

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
    let exifDiv = document.getElementById('photoDetailExif');
    if (exifDiv) exifDiv.innerHTML = exifHtml;

    let likeBtn = document.getElementById('photoDetailLikeBtn');
    let likeIcon = document.getElementById('photoDetailLikeIcon');
    let likeText = document.getElementById('photoDetailLikeText');
    if (likeBtn) {
        let isLiked = photo.is_liked == 1 || (typeof likedPhotosData !== 'undefined' && likedPhotosData.find(p => p.id == photo.id));
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

    renderPhotoDetailMeta(photo);
    updatePhotoDetailOwnership(photo);
    updateDetailModalNav();

    document.getElementById('photoDetailModal').classList.remove('hidden');
}

function openPhotoDetailById(photoId, photoArray) {
    const photo = photoArray.find(p => p.id == photoId);
    if (!photo) return;

    currentDetailPhotoId = photo.id;
    currentDetailPhoto = photo;
    currentDetailList = photoArray;
    const exif = photo.exif_data ? JSON.parse(photo.exif_data) : null;

    document.getElementById('photoDetailImg').src = '../images/' + photo.image_path;
    document.getElementById('photoDetailCity').textContent = photo.city_name || '';
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
        let isLiked = (photo.is_liked == 1) || (typeof likedPhotosData !== 'undefined' && likedPhotosData.find(p => p.id == photoId));
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

    renderPhotoDetailMeta(photo);
    updatePhotoDetailOwnership(photo);
    updateDetailModalNav();

    document.getElementById('photoDetailModal').classList.remove('hidden');
}

function renderPhotoDetailMeta(photo) {
    let meta = document.getElementById('photoDetailMeta');
    if (!meta) return;
    let html = '';

    if (photo.photographer) {
        let avatar = photo.photographer_avatar
            ? '<img src="../images/' + photo.photographer_avatar + '" alt="' + photo.photographer + '">'
            : '<div class="photoDetailAvatarPlaceholder">' + photo.photographer.charAt(0).toUpperCase() + '</div>';
        html += '<div class="photoDetailPhotographer">'
            + '<div class="photoDetailAvatar">' + avatar + '</div>'
            + '<div class="photoDetailPhotographerInfo">'
            + '<span class="photoDetailPhotographerLabel">Photographer</span>'
            + '<span class="photoDetailPhotographerName">' + photo.photographer + '</span>'
            + '</div></div>';
    }

    let rows = '';
    let dateText = photo.year_taken || (photo.created_at ? photo.created_at.substring(0, 10) : '');
    if (dateText) {
        rows += '<div class="photoDetailMetaRow"><i class="fa-regular fa-calendar"></i><span>' + dateText + '</span></div>';
    }
    if (rows) html += '<div class="photoDetailMetaRows">' + rows + '</div>';

    if (photo.tags) {
        let chips = photo.tags.split(',').map(function(t) {
            return '<span class="photoDetailTag">' + t + '</span>';
        }).join('');
        html += '<div class="photoDetailTags">' + chips + '</div>';
    }

    meta.innerHTML = html;
}

function updatePhotoDetailOwnership(photo) {
    let btn = document.getElementById('photoDetailDeleteBtn');
    if (!btn) return;
    let isOwner = typeof currentUserId !== 'undefined' && photo.user_id == currentUserId;
    btn.classList.toggle('hidden', !isOwner);
}

function updateDetailModalNav() {
    let prev = document.querySelector('#photoDetailBox .photoNavPrev');
    let next = document.querySelector('#photoDetailBox .photoNavNext');
    if (!prev || !next) return;
    let show = currentDetailList && currentDetailList.length > 1;
    prev.classList.toggle('hidden', !show);
    next.classList.toggle('hidden', !show);
}

function navDetailModal(dir) {
    if (!currentDetailList || currentDetailList.length <= 1) return;
    let idx = currentDetailList.findIndex(p => p.id == currentDetailPhotoId);
    if (idx === -1) return;
    let newIdx = (idx + dir + currentDetailList.length) % currentDetailList.length;
    openPhotoDetailById(currentDetailList[newIdx].id, currentDetailList);
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
            if (typeof likedPhotosData !== 'undefined' && currentDetailPhoto && !likedPhotosData.find(p => p.id == photoId)) {
                likedPhotosData.push(currentDetailPhoto);
            }
        } else if (data.status === 'unliked') {
            icon.className = 'fa-regular fa-heart';
            text.textContent = 'Like';
            if (typeof likedPhotosData !== 'undefined') {
                let idx = likedPhotosData.findIndex(p => p.id == photoId);
                if (idx !== -1) likedPhotosData.splice(idx, 1);
            }
            document.querySelectorAll('.photoCard[data-photo-id="' + photoId + '"], .collectionPhotoCard[data-photo-id="' + photoId + '"]').forEach(function(card) {
                card.remove();
            });
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
            div.setAttribute('data-photo-id', photo.id);
            div.innerHTML = '<img src="../images/' + photo.image_path + '" alt="' + photo.title + '">';
            div.onclick = function() { openPhotoDetailById(photo.id, photos); };
            grid.appendChild(div);
        });
    } else if (section === 'likedPhotos') {
        title.textContent = 'Liked Photos';
        likedPhotosData.forEach(function(photo) {
            let div = document.createElement('div');
            div.className = 'collectionPhotoCard';
            div.setAttribute('data-photo-id', photo.id);
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
    collectionToDelete = { id: collectionId, card: event.currentTarget.closest('.collectionCard') };
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
                showToast('Collection deleted');
            }
        });
    };
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
    collectionToDelete = null;
}


let photoToDelete = null;

function askDeletePhoto(event, photoId) {
    event.stopPropagation();
    photoToDelete = photoId;
    document.getElementById('deletePhotoModal').classList.remove('hidden');
}

function closeDeletePhotoModal() {
    document.getElementById('deletePhotoModal').classList.add('hidden');
    photoToDelete = null;
}

function confirmDeletePhoto() {
    if (!photoToDelete) return;
    let photoId = photoToDelete;
    fetch('../php/deletePhoto.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + photoId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status === 'deleted') {
            if (typeof photos !== 'undefined') {
                let idx = photos.findIndex(p => p.id == photoId);
                if (idx !== -1) photos.splice(idx, 1);
            }
            if (typeof likedPhotosData !== 'undefined') {
                let idxL = likedPhotosData.findIndex(p => p.id == photoId);
                if (idxL !== -1) likedPhotosData.splice(idxL, 1);
            }
            document.querySelectorAll('.photoCard[data-photo-id="' + photoId + '"], .collectionPhotoCard[data-photo-id="' + photoId + '"]').forEach(function(card) {
                card.remove();
            });
            closeDeletePhotoModal();
            closePhotoDetail();
            showToast('Photo deleted');
        } else {
            closeDeletePhotoModal();
            showToast('Could not delete photo', 'error');
        }
    });
}


let collectionToEdit = null;

function openEditCollection(event, collectionId) {
    event.stopPropagation();
    let card = event.currentTarget.closest('.collectionCard');
    collectionToEdit = { id: collectionId, card: card };
    document.getElementById('editCollectionName').value = card.querySelector('.collectionName').textContent;
    document.getElementById('editCollectionDesc').value = card.querySelector('.collectionDesc').textContent;
    document.getElementById('editCollectionModal').classList.remove('hidden');
}

function closeEditCollection() {
    document.getElementById('editCollectionModal').classList.add('hidden');
    collectionToEdit = null;
}

function submitEditCollection() {
    if (!collectionToEdit) return;
    let name = document.getElementById('editCollectionName').value.trim();
    let desc = document.getElementById('editCollectionDesc').value.trim();
    if (!name) {
        document.getElementById('editCollectionName').style.borderBottomColor = '#e74c3c';
        return;
    }
    fetch('../php/updateCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'collection_id=' + collectionToEdit.id + '&name=' + encodeURIComponent(name) + '&description=' + encodeURIComponent(desc)
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status === 'success') {
            collectionToEdit.card.querySelector('.collectionName').textContent = data.name;
            collectionToEdit.card.querySelector('.collectionDesc').textContent = data.description;
            closeEditCollection();
            showToast('Collection updated');
        } else {
            showToast('Could not update collection', 'error');
        }
    });
}


function openEditProfile() {
    document.getElementById('editBioInput').value = (typeof userBio !== 'undefined' && userBio) ? userBio : '';

    let avatarPreview = document.getElementById('editAvatarPreview');
    let avatarPlaceholder = document.getElementById('editAvatarPlaceholder');
    if (typeof userAvatar !== 'undefined' && userAvatar) {
        avatarPreview.src = '../images/' + userAvatar;
        avatarPreview.classList.remove('hidden');
        avatarPlaceholder.classList.add('hidden');
    } else {
        avatarPreview.classList.add('hidden');
        avatarPlaceholder.classList.remove('hidden');
    }

    let coverPreview = document.getElementById('editCoverPreview');
    let coverPlaceholder = document.getElementById('editCoverPlaceholder');
    if (typeof userCover !== 'undefined' && userCover) {
        coverPreview.src = '../images/' + userCover;
        coverPreview.classList.remove('hidden');
        coverPlaceholder.classList.add('hidden');
    } else {
        coverPreview.classList.add('hidden');
        coverPlaceholder.classList.remove('hidden');
    }

    document.getElementById('editProfileModal').classList.remove('hidden');
}

function closeEditProfile() {
    document.getElementById('editProfileModal').classList.add('hidden');
    document.getElementById('editAvatarInput').value = '';
    document.getElementById('editCoverInput').value = '';
}

function submitEditProfile() {
    let bio = document.getElementById('editBioInput').value.trim();
    let avatarFile = document.getElementById('editAvatarInput').files[0];
    let coverFile = document.getElementById('editCoverInput').files[0];

    let maxSize = 5 * 1024 * 1024;
    if ((avatarFile && !avatarFile.type.startsWith('image/')) || (coverFile && !coverFile.type.startsWith('image/'))) {
        showToast('Only image files are allowed', 'error');
        return;
    }
    if ((avatarFile && avatarFile.size > maxSize) || (coverFile && coverFile.size > maxSize)) {
        showToast('Image must be under 5 MB', 'error');
        return;
    }

    let formData = new FormData();
    formData.append('bio', bio);
    if (avatarFile) formData.append('avatar', avatarFile);
    if (coverFile) formData.append('cover', coverFile);

    let btn = document.getElementById('editProfileSaveBtn');
    btn.textContent = 'Saving...';
    btn.disabled = true;

    fetch('../php/updateProfile.php', { method: 'POST', body: formData })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            btn.textContent = 'Save Changes';
            btn.disabled = false;
            if (data.status === 'success') {
                showToast('Profile updated');
                setTimeout(function() { window.location.reload(); }, 600);
            } else {
                showToast(data.message ? data.message : 'Could not update profile', 'error');
            }
        })
        .catch(function(err) {
            btn.textContent = 'Save Changes';
            btn.disabled = false;
            showToast('Could not update profile', 'error');
        });
}

document.addEventListener('DOMContentLoaded', function() {
    let avatarInput = document.getElementById('editAvatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', function() {
            let file = this.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = function(e) {
                let preview = document.getElementById('editAvatarPreview');
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                document.getElementById('editAvatarPlaceholder').classList.add('hidden');
            };
            reader.readAsDataURL(file);
        });
    }

    let coverInput = document.getElementById('editCoverInput');
    if (coverInput) {
        coverInput.addEventListener('change', function() {
            let file = this.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = function(e) {
                let preview = document.getElementById('editCoverPreview');
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                document.getElementById('editCoverPlaceholder').classList.add('hidden');
            };
            reader.readAsDataURL(file);
        });
    }
});
