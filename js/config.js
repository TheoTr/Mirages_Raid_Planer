const CONFIG = {
    API_KEY: "lKi0h04H9wHAHkElRrcNS6hPvYFo92fPHK7YRCGn",
    SERVER_ID: "841675295752323092", // ID de ton serveur Discord
    MY_DISCORD_ID: "579155972115660803", // Clic droit sur ton nom dans Discord -> Copier l'ID
    DEFAULT_CHANNEL_ID: "1491686806628864030", // ID du channel où les raids seront créés (peut être n'importe quel channel du serveur, c'est juste pour l'API)
    PROXY: "https://corsproxy.io/?",
    BASE_URL: "https://raid-helper.xyz/api/v4",
    
    RAID_PRESETS: {
        'kz': {
            title: "Karazhan (10)",
            templateId: "wowtbc", // Utilise templateId comme sur ton screen
            categoryId: "1491788232575418500" 
        },
        'gruul': {
            title: "Gruul / Magthéridon (25)",
            templateId: "wowtbc",
            categoryId: "1491788302452391956"
        }
    },
        CLASS_COLORS: {
        'warrior': '#C79C6E', 'paladin': '#F58CBA', 'hunter': '#ABD473',
        'rogue': '#FFF569', 'priest': '#FFFFFF', 'shaman': '#0070DE',
        'mage': '#40C7EB', 'warlock': '#8787ED', 'druid': '#FF7D0A'
    }
};

