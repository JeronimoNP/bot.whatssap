const { Client } = require('whatsapp-web.js');
const { MessageMedia } = require('whatsapp-web.js');
const ytdl = require('ytdl-core');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const { stderr } = require('process');
const baixarmusica = require('./mp3');




const client = new Client();

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true, scale: 1}, (qrcode) =>{
      console.log(qrcode);
    })
});



client.on('ready', () => {
    
    console.log('Conectado');
});

client.on('message', async (message) => {
  if (message.body.startsWith('!video')) {
    let numero = message.from;
    const videoUrl = message.body.split(' ')[1];
    try {
      message.reply('Okay mestre, só um instante!');
      const filtro = {
        quality: '480p',
      };
      let info = await ytdl.getInfo(videoUrl, {filter: filtro});
      let videoTitle = info.videoDetails.title;
      let videoStream = ytdl(videoUrl);
    
      const baseDir = 'C:/Users/famil/OneDrive/Documentos/bot.whatssap/videosbaixados'; // Diretório base onde o arquivo será salvo
      let filePath = path.join(baseDir, `${videoTitle}.mp4`);
    
      videoStream.pipe(fs.createWriteStream(filePath/*videoTitle + '.mp4'*/));
    
      videoStream.on('end', () => {
        let videoData = MessageMedia.fromFilePath(filePath);
        let recipient = message.from;
        let fileAddress = path.resolve(filePath);
    
        message.reply('Enviando!');
    
        client.sendMessage(recipient, videoData, {
          caption: 'Aqui está, mestre!',
          sendMediaAsDocument: true
        });
      });
    } catch (error) {
      console.error('Erro ao baixar o vídeo:', error);
      message.reply('Ocorreu um erro ao baixar o vídeo.');
    }
  }
  
  //baixar mp3
  if (message.body.startsWith('!music')) {
    let numero = message.from;
    const videoUrl = message.body.split(' ')[1];
    try {
      message.reply('Aguarde um momento chefia!');//mensagem
      const filtro = {
        filter: 'audioonly',
        quality: 'highestaudio',
        format: 'mp3'
      };
      
      let info = await ytdl.getInfo(videoUrl, {filter: filtro});
      let videoTitle = info.videoDetails.title;
      let videoStream = ytdl(videoUrl);
    
      const baseDir = 'C:/Users/famil/OneDrive/Documentos/bot.whatssap/audiosbaixados'; // Diretório base onde o arquivo será salvo
      let filePath = path.join(baseDir, `${videoTitle}.mp3`);
    
      videoStream.pipe(fs.createWriteStream(filePath));
    
      videoStream.on('end', () => {
        let videoData = MessageMedia.fromFilePath(filePath);
        let recipient = message.from;
        let fileAddress = path.resolve(filePath);
    
        message.reply('Calma!');                  //mensagem
    
        client.sendMessage(recipient, videoData, {
          caption: 'Aqui está, mestre!',
          sendMediaAsDocument: true
        });
      });
    } catch (error) {
      console.error('Erro ao baixar a musica:', error);
      message.reply('Ocorreu um erro ao baixar a musica.');
    }
  }

});



client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
    if(msg.body == 'Oi' || msg.body == 'oi'){
      msg.reply('Olá 👋 aqui e a Big um bot pronto para ajudar vc em algumas coisas olha o que posso fazer!!\n\n* !video <link>    Posso baixar vídeos do youtuber e lhe mandar!\n* !ping          Para saber se estou disponível.\n* !music <link>          Posso baixar e enviar a musica!\n\n\n\nbot ainda em fase de desenvolvimento pelo Jerônimo😁');
    }
});

client.initialize(); 