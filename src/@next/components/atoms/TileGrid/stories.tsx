import { storiesOf } from "@storybook/react";
import React from "react";

import { TileGrid } from ".";
import { Tile } from "../";

const tile = (
  <Tile header={<>This is header</>} footer={<>This is footer</>}>
    <p>Tile content</p>
  </Tile>
);

const tiles = [tile, tile, tile, tile, tile, tile];
storiesOf("@components/atoms/TileGrid", module)
  .add("default", () => <TileGrid elements={tiles} />)
  .add("custom grid size", () => <TileGrid elements={tiles} md={6} lg={6} />);
