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
        const dateVal = document.getElementById('input-raid-date').value;
        const timeVal = document.getElementById('input-raid-time').value;
        const suffix = document.getElementById('input-raid-suffix').value.trim() || "raid";
        
        // Construction du nom du channel : KZ-mercredi-16-avril-marijane
        const dateObj = new Date(dateVal);
        const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const moisNoms = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
        
        const preset = CONFIG.RAID_PRESETS[this.selectedPreset];
        const channelName = `${preset.title.split(' ')[0]}-${jours[dateObj.getDay()]}-${dateObj.getDate()}-${moisNoms[dateObj.getMonth()]}-${suffix}`.toLowerCase();

        // Format Date pour Raid-Helper : JJ-MM-AAAA
        const [y, m, d] = dateVal.split('-');
        const formattedDate = `${d}-${m}-${y}`;

        try {
            const btn = document.getElementById('btn-confirm-create');
            btn.innerText = "CRÉATION EN COURS...";
            btn.disabled = true;

            await RaidAPI.createRaid(this.selectedPreset, formattedDate, timeVal, channelName);
            
            alert(`Succès ! Salon créé : ${channelName}`);
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