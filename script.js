// On attend que les outils soient disponibles
const initApp = () => {
    const { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } = window;

    // Vérification : si db n'existe pas, on attend encore 1 seconde
    if (!db) {
        setTimeout(initApp, 1000);
        return;
    }

    // 1. FONCTION POUR PUBLIER
    window.publishPost = async function() {
        const catElem = document.getElementById('catégorie');
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
            textElem.value = "";
            alert("✅ Publié sur AHYT !");
        } catch (e) {
            console.error(e);
            alert("Erreur Firebase : " + e.message);
        }
    };

    // 2. AFFICHAGE DES MESSAGES
    try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
            const feed = document.getElementById('feed');
            if (!feed) return;
            
            feed.innerHTML = "";
            snapshot.forEach((doc) => {
                const data = doc.data();
                const div = document.createElement('div');
                div.style = "background:white; padding:15px; margin-bottom:10px; border-radius:8px; border-left:5px solid #333; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align:left;";
                div.innerHTML = `
                    <small style="color:gray; font-size:12px;">${data.category}</small>
                    <p style="margin:5px 0 0 0; font-family: sans-serif; color:#333;">${data.content}</p>
                `;
                feed.appendChild(div);
            });
        }, (error) => {
            console.log("Erreur de lecture : ", error);
        });
    } catch (err) {
        console.error("Erreur de configuration : ", err);
    }
};

// Lancement de la surveillance
initApp();
