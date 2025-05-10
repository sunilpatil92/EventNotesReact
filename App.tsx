import React from 'react';
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { UserSchema } from './src/models/UserSchema';
import { EventSchema } from './src/models/EventSchema';
import { RealmProvider } from '@realm/react';
import { AUTH_SCREEN, HOME_SCREEN, LOGIN_SCREEN, POST_DETAIL_SCREEN, POSTS_SCREEN, REMINDER_FORM_SCREEN } from './src/constants/constant';
import AuthScreen from './src/screens/AuthScreen';
import PostListScreen from './src/screens/PostListScreen';
import { PostSchema } from './src/models/PostSchema';
import { PostDetailSchema } from './src/models/PostDetailSchema';
import PostDetailScreen from './src/screens/PostDetailScreen';
import ReminderFormScreen from './src/screens/ReminderFormScreen';

function App(): React.JSX.Element {

  const Stack = createNativeStackNavigator();

  return (

    <RealmProvider schema={[UserSchema, EventSchema, PostSchema, PostDetailSchema]} schemaVersion={1.0}>

      <NavigationContainer>
        <Stack.Navigator initialRouteName= {AUTH_SCREEN}>
          <Stack.Screen name={AUTH_SCREEN} component={AuthScreen} options={{headerShown : false}}/>
          <Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} options={{headerShown:false}}/>
          <Stack.Screen name={HOME_SCREEN} component={HomeScreen} options={{headerShown:false}} />
          <Stack.Screen name={POSTS_SCREEN} component={PostListScreen} options={{headerShown :false}} />
          <Stack.Screen name= {POST_DETAIL_SCREEN} component = {PostDetailScreen} options={{headerShown:false}} />
          <Stack.Screen name= {REMINDER_FORM_SCREEN} component={ReminderFormScreen} options={{headerShown : false}}/>
        </Stack.Navigator>
      </NavigationContainer>

    </RealmProvider>


  );
}

export default App;
