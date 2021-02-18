var REQUESTER = {
   gerarUrl: function (url) {
      var baseUrl = $('body').attr('data-baseurl');
      return baseUrl + url;
   },
   enviar: function (url, data, config) {
      let configPadrao = {
         url: url,
         type: "POST",
         data: data,
         processData: false,
         contentType: false
     };

     $.extend(configPadrao, config);
     $.ajax(configPadrao);
   },
   izitoast: function (config) {
      let configIzitoast = $.extend({
         class: 'iziToastPadrao',
         position: 'topCenter',
         close: true,
         timeout: 3000,
         buttons: [],
      }, config);

      if ($.type(configIzitoast.class) == "string") {
         if ($("." + configIzitoast.class).length > 0) {
             iziToast.hide({
                 transitionOut: 'fadeOut'
             }, $("." + configIzitoast.class)[0]);
         }
      }

      iziToast[configIzitoast.type](configIzitoast);
     
   }
}