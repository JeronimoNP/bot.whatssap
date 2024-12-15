import { connectToWhatsApp } from './Controllers/whatsappController';

// Função principal para iniciar o bot
const startBot = async () => {
    try {
        // Conecta ao WhatsApp
        const sock = await connectToWhatsApp();

    } catch (error) {
        console.error('Erro ao iniciar o bot:', error);
    }
};

// Inicia o bot
startBot();
