import React from 'react'
import { useRouter } from 'next/router'

export default function SalesDashboard() {
    const showroomName = "Galleria Mall Showroom"
    const visitors = 20
    const calls = 1
    const visitorsRecent = 4
    const boughtOTC = 10
    const quotesAsked = 5

    const router = useRouter()
    function BOQHandler() {
        //transfer firebase data of client to BOQ 
        router.push('/success')
    }

    return (
        <div>
            <p className='mt-4 text-3xl text-center'>{showroomName}</p>
            <div className='flex flex-row p-24 items-center justify-center gap-24'>
                <div className='flex flex-col text-xl gap-8'>
                    <p className='text-center'>{visitors} Visitors today</p>
                    <p className='text-center'>{calls} Called</p>
                    <p className='text-center'>{visitorsRecent} just visited</p>
                    <p className='text-center'>{boughtOTC} Bought OTC</p>
                    <p className='text-center'>{quotesAsked} asked for Quotes</p>
                </div>
                <div className='flex flex-col text-xl gap-4'>
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full max-w-[25vw]'>
                        Invocing
                    </button>
                    <button onClick={BOQHandler}
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full max-w-[25vw]'>
                        Send Information to BOQ
                    </button>
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full max-w-[25vw]'>
                        Check Client History
                    </button>
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full max-w-[25vw]'>
                        Reports
                    </button>
                    <button
                        className='bg-slate-300 hover:bg-slate-400 p-2 w-full max-w-[25vw]'>
                        Upload Order
                    </button>
                </div>

            </div>
        </div>
    )
}