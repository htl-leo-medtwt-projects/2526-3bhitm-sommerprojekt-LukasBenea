fetch('../php/getCityVisits.php')
    .then(function(response) { return response.json(); })
    .then(function(cities) {

        var map = L.map('map', {
            center: [20, 0],
            zoom: 2,
            zoomControl: true,
            scrollWheelZoom: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO'
        }).addTo(map);

        cities.forEach(function(city) {
            if (!city.latitude || !city.longitude) return;

            var count = parseInt(city.visit_count);
            var visited = count > 0;
            var size = visited ? Math.min(16 + count * 2, 34) : 12;
            var cls = visited ? 'mapMarker mapMarkerActive' : 'mapMarker';

            var icon = L.divIcon({
                className: 'mapMarkerWrap',
                html: '<div class="' + cls + '" style="width:' + size + 'px;height:' + size + 'px;"><span class="mapMarkerDot"></span></div>',
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2]
            });

            var marker = L.marker([city.latitude, city.longitude], {
                icon: icon,
                keyboard: false,
                riseOnHover: true
            }).addTo(map);

            marker.bindPopup(
                '<div class="mapPopup">' +
                '<p class="mapPopupCity">' + city.name + '</p>' +
                '<p class="mapPopupVisits">' + count + ' visit' + (count !== 1 ? 's' : '') + '</p>' +
                '<a class="mapPopupBtn" href="city.php?id=' + city.id + '">View City</a>' +
                '</div>',
                { autoPan: true, autoPanPadding: [40, 60], closeButton: true }
            );
        });

        map.on('popupopen', function(e) {
            if (e.popup && e.popup._closeButton && e.popup._closeButton.blur) {
                e.popup._closeButton.blur();
            }
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
        });

    });
