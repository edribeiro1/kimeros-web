<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Requests extends CI_Controller {
   public function __construct() {
      parent::__construct();
      $this->load->model('requests_model');
   }
   
   public function get_produtos() {
      if( $this->input->method() == 'get' ) {
         $dados = $this->requests_model->get_produtos();
         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }
   
   public function get_rastreados() {
      if( $this->input->method() == 'get' ) {
         $dados = $this->requests_model->get_rastreados();
         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }

   public function get_rastreados_instalados() {
      if( $this->input->method() == 'get' ) {
         $dados = $this->requests_model->get_rastreados_instalados();
         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }
   
   public function get_equipamentos() {
      if( $this->input->method() == 'get' ) {
         $dados = $this->requests_model->get_equipamentos();
         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
	}
}