// import { Boom } from '@hapi/boom';
// import makeWASocket, { DisconnectReason, useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';
import response from '../Controllers/whatssapResponse';

// let sock: WASocket | null = null;

import makeWASocket, { AnyMessageContent, delay, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import { useMultiFileAuthState } from '@whiskeysockets/baileys'
import Pino from 'pino'

// Configurações de autenticação

const logger = Pino({ level: 'info' })

async function startSock() {
    try {
        // Obtém a versão mais recente do WhatsApp Web
        const { version, isLatest } = await fetchLatestBaileysVersion()
        console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
        const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys')
        // Cria uma nova instância do socket do WhatsApp
        const sock = makeWASocket({
            version, // Define a versão do WhatsApp Web
            logger, // Usa o logger definido anteriormente
            auth: state // Usa o estado de autenticação carregado do arquivo
        })
        response.escuta(sock, state)
        // Atualiza as credenciais de autenticação sempre que houver mudanças
        sock.ev.on('creds.update', saveCreds)


        console.log("Conectado ao WhatsApp")
    } catch (error) {
        console.error("Erro ao iniciar a conexão:", error)
    }
}

export default{
    startSock // Inicia a função principal para estabelecer a conexão
}