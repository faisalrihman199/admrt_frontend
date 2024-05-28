import React, { useEffect } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { updateSettings, userSettings } from '../../../service/settings';
import { getProfileNameFromLocalStorage, setProfileNameToLocalStorage } from '../../../util/localStorageUtils';

const AccountSettings = () => {

    const authHeader = useAuthHeader();
    const queryClient = useQueryClient();
    const { isError, data, error } = useQuery({
        queryKey: ['userSettings', { authHeader }],
        queryFn: userSettings,
        staleTime: 5 * 60 * 1000,
    })
    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries('userSettings')

        },
        onError: () => {
            alert('Something went wrong')
        }
    });
    const { mutate, isPending } = mutation;

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            first_name: data?.full_name || '',
            phone: data?.phone || '',
            birthday: data?.birthday || '',
        },
    });


    useEffect(() => {
        if (data) {
            setValue('first_name', data?.full_name);
            setValue('phone', data?.phone);
            setValue('birthday', data?.birthday);
        }
    }, [data, setValue]);

    const onSubmit = (data) => {
        try {
            const newFullName = data.first_name;
            const oldFullName = getProfileNameFromLocalStorage();

            if (newFullName !== oldFullName) {
                setProfileNameToLocalStorage(newFullName);
            }

            mutate({
                authHeader,
                data: { full_name: data.first_name, phone: data.phone, birthday: data.birthday }
            })
        } catch (error) {
            console.error('Error updating user data:', error);

        }
    };

    return (
        <div className="w-full md:w-2/3 md:ml-8 py-8 px-3 md:px-10 border border-gray-100 bg-white p-4 rounded-2xl">
            <div className="text-start">
                <div className="mb-6">
                    <h3 className="font-bold text-xl">Account Settings</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="first_name" className="block mb-2 text-base font-medium text-gray-900 dark:text-black">Full Name / Business Name</label>
                            <input
                                {...register("first_name", { required: true })}
                                type="text"
                                id="first_name"
                                className="bg-gray-50 border px-4 py-3 text-base border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Name"
                            />
                            {errors.first_name && <p>This field is required</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-base font-medium text-gray-900 dark:text-black">Email</label>
                            <input
                                // {...register("email", { required: true })}
                                type="email"
                                id="email"
                                disabled
                                className="bg-gray-50 border border-gray-300 text-gray-900 px-4 py-3 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="example@gmail.com"
                                defaultValue={data && data?.email ? data?.email : ''}

                            />
                            {/* {errors.email && <p>This field is required</p>} */}
                        </div>
                        <div>
                            <label htmlFor="birthday" className="block mb-2 text-base font-medium text-gray-900 dark:text-black">Birthday</label>
                            <input
                                {...register("birthday")}
                                type="date"
                                id="birthday"
                                className="bg-gray-50 border border-gray-300 text-gray-900 px-4 py-3 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                            {/* {errors.birthday && <p>This field is required</p>} */}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-base font-medium text-gray-900 dark:text-black">Phone number</label>
                            <input
                                {...register("phone", { required: true })}
                                type="text" id="phone"
                                className="bg-gray-50 border border-gray-300 text-gray-900 px-4 py-3 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="123-45-678"
                            />
                            {errors.phone && <p>This field is required</p>}
                        </div>
                    </div>
                    <div className="mb-6 mt-10 py-6 text-center md:text-end">
                        <button type="submit" className="w-full md:w-64 rounded-lg py-3 bg-blue-500 text-white hover:shadow-lg font-medium font-medium text-sm md:text-base shadow-indigo-700/40 text-center">
                            {isPending ? 'Loading...' : 'Save Change'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountSettings;