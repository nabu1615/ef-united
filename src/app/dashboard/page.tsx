import { User } from '@/components/User';
import { getPersonInfo } from '@/utils/api';
import { auth, useUser } from '@clerk/nextjs';
import React, { Fragment, useEffect } from 'react'
import { currentUser, clerkClient } from '@clerk/nextjs';

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

    if (!user) {
        return (
            <div>Person not found</div>
        )
    }

    return (
        <Fragment>
            <div className='my-2'>Bievenido</div>
            <User user={user} />
        </Fragment>
    )
}

export default Dashboard;