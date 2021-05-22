import React from 'react'
import '../styles/person-tile.css'

interface Props {
    name: string;
    gender: string;
}

export const Person: React.FC<Props> = ({name,gender}) => {
   
    return(
        <div className={`person-tile person-tile--${gender}`}>
            {name}
        </div>
    )
}