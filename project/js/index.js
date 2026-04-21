let heroSection = document.getElementById('heroSection');
let zoomOverlay = document.getElementById('zoomOverlay');
let title = document.getElementById('title');

heroSection.addEventListener('click', function() {
    title.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    title.style.transform = 'scale(8)';
    title.style.opacity = '0';

    zoomOverlay.classList.add('active');

    setTimeout(function() {
        window.location.href = 'gallery.php';
    }, 700);
});