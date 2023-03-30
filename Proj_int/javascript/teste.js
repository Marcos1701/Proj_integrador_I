
function checkInputs(inputs){
    let preenchidos = true
    inputs.forEach(function(input) {
  	
        if(input.value === "" || input.value === null) {
            preenchidos = false;
        }
      
    });
    return preenchidos
}

function main(){
    document.getElementById("login").disabled = true

    let email = document.getElementById("input-email")
    let senha = document.getElementById("input-senha")
    document.getElementById("login").addEventListener("input",function(){
        if(checkInputs([email,senha])){
            document.getElementById("login").disabled = false
        }else{
            document.getElementById("login").disabled = true
        }
    })
    
}

main()
