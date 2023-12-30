import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import ToastMessage from "../../Components/Shared/ToastMessage";
import { FaSpinner } from "react-icons/fa";
import SearchDropdown from "../../Utilities/SearchDropdown";

const StoreManagerVAPage = () => {
    const { user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [storeOption, setStoreOption] = useState(null)
    const [storeManagerOption, setStoreManagerOption] = useState(null)

    const { data: allStoreManager = [], isLoading: storeManagerLoading } = useQuery({
        queryKey: ['get_all_store_manager'],
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/v1/store_manager_admin_api/get_all_store_manager_admin?id=${user.admin_id}`)
                if (res.status === 200) {
                    return res.data.data;
                }
                return [];
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    })

    const { data: allStoreData = [], isLoading: storeLoading } = useQuery({
        queryKey: ['get_all_stores_data'],
        queryFn: async () => {
            try {
                const res = await axios.post('/api/v1/store_api/get_stores_dropdown_data', { user })
                if (res.status === 200) {
                    return res.data.data;
                }
                return [];
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    })

    const storeAccessIds = storeManagerOption?.data?.filter(storeManager => storeManager._id === storeManagerOption.value)[0]?.store_access_ids;
    const filteredStoreData = allStoreData.filter(store => storeAccessIds?.includes(store.value));
    const storeIDS = []
    storeOption?.map(store => storeIDS.push(store.value))

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: (storeManagerVA) => {
            return axios.post('/api/v1/store_manager_va_api/create_store_manager_va', storeManagerVA)
        },
    })

    const handleCreateStoreManagerVA = async (event) => {
        event.preventDefault()
        setErrorMessage('')
        setSuccessMessage('')

        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const username = form.username.value;

        if (password !== confirmPassword) {
            return setErrorMessage('Password and confirm password must be same!')
        }

        if (password.length < 6) {
            return setErrorMessage("Password must be at least 6 characters or longer!")
        }

        if (!storeOption?.length) {
            return setErrorMessage('Please select store')
        }

        const storeManagerVA = {
            admin_id: user.admin_id, creator_email: user?.email, store_manager_va_id: uuidv4(),
             store_manager_admin_id: user.role === "Store Manager Admin" ? user.store_manager_admin_id : storeManagerOption?.store_manager_admin_id,
            store_access_ids: storeIDS, full_name: name, email, username, password, role: 'Store Manager VA'
        }

        try {
            const { status } = await mutateAsync(storeManagerVA)
            if (status === 201) {
                form.reset()
                setStoreOption(null)
                setStoreManagerOption(null)
                setSuccessMessage(`Successfully created a new store manager VA and sent an invitation mail to ${email} with login credentials`)
            }
            else if (status === 200) {
                setSuccessMessage('')
                setErrorMessage('Email already exist!')
            }
        } catch (error) {
            setSuccessMessage('')
            setErrorMessage('Failed to create new store manager VA!')
            console.log(error)
        }
    }

    return (
        <div className="py-10 ">
            <h3 className="text-2xl font-bold text-center">Add New Store Manager VA</h3>
            <form onSubmit={handleCreateStoreManagerVA}>
                <div className="flex gap-4 w-full mt-5">
                    <div className="w-1/2">
                        <div className="mt-3">
                            <label className="text-slate-500">Name*</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                id="name"
                                name="name"
                                required
                            />
                        </div>
                        <div className="mt-3">
                            <label className="text-slate-500">Email*</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                id="email"
                                name="email"
                                required
                            />
                        </div>
                        <div className="mt-3">
                            <label className="text-slate-500">Confirm password*</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                            />
                        </div>
                    </div>

                    <div className="w-1/2">
                        <div className="mt-3">
                            <label className="text-slate-500">Username*</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                id="username"
                                name="username"
                                required
                            />
                        </div>
                        <div className="mt-3">
                            <label className="text-slate-500">Password*</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                id="password"
                                name="password"
                                required
                            />
                        </div>
                        {
                            user.role === 'Admin' || user.role === 'Admin VA' ? <div className="mt-3">
                                <label className="text-slate-500">Store Manager Admin</label>
                                <SearchDropdown isLoading={storeManagerLoading} isMulti={false} option={storeManagerOption} optionData={allStoreManager} placeholder="Select" setOption={setStoreManagerOption} />
                            </div> : <div className="mt-3">
                                <label className="text-slate-500">Select Store</label>
                                <SearchDropdown isLoading={storeLoading} isMulti={true} option={storeOption} optionData={allStoreData} placeholder="Select Store" setOption={setStoreOption} />
                            </div>
                        }
                    </div>
                </div>

                {
                    user.role === 'Admin' || user.role === 'Admin VA' ? <div className="mt-3">
                        <label className="text-slate-500">Select Store</label>
                        <SearchDropdown isLoading={storeLoading} isMulti={true} option={storeOption} optionData={filteredStoreData} placeholder="Select Store" setOption={setStoreOption} />
                    </div> : ''
                }

                <ToastMessage successMessage={successMessage} errorMessage={errorMessage} />

                <div className="flex justify-center">
                    <button type="submit" disabled={isLoading} className="flex gap-2 items-center justify-center bg-[#8633FF] px-36 w-fit mt-8 py-3 rounded-md text-white">
                        {isLoading && <FaSpinner size={20} className="animate-spin" />}
                        <p>Create Store Manager VA</p>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StoreManagerVAPage;