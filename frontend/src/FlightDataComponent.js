import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from 'react-bootstrap/Table';

const FlightDataComponent = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get("http://localhost:8080/flights");
        setFlights(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-center mb-4">Flight Data</h1>
      
      <Table striped bordered hover>
      <thead>
          <tr>
            <th>Flight ID</th>
            <th>Airline</th>
            <th>Status</th>
            <th>Departure Gate</th>
            <th>Arrival Gate</th>
            <th>Scheduled Departure</th>
            <th>Scheduled Arrival</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => (
            <tr key={flight.flight_id}>
              <td>{flight.flight_id}</td>
              <td>{flight.airline}</td>
              <td>{flight.status}</td>
              <td>{flight.departure_gate}</td>
              <td>{flight.arrival_gate}</td>
              <td>{new Date(flight.scheduled_departure).toLocaleString()}</td>
              <td>{new Date(flight.scheduled_arrival).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
    </Table>
    </div>
  );
};

export default FlightDataComponent;
