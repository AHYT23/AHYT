const { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } = window;

window.publishPost = async function() {
    const cat = document.getElementById('catégorie').value;
    const texte = document.getElementById('postContent').value;

    if (texte.trim().length < 2) return alert("Message trop court !");

    try {
        await addDoc(collection(db, "posts"), {
            category: cat,
            content: texte,
            timestamp: serverTimestamp()
        });
        document.getElementById('postContent').value = "";
        alert("✅ Publié sur AHYT !");
    } catch (e) {
        alert("Erreur Firebase : " + e.message);
    }
};

const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
    const feed = document.getElementById('feed');
    feed.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        const div = document.createElement('div');
        div.style = "background:white; padding:15px; margin-bottom:10px; border-radius:8px; border-left:5px solid #333; box-shadow: 0 2px 5px rgba(0,0,0,0.1);";
        div.innerHTML = `<small style="color:gray">${data.category}</small><p style="margin:5px 0 0 0; font-family: sans-serif;">${data.content}</p>`;
        feed.appendChild(div);
    });
});
