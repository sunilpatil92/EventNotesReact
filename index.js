/**
 * @format
 */

import 'react-native-gesture-handler'; 
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { RealmProvider } from '@realm/react';
import { UserSchema } from './src/models/UserSchema';
import { EventSchema } from './src/models/EventSchema';
import { PostSchema } from './src/models/PostSchema';
import { PostDetailSchema } from './src/models/PostDetailSchema';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { LabelSchema } from './src/models/LabelSchema';


const RealmProviderView = ()=> {
   return(
      <RealmProvider schema={[UserSchema, EventSchema, PostSchema, PostDetailSchema, LabelSchema]} schemaVersion={1.0}>
        <App />
      </RealmProvider>
   )
}

const AuthContext = () => {
   return(
      <AuthProvider>
         <RealmProviderView />   
      </AuthProvider>
   )
}

const GestureHandlerRoot = ()=>{ return(
   <GestureHandlerRootView style={{flex:1}}>
      <AuthContext />   
   </GestureHandlerRootView>
)}

AppRegistry.registerComponent(appName, () => GestureHandlerRoot);
