import { BsArrowDown } from "react-icons/bs";

export default function RowName({
  name,
  state,
  setState,
  functionDisable,
  setFunctionDisable,
}) {
  const handleFirstNameSort = () => {
    if (functionDisable == false || functionDisable == name) {
      if (state == null) {
        setState(1);
        setFunctionDisable(name);
      } else if (state != null && state == 1) {
        setState(2);
      } else if (state != null && state == 2) {
        setState(null);
        setFunctionDisable(false);
      }
    }
  };

  return (
    <div
      onClick={handleFirstNameSort}
      className="flex items-center gap-2 cursor-pointer"
    >
      <p>{name}</p>
      <div
        className={`${state == 1 ? "rotate-180" : "rotate-0"} transition w-4`}
        // className={`${
        //   state == 1 ? "rotate-180" : "rotate-0"
        // } ${name} transition w-4`}
      >
        {state != null && <BsArrowDown />}
      </div>
    </div>
  );
}
