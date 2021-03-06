import { Process } from "../../../common/process";
import { User } from "../../../common/user";
import { db } from "../config/database";

const getRandomJudgeId = async (): Promise<number | null> => {
  try {
    const query = await db("users").select("id").where({ role: "juiz" });
    if (!query.length)
      throw Error("Não foi possível encontrar um juiz para o processo");

    const randomIndex = Math.floor(Math.random() * query.length);
    return query[randomIndex].id;
  } catch (err: any) {
    console.log(err.message);
  }

  return null;
};

export const createProcess = async (process: any): Promise<number | null> => {
  try {
    const judgeId = (await getRandomJudgeId()) as any;
    process.judgeId = judgeId;

    const query = await db("processes").insert(process);
    return query[0];
  } catch (err: any) {
    console.log(err.message);
  }
  return null;
};

export const updateProcess = async (process: any): Promise<number | null> => {
  try {
    const query = await db("processes")
      .where({ id: process.id })
      .update(process);
    return query;
  } catch (err: any) {
    console.log(err.message);
  }
  return null;
};

export const getAllProcess = async (): Promise<Process[] | null> => {
  try {
    const query = await db("processes").orderBy("startDate", "desc");
    return query;
  } catch (err: any) {
    console.log(err.message);
  }
  return null;
};

export const deleteProcess = async (id: number): Promise<number | null> => {
  try {
    const query = await db("processes").where({ id: id }).del();
    return query;
  } catch (err: any) {
    console.log(err.message);
  }

  return null;
};

export const getProcessesByLawyerId = async (
  lawyerId: number
): Promise<Process[] | null> => {
  try {
    const query = await db("processes")
      .where({ authorId: lawyerId })
      .orWhere({ defendantId: lawyerId })
      .select()
      .orderBy("startDate", "desc");
    return query.length ? query : null;
  } catch (err: any) {
    console.log(err.message);
  }
  return null;
};

export const getProcessesByJudgeId = async (
  judgeId: number
): Promise<Process[] | null> => {
  try {
    const query = await db("processes")
      .where({ judgeId: judgeId })
      .select()
      .orderBy("startDate", "desc");
    return query.length ? query : null;
  } catch (err: any) {
    console.log(err.message);
  }
  return null;
};

export const getProcessById = async (id: number): Promise<Process | null> => {
  try {
    const query = await db("processes")
      .where({ id: id })
      .select()
      .orderBy("startDate", "desc");
    return query.length ? query[0] : null;
  } catch (err: any) {
    console.log(err.message);
  }
  return null;
};

export const updateDefendants = async (defendant: User): Promise<void> => {
  try {
    await db("processes")
      .where({ defendantCpf: defendant.cpf })
      .update({ defendantId: defendant.id });
  } catch (err: any) {
    console.log(err.message);
  }
};
