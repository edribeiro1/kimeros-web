<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Instalacao_model extends CI_Model {
	public function getInstalacoes($countTotal, $limit, $offset, $sort, $order) {

      $arrayResult = array();
      if($countTotal) {
         $this->db->where('ins_id_usuario', $this->session->userdata('usu_id'));
         $arrayResult['total'] = $this->db->count_all_results('instalacao');
      }

      if( is_numeric($limit) && is_numeric($offset) ) {
         $this->db->select('ras_id, equ_id, ras_descricao, equ_numero_serie,
            date_format(
               date_add(
                  (SELECT ult_eve_data_gps 
                  FROM ultimo_evento 
                  WHERE ult_eve_id_rastreado = ras_id 
                  AND ult_eve_id_equipamento = equ_id 
                  ORDER BY ult_eve_data_gps 
                  LIMIT 1), interval -3 hour
               ), 
               "%d/%m/%Y %H:%i:%s"
            ) AS ult_eve_data_gps');
         $this->db->where('ins_id_usuario', $this->session->userdata('usu_id'));
         $this->db->join('equipamento', 'ins_id_equipamento = equ_id');
         $this->db->join('rastreado', 'ins_id_rastreado = ras_id');
         if($sort && $order) {
            $this->db->order_by($sort, $order);
         }
         $this->db->limit($limit, $offset);
         $arrayResult['dados'] = $this->db->get('instalacao')->result_array();
         if(count($arrayResult['dados']) > 0) {
            $arrayResult['status'] = true;
            return $arrayResult;
         }
      }

      return array('status' => false, 'msg' => 'Nenhuma instalação encontrada', 'total' => 0);
   }
}
