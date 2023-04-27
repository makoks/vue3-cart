let app = Vue.createApp({
  data() {
    return {
      inventory: [],
      cart: {},
      showCart: false,
    }
  },
  methods: {
    addToCart(product) {
      if (product.quantity === 0) {
        return;
      }
      if (!this.cart[product.name]) {
        this.cart[product.name] = {
          name: product.name,
          price: product.price.USD,
          icon: product.icon,
          quantity: product.quantity,
        };
      } else {
        this.cart[product.name].quantity += product.quantity;
      }
      product.quantity = 0;
    },
    toggleShowCart() {
      this.showCart = !this.showCart;
    },
    removeProduct(name) {
      delete this.cart[name];
    },
  },
  async mounted() {
    const response = await fetch('./food.json');
    const food = await response.json();
    this.inventory = food.map(product => ({ ...product, quantity: 0 }));
  },
  computed: {
    cartItemsCount() {
      return Object.values(this.cart).reduce((sum, { quantity }) => sum + quantity, 0);
    },
  },
});

app.component('cart', {
  props: ['toggleShow', 'cart', 'removeProduct'],
  template: `
    <aside class="cart-container">
      <div class="cart">
        <h1 class="cart-title spread">
          <span>
            Cart
            <i class="icofont-cart-alt icofont-1x"></i>
          </span>
          <button class="cart-close" @click="toggleShow">&times;</button>
        </h1>

        <div class="cart-body">
          <table class="cart-table">
            <thead>
              <tr>
                <th><span class="sr-only">Product Image</span></th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product of cart">
                <td><i :class="['icofont-' + product.icon, 'icofont-3x']"></i></td>
                <td>{{ product.name }}</td>
                <td>\${{ product.price }}</td>
                <td class="center">{{ product.quantity }}</td>
                <td>\${{ (product.price * product.quantity).toFixed(2) }}</td>
                <td class="center">
                  <button class="btn btn-light cart-remove" @click="removeProduct(product.name)">
                    &times;
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p class="center" v-if="Object.keys(cart).length === 0"><em>No items in cart</em></p>
          <div class="spread">
            <span><strong>Total:</strong> $\{{ cartTotal }}</span>
            <button class="btn btn-light">Checkout</button>
          </div>
        </div>
      </div>
    </aside>
  `,
  computed: {
    cartTotal() {
      return Object.values(this.cart)
        .reduce((total, { price, quantity }) => total + quantity * price, 0)
        .toFixed(2);
    }
  },
});

app.mount('#app')
