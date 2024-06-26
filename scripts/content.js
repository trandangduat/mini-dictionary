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
                <span style="color:black;font-weight:bold;">${word}</span>
                <br>
                ${!phonetics ? "" : `<span style="font-weight:light;font-style: italic;">${phonetics}</span>`}
                <hr>
                <ul style = "list-style: square inside;">
                    ${definitions.map(definition => `<li>${definition}</li>`).join('')}
                </ul>
            `;
            if (popup) {
                popup.innerHTML = popupHTMLContent;
                popup.style.top = `${mousePos.y}px`;
                popup.style.left = `${mousePos.x}px`;
            }
            else {
                const popupStyle = `
                    position: fixed;
                    padding: 7px;
                    border: 1px solid #ccc;
                    z-index:9999;
                    background:white;
                    font-family: sans-serif;
                    max-width: 500px;
                    top:${mousePos.y + 10}px;
                    left:${mousePos.x + 10}px;
                `;
                document.body.insertAdjacentHTML('beforebegin', ` 
                    <div id="mini-dictionary-popup" style="${popupStyle}">
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

const main = (() => {
    document.body.addEventListener('mouseup', handleMouseUp);
})();