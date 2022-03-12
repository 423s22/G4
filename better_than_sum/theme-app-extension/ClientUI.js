

(function () {
  function selectElement(selector, node) {
    return (node || document).querySelector(selector);
  }

  // utility function that simplifies creation of new html node
  function create({
                    tag,
                    appendTo,
                    children = [],
                    attributes = {},
                    events = {},
                  }) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      element[key] = value;
    });

    Object.entries(events).forEach(([key, value]) => {
      element.addEventListener(key, value);
    });

    if (appendTo) {
      appendTo.appendChild(element);
    }

    children.forEach((child) => element.appendChild(child));

    return element;
  }

  function createField({ labelProps, fieldProps = {}, name, parentNode }) {
    const fieldClassName = (
      {
        select: "select__select",
        textarea: "field__input text-area",
      }[fieldProps.tag] || "field__input"
    ).concat(fieldProps.attributes?.className || "");

    const container = create({
      tag: "div",
      attributes: { className: "field" },
    });


  }
  }
