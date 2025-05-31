import { useNavigation } from "@react-navigation/native";
import { useQuery, useRealm } from "@realm/react";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Modal, Platform, Pressable, Text, TextInput, View } from "react-native";
import { PostDetailSchema } from "../models/PostDetailSchema";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { launchCamera } from "react-native-image-picker";
import myStyles from "../../myStyles";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import RNFS from 'react-native-fs'
import { PostTypes, TBL_POST_DETAILS } from "../constants/constant";
import { FloatingAction } from "react-native-floating-action";
import { addPostDetail, updatePostDetail } from "../services/realmOpration";
import { ModalAddPost } from "../modals/ModalAddPost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PostSchema } from "../models/PostSchema";

const audioRecorderPlayer = new AudioRecorderPlayer()

function PostDetailScreen({ route }: any): React.JSX.Element {

    const navigation = useNavigation()
    const [postId, setPostId] = useState(0)
    const realm = useRealm()
    const postDetailData = useQuery(TBL_POST_DETAILS).filtered('post_id == $0', postId)
    const [isRecordModalV, setIsRecordModalV] = useState(false)
    const [isTextPostModalV, setIsTextPostModalV] = useState(false)
    const [isUpdateModalV, setIsUpdateModalV] = useState(false)
    const [isPostModalV, setPostModalV] = useState(false)
    const [imgUri, setImgUri] = useState(null)
    const [selectedItem, setSelectedItem] = useState()
    const [postName, setPostName] = useState('')
    const [userID, setUserId] = useState(0)
    const [eventId, setEventId] = useState(0)

    const actions = [
        {
            text: 'Text',
            icon: require('../assets/icons/ic_text.png'),
            name: 'fab_text',
            position: 1
        },
        {
            text: 'Photo',
            icon: require('../assets/icons/ic_camera.png'),
            name: 'fab_camera',
            position: 2
        },
        {
            text: 'Audio',
            icon: require('../assets/icons/ic_mic.png'),
            name: 'fab_mic',
            position: 3
        },
    ]

    useEffect(() => {
        getUserID()
        setPostId(route.params.id)
        setPostName(route.params.name)
        setEventId(route.params.eventId)
    }, [])

    useEffect(() => {
                const fetchPostData = async () => {
                      const post = await realm.objectForPrimaryKey(PostSchema, route.params.id);
                        if (post) {
                           setPostName(post.post_name);
                        }     
                 };
    
                 fetchPostData();
                 
            },[isPostModalV])

     async function getUserID() {
        const id = await AsyncStorage.getItem('userId')
        if (id) {
            setUserId(parseInt(id))
        }
    }


    const checkcameraPermission = async () => {
        const permissions = Platform.select({
            android: PERMISSIONS.ANDROID.CAMERA,
            ios: PERMISSIONS.IOS.CAMERA
        })

        const result = await check(permissions);
        if (result === RESULTS.GRANTED) return true
        if (result === RESULTS.UNAVAILABLE ||result === RESULTS.DENIED || result === RESULTS.LIMITED) {
            const reqResult = await request(permissions);
            return reqResult === RESULTS.GRANTED
        }
        Alert.alert('Permission Denied', 'Camera permission is required.')
        return false;
    }


    async function captureImage() {
        const hasPermission = await checkcameraPermission()
        if (!hasPermission) return

        launchCamera(
            {
                mediaType: 'photo',
                saveToPhotos: true,
            },
            response => {
                if (response.didCancel) {
                    //console.error('User cancelled image capture')
                } else if (response.errorCode) {
                    console.error('Error Code:', response.errorMessage)
                } else {
                    const u = response.assets[0].uri
                    //console.error(u)
                    //setImgUri(u)
                    const fileName = u.split('/').pop();
                    //console.error(fileName)
                    addPostDetail(
                        realm,
                        userID,
                        eventId,
                        postId,
                        PostTypes.PHOTO,
                        'untitle Photo',
                        fileName ? fileName : '',
                        u ? u : ''
                    )
                    Alert.alert('Again', 'You want to capture photo again?',
                        [
                            {
                                text: 'NO',
                                onPress: () => { },
                                style: 'cancel'
                            },
                            {
                                text: 'YES',
                                onPress: () => { captureImage() },
                            }
                        ],
                        {
                            cancelable: false
                        }
                    )
                }
            }
        )
    }


    return (
        <View style={{ flex: 1 }}>

            <View style={{ flexDirection: 'row', height: 70, padding: 10 }}>
                <Pressable style = {{flex:1, alignItems : 'flex-start',justifyContent:'center'}} onPress={() => { navigation.pop() }} >
                    <Image style={{ width: 30, height: 30,alignContent:'center' }} source={require('../assets/icons/ic_back.png')} />
                </Pressable>
                <Text style={{ fontSize: 24, marginLeft: 20,flex:8,  alignItems:'center', alignSelf:'center'  }} numberOfLines={1} ellipsizeMode="tail">{postName}</Text>
                <Pressable style = {{flex:1, alignItems : 'flex-end',justifyContent:'center'}} onPress={() => {
                                    setPostModalV(true)       
                                }} >
                    <Image style={{ width: 30, height: 30, margin: 5 }} source={require('../assets/icons/ic_edit.png')} />
                </Pressable>                     
            </View>

            {postDetailData && postDetailData.length > 0 ? (
                <FlatList
                    style={{ alignSelf: 'center' }}
                    data={postDetailData}
                    numColumns={3}
                    renderItem={(item) =>
                        <Pressable onPress={() => {
                            //console.error(item.item.id)
                            setSelectedItem(item.item)
                            setIsUpdateModalV(true)
                        }}>
                            <View style={{ height: 140, width: 120, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: 'black', marginVertical: 3, marginHorizontal: 3 }}>

                                {item.item.type == PostTypes.PHOTO ? (
                                    <Image source={{ uri: item.item.file_path }} style={{ height: 100, width: 100, alignSelf: 'center' }} />
                                ) :
                                    (
                                        item.item.type == PostTypes.AUDIO ? (
                                            <Image source={require('../assets/icons/ic_earphone.png')} style={{ width: 80, height: 100, alignSelf: 'center' }} />
                                        ) : (null)
                                    )
                                }


                                {item.item.type == PostTypes.TEXT ?
                                    (
                                        <Text style={{ fontSize: 16 }}  >{item.item.title}</Text>
                                    ) : (
                                        <Text style={{ fontSize: 16 }} numberOfLines={1}  >{item.item.title}</Text>
                                    )
                                }


                            </View>
                        </Pressable>
                    }
                />
            ) :
                (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ alignSelf: 'center' }}>No Data found</Text>
                        <Text style={{ alignSelf: 'center', fontSize: 10 }}>click + button to Add</Text>
                    </View>

                )
            }


            <FloatingAction
                actions={actions}
                onPressItem={name => {
                    //console.error(name)
                    switch (name) {
                        case 'fab_text':
                            setIsTextPostModalV(true)
                            break
                        case 'fab_camera':
                            captureImage()
                            break;
                        case 'fab_mic':
                            setIsRecordModalV(true)
                            break;
                        default:
                            break
                    }
                }}
            />



            <Modal visible={isRecordModalV} transparent={true} >
                <RecordModalView
                    userID={userID}
                    eventId={eventId}
                    postId = {postId}
                    setIsRecordModalV={setIsRecordModalV}
                />
            </Modal>

            <Modal visible={isTextPostModalV} transparent={true}>
                <TextPostModalView
                    userID={userID}
                    eventId={eventId}
                    postId = {postId}
                    setIsTextPostModalV={setIsTextPostModalV}
                />
            </Modal>

            <Modal visible={isUpdateModalV} transparent={true}>
                <UpdateModalView
                    userID={userID}
                    eventId={eventId}
                    postId = {postId}
                    post_item={selectedItem}
                    setIsUpdateModalV={setIsUpdateModalV}
                />
            </Modal>

            <Modal visible={isPostModalV} transparent={true} >
                <ModalAddPost
                    userID={userID}
                    eventId={eventId}
                    postId = {postId}
                    setModalV={setPostModalV} />
            </Modal>               
                        
        </View>
    );
}

export default PostDetailScreen;


function RecordModalView(props) {

    const [isRecording, setIsRecording] = useState(false)
    const [recordTime, serRecordTime] = useState('')

    const [fileName, setFileName] = useState('')
    const [audioPath, setAudioPath] = useState('')
    const realm = useRealm()


    const checkRecorderPermission = async () => {
        const permision = Platform.select({
            android: PERMISSIONS.ANDROID.RECORD_AUDIO,
            ios: PERMISSIONS.IOS.MICROPHONE
        })
        const result = await check(permision)
        if (result === RESULTS.GRANTED) return true
        if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
            const reqResult = await request(permision);
            return reqResult === RESULTS.GRANTED
        }
        Alert.alert('Permission Denied', 'Audio Record permission is required.')
        return false;
    }

    const onStartRecord = async () => {

        const hasPermission = await checkRecorderPermission()
        if (!hasPermission) return

        const tms = Date.now()
        const fname = Platform.select({
            android: 'rec_' + tms + '.mp4',
            ios: 'rec_' + tms + '.m4a'
        })
        setFileName(fname)

        // console.error(path)
        // return
        const path = RNFS.DocumentDirectoryPath + '/' + fname
        //console.error(path)
        const result = await audioRecorderPlayer.startRecorder(path);
        audioRecorderPlayer.addRecordBackListener((e) => {
            serRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
            return;
        })

        setIsRecording(true);
        //console.error(result)
        setAudioPath(result)
    }

    const onStopRecord = async () => {
        const result = audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setIsRecording(false)
        //console.error('Rec file Path :', result)
        addPostDetail(realm, props.userID, props.eventId, props.postId, PostTypes.AUDIO, 'untitle Audio', fileName, audioPath)
        props.setIsRecordModalV(false)
    }

    return (
        <View style={myStyles.bottomModalContainer}>
            <View style={myStyles.bottomModalView}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 21 }}>Record Audio</Text>

                    <Pressable onPress={() => {
                        if (isRecording) {
                            Alert.alert('Alert !!', 'please stop recording.')
                            return
                        }
                        props.setIsRecordModalV(false)
                    }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/ic_cancel.png')} />
                    </Pressable>

                </View>

                <Text>Record Time : {recordTime}</Text>

                <View style={{ marginVertical: 10, marginHorizontal: 30, marginTop: 30 }}>
                    <Button
                        title={isRecording ? 'Stop' : 'Start'}
                        onPress={() => {
                            isRecording ? onStopRecord() : onStartRecord()
                        }} />
                </View>
            </View>
        </View>
    );
}

function TextPostModalView(props) {

    const [postText, setPostText] = useState('')
    const realm = useRealm()

    function addTextPost() {

        if (postText == '') {
            Alert.alert('Alert!!', 'please enter your comment.')
            return
        }
        addPostDetail(realm, props.userID, props.eventId, props.postId, PostTypes.TEXT, postText, '', '')
        props.setIsTextPostModalV(false)

    }

    return (
        <View style={myStyles.modalContainer}>
            <View style={myStyles.modalView}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 21 }}>Add Text Note</Text>

                    <Pressable onPress={() => { props.setIsTextPostModalV(false) }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/ic_cancel.png')} />
                    </Pressable>

                </View>

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Text Comment</Text>
                <TextInput
                    style={myStyles.inputTextBig}
                    placeholder="comment here..."
                    textAlignVertical="top"
                    value={postText}
                    multiline={true}
                    onChangeText={(updValue) => { setPostText(updValue) }} />

                <View style={{ marginVertical: 10, marginHorizontal: 30, marginTop: 30 }}>
                    <Button
                        title="Submit"
                        onPress={() => {
                            addTextPost()
                        }} />
                </View>
            </View>
        </View>
    );
}

function UpdateModalView(props) {

    const [isPlaying, setIsPlaying] = useState(false)
    const [playTime, setPlayTime] = useState('00:00:00')
    const [fileName, setFileName] = useState('')
    const [audioPath, setAudioPath] = useState('')

    const [postText, setPostText] = useState('')
    const realm = useRealm()


    useEffect(() => {
        //console.error(props.post_item.title)
        setPostText(props.post_item.title)
        setAudioPath(props.post_item.file_path)
    }, [])

    function updatePost() {

        if (postText == '') {
            Alert.alert('Alert!!', 'please enter your comment.')
            return
        }
        updatePostDetail(realm, props.post_item.id,
            {
                title: postText
            }
        )
        props.setIsUpdateModalV(false)

    }

    const onStartPlayer = async () => {
        if (!audioPath) return
        const msg = await audioRecorderPlayer.startPlayer(audioPath);
        //console.error('Start Play:',msg)
        audioRecorderPlayer.addPlayBackListener((e) => {
            setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
            if (e.currentPosition >= e.duration) {
                onStopPlayer()
            }
            return;
        })
        setIsPlaying(true)
    }

    const onStopPlayer = async () => {
        const result = audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener()
        setPlayTime('00:00:00')
        setIsPlaying(false)
    }

    return (
        <View style={myStyles.modalContainer}>
            <View style={myStyles.modalView}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 21 }}>Update Note</Text>

                    <Pressable onPress={() => {
                        if (isPlaying) {
                            Alert.alert('Alert !!', 'please stop Player.')
                            return
                        }
                        props.setIsUpdateModalV(false)
                    }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/ic_cancel.png')} />
                    </Pressable>

                </View>
                {props.post_item.type == PostTypes.PHOTO ?
                    (
                        <Image source={{ uri: props.post_item.file_path }} style={{ width: 200, height: 200, alignSelf: 'center' }} />
                    ) : (
                        props.post_item.type == PostTypes.AUDIO ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 30 }}>
                                <Image source={require('../assets/icons/ic_earphone.png')} style={{ width: 80, height: 80, }} />

                                <Text>{playTime}</Text>

                                <Pressable onPress={() => {
                                    isPlaying ? onStopPlayer() : onStartPlayer()
                                }}>
                                    <Image source={
                                        isPlaying ? (
                                            require('../assets/icons/ic_pause.png')
                                        ) : (
                                            require('../assets/icons/ic_play.png')
                                        )
                                    }
                                        style={{ width: 50, height: 50 }} />
                                </Pressable>
                            </View>
                        ) : null

                    )
                }

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10 }}>Text Comment</Text>
                <TextInput
                    style={myStyles.inputTextBig}
                    placeholder="comment here..."
                    textAlignVertical="top"
                    value={postText}
                    multiline={true}
                    onChangeText={(updValue) => { setPostText(updValue) }} />

                <View style={{ marginVertical: 10, marginHorizontal: 30, marginTop: 30 }}>
                    <Button
                        title="Update"
                        onPress={() => {
                            updatePost()
                        }} />
                </View>
            </View>
        </View>
    );
}

