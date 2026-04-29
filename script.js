const initApp = () => {
    const { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } = window;

    // On attend que Firebase soit injecté par l'index.html
    if (!db) {
        setTimeout(initApp, 500);
        return;
    }

    // --- 1. FONCTION DE PUBLICATION ---
    window.publishPost = async function() {
        const catElem = document.getElementById('catégorie'); // Avec l'accent comme dans ton HTML
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
                category: cat, // On enregistre la catégorie choisie
                content: texte,
                timestamp: serverTimestamp()
            });
            textElem.value = "";
            alert("✅ Publié sur AHYT !");
        } catch (e) {
            console.error("Erreur d'envoi:", e);
            alert("Erreur : " + e.message);
        }
    };

    // --- 2. AFFICHAGE CLASSÉ ET GROUPÉ ---
    try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        
        onSnapshot(q, (snapshot) => {
            const feed = document.getElementById('feed');
            if (!feed) return;
            
            feed.innerHTML = ""; // On nettoie l'écran

            // LES CATÉGORIES EXACTES (doivent correspondre aux "value" de ton index.html)
            const categories = ["Vie de Campus", "Cours", "GBAIRAI"];
            const sections = {};

            // Création des conteneurs visuels pour chaque groupe
            categories.forEach(cat => {
                const sectionDiv = document.createElement('div');
                sectionDiv.style = "margin-bottom: 30px; display: none;"; // Caché par défaut
                
                // Titre du groupe (ex: 🏫 Vie de Campus)
                sectionDiv.innerHTML = `<h3 style="border-bottom: 2px solid #ff4757; color: #ff4757; padding-bottom: 5px; margin-bottom: 15px; font-family: sans-serif;">${cat}</h3>`;
                
                sections[cat] = sectionDiv;
                feed.appendChild(sectionDiv);
            });

            // On range chaque message dans son groupe respectif
            snapshot.forEach((doc) => {
                const data = doc.data();
                const postDiv = document.createElement('div');
                
                // Style des bulles de messages
                postDiv.style = "background:white; padding:15px; margin-bottom:12px; border-radius:10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 4px solid #ff4757;";
                
                // Contenu du message
                postDiv.innerHTML = `
                    <p style="margin:0; font-family: sans-serif; color:#2d3436; line-height:1.4;">${data.content}</p>
                    <small style="color:#b2bec3; font-size:10px; display:block; margin-top:8px;">Posté le ${data.timestamp ? data.timestamp.toDate().toLocaleString() : 'à l\'instant'}</small>
                `;
                
                // On place le message dans la bonne section
                if (sections[data.category]) {
                    sections[data.category].appendChild(postDiv);
                    sections[data.category].style.display = "block"; // On affiche la section car elle a un message
                }
            });

            // Si vraiment aucun message sur le site
            if (snapshot.empty) {
                feed.innerHTML = "<p style='text-align:center; color:grey;'>Aucun gbairai pour le moment... Sois le premier !</p>";
            }

        }, (error) => {
            console.error("Erreur de lecture : ", error);
        });
    } catch (err) {
        console.error("Erreur générale : ", err);
    }
};

// Lancement automatique
initApp();
