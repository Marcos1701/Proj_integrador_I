"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = __importDefault(require("pg"));
const client = new pg_1.default.Client({
    host: 'localhost',
    port: 5432,
    database: 'planr',
    user: 'postgres',
    password: 'postgres'
});
exports.client = client;
client.connect();
