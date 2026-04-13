const UI = {
    renderRaidCard(raid) {
        const dateObj = new Date(raid.startTime * 1000);
        const dateStr = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
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
        let specName = player.specName || 'Sans Spé';
        specName = specName.replace(/[0-9]/g, '');
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
                        <span class="text-[9px] text-orange-500 uppercase font-extrabold tracking-widest">${specName}</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderComposition(compData, signups = []) {
        UI._lastCompData = compData;
        UI._currentSignups = signups;

        const container = document.getElementById('comp-grid');
        container.className = ''; // reset les classes grid du HTML
        const compTab = document.getElementById('tab-content-comp');

        const groupsCount = compData.groupCount || 5;
        const slotsPerGroup = compData.slotCount || 5;

        // Joueurs déjà placés dans la compo
        const assignedNames = new Set((compData.slots || []).map(s => s.name).filter(Boolean));
        const poolPlayers = signups.filter(p => !assignedNames.has(p.name));

        // Pool de joueurs disponibles
        let html = `
            <div class="mb-6">
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Disponibles — ${poolPlayers.length} joueur(s)
                </p>
                <div id="player-pool"
                    class="min-h-[48px] flex flex-wrap gap-2 p-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/40"
                    ondragover="event.preventDefault()"
                    ondrop="UI.onDropToPool(event)">
        `;
        for (const p of poolPlayers) html += UI._renderDraggablePlayer(p);
        html += `</div></div>`;

        // Grille des groupes
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">`;
        for (let g = 1; g <= groupsCount; g++) {
            const groupSlots = (compData.slots || []).filter(s => s.groupNumber === g);
            html += `
                <div class="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <h4 class="text-orange-500 font-black text-[10px] mb-4 uppercase tracking-widest text-center border-b border-slate-800 pb-2">
                        Groupe ${g}
                    </h4>
                    <div class="space-y-2">
            `;
            for (let s = 1; s <= slotsPerGroup; s++) {
                const player = groupSlots.find(p => p.slotNumber === s);
                html += UI._renderDropSlot(g, s, player);
            }
            html += `</div></div>`;
        }
        html += `</div>`;

        container.innerHTML = html;

        // Bouton poster
        const existing = document.getElementById('btn-post-compo-bar');
        if (existing) existing.remove();
        const bar = document.createElement('div');
        bar.id = 'btn-post-compo-bar';
        bar.className = 'mt-6 flex items-center gap-4';
        bar.innerHTML = `
            <button id="btn-open-post-modal" onclick="UI.openPostModal()"
                class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-bold text-xs transition uppercase tracking-tighter">
                📨 Poster la compo sur Discord
            </button>
            <span id="post-compo-status" class="text-xs font-bold"></span>
        `;
        compTab.appendChild(bar);
    },

    _renderDraggablePlayer(player) {
        const rawClass = (player.className || '').toLowerCase().trim().split(' ')[0];
        const color = player.color || CONFIG.CLASS_COLORS[rawClass] || '#94a3b8';
        const specName = (player.specName || 'Sans Spé').replace(/[0-9]/g, '');
        const icon = UI._getRoleIcon(specName);
        return `
            <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border-l-2 cursor-grab select-none hover:bg-slate-900 transition text-xs"
                style="border-left-color:${color}"
                draggable="true"
                data-player-name="${player.name}"
                data-player-class="${player.className || ''}"
                data-player-spec="${player.specName || ''}"
                data-player-color="${color}"
                data-source="pool"
                ondragstart="UI.onDragStart(event)">
                ${icon} <span style="color:${color}" class="font-bold">${player.name}</span>
                <span class="text-slate-500 text-[9px] ml-1">${specName}</span>
            </div>
        `;
    },

    _renderDropSlot(groupId, slotId, player) {
        if (player && player.name) {
            const color = player.color || '#94a3b8';
            const icon = UI._getRoleIcon(player.specName);
            const specName = (player.specName || '').replace(/[0-9]/g, '');
            return `
                <div class="relative flex flex-col p-2 rounded-lg bg-slate-950 border-l-2 transition"
                    style="border-left-color:${color}"
                    ondragover="event.preventDefault(); this.classList.add('ring-1','ring-orange-500/50')"
                    ondragleave="this.classList.remove('ring-1','ring-orange-500/50')"
                    ondrop="UI.onDropToSlot(event,${groupId},${slotId})">
                    <div class="flex items-center gap-1 pr-4"
                        draggable="true"
                        data-player-name="${player.name}"
                        data-player-class="${player.className || ''}"
                        data-player-spec="${player.specName || ''}"
                        data-player-color="${color}"
                        data-source-group="${groupId}"
                        data-source-slot="${slotId}"
                        ondragstart="UI.onDragStart(event)">
                        <span class="text-xs font-bold truncate" style="color:${color}">${icon} ${player.name}</span>
                    </div>
                    <span class="text-[9px] text-slate-500 uppercase">${specName}</span>
                    <button class="absolute top-1 right-1 text-slate-700 hover:text-red-500 text-sm leading-none font-bold"
                        onclick="UI.removeFromSlot(${groupId},${slotId})">×</button>
                </div>
            `;
        }
        return `
            <div class="h-10 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-700 text-[10px] transition"
                ondragover="event.preventDefault(); this.classList.add('border-orange-500','bg-orange-500/5','text-orange-500/50')"
                ondragleave="this.classList.remove('border-orange-500','bg-orange-500/5','text-orange-500/50')"
                ondrop="UI.onDropToSlot(event,${groupId},${slotId})">
                vide
            </div>
        `;
    },

    onDragStart(event) {
        const el = event.currentTarget;
        const player = {
            name: el.dataset.playerName,
            className: el.dataset.playerClass,
            specName: el.dataset.playerSpec,
            color: el.dataset.playerColor
        };
        const source = el.dataset.sourceGroup !== undefined
            ? { groupId: parseInt(el.dataset.sourceGroup), slotId: parseInt(el.dataset.sourceSlot) }
            : 'pool';
        event.dataTransfer.setData('text/plain', JSON.stringify({ player, source }));
        event.dataTransfer.effectAllowed = 'move';
        event.stopPropagation();
    },

    async onDropToSlot(event, groupId, slotId) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('ring-1', 'ring-orange-500/50', 'border-orange-500', 'bg-orange-500/5', 'text-orange-500/50');

        let dragData;
        try { dragData = JSON.parse(event.dataTransfer.getData('text/plain')); }
        catch { return; }

        const { player, source } = dragData;
        const compId = App.currentRaidId;

        try {
            await RaidAPI.updateCompSlot(compId, groupId, slotId, player);
            if (source !== 'pool' && (source.groupId !== groupId || source.slotId !== slotId)) {
                await RaidAPI.deleteCompSlot(compId, source.groupId, source.slotId);
            }
            const updatedComp = await RaidAPI.fetchCompDetails(compId);
            UI.renderComposition(updatedComp, UI._currentSignups);
        } catch (e) {
            console.error('Erreur drop slot:', e);
        }
    },

    async onDropToPool(event) {
        event.preventDefault();

        let dragData;
        try { dragData = JSON.parse(event.dataTransfer.getData('text/plain')); }
        catch { return; }

        const { source } = dragData;
        if (source === 'pool') return;

        const compId = App.currentRaidId;
        try {
            await RaidAPI.deleteCompSlot(compId, source.groupId, source.slotId);
            const updatedComp = await RaidAPI.fetchCompDetails(compId);
            UI.renderComposition(updatedComp, UI._currentSignups);
        } catch (e) {
            console.error('Erreur retour pool:', e);
        }
    },

    async removeFromSlot(groupId, slotId) {
        const compId = App.currentRaidId;
        try {
            await RaidAPI.deleteCompSlot(compId, groupId, slotId);
            const updatedComp = await RaidAPI.fetchCompDetails(compId);
            UI.renderComposition(updatedComp, UI._currentSignups);
        } catch (e) {
            console.error('Erreur suppression slot:', e);
        }
    },

    _getRoleIcon(specName) {
        const s = (specName || '').toLowerCase();
        if (s.includes('protection') || s.includes('prot') || s.includes('guardian') || s.includes('tank')) return '🛡️';
        if (s.includes('holy') || s.includes('resto') || s.includes('discipline') || s.includes('heal')) return '💚';
        return '⚔️';
    },

    formatCompForDiscord(raidTitle, compData) {
        const groupsCount = compData.groupCount || 5;
        const slotsPerGroup = compData.slotCount || 5;
        const fields = [];

        for (let g = 1; g <= groupsCount; g++) {
            const groupSlots = (compData.slots || []).filter(s => s.groupNumber === g);
            if (!groupSlots.length) continue;
            let value = '';
            for (let s = 1; s <= slotsPerGroup; s++) {
                const player = groupSlots.find(p => p.slotNumber === s);
                if (player) {
                    value += `${UI._getRoleIcon(player.specName)} **${player.name}** — ${player.specName}\n`;
                } else {
                    value += `▫️ *Vide*\n`;
                }
            }
            fields.push({ name: `〔 Groupe ${g} 〕`, value: value.trim(), inline: true });
        }

        return {
            title: { name: `📋 COMPOSITION — ${raidTitle.toUpperCase()}` },
            color: '#f97316',
            fields,
            footer: { name: 'Posté via Mirages Manager' }
        };
    },

    openPostModal() {
        const existing = document.getElementById('post-modal-overlay');
        if (existing) existing.remove();
        const overlay = document.createElement('div');
        overlay.id = 'post-modal-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:999;';
        overlay.innerHTML = `
            <div style="background:#0f172a;border:1px solid #334155;border-radius:16px;padding:24px;width:420px;max-width:90vw;">
                <h3 class="text-white font-black uppercase italic text-lg mb-1">Poster la compo</h3>
                <p class="text-slate-500 text-xs uppercase font-bold tracking-widest mb-6">Via l'API Raid-Helper</p>
                <label class="text-[10px] font-bold text-slate-500 uppercase italic block mb-1">ID Salon Discord cible</label>
                <input type="text" id="modal-channel-id" placeholder="ID du salon"
                    value="${CONFIG.DEFAULT_CHANNEL_ID || ''}"
                    class="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-mono mb-4" />
                <div class="flex items-center gap-3">
                    <button id="btn-confirm-post" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-black text-xs uppercase tracking-tighter transition">
                        Confirmer l'envoi
                    </button>
                    <button id="btn-cancel-post" class="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest px-2">
                        Annuler
                    </button>
                </div>
                <p id="modal-status" class="text-xs font-bold mt-3 text-center"></p>
            </div>
        `;
        document.body.appendChild(overlay);

        // Tous les listeners en addEventListener, plus de onclick inline
        document.getElementById('btn-confirm-post').addEventListener('click', () => UI.confirmPost());
        document.getElementById('btn-cancel-post').addEventListener('click', () => overlay.remove());
    },

    async confirmPost() {
        const channelId = document.getElementById('modal-channel-id').value.trim();
        const statusEl = document.getElementById('modal-status');
        if (!channelId) {
            statusEl.textContent = '⚠️ ID du salon requis';
            statusEl.className = 'text-xs font-bold mt-3 text-center text-orange-400';
            return;
        }
        const raidTitle = document.querySelector('#raid-info h2')?.textContent || 'Raid';
        const compData = UI._lastCompData;
        if (!compData) {
            statusEl.textContent = '⚠️ Aucune compo chargée';
            statusEl.className = 'text-xs font-bold mt-3 text-center text-orange-400';
            return;
        }
        statusEl.textContent = 'Envoi en cours...';
        statusEl.className = 'text-xs font-bold mt-3 text-center text-slate-400';
        try {
            const content = UI.formatCompForDiscord(raidTitle, compData);
            await RaidAPI.postEmbed(channelId, content);
            statusEl.textContent = '✅ Compo postée avec succès !';
            statusEl.className = 'text-xs font-bold mt-3 text-center text-green-400';
            document.getElementById('post-compo-status').textContent = '✅ Postée !';
            document.getElementById('post-compo-status').className = 'text-xs font-bold text-green-400';
            setTimeout(() => document.getElementById('post-modal-overlay')?.remove(), 1500);
        } catch(e) {
            statusEl.textContent = `❌ Erreur : ${e.message}`;
            statusEl.className = 'text-xs font-bold mt-3 text-center text-red-400';
        }
    }
};