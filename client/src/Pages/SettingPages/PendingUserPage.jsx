import { useState } from "react";
import RowName from "../../Components/SettingsPageComponents/UserTable/RowName";
import { FiEdit } from "react-icons/fi";

export default function PendingUsersPage() {
  const [firstNameSort, setFirstNameSort] = useState(null);
  const [lastNameSort, setLastNameSort] = useState(null);
  const [emailSort, setEmailSort] = useState(null);
  const [functionDisable, setFunctionDisable] = useState(false);

  // table data
  const data = [
    {
      id: 1,
      first_name: "Nabil",
      last_name: "Newaz",
      email: "dlldf@gmail.com",
      user_role: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 2,
      first_name: "Toukir",
      last_name: "Ahmed",
      email: "demo.email@testdomain.net",
      user_role: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 3,
      first_name: "Alice",
      last_name: "Bohnson",
      email: "yourname.email@example.com",
      user_role: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 4,
      first_name: "Shiam",
      last_name: "Shikder",
      email: "test.email@example.org",
      user_role: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 5,
      first_name: "ADavid",
      last_name: "FSmith",
      email: "random.user@emailtest.net",
      user_role: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 6,
      first_name: "AEmily",
      last_name: "aBrown",
      email: "john.doe1234@samplemail.org",
      user_role: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 7,
      first_name: "Michael",
      last_name: "Davis",
      email: "mynewemail@emailprovider.com",
      user_role: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 8,
      first_name: "Sarah",
      last_name: "Wilson",
      email: "amynewemail@emailprovider.com",
      user_role: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 9,
      first_name: "James",
      last_name: "Miller",
      email: "email.address@testdomain.org",
      user_role: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 10,
      first_name: "Olivia",
      last_name: "Taylor",
      email: "email@gmail.com",
      user_role: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
  ];

  // table sorting logic
  const sortedData = data.sort((a, b) => {
    const nameA = a.first_name.toLowerCase();
    const nameB = b.first_name.toLowerCase();

    const lastA = a.last_name.toLowerCase();
    const lastB = b.last_name.toLowerCase();

    const emailA = a.email;
    const emailB = b.email;

    if (firstNameSort == 1 || lastNameSort == 1 || emailSort == 1) {
      if (firstNameSort == 1) {
        return nameA.localeCompare(nameB);
      }
      if (lastNameSort == 1) {
        return lastA.localeCompare(lastB);
      }
      if (emailSort == 1) {
        return emailA.localeCompare(emailB);
      }
    } else if (firstNameSort == 2 || lastNameSort == 2 || emailSort == 2) {
      if (firstNameSort == 2) {
        return nameB.localeCompare(nameA);
      }
      if (lastNameSort == 2) {
        return lastB.localeCompare(lastA);
      }
      if (emailSort == 2) {
        return emailB.localeCompare(emailA);
      }
    } else {
      return data;
    }
  });

  return (
    <div className="overflow-x-auto py-10">
      <table className="table table-md">
        <thead>
          <tr className="bg-gray-100">
            <th>
              <RowName
                name={"First Name"}
                state={firstNameSort}
                setState={setFirstNameSort}
                functionDisable={functionDisable}
                setFunctionDisable={setFunctionDisable}
              />
            </th>
            <th>
              {
                <RowName
                  name={"Last Name"}
                  state={lastNameSort}
                  setState={setLastNameSort}
                  functionDisable={functionDisable}
                  setFunctionDisable={setFunctionDisable}
                />
              }
            </th>
            <th>
              {
                <RowName
                  name={"Email"}
                  state={emailSort}
                  setState={setEmailSort}
                  functionDisable={functionDisable}
                  setFunctionDisable={setFunctionDisable}
                />
              }
            </th>
            <th>User Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((data, index) => {
            return (
              <tr key={index} className={`${index % 2 == 1 && "bg-gray-100"}`}>
                <td>{data.first_name}</td>
                <td>{data.last_name}</td>
                <td>{data.email}</td>
                <td>
                  <select
                    style={{ borderRadius: "2px" }}
                    className="select select-bordered w-full select-xs max-w-xs select-primary"
                  >
                    <option disabled selected>
                      Select Role
                    </option>
                    {data.user_role.map((role, index) => (
                      <option key={index}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="flex gap-2">
                  <button className="flex items-center border border-gray-400 py-[2px] px-1 rounded-[2px] hover:bg-[#8633FF] hover:text-white transition-all duration-150">
                    <FiEdit />
                    <p>Approve</p>
                  </button>
                  <button className="border border-gray-400 py-[2px] px-1 rounded-[2px] hover:bg-red-500 hover:text-white transition-all duration-150">
                    Decline
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
