import React, {
    AsyncStorage
} from 'react-native';

import {
    EventEmitter
} from 'fbemitter';
import {
    serverAddress
} from '../config/settings';

class UserManager {
    _currentUser = null;
    emitter = new EventEmitter();

    createApiUrl(url, access_token = null) {
        if (access_token !== null) {
            return `${serverAddress}/api/${url}?access_token=${access_token}`;
        }
        else if (this._currentUser !== null) {
            return `${serverAddress}/api/${url}?access_token=${this._currentUser}`;
        }
        else {
            return `${serverAddress}/api/${url}`;
        }
    }

    async userSignIn(username, password) {
        let response = await fetch(this.createApiUrl('ImadaUsers/login'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });

        let responseJson = await response.json();

        if (responseJson.error !== undefined) {
            console.log(responseJson);
            return {
                code: responseJson.error.code,
                message: responseJson.error.message,
                statusCode: responseJson.error.statusCode,
            };
        }

        let userInfoResponse = await fetch(this.createApiUrl(`ImadaUsers/${responseJson.userId}`, responseJson.id));
        console.log(userInfoResponse);

        let userInfo = await userInfoResponse.json();
        console.log(userInfoResponse);        

        await this.setCurrentUser(
            responseJson.id,
            responseJson.userId,
            userInfo.email,
            userInfo.username,
            userInfo.balance,
        );

        return {
            code: 'SUCCESS',
            message: `signed in as ${responseJson.userId}`,
            statusCode: 200,
            user: this._currentUser,
        };
    }

    async userSignOut() {
        if (this._currentUser === null) return;

        await fetch(this.createApiUrl(`ImadaUsers/logout`), {
            method: 'POST',
        });

        this._currentUser = null;
        this.emitter.emit('userChanged', this._currentUser);

        await AsyncStorage.removeItem('token', (errors) => {
            console.log(errors);
        }).then(() => {
            console.log("what");
        })

        await AsyncStorage.multiRemove(['token', 'userId', 'email', 'username', 'balance'], (errors) => {
            console.log(errors);
        });
    }

    async userRegister(name, username, email, password) {
        let response = await fetch(this.createApiUrl(`ImadaUsers`), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            })
        });

        return await response.json();
    }

    addListener(func) {
        return this.emitter.addListener('userChanged', func);
    }

    async setCurrentUser(token, userId, email, username, balance) {
        this._currentUser = {
            token: token,
            userId: userId,
            email: email,
            username: username,
            balance: balance,
        };

        console.log(this._currentUser);

        this.emitter.emit('userChanged', this._currentUser);

        await AsyncStorage.multiSet([
                ['token', token],
                ['userId', String(userId)],
                ['email', email],
                ['username', username],
                ['balance', String(balance)]
            ],
            (errors) => {
                if (errors) {
                    console.log(errors);
                }
            });
    }

    async updateUser() {
        let userInfo = await fetch(this.createApiUrl(`ImadaUsers/${this._currentUser.userId}`));
        let userInfoJson = await userInfo.json();

        if (userInfoJson.error !== undefined) {
            return null;
        }

        console.log(userInfoJson);

        await this.setCurrentUser(this._currentUser.token, this._currentUser.userId, userInfoJson.email, userInfoJson.username, userInfoJson.balance);

        return this._currentUser;
    }

    async getCurrentUser() {
        if (this._currentUser === null) {
            try {
                const token = await AsyncStorage.getItem('token');

                if (token !== null) {
                    let email = null,
                        username = null,
                        userId = null,
                        balance = null;

                    await AsyncStorage.multiGet(['email', 'username', 'userId', 'balance'], (err, stores) => {
                        stores.map((result, i, store) => {
                            email = store[0][1];
                            username = store[1][1];
                            userId = store[2][1];
                            balance = store[3][1];
                        });

                        console.log(err);
                    });

                    if (email !== null && username !== null && userId !== null && balance !== null) {
                        await this.setCurrentUser(token, userId, email, username, balance);
                        this.updateUser();

                        return this._currentUser;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            return this._currentUser;
        }
    }

    async spendAmount(amount: number, time: ?Date) {
        if (this._currentUser === null) {
            return;
        }

        if (!time) {
            time = new Date();
        }

        const timeJson = time.toJSON();

        const response = await fetch(this.createApiUrl(`ImadaUsers/spend?id=${this._currentUser.userId}&amount=${amount}&time=${timeJson}`), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        let responseJson = await response.json();
        console.log(response);
        console.log(responseJson);

        if (responseJson.error !== undefined) {
            return {
                code: responseJson.error.code,
                message: responseJson.error.message,
                statusCode: responseJson.error.statusCode,
            };
        }

        const transactionResponse = await fetch(this.createApiUrl(`Transaction/${responseJson.transactionId}`));

        const transaction = await transactionResponse.json();

        const transactionToSave = {
            [transaction.id]: transaction,
        };

        AsyncStorage.mergeItem('transactions', JSON.stringify(transactionToSave), (errors) => {
            console.log(errors);
        });

        return transaction;
    }
}

const currentUserManager = new UserManager();

export default currentUserManager;