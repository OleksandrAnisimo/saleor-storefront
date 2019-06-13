import React from "react";

import { Tile } from ".";
import { createStory } from "../baseStory";

createStory("Tile").add("default", () => (
  <Tile header={<h3>This is header</h3>}>
    <div>This is body</div>
  </Tile>
));
