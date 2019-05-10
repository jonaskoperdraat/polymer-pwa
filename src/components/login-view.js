/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {css, html} from 'lit-element';
import {PageViewElement} from './page-view-element.js';
// These are the shared styles needed by this element.
import {SharedStyles} from './shared-styles.js';
import {store} from "../store";
import {logIn} from '../actions/api.js'
import {connect} from "pwa-helpers";
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-material/paper-material.js';

class LoginView extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _errorMsg: {type: String},
      _username: {type: String},
      _password: {type: String}
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
           :host {
             display: block;
             width: 300px;
             margin: 0px auto;
           }
           
           paper-material {
             padding: 15px;
             margin-top: 30px;
           }
           
           div {
            text-align: right;
            margin-top: 10px;
           }
           
           .error {
             color: red;
             margin-botton: 0px;                         
           }   
        `
    ];
  }

  render() {
    // Obviously, this needs username and password fields
    return html`
        <paper-material elevation="3">
        <form @submit="${this._submit}">
        <paper-input label="Username" type="text" id="username" value="${this._username}" @keypress="${this._keyPressed}" ></paper-input>
        <paper-input label="Password" type="password" id="password" value="${this._password}" @keypress="${this._keyPressed}" ></paper-input>
        <div>
        <paper-button raised class="indigo" id="btnLogin" @click="${this._submit}" >Log in</paper-button>
        </form>
        </div>
        <p class="error" style="${this._errorMsg ? '' : 'display: none'}">${this._errorMsg}</p>
    </paper-material>
    `;
  }

  constructor() {
    super();
    this._errorMsg = '';
    this._username = '';
    this._password = '';

    // Here, we could query the credential manager API to retrieve username and password for the user.
    if (window.PasswordCredential || window.FederatedCredential) {
      navigator.credentials.get({password: true}).then((credential) => {
        if (credential) {
          this._username = credential.id;
          this._password = credential.password;
          // We could automatically log the user in.
          // store.dispatch(logIn(credential.id, credential.password));
          this.shadowRoot.getElementById('btnLogin').focus();
        } else {
          this.shadowRoot.getElementById('username').focus();
        }
      });
    } else {
      this.shadowRoot.getElementById('username').focus();
    }
  }

  _keyPressed(event) {
    // When enter is pressed, submit
    if (event.which == 13 || event.keyCode == 13) {
      this._submit();

      return true;
    }
  }

  _submit() {
    const username = this.shadowRoot.getElementById('username').value;
    const password = this.shadowRoot.getElementById('password').value;

    store.dispatch(logIn(username, password));
  }

  stateChanged(state) {
    this._errorMsg = state.api.logInError;
  }

}

window.customElements.define('login-view', LoginView);
