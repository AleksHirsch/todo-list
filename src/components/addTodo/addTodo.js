import styles from './addTodo.styles.scss';

const template = document.createElement('template');
const style = document.createElement('style');

template.innerHTML = `
    <input type="text">
    <button id="add">Add</button>
`;

export default class AddTodo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open',
    });
    style.textContent = styles;
    this.shadowRoot.appendChild(style.cloneNode(true));
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const inputTag = this.shadowRoot.querySelector('input');
    const addBtn = this.shadowRoot.querySelector('#add');
    addBtn.addEventListener('click', () => {
      if (inputTag.value !== '') {
        document.dispatchEvent(new CustomEvent('addTodoEvent', { detail: inputTag.value }));
        inputTag.value = '';
      }
    });
    inputTag.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') addBtn.click();
    });
  }
}

window.customElements.define('add-todo', AddTodo);
