import { StyleSheet } from "react-native";

export default StyleSheet.create({
    inputText: {
        borderColor: 'green',
        borderWidth: 2,
        margin: 3,
        borderRadius: 10
    },
    inputTextBig: {
        borderColor: 'green',
        borderWidth: 2,
        height: 120,
        margin: 3,
        borderRadius: 10,
    },
    listItem: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginVertical: 3,
        marginHorizontal: 15
    },
    listItemCal: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#F5F5F5',
        backgroundColor: 'white',
        marginVertical: 3,
        marginHorizontal: 15
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(71, 70, 72, 0.62)',
        justifyContent: 'center'
    },
    modalView: {
        margin: 40,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10
    },
    bottomModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(71, 70, 72, 0.62)',
        justifyContent: 'flex-end'
    },
    bottomModalView: {
        padding: 40,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    textButton: {
        marginHorizontal: 30,
        marginTop: 30,
        marginBottom: 10,
        padding: 10,
        textAlign: 'center',
        borderRadius: 8,
        fontWeight : 'bold',
        fontSize:18,
        color:'white',
        backgroundColor:'#1c274c'
    },

})