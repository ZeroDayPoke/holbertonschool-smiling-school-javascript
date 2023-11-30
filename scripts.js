$(document).ready(function () {
  const quotesURL = "https://smileschool-api.hbtn.info/quotes";
  const quotesSection = $(".carousel-inner");
  const loader = $(".quotes-loader");
  loader.show();
  $.ajax({
    url: quotesURL,
    type: "GET",
    success: function (response) {
      quotesSection.empty();
      response.forEach((quote, index) => {
        // here we can check the index to add the active class to the first item
        const quoteItem = `
                  <div class="carousel-item ${index === 0 ? "active" : ""}">
                      <div class="row mx-auto align-items-center">
                          <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                              <img
                                  src="${quote.pic_url}"
                                  class="d-block align-self-center"
                                  alt="Carousel Pic ${index + 1}"
                              />
                          </div>
                          <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                              <div class="quote-text">
                                  <p class="text-white">« ${quote.text} »</p>
                                  <h4 class="text-white font-weight-bold">${
                                    quote.name
                                  }</h4>
                                  <span class="text-white">${quote.title}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              `;
        quotesSection.append(quoteItem);
      });
      // carrying over the naming convention from the given example
      $("#carouselExampleControls").carousel();
    },
    error: function (error) {
      console.log(error);
    },
  });
});
