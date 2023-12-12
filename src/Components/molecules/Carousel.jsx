import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CarouselComponent = ({ images, dataType, uid }) => {
  if (!images || images.length === 0) {
    // Handle case when there are no images or API call fails
    return (
      <div className="carousel">
        <Carousel showThumbs={false}>
          <div className="no-image">No images available</div>
        </Carousel>
      </div>
    );
  }
  return (
    <div className="carousel">
      <Carousel showThumbs={false}>
        {images.map((image) => (
          <div key={image}>
            <img
              className="card_img"
              src={`${
                dataType === "charging_station"
                  ? `http://10.10.2.200/EVDotBangalorecroppedimages/${uid}/${image}`
                  : `http://images.deducetech.com/Bangalore/o/${image}.jpg`
              }`}
              alt=""
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.style.display = "none";
              }}
            />
            <div className="carousel">
              <Carousel showThumbs={false}>
                <div className="no-image">No images available</div>
              </Carousel>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;

//----------------------------------------------------------------------------
//=============Working Logic============================

// import React, { useState } from "react";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";

// const CarouselComponent = ({ images, dataType, uid }) => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const handleSlideChange = (index) => {
//     setCurrentSlide(index);
//   };

//   const getImageUrl = () => {
//     return dataType === "charging_station"
//       ? `http://10.10.2.200/EVDotBangalorecroppedimages/${uid}/${images}`
//       : `http://images.deducetech.com/Bangalore/o/${images}.jpg`;
//   };

//   return (
//     <div className="carousel">
//       <Carousel
//         showThumbs={false}
//         onChange={handleSlideChange}
//         selectedItem={currentSlide}
//       >
//         {images.map((image, index) => (
//           <div key={image}>
//             {index === currentSlide ? (
//               <img className="card_img" src={getImageUrl()} alt="" />
//             ) : null}
//           </div>
//         ))}
//       </Carousel>
//       {images.length === 0 && <div className="no-image">No Image</div>}
//     </div>
//   );
// };

// export default CarouselComponent;
