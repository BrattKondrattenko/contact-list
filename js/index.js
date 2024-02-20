import {renderMain, initialState} from "./setLanguage.mjs";

document.addEventListener('DOMContentLoaded', function() {

    renderMain()

    let contacts = { ...initialState };

    const selectors = {
        root: '[data-contacts]',
        input: '[data-input]',
        button: '[data-button]',
        table: '[data-table]',
        column: '[data-column]',
        letter: '[data-first-letter]',
        columnItem: '[data-column-item]',

        modal: '[data-modal]',
        inputModal: '[data-input-modal]'
    };

    const rootElement = document.querySelector(selectors.root);

    const modalWindow = document.querySelector(selectors.modal)
    const inputElements = rootElement.querySelectorAll(selectors.input);
    const inputModal = rootElement.querySelector(selectors.inputModal)

    const addButtonElement = rootElement.querySelector(`${selectors.button}[data-action="add"]`);
    const clearButtonElement = rootElement.querySelector(`${selectors.button}[data-action="clear"]`);
    const searchButtonElement = rootElement.querySelector(`${selectors.button}[data-action="search"]`);

    const tableElement = rootElement.querySelector(selectors.table);

    const columnItemElements = rootElement.querySelectorAll(selectors.columnItem);

    const getFirstLetter = (word) => word[0].toUpperCase();

    const clearInput = () => {
        inputElements.forEach((inputElement) => {
            inputElement.value = '';
        });
    };

    const clearAllContactsDB = () => {
        contacts = {...initialState}
    }

    const clearAllContactsUI = () => {
        document.querySelectorAll('.added-contact').forEach(div => div.remove());
    }

    const clearContacts = () => {
        clearAllContactsDB()
        clearAllContactsUI()
        resetAllCountDB()
        resetAllCountUI()
        clearInput()
    };

    const phoneLength = 5;
    const regexpForPhone = new RegExp(`^\\+\\d{${phoneLength},}$`);

    const validatePhone = (phone) => regexpForPhone.test(phone)

    const validateName = (name) => name.length >= 2


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

    const renderContacts = (contact, firstLetter) => {
        let contactContainer = document.querySelector(`[data-first-letter="${firstLetter}"]`);

        let contactElement = document.createElement("div");

        contactContainer.classList.add('hasContacts');
        contactElement.classList.add('added-contact', 'hidden');

        contactElement.setAttribute('data-contact-id', contact.id);
        contactElement.innerHTML =
            `<p>id: ${contact.id} <br> name: ${contact.name} <br>phone: ${contact.phone} </p>
        <br>
        <span class="delete-contact">X</span>`;

        const contactElements = contactContainer.querySelectorAll('.added-contact');

        const deleteButton = contactElement.querySelector('.delete-contact');

        deleteButton.addEventListener('click', (e) => {
            console.log(e)
            const contactParent = e.target.closest('.added-contact');
            const contactContainer = contactParent.closest('.item__letter');

            console.log(contactContainer)
            const firstLetter = contactContainer.dataset.firstLetter;
            const contactId = parseInt(contactParent.dataset.contactId);

            removeContactUI(firstLetter, contactId)

            contactParent.remove();
        });

        if (contactElements.length > 0 && !contactElements[0].classList.contains('hidden')) {
            contactElement.classList.remove('hidden');
        } else {
            contactElement.classList.add('hidden');
        }

        contactContainer.appendChild(contactElement);
        renderCount(firstLetter);
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

    const removeContactDB = (id) => {
        for (let key in contacts) {
            contacts[key] = contacts[key].filter((contact) => contact.id !== id);
            if (contacts[key][0].count !== 0) {
                contacts[key][0].count -= 1;
            }
        }
    };

    const resetAllCountDB = () => {
        for (let key in contacts) {
            contacts[key][0].count = 0;
        }
    }

    const resetAllCountUI = () => {
        document.querySelectorAll('.contact-count').forEach(count => count.remove());
    }

    const toggleActive = (e) => {
        if (e.target.classList.contains('item__letter')) {
            const contactElements = e.currentTarget.querySelectorAll('.added-contact');
            contactElements.forEach((contact) => {
                contact.classList.toggle('hidden');
            });
        }
    }

    addButtonElement.addEventListener('click', addContact);
    clearButtonElement.addEventListener('click', clearContacts);

    inputElements.forEach((input) =>
        input.addEventListener('input', (e) => {
            checkInputs(e)
        }))

    const removeContactUI = (firstLetter, contactId) => {
        removeContactDB(contactId);
        renderCount(firstLetter);
    }

    const renderCount = (firstLetter) => {
        const contactContainer = document.querySelector(`[data-first-letter="${firstLetter}"]`)
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

    columnItemElements.forEach((item) => {
        item.addEventListener('click', (e) => {
            toggleActive(e)
        });
    });

    const modalCloseButton = document.querySelector('.modal__close')
    modalCloseButton.addEventListener('click', () => {
        modalWindow.classList.toggle('active')
    })

    searchButtonElement.addEventListener('click', () => {
        modalWindow.classList.toggle('active')
    })

    const modalContent = document.querySelector('.modal__content')

    inputModal.addEventListener('input', (e) => {
        let value = e.target.value.trim()
        const allAddedContacts = document.querySelectorAll('.added-contact')
        if (value !== '') {
            allAddedContacts.forEach((item) => {
                const contactText = item.querySelector('p').textContent;
                const contactName = contactText.split('name: ')[1].split('phone:')[0].trim();

                if (contactName.startsWith(value)) {
                    const itemLetter = item.closest('.item__letter')
                    item.classList.add('active')
                    const itemLetterClone = itemLetter.cloneNode(true)
                    modalContent.appendChild(itemLetterClone)
                } else {
                    const itemLetter = item.closest('.item__letter')
                    itemLetter.remove()
                }
            })
        }
    })
});



// tableElement.addEventListener('click', (e) => {
//     if (e.target.classList.contains('delete-contact')) {
//         const contactParent = e.target.closest('.added-contact');
//         const contactContainer = contactParent.closest('.item__letter');
//         const firstLetter = contactContainer.dataset.firstLetter;
//         const contactId = parseInt(contactParent.dataset.contactId);
//
//         removeContactUI(firstLetter, contactId)
//         contactParent.remove();
//     }
// });
