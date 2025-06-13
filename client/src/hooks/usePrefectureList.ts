import { useState, useEffect } from "react";
import type { MetaData } from "../types";

export default function usePrefectureList() {
  const [prefectureList, setPrefectureList] = useState<MetaData[]>([]);
  const [prefectureListError, setprefectureListError] = useState(false);
  const api = import.meta.env.VITE_API;

  useEffect(() => {
    async function getPrefectureList() {
      try {
        const response = await fetch(`${api}/meta?key=placeProvince`);
        if (!response.ok) {
          console.error(response);
          setprefectureListError(true);
        } else {
          const data = await response.json();
          setPrefectureList(data);
        }
      } catch (error) {
        console.error(error);
        setprefectureListError(true);
      }
    }
    getPrefectureList();
  }, [api]);

  prefectureList.sort((a, b) => a.name.localeCompare(b.name));

  return { prefectureList, prefectureListError };
}
