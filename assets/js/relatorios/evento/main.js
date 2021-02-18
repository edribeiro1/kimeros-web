$(function() { $(document).ready(function(){
   moment.locale('pt-br');  
   $('.select2', '#base-relatorio').select2({language: 'pt-BR'});

   $('.datetimepicker').bootstrapMaterialDatePicker({
      format: 'DD/MM/YYYY HH:mm:ss',
      lang: 'br',
      cancelText: 'Cancelar'
   });

   $('#data_inicial').bootstrapMaterialDatePicker('setDate',moment().hour(0).minute(0).second(0));
   $('#data_final').bootstrapMaterialDatePicker('setDate',moment().hour(23).minute(59).second(59));

   MAPA_GOOGLE.criaMapa('mapa');

   REQUESTER.enviar(REQUESTER.gerarUrl('Requests/get_rastreados_instalados'),"", {
      type: 'GET',
      processData: true,
      contentType: "application/x-www-form-urlencoded",
      dataType: 'json',
      success: function(data) {
         if( data.status ) {
            $('#ras_id').html('');
            for(i in data.dados) {
               $('#ras_id').append("<option value='"+data.dados[i].ras_id+"'>"+data.dados[i].ras_descricao+"</option>");
            }
         } else {
            REQUESTER.izitoast({
               type: 'warning',
               title: 'Atenção',
               message: data.msg
            });
         }
      }
   });

   $('#relatorio-bootstrap-table').bootstrapTable({
      locale: 'pt-BR',
      sortable: true,
      search: false,
      columns: [
         {
            title: 'ID',
            field: 'eve_id',
            sortable: true,
         },
         {
            title: 'Rastreado',
            field: 'ras_descricao',
            sortable: true,
         },
         {
            title: 'Equipamento',
            field: 'equ_numero_serie',
            sortable: true,
         },
         {
            title: 'Localização',
            field: 'localizacao',
         },
         {
            title: 'Velocidade',
            field: 'eve_velocidade',
            sortable: true,
         },
         {
            title: 'Iginição',
            field: 'eve_ignicao',
            sortable: true,
         },
         {
            title: 'GPS',
            field: 'eve_gps',
            sortable: true,
         },
         {
            title: 'Data(GPS)',
            field: 'eve_data_gps',
            sortable: true,
         },
         {
            title: 'Data comunicação',
            field: 'eve_data_servidor',
            sortable: true,
         },
      ],
      onClickCell: function(field, elm, dados, event){
         if(field == 'localizacao') {
            MAPA_GOOGLE.zoomMarker({lat: parseFloat(dados.lat), lng: parseFloat(dados.lng)})
            MAPA_GOOGLE.bounceMarker(dados.eve_id);
         }
      }
   });

   $(document).on('click', '#btn-gerar-relatorio', function() {
      $('#relatorio-bootstrap-table').bootstrapTable('removeAll');
      MAPA_GOOGLE.limparMapa();
      let ladda = Ladda.create(this);
      ladda.start();

      let idRastreado = $('#ras_id').val();
      if( parseInt(idRastreado) > 0 ) {
         let dados = {
            id_rastreado: idRastreado,
            data_inicial: $('#data_inicial').val(),
            data_final: $('#data_final').val()
         }
         REQUESTER.enviar(REQUESTER.gerarUrl('relatorio/Evento/gerar_relatorio'),dados, {
            type: 'GET',
            processData: true,
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            success: function(data) {
               ladda.stop();
               if( data.status ) {
                  criaMarkers(data.dados);
                  $('#relatorio-bootstrap-table').bootstrapTable('load', formataDadosTabela(data.dados));
               } else {
                  REQUESTER.izitoast({
                     type: 'error',
                     title: 'Erro',
                     message: data.msg
                  });
               }
            }
         });
      }
      else {
         // $('#ras_id').addClass('input-erro');
         REQUESTER.izitoast({
            type: 'warning',
            title: 'Atenção',
            message: 'Selecione um rastreado!'
         });
         ladda.stop();
      }
   });

   
});});

function formataDadosTabela(dados) {
    
    for(i in dados) {
        dados[i].eve_gps = (parseInt(dados[i].eve_gps) == 1 ? '<i class="fas fa-podcast" style="color: green; font-size: 16px;"></i>' : '<i class="fas fa-podcast" style="color: red; font-size: 16px;"></i>');
        dados[i].eve_ignicao = (parseInt(dados[i].eve_ignicao) == 1 ? '<i class="fas fa-key" style="color: green; font-size: 16px;"></i>' : '<i class="fas fa-key" style="color: red; font-size: 16px;"></i>');
        dados[i].eve_velocidade = (dados[i].eve_velocidade ? dados[i].eve_velocidade : 0) + ' km/h';
        dados[i].localizacao = '<a href="#">' + dados[i].lat + ', ' + dados[i].lng + '</a>';
    }
   return dados;
}

function criaMarkers(dados) {

   let markers = [];
   let coordinates = [];

   for(i in dados) {
      coordinates.push({
         lat: parseFloat(dados[i].lat),
         lng: parseFloat(dados[i].lng)
      });

      markers.push({
         position: {
            lat: parseFloat(dados[i].lat),
            lng: parseFloat(dados[i].lng)
         },
         icon: MAPA_GOOGLE.getIcon(dados[i].eve_ignicao, dados[i].ras_tipo),
         id: dados[i].eve_id
      });
   }
   MAPA_GOOGLE.criaMarkers(markers);
   MAPA_GOOGLE.zoomMarkers();
   MAPA_GOOGLE.criaPolyline(coordinates);
}