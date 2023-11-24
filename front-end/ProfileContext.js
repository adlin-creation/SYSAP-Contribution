import React from 'react';

const ProfileContext = React.createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = React.useState({
        name: '',
        programName: ''
    });

    const updateProfile = async (profile) => {
        try {
            const updatedProfile = profile;
            setProfile(updatedProfile);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};


export default ProfileContext;
