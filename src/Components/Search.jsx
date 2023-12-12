import React, { useEffect, useState } from "react";
import axios from "axios";
// import queryString from "query-string";
import InputAdornment from '@mui/material/InputAdornment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce"; 
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClearIcon from '@mui/icons-material/Clear';
import { red } from "@mui/material/colors";
function Search({
  getDestPics,
  query,
  setQuery,
  setCardBodyDisp,
  setDispMarker,
  setZoom,
  setCoords,
  polyData,
  setPolyData,
  setDisplayName,
  setPolyCoord,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isCoordinateSearch, setIsCoordinateSearch] = useState(false);

  const debouncedSearch = debounce((searchQuery) => {
    handleSearch(searchQuery);
  }, 300);

  const handleSearch = async (searchQuery) => {
    // console.log(`searchQuery: `, searchQuery);
    try {
      let url;
      if (isCoordinateSearch) {
        const coords = searchQuery
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
        const lat = coords[0];
        const lon = coords[1];

        // url = `http://10.10.2.200:8080/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;
        // url = `http://10.10.5.129:6001/reverse/${lat}/${lon}`;
        // url = `http://10.10.2.36:6001/reverse/${lat}/${lon}`;
        url = `http://10.10.5.200:6001/reverse/${lat}/${lon}`;
      } else {
        // const params = queryString.stringify({
        //   q: searchQuery,
        // });

        // url = `http://10.10.2.200:8080//search.php/?format=jsonv2&polygon_geojson=1&limit=10&${params}`;

        // url = `http://10.10.5.129:6001/search/${searchQuery}`;
        // url = `http://10.10.2.36:6001/search/${searchQuery}`;
        url = `http://10.10.5.200:6001/search/${searchQuery}`;

      }
      const response = await axios.get(url);
      // setSuggestions(response.data);
      // const responseData = response.data;

      if (response.data.apple && response.data.orange && response.data.mango) {
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
        const responseData = JSON.parse(decryptedData);
        // console.log(responseData);

        const correctData =
          responseData && Array.isArray(responseData)
            ? responseData
            : [responseData];

        if (correctData.length) {
          console.log(correctData);
          setSuggestions(correctData);
        } else {
          setSuggestions([]);
        }

        // Update state or perform other actions with the decrypted data
      } else {
        // Handle non-encrypted data response here
        console.log("Non-encrypted data:", response.data);
      }

      //Working
      // console.log(response.data);
      // const responseData = Array.isArray(response.data.response)
      //   ? response.data.response
      //   : [response.data.response];
      // // console.log(`responseData: `, responseData);
      // if (responseData.length) {
      //   setSuggestions(responseData);
      // } else {
      //   setSuggestions([]);
      // }
    } catch (error) {
      console.error(error);
      setSuggestions([]);
      if (error.response && error.response.status === 429) {
        toast.error(error.response.data); // Display the error message from the response
      } else {
        toast.error(error.code);
      }
    }
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    const hasComma = newQuery.includes(",");

    setIsCoordinateSearch(
      /^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/.test(newQuery)
    );

    if (hasComma || !isCoordinateSearch) {
      if (newQuery) {
        debouncedSearch(newQuery);
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleLocationSelect = (suggestion) => {
    if (suggestion && suggestion.geojson && suggestion.geojson.type) {
      const { lat, lon } = suggestion;
      const coords = [parseFloat(lon), parseFloat(lat)];

      if (suggestion.geojson.type === "Polygon") {
        setQuery(suggestion.display_name);

        setDispMarker(false);
        setCardBodyDisp(true);
        getDestPics(suggestion);
        setPolyData(suggestion.geojson.coordinates[0]);
        setPolyCoord(coords);
        setCoords([]);
        setDisplayName({
          dp: suggestion.display_name,
          latitude: suggestion.lat,
          longitude: suggestion.lon,
          titleName: suggestion.display_name.split(",")[0],
        });
        setZoom(15);
      } else if (suggestion.geojson.type === "MultiPolygon") {
        setQuery(suggestion.display_name);
        setDispMarker(false);
        setCardBodyDisp(true);
        getDestPics(suggestion);
        setPolyData(suggestion.geojson.coordinates[0][0]);
        setPolyCoord(coords);
        setCoords([]);
        setDisplayName({
          dp: suggestion.display_name,
          latitude: suggestion.lat,
          longitude: suggestion.lon,
          titleName: suggestion.display_name.split(",")[0],
        });
        setZoom(15);
      } else {
        setQuery(suggestion.display_name);
        getDestPics(suggestion);
        setCardBodyDisp(true);
        setDispMarker(true);
        // setZoom(19);
        setZoom(15);
        setCoords(coords);
      }
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    handleLocationSelect(suggestion);
    setSuggestions([]);
  };

  useEffect(() => {}, [query, suggestions, polyData]);
  const clearInput = () => {
    // setPolyCoord([]);
    setQuery("");
  
    setCardBodyDisp(false);
    setDispMarker(false);
  };

  return (
    <Box m={1} className="Box">
     <TextField
        className="searchData"
        name="searchInput"
        placeholder="Search here...."
        type="text"
        autoComplete="off"
        style={{backgroundColor:'#f2f2f2'}}
        value={query}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
            <ClearIcon
              variant="outlined"
              onClick={() => {
                clearInput('');
              }}
              style={{ cursor: 'pointer' }} 
            />
          </InputAdornment>
          ),
        }}
      />
     {query !== "" && (
         <List className="list_items">
         {suggestions.map((suggestion) => (
           <ListItem
             key={suggestion.place_id}
             style={{ marginBottom: "15px" }}
             onMouseDown={() => handleSuggestionSelect(suggestion)}
           >
             <div style={{ display: "flex", flexDirection: "row" }}>
               <div style={{ marginTop: "2px", marginLeft: "10px" }}>
                 <FontAwesomeIcon icon={faLocationDot} color="#2e73e2" />
               </div>
               <div
                 style={{
                   marginLeft: "30px",
                   textOverflow: "ellipsis",
                   overflow: "hidden",
                   whiteSpace: "nowrap",
                   
                 }}
               >
                 <Typography>{suggestion.display_name}</Typography>
               </div>
             </div>
           </ListItem>
         ))}
       </List>
      )}
  </Box>
  );
}

export default Search;
