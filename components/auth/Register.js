import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'
import * as firebaseAuth from 'firebase/auth'
import * as firebaseDb from "firebase/firestore"

export class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        }
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, name } = this.state;
        const auth = firebaseAuth.getAuth();
        firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
        .then(async (result) => {
            await firebaseDb.setDoc(firebaseDb.doc(firebaseDb.getFirestore(), "users", auth.currentUser.uid), {
                name: name,
                email: email
            })
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <View>
                <TextInput 
                    placeholder="name"
                    onChangeText={(name) => this.setState({ name })}
                />
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput 
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />
                <Button
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}

export default Register
