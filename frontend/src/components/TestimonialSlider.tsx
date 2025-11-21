import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const testimonials = [
    {
      id: 1,
      title: "Best Ad Campaign Maker",
      content:
        "Their skill in audience targeting and campaign optimization has significantly boosted lead generation and improved overall results.",
      gradientClass: "gradient-primary",
      borderClass: "border-primary-subtle",
      customer: "Epitome Builders",
      location: "London, UK",
    },
    {
      id: 2,
      title: "Good for Company Growth",
      content:
        "Their skill in audience targeting and campaign optimization has significantly boosted lead generation and improved overall results.",
      gradientClass: "gradient-secondary",
      borderClass: "border-secondary-subtle",
      customer: "Epitome Builders",
      location: "London, UK",
    },
    {
      id: 3,
      title: "Best Idea for Startups or Events",
      content:
        "Their skill in audience targeting and campaign optimization has significantly boosted lead generation and improved overall results.",
      gradientClass: "gradient-danger",
      borderClass: "border-danger-subtle",
      customer: "Epitome Builders",
      location: "London, UK",
    },
    {
      id: 4,
      title: "Good Ai for Making Ads",
      content:
        "Their skill in audience targeting and campaign optimization has significantly boosted lead generation and improved overall results.",
      gradientClass: "gradient-info",
      borderClass: "border-info-subtle",
      customer: "Epitome Builders",
      location: "London, UK",
    },
    {
      id: 5,
      title: "Good Ai for Making Ads",
      content:
        "Their skill in audience targeting and campaign optimization has significantly boosted lead generation and improved overall results.",
      gradientClass: "gradient-info",
      borderClass: "border-info-subtle",
      customer: "Epitome Builders",
      location: "London, UK",
    },
    // Add all other testimonials here following the same structure
  ];

  return (
    <div className="testimonial-slider">
      <Slider {...settings}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className={`card testimonial-card ${testimonial.borderClass}`}>
            <img
              src="https://ads.alendei.com/images/quote.svg"
              alt="Quote"
              className="mb-10"
              loading="lazy"  // Lazy loading for the quote image
            />
            <h4 className={`subtitle gradient-title ${testimonial.gradientClass} mb-30`}>
              {testimonial.title}
            </h4>
            <p className="mb-60">{testimonial.content}</p>
            <div className="star-rating mb-2">
              {[...Array(5)].map((_, index) => (
                <label key={index} title={`${index + 1} stars`}>
                  <i className="active bi bi-star" aria-hidden="true"></i>
                </label>
              ))}
            </div>
            <div className="testimonial-customer mb-1">{testimonial.customer}</div>
            <div className="customer-location text-light-emphasis">
              {testimonial.location}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialSlider;
