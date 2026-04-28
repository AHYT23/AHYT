// 1. RÉCUPÉRATION DES OUTILS DEPUIS WINDOW (Lien avec index.html)
const { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } = window;

// 2. FONCTION POUR PUBLIER UN MESSAGE
window.publishPost = async function() {
    const categoryElement = document.getElementById('catégorie'); // Vérifie bien l'accent dans index.html
    const contentElement = document.getElementById('postContent');
    
    // Sécurité : Vérifier si les éléments existent
    if (!categoryElement || !contentElement) {
        alert("Erreur technique : Éléments HTML introuvables.");
        return;
    }

    const category = categoryElement.value;
    const content = contentElement.value;

    if (content.trim().length < 2) {
        alert("Ton message est trop court !");
        return;
    }

    try {
        // Envoi vers la collection "posts" sur Firebase
        await addDoc(collection(db, "posts"), {
            category: category,
            content: content,
            timestamp: serverTimestamp()
        });
        
        // Nettoyage de la zone de texte
        contentElement.value = "";
        alert("✅ Message publié avec succès !");
    } catch (e) {
        console.error("Erreur Firebase : ", e);
        alert("Erreur de connexion : " + e.message);
    }
};

// 3. AFFICHAGE DES MESSAGES EN TEMPS RÉEL
const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
    const feed = document.getElementById('feed');
    if (!feed) return;
    
    feed.innerHTML = ""; // On vide pour mettre à jour
    snapshot.forEach((doc) => {
        const data = doc.data();
        const postDiv = document.createElement('div');
        postDiv.style.background = "#f9f9f9";
        postDiv.style.margin = "10px 0";
        postDiv.style.padding = "15px";
        postDiv.style.borderRadius = "8px";
        postDiv.style.borderLeft = "5px solid #333";
        
        postDiv.innerHTML = `
            <small style="color: #666;">${data.category}</small>
            <p style="margin: 5px 0 0 0;">${data.content}</p>
        `;
        feed.appendChild(postDiv);
    });
});
