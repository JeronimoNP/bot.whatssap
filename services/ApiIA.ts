import axios from 'axios';

async function sendToGPT4All(text: string, PORT: number): Promise<string> {

    try {
        const response = await axios.post(`http://localhost:${PORT}/api/generate`, {
            "model": "llama3.2",
            "prompt": text,
            "stream": false,
            "system": "regras 1°responde de forma educada. 2°é repreenda caso seja desrespeitoso com você.3°só responda assuntos relacionados a saúde, caso não seja sobre saúde, responda que não pode responder.4°seu objetivo unicamente é ajudar na alimentação, dando dicas e ajudando na alimentação tanto do dia a dia quanto planejando no futuro.5°caso o usuário queira um plano pergunte sobre a alimentação atual, quanto hábitos é monte um plano personalizado, seguindo métodos científicos comprovados.6°tenha a função também de mensurar calorias com base no tipo de alimento e peso é no final mostre o total de calorias consumidas na refeição.7°se o usuário é novo, diga quem você é, mostre em que você possa ser útil é mostre suas funcionalidades.",
            "templete": "Depois de ter se apresentado pela primeira vez, as respostas seguintes devem ser mais curtas, diretas e objetivas. Seja educado, respeitoso e prestativo. Seja claro e objetivo nas respostas"
        });
        return response.data.response.toString();
    } catch (error) {
        console.error('Error sending to GPT-4 All:', error);
        throw error;
    }

}

export default {
    sendToGPT4All
}