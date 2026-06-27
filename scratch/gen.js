const fs = require('fs');

async function generate(voice, name, text) {
    const endpoint = 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1';
    const ssml = <speak version='1.0' xml:lang='pt-BR'><voice xml:lang='pt-BR' name=' + voice + '><prosody rate='+10%' pitch='+2%'> + text + </prosody></voice></speak>;

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': 'REMOVED_FOR_SECURITY',
            'Content-Type': 'application/ssml+xml; charset=utf-8',
            'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
            'User-Agent': 'NexusTTS'
        },
        body: ssml
    });

    if(!res.ok) {
        console.error('Error generating ' + name + ':', await res.text());
        return;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const path = 'C:/Users/geand/.gemini/antigravity/brain/b527935f-7f52-46c8-bb48-c754fcdca006/scratch/' + name + '.mp3';
    fs.writeFileSync(path, buffer);
    console.log('Saved ' + path);
}

async function main() {
    await generate('pt-BR-YaraNeural', 'yara', 'Olá Comandante! Aqui é a Yara, a nova voz da Rádio Automotizer. Meu tom é dinâmico e perfeito para anúncios e previsões do tempo.');
    await generate('pt-BR-JulioNeural', 'julio', 'Fala, Patrão! Aqui é o Júlio, no comando da programação. Com esse pique, a Rádio Automotizer vai dominar as transmissões locais.');
}
main();
