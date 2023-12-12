import "../SideBar/sidebar.css";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
// import city from "../../images/city.png";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faGlobe,
  faGlobeAsia,
  faClock,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

function Side() {
  const location = {
    lat: 12.89604989698049,
    lan: 77.63342492960223,
  };
  const address =
    "136/1, 17th Main Rd, BTM 2nd Stage, Kuvempu Nagar, BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka 560029";
  const phone = "+91234567890";
  const email = "information@gmail.com";
  const website = "info.sample.com";
  const title = "Electric Vehicle Charging Station";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="container">
      <div className="left-container">
        <div className="card">
          <div className="card-body">
            {/* <img
              src={city}
              alt="Card"
              style={{
                height: "190px",
                width: "109%",
                marginTop: "-17px",
                marginLeft: "-16px",
              }}
            /> */}
            <p className="title">{title}</p>
            <hr
              style={{
                width: "108%",
                marginTop: "0px",
                marginBottom: 0,
                borderStyle: "inset",
                borderColor: "#424B5A",
                marginLeft: "-14px",
              }}
            />
            <Row>
              <Col sm={1}>
                {" "}
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="location-icon"
                />{" "}
              </Col>
              <Col>
                {" "}
                <p className="description"> {address}</p>
              </Col>
            </Row>

            <Row>
              <Col sm={1}>
                {" "}
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="location-icon"
                />{" "}
              </Col>
              <Col>
                {" "}
                <p className="description">
                  {" "}
                  {location.lan} & {location.lan}
                </p>
              </Col>
            </Row>
            <Row>
              <Col sm={1}>
                <FontAwesomeIcon icon={faClock} className="location-icon" />
              </Col>
              <Col>
                <div className="description">
                  <p style={{ color: "green" }}>
                    Open 24 hours{" "}
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      onClick={toggleDropdown}
                      className="dropdown-icon"
                    />{" "}
                  </p>
                  {isDropdownOpen && (
                    <div>
                      <p>Monday - Open 24 hours</p>
                      <p>Tuesday - Open 24 hours </p>
                      <p>Wednesday - Open 24 hours </p>
                      <p>Thursday - Open 24 hours </p>
                      <p>Friday - Open 24 hours </p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={1}>
                {" "}
                <FontAwesomeIcon
                  icon={faPhone}
                  className="location-icon"
                />{" "}
              </Col>
              <Col>
                {" "}
                <p className="description"> {phone}</p>
              </Col>
            </Row>

            <Row>
              <Col sm={1}>
                {" "}
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="location-icon"
                />{" "}
              </Col>
              <Col>
                {" "}
                <p className="description"> {email}</p>
              </Col>
            </Row>

            <Row>
              <Col sm={1}>
                {" "}
                <FontAwesomeIcon
                  icon={faGlobeAsia}
                  className="location-icon"
                />{" "}
              </Col>
              <Col>
                {" "}
                <p className="description"> {website}</p>
              </Col>
            </Row>
            <hr
              style={{
                width: "108%",
                marginTop: "0px",
                marginBottom: 0,
                borderStyle: "inset",
                borderColor: "#424B5A",
                marginLeft: "-14px",
              }}
            />
            <table className="table">
              <thead>
                <tr>
                  <th>Charge Type</th>
                  <th>Connection Type</th>
                  <th>Price</th>
                  <th>No of Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>DELTA-BEVC-DC001</td>
                  <td>GB/T(DC)</td>
                  <td>NULL</td>
                  <td>1</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>NULL</td>
                  <td>NULL</td>
                  <td>NULL</td>
                  <td>NULL</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>NULL</td>
                  <td>NULL</td>
                  <td>NULL</td>
                  <td>NULL</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>NULL</td>
                  <td>NULL</td>
                  <td>NULL</td>
                  <td>NULL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Side;
