import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Modal, PermissionsAndroid, Platform, Pressable, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import RNCalendarEvents, { CalendarEventReadable } from 'react-native-calendar-events'
import DateTimePicker from "react-native-modal-datetime-picker";
import myStyles from "../../myStyles";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";


function ReminderFormScreen(): React.JSX.Element {

    const today = new Date().toISOString().split('T')[0]
    const [isModalV, setModalV] = useState(false)
    const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({})
    const [selectedDate, setSelectedDate] = useState<string | null>(today)
    const [eventsByDate, setEventsByDate] = useState<{ [date: string]: CalendarEventReadable[] }>({})
    const navigation = useNavigation()

    useEffect(() => {
        loadEvents()
    }, [])


    const loadEvents = async () => {
        const permission = await RNCalendarEvents.requestPermissions()
        if (permission === 'authorized') {
            const now = new Date()
            const start = new Date(now)
            start.setMonth(now.getMonth() - 1)
            const end = new Date(now)
            end.setMonth(now.getMonth() + 1)

            const events = await RNCalendarEvents.fetchAllEvents(start.toISOString(), end.toISOString(), [])

            const grouped: { [key: string]: CalendarEventReadable[] } = {}
            const marked: { [key: string]: any } = {}

            events.forEach(event => {
                const dateKey = dayjs(event.startDate).format('YYYY-MM-DD')

                if (!grouped[dateKey]) grouped[dateKey] = []
                grouped[dateKey].push(event)

                marked[dateKey] = { marked: true, dotColor: '#00ADF5' }
            })

            setEventsByDate(grouped)
            setMarkedDates(marked)
        }

    }


    const formateDateDW = (isoDt: string) => {
        return dayjs(isoDt).format('dddd')
    }
    const formateDateD = (isoDt: string) => {
        return dayjs(isoDt).format('DD')
    }
    const formateDateTA = (isoDt: string) => {
        return dayjs(isoDt).format('hh:mm A')
    }

    return (
        <View style={{ flex: 1 }}>

            <View style={{ flexDirection: 'row', height: 70, justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                <Pressable onPress={() => { navigation.pop() }} >
                    <Image style={{ width: 30, height: 30, margin: 5 }} source={require('../assets/icons/ic_back.png')} />
                </Pressable>
                <Text style={{ fontSize: 24, marginLeft: 20, }} numberOfLines={1} ellipsizeMode="tail">Calendar</Text>
            </View>

            <Calendar
                markedDates={{
                    ...markedDates,
                    ...(selectedDate && { [selectedDate]: { selected: true, selectedColor: '#00ADF5' } }),
                }}
                onDayPress={(day) => {
                    setSelectedDate(day.dateString)
                }}
            />

            {selectedDate ? (
                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', }}>{formateDateD(selectedDate)}</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>{formateDateDW(selectedDate)}</Text>
                </View>
            ) : null}

            {selectedDate && eventsByDate[selectedDate] ? (
                <FlatList
                    style={{ marginTop: 5 }}
                    data={eventsByDate[selectedDate]}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={myStyles.listItemCal}>
                            <Text style={{ fontSize: 18 }}> {item.title}</Text>
                            <Text numberOfLines={3} style={{ fontSize: 12 }}> {item.description}</Text>

                            <Text>{formateDateTA(item.startDate)} - {formateDateTA(item.endDate!)} </Text>
                        </View>
                    )}
                />

            ) : (
                <Text style={{ padding: 10, alignSelf: 'center', marginTop: 40 }}>No events</Text>
            )
            }


            <TouchableOpacity style={myStyles.fab} onPress={() => { setModalV(true) }}>
                <Image source={require('../assets/icons/ic_add.png')} style={{ width: 70, height: 70 }} />
            </TouchableOpacity>

            <Modal visible={isModalV} transparent={true} >
                <ModalView
                    setModalV={setModalV}
                    loadEvents = {loadEvents} />
            </Modal>

        </View >

    );
}

export default ReminderFormScreen;



function ModalView(props: any) {
    const start = new Date(new Date().getTime() + 30 * 60000); // 30 min duration
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(start);
    const [showPicker, setShowPicker] = useState(false);

    const hideDatePicker = () => {
        setShowPicker(false);
    };

    const formateDate = (isoDt: Date) => {
        return dayjs(isoDt).format('ddd, MMM DD, YYYY  hh:mm A')
    }

    const handleConfirm = (date: any) => {
        //console.error("A date has been picked: ", date);
        setDate(date)
        hideDatePicker();
    };

    const getDefaultWritableCalendarId = async () => {
        const calendars = await RNCalendarEvents.findCalendars();

        const writableCalendar = calendars.find(
            (cal) => cal.allowsModifications === true
        );

        if (!writableCalendar) {
            throw new Error('No writable calendar found');
        }

        return writableCalendar.id;
    };

    const saveReminder = async () => {

        if (!title) {
            Alert.alert('Empty', 'please add event title')
            return
        }

        const permission = await RNCalendarEvents.requestPermissions();

        if (permission === 'authorized') {
            try {
                const endDate = new Date(date.getTime() + 30 * 60000); // 30 min duration
                const calId = await getDefaultWritableCalendarId();
                //console.error('Writable Calendar ID:', calId);
                const alarmDate = new Date(date.getTime() - (5 * 60 * 1000)) // 5 minutes before
                const alarms = Platform.OS == 'ios' 
                                ? [{ relativeOffset: -5 }]
                                : [{date: alarmDate.toString()}]

                const eventId = await RNCalendarEvents.saveEvent(
                    title || 'Event Reminder',
                    {  
                        calendarId: calId,
                        startDate: date.toISOString(),
                        endDate: endDate.toISOString(),
                        alarms,
                        notes: 'Created from Event App',
                        description: desc

                    });

                Alert.alert('Success', 'Reminder added to calendar!');
                //console.log('Event ID:', eventId);
                props.setModalV(false)
                props.loadEvents()
            } catch (error) {
                //console.log('saveEvent error:', JSON.stringify(error, null, 2));
                //Alert.alert('Error', 'Failed to create event. See logs for details.');
                Alert.alert('Error', 'Failed to create event.');
               //console.error(error);
            }
        } else {
            Alert.alert('Permission Denied', 'Calendar access is required.');
        }
    };


    return (
        <View style={myStyles.modalContainer}>
            <View style={myStyles.modalView}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 21 }}>Add Reminder</Text>

                    <Pressable onPress={() => { props.setModalV(false) }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/ic_cancel.png')} />
                    </Pressable>

                </View>

                <Text style={{ fontSize: 12, paddingLeft: 5, marginTop: 10, marginBottom: 5 }}>Event</Text>
                <TextInput
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 5,
                    }}
                />
                <Text style={{ fontSize: 12, paddingLeft: 5, marginBottom: 5 }}>Description</Text>
                <TextInput
                    placeholder="Description(optional)"
                    value={desc}
                    onChangeText={setDesc}
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        marginBottom: 20,
                        borderRadius: 5,
                    }}
                />

                <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => { setShowPicker(true) }}>
                    <Text style={{ marginTop: 10, marginBottom: 20, fontSize: 15, fontWeight: 'bold' }}>
                        {formateDate(date)}
                    </Text>
                    <Image source={require('../assets/icons/ic_date_time.png')} style={{ height: 40, width: 40 }} />
                </Pressable>


                <TouchableHighlight onPress={() => { saveReminder() }}>
                    <View>
                        <Text style={myStyles.textButton}>Save Reminder</Text>
                    </View>
                </TouchableHighlight>

                {showPicker ? (
                    <DateTimePicker
                        isVisible={showPicker}
                        display="default"
                        date={date}
                        mode="datetime"
                        minimumDate={new Date()}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                ) : null}


            </View>
        </View>
    );
}