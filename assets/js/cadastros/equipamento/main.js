$(function() {
   $(document).ready(function(){

      if( $('#grid-lista').length > 0 ) {
         TABLE.init({
            url: 'cadastro/equipamento',
            uniqueId: 'equ_id',
            columns: [
               {
                  checkbox:true
               },
               {
                  title: 'ID',
                  field: 'equ_id',
                  sortable: true,
               },
               {
                  title: 'Número série',
                  field: 'equ_numero_serie',
                  sortable: true,
               },
               {
                  title: 'Produto',
                  field: 'pro_descricao',
                  sortable: true,
               },
               {
                  title: 'Numero chip',
                  field: 'equ_numero_chip',
                  sortable: true,
               },
               {
                  title: 'Rastreado',
                  field: 'ras_descricao',
                  sortable: true,
               }
            ]
         });
      } 
      else {

         var promises = [];
         promises.push(
            new Promise(function(resolve, reject) {
               REQUESTER.enviar(REQUESTER.gerarUrl('Requests/get_produtos'),"", {
                  type: 'GET',
                  processData: true,
                  contentType: "application/x-www-form-urlencoded",
                  dataType: 'json',
                  success: function(data) {
                     if( data.status ) {
                        for(i in data.dados) {
                           $('#equ_id_produto').append("<option value='"+data.dados[i].pro_id+"'>"+data.dados[i].pro_descricao+"</option>");
                        }
                        resolve();
                     } else {
                        REQUESTER.izitoast({
                           type: 'error',
                           title: 'Erro',
                           message: data.msg
                        });
                        reject();
                     }
                  }
               });
            })
         ); 

         promises.push(
            new Promise(function(resolve, reject){
               REQUESTER.enviar(REQUESTER.gerarUrl('Requests/get_rastreados'),"", {
                  type: 'GET',
                  processData: true,
                  contentType: "application/x-www-form-urlencoded",
                  dataType: 'json',
                  success: function(data) {
                     if( data.status ) {
                        for(i in data.dados) {
                           $('#ras_id').append("<option value='"+data.dados[i].ras_id+"'>"+data.dados[i].ras_descricao+"</option>");
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
               REQUESTER.enviar(REQUESTER.gerarUrl('cadastro/equipamento/getEquipamento/'+id),"", {
                  type: 'GET',
                  processData: true,
                  contentType: "application/x-www-form-urlencoded",
                  dataType: 'json',
                  success: function(data) {
                     if( data.status ) {
                        if(data.dados[0].hasOwnProperty('ras_id') && parseInt(data.dados[0].ras_id) > 0 ){
                           $('#ras_id').append("<option value='"+data.dados[0].ras_id+"'>"+data.dados[0].ras_descricao+"</option>");
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