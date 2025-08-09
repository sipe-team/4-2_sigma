import { useEffect, useState } from "react";

import { PLUGIN } from "@common/networkSides";
import { UI_CHANNEL } from "@ui/app.network";
import figmaLogo from "@ui/assets/figma.png";
import ReactLogo from "@ui/assets/react.svg?component";
import viteLogo from "@ui/assets/vite.svg?url";
import { Button } from "@ui/components/Button";
import { LayerAudit } from "@ui/components/LayerAudit";
import { NetworkError, Networker } from "monorepo-networker";

import "@ui/styles/main.scss";

function App() {
  return <LayerAudit />;
}

export default App;
