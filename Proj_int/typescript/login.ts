
function onSignIn(googleUser: any): void {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Nome: ' + profile.getName());
    console.log('Imagem URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    const id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

}

async function RealizarLogin(email: string, senha: string): Promise<void> {
    const url: string = "http://localhost:3000/login";
    const data: object = {
        email: email,
        senha: senha
    };

    const bnt_lembrar_senha: HTMLInputElement = document.getElementById("lembrar_senha") as HTMLInputElement;

    await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    }).then(async (response) => {
        if (response.status == 200) {
            const { token } = await response.json();
            localStorage.setItem("token", token);
            if (localStorage.getItem("token") === null) {
                console.log("Token não encontrado");
                return;
            }
            if (bnt_lembrar_senha.checked) {
                localStorage.setItem("email", email);
                localStorage.setItem("senha", senha);
            } else {
                localStorage.removeItem("email");
                localStorage.removeItem("senha");
            }
            window.location.href = "./home";
        } else {
            const { error } = await response.json();
            const msgErro = document.getElementById("msg_erro_login");
            if (msgErro) {
                msgErro.innerText = error;
                msgErro.style.display = "block";
            }
        }
    }).catch((error) => {
        console.log(error);
    })
    return;
}

async function RealizarCadastro(nome: string, email: string, senha: string): Promise<void> {
    const url: string = "http://localhost:3000/cadastro";
    const data: object = {
        nome: nome,
        email: email,
        senha: senha
    };

    const bnt_lembrar_senha: HTMLInputElement = document.getElementById("lembrar_senha") as HTMLInputElement;

    await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    }).then(async (response) => {
        if (response.status == 200) {
            const { token } = await response.json();
            localStorage.setItem("token", token);
            if (localStorage.getItem("token") === null) {
                console.log("Token não encontrado");
                return;
            }
            if (bnt_lembrar_senha.checked) {
                localStorage.setItem("email", email);
                localStorage.setItem("senha", senha);
            } else {
                localStorage.removeItem("email");
                localStorage.removeItem("senha");
            }
            window.location.href = "./home";
        } else {
            const { error } = await response.json();
            const msgErro = document.getElementById("msg_erro_cadastro");
            if (msgErro) {
                msgErro.innerText = error;
                msgErro.style.display = "block";
            }
        }
    }).catch((error) => {
        console.log(error);
    })
    return;
}


function Alterar_Tela(): void {
    document.querySelectorAll(".conteiner_dados").forEach((element) => {
        if (element.id === "habilitado") {
            element.id = "desabilitado";
        } else {
            element.id = "habilitado";
        }
    })
}

function Cadastro_to_Login(): void {
    const circulos: HTMLDivElement = document.querySelector(".circulos") as HTMLDivElement
    const circle1: HTMLDivElement = circulos.querySelector("#circulo1") as HTMLDivElement;
    const circle2: HTMLDivElement = circulos.querySelector("#circulo2") as HTMLDivElement;

    circulos.insertBefore(circle2, circle1);
    circulos.setAttribute("id", "login")
    Alterar_Tela();
}

function Login_to_Cadastro(): void {
    const circulos: HTMLDivElement = document.querySelector(".circulos") as HTMLDivElement
    const circle1: HTMLDivElement = circulos.querySelector("#circulo1") as HTMLDivElement;
    const circle2: HTMLDivElement = circulos.querySelector("#circulo2") as HTMLDivElement;

    circulos.insertBefore(circle1, circle2);
    circulos.setAttribute("id", "circulos-cadastro")
    Alterar_Tela();
}

function realiza_login_google(response: any) {
    console.log(response);
}

window.onload = function () {
    const bntLogin: HTMLButtonElement = document.getElementById("realiza_login_btn") as HTMLButtonElement;
    const bnt_login_to_cadastro: HTMLButtonElement = document.getElementById("criar_conta_btn") as HTMLButtonElement;
    const bnt_login_to_cadastro2: HTMLButtonElement = document.getElementById("criar_conta_btn_to_840px") as HTMLButtonElement;
    const bnt_alterar_tela: HTMLButtonElement = document.getElementById("alterar_tela") as HTMLButtonElement;
    const bnt_lembrar_senha_login: HTMLInputElement = document.querySelector("#realiza_login #lembrar_senha") as HTMLInputElement;
    const bnt_lembrar_senha_cadastro: HTMLInputElement = document.querySelector("#realiza_cadastro #lembrar_senha") as HTMLInputElement;

    const bnt_cadastro_to_login: HTMLButtonElement = document.getElementById("realizar_login_bnt") as HTMLButtonElement;
    const bnt_cadastro_to_login2: HTMLButtonElement = document.getElementById("login_btn_to_840px") as HTMLButtonElement;
    const realiza_cadastro: HTMLButtonElement = document.getElementById("realiza_cadastro_btn") as HTMLButtonElement;


    if (!bntLogin || !bnt_login_to_cadastro || !bnt_login_to_cadastro2
        || !bnt_alterar_tela || !bnt_cadastro_to_login || !bnt_cadastro_to_login2
        || !realiza_cadastro || !bnt_lembrar_senha_login) {
        console.log("Elemento não encontrado");
        return;
    }

    if (bnt_lembrar_senha_login.checked) {
        const email: HTMLInputElement = document.getElementById("email_login") as HTMLInputElement;
        const senha: HTMLInputElement = document.getElementById("senha_login") as HTMLInputElement;
        const email_login: string = localStorage.getItem("email") as string;
        const senha_login: string = localStorage.getItem("senha") as string;
        if (!email || !senha || !email_login || !senha_login) {
            console.log("Elemento não encontrado");
            return;
        }
        email.value = email_login;
        senha.value = senha_login;
    }

    bnt_lembrar_senha_login.addEventListener("click", function () {
        bnt_lembrar_senha_login.checked = bnt_lembrar_senha_login.checked ? false : true;
    })

    bntLogin.addEventListener("click", function () {
        window.location.href = "./home.html";
        return;
        const email: HTMLInputElement = document.getElementById("email_login") as HTMLInputElement;
        const senha: HTMLInputElement = document.getElementById("senha_login") as HTMLInputElement;

        if (!email || !senha) {
            console.log("Elemento não encontrado");
            return;
        }

        if (email.value == "" || senha.value == "") {
            email.value === "" ? email.classList.add("error") : email.classList.remove("error");
            senha.value === "" ? senha.classList.add("error") : senha.classList.remove("error");
        } else {
            email.classList.remove("error");
            senha.classList.remove("error");
            RealizarLogin(email.value, senha.value);
        }
    })

    realiza_cadastro.addEventListener("click", function () {
        window.location.href = "./home.html";
        return;
    })

    bnt_lembrar_senha_login.addEventListener("click", function () {
        bnt_lembrar_senha_login.checked = bnt_lembrar_senha_login.checked ? false : true;
    })

    bnt_lembrar_senha_cadastro.addEventListener("click", function () {
        bnt_lembrar_senha_cadastro.checked = bnt_lembrar_senha_cadastro.checked ? false : true;
    })
    bnt_login_to_cadastro.addEventListener("click", () => {
        Login_to_Cadastro();
    });
    bnt_login_to_cadastro2.addEventListener("click", () => {
        Login_to_Cadastro();
    })
    bnt_alterar_tela.addEventListener("click", () => {
        Alterar_Tela();
        document.querySelectorAll(".circulos").forEach((element) => {
            if (element.getAttribute("hidden") === null) {
                element.setAttribute("hidden", "");
            } else {
                element.removeAttribute("hidden");
                if (element.getAttribute("id") === null) {
                    element.setAttribute("id", "circulos-login")
                }
            }
        })
    });
    bnt_cadastro_to_login.addEventListener("click", () => {
        Cadastro_to_Login();
    });
    bnt_cadastro_to_login2.addEventListener("click", () => {
        Cadastro_to_Login();
    });

}