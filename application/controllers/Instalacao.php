<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Instalacao extends CI_Controller {
   public function __construct() {
      parent::__construct();
      $this->load->model('instalacao_model');
   }
   
   public function get() {
      if( $this->input->method() == 'get' ) {
         
         $limit = $this->input->get('limit');
         $offset = $this->input->get('offset');
         $countTotal = $this->input->get('count_total');
         $countTotal = true;
         $sort = $this->input->get('sort'); 
         $order = $this->input->get('order'); 

         $dados = $this->instalacao_model->getInstalacoes($countTotal, $limit, $offset, $sort, $order);
         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
	}
}