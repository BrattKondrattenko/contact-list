const initialState = {}
const renderMain = () => {
    const englishACharCode = 65; // A
    const englishZCharCode = 90; // Z

    const cyrillicACharCode = 1040; // А
    const cyrillicZCharCode = 1071; // Я


    const selectedLanguage = prompt('Выберите язык (английский, русский):');

    const setAlphabet = (aCharCode, zCharCode) => {
        for (let currentCharCode = aCharCode; currentCharCode <= zCharCode; currentCharCode++) {
            const letter = String.fromCharCode(currentCharCode);
            initialState[letter] = [{ count: 0 }];
        }
    }

    const renderAlphabetUI = (alphabet) => {
        const divsColumnItem = document.querySelector('.contacts-table__column ')

        alphabet.forEach((_, index) => {

            const columnItem = document.createElement('div')
            columnItem.classList.add('column__item', 'item')
            columnItem.setAttribute('data-column-item', '')

            const itemLetter = document.createElement('div')
            const letter = alphabet[index]
            itemLetter.classList.add('item__letter')
            itemLetter.setAttribute('data-first-letter', letter)
            itemLetter.textContent = letter
            columnItem.appendChild(itemLetter)

            divsColumnItem.appendChild(columnItem)
        })
    }

    const render = (selectedLanguage) => {
        let alphabetToRender
        switch (selectedLanguage.toLowerCase()) {
            case 'английский':
                setAlphabet(englishACharCode, englishZCharCode)
                alphabetToRender = Object.keys(initialState).filter(letter => /[A-Z]/.test(letter));
                break;
            case 'русский':
                setAlphabet(cyrillicACharCode, cyrillicZCharCode)
                alphabetToRender = Object.keys(initialState).filter(letter => /[А-Я]/.test(letter));
                break;
            default:
                alphabetToRender = Object.keys(initialState)
                break;
        }
        renderAlphabetUI(alphabetToRender);
    }

    return render(selectedLanguage)
}

export { renderMain, initialState }