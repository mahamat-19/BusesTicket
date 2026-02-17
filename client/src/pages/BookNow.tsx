import React, { useEffect, useState } from "react";
import { Col, message, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import axiosInstance from "../helpers/axiosInstance";
import { useAlertStore, AlertState } from "../stores/useAlertStore";
import { Bus } from "../types";
import StripeCheckout, { Token } from "react-stripe-checkout";

interface Params {
  id: string;
}

const BookNow: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bus, setBus] = useState<Bus | null>(null);
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const setLoading = useAlertStore((s: AlertState) => s.setLoading);

  const getBus = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/buses/get-bus-by-id", { _id: id });
      setLoading(false);
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const bookNow = async (transactionId: string) => {
    if (!bus) return;
    try {
      setLoading(true);
      const response = await axiosInstance.post("/bookings/book-seat", {
        bus: bus._id,
        seats: selectedSeats,
        transactionId,
      });
      setLoading(false);
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const onToken = async (token: Token) => {
    if (!bus) return;
    try {
      setLoading(true);
      const response = await axiosInstance.post("/bookings/make-payment", {
        token,
        amount: selectedSeats.length * bus.fare * 100,
      });
      setLoading(false);
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBus();
  }, []);

  return (
    <div>
      {bus && (
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl primary-text">{bus.name}</h1>
            <h1 className="text-md">
              {bus.from} - {bus.to}
            </h1>
            <hr />

            <div className="flex flex-col gap-2">
              <p className="text-md">Journey Date : {bus.journeyDate}</p>
              <p className="text-md">Fare : $ {bus.fare} /-</p>
              <p className="text-md">Departure Time : {bus.departure}</p>
              <p className="text-md">Arrival Time : {bus.arrival}</p>
              <p className="text-md">Capacity : {bus.capacity}</p>
              <p className="text-md">
                Seats Left : {bus.capacity! - (bus.seatsBooked?.length || 0)}
              </p>
            </div>
            <hr />

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">
                Selected Seats : {selectedSeats.join(", ")}
              </h1>
              <h1 className="text-2xl mt-2">
                Fare : {bus.fare * selectedSeats.length} /-
              </h1>
              <hr />

              <StripeCheckout
                billingAddress
                token={onToken}
                amount={bus.fare * selectedSeats.length * 100}
                currency="INR"
                stripeKey={process.env.REACT_APP_STRIPE_KEY || ""}
              >
                <button
                  className={`primary-btn ${
                    selectedSeats.length === 0 ? "disabled-btn" : ""
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </button>
              </StripeCheckout>
            </div>
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              onSelect={(seat) => {
                setSelectedSeats((prev) => {
                  if (prev.includes(seat)) {
                    return prev.filter((s) => s !== seat);
                  }
                  return [...prev, seat];
                });
              }}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default BookNow;
