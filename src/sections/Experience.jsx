import React from 'react'
import {Canvas} from "@react-three/fiber";
import {workExperiences} from "../constants/index.js";

const Experience = () => {
    return (
        <section className="c-space my-20" id="work">
            <div className="w-full text-white-600">
                <h3 className="head-text"> My Work Experience</h3>
                <div className="h-full w-full gab-5 mt-12">
                    <div className="work-content">
                        <div>
                            {workExperiences.map(({id, name, pos, duration, title, animation, icon}) => (
                                <div key={id} className="work-content_container group">
                                    <div className="flex flex-col h-full justify-start items-center py-2">
                                        <div className="work-content_logo">
                                                <img src={icon} alt="logo" className="w-full h-full"/>
                                        </div>
                                        <div className="work-content_bar"/>
                                    </div>
                                    <div className = "sm:p-5 px-2.5 py-5">
                                        <p className = "font-bold text-white-800">{name}</p>
                                        <p className="text-sm mb-5">{pos} -- {duration}</p>
                                        <p className="group-hover:text-white  transition ease-in-out duration-500">{title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Experience
