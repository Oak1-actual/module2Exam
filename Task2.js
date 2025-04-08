function calculateTotal() {
    var roomRate = document.getElementById('room-type').value;
    var nights = document.getElementById('nights').value; // Changed: from .innerHTML to .value for correct access.

    nights = parseInt(nights);
    
    if (isNaN(nights) || nights <= 0) {
        alert('Please enter a valid number of nights.');
        return;
    }

    if (roomRate === "") {
        alert('Please select a room type.');
        return;
    }

    var total = parseInt(roomRate) * nights;
    document.getElementById('total-cost').textContent = total.toFixed(2);  // Changed: from .innerText to .textContent, ID to Id;
}

function confirmBooking() {
    let total = parseFloat(document.getElementById('total-cost').textContent); // added parseFloat to catch unexpected errors with converting string. Changed from .innerText to .textContent for consistency.
    if (total <= 0) { // Changed operator to <= to ensure total is a positive number
        alert('Please calculate the total before confirming.');
        return;
    }

    document.getElementById('confirmation-msg').innerText = `Your booking is confirmed. Total cost: $${total.toFixed(2)}`; //added: .toFixed(2) for matching float number as displayed in calculation.
}

function resetForm() {
    document.getElementById('room-type').selectedIndex = 0;
    document.getElementById('nights').value = 1; // Changed to 1, since 0 doesn't make sence to book.
    document.getElementById('confirmation-msg').textContent = ''; // Changed from .innerText to .textContent
    document.getElementById('total-cost').textContent = 0; //added this line to reset total cost aswell
}