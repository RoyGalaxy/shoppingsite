const stripe = Stripe("pk_test_51LlpoqSCw4adMApfje9B4e5PAwnbXFZv3RGaliDMikkNpwFc3u19BTvPKZAdut4OYv7nW0cnvU5JZHWk5zukheVu001DJES5za");
const addressForm = document.getElementById("addressForm")


let elements;
const items = localStorage.cartItems ? JSON.parse(localStorage.cartItems) : []
let shipping;
let totalAmount;
const user = JSON.parse(localStorage.user)


addressForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const addressLine1 = document.getElementById("addressLine1").value;
  const addressLine2 = document.getElementById("addressLine2").value;
  const postal_code = document.getElementById("postalCode").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  shipping = {
    name: user.username,
    address: {
      line1: addressLine1,
      line2: addressLine2,
      postal_code: postal_code,
      city: city,
      state: state,
      country: "US"
    }
  }

  addressForm.classList.toggle("hidden")
  document.querySelector("#payment-form").classList.toggle("hidden")
  initialize()
  checkStatus()
})

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);


// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch("/api/checkout/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({user,items,shipping}),
  });
  const { clientSecret,amount } = await response.json();
  totalAmount = amount

  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  const btn = document.getElementById("button-text")
  btn.innerHTML = `Pay $${amount}`
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: 'http://localhost:3000/success.html',
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    console.log(error)
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
  localhost

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded! Redirecting...");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}