/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {html, LitElement} from 'lit-element';
import { PageViewElement } from './page-view-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import {store} from "../store";
// import {logInSuccess, logInError} from "../actions/app.js";
import { logIn } from '../actions/api.js'
import {connect} from "pwa-helpers";

class LoginView extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _errorMsg: { type: String },
      _username: { type: String },
      _password: { type: String }
    };
  }

  static get styles() {
    return [
      SharedStyles
    ];
  }

  render() {
    console.log('LoginView.render');
    // Obviously, this needs username and password fields
    return html`
        <form @submit="${this._submit}">
            <label>Username
                <input name="username" type="text" value="${this._username}"/>
            </label><br />
            <label>Password
                <input name="password" type="password" value="${this._password}" />
            </label><br />
            <button type="submit" title="Log in">Log in</button>
        </form>
    
      <p style="${this._errorMsg ? '' : 'display: none'}">${this._errorMsg}</p>
    `;
  }

  constructor() {
    console.log('LoginView.constructor()');
    super();
    this._errorMsg = '';
    this._username = '';
    this._password = '';

    // Here, we could query the credential manager API to retrieve username and password for the user.
    if (window.PasswordCredential || window.FederatedCredential) {
      navigator.credentials.get({password: true}).then((credential) => {
        console.log('Received credentials', credential);
        if (credential) {
          this._username = credential.id;
          this._password = credential.password;
          // We could automatically log the user in.
          // store.dispatch(logIn(credential.id, credential.password));
        }
      });
    }
  }

  _submit(e) {
      console.log('try loggin in w/ username and password', arguments);

      if (e.preventDefault)
          e.preventDefault();

      const username = e.target.username.value;
      const password = e.target.password.value;

      console.log(username, password);

      store.dispatch(logIn(username, password));

      return false;
  }

  stateChanged(state) {
    console.log('LoginView.stateChanged', state);
    this._errorMsg = state.api.logInError;
  }

}

window.customElements.define('login-view', LoginView);
