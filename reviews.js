const reviews = [
  {
    name: "Isha Pawar",
    reviewerMeta: "4 reviews · 14 photos",
    rating: 5,
    date: "3 months ago",
    source: "Google",
    text: "Everything was best…… must visit, must enjoy with this beautiful nature, Tasty food and best services….Thankyou Suchit uncle 🥳"
  },
  {
    name: "Akshay Solanki",
    reviewerMeta: "4 reviews",
    rating: 5,
    date: "5 months ago",
    source: "Google",
    text: "Beautiful place for enjoying with friends and family groups. great food and good service."
  },
  {
    name: "Siddharth Singh",
    reviewerMeta: "5 reviews · 1 photo",
    rating: 5,
    date: "6 months ago",
    source: "Google",
    text: "It was nice to be a place beautifully located with great service. We appreciate the effort shown by the staff and the owner itself. It was a pleasure and a wonderful experience with S K Agro overall. Thanks a lot."
  },
  {
    name: "Bhavyaa Unalkat",
    reviewerMeta: "Local Guide · 67 reviews · 25 photos",
    rating: 1,
    date: "a year ago",
    source: "Google",
    text: "This definitely looks attractive. It is low price but I thought things could have been better. Do not go here if you are looking for a nice time. It is in a village so the electricity keeps cutting and the generator is not enough to run all the time. Personally, did not have a good experience with my family of 10 people. Please carry a bug spray if you go and do not expect hygienic conditions."
  },
  {
    name: "sachin tumbada",
    reviewerMeta: "Local Guide · 32 reviews · 1,387 photos",
    rating: 5,
    date: "7 months ago",
    source: "Google",
    text: "Good place for family gathering and for birthday celebration.... Food can be better."
  },
  {
    name: "AJAY GOSAVI",
    reviewerMeta: "2 reviews",
    rating: 5,
    date: "7 months ago",
    source: "Google",
    text: "Good food quality and service best. I love S K."
  },
  {
    name: "CHINMAY",
    reviewerMeta: "2 reviews",
    rating: 5,
    date: "a year ago",
    source: "Google",
    text: "Best place to visit with family and friends. Staff is friendly. Rooms are neat and clean with good facilities. You get to do lots of activities. Food is delicious. Overall value for money."
  },
  {
    name: "Chirag Desai",
    reviewerMeta: "5 reviews",
    rating: 5,
    date: "2 years ago",
    source: "Google",
    text: "We had a wonderful time at the resort. The staff was very polite and helpful. All amenities were in working condition. Boating and kayaking was fun. Food was excellent. The only issue we faced was a power outage, but they are working on bringing a transformer, so it should be addressed soon."
  },
  {
    name: "Mahesh Suryawanshi",
    reviewerMeta: "2 reviews",
    rating: 5,
    date: "a month ago",
    source: "Google",
    text: "Nice location, hygienic food quality."
  },
  {
    name: "Cloud Keyur",
    reviewerMeta: "5 reviews · 1 photo",
    rating: 5,
    date: "a year ago",
    source: "Google",
    text: "Stayed at S.K. Agro Tourism and had an amazing experience. The food was delicious with great variety, and the hospitality was exceptional. Staff were warm and attentive. Beautiful surroundings and well-maintained facilities made it the perfect getaway. Highly recommend!"
  },
  {
    name: "Madhu Gupta",
    reviewerMeta: "",
    rating: 5,
    date: "23 hours ago",
    source: "Google",
    text: "Best but one it was means adventures and having a beautiful garden with swimming pools and flowers in a farm having a big property of the owner. Thank you."
  },
  {
    name: "siddhesh kasare",
    reviewerMeta: "3 reviews · 1 photo",
    rating: 5,
    date: "2 weeks ago",
    source: "Google",
    text: "Had a wonderful stay at this resort! The food was absolutely delicious, and the service was excellent. The staff behaviour was also very good—they were polite, friendly, and helpful throughout our stay. The natural surroundings, greenery, trees, and beautiful gardens were perfectly maintained and created a very relaxing atmosphere. The rooms were spacious and comfortable, making the resort a great choice for large groups and families. There are also plenty of activities to enjoy. The only slight disappointment was the swimming pool. Considering the resort has such a large area of land, I felt the swimming pool could have been bigger. Apart from that, everything was really good and well managed. Overall, it was a great experience, and I would definitely recommend this resort for a family or group getaway!"
  },
  {
    name: "Kalpana yadav",
    reviewerMeta: "Local Guide · 48 reviews · 456 photos",
    rating: 5,
    date: "2 weeks ago",
    source: "Google",
    text: "Nice hotel. Service is perfect, staff are the best, food is better and perfectly tasty."
  },
  {
    name: "Nitin Tambe",
    reviewerMeta: "2 reviews",
    rating: 5,
    date: "2 weeks ago",
    source: "Google",
    text: "Nice location. Very peaceful with tasty food."
  },
  {
    name: "Bhagyashri Rane",
    reviewerMeta: "1 review · 1 photo",
    rating: 3,
    date: "a month ago",
    source: "Google",
    text: "All staff and food are good."
  },
  {
    name: "valmik bilsore",
    reviewerMeta: "6 reviews · 8 photos",
    rating: 3,
    date: "11 months ago",
    source: "Google",
    text: "Good but not great."
  },
  {
    name: "Mukesh Nair",
    reviewerMeta: "Local Guide · 43 reviews · 46 photos",
    rating: 4,
    date: "a year ago",
    source: "Google",
    text: "Nice place for family and friends to enjoy your weekend. Staff are very supportive and helpful. Good food. They have adventure activities which are included in your package."
  },
  {
    name: "Madhav Gokhale",
    reviewerMeta: "Local Guide · 72 reviews · 810 photos",
    rating: 4,
    date: "a year ago",
    source: "Google",
    text: "Good food. Good people and service too. Resort has tents and rooms too. Clean. Not 5-star but good."
  },
  {
    name: "Shahid Ansari",
    reviewerMeta: "Local Guide · 53 reviews · 1 photo",
    rating: 4,
    date: "2 years ago",
    source: "Google",
    text: "The place and the stay is good but there is power outage most of the time and the price is a bit high according to me compared with other properties in the area. No activities as well, just a pool."
  },
  {
    name: "Mukesh Patil",
    reviewerMeta: "Local Guide · 34 reviews · 16 photos",
    rating: 4,
    date: "3 years ago",
    source: "Google",
    text: "Decent food quality. Good atmosphere. Nice place in an area like Vikramgad."
  },
  {
    name: "Niladri Das",
    reviewerMeta: "Local Guide · 53 reviews · 246 photos",
    rating: 1,
    date: "9 months ago",
    source: "Google",
    text: "I am highly disappointed with this resort, especially because of the extremely poor and low-quality food they serve. The taste, freshness, and presentation were far below basic standards, and it clearly seems that the management has no quality control."
  },
  {
    name: "Nachiket Save",
    reviewerMeta: "Local Guide · 114 reviews · 2,764 photos",
    rating: 2,
    date: "7 months ago",
    source: "Google",
    text: "If you're booking for tent accommodation, tents are not properly maintained and are in very poor condition. Food is average. Overall resort is not properly maintained."
  },
  {
    name: "Aditya",
    reviewerMeta: "Local Guide · 205 reviews",
    rating: 5,
    date: "6 months ago",
    source: "Google",
    text: "Good food quality and service best."
  },
  {
    name: "Krupali Bhoir",
    reviewerMeta: "14 reviews",
    rating: 5,
    date: "2 years ago",
    source: "Google",
    text: "Beautiful property close to nature. Pleasant service from all staff members. We had taken a school picnic for primary students. Healthy meals were provided for affordable rates and many activities were offered. Overall good experience."
  },
  {
    name: "Reema Sawant",
    reviewerMeta: "4 reviews · 3 photos",
    rating: 5,
    date: "a year ago",
    source: "Google",
    text: "We had a wonderful stay at the resort. The service was good and food was just amazing. A great place to rest and have fun! Hope to visit again soon!"
  },
  {
    name: "Prashant Patil",
    reviewerMeta: "3 reviews",
    rating: 5,
    date: "a year ago",
    source: "Google",
    text: "Awesome service by SK agro farms. Had family get together of 25 pax. Food quality is excellent and homely. Service provided was fantastic. Owner is very friendly and accommodating."
  },
  {
    name: "praful patil",
    reviewerMeta: "Local Guide · 21 reviews · 12 photos",
    rating: 5,
    date: "a year ago",
    source: "Google",
    text: "Wonderful time to spend with family and friends in nature with good food, good pool and great service. Make children understand different fruit trees and vegetables is an added advantage with such resorts."
  }
];

const formatStars = (rating) => {
  const full = "★".repeat(rating);
  const empty = "☆".repeat(Math.max(0, 5 - rating));
  return `${full}${empty}`;
};

const getInitials = (name = "") => name
  .split(" ")
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part.charAt(0).toUpperCase())
  .join("")
  .slice(0, 2) || "SK";

const escapeHtml = (value = "") => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#039;");

const renderReviews = () => {
  const container = document.querySelector("[data-reviews-container]");
  if (!container || !Array.isArray(reviews) || !reviews.length) return;

  container.innerHTML = reviews.map((review) => `
    <article class="review-card">
      <div class="review-avatar" aria-hidden="true">${escapeHtml(getInitials(review.name))}</div>
      <div class="review-content">
        <div class="review-header">
          <div class="review-person">
            <h3>${escapeHtml(review.name)}</h3>
            <p>${escapeHtml(review.reviewerMeta || "")}</p>
          </div>
        </div>
        <div class="review-rating-row">
          <span class="review-stars" aria-label="${review.rating} out of 5 stars">${escapeHtml(formatStars(review.rating))}</span>
          <span class="review-meta-text">
            <span>${escapeHtml(review.date || "")}</span>
            <span class="review-separator">·</span>
            <span>${escapeHtml(review.source || "Google")}</span>
          </span>
        </div>
        <p class="review-text">“${escapeHtml(review.text)}”</p>
      </div>
    </article>
  `).join("");
};

const updateReviewProgress = () => {
  const rail = document.querySelector("[data-reviews-container]");
  const bar = document.querySelector(".reviews-progress span");
  if (!rail || !bar) return;

  const maxScroll = rail.scrollWidth - rail.clientWidth;
  const ratio = maxScroll > 0 ? rail.scrollLeft / maxScroll : 0;
  bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
};

const scrollReviews = (direction) => {
  const rail = document.querySelector("[data-reviews-container]");
  if (!rail) return;

  const firstCard = rail.querySelector(".review-card");
  if (!firstCard) return;

  const cardWidth = firstCard.getBoundingClientRect().width + (parseFloat(getComputedStyle(rail).gap) || 0);
  rail.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
};

const initReviewsCarousel = () => {
  const rail = document.querySelector("[data-reviews-container]");
  const prevButton = document.querySelector(".reviews-prev");
  const nextButton = document.querySelector(".reviews-next");
  if (!rail) return;

  rail.addEventListener("scroll", updateReviewProgress, { passive: true });

  prevButton?.addEventListener("click", () => scrollReviews(-1));
  nextButton?.addEventListener("click", () => scrollReviews(1));

  rail.tabIndex = 0;
  rail.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollReviews(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollReviews(-1);
    }
  });

  let dragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  rail.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startScrollLeft = rail.scrollLeft;
    rail.setPointerCapture?.(event.pointerId);
  });

  rail.addEventListener("mousemove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - startX;
    rail.scrollLeft = startScrollLeft - delta;
  });

  const stopDragging = () => {
    dragging = false;
  };

  rail.addEventListener("mouseup", stopDragging);
  rail.addEventListener("mouseleave", stopDragging);
  rail.addEventListener("pointerup", stopDragging);
  rail.addEventListener("pointercancel", stopDragging);

  updateReviewProgress();
};

const initializeReviews = () => {
  renderReviews();
  initReviewsCarousel();
};

document.addEventListener("DOMContentLoaded", initializeReviews);
window.renderReviews = renderReviews;
