const UI = {
    renderRaidCard(raid) {
        // Conversion du timestamp en Date
        const dateObj = new Date(raid.startTime * 1000);
        
        // On extrait la date (ex: 10 avr.)
        const dateStr = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        
        // On extrait l'heure (ex: 20:30)
        const timeStr = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        return `
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-orange-500 cursor-pointer transition group relative" onclick="App.loadRaid('${raid.id}')">
                <button onclick="App.confirmDelete(event, '${raid.id}', '${raid.title.replace(/'/g, "\\'")}')" 
                        class="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors p-1 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

                <div class="flex justify-between items-start mb-4">
                    <div class="flex flex-col">
                        <span class="text-orange-500 font-mono text-xs font-bold uppercase tracking-widest">${dateStr}</span>
                        <span class="text-slate-400 font-mono text-[10px] font-bold mt-1">🕒 ${timeStr}</span>
                    </div>
                </div>
                <h3 class="text-xl font-bold text-white group-hover:text-orange-500 transition pr-6">${raid.title}</h3>
            </div>
        `;
    },

    renderPlayerBadge(player) {
        const rawClass = (player.className || "").toLowerCase().trim();
        const className = rawClass.split(' ')[0];
        const color = CONFIG.CLASS_COLORS[className] || '#94a3b8';

        // NETTOYAGE DE LA SPÉ : On enlève les chiffres (ex: protection1 -> protection)
        let specName = player.specName || 'Sans Spé';
        specName = specName.replace(/[0-9]/g, ''); 

        // ICÔNE NETTE : On passe de /small/ à /medium/ pour éviter le flou
        const iconClass = className.replace(/\s+/g, '');
        const iconUrl = `https://wow.zamimg.com/images/wow/icons/medium/class_${iconClass}.jpg`;

        return `
            <div class="bg-slate-900/40 p-3 rounded-xl border border-slate-800/50 flex items-center gap-3 hover:bg-slate-800 transition shadow-sm relative overflow-hidden group">
                
                <div class="absolute left-0 top-0 bottom-0 w-1" style="background-color: ${color}"></div>

                <div class="relative flex-shrink-0">
                    <img src="${iconUrl}" alt="${className}" 
                        class="w-9 h-9 rounded-md border border-slate-700 shadow-md z-10 relative object-cover" 
                        onerror="this.src='https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg'">
                    
                    <div class="absolute inset-0 rounded-full blur-md opacity-20 group-hover:opacity-40 transition duration-500" 
                        style="background-color: ${color}"></div>
                </div>

                <div class="overflow-hidden">
                    <div class="font-black text-[13px] truncate uppercase tracking-tight" style="color: ${color}">
                        ${player.name}
                    </div>
                    
                    <div class="flex items-center gap-1.5 mt-0.5">
                        <span class="text-[9px] text-slate-300 uppercase font-bold tracking-widest">${className}</span>
                        <span class="text-slate-600 text-[9px] font-black">•</span>
                        <span class="text-[9px] text-orange-500 uppercase font-extrabold tracking-widest">
                            ${specName}
                        </span>
                    </div>
                </div>
            </div>
        `;
    },
    renderComposition(compData) {
        const container = document.getElementById('comp-grid');
        const groupsCount = compData.groupCount || 5;
        const slotsPerGroup = compData.slotCount || 5;
        
        let html = "";

        for (let i = 1; i <= groupsCount; i++) {
            // On filtre les joueurs qui appartiennent à ce groupe
            const groupPlayers = compData.slots.filter(s => s.groupNumber === i);
            
            html += `
                <div class="group-box bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <h4 class="text-orange-500 font-black text-[10px] mb-4 uppercase tracking-widest text-center border-b border-slate-800 pb-2">
                        Groupe ${i}
                    </h4>
                    <div class="space-y-2">
            `;

            // On crée les 5 slots du groupe
            for (let s = 1; s <= slotsPerGroup; s++) {
                const player = groupPlayers.find(p => p.slotNumber === s);
                
                if (player) {
                    html += `
                        <div class="flex flex-col p-2 rounded bg-slate-950 border-l-2" style="border-left-color: ${player.color}">
                            <span class="text-xs font-bold truncate" style="color: ${player.color}">${player.name}</span>
                            <span class="text-[9px] text-slate-600 uppercase font-medium">${player.specName}</span>
                        </div>
                    `;
                } else {
                    html += `<div class="h-8 border border-dashed border-slate-800 rounded flex items-center justify-center text-slate-800 text-[10px]">VIDE</div>`;
                }
            }

            html += `</div></div>`;
        }
        
        container.innerHTML = html;
    }
};