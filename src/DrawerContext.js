import React, { useContext } from "react";

const DrawerContext = React.createContext();

const useDrawer = () => {
  const value = useContext(DrawerContext);
  const { setDrawerOpen } = value;
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  return { openDrawer, closeDrawer, ...value };
};

export { DrawerContext, useDrawer };
