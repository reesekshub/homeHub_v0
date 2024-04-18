// Sample data for shopping cart items
const shoppingCartItems = [];

document.addEventListener('DOMContentLoaded', function () {
    // Compile Handlebars template for shopping cart items
    const cartItemSource = document.getElementById("shopping-cart-item-template").innerHTML;
    const cartItemTemplate = Handlebars.compile(cartItemSource);

    // Get elements
    const addItemBtn = document.getElementById("add-item-btn");
    const itemInput = document.getElementById("item-input");
    const shoppingCartItemsContainer = document.getElementById("shopping-cart-items");

    // Function to add item to shopping cart
    function addItemToCart(itemName) {
        // Push item to shopping cart array
        shoppingCartItems.push({ itemName: itemName });

        // Create context for Handlebars template
        const context = { itemName: itemName };

        // Render shopping cart item template
        const html = cartItemTemplate(context);

        // Append HTML to shopping cart container
        shoppingCartItemsContainer.insertAdjacentHTML('beforeend', html);
    }

    // Event listener for add item button click
    addItemBtn.addEventListener('click', function () {
        const itemName = itemInput.value.trim();
        if (itemName !== "") {
            addItemToCart(itemName);
            itemInput.value = ""; // Clear input field
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const addItemBtn = document.getElementById("add-item-btn");
    const itemInput = document.getElementById("item-input");
    const shoppingCartItemsContainer = document.getElementById("shopping-cart-items");

    addItemBtn.addEventListener('click', function () {
        const itemName = itemInput.value.trim();
        if (itemName !== "") {
            addItemToCart(itemName);
            itemInput.value = ""; // Clear input field
        }
    });

    function addItemToCart(itemName) {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item shopping-cart-item";
        listItem.textContent = itemName;

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.addEventListener("click", function() {
            shoppingCartItemsContainer.removeChild(listItem);
    
        });

        listItem.appendChild(deleteButton);
        shoppingCartItemsContainer.appendChild(listItem);
    }
});