import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import { connect } from 'react-redux'
import { getAuth, signOut } from 'firebase/auth'
import { query, collection, getDocs, orderBy, doc, getDoc, setDoc, deleteDoc, getFirestore, onSnapshot } from "firebase/firestore"

function Profile(props) {
    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false)

    useEffect(async () => {
        const { currentUser, posts } = props

        if (props.route.params.uid === getAuth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
            console.log({ currentUser, posts })
        } else {
            const docRef = doc(getFirestore(), "users", props.route.params.uid)
            onSnapshot((docRef), (snapshot) => {
                if (snapshot.exists()) {
                    setUser(snapshot.data())
                } else {
                    console.log('does not exist')
                }
            })

            const postsRef = collection(getFirestore(), "posts", props.route.params.uid, "userPosts")
            const postsQuery = query(postsRef,  orderBy("timestamp", "asc"))
            onSnapshot((postsQuery), (snapshot) => {
                let allPosts = snapshot.docs.map((doc) => {
                    const data = doc.data()
                    const id = doc.id
                    return{ id, ...data }
                })
                setUserPosts(allPosts)
            })
        }

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true)
        } else {
            setFollowing(false)
        }

    }, [props.route.params.uid, props.posts, props.following])

    const onFollow = async () => {
        const followRef = doc(getFirestore(), "following", getAuth().currentUser.uid, "userFollowing", props.route.params.uid)
        await setDoc(followRef, {})
    }

    const onUnfollow = async () => {
        const followRef = doc(getFirestore(), "following", getAuth().currentUser.uid, "userFollowing", props.route.params.uid)
        await deleteDoc(followRef, {})
    }

    const onLogout = () => {
        getAuth().signOut()
    }

    if (user === null) {
        return <View />
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>

                {props.route.params.uid !== getAuth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <Button 
                                title="Following"
                                onPress={() => onUnfollow()}
                            />
                        ) : (
                            <Button 
                                title="Follow"
                                onPress={() => onFollow()}
                            />
                        )}
                    </View>
                ) : 
                <Button 
                    title="Logout"
                    onPress={() => onLogout()}
                />
                }
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                            <Image style={styles.image}
                                source={{uri: item.downloadURL}}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile)