import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import * as firebaseAuth from 'firebase/auth'
import * as firebaseDb from 'firebase/firestore'

export default function Save(props) {
    const [caption, setCaption] = useState("")
    const uploadImage = async () => {
        const auth = firebaseAuth.getAuth()
        const childPath = `posts/${auth.currentUser.uid}/${Math.random().toString(36)}`
        console.log(childPath)
        
        const uri = props.route.params.image
        const response = await fetch(uri)
        const blob = await response.blob()
        
        const storage = getStorage()
        const storageRef = ref(storage, childPath)
        
        const uploadTask = uploadBytesResumable(storageRef, blob)
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done')
            }, 
            (error) => {
                console.log(error)
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    savePostData(downloadURL)
                    console.log('File available at', downloadURL)
                })
            }
        )
    }
    const savePostData = async (downloadURL) => {
        const auth = firebaseAuth.getAuth()
        const imgRef = firebaseDb.doc(firebaseDb.getFirestore(), "posts", auth.currentUser.uid, "userPosts", Math.random().toString(36))
        await firebaseDb.setDoc(imgRef, {
            downloadURL,
            caption,
            timestamp: new Date()
        }).then((function () {
            props.navigation.popToTop()
        }))
    }

    return (
        <View style={{flex: 1}}>
            <Image source={{uri: props.route.params.image}} />
            <TextInput 
                placeholder="write a caption..."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title="Save" onPress={() => uploadImage()} />
        </View>
    )
}
