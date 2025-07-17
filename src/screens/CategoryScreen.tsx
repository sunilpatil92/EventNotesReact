import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@realm/react";
import { POST_DETAIL_SCREEN, TBL_LABEL, TBL_POST } from "../constants/constant";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
import myStyles from "../../myStyles";

function CategoryScreen({route} : any) : React.JSX.Element{

    const navigation = useNavigation();
    const [userID, setUserId] = useState(0)
    const [labelID, setLabelId] = useState(0)
    const labelData = useQuery(TBL_LABEL).filtered('user_id == $0', userID)
    const postData = useQuery(TBL_POST).filtered('label_id == $0', labelID)
    
    useEffect(() => {
        getUserID()
    }, [])

    async function getUserID() {
        const id = await AsyncStorage.getItem('userId')
        if (id) {
            setUserId(parseInt(id))
        }
    }

    useEffect(()=>{
        if(!labelID && labelData && labelData.length > 0){
            setLabelId(labelData[0].id)
        }
    },[labelData])

    return (
        <View style={{  }}>
             <View style={{marginStart:20, flexDirection: 'row', height: 70, justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                <Text style={{ fontSize: 24 }} numberOfLines={1} ellipsizeMode="tail">Categories</Text>
             </View>

             {/* Category List */}
            {labelData && labelData.length > 0 ? (
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={labelData}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => {
                            setLabelId(item.id)
                        }}>
                        <View style={myStyles.tabsItem}>
                            <Text style={{ fontSize: 16 }}>{item.name}</Text>
                        </View>
                        </Pressable>       
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            ) : (
                <View style={{justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ alignSelf: 'center' }}>No categories found.</Text>
                </View>
            )}

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
    );          
}
export default CategoryScreen;