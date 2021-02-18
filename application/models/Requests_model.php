<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Requests_model extends CI_Model {
	public function get_produtos() {
      $arrayResult = array();
      $this->db->select('pro_id, pro_descricao, pro_fabricante');
      $arrayResult['dados'] = $this->db->get('produto')->result_array();
      if(count($arrayResult['dados']) > 0) {
         $arrayResult['status'] = true;
         return $arrayResult;
      }
      return array('status' => true, 'msg' => 'Nenhum produto encontrado', 'total' => 0);
   }

   public function get_rastreados() {
      $arrayResult = array();
      $this->db->select('ras_id, ras_descricao, ras_identificacao');
      $this->db->join('instalacao', 'ras_id = ins_id_rastreado', 'left');
      $this->db->where('ras_id_usuario', $this->session->userdata('usu_id'));
      $this->db->where('ins_id is NULL');
      $arrayResult['dados'] = $this->db->get('rastreado')->result_array();
      if(count($arrayResult['dados']) > 0) {
         $arrayResult['status'] = true;
         return $arrayResult;
      }
      return array('status' => true, 'msg' => 'Nenhum rastreado encontrado', 'total' => 0);
   }

   public function get_rastreados_instalados() {
      $arrayResult = array();
      $this->db->select('ras_id, ras_descricao, ras_identificacao');
      $this->db->join('instalacao', 'ras_id = ins_id_rastreado', 'inner');
      $this->db->where('ras_id_usuario', $this->session->userdata('usu_id'));
      $arrayResult['dados'] = $this->db->get('rastreado')->result_array();
      if(count($arrayResult['dados']) > 0) {
         $arrayResult['status'] = true;
         return $arrayResult;
      }
      return array('status' => true, 'msg' => 'Nenhum rastreado encontrado', 'total' => 0);
   }

   public function get_equipamentos() {
      $arrayResult = array();
      $this->db->select('equ_id, equ_numero_serie, equ_id_produto, equ_numero_chip, pro_descricao, pro_fabricante');
      $this->db->join('instalacao', 'equ_id = ins_id_equipamento', 'left');
      $this->db->join('produto', 'pro_id = equ_id_produto', 'left');
      $this->db->where('equ_id_usuario', $this->session->userdata('usu_id'));
      $this->db->where('ins_id is NULL');
      $arrayResult['dados'] = $this->db->get('equipamento')->result_array();
      if(count($arrayResult['dados']) > 0) {
         $arrayResult['status'] = true;
         return $arrayResult;
      }
      return array('status' => true, 'msg' => 'Nenhum equipamento encontrado', 'total' => 0);
   }
}