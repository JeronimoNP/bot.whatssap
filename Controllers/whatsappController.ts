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

        // Verifica se há arquivos de autenticação se não autenticar
        const fs = require('fs')
        if(!fs.readdirSync('../bot.whatssap/auth_info_baileys').length){
            // Cria uma nova instância do socket do WhatsApp com autenticação qr-code
            console.log("Não há arquivos de autenticação, Fazendo autenticação")
            const sock = makeWASocket({
                version, // Define a versão do WhatsApp Web
                printQRInTerminal: true, // Usa o logger definido anteriormente
                auth: state // Usa o estado de autenticação carregado do arquivo
            });
            // Atualiza as credenciais de autenticação sempre que houver mudanças
            sock.ev.on('creds.update', saveCreds);
            //escuta as conversar e responde
            response.escuta(sock, state)
        }else{
            console.log("estou aqui!, %s", fs.readdirSync('../bot.whatssap/auth_info_baileys').length);
            // Cria uma nova instância do socket do WhatsApp com autenticação ultimo estado
            const sock = makeWASocket({
                version, // Define a versão do WhatsApp Web
                logger, // Usa o logger definido anteriormente
                auth: state // Usa o estado de autenticação carregado do arquivo
            })
            // Atualiza as credenciais de autenticação sempre que houver mudanças
            sock.ev.on('creds.update', saveCreds)
            //escuta as conversar e responde
            response.escuta(sock, state)
        }


        console.log("Conectado ao WhatsApp")
    } catch (error) {
        console.error("Erro ao iniciar a conexão:", error)
    }
}

export default{
    startSock // Inicia a função principal para estabelecer a conexão
}