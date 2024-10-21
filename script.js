let currentPosition = 0;
let recommendationsPosition = 0;
const cardWidth = 280; // Width of each card plus margin
let cart = [];
let wishlist = [];

function moveCarousel(direction, carouselType) {
  const container = document.querySelector(carouselType === 'best' ? '.book-cards' : '.recommendations-cards');
  const maxPosition = Math.max((container.children.length - 4) * cardWidth, 0);
  
  if (carouselType === 'best') {
    currentPosition += direction * cardWidth;
    currentPosition = Math.max(Math.min(currentPosition, maxPosition), 0);
    container.style.transform = `translateX(-${currentPosition}px)`;
  } else {
    recommendationsPosition += direction * cardWidth;
    recommendationsPosition = Math.max(Math.min(recommendationsPosition, maxPosition), 0);
    container.style.transform = `translateX(-${recommendationsPosition}px)`;
  }
  
  updateCarouselButtons(carouselType);
}

function updateCarouselButtons(carouselType) {
  const prevButton = document.querySelector(carouselType === 'best' ? '.book-carousel .carousel-button.prev' : '.recommendations-carousel .carousel-button.prev');
  const nextButton = document.querySelector(carouselType === 'best' ? '.book-carousel .carousel-button.next' : '.recommendations-carousel .carousel-button.next');
  const container = document.querySelector(carouselType === 'best' ? '.book-cards' : '.recommendations-cards');
  
  const position = carouselType === 'best' ? currentPosition : recommendationsPosition;
  const maxPosition = Math.max((container.children.length - 4) * cardWidth, 0);
  
  prevButton.disabled = position === 0;
  nextButton.disabled = position >= maxPosition;
}

function openModal(title, description, imageSrc, price) {
  const modal = document.getElementById('bookModal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDescription').textContent = description;
  document.getElementById('modalImage').src = imageSrc;
  document.getElementById('modalPrice').textContent = price;
  
  const modalInfo = modal.querySelector('.modal-info');
  modalInfo.innerHTML = ''; // Clear existing content
  
  const addToCartButton = document.createElement('button');
  addToCartButton.className = 'cta-button primary';
  addToCartButton.textContent = 'Add to Cart';
  addToCartButton.onclick = () => addToCart(title, price);
  
  const addToWishlistButton = document.createElement('button');
  addToWishlistButton.className = 'cta-button secondary';
  addToWishlistButton.textContent = 'Add to Wishlist';
  addToWishlistButton.onclick = () => addToWishlist(title, price);
  
  modalInfo.appendChild(addToCartButton);
  modalInfo.appendChild(addToWishlistButton);
  
  modal.style.display = 'block';
}

function closeModal() {
  document.getElementById('bookModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('bookModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

function searchBooks() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toUpperCase();
  const bookCards = document.querySelectorAll('.book-card');

  bookCards.forEach(card => {
    const title = card.querySelector('h3').textContent;
    if (title.toUpperCase().indexOf(filter) > -1) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function loadMoreBooks() {
  const bookCards = document.querySelector('.recommendations-cards');
  const newBooks = [
    {
      title: "The Hunger Games",
      author: "Suzanne Collins",
      price: "$16.99",
      image: "Images/Book 11.png",
      description: "A dystopian novel set in a post-apocalyptic world."
    },
    {
      title: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      price: "$15.99",
      image: "Images/Book 12.png",
      description: "A crime novel that combines murder mystery, family saga, and financial intrigue."
    },
    {
      title: "The Help",
      author: "Kathryn Stockett",
      price: "$14.99",
      image: "Images/Book 13.png",
      description: "A novel about African American maids working in white households in Jackson, Mississippi, during the 1960s."
    },
    {
      title: "The Kite Runner",
      author: "Khaled Hosseini",
      price: "$13.99",
      image: "Images/Book 14.png",
      description: "A novel about the friendship between two boys growing up in Kabul during the fall of Afghanistan's monarchy."
    },
    {
      title: "The Bhagavad Gita",
      author: "Eknath Easwaran",
      price: "$19.99",
      image: "Images/Book 15.jpeg",
      description: "A Hindu scripture on duty, righteousness, and spiritual wisdom."
    },
    {
      title: "Be As You Are",
      author: "Sri Ramana Maharshi",
      price: "$15.68",
      image: "Images/Book 16.jpeg",
      description: "The teachings of Ramana Maharshi on self-inquiry and self-realization."
    }
  ];

  newBooks.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.onclick = () => openModal(book.title, book.description, book.image, book.price);
    bookCard.innerHTML = `
      <img src="${book.image}" alt="${book.title}" />
      <div class="card-info">
        <h3>${book.title}</h3>
        <p class="author">${book.author}</p>
        <p class="price">${book.price}</p>
        <button class="add-to-cart" onclick="addToCart('${book.title}', '${book.price}')">Add to Cart</button>
      </div>
    `;
    bookCards.appendChild(bookCard);
  });

  // Update carousel buttons after adding new books
  updateRecommendationsCarouselButtons();

  // Hide the "Load More" button after loading all books
  document.querySelector('.load-more').style.display = 'none';
}

document.getElementById('reviewForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const reviewCard = document.createElement('div');
  reviewCard.className = 'review-card';
  reviewCard.innerHTML = `
    <img class="reviewer-image" src="Images/default-avatar.jpg" alt="${this.name.value}"/>
    <div class="reviewer-name">${this.name.value}</div>
    <div class="review-text">${this.review.value}</div>
    <div class="review-rating">${'★'.repeat(this.rating.value)}${'☆'.repeat(5 - this.rating.value)}</div>
  `;

  document.querySelector('.review-cards').appendChild(reviewCard);

  // Clear the form
  this.reset();

  // Show a thank you message
  alert('Thank you for your review!');
});

// Call loadMoreBooks when the page loads
document.addEventListener('DOMContentLoaded', loadMoreBooks);

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }, 10);
}

function addToCart(title, price) {
  cart.push({ title, price });
  updateCartCount();
  showNotification(`${title} has been added to your cart!`);
}

function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  cartCount.textContent = cart.length;
}

function openCartModal() {
  const modal = document.getElementById('cartModal');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  cartItems.innerHTML = '';
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <span class="cart-item-title">${item.title}</span>
      <span class="cart-item-price">${item.price}</span>
      <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItems.appendChild(itemElement);
    total += parseFloat(item.price.replace('$', ''));
  });
  
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  modal.style.display = 'block';
  
  // Add animation class
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

function closeCartModal() {
  document.getElementById('cartModal').style.display = 'none';
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  openCartModal();
}

function checkout() {
  alert('Thank you for your purchase!');
  cart = [];
  updateCartCount();
  closeCartModal();
}

// Back to Top button functionality
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("backToTop").style.display = "block";
  } else {
    document.getElementById("backToTop").style.display = "none";
  }
}

function scrollToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function addToWishlist(title, price) {
  if (!wishlist.some(item => item.title === title)) {
    wishlist.push({ title, price });
    showNotification(`${title} has been added to your wishlist!`);
  } else {
    showNotification(`${title} is already in your wishlist!`);
  }
}
