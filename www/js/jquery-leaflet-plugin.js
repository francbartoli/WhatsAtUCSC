(function() {
  var demo;
  demo = {};
  demo.resizeContentArea = function() {
    var content, contentHeight, footer, header, viewportHeight;
    window.scroll(0, 0);
    header = $(":jqmData(role='header'):visible");
    footer = $(":jqmData(role='footer'):visible");
    content = $(":jqmData(role='content'):visible");
    viewportHeight = $(window).height();
    contentHeight = viewportHeight - header.outerHeight() - footer.outerHeight();
    $("page:jqmData(role='content')").first().height(contentHeight);
    return $("#map").height(contentHeight);
  };
  window.demo = demo;
  $(window).bind('orientationchange pageshow resize', window.demo.resizeContentArea);
  $(document).bind('pageinit', function() {
    var attribution, map, tileLayer, tileUrl;
    tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    attribution = 'Map data © OpenStreetMap contributors';
    tileLayer = new window.L.TileLayer(tileUrl, {
      maxZoom: 18,
      attribution: attribution
    });
    map = new window.L.Map('map');
    map.addLayer(tileLayer);
    /*
    map.on('locationerror', function(e) {
      alert(e.message);
      return map.fitWorld();
    });
    return map.locateAndSetView(16);
    */
    return map.setView(new L.LatLng(36.996, -122.061), 16);
  });
}).call(this);