import React, { useState, useEffect } from 'react'
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'


function SendInfoBOQ() {

    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')

    const [loading, setLoading] = useState(true)

    const [clientRequests, setClientRequests] = useState([])
    const [originalClientRequests, setOriginalClientRequests] = useState([])

    const router = useRouter()

    useEffect(() => {
        const fetch = onSnapshot(collection(db, 'clients'), (snapshot) => {
            var requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            requests = requests.filter((clientRequest) => clientRequest.showroom === showroomName)
            requests = requests.filter((clientRequest) => clientRequest.option === 'measurement')
            requests.forEach((clientRequest) => {
                clientRequest.aspects = clientRequest.aspects.join(',')
                clientRequest.date = clientRequest.date
            })
            setClientRequests(requests)
            setOriginalClientRequests(requests)
            setLoading(false)
        })

        return fetch
    }, [])

    return (
        <div>
            {!loading && (
                <div>
                    <div className='w-full pl-8'>
                        <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => router.back()}>
                            Go Back
                        </button>
                    </div>
                    <p className='mt-2 text-2xl text-center font-bold mb-4'>
                        Send Client Information to BOQ
                    </p>
                    {/* <p className='mt-8 text-xl mb-4 text-center font-bold'>Upload Invoice</p> */}
                    {clientRequests.map((clientRequest) => (
                        <div key={clientRequest.id} className='items-center sm:mx-24 grid grid-cols-4 gap-x-12 mb-4'>
                            <p className='text-lg'>{clientRequest.name} (<span>{clientRequest.clientId}</span>)</p>
                            <button className="bg-green-400 hover:bg-green-500 p-2">
                                Send to BOQ
                            </button>
                            <button className="bg-red-400 hover:bg-red-500 p-2">
                                Delete Request
                            </button>
                            <button className="bg-green-400 hover:bg-green-500 p-2">
                                Check Info
                            </button>
                        </div>
                    ))
                    }


                </div>
            )}
        </div>
    )
}

export default SendInfoBOQ