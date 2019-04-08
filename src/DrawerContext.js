import React, { useState, useContext } from "react";

const DrawerContext = React.createContext();

const useDrawer = () => {
  const value = useContext(DrawerContext);

  const { setDrawerOpen } = value;
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return { openDrawer, closeDrawer, ...value };
};

const useDrawerState = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  return { isDrawerOpen, setDrawerOpen };
};

export { DrawerContext, useDrawerState, useDrawer };
