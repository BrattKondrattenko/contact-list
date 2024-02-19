const initContact = () => {
    const selectors = {
        root: '[data-contacts]',
        input: '[data-input]',
        button: '[data-button]',
        table: '[data-table]',
        column: '[data-column]',
        letter: '[data-first-letter]',
        columnItem: '[data-column-item]',
    };

    const initialState = {};

    // Генерация начального состояния по алфавиту
    for (let charCode = 65; charCode <= 90; charCode++) {
        const letter = String.fromCharCode(charCode);
        initialState[letter] = [{ count: 0 }];
    }

    let contacts = { ...initialState };

    const rootElement = document.querySelector(selectors.root);

    const inputElements = rootElement.querySelectorAll(selectors.input);

    const addButtonElement = rootElement.querySelector(`${selectors.button}[data-action="add"]`);
    const clearButtonElement = rootElement.querySelector(`${selectors.button}[data-action="clear"]`);

    const tableElement = rootElement.querySelector(selectors.table);

    const columnItemElements = rootElement.querySelectorAll(selectors.columnItem);

    const clearInput = () => {
        inputElements.forEach((inputElement) => {
            inputElement.value = '';
        });
    };

    const getFirstLetter = (word) => word[0].toUpperCase();

    const validatePhone = (phone) => {
        return /^\+\d{5,}$/.test(phone);
    };

    const validateName = (name) => {
        return name.length >= 2;
    };

    const renderCount = (contactContainer, firstLetter) => {
        const contactCount = contacts[firstLetter][0];
        if (contactCount) {
            let countElement = contactContainer.querySelector(".contact-count");
            if (!countElement) {
                countElement = document.createElement("span");
                countElement.classList.add("contact-count");
                contactContainer.prepend(countElement);
            }
            countElement.textContent = contactCount.count;
            if (contactCount.count === 0) {
                countElement.remove();
            }
        }
    };

    const removeContactDB = (id) => {
        for (let key in contacts) {
            contacts[key] = contacts[key].filter((contact) => contact.id !== id);
            if (contacts[key][0].count !== 0) {
                contacts[key][0].count -= 1;
            }
        }
    };

    const renderContacts = (contact, firstLetter) => {
        let contactContainer = document.querySelector(`[data-first-letter="${firstLetter}"]`);

        let contactElement = document.createElement("div");

        contactContainer.classList.add('hasContacts');
        contactElement.classList.add('added-contact', 'hidden');

        contactElement.setAttribute('data-contact-id', contact.id);
        contactElement.innerHTML =
            `<p>id: ${contact.id} <br> name: ${contact.name} <br>phone: ${contact.phone} </p>
        <br>
        <span data-contacts-table-delete-contact class="delete-contact">X</span>`;

        const contactElements = contactContainer.querySelectorAll('.added-contact');

        if (contactElements.length > 0 && !contactElements[0].classList.contains('hidden')) {
            contactElement.classList.remove('hidden');
        } else {
            contactElement.classList.add('hidden');
        }

        contactContainer.appendChild(contactElement);
        renderCount(contactContainer, firstLetter);
    };

    const removeContactUI = (e) => {
        if (e.target.classList.contains('delete-contact')) {
            const contactParent = e.target.closest('.added-contact');
            const contactContainer = contactParent.closest('.item__letter');
            const firstLetter = contactContainer.dataset.firstLetter;
            const contactId = parseInt(contactParent.dataset.contactId);

            removeContactDB(contactId);
            contactParent.remove();

            renderCount(contactContainer, firstLetter);
        }
    }

    const clearAllContactsDB = () => {
        contacts = {...initialState}
    }

    const clearAllContactsUI = () => {
        document.querySelectorAll('.added-contact').forEach(div => div.remove());
    }

    const resetAllCountDB = () => {
        for (let key in contacts) {
            contacts[key][0].count = 0;
        }
    }

    const resetAllCountUI = () => {
        document.querySelectorAll('.contact-count').forEach(count => count.remove());
    }

    const clearContacts = () => {
        clearAllContactsDB()
        clearAllContactsUI()
        resetAllCountDB()
        resetAllCountUI()
        clearInput()
    };

    const addContact = () => {
        checkValidate()
        let name = inputElements[0].value;
        let position = inputElements[1].value;
        let phone = inputElements[2].value;

        let contact = { id: Date.now(), name, position, phone };

        let firstLetter = getFirstLetter(name);

        contacts[firstLetter].push(contact);
        contacts[firstLetter][0].count++;

        renderContacts(contact, firstLetter);
        clearInput();
    };

    const toggleActive = (e) => {
        if (e.target.classList.contains('item__letter')) {
            const contactElements = e.currentTarget.querySelectorAll('.added-contact');
            contactElements.forEach((contact) => {
                contact.classList.toggle('hidden');
            });
        }
    }

    const checkValidate = () => {
        inputElements.forEach((input) => {
            if (input.classList.contains('error')) {
                input.value = ''
                input.type === 'tel'
                    ? input.placeholder = 'invalid'
                    : input.placeholder = 'Must be > 2'
            }
        })
    }

    const checkInputs = (e) => {
        const inputValue = e.target.value

        if (e.target.type === 'tel') {
            !validatePhone(inputValue)
                ? e.target.classList.add('error')
                : e.target.classList.remove('error');

            inputValue === ''
                ? e.target.classList.remove('error')
                : inputValue
        } else {
            !validateName(inputValue)
                ? e.target.classList.add('error')
                : e.target.classList.remove('error');

            inputValue === ''
                ? e.target.classList.remove('error')
                : inputValue
        }

    }

    addButtonElement.addEventListener('click', addContact);
    clearButtonElement.addEventListener('click', clearContacts);

    inputElements.forEach((input) =>
        input.addEventListener('input', (e) => {
            checkInputs(e)
    }))

    tableElement.addEventListener('click', (e) => {
        removeContactUI(e)
    });

    columnItemElements.forEach((item) => {
        item.addEventListener('click', (e) => {
            toggleActive(e)
        });
    });
};


document.addEventListener('DOMContentLoaded', initContact);
