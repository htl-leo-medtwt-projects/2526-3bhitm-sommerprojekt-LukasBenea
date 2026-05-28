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
             var radius = count > 0 ? 5 + (count * 0.3) : 5;
            var color = count > 0 ? '#c9a84c' : '#444';
            var fillOpacity = count > 0 ? 0.8 : 0.3;

            var circle = L.circleMarker([city.latitude, city.longitude], {
                radius: radius,
                fillColor: color,
                color: color,
                weight: 1,
                fillOpacity: fillOpacity
            }).addTo(map);

            circle.bindPopup(
                '<div style="font-family: comfortaa; color: #f0f0f0; background: #1a1a1a; padding: 10px; border-radius: 8px;">' +
                '<b style="letter-spacing: 2px;">' + city.name + '</b><br>' +
                '<span style="color: #c9a84c; font-size: 12px;">' + count + ' visit' + (count !== 1 ? 's' : '') + '</span>' +
                '</div>'
            );
        });

    });
    