const handlePriceKeyDown = (event) => {
    const validKeys = /^[0-9]*\.?([0-9]+)?$/;
    if (!validKeys.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
    }
    const inputValue = event.target.value;
    if (inputValue.indexOf(".") !== -1 && event.key === ".") {
        event.preventDefault();
    }
};

export default handlePriceKeyDown;