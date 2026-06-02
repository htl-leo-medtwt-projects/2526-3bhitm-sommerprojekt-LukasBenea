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


// ─── HILFSFUNKTIONEN ─────────────────────────────────────────────────────────

function _resetBookmarkIcons(photoId) {
    document.querySelectorAll('.collectBtn[onclick*="' + photoId + '"]').forEach(function(btn) {
        btn.querySelector('i').className = 'fa-regular fa-bookmark';
    });
    if (typeof savedPhotos !== 'undefined') {
        savedPhotos = savedPhotos.filter(id => id != photoId);
    }
    let modalBookmarkIcon = document.getElementById('modalBookmarkIcon');
    let modalBookmarkText = document.getElementById('modalBookmarkText');
    if (modalBookmarkIcon) {
        modalBookmarkIcon.className = 'fa-regular fa-bookmark';
        if (modalBookmarkText) modalBookmarkText.textContent = 'Save';
    }
    let galleryBookmarkIcon = document.getElementById('galleryModalBookmarkIcon');
    let galleryBookmarkText = document.getElementById('galleryModalBookmarkText');
    if (galleryBookmarkIcon && typeof currentGalleryPhoto !== 'undefined' && currentGalleryPhoto && currentGalleryPhoto.id == photoId) {
        galleryBookmarkIcon.className = 'fa-regular fa-bookmark';
        if (galleryBookmarkText) galleryBookmarkText.textContent = 'Save';
    }
    let detailBookmarkIcon = document.getElementById('photoDetailBookmarkIcon');
    if (detailBookmarkIcon) {
        detailBookmarkIcon.className = 'fa-regular fa-bookmark';
    }
}

function _setBookmarkIcons(photoId) {
    document.querySelectorAll('.collectBtn[onclick*="' + photoId + '"]').forEach(function(btn) {
        btn.querySelector('i').className = 'fa-solid fa-bookmark saved';
    });
    if (typeof savedPhotos !== 'undefined' && !savedPhotos.includes(parseInt(photoId))) {
        savedPhotos.push(parseInt(photoId));
    }
    let modalBookmarkIcon = document.getElementById('modalBookmarkIcon');
    let modalBookmarkText = document.getElementById('modalBookmarkText');
    if (modalBookmarkIcon && typeof currentModalPhotoId !== 'undefined' && currentModalPhotoId == photoId) {
        modalBookmarkIcon.className = 'fa-solid fa-bookmark saved';
        if (modalBookmarkText) modalBookmarkText.textContent = 'Saved';
    }
    let galleryBookmarkIcon = document.getElementById('galleryModalBookmarkIcon');
    let galleryBookmarkText = document.getElementById('galleryModalBookmarkText');
    if (galleryBookmarkIcon && typeof currentGalleryPhoto !== 'undefined' && currentGalleryPhoto && currentGalleryPhoto.id == photoId) {
        galleryBookmarkIcon.className = 'fa-solid fa-bookmark saved';
        if (galleryBookmarkText) galleryBookmarkText.textContent = 'Saved';
    }
    let detailBookmarkIcon = document.getElementById('photoDetailBookmarkIcon');
    if (detailBookmarkIcon && typeof currentDetailPhotoId !== 'undefined' && currentDetailPhotoId == photoId) {
        detailBookmarkIcon.className = 'fa-solid fa-bookmark saved';
    }
}


// ─── BOOKMARK ────────────────────────────────────────────────────────────────

let currentPhotoIdForCollection = null;
let allCollections = [];
let currentCollectBtn = null;
let currentRemovePhotoId = null;

function handleBookmark(event, photoId, isSavedOnLoad, btn) {
    event.stopPropagation();
    currentPhotoIdForCollection = photoId;
    currentRemovePhotoId = photoId;
    currentCollectBtn = btn;

    let isActuallySaved = typeof savedPhotos !== 'undefined' && savedPhotos.includes(parseInt(photoId));

    if (isActuallySaved) {
        openSaveModal(photoId);
    } else {
        openSimpleCollectionModal(photoId);
    }
}

function handleModalBookmark() {
    if (typeof currentModalPhotoId === 'undefined' || !currentModalPhotoId) return;
    currentPhotoIdForCollection = currentModalPhotoId;
    currentRemovePhotoId = currentModalPhotoId;
    currentCollectBtn = null;

    let isActuallySaved = typeof savedPhotos !== 'undefined' && savedPhotos.includes(parseInt(currentModalPhotoId));

    if (isActuallySaved) {
        openSaveModal(currentModalPhotoId);
    } else {
        openSimpleCollectionModal(currentModalPhotoId);
    }
}


// ─── EINFACHES COLLECTION MODAL ──────────────────────────────────────────────

function openSimpleCollectionModal(photoId) {
    currentPhotoIdForCollection = photoId;
    fetch('../php/getCollections.php')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            allCollections = data;
            document.getElementById('collectionSearch').value = '';
            renderCollectionResults('');
            document.getElementById('collectionModal').classList.remove('hidden');
        });
}

function openCollectionModal(event, photoId) {
    if (event) event.stopPropagation();
    currentPhotoIdForCollection = photoId;
    if (event) currentCollectBtn = event.currentTarget;
    openSimpleCollectionModal(photoId);
}

function closeCollectionModal() {
    document.getElementById('collectionModal').classList.add('hidden');
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

function addToCollection(collectionId) {
    fetch('../php/addToCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + currentPhotoIdForCollection + '&collection_id=' + collectionId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        _setBookmarkIcons(currentPhotoIdForCollection);
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


// ─── SAVE MODAL (kombiniert) ──────────────────────────────────────────────────

function openSaveModal(photoId) {
    currentRemovePhotoId = photoId;
    currentPhotoIdForCollection = photoId;

    Promise.all([
        fetch('../php/getPhotoCollection.php?photo_id=' + photoId).then(function(r) { return r.json(); }),
        fetch('../php/getCollections.php').then(function(r) { return r.json(); })
    ])
    .then(function(results) {
        let savedIn = results[0];
        allCollections = results[1];
        let savedIds = savedIn.map(function(c) { return parseInt(c.id); });

        let savedInSection = document.getElementById('savedInSection');
        let savedInList = document.getElementById('savedInList');
        savedInList.innerHTML = '';

        if (savedIn.length > 0) {
            savedIn.forEach(function(c) {
                let div = document.createElement('div');
                div.className = 'savedInOption';
                div.innerHTML = '<span>' + c.name + '</span><i class="fa-solid fa-bookmark savedInIcon"></i>';
                div.onclick = function() { removeSingleFromSaveModal(c.id, photoId); };
                savedInList.appendChild(div);
            });
            savedInSection.classList.remove('hidden');
            document.getElementById('saveModalDivider').classList.remove('hidden');
        } else {
            savedInSection.classList.add('hidden');
            document.getElementById('saveModalDivider').classList.add('hidden');
        }

        let available = allCollections.filter(function(c) {
            return !savedIds.includes(parseInt(c.id));
        });
        document.getElementById('addToLabel').textContent =
            savedIn.length > 0 ? 'Add to another Collection' : 'Add to Collection';
        document.getElementById('saveModalCollectionSearch').value = '';
        renderSaveModalResults('', available);

        document.getElementById('saveModal').classList.remove('hidden');
    });
}

function closeSaveModal() {
    document.getElementById('saveModal').classList.add('hidden');
}

function renderSaveModalResults(query, available) {
    let container = document.getElementById('saveModalResults');
    container.innerHTML = '';

    if (available === undefined) {
        let savedNames = Array.from(document.querySelectorAll('#savedInList .savedInOption span')).map(function(el) {
            return el.textContent;
        });
        available = allCollections.filter(function(c) { return !savedNames.includes(c.name); });
    }

    let filtered = available.filter(function(c) {
        return c.name.toLowerCase().includes(query.toLowerCase());
    });

    filtered.forEach(function(collection) {
        let div = document.createElement('div');
        div.className = 'collectionOption';
        div.textContent = collection.name;
        div.onclick = function() { addToCollectionFromSaveModal(collection.id); };
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
            createBtn.onclick = function() { createAndAddFromSaveModal(query); };
            container.appendChild(createBtn);
        }
    }
}

function addToCollectionFromSaveModal(collectionId) {
    fetch('../php/addToCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + currentPhotoIdForCollection + '&collection_id=' + collectionId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        _setBookmarkIcons(currentPhotoIdForCollection);
        openSaveModal(currentPhotoIdForCollection);
    });
}

function createAndAddFromSaveModal(name) {
    fetch('../php/createCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'name=' + encodeURIComponent(name) + '&description='
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status === 'success') addToCollectionFromSaveModal(data.collection_id);
    });
}

function removeSingleFromSaveModal(collectionId, photoId) {
    fetch('../php/removeFromCollection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + photoId + '&collection_id=' + collectionId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        fetch('../php/getPhotoCollection.php?photo_id=' + photoId)
            .then(function(r) { return r.json(); })
            .then(function(remaining) {
                if (remaining.length === 0) {
                    _resetBookmarkIcons(photoId);
                    closeSaveModal();
                } else {
                    openSaveModal(photoId);
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
        _resetBookmarkIcons(currentRemovePhotoId);
        closeSaveModal();
    });
}

function openRemoveCollectionModal(photoId) {
    openSaveModal(photoId || currentPhotoIdForCollection);
}

function closeRemoveCollectionModal() {
    closeSaveModal();
}


// ─── DOM CONTENT LOADED ───────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {

    let collectionSearchInput = document.getElementById('collectionSearch');
    if (collectionSearchInput) {
        collectionSearchInput.addEventListener('input', function() {
            renderCollectionResults(this.value);
        });
    }

    let saveModalSearch = document.getElementById('saveModalCollectionSearch');
    if (saveModalSearch) {
        saveModalSearch.addEventListener('input', function() {
            renderSaveModalResults(this.value);
        });
    }

});