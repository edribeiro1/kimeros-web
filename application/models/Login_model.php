<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login_model extends CI_Model {
	public function validar($usuario, $senha) {
      if($usuario && $senha) {
         $this->db->where('usu_usuario', $usuario);
         $this->db->where('usu_senha', $senha);
         $result = $this->db->get('usuario');
         if($result->num_rows() > 0) {
            
            $this->insereInformacoesNaSessao($result->row());
            return array('status' => true);
         }
      }
      return array('status' => false, 'msg' => 'Usuario ou senha incorretos');
    }

    private function insereInformacoesNaSessao($dados){
        $dados_sessao = array(
            'session_id'=> session_id(),
            'usu_id'=> $dados->usu_id,
            'usu_nome'=> $dados->usu_nome
        );
        $this->session->set_userdata($dados_sessao);
    }
}
