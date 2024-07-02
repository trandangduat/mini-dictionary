function cleanUp (string) {
    // remove all multiple spaces
    string = string.trim();
    string = string.replace(/\s+/g, ' ');
    // convert string into array of words
    string = string.split(' ');
    // only return the string if the string itself is a single word
    return (string.length == 1 ? string[0] : '');
}

async function handleMouseUp(event) {
    const mousePos = {
        x: event.clientX,
        y: event.clientY,
    };
    const selection = cleanUp(window.getSelection().toString());
    const popup = document.querySelector('#mini-dictionary-popup');
    if (selection.length > 0) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selection}`);
            const lookUpData = await response.json();
            const word = lookUpData[0].word;
            const phonetics = lookUpData[0].phonetic;
            const definitions = lookUpData[0].meanings.map(definition => definition.definitions[0].definition);
            const popupHTMLContent = `
                <div class="md-card-body">
                    <h5 class="md-card-title">${word}</h5>
                    ${!phonetics ? "" : `<h6 class="md-card-subtitle">${phonetics}</h6>`}
                    <hr class="md-hr">
                    <ul class="md-list">
                        ${definitions.map(definition => `<li>• ${definition}</li>`).join('')}
                    </ul>
                </div>
            `;
            if (popup) {
                popup.innerHTML = popupHTMLContent;
                popup.style.top = `${mousePos.y}px`;
                popup.style.left = `${mousePos.x}px`;
            }
            else {
                const popupStyle = `
                    position: fixed;
                    z-index: 9999;
                    top: ${mousePos.y + 10}px;
                    left: ${mousePos.x + 10}px;
                `;
                document.body.insertAdjacentHTML('beforebegin', ` 
                    <div id="mini-dictionary-popup" class="md-card" style="${popupStyle}">
                        ${popupHTMLContent}
                    </div>
                `);
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        if (popup) popup.remove();
    }
}

function injectCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .md-card {
            background-color: #343a40;
            border-radius: 0.25rem;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .md-card-body {
            padding: 1rem;
        }
        .md-card-title {
            color: #ffffff;
            font-size: 1.25rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
        }
        .md-card-subtitle {
            color: #6c757d;
            font-size: 1rem;
            font-weight: 400;
            margin-top: -0.375rem;
            margin-bottom: 0.75rem;
            font-style: italic;
        }
        .md-hr {
            border-top: 1px solid #6c757d;
            margin: 1rem 0;
        }
        .md-list {
            list-style-type: none;
            padding-left: 0;
            margin-bottom: 0;
        }
        .md-list li {
            color: #ffffff;
            margin-bottom: 0.5rem;
        }
    `;
    document.head.appendChild(style);
}

const main = (() => {
    injectCustomStyles();
    document.body.addEventListener('mouseup', handleMouseUp);
})();