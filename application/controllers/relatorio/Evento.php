<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Evento extends MY_Controller {
   public function __construct() {
      parent::__construct();
      $this->load->model('relatorio/evento_model');
   }

	public function index() {
      $this->twig->display('relatorio/evento/index');
   }

   public function lista() {
      if( $this->input->method() == 'get' ) {
         
         $limit = $this->input->get('limit');
         $offset = $this->input->get('offset');
         $countTotal = $this->input->get('count_total');
         $countTotal = true;
         $sort = $this->input->get('sort'); 
         $order = $this->input->get('order'); 

         $dados = $this->evento_model->lista($countTotal, $limit, $offset, $sort, $order);
         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }

   public function gerar_relatorio() {
      if( $this->input->method() == 'get' ) {

         $idRastreado = $this->input->get('id_rastreado');
         $dataInicial = $this->input->get('data_inicial');
         $dataFinal = $this->input->get('data_final');

         $dados = $this->evento_model->gerar_relatorio($idRastreado, $dataInicial, $dataFinal);

         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }
}
