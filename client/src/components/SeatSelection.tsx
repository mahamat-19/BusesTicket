import React from "react";
import { Bus } from "../types";

interface Props {
  bus: Bus;
  selectedSeats: number[];
  onSelect: (seat: number) => void;
}

const SeatSelection: React.FC<Props> = ({ bus, selectedSeats, onSelect }) => {
  // derive total seats from capacity
  const total = bus.capacity;
  const booked = bus.seatsBooked || [];
  const seatsArray = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="seat-container">
      {seatsArray.map((seatNumber) => {
        const isSelected = selectedSeats.includes(seatNumber);
        const isBooked = booked.includes(seatNumber);
        return (
          <div
            key={seatNumber}
            className={`seat ${isSelected ? "selected" : ""} ${isBooked ? "booked" : ""}`}
            onClick={() => !isBooked && onSelect(seatNumber)}
          >
            {seatNumber}
          </div>
        );
      })}
    </div>
  );
};

export default SeatSelection;
