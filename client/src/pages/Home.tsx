
import React, { useState } from "react";
import { Col, Row } from "antd";
import BusCard from "../components/Bus"; // renamed to avoid name clash with type
import { useBuses } from "../api/hooks";
import type { Bus as BusType } from "../types";

type Filters = Pick<BusType, "from" | "to" | "journeyDate">;

const Home: React.FC = () => {
  const [filters, setFilters] = useState<Partial<Filters>>({});
  const { data: buses = [] } = useBuses({
    from: filters.from || undefined,
    to: filters.to || undefined,
    journeyDate: filters.journeyDate || undefined,
  });

  return (
    <div>
      <div className="my-3 py-1">
        <Row gutter={10} align="middle">
          <Col lg={6} sm={24}>
            <input
              type="text"
              placeholder="From"
              value={filters.from || ""}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            />
          </Col>
          <Col lg={6} sm={24}>
            <input
              type="text"
              placeholder="To"
              value={filters.to || ""}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            />
          </Col>
          <Col lg={6} sm={24}>
            <input
              type="date"
              placeholder="Date"
              value={filters.journeyDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, journeyDate: e.target.value })
              }
            />
          </Col>
          <Col lg={6} sm={24}>
            <div className="d-flex gap-2">
              {/* No need to call getBuses() directly; query will refetch on filters change */}
              <button
                className="outlined px-3"
                onClick={() =>
                  setFilters({
                    from: "",
                    to: "",
                    journeyDate: "",
                  })
                }
              >
                Clear
              </button>
            </div>
          </Col>
        </Row>
      </div>

      <div>
        <Row gutter={[15, 15]}>
          {buses
            .filter((bus: BusType) => bus.status === "Yet To Start")
            .map((bus: BusType) => (
              <Col key={bus._id} lg={12} xs={24} sm={24}>
                <BusCard bus={bus} />
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;
