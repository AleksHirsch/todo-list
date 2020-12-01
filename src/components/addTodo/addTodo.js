import styles from './addTodo.styles.scss';

const template = document.createElement('template');
const style = document.createElement('style');

template.innerHTML = `
    <input type="text">
    <button id="add-btn">Add</button>
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
    const btn = this.shadowRoot.querySelector('#add-btn');
    const input = this.shadowRoot.querySelector('input');
    this.constructor.setInputEvent(btn, input);
    this.constructor.setButtonEvent(btn, input);
  }

  static setButtonEvent(btn, input) {
    btn.addEventListener('click', () => {
      if (input.value !== '') {
        document.dispatchEvent(new CustomEvent('addTodoEvent', { detail: input.value }));
        // eslint-disable-next-line no-param-reassign
        input.value = '';
      }
    });
  }

  static setInputEvent(btn, input) {
    input.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') btn.click();
    });
  }
}

window.customElements.define('add-todo', AddTodo);
