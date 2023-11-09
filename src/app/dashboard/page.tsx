import { User } from '@/components/User';
import { getPersonInfo } from '@/utils/api';
import { auth, useUser } from '@clerk/nextjs';
import React, { Fragment, useEffect } from 'react'
import { currentUser, clerkClient } from '@clerk/nextjs';
import Md3List from '@/components/Md3List';
import { Match, Md3 } from '@/types/api';

async function getPerson() {
    const endpoint = process.env.HYGRAPH_ENDPOINT || '';

    try {

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
          query Person {
            people {
              id
              name
            }
          }
          `,
            }),
        });
        const json = await response.json();

        return json;
    } catch (error) {
        return error
    }


}

const Dashboard = async () => {
    const userInfo = await currentUser();
    const email = userInfo?.emailAddresses[0]?.emailAddress;
    const user = await getPersonInfo(email!);
    const md3s = user?.team?.md3S;

    console.log(md3s)

    if (!user) {
        return (
            <div>Person not found</div>
        )
    }

    return (
        <Fragment>
            <div className='my-2'>Bievenido</div>
            <User user={user} />
            <h2 className='my-4 font-bold'>Ultimos MD3</h2>
            {md3s && md3s.map((md3: Md3, index: number) => {
                return (
                    <Md3List key={index} md3s={md3} />
                )
            })}
        </Fragment>
    )
}

export default Dashboard;