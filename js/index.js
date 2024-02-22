import { renderMain, initialState } from "./setLanguage.mjs";

document.addEventListener('DOMContentLoaded', function() {
    renderMain();

    let contacts = { ...initialState };

    const selectors = {
        root: '[data-contacts]',
        input: '[data-input]',
        button: '[data-button]',
        modal: '[data-modal]',
        modalEdit: '[data-edit]',
        inputModal: '[data-input-modal]',
        modalContent: '.modal__content',
        modalCloseButton: '.modal__close',
        buttonShow: '.modal__button-show',
        editButton: '.edit-contact',
        inputsEdit: '[data-edit]',
        saveButton: '[data-save]'
    };

    const rootElement = document.querySelector(selectors.root);
    const modalWindow = rootElement.querySelector(selectors.modal);
    const modalEditWindows = rootElement.querySelector(selectors.modalEdit)
    const inputModal = rootElement.querySelector(selectors.inputModal);
    const modalContent = rootElement.querySelector(selectors.modalContent);
    const modalCloseButton = rootElement.querySelector(selectors.modalCloseButton);
    const buttonShow = rootElement.querySelector(selectors.buttonShow);
    const editButton = rootElement.querySelector(selectors.editButton)
    const saveButton = rootElement.querySelector(selectors.saveButton)

    const inputsEdit = document.querySelectorAll(selectors.inputsEdit)

    const inputElements = rootElement.querySelectorAll(selectors.input);
    const addButtonElement = rootElement.querySelector(`${selectors.button}[data-action="add"]`);
    const clearButtonElement = rootElement.querySelector(`${selectors.button}[data-action="clear"]`);
    const searchButtonElement = rootElement.querySelector(`${selectors.button}[data-action="search"]`);

    const columnItems = document.querySelectorAll('.item')
    const getFirstLetter = word => word[0].toUpperCase();
    const clearInput = () => {
        inputElements.forEach(input => input.value = '');
        inputsEdit.forEach(input => input.value = '');
    }
    const isLengthValid = (value, minLength) => value.trim().length >= minLength;

    const updateContactsState = () => contacts = { ...initialState };
    const resetUI = () => document.querySelectorAll('.added-contact').forEach(div => div.remove());
    const resetCount = () => document.querySelectorAll('.count-element').forEach(count => count.remove())

    document.querySelectorAll('[data-input]').forEach(input => {
        input.addEventListener('input', () => {
            let isValid = true;
            const value = input.value.trim();
            const type = input.getAttribute('data-type');

            if (value.length < 4) isValid = false;

            if (type === 'phone' && !isPhoneValid(value)) isValid = false

            input.classList.toggle('error', !isValid);
        });
    })

    const isEmpty = (value) => value.trim() === '';

    const isPhoneValid = (phone) => /^\+\d{2,15}$/.test(phone);

    const renderCount = () => {
        Object.keys(contacts).forEach(firstLetter => {
            const count = contacts[firstLetter].length - 1;

            let countElement = document.querySelector(`[data-count="${firstLetter}"]`);
            if (!countElement) {
                countElement = document.createElement("span");
                countElement.setAttribute('data-count', firstLetter);
                countElement.classList.add('count-element')
                const letterContainer = document.querySelector(`[data-first-letter="${firstLetter}"]`);
                letterContainer.prepend(countElement);
            }
            if (count === 0) {
                countElement.classList.add('hidden')
            } else {
                countElement.classList.remove('hidden')
            }

            countElement.textContent = `Count: ${count}`;
        });
    };

    const renderContacts = (contact, firstLetter, container = null) => {
        if (!contact.id) {
            return;
        }

        const contactContainer = container || document.querySelector(`[data-first-letter="${firstLetter}"]`) || createContactContainer(firstLetter);
        const contactElement = document.createElement("div");
        contactElement.classList.add('added-contact', 'hidden');

        if (contactContainer)
        contactElement.setAttribute('data-contact-id', contact.id);
        contactElement.innerHTML = `
        name:${contact.name}<br> position:${contact.position}<br> phone:${contact.phone}<br>
        <span class="delete-contact" data-contact-id="${contact.id}">X</span>
        <span class="edit-contact hidden" data-contact-id="${contact.id}">EDIT</span>`;
        contactContainer.appendChild(contactElement);

        addDeleteEventListener(contactElement.querySelector('.delete-contact'));
        addEditEventListener(editButton, contact)
    };


    const addContact = contact => {
        const firstLetter = getFirstLetter(contact.name);
        if (!contacts[firstLetter]) contacts[firstLetter] = [];
        contacts[firstLetter].push(contact);
        renderContacts(contact, firstLetter);
        clearInput();
        renderCount()
    };

    const handleAddContact = () => {
        const name = inputElements[0].value;
        const position = inputElements[1].value;
        const phone = inputElements[2].value;

        if (isEmpty(name) || isEmpty(position) || isEmpty(phone)) {
            alert('Заполните все поля')
            return
        }

        const contact = { id: Date.now(), name, position, phone };
        addContact(contact);
    };

    const removeContact = (firstLetter, contactId) => {
        const contactIndex = contacts[firstLetter].findIndex(contact => contact.id === contactId);
        if (contactIndex > -1) {
            contacts[firstLetter].splice(contactIndex, 1);
        }
        const contactElements = document.querySelectorAll(`[data-contact-id="${contactId}"].added-contact`);
        console.log(contactElements)
        contactElements.forEach(element => element.remove());
        renderCount()
    };

    const createContactContainer = (firstLetter) => {
        const container = document.createElement("div");
        container.setAttribute('data-first-letter', firstLetter);
        rootElement.appendChild(container);
        return container;
    };

    const updateContact = (contactId, updatedContact) => {
        Object.keys(contacts).forEach(letter => {
            const index = contacts[letter].findIndex(contact => contact.id === parseInt(contactId));
            console.log(index)
            if (index !== -1) {
                contacts[letter][index] = { ...contacts[letter][index], ...updatedContact };
                console.log(contacts[letter][index])
            }
        });

        resetUI();
        Object.keys(contacts).forEach(letter => {
            contacts[letter].forEach(contact => renderContacts(contact, letter));
        });
        renderCount();
    }

    const addDeleteEventListener = (deleteButton) => {
        deleteButton.addEventListener('click', () => {
            const contactId = parseInt(deleteButton.dataset.contactId); // Используйте .dataset для доступа к атрибутам данных
            let firstLetter = null;
            for (const letter in contacts) {
                const contact = contacts[letter].find(contact => contact.id === contactId);
                if (contact) {
                    firstLetter = getFirstLetter(contact.name);
                    break;
                }
            }

            if (firstLetter) {
                removeContact(firstLetter, contactId);
            } else {
                console.error('Contact or first letter not found');
            }
        });
    };
    const addEditEventListener = (editButton, contact) => {
        editButton.addEventListener('click', () => {
            modalEditWindows.classList.toggle('active')
            modalEditWindows.setAttribute('data-current-contact-id', contact.id);
            inputsEdit[1].value = contact.name
            inputsEdit[2].value = contact.position
            inputsEdit[3].value = contact.phone
        })
    }
    const setupEventListeners = () => {
        addButtonElement.addEventListener('click', handleAddContact);
        clearButtonElement.addEventListener('click', handleClearContacts);
        modalCloseButton.addEventListener('click', () => modalWindow.classList.toggle('active'));
        searchButtonElement.addEventListener('click', () => modalWindow.classList.toggle('active'));
        buttonShow.addEventListener('click', () =>  renderContactsInModal());
        inputModal.addEventListener('input', (e) => renderContactsInModal(e.target.value));
        columnItems.forEach((item) => {
            item.addEventListener('click', (e) => {
                if (e.target.querySelector('div.added-contact')) {
                    const allDivs = e.target.querySelectorAll('div.added-contact')
                     allDivs.forEach((item) => {
                         item.classList.toggle('hidden')
                     })
                }
            })
        })
        saveButton.addEventListener('click', () => {
            const contactId = modalEditWindows.getAttribute('data-current-contact-id');
            const name = inputsEdit[1].value;
            const position = inputsEdit[2].value;
            const phone = inputsEdit[3].value;

            if (contactId) {
                updateContact(contactId, { name, position, phone });
            } else {
                const newContact = { id: Date.now(), name, position, phone };
                addContact(newContact);
            }

            modalEditWindows.classList.remove('active');
            clearInput();
        })
    };

    const handleClearContacts = () => {
        updateContactsState();
        resetCount()
        resetUI();
    };

    const renderContactsInModal = (searchTerm = "") => {
        modalContent.innerHTML = ''; // Очищаем содержимое модального окна
        const lowerCaseSearchTerm = searchTerm.trim().toLowerCase();
        Object.keys(contacts).forEach(firstLetter => {
            contacts[firstLetter].forEach(contact => {
                if (contact.name && (!searchTerm || (contact.name !== undefined && contact.name.toLowerCase().startsWith(lowerCaseSearchTerm)))) {
                    renderContacts(contact, firstLetter, modalContent);
                    modalContent.querySelectorAll('div.added-contact').forEach((item) => {
                        item.classList.remove('hidden')
                    })

                    modalContent.querySelectorAll('.edit-contact').forEach((item) => {
                        item.classList.remove('hidden')
                    })
                }
            });
        });
    };

    setupEventListeners();
});
