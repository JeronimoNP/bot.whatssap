import dotenv from 'dotenv';
import api  from '../services/ApiIA';
const axios = require('axios');
dotenv.config();

const { NUMBERCEL, PORT } = process.env;

if (!NUMBERCEL) {
    throw new Error('NUMBERCEL is not defined in the environment variables');
}

const keyphone = {
    remoteJid: `${NUMBERCEL}@s.whatsapp.net`,
}
console.log("\n %s \n", keyphone);

async function response(sock: any) {
    sock.ev.on('message.upsert', async (mensagens:any) => {
        if(mensagens.type === 'notify'){    
            for(const msg of sock.mensagens)
                if(msg.mensagens){
                    const remoteJid = msg.key.remoteJid

                    if(remoteJid === keyphone.remoteJid){
                        await sock.sendMessage(remoteJid, {text: 'Olá, estou escutando você!'})
                    }
                }
        }
    })

}
async function escuta(sock: any, state: any) {
            // Escuta por novas mensagens
            sock.ev.on('messages.upsert', async (m: { type: string; messages: any[] }) => {
                console.log(JSON.stringify(m, undefined, 2)) // Loga as mensagens recebidas
    
                if (m.type === 'notify') { // Verifica se o tipo de evento é uma notificação de mensagem
                    for (const msg of m.messages) { // Itera sobre as mensagens recebidas
                        if (msg.message) { // Verifica se a mensagem não está vazia
                            const remoteJid = msg.key.remoteJid // Obtém o JID remoto (identificador do remetente)
                            const text = msg.message.conversation || msg.message.extendedTextMessage?.text // Obtém o texto da mensagem
    
                            // Adiciona logs adicionais para depuração
                            console.log(`Mensagem recebida de ${remoteJid}: ${text}`)
                            
                            // Verifica se a mensagem é do próprio número
                        
                            if (remoteJid === keyphone.remoteJid) {
                                // Envia uma resposta automática
                                const text1 = msg.message?.conversation || msg.message?.extendedTextMessage?.text
                                const botResponse = await api.sendToGPT4All(text1, Number(PORT));
                            
                                console.log("botResponse: ", text1);
                                await sock.sendMessage(remoteJid, {"text": botResponse});
                                
                            }
                        }
                    }
                }
            })
}

// async function sendToGPT4All(text: string, PORT: number): Promise<string> {

//     try {
//         const response = await axios.post(`http://localhost:${PORT}/api/generate`, {
//             "model": "llama3.2",
//             "prompt": text,
//             "stream": false,
//             "system": "regras 1°responde de forma educada. 2°é repreenda caso seja desrespeitoso com você.3°só responda assuntos relacionados a saúde, caso não seja sobre saúde, responda que não pode responder.4°seu objetivo unicamente é ajudar na alimentação, dando dicas e ajudando na alimentação tanto do dia a dia quanto planejando no futuro.5°caso o usuário queira um plano pergunte sobre a alimentação atual, quanto hábitos é monte um plano personalizado, seguindo métodos científicos comprovados.6°tenha a função também de mensurar calorias com base no tipo de alimento e peso é no final mostre o total de calorias consumidas na refeição.7°se o usuário é novo, diga quem você é, mostre em que você possa ser útil é mostre suas funcionalidades.",
//             "templete": "Depois de ter se apresentado pela primeira vez, as respostas seguintes devem ser mais curtas, diretas e objetivas. Seja educado, respeitoso e prestativo. Seja claro e objetivo nas respostas"
//         });
//         return response.data.response.toString();
//     } catch (error) {
//         console.error('Error sending to GPT-4 All:', error);
//         throw error;
//     }

// }

export default {
    escuta
}