<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Controller extends CI_Controller {
	public function __construct() {
      parent::__construct();
        
        if ((!$this->session->userdata('session_id'))) {
            redirect('login');
        }

        $this->twig->addGlobal('usu_nome', $this->session->userdata('usu_nome'));
	}
}

?>