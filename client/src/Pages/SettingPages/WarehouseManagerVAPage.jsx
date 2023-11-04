import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import ToastMessage from "../../Components/Shared/ToastMessage";
import { FaSpinner } from "react-icons/fa";
import SearchDropdown from "../../Utilities/SearchDropdown";

const WarehouseManagerVAPage = () => {
    const { user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [warehouseAdminOption, setWarehouseAdminOption] = useState(null)

    const { data: allWarehouseAdmin = [] } = useQuery({
        queryKey: ['get_all_warehouse_admin'],
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/v1/warehouse_admin_api/get_all_warehouse_admin?id=${user.admin_id}`)
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

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: (warehouseManagerVA) => {
            return axios.post('/api/v1/warehouse_manager_va_api/create_warehouse_manager_va', warehouseManagerVA)
        },
    })

    const handleCreateWarehouseManagerVA = async (event) => {
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

        if (user.role !== 'Warehouse Admin' && !warehouseAdminOption) {
            return setErrorMessage('Please select warehouse admin')
        }

        const warehouseManagerVA = {
            admin_id: user.admin_id, creator_email: user?.email, warehouse_manager_va_id: uuidv4(), full_name: name, email, username, password, role: 'Warehouse Manager VA',
            warehouse_admin_id: user.role === 'Warehouse Admin' ? user.warehouse_admin_id : warehouseAdminOption.warehouse_admin_id,
            warehouse_id: user.role === 'Warehouse Admin' ? user.warehouse_id : warehouseAdminOption.value
        }

        try {
            const { status } = await mutateAsync(warehouseManagerVA)
            if (status === 201) {
                form.reset()
                setWarehouseAdminOption(null)
                setSuccessMessage(`Successfully created a new warehouse manager VA and sent an invitation mail to ${email} with login credentials`)
            }
            else if (status === 200) {
                setSuccessMessage('')
                setErrorMessage('Email already exist!')
            }
        } catch (error) {
            setSuccessMessage('')
            setErrorMessage('Failed to create new warehouse manager VA!')
            console.log(error)
        }
    }

    return (
        <div>
            <div className="py-10 ">
                <h3 className="text-2xl font-bold text-center">
                    Add New Warehouse Manager VA
                </h3>
                <form onSubmit={handleCreateWarehouseManagerVA}>
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
                                    placeholder="Enter owner email"
                                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                                    id="email"
                                    name="email"
                                    required
                                />
                            </div>
                            <div className="mt-3">
                                <label className="text-slate-500">Confirm Password*</label>
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
                                    <label className="text-slate-500">Warehouse Admin</label>
                                    <SearchDropdown isMulti={false} option={warehouseAdminOption} optionData={allWarehouseAdmin} placeholder="Select warehouse admin" setOption={setWarehouseAdminOption} />
                                </div> : ''
                            }
                        </div>
                    </div>

                    <ToastMessage successMessage={successMessage} errorMessage={errorMessage} />

                    <div className="flex justify-center">
                        <button type="submit" disabled={isLoading} className="flex gap-2 items-center justify-center bg-[#8633FF] px-36 w-fit mt-8 py-3 rounded-md text-white">
                            {isLoading && <FaSpinner size={20} className="animate-spin" />}
                            <p>Create Warehouse Manager VA</p>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WarehouseManagerVAPage;