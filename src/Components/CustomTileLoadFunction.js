// Tile Load Function
//--------------------------------------------------------------------------
// export function customTileLoadFunction(tile, src) {
//   const xhr = new XMLHttpRequest();
//   const authHeader = "Basic " + btoa("admin:geoserver");

//   xhr.open("GET", src);
//   xhr.setRequestHeader("Authorization", authHeader);
//   xhr.responseType = "blob"; // Set the response type to Blob
//   xhr.onload = function () {
//     if (xhr.status === 200) {
//       const blobUrl = URL.createObjectURL(xhr.response);
//       tile.getImage().src = blobUrl;
//     } else {
//       // Handle tile load error
//       console.log("Tile failed to load");
//     }
//   };
//   xhr.onerror = function () {
//     console.log("Tile failed to load");
//   };
//   xhr.send();

//   tile.getImage().onload = () => {
//     tile.getImage().onload = null; // Clear the onload handler
//     console.log("Tile loaded successfully");
//   };
// }

//----------------------------------------------------------------------------------

//Tile Load Function with image compression

//----------------------------------------------------------------------------------

// import imageCompression from "browser-image-compression";

// export async function customTileLoadFunction(tile, src) {
//   try {
//     const response = await fetch(src);

//     if (response.ok) {
//       const blob = await response.blob();
//       const compressedBlob = await compressImage(blob);
//       const blobUrl = URL.createObjectURL(compressedBlob);
//       tile.getImage().src = blobUrl;
//     } else {
//       // Handle tile load error
//       console.log("Tile failed to load");
//     }
//   } catch (error) {
//     console.log("Tile failed to load:", error);
//   }

//   tile.getImage().onload = () => {
//     tile.getImage().onload = null; // Clear the onload handler
//     console.log("Tile loaded successfully");
//   };
// }

// async function compressImage(blob) {
//   const options = {
//     maxSizeMB: 0.5, // Specify the maximum file size (in megabytes) after compression
//     maxWidthOrHeight: 800, // Specify the maximum width or height of the output image
//     useWebWorker: true, // Process the compression in a web worker to avoid blocking the main thread
//   };

//   try {
//     const compressedBlob = await imageCompression(blob, options);
//     return compressedBlob;
//   } catch (error) {
//     throw error;
//   }
// }

//----------------------------------------------------------------------------------

// Image Load Function

//----------------------------------------------------------------------------------

// export function customImageLoadFunction(image, src) {
//   console.log(`hitting load function`);
//   const xhr = new XMLHttpRequest();

//   xhr.responseType = "blob"; // Set the response type to Blob

//   xhr.onload = function () {
//     if (xhr.status === 200) {
//       const blobUrl = URL.createObjectURL(xhr.response);
//       image.getImage().src = blobUrl;
//     } else {
//       // Handle image load error
//       console.log("Image failed to load");
//     }
//   };

//   xhr.onerror = function () {
//     console.log("Image failed to load");
//   };

//   xhr.open("GET", src);
//   xhr.send();

//   image.getImage().onload = () => {
//     image.getImage().onload = null; // Clear the onload handler
//     console.log("Image loaded successfully");
//   };
// }

//----------------------------------------------------------------------------------

// Image Load Function Async/Await

//----------------------------------------------------------------------------------

// export async function customImageLoadFunction(image, src) {
//   try {
//     const response = await fetch(src);
//     if (response.ok) {
//       const blob = await response.blob();
//       const blobUrl = URL.createObjectURL(blob);
//       image.getImage().src = blobUrl;
//       console.log("Image loaded successfully");
//     } else {
//       console.log("Image failed to load");
//     }
//   } catch (error) {
//     console.log("Image failed to load");
//   }
// }

//----------------------------------------------------------------------------------

// Image Load Function with cache

//----------------------------------------------------------------------------------

// export async function customImageLoadFunction(image, src) {
//   try {
//     const response = await fetch(src, { cache: "force-cache" });
//     if (response.ok) {
//       image.getImage().src = src;
//       console.log("Image loaded successfully");
//     } else {
//       console.log("Image failed to load");
//     }
//   } catch (error) {
//     console.log("Image failed to load");
//   }
// }

//-------------------------------------------------------------------

// Create a tile cache with a size limit
const tileCache = new Map();
const maxCacheSize = 100000; // Adjust the cache size as needed

export async function customTileLoadFunction(tile, src) {
  // Check if the tile is in the cache
  if (tileCache.has(src)) {
    tile.getImage().src = tileCache.get(src);
    return;
  }

  // Load the tile
  const authHeader = "Basic " + btoa("admin:gomaps23");

  try {
    const response = await fetch(src, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      tile.getImage().src = blobUrl;

      // Cache the tile
      tileCache.set(src, blobUrl);

      // Check if the cache size exceeds the limit
      if (tileCache.size > maxCacheSize) {
        const firstKey = tileCache.keys().next().value;
        URL.revokeObjectURL(tileCache.get(firstKey));
        tileCache.delete(firstKey);
      }
    } else {
      console.log("Tile failed to load");
    }
  } catch (error) {
    console.log("Tile failed to load");
  }
}

// Clear tile cache and release resources when no longer needed
// function clearTileCache() {
//   for (const blobUrl of tileCache.values()) {
//     URL.revokeObjectURL(blobUrl);
//   }
//   tileCache.clear();
// }

// Example usage:
// customTileLoadFunction(tile, src);
