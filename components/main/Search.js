import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { collection, query, where, getFirestore, getDocs } from 'firebase/firestore'


export default function Search(props) {
    const [users, setUsers] = useState([])
    const fetchUsers = async (search) => {
        const q = query(collection(getFirestore(), "users"), where("name", ">=", search))
        const qSnap = await getDocs(q)
        let users = qSnap.docs.map(doc => {
            const data = doc.data()
            const id = doc.id
            return { id, ...data }
        })
        setUsers(users)
    }
    return (
        <View>
            <TextInput placeholder="type name here..." onChangeText={(search) => fetchUsers(search)} />
            <FlatList 
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}
