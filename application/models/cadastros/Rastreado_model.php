<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Rastreado_model extends CI_Model {
	public function lista($countTotal, $limit, $offset, $sort, $order) {

      $arrayResult = array();
      if($countTotal) {
         $this->db->where('ras_id_usuario', $this->session->userdata('usu_id'));
         $arrayResult['total'] = $this->db->count_all_results('rastreado');
      }

      if( is_numeric($limit) && is_numeric($offset) ) {
         $this->db->select('ras_id, ras_descricao, ras_identificacao, ras_tipo, equ_numero_serie, pro_descricao, pro_fabricante');
         $this->db->where('ras_id_usuario', $this->session->userdata('usu_id'));
         $this->db->join('instalacao', 'ins_id_rastreado = ras_id', 'left');
         $this->db->join('equipamento', 'ins_id_equipamento = equ_id', 'left');
         $this->db->join('produto', 'equ_id_produto = pro_id', 'left');
         if($sort && $order) {
            $this->db->order_by($sort, $order);
         }
         $this->db->limit($limit, $offset);
         $arrayResult['dados'] = $this->db->get('rastreado')->result_array();
         if(count($arrayResult['dados']) > 0) {
            $arrayResult['status'] = true;
            return $arrayResult;
         }
      }

      return array('status' => false, 'msg' => 'Nenhum rastreado cadastrado', 'total' => 0);
   }

   public function salvar($dados = null) {
      $resp = array();
      $validade = true;
      $idRastreado = 0;

      if( !isset($dados['ras_descricao']) || !$dados['ras_descricao'] ) {
         $resp['campos'][] = 'ras_descricao';
         $validade = false;
      } 

      if( !isset($dados['ras_identificacao']) || !$dados['ras_identificacao'] ) {
         $resp['campos'][] = 'ras_identificacao';
         $validade = false;
      } 

      if($validade) {

         $data = array(
            'ras_descricao' => $dados['ras_descricao'],
            'ras_identificacao' => $dados['ras_identificacao'],
            'ras_tipo' => $dados['ras_tipo'],
            'ras_id_usuario' => $this->session->userdata('usu_id')
         );

         if( isset($dados['ras_id']) && $dados['ras_id'] && (int)$dados['ras_id'] > 0 ) { //UPDATE
            $idRastreado = $dados['ras_id'];
            $this->db->where('ras_id', $dados['ras_id']);
            $this->db->update('rastreado', $data);

            //deleta as instalações
            $this->db->delete('instalacao', array('ins_id_rastreado' => $dados['ras_id'] ));
         }
         else { //INSERT
            $this->db->insert('rastreado', $data);
            $idRastreado = $this->db->insert_id();
         }

         if( isset($dados['equ_id']) && $dados['equ_id'] && (int)$dados['equ_id'] > 0 ) {
            //instalacao
            $data = array(
               'ins_id_equipamento' => $dados['equ_id'],
               'ins_id_rastreado' => $idRastreado,
               'ins_id_usuario' => $this->session->userdata('usu_id'),
            );
            $this->db->insert('instalacao', $data);
         }

         return array('status' => true, 'dados' => array('ras_id' => $idRastreado));
      } else {
         return array('status' => false, 'msg' => 'Preencha os campos obrigatórios', 'dados' => $resp);
      }
   }

   public function getRastreado($idRastreado) {
      if( is_numeric($idRastreado) && (int)$idRastreado > 0 ) {
         $this->db->select('ras_id, ras_descricao, ras_identificacao, ras_tipo, equ_id, equ_numero_serie, equ_id_produto, pro_descricao, pro_fabricante');
         $this->db->join('instalacao', 'ins_id_rastreado = ras_id', 'left');
         $this->db->join('equipamento', 'ins_id_equipamento = equ_id', 'left');
         $this->db->join('produto', 'pro_id = equ_id_produto', 'left');
         $this->db->where('ras_id', $idRastreado);
         $result = $this->db->get('rastreado')->result_array();
         if(count($result) > 0) {
            return array('status' => true, 'dados' => $result);
         }
      }

      return array('status' => false, 'msg' => 'Sem resultado');
   }

   public function deletar($ids){
      foreach($ids as $id) {
         $this->db->delete('rastreado', array('ras_id' => (int)$id));
         $this->db->delete('instalacao', array('ins_id_rastreado' => (int)$id));
      }
      return array('status' => true);
   }
}
