"use client";
import { useRef, useState } from "react";
import Explore from "@/components/explore/Explore";
import SideExplore from "@/components/explore/SideExplore";
import ExploreMap, { InteractiveMapRef } from "@/components/explore/ExploreMap";
import ExploreHotels from "@/components/explore/ExploreHotels";
import NewJourneyExplore from "@/components/explore/NewJourneyExplore";
import JourneySidebar from "@/components/explore/JourneySidebar";
import StepDetailsPanel from "@/components/explore/StepDetailsPanel";
import { Step } from "@/components/dashboard/modals/components/newjourney/types";

const Page = () => {
  const handleMenuClick = () => {};
  const mapRef = useRef<InteractiveMapRef>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All feeds");
  const [isExplorePanelOpen, setIsExplorePanelOpen] = useState<boolean>(false);
  const [newJourney, setNewJourney] = useState<boolean>(false);
  const [isJourneySidebarOpen, setIsJourneySidebarOpen] =
    useState<boolean>(true);
  const [journeyData, setJourneyData] = useState<any>({
    journeyName: "Trip to Lahore to Hunza",
    startingPoint: "Lahore",
    endPoint: "Hunza",
    startDate: "2024-07-06",
    endDate: "2024-07-12",
    who: "couple",
    budget: "2000",
    days: [
      {
        id: 1,
        dayNumber: 1,
        date: new Date("2024-07-06"),
        steps: [
          {
            name: "Trip to Lahore and Islamabad",
            location: { coords: null, name: "Lahore" },
            notes: "Starting our journey from Lahore",
            media: [],
            mediumOfTravel: "car",
            startDate: "2024-07-06",
            endDate: "2024-07-06",
            category: "1",
            dateError: "",
          },
        ],
        isOpen: false,
      },
      {
        id: 2,
        dayNumber: 2,
        date: new Date("2024-07-07"),
        steps: [
          {
            name: "Trip to Islamabad and Murree",
            location: { coords: null, name: "Islamabad" },
            notes: "Visiting Faisal Mosque and exploring Islamabad",
            media: [],
            mediumOfTravel: "car",
            startDate: "2024-07-07",
            endDate: "2024-07-07",
            category: "2",
            dateError: "",
          },
        ],
        isOpen: false,
      },
    ],
  });
  const [selectedStep, setSelectedStep] = useState<{
    dayIndex: number;
    stepIndex: number;
  } | null>(null);
  const [isStepDetailsOpen, setIsStepDetailsOpen] = useState<boolean>(false);

  const handleStepSelect = (dayIndex: number, stepIndex: number) => {
    setSelectedStep({ dayIndex, stepIndex });
    setIsStepDetailsOpen(true);
  };

  const updateJourneyData = (updatedData: any) => {
    console.log("Updating journey data:", updatedData);
    setJourneyData(updatedData);
  };

  const handleStepDetailsClose = () => {
    setIsStepDetailsOpen(false);
    setSelectedStep(null);
  };

  // Get the selected step data
  const getSelectedStepData = (): Step | null => {
    if (!selectedStep || !journeyData) return null;

    // This is a simplified version - you'll need to adapt this based on your actual data structure
    const { dayIndex, stepIndex } = selectedStep;
    const days = journeyData.days || [];
    const day = days[dayIndex];
    if (!day || !day.steps) return null;

    return day.steps[stepIndex] || null;
  };

  return (
    <>
      <div className="h-[calc(100vh-210px)] bg-gray-50">
        <Explore
          onMenuClick={handleMenuClick}
          onPlaceSelected={(lng: number, lat: number, name?: string) => {
            mapRef.current?.centerMap(lng, lat, name);
          }}
          onFilterChange={(filter: string) => setActiveFilter(filter)}
          onNewJourneyClick={() => setNewJourney(true)}
        />

        <div className="flex h-full">
          {/* Journey Sidebar */}
          <JourneySidebar
            isOpen={isJourneySidebarOpen}
            onClose={() => setIsJourneySidebarOpen(false)}
            journeyData={journeyData}
            selectedStep={selectedStep}
            onStepSelect={handleStepSelect}
            onJourneyDataUpdate={updateJourneyData}
          />

          {/* Main Content */}
          <div className="flex flex-1">
            <SideExplore onExploreClick={() => setIsExplorePanelOpen(true)} />
            <div className="flex-1">
              <ExploreMap
                ref={mapRef}
                className="h-[calc(100vh-210px)]"
                activeFilter={activeFilter}
              />
            </div>
          </div>
        </div>

        {isExplorePanelOpen && (
          <ExploreHotels setIsExplorePanelOpen={setIsExplorePanelOpen} />
        )}
      </div>

      {/* Step Details Panel */}
      <StepDetailsPanel
        isOpen={isStepDetailsOpen}
        onClose={handleStepDetailsClose}
        step={getSelectedStepData()}
        dayIndex={selectedStep?.dayIndex || 0}
        stepIndex={selectedStep?.stepIndex || 0}
      />

      <NewJourneyExplore
        newJourney={newJourney}
        setNewJourney={setNewJourney}
        onJourneyCreated={(data) => {
          setJourneyData(data);
          setIsJourneySidebarOpen(true);
        }}
      />
    </>
  );
};

export default Page;
