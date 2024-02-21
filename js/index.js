import { renderMain, initialState } from "./setLanguage.mjs";

document.addEventListener('DOMContentLoaded', function() {
    renderMain();

    let contacts = { ...initialState };

    const selectors = {
        root: '[data-contacts]',
        input: '[data-input]',
        button: '[data-button]',
        modal: '[data-modal]',
        inputModal: '[data-input-modal]',
        modalContent: '.modal__content',
        modalCloseButton: '.modal__close',
        buttonShow: '.modal__button-show'
    };

    const rootElement = document.querySelector(selectors.root);
    const modalWindow = rootElement.querySelector(selectors.modal);
    const inputModal = rootElement.querySelector(selectors.inputModal);
    const modalContent = rootElement.querySelector(selectors.modalContent);
    const modalCloseButton = rootElement.querySelector(selectors.modalCloseButton);
    const buttonShow = rootElement.querySelector(selectors.buttonShow);

    const nameInput = rootElement.querySelector(`${selectors.input}[data-type="name"]`)
    const positionInput = rootElement.querySelector(`${selectors.input}[data-type="name"]`)
    const phoneInput = rootElement.querySelector(`${selectors.input}[data-type="name"]`)

    const inputElements = rootElement.querySelectorAll(selectors.input);
    const addButtonElement = rootElement.querySelector(`${selectors.button}[data-action="add"]`);
    const clearButtonElement = rootElement.querySelector(`${selectors.button}[data-action="clear"]`);
    const searchButtonElement = rootElement.querySelector(`${selectors.button}[data-action="search"]`);

    const columnItems = document.querySelectorAll('.item')
    const getFirstLetter = word => word[0].toUpperCase();
    const clearInput = () => inputElements.forEach(input => input.value = '');

    const updateContactsState = () => contacts = { ...initialState };
    const resetUI = () => document.querySelectorAll('.added-contact').forEach(div => div.remove());
    const resetCount = () => document.querySelectorAll('.count-element').forEach(count => count.remove())

    nameInput.addEventListener('input', (e) => {
        console.log(e.target.value)
        console.log(isLengthValid(e.target.value, 4))
        if (!isLengthValid(e.target.value, 4)) {
            e.target.classList.add('error')
        } else {
            e.target.classList.remove('error')
        }
    })

    positionInput.addEventListener('input', (e) => {
    })

    phoneInput.addEventListener('input', (e) => {
        if (!isPhoneValid(e.target.value)) {
        }
    })

    const isEmpty = (value) => value.trim() === '';

    const isLengthValid = (value, minLength) => value.trim().length >= minLength;

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
        const contactContainer = container || document.querySelector(`[data-first-letter="${firstLetter}"]`) || createContactContainer(firstLetter);
        const contactElement = document.createElement("div");
        contactElement.classList.add('added-contact', 'hidden');

        if (contactContainer)
        contactElement.setAttribute('data-contact-id', contact.id);
        contactElement.innerHTML = `
    id:${contact.id}<br> name:${contact.name}<br> phone:${contact.phone}<br>
    <span class="delete-contact" data-contact-id="${contact.id}">X</span>`;
        contactContainer.appendChild(contactElement);
        addDeleteEventListener(contactElement.querySelector('.delete-contact'));
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
            alert('Empty')
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

    // Создание контейнера для контакта, если он еще не существует
    const createContactContainer = (firstLetter) => {
        const container = document.createElement("div");
        container.setAttribute('data-first-letter', firstLetter);
        rootElement.appendChild(container);
        return container;
    };

// Добавление слушателя событий на кнопку удаления
    const addDeleteEventListener = deleteButton => {
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
                }
            });
        });

    };

    setupEventListeners();
});
