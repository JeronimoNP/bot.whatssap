"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
// Use o método `useMultiFileAuthState` para armazenar múltiplos arquivos de autenticação
const connectToWhatsApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)('./auth_info_multi');
    const sock = (0, baileys_1.default)({
        auth: state,
        printQRInTerminal: true
    });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        var _a, _b;
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
            console.log('Conexão fechada devido a', lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ', reconectando:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        }
        else if (connection === 'open') {
            console.log('Conexão aberta');
        }
    });
    sock.ev.on('messages.upsert', (m) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(JSON.stringify(m, undefined, 2));
        console.log('Respondendo para', m.messages[0].key.remoteJid);
        yield sock.sendMessage(m.messages[0].key.remoteJid, { text: 'Olá!' });
    }));
});
// Executar a função principal
connectToWhatsApp();
