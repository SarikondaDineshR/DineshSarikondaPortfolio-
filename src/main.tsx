import { createRoot } from "react-dom/client";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import App from "./App";
import PipelineControl from "./pipeline/PipelineControl";
import "./index.css";

// GitHub Pages serves static files with no server-side rewrites, so any
// route beyond "/pipeline" is kept behind a "#" hash instead of a real path.
createRoot(document.getElementById("root")!).render(
  <Router hook={useHashLocation}>
    <Switch>
      <Route path="/pipeline" component={PipelineControl} />
      <Route path="/" component={App} />
    </Switch>
  </Router>
);
