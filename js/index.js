const initContact = () => {
    const selectors = {
        root: '[data-contacts]',
        typeInputs: '[data-contacts-table-type-input]',
        nameInput: '[data-contacts-table-name-input]',
        positionInput: '[data-contacts-table-position-input]',
        phoneInput: '[data-contacts-table-phone-input]',

        addButton: '[data-contacts-table-add-button]',
        clearButton: '[data-contacts-table-clear-button]',
        searchButton: '[data-contacts-table-search-button]',

        itemsTable: '[data-contacts-table-first-letter]',
        columnsItem: '[data-contacts-table-column]',
    }

    const initialState = {
        'A': [{
            count: 0,
        }],
        'B': [{
            count: 0,
        }],
        'C': [{
            count: 0,
        }],
        'D': [],
        'E': [],
        'F': [],
        'G': [],
        'H': [],
        'I': [],
        'J': [],
        'K': [],
        'L': [],
        'M': [],
        'N': [],
        'O': [],
        'P': [],
        'Q': [],
        'R': [],
        'S': [],
        'T': [],
        'U': [],
        'V': [],
        'W': [],
        'X': [],
        'Y': [],
        'Z': []
    }

    let contacts = {
        ...initialState
    };


    const rootElement = document.querySelector(selectors.root)

    let typeInputElements = rootElement.querySelectorAll(selectors.typeInputs)
    let nameInputElement = rootElement.querySelector(selectors.nameInput)
    let positionInputElement = rootElement.querySelector(selectors.positionInput)
    let phoneInputElement = rootElement.querySelector(selectors.phoneInput)

    const addButtonElement = rootElement.querySelector(selectors.addButton)
    const clearButtonElement = rootElement.querySelector(selectors.clearButton)

    const itemsTableElements = rootElement.querySelectorAll(selectors.itemsTable)
    const contactList = document.querySelector('.contacts-table__column')

    const clearInput = () => {
        typeInputElements.forEach((inputElement) => {
            inputElement.value = ''
        })
    }

    const getFirstLetter = (word) => {
        return word[0].toUpperCase()
    }

    const renderCount = (contactContainer, firstLetter) => {

        let countElement = contactContainer.querySelector(".contact-count");
        if (countElement) {
            // Если счетчик существует, обновляем его значение
            countElement.textContent = contacts[firstLetter][0].count;
        } else {
            // Если счетчика нет, создаем новый и добавляем его в контейнер
            countElement = document.createElement("span");
            countElement.classList.add("contact-count");
            countElement.textContent = contacts[firstLetter][0].count;
            contactContainer.prepend(countElement);
        }

    }
    const renderContacts = (contact, firstLetter) => {
        let contactContainer = document.querySelector(`[data-contacts-table-first-letter="${firstLetter}"]`)
        let contactElement = document.createElement("div")

        contactContainer.classList.add('hasContacts')
        contactElement.classList.add('added-contact', 'hidden')

        contactElement.setAttribute('data-contact-id', contact.id)

        contactElement.innerHTML =
            `<p>id: ${contact.id} <br> name: ${contact.name} <br>phone: ${contact.phone} </p>
            <br>
            <span data-contacts-table-delete-contact class="delete-contact">X</span>`
        contactContainer.appendChild(contactElement)

        renderCount(contactContainer, firstLetter)

    }

    const clearContacts = () => {
        const divsWithClass = document.querySelectorAll('.added-contact');
        divsWithClass.forEach(div => div.remove());
    }

    const removeContact = (id) => {
        for (let key in contacts) {
            contacts[key] = contacts[key].filter((contact) => contact.id !== id)
            contacts[key][0].count-=1;
        }
    }

    const addContact = () => {
        let name = nameInputElement.value
        let position = positionInputElement.value
        let phone = phoneInputElement.value

        let contact = {id: Date.now(), name: name, position: position, phone: phone}

        let firstLetter = getFirstLetter(name)
        contacts[firstLetter].push(contact)
        const count = contacts[firstLetter][0].count += 1

        renderContacts(contact, firstLetter, count)
        clearInput()
    }

    addButtonElement.addEventListener('click', addContact)
    clearButtonElement.addEventListener('click', clearContacts)

    contactList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-contact')) {
            const contactParent = e.target.closest('.added-contact')
            const contactContainer = contactParent.closest('.item__letter')

            const firstLetter = contactContainer.dataset.contactsTableFirstLetter
            const contactId = parseInt(contactParent.dataset.contactId)
            removeContact(contactId)
            contactParent.remove()
            renderCount(contactContainer, firstLetter)
        }
    })

    itemsTableElements.forEach((item) => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('hasContacts')) {
                const divs = e.target.querySelectorAll('div')

                divs.forEach((div) => {
                    div.classList.toggle('hidden')
                })
            }
        })
    })
}

document.addEventListener('DOMContentLoaded', () => {
    initContact()
})
