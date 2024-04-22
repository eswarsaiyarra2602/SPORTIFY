document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.addToCartButton');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log("clicked");
            event.preventDefault(); // Prevent default anchor behavior
            
            const userId = button.dataset.userId;
            const itemId = button.dataset.itemId;
            
            // Create a form element
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/add-to-cart';

            // Create input fields for userId and itemId
            const userIdInput = document.createElement('input');
            userIdInput.type = 'hidden';
            userIdInput.name = 'userId';
            userIdInput.value = userId;
            form.appendChild(userIdInput);

            const itemIdInput = document.createElement('input');
            itemIdInput.type = 'hidden';
            itemIdInput.name = 'itemId';
            itemIdInput.value = itemId;
            form.appendChild(itemIdInput);

            // Append the form to the document body and submit it
            document.body.appendChild(form);
            form.submit();
        });
    });
});
