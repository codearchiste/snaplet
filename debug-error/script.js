export default async (element, config) => {
  try {
    // Simulate a runtime error intentionally
    if (!config.triggerError) {
      throw new Error("Debug Snaplet: triggerError not set in config!");
    }

    // If triggerError is true, simulate another error
    if (config.triggerError === "runtime") {
      const result = undefinedVariable + 1; // Will throw ReferenceError
      element.textContent = result;
    }

    // Otherwise show normal debug info
    const container = document.createElement('div');
    container.style.border = '1px solid #f39c12';
    container.style.padding = '10px';
    container.style.backgroundColor = '#fdf5e6';
    container.style.borderRadius = '6px';
    container.style.fontFamily = 'monospace';
    container.textContent = "Debug Snaplet loaded successfully! Config: " + JSON.stringify(config, null, 2);

    element.appendChild(container);

  } catch (err) {
    console.error("Snaplet Debug Error:", err);
    const errorBox = document.createElement('div');
    errorBox.className = 'snaplet-error';
    errorBox.style.border = '1px solid #e74c3c';
    errorBox.style.padding = '10px';
    errorBox.style.backgroundColor = '#fdecea';
    errorBox.style.color = '#c0392b';
    errorBox.style.borderRadius = '6px';
    errorBox.textContent = "Snaplet Debug Error: " + err.message;
    element.appendChild(errorBox);
  }
};
