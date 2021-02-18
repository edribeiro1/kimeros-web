$(document).ready(function () {
   const enterKey = 13;
   
   $(document).on('keypress', function(e) {
      if(e.keyCode == enterKey) {
         if(!$('.btn-entrar').is(":focus")){
            $('.btn-entrar').click();
         }
      }
   });

   $('.recuperar-senha').on('click', function() {
      REQUESTER.izitoast({
         type: 'error',
         title: 'Contate o adminstrador',
      });
   });

   $('.btn-entrar').on('click', function () {
      var ladda = Ladda.create(this);
      ladda.start();
      
      let usuario = $.trim($('#usuario').val());
      let senha = $.trim($('#senha').val()); 
      let valido = true;
      let msg = "";

      $('.input-erro, .label-erro').removeClass('input-erro label-erro');
      
      if(usuario.length == 0) {
         $('#usuario').addClass('input-erro');
         $('label[for=usuario]').addClass('label-erro');
         valido = false;
         msg = "Preencha os campos corretamente";
      }

      if(senha.length == 0) {
         $('#senha').addClass('input-erro');
         $('label[for=senha]').addClass('label-erro');
         valido = false;
         msg = "Preencha os campos corretamente";
      }

      if( valido ) {
         
         REQUESTER.enviar(REQUESTER.gerarUrl('login/validar'), {usuario: usuario, senha: senha}, {
            processData: true,
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            success: function(data) {
               if( data.status ) {
                  window.location.href = REQUESTER.gerarUrl('dashboard');
               } else {
                  ladda.stop();
                  REQUESTER.izitoast({
                     type: 'error',
                     title: 'Erro',
                     message: data.msg
                  });
               }
            },
            error: function() {
               ladda.stop();
               REQUESTER.izitoast({
                  type: 'error',
                  title: 'Erro',
                  message: 'Erro no login, tente novamente!'
               });
            }
         });
      } else {
         ladda.stop();
         REQUESTER.izitoast({
            type: 'error',
            title: 'Erro',
            message: msg
         });
      }
      
      // REQUESTER.enviar(REQUESTER.gerarUrl('login/validar'),)
   });
});