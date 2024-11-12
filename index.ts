import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'

// Use o método `useMultiFileAuthState` para armazenar múltiplos arquivos de autenticação
const connectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_multi')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Conexão fechada devido a', lastDisconnect?.error, ', reconectando:', shouldReconnect)
            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('Conexão aberta')
        }
    })

    sock.ev.on('messages.upsert', async (m) => {
        console.log(JSON.stringify(m, undefined, 2))
        console.log('Respondendo para', m.messages[0].key.remoteJid)
        await sock.sendMessage(m.messages[0].key.remoteJid!, { text: 'Olá!' })
    })
}

// Executar a função principal
connectToWhatsApp()
