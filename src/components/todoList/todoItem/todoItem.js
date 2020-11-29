/* eslint-disable import/no-extraneous-dependencies */
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import styles from './todoItem.styles.scss';

library.add(faCheckCircle, faEdit, faTrashAlt);

const style = document.createElement('style');
const template = document.createElement('template');

const icons = [icon(faCheckCircle), icon(faEdit), icon(faTrashAlt)];

template.innerHTML = `<div class="wrapper">
    <div class="todo-text">
        <span></span>
    </div>
    <div class="todo-buttons">
    </div>
</div>
`;

export default class TodoItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: 'open',
    });
    style.textContent = styles;
    this.shadowRoot.appendChild(style.cloneNode(true));
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  get content() {
    return this.getAttribute('content');
  }

  get id() {
    return this.getAttribute('id');
  }

  set content(val) {
    this.setAttribute('content', val);
  }

  static get observedAttributes() {
    return ['content'];
  }

  connectedCallback() {
    const spn = this.shadowRoot.querySelector('span');
    const buttons = this.shadowRoot.querySelector('.todo-buttons');
    spn.textContent = this.content;
    buttons.appendChild(this.appendIcons());
    const edit = this.shadowRoot.querySelector('[data-icon="edit"]');
    const ok = this.shadowRoot.querySelector('[data-icon="check-circle"]');
    this.shadowRoot.querySelector('[data-icon="trash-alt"]').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('deleteTodoEvent', { detail: this.getTodoId() }));
    });
    ok.classList.add('disabled');
    this.setEdit(edit, spn, ok);
    this.setOk(edit, spn, ok);
  }

  // eslint-disable-next-line class-methods-use-this
  setEdit(edit, spn, ok) {
    edit.addEventListener('click', () => {
      spn.setAttribute('contenteditable', 'true');
      spn.classList.toggle('editable');
      edit.classList.toggle('disabled');
      ok.classList.toggle('disabled');
      spn.focus();
    });
  }

  setOk(edit, spn, ok) {
    ok.addEventListener('click', () => {
      spn.removeAttribute('contenteditable');
      spn.classList.toggle('editable');
      edit.classList.toggle('disabled');
      ok.classList.toggle('disabled');
      this.content = spn.textContent;
      this.update();
      document.dispatchEvent(new CustomEvent('editTodoEvent', {
        detail: {
          id: this.getTodoId(),
          content: this.content,
        },
      }));
    });
  }

  getTodoId() {
    const id = parseInt(this.id.substr(8), 10) - 1;
    return id;
  }

  // eslint-disable-next-line class-methods-use-this
  appendIcons() {
    const frag = document.createDocumentFragment();
    icons.forEach((ico) => {
      frag.appendChild(ico.node[0]);
    });
    return frag;
  }

  attributeChangedCallback(name) {
    if (name === 'content') this.update();
  }

  update() {
    this.shadowRoot.querySelector('span').textContent = this.content;
  }
}

window.customElements.define('todo-item', TodoItem);
