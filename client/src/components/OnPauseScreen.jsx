import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const OnPauseScreen = ({ name, theme }) => {
  const icon = `tdesign:letters-${name[0].toLowerCase()}`;
  const boxBorder = `border-4 border-${theme}`;
  const iconCss = `text-${theme}`;

  return (
    <div className={boxBorder}>
      <Icon icon={icon} width={"192px"} height={"93px"} className={iconCss} />
    </div>
  );
};

export default OnPauseScreen;
