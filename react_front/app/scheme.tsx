import {Button, Dimensions, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {ExternalPathString, Href, RelativePathString, UnknownInputParams, useRouter} from "expo-router";
import restData from './../plan.json';
import Svg, {Circle, Polygon, Rect} from "react-native-svg";

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
    const { boundary, tables } = floor;

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

    const renderTable = (table: Table) => {
        const { position, shape } = table;
        const fillColor = table.status === 'available' ? 'green' : 'red';

        const handlePress = (event: any) => {
            const { locationX, locationY } = event.nativeEvent;
            let modalX = svgX + locationX;
            let modalY = svgY + locationY;
            const modalWidth = 200;
            const modalHeight = 150;

            modalX = Math.min(Math.max(modalX, 0), screenWidth - modalWidth);
            modalY = Math.min(Math.max(modalY, 0), screenHeight - modalHeight);

            setSelectedTable(table);
            setModalPosition({ x: modalX, y: modalY });
            setModalVisible(true);
        };

        const element =
            shape.type === 'circle' ? (
                <Circle
                    cx={position.x}
                    cy={position.y}
                    r={shape.radius}
                    fill={fillColor}
                    stroke="black"
                    strokeWidth="0.5"
                    scale={scale}
                />
            ) : (
                <Rect
                    x={position.x - (shape.size! / 2)}
                    y={position.y - (shape.size! / 2)}
                    width={shape.size}
                    height={shape.size}
                    fill={fillColor}
                    stroke="black"
                    strokeWidth="0.5"
                    scale={scale}
                />
            );

        return (
            <TouchableOpacity key={table.id} onPress={handlePress} style={StyleSheet.absoluteFill}>
                {element}
            </TouchableOpacity>
        );
    };

    const handleBook = () => {
        if (selectedTable) {
            alert(`Table ${selectedTable.id} booked!`);
            setModalVisible(false);
        }
    };

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
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                        scale={scale}
                    />
                    {tables.map(renderTable)}
                </Svg>

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
                                    <Text style={styles.modalText}>Table: {selectedTable.id}</Text>
                                    <Text style={styles.modalText}>Status: {selectedTable.status}</Text>
                                    <Text style={styles.modalText}>Capacity: {selectedTable.capacity}</Text>
                                    <Button
                                        title="Book"
                                        onPress={handleBook}
                                        disabled={selectedTable.status !== 'available'}
                                    />
                                </>
                            )}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: '#808080',
    },
    bookButton: {
        backgroundColor: '#e0a0a0',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    bookButtonText: {
        color: 'white',
    },
    registerButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#808080',
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
    buttonSpacer: {
        width: 10,
    },
});
