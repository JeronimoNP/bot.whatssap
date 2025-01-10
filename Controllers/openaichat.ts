//bibliotecas necessarias para o bot
import Openai from "openai";
import Configuration from "openai";

const configuracoes = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new Openai();


export const generateResponse = async (prompt: string, res: string) => {

} 