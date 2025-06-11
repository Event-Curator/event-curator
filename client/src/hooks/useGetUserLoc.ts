import { useState } from "react";
import type { GeolocationData } from "../types";

export default function useGetPosition(): GeolocationData {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [userRefused, setUserRefused] = useState(false);

  navigator.geolocation.getCurrentPosition((position) => {
    try {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    } catch (error) {
      console.warn(error);
      setUserRefused(true);
    }
  });
  return { latitude, longitude, userRefused };
}
