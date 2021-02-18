$(function() {
   $(document).ready(function(){

      if( $('#grid-lista').length > 0 ) {
         TABLE.init({
            url: 'cadastro/rastreado',
            uniqueId: 'ras_id',
            columns: [
               {
                  checkbox:true
               },
               {
                  title: 'ID',
                  field: 'ras_id',
                  sortable: true,
               },
               {
                  title: 'Descrição',
                  field: 'ras_descricao',
                  sortable: true,
               },
               {
                  title: 'Identificação',
                  field: 'ras_identificacao',
                  sortable: true,
               },
               {
                  title: 'Tipo',
                  field: 'ras_tipo',
                  sortable: true,
               },
               {
                  title: 'Equipamento',
                  field: 'equ_numero_serie',
                  sortable: true,
               },
            ],
            responseHandler: function(dados) {
               for(i in dados.dados) {
                  dados.dados[i].equ_numero_serie = (dados.dados[i].equ_numero_serie ? dados.dados[i].equ_numero_serie : '-') +(dados.dados[i].pro_fabricante ? ' - ' + dados.dados[i].pro_fabricante : '') + (dados.dados[i].pro_descricao ? ' - ' + dados.dados[i].pro_descricao : '');
               }
               return {
                  rows: dados.dados,
                  total: dados.total
               }
            }
         });
      } 
      else {

         var promises = [];
         promises.push(
            new Promise(function(resolve, reject) {
               REQUESTER.enviar(REQUESTER.gerarUrl('Requests/get_equipamentos'),"", {
                  type: 'GET',
                  processData: true,
                  contentType: "application/x-www-form-urlencoded",
                  dataType: 'json',
                  success: function(data) {
                     if( data.status ) {
                        for(i in data.dados) {
                           $('#equ_id').append(
                              "<option value='"+data.dados[i].equ_id+"'>"
                                 + data.dados[i].equ_numero_serie + ' - ' + data.dados[i].pro_fabricante + ' - ' + data.dados[i].pro_descricao +
                              "</option>");
                        }
                        resolve();
                     } else {
                        REQUESTER.izitoast({
                           type: 'warning',
                           title: 'Atenção',
                           message: data.msg
                        });
                        reject();
                     }
                  }
               });
            })
         );

         Promise.all(promises).then(function(cb) {
            let id = parseInt($('#config-form').attr('data-id'));
            if(id > 0) {
               REQUESTER.enviar(REQUESTER.gerarUrl('cadastro/rastreado/getRastreado/'+id),"", {
                  type: 'GET',
                  processData: true,
                  contentType: "application/x-www-form-urlencoded",
                  dataType: 'json',
                  success: function(data) {
                     if( data.status ) {
                        if(data.dados[0].hasOwnProperty('equ_id') && parseInt(data.dados[0].ras_id) > 0 ){
                           $('#equ_id').append(
                              "<option value='"+data.dados[0].equ_id+"'>"
                                 + data.dados[0].equ_numero_serie + ' - ' + data.dados[0].pro_fabricante + ' - ' + data.dados[0].pro_descricao +
                              "</option>");
                        }
                        preencheDadosFormulario(data.dados[0]);
                     } else {
                        REQUESTER.izitoast({
                           type: 'warning',
                           title: 'Atenção',
                           message: data.msg
                        });
                     }
                  }
               });
            }
            
         });
      }
   });
});