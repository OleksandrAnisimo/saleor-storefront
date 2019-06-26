import { storiesOf } from "@storybook/react";
import React from "react";

import { SocialMediaIcon } from ".";
import { createStory } from "../baseStory";
import { Medium } from "./types";

const FACEBOOK_MEDIUM: Medium = {
  ariaLabel: "facebook",
  href: "https://www.facebook.com/mirumeelabs/",
  iconName: "social_facebook",
};

storiesOf("@components/atoms/SocialMediaIcon", module).add(
  "sample medium",
  () => (
    <SocialMediaIcon medium={FACEBOOK_MEDIUM} key={FACEBOOK_MEDIUM.ariaLabel} />
  )
);
