import { StyleSheet } from "react-native";


// Ocr Page
export const ocr = StyleSheet.create({

  MainContainer: {
    position: 'absolute', 
    height: '100%', 
    width: '100%', 
    alignItems: 'center', 
  },

  DetectedHeader: {
    width: '100%', 
    textAlign: 'center', 
    fontSize: 24, 
    fontWeight: 'bold',
  },

  DetectedText: {
    width: '100%', 
    textAlign: 'left', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  
  Option: {
    width: '100%',
    height: 75,
    marginVertical: 10,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#174E7675',
  },
  OptionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#174E76',
  }

});

// Add / Edit Data Forms
export const dataForm = StyleSheet.create({

  MainContainer: {

  },

  SecondContainer: {
    width: '100%',
  },

  ContentContainer: {
    alignSelf: 'center', 
    width: '100%',
  },

  InputContainer: {
    width: '100%',
    marginBottom: 25,
    paddingHorizontal: 15, 
  },

  InputHeading: {
    height: 25,
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#174E76',
  },

  InputData: {
    marginTop: 5,
    height: 50, 
    width: '100%', 
    fontSize: 18, 
    borderWidth: 2, 
    borderRadius: 25,
    borderColor: '#174E76',
    paddingHorizontal: 25, 
    color: '#174E76',
    fontWeight: '500',
  },

  Border: {
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    alignSelf: 'center',
  },

});