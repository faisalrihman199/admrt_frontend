import React, { useEffect, useState } from 'react';
import ShowMoreText from 'react-show-more-text';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const Description = () => {
    const { userUID } = useParams();
    const [description, setDescription] = useState(null);

    useEffect(() =>{
        const fetchUserData = async () => {
            try{
                const userDoc = await getDoc(doc(db, 'users', userUID));
                if(userDoc.exists()) {
                    const userData = userDoc.data();
                    setDescription(userData.introDescription);
                }
            }catch(err) {
                console.log(err);
            }
        }

        fetchUserData();
    }, [userUID])

    return (
        <div>
            <div className="">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-semibold">Intro Description</h1>
                </div>
                <div className="items overflow-hidden w-full break-words">
                    <ShowMoreText lines={3} more="more" less="less" className="content-css">
                        {description ? (
                            <div>{description}</div>
                        ) : (
                            <p>No description available</p>
                        )}
                    </ShowMoreText>
                </div>
            </div>
        </div>
    );
};

export default Description;