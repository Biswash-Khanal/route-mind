
import HeroSection from "./components/HeroSection";
import PrimaryButton from "./components/ActionButtons/PrimaryButton";
import SecondaryButton from "./components/ActionButtons/SecondaryButton";
import ModeToggle from "./components/ActionButtons/ModeToggle";
import LocationSelector from "./components/LocationSelector";
import PreferencesCard from "./components/RouteCards/PreferencesCard";
import FastestRouteCard from "./components/RouteCards/FastestRouteCard";
import MapView from "./components/MapView";

const Page = () => {
  return (
    <>
      <HeroSection />

      <div className="flex-col my-20">
        <div className="flex justify-around mb-10">
          <PrimaryButton />
          <SecondaryButton />
          <ModeToggle />
        </div>

        <LocationSelector />

        <div className="flex justify-around">
          <PreferencesCard />
          <FastestRouteCard />
        </div>
      </div>

      <MapView />
    </>
  );
};

export default Page;
