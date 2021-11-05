import * as firebaseAuth from 'firebase/auth'
import { query, collection, getDocs, orderBy, doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore"
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA } from '../constants/index'

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser() {
    return(async (dispatch) => {
        const auth = firebaseAuth.getAuth()
        const docRef = doc(getFirestore(), "users", auth.currentUser.uid)
        onSnapshot((docRef), (snapshot) => {
            if (snapshot.exists()) {
                dispatch({ type : USER_STATE_CHANGE, currentUser: snapshot.data() })
            } else {
                console.log('does not exist')
            }
        })
    })
}

export function fetchUserPosts() {
    return(async (dispatch) => {
        const auth = firebaseAuth.getAuth()
        const postsRef = collection(getFirestore(), "posts", auth.currentUser.uid, "userPosts")
        const postsQuery = query(postsRef,  orderBy("timestamp", "asc"))
        onSnapshot((postsQuery), (snapshot) => {
            let allPosts = snapshot.docs.map((doc) => {
                const data = doc.data()
                const id = doc.id
                return{ id, ...data }
            })
            dispatch({ type : USER_POSTS_STATE_CHANGE, posts: allPosts })
        })
    })
}

export function fetchUserFollowing() {
    return(async (dispatch) => {
        const auth = firebaseAuth.getAuth()
        const followRef = collection(getFirestore(), "following", auth.currentUser.uid, "userFollowing")
        const followQuery = query(followRef)
        onSnapshot((followQuery), (snapshot) => {
            let following = snapshot.docs.map(doc => {
                const id = doc.id
                return id
            })
            dispatch({ type : USER_FOLLOWING_STATE_CHANGE, following: following })
            for (let i=0; i<following.length; i++) {
                dispatch(fetchUsersData(following[i]))
            }
        })
    })
}

export function fetchUsersData(uid) {
    return((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid)
        if (!found) {
            const docRef = doc(getFirestore(), "users", uid)
            onSnapshot((docRef), (snapshot) => {
                if (snapshot.exists()) {
                    let user = snapshot.data()
                    let i = snapshot.id
                    user.uid = i.trim()
                    dispatch({ type : USERS_DATA_STATE_CHANGE, user })
                    dispatch(fetchUsersFollowingPosts(user.uid))
                } else {
                    console.log('does not exist')
                }
            })
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    return(async (dispatch, getState) => {
        const postsRef = collection(getFirestore(), "posts", uid, "userPosts")
        const postsQuery = query(postsRef,  orderBy("timestamp", "asc"))
        onSnapshot((postsQuery), (snapshot) => {
            //const uid = snapshot.query.EP.path.segments[1]
            const user = getState().usersState.users.find(el => el.uid === uid)
            let posts = snapshot.docs.map((doc) => {
                const data = doc.data()
                const id = doc.id
                return{ id, ...data, user }
            })
            dispatch({ type : USERS_POSTS_STATE_CHANGE, posts, uid })
            //console.log(getState())
        })
    })
}