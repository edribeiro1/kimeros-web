<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Alerta extends CI_Controller {

   public function __construct() {
      parent::__construct();
      $this->load->model('alerta_model');
   }

	public function get_alerta() {
      if( $this->input->method() == 'get' ) {
         $limit = $this->input->get('limit');
         $offset = $this->input->get('offset');
         $countTotal = $this->input->get('count_total');
         $countTotal = true;
         $sort = $this->input->get('sort'); 
         $order = $this->input->get('order'); 

         $arrayDados = $this->alerta_model->get_alerta($limit, $offset, $sort, $order);
         if($arrayDados['dados'] && count($arrayDados['dados']) > 0) {
            echo json_encode( array_merge( array('status' => true), $arrayDados) );
         } else {
            echo json_encode( array('status' => false) );
         }
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto'));
      }
   }

   public function contar_qtde_alerta() {
      if( $this->input->method() == 'get' ) {
         $arrayDados = $this->alerta_model->contar_qtde_alerta();
         if($arrayDados['dados'] && count($arrayDados['dados']) > 0) {
            echo json_encode( array_merge( array('status' => true), $arrayDados) );
         } else {
            echo json_encode( array('status' => false) );
         }
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto'));
      }
   }

   public function trata_alerta() {

      if( $this->input->method() == 'put' ) {
         $dados = array();
         parse_str(file_get_contents('php://input'),  $dados);

         $ids = $dados['ids'];
         $lido = $dados['lido'];

         $dados = $this->alerta_model->alerta_lido($ids, $lido);
         echo json_encode($dados);
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto'));
      }
      
   }

   public function deletar_alerta() {
      if( $this->input->method() == 'delete' ) {
         $dados = array();
         parse_str(file_get_contents('php://input'),  $dados);

         $ids = $dados['ids'];
         $dados = $this->alerta_model->deletar_alerta($ids);
         echo json_encode($dados);

      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto'));
      }
   }
}
