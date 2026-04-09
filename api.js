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
    }
};
