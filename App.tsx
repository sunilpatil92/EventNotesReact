import React, { useEffect, useRef } from 'react';
import { BackHandler, Image, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { HOME_SCREEN, HOME_TAB_TRACK, LOGIN_SCREEN, POST_DETAIL_SCREEN, POSTS_SCREEN, PROFILE_SCREEN, CALENDER_SCREEN, CATEGORY_SCREEN, FAVORITE_SCREEN, ABOUTE_SCREEN } from './src/constants/constant';
import PostListScreen from './src/screens/PostListScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import ReminderFormScreen from './src/screens/ReminderFormScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DrawerLayout } from 'react-native-gesture-handler';
import { useAuth } from './src/context/AuthContext';
import ProfileScreen from './src/screens/ProfileScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';

function App(): React.JSX.Element {

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator()
  const drawerRef = useRef(null);
  const { isLogin } = useAuth()


  const AboutScreen = () => { return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>About</Text></View>) }

  const HomeTab = () => {
    return (
      <Stack.Navigator initialRouteName={HOME_SCREEN}>
        <Stack.Screen name={HOME_SCREEN} component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name={POSTS_SCREEN} component={PostListScreen} options={{ headerShown: false }} />
        <Stack.Screen name={POST_DETAIL_SCREEN} component={PostDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name={CALENDER_SCREEN} component={ReminderFormScreen} options={{ headerShown: false }} />

        <Stack.Screen name={CATEGORY_SCREEN} component={CategoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name={FAVORITE_SCREEN} component={FavoriteScreen} options={{ headerShown: false }} />
        <Stack.Screen name={ABOUTE_SCREEN} component={AboutScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
  }


  const DrawerContent = () => {
    return (
      <View style={{flexDirection:'column', flex: 1, backgroundColor: 'white'}}>

        <View style={{justifyContent:'flex-end',flexDirection: 'column', alignItems: 'center', backgroundColor:'#7123edff', height:'200', width:'100%' }}>
          <Text style={{fontSize: 30, marginBottom:'50', color:'white' }}>Event Notes</Text>
        </View>

        <View style={{paddingLeft:20}}>
          <TouchableOpacity
           onPress={() =>{
            drawerRef.current.closeDrawer()
            checkStackRoute()
            navigationRef.navigate(HOME_TAB_TRACK)
           }}
            style={{ padding:8 }}>
            <Text style={{ fontSize: 18 }}>Events</Text>
         </TouchableOpacity>
        <TouchableOpacity
           onPress={() =>{
            drawerRef.current.closeDrawer()
            checkStackRoute()
            navigationRef.navigate(CATEGORY_SCREEN)
           }}
            style={{ padding:8 }}>
            <Text style={{ fontSize: 18 }}>Category</Text>
         </TouchableOpacity>
         <TouchableOpacity
           onPress={() =>{
            drawerRef.current.closeDrawer()
             checkStackRoute()
            navigationRef.navigate(FAVORITE_SCREEN)
           }}
            style={{ padding:8 }}>
            <Text style={{ fontSize: 18 }}>Favorite</Text>
         </TouchableOpacity>
        </View>

        
      </View>
    )
  }

 function checkStackRoute(){
    const currentRoute = navigationRef.getCurrentRoute();
    if (currentRoute?.name == CALENDER_SCREEN || currentRoute?.name == PROFILE_SCREEN) {
      navigationRef.navigate(HOME_TAB_TRACK);
      return true; // prevent default
    }
  }

  const MenuTabButton = () => (
    <TouchableOpacity
      onPress={() => drawerRef.current?.openDrawer()}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text style={{ fontSize: 24 }}>☰</Text>
    </TouchableOpacity>
  );
  const MenuTab = () => {
    // return null because this tab doesn't show a screen
    return null;
  };


  const navigationRef = useNavigationContainerRef();
  const lastBackPressTime = useRef(0);

  const backAction = () => {
    const currentRoute = navigationRef.getCurrentRoute();


    if (currentRoute?.name == CALENDER_SCREEN || currentRoute?.name == PROFILE_SCREEN) {
      navigationRef.navigate(HOME_TAB_TRACK);
      return true; // prevent default
    } else if (currentRoute?.name == LOGIN_SCREEN) {
      const now = Date.now();
      if (now - lastBackPressTime.current < 2000) {
        BackHandler.exitApp();
        return true;
      } else {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        lastBackPressTime.current = now;
        return true;
      }
    } else if (currentRoute?.name != HOME_SCREEN) {
      navigationRef.goBack();
      return true;
    } else {
      const now = Date.now();
      if (now - lastBackPressTime.current < 2000) {
        BackHandler.exitApp();
        return true;
      } else {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        lastBackPressTime.current = now;
        return true;
      }
    }
  };

  useEffect(() => {

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigationRef]);

  return (

    <NavigationContainer ref={navigationRef}>

      {isLogin
        ? (
          <DrawerLayout
            ref={drawerRef}
            drawerWidth={250}
            drawerPosition="left"
            drawerType="front"
            renderNavigationView={DrawerContent}
          >

            <Tab.Navigator initialRouteName={HOME_TAB_TRACK}>
              <Tab.Screen
                name="Menu"
                component={MenuTab}
                options={{
                  tabBarLabel: '',
                  tabBarButton: () => <MenuTabButton />,
                }}
              />
              <Tab.Screen name={HOME_TAB_TRACK} component={HomeTab}
                options={{
                  headerShown: false,
                  tabBarIcon(props) {
                    return (
                      <Image source={require('./src/assets/icons/ic_home.png')} style={{ width: 24, height: 24, tintColor: props.color }} />
                    );
                  },
                }}
              />
              <Tab.Screen name={CALENDER_SCREEN} component={ReminderFormScreen}
                options={{
                  headerShown: false,
                  tabBarIcon(props) {
                    return (
                      <Image source={require('./src/assets/icons/ic_calender.png')} style={{ width: 24, height: 24, tintColor: props.color }} />
                    );
                  },
                }}
              />
              <Tab.Screen name={PROFILE_SCREEN} component={ProfileScreen}
                options={{
                  headerShown: false,
                  tabBarIcon(props) {
                    return (
                      <Image source={require('./src/assets/icons/ic_user.png')} style={{ width: 24, height: 24, tintColor: props.color }} />
                    );
                  },
                }}
              />
            </Tab.Navigator>
          </DrawerLayout>
        )
        :
        (
          <Stack.Navigator initialRouteName={LOGIN_SCREEN}>
            <Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        )}

    </NavigationContainer>


  );
}

export default App;
