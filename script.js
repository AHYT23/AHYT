const initApp = () => {
    const { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } = window;

    if (!db) {
        setTimeout(initApp, 1000);
        return;
    }

    // --- 1. FONCTION DE PUBLICATION (Inchangée) ---
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
            alert("Erreur : " + e.message);
        }
    };

    // --- 2. AFFICHAGE CLASSÉ PAR CATÉGORIE ---
    try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        
        onSnapshot(q, (snapshot) => {
            const feed = document.getElementById('feed');
            if (!feed) return;
            
            feed.innerHTML = ""; // Vide l'ancien affichage

            // On définit les catégories exactes de ton <select>
            const categories = ["Vie de Campus", "Cours", "Divers"];
            const sections = {};

            // Création visuelle des titres de catégories
            categories.forEach(cat => {
                const sectionDiv = document.createElement('div');
                sectionDiv.style = "margin-bottom: 25px;";
                sectionDiv.innerHTML = `<h3 style="border-bottom: 2px solid #333; color: #222; font-family: sans-serif; padding-bottom: 5px;">${cat}</h3>`;
                sections[cat] = sectionDiv;
                feed.appendChild(sectionDiv);
            });

            // On parcourt les messages et on les range au bon endroit
            snapshot.forEach((doc) => {
                const data = doc.data();
                const postDiv = document.createElement('div');
                postDiv.style = "background:white; padding:15px; margin-bottom:10px; border-radius:8px; border-left:5px solid #333; box-shadow: 0 2px 5px rgba(0,0,0,0.1);";
                postDiv.innerHTML = `<p style="margin:0; font-family: sans-serif; color:#333;">${data.content}</p>`;
                
                // Si la catégorie existe, on l'ajoute à sa section
                if (sections[data.category]) {
                    sections[data.category].appendChild(postDiv);
                } else {
                    sections["Divers"].appendChild(postDiv);
                }
            });

            // On cache les sections qui n'ont aucun message pour faire propre
            categories.forEach(cat => {
                if (sections[cat].children.length === 1) { 
                    sections[cat].style.display = "none";
                }
            });

        }, (error) => {
            console.log("Erreur de lecture : ", error);
        });
    } catch (err) {
        console.error("Erreur : ", err);
    }
};

initApp();
