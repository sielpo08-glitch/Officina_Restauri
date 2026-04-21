let tuttiProdotti = [];

document.addEventListener('DOMContentLoaded', caricaCatalogo);

function caricaCatalogo() {
    fetch('csv.csv')
        .then(response => {
            if (!response.ok) throw new Error("File CSV non trovato");
            return response.text();
        })
        .then(csvText => {
            tuttiProdotti = parseCSV(csvText);
            mostraProdotti(tuttiProdotti);
        })
        .catch(error => console.error('Errore:', error));
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const prodotti = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const prodotto = {};
        headers.forEach((header, index) => {
            prodotto[header.trim()] = values[index] ? values[index].replace(/"/g, '').trim() : '';
        });
        prodotti.push(prodotto);
    }
    return prodotti;
}

function mostraProdotti(prodotti) {
    const catalogo = document.getElementById('catalogo');
    if (!catalogo) return;
    catalogo.innerHTML = '';

    prodotti.forEach(p => {
        const card = document.createElement('div');
        card.className = 'prodotto-card';
        card.innerHTML = `
            <div class="prodotto-img-container">
                <img src="${p.immagine_principale}" 
                     class="prodotto-img" 
                     onerror="this.src='https://via.placeholder.com/400x300/2c3e50/e67e22?text=Immagine+non+disponibile'">
            </div>
            <div class="prodotto-body">
                <div class="prodotto-meta">
                    <span class="prodotto-categoria">${p.categoria.replace('categoria_', '')}</span>
                    <span>${p.anno_produzione}</span>
                </div>
                <h3>${p.nome_oggetto}</h3>
                <p class="prodotto-stato stato-${p.stato}">${p.stato.replace('_', ' ')}</p>
                <div class="prodotto-prezzi">
                    <span class="prezzo-base">€${p.prezzo_base}</span>
                </div>
                <button class="btn-aggiungi-carrello" onclick="aggiungiAlCarrello('${p.nome_oggetto.replace(/'/g, "\\'")}', '${p.prezzo_base}', '${p.immagine_principale}')">
                    Aggiungi al carrello
                </button>
            </div>`;
        catalogo.appendChild(card);
    });
}

function filtraProdotti(filtro) {
    const filtrati = filtro === 'tutti' ? tuttiProdotti : tuttiProdotti.filter(p => p.stato === filtro);
    mostraProdotti(filtrati);
}

function aggiungiAlCarrello(nome, prezzo, immagine) {
    const carrello = JSON.parse(localStorage.getItem('carrello')) || [];
    const esistente = carrello.find(i => i.nome === nome);
    if (esistente) esistente.quantita++;
    else carrello.push({ nome, prezzo, immagine, quantita: 1 });
    localStorage.setItem('carrello', JSON.stringify(carrello));
    alert('Aggiunto!');
}
