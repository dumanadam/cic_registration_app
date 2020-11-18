import React from "react";
import { useMediaQuery } from "react-responsive";

const MQuery = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-device-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 1224px)",
  });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  return (
    <div style={{ color: "red", zIndex: 500 }}>
      {isDesktopOrLaptop && (
        <>
          <p>desktop </p>

          {isBigScreen && <p>You also have a huge screen</p>}
          {isTabletOrMobile && (
            <p>You are sized like a tablet or mobile phone though</p>
          )}
        </>
      )}
      {/*  {isTabletOrMobileDevice && <p>tablet or mobile</p>} */}

      <p> {isPortrait ? "portrait" : "landscape"} orientation</p>

      {/*     {isRetina && <p>You are retina</p>} */}
    </div>
  );
};

export default MQuery;
