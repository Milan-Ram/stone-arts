import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db, storage } from '../../firebase'
import { collection, onSnapshot, doc, setDocs, setDoc, docRef, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';


export default function PendingClientDesigns() {

    const router = useRouter()

    const [designs, setDesigns] = useState([
    ]);

    const params = useSearchParams();
    const dbName = params.get('param');

    useEffect(() => {
        const designsRef = collection(db, dbName);
        const designsSnapshot = onSnapshot(designsRef, (snapshot) => {
            const designsList = snapshot.docs.map(
                (doc) => ({ ...doc.data(), id: doc.id })
            );
            designsList.forEach(design => design.infoChecked = false);
            setDesigns(designsList);
        });
    }, []);

    const handleCheckInfo = (designId) => {
        const updatedDesigns = designs.map(design => {
            if (design.id === designId) {
                return { ...design, infoChecked: true };
            }
            return design;
        });
        setDesigns(updatedDesigns);
    };

    const [downloadURLs, setDownloadURLs] = useState({})
    const handleUploadDesign = async (designId, event) => {
        const file = event.target.files[0];
        try {
            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `designs/${designId}`)
            await uploadBytes(storageRef, file);

            // Get the download URL for the uploaded file
            const downloadURL = await getDownloadURL(storageRef);
            setDownloadURLs((prevDownloadURLs) => ({
                ...prevDownloadURLs,
                [designId]: downloadURL,
            }));
        } catch (error) {
            console.log(error);
            alert(`File for client could not be uploaded.`);
        }
    };

    async function handleClientApproval(designId) {
        const designData = designs.find(design => design.id === designId);
        await setDoc(doc(db, "completed-designs", designId), designData);
        await deleteDoc(doc(db, dbName, designId));
        alert(`Project ${designId} got approved by Client`);
    }

    const handleCheckDesign = async (designId) => {
        const designData = designs.find(design => design.id === designId);
        window.open(designData.downloadURL)
    }

    return (
        <div>
            <div className='w-full px-8 flex flex-row justify-between'>
                <button className='bg-slate-300 p-2 rounded-lg'
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-12 my-4'>
                <p className='my-4 text-3xl text-center'>Designs Pending Client Approval</p>
            </div>
            <div className='flex flex-col gap-4 mt-8 items-center' >
                {designs.map((design) => (
                    <div key={design["id"]} className='grid grid-cols-4 gap-4 items-center'>
                        <p
                            className=' text-center'>
                            {design["name"]} - {design["id"]} :
                        </p>
                        <button
                            onClick={() => handleCheckDesign(design.id)} // Attach onClick event here
                            className='bg-green-400 p-2 rounded-lg text-center'>
                            Check Design
                        </button>
                        <button
                            onClick={() => handleClientApproval(design.id)} // Attach onClick event here
                            className='bg-green-400 p-2 rounded-lg text-center'>
                            Client Approved
                        </button>

                        <Link
                            href={{
                                pathname: '/RequestDetails',
                                query: { id: design["id"] },
                            }}
                            className='bg-green-400 p-2 rounded-lg text-center'
                            target='_blank'>
                            <button
                                onClick={() => handleCheckInfo(design.id)} // Attach onClick event here
                            >
                                Check Info
                            </button>
                        </Link>
                    </div>

                ))}
            </div>
        </div>
    )
}
