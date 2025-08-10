// Counter for unique box IDs
let boxCounter = 3;

// Get container element
const boxContainer = document.getElementById('boxContainer');
const resetBtn = document.getElementById('resetBtn');

// Event delegation for box clicks
boxContainer.addEventListener('click', handleBoxClick);

// Reset button event listener
resetBtn.addEventListener('click', resetAllBoxes);

// Handle box click events
function handleBoxClick(event) {
    const clickedBox = event.target.closest('.box');
    
    // Check if clicked element is a clickable box
    if (clickedBox && clickedBox.classList.contains('clickable')) {
        // Create a copy of the clicked box
        createBoxCopy(clickedBox);
        
        // Make the original box unclickable
        makeBoxUnclickable(clickedBox);
    }
}

// Create a copy of the clicked box
function createBoxCopy(originalBox) {
    // Clone the original box
    const newBox = originalBox.cloneNode(true);
    
    // Update the new box properties
    boxCounter++;
    newBox.id = `box${boxCounter}`;
    newBox.setAttribute('data-box-number', boxCounter);
    
    // Get the color from the original box
    const color = originalBox.getAttribute('data-color');
    
    // Update the text content to show the color
    const boxText = newBox.querySelector('.box-text');
    boxText.textContent = color.charAt(0).toUpperCase() + color.slice(1);
    
    // Ensure the new box is clickable and has the right color class
    newBox.classList.remove('unclickable');
    newBox.classList.add('clickable', 'new-box', color);
    
    // Add the new box to the container
    boxContainer.appendChild(newBox);
    
    // Remove the animation class after animation completes
    setTimeout(() => {
        newBox.classList.remove('new-box');
    }, 300);
    
    console.log(`Created copy: ${color} box ${boxCounter}`);
}

// Make a box unclickable
function makeBoxUnclickable(box) {
    box.classList.remove('clickable');
    box.classList.add('unclickable');
    
    console.log(`Made unclickable: ${box.id}`);
}

// Reset all boxes to their original state
function resetAllBoxes() {
    // Remove all dynamically created boxes
    const allBoxes = boxContainer.querySelectorAll('.box');
    allBoxes.forEach(box => {
        const boxNumber = parseInt(box.getAttribute('data-box-number'));
        if (boxNumber > 3) {
            box.remove();
        }
    });
    
    // Reset the original three boxes
    const originalBoxes = boxContainer.querySelectorAll('.box[data-box-number="1"], .box[data-box-number="2"], .box[data-box-number="3"]');
    originalBoxes.forEach(box => {
        box.classList.remove('unclickable');
        box.classList.add('clickable');
    });
    
    // Reset counter
    boxCounter = 3;
    
    console.log('All boxes reset to original state');
}

// Initialize the demo
console.log('Three Div Elements Demo initialized');
console.log('Click on any colored box to create a copy!');

