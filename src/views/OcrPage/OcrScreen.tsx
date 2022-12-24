import React, { useState, useEffect, useContext, useRef } from 'react';
import { Alert, Animated, Dimensions, Easing, Image, LayoutAnimation, Linking, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppDataContext } from '../MainDataContext';
import { ocr } from '../../styles/ocr';
import i18n from '../../locales/i18n';
import { idText } from 'typescript';



/* Parameters and Functions */
const { height, width } = Dimensions.get("window");

const googleVision = {
    request: "https://vision.googleapis.com/v1/images:annotate?key=",
    // key: "AIzaSyB0XDD8hHI70e3LnAsMIYN6CglSxpFrMSS",  // Wrong Key, can try with the wrong key
    key: "AIzaSyA9sF3mO35_BLGbsuOez8zyggvS87yEGJ0",     // True key
};

async function handleCameraModal (setCameraModal: Function) {

    let { status } = await Camera.requestCameraPermissionsAsync();

    if (status === "granted") {
        setCameraModal(true);
    } else if (status === "denied") {
        Alert.alert( 
            "Camera Access Denined",
            "Please allow Expo Go to access device camera",
            [
                { text: "OK", },
                { text: 'Settings', onPress: () => Linking.openSettings()},
            ],
            { cancelable: false }
        )
    }
};

async function handleTakePicture (camera: Camera|null, setImage: Function, setCameraModal: Function) {

    const options: any = {
        quality: 0.3,
        base64: true,
        exif: false,
        flash: 'off',
    };

    let photo = await camera.takePictureAsync(options);
    const base64 = photo.base64;
    setImage(base64);
    setCameraModal(false);
};

async function handlePickImage (setImage: Function) {

    const options: any = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1.0,
        base64: true,
    };
    
    let photo = await ImagePicker.launchImageLibraryAsync(options);
    // console.log("photo", photo)
    if (!photo.canceled) {
        const base64 = photo.assets[0].base64;
        setImage(base64);
    }
};


/* Components */
function LanguageBar () {

    const rawLangRotate = useRef(new Animated.Value(0)).current;
    const langRotate = useRef<any>('0deg');
    const [langExpand, setLangExpand] = useState<boolean>(false);
    const frenchWarning = useRef<boolean>(true);

    const languageSetting = [
        { id: 0, i18n_code: "EN", label: "English" },
        { id: 1, i18n_code: "HK", label: "廣東話" },
        { id: 2, i18n_code: "FR", label: "Français" },
    ];

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (langExpand) {
            Animated.timing(rawLangRotate, {
                toValue: 0,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: false,
              }
            ).start()
        } else {
            Animated.timing(rawLangRotate, {
                toValue: 1,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: false,
              }
            ).start()
        }

        langRotate.current = rawLangRotate.interpolate({
            inputRange: [0, 1], 
            outputRange: ['0deg', '-90deg'],
        });
       
        setLangExpand(!langExpand);
    };

    const handleLanguageChange = (language: string) => {
        Haptics.selectionAsync(); 
        i18n.changeLanguage(language); 
        if (language === "FR" && frenchWarning.current) {
            frenchWarning.current = false;
            alert("Ummm...\n The translation for French is done by Google Translate...")
        }
    };


    return(
        <Animated.View style={{ height: 75, width: langExpand ? '100%' : 100, paddingLeft: 25, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', }}>
            <TouchableOpacity style={{ width: 75, flexDirection: 'row', alignItems: 'center', }} onPress={() => {toggleExpand(); }}>
                <Ionicons name="earth" size={30} color="black" />
                <View style={{ width: 5, }} />
                <Animated.View style={{ transform: [{rotate: langRotate.current}] }}>
                    <Ionicons  name="caret-down" size={20} color="black" />
                </Animated.View>
            </TouchableOpacity>
            <View style={{ width: width-100, flexDirection: 'row', }}>
                { languageSetting.map((lang, index) => 
                    <TouchableOpacity 
                    key={index}
                    style={{ marginHorizontal: 10, paddingHorizontal: 5, borderBottomWidth: 2, borderColor: i18n.language === lang.i18n_code ? '#02af7c' : 'transparent' }} 
                    activeOpacity={0.7}
                    onPress={() => { i18n.language === lang.i18n_code ? null : handleLanguageChange(lang.i18n_code); }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', }}>
                            {lang.label}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    )
}


/* APIs */
async function callGoogleVisionApi (image: string, setVisionRes: Function, setVisionResFetched: Function, setVisionResWarning: Function) {
        
    let response = await fetch(googleVision.request + googleVision.key, 
        {
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": image
                        },
                        "features": [
                            { type: "TEXT_DETECTION" },
                            { type: "DOCUMENT_TEXT_DETECTION" }
                        ],
                    }
                ]
            })
        }
    );

    if (response.status === 400) {
        setVisionRes("Failed to request API, may due to the invalid api key");
        setVisionResFetched(true);
    } else if (response.status === 200) {
        await response.json()
            .then(result => {
                if (Object.keys(result.responses[0]).length > 0) {
                    setVisionRes(result.responses[0].textAnnotations[0].description);
                    setVisionResFetched(true);
                } else {
                    setVisionResWarning("No text is detected");
                    setVisionResFetched(true);
                }
            }).catch((error) => {
                setVisionResWarning("Unknown error, please try again");
                console.log(error);
                setVisionResFetched(true);
            })
    } else {
        setVisionResWarning(`Failed to request API\nError codes: ${response.status}\nCheck the error detail in https://cloud.google.com/vision/docs/reference/rest/v1/Code`);
        setVisionResFetched(true);
    }
    
};


interface OcrPageProps {
    navigation: any;
};

export default function OcrScreen(props: OcrPageProps) {

    console.log("---Ocr Page---");

    /* Init */
    const { t } = useTranslation( "" , { keyPrefix: "ocrPage" });
    const data = useContext(AppDataContext);


    /* useState()s and useRef()s */
    const [camera, setCamera] = useState<Camera | null>(null);
    const [cameraModal, setCameraModal] = useState<boolean>(false);

    const [image, setImage] = useState<string | null>(null);
    const [imageModal, setImageModal] = useState<boolean>(false);
    const [visionRes, setVisionRes] = useState<string>("");
    const [visionResWarning, setVisionResWarning] = useState<string>("");
    const [visionResFetched, setVisionResFetched] = useState<boolean>(false);


    /* useEffect()s */
    useEffect(() => {
        if (image) {
            setVisionResFetched(false);
            setVisionRes("");
            setVisionResWarning("");
            callGoogleVisionApi(image, setVisionRes, setVisionResFetched, setVisionResWarning);
        }
    }, [ image ]);


    return(
        <SafeAreaView style={{ height: '100%', }}>

            {/* Language Bar */}
            <LanguageBar />
            
            {/* Image */}
            <View style={[ocr.imageContainer, { height: width-50, width: width-50, }]}>
                { image ?
                    <TouchableOpacity 
                     style={ocr.image}
                     activeOpacity={0.7}
                     onPress={() => setImageModal(true)}>
                        <Image style={ocr.image} source={{ uri: "data:image/png;base64," + image }} /> 
                    </TouchableOpacity>
                    : 
                    <View style={ocr.messageContainer}>
                        <Text style={ocr.message}>{t('noImage')}</Text>
                    </View>
                }
            </View>

            {/* Text Recognition */}
            <View style={{ height: '25%', paddingTop: 25, }}>
                { image ? 
                    visionResFetched ?
                        visionResWarning ?
                            <View style={ocr.messageContainer}>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'red', }}>{visionResWarning}</Text>
                            </View>
                            :
                            <ScrollView style={{ paddingHorizontal: 25, paddingVertical: 15, }}>
                                <Text>{visionRes}</Text>
                            </ScrollView>
                        :
                        <View style={ocr.messageContainer}>
                            <Text style={ocr.message}>{t('loading')}</Text>
                        </View>
                    :
                    <View style={{ height: '100%', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 25, }}>
                        <Text style={{ fontSize: 24, }}>{t('uploadImage')}</Text>
                    </View>
                }
            </View>

            <View style={ocr.border} />

            {/* Options */}
            <View>
                <View
                style={[ocr.optionContainer, { backgroundColor: image && !visionResFetched ? '#a00000' : '#02af7c', marginBottom: 25, }]}>
                    <TouchableOpacity
                    style={ocr.optionInnerContainer}
                    onPress={() => handleCameraModal(setCameraModal)}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#ffffff' }}>
                            {image && !visionResFetched ? t('loading') : t('fromCamera')}
                        </Text>
                        
                    </TouchableOpacity>
                </View>

                <View
                style={ocr.optionContainer}>
                    <TouchableOpacity
                    style={[ocr.optionInnerContainer, { borderWidth: 2, borderColor: image && !visionResFetched ? '#a00000' : '#02af7c', }]}
                    activeOpacity={0.7}
                    onPress={() => handlePickImage(setImage)}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: image && !visionResFetched ? '#a00000' : '#02af7c' }}>
                            {image && !visionResFetched ? t('loading') : t('fromDevice')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Full Size Image */}
            <Modal
             visible={imageModal}
             animationType={'slide'}>
                <View style={ocr.modalContainer}>
                    <TouchableWithoutFeedback onPress={() => setImageModal(false)}>
                        <Image style={{ height: '100%', resizeMode: 'contain', }} source={{ uri: "data:image/png;base64," + image }} /> 
                    </TouchableWithoutFeedback>
                </View>
            </Modal>

            {/* Camera */}
            <Modal
             visible={cameraModal}
             animationType={'fade'}>

                <Camera 
                 style={{ height: '100%', width: '100%', }} 
                 type={CameraType.back} 
                 ref={(ref) => setCamera(ref)} />

                <SafeAreaView style={[ocr.modalContainer, { alignItems: 'center', }]}>

                    <View style={{ width: '100%', }}>
                        <TouchableOpacity 
                         style={{ width: 100, flexDirection: 'row', alignItems: 'center', padding: 15, }}
                         onPress={() => setCameraModal(false)}>
                            <Ionicons name="chevron-back" size={30} color="#FFFFFF" />
                            <Text style={{ fontSize: 18, color: '#FFFFFF', }}>{t('back')}</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{ height: '12.5%', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ color: '#FFFFFF', fontWeight: '500', fontSize: 18, }}>{t('insideFrame')}</Text>
                    </View>

                    <View style={{ height: width-50, width: width-50, marginHorizontal: 10, marginVertical: 10, }}>
                        <Image style={{ height: '100%', width: '100%', }} source={ require("../../assets/OcrPage/cameraFrame.png") } />
                    </View>

                    <View style={{ height: '30%', width: 250, justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity 
                            activeOpacity={0.7}
                            onPress={() => handleTakePicture(camera, setImage, setCameraModal)}>
                            <Ionicons name="scan-circle" size={100} color={'#ffffff'} />
                        </TouchableOpacity>
                    </View>

                </SafeAreaView>

            </Modal>

            <StatusBar style="auto" />

        </SafeAreaView>
    );
}