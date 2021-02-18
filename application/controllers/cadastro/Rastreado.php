<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Rastreado extends MY_Controller {
   public function __construct() {
      parent::__construct();
      $this->load->model('cadastros/rastreado_model');
   }

	public function index() {
      $this->twig->display('cadastros/rastreado/index');
   }

   public function adicionar() {
      $this->twig->display('cadastros/rastreado/form');
   }

   public function editar($id) {
      $this->twig->display('cadastros/rastreado/form', array('id'=> $id));
   }

   public function lista() {
      if( $this->input->method() == 'get' ) {
         
         $limit = $this->input->get('limit');
         $offset = $this->input->get('offset');
         $countTotal = $this->input->get('count_total');
         $countTotal = true;
         $sort = $this->input->get('sort'); 
         $order = $this->input->get('order'); 

         $dados = $this->rastreado_model->lista($countTotal, $limit, $offset, $sort, $order);
         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }

   public function salvar() {
      if( $this->input->method() == 'post' ) {
         $dados = $this->input->post();
         $resp = $this->rastreado_model->salvar($dados);
         echo json_encode($resp);
      }
      else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }

   public function getRastreado($idRastreado) {
      if( $this->input->method() == 'get' ) {
         $dados = $this->rastreado_model->getRastreado($idRastreado);
         echo json_encode( $dados );
      } else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }

   public function deletar() {
      if( $this->input->method() == 'post' ) {
         $dados = $this->input->post();
         if(isset($dados['id']) ) {
            $ids = explode(',',$dados['id']);
            $resp = $this->rastreado_model->deletar($ids);
            echo json_encode($resp);
         }
         else {
            echo json_encode( array('status' => false, 'msg' => 'ids invalidos') );   
         }
      }
      else {
         echo json_encode( array('status' => false, 'msg' => 'Metodo incorreto') );
      }
   }
}
