//╔══╗    ╔═╗ ╔═╗ ╔══╗ ╔══════╗
//║  ║    ║ ║ ║ ║ ╚╗╔╝ ║ ╔════╝
//║  ║    ║ ╚═╝ ║ ╔╝╚╗ ║ ╚════╗
//║  ║    ╚═════╝ ╚══╝ ╚════╗ ║
//║  ╚═══╗             ╔════╝ ║
//╚══════╝             ╚══════╝ .[By. Luis David Tovar Vasquez, 02/Oct/2026]



let modoOperacion = 1; // 1 = cifrar, 0 = descifrar
let ContraseñaSecreta;
let ContraseñaConfirmada;

//--------------  INICIALIZACIONES: ------------------------------------------------------------------------------------------------------------------------------------------------------------

BotonConvertir.disabled = true;
IndicadorConstraseña.textContent = "Contraseña Vacia"; 
IndicadorConstraseña.className = 'dynamic-feedback ' + 'invalid'; 

document.addEventListener('DOMContentLoaded', function(){    // Escuhador de eventos DOM

const TextoIn = document.getElementById('TextoIn');
const TextoOut = document.getElementById('TextoOut');
const BotonConvertir = document.getElementById('BotonConvertir');
const CaracteresIn = document.getElementById('CaracteresIn');
const CaracteresOut = document.getElementById('CaracteresOut');
const BotonCopiar = document.getElementById('BotonCopiar');
const BotonBorrar = document.getElementById('BotonBorrar');
const PasswordIn = document.getElementById('PasswordIn');
const BotonVerClave = document.getElementById('BotonVerClave');
const IconoVerClave = document.getElementById('IconoVerClave');
const IndicadorConstraseña = document.getElementById('IndicadorConstraseña');
const BotonCifrar = document.getElementById('BotonCifrar');
const BotonDecifrar = document.getElementById('BotonDecifrar');
const BotonConfirClave = document.getElementById('BotonConfirClave');


//--------------  EVENTOS: ------------------------------------------------------------------------------------------------------------------------------------------------------------

TextoIn.addEventListener('input', ActualizarCuentaCaracteres); //Metodo para "Escuchar" eventos de un elemento HTML, Sintaxis: elemento.addEventListener(tipoDeEvento, funcionAEjecutar)
BotonConvertir.addEventListener('click', ConvertirTexto);
BotonCopiar.addEventListener('click', CopiarTexto);
BotonBorrar.addEventListener('click', BorrarTexto);
BotonVerClave.addEventListener('click', VerClave );
PasswordIn.addEventListener('input', EstadoContraseña);
BotonCifrar.addEventListener('change',SelectorCifrar);
BotonDecifrar.addEventListener('change',SelectorDecifrar);
BotonConfirClave.addEventListener('click',ConfirmarContraseña);

//--------------  FUNCIONES: ---------------------------------------------------------------------------------------------------------------------------------------------------------

// Funcion contador de caracteres:

function ActualizarCuentaCaracteres() {
    const count = TextoIn.value.length;
    CaracteresIn.textContent = `Caracteres: ${count}`;
}

// Funcion Actualizar contador de resultados:

function ActualizarContadorSalida() {
    const count = TextoOut.value.length;
    CaracteresOut.textContent = `Caracteres: ${count}`;
}

// Funcion Copiar texto en portapapeles:

function CopiarTexto(){

    if (TextoOut.value) {
        TextoOut.select();
        document.execCommand('copy');
    }
                    
    // Cambiar temporalmente el texto del botón
    const originalText = BotonCopiar.innerHTML;
    BotonCopiar.innerHTML = '<i class="bi bi-check2"></i> ¡Copiado!';
    BotonCopiar.classList.remove('btn-outline-secondary');
    BotonCopiar.classList.add('btn-success');
                    
    setTimeout(() => {
            BotonCopiar.innerHTML = originalText;
            BotonCopiar.classList.remove('btn-success');
            BotonCopiar.classList.add('btn-outline-secondary');
    }, 2000);
}

// Funcion Limpiar todo:

    function BorrarTexto(){
        TextoIn.value = '';
        TextoOut.value = '';
        ActualizarCuentaCaracteres();
        ActualizarContadorSalida();
        // Enfocar el campo de entrada
        TextoIn.focus();
    }

// Funcion Mostrar/ocultar contraseña:

    function VerClave(){
        const type = PasswordIn.getAttribute('type') === 'password' ? 'text' : 'password';
        PasswordIn.setAttribute('type', type);
        IconoVerClave.classList.toggle('bi-eye');
        IconoVerClave.classList.toggle('bi-eye-slash');
    };

// Funcion para Validar la contraseña: 

    function EstadoContraseña(){  
        if (PasswordIn.value ==''){
        IndicadorConstraseña.textContent = "Contraseña Vacia"; 
        IndicadorConstraseña.className = 'dynamic-feedback ' + 'invalid'; 
        }else{
        IndicadorConstraseña.textContent = "Contraseña sin confirmar"; 
        IndicadorConstraseña.className = 'dynamic-feedback ' + 'unconfirmed'; 
        }
        BotonConvertir.disabled = true;
        ContraseñaConfirmada = false;
    }

    
// Funcion Confirmar contraseña: 

    function ConfirmarContraseña(){
        ContraseñaSecreta = PasswordIn.value;
        ContraseñaConfirmada = true;
        BotonConvertir.disabled = false;
        IndicadorConstraseña.textContent = "Contraseña Ok";     
        IndicadorConstraseña.className = 'dynamic-feedback ' + 'valid';

    }

// Funcion Selector Modo Cifrar:                                  

    function SelectorCifrar() {
        modoOperacion = 1;
        console.log('Modo cambiado a Cifrar: ' + modoOperacion);
    }

// Funcion Selector Modo Decifrar:

    function SelectorDecifrar() {
        modoOperacion = 0;
        console.log('Modo cambiado a Decifrar: ' + modoOperacion);
    }


// Funcion para Obtener la Clave:  

    async function ObtenerClave(password, salt) {
        const enc = new TextEncoder();  //Convierte strings en bytes (Uint8Array),
        const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
        return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
        );
    }


// Funcion para Cifrar:

    async function encrypt(text, password) {
        const enc = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv   = crypto.getRandomValues(new Uint8Array(12));

        const key = await ObtenerClave(password, salt);

        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
             enc.encode(text)
         );

        // Unimos todo en un solo string para enviar
        return btoa(
            JSON.stringify({
            salt: Array.from(salt),
            iv: Array.from(iv),
            data: Array.from(new Uint8Array(encrypted))
            })
         );
    }

// Funcion para Decifrar:

    async function decrypt(code, password) {
        const dec = new TextDecoder();
        const obj = JSON.parse(atob(code));

        const salt = new Uint8Array(obj.salt);
        const iv   = new Uint8Array(obj.iv);
        const data = new Uint8Array(obj.data);

        const key = await ObtenerClave(password, salt);

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
                key,
                data
            );
        return dec.decode(decrypted);
    }

// Funcion Convertir Texto:                                  

    async function ConvertirTexto() {
        let mensaje = TextoIn.value;
        let Contraseña = PasswordIn.value;
        let Codigo;
        if (modoOperacion == 1) {
                codigo = await encrypt(mensaje, Contraseña);
                TextoOut.value = codigo;
                ActualizarContadorSalida();
        }

        if (modoOperacion == 0) {
                codigo = await decrypt(mensaje, Contraseña);
                TextoOut.value = codigo;
                ActualizarContadorSalida();
        }
         return codigo;
    }

});
