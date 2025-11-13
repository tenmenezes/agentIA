"use client";

import { RoadMapForm } from "./_components/roadmap-from";
import { useState } from "react";
import { RoadMapGenerator } from "./_components/roadmap-generator";
import { RoadMapData } from "@/types/roadmap-data.type";

export default function Home() {
  const [data, setData] = useState<RoadMapData | null>(null);

  function handleSubmit(userInfo: RoadMapData) {
    setData(userInfo);
  }

  return (
    <>
      {!data ? (
        <RoadMapForm onSubmit={handleSubmit} />
      ) : (
        <RoadMapGenerator data={data} onBack={() => setData(null)} />
      )}
    </>
  );
}
