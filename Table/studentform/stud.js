import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClfB2Dv6dje-1sntW6p3z2DzP75Hg0Phc",
    authDomain: "hackaton1-9d57f.firebaseapp.com",
    projectId: "hackaton1-9d57f",
    storageBucket: "hackaton1-9d57f.appspot.com",
    messagingSenderId: "233682521253",
    appId: "1:233682521253:web:4495bf46dd90c899a7114c",
    measurementId: "G-C3HSTT908W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

document.getElementById('studentForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve the form data
    const studentData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        cnic: document.getElementById('cnic').value,
        userType: document.getElementById('userType').value
    };

    try {
        // Create a new user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, studentData.email, studentData.password);
        const userId = userCredential.user.uid;

        // Save additional student data to Firestore
        const userDoc = doc(db, "students", userId);
        await setDoc(userDoc, {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            cnic: studentData.cnic,
            userType: studentData.userType,
            uid: userId
        });

        console.log("Student data saved to Firestore.");
        // Redirect to the student list page
        window.location.href = 'studentlist.html';

    } catch (error) {
        console.error("Error during signup: ", error);
        alert("Signup failed: " + error.message);
    }
});



