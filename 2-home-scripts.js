$(document).ready(function () {
  // Task 1
  const quotesURL = "https://smileschool-api.hbtn.info/quotes";
  loadQuotes(quotesURL);

  function loadQuotes(url) {
    const quotesSection = $(".carousel-inner");
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
        console.log(error);
      },
    });
  }

  // Task 2
  let totalItems = 0;
  let itemsPerSlide = getItemsPerSlide();
  let currentItem = 0;
  const carouselSelector = "#tutorialCarousel";
  let carouselData = [];

  function loadCarouselItems() {
    toggleLoader(true);
    $.ajax({
      url: "https://smileschool-api.hbtn.info/popular-tutorials",
      method: "GET",
      success: handleDataLoad,
      error: handleError,
    });
  }

  function handleDataLoad(data) {
    totalItems = data.length;
    carouselData = data;
    addInitialItemsToEnd();
    updateCarouselDisplay();
    startAutoSlide();
    toggleLoader(false);
  }

  function handleError(error) {
    console.error("Error loading carousel items:", error);
    toggleLoader(false);
  }

  function createCarouselItem(tutorial) {
    return `<div class="col-${
      12 / itemsPerSlide
    }">${createTutorialCard(tutorial)}</div>`;
  }

  function createTutorialCard(tutorial) {
    return `
      <div class="item">
        <div class="card">
          <img src="${
            tutorial.thumb_url
          }" class="card-img-top" alt="${tutorial.title}">
          <div class="card-body">
            <h5 class="card-title font-weight-bold">${tutorial.title}</h5>
            <p class="card-text text-muted">${tutorial["sub-title"]}</p>
            <div class="d-flex align-items-center mb-2">
              <img src="${
                tutorial.author_pic_url
              }" alt="${tutorial.author}" class="rounded-circle mr-2" style="width: 30px; height: 30px;">
              <small class="text-muted">${tutorial.author}</small>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">${generateStars(tutorial.star)}</span>
              <small class="text-muted">${tutorial.duration}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateStars(starCount) {
    return Array.from(
      { length: 5 },
      (_, i) =>
        `<span class="fa fa-star ${i < starCount ? "checked" : ""}"></span>`
    ).join("");
  }

  function startAutoSlide() {
    setInterval(() => shiftSlide("next"), 3000);
  }

  function shiftSlide(direction) {
    if (direction === "next") {
      currentItem = (currentItem + 1) % totalItems;
    } else if (direction === "prev") {
      currentItem = (currentItem - 1 + totalItems) % totalItems;
    }
    updateCarouselDisplay();
  }

  function addInitialItemsToEnd() {
    for (let i = 0; i < itemsPerSlide; i++) {
      carouselData.push(carouselData[i]);
    }
  }

  function updateCarouselDisplay() {
    const itemsHtml = carouselData
      .slice(currentItem, currentItem + itemsPerSlide)
      .map((tutorial) => createCarouselItem(tutorial))
      .join("");
    $("#carousel-items").html(
      `<div class="carousel-item active"><div class="row">${itemsHtml}</div></div>`
    );
  }

  function toggleLoader(show) {
    $("#loader").toggle(show);
  }

  function getItemsPerSlide() {
    if ($(window).width() < 576) {
      return 1; // phones
    } else if ($(window).width() < 768) {
      return 2; // tablets
    } else {
      return 4; // desktops
    }
  }

  $(window).on("resize", function () {
    itemsPerSlide = getItemsPerSlide();
    updateCarouselDisplay();
  });

  $(carouselSelector).on("click", ".carousel-control-prev", () =>
    shiftSlide("prev")
  );
  $(carouselSelector).on("click", ".carousel-control-next", () =>
    shiftSlide("next")
  );

  loadCarouselItems();
});
