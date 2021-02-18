<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends MY_Controller {
   public function __construct() {
      parent::__construct();
      $this->load->model('dashboard_model');
   }

	public function index() {
      $this->twig->display('dashboard/index');
   }

   public function get_markers() {
      if( $this->input->method() == 'get' ) {
         $dados = $this->dashboard_model->get_markers();
         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }
   
   public function get_resumo_consolidados() {
      if( $this->input->method() == 'get' ) {
         $dados = $this->dashboard_model->get_resumo_consolidados();
         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }
}
