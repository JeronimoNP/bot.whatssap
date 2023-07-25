const { Client } = require('whatsapp-web.js');          //Utilizando a api whatsapp-web.js para fazer a ponte do codigo e whatssap
const { MessageMedia } = require('whatsapp-web.js');
const ytdl = require('ytdl-core');                      //Api para baixar video do youtuber
const qrcode = require('qrcode-terminal');              //Api para criação do qr code para linkar a conta do whatssap
const path = require('path');
const fs = require('fs');


const client = new Client();

//linkando usuario
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);   //gerando qr code no terminal
    qrcode.generate(qr, {small: true, scale: 1}, (qrcode) =>{
      console.log(qrcode);
    })
});

//linkado com sucesso
client.on('ready', () => {
    console.log('Conectado');
});

//baixando video do youtuber usando ytdl-core
client.on('message', async (message) => {
  if (message.body.startsWith('!video')) {        //quando mandarmos !video <link> ele vai executar o codigo.
    const numero = message.from;                  //numero do cliente
    const videoUrl = message.body.split(' ')[1];  //pegando link


    message.reply('Okay mestre, só um instante!');

    try {                                         //caso ocorra algum erro ao baixar o video não encerrar o programa      
      const filtro = {
        quality: '480p',
      };

      let info = await ytdl.getInfo(videoUrl, {filter: filtro});
      let videoTitle = info.videoDetails.title;
      let videoStream = ytdl(videoUrl);
    
      const baseDir = 'home/bot.whatssap/videosbaixados'; // Diretório base onde o arquivo será salvo
      const filePath = path.join(baseDir, `${videoTitle.substring(0, 20).replace('|', '')}.mp4`);
    
      videoStream.pipe(fs.createWriteStream(filePath));
    
      videoStream.on('end', () => {
        let videoData = MessageMedia.fromFilePath(filePath);
        //let fileAddress = path.resolve(filePath);
    
        message.reply('Enviando video!😁');
    
        client.sendMessage(numero, videoData, {
          caption: 'Aqui está, mestre!',
          sendMediaAsDocument: true
        });
      });
    } catch (error) {
      console.error('Erro ao baixar o vídeo:', error);
      message.reply('Ocorreu um erro ao baixar o vídeo.');
    }
  }
});



client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
    if(msg.body == 'Oi' || msg.body == 'oi'){
      msg.reply('Olá 👋 aqui e a Big um bot pronto para ajudar vc em algumas coisas olha o que posso fazer!!\n\n* !video <link>    Posso baixar vídeos do youtuber e lhe mandar!\n* !ping          Para saber se estou disponível.\n\n\n\nbot ainda em fase de desenvolvimento pelo Jerônimo😁');
    }
});

client.initialize(); 
