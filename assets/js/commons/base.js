$(document).ready(function () {
   $('.menu-link').bigSlide();
 
   $(document).on('click touchstart','.menu-link', function() {
      if( $('.menu-link').hasClass('active') ) {
         $('body').addClass('disable-overflow');
      } else {
         $('body').removeClass('disable-overflow');
      }
   });

   REQUESTER.enviar(REQUESTER.gerarUrl('alerta/contar_qtde_alerta'),"", {
      type: 'GET',
      processData: true,
      contentType: "application/x-www-form-urlencoded",
      dataType: 'json',
      success: function(data) {
         if( data.status ) {
            if(parseInt(data.dados.total) > 0 ) {
               $(".badge-alerta").text(data.dados.total);
               $(".badge-alerta").show();
            }
         } else {
            REQUESTER.izitoast({
               type: 'error',
               title: 'Erro',
               message: data.msg
            })
         }
      }
   });

    var iziModal = $('#modal_alertas').iziModal({
      title:'Alertas',
      headerColor: '#2c3e50',
      // iconColor: '#2c3e50',
      top: 100,
      icon: 'far fa-bell',
      overlayClose: false,
      focusInput: false,
      width: '70%',
      overlayColor: 'rgba(0, 0, 0, 0.6)',
      transitionIn: 'bounceInDown',
      transitionOut: 'bounceOutDown',
      navigateCaption: true,
      navigateArrows: 'closeScreenEdge',
      onOpening: function() {
         iziModal.iziModal('startLoading');

         $('#table-alertas').bootstrapTable({
            url: REQUESTER.gerarUrl('alerta/get_alerta'),
            locale: 'pt-BR',
            pagination: true,
            sidePagination: 'server',
            pageSize: 10,
            sortable: true,
            onCheck: function() {
               controlaBotoesAlertas();
            },
            onUncheck: function() {
               controlaBotoesAlertas();
            },
            onCheckAll: function() {
               controlaBotoesAlertas();
            },
            onUncheckAll: function() {
               controlaBotoesAlertas();
            },
            onSort: function() {
               controlaBotoesAlertas();
               $('#table-alertas').bootstrapTable('showLoading');
            },
            onLoadSuccess: function(){
               controlaBotoesAlertas();
               $('#table-alertas').bootstrapTable('hideLoading');
            },
            search: true,
            pageList: [],
            columns: [
               {
                  checkbox:true,
               },
               {
                  title: 'Descricao',
                  field: 'ale_tip_descricao',
                  valign: 'middle',
                  sortable: true
               },
               {
                  title: 'Rastreado',
                  field: 'ras_descricao',
                  valign: 'middle',
                  sortable: true
               },
               {
                  title: 'Data',
                  field: 'ale_data',
                  valign: 'middle',
                  sortable: true 
               },
               {
                  title: 'Ações',
                  field: 'acoes',
                  valign: 'middle',
               }
            ],
            rowStyle: function rowStyle(row, index) {
               return (row.ale_lido == '0' ? {classes: 'table-active', css: {'font-weight': 'bold'}} : {});
            },
            responseHandler: function(dados){
               for(i in dados.dados) {
                  dados.dados[i].ale_data = dataHoraBR(dados.dados[i].ale_data);

                  if(dados.dados[i].ale_lido == 0) {
                     dados.dados[i].acoes = '<button id="marcar-lido" class="btn btn-info btn-acoes" title="Marcar como lida" data-id-alerta="'+dados.dados[i].ale_id+'"><i class="far fa-envelope-open"></i></button>';
                  } else {
                     dados.dados[i].acoes = '<button id="marcar-nao-lido" class="btn btn-secondary btn-acoes" title="Marcar não lida" data-id-alerta="'+dados.dados[i].ale_id+'"><i class="far fa-envelope"></i></button>';
                  }

                  dados.dados[i].acoes += ' <button id="excluir-alerta" class="btn btn-danger btn-acoes" title="Deletar alerta" data-id-alerta="'+dados.dados[i].ale_id+'"><i class="fas fa-trash-alt"></i></button>'
               }

               return {
                  rows: dados.dados,
                  total: dados.total
               }
            }
         });

      },
      onOpened: function(){
         iziModal.iziModal('stopLoading');
      },
      onClosed: function() {
         controlaBotoesAlertas();
         REQUESTER.enviar(REQUESTER.gerarUrl('alerta/contar_qtde_alerta'),"", {
            type: 'GET',
            processData: true,
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            success: function(data) {
               if( data.status ) {
                  if(parseInt(data.dados.total) > 0 ) {
                     $(".badge-alerta").text(data.dados.total);
                     $(".badge-alerta").show();
                  } else {
                     $(".badge-alerta").text(0);
                     $(".badge-alerta").hide();
                  }
               } else {
                  REQUESTER.izitoast({
                     type: 'error',
                     title: 'Erro',
                     message: data.msg
                  })
               }
            }
         });
      }
   });

   $('#alerta').on('click', function(){
      iziModal.iziModal('open');
   });

   
   $(document).on('click', '#marcar-nao-lido, #marcar-lido, #marcar-todos-lido, #marcar-todos-nao-lido', function(){
      $('#table-alertas').bootstrapTable('showLoading');
      let ids = [];
      let lido = 0;

      if($(this).attr('id') == 'marcar-todos-lido') {
         let dadosTabela = $('#table-alertas').bootstrapTable('getAllSelections');
         for(i in dadosTabela) {
            ids.push(dadosTabela[i].ale_id);
         }
         lido = 1;
      } else if($(this).attr('id') == 'marcar-todos-nao-lido') {
         let dadosTabela = $('#table-alertas').bootstrapTable('getAllSelections');
         for(i in dadosTabela) {
            ids.push(dadosTabela[i].ale_id);
         }
         lido = 0;
      } else if($(this).attr('id') == 'marcar-lido') {
         ids = [$(this).attr('data-id-alerta')];
         lido = 1;
      } else if($(this).attr('id') == 'marcar-nao-lido') {
         ids = [$(this).attr('data-id-alerta')];
         lido = 0;
      }

      let update = {
         'ids': ids,
         'lido': lido
      }

      REQUESTER.enviar(REQUESTER.gerarUrl('alerta/trata_alerta'), update, {
         type: 'PUT',
         processData: true,
         contentType: "application/x-www-form-urlencoded",
         dataType: 'json',
         success: function(data) {
            if( data.status ) {
               $('#table-alertas').bootstrapTable('refresh');
            } else {
               REQUESTER.izitoast({
                  type: 'error',
                  title: 'Erro',
                  message: data.msg
               })
            }
         }
      });
   });

   $(document).on('click', '#excluir-alerta, #excluir-todos-alerta', function(){
      $('#table-alertas').bootstrapTable('showLoading');
      let ids = [];
      if($(this).attr('id') == 'excluir-todos-alerta') {
         let dadosTabela = $('#table-alertas').bootstrapTable('getAllSelections');
         for(i in dadosTabela) {
            ids.push(dadosTabela[i].ale_id);
         }
      } else if ($(this).attr('id') == 'excluir-alerta') {
         ids = $(this).attr('data-id-alerta');
      }

      REQUESTER.enviar(REQUESTER.gerarUrl('alerta/deletar_alerta'), {'ids': ids}, {
         type: 'DELETE',
         processData: true,
         contentType: "application/x-www-form-urlencoded",
         dataType: 'json',
         success: function(data) {
            if( data.status ) {
               $('#table-alertas').bootstrapTable('refresh');
            } else {
               REQUESTER.izitoast({
                  type: 'error',
                  title: 'Erro',
                  message: data.msg
               })
            }
         }
      });
   });

    $('#logout').click(function(e){
        e.stopPropagation()
    });
});

function controlaBotoesAlertas() {
   let qtdeSelecionados = $('#table-alertas').bootstrapTable('getAllSelections').length;
   if(parseInt(qtdeSelecionados) > 0) {
      $('#marcar-todos-lido').fadeIn('slow');
      $('#marcar-todos-nao-lido').fadeIn('slow');
      $('#excluir-todos-alerta').fadeIn('slow');
   } else {
      $('#marcar-todos-lido').fadeOut('slow');
      $('#marcar-todos-nao-lido').fadeOut('slow');
      $('#excluir-todos-alerta').fadeOut('slow');
   }
}

function dataHoraBR(dataEN) {
   return dataEN.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
}