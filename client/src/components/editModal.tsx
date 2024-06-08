import { useState } from "react"
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import {Tab} from '@headlessui/react';
// import 'react-tabs/style/react-tabs.css';


interface EditProps{
    editing: boolean,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export function EditModal({editing, setEditing} : EditProps){
    const [tab, setTab] = useState(0);

    return <div className={`edit-modal ${!editing ? 'modal-hidden' : ''}`}
        onClick={(e) => {
            if (e.currentTarget == e.target){
                setEditing(false)
                console.log('clicked')
            }
        }}
    >
        <div className="edit-modal__container">
            <div className="edit-modal__tabs-bar">
                <button onClick={() => {
                    if (tab !== 0){
                        setTab(0);
                        console.log('set');
                    }
                }}>Lookup</button>
                <button onClick={() => {
                    if (tab !== 1){
                        setTab(1);
                        console.log('set');
                    }
                }}>Search</button>
            </div>
            <div className={`edit-modal__panel ${tab === 0 ? 'active' : ''}`}>
                <div className="lookup__input-bar">
                    <input className="lookup__input" type="text" placeholder="Song Url"></input>
                    <button>Lookup</button>
                </div>
            </div>
            <div className={`edit-modal__panel ${tab === 1 ? 'active' : ''}`}>

            </div>
        </div>
    </div>
}