// Student data storage
let students = [];

// DOM elements
const studentForm = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const studentGradeInput = document.getElementById('studentGrade');
const nameError = document.getElementById('nameError');
const gradeError = document.getElementById('gradeError');
const studentTableBody = document.getElementById('studentTableBody');
const filterSelect = document.getElementById('filterSelect');
const sortSelect = document.getElementById('sortSelect');

// Event listeners
studentForm.addEventListener('submit', handleFormSubmit);
filterSelect.addEventListener('change', handleFilter);
sortSelect.addEventListener('change', handleSort);

// Form submission handler
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Clear previous error messages
    clearErrors();
    
    const name = studentNameInput.value.trim();
    const grade = parseFloat(studentGradeInput.value);
    
    // Validate input
    if (validateInput(name, grade)) {
        // Capitalize first letter of name
        const capitalizedName = capitalizeFirstLetter(name);
        
        // Add student to array
        const student = {
            name: capitalizedName,
            grade: grade,
            status: grade >= 60 ? 'Success' : 'Failed'
        };
        
        students.push(student);
        
        // Clear form
        studentForm.reset();
        
        // Update table display
        displayStudents();
        
        // Reset filters and sorting
        filterSelect.value = 'all';
        sortSelect.value = 'none';
    }
}

// Input validation
function validateInput(name, grade) {
    let isValid = true;
    
    // Validate name
    if (!name) {
        showError('nameError', 'Student name cannot be empty.');
        isValid = false;
    } else if (isNameDuplicate(name)) {
        showError('nameError', 'Student name already exists in the table.');
        isValid = false;
    }
    
    // Validate grade
    if (isNaN(grade) || grade < 0 || grade > 100) {
        showError('gradeError', 'Grade must be a number between 0 and 100.');
        isValid = false;
    }
    
    return isValid;
}

// Check if name already exists (case-insensitive)
function isNameDuplicate(name) {
    return students.some(student => 
        student.name.toLowerCase() === name.toLowerCase()
    );
}

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Show error message
function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

// Clear all error messages
function clearErrors() {
    nameError.textContent = '';
    gradeError.textContent = '';
}

// Display students in table
function displayStudents(studentsToShow = students) {
    studentTableBody.innerHTML = '';
    
    studentsToShow.forEach(student => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.grade}</td>
            <td class="${student.status === 'Success' ? 'status-success' : 'status-failed'}">
                ${student.status}
            </td>
        `;
        
        studentTableBody.appendChild(row);
    });
}

// Handle filtering
function handleFilter() {
    const filterValue = filterSelect.value;
    let filteredStudents = students;
    
    switch (filterValue) {
        case 'failed':
            filteredStudents = students.filter(student => student.grade < 60);
            break;
        case 'success':
            filteredStudents = students.filter(student => student.grade >= 60);
            break;
        default:
            filteredStudents = students;
    }
    
    // Apply current sorting to filtered results
    const sortValue = sortSelect.value;
    if (sortValue !== 'none') {
        filteredStudents = sortStudents(filteredStudents, sortValue);
    }
    
    displayStudents(filteredStudents);
}

// Handle sorting
function handleSort() {
    const sortValue = sortSelect.value;
    let sortedStudents = [...students];
    
    if (sortValue !== 'none') {
        sortedStudents = sortStudents(sortedStudents, sortValue);
    }
    
    // Apply current filter to sorted results
    const filterValue = filterSelect.value;
    if (filterValue !== 'all') {
        switch (filterValue) {
            case 'failed':
                sortedStudents = sortedStudents.filter(student => student.grade < 60);
                break;
            case 'success':
                sortedStudents = sortedStudents.filter(student => student.grade >= 60);
                break;
        }
    }
    
    displayStudents(sortedStudents);
}

// Sort students array
function sortStudents(studentsArray, sortBy) {
    return studentsArray.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'grade') {
            return b.grade - a.grade; // Descending order for grades
        }
        return 0;
    });
}

// Initialize empty table
displayStudents();

