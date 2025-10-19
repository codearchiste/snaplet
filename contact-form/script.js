// Contact Form Snaplet
export default async (element, config) => {
  try {
    if (!config.fields || !config.fields.length) throw new Error("No form fields provided");

    // Create form container
    const form = document.createElement('form');
    form.className = 'snaplet-contact-form';

    // Create fields dynamically
    config.fields.forEach(field => {
      const fieldWrapper = document.createElement('div');
      fieldWrapper.className = 'snaplet-form-field';

      const label = document.createElement('label');
      label.textContent = field.label;
      label.setAttribute('for', field.name);

      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
      } else {
        input = document.createElement('input');
        input.type = field.type || 'text';
      }
      input.name = field.name;
      input.id = field.name;
      input.required = true;

      fieldWrapper.append(label, input);
      form.appendChild(fieldWrapper);
    });

    // Submit button
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = config.submitText || 'Submit';
    form.appendChild(button);

    // Response message
    const responseMsg = document.createElement('div');
    responseMsg.className = 'snaplet-form-response';
    form.appendChild(responseMsg);

    // Handle form submit
    form.addEventListener('submit', async e => {
      e.preventDefault();
      responseMsg.textContent = 'Sending...';
      responseMsg.style.color = '#0f4c81';

      const data = {};
      config.fields.forEach(f => data[f.name] = form[f.name].value);

      try {
        if (!config.endpoint) throw new Error("No endpoint provided for form submission");
        const res = await fetch(config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        responseMsg.textContent = 'Message sent successfully!';
        responseMsg.style.color = 'green';
        form.reset();
      } catch (err) {
        responseMsg.textContent = 'Failed to send message: ' + err.message;
        responseMsg.style.color = 'red';
        console.error("Snaplet Form Error:", err);
      }
    });

    element.appendChild(form);
  } catch (err) {
    console.error("Snaplet Form Load Error:", err);
    const errorBox = document.createElement('div');
    errorBox.className = 'snaplet-error';
    errorBox.textContent = 'Snaplet Form Load Error: ' + err.message;
    element.appendChild(errorBox);
  }
};
