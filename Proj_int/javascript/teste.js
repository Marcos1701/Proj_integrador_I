
function checkInputs(inputs){
    let preenchidos = true
    inputs.forEach(function(input) {
  	
        if(input.value === "") {
            preenchidos = false;
        }
      
    });
    return preenchidos
}

function main(){
    let inputs = document.querySelectorAll("input")
    let button = document.querySelector("submit")

    inputs.forEach(function(input){
        input.addEventListener("keyup",function(){
            if(checkInputs(inputs)){
                button.removeAttribute("disabled")
            }
        })
    })
}

main()
