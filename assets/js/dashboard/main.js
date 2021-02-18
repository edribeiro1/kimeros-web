$(document).ready(function () {

   MAPA_GOOGLE.criaMapa('mapa');
   var markers = [];

   REQUESTER.enviar(REQUESTER.gerarUrl('dashboard/get_markers'),"", {
      type: 'GET',
      processData: true,
      contentType: "application/x-www-form-urlencoded",
      dataType: 'json',
      success: function(data) {
         markers = data.dados;

         for(i in data.dados) {
            MAPA_GOOGLE.criaMarkers([{
               position: {
                  lat: parseFloat(data.dados[i].lat),
                  lng: parseFloat(data.dados[i].lng)
               },
               icon: MAPA_GOOGLE.getIcon(data.dados[i].ult_eve_ignicao, data.dados[i].ras_tipo)
            }])

            // MAPA.criaMarkers([
            //    {
            //       lat: data.dados[i].lat,
            //       lng: data.dados[i].lng,
            //       options: {
            //          icon: L.AwesomeMarkers.icon({
            //             icon: MAPA.getTipoIcone(data.dados[i].ras_tipo),
            //             hideSpan: true,
            //             prefix: 'fa',
            //             markerColor: parseFloat(data.dados[i].ult_eve_velocidade) > 1 ? 'cadetblue' : 'red'
            //          }),
            //          id_rastreado: data.dados[i].ult_eve_id_rastreado
            //       },
            //       popup: {
            //          content: "",
            //          options: {
            //                maxWidth: 300,
            //                minWidth: 300
            //          }
            //       },
            //       fn: {
            //          evento: 'popupopen',
            //          acao: function(cbPopup) {
            //             for(i in markers) {
            //                if (markers[i].ult_eve_id_rastreado == cbPopup.target.options.id_rastreado ) {
            //                   templatePopup(markers[i], cbPopup);
            //                   break;
            //                }
            //             }
            //          }
            //       }
            //    }
            // ]);
         }

         MAPA_GOOGLE.zoomMarkers();
         MAPA_GOOGLE._map.setZoom(18);
       
      }
   });

   REQUESTER.enviar(REQUESTER.gerarUrl('dashboard/get_resumo_consolidados'),"", {
      type: 'GET',
      processData: true,
      contentType: "application/x-www-form-urlencoded",
      dataType: 'json',
      success: function(data) {
         if( data.status ) {
           for(i in data.dados) {
              $('.valor-resumo[data-id='+i+']',).html(data.dados[i]);
           }
           $('.div-loading').fadeOut('slow');
         } else {
            REQUESTER.izitoast({
               type: 'error',
               title: 'Erro',
               message: data.msg
            })
         }
      }
   });

   $(document).on('click', '.card-resumo', function() {
      window.location.href = REQUESTER.gerarUrl($(this).attr('data-url'));
   });

   $('#table-rastreados').bootstrapTable({
      url: REQUESTER.gerarUrl('instalacao/get'),
      locale: 'pt-BR',
      pagination: true,
      sidePagination: 'server',
      pageSize: 10,
      sortable: false,
      search: false,
      pageList: [],
      columns: [
         {
            title: 'Descricao',
            field: 'ras_descricao',
            valign: 'middle',
            sortable: true,
         },
         {
            title: 'Numero série',
            field: 'equ_numero_serie',
            valign: 'middle',
            sortable: true,
         },
         {
            title: 'Última comunicação',
            field: 'ult_eve_data_gps',
            valign: 'middle',
            sortable: false,
         }
      ],
      rowStyle: function rowStyle(row, index) {
         return (row.ale_lido == '0' ? { classes: 'table-active', css: { 'font-weight': 'bold' } } : {});
      },
      responseHandler: function (dados) {
         return {
            rows: dados.dados,
            total: dados.total
         }
      }
   });
});



function templatePopup(dados, popup) {
   console.log(dados);

   let html = "<div class='row'>\
                  <div class='col-12'>\
                     <div class='icone-popup'>\
                        <i class='fas fa-"+MAPA.getTipoIcone(dados.ras_tipo)+" fa-2x'></i>\
                     </div>\
                  </div>\
               </div>";
   popup.popup.setContent(html);
}