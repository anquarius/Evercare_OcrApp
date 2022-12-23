import React, { useContext, useState, useEffect } from 'react';
import { Image, Modal, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Params from './types';

import OcrScreen from '../views/OcrPage/OcrScreen';

/* Parameters and Functions */
const RootStack = createNativeStackNavigator<Params.RootStackParams>();


/* Root */
export default function RootStackNavigator () {

    return(
        <NavigationContainer>
            <RootStack.Navigator
                initialRouteName={"OcrScreen"}
                screenOptions={() => ({
                    headerShown: false,
                })}>
                <RootStack.Screen
                    name="OcrScreen"
                    component={OcrScreen}
                />
                {/* <RootStack.Screen
                    name="OcrDetail"
                    component={OcrDetailScreen}
                /> */}
            </RootStack.Navigator>
        </NavigationContainer>
    );
}