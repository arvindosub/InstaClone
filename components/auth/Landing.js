import React from 'react'
import { StyleSheet, Text, View, Button, Image } from 'react-native'

export default function Landing({ navigation }) {
    return (
        <View style ={styles.container}>
            <View style={styles.containerImage}>
                <Image style={styles.image}
                    source={{uri: "https://firebasestorage.googleapis.com/v0/b/instagramclone-3a12e.appspot.com/o/logo.png?alt=media&token=3eb8e271-3b4a-4ad9-8dd8-b73134ce6844"}}
                />
                <Text style ={styles.container}>Welcome!</Text>
            </View>
            <Button 
                title="Register"
                onPress={() => {navigation.navigate("Register")}}
            />
            <Button 
                title="Login"
                onPress={() => {navigation.navigate("Login")}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25
    },
    containerImage: {
        flex: 1
    },
    image: {
        flex: 1,
        aspectRatio: 1/1,
        alignSelf: 'center',
        marginTop: 150
    }
})
