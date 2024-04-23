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

        const textNode = document.createTextNode(itemName);
        listItem.appendChild(textNode);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.addEventListener("click", function() {
            shoppingCartItemsContainer.removeChild(listItem);
        });  

        listItem.appendChild(deleteButton);
        shoppingCartItemsContainer.appendChild(listItem);
    }
});
