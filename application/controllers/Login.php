<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {
   public function __construct() {
      parent::__construct();
      $this->load->model('login_model');
   }

	public function index() {
      $this->twig->display('login/index');
   }
   
   public function validar() {
      $usuario = $this->input->post('usuario');
      $senha = md5($this->input->post('senha'));

      $resposta = $this->login_model->validar($usuario, $senha);

      echo json_encode( $resposta );

   }

   public function sair() {
        $this->session->sess_destroy();
        header('Location:'.base_url().'login');
   }
}
