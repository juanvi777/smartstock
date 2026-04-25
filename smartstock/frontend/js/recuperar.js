
 function recuperar(){

    let user = document.getElementById("userRec").value.trim();

    if(user === ""){
        document.getElementById("resultado").textContent = "⚠️ Escribe un usuario";
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let existe = usuarios.find(u => u.user === user);

    if(existe){
        document.getElementById("resultado").textContent =
        "🔐 Tu contraseña es: " + existe.pass;
    } else {
        document.getElementById("resultado").textContent =
        "❌ Usuario no encontrado";
    }
}

function volver(){
    window.location.href = "index.html";
}
  
   

    
     

      
       
        
         
          
           

            
             
              
               
                
                 