const Admin = {
    selectedPreset: null,

    prepareRaid(presetKey) {
        this.selectedPreset = presetKey;
        const confirmBox = document.getElementById('creation-confirm');
        
        // Calcul automatique de la date du prochain mercredi (reset)
        const today = new Date();
        const nextWednesday = new Date();
        nextWednesday.setDate(today.getDate() + (3 + 7 - today.getDay()) % 7);
        
        document.getElementById('input-raid-date').value = nextWednesday.toISOString().split('T')[0];
        confirmBox.classList.remove('hidden');
        
        document.getElementById('btn-confirm-create').onclick = () => this.executeCreation();
    },

    async executeCreation() {
        // 1. On récupère les valeurs des champs HTML
        const dateVal = document.getElementById('input-raid-date').value;
        const timeVal = document.getElementById('input-raid-time').value;
        
        // On récupère le suffixe (ex: Marijane)
        const suffix = document.getElementById('input-raid-suffix').value.trim();
        
        // On récupère l'ID du salon
        const channelId = document.getElementById('input-raid-channel-id').value.trim();

        // On vérifie que les champs obligatoires sont remplis
        if (!dateVal || !timeVal || !channelId) {
            alert("Erreur : La date, l'heure et l'ID du salon sont obligatoires !");
            return;
        }

        // Format Date pour Raid-Helper (JJ-MM-AAAA)
        const [y, m, d] = dateVal.split('-');
        const formattedDate = `${d}-${m}-${y}`;

        try {
            const btn = document.getElementById('btn-confirm-create');
            btn.innerText = "CRÉATION EN COURS...";
            btn.disabled = true;

            // APPEL DE L'API : On ajoute "suffix" en dernier paramètre
            await RaidAPI.createRaid(this.selectedPreset, formattedDate, timeVal, channelId, suffix);
            
            alert(`Succès ! Raid posté.`);
            location.reload();
        } catch (e) {
            alert("Erreur : " + e.message);
            const btn = document.getElementById('btn-confirm-create');
            btn.innerText = "CONFIRMER LA CRÉATION";
            btn.disabled = false;
        }
    },  

    cancel() {
        document.getElementById('creation-confirm').classList.add('hidden');
    }
};