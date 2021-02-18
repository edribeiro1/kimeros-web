var MAPA_GOOGLE = {
   _map: {},
   _markers: [],
   _objLayers: {},
   _polyline: {},
   criaMapa: function(idElemento, options) {
      self = this;
      MAPA_GOOGLE._map = new google.maps.Map(document.getElementById(idElemento), $.extend({
         zoom: 4,
         center: {lat: -22.49745, lng: -49.49745},
         mapTypeId: 'satellite'
         // maxZoom: 18
      }, options));
   },
   criaMarkers: function( arrayMarkersLatLng ) {
      if( $.isArray(arrayMarkersLatLng) ) {
         for(i in arrayMarkersLatLng) {
            let marker = arrayMarkersLatLng[i];
            let opts = $.type(marker.options) == 'object' ? marker.options : {};
            MAPA_GOOGLE._markers.push(new google.maps.Marker({
               position: marker.position,
               map: MAPA_GOOGLE._map,
               icon: marker.icon,
               id: (marker.id ? marker.id : 0)
             }));
         }
      }
   },
   zoomMarkers: function() {
      if(MAPA_GOOGLE._markers.length > 0) {
         let bounds = new google.maps.LatLngBounds();
         for( i in MAPA_GOOGLE._markers) {
            bounds.extend( MAPA_GOOGLE._markers[i].getPosition() );
         }
         MAPA_GOOGLE._map.fitBounds(bounds);
      }
   },
   zoomMarker: function(cordinate) {
      let bounds = new google.maps.LatLngBounds();
      bounds.extend( cordinate );
      MAPA_GOOGLE._map.fitBounds(bounds);
   },
   setView: function(lat, lng, zoom) {
      
   },
   criaPolyline: function(arrayCoordinates) {
      MAPA_GOOGLE._polyline = new google.maps.Polyline({
         path: arrayCoordinates,
         geodesic: true,
         strokeColor: '#00b3fd',
         strokeOpacity: 1.0,
         strokeWeight: 3
       });

       MAPA_GOOGLE._polyline.setMap(MAPA_GOOGLE._map);
   },
   limparMarkers: function() {
      for(i in MAPA_GOOGLE._markers) {
         MAPA_GOOGLE._markers[i].setMap(null);
      }
      MAPA_GOOGLE._markers = [];
   },
   limparPolyline: function() {
      if( ! $.isEmptyObject(MAPA_GOOGLE._polyline)) {
         MAPA_GOOGLE._polyline.setMap(null);   
      }
   },
   limparMapa: function() {
      MAPA_GOOGLE.limparMarkers();
      MAPA_GOOGLE.limparPolyline();
   },
   bounceMarker: function(id) {
      for(i in MAPA_GOOGLE._markers) {
         if(MAPA_GOOGLE._markers[i].id == id) {
            MAPA_GOOGLE._markers[i].setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ 
               for(j in MAPA_GOOGLE._markers) {
                  if(MAPA_GOOGLE._markers[j].id == id) {
                     MAPA_GOOGLE._markers[j].setAnimation(null); 
                     break;
                  }
               }
            }, 3000);
            break;
         }
      }
   },
   getIcon: function( ignicao, tipo ) {
      let prefix = parseInt(ignicao) == 1 ? REQUESTER.gerarUrl('images/markers/on_') : REQUESTER.gerarUrl('images/markers/off_');
      let urlImg = "";
      switch (tipo) {
         case 'Bicicleta': urlImg = prefix + 'bike.png'; break;
         case 'Moto': urlImg = prefix + 'motorcycle.png'; break;
         case 'Carro': urlImg = prefix + 'car.png'; break;
         case 'Caminhão': urlImg = prefix + 'truck.png'; break;
         case 'Pessoa': urlImg = prefix + 'person.png'; break;
         default: urlImg = prefix + 'car.png'; break;
      }

      return {
         url: urlImg,
         scaledSize: new google.maps.Size(36, 56), // size
         // origin: new google.maps.Point(0,0), // origin
         // anchor: new google.maps.Point(0, 0) // anchor 
      };
   }
}
 