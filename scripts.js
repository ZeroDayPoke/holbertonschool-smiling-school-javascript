$(document).ready(function () {
  function Carousel(url, selector) {
    this.url = url;
    this.selector = selector;
    this.carouselData = [];
    this.currentItem = 0;
    this.itemsPerSlide = getItemsPerSlide();

    this.loadItems = function () {
      $.ajax({
        url: this.url,
        method: "GET",
        success: (data) => {
          this.carouselData = data;
          this.addInitialItemsToEnd();
          this.updateDisplay();
          this.startAutoSlide();
        },
        error: (error) => console.error("Error loading carousel items:", error),
      });
    };

    this.addInitialItemsToEnd = function () {
      for (let i = 0; i < this.itemsPerSlide; i++) {
        this.carouselData.push(this.carouselData[i]);
      }
    };

    this.createCarouselItem = function (item) {
      return `<div class="col-${12 / this.itemsPerSlide}">
                ${this.createCarouselCard(item)}
              </div>`;
    };

    this.createCarouselCard = function (item) {
      return `
        <div class="item">
          <div class="card">
            <img src="${item.thumb_url}" class="card-img-top" alt="${
        item.title
      }">
            <div class="card-body">
              <h5 class="card-title font-weight-bold">${item.title}</h5>
              <p class="card-text text-muted">${item["sub-title"]}</p>
              <div class="d-flex align-items-center mb-2">
                <img src="${item.author_pic_url}" alt="${
        item.author
      }" class="rounded-circle mr-2" style="width: 30px; height: 30px;">
                <small class="text-muted">${item.author}</small>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">${this.generateStars(item.star)}</span>
                <small class="text-muted">${item.duration}</small>
              </div>
            </div>
          </div>
        </div>
      `;
    };

    this.startAutoSlide = function () {
      setInterval(() => this.shiftSlide("next"), 3000);
    };

    this.generateStars = function (starCount) {
      return Array.from(
        { length: 5 },
        (_, i) =>
          `<span class="fa fa-star ${i < starCount ? "checked" : ""}"></span>`
      ).join("");
    };
  }

  function getItemsPerSlide() {
    if ($(window).width() < 576) {
      return 1; // phone
    } else if ($(window).width() < 768) {
      return 2; // tablet
    } else {
      return 4; // desktop
    }
  }

  loadQuotes("https://smileschool-api.hbtn.info/quotes");

  const tutorialCarousel = new Carousel(
    "https://smileschool-api.hbtn.info/popular-tutorials",
    "#tutorialCarousel"
  );
  const videoCarousel = new Carousel(
    "https://smileschool-api.hbtn.info/latest-videos",
    "#videoCarousel"
  );

  tutorialCarousel.loadItems();
  videoCarousel.loadItems();

  function loadQuotes(url) {
    const quotesSection = $("#carouselExampleControls .carousel-inner");
    const loader = $(".quotes-loader");
    loader.show();

    $.ajax({
      url: url,
      type: "GET",
      success: function (response) {
        quotesSection.empty();
        response.forEach((quote, index) => {
          const quoteItem = `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <div class="row mx-auto align-items-center">
                    <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                        <img src="${
                          quote.pic_url
                        }" class="d-block align-self-center" alt="Carousel Pic ${
            index + 1
          }" />
                    </div>
                    <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                        <div class="quote-text">
                            <p class="text-white">« ${quote.text} »</p>
                            <h4 class="text-white font-weight-bold">${
                              quote.name
                            }</h4>
                            <span class="text-white">${quote.title}</span>
                        </div>
                    </div>
                </div>
            </div>`;
          quotesSection.append(quoteItem);
        });
        $("#carouselExampleControls").carousel();
        loader.hide();
      },
      error: function (error) {
        console.error("Error loading quotes:", error);
        loader.hide();
      },
    });
  }

  $(window).on("resize", function () {
    const newItemsPerSlide = getItemsPerSlide();
    if (tutorialCarousel.itemsPerSlide !== newItemsPerSlide) {
      tutorialCarousel.itemsPerSlide = newItemsPerSlide;
      tutorialCarousel.updateDisplay();
    }
    if (videoCarousel.itemsPerSlide !== newItemsPerSlide) {
      videoCarousel.itemsPerSlide = newItemsPerSlide;
      videoCarousel.updateDisplay();
    }
  });

  $(document).on(
    "click",
    "#tutorialCarousel .carousel-control-prev",
    function () {
      tutorialCarousel.shiftSlide("prev");
    }
  );

  $(document).on(
    "click",
    "#tutorialCarousel .carousel-control-next",
    function () {
      tutorialCarousel.shiftSlide("next");
    }
  );

  $(document).on("click", "#videoCarousel .carousel-control-prev", function () {
    videoCarousel.shiftSlide("prev");
  });

  $(document).on("click", "#videoCarousel .carousel-control-next", function () {
    videoCarousel.shiftSlide("next");
  });

  Carousel.prototype.shiftSlide = function (direction) {
    const length = this.carouselData.length;
    if (direction === "next") {
      this.currentItem = (this.currentItem + 1) % length;
    } else if (direction === "prev") {
      this.currentItem = (this.currentItem - 1 + length) % length;
    }
    this.updateDisplay();
  };

  Carousel.prototype.updateDisplay = function () {
    let startIndex = this.currentItem;
    let endIndex = startIndex + this.itemsPerSlide;
    let itemsHtml = "";

    if (endIndex > this.carouselData.length) {
      let endItems = this.carouselData.slice(startIndex);
      let startItems = this.carouselData.slice(
        0,
        endIndex % this.carouselData.length
      );
      itemsHtml = [...endItems, ...startItems]
        .map((item) => this.createCarouselItem(item))
        .join("");
    } else {
      itemsHtml = this.carouselData
        .slice(startIndex, endIndex)
        .map((item) => this.createCarouselItem(item))
        .join("");
    }

    $(this.selector + " .carousel-inner").html(
      `<div class="carousel-item active"><div class="row">${itemsHtml}</div></div>`
    );
  };
});
