import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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
const db = getFirestore(app);

let currentEditStudentId = null; // Variable to store the ID of the student being edited

// Fetch students and populate the table
async function fetchStudents() {
  try {
    const querySnapshot = await getDocs(collection(db, "students"));
    const tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    querySnapshot.forEach((doc) => {
      const student = doc.data();
      let newRow = tableBody.insertRow();

      newRow.insertCell(0).innerText = student.firstName;
      newRow.insertCell(1).innerText = student.lastName;
      newRow.insertCell(2).innerText = student.email;
      newRow.insertCell(3).innerText = student.cnic;
      newRow.insertCell(4).innerText = student.userType;

      // Create Action buttons (Edit, Add Marks, Delete)
      let actionCell = newRow.insertCell(5);
      actionCell.appendChild(createButton("Edit", () => editStudent(doc.id)));
      actionCell.appendChild(createButton("Add Marks", () => editMarks(student)));
      actionCell.appendChild(createButton("Delete", () => deleteStudent(doc.id)));
    });
  } catch (error) {
    console.error("Error fetching student data: ", error);
  }
}

// Helper function to create a button
function createButton(text, onClick) {
  const button = document.createElement("button");
  button.innerText = text;
  button.onclick = onClick;
  return button;
}

// Function to handle the edit action
async function editStudent(studentId) {
  currentEditStudentId = studentId; // Store the ID of the student being edited
  try {
    const studentDoc = await getDoc(doc(db, "students", studentId));
    if (studentDoc.exists()) {
      const student = studentDoc.data();
      document.getElementById("editFirstName").value = student.firstName;
      document.getElementById("editLastName").value = student.lastName;
      document.getElementById("editEmail").value = student.email;
      document.getElementById("editCnic").value = student.cnic;
      document.getElementById("editUserType").value = student.userType;

      // Show the edit modal and overlay
      document.getElementById("editStudentModal").style.display = "block";
      document.getElementById("modalOverlay").style.display = "block";
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error editing student: ", error);
  }
}

// Function to handle save action after editing
document.getElementById("saveButton").onclick = async function () {
  if (currentEditStudentId) {
    const updatedData = {
      firstName: document.getElementById("editFirstName").value,
      lastName: document.getElementById("editLastName").value,
      email: document.getElementById("editEmail").value,
      cnic: document.getElementById("editCnic").value,
      userType: document.getElementById("editUserType").value,
    };

    try {
      await updateDoc(doc(db, "students", currentEditStudentId), updatedData);
      console.log("Student updated successfully!");

      // Close the modal and refresh the table
      closeEditModal();
      fetchStudents();
    } catch (error) {
      console.error("Error updating student: ", error);
    }
  }
};

// Function to handle delete action
async function deleteStudent(studentId) {
  if (confirm("Are you sure you want to delete this student?")) {
    try {
      await deleteDoc(doc(db, "students", studentId));
      console.log("Student deleted successfully!");
      fetchStudents(); // Refresh the table after deletion
    } catch (error) {
      console.error("Error deleting student: ", error);
    }
  }
}

// Function to close the edit modal
function closeEditModal() {
  document.getElementById("editStudentModal").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
  currentEditStudentId = null;
}

// Fetch students on page load
fetchStudents();

// Function to handle marks editing
async function editMarks(student) {
  document.getElementById("uploadMarksForm").reset(); // Reset the form
  document.getElementById("studentId").value = student.userId; // Assuming userId is available
  document.getElementById("editMarksModal").style.display = "block";
  document.getElementById("modalOverlay").style.display = "block";

  document.getElementById("uploadMarksForm").onsubmit = async function (event) {
    event.preventDefault();
    const marksData = {
      course: document.getElementById("course").value,
      studentId: student.userId,
      marks: document.getElementById("marks").value,
      totalMarks: document.getElementById("totalMarks").value,
      grade: document.getElementById("grade").value,
      cnic: student.cnic,
    };

    try {
      await addDoc(collection(db, "marks"), marksData);
      console.log("Marks uploaded successfully!");
      closeEditMarksModal(); // Close the modal
      document.getElementById("successMessage").style.display = "block";
    } catch (error) {
      console.error("Error uploading marks: ", error);
    }
  };
}

// Function to close the marks modal
function closeEditMarksModal() {
  document.getElementById("editMarksModal").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
}

// Search functionality
document.getElementById("handlerSearch").onclick = async function () {
  const userNicc = document.getElementById("searchNic").value;
  const innerSingle = document.getElementById("innerSingle");
  innerSingle.innerHTML = ""; // Clear previous results

  try {
    const querySnapshot = await getDocs(collection(db, "marks"));
    const marksArray = querySnapshot.docs.map(doc => doc.data());
    const userNic = marksArray.filter(user => user.cnic === userNicc);

    if (userNic.length > 0) {
      innerSingle.innerHTML += `
        <div>
          <div>Course</div>
          <div>Grade</div>
          <div>Student ID</div>
          <div>Marks</div>
          <div>Total Marks</div>
        </div>
      `; // Add table headers

      userNic.forEach(user => {
        innerSingle.innerHTML += `
          <div>
            <div>${user.course}</div>
            <div>${user.grade}</div>
            <div>${user.studentId}</div>
            <div>${user.marks}</div>
            <div>${user.totalMarks}</div>
          </div>
        `;
      });
    } else {
      innerSingle.innerHTML = "<div>No results found for this CNIC.</div>";
    }
  } catch (error) {
    console.error("Error searching marks: ", error);
  }
};
