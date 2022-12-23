import React, { useState, useEffect } from 'react';
import { Text, View, } from 'react-native';
import { AppDataContext } from './MainDataContext';
import Routes from '../routes/Navigator';



export default function AppData() {

    console.log("---Root Data Refresh---");


    /* Global Variables */

  


    const data = {

    };


    return(
        <View style={{ height: '100%' }}>
            <AppDataContext.Provider value={data}>
                <Routes />
            </AppDataContext.Provider>
        </View>
    );
}