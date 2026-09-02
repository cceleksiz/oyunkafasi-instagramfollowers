// Oyun Kafası - Instagram Gerçek Veri Çekme & Unfollow
(function() {
    if (document.getElementById('ok-overlay-panel')) {
        document.getElementById('ok-overlay-panel').remove();
    }

    const styles = `
        #ok-overlay-panel { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(9, 9, 11, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 9999999; display: flex; color: #fafafa; font-family: system-ui, -apple-system, sans-serif; animation: okFadeIn 0.3s ease; }
        @keyframes okFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .ok-sidebar { width: 320px; background: rgba(24, 24, 27, 0.9); border-right: 1px solid rgba(255,255,255,0.05); padding: 30px 20px; display: flex; flex-direction: column; gap: 20px; }
        .ok-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .ok-logo-text { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(90deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .ok-close { cursor: pointer; color: #a1a1aa; font-size: 24px; border: none; background: none; }
        .ok-close:hover { color: #fff; }
        .ok-btn { background: #3b82f6; color: white; border: none; padding: 14px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3); }
        .ok-btn:hover { background: #2563eb; transform: translateY(-1px); }
        .ok-btn:disabled { background: #3f3f46; color: #a1a1aa; cursor: not-allowed; box-shadow: none; }
        .ok-stats { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; text-align: center; }
        .ok-stats h3 { font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: 500; }
        .ok-stats p { font-size: 32px; font-weight: 700; color: #60a5fa; margin: 0; }
        .ok-content { flex: 1; padding: 40px; overflow-y: auto; }
        .ok-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .ok-card { background: rgba(24, 24, 27, 0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; display: flex; align-items: center; justify-content: space-between; transition: 0.2s; }
        .ok-card:hover { background: rgba(39, 39, 42, 0.8); border-color: rgba(255,255,255,0.1); transform: translateY(-2px); }
        .ok-user { display: flex; align-items: center; gap: 12px; }
        .ok-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; background: #27272a; }
        .ok-username { font-size: 14px; font-weight: 600; color: #e4e4e7; text-decoration: none; }
        .ok-username:hover { text-decoration: underline; }
        .ok-action { background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .ok-action:hover { background: #ef4444; color: white; }
        .ok-action:disabled { border-color: #3f3f46; color: #a1a1aa; cursor: not-allowed; background: transparent; }
        .ok-loading { color: #a1a1aa; font-size: 15px; display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column; gap: 15px; }
        .ok-spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #3b82f6; border-radius: 50%; width: 30px; height: 30px; animation: okSpin 1s linear infinite; }
        @keyframes okSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    const overlay = document.createElement('div');
    overlay.id = 'ok-overlay-panel';
    overlay.innerHTML = `
        <div class="ok-sidebar">
            <div class="ok-header">
                <div class="ok-logo-text">OYUN KAFASI</div>
                <button class="ok-close" onclick="document.getElementById('ok-overlay-panel').remove()">×</button>
            </div>
            <p style="font-size: 13px; color: #a1a1aa; line-height: 1.5; margin-bottom: 10px;">
                Gerçek API taraması aktiftir. Instagram engelini tetiklememek için sayfayı kapatmayın veya yenilemeyin.
            </p>
            <button class="ok-btn" id="ok-start-btn">Taramayı Başlat</button>
            <div class="ok-stats">
                <h3>Geri Takip Etmeyenler</h3>
                <p id="ok-count">0</p>
            </div>
            <div class="ok-stats" style="margin-top: auto;">
                <h3>Durum</h3>
                <p id="ok-status" style="font-size: 14px; color: #e4e4e7; margin-top: 5px; font-weight: 500;">Hazır</p>
            </div>
        </div>
        <div class="ok-content">
            <div id="ok-results" class="ok-grid">
                <div style="grid-column: 1 / -1; height: 100%; display: flex; align-items: center; justify-content: center; color: #52525b; font-size: 18px; font-weight: 500;">
                    Taramayı başlatmak için sol menüyü kullanın.
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('ok-start-btn').addEventListener('click', async function() {
        const btn = this;
        const resultsEl = document.getElementById('ok-results');
        const statusEl = document.getElementById('ok-status');
        const countEl = document.getElementById('ok-count');

        btn.disabled = true;
        resultsEl.innerHTML = `
            <div style="grid-column: 1 / -1;" class="ok-loading">
                <div class="ok-spinner"></div>
                Instagram sunucularına bağlanılıyor... Bu işlem hesabın büyüklüğüne göre sürebilir.
            </div>
        `;

        try {
            const getCookie = (name) => {
                const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                return match ? match[2] : null;
            };

            const csrf = getCookie('csrftoken');
            const userId = getCookie('ds_user_id');
            const appId = '936619743392459'; // Instagram Web App ID

            if (!userId || !csrf) {
                throw new Error("Oturum bulunamadı. Lütfen Instagram'a giriş yapın.");
            }

            const fetchList = async (type, statusText) => {
                let users = [];
                let maxId = '';
                let hasMore = true;
                while (hasMore) {
                    statusEl.innerText = `${statusText} (${users.length})`;
                    const url = \`https://www.instagram.com/api/v1/friendships/\${userId}/\${type}/?count=100\${maxId ? '&max_id=' + maxId : ''}\`;
                    const res = await fetch(url, { headers: { 'X-IG-App-ID': appId, 'X-CSRFToken': csrf } });
                    
                    if (!res.ok) throw new Error('Instagram sınırlandırması (Action Block)');
                    
                    const data = await res.json();
                    users = users.concat(data.users);
                    hasMore = !!data.next_max_id;
                    maxId = data.next_max_id;
                    
                    // Güvenlik için her istek arasına 1.5 saniye bekleme süresi
                    await new Promise(r => setTimeout(r, 1500)); 
                }
                return users;
            };

            statusEl.innerText = "Takip Edilenler Çekiliyor...";
            const following = await fetchList('following', 'Takip Edilenler');

            statusEl.innerText = "Takipçiler Çekiliyor...";
            const followers = await fetchList('followers', 'Takipçiler');

            statusEl.innerText = "Veriler Karşılaştırılıyor...";

            const followersMap = new Set(followers.map(u => u.pk));
            const unfollowers = following.filter(u => !followersMap.has(u.pk));

            countEl.innerText = unfollowers.length;
            statusEl.innerText = "Tarama Tamamlandı";
            resultsEl.innerHTML = "";

            if (unfollowers.length === 0) {
                resultsEl.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #4ade80;">Harika! Takip ettiğin herkes seni geri takip ediyor.</div>';
                return;
            }

            unfollowers.forEach(user => {
                const card = document.createElement('div');
                card.className = 'ok-card';
                card.innerHTML = `
                    <div class="ok-user">
                        <img src="\${user.profile_pic_url}" class="ok-avatar" alt="\${user.username}">
                        <a href="https://instagram.com/\${user.username}" target="_blank" class="ok-username">@\${user.username}</a>
                    </div>
                    <button class="ok-action" data-id="\${user.pk}">Takipten Çık</button>
                `;
                resultsEl.appendChild(card);
            });

            // Gerçek Unfollow İşlemi
            document.querySelectorAll('.ok-action').forEach(button => {
                button.addEventListener('click', async function() {
                    const targetId = this.getAttribute('data-id');
                    this.innerText = 'Çıkılıyor...';
                    this.disabled = true;
                    
                    try {
                        const res = await fetch(\`https://www.instagram.com/api/v1/friendships/destroy/\${targetId}/\`, {
                            method: 'POST',
                            headers: { 'X-IG-App-ID': appId, 'X-CSRFToken': csrf }
                        });
                        
                        if (res.ok) {
                            this.innerText = 'Çıkıldı';
                            this.style.opacity = '0.4';
                        } else {
                            this.innerText = 'Hata!';
                            this.disabled = false;
                        }
                    } catch (e) {
                        this.innerText = 'Hata!';
                        this.disabled = false;
                    }
                });
            });

        } catch (error) {
            statusEl.innerText = "Hata Oluştu";
            resultsEl.innerHTML = \`<div style="grid-column: 1 / -1; color: #ef4444; font-weight: 500; text-align: center;">\${error.message}</div>\`;
        } finally {
            btn.innerText = "Yeniden Tara";
            btn.disabled = false;
        }
    });
})();
