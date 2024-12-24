import dotenv from 'dotenv';
dotenv.config();

const { NUMBERCEL } = process.env;

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
                    const text = msg.mensagens?.conversation || msg.mensagens?.extendedTextMessage?.text

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
                            console.log("\n %s \n",remoteJid)
                            if (remoteJid === keyphone.remoteJid) {
                                // Envia uma resposta automática
                                await sock.sendMessage(remoteJid, { text: 'Olá! Esta é uma resposta automática.' })
                            }
                        }
                    }
                }
            })
}

export default {
    response,
    escuta
}