<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Equipamento_model extends CI_Model {
	public function lista($countTotal, $limit, $offset, $sort, $order) {

      $arrayResult = array();
      if($countTotal) {
         $this->db->where('equ_id_usuario', $this->session->userdata('usu_id'));
         $arrayResult['total'] = $this->db->count_all_results('equipamento');
      }

      if( is_numeric($limit) && is_numeric($offset) ) {
         $this->db->select('equ_id, equ_numero_serie, pro_descricao, equ_numero_chip, ras_descricao');
         $this->db->where('equ_id_usuario', $this->session->userdata('usu_id'));
         $this->db->join('instalacao', 'ins_id_equipamento = equ_id', 'left');
         $this->db->join('rastreado', 'ras_id = ins_id_rastreado', 'left');
         $this->db->join('produto', 'pro_id = equ_id_produto', 'left');
         if($sort && $order) {
            $this->db->order_by($sort, $order);
         }
         $this->db->limit($limit, $offset);
         $arrayResult['dados'] = $this->db->get('equipamento')->result_array();
         if(count($arrayResult['dados']) > 0) {
            $arrayResult['status'] = true;
            return $arrayResult;
         }
      }

      return array('status' => false, 'msg' => 'Nenhum equipamento cadastrado', 'total' => 0);
   }

   public function salvar($dados = null) {
      $resp = array();
      $validade = true;
      $idEquipamento = 0;

      if( !isset($dados['equ_numero_serie']) || !$dados['equ_numero_serie'] ) {
         $resp['campos'][] = 'equ_numero_serie';
         $validade = false;
      } 

      if( !isset($dados['equ_id_produto']) || !$dados['equ_id_produto'] || (int)$dados['equ_id_produto'] <= 0 ) {
         $resp['campos'][] = 'equ_id_produto';
         $validade = false;
      } 

      if($validade) {

         $data = array(
            'equ_numero_serie' => $dados['equ_numero_serie'],
            'equ_id_produto' => $dados['equ_id_produto'],
            'equ_numero_chip' => $dados['equ_numero_chip'],
            'equ_id_usuario' => $this->session->userdata('usu_id')
         );

         if( isset($dados['equ_id']) && $dados['equ_id'] && (int)$dados['equ_id'] > 0 ) { //UPDATE
            $idEquipamento = $dados['equ_id'];
            $this->db->where('equ_id', $dados['equ_id']);
            $this->db->update('equipamento', $data);

            //deleta as instalações
            $this->db->delete('instalacao', array('ins_id_equipamento' => $dados['equ_id'] ));
         }
         else { //INSERT
            $this->db->insert('equipamento', $data);
            $idEquipamento = $this->db->insert_id();
         }

         if( isset($dados['ras_id']) && $dados['ras_id'] && (int)$dados['ras_id'] > 0 ) {
            //instalacao
            $data = array(
               'ins_id_equipamento' => $idEquipamento,
               'ins_id_rastreado' => $dados['ras_id'],
               'ins_id_usuario' => $this->session->userdata('usu_id'),
            );
            $this->db->insert('instalacao', $data);
         }

         return array('status' => true, 'dados' => array('equ_id' => $idEquipamento));
      } else {
         return array('status' => false, 'msg' => 'Preencha os campos obrigatórios', 'dados' => $resp);
      }
   }

   public function getEquipamento($idEquipamento) {
      if( is_numeric($idEquipamento) && (int)$idEquipamento > 0 ) {
         $this->db->select('equ_id,equ_numero_serie, equ_id_produto, equ_numero_chip, ras_id, ras_descricao');
         $this->db->join('instalacao', 'equ_id = ins_id_equipamento', 'left');
         $this->db->join('rastreado', 'ins_id_rastreado = ras_id', 'left');
         $this->db->where('equ_id', $idEquipamento);
         $result = $this->db->get('equipamento')->result_array();
         if(count($result) > 0) {
            return array('status' => true, 'dados' => $result);
         }
      }

      return array('status' => false, 'msg' => 'Sem resultado');
   }

   public function deletar($ids){
      foreach($ids as $id) {
         $this->db->delete('equipamento', array('equ_id' => (int)$id));
         $this->db->delete('instalacao', array('ins_id_equipamento' => (int)$id));
      }
      return array('status' => true);
   }
}
