import { StyleSheet } from "react-native";


// Ocr Page
export const ocr = StyleSheet.create({

  imageContainer: { 
    borderWidth: 1, 
    borderRadius: 25, 
    alignSelf: 'center',  
  },
  image: { 
    height: '100%', 
    width: '100%', 
    borderRadius: 25, 
  },

  messageContainer: { 
    height: '100%', 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  message: {
    fontSize: 24, 
  },

  border: { 
    marginVertical: 15, 
    marginHorizontal: 35, 
    borderWidth: 0.5, 
  },

  optionContainer: { 
    height: 50, 
    width: 200, 
    alignSelf: 'center', 
    borderRadius: 25,
  },
  optionInnerContainer: { 
    height: '100%', 
    width: '100%', 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },

  modalContainer: { 
    position: 'absolute', 
    height: '100%', 
    width: '100%', 
  },
});
