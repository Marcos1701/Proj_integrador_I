"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_js_1 = __importDefault(require("./router.js"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.use(router_js_1.default);
app.get('/', (req, res) => {
    res.send('Bem vindo ao microblog!!');
});
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
