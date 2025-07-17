import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@realm/react";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { POST_DETAIL_SCREEN, TBL_POST } from "../constants/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import myStyles from "../../myStyles";


function FavoriteScreen({route}:any) : React.JSX.Element {

    const navigation = useNavigation();
    const [userID, setUserId] = useState(0)
    const postData = useQuery(TBL_POST).filtered('user_id == $0 AND favorite == 1', userID)
    
    useEffect(() => {
        getUserID()
    }, [])

    async function getUserID() {
        const id = await AsyncStorage.getItem('userId')
        if (id) {
            setUserId(parseInt(id))
        }
    }

    return (
        <View style={{  }}>
            <View style={{marginStart:20, flexDirection: 'row', height: 70, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                <Text style={{ fontSize: 24 }} numberOfLines={1} ellipsizeMode="tail">Favorite</Text>
            </View>
        
            {/* Post List */}
            {postData && postData.length > 0 ? (
                <FlatList
                    data={postData}
                    renderItem={(item) =>
                        <Pressable onPress={() => {
                            //console.error(item.item.id)
                            navigation.navigate(POST_DETAIL_SCREEN, { id: item.item.id, name: item.item.post_name, eventId : item.item.event_id })
                        }}>
                            <View style={myStyles.listItem}>
                                <Text style={{ fontSize: 16 }}>{item.item.post_name}</Text>
                            </View>
                        </Pressable>
                    }
                />
            ) :
                (
                    <View style={{alignItems:'center', justifyContent:'center' }}>
                        <Text style={{marginTop:200}}>No Data found</Text>
                    </View>
                )
            }    
        </View>
    )
} 

export default FavoriteScreen;