"use client"

import React from 'react'
import Modal from './Modal'

const CreateMd3 = () => {
    const [open, setOpen] = React.useState(false);

    return (

        <>
            <button onClick={() => setOpen(true)} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                Crear MD3
            </button>
            <Modal open={open} setOpen={setOpen} title="Crear MD3">CreateMd3</Modal>
        </>

    )
}

export default CreateMd3