<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard_model extends CI_Model {

   public function get_markers() {
      $this->db->select("ult_eve_id_equipamento, ult_eve_id_rastreado, ST_X(ult_eve_localizacao) AS lng, ST_Y(ult_eve_localizacao) AS lat, ult_eve_velocidade, ult_eve_data_gps, ult_eve_data_servidor, ult_eve_ignicao, ult_eve_gps, ult_eve_gprs,
         ult_eve_bateria, ras_descricao, ras_identificacao, ras_tipo");
      $this->db->join('rastreado', 'ras_id = ult_eve_id_rastreado', 'inner');
      $this->db->where('ult_eve_id_usuario', $this->session->userdata('usu_id'));
      $this->db->group_by('ult_eve_id_equipamento');
      $resultado = $this->db->get('ultimo_evento')->result_array();

      return array(
         'status' => true,
         'dados' => $resultado
      );

   }

	public function get_resumo_consolidados() {
      $this->db->where('equ_id_usuario', $this->session->userdata('usu_id'));
      $totalEquipamento = $this->db->count_all_results('equipamento');

      $this->db->where('ras_id_usuario', $this->session->userdata('usu_id'));
      $totalRastreado = $this->db->count_all_results('rastreado');

      //$this->db->where('ult_eve_id_usuario', $this->session->userdata('usu_id'));
      // $qtdComunicando = $this->db->count_all_results('ultimo_evento', array('ult_eve_id_usuario' => $this->session->userdata('usu_id'), 'ult_eve_data > ontem'  ));
      $totalComunicando = 0;

      $this->db->where('eve_id_usuario', $this->session->userdata('usu_id'));
      $totalEvento = $this->db->count_all_results('evento');

      return array(
         'status' => true, 
         'dados' => array(
            'total_equipamento' => $totalEquipamento, 
            'total_rastreado' => $totalRastreado, 
            'total_comunicando' => $totalComunicando,
            'total_evento' => $totalEvento
         )
      );
     
   }
}
