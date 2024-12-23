import { Boom } from '@hapi/boom';
import makeWASocket, { DisconnectReason, useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';
import response from '../Controllers/whatssapResponse';

let sock: WASocket | null = null;

// Função para conectar ao WhatsApp
export const connectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_multi');
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Conexão fechada devido a', lastDisconnect?.error, ', reconectando:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp(); // Tenta reconectar
            } else {
                console.log('Autenticação falhou, gere um novo QR code para conectar.');
            }
        } else if (connection === 'open') {
            console.log('Conectado ao WhatsApp');
            response.response(sock);
        }
    });

    return sock;
};

export default {
    connectToWhatsApp
}