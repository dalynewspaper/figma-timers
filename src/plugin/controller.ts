////////////////////////////////////////////////////////////////
///////////////////////// UI CONFIG ////////////////////////////
////////////////////////////////////////////////////////////////

// Show UI
figma.showUI(__html__, { width: 360, height: 600 });

// Clear the storage
// figma.clientStorage.setAsync("timer-config", void 0);

figma.clientStorage.getAsync("timer-config").then(data => {
  figma.ui.postMessage({
    type: "read-from-storage",
    data: data ? JSON.parse(data) : null
  });
});

// On message
figma.ui.onmessage = async msg => {
  // UPDATE ON BY ONE
  if (msg.type === "write-to-storaage") {
    figma.clientStorage.setAsync("timer-config", JSON.stringify(msg.data));
  }
};
