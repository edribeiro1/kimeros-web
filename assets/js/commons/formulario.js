var arrayLadda = [];
var TABLE = {
   init: function(config) { 
      var idIndex = config.uniqueId;
      $('#lista-bootstrap-table').bootstrapTable({
         url: REQUESTER.gerarUrl(config.url + '/lista'),
         locale: 'pt-BR',
         pagination: true,
         sidePagination: 'server',
         pageSize: 10,
         sortable: true,
         search: true,
         pageList: [],
         clickToSelect: true,
         uniqueId: config.uniqueId,
         onSort: function() {
            $('#lista-bootstrap-table').bootstrapTable('showLoading');
         },
         onLoadSuccess: function() {
            $('#lista-bootstrap-table').bootstrapTable('hideLoading');
            TABLE.controlaStatusBotoes();
         },
         columns: config.columns,
         responseHandler: function (dados) {
            if( $.isFunction(config.responseHandler) ) {
               return config.responseHandler(dados);
            }
            return {
               rows: dados.dados,
               total: dados.total
            }
         }
      });

      $(document).on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table page-change.bs.table', '#lista-bootstrap-table', function() {
         TABLE.controlaStatusBotoes();
      });

      $(document).on('click', '#adicionar', function() {
         startLaddaButtons();
         window.location.href = REQUESTER.gerarUrl(config.url + '/adicionar');
      });

      $(document).on('click', '#editar', function() {
         startLaddaButtons();
         let dados = $("#lista-bootstrap-table").bootstrapTable('getAllSelections');
         if($.isArray(dados) && dados.length == 1 && dados[0].hasOwnProperty(config.uniqueId)) {
            let id = dados[0][config.uniqueId];
            window.location.href = REQUESTER.gerarUrl(config.url + '/editar/'+id);
         }
      });   

      $(document).on('click', '#deletar', function() {
         startLaddaButtons();

         REQUESTER.izitoast({
            type: 'warning',
            class: 'delete',
            message: 'Deseja realmente deletar os registros?',
            timeout: 0,
            onClosing: function () {
               stopLaddaButtons();
            },
            buttons: [
               ['<button>Sim</button>', function(instance, toast) {
                  let dados = $("#lista-bootstrap-table").bootstrapTable('getAllSelections');
                  if($.isArray(dados) && parseInt(dados.length) > 0) {
                     let arrayId = [];
                     for(i in dados) {
                        if(dados[i].hasOwnProperty(config.uniqueId)) {
                           arrayId.push(dados[i][config.uniqueId]);
                        }
                     }
                  
                     let form = new FormData;
                     form.append('id', arrayId);

                     REQUESTER.enviar(REQUESTER.gerarUrl(config.url + '/deletar'), form, {
                        type: 'POST',
                        dataType: 'json',
                        success: function(data) {
                           iziToast.hide({
                              transitionOut: 'fadeOutUp',
                           }, toast);
                           if( data.status ) {
                              REQUESTER.izitoast({
                                 type: 'success',
                                 title: 'Sucesso',
                                 message: 'Deletado com sucesso!',
                              });
                              $("#lista-bootstrap-table").bootstrapTable('refresh');
                              stopLaddaButtons();
                           } else {
                              REQUESTER.izitoast({
                                 type: 'error',
                                 title: 'Erro',
                                 message: data.msg
                              });
                              stopLaddaButtons();
                           }
                        },
                        error: function() {
                           iziToast.hide({
                              transitionOut: 'fadeOutUp',
                           }, toast);
                           REQUESTER.izitoast({
                              type: 'error',
                              title: 'Erro',
                              message: 'Erro ao tentar deletar, tente novamente!'
                           });
                           stopLaddaButtons();
                        }
                     });

                  }
               }],
               ['<button>Não</button>', function(instance, toast) {
                  iziToast.hide({
                     transitionOut: 'fadeOutUp',
                  }, toast);
                  stopLaddaButtons();
               }]
            ]
         });


         
      });
      
   },
   controlaStatusBotoes: function() {
      let qtdDadosSelecionados = $('#lista-bootstrap-table').bootstrapTable("getSelections").length;
      if( parseInt(qtdDadosSelecionados) > 0 ) {
         $('#deletar').attr('disabled', false).removeClass('disable-element');
         if( qtdDadosSelecionados == 1 ){
            $('#editar').attr('disabled', false).removeClass('disable-element');
         } else {
            $('#editar').attr('disabled', true).addClass('disable-element');
         }
      } else {
         $('#deletar').attr('disabled', true).addClass('disable-element');
         $('#editar').attr('disabled', true).addClass('disable-element');
      }
   }
}


$(document).ready(function() {

   if( $('.select2', '#base-formulario').length > 0 ) {
      $('.select2').select2({language: 'pt-BR'})
   }

   $("#btn-salvar-formulario").on('click', function() {
      startLaddaButtons();
      let dados = pegarDadosFormulario();
      let url = $('#config-form').attr('data-url') + '/salvar';
      let id = parseInt($('#config-form').attr('data-id'));
      let chaveId = $('#config-form').attr('data-chave-id');
      let form = new FormData;
      for(i in dados) {
         form.append(i, dados[i]);
      }
      if(id > 0 && chaveId) {
         form.append(chaveId, id);
      }
      REQUESTER.enviar(REQUESTER.gerarUrl(url), form, {
         type: 'POST',
         dataType: 'json',
         success: function(data) {
            if( data.status ) {
               REQUESTER.izitoast({
                  type: 'success',
                  title: 'Sucesso',
                  message: 'Salvo com sucesso!',
               });
               window.location.href = REQUESTER.gerarUrl($('#config-form').attr('data-url'));
            } else {
               REQUESTER.izitoast({
                  type: 'error',
                  title: 'Erro',
                  message: data.msg
               });
               stopLaddaButtons();
            }
         },
         error: function() {
            REQUESTER.izitoast({
               type: 'error',
               title: 'Erro',
               message: 'Erro ao tentar salvar, recarregue a página!'
            });
            stopLaddaButtons();
         }
      });
   });

   $("#btn-cancelar-formulario").on('click', function() {

      startLaddaButtons();

      REQUESTER.izitoast({
         type: 'warning',
         class: 'cancel',
         message: 'Deseja cancelar o cadastro?',
         timeout: 0,
         onClosing: function () {
            stopLaddaButtons();
         },
         buttons: [
            ['<button>Sim</button>', function(instance, toast) {
               window.location.href = REQUESTER.gerarUrl($('#config-form').attr('data-url'));
           }],
           ['<button>Não</button>', function(instance, toast) {
            iziToast.hide({
                transitionOut: 'fadeOutUp',
            }, toast);
            stopLaddaButtons();
        }]
         ]
      });
  });
});


function pegarDadosFormulario() {
   let dados = {};
   $("[data-bind]","#base-formulario").each(function() {
      dados[$(this).attr('data-bind')] = $(this).val();
   });

   return dados;
};

function preencheDadosFormulario(dados) {

   $("[data-bind]","#base-formulario").each(function() {
      let tipo = $(this).prop("tagName").toLowerCase();
      if(dados[$(this).attr('data-bind')]) {
         if (tipo == 'input' || tipo == 'textarea') {
            $(this).val(dados[$(this).attr('data-bind')]);
         } 
         else if(tipo == 'select') {
            $(this).val(dados[$(this).attr('data-bind')]).change();
         }
      }
   });

}

function startLaddaButtons() {
   arrayLadda = [];
   $(".btn-acoes-formulario, .btn-lista-formulario").each(function () {
      let ladda = Ladda.create(this);
      ladda.start();
      arrayLadda.push(ladda);
   });
}

function stopLaddaButtons() {
   for(i in arrayLadda) {
      arrayLadda[i].stop();
   }
   arrayLadda = [];
}

