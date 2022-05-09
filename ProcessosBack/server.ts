import { Request, Response } from "express";
import {
  createUser,
  getAllUsers,
  deleteUser,
  getUser,
  getUserById,
} from "./knex/querries/users";
import { db } from "./knex/config/database";
import { User } from "../common/user";

const express = require("express");
const bodyParser = require("body-parser");

var app = express();

var allowCrossDomain = function (req: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);
app.use(bodyParser.json());

app.post("/api/cadastrar", async (req: Request, res: Response) => {
  var user = req.body;
  const userId = await createUser(user);

  if (userId) {
    user = await getUserById(userId);
    console.log(
      `[SERVIDOR] Usuário cpf ${user.cpf} foi registrado com id ${userId}`
    );
    res.send({ success: user });
  } else {
    res.send({ failure: "Usuário não pode ser cadastrado" });
  }
});

app.get("/api/usuarios", async (req: Request, res: Response) => {
  const users = await getAllUsers();

  if (users) {
    console.log(`[SERVIDOR] Buscando ${users.length} usuários`);
    res.send({ success: users });
  } else {
    res.send({ failure: "Não pode buscar todos os usuários" });
  }
});

app.delete("/api/apagar", async (req: Request, res: Response) => {
  const cpf: string = req.body.cpf;
  const success = await deleteUser(cpf);

  if (success) {
    console.log(`[SERVIDOR] Usuário cpf ${cpf} foi deletado da base de dados`);
    res.send({ success: `Usuário cpf ${cpf} deletado com sucesso` });
  } else {
    res.send({ failure: `Não pode deletar usuário cpf: ${cpf}` });
  }
});

app.get("/api/auth", async (req: Request, res: Response) => {
  const cpf = req.query.cpf as string;
  const password = req.query.password as string;

  const user = await getUser(cpf, password);

  if (user) {
    console.log(`[SERVIDOR] Buscando usuário cpf ${cpf}`);
    res.send({ success: user });
  } else {
    res.send({ failure: "Não pode encontrar usuário com essas credenciais" });
  }
});

var server = app.listen(3000, async () => {
  console.log("[SERVIDOR] Servidor aberto na porta 3000");
  console.log("[SERVIDOR] Servidor conectado à base de dados");
});

const closeServer = () => {
  server.close();
  db.destroy();
};

export { server, closeServer };