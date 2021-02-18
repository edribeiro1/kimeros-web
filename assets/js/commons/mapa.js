var MAPA = {
   _map: {},
   _markers: [],
   _objLayers: {},
   criaMapa: function(idElemento) {
      self = this;

      self._map = L.map(idElemento).setView([-22.49745, -49.49745], 3);

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
         subdomains: ['a', 'b', 'c']
      }).addTo(self._map);
      
      var googleLayer = new L.Google('ROADMAP');
      self._map.addLayer(googleLayer);

   },
   criaMarkers: function( arrayMarkersLatLng ) {
      if( $.isArray(arrayMarkersLatLng) ) {
         for(i in arrayMarkersLatLng) {
            let marker = arrayMarkersLatLng[i];
            let opts = $.type(marker.options) == 'object' ? marker.options : {};
            let leafletMarker = L.marker([arrayMarkersLatLng[i].lat, arrayMarkersLatLng[i].lng], opts);

            if( marker.hasOwnProperty('fn') ) {
               if( $.isArray(marker.fn) ) {
                  for(j in marker.fn) {
                     leafletMarker.on(marker.fn[j].evento, marker.fn[j].acao);
                  }
               } else {
                  leafletMarker.on(marker.fn.evento, marker.fn.acao);
               }
            }

            if( marker.hasOwnProperty('popup') ) {
               leafletMarker.bindPopup(marker.popup.content, marker.popup.options);
            }

            this._markers.push(leafletMarker);
            leafletMarker.addTo(this._map);
         }
      }

   },
   zoomMarkers: function() {
      if(this._markers.length > 0) {
         let group = new L.featureGroup(this._markers);
         this._map.fitBounds(group.getBounds());
      }
   },
   setView: function(lat, lng, zoom) {
      if($.isNumeric(zoom)){
         this._map.setView(new L.LatLng(lat, lng), zoom);
      }
   },
   limparMarkers: function() {
      for(i in this._markers){
         this._map.removeLayer(this._markers[i]);
     }
     this._markers = [];
   },
   getTipoIcone: function( tipo ) {
      switch (tipo) {
         case 'Bicicleta': return 'bicycle'; break;
         case 'Moto': return 'motorcycle'; break;
         case 'Carro': return 'car'; break;
         case 'Caminhão': return 'truck'; break;
         case 'Pessoa': return 'user'; break;
         default: return 'car'; break;
      }
   }
}
 