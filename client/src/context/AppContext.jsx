/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useState, useEffect } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    // --- Load saved filter from localStorage ---
    const [searchFilter, setSearchFilter] = useState(() => {
        const saved = localStorage.getItem("searchFilter");
        return saved ? JSON.parse(saved) : { title: '', location: '' };
    });

    const [isSearched, setIsSearched] = useState(() => {
        const saved = localStorage.getItem("isSearched");
        return saved ? JSON.parse(saved) : false;
    });

    // --- Save to localStorage whenever state changes ---
    useEffect(() => {
        localStorage.setItem("searchFilter", JSON.stringify(searchFilter));
    }, [searchFilter]);

    useEffect(() => {
        localStorage.setItem("isSearched", JSON.stringify(isSearched));
    }, [isSearched]);

    const [ jobs, setJobs ] = useState([]);

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);


    //  Function to fetch jobs

    const fetchJobs = async () => {
        setJobs(jobsData)
    }

    useEffect(()=>{
        fetchJobs();
    },[])

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
