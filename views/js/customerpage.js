// const bookingButtons = document.querySelectorAll('.booking');
//     bookingButtons.forEach(button => {
//         button.addEventListener('click', async (event) => {
//             const mechanicId = event.target.getAttribute('data-mechanic.id');
//             try {
//                 const response = await fetch(`/Customer/${mechanicId}`, {
//                     method: 'POST'
//                 });
//                 if (response.ok) {
//                     alert('booked')
//                     //location.reload();
//                     // Optionally, perform additional actions after successful deletion
//                     console.log('Category deleted successfully');
//                 } else {
//                     console.error('Failed to delete Category');
//                     alert('Failed to delete Category')
//                 }
//             } catch (error) {
//                 console.error('Error deleting Category:', error);
//             }
//         });
//     });

// function bookMechanic(mechanicId) {
//       // Implement your booking logic here
//       console.log(`Booking mechanic with ID ${mechanicId}`);
//       console.log('Mechanic Details:', mechanic);
//     }
//     function goBack() {
//     window.history.back();
// }

function filterMechanics() {
    // Get input value and convert it to uppercase for case-insensitive search
    var input = document.getElementById("search-bar");
    var filter = input.value.toUpperCase();

    // Get the table and rows
    var table = document.querySelector("table");
    var rows = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those that don't match the search query
    for (var i = 1; i < rows.length; i++) {  // Start from 1 to skip the header row
      var addressCell = rows[i].getElementsByTagName("td")[4]; // Assuming address is in the fourth cell
      if (addressCell) {
        var address = addressCell.textContent || addressCell.innerText;
        if (address.toUpperCase().indexOf(filter) > -1) {
          rows[i].style.display = "";
        } else {
          rows[i].style.display = "none";
        }
      }
    }
  }
  // document.getElementById('bookButton').addEventListener('click', () => bookMechanic(mechanic));
  // function  bookMechanic(mechanic) {
  //   const bookingDetailsModal = document.getElementById('bookingModal');
  //   const bookingDetails = document.getElementById('bookingDetails');
  //   const currentAddressInput = document.getElementById('currentAddress');
  //   const vehicleNumberInput = document.getElementById('vehicleNumber');
  //   const vehicleTypeInput = document.getElementById('vehicleType');
  
  //   // Check if the mechanic object is defined
  //   if (mechanic) {
  //     // Populate the booking details section or card
  //     bookingDetails.innerHTML = `
  //       <p><strong>Name:</strong> ${mechanic.mechname}</p>
  //       <p><strong>Phone Number:</strong> ${mechanic.phno}</p>
  //       <p><strong>Email Address:</strong> ${mechanic.email}</p>
  //       <p><strong>Experience:</strong> ${mechanic.exp}</p>
  //       <p><strong>Availability:</strong> Your Availability Logic</p>
  //       <p><strong>Address:</strong> ${mechanic.address}</p>
  //     `;
  //   }
  
  //   // Clear form inputs
  //   currentAddressInput.value = '';
  //   vehicleNumberInput.value = '';
  //   vehicleTypeInput.value = '2wheeler';
  
  //   // Show the modal
  //   bookingDetailsModal.style.display = 'block';
  // }
  function closeBookingModal() {
    // Close the booking modal
    const bookingDetailsModal = document.getElementById('bookingModal');
    bookingDetailsModal.style.display = 'none';
  }
  function performAfterSaveActions(){
    alert("Booked!!!");
    closeBookingModal();
  }
  // function confirmBooking() {
  //   // Implement your logic to handle the confirmed booking
  //   // Retrieve the values from the form inputs
  //   const currentAddress = document.getElementById('currentAddress').value;
  //   const vehicleNumber = document.getElementById('vehicleNumber').value;
  //   const vehicleType = document.getElementById('vehicleType').value;

  //   // Implement the logic to confirm the booking with the selected mechanic
  //   // You can use the values of currentAddress, vehicleNumber, and vehicleType
  //   console.log('Booking Confirmed:', currentAddress, vehicleNumber, vehicleType);

  //   // Close the modal
  //   showBookingConfirmation();
  //   closeBookingModal();
  //}

  // document.addEventListener('', function () {
  //   showBookingConfirmation();
  // });
  //document.getElementById('confirmBook').addEventListener('submit', () => showBookingConfirmation());

  function showBookingConfirmation() {
    // You can customize this function to display a confirmation message on the screen
    // For example, you can create a div element with a tick icon and append it to the body
    const confirmationDiv = document.createElement('div');
    confirmationDiv.innerHTML = '<p>Mechanic Booked <span>&#10003;</span></p>';
    confirmationDiv.style.position = 'fixed';
    confirmationDiv.style.top = '50%';
    confirmationDiv.style.left = '50%';
    confirmationDiv.style.transform = 'translate(-50%, -50%)';
    confirmationDiv.style.padding = '20px';
    confirmationDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    confirmationDiv.style.border = '2px solid #28a745';
    confirmationDiv.style.borderRadius = '10px';
    confirmationDiv.style.textAlign = 'center';
    confirmationDiv.style.fontWeight = 'bold';
    confirmationDiv.style.fontSize = '18px';
  
    document.body.appendChild(confirmationDiv);
  
    // Remove the confirmation message after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      document.body.removeChild(confirmationDiv);
    }, 2000);
}

// document.querySelector('.logout').addEventListener('click', function() {
//   localStorage.clear();
// });
