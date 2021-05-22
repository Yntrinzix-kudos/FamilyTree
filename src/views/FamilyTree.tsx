import React, {useState,useEffect} from 'react';
import arrayEquals from '../helpers/test-equal-array';
import familyTree from '../data';
import {Person} from '../components/Person';
import '../styles/global.css'

export const FamilyTree: React.FC = () => {
    const DATA = familyTree
    let [peopleData, setPeopleData] = useState<IpeopleData[]>(() => []);

    interface IpeopleData {
        id: number,
        name: string,
        gender: string,
        children: number[],
        parents: number[],
        spouse?: IpeopleData,
        ancestor?: boolean
    }

    useEffect(() => {
        setPeopleData(personLists(familyTree))
    }, []);

    const personLists = (data: IpeopleData[]):IpeopleData[] => {
        let foundSpouseList: number[]  = [];
        let personData: IpeopleData[] = [];

        data.forEach((person) => {
            
            let hasChildren = person.children.length > 0;
            let isNotTheSamePerson = !foundSpouseList.some(el => el === person.id);
            let spouse:IpeopleData | undefined = findSpouse(person, data);
            let isAncestor = checkIfAncestor(person,spouse);

            if(hasChildren && isNotTheSamePerson){
                
                foundSpouseList.push(spouse.id);
                personData.push(personSchema(person,spouse,isAncestor));
            }else if(!hasChildren){
                personData.push(personSchema(person,undefined,isAncestor));
            }

        })

        return personData
    }

    const checkIfAncestor = (parent1:IpeopleData, parent2:IpeopleData):boolean => parent1.parents.length === 0 && parent2.parents.length === 0;

    const findSpouse = (person: IpeopleData, data: IpeopleData[]): IpeopleData => {
        let foundSpouse: IpeopleData = data.find( spouse => 
            spouse.id != person.id ? arrayEquals(spouse.children.sort(),person.children.sort()) : null
        )!;
        
        return foundSpouse
    }

    const findPerson = (id: number, data: IpeopleData[]):IpeopleData => data.find( person => person.id === id)!;

    interface TreeNodeProps {
        data: IpeopleData;
    }
    const TreeNode:React.FC<TreeNodeProps> = ({data}) => {
        
        let {name, gender, children, spouse} = data
        
        return(
            <div>
                <div className='parents'>
                    
                <Person name={name} gender={gender}/>
                {
                    spouse ? <Person name={spouse.name} gender={spouse.gender}/>: <></>
                }
                </div>
                <div className='children'>
                {
                    children ? children.map((child, i) =>{
                        
                        if(child){
                            let childData = findPerson(child,peopleData);
                            return(
                                childData ? <TreeNode key={`${child}`} data={childData}/> : <div key={`${child}`}></div>
                            )
                        }
                        
                    }) : <></>
                }
                </div>
            </div>
        )
    }

    const personSchema = (person: IpeopleData,spouse: IpeopleData | undefined,ancestor: boolean): IpeopleData => {
        
        const peopleData = {
            id: person.id,
            name: person.name,
            gender: person.gender,
            children: person.children,
            parents: person.parents,
            spouse: spouse,
            ancestor: ancestor
        }

        return peopleData;
    }

    return(
        <div>
            {
                peopleData.map((parentPeople, i) => {
                    return(
                        
                        parentPeople.ancestor ? <TreeNode key={`TreeNode-${i}`} data={parentPeople} /> : <div key={`TreeNode-${i}`}></div>
                    )
                })
            }
        </div>
    )
}