import React from "react";
import Image from "next/image";

function Box({ id, src, href, title, index }) {
  const placeholderImg =
    "/globe.svg";

  // Navigate to the movie link
  const uref = (link) => {
    window.location.href = link;
  };

  return (
    <div onClick={() => uref(href)} key={index}>
      <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit w-fit">
        <Image
          priority
          height={150}
          width={200}
          src={src && src !== "N/A" && src !== "undefined" ? src : placeholderImg}
          alt={title}
          className="object-cover w-full h-auto"
        />
      </div>
      <span className="block text-center">{title}</span>
    </div>
  );
}

export default Box;
