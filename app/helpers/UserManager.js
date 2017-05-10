import React from 'react-native';

import {EventEmitter} from 'fbemitter';

import * as firebase from 'firebase';

class UserManager {
    currentUser = {
        signedIn: false,
    };
    emitter = new EventEmitter();

    async userLogin(email, password) {
        let message = '';
        let code = '';

        try {
            const response = await firebase.auth().signInWithEmailAndPassword(email, password);
            this.emitter.emit('userChanged', firebase.auth().currentUser);

            return {
                code: 'SUCCESS',
                message: `signed as ${email}`,
            };
        } catch (error) {
            return {
                code: error.code,
                message: error.message,
            };
        }
/*
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            console.log(this.getCurrentUser());

            code = 'SUCCESS';
            message = `signed in as ${email}`;
        }).catch((error) => {
            this.emitter.emit('userChanged', firebase.auth().currentUser);

            code = error.code;
            message = error.message;
        });*/
    }

    getCurrentUser() {
        return firebase.auth().currentUser;
    }

    addListener(func) {
        return this.emitter.addListener('userChanged', func);
    }
}

const currentUserManager = new UserManager();

export default currentUserManager;
