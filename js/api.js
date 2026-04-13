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

    async fetchCompDetails(compId) {
        const url = `${CONFIG.BASE_URL}/comps/${compId}?t=${Date.now()}`;
        const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
            headers: { "Authorization": CONFIG.API_KEY }
        });
        return await response.json();
    },

    async createRaid(presetKey, date, time, channelId, suffix) {
        const preset = CONFIG.RAID_PRESETS[presetKey];
        const customTitle = suffix ? `${preset.title} de ${suffix}` : preset.title;
        const url = `${CONFIG.BASE_URL}/servers/${CONFIG.SERVER_ID}/channels/${channelId}/event`;
        const body = {
            leaderId: String(CONFIG.MY_DISCORD_ID),
            templateId: preset.templateId,
            date: date,
            time: time,
            title: customTitle,
            description: "Raid planifié via Mirages Manager"
        };
        const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
            method: 'POST',
            headers: { "Authorization": CONFIG.API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            let errorMsg;
            try {
                const errJson = await response.json();
                errorMsg = errJson.message || JSON.stringify(errJson);
            } catch(e) {
                errorMsg = await response.text();
            }
            throw new Error(errorMsg);
        }
        return await response.json();
    },

    async postEmbed(channelId, embedData) {
        const url = `${CONFIG.BASE_URL}/servers/${CONFIG.SERVER_ID}/channels/${channelId}/embed`;
        const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
            method: 'POST',
            headers: {
                "Authorization": CONFIG.API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(embedData)
        });
        if (!response.ok) {
            let errorMsg;
            try {
                const errJson = await response.json();
                errorMsg = errJson.message || JSON.stringify(errJson);
            } catch(e) {
                errorMsg = await response.text();
            }
            throw new Error(errorMsg);
        }
        return await response.json();
    },

    async updateCompSlot(compId, groupId, slotId, playerData) {
        const url = `${CONFIG.BASE_URL}/comps/${compId}/groups/${groupId}/slots/${slotId}`;
        const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
            method: 'PATCH',
            headers: { "Authorization": CONFIG.API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({
                name: playerData.name,
                className: playerData.className,
                specName: playerData.specName,
                isConfirmed: "confirmed"
            })
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Erreur mise à jour slot');
        }
        return await response.json();
    },

    async deleteCompSlot(compId, groupId, slotId) {
        const url = `${CONFIG.BASE_URL}/comps/${compId}/groups/${groupId}/slots/${slotId}`;
        const response = await fetch(CONFIG.PROXY + encodeURIComponent(url), {
            method: 'DELETE',
            headers: { "Authorization": CONFIG.API_KEY }
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Erreur suppression slot');
        }
        return await response.json();
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
    },
};