import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore"; 

import { cityDb } from '../temp/m-city-export'

const firebaseConfig = {
  apiKey: "AIzaSyAj9GkzJyTEny6f98tTwRCdmFadcuotnGA",
  authDomain: "basic-login-demo.firebaseapp.com",
  projectId: "basic-login-demo",
  storageBucket: "basic-login-demo.appspot.com",
  messagingSenderId: "329891808692",
  appId: "1:329891808692:web:351d042960e97011d0dee1",
  measurementId: "G-93X3Z7XJ3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth()


const uploadDataSetToDb = async(array, collectionName) => { 
  const db = getFirestore()
  array.forEach(async item => {   
try {  
  const docRef = await addDoc(collection(db, collectionName), {...item}
  );
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
})
}

//uploadDataSetToDb(cityDb.matches, "matches")
//uploadDataSetToDb(cityDb.players, "players")
//uploadDataSetToDb(cityDb.positions, "positions")
//uploadDataSetToDb(cityDb.promotions, "promotions")
//uploadDataSetToDb(cityDb.teams, "teams")


const getData = async(collectionName) => {
    const db = getFirestore()
    const docSnap = await getDocs(collection(db, collectionName)).catch((error) => console.log(error));
    const snapshot = docSnap.docs.map((doc) => (
        { id:doc.id, ...doc.data() }
       )); 
  
    } 



export {
    initializeApp,
    uploadDataSetToDb,
    getData
}