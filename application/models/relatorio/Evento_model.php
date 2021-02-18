<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Evento_model extends CI_Model {
	public function gerar_relatorio($idRastreado, $dataInicial, $dataFinal) {
      $arrayResult = array();

      $dataInicial = DateTime::createFromFormat('d/m/Y H:i:s', $dataInicial, new DatetimeZone('America/Sao_Paulo'));
      $dataInicial->setTimezone(new DateTimeZone('UTC'));
      
      $dataFinal = DateTime::createFromFormat('d/m/Y H:i:s', $dataFinal, new DatetimeZone('America/Sao_Paulo'));
      $dataFinal->setTimezone(new DateTimeZone('UTC'));

      if( (int)$idRastreado > 0 ) {
         $this->db->select('eve_id, ras_descricao, eve_velocidade, eve_ignicao, eve_gps, ras_tipo, 
            CONCAT(equ_numero_serie," - ", pro_fabricante, " - ", pro_descricao) as equ_numero_serie, 
            ST_Y(eve_localizacao) as lat, ST_X(eve_localizacao) as lng, 
            date_format(date_add(eve_data_gps, interval -3 hour), "%d/%m/%Y %H:%i:%s") eve_data_gps, 
            date_format(date_add(eve_data_servidor, interval -3 hour), "%d/%m/%Y %H:%i:%s") eve_data_servidor');
         $this->db->join('equipamento', 'eve_id_equipamento = equ_id');
         $this->db->join('produto', 'equ_id_produto = pro_id');
         $this->db->join('rastreado', 'eve_id_rastreado = ras_id');
         $this->db->where('eve_id_usuario', $this->session->userdata('usu_id'));
         $this->db->where('eve_id_rastreado', $idRastreado);
         $this->db->where('eve_data_gps BETWEEN "'. $dataInicial->format('Y-m-d H:i:s') .'" AND "'. $dataFinal->format('Y-m-d H:i:s') .'"');
         $this->db->order_by('eve_data_gps DESC, eve_id DESC');
         $arrayResult['dados'] = $this->db->get('evento')->result_array();

         if(count($arrayResult['dados']) > 0) {
            $arrayResult['status'] = true;
            return $arrayResult;
         }
      }
      return array('status' => false, 'msg' => 'Nenhum registro encontrado', 'total' => 0);
   }
}
?>