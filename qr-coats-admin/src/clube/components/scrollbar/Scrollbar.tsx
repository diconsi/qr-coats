import { memo } from "react";

import { StyledRootScrollbar, StyledScrollbar } from ".";

const Scrollbar = ({ children }) => {
  return (
    <StyledRootScrollbar>
      <StyledScrollbar>{children}</StyledScrollbar>
    </StyledRootScrollbar>
  );
};

export default memo(Scrollbar);
