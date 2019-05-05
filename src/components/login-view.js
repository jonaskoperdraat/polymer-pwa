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
import {logInSuccess, logInError} from "../actions/app.js";
import {connect} from "pwa-helpers";

class LoginView extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _errorMsg: { type: String }
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
      <button @click="${this._logIn}" title="Log in">Log in successfully</button>
      <button @click="${this._logInError}" title="Log in">Log in error</button>
      <p style="${this._errorMsg ? '' : 'display: none'}">${this._errorMsg}</p>
    `;
  }

  constructor() {
    console.log('LoginView.constructor()');
    super();
    this._errorMsg = 'bla';

    // Here, we could query the credential manager API to retrieve username and password for the user.
  }

  _logIn() {
    // This is where the app would attempt to login with the provided credentials.
    // If successful, dispatch a logInSuccess action
    // Also, store credentials using credential manager API
    // If unsuccessful, dispatch a logInError action
    store.dispatch(logInSuccess());
  }

  _logInError() {
    store.dispatch(logInError('Something went wrong'));
  }

  stateChanged(state) {
    this._errorMsg = state.app.logInError;
  }

}

window.customElements.define('login-view', LoginView);
