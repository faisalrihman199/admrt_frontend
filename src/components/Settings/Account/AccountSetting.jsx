import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useForm } from 'react-hook-form';
import { updateProfile } from '../../../service/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

const AccountSettings = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const authHeader = useAuthHeader();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries('loggedInUser')

        },
    });
    const onSubmit = (data) => {
        try {
            console.log(data);

            mutation.mutate({
                authHeader,
                data: { full_name: data.first_name, phone: data.phone }
            })
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Something Went wrong');
        }
    };
    const authUser = useAuthUser();

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
                                defaultValue={authUser && authUser?.full_name ? authUser?.full_name : ''}
                            />
                            {errors.first_name && <p>This field is required</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-base font-medium text-gray-900 dark:text-black">Email</label>
                            <input
                                // {...register("email", { required: true })}
                                type="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 px-4 py-3 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="example@gmail.com"
                                defaultValue={authUser && authUser?.email ? authUser?.email : ''}

                            />
                            {errors.email && <p>This field is required</p>}
                        </div>
                        <div>
                            <label htmlFor="birthday" className="block mb-2 text-base font-medium text-gray-900 dark:text-black">Birthday</label>
                            <input
                                // {...register("birthday", { required: true })}
                                type="date" id="birthday" className="bg-gray-50 border border-gray-300 text-gray-900 px-4 py-3 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            {errors.birthday && <p>This field is required</p>}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-base font-medium text-gray-900 dark:text-black">Phone number</label>
                            <input
                                {...register("phone", { required: true, pattern: /^[0-9]{8}$/ })}
                                type="tel" id="phone"
                                className="bg-gray-50 border border-gray-300 text-gray-900 px-4 py-3 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="123-45-678"
                                defaultValue={authUser && authUser?.phone ? authUser?.phone : ''}
                            />
                            {errors.phone && <p>This field is required</p>}
                        </div>
                    </div>
                    <div className="mb-6 mt-10 py-6 text-center md:text-end">
                        <button type="submit" className="w-full md:w-64 rounded-lg py-3 bg-blue-500 text-white hover:shadow-lg font-medium font-medium text-sm md:text-base shadow-indigo-700/40 text-center">Save Change</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountSettings;