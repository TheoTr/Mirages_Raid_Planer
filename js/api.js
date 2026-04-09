const RaidAPI = {
    async fetchAllRaids() {
        const url = `${CONFIG.BASE_URL}/servers/${CONFIG.SERVER_ID}/events?t=${Date.now()}`;
        const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
            headers: { "Authorization": CONFIG.API_KEY }
        });
        const data = await response.json();
        return data.postedEvents || [];
    },

    async fetchRaidDetails(eventId) {
        const url = `${CONFIG.BASE_URL}/events/${eventId}?t=${Date.now()}`;
        const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
            headers: { "Authorization": CONFIG.API_KEY }
        });
        return await response.json();
    },

    async fetchRaidDetails(eventId) {
        const url = `${CONFIG.BASE_URL}/events/${eventId}?t=${Date.now()}`;
        const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
            headers: { "Authorization": CONFIG.API_KEY }
        });
        return await response.json();
    },

    async fetchCompDetails(compId) {
        const url = `${CONFIG.BASE_URL}/comps/${compId}?t=${Date.now()}`;
        const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
            headers: { "Authorization": CONFIG.API_KEY }
        });
        return await response.json();
    },
async createRaid(presetKey, date, time, channelName) {
    const preset = CONFIG.RAID_PRESETS[presetKey];
    
    // On utilise ton proxy habituel
    const url = `${CONFIG.BASE_URL}/servers/${CONFIG.SERVER_ID}/channels/${CONFIG.DEFAULT_CHANNEL_ID}/event`;
    
    const body = {
        leaderId: String(CONFIG.MY_DISCORD_ID),
        templateId: preset.templateId,
        date: date,
        time: time,
        title: preset.title,
        // On met TOUT dans advancedSettings, c'est ce que corsproxy préfère
        advancedSettings: {
            "create_channel": "true",
            "channel_name": String(channelName),
            "channel_category": String(preset.categoryId)
        }
    };

    const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
        method: 'POST',
        headers: { 
            "Authorization": CONFIG.API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
    }

    alert("Raid envoyé ! Vérifie si le salon s'est créé.");
    location.reload();
},

    async deleteRaid(raidId) {
        const url = `${CONFIG.BASE_URL}/events/${raidId}`;
        const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
            method: 'DELETE',
            headers: { "Authorization": CONFIG.API_KEY }
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erreur suppression : ${text}`);
        }
        return await response.json();
    }

};
