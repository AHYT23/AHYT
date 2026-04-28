const bannedWords = ["insulte", "connard", "salaud", "pute", "merde", "idiot", "imbécile"];

function publishPost() {
    const contentInput = document.getElementById('postContent');
    const categoryInput = document.getElementById('category');
    const errorMsg = document.getElementById('error-msg');
    
    const content = contentInput.value.trim();
    const category = categoryInput.value;

    if (content.length < 5) {
        showError("Message trop court pour être publié.");
        return;
    }

    let isToxic = bannedWords.some(word => content.toLowerCase().includes(word));
    if (isToxic) {
        showError("Le contenu ne respecte pas les règles de AHYT.");
        return;
    }

    errorMsg.style.display = "none";

    const feed = document.getElementById('feed');
    const date = new Date().toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.innerHTML = `
        <div class="post-header">
            <span class="post-category">${category}</span>
            <span class="post-date">Il y a un instant</span>
        </div>
        <div class="post-content">${escapeHTML(content)}</div>
    `;

    feed.prepend(postDiv);
    contentInput.value = "";
}

function showError(text) {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.innerText = text;
    errorMsg.style.display = "block";
}

function escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}
