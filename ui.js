const UI = {
    renderRaidCard(raid) {
        const date = new Date(raid.startTime * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        return `
            <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-orange-500 cursor-pointer transition group" onclick="App.loadRaid('${raid.id}')">
                <div class="flex justify-between items-start mb-4">
                    <span class="text-orange-500 font-mono text-xs font-bold uppercase tracking-widest">${date}</span>
                    <span class="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded">ID: ${raid.id.slice(-4)}</span>
                </div>
                <h3 class="text-xl font-bold text-white group-hover:text-orange-500 transition">${raid.title}</h3>
            </div>
        `;
    },

    renderPlayerBadge(player) {
        const color = CONFIG.CLASS_COLORS[(player.className || "").toLowerCase()] || '#94a3b8';
        return `
            <div class="bg-slate-900/50 p-3 rounded-lg border-l-4" style="border-left-color: ${color}">
                <div class="font-bold text-sm" style="color: ${color}">${player.name}</div>
                <div class="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">${player.specName || player.className}</div>
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