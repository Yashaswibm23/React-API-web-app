import React, { useCallback, useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import "./global.scss";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faTimes } from "@fortawesome/free-solid-svg-icons";
import Carousel from "./molecules/Carousel";
import Search from "./Search";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import VectorSource from "ol/source/Vector";

const ViewComp = () => {
  const [coords, setCoords] = useState([
    // process.env.REACT_APP_VIEW_LON,
    // process.env.REACT_APP_VIEW_LAT,
  ]);

  const [polyCoord, setPolyCoord] = useState([]);
  const [query, setQuery] = useState("");
  const [dataType, setDataType] = useState("");
  const [cardData, setCardData] = useState("");
  const [cardTableData, setCardTableData] = useState("");
  const [cardBodyDisp, setCardBodyDisp] = useState(false);
  const [dispMarker, setDispMarker] = useState(false);
  const [zoom, setZoom] = useState(11);
  const [imgArr, setImgArr] = useState([]);
  const [polyData, setPolyData] = useState([]);
  const [UID, setUID] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [clicked, setClicked] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const getMapData = useCallback(async () => {
    // console.log("coords received",coords);
    try {
      if (coords.length) {
        const response = await axios.get(
          // `http://10.10.2.200:8080//reverse?format=jsonv2&lat=${coords[1]}&lon=${coords[0]}&addressdetails=1`
          `http://10.10.5.129:6001/reverse/${coords[1]}/${coords[0]}`
        );

        if (
          response.data.apple &&
          response.data.orange &&
          response.data.mango
        ) {
          // Decrypt the data using the encryption key and IV
          const encryptedData = response.data.apple;
          const encryptionKey = response.data.mango;

          // Use the IV to create the decryption object
          const decipher = CryptoJS.AES.decrypt(
            {
              ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
            },
            CryptoJS.enc.Hex.parse(encryptionKey),
            {
              iv: CryptoJS.enc.Hex.parse(response.data.orange),
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7,
            }
          );

          // Convert the decrypted data to a string
          const decryptedData = decipher.toString(CryptoJS.enc.Utf8);

          // Handle the decrypted data as needed
          const data = JSON.parse(decryptedData);
          // console.log(data);

          setCardData(data);
          clicked && getDestPics(data);

          // Update state or perform other actions with the decrypted data
        } else {
          // Handle non-encrypted data response here
          console.log("Non-encrypted data:", response.data);
        }

        // console.log("dataaaaaaaaa",data.data);
      } else if (displayName && !coords.length) {
        // console.log("displayName", displayName);
        setCardData(displayName);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 429) {
        toast.error(error.response.data); // Display the error message from the response
      } else {
        toast.error(error.code);
      }
    }
  }, [coords, displayName, clicked]);

  const getDestPics = async (data) => {
    try {
      if (data && data.type === "charging_station" && data.display_name) {
        setDataType(data.type);
        const parts = data.display_name.split(",");
        const name = parts[0];
        const chargingStationData = await axios.get(
          `http://10.10.2.200:8000/ev/?name=${encodeURIComponent(name)}`
        );
        if (chargingStationData.data.length > 0) {
          setCardTableData(chargingStationData.data[0].properties);
          setImgArr(chargingStationData.data[0].image_names || []);
          setUID(chargingStationData.data[0].properties.UID);
        } else {
          setImgArr([]);
        }
      } else if (data && data.type) {
        setDataType(data.type);
        const parts = data.display_name.split(",");
        const name = parts[0];
        const postcode = parseInt(parts[parts.length - 2]);
        const chargingStationData = await axios.get(
          `http://10.10.2.200:8000/?name=${encodeURIComponent(
            name
          )}&addr_postc=${encodeURIComponent(postcode)}`
        );
        if (
          chargingStationData.data.length > 0 &&
          chargingStationData.data[0].properties
        ) {
          setImgArr([chargingStationData.data[0].properties.POI_ID]);
        } else {
          setImgArr([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const clearInput = () => {
  //   // setPolyCoord([]);
  //   setQuery("");
  //   setDataType("");
  //   setCardData("");
  //   setCardTableData("");
  //   setCardBodyDisp(false);
  //   setImgArr([]);
  //   updatePolyData([]);
  //   getMapData("");
  //   setDispMarker(false);
  //   // setPolyData([]);
  //   // setCoords([]);
  //   // setDisplayName("");
  // };

  const updatePolyData = (data) => {
    setPolyData(data);
  };

  useEffect(() => {
    getMapData();
  }, [coords, getMapData]);

  return (
    <>
      <div>
        <MapComponent
          coords={coords}
          setCoords={setCoords}
          setCardBodyDisp={setCardBodyDisp}
          setDispMarker={setDispMarker}
          dispMarker={dispMarker}
          zoom={zoom}
          setZoom={setZoom}
          query={query}
          setQuery={setQuery}
          polyData={polyData}
          polyCoord={polyCoord}
          setClicked={setClicked}
          updatePolyData={updatePolyData}
        />
      </div>

      <div className="container">
        <Search
          coords={coords}
          setCoords={setCoords}
          setCardData={setCardData}
          cardData={cardData}
          query={query}
          setQuery={setQuery}
          setCardBodyDisp={setCardBodyDisp}
          setDispMarker={setDispMarker}
          setZoom={setZoom}
          getDestPics={getDestPics}
          setPolyData={updatePolyData}
          setDisplayName={setDisplayName}
          setPolyCoord={setPolyCoord}
        />

        {cardBodyDisp && (
          <>

             <div
              className="col-xl-12 card_body"
              style={{ marginTop: isMobile ? "10px" : "-20px" }}
            >
            <div className="col-xl-12 slide">
              {imgArr.length > 0 ? (
                <Carousel images={imgArr} dataType={dataType} uid={UID} />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>

              <p
                style={{
                  fontSize: isMobile ? "20px" : "23px",
                  paddingTop: "20px",
                  paddingLeft: "10px",
                  margin: "0px",
                  fontFamily: "serif",
                  wordSpacing: "3px",
                  fontWeight: "500px",
                  marginTop: isMobile ? "30px" : "40px",
                }}
              >
                {cardData
                  ? cardData.name
                    ? cardData.name
                    : cardData.titleName
                  : ""}
              </p>

              <div
                className="row"
                style={{
                  display: "flex",
                  fontFamily: "serif",
                  wordSpacing: "3px",
                  lineHeight:'30px',
                  flexDirection: isMobile ? "column" : "row",
                  marginTop: isMobile ? "15px" : "25px",
                }}
              >
                <div
                  style={{
                    width: isMobile ? "100%" : "5%",
                    height: isMobile ? "auto" : "60px",
                    paddingLeft: "10px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    color="#2e73e2"
                    fontSize={isMobile ? "16px" : "20px"}
                    style={{
                      marginRight: isMobile ? "0" : "10px",
                      marginBottom: isMobile ? "0" : "33px",
                    }}
                  />
                </div>
                <div
                  className="title"
                  style={{
                    width: isMobile ? "100%" : "95%",
                    height: "10px",
                    wordSpacing: "2px",
                    fontFamily: "serif",
                  }}
                >
                  {cardData
                    ? cardData.display_name
                      ? cardData.display_name
                      : cardData.dp
                    : ""}
                </div>
              </div>

              <div
                className="latLon"
                style={{
                  marginLeft: isMobile ? "0" : "30px",
                  fontWeight: 500,
                  marginTop:'30px',
                  fontFamily: "serif",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                <p>
                  Latitude: &nbsp;
                  {cardData
                    ? cardData.lat
                      ? cardData.lat
                      : cardData.latitude
                    : ""}
                </p>
                <p>
                  Longitude: &nbsp;
                  {cardData
                    ? cardData.lon
                      ? cardData.lon
                      : cardData.longitude
                    : ""}
                </p>
              </div>

              {dataType === "charging_station" && (
                <div
                  style={{
                    marginLeft: isMobile ? "0" : "30px",
                    fontWeight: 500,
                    fontFamily: "serif",
                    fontSize: isMobile ? "14px" : "16px",
                  }}
                  className="charging"
                >
                  <p>
                    Brand Name: &nbsp;
                    {cardTableData
                      ? cardTableData.BRAND_NAME
                        ? cardTableData.BRAND_NAME
                        : "-"
                      : "-"}
                  </p>
                  <p>
                    Open Hours: &nbsp;
                    {cardTableData
                      ? cardTableData.OPE_HRS
                        ? cardTableData.OPE_HRS
                        : "-"
                      : "-"}
                  </p>
                  <p>
                    Charging Capacity: &nbsp;
                    {cardTableData
                      ? cardTableData.CHARG_CAP1
                        ? cardTableData.CHARG_CAP1
                        : "-"
                      : "-"}
                  </p>
                  <p>
                    Power Type: &nbsp;
                    {cardTableData
                      ? cardTableData.Power_Type
                        ? cardTableData.Power_Type
                        : "-"
                      : "-"}
                  </p>
                  <p>
                    Vehicle Type: &nbsp;
                    {cardTableData
                      ? cardTableData.Vehicle_Ty
                        ? cardTableData.Vehicle_Ty
                        : "-"
                      : "-"}
                  </p>
                  <p>
                    Battery Swapping: &nbsp;
                    {cardTableData
                      ? cardTableData["BATTERY SW"]
                        ? cardTableData["BATTERY SW"]
                        : "-"
                      : "-"}
                  </p>
                </div>
              )}

              {dataType === "charging_station" && cardTableData && (
                <div className="table_data">
                  <table
                    style={{
                      border: "1px solid black",
                      borderCollapse: "collapse",
                      textAlign: "center",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ border: "1px solid black" }}>
                          Charge Type
                        </th>
                        <th style={{ border: "1px solid black" }}>
                          Connection Type
                        </th>
                        <th style={{ border: "1px solid black" }}>Price</th>
                        <th style={{ border: "1px solid black" }}>
                          No. of Points
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cardTableData.CHR_TYPE1 && (
                        <tr>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.CHR_TYPE1}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.CONT_TYPE1 || "-"}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.PRICE_CAP1 || "-"}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.Cont_Cou_1 || "-"}
                          </td>
                        </tr>
                      )}

                      {cardTableData.CHR_TYPE2 && (
                        <tr>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.CHR_TYPE2}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.CONT_TYPE2 || "-"}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.PRICE_CAP2 || "-"}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.Cont_Cou_2 || "-"}
                          </td>
                        </tr>
                      )}

                      {cardTableData.CHR_TYPE3 && (
                        <tr>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.CHR_TYPE3}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.CONT_TYPE3 || "-"}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.PRICE_CAP3 || "-"}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.Cont_Cou_3 || "-"}
                          </td>
                        </tr>
                      )}
                      {cardTableData.CHR_TYPE4 && (
                        <tr>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.CHR_TYPE4}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.CONT_TYPE4 || "-"}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.PRICE_CAP4 || "-"}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {cardTableData.Cont_Cou_4 || "-"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ViewComp;
