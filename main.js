var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};

const apiKey = '30b6f67d-4687-499d-8af7-2c5ecf090d30'; // Replace with your actual CoinGecko API Key

// Define an array of cryptocurrency names and corresponding DOM element suffixes.
const cryptocurrencies = [
  'bitcoin',
  'ethereum',
  'solana',
  'binancecoin',
  'ripple',
  'cardano',
  'link',
  'polkadot',
];

// Select and store the price and change elements for each cryptocurrency.
const priceElements = cryptocurrencies.map((crypto) =>
  document.querySelector(`.price${crypto}`)
);
const changeElements = cryptocurrencies.map((crypto) =>
  document.querySelector(`.change${crypto}`)
);

// Function to fetch cryptocurrency data and update the DOM.
const fetchAndRenderCryptocurrency = async (cryptoName, priceElement, changeElement) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoName}&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data[cryptoName]) {
        const price = data[cryptoName].usd.toFixed(2);
        const change = data[cryptoName].usd_24h_change.toFixed(2);
        // Update the DOM with the fetched data.
        priceElement.textContent = `Price: $${price}`;
        changeElement.textContent = `24hr Change: ${change > 0 ? '+' : ''}${change}%`;
        if (change >= 0) {
          changeElement.style.color = 'green';
        } else {
          changeElement.style.color = 'red';
        }
      } else {
        throw new Error(`Crypto data not found for ${cryptoName}`);
      }
    } else {
      throw new Error(`Network response was not ok for ${cryptoName}`);
    }
  } catch (error) {
    console.error(`Error fetching ${cryptoName} data:`, error);
  }
};

// Call fetchAndRenderCryptocurrency for each cryptocurrency element.
cryptocurrencies.forEach((crypto, index) => {
  fetchAndRenderCryptocurrency(crypto, priceElements[index], changeElements[index]);
});
