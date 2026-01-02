import { useRef, useState, useEffect } from 'react';

import L from "leaflet";

import barrierIcon from "../../../assets/markers/icons/architectural_barriers.svg";
import waterIcon from "../../../assets/markers/icons/drinking_water.svg";
import otherIcon from "../../../assets/markers/icons/other.svg";
import playIcon from "../../../assets/markers/icons/playground.svg";
import lightsIcon from "../../../assets/markers/icons/public_lights.svg";
import roadIcon from "../../../assets/markers/icons/road_sign.svg";
import sewerIcon from "../../../assets/markers/icons/sewer.svg";
import urFurIcon from "../../../assets/markers/icons/urban_furnishing.svg";
import wasteIcon from "../../../assets/markers/icons/waste.svg";


export function MarkerInfo() {
    const [hidden, setHidden] = useState(true);
    const toggleHidden = () => setHidden(!hidden);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
            if (divRef.current) {
                L.DomEvent.disableClickPropagation(divRef.current);
                L.DomEvent.disableScrollPropagation(divRef.current);
            }
    }, []);
    
  return (
    <div ref={divRef} className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000] w-auto max-w-md">
      {!hidden && (
        <>
          <h2 className="text-xl font-bold mb-2">Marker Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                    <img src={barrierIcon} alt="Architectural Barriers" className="w-8 h-8 mr-2" />
                    Architectural Barriers
                </li>
                <li className="flex items-center">
                    <img src={waterIcon} alt="Drinking Water" className="w-8 h-8 mr-2" />
                    Drinking Water
                </li>
                <li className="flex items-center">
                    <img src={otherIcon} alt="Other" className="w-8 h-8 mr-2" />
                    Other
                </li>
                <li className="flex items-center">
                    <img src={playIcon} alt="Playground" className="w-8 h-8 mr-2" />
                    Playground
                </li>
                <li className="flex items-center">
                    <img src={lightsIcon} alt="Public Lights" className="w-8 h-8 mr-2" />
                    Public Lights
                </li>
              </ul>
            </div>
            <div>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                    <img src={roadIcon} alt="Road Sign" className="w-8 h-8 mr-2" />
                    Road Sign
                </li>
                <li className="flex items-center">
                    <img src={sewerIcon} alt="Sewer" className="w-8 h-8 mr-2" />
                    Sewer
                </li>
                <li className="flex items-center">
                    <img src={urFurIcon} alt="Urban Furnishing" className="w-8 h-8 mr-2" />
                    Urban Furnishing
                </li>
                <li className="flex items-center">
                    <img src={wasteIcon} alt="Waste" className="w-8 h-8 mr-2" />
                    Waste
                </li>
              </ul>
            </div>
          </div>
          <h2 className="text-xl font-bold mt-6 mb-2">Report state</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#eedc3c] mr-2"></div>
                    Assigned
                </li>
                <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#a7a7a7] mr-2"></div>
                    Suspended
                </li>
              </ul>
            </div>
            <div>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#4cb850] mr-2"></div>
                    In Progress
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
      <button
        onClick={toggleHidden}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {hidden ? "Show" : "Hide"} Map Markers Legend 
      </button>
    </div>
  );
}