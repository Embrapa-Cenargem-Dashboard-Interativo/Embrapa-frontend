//--------------------------------------------------------------
function f001_MostrarDiv(aDiv) {

//---> esconder todos os DIV´s
   document.getElementById('divTelaDados').style.display      = 'none';
   document.getElementById('divAjuda').style.display          = 'none';
   document.getElementById('divAguarde').style.display        = 'none';
   document.getElementById('divMsg').style.display            = 'none';
//---> mostrar o DIV desejado...
   document.getElementById(aDiv).style.display = 'block';
}

//--------------------------------------------------------------
function f001_IniciarTela() {
    var vNickUsr = document.getElementById('txtNickUsr');
    
    vNickUsr.focus();
}

//--------------------------------------------------------------
function f001_ValidarUsuario(aProximaPagina) {

    /// fazer esta rotina ... ver se nick e senha estão em branco e ver se tem aspadupla ou simples...
    // o aspa dupla é uma function que fica em jsgeral01.js

     var vOK = true;
     var vCampo;
     var vTemAspas;
     var vTexto            = "";
     var vMsg;

//---> Criticar o nickname..
   vCampo = document.getElementById('txtNickUsrDigitado').value;
   if (vCampo === '') {
       vMsg = 'Nickname não informado';
       vTexto += "<LI><img src='../pcenimg/subitem01.gif' border=0> " + vMsg + "</LI>";
       vOK = false;
   }
   else {
       vTemAspas = fg_TemAspasSimplesOuDupla(vCampo);
       if (vTemAspas === 'S') {
           vMsg = 'Nickname possui aspa simples e/ou dupla';
           vTexto += "<LI><img src='../pcenimg/subitem01.gif' border=0> " + vMsg + "</LI>";
           vOK = false;
       }
   }



}
