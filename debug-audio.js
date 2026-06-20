const fs = require('fs');
let audioHook = fs.readFileSync('src/hooks/use-nexus-audio.ts', 'utf8');

audioHook = audioHook.replace(
    "console.error(`VIX DIAGNOSTIC: Falha no processamento de áudio.`, err);",
    "console.error(`VIX DIAGNOSTIC: Falha no processamento de áudio.`, err);\n                if (typeof window !== 'undefined') window.alert('Erro no áudio: ' + err.message);"
);

audioHook = audioHook.replace(
    "console.warn(\"Preload falhou silenciosamente\", e);",
    "console.warn(\"Preload falhou silenciosamente\", e);\n        if (typeof window !== 'undefined') window.alert('Erro no preload: ' + e.message);"
);

fs.writeFileSync('src/hooks/use-nexus-audio.ts', audioHook);
