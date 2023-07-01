import router from './router'
import express, { Application } from "express";
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(express.static('public'));

app.listen(3000, () => {
    console.log("API rodando");
});

