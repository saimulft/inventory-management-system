import { useMutation } from "@tanstack/react-query";
import countries from "../../Utilities/countries";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import Swal from 'sweetalert2'

export default function ProfilePage() {
  const { user, setUser } = useAuth()

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (profileInfo) => {
      return axios.put('/admin_api/update_admin_user', profileInfo)
    },
  })
  const handleUpdateProfile = async (event) => {
    event.preventDefault()

    const form = event.target;
    const fullName = form.fullName.value;
    const email = form.email.value;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const phone = form.phoneNumber.value;
    const address = form.address.value;
    const city = form.city.value;
    const state = form.state.value;
    const country = form.country.value;
    const zipCode = form.zipCode.value;
    const whatsappNumber = form.whatsappNumber.value;

    if (currentPassword && !newPassword) {
      return console.log("You must provide a new password in order to change previous one!")
    }

    const profileInfo = {
      full_name: fullName ? fullName : user.full_name,
      current_email: user.email,
      new_email: email ? email : user.email,
      phone: phone ? phone : user.phone,
      current_password: currentPassword,
      new_password: newPassword,
      address: address ? address : user.address,
      state: state ? state : user.state,
      country: country && country !== 'Select your country' ? country : user.country,
      city: city ? city : user.city,
      zip: zipCode ? zipCode : user.zip,
      whatsapp_number: whatsappNumber ? whatsappNumber : user.whatsapp_number
    }

    try {
      const { data, status } = await mutateAsync(profileInfo)
      if (status === 200) {
        form.reset()
        setUser(data)
        Swal.fire(
          'Saved!',
          'Your profile information has been saved.',
          'success'
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=" py-10 w-full">
      <form onSubmit={handleUpdateProfile}>
        <div className="flex gap-7">
          <div className="w-full">
            <div>
              <label className="text-slate-500">Your full name</label>
              <input
                type="text"
                placeholder="Your full name"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="fullName"
                name="fullName"
                defaultValue={user.full_name}
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">Current Password</label>
              <input
                type="password"
                placeholder="Enter your current password"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="currentPassword"
                name="currentPassword"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">Phone Number</label>
              <input
                type="text"
                placeholder="+1 23456789"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={user.phone}
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">Address</label>
              <input
                type="text"
                placeholder="Street Address, P.O.Box, apartment, suit, building, floor"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="address"
                name="address"
                defaultValue={user.address}
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">State</label>
              <input
                type="text"
                placeholder="Enter state"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="state"
                name="state"
                defaultValue={user.state}
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">Country</label>
              <select
                className="select select-primary w-full mt-2 shadow-lg"
                name="country"
                id="country"
                defaultValue={user.country}
              >
                <option disabled selected>
                  Select your country
                </option>
                {countries}
              </select>
            </div>
          </div>

          <div className="w-full">
            <div>
              <label className="text-slate-500">Email Address</label>
              <input
                type="email"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="email"
                name="email"
                defaultValue={user.email}
                readOnly
              />
            </div>
            <div className="mt-4">
              <label className="text-slate-500">New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="newPassword"
                name="newPassword"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="city"
                name="city"
                defaultValue={user.city}
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">ZIP Code</label>
              <input
                type="text"
                placeholder="Enter zip code"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="zipCode"
                name="zipCode"
                defaultValue={user.zip}
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">WhatsApp</label>
              <input
                type="text"
                placeholder="Enter whatsapp number"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="whatsappNumber"
                name="whatsappNumber"
                defaultValue={user.whatsapp_number}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-8">
          <button type="submit" disabled={isLoading} className="bg-[#8633FF] flex py-3 justify-center items-center text-white capitalize rounded-lg w-72 ">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
