const fs = require('fs');
let clientPage = fs.readFileSync('src/app/palestras/[slug]/preview/client-page.tsx', 'utf8');

clientPage = clientPage.replace(
    "const { t, locale } = useLocale();",
    "const { t, locale } = useLocale();\n    const [debugLogs, setDebugLogs] = useState<string[]>([]);\n    const logDebug = (msg: string) => { setDebugLogs(prev => [...prev, msg]); };"
);

clientPage = clientPage.replace(
    "const handlePlayAllToggle = () => {",
    "const handlePlayAllToggle = () => {\n        logDebug('handlePlayAllToggle clicked. Active: ' + isPlaylistActive);"
);

clientPage = clientPage.replace(
    "const playTrack = useCallback((index: number) => {",
    "const playTrack = useCallback((index: number) => {\n        logDebug('playTrack called with index ' + index);"
);

clientPage = clientPage.replace(
    "preloadAudio(t(nextTrack.text as any), nextTrack.speaker as string, locale);",
    "try { preloadAudio(t(nextTrack.text as any), nextTrack.speaker as string, locale); logDebug('preloadAudio succeeded'); } catch(e:any) { logDebug('preloadAudio error: ' + e.message); }"
);

clientPage = clientPage.replace(
    "playAudio({\n            text: t(track.text as any),",
    "logDebug('calling playAudio for text: ' + track.text);\n        playAudio({\n            text: t(track.text as any),"
);

clientPage = clientPage.replace(
    "<ScrollArea className=\"h-[400px] mt-4 p-4 border rounded-lg border-secondary\">",
    "<div className=\"bg-black text-green-500 p-4 font-mono text-xs overflow-auto h-32\">DEBUG LOGS:<br/>{debugLogs.map((l,i) => <div key={i}>{l}</div>)}</div>\n<ScrollArea className=\"h-[400px] mt-4 p-4 border rounded-lg border-secondary\">"
);

fs.writeFileSync('src/app/palestras/[slug]/preview/client-page.tsx', clientPage);
