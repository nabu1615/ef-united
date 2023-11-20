import { User } from '@/components/User';
import { getPersonInfo, getTeams } from '@/utils/api';
import { auth, useUser } from '@clerk/nextjs';
import React, { Fragment, useEffect } from 'react'
import { currentUser, clerkClient } from '@clerk/nextjs';
import Md3List from '@/components/Md3List';
import { Match, Md3 } from '@/types/api';

const Dashboard = async () => {
    const userInfo = await currentUser();
    const email = userInfo?.emailAddresses[0]?.emailAddress;
    const user = await getPersonInfo(email!);
    const md3s = user?.team?.md3S;
    const teams = await getTeams();

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

            {teams && teams.map((team: any) => {

                if (team.id !== user.team.id) {
                    return (
                        <p key={team.id}> {team.name} </p>
                    )
                }

            })}

            {md3s && md3s.map((md3: Md3, index: number) => {
                return (
                    <Md3List key={index} md3s={md3} />
                )
            })}
        </Fragment>
    )
}

export default Dashboard;