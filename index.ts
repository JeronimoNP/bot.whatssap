import startSock from './Controllers/whatsappController';//startSock é a inicialização do bot

// Função principal para iniciar o bot
const startBot = async () => {
    try {
        // Conecta ao WhatsApp
        await startSock.startSock();
        // Caso a conectividade não seja bem-sucedida, retorna um erro
    } catch (error) {
        console.error('Erro ao iniciar o bot:', error);
    }
};

// Inicia o bot
startBot();
