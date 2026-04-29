const initApp = () => {
    const { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } = window;

    // On attend que la connexion Firebase soit établie dans index.html
    if (!db) {
        setTimeout(initApp, 500);
        return;
    }

    let firstLoad = true; // Empêche de sonner pour les vieux messages à l'ouverture

    // --- 1. FONCTION POUR PUBLIER UN MESSAGE ---
    window.publishPost = async function() {
        const catElem = document.getElementById('categorie');
        const textElem = document.getElementById('postContent');
        if (!catElem || !textElem) return;

        const cat = catElem.value;
        const texte = textElem.value;

        if (texte.trim().length < 2) {
            alert("Ton message est trop court !");
            return;
        }

        try {
            await addDoc(collection(db, "posts"), {
                category: cat,
                content: texte,
                timestamp: serverTimestamp()
            });
            textElem.value = ""; // Vide le champ après envoi
        } catch (e) {
            console.error("Erreur Firebase :", e);
            alert("Erreur lors de l'envoi. Vérifie tes règles Firestore.");
        }
    };

    // --- 2. SURVEILLANCE DES MESSAGES ET NOTIFICATIONS ---
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    
    onSnapshot(q, (snapshot) => {
        const feed = document.getElementById('feed');
        const banner = document.getElementById('notification-banner');
        if (!feed) return;

        // Détection d'un nouveau message pour la notification
        if (!firstLoad && !snapshot.metadata.hasPendingWrites) {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    // On affiche la bannière noire en haut
                    if (banner) {
                        banner.style.display = 'block';
                        setTimeout(() => { banner.style.display = 'none'; }, 5000);
                    }
                    // Vibration sur les téléphones Android compatibles
                    if (navigator.vibrate) {
                        navigator.vibrate([200, 100, 200]);
                    }
                }
            });
        }
        firstLoad = false; // Maintenant que le premier chargement est fait, les suivants seront notifiés

        // --- 3. AFFICHAGE ET RANGEMENT PAR CATÉGORIES ---
        feed.innerHTML = "";
        const categories = ["Vie de Campus", "Cours", "GBAIRAI"];
        const sections = {};

        // Création des blocs de titres pour chaque catégorie
        categories.forEach(cat => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style = "margin-bottom: 30px; display: none;";
            sectionDiv.innerHTML = `<h3 style="border-bottom: 3px solid #000; color: #000; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; font-size: 1.1em; letter-spacing: 1px;">${cat}</h3>`;
            sections[cat] = sectionDiv;
            feed.appendChild(sectionDiv);
        });

        // Affichage de chaque post dans sa catégorie
        snapshot.forEach((doc) => {
            const data = doc.data();
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            
            const date = data.timestamp ? data.timestamp.toDate().toLocaleString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : 'À l\'instant';
            
            postDiv.innerHTML = `
                <div class="post-header"><span class="post-category">${data.category}</span></div>
                <div class="post-content">${data.content}</div>
                <small style="color:#999; font-size:10px; display:block; margin-top:10px;">Posté à ${date}</small>
            `;
            
            if (sections[data.category]) {
                sections[data.category].appendChild(postDiv);
                sections[data.category].style.display = "block"; // Affiche le titre s'il y a des messages
            }
        });

        if (snapshot.empty) {
            feed.innerHTML = "<p style='text-align:center; color:#666;'>Aucun message pour le moment. Lance le premier gbairai !</p>";
        }
    });
};

// Lancement de l'application
initApp();
