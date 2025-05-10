import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { HOME_SCREEN, LOGIN_SCREEN } from "../constants/constant";

function AuthScreen(): React.JSX.Element {

    const navigation = useNavigation()

    async function getUserID() {
        const id = await AsyncStorage.getItem('userId')
        //console.error(id)

        if(id==null){
            navigation.replace(LOGIN_SCREEN)
        }else{
            navigation.replace(HOME_SCREEN)
        }

    }
    useEffect(() => {
        getUserID()
    }, [])


    return (
        <View style={{flex: 1, justifyContent:'center'}}>
            <ActivityIndicator  size={"large"}/>
        </View>
    );
}

export default AuthScreen;