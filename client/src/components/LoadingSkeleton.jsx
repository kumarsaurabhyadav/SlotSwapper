import React from "react";

export const EventCardSkeleton = () => {
  return (
    <div className="col-md-6 mb-4 fade-in">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="skeleton" style={{ width: "60%", height: "24px" }}></div>
            <div className="skeleton" style={{ width: "80px", height: "24px" }}></div>
          </div>
          <div className="skeleton mb-2" style={{ width: "100%", height: "16px" }}></div>
          <div className="skeleton mb-3" style={{ width: "70%", height: "16px" }}></div>
          <div className="d-flex gap-2">
            <div className="skeleton" style={{ width: "100px", height: "32px" }}></div>
            <div className="skeleton" style={{ width: "70px", height: "32px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SlotCardSkeleton = () => {
  return (
    <div className="col-md-6 col-lg-4 mb-4 fade-in">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body d-flex flex-column">
          <div className="skeleton mb-2" style={{ width: "80%", height: "24px" }}></div>
          <div className="skeleton mb-2" style={{ width: "100%", height: "16px" }}></div>
          <div className="skeleton mb-3" style={{ width: "60%", height: "16px" }}></div>
          <div className="skeleton mt-auto" style={{ width: "100%", height: "32px" }}></div>
        </div>
      </div>
    </div>
  );
};

export const RequestCardSkeleton = () => {
  return (
    <div className="card mb-3 shadow-sm border-0 fade-in">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="skeleton" style={{ width: "60%", height: "20px" }}></div>
          <div className="skeleton" style={{ width: "80px", height: "20px" }}></div>
        </div>
        <div className="skeleton mb-2" style={{ width: "100%", height: "60px" }}></div>
        <div className="skeleton mb-3" style={{ width: "100%", height: "60px" }}></div>
        <div className="d-flex gap-2">
          <div className="skeleton" style={{ width: "80px", height: "32px" }}></div>
          <div className="skeleton" style={{ width: "80px", height: "32px" }}></div>
        </div>
      </div>
    </div>
  );
};

