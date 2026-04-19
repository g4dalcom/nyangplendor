import React from "react";
import cardBack from "@/assets/images/card-back.png";

interface CardStackProps {
  numberOfLayers: number;
}

export const DevelopmentCardStack: React.FC<CardStackProps> = ({ numberOfLayers }) => {
  //
  if (numberOfLayers < 1) {
    return (
      <div key={`empty`} className="board-card-size bg-primay border border-dashed border-ui-border shrink-0" style={{ borderRadius: 'var(--radius-sm)' }}></div>
    )
  }

  if (numberOfLayers === 1) {
    return (
      <div className="absolute w-full h-full overflow-hidden shadow-lg" style={{ borderRadius: 'var(--radius-sm)' }}>
        <img
          src={cardBack}
          alt="card back"
          className="w-full h-full object-cover border border-ui-border"
          style={{ borderRadius: 'var(--radius-sm)' }}
        />
      </div>
    );
  }

  const lastLayerIndex = numberOfLayers - 1;

  return (
    <>
      {[...Array(lastLayerIndex)].map((_, i) => (
        <div
          key={`bg-card-${i}`}
          className="absolute w-full h-full overflow-hidden shadow-md"
          style={{
            top: `${i * -3}px`,
            left: `${i * -3}px`,
            transform: `rotate(${(i - 1) * 1.2}deg)`,
            zIndex: i,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <img
            src={cardBack}
            alt="card back"
            className="w-full h-full object-cover border border-ui-border"
            style={{ borderRadius: 'var(--radius-sm)' }}
          />
        </div>
      ))}

      <div
        className="absolute w-full h-full overflow-hidden shadow-lg"
        style={{
          top: `${lastLayerIndex * -3}px`,
          left: `${lastLayerIndex * -3}px`,
          transform: `rotate(${(lastLayerIndex - 1) * 1.2}deg)`,
          zIndex: lastLayerIndex,
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <img
          src={cardBack}
          alt="card back"
          className="w-full h-full object-cover border border-ui-border"
          style={{ borderRadius: 'var(--radius-sm)' }}
        />
      </div>
    </>
  );
};
