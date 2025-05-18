import {
    Button,
    Dimensions,
    FlatList,
    Modal, SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import {Text} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
import {ExternalPathString, Href, RelativePathString, UnknownInputParams, useRouter} from "expo-router";
import restData from './../plan.json';
import Svg, {Circle, Polygon, Rect} from "react-native-svg";
import {useAuth} from "./AuthContext";
import axios from "axios";
import TimePicker from 'react-time-picker';
import DatePicker from 'react-date-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

interface FreeTimeRange {
    id: string;
    fromDate: string;
    from: string | null;
    toDate: string;
    to: string | null;
}

function isoToFreeTimeRange(
    id: string,
    fromIso: string | null,
    toIso: string | null,
): FreeTimeRange {

    if (fromIso === null) {
        if (toIso === null) {
            return {
                id,
                fromDate: '',
                from: null,
                toDate: '',
                to: null,
            };
        } else {
            const toDate = new Date(toIso);
            if (isNaN(toDate.getTime())) {
                throw new Error(`Invalid toIso format: ${toIso}`);
            }

            const toDateStr = toDate.toISOString().split('T')[0];

            const toHours = toDate.getUTCHours();
            const toMinutes = toDate.getUTCMinutes();
            const toTime = toHours === 23 && toMinutes === 59
                ? null
                : `${toHours.toString().padStart(2, '0')}:${toMinutes.toString().padStart(2, '0')}`;

            return {
                id,
                fromDate: '',
                from: null,
                toDate: toDateStr,
                to: toTime,
            }
        }
    } else {
        const fromDate = new Date(fromIso);
        if (isNaN(fromDate.getTime())) {
            throw new Error(`Invalid fromIso format: ${fromIso}`);
        }

        const fromDateStr = fromDate.toISOString().split('T')[0];

        const fromHours = fromDate.getUTCHours();
        const fromMinutes = fromDate.getUTCMinutes();
        const fromTime = fromHours === 0 && fromMinutes === 0
            ? null
            : `${fromHours.toString().padStart(2, '0')}:${fromMinutes.toString().padStart(2, '0')}`;

        if (toIso === null) {
            return {
                id,
                fromDate: fromDateStr,
                from: fromTime,
                toDate: '',
                to: null,
            };
        }

        const toDate = new Date(toIso);
        if (isNaN(toDate.getTime())) {
            throw new Error(`Invalid toIso format: ${toIso}`);
        }

        const toDateStr = toDate.toISOString().split('T')[0];

        const toHours = toDate.getUTCHours();
        const toMinutes = toDate.getUTCMinutes();
        const toTime = toHours === 23 && toMinutes === 59
            ? null
            : `${toHours.toString().padStart(2, '0')}:${toMinutes.toString().padStart(2, '0')}`;

        return {
            id,
            fromDate: fromDateStr,
            from: fromTime,
            toDate: toDateStr,
            to: toTime,
        };
    }
}

function freeTimeRangeToIso(range: FreeTimeRange): { fromIso: string | null; toIso: string | null } {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(range.fromDate)) {
        throw new Error(`Invalid fromDate format: ${range.fromDate}`);
    }

    const fromHours = range.from ? parseInt(range.from.split(':')[0]) : 0;
    const fromMinutes = range.from ? parseInt(range.from.split(':')[1]) : 0;
    const fromDate = new Date(`${range.fromDate}T${fromHours.toString().padStart(2, '0')}:${fromMinutes.toString().padStart(2, '0')}:00Z`);
    const fromIso = fromDate.toISOString();

    if (!range.toDate || !range.to) {
        return { fromIso, toIso: null };
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(range.toDate)) {
        throw new Error(`Invalid toDate format: ${range.toDate}`);
    }

    const toHours = range.to ? parseInt(range.to.split(':')[0]) : 23;
    const toMinutes = range.to ? parseInt(range.to.split(':')[1]) : 59;
    const toDate = new Date(`${range.toDate}T${toHours.toString().padStart(2, '0')}:${toMinutes.toString().padStart(2, '0')}:00Z`);
    const toIso = toDate.toISOString();

    return { fromIso, toIso };
}

interface Point {
    x: number;
    y: number;
}

interface Shape {
    type: 'circle' | 'square';
    radius?: number;
    size?: number;
}

interface Table {
    id: number;
    position: Point;
    shape: Shape;
    capacity: number;
    status: 'available' | 'reserved' | 'occupied';
}

interface Floor {
    floor: number;
    boundary: Point[];
    units: string;
    tables: Table[];
}

interface Restaurant {
    name: string;
    floors: Floor[];
}

interface RestaurantData {
    restaurant: Restaurant;
}

export default function RegisterScreen() {
    const [selectedValue, setSelectedValue] = useState('ресторан');

    const router = useRouter();

    const navigateTo = (url: string | { pathname: RelativePathString; params?: UnknownInputParams; } |
        { pathname: ExternalPathString; params?: UnknownInputParams; } | { pathname: `/`; params?: UnknownInputParams; } |
        { pathname: `/login`; params?: UnknownInputParams; } | { pathname: `/register`; params?: UnknownInputParams; } |
        { pathname: `/_sitemap`; params?: UnknownInputParams; } | { pathname: `/scheme`; params?: UnknownInputParams; }) => {
        router.replace(url as Href);
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [modalPosition, setModalPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const data : RestaurantData = restData as RestaurantData;
    const floor = data.restaurant.floors[0];
    const { boundary } = floor;
    let tables: Table[] = [];
    if (!boundary.length) return null;

    const points = boundary.map((point: Point) => `${point.x},${point.y}`).join(' ');
    const buildingWidth = Math.max(...boundary.map(p => p.x)) - Math.min(...boundary.map(p => p.x));
    const buildingHeight = Math.max(...boundary.map(p => p.y)) - Math.min(...boundary.map(p => p.y));

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const maxSvgWidth = screenWidth / 2;
    const maxSvgHeight = screenHeight / 2;

    const scaleX = maxSvgWidth / buildingWidth;
    const scaleY = maxSvgHeight / buildingHeight;
    const scale = Math.min(scaleX, scaleY);
    const svgWidth = buildingWidth * scale;
    const svgHeight = buildingHeight * scale;

    const svgX = (screenWidth - svgWidth) / 2;
    const svgY = (screenHeight - svgHeight) / 2;

    const minX = Math.min(...boundary.map(p => p.x));
    const minY = Math.min(...boundary.map(p => p.y));

    const renderTableSvg = (table: Table) => {
        const { position, shape } = table;
        const adjustedX = position.x - minX;
        const adjustedY = position.y - minY;
        const fillColor = table.status === 'available' ? 'green' : 'red';

        return shape.type === 'circle' ? (
            <Circle
                key={table.id}
                cx={adjustedX}
                cy={adjustedY}
                r={shape.radius}
                fill={fillColor}
                stroke="black"
                strokeWidth="0.2"
                scale={scale}
            />
        ) : (
            <Rect
                key={table.id}
                x={adjustedX - (shape.size! / 2)}
                y={adjustedY - (shape.size! / 2)}
                width={shape.size}
                height={shape.size}
                fill={fillColor}
                stroke="black"
                strokeWidth="0.2"
                scale={scale}
            />
        );
    };

    const renderTableTouchable = (table: Table) => {
        const { position, shape } = table;

        const adjustedX = position.x - minX;
        const adjustedY = position.y - minY;
        const touchX = svgX + adjustedX * scale;
        const touchY = svgY + adjustedY * scale - 30;
        const touchSize = (shape.type === 'circle' ? shape.radius! * 2 : shape.size!) * scale;

        const handlePress = () => {
            let modalX = touchX;
            let modalY = touchY;
            const modalWidth = 200;
            const modalHeight = 150;
            modalX = Math.min(Math.max(modalX, 0), screenWidth - modalWidth);
            modalY = Math.min(Math.max(modalY, 0), screenHeight - modalHeight);

            setSelectedTable(table);
            setModalPosition({ x: modalX, y: modalY });
            setModalVisible(true);
        };

        return (
            <TouchableOpacity
                key={table.id}
                style={{
                    position: 'absolute',
                    left: touchX - touchSize / 2,
                    top: touchY - touchSize / 2,
                    width: touchSize,
                    height: touchSize,
                    // backgroundColor: 'rgba(0, 0, 255, 0.2)',
                }}
                onPress={handlePress}
            />
        );
    };

    let { token, setToken } = useAuth();

    const [freeRanges, setFreeRanges] = useState<FreeTimeRange[]>([]);
    const [timeModalVisible, setTimeModalVisible] = useState(false);

    const [newFromDate, setNewFromDate] = useState<Date | null>(new Date());
    const [newFromTime, setNewFromTime] = useState('10:00');
    const [newToDate, setNewToDate] = useState<Date | null>(new Date());
    const [newToTime, setNewToTime] = useState('11:00');

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    };

    const isTimeRangeAvailable = (
        fromDate: Date | null,
        fromTime: string,
        toDate: Date | null,
        toTime: string,
    ): boolean => {
        if (!fromDate || !toDate) return false;

        const fromDateStr = formatDate(fromDate);
        const toDateStr = formatDate(toDate);
        const [fromHour, fromMin] = fromTime.split(':').map(Number);
        const [toHour, toMin] = toTime.split(':').map(Number);
        const fromMinutes = fromHour * 60 + fromMin;
        const toMinutes = toHour * 60 + toMin;

        const fromDateTime = new Date(fromDateStr);
        fromDateTime.setHours(fromHour, fromMin);
        const toDateTime = new Date(toDateStr);
        toDateTime.setHours(toHour, toMin);
        if (fromDateTime >= toDateTime) {
            return false;
        }

        for (const range of freeRanges) {
            new Date(range.fromDate);
            new Date(range.toDate);

            const rangeFromMinutes = range.from
                ? parseInt(range.from.split(':')[0]) * 60 + parseInt(range.from.split(':')[1])
                : 0;

            const rangeToMinutes = range.to
                ? parseInt(range.to.split(':')[0]) * 60 + parseInt(range.to.split(':')[1])
                : 23 * 60 + 59;

            const isDateInRange =
                fromDateStr >= range.fromDate &&
                toDateStr <= range.toDate &&
                (fromDateStr !== toDateStr || range.fromDate === range.toDate);

            if (isDateInRange) {
                if (
                    fromMinutes >= rangeFromMinutes &&
                    toMinutes <= rangeToMinutes
                ) {
                    return true;
                }
            }
        }

        return false;
    };

    const handleBookTable = async () => {
        try {
            const url = `http://localhost/api/web-gateway/reservations/new-reservation`;

            let segment: FreeTimeRange = {
                id: '0',
                fromDate: formatDate(newFromDate),
                from: newFromTime,
                toDate: formatDate(newToDate),
                to: newToTime,
            };

            const { fromIso, toIso } = freeTimeRangeToIso(segment);

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    reservation_time_from: fromIso,
                    reservation_time_to: toIso,
                    table_id: selectedTable?.id,
                }),
            });

            if (res.status === 401) {
                const refresh = await fetch('http://localhost/api/web-gateway/auth/refresh', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include"
                });

                if (refresh.status === 200) {
                    const refreshData = await refresh.json();

                    if (refreshData && refreshData.access) {
                        setToken(refreshData.access);
                    }
                } else {
                    console.error('Failed to refresh token:', refresh.status, refresh.statusText);
                    alert('Failed to refresh token');
                    return;
                }
            } else if (res.status === 200) {
                const data = await res.json();
                console.log(data);
            } else {
                console.error('Failed to book table:', res.status, res.statusText);
                alert('Failed to book table');
                return;
            }
        } catch (error) {
            console.error(error);
            alert('Failed to book table');
        }
    };

    const renderFreeRange = ({ item }: { item: FreeTimeRange }) => (
        <View style={styles.freeItem}>
            <Text style={styles.freeText}>
                от {item.fromDate} {item.from || '00:00'} до {item.toDate} {item.to || '23:59'}
            </Text>
        </View>
    );

    const handleBook = async () => {
        if (selectedTable) {
            try {
                const url = `http://localhost/api/web-gateway/tables/${selectedTable.id}/free-times`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch free times');
                }

                const jsonData = await res.json();

                if (jsonData) {
                    const freeTimes = jsonData.map((item: any, index: number) => {
                        return isoToFreeTimeRange(
                            `${index}`,
                            item.free_from,
                            item.free_until,
                        );
                    });

                    setFreeRanges(freeTimes);
                } else {
                    setFreeRanges([]);
                }

                setTimeModalVisible(true);
            } catch (error) {
                console.error(error);
            }

            setModalVisible(false);
        }
    };

    const [tablesData, setTablesData] = useState<Table[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost/api/web-gateway/tables?restaurant_id=1');
                const fetchedTables = res.data.tables;

                tables = fetchedTables.map((table: any) => ({
                    id: table.table_id,
                    position: {
                        x: table.x,
                        y: table.y,
                    },
                    shape: {
                        type: table.shape,
                        radius: table.shape === 'circle' ? 3 : undefined,
                        size: table.shape === 'square' ? 6 : undefined,
                    },
                    capacity: table.seats_number,
                    status: 'available' as 'available',
                }));

                setTablesData(tables);
            } catch (err) {
                console.error(`Error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        };

        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.header}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedValue}
                        style={styles.picker}
                        onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="Ресторан" value="ресторан" />
                        <Picker.Item label="Кафе" value="кафе" />
                        <Picker.Item label="Бар" value="бар" />
                    </Picker>
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.bookButton}>
                        <Text style={styles.bookButtonText}>Забронировать</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.headerButton} onPress={() => navigateTo('/login')}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonSpacer}/>

                    <TouchableOpacity style={styles.registerButton} onPress={() => navigateTo('/register')}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <Svg width={svgWidth} height={svgHeight}>
                    <Polygon
                        points={points}
                        fill={'#e0e0e0'}
                        stroke="black"
                        strokeWidth="0.2"
                        scale={scale}
                    />
                    {tablesData && tablesData.map(renderTableSvg)}
                </Svg>

                {tablesData && tablesData.map(renderTableTouchable)}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                    >
                        <View
                            style={[
                                styles.modalContent,
                                { top: modalPosition.y, left: modalPosition.x },
                            ]}
                        >
                            {selectedTable && (
                                <>
                                    {/*<Text style={styles.modalText}>Table: {selectedTable.id}</Text>*/}
                                    <Text style={styles.modalText}>Capacity: {selectedTable.capacity}</Text>
                                    <Text style={styles.modalText}>Status: {selectedTable.status}</Text>

                                    { token && (
                                        <Button
                                            title="Book"
                                            onPress={handleBook}
                                            color={'red'}
                                            disabled={selectedTable.status !== 'available'}
                                        />
                                    )}

                                    { !token && (
                                        <Text style={styles.modalText}>Please login to book a table</Text>
                                    )}
                                </>
                            )}
                        </View>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={timeModalVisible}
                    onRequestClose={() => setTimeModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Бронирование стола</Text>

                            {/* Свободные временные промежутки */}
                            <Text style={styles.subtitle}>Свободные промежутки:</Text>
                            {freeRanges.length > 0 ? (
                                <FlatList
                                    data={freeRanges}
                                    renderItem={renderFreeRange}
                                    keyExtractor={(item) => item.id}
                                    style={styles.freeList}
                                />
                            ) : (
                                <Text style={styles.noFreeSlots}>Всё свободно</Text>
                            )}

                            {/* Выбор даты и времени "От" */}
                            <Text style={styles.label}>Дата начала:</Text>
                            <DatePicker
                                onChange={(value) => setNewFromDate(value as Date | null)}
                                value={newFromDate}
                                format="yyyy-MM-dd"
                            />
                            <Text style={styles.label}>Время начала:</Text>
                            <TimePicker
                                onChange={value => {
                                    if (typeof value === 'string') {
                                        setNewFromTime(value);
                                    }
                                }}
                                value={newFromTime}
                                disableClock={true}
                                format="HH:mm"
                            />

                            {/* Выбор даты и времени "До" */}
                            <Text style={styles.label}>Дата окончания:</Text>
                            <DatePicker
                                onChange={(value) => setNewToDate(value as Date | null)}
                                value={newToDate}
                                format="yyyy-MM-dd"
                            />
                            <Text style={styles.label}>Время окончания:</Text>
                            <TimePicker
                                onChange={value => {
                                    if (typeof value === 'string') {
                                        setNewToTime(value);
                                    }
                                }}
                                value={newToTime}
                                disableClock={true}
                                format="HH:mm"
                            />

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.bookButton]}
                                    onPress={handleBookTable}
                                >
                                    <Text style={styles.actionButtonText}>Ок</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.cancelButton]}
                                    onPress={() => setTimeModalVisible(false)}
                                >
                                    <Text style={styles.actionButtonText}>Отмена</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    bookedItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    bookedText: {
        fontSize: 14,
        color: '#333',
    },
    main: {
        flex: 1,
    },
    footer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        position: 'absolute',
        width: 200,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5,
        width: '15%',
    },
    picker: {
        height: 40,
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#000000',
    },
    bookButton: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginHorizontal: 10,
        borderWidth: 1,
    },
    bookButtonText: {
        color: 'black',
    },
    registerButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#000000',
    },
    registerButtonText: {
        color: 'white',
    },
    buttonText: {
        color: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    link: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
    },
    form: {
        width: '90%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        backgroundColor: 'black',
        borderRadius: 10,
    },
    noFreeSlots: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    freeList: {
        maxHeight: 100,
        marginBottom: 10,
    },
    buttonSpacer: {
        width: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
    },
    bookedList: {
        maxHeight: 100,
        marginBottom: 10,
    },
    noBookings: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 10,
        marginBottom: 5,
    },
    timeButton: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    actionButtonText: {
        color: '#1a1a1a',
        fontSize: 16,
    },
    timePicker: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        width: '100%',
    },
    freeItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    freeText: {
        fontSize: 14,
        color: '#333',
    },
});
