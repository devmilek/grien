import React, { PropsWithChildren } from "react";
import Navigator from "./navigator";

const EditRecipeLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Navigator />
      <div className="mt-10">{children}</div>
    </div>
  );
};

export default EditRecipeLayout;
