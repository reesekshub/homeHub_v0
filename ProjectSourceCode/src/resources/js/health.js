function openModal() {
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();
}
// Function to handle the save changes button click
function saveChanges() {
// Get the input values
    var inputRun = document.getElementById('inputRun').value;
    var inputBike = document.getElementById('inputBike').value;
    var inputWeight = document.getElementById('inputWeight').value;
   

    // Get the result elements
    var resultRun = document.getElementById('resultRun');
    var resultBike = document.getElementById('resultBike');
    var resultWeight = document.getElementById('resultWeight');
    var resultCals = document.getElementById('resultCals');
 

    // Set the result elements with the sum of the input values
    if (inputRun !== '') {
        resultRun.textContent = parseFloat(resultRun.textContent) + parseFloat(inputRun);
        resultCals.textContent = parseFloat(resultCals.textContent) + parseFloat(inputRun) * 96;
    }
    if (inputBike !== '') {
        resultBike.textContent = parseFloat(resultBike.textContent) + parseFloat(inputBike);
        resultCals.textContent = parseFloat(resultCals.textContent) + parseFloat(inputBike) * 47;
    }
    if (inputWeight !== '') {
        resultWeight.textContent = parseFloat(resultWeight.textContent) + parseFloat(inputWeight);
        resultCals.textContent = parseFloat(resultCals.textContent) + parseFloat(inputWeight) * 376;
    }



    document.getElementById('inputRun').value = '';
    document.getElementById('inputBike').value = '';
    document.getElementById('inputWeight').value = '';



    // Close the modal after saving changes
    
    var myModal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    myModal.hide();
}

function addSaveButtonListener() {
    var saveButton = document.querySelector('.modal-footer .btn-primary');
    saveButton.addEventListener('click', saveChanges);
}

function saveSleepChanges() {
    // Get the input value
    var inputSleep = document.getElementById('inputSleep').value;

    // Get the result element
    var resultSleep = document.getElementById('resultSleep');

    // Set the result element with the input value
    resultSleep.textContent = parseFloat(resultSleep.textContent) + (parseFloat(inputSleep) - 8);

    // Close the modal after saving changes
    var myModal = bootstrap.Modal.getInstance(document.getElementById('sleepModal'));
    myModal.hide();
}

function addSleepButtonListener() {
    var saveButton = document.querySelector('#sleepModal .btn-primary');
    saveButton.addEventListener('click', saveSleepChanges);
}

document.addEventListener('DOMContentLoaded', addSleepButtonListener);

// Call the function to add event listener after the DOM is loaded
document.addEventListener('DOMContentLoaded', addSaveButtonListener);