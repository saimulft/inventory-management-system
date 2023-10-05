export default function AllUsersPage() {
  const data = [
    {
      id: 1,
      job: "Cy Ganderton",
      company: "Quality Control Specialist",
      location: "Littel, Schaden and Vandervort",
      last_login: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 2,
      job: "Cy Ganderton",
      company: "Quality Control Specialist",
      location: "Littel, Schaden and Vandervort",
      last_login: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 3,
      job: "Cy Ganderton",
      company: "Quality Control Specialist",
      location: "Littel, Schaden and Vandervort",
      last_login: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 4,
      job: "Cy Ganderton",
      company: "Quality Control Specialist",
      location: "Littel, Schaden and Vandervort",
      last_login: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 5,
      job: "Cy Ganderton",
      company: "Quality Control Specialist",
      location: "Littel, Schaden and Vandervort",
      last_login: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 6,
      job: "Cy Ganderton",
      company: "Quality Control Specialist",
      location: "Littel, Schaden and Vandervort",
      last_login: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 7,
      job: "Cy Ganderton",
      company: "Quality Control Specialist",
      location: "Littel, Schaden and Vandervort",
      last_login: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 8,
      job: "Cy Ganderton",
      company: "Quality Control Specialist",
      location: "Littel, Schaden and Vandervort",
      last_login: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 9,
      job: "Cy Ganderton",
      company: "Quality Control Specialist",
      location: "Littel, Schaden and Vandervort",
      last_login: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
    {
      id: 10,
      job: "Cy Ganderton",
      company: "Quality Control Specialist",
      location: "Littel, Schaden and Vandervort",
      last_login: ["Store Admin", "Store Manager"],
      favorite_color: "Blue",
    },
  ];

  return (
    <div className="overflow-x-auto py-10">
      <table className="table table-md">
        <thead>
          <tr className="bg-gray-100">
            <th></th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>User Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => {
            return (
              <tr key={i} className={`${d.id % 2 == 0 && "bg-gray-100"}`}>
                <th>{d.id}</th>
                <td>{d.job}</td>
                <td>{d.company}</td>
                <td>{d.location}</td>
                <td>
                  <select
                    style={{ borderRadius: "2px" }}
                    className="select select-bordered w-full select-xs max-w-xs"
                  >
                    <option disabled selected>
                      Select Role
                    </option>
                    <option>{d.last_login[0]}</option>
                    <option>{d.last_login[1]}</option>
                  </select>
                </td>
                <td>{d.favorite_color}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
