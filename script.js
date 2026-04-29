const { db, collection, query, orderBy, onSnapshot } = window;

// Fonction pour organiser l'affichage
const initFeed = () => {
    if (!db) {
        setTimeout(initFeed, 1000);
        return;
    }

    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    
    onSnapshot(q, (snapshot) => {
        const feed = document.getElementById('feed');
        feed.innerHTML = ""; // On vide tout

        // On crée les conteneurs pour chaque catégorie
        const sections = {
            "Vie de Campus": document.createElement('div'),
            "Cours": document.createElement('div'),
            "Divers": document.createElement('div')
        };

        // On ajoute des titres à chaque section
        for (let cat in sections) {
            sections[cat].innerHTML = `<h3 style="margin-top:20px; border-bottom: 2px solid #333; padding-bottom:5px;">${cat}</h3>`;
            feed.appendChild(sections[cat]);
        }

        // On range chaque message dans la bonne section
        snapshot.forEach((doc) => {
            const data = doc.data();
            const postDiv = document.createElement('div');
            postDiv.style = "background:white; padding:12px; margin:10px 0; border-radius:8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);";
            postDiv.innerHTML = `<p style="margin:0; font-family: sans-serif;">${data.content}</p>`;
            
            // On l'ajoute à la section correspondante
            if (sections[data.category]) {
                sections[data.category].appendChild(postDiv);
            } else {
                sections["Divers"].appendChild(postDiv);
            }
        });
    });
};

initFeed();
