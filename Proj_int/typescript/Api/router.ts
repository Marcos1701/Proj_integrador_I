import express, { Application, Router, Request, Response } from "express";

import {
    Login_via_Google, Login_via_Email, Cadastro
} from './api_login.js'


const app: Application = express();
const router: Router = express.Router();

app.use(express.json());

router.get('/', (req: Request, res: Response) => {
    res.send("api rodando")
});

router.post('/login/google', Login_via_Google);
router.post('/login/', Login_via_Email);
router.post('/cadastro/', Cadastro);

export default router;