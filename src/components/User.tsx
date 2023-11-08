import React from 'react'

export const User = ({ user }: { user: any }) => {
    return (
        <div>
            <p className='text-center mb-5'>
                {user.team.name}
            </p>
            {user.team?.image?.url && <img width={100} height={100} src={user.team.image.url} alt="AJX" />}
        </div>
    )
}
