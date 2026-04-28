// On récupère les outils Firebase que nous avons préparés dans index.html
const { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } = window;

// 1. FONCTION POUR PUBLIER UN MESSAGE
window.publishPost = async function() {
    const category = document.getElementById('category').value;
    const content = document.getElementById('postContent').value;
    const errorMsg = document.getElementById('error-msg');

    // Vérification de sécurité de base
    if (content.trim().length < 5) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = "Le message est trop court pour être publié !";
        return;
    }

   try {
    // Envoi vers la base de données Firebase
    await AjouterDoc(collection(base de données, "posts"), {
      catégorie: catégorie,
      texte: contenu,
      date: horodatage du serveur()
    });

    // On vide le champ texte après l'envoi réussi
    document.getElementById('postContent').value = "";
    message d'erreur.style.display = 'none';

  } catch (erreur) {
    console.error("Erreur d'envoi : ", erreur);
    alert("Erreur de connexion. Réessaie !");
  }
};

// 2. FONCTION POUR LIRE LES MESSAGES (MISE À JOUR AUTOMATIQUE)
const feed = document.getElementById('feed');
const q = query(collection(db, "posts"), orderBy("date", "desc"));

onSnapshot(q, (snapshot) => {
    // On vide l'affichage avant de remettre la liste à jour
    feed.innerHTML = '<div class="info-message">Bienvenue sur Ahyt. Les messages sont anonymes.</div>';
    
    snapshot.forEach((doc) => {
        const post = doc.data();
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        postElement.innerHTML = `
            <div class="post-category">${post.categorie}</div>
            <div class="post-content">${post.texte}</div>
            <div class="post-date">À l'instant</div>
        `;
        feed.appendChild(postElement);
    });
});
