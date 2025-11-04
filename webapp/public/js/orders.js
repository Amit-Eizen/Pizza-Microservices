// Orders JavaScript - handles order creation logic

let selectedPizza = {
  id: null,
  name: '',
  price: 0
};

// Open order modal
function openOrderModal(pizzaId, pizzaName, pizzaPrice) {
  selectedPizza = {
    id: pizzaId,
    name: pizzaName,
    price: pizzaPrice
  };

  document.getElementById('orderPizzaId').value = pizzaId;
  document.getElementById('orderPizzaName').value = pizzaName;
  document.getElementById('quantity').value = 1;
  updateTotalPrice();

  document.getElementById('orderModal').style.display = 'block';
}

// Close order modal
function closeOrderModal() {
  document.getElementById('orderModal').style.display = 'none';
  document.getElementById('orderForm').reset();
}

// Update total price when quantity changes
document.addEventListener('DOMContentLoaded', () => {
  const quantityInput = document.getElementById('quantity');
  if (quantityInput) {
    quantityInput.addEventListener('input', updateTotalPrice);
  }

  // Handle form submission
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmit);
  }

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
      closeOrderModal();
    }
  });
});

// Update total price display
function updateTotalPrice() {
  const quantity = parseInt(document.getElementById('quantity').value) || 1;
  const total = selectedPizza.price * quantity;
  document.getElementById('totalPrice').textContent = `₪${total}`;
}

// Show success modal
function showSuccessModal() {
  closeOrderModal();
  document.getElementById('successModal').style.display = 'block';
}

// Close success modal
function closeSuccessModal() {
  document.getElementById('successModal').style.display = 'none';
}

// Navigate to orders page
function goToOrders() {
  window.location.href = '/orders';
}

// Continue ordering (stay on menu page)
function continueOrdering() {
  closeSuccessModal();
}

// Handle order form submission
async function handleOrderSubmit(event) {
  event.preventDefault();

  const quantity = parseInt(document.getElementById('quantity').value);
  const street = document.getElementById('street').value;
  const city = document.getElementById('city').value;
  const zipCode = document.getElementById('zipCode').value;
  const paymentMethod = document.getElementById('paymentMethod').value;

  const orderData = {
    items: [
      {
        pizzaId: selectedPizza.id,
        quantity: quantity
      }
    ],
    deliveryAddress: {
      street: street,
      city: city,
      zipCode: zipCode
    },
    paymentMethod: paymentMethod
  };

  try {
    const response = await fetch('/orders/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (result.success) {
      showSuccessModal();
    } else {
      alert(`Failed to place order: ${result.message}`);
    }
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place order. Please try again later.');
  }
}

// Cancel order function (for orders page)
async function cancelOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) {
    return;
  }

  try {
    const response = await fetch(`/orders/api/${orderId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
      alert('Order cancelled successfully!');
      // Reload the page to see updated orders
      window.location.reload();
    } else {
      alert(`Failed to cancel order: ${result.message}`);
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    alert('Failed to cancel order. Please try again later.');
  }
}
