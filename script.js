const initApp = () => {
    const { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } = window;

    // 1. On attend que la base de données soit prête
    if (!db) {
        setTimeout(initApp, 500);
        return;
    }

    // 2. FONCTION POUR PUBLIER UN MESSAGE
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
            alert("✅ Publié sur AHYT !");
        } catch (e) {
            console.error("Erreur Firebase :", e);
            alert("Erreur lors de l'envoi. Vérifie tes règles Firestore.");
        }
    };

    // 3. AFFICHAGE ET CLASSEMENT AUTOMATIQUE
    try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        
        onSnapshot(q, (snapshot) => {
            const feed = document.getElementById('feed');
            if (!feed) return;
            
            feed.innerHTML = ""; // On nettoie l'écran avant d'afficher

            // Les noms des groupes (doivent être identiques aux "value" du HTML)
            const categories = ["Vie de Campus", "Cours", "GBAIRAI"];
            const sections = {};

            // On crée visuellement les titres de catégories
            categories.forEach(cat => {
                const sectionDiv = document.createElement('div');
                sectionDiv.style = "margin-bottom: 30px; display: none;"; // Caché si vide
                
                // Style du titre de la catégorie
                sectionDiv.innerHTML = `<h3 style="border-bottom: 2px solid #000; color: #000; padding-bottom: 5px; margin-bottom: 15px; font-family: sans-serif; text-transform: uppercase; font-size: 1.1em;">${cat}</h3>`;
                
                sections[cat] = sectionDiv;
                feed.appendChild(sectionDiv);
            });

            // On range chaque message dans son groupe
            snapshot.forEach((doc) => {
                const data = doc.data();
                const postDiv = document.createElement('div');
                
                // On utilise ta classe CSS .post pour le style
                postDiv.className = 'post';
                
                const date = data.timestamp ? data.timestamp.toDate().toLocaleString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : 'À l\'instant';
                
                postDiv.innerHTML = `
                    <div class="post-header">
                        <span class="post-category">${data.category}</span>
                    </div>
                    <div class="post-content">${data.content}</div>
                    <small style="color:#999; font-size:10px; display:block; margin-top:10px;">Posté à ${date}</small>
                `;
                
                // Si la catégorie du message existe, on l'ajoute au groupe
                if (sections[data.category]) {
                    sections[data.category].appendChild(postDiv);
                    sections[data.category].style.display = "block"; // On affiche le titre car il y a un message
                }
            });

            if (snapshot.empty) {
                feed.innerHTML = "<p style='text-align:center; color:#666;'>Aucun message pour le moment. Lance le premier gbairai !</p>";
            }

        }, (error) => {
            console.error("Erreur de lecture Firestore :", error);
        });
    } catch (err) {
        console.error("Erreur générale :", err);
    }
};

// Lancer l'application
initApp();
