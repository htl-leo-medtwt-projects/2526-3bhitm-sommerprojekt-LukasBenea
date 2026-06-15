// ─── LIKE ─────────────────────────────────────────────────────────────────────

function toggleLike(event, photoId, btn) {
    event.stopPropagation();
    if (!requireLogin()) return;
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
    if (!requireLogin()) return;
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
    if (!requireLogin()) return;
    fetch('../php/like.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'photo_id=' + photoId
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if (data.status === 'unliked') {
            if (typeof likedPhotosData !== 'undefined') {
                let idx = likedPhotosData.findIndex(p => p.id == photoId);
                if (idx !== -1) likedPhotosData.splice(idx, 1);
            }
            if (typeof likedPhotos !== 'undefined') likedPhotos = likedPhotos.filter(id => id != photoId);
            document.querySelectorAll('.photoCard[data-photo-id="' + photoId + '"], .collectionPhotoCard[data-photo-id="' + photoId + '"]').forEach(function(card) {
                card.remove();
            });
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
    if (!requireLogin()) return;
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
    if (!requireLogin()) return;
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
        if (data.status === 'error') return;
        _setBookmarkIcons(currentPhotoIdForCollection);
        closeCollectionModal();
        showToast('Added to collection');
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
        if (data.status === 'error') return;
        _setBookmarkIcons(currentPhotoIdForCollection);
        openSaveModal(currentPhotoIdForCollection);
        showToast('Added to collection');
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
        showToast('Removed from collections');
    });
}

function openRemoveCollectionModal(photoId) {
    openSaveModal(photoId || currentPhotoIdForCollection);
}

function closeRemoveCollectionModal() {
    closeSaveModal();
}


function requireLogin() {
    if (typeof isLoggedIn !== 'undefined' && isLoggedIn === false) {
        showLoginModal();
        return false;
    }
    return true;
}

function ensureLoginModal() {
    if (document.getElementById('loginRequiredModal')) return;

    let style = document.createElement('style');
    style.id = 'loginRequiredStyles';
    style.textContent = `
        #loginRequiredModal {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #loginRequiredModal.hidden { display: none; }
        #loginRequiredOverlay {
            position: absolute;
            width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.9);
        }
        #loginRequiredBox {
            position: relative;
            background-color: #1a1a1a;
            border: 1px solid #333;
            border-radius: 20px;
            width: 380px;
            max-width: 90vw;
            padding: 45px 40px 40px 40px;
            text-align: center;
            z-index: 1001;
        }
        #loginRequiredClose {
            position: absolute;
            top: 15px; right: 20px;
            cursor: pointer;
            color: #888;
            font-size: 18px;
            transition: color 0.2s;
        }
        #loginRequiredClose:hover { color: #c9a84c; }
        #loginRequiredIcon {
            font-size: 34px;
            color: #c9a84c;
            margin-bottom: 18px;
        }
        #loginRequiredTitle {
            font-size: 18px;
            color: #f0f0f0;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 14px;
        }
        #loginRequiredText {
            font-size: 13px;
            color: #888;
            line-height: 1.7;
            letter-spacing: 0.5px;
            margin-bottom: 28px;
        }
        #loginRequiredBtns {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        #loginRequiredLoginBtn, #loginRequiredRegisterBtn {
            padding: 13px;
            border-radius: 30px;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            cursor: pointer;
            transition: background-color 0.2s, color 0.2s, opacity 0.2s;
            font-family: comfortaa;
        }
        #loginRequiredLoginBtn {
            background-color: #c9a84c;
            color: #0a0a0a;
            border: 1px solid #c9a84c;
        }
        #loginRequiredLoginBtn:hover { opacity: 0.85; }
        #loginRequiredRegisterBtn {
            background-color: transparent;
            color: #c9a84c;
            border: 1px solid #c9a84c;
        }
        #loginRequiredRegisterBtn:hover {
            background-color: #c9a84c;
            color: #0a0a0a;
        }
    `;
    document.head.appendChild(style);

    let modal = document.createElement('div');
    modal.id = 'loginRequiredModal';
    modal.className = 'hidden';
    modal.innerHTML = `
        <div id="loginRequiredOverlay" onclick="closeLoginModal()"></div>
        <div id="loginRequiredBox">
            <span id="loginRequiredClose" onclick="closeLoginModal()">✕</span>
            <i id="loginRequiredIcon" class="fa-solid fa-lock"></i>
            <h2 id="loginRequiredTitle">Anmeldung erforderlich</h2>
            <p id="loginRequiredText">Diese Funktion ist nur für angemeldete Benutzer verfügbar.</p>
            <div id="loginRequiredBtns">
                <div id="loginRequiredLoginBtn" onclick="window.location.href='registration.php'">Anmelden</div>
                <div id="loginRequiredRegisterBtn" onclick="window.location.href='registration.php?mode=register'">Registrieren</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showLoginModal() {
    ensureLoginModal();
    document.getElementById('loginRequiredModal').classList.remove('hidden');
}

function closeLoginModal() {
    let modal = document.getElementById('loginRequiredModal');
    if (modal) modal.classList.add('hidden');
}


function ensureCommonUI() {
    if (document.getElementById('commonUIStyles')) return;

    let style = document.createElement('style');
    style.id = 'commonUIStyles';
    style.textContent = `
        #toastContainer {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-end;
            pointer-events: none;
        }
        .toast {
            background-color: #1a1a1a;
            border: 1px solid #333;
            border-left: 3px solid #c9a84c;
            color: #f0f0f0;
            padding: 14px 20px;
            border-radius: 10px;
            font-family: comfortaa;
            font-size: 13px;
            letter-spacing: 0.5px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s, transform 0.3s;
            max-width: 300px;
        }
        .toast.show { opacity: 1; transform: translateY(0); }
        .toast.error { border-left-color: #e74c3c; }
        .photoNavBtn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            background-color: rgba(0,0,0,0.6);
            border: 1px solid #333;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 205;
            color: #f0f0f0;
            transition: background-color 0.2s, color 0.2s, transform 0.2s;
        }
        .photoNavBtn:hover { background-color: #c9a84c; color: #0a0a0a; transform: translateY(-50%) scale(1.08); }
        .photoNavPrev { left: 15px; }
        .photoNavNext { right: 15px; }
        .photoNavBtn.hidden { display: none; }
        @media (max-width: 600px) {
            .photoNavBtn { width: 36px; height: 36px; }
            .photoNavPrev { left: 8px; }
            .photoNavNext { right: 8px; }
            #toastContainer { left: 15px; right: 15px; bottom: 15px; align-items: stretch; }
            .toast { max-width: none; }
        }
    `;
    document.head.appendChild(style);

    let container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
}

function showToast(message, type) {
    ensureCommonUI();
    let container = document.getElementById('toastContainer');
    let toast = document.createElement('div');
    toast.className = 'toast' + (type === 'error' ? ' error' : '');
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('show'); });
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 300);
    }, 2600);
}

function closeAllModalsOnEscape(e) {
    if (e.key !== 'Escape') return;
    let ids = ['loginRequiredModal', 'galleryPhotoModal', 'uploadModal', 'collectionModal', 'saveModal', 'photoDetailModal', 'collectionOverlayModal', 'sectionOverlay', 'deleteModal', 'deletePhotoModal', 'editCollectionModal', 'editProfileModal', 'modal'];
    ids.forEach(function(id) {
        let el = document.getElementById(id);
        if (el && !el.classList.contains('hidden')) el.classList.add('hidden');
    });
}


// ─── DOM CONTENT LOADED ───────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {

    ensureCommonUI();
    document.addEventListener('keydown', closeAllModalsOnEscape);

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