import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading.jsx'

const ViewApplications = () => {

    const { backendUrl, companyToken } = useContext(AppContext)

    const [applicants, setApplicants] = useState(null)

    // 🔥 Fetch Applicants
    const fetchCompanyJobApplicants = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/company/applicants',
                { headers: { token: companyToken } }
            )


            if (data.success) {
                // ✅ SAFE reverse (no undefined error)
                setApplicants((data.applications || []).reverse())
            } else {
                toast.error(data.message)
                setApplicants([])
            }

        } catch (error) {
            toast.error(error.message)
            setApplicants([])
        }
    }

    // Function to update application status
    const changeJobApplicationStatus = async (id, status) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/company/change-status',
                { id, status },
                { headers: { token: companyToken } }
            )

            if (data.success) {
                fetchCompanyJobApplicants()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (companyToken) {
            fetchCompanyJobApplicants()
        }
    }, [companyToken])


    // 🔥 Loading state
    if (applicants === null) return <Loading />

    // 🔥 No Data state
    if (applicants.length === 0) {
        return (
            <div className='flex items-center justify-center h-[70vh]'>
                <p className='text-xl sm:text-2xl'>No Applications Available</p>
            </div>
        )
    }

    return (
        <div className='container p-4 mx-auto'>

            <table className='w-full max-w-5xl bg-white border border-gray-200 max-sm:text-sm'>

                <thead>
                    <tr className='border-b bg-gray-50'>
                        <th className='py-2 px-4 text-left'>#</th>
                        <th className='py-2 px-4 text-left'>User</th>
                        <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
                        <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
                        <th className='py-2 px-4 text-left'>Resume</th>
                        <th className='py-2 px-4 text-left'>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {(applicants || [])
                        .filter(item => item.jobId && item.userId)
                        .map((applicant, index) => (
                            <tr key={index} className='text-gray-700'>

                                <td className='py-2 px-4 border-b text-center'>
                                    {index + 1}
                                </td>

                                <td className='py-2 px-4 border-b flex items-center gap-3'>
                                    <img
                                        className='w-10 h-10 rounded-full max-sm:hidden'
                                        src={applicant.userId?.image}
                                        alt=""
                                    />
                                    <span>{applicant.userId?.name}</span>
                                </td>

                                <td className='py-2 px-4 border-b max-sm:hidden'>
                                    {applicant.jobId?.title}
                                </td>

                                <td className='py-2 px-4 border-b max-sm:hidden'>
                                    {applicant.jobId?.location}
                                </td>

                                <td className='py-2 px-4 border-b'>
                                    <a
                                        href={applicant.userId?.resume}
                                        target='_blank'
                                        rel="noreferrer"
                                        className='bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex items-center gap-2'
                                    >
                                        Resume
                                        <img src={assets.resume_download_icon} alt="" />
                                    </a>
                                </td>

                                <td className='py-2 px-4 border-b relative'>
                                    {applicant.status === 'pending'
                                        ? <div className='relative inline-block text-left group cursor-pointer'>
                                            <button className='text-gray-500'>...</button>

                                            <div className='absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 right-0 mt-2 w-32 bg-white border rounded shadow z-50'>
                                                <button onClick={() => changeJobApplicationStatus(applicant._id, "Accepted")} className='block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100'>
                                                    Accept
                                                </button>
                                                <button onClick={() => changeJobApplicationStatus(applicant._id, "Rejected")} className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                        : <div>{applicant.status}</div>
                                    }


                                </td>

                            </tr>
                        ))}
                </tbody>
            </table>

        </div>
    )
}

export default ViewApplications