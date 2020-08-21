import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'reactstrap';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type ThumbnailCarouselProps = {
  pictureUrls: string[];
};

const ThumbnailCarousel = ({ pictureUrls }: ThumbnailCarouselProps) => {
  const [index, setIndex] = useState<number>(0);

  const handleDirectionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const direction = (e.target as HTMLButtonElement).value;
    if (direction === 'left' && index - 1 >= 0) {
      setIndex(index - 1);
    }
    if (direction === 'right' && index + 1 < pictureUrls.length) {
      setIndex(index + 1);
    }
  };

  const handleNavItemClick = () =>{

  }
  
  return (
    <>
      <img
        className="project-entry-screenshot"
        src={pictureUrls[index]}
        alt="Screenshot of app"
      />
      <Row className="thumbnail-carousel-nav">
        <Button
          value="left"
          disabled={index === 0}
          onClick={handleDirectionClick}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ pointerEvents: 'none' }}
          />
        </Button>
        {pictureUrls.map((pictureUrl) => (
          <img
            className="thumbnail-carousel-nav-item"
            alt="thumbnail for selection"
            src={pictureUrl}
          />
        ))}
        <Button
          value="right"
          disabled={index === pictureUrls.length - 1}
          onClick={handleDirectionClick}
        >
          <FontAwesomeIcon
            icon={faArrowRight}
            style={{ pointerEvents: 'none' }}
          />
        </Button>
      </Row>
    </>
  );
};

export default ThumbnailCarousel;
