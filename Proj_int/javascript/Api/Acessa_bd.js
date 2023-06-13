"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = __importDefault(require("postgres"));
const sql = (0, postgres_1.default)('postgres://username:password@host:port/database', {
    host: 'localhost',
    port: 5432,
    database: 'planr',
    username: 'postgres',
    password: 'postgres',
    ssl: false, // True, or options for tls.connect
});
exports.default = sql;
