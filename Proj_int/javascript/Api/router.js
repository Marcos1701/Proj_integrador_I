"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_login_js_1 = require("./api_login.js");
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use(express_1.default.json());
router.get('/', (req, res) => {
    res.send("api rodando");
});
router.post('/login/google', api_login_js_1.Login_via_Google);
router.post('/login/', api_login_js_1.Login_via_Email);
router.post('/cadastro/', api_login_js_1.Cadastro);
exports.default = router;
