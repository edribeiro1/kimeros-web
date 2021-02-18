<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Alerta_model extends CI_Model {
   
   public function get_alerta($limit, $offset, $sort, $order) {

      $arrayResult = array();
      
      $this->db->where('ale_id_usuario', $this->session->userdata('usu_id'));
      $arrayResult['total'] = $this->db->count_all_results('alerta');

      if( is_numeric($limit) && is_numeric($offset) ) {
         $this->db->select('ale_id, ale_tip_descricao, ras_descricao, ale_data, ale_lido');
         $this->db->where('ale_id_usuario', $this->session->userdata('usu_id'));
         $this->db->join('alerta_tipo', 'ale_tip_id = ale_id_ale_tip');
         $this->db->join('rastreado', 'ras_id = ale_id_rastreado');
         if($sort && $order) {
            $this->db->order_by($sort, $order);
         } else {
            $this->db->order_by('ale_lido asc, ale_data desc');
         }
         $this->db->limit($limit, $offset);
         $arrayResult['dados'] = $this->db->get('alerta')->result_array();
      }
      return $arrayResult;
   }

   public function contar_qtde_alerta() {
      $this->db->where('ale_id_usuario', $this->session->userdata('usu_id'));
      $this->db->where('ale_lido', 0);
      return array('dados' => array('total' => $this->db->count_all_results('alerta')) );
   }

   public function alerta_lido($ids, $lido) {

      if( is_array($ids) ) {
         $this->db->where_in('ale_id',$ids);
         $this->db->where('ale_id_usuario', $this->session->userdata('usu_id'));
         $this->db->set('ale_lido', $lido);
         $this->db->update('alerta');

         if($this->db->affected_rows() > 0 ){
            return array('status'=> true);
         }
         
      } else {
         return array('status' => false);
      }
      
   }

   public function deletar_alerta($ids) {
      if( is_array($ids) ) {
         $this->db->where_in('ale_id',$ids);
         $this->db->where('ale_id_usuario', $this->session->userdata('usu_id'));
         $this->db->delete('alerta');
         if($this->db->affected_rows() > 0 ){
            return array('status'=> true);
         }
      } else {
         return array('status' => false);
      }
   }

}
