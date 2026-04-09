const App = {
    currentData: null,

    async init() {
        this.bindEvents();
        await this.loadAllRaids();
    },

    bindEvents() {
        document.getElementById('btn-refresh').onclick = () => location.reload();
        document.getElementById('btn-back').onclick = () => this.showView('list');
        
        document.querySelectorAll('.tab-link').forEach(btn => {
            btn.onclick = (e) => this.switchTab(e.target.dataset.tab);
        });
    },

    async loadAllRaids() {
        const container = document.getElementById('view-list');
        try {
            const raids = await RaidAPI.fetchAllRaids();
            container.innerHTML = raids.map(r => UI.renderRaidCard(r)).join('');
        } catch (e) {
            container.innerHTML = `<p class="text-red-500">Erreur de connexion.</p>`;
        }
    },

    async loadRaid(id) {
        this.showView('details');
        const header = document.getElementById('raid-info');
        header.innerHTML = "<p class='animate-pulse text-orange-500'>Chargement...</p>";

        try {
            // 1. On récupère les infos du raid
            this.currentData = await RaidAPI.fetchRaidDetails(id);
            header.innerHTML = `<h2 class="text-4xl font-black uppercase italic">${this.currentData.title}</h2>`;
            
            // 2. On affiche les inscrits (liste brute)
            this.renderSignups();

            // 3. On récupère la compo associée (L'ID de la compo est le même que celui du raid dans ton JSON)
            const compDetails = await RaidAPI.fetchCompDetails(id);
            UI.renderComposition(compDetails);

        } catch (e) {
            console.error(e);
            header.innerHTML = `<p class="text-red-500">Erreur : ${e.message}</p>`;
        }
    },

    renderSignups() {
        const grid = document.getElementById('signups-grid');
        const players = this.currentData.signUps || [];
        grid.innerHTML = players.map(p => UI.renderPlayerBadge(p)).join('');
    },

    renderAll() {
        const signupsGrid = document.getElementById('signups-grid');
        const players = this.currentData.signUps || [];
        players.sort((a, b) => (a.className || "").localeCompare(b.className || ""));
        signupsGrid.innerHTML = players.map(p => UI.renderPlayerBadge(p)).join('');
        // Tu pourras ajouter le rendu de la comp ici plus tard
    },

    showView(viewName) {
        document.getElementById('view-list').classList.toggle('hidden', viewName !== 'list');
        document.getElementById('view-details').classList.toggle('hidden', viewName !== 'details');
    },

    switchTab(tabName) {
        document.querySelectorAll('.tab-link').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
        document.getElementById('tab-content-signups').classList.toggle('hidden', tabName !== 'signups');
        document.getElementById('tab-content-comp').classList.toggle('hidden', tabName !== 'comp');
    },
    async confirmDelete(event, raidId, raidTitle) {
        // Empêche l'ouverture du raid quand on clique sur la poubelle
        event.stopPropagation();

        const confirmed = confirm(`Es-tu sûr de vouloir supprimer le raid "${raidTitle}" ?\nCela supprimera aussi le salon sur Discord.`);
        
        if (confirmed) {
            try {
                await RaidAPI.deleteRaid(raidId);
                alert("Raid supprimé avec succès.");
                location.reload(); // On rafraîchit la liste
            } catch (e) {
                alert("Erreur lors de la suppression : " + e.message);
            }
        }
    },
    
};

App.init();