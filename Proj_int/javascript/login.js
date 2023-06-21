"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function RealizarLogin(email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "http://localhost:3000/login";
        const data = {
            email: email,
            senha: senha
        };
        const bnt_lembrar_senha = document.getElementById("lembrar_senha");
        yield fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        }).then((response) => __awaiter(this, void 0, void 0, function* () {
            if (response.status == 200) {
                const { token } = yield response.json();
                localStorage.setItem("token", token);
                if (localStorage.getItem("token") === null) {
                    console.log("Token não encontrado");
                    return;
                }
                if (bnt_lembrar_senha.checked) {
                    localStorage.setItem("email", email);
                    localStorage.setItem("senha", senha);
                }
                else {
                    localStorage.removeItem("email");
                    localStorage.removeItem("senha");
                }
                window.location.href = "./home";
            }
            else {
                const { error } = yield response.json();
                const msgErro = document.getElementById("msg_erro_login");
                if (msgErro) {
                    msgErro.innerText = error;
                    msgErro.style.display = "block";
                }
            }
        })).catch((error) => {
            console.log(error);
        });
        return;
    });
}
function RealizarCadastro(nome, email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "http://localhost:3000/cadastro";
        const data = {
            nome: nome,
            email: email,
            senha: senha
        };
        const bnt_lembrar_senha = document.getElementById("lembrar_senha");
        yield fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        }).then((response) => __awaiter(this, void 0, void 0, function* () {
            if (response.status == 200) {
                const { token } = yield response.json();
                localStorage.setItem("token", token);
                if (localStorage.getItem("token") === null) {
                    console.log("Token não encontrado");
                    return;
                }
                if (bnt_lembrar_senha.checked) {
                    localStorage.setItem("email", email);
                    localStorage.setItem("senha", senha);
                }
                else {
                    localStorage.removeItem("email");
                    localStorage.removeItem("senha");
                }
                window.location.href = "./home";
            }
            else {
                const { error } = yield response.json();
                const msgErro = document.getElementById("msg_erro_cadastro");
                if (msgErro) {
                    msgErro.innerText = error;
                    msgErro.style.display = "block";
                }
            }
        })).catch((error) => {
            console.log(error);
        });
        return;
    });
}
function Alterar_Tela() {
    document.querySelectorAll(".conteiner_dados").forEach((element) => {
        if (element.id === "habilitado") {
            element.id = "desabilitado";
        }
        else {
            element.id = "habilitado";
        }
    });
}
window.onload = function () {
    const bntLogin = document.getElementById("realiza_login_btn");
    const login_via_google = document.getElementById("logo_google");
    const bnt_login_to_cadastro = document.getElementById("criar_conta_btn");
    const bnt_login_to_cadastro2 = document.getElementById("criar_conta_btn_to_840px");
    const bnt_alterar_tela = document.getElementById("alterar_tela");
    const bnt_lembrar_senha = document.getElementById("lembrar_senha");
    const bnt_cadastro_to_login = document.getElementById("realizar_login_bnt");
    const bnt_cadastro_to_login2 = document.getElementById("login_btn_to_840px");
    const realiza_cadastro = document.getElementById("realiza_cadastro_btn");
    if (!bntLogin || !bnt_login_to_cadastro || !bnt_login_to_cadastro2) {
        console.log("Elemento não encontrado");
        return;
    }
    if (bnt_lembrar_senha.checked) {
        const email = document.getElementById("email_login");
        const senha = document.getElementById("senha_login");
        const email_login = localStorage.getItem("email");
        const senha_login = localStorage.getItem("senha");
        if (!email || !senha || !email_login || !senha_login)
            return;
        email.value = email_login;
        senha.value = senha_login;
    }
    bntLogin.addEventListener("click", function () {
        const email = document.getElementById("email_login");
        const senha = document.getElementById("senha_login");
        if (!email || !senha)
            return;
        if (email.value == "" || senha.value == "") {
            email.value === "" ? email.classList.add("error") : email.classList.remove("error");
            senha.value === "" ? senha.classList.add("error") : senha.classList.remove("error");
        }
        else {
            email.classList.remove("error");
            senha.classList.remove("error");
            RealizarLogin(email.value, senha.value);
        }
    });
    login_via_google.addEventListener("click", function () {
        window.location.href = "./auth/google";
    });
    bnt_lembrar_senha.addEventListener("click", function () {
        if (bnt_lembrar_senha.checked) {
            bnt_lembrar_senha.checked = false;
        }
        else {
            bnt_lembrar_senha.checked = true;
        }
    });
    bnt_login_to_cadastro.addEventListener("click", Alterar_Tela);
    bnt_login_to_cadastro2.addEventListener("click", Alterar_Tela);
    bnt_alterar_tela.addEventListener("click", Alterar_Tela);
};
