import dotenv from 'dotenv';
dotenv.config();

const { SECRET_KEY } = process.env;

const key = {
    remoteJid: SECRET_KEY+'.Whatsapp.net',
}

async function response(sock: any) {
    sock.ev.on('message.upsert', async (mensagens:any) => {
        if(mensagens.type === 'notify'){    
        
        }
    })

}

export default {
    response
}